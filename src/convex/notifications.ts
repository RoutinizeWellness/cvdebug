/**
 * Notification System
 * Handles real-time notifications for users and admins
 */

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const sendAnalysisComplete = internalMutation({
  args: {
    resumeId: v.id("resumes"),
    userId: v.string(),
    score: v.number(),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    console.log(`[Notification] Analysis complete - Resume: ${args.resumeId}, Score: ${args.score}`);

    // Store notification using existing schema
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      category: "analysis_complete",
      title: "Resume Analysis Complete",
      message: `Your resume analysis is ready! Score: ${args.score}/100`,
      timestamp: args.timestamp,
      read: false,
      emailSent: false
    });

    console.log(`[Notification] Created notification ${notificationId} for user ${args.userId}`);

    return { success: true, notificationId };
  }
});

export const notifyAdmins = internalMutation({
  args: {
    subject: v.string(),
    message: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"))
  },
  handler: async (ctx, args) => {
    console.log(`[Admin Notification] ${args.priority.toUpperCase()}: ${args.subject}`);

    // Log notification (actual implementation would send emails or create DB entries)
    console.log(`[Admin Notification] Subject: ${args.subject}`);
    console.log(`[Admin Notification] Message: ${args.message}`);

    return { success: true, notifiedCount: 1 };
  }
});
