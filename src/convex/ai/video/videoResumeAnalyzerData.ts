import { v } from "convex/values";
import { internalQuery, internalMutation } from "../../_generated/server";

/**
 * Data access layer for video resume analyzer
 * Separated from actions to avoid "use node" restrictions
 */

export const getVideoResume = internalQuery({
  args: { videoId: v.id("videoResumes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.videoId);
  },
});

export const updateVideoStatus = internalMutation({
  args: {
    videoId: v.id("videoResumes"),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, { status: args.status });
  },
});

export const saveVideoAnalysis = internalMutation({
  args: {
    videoId: v.id("videoResumes"),
    analysis: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      status: "completed",
      analysis: args.analysis,
    });
  },
});

export const getUserVideoCount = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videoResumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return videos.length;
  },
});

export const getUserVideos = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videoResumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});
