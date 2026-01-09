import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { getCurrentUser } from "./users";
import { calculateKeywordScore } from "./ai/scoring/keywordScoring";
import { RoleCategory } from "./ai/config/keywords";

export const createApplication = mutation({
  args: {
    projectId: v.id("projects"),
    companyName: v.string(),
    jobTitle: v.string(),
    jobDescriptionText: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user.dbUser) throw new Error("Unauthorized");
    const dbUser = user.dbUser;

    // ENFORCEMENT: Project Tracker (CRM) is locked for Free/Single Scan users
    // Only Interview Sprint users can create applications
    const hasActiveSprint = dbUser.sprintExpiresAt && dbUser.sprintExpiresAt > Date.now();
    if (!hasActiveSprint && dbUser.subscriptionTier !== "interview_sprint") {
      throw new Error("PLAN_RESTRICTION: Upgrade to Interview Sprint to track applications.");
    }

    // Find the resume for this project to perform initial analysis
    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .collect();
    
    // Use the most recent resume for this project
    resumes.sort((a, b) => b._creationTime - a._creationTime);
    const resume = resumes[0];

    let matchedKeywords: string[] = [];
    let missingKeywords: string[] = [];
    let matchScore = 0;

    if (resume) {
      // If we have both OCR text and a Job Description, use the advanced scoring algorithm
      if (args.jobDescriptionText && resume.ocrText) {
        const analysis = calculateKeywordScore(
          resume.ocrText,
          (resume.category as RoleCategory) || "General",
          args.jobDescriptionText
        );
        
        matchedKeywords = analysis.matchedKeywords;
        missingKeywords = analysis.missingKeywords.map(k => k.keyword);
        
        // Calculate match score based on coverage of JD keywords
        const totalKeywords = analysis.foundKeywords.length + analysis.missingKeywords.length;
        if (totalKeywords > 0) {
           matchScore = Math.round((analysis.foundKeywords.length / totalKeywords) * 100);
        }
      } else {
        // Fallback: No JD or no OCR text, use existing resume analysis data
        const resumeMatchedKeywords = resume.matchedKeywords || [];
        const resumeMissingKeywords = resume.missingKeywords || [];

        if (args.jobDescriptionText) {
          const jdText = args.jobDescriptionText.toLowerCase();
          
          // Find which resume keywords appear in the JD
          matchedKeywords = resumeMatchedKeywords.filter(kw => 
            jdText.includes(kw.toLowerCase())
          );
          
          // Find which missing keywords from resume are in the JD (critical gaps)
          missingKeywords = resumeMissingKeywords
            .filter(kw => {
              const keyword = typeof kw === 'string' ? kw : kw.keyword;
              return jdText.includes(keyword.toLowerCase());
            })
            .map(kw => typeof kw === 'string' ? kw : kw.keyword);
        } else {
          // No JD, just use resume data as fallback (top 10)
          matchedKeywords = resumeMatchedKeywords.slice(0, 10);
          missingKeywords = resumeMissingKeywords
            .slice(0, 10)
            .map(kw => typeof kw === 'string' ? kw : kw.keyword);
        }

        // Calculate initial score
        const total = matchedKeywords.length + missingKeywords.length;
        if (total > 0) {
          matchScore = Math.round((matchedKeywords.length / total) * 100);
        }
      }
    }

    const applicationId = await ctx.db.insert("applications", {
      projectId: args.projectId,
      userId: user._id,
      companyName: args.companyName,
      jobTitle: args.jobTitle,
      jobDescriptionText: args.jobDescriptionText,
      jobUrl: args.jobUrl,
      status: "draft",
      missingKeywords,
      matchedKeywords,
      matchScore,
      lastStatusUpdate: Date.now(),
      events: [{
        type: "created",
        title: "Application Created",
        description: `Started tracking application for ${args.jobTitle} at ${args.companyName}`,
        timestamp: Date.now(),
      }],
    });

    return applicationId;
  },
});

