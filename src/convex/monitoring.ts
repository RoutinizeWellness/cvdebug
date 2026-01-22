/**
 * System Monitoring
 * Tracks alerts, performance metrics, and system health using existing aiServiceLogs table
 */

import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const recordAlert = internalMutation({
  args: {
    alertType: v.string(),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    message: v.string(),
    metrics: v.any(),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    console.log(`[Monitoring] Recording alert - ${args.severity}: ${args.alertType}`);

    // Use aiServiceLogs table to track system alerts
    const alertId = await ctx.db.insert("aiServiceLogs", {
      service: "monitoring",
      model: args.alertType,
      errorType: args.severity,
      errorMessage: args.message,
      usedFallback: false,
      timestamp: args.timestamp
    });

    console.log(`[Monitoring] Alert logged as ${alertId}`);

    return { success: true, alertId };
  }
});

export const getRecentAlerts = query({
  args: {
    limit: v.optional(v.number()),
    severity: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ))
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    // Get monitoring logs
    let alertsQuery = ctx.db
      .query("aiServiceLogs")
      .filter((q) => q.eq(q.field("service"), "monitoring"))
      .order("desc");

    // Additional filter by severity (stored in errorType field)
    const alerts = await alertsQuery.take(limit * 2); // Get more to filter

    // Filter by severity if provided
    const filteredAlerts = args.severity
      ? alerts.filter(a => a.errorType === args.severity)
      : alerts;

    return filteredAlerts.slice(0, limit);
  }
});

export const resolveAlert = internalMutation({
  args: {
    alertId: v.id("aiServiceLogs"),
    resolvedBy: v.string()
  },
  handler: async (ctx, args) => {
    // Update the log entry with resolution info (stored in errorMessage)
    const alert = await ctx.db.get(args.alertId);
    if (alert) {
      const updatedMessage = `${alert.errorMessage || ''} [RESOLVED by ${args.resolvedBy}]`;
      await ctx.db.patch(args.alertId, {
        errorMessage: updatedMessage
      });
    }

    console.log(`[Monitoring] Alert ${args.alertId} resolved by ${args.resolvedBy}`);

    return { success: true };
  }
});
