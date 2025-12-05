import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";

export const generateUploadUrl = mutation(async (ctx) => {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Unauthorized");

  // Admin bypass
  if (user.email === "tiniboti@gmail.com") {
    return await ctx.storage.generateUploadUrl();
  }

  // Check credits
  const credits = user.dbUser?.credits ?? 1;
  if (credits <= 0) {
    throw new Error("Insufficient credits. Please upgrade your plan.");
  }

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

    // Credit Check & Deduction
    if (user.email !== "tiniboti@gmail.com") {
      const credits = user.dbUser?.credits ?? 1;
      if (credits <= 0) {
        throw new Error("Insufficient credits. Please upgrade your plan.");
      }

      if (user.dbUser) {
        await ctx.db.patch(user.dbUser._id, { credits: credits - 1 });
      } else {
        // Create user record if it doesn't exist, consuming the 1 free credit (setting to 0)
        await ctx.db.insert("users", {
          tokenIdentifier: user.tokenIdentifier,
          email: user.email,
          name: user.name,
          subscriptionTier: "free",
          credits: 0,
        });
      }
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    const resumeId = await ctx.db.insert("resumes", {
      userId: user.tokenIdentifier, // Use tokenIdentifier for consistency with schema
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

    // Use tokenIdentifier for querying as we switched to it in createResume
    // But wait, existing code might use user._id (which was identity.subject in previous version)
    // In previous version: userId: user._id where user._id was identity.subject.
    // So we should continue using identity.subject (user.tokenIdentifier).
    
    const userId = user.tokenIdentifier;

    if (args.search) {
       return await ctx.db
        .query("resumes")
        .withSearchIndex("search_ocr", (q) => 
          q.search("ocrText", args.search!).eq("userId", userId)
        )
        .take(20);
    }

    if (args.category) {
      return await ctx.db
        .query("resumes")
        .withIndex("by_user_and_category", (q) => 
          q.eq("userId", userId).eq("category", args.category)
        )
        .order("desc")
        .take(50);
    }

    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
    if (!resume || resume.userId !== user.tokenIdentifier) {
      throw new Error("Resume not found or unauthorized");
    }

    await ctx.storage.delete(resume.storageId);
    await ctx.db.delete(args.id);
  },
});