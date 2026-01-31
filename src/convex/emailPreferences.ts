/**
 * SMART EMAIL PREFERENCE SYSTEM
 *
 * Prevents email saturation by:
 * - Respecting user subscription tier
 * - Batching multiple notifications
 * - Frequency limiting per category
 * - User-configurable preferences
 */

import { v } from "convex/values";
import { mutation, query, internalMutation, internalQuery } from "./_generated/server";

// Email categories with default frequencies
type UserTier = 'free' | 'single_scan' | 'interview_sprint';

export const EMAIL_CATEGORIES: Record<string, { maxPerWeek: number; tiers: UserTier[] }> = {
  // Free tier emails
  ONBOARDING: {
    maxPerWeek: 2,
    tiers: ['free', 'single_scan', 'interview_sprint']
  },
  RESUME_TIPS: {
    maxPerWeek: 1,
    tiers: ['free', 'single_scan', 'interview_sprint']
  },

  // Upgrade prompts (only for free users)
  UPGRADE_PROMPT: {
    maxPerWeek: 1,
    tiers: ['free']
  },

  // Premium features (only for paid users)
  APPLICATION_TRACKING: {
    maxPerWeek: 7, // Daily for active job seekers
    tiers: ['interview_sprint']
  },
  SKILL_GAP_ALERTS: {
    maxPerWeek: 2,
    tiers: ['single_scan', 'interview_sprint']
  },
  SUCCESS_METRICS: {
    maxPerWeek: 1,
    tiers: ['interview_sprint']
  },

  // Critical emails (all tiers, no limit)
  ACCOUNT_SECURITY: {
    maxPerWeek: 999,
    tiers: ['free', 'single_scan', 'interview_sprint']
  },
  BILLING: {
    maxPerWeek: 999,
    tiers: ['single_scan', 'interview_sprint']
  },
};

export type EmailCategory = keyof typeof EMAIL_CATEGORIES;

/**
 * Check if user can receive email of given category
 * Respects tier, frequency limits, and user preferences
 */
export const canSendEmail = internalQuery({
  args: {
    userId: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args): Promise<{
    canSend: boolean;
    reason?: string;
  }> => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.userId))
      .first();

    if (!user) {
      return { canSend: false, reason: "User not found" };
    }

    const category = args.category as EmailCategory;
    const categoryConfig = EMAIL_CATEGORIES[category];

    if (!categoryConfig) {
      return { canSend: false, reason: "Invalid category" };
    }

    // Check if user's tier is allowed for this email category
    if (!categoryConfig.tiers.includes(user.subscriptionTier as UserTier)) {
      return {
        canSend: false,
        reason: `Email category not available for ${user.subscriptionTier} tier`
      };
    }

    // Check frequency limits (last 7 days)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentEmails = await ctx.db
      .query("emailLog")
      .withIndex("by_user_and_timestamp", (q) =>
        q.eq("userId", args.userId).gt("timestamp", oneWeekAgo)
      )
      .filter((q) => q.eq(q.field("category"), category))
      .collect();

    if (recentEmails.length >= categoryConfig.maxPerWeek) {
      return {
        canSend: false,
        reason: `Frequency limit reached: ${recentEmails.length}/${categoryConfig.maxPerWeek} per week`
      };
    }

    // Check user's custom preferences (if they opted out)
    const customPrefs = user.emailPreferences as Record<string, boolean> | undefined;
    if (customPrefs && customPrefs[category] === false) {
      return {
        canSend: false,
        reason: "User opted out of this category"
      };
    }

    // Check global unsubscribe
    if (user.unsubscribedFromMarketing &&
      !['ACCOUNT_SECURITY', 'BILLING'].includes(category)) {
      return {
        canSend: false,
        reason: "User unsubscribed from marketing emails"
      };
    }

    return { canSend: true };
  },
});

/**
 * Log email sent (for frequency tracking)
 */
export const logEmailSent = internalMutation({
  args: {
    userId: v.string(),
    category: v.string(),
    emailType: v.string(),
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailLog", {
      userId: args.userId,
      category: args.category,
      emailType: args.emailType,
      subject: args.subject,
      timestamp: Date.now(),
      opened: false,
      clicked: false,
    });
  },
});

/**
 * Update user email preferences
 */
export const updateEmailPreferences = mutation({
  args: {
    category: v.optional(v.string()),
    enabled: v.optional(v.boolean()),
    unsubscribeAll: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user) throw new Error("User not found");

    if (args.unsubscribeAll) {
      // Unsubscribe from all marketing emails
      await ctx.db.patch(user._id, {
        unsubscribedFromMarketing: true,
      });
      return { success: true, message: "Unsubscribed from all marketing emails" };
    }

    if (args.category && args.enabled !== undefined) {
      // Update specific category preference
      const currentPrefs = (user.emailPreferences || {}) as Record<string, boolean>;
      currentPrefs[args.category] = args.enabled;

      await ctx.db.patch(user._id, {
        emailPreferences: currentPrefs,
      });

      return {
        success: true,
        message: `${args.enabled ? 'Enabled' : 'Disabled'} ${args.category} emails`
      };
    }

    throw new Error("Invalid arguments");
  },
});

/**
 * Get user's current email preferences
 */
export const getEmailPreferences = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    const preferences: Record<EmailCategory, boolean> = {} as any;
    const tier = user?.subscriptionTier || "free";
    const unsubscribed = user?.unsubscribedFromMarketing || false;

    // Build preferences object with defaults
    for (const [category, config] of Object.entries(EMAIL_CATEGORIES)) {
      const customPrefs = user?.emailPreferences as Record<string, boolean> | undefined;
      const isEnabledByUser = customPrefs?.[category] !== false; // Default true unless explicitly disabled
      const isAvailableForTier = config.tiers.includes(tier as UserTier);

      preferences[category as EmailCategory] = isEnabledByUser && isAvailableForTier;
    }

    return {
      preferences,
      unsubscribedFromMarketing: unsubscribed,
      tier,
    };
  },
});

/**
 * Get email stats for user (how many emails sent in last 7 days)
 */
export const getEmailStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentEmails = await ctx.db
      .query("emailLog")
      .withIndex("by_user_and_timestamp", (q) =>
        q.eq("userId", identity.tokenIdentifier).gt("timestamp", oneWeekAgo)
      )
      .collect();

    const byCategory: Record<string, number> = {};
    recentEmails.forEach(email => {
      byCategory[email.category] = (byCategory[email.category] || 0) + 1;
    });

    return {
      totalLastWeek: recentEmails.length,
      byCategory,
      openRate: recentEmails.filter(e => e.opened).length / Math.max(1, recentEmails.length),
      clickRate: recentEmails.filter(e => e.clicked).length / Math.max(1, recentEmails.length),
    };
  },
});

/**
 * Batch multiple notifications into single digest email
 * Reduces email fatigue by combining similar notifications
 */
export const getPendingDigest = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get notifications from last 24 hours that haven't been emailed
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    const pendingNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gt(q.field("timestamp"), oneDayAgo),
          q.eq(q.field("emailSent"), false)
        )
      )
      .collect();

    // Group by category
    const grouped: Record<string, typeof pendingNotifications> = {};
    pendingNotifications.forEach(notif => {
      const category = notif.category || 'general';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(notif);
    });

    return {
      total: pendingNotifications.length,
      byCategory: grouped,
      shouldSendDigest: pendingNotifications.length >= 3, // Only batch if 3+ notifications
    };
  },
});
