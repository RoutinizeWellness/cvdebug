import { v } from "convex/values";
import { internalQuery, internalMutation, query } from "../../_generated/server";

/**
 * Data access layer for application automator
 */

export const createApplication = internalMutation({
  args: {
    userId: v.string(),
    jobTitle: v.string(),
    company: v.string(),
    jobUrl: v.string(),
    platform: v.string(),
    appliedAt: v.number(),
    status: v.union(
      v.literal("applied"),
      v.literal("reviewing"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    tailoredResumeSnapshot: v.any(),
    coverLetter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("automatedApplications", args);
  },
});

export const getUserProfile = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Mock user profile - in production, fetch from users table
    return {
      skills: ["TypeScript", "React", "Node.js", "AWS"],
      experience: 5,
      education: "Bachelor's in Computer Science",
      resume: {
        headline: "Senior Software Engineer",
        summary: "Experienced full-stack engineer with 5 years building scalable web applications",
        experience: [],
        skills: ["TypeScript", "React", "Node.js", "AWS"],
        education: [],
      },
      formFields: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        location: "San Francisco, CA",
      },
    };
  },
});

export const getApplications = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("automatedApplications")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .order("desc")
      .take(args.limit || 50);
  },
});

export const updateApplicationStatus = internalMutation({
  args: {
    applicationId: v.id("automatedApplications"),
    status: v.union(
      v.literal("applied"),
      v.literal("reviewing"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      lastUpdated: Date.now(),
    });
  },
});

export const getApplicationStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        total: 0,
        applied: 0,
        reviewing: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        responseRate: 0,
        avgMatchScore: 0,
      };
    }

    const applications = await ctx.db
      .query("automatedApplications")
      .withIndex("by_user", (q) => q.eq("userId", identity.tokenIdentifier))
      .collect();

    const total = applications.length;
    const applied = applications.filter(a => a.status === "applied").length;
    const reviewing = applications.filter(a => a.status === "reviewing").length;
    const interview = applications.filter(a => a.status === "interview").length;
    const offer = applications.filter(a => a.status === "offer").length;
    const rejected = applications.filter(a => a.status === "rejected").length;

    const responseRate = total > 0
      ? Math.round(((reviewing + interview + offer + rejected) / total) * 100)
      : 0;

    // Calculate average match score from applications with scores
    const applicationsWithScores = applications.filter(a => a.matchScore !== undefined && a.matchScore > 0);
    const avgMatchScore = applicationsWithScores.length > 0
      ? Math.round(applicationsWithScores.reduce((sum, a) => sum + (a.matchScore || 0), 0) / applicationsWithScores.length)
      : 0;

    return {
      total,
      applied,
      reviewing,
      interview,
      offer,
      rejected,
      responseRate,
      avgMatchScore,
    };
  },
});
