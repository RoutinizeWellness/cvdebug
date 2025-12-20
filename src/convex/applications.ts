import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

const internalAny = require("./_generated/api").internal;

export const createApplication = mutation({
  args: {
    projectId: v.id("projects"),
    companyName: v.string(),
    jobTitle: v.string(),
    jobDescriptionText: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Project not found or unauthorized");
    }

    const applicationId = await ctx.db.insert("applications", {
      projectId: args.projectId,
      userId: identity.subject,
      companyName: args.companyName,
      jobTitle: args.jobTitle,
      jobDescriptionText: args.jobDescriptionText,
      jobUrl: args.jobUrl,
      notes: args.notes,
      status: "draft",
    });

    // Schedule keyword gap analysis if JD provided
    if (args.jobDescriptionText && project.masterCvId) {
      await ctx.scheduler.runAfter(0, internalAny.applications.analyzeKeywordGap, {
        applicationId,
        resumeId: project.masterCvId,
        jobDescription: args.jobDescriptionText,
      });
    }

    return applicationId;
  },
});

export const analyzeKeywordGap = internalMutation({
  args: {
    applicationId: v.id("applications"),
    resumeId: v.id("resumes"),
    jobDescription: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || !resume.ocrText) return;

    const resumeText = resume.ocrText.toLowerCase();
    const jdText = args.jobDescription.toLowerCase();

    // Extract keywords from JD (simple word frequency)
    const jdWords = jdText.match(/\b[a-z]{3,}\b/g) || [];
    const wordFreq: Record<string, number> = {};
    jdWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Find missing keywords (appear in JD but not in resume)
    const missingKeywords: string[] = [];
    const matchedKeywords: string[] = [];

    Object.entries(wordFreq)
      .filter(([_, freq]) => freq >= 2) // Only keywords mentioned 2+ times
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 20)
      .forEach(([word]) => {
        if (!resumeText.includes(word)) {
          missingKeywords.push(word);
        } else {
          matchedKeywords.push(word);
        }
      });

    // Calculate match score
    const totalKeywords = missingKeywords.length + matchedKeywords.length;
    const matchScore = totalKeywords > 0 
      ? Math.round((matchedKeywords.length / totalKeywords) * 100)
      : 0;

    await ctx.db.patch(args.applicationId, {
      missingKeywords,
      matchedKeywords,
      matchScore,
    });
  },
});

export const getApplicationsByProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("applications")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
  },
});

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("draft"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
    appliedDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity || application.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      appliedDate: args.appliedDate || (args.status === "applied" ? Date.now() : undefined),
    });
  },
});
