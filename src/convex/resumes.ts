import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { getCurrentUser } from "./users";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Allow upload without credit check - everyone can scan for free
    return await ctx.storage.generateUploadUrl();
  },
});

export const createResume = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    mimeType: v.string(),
    category: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get or create user (no credit check - free scans for everyone)
    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      // Create new user with 2 free credits
      const userId = await ctx.db.insert("users", {
        tokenIdentifier: identity.tokenIdentifier,
        email: identity.email,
        name: identity.name,
        subscriptionTier: "free",
        credits: 2,
        lastSeen: Date.now(),
      });
      user = await ctx.db.get(userId);
      if (!user) {
        throw new Error("Failed to create user");
      }
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get file URL");
    }

    // Create resume without deducting credits - use user._id instead of tokenIdentifier
    const resumeId = await ctx.db.insert("resumes", {
      userId: user._id,
      title: args.title,
      url,
      storageId: args.storageId,
      mimeType: args.mimeType,
      category: args.category,
      jobDescription: args.jobDescription,
      detailsUnlocked: false, // Details locked by default
    });

    // AI analysis will be triggered after OCR extraction in updateResumeOcr
    return resumeId;
  },
});

export const updateResumeOcr = mutation({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Update OCR text
    await ctx.db.patch(args.id, {
      ocrText: args.ocrText,
    });

    console.log(`[OCR] Text extracted for resume ${args.id}, length: ${args.ocrText.length} chars`);

    // Trigger AI analysis with job description if available
    await ctx.scheduler.runAfter(0, internal.ai.analyzeResume, {
      id: args.id,
      ocrText: args.ocrText,
      jobDescription: resume.jobDescription,
    });

    console.log(`[OCR] AI analysis scheduled for resume ${args.id}, JD provided: ${!!resume.jobDescription}`);
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
    missingKeywords: v.optional(v.array(v.object({
      keyword: v.string(),
      priority: v.string(),
    }))),
    formatIssues: v.optional(v.array(v.string())),
    metricSuggestions: v.optional(v.array(v.object({
      technology: v.string(),
      metrics: v.array(v.string()),
    }))),
  },
  handler: async (ctx, args) => {
    const updates: any = { status: "completed" };
    if (args.title) updates.title = args.title;
    if (args.category) updates.category = args.category;
    if (args.analysis) updates.analysis = args.analysis;
    if (args.rewrittenText) updates.rewrittenText = args.rewrittenText;
    if (args.score !== undefined) updates.score = args.score;
    if (args.scoreBreakdown) updates.scoreBreakdown = args.scoreBreakdown;
    if (args.missingKeywords) updates.missingKeywords = args.missingKeywords;
    if (args.formatIssues) updates.formatIssues = args.formatIssues;
    if (args.metricSuggestions) updates.metricSuggestions = args.metricSuggestions;

    await ctx.db.patch(args.id, updates);
  },
});

export const unlockResumeAfterPurchase = internalMutation({
  args: {
    resumeId: v.id("resumes"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the resume exists and belongs to this user
    const resume = await ctx.db.get(args.resumeId);
    
    if (!resume) {
      console.error(`[Unlock] Resume ${args.resumeId} not found`);
      return { success: false, error: "Resume not found" };
    }

    if (resume.userId !== args.userId) {
      console.error(`[Unlock] Resume ${args.resumeId} does not belong to user ${args.userId}`);
      return { success: false, error: "Unauthorized" };
    }

    // Unlock the resume
    await ctx.db.patch(args.resumeId, {
      detailsUnlocked: true,
    });

    console.log(`[Unlock] Successfully unlocked resume ${args.resumeId} for user ${args.userId}`);
    return { success: true };
  },
});

export const getResumes = query({
  args: {
    search: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      console.log("[getResumes] No user found - returning empty array");
      return [];
    }

    // Use subject (user._id) for querying
    const userId = user._id;
    console.log("[getResumes] Fetching resumes for userId:", userId);

    if (args.search) {
       const results = await ctx.db
        .query("resumes")
        .withSearchIndex("search_ocr", (q) => 
          q.search("ocrText", args.search!).eq("userId", userId)
        )
        .take(20);
       console.log("[getResumes] Search results count:", results.length);
       return results;
    }

    if (args.category) {
      const results = await ctx.db
        .query("resumes")
        .withIndex("by_user_and_category", (q) => 
          q.eq("userId", userId).eq("category", args.category)
        )
        .order("desc")
        .take(50);
      console.log("[getResumes] Category results count:", results.length);
      return results;
    }

    const results = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
    console.log("[getResumes] All resumes count:", results.length);
    return results;
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
    if (!resume || (resume.userId !== user._id && user.email !== "tiniboti@gmail.com")) {
      throw new Error("Resume not found or unauthorized");
    }

    await ctx.storage.delete(resume.storageId);
    await ctx.db.delete(args.id);
  },
});