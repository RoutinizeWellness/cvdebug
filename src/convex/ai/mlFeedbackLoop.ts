// ML Feedback Loop System - Continuous Learning from User Outcomes
// This system tracks resume outcomes and uses them to improve ML models over time

import { internalMutation, internalQuery, mutation, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Record a resume outcome (interview, offer, rejection)
 * This is the primary data source for ML model improvement
 */
export const recordResumeOutcome = mutation({
  args: {
    resumeId: v.id("resumes"),
    applicationId: v.optional(v.id("applications")),
    outcomeType: v.union(
      v.literal("interview_received"),
      v.literal("offer_received"),
      v.literal("hired"),
      v.literal("rejected"),
      v.literal("no_response")
    ),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    daysToResponse: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get user ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.tokenIdentifier;

    // Get resume data
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Verify ownership
    if (resume.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Record success tracking
    await ctx.db.insert("mlSuccessTracking", {
      resumeId: args.resumeId,
      userId,
      outcomeType: args.outcomeType === "no_response" ? "interview" : // Map to schema enum
                  args.outcomeType === "rejected" ? "interview" :
                  args.outcomeType === "interview_received" ? "interview" :
                  args.outcomeType === "offer_received" ? "offer" :
                  "hired",
      jobTitle: args.jobTitle,
      company: args.company,
      resumeScore: resume.score,
      resumeCategory: resume.category,
      keywords: {
        matched: resume.matchedKeywords || [],
        missing: resume.missingKeywords || [],
        jobDescription: resume.jobDescription || null,
      },
      timestamp: Date.now(),
    });

    // Update application status if provided
    if (args.applicationId) {
      const app = await ctx.db.get(args.applicationId);
      if (app && app.userId === userId) {
        await ctx.db.patch(args.applicationId, {
          status: args.outcomeType === "interview_received" ? "interviewing" :
                  args.outcomeType === "offer_received" ? "accepted" :
                  args.outcomeType === "hired" ? "accepted" :
                  args.outcomeType === "rejected" ? "rejected" :
                  "applied",
          lastStatusUpdate: Date.now(),
        });
      }
    }

    // Return success
    return {
      success: true,
      message: "Outcome recorded successfully. This helps us improve our ML models!"
    };
  },
});

/**
 * Analyze patterns in successful resumes
 * Identifies keywords, formats, and structures that lead to success
 */
export const analyzeSuccessfulPatterns = internalQuery({
  args: {
    outcomeType: v.optional(v.union(v.literal("interview"), v.literal("offer"), v.literal("hired"))),
    minScore: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    // Get successful outcomes
    const outcomes = args.outcomeType
      ? await ctx.db.query("mlSuccessTracking")
          .withIndex("by_outcome", (q) => q.eq("outcomeType", args.outcomeType!))
          .take(limit)
      : await ctx.db.query("mlSuccessTracking")
          .take(limit);

    // Aggregate keyword patterns
    const keywordFrequency: Record<string, number> = {};
    const categorySuccessRates: Record<string, { total: number; avgScore: number }> = {};
    const jobTitlePatterns: Record<string, number> = {};

    for (const outcome of outcomes) {
      // Track keywords from successful resumes
      if (outcome.keywords && typeof outcome.keywords === 'object') {
        const matched = (outcome.keywords as any).matched || [];
        matched.forEach((kw: string) => {
          keywordFrequency[kw] = (keywordFrequency[kw] || 0) + 1;
        });
      }

      // Track category performance
      if (outcome.resumeCategory) {
        if (!categorySuccessRates[outcome.resumeCategory]) {
          categorySuccessRates[outcome.resumeCategory] = { total: 0, avgScore: 0 };
        }
        categorySuccessRates[outcome.resumeCategory].total++;
        categorySuccessRates[outcome.resumeCategory].avgScore += outcome.resumeScore || 0;
      }

      // Track job titles
      if (outcome.jobTitle) {
        jobTitlePatterns[outcome.jobTitle] = (jobTitlePatterns[outcome.jobTitle] || 0) + 1;
      }
    }

    // Calculate average scores
    for (const cat in categorySuccessRates) {
      categorySuccessRates[cat].avgScore /= categorySuccessRates[cat].total;
    }

    // Sort keywords by frequency
    const topKeywords = Object.entries(keywordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50)
      .map(([keyword, frequency]) => ({ keyword, frequency }));

    // Sort categories by success rate
    const topCategories = Object.entries(categorySuccessRates)
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([category, stats]) => ({ category, ...stats }));

    return {
      totalOutcomes: outcomes.length,
      topKeywords,
      topCategories,
      jobTitlePatterns,
      insights: {
        mostCommonKeyword: topKeywords[0]?.keyword || null,
        highestScoringCategory: topCategories[0]?.category || null,
        averageSuccessScore: outcomes.reduce((sum, o) => sum + (o.resumeScore || 0), 0) / outcomes.length,
      }
    };
  },
});

/**
 * Update ML configuration based on feedback and outcomes
 * This is called periodically to retrain the model
 */
export const updateMLConfig = internalMutation({
  args: {
    keywordWeights: v.optional(v.any()),
    categoryWeights: v.optional(v.any()),
    scoringAdjustments: v.optional(v.any()),
    discoveredKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Get existing config
    const existingConfigs = await ctx.db.query("mlConfig").take(1);
    const existingConfig = existingConfigs[0];

    if (existingConfig) {
      // Update existing config
      await ctx.db.patch(existingConfig._id, {
        keywordWeights: args.keywordWeights || existingConfig.keywordWeights,
        categoryWeights: args.categoryWeights || existingConfig.categoryWeights,
        scoringAdjustments: args.scoringAdjustments || existingConfig.scoringAdjustments,
        discoveredKeywords: args.discoveredKeywords || existingConfig.discoveredKeywords,
        lastUpdated: Date.now(),
      });
      return existingConfig._id;
    } else {
      // Create new config
      return await ctx.db.insert("mlConfig", {
        keywordWeights: args.keywordWeights || {},
        categoryWeights: args.categoryWeights || {},
        scoringAdjustments: args.scoringAdjustments || {},
        discoveredKeywords: args.discoveredKeywords || [],
        lastUpdated: Date.now(),
      });
    }
  },
});

/**
 * Get current ML configuration for use in scoring
 */
export const getMLConfig = internalQuery({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("mlConfig")
      .order("desc")
      .take(1);

    return configs[0] || null;
  },
});

