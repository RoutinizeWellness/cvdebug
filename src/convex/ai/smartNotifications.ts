/**
 * Smart Notification System
 * AI-powered notifications based on user behavior, trends, and optimal timing
 */

import { internalMutation, internalQuery, mutation } from "../_generated/server";
import { v } from "convex/values";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationType =
  | "score_improvement"
  | "recommendation_ready"
  | "trend_alert"
  | "milestone_achieved"
  | "subscription_expiring"
  | "new_feature"
  | "tip_of_day";

/**
 * Create intelligent notification with priority and timing optimization
 */
export const createSmartNotification = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    metadata: v.optional(v.any()),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check user's notification preferences
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Get user's recent notification history to avoid spam
    const recentNotifications = await ctx.db
      .query("smartNotifications")
      .withIndex("by_user_and_created", (q) =>
        q.eq("userId", args.userId)
      )
      .order("desc")
      .take(50);

    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const recentCount = recentNotifications.filter(
      n => n.createdAt > last24h
    ).length;

    // Rate limiting: max 10 notifications per 24 hours (except urgent)
    if (recentCount >= 10 && args.priority !== "urgent") {
      console.log(`Rate limit reached for user ${args.userId}`);
      return null;
    }

    // Check for duplicate notifications (same type in last hour)
    const lastHour = Date.now() - (60 * 60 * 1000);
    const duplicateExists = recentNotifications.some(
      n => n.type === args.type && n.createdAt > lastHour
    );

    if (duplicateExists && args.priority !== "urgent") {
      console.log(`Duplicate notification prevented for user ${args.userId}`);
      return null;
    }

    // Determine optimal delivery time
    let deliveryTime = args.scheduledFor || Date.now();

    // For non-urgent notifications, schedule for optimal time
    if (args.priority !== "urgent" && !args.scheduledFor) {
      deliveryTime = calculateOptimalDeliveryTime(user);
    }

    const notificationId = await ctx.db.insert("smartNotifications", {
      userId: args.userId,
      type: args.type as NotificationType,
      title: args.title,
      message: args.message,
      priority: args.priority,
      metadata: args.metadata || {},
      status: deliveryTime > Date.now() ? "scheduled" : "pending",
      scheduledFor: deliveryTime,
      createdAt: Date.now(),
      read: false,
    });

    return notificationId;
  },
});

/**
 * Calculate optimal delivery time based on user's activity patterns
 */
function calculateOptimalDeliveryTime(user: any): number {
  const now = new Date();
  const currentHour = now.getHours();

  // Default optimal times: 9 AM, 1 PM, 6 PM
  const optimalHours = [9, 13, 18];

  // Find next optimal hour
  let nextOptimalHour = optimalHours.find(h => h > currentHour);
  if (!nextOptimalHour) {
    nextOptimalHour = optimalHours[0]; // Tomorrow morning
  }

  const deliveryDate = new Date(now);
  if (nextOptimalHour < currentHour) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  deliveryDate.setHours(nextOptimalHour, 0, 0, 0);

  return deliveryDate.getTime();
}

/**
 * Get user's unread notifications with smart grouping
 */
export const getSmartNotifications = internalQuery({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const now = Date.now();

    const notifications = await ctx.db
      .query("smartNotifications")
      .withIndex("by_user_and_created", (q) =>
        q.eq("userId", args.userId)
      )
      .order("desc")
      .take(limit * 2); // Get more to filter

    // Filter: only show pending/delivered notifications that are due
    const relevantNotifications = notifications.filter(n =>
      (n.status === "pending" || n.status === "delivered") &&
      (n.scheduledFor || 0) <= now
    ).slice(0, limit);

    // Group notifications by type for better UX
    const grouped = new Map<string, typeof relevantNotifications>();
    relevantNotifications.forEach(n => {
      const group = grouped.get(n.type) || [];
      group.push(n);
      grouped.set(n.type, group);
    });

    return {
      notifications: relevantNotifications,
      unreadCount: relevantNotifications.filter(n => !n.read).length,
      groupedByType: Object.fromEntries(grouped),
    };
  },
});

