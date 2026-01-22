"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

/**
 * Wrapper to record ML metrics during analysis
 * This tracks cache hits, latency, and performance
 */

export const recordAnalysisMetrics = internalAction({
  args: {
    startTime: v.number(),
    cacheHit: v.boolean(),
    featureExtractionTime: v.number(),
    predictionTime: v.number(),
    role: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const totalLatency = now - args.startTime;

    // Record cache hit or miss
    await ctx.runMutation(internal.ml.mlMetrics.recordMetric, {
      metricType: args.cacheHit ? "cache_hit" : "cache_miss",
      value: 1,
      metadata: {
        role: args.role,
        region: args.region,
      },
    });

    // Record feature extraction latency
    await ctx.runMutation(internal.ml.mlMetrics.recordMetric, {
      metricType: "feature_extraction_latency",
      value: args.featureExtractionTime,
      metadata: {
        role: args.role,
        region: args.region,
      },
    });

    // Record prediction latency
    await ctx.runMutation(internal.ml.mlMetrics.recordMetric, {
      metricType: "prediction_latency",
      value: args.predictionTime,
      metadata: {
        role: args.role,
        region: args.region,
      },
    });

    // Record analysis completion
    await ctx.runMutation(internal.ml.mlMetrics.recordMetric, {
      metricType: "analysis_complete",
      value: totalLatency,
      metadata: {
        role: args.role,
        region: args.region,
      },
    });

    console.log(`[ML Metrics] Total: ${totalLatency}ms, Cache: ${args.cacheHit ? 'HIT' : 'MISS'}, Feature: ${args.featureExtractionTime}ms, Prediction: ${args.predictionTime}ms`);
  },
});

/**
 * Get real-time cache statistics
 */
export const getCacheStats = internalAction({
  args: {},
  handler: async (ctx): Promise<{
    cacheHitRate: number;
    totalRequests: number;
    avgLatency: number;
    p95Latency: number;
    totalAnalyses: number;
  }> => {
    const summary: any = await ctx.runQuery(internal.ml.mlMetrics.getMetricsSummary, {
      timeWindowHours: 24,
    });

    return {
      cacheHitRate: summary.cacheHitRate,
      totalRequests: summary.totalCacheRequests,
      avgLatency: summary.avgPredictionLatency,
      p95Latency: summary.p95Latency,
      totalAnalyses: summary.totalAnalyses,
    };
  },
});
