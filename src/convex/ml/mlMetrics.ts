import { internalMutation, internalQuery } from "../_generated/server";
import { v } from "convex/values";

/**
 * ML Performance Metrics Tracker
 *
 * Tracks:
 * - Cache hit rates
 * - Prediction latency
 * - Feature extraction time
 * - Model performance
 */

export const recordMetric = internalMutation({
  args: {
    metricType: v.union(
      v.literal("cache_hit"),
      v.literal("cache_miss"),
      v.literal("prediction_latency"),
      v.literal("feature_extraction_latency"),
      v.literal("analysis_complete")
    ),
    value: v.number(),
    metadata: v.optional(v.object({
      role: v.optional(v.string()),
      region: v.optional(v.string()),
      cacheKey: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("mlMetrics", {
      metricType: args.metricType,
      value: args.value,
      metadata: args.metadata || {},
      timestamp: Date.now(),
    });
  },
});

export const getMetricsSummary = internalQuery({
  args: {
    timeWindowHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timeWindowHours = args.timeWindowHours || 24;
    const cutoffTime = Date.now() - (timeWindowHours * 60 * 60 * 1000);

    const metrics = await ctx.db
      .query("mlMetrics")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", cutoffTime))
      .collect();

    // Calculate cache hit rate
    const cacheHits = metrics.filter(m => m.metricType === "cache_hit").length;
    const cacheMisses = metrics.filter(m => m.metricType === "cache_miss").length;
    const totalCacheRequests = cacheHits + cacheMisses;
    const cacheHitRate = totalCacheRequests > 0 ? (cacheHits / totalCacheRequests) * 100 : 0;

    // Calculate average prediction latency
    const predictionLatencies = metrics
      .filter(m => m.metricType === "prediction_latency")
      .map(m => m.value);
    const avgPredictionLatency = predictionLatencies.length > 0
      ? predictionLatencies.reduce((a, b) => a + b, 0) / predictionLatencies.length
      : 0;

    // Calculate average feature extraction latency
    const featureLatencies = metrics
      .filter(m => m.metricType === "feature_extraction_latency")
      .map(m => m.value);
    const avgFeatureLatency = featureLatencies.length > 0
      ? featureLatencies.reduce((a, b) => a + b, 0) / featureLatencies.length
      : 0;

    // Total analyses completed
    const totalAnalyses = metrics.filter(m => m.metricType === "analysis_complete").length;

    // Calculate p95 latency
    const sortedLatencies = [...predictionLatencies].sort((a, b) => a - b);
    const p95Index = Math.floor(sortedLatencies.length * 0.95);
    const p95Latency = sortedLatencies[p95Index] || 0;

    return {
      timeWindowHours,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      cacheHits,
      cacheMisses,
      totalCacheRequests,
      avgPredictionLatency: Math.round(avgPredictionLatency * 100) / 100,
      avgFeatureLatency: Math.round(avgFeatureLatency * 100) / 100,
      p95Latency: Math.round(p95Latency * 100) / 100,
      totalAnalyses,
      metricsCollected: metrics.length,
    };
  },
});

export const getCachePerformance = internalQuery({
  args: {},
  handler: async (ctx) => {
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const metrics = await ctx.db
      .query("mlMetrics")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", last24h))
      .collect();

    // Group by hour for trend analysis
    const hourlyStats: Record<number, { hits: number; misses: number }> = {};

    metrics.forEach(metric => {
      if (metric.metricType === "cache_hit" || metric.metricType === "cache_miss") {
        const hour = Math.floor(metric.timestamp / (60 * 60 * 1000));
        if (!hourlyStats[hour]) {
          hourlyStats[hour] = { hits: 0, misses: 0 };
        }
        if (metric.metricType === "cache_hit") {
          hourlyStats[hour].hits++;
        } else {
          hourlyStats[hour].misses++;
        }
      }
    });

    const trendData = Object.entries(hourlyStats)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([hour, stats]) => ({
        hour: Number(hour),
        hitRate: stats.hits + stats.misses > 0
          ? (stats.hits / (stats.hits + stats.misses)) * 100
          : 0,
        totalRequests: stats.hits + stats.misses,
      }));

    return {
      trendData,
      totalHits: metrics.filter(m => m.metricType === "cache_hit").length,
      totalMisses: metrics.filter(m => m.metricType === "cache_miss").length,
    };
  },
});
