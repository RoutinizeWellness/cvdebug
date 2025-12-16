import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Track user feedback on analysis quality
export const recordFeedback = mutation({
  args: {
    resumeId: v.id("resumes"),
    feedbackType: v.union(
      v.literal("score_too_high"),
      v.literal("score_too_low"),
      v.literal("missing_keyword"),
      v.literal("wrong_category"),
      v.literal("helpful"),
      v.literal("not_helpful")
    ),
    details: v.optional(v.string()),
    suggestedScore: v.optional(v.number()),
    suggestedCategory: v.optional(v.string()),
    suggestedKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("mlFeedback", {
      resumeId: args.resumeId,
      userId: identity.subject,
      feedbackType: args.feedbackType,
      details: args.details,
      suggestedScore: args.suggestedScore,
      suggestedCategory: args.suggestedCategory,
      suggestedKeywords: args.suggestedKeywords,
      originalScore: resume.score,
      originalCategory: resume.category,
      timestamp: Date.now(),
    });

    console.log(`[ML Learning] Feedback recorded for resume ${args.resumeId}: ${args.feedbackType}`);
  },
});

// Track successful job applications (user reports they got interview/job)
export const recordSuccess = mutation({
  args: {
    resumeId: v.id("resumes"),
    outcomeType: v.union(
      v.literal("interview"),
      v.literal("offer"),
      v.literal("hired")
    ),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("mlSuccessTracking", {
      resumeId: args.resumeId,
      userId: identity.subject,
      outcomeType: args.outcomeType,
      jobTitle: args.jobTitle,
      company: args.company,
      resumeScore: resume.score,
      resumeCategory: resume.category,
      keywords: resume.missingKeywords,
      timestamp: Date.now(),
    });

    console.log(`[ML Learning] Success recorded for resume ${args.resumeId}: ${args.outcomeType}`);
  },
});

// Learn from keyword patterns in successful resumes
export const getKeywordLearningData = query({
  handler: async (ctx) => {
    const successfulResumes = await ctx.db
      .query("mlSuccessTracking")
      .order("desc")
      .take(100);

    const keywordFrequency: Record<string, { count: number; avgScore: number; successRate: number }> = {};

    for (const success of successfulResumes) {
      const resume = await ctx.db.get(success.resumeId);
      if (!resume || !resume.ocrText) continue;

      const words = resume.ocrText.toLowerCase().match(/\b[a-z0-9]+\b/g) || [];
      words.forEach(word => {
        if (word.length >= 3) {
          if (!keywordFrequency[word]) {
            keywordFrequency[word] = { count: 0, avgScore: 0, successRate: 0 };
          }
          keywordFrequency[word].count++;
          keywordFrequency[word].avgScore += resume.score || 0;
        }
      });
    }

    // Calculate averages
    Object.keys(keywordFrequency).forEach(word => {
      keywordFrequency[word].avgScore /= keywordFrequency[word].count;
      keywordFrequency[word].successRate = keywordFrequency[word].count / successfulResumes.length;
    });

    return keywordFrequency;
  },
});

// Get category accuracy metrics
export const getCategoryAccuracy = query({
  handler: async (ctx) => {
    const feedback = await ctx.db
      .query("mlFeedback")
      .filter(q => q.eq(q.field("feedbackType"), "wrong_category"))
      .take(100);

    const categoryErrors: Record<string, { predicted: string; actual: string; count: number }[]> = {};

    for (const fb of feedback) {
      const original = fb.originalCategory || "Unknown";
      const suggested = fb.suggestedCategory || "Unknown";
      
      if (!categoryErrors[original]) {
        categoryErrors[original] = [];
      }
      
      const existing = categoryErrors[original].find(e => e.actual === suggested);
      if (existing) {
        existing.count++;
      } else {
        categoryErrors[original].push({ predicted: original, actual: suggested, count: 1 });
      }
    }

    return categoryErrors;
  },
});

// Internal mutation to update ML weights based on learning
export const updateMLWeights = internalMutation({
  args: {
    keywordWeights: v.optional(v.any()),
    categoryWeights: v.optional(v.any()),
    scoringAdjustments: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Store updated weights in a configuration table
    const existingConfig = await ctx.db
      .query("mlConfig")
      .order("desc")
      .first();

    if (existingConfig) {
      await ctx.db.patch(existingConfig._id, {
        keywordWeights: args.keywordWeights,
        categoryWeights: args.categoryWeights,
        scoringAdjustments: args.scoringAdjustments,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("mlConfig", {
        keywordWeights: args.keywordWeights || {},
        categoryWeights: args.categoryWeights || {},
        scoringAdjustments: args.scoringAdjustments || {},
        lastUpdated: Date.now(),
      });
    }

    console.log("[ML Learning] ML weights updated based on user feedback");
  },
});

// Get current ML configuration
export const getMLConfig = query({
  handler: async (ctx) => {
    const config = await ctx.db
      .query("mlConfig")
      .order("desc")
      .first();

    return config || {
      keywordWeights: {},
      categoryWeights: {},
      scoringAdjustments: {},
      lastUpdated: Date.now(),
    };
  },
});

// Analytics: Get learning metrics
export const getLearningMetrics = query({
  handler: async (ctx) => {
    const totalFeedback = await ctx.db.query("mlFeedback").take(1000);
    const totalSuccess = await ctx.db.query("mlSuccessTracking").take(1000);

    const feedbackByType: Record<string, number> = {};
    totalFeedback.forEach(fb => {
      feedbackByType[fb.feedbackType] = (feedbackByType[fb.feedbackType] || 0) + 1;
    });

    const successByOutcome: Record<string, number> = {};
    totalSuccess.forEach(s => {
      successByOutcome[s.outcomeType] = (successByOutcome[s.outcomeType] || 0) + 1;
    });

    return {
      totalFeedbackCount: totalFeedback.length,
      totalSuccessCount: totalSuccess.length,
      feedbackByType,
      successByOutcome,
      lastUpdated: Date.now(),
    };
  },
});
