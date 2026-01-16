import { v } from "convex/values";
import { internalQuery, internalMutation } from "../../_generated/server";

/**
 * Data access layer for brand analyzer
 * Separated from actions to avoid "use node" restrictions
 */

export const saveSocialProfile = internalMutation({
  args: {
    userId: v.string(),
    platform: v.union(v.literal("linkedin"), v.literal("github"), v.literal("portfolio")),
    profileUrl: v.string(),
    username: v.optional(v.string()),
    scrapedData: v.any(),
    brandScore: v.optional(v.number()),
    lastSyncedAt: v.number(),
    syncStatus: v.union(v.literal("synced"), v.literal("error"), v.literal("pending")),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db
      .query("socialProfiles")
      .withIndex("by_user_and_platform", (q) =>
        q.eq("userId", args.userId).eq("platform", args.platform)
      )
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        profileUrl: args.profileUrl,
        username: args.username,
        scrapedData: args.scrapedData,
        brandScore: args.brandScore,
        lastSyncedAt: args.lastSyncedAt,
        syncStatus: args.syncStatus,
      });
      return existing._id;
    } else {
      // Create new
      return await ctx.db.insert("socialProfiles", args);
    }
  },
});

export const getUserProfiles = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("socialProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const saveBrandAnalysis = internalMutation({
  args: {
    userId: v.string(),
    overallBrandScore: v.number(),
    platforms: v.any(),
    consistencyAnalysis: v.any(),
    brandStrength: v.any(),
    recommendations: v.array(v.any()),
    competitivePosition: v.any(),
    generatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("brandAnalyses", args);
  },
});
