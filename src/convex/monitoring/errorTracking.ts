/**
 * Advanced Error Tracking System
 * Captures, categorizes, and analyzes errors for better debugging and monitoring
 */

import { internalMutation, internalQuery, query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Error severity levels
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Error categories for classification
 */
export type ErrorCategory =
  | "validation"
  | "authentication"
  | "authorization"
  | "database"
  | "network"
  | "api"
  | "ml_processing"
  | "file_processing"
  | "payment"
  | "unknown";

/**
 * Record an error with full context
 * INTERNAL: Called from error handlers
 */
export const recordError = internalMutation({
  args: {
    message: v.string(),
    stack: v.optional(v.string()),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    category: v.union(
      v.literal("validation"),
      v.literal("authentication"),
      v.literal("authorization"),
      v.literal("database"),
      v.literal("network"),
      v.literal("api"),
      v.literal("ml_processing"),
      v.literal("file_processing"),
      v.literal("payment"),
      v.literal("unknown")
    ),
    userId: v.optional(v.id("users")),
    metadata: v.optional(
      v.object({
        endpoint: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        ip: v.optional(v.string()),
        requestId: v.optional(v.string()),
        additionalData: v.optional(v.any()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const errorId = await ctx.db.insert("errorLogs", {
      message: args.message,
      stack: args.stack,
      severity: args.severity,
      category: args.category,
      userId: args.userId,
      metadata: args.metadata || {},
      resolved: false,
      occurrenceCount: 1,
      firstOccurrence: Date.now(),
      lastOccurrence: Date.now(),
    });

    // If critical, trigger immediate alert
    if (args.severity === "critical") {
      // TODO: Integrate with alerting system (Slack, email, etc.)
      console.error("CRITICAL ERROR:", args.message);
    }

    return errorId;
  },
});

/**
 * Increment occurrence count for similar errors
 */
export const incrementErrorOccurrence = internalMutation({
  args: {
    errorId: v.id("errorLogs"),
  },
  handler: async (ctx, args) => {
    const error = await ctx.db.get(args.errorId);
    if (!error) return;

    await ctx.db.patch(args.errorId, {
      occurrenceCount: error.occurrenceCount + 1,
      lastOccurrence: Date.now(),
    });
  },
});

/**
 * Mark an error as resolved
 */
export const resolveError = internalMutation({
  args: {
    errorId: v.id("errorLogs"),
    resolution: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.errorId, {
      resolved: true,
      resolvedAt: Date.now(),
      resolution: args.resolution,
    });
  },
});

/**
 * Get error statistics
 */
export const getErrorStats = internalQuery({
  args: {
    timeWindowHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timeWindowHours = args.timeWindowHours || 24;
    const cutoffTime = Date.now() - timeWindowHours * 60 * 60 * 1000;

    // OPTIMIZED: Limited sample to prevent memory issues
    const allErrors = await ctx.db
      .query("errorLogs")
      .order("desc")
      .take(1000);

    const recentErrors = allErrors.filter(
      (e) => e.lastOccurrence >= cutoffTime
    );

    // Count by severity
    const bySeverity = {
      low: recentErrors.filter((e) => e.severity === "low").length,
      medium: recentErrors.filter((e) => e.severity === "medium").length,
      high: recentErrors.filter((e) => e.severity === "high").length,
      critical: recentErrors.filter((e) => e.severity === "critical").length,
    };

    // Count by category
    const byCategory: Record<string, number> = {};
    for (const error of recentErrors) {
      byCategory[error.category] = (byCategory[error.category] || 0) + 1;
    }

    // Calculate total occurrences
    const totalOccurrences = recentErrors.reduce(
      (sum, e) => sum + e.occurrenceCount,
      0
    );

    // Find most common errors
    const topErrors = recentErrors
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount)
      .slice(0, 10)
      .map((e) => ({
        id: e._id,
        message: e.message,
        category: e.category,
        severity: e.severity,
        occurrences: e.occurrenceCount,
        lastOccurrence: e.lastOccurrence,
      }));

    // Resolution rate
    const resolvedCount = recentErrors.filter((e) => e.resolved).length;
    const resolutionRate =
      recentErrors.length > 0
        ? (resolvedCount / recentErrors.length) * 100
        : 100;

    return {
      totalErrors: recentErrors.length,
      totalOccurrences,
      bySeverity,
      byCategory,
      topErrors,
      resolutionRate: Math.round(resolutionRate * 10) / 10,
      timeWindow: timeWindowHours,
    };
  },
});

/**
 * Get recent unresolved errors (for admin dashboard)
 */
export const getRecentErrors = query({
  args: {
    limit: v.optional(v.number()),
    severity: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
    resolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    // Get recent errors
    const allErrors = await ctx.db
      .query("errorLogs")
      .order("desc")
      .take(limit * 2); // Get more to filter

    let filteredErrors = allErrors;

    // Filter by severity if specified
    if (args.severity) {
      filteredErrors = filteredErrors.filter(
        (e) => e.severity === args.severity
      );
    }

    // Filter by resolved status if specified
    if (args.resolved !== undefined) {
      filteredErrors = filteredErrors.filter(
        (e) => e.resolved === args.resolved
      );
    }

    // Take the limit
    filteredErrors = filteredErrors.slice(0, limit);

    return filteredErrors.map((error) => ({
      id: error._id,
      message: error.message,
      severity: error.severity,
      category: error.category,
      occurrenceCount: error.occurrenceCount,
      firstOccurrence: error.firstOccurrence,
      lastOccurrence: error.lastOccurrence,
      resolved: error.resolved,
      userId: error.userId,
    }));
  },
});

/**
 * Get error details
 */
export const getErrorDetails = query({
  args: {
    errorId: v.id("errorLogs"),
  },
  handler: async (ctx, args) => {
    const error = await ctx.db.get(args.errorId);
    if (!error) return null;

    return {
      id: error._id,
      message: error.message,
      stack: error.stack,
      severity: error.severity,
      category: error.category,
      occurrenceCount: error.occurrenceCount,
      firstOccurrence: error.firstOccurrence,
      lastOccurrence: error.lastOccurrence,
      resolved: error.resolved,
      resolvedAt: error.resolvedAt,
      resolution: error.resolution,
      userId: error.userId,
      metadata: error.metadata,
    };
  },
});

/**
 * Get error trends over time
 */
export const getErrorTrends = internalQuery({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const allErrors = await ctx.db
      .query("errorLogs")
      .order("desc")
      .take(1000);

    const trends = [];

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = now - i * dayMs;
      const dayEnd = dayStart + dayMs;

      const dayErrors = allErrors.filter(
        (e) => e.lastOccurrence >= dayStart && e.lastOccurrence < dayEnd
      );

      const dayOccurrences = dayErrors.reduce(
        (sum, e) => sum + e.occurrenceCount,
        0
      );

      trends.push({
        date: dayStart,
        errorCount: dayErrors.length,
        occurrenceCount: dayOccurrences,
        critical: dayErrors.filter((e) => e.severity === "critical").length,
        high: dayErrors.filter((e) => e.severity === "high").length,
      });
    }

    return trends;
  },
});

/**
 * Auto-resolve stale errors (no occurrences in 30 days)
 */
export const autoResolveStaleErrors = internalMutation({
  args: {},
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const staleErrors = await ctx.db
      .query("errorLogs")
      .order("desc")
      .take(100);

    const toResolve = staleErrors.filter(
      (e) => !e.resolved && e.lastOccurrence < thirtyDaysAgo
    );

    let resolvedCount = 0;
    for (const error of toResolve) {
      await ctx.db.patch(error._id, {
        resolved: true,
        resolvedAt: Date.now(),
        resolution: "Auto-resolved: No occurrences in 30 days",
      });
      resolvedCount++;
    }

    return {
      resolved: resolvedCount,
    };
  },
});
