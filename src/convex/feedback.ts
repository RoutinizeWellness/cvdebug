/**
 * User Feedback System
 * Collects and stores user feedback for ML improvement using existing mlFeedback table
 */

import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const recordFeedback = internalMutation({
  args: {
    resumeId: v.id("resumes"),
    userId: v.string(),
    rating: v.number(),
    feedback: v.string(),
    helpful: v.boolean(),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    console.log(`[Feedback] Recording feedback - Resume: ${args.resumeId}, Rating: ${args.rating}/5`);

    // Map rating to feedback type using existing schema
    const feedbackType = args.helpful ? "helpful" : "not_helpful";

    const feedbackId = await ctx.db.insert("mlFeedback", {
      resumeId: args.resumeId,
      userId: args.userId,
      feedbackType,
      details: args.feedback,
      timestamp: args.timestamp
    });

    console.log(`[Feedback] Created feedback ${feedbackId} for user ${args.userId}`);

    return { success: true, feedbackId };
  }
});

export const submitFeedback = mutation({
  args: {
    resumeId: v.id("resumes"),
    rating: v.number(),
    feedback: v.optional(v.string()),
    helpful: v.optional(v.boolean()),
    accuracy: v.optional(v.union(
      v.literal("too_low"),
      v.literal("accurate"),
      v.literal("too_high")
    ))
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify resume belongs to user
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== user.tokenIdentifier) {
      throw new Error("Unauthorized");
    }

    // Determine feedback type based on accuracy
    let feedbackType: "score_too_high" | "score_too_low" | "helpful" | "not_helpful" = "helpful";
    if (args.accuracy === "too_high") {
      feedbackType = "score_too_high";
    } else if (args.accuracy === "too_low") {
      feedbackType = "score_too_low";
    } else if (args.helpful === false) {
      feedbackType = "not_helpful";
    }

    const feedbackId = await ctx.db.insert("mlFeedback", {
      resumeId: args.resumeId,
      userId: user.tokenIdentifier,
      feedbackType,
      details: args.feedback,
      originalScore: resume.score,
      timestamp: Date.now()
    });

    console.log(`[Feedback] User ${user.email} submitted feedback for resume ${args.resumeId}`);

    return { success: true, feedbackId };
  }
});

export const getFeedbackStats = query({
  args: {
    days: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const feedback = await ctx.db
      .query("mlFeedback")
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .take(1000);

    if (feedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        helpfulPercentage: 0,
        accuracyBreakdown: {
          too_low: 0,
          accurate: 0,
          too_high: 0
        }
      };
    }

    const helpfulCount = feedback.filter(f => f.feedbackType === "helpful").length;

    const accuracyBreakdown = {
      too_low: feedback.filter(f => f.feedbackType === "score_too_low").length,
      accurate: feedback.filter(f => f.feedbackType === "helpful").length,
      too_high: feedback.filter(f => f.feedbackType === "score_too_high").length
    };

    return {
      totalFeedback: feedback.length,
      averageRating: 0, // Not applicable with current schema
      helpfulPercentage: (helpfulCount / feedback.length) * 100,
      accuracyBreakdown
    };
  }
});
