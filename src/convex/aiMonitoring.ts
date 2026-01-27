import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Track AI service health and failures
export const logAIFailure = internalMutation({
  args: {
    service: v.string(), // "chatbot", "resumeAnalysis", "interviewPrep", etc.
    model: v.string(), // "gemini-2.0-flash", "deepseek-chat", "fallback"
    errorType: v.string(), // "timeout", "api_error", "parse_error", "rate_limit"
    errorMessage: v.optional(v.string()),
    userId: v.optional(v.string()),
    duration: v.optional(v.number()),
    usedFallback: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiServiceLogs", {
      service: args.service,
      model: args.model,
      errorType: args.errorType,
      errorMessage: args.errorMessage,
      userId: args.userId,
      duration: args.duration,
      usedFallback: args.usedFallback,
      timestamp: Date.now(),
    });
  },
});

export const logAISuccess = internalMutation({
  args: {
    service: v.string(),
    model: v.string(),
    userId: v.optional(v.string()),
    duration: v.number(),
    tokensUsed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiServiceLogs", {
      service: args.service,
      model: args.model,
      errorType: "success",
      userId: args.userId,
      duration: args.duration,
      usedFallback: false,
      timestamp: Date.now(),
    });
  },
});

// Get AI service health metrics (admin only)
export const getAIHealthMetrics = query({
  args: {
    timeRange: v.optional(v.number()), // milliseconds, default 24h
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Simple admin check - you can enhance this
    const isAdmin = user.email?.includes("admin") || user.email?.includes("cvdebug@outlook.com");
    if (!isAdmin) throw new Error("Admin access required");

    const timeRange = args.timeRange || 24 * 60 * 60 * 1000; // 24 hours
    const cutoff = Date.now() - timeRange;

    const logs = await ctx.db
      .query("aiServiceLogs")
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .collect();

    // Calculate metrics
    const totalRequests = logs.length;
    const successfulRequests = logs.filter((l) => l.errorType === "success").length;
    const failedRequests = totalRequests - successfulRequests;
    const fallbackUsage = logs.filter((l) => l.usedFallback).length;
    
    const avgDuration = logs.reduce((sum, l) => sum + (l.duration || 0), 0) / totalRequests || 0;

    // Group by service
    const byService: Record<string, { total: number; success: number; failed: number; fallback: number }> = {};
    logs.forEach((log) => {
      if (!byService[log.service]) {
        byService[log.service] = { total: 0, success: 0, failed: 0, fallback: 0 };
      }
      byService[log.service].total++;
      if (log.errorType === "success") byService[log.service].success++;
      else byService[log.service].failed++;
      if (log.usedFallback) byService[log.service].fallback++;
    });

    // Group by error type
    const byErrorType: Record<string, number> = {};
    logs.forEach((log) => {
      byErrorType[log.errorType] = (byErrorType[log.errorType] || 0) + 1;
    });

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      fallbackUsage,
      successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
      fallbackRate: totalRequests > 0 ? (fallbackUsage / totalRequests) * 100 : 0,
      avgDuration: Math.round(avgDuration),
      byService,
      byErrorType,
      recentFailures: logs
        .filter((l) => l.errorType !== "success")
        .slice(-10)
        .map((l) => ({
          service: l.service,
          model: l.model,
          errorType: l.errorType,
          errorMessage: l.errorMessage,
          timestamp: l.timestamp,
        })),
    };
  },
});

// User feedback on AI-generated content
export const submitAIFeedback = mutation({
  args: {
    featureType: v.union(
      v.literal("chatbot"),
      v.literal("resume_analysis"),
      v.literal("interview_prep"),
      v.literal("cover_letter"),
      v.literal("keyword_sniper"),
      v.literal("linkedin_optimizer"),
      v.literal("recruiter_dm")
    ),
    rating: v.union(
      v.literal("helpful"),
      v.literal("somewhat_helpful"),
      v.literal("not_helpful")
    ),
    wasAIGenerated: v.boolean(), // true if AI, false if fallback
    comment: v.optional(v.string()),
    relatedId: v.optional(v.string()), // resume ID, application ID, etc.
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.insert("aiFeedback", {
      userId: identity.subject,
      featureType: args.featureType,
      rating: args.rating,
      wasAIGenerated: args.wasAIGenerated,
      comment: args.comment,
      relatedId: args.relatedId,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

// Get feedback summary (admin only)
export const getAIFeedbackSummary = query({
  args: {
    featureType: v.optional(v.string()),
    timeRange: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const isAdmin = user.email?.includes("admin") || user.email?.includes("cvdebug@outlook.com");
    if (!isAdmin) throw new Error("Admin access required");

    const timeRange = args.timeRange || 7 * 24 * 60 * 60 * 1000; // 7 days
    const cutoff = Date.now() - timeRange;

    let feedback = await ctx.db
      .query("aiFeedback")
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .collect();

    if (args.featureType) {
      feedback = feedback.filter((f) => f.featureType === args.featureType);
    }

    const total = feedback.length;
    const helpful = feedback.filter((f) => f.rating === "helpful").length;
    const somewhatHelpful = feedback.filter((f) => f.rating === "somewhat_helpful").length;
    const notHelpful = feedback.filter((f) => f.rating === "not_helpful").length;

    const aiGenerated = feedback.filter((f) => f.wasAIGenerated).length;
    const fallbackGenerated = total - aiGenerated;

    const byFeature: Record<string, { total: number; helpful: number; notHelpful: number }> = {};
    feedback.forEach((f) => {
      if (!byFeature[f.featureType]) {
        byFeature[f.featureType] = { total: 0, helpful: 0, notHelpful: 0 };
      }
      byFeature[f.featureType].total++;
      if (f.rating === "helpful") byFeature[f.featureType].helpful++;
      if (f.rating === "not_helpful") byFeature[f.featureType].notHelpful++;
    });

    return {
      total,
      helpful,
      somewhatHelpful,
      notHelpful,
      helpfulRate: total > 0 ? (helpful / total) * 100 : 0,
      aiGenerated,
      fallbackGenerated,
      byFeature,
      recentComments: feedback
        .filter((f) => f.comment && f.comment.length > 0)
        .slice(-20)
        .map((f) => ({
          featureType: f.featureType,
          rating: f.rating,
          comment: f.comment,
          wasAIGenerated: f.wasAIGenerated,
          timestamp: f.timestamp,
        })),
    };
  },
});
