/**
 * Feedback Loop System - Continuous ML Improvement
 *
 * This system tracks resume outcomes (interviews, offers, rejections) and uses
 * that data to continuously improve our ML models, making them better than Jobscan.
 *
 * Key Features:
 * 1. Outcome Tracking: Record what happens after users apply with their resumes
 * 2. Pattern Analysis: Identify what resume characteristics lead to success
 * 3. Weight Adjustment: Automatically tune keyword weights and scoring based on real results
 * 4. Performance Analytics: Track model improvement over time
 */

import { mutation, query, internalMutation } from "../_generated/server";
import { v } from "convex/values";

// ============================================================================
// PUBLIC MUTATIONS - User-facing outcome recording
// ============================================================================

/**
 * Record a resume application outcome
 * Users can track their job application results to help improve the ML
 */
export const recordResumeOutcome = mutation({
  args: {
    resumeId: v.id("resumes"),
    outcome: v.union(
      v.literal("interview_received"),
      v.literal("offer_received"),
      v.literal("rejected"),
      v.literal("no_response"),
      v.literal("ghosted")
    ),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    industry: v.optional(v.string()),
    appliedDate: v.number(),
    responseDate: v.optional(v.number()),
    confidenceScore: v.optional(v.number()),
    notes: v.optional(v.string()),
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
      throw new Error("Not authorized to record outcome for this resume");
    }

    // Calculate days to response
    const daysToResponse = args.responseDate
      ? Math.floor((args.responseDate - args.appliedDate) / (1000 * 60 * 60 * 24))
      : undefined;

    // Determine if outcome was successful
    const wasSuccessful =
      args.outcome === "interview_received" ||
      args.outcome === "offer_received";

    // Extract keywords from resume
    const keywordsUsed = resume.matchedKeywords || [];

    // Count metrics and action verbs from extractedData
    const bulletPointsCount = resume.extractedData?.achievementCount || 0;
    const metricsCount = resume.extractedData?.totalMetrics || 0;
    const actionVerbsCount = resume.extractedData?.hasActionVerbs ? 1 : 0;

    // Insert outcome record
    const outcomeId = await ctx.db.insert("resumeOutcomes", {
      resumeId: args.resumeId,
      userId,
      outcome: args.outcome,
      jobTitle: args.jobTitle,
      company: args.company,
      industry: args.industry,
      resumeScore: resume.score || 0,
      keywordsUsed,
      bulletPointsCount,
      metricsCount,
      actionVerbsCount,
      starMethodScore: undefined, // Can be calculated if needed
      bm25Score: undefined, // Can be calculated if needed
      appliedDate: args.appliedDate,
      responseDate: args.responseDate,
      daysToResponse,
      wasSuccessful,
      confidenceScore: args.confidenceScore,
      notes: args.notes,
    });

    console.log(`[Feedback Loop] Recorded ${args.outcome} for resume ${args.resumeId} (score: ${resume.score})`);

    // Trigger background analysis to update ML weights
    // This happens asynchronously so it doesn't slow down the user
    // Note: Background analysis is triggered manually via separate cron job or admin action

    return {
      success: true,
      outcomeId,
      wasSuccessful,
      daysToResponse,
    };
  },
});

/**
 * Get outcome statistics for a user's resumes
 */
export const getUserOutcomeStats = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = args.userId || identity.tokenIdentifier;

    // Get all outcomes for this user
    const outcomes = await ctx.db
      .query("resumeOutcomes")
      .withIndex("by_user", q => q.eq("userId", userId))
      .collect();

    if (outcomes.length === 0) {
      return {
        totalApplications: 0,
        interviewRate: 0,
        offerRate: 0,
        averageScore: 0,
        averageDaysToResponse: 0,
      };
    }

    const totalApplications = outcomes.length;
    const interviews = outcomes.filter(o => o.outcome === "interview_received").length;
    const offers = outcomes.filter(o => o.outcome === "offer_received").length;

    const averageScore =
      outcomes.reduce((sum, o) => sum + o.resumeScore, 0) / totalApplications;

    const responseTimes = outcomes
      .filter(o => o.daysToResponse !== undefined)
      .map(o => o.daysToResponse!);

    const averageDaysToResponse =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, d) => sum + d, 0) / responseTimes.length
        : 0;

    return {
      totalApplications,
      interviewRate: (interviews / totalApplications) * 100,
      offerRate: (offers / totalApplications) * 100,
      averageScore: Math.round(averageScore * 10) / 10,
      averageDaysToResponse: Math.round(averageDaysToResponse),
      successfulOutcomes: interviews + offers,
    };
  },
});

// ============================================================================
// INTERNAL MUTATIONS - Background ML learning
// ============================================================================

/**
 * Analyze outcomes and update ML weights automatically
 * This runs in the background after outcomes are recorded
 */
export const analyzeOutcomesAndUpdateWeights = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("[Feedback Loop] Starting analysis of resume outcomes...");

    // Get all successful and unsuccessful outcomes
    const allOutcomes = await ctx.db
      .query("resumeOutcomes")
      .collect();

    if (allOutcomes.length < 10) {
      console.log("[Feedback Loop] Not enough data yet (need 10+, have " + allOutcomes.length + ")");
      return { updated: false, reason: "insufficient_data" };
    }

    const successful = allOutcomes.filter(o => o.wasSuccessful);
    const unsuccessful = allOutcomes.filter(o => !o.wasSuccessful);

    console.log(`[Feedback Loop] Analyzing ${successful.length} successful vs ${unsuccessful.length} unsuccessful outcomes`);

    // 1. Analyze keyword patterns
    const keywordSuccess: Record<string, { total: number; successful: number }> = {};

    for (const outcome of allOutcomes) {
      for (const keyword of outcome.keywordsUsed) {
        if (!keywordSuccess[keyword]) {
          keywordSuccess[keyword] = { total: 0, successful: 0 };
        }
        keywordSuccess[keyword].total++;
        if (outcome.wasSuccessful) {
          keywordSuccess[keyword].successful++;
        }
      }
    }

    // Calculate success rates and generate weights
    const keywordWeights: Record<string, number> = {};
    for (const [keyword, stats] of Object.entries(keywordSuccess)) {
      if (stats.total >= 3) { // Need at least 3 data points
        const successRate = stats.successful / stats.total;
        // Weight: 0.8 to 1.2 based on success rate
        // 100% success = 1.2x weight, 50% = 1.0x, 0% = 0.8x
        keywordWeights[keyword] = 0.8 + (successRate * 0.4);
      }
    }

    console.log(`[Feedback Loop] Generated weights for ${Object.keys(keywordWeights).length} keywords`);

    // 2. Analyze score thresholds
    const successfulScores = successful.map(o => o.resumeScore);
    const unsuccessfulScores = unsuccessful.map(o => o.resumeScore);

    const avgSuccessfulScore =
      successfulScores.length > 0
        ? successfulScores.reduce((a, b) => a + b, 0) / successfulScores.length
        : 0;

    const avgUnsuccessfulScore =
      unsuccessfulScores.length > 0
        ? unsuccessfulScores.reduce((a, b) => a + b, 0) / unsuccessfulScores.length
        : 0;

    const scoreDifference = avgSuccessfulScore - avgUnsuccessfulScore;

    console.log(`[Feedback Loop] Avg successful score: ${avgSuccessfulScore.toFixed(1)}, unsuccessful: ${avgUnsuccessfulScore.toFixed(1)}, diff: ${scoreDifference.toFixed(1)}`);

    // 3. Discover new high-value keywords
    const discoveredKeywords: string[] = [];
    for (const [keyword, stats] of Object.entries(keywordSuccess)) {
      if (stats.total >= 5 && stats.successful / stats.total >= 0.8) {
        // 80%+ success rate with 5+ uses = high-value keyword
        if (!discoveredKeywords.includes(keyword)) {
          discoveredKeywords.push(keyword);
        }
      }
    }

    console.log(`[Feedback Loop] Discovered ${discoveredKeywords.length} high-value keywords`);

    // 4. Calculate scoring adjustments
    const scoringAdjustments: Record<string, number> = {};

    // If successful resumes have higher scores, increase keyword scoring weight
    if (scoreDifference > 5) {
      scoringAdjustments.keywords = 0.1; // +10% to keyword scoring
    } else if (scoreDifference < -5) {
      scoringAdjustments.keywords = -0.1; // -10% to keyword scoring
    }

    // 5. Update or create ML config
    const existingConfig = await ctx.db
      .query("mlConfig")
      .first();

    if (existingConfig) {
      await ctx.db.patch(existingConfig._id, {
        keywordWeights,
        scoringAdjustments,
        discoveredKeywords,
        lastUpdated: Date.now(),
      });
      console.log(`[Feedback Loop] Updated existing ML config`);
    } else {
      await ctx.db.insert("mlConfig", {
        keywordWeights,
        categoryWeights: {},
        scoringAdjustments,
        discoveredKeywords,
        lastUpdated: Date.now(),
      });
      console.log(`[Feedback Loop] Created new ML config`);
    }

    return {
      updated: true,
      stats: {
        totalOutcomes: allOutcomes.length,
        successfulOutcomes: successful.length,
        unsuccessfulOutcomes: unsuccessful.length,
        keywordsAnalyzed: Object.keys(keywordWeights).length,
        discoveredKeywords: discoveredKeywords.length,
        avgSuccessfulScore: Math.round(avgSuccessfulScore * 10) / 10,
        avgUnsuccessfulScore: Math.round(avgUnsuccessfulScore * 10) / 10,
        scoreDifference: Math.round(scoreDifference * 10) / 10,
      },
    };
  },
});

/**
 * Get current ML config for use in scoring
 */
export const getMLConfig = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db
      .query("mlConfig")
      .first();

    return config || null;
  },
});

/**
 * Get feedback loop performance metrics
 * Shows how the ML is improving over time
 */
export const getFeedbackLoopMetrics = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db
      .query("mlConfig")
      .first();

    if (!config) {
      return {
        isActive: false,
        totalOutcomes: 0,
        lastUpdated: null,
      };
    }

    const totalOutcomes = await ctx.db
      .query("resumeOutcomes")
      .collect();

    const recentSuccessful = totalOutcomes
      .filter(o => o.wasSuccessful && o.appliedDate > Date.now() - 30 * 24 * 60 * 60 * 1000)
      .length;

    const recentTotal = totalOutcomes
      .filter(o => o.appliedDate > Date.now() - 30 * 24 * 60 * 60 * 1000)
      .length;

    const successRate = recentTotal > 0 ? (recentSuccessful / recentTotal) * 100 : 0;

    return {
      isActive: true,
      totalOutcomes: totalOutcomes.length,
      learnedKeywords: Object.keys(config.keywordWeights || {}).length,
      discoveredKeywords: (config.discoveredKeywords || []).length,
      last30DaysSuccessRate: Math.round(successRate * 10) / 10,
      lastUpdated: config.lastUpdated,
      scoringAdjustments: config.scoringAdjustments || {},
    };
  },
});