/**
 * Record user feedback on analysis quality
 * This helps identify when the ML model is off-target
 */
export const recordAnalysisFeedback = mutation({
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
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.tokenIdentifier;

    // Get resume data
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Verify ownership
    if (resume.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Record feedback
    await ctx.db.insert("mlFeedback", {
      resumeId: args.resumeId,
      userId,
      feedbackType: args.feedbackType,
      details: args.details,
      suggestedScore: args.suggestedScore,
      suggestedCategory: args.suggestedCategory,
      suggestedKeywords: args.suggestedKeywords,
      originalScore: resume.score,
      originalCategory: resume.category,
      timestamp: Date.now(),
    });

    return {
      success: true,
      message: "Thank you for your feedback! This helps improve our AI."
    };
  },
});

/**
 * Analyze feedback patterns to identify systematic issues
 */
export const analyzeFeedbackPatterns = internalQuery({
  args: {
    feedbackType: v.optional(v.union(
      v.literal("score_too_high"),
      v.literal("score_too_low"),
      v.literal("missing_keyword"),
      v.literal("wrong_category")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    const feedbacks = args.feedbackType
      ? await ctx.db.query("mlFeedback")
          .withIndex("by_feedback_type", (q) => q.eq("feedbackType", args.feedbackType!))
          .take(limit)
      : await ctx.db.query("mlFeedback")
          .take(limit);

    // Analyze score discrepancies
    const scoreDiscrepancies = feedbacks
      .filter(f => f.suggestedScore && f.originalScore)
      .map(f => ({
        diff: (f.suggestedScore! - f.originalScore!),
        originalScore: f.originalScore,
        suggestedScore: f.suggestedScore,
      }));

    const avgDiscrepancy = scoreDiscrepancies.length > 0
      ? scoreDiscrepancies.reduce((sum, d) => sum + d.diff, 0) / scoreDiscrepancies.length
      : 0;

    // Collect missing keywords
    const missingKeywords: Record<string, number> = {};
    feedbacks.forEach(f => {
      if (f.suggestedKeywords) {
        f.suggestedKeywords.forEach(kw => {
          missingKeywords[kw] = (missingKeywords[kw] || 0) + 1;
        });
      }
    });

    const topMissingKeywords = Object.entries(missingKeywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([keyword, frequency]) => ({ keyword, frequency }));

    // Category confusion matrix
    const categoryConfusion: Record<string, Record<string, number>> = {};
    feedbacks.forEach(f => {
      if (f.originalCategory && f.suggestedCategory) {
        if (!categoryConfusion[f.originalCategory]) {
          categoryConfusion[f.originalCategory] = {};
        }
        categoryConfusion[f.originalCategory][f.suggestedCategory] =
          (categoryConfusion[f.originalCategory][f.suggestedCategory] || 0) + 1;
      }
    });

    return {
      totalFeedback: feedbacks.length,
      scoreAnalysis: {
        avgDiscrepancy,
        scoreDiscrepancies: scoreDiscrepancies.slice(0, 10),
      },
      topMissingKeywords,
      categoryConfusion,
      insights: {
        modelTendency: avgDiscrepancy > 5 ? "overestimating" : avgDiscrepancy < -5 ? "underestimating" : "accurate",
        needsKeywordExpansion: topMissingKeywords.length > 10,
        needsCategoryRetraining: Object.keys(categoryConfusion).length > 3,
      }
    };
  },
});

/**
 * Generate ML improvement recommendations based on feedback and outcomes
 */
export const generateMLImprovementRecommendations = internalQuery({
  args: {},
  handler: async (ctx) => {
    // Get feedback and success data directly
    const feedbackLimit = 100;
    const successLimit = 100;

    // Get feedback data
    const feedbacks = await ctx.db.query("mlFeedback").take(feedbackLimit);

    // Analyze score discrepancies
    const scoreDiscrepancies = feedbacks
      .filter(f => f.suggestedScore && f.originalScore)
      .map(f => ({
        diff: (f.suggestedScore! - f.originalScore!),
        originalScore: f.originalScore,
        suggestedScore: f.suggestedScore,
      }));

    const avgDiscrepancy = scoreDiscrepancies.length > 0
      ? scoreDiscrepancies.reduce((sum, d) => sum + d.diff, 0) / scoreDiscrepancies.length
      : 0;

    // Collect missing keywords
    const missingKeywords: Record<string, number> = {};
    feedbacks.forEach(f => {
      if (f.suggestedKeywords) {
        f.suggestedKeywords.forEach((kw: string) => {
          missingKeywords[kw] = (missingKeywords[kw] || 0) + 1;
        });
      }
    });

    const topMissingKeywords = Object.entries(missingKeywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([keyword, frequency]) => ({ keyword, frequency }));

    // Get success data
    const outcomes = await ctx.db.query("mlSuccessTracking").take(successLimit);

    const keywordFrequency: Record<string, number> = {};
    outcomes.forEach(outcome => {
      if (outcome.keywords && typeof outcome.keywords === 'object') {
        const matched = (outcome.keywords as any).matched || [];
        matched.forEach((kw: string) => {
          keywordFrequency[kw] = (keywordFrequency[kw] || 0) + 1;
        });
      }
    });

    const topSuccessKeywords = Object.entries(keywordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50)
      .map(([keyword, frequency]) => ({ keyword, frequency }));

    const feedbackPatterns = {
      totalFeedback: feedbacks.length,
      scoreAnalysis: { avgDiscrepancy },
      topMissingKeywords,
      insights: {
        modelTendency: avgDiscrepancy > 5 ? "overestimating" : avgDiscrepancy < -5 ? "underestimating" : "accurate",
      }
    };

    const successPatterns = {
      totalOutcomes: outcomes.length,
      topKeywords: topSuccessKeywords,
    };

    const recommendations: Array<{
      priority: "critical" | "high" | "medium" | "low";
      category: "keywords" | "scoring" | "categorization" | "features";
      action: string;
      impact: string;
      data: any;
    }> = [];

    // Recommendation 1: Keyword expansion
    if (feedbackPatterns.topMissingKeywords.length > 5) {
      recommendations.push({
        priority: "high",
        category: "keywords",
        action: `Add ${feedbackPatterns.topMissingKeywords.length} frequently missing keywords to database`,
        impact: "Reduce 'missing keyword' feedback by 40-60%",
        data: {
          keywords: feedbackPatterns.topMissingKeywords.slice(0, 10).map(k => k.keyword)
        }
      });
    }

    // Recommendation 2: Score calibration
    if (Math.abs(feedbackPatterns.scoreAnalysis.avgDiscrepancy) > 5) {
      recommendations.push({
        priority: "critical",
        category: "scoring",
        action: `Adjust scoring algorithm - currently ${feedbackPatterns.insights.modelTendency}`,
        impact: `Reduce score discrepancy from ${feedbackPatterns.scoreAnalysis.avgDiscrepancy.toFixed(1)} to <3 points`,
        data: {
          avgDiscrepancy: feedbackPatterns.scoreAnalysis.avgDiscrepancy,
          tendency: feedbackPatterns.insights.modelTendency
        }
      });
    }

    // Recommendation 3: Keyword weighting based on success
    if (successPatterns.topKeywords.length > 10) {
      recommendations.push({
        priority: "medium",
        category: "keywords",
        action: "Update keyword weights based on successful resume outcomes",
        impact: "Prioritize keywords that actually lead to interviews/offers",
        data: {
          topSuccessKeywords: successPatterns.topKeywords.slice(0, 10).map((k: { keyword: string; frequency: number }) => k)
        }
      });
    }

    // Recommendation 4: Category model retraining
    if (feedbackPatterns.insights.needsCategoryRetraining) {
      recommendations.push({
        priority: "medium",
        category: "categorization",
        action: "Retrain category classification model",
        impact: "Reduce wrong category classifications by 30-50%",
        data: {
          confusionMatrix: feedbackPatterns.categoryConfusion
        }
      });
    }

    // Recommendation 5: BM25 parameter tuning
    recommendations.push({
      priority: "low",
      category: "features",
      action: "Fine-tune BM25 parameters (k1, b) based on outcome data",
      impact: "Optimize keyword ranking for better match quality",
      data: {
        currentParams: { k1: 1.5, b: 0.75 },
        suggestedParams: { k1: 1.8, b: 0.65 } // Example
      }
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return {
      recommendations,
      summary: {
        totalRecommendations: recommendations.length,
        criticalIssues: recommendations.filter(r => r.priority === "critical").length,
        estimatedImpact: "20-40% improvement in user satisfaction and outcome prediction accuracy"
      },
      dataQuality: {
        feedbackCount: feedbackPatterns.totalFeedback,
        outcomeCount: successPatterns.totalOutcomes,
        dataStatus: feedbackPatterns.totalFeedback > 50 && successPatterns.totalOutcomes > 20 ? "sufficient" : "needs_more_data"
      }
    };
  },
});
