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
      
      // Allow if they have credits OR if they are a new user (who will get trial credits)
      if (credits <= 0 && user.dbUser) {
        throw new Error("Insufficient credits. Please upgrade your plan.");
      }

      if (user.dbUser) {
        await ctx.db.patch(user.dbUser._id, { credits: credits - 1 });
      } else {
        // Create user record if it doesn't exist
        // NEW: Apply 15-day free trial logic
        // Give them Pro-level credits (2) initially. 
        // They use 1 now, so they will have 1 left.
        const trialEndsOn = Date.now() + (15 * 24 * 60 * 60 * 1000);
        
        await ctx.db.insert("users", {
          tokenIdentifier: user._id, // Use subject as tokenIdentifier
          email: user.email,
          name: user.name,
          subscriptionTier: "free",
          credits: 1, // 2 initial - 1 used = 1 remaining
          trialEndsOn: trialEndsOn,
        });
      }
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) throw new Error("Failed to get storage URL");

    const resumeId = await ctx.db.insert("resumes", {
      userId: user._id, // Use subject as userId
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
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    analysis: v.optional(v.string()),
    rewrittenText: v.optional(v.string()),
    score: v.optional(v.number()),
    scoreBreakdown: v.optional(v.object({
      keywords: v.number(),
      format: v.number(),
      completeness: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: "completed" };
    if (args.title) updates.title = args.title;
    if (args.category) updates.category = args.category;
    if (args.analysis) updates.analysis = args.analysis;
    if (args.rewrittenText) updates.rewrittenText = args.rewrittenText;
    if (args.score !== undefined) updates.score = args.score;
    if (args.scoreBreakdown) updates.scoreBreakdown = args.scoreBreakdown;

    await ctx.db.patch(args.id, updates);
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

    // Use subject (user._id) for querying
    const userId = user._id;

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
    if (!resume || resume.userId !== user._id) {
      throw new Error("Resume not found or unauthorized");
    }

    await ctx.storage.delete(resume.storageId);
    await ctx.db.delete(args.id);
  },
});