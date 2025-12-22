import { v } from "convex/values";
import { mutation, query, internalQuery } from "./_generated/server";
import { getCurrentUser } from "./users";

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
    if (!user) throw new Error("Unauthorized");

    const applicationId = await ctx.db.insert("applications", {
      projectId: args.projectId,
      userId: user._id,
      companyName: args.companyName,
      jobTitle: args.jobTitle,
      jobDescriptionText: args.jobDescriptionText,
      jobUrl: args.jobUrl,
      status: "draft",
      missingKeywords: [],
      matchedKeywords: [],
    });

    return applicationId;
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
      if (!matchScore && ((app.matchedKeywords?.length || 0) + (app.missingKeywords?.length || 0) > 0)) {
        const matched = app.matchedKeywords?.length || 0;
        const total = matched + (app.missingKeywords?.length || 0);
        matchScore = Math.round((matched / total) * 100);
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
    if (!user) throw new Error("Unauthorized");

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      appliedDate: args.status === "applied" ? Date.now() : undefined,
    });
  },
});

export const getApplicationInternal = internalQuery({
  args: { applicationId: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.applicationId);
  },
});