/**
 * ML Learning and Continuous Improvement System
 *
 * This system collects data from every analysis and uses it to
 * improve future predictions. The more it analyzes, the better it gets.
 */

import { mutation, query, internalMutation } from "../_generated/server";
import { v } from "convex/values";

const internalAny = require("../_generated/api").internal;

// ==================== DATA COLLECTION ====================

/**
 * Store ML training data from each analysis
 * This data is used to improve future predictions
 */
export const storeMLTrainingData = mutation({
  args: {
    resumeId: v.id("resumes"),
    resumeHash: v.string(),
    features: v.object({
      wordCount: v.number(),
      averageSentenceLength: v.number(),
      uniqueWordRatio: v.number(),
      technicalDensity: v.number(),
      sectionCount: v.number(),
      bulletPointCount: v.number(),
      experienceYears: v.number(),
      educationLevel: v.number(),
      actionVerbDensity: v.number(),
      metricDensity: v.number(),
      quantifiableResultsCount: v.number(),
      readabilityScore: v.number(),
      professionalTone: v.number(),
      industryAlignment: v.number(),
      impactScore: v.number(),
      sentimentScore: v.number(),
      coherenceScore: v.number(),
      relevanceScore: v.number()
    }),
    predictedScore: v.number(),
    actualScore: v.number(),
    category: v.string(),
    isPremium: v.boolean(),
    userFeedback: v.optional(v.object({
      rescanned: v.boolean(),
      clickedUpgrade: v.boolean(),
      viewedDetails: v.boolean(),
      timeSpent: v.number(),
      editedResume: v.boolean()
    }))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Store training data
    await ctx.db.insert("mlTrainingData", {
      userId: identity.subject,
      resumeId: args.resumeId,
      resumeHash: args.resumeHash,
      features: args.features,
      predictedScore: args.predictedScore,
      actualScore: args.actualScore,
      category: args.category,
      isPremium: args.isPremium,
      userFeedback: args.userFeedback,
      timestamp: Date.now()
    });

    console.log(`[ML Learning] Stored training data for resume ${args.resumeId}`);
  }
});

/**
 * Update user feedback after interactions
 * This helps the ML system understand what works
 */
export const updateMLFeedback = mutation({
  args: {
    resumeHash: v.string(),
    rescanned: v.optional(v.boolean()),
    clickedUpgrade: v.optional(v.boolean()),
    viewedDetails: v.optional(v.boolean()),
    timeSpent: v.optional(v.number()),
    editedResume: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Find most recent training data for this resume
    const trainingData = await ctx.db
      .query("mlTrainingData")
      .withIndex("by_resume_hash", (q) => q.eq("resumeHash", args.resumeHash))
      .order("desc")
      .first();

    if (!trainingData) {
      console.log(`[ML Learning] No training data found for hash ${args.resumeHash}`);
      return;
    }

    // Update feedback
    const currentFeedback = trainingData.userFeedback || {
      rescanned: false,
      clickedUpgrade: false,
      viewedDetails: false,
      timeSpent: 0,
      editedResume: false
    };

    await ctx.db.patch(trainingData._id, {
      userFeedback: {
        rescanned: args.rescanned !== undefined ? args.rescanned : currentFeedback.rescanned,
        clickedUpgrade: args.clickedUpgrade !== undefined ? args.clickedUpgrade : currentFeedback.clickedUpgrade,
        viewedDetails: args.viewedDetails !== undefined ? args.viewedDetails : currentFeedback.viewedDetails,
        timeSpent: args.timeSpent !== undefined ? args.timeSpent : currentFeedback.timeSpent,
        editedResume: args.editedResume !== undefined ? args.editedResume : currentFeedback.editedResume
      }
    });

    console.log(`[ML Learning] Updated feedback for resume ${args.resumeHash}`);
  }
});

// ==================== ML MODEL TRAINING ====================

/**
 * Get historical training data for model improvement
 */
export const getMLTrainingData = query({
  args: {
    category: v.optional(v.string()),
    minScore: v.optional(v.number()),
    maxScore: v.optional(v.number()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    let query = ctx.db.query("mlTrainingData");

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.minScore !== undefined || args.maxScore !== undefined) {
      query = query.filter((q) => {
        let condition = q.gt(q.field("actualScore"), 0); // Base condition

        if (args.minScore !== undefined) {
          condition = q.and(condition, q.gte(q.field("actualScore"), args.minScore));
        }

        if (args.maxScore !== undefined) {
          condition = q.and(condition, q.lte(q.field("actualScore"), args.maxScore));
        }

        return condition;
      });
    }

    const results = await query
      .order("desc")
      .take(args.limit || 100);

    return results;
  }
});

/**
 * Calculate ML model weights based on historical performance
 * This is where the "learning" happens
 */
export const calculateMLWeights = query({
  args: {
    category: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get training data for this category
    const trainingData = await ctx.db
      .query("mlTrainingData")
      .filter((q) => q.eq(q.field("category"), args.category))
      .order("desc")
      .take(200); // Last 200 resumes

    if (trainingData.length < 20) {
      console.log(`[ML Learning] Not enough data for ${args.category} (${trainingData.length} samples)`);
      return null;
    }

    // Separate high performers vs low performers
    const highPerformers = trainingData.filter((d) => d.actualScore >= 80);
    const lowPerformers = trainingData.filter((d) => d.actualScore < 60);

    if (highPerformers.length < 5 || lowPerformers.length < 5) {
      console.log(`[ML Learning] Not enough high/low performers for ${args.category}`);
      return null;
    }

    // Calculate average feature values
    const featureNames = Object.keys(highPerformers[0].features) as Array<keyof typeof highPerformers[0]['features']>;
    const weights: Record<string, number> = {};

    featureNames.forEach((feature) => {
      const highAvg =
        highPerformers.reduce((sum, d) => sum + d.features[feature], 0) / highPerformers.length;

      const lowAvg =
        lowPerformers.reduce((sum, d) => sum + d.features[feature], 0) / lowPerformers.length;

      // Weight is based on how well this feature separates high from low performers
      const separation = Math.abs(highAvg - lowAvg);
      const normalizedSeparation = separation / 100; // Normalize

      weights[feature] = Math.max(0.1, Math.min(10, normalizedSeparation * 5));
    });

    console.log(`[ML Learning] Calculated weights for ${args.category}:`, weights);

    return {
      category: args.category,
      weights,
      sampleSize: trainingData.length,
      highPerformerCount: highPerformers.length,
      lowPerformerCount: lowPerformers.length,
      lastUpdated: Date.now()
    };
  }
});

/**
 * Get ML model performance metrics
 */
export const getMLPerformanceMetrics = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const allData = await ctx.db
      .query("mlTrainingData")
      .order("desc")
      .take(500);

    if (allData.length === 0) return null;

    // Calculate prediction accuracy
    let totalError = 0;
    let accurateCount = 0;

    allData.forEach((data) => {
      const error = Math.abs(data.predictedScore - data.actualScore);
      totalError += error;

      if (error <= 5) accurateCount++; // Within 5 points = accurate
    });

    const avgError = totalError / allData.length;
    const accuracy = (accurateCount / allData.length) * 100;

    // Calculate by category
    const categories = [...new Set(allData.map((d) => d.category))];
    const categoryMetrics: Record<string, any> = {};

    categories.forEach((category) => {
      const categoryData = allData.filter((d) => d.category === category);
      const catError =
        categoryData.reduce((sum, d) => sum + Math.abs(d.predictedScore - d.actualScore), 0) /
        categoryData.length;
      const catAccurate = categoryData.filter(
        (d) => Math.abs(d.predictedScore - d.actualScore) <= 5
      ).length;

      categoryMetrics[category] = {
        samples: categoryData.length,
        avgError: catError.toFixed(2),
        accuracy: ((catAccurate / categoryData.length) * 100).toFixed(1) + "%"
      };
    });

    // User engagement metrics
    const withFeedback = allData.filter((d) => d.userFeedback);
    const rescannedRate =
      withFeedback.filter((d) => d.userFeedback?.rescanned).length / withFeedback.length;
    const upgradeRate =
      withFeedback.filter((d) => d.userFeedback?.clickedUpgrade).length / withFeedback.length;

    return {
      totalSamples: allData.length,
      averageError: avgError.toFixed(2),
      accuracy: accuracy.toFixed(1) + "%",
      categoryMetrics,
      userEngagement: {
        rescannedRate: (rescannedRate * 100).toFixed(1) + "%",
        upgradeClickRate: (upgradeRate * 100).toFixed(1) + "%",
        avgTimeSpent:
          (withFeedback.reduce((sum, d) => sum + (d.userFeedback?.timeSpent || 0), 0) /
            withFeedback.length).toFixed(0) + "s"
      },
      lastUpdated: allData[0].timestamp
    };
  }
});

// ==================== INTERNAL FUNCTIONS ====================

/**
 * Store evaluation results for ML training
 */
export const storeEvaluationResults = internalMutation({
  args: {
    accuracy: v.number(),
    results: v.any()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("mlEvaluations", {
      accuracy: args.accuracy,
      results: args.results,
      timestamp: Date.now()
    });

    console.log(`[ML Evaluation] Stored results - Accuracy: ${args.accuracy.toFixed(1)}%`);
  }
});

/**
 * Get latest ML model configuration
 */
export const getMLConfig = query({
  args: {
    category: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get calculated weights for this category
    const weightsData = await ctx.runQuery(internalAny.ai.mlLearning.calculateMLWeights, {
      category: args.category
    });

    if (!weightsData) {
      return null;
    }

    return {
      keywordWeights: weightsData.weights,
      scoringAdjustments: {
        keywords: 0,
        format: 0,
        completeness: 0
      },
      lastUpdated: weightsData.lastUpdated
    };
  }
});

// ==================== LEGACY SUPPORT ====================

/**
 * Record ML analysis data (original function, kept for compatibility)
 */
export const recordMLAnalysis = mutation({
  args: {
    resumeId: v.id("resumes"),
    mlScores: v.object({
      overallScore: v.number(),
      keywordMatchScore: v.number(),
      actionVerbScore: v.number(),
      sentimentScore: v.number(),
      structureScore: v.number()
    }),
    topKeywords: v.array(v.string()),
    matchedKeywords: v.optional(v.array(v.string())),
    missingKeywords: v.optional(v.array(v.string())),
    actionVerbs: v.optional(v.array(v.string())),
    weakPhrases: v.optional(v.array(v.string())),
    entities: v.optional(v.object({
      skills: v.array(v.string()),
      technologies: v.array(v.string()),
      companies: v.array(v.string())
    })),
    skillsFound: v.optional(v.array(v.string())),
    bulletAnalysis: v.optional(v.object({
      strongCount: v.number(),
      weakCount: v.number(),
      avgQuality: v.number()
    })),
    formatMetrics: v.optional(v.object({
      sectionCount: v.number(),
      hasContactInfo: v.boolean(),
      hasProperHeadings: v.boolean(),
      readabilityScore: v.number()
    })),
    recommendations: v.array(v.union(
      v.string(),
      v.object({
        type: v.string(),
        title: v.string(),
        impact: v.number()
      })
    )),
    sentiment: v.optional(v.string()),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("mlAnalysisData", {
      resumeId: args.resumeId,
      userId: identity.subject,
      mlScores: args.mlScores,
      topKeywords: args.topKeywords,
      matchedKeywords: args.matchedKeywords,
      missingKeywords: args.missingKeywords,
      actionVerbs: args.actionVerbs,
      weakPhrases: args.weakPhrases,
      entities: args.entities,
      skillsFound: args.skillsFound,
      bulletAnalysis: args.bulletAnalysis,
      formatMetrics: args.formatMetrics,
      recommendations: args.recommendations,
      sentiment: args.sentiment,
      timestamp: args.timestamp
    });
  }
});

/**
 * Export ML analysis data for external analysis
 */
export const exportMLAnalysisData = query({
  args: {
    resumeId: v.optional(v.id("resumes")),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    let query = ctx.db
      .query("mlAnalysisData")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject));

    if (args.resumeId) {
      query = query.filter((q) => q.eq(q.field("resumeId"), args.resumeId));
    }

    return await query
      .order("desc")
      .take(args.limit || 50);
  }
});