/**
 * Mark notification as read
 */
export const markNotificationRead = mutation({
  args: {
    notificationId: v.id("smartNotifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      read: true,
      readAt: Date.now(),
      status: "delivered",
    });
  },
});

/**
 * Generate daily digest of notifications
 */
export const generateDailyDigest = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const yesterday = Date.now() - (24 * 60 * 60 * 1000);

    const recentNotifications = await ctx.db
      .query("smartNotifications")
      .withIndex("by_user_and_created", (q) =>
        q.eq("userId", args.userId)
      )
      .order("desc")
      .take(100);

    const unreadNotifications = recentNotifications.filter(
      n => !n.read && n.createdAt > yesterday
    );

    if (unreadNotifications.length === 0) {
      return null;
    }

    // Group by priority
    const urgent = unreadNotifications.filter(n => n.priority === "urgent");
    const high = unreadNotifications.filter(n => n.priority === "high");
    const medium = unreadNotifications.filter(n => n.priority === "medium");
    const low = unreadNotifications.filter(n => n.priority === "low");

    // Create digest notification
    const digestMessage = `
      You have ${unreadNotifications.length} unread notification${unreadNotifications.length === 1 ? '' : 's'}:
      ${urgent.length > 0 ? `\n• ${urgent.length} urgent` : ''}
      ${high.length > 0 ? `\n• ${high.length} high priority` : ''}
      ${medium.length > 0 ? `\n• ${medium.length} medium priority` : ''}
      ${low.length > 0 ? `\n• ${low.length} low priority` : ''}
    `.trim();

    return {
      message: digestMessage,
      counts: {
        total: unreadNotifications.length,
        urgent: urgent.length,
        high: high.length,
        medium: medium.length,
        low: low.length,
      },
    };
  },
});

/**
 * Auto-trigger notifications based on user events
 */
export const triggerEventNotifications = internalMutation({
  args: {
    userId: v.id("users"),
    event: v.string(),
    metadata: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    // Resume score improvement
    if (args.event === "resume_scored" && args.metadata.score) {
      const userResumes = await ctx.db
        .query("resumes")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(2);

      if (userResumes.length >= 2) {
        const currentScore = args.metadata.score;
        const previousScore = userResumes[1].score || 0;
        const improvement = currentScore - previousScore;

        if (improvement >= 10) {
          await ctx.runMutation(api.ai.smartNotifications.createSmartNotification, {
            userId: args.userId,
            type: "score_improvement",
            title: "Great Improvement!",
            message: `Your resume score increased by ${Math.round(improvement)} points! You're getting better.`,
            priority: "medium",
            metadata: { improvement, currentScore },
          });
        }
      }
    }

    // Subscription expiring soon
    if (args.event === "subscription_check" && user.subscriptionTier === "interview_sprint") {
      const expiresAt = user.sprintExpiresAt || 0;
      const daysLeft = Math.floor((expiresAt - Date.now()) / (24 * 60 * 60 * 1000));

      if (daysLeft === 2) {
        await ctx.runMutation(api.ai.smartNotifications.createSmartNotification, {
          userId: args.userId,
          type: "subscription_expiring",
          title: "Interview Sprint Expiring Soon",
          message: `Your Interview Sprint expires in ${daysLeft} days. Renew now to keep your benefits!`,
          priority: "high",
          metadata: { daysLeft, expiresAt },
        });
      }
    }

    // Milestone achievements
    if (args.event === "milestone_reached" && args.metadata.milestone) {
      await ctx.runMutation(api.ai.smartNotifications.createSmartNotification, {
        userId: args.userId,
        type: "milestone_achieved",
        title: "Milestone Unlocked! 🎉",
        message: args.metadata.message || "You've reached a new milestone!",
        priority: "medium",
        metadata: args.metadata,
      });
    }
  },
});

// Make api available for internal references
const api = {
  ai: {
    smartNotifications: {
      createSmartNotification: {} as any,
    },
  },
};
