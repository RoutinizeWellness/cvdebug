import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

export const generateUploadUrl = mutation(async (ctx) => {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
});

export const createResume = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    width: v.number(),
    height: v.number(),
    size: v.number(),
    mimeType: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    const resumeId = await ctx.db.insert("resumes", {
      userId: user._id,
      storageId: args.storageId,
      url,
      title: args.title,
      jobDescription: args.jobDescription,
      status: "processing",
      width: args.width,
      height: args.height,
      size: args.size,
      mimeType: args.mimeType,
    });

    return resumeId;
  },
});

export const updateResumeOcr = mutation({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== user._id) {
      throw new Error("Resume not found or unauthorized");
    }

    await ctx.db.patch(args.id, {
      ocrText: args.ocrText,
    });

    await ctx.scheduler.runAfter(0, internal.ai.analyzeResume, {
      id: args.id,
      ocrText: args.ocrText,
      jobDescription: resume.jobDescription,
    });
  },
});

export const updateResumeMetadata = internalMutation({
  args: {
    id: v.id("resumes"),
    title: v.string(),
    category: v.string(),
    analysis: v.string(),
    score: v.number(),
    scoreBreakdown: v.optional(v.object({
      keywords: v.number(),
      format: v.number(),
      completeness: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      title: args.title,
      category: args.category,
      analysis: args.analysis,
      score: args.score,
      scoreBreakdown: args.scoreBreakdown,
      status: "completed",
    });
  },
});

export const getResumes = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    if (args.search) {
       return await ctx.db
        .query("resumes")
        .withSearchIndex("search_ocr", (q) => 
          q.search("ocrText", args.search!).eq("userId", user._id)
        )
        .take(20);
    }

    if (args.category) {
      return await ctx.db
        .query("resumes")
        .withIndex("by_user_and_category", (q) => 
          q.eq("userId", user._id).eq("category", args.category)
        )
        .order("desc")
        .take(50);
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});

export const getResumeInternal = internalQuery({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const deleteResume = mutation({
  args: { id: v.id("resumes") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== user._id) {
      throw new Error("Resume not found or unauthorized");
    }

    await ctx.storage.delete(resume.storageId);
    await ctx.db.delete(args.id);
  },
});