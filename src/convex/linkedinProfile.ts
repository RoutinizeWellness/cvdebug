import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get the latest LinkedIn optimization for the current user
export const getLatestOptimization = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const optimization = await ctx.db
      .query("linkedinOptimizations")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .first();

    return optimization;
  },
});

// Get all LinkedIn optimizations for the current user
export const getAllOptimizations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const optimizations = await ctx.db
      .query("linkedinOptimizations")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(10);

    return optimizations;
  },
});

// Store LinkedIn optimization result
export const storeOptimization = mutation({
  args: {
    profileText: v.string(),
    linkedinUrl: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    result: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const optimizationId = await ctx.db.insert("linkedinOptimizations", {
      userId: identity.subject,
      profileText: args.profileText,
      linkedinUrl: args.linkedinUrl,
      jobDescription: args.jobDescription,
      score: args.result.score || 72,
      headline: args.result.headline,
      about: args.result.about,
      experience: args.result.experience,
      actionableTips: args.result.actionableTips || [],
      generatedAt: Date.now(),
    });

    return optimizationId;
  },
});

// Get all LinkedIn DMs for the current user
export const getRecruiterDMs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const dms = await ctx.db
      .query("linkedinDMs")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(10);

    return dms;
  },
});

// Store generated recruiter DMs
export const storeRecruiterDMs = mutation({
  args: {
    profileText: v.string(),
    jobDescription: v.string(),
    recruiterName: v.optional(v.string()),
    variations: v.array(v.object({
      tone: v.string(),
      content: v.string(),
      subject: v.optional(v.string()),
    })),
    applicationId: v.optional(v.id("applications")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const dmId = await ctx.db.insert("linkedinDMs", {
      userId: identity.subject,
      applicationId: args.applicationId,
      recruiterName: args.recruiterName,
      jobDescription: args.jobDescription,
      variations: args.variations,
      generatedAt: Date.now(),
    });

    return dmId;
  },
});