export const analyzeApplicationKeywords = mutation({
  args: {
    applicationId: v.id("applications"),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user.dbUser) throw new Error("Unauthorized");
    const dbUser = user.dbUser;

    // ENFORCEMENT: AI Tools are locked for Free/Single Scan users
    const hasActiveSprint = dbUser.sprintExpiresAt && dbUser.sprintExpiresAt > Date.now();
    if (!hasActiveSprint && dbUser.subscriptionTier !== "interview_sprint") {
      throw new Error("PLAN_RESTRICTION: Upgrade to Interview Sprint to use Keyword Sniper.");
    }

    const application = await ctx.db.get(args.applicationId);
    const resume = await ctx.db.get(args.resumeId);

    if (!application || !resume) {
      throw new Error("Application or resume not found");
    }

    if (application.userId !== user._id) throw new Error("Unauthorized");

    let matchedKeywords: string[] = [];
    let missingKeywords: string[] = [];

    // Use advanced scoring if we have JD and OCR text
    if (application.jobDescriptionText && resume.ocrText) {
      const analysis = calculateKeywordScore(
        resume.ocrText,
        (resume.category as RoleCategory) || "General",
        application.jobDescriptionText
      );
      
      matchedKeywords = analysis.matchedKeywords;
      missingKeywords = analysis.missingKeywords.map(k => k.keyword);
    } else {
      // Fallback logic
      const resumeMatchedKeywords = resume.matchedKeywords || [];
      const resumeMissingKeywords = resume.missingKeywords || [];

      if (application.jobDescriptionText) {
        const jdText = application.jobDescriptionText.toLowerCase();
        
        matchedKeywords = resumeMatchedKeywords.filter(kw => 
          jdText.includes(kw.toLowerCase())
        );
        
        missingKeywords = resumeMissingKeywords
          .filter(kw => {
            const keyword = typeof kw === 'string' ? kw : kw.keyword;
            return jdText.includes(keyword.toLowerCase());
          })
          .map(kw => typeof kw === 'string' ? kw : kw.keyword);
      } else {
        matchedKeywords = resumeMatchedKeywords.slice(0, 10);
        missingKeywords = resumeMissingKeywords
          .slice(0, 10)
          .map(kw => typeof kw === 'string' ? kw : kw.keyword);
      }
    }

    await ctx.db.patch(args.applicationId, {
      matchedKeywords,
      missingKeywords,
    });

    return { success: true };
  },
});

export const getApplicationsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return applications.map(app => {
      let matchScore = (app as any).matchScore || 0;
      
      // Calculate match score dynamically if not present
      if (!matchScore) {
        const matched = app.matchedKeywords?.length || 0;
        const missing = app.missingKeywords?.length || 0;
        const total = matched + missing;
        
        if (total > 0) {
          matchScore = Math.round((matched / total) * 100);
        }
      }
      
      return { ...app, matchScore };
    });
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
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || !user.dbUser) throw new Error("Unauthorized");
    const dbUser = user.dbUser;

    // ENFORCEMENT: CRM functionality is locked
    const hasActiveSprint = dbUser.sprintExpiresAt && dbUser.sprintExpiresAt > Date.now();
    if (!hasActiveSprint && dbUser.subscriptionTier !== "interview_sprint") {
      throw new Error("PLAN_RESTRICTION: Upgrade to Interview Sprint to manage application status.");
    }

    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Application not found");
    
    if (app.userId !== user._id) throw new Error("Unauthorized");

    const events = app.events || [];
    
    // Add status change event
    events.push({
      type: "status_change",
      title: `Moved to ${args.status.charAt(0).toUpperCase() + args.status.slice(1)}`,
      description: `Status updated from ${app.status} to ${args.status}`,
      timestamp: Date.now(),
    });

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      appliedDate: args.status === "applied" ? Date.now() : app.appliedDate,
      lastStatusUpdate: Date.now(),
      events,
    });
  },
});

export const addTimelineEvent = mutation({
  args: {
    applicationId: v.id("applications"),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Application not found");

    const events = app.events || [];
    events.push({
      type: args.type,
      title: args.title,
      description: args.description,
      timestamp: Date.now(),
    });

    await ctx.db.patch(args.applicationId, { events });
  },
});

export const checkGhosting = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return; // Silent return for cron

    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);

    const ghostedApps = await ctx.db
      .query("applications")
      .withIndex("by_user_and_status", (q) => q.eq("userId", user._id).eq("status", "applied"))
      .filter((q) => q.lt(q.field("lastStatusUpdate"), fiveDaysAgo))
      .collect();
    
    return ghostedApps.length;
  },
});

export const getApplicationInternal = internalQuery({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.applicationId);
  },
});