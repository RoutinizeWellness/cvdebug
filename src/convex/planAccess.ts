/**
 * Plan Access Control
 * Handles feature access verification and plan expiration
 */

import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Check if user's current plan is active
 */
export const checkPlanStatus = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { isActive: false, shouldDowngrade: false, tier: "free" };

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) return { isActive: false, shouldDowngrade: false, tier: "free" };

    const now = Date.now();

    // Check single_debug_fix plan
    if (user.subscriptionTier === "single_debug_fix") {
      // Single Debug Fix is used once scanned is performed
      if (user.singleDebugFixUsed) {
        return {
          isActive: false,
          shouldDowngrade: true,
          tier: user.subscriptionTier,
          reason: "single_debug_fix_exhausted",
        };
      }
      return { isActive: true, shouldDowngrade: false, tier: user.subscriptionTier };
    }

    // Check single_scan (24h pass)
    if (user.subscriptionTier === "single_scan") {
      if (user.sprintExpiresAt && user.sprintExpiresAt <= now) {
        return {
          isActive: false,
          shouldDowngrade: true,
          tier: user.subscriptionTier,
          reason: "24h_expired",
        };
      }
      return { isActive: true, shouldDowngrade: false, tier: user.subscriptionTier };
    }

    // Check interview_sprint (7 days)
    if (user.subscriptionTier === "interview_sprint") {
      if (user.sprintExpiresAt && user.sprintExpiresAt <= now) {
        return {
          isActive: false,
          shouldDowngrade: true,
          tier: user.subscriptionTier,
          reason: "7day_expired",
        };
      }
      return { isActive: true, shouldDowngrade: false, tier: user.subscriptionTier };
    }

    // Free tier is always active
    return { isActive: true, shouldDowngrade: false, tier: "free" };
  },
});

/**
 * Get user's feature access based on current plan
 */
export const getFeatureAccess = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        tier: "free" as const,
        features: {
          robotTerminalView: false,
          fullKeywordAnalysis: false,
          aiRewrite: 0,
          aiRewritesRemaining: 0,
          exportOptimizedCV: false,
          coverLetterGenerator: false,
          linkedinOptimizer: false,
          interviewBattlePlan: false,
        },
      };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) {
      return {
        tier: "free" as const,
        features: {
          robotTerminalView: false,
          fullKeywordAnalysis: false,
          aiRewrite: 0,
          aiRewritesRemaining: 0,
          exportOptimizedCV: false,
          coverLetterGenerator: false,
          linkedinOptimizer: false,
          interviewBattlePlan: false,
        },
      };
    }

    const now = Date.now();
    const tier = user.subscriptionTier;
    const aiRewritesUsed = user.aiRewritesUsed || 0;

    // Check if plan has expired
    const hasExpired =
      (tier === "single_scan" || tier === "interview_sprint") &&
      user.sprintExpiresAt &&
      user.sprintExpiresAt <= now;

    const isSingleDebugFixExhausted = tier === "single_debug_fix" && user.singleDebugFixUsed;

    // If expired or exhausted, return free features
    if (hasExpired || isSingleDebugFixExhausted) {
      return {
        tier: "free" as const,
        shouldDowngrade: true,
        features: {
          robotTerminalView: false,
          fullKeywordAnalysis: false,
          aiRewrite: 0,
          aiRewritesRemaining: 0,
          exportOptimizedCV: false,
          coverLetterGenerator: false,
          linkedinOptimizer: false,
          interviewBattlePlan: false,
        },
      };
    }

    // Return features based on active tier
    switch (tier) {
      case "single_debug_fix":
        return {
          tier,
          features: {
            robotTerminalView: true,
            fullKeywordAnalysis: true,
            aiRewrite: 1,
            aiRewritesRemaining: Math.max(0, 1 - aiRewritesUsed),
            exportOptimizedCV: true,
            coverLetterGenerator: false,
            linkedinOptimizer: false,
            interviewBattlePlan: false,
          },
        };

      case "single_scan":
        return {
          tier,
          features: {
            robotTerminalView: true,
            fullKeywordAnalysis: true,
            aiRewrite: 0,
            aiRewritesRemaining: 0,
            exportOptimizedCV: true,
            coverLetterGenerator: false,
            linkedinOptimizer: false,
            interviewBattlePlan: true,
          },
        };

      case "interview_sprint":
        return {
          tier,
          features: {
            robotTerminalView: true,
            fullKeywordAnalysis: true,
            aiRewrite: 999, // Unlimited
            aiRewritesRemaining: 999,
            exportOptimizedCV: true,
            coverLetterGenerator: true,
            linkedinOptimizer: true,
            interviewBattlePlan: true,
          },
        };

      default: // free
        return {
          tier: "free" as const,
          features: {
            robotTerminalView: false,
            fullKeywordAnalysis: false,
            aiRewrite: 0,
            aiRewritesRemaining: 0,
            exportOptimizedCV: false,
            coverLetterGenerator: false,
            linkedinOptimizer: false,
            interviewBattlePlan: false,
          },
        };
    }
  },
});

/**
 * Downgrade expired plans to free
 */
export const downgradePlanToFree = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const now = Date.now();
    const shouldDowngrade =
      (user.subscriptionTier === "single_scan" || user.subscriptionTier === "interview_sprint") &&
      user.sprintExpiresAt &&
      user.sprintExpiresAt <= now;

    const isSingleDebugFixExhausted =
      user.subscriptionTier === "single_debug_fix" && user.singleDebugFixUsed;

    if (shouldDowngrade || isSingleDebugFixExhausted) {
      await ctx.db.patch(user._id, {
        subscriptionTier: "free",
        planExpirationPopupShown: false, // Reset for next purchase
      });

      return {
        success: true,
        message: "Plan downgraded to free",
        previousTier: user.subscriptionTier,
      };
    }

    return { success: false, message: "Plan is still active" };
  },
});

/**
 * Mark single_debug_fix as used after scan
 */
export const markSingleDebugFixUsed = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    if (user.subscriptionTier !== "single_debug_fix") {
      throw new Error("User is not on single_debug_fix plan");
    }

    await ctx.db.patch(user._id, {
      singleDebugFixUsed: true,
    });

    return { success: true };
  },
});

/**
 * Increment AI rewrite usage
 */
export const incrementAIRewriteUsage = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const currentUsage = user.aiRewritesUsed || 0;

    // Check if user has rewrite access
    if (user.subscriptionTier === "single_debug_fix") {
      if (currentUsage >= 1) {
        throw new Error("AI rewrite limit reached for single_debug_fix plan");
      }
    } else if (user.subscriptionTier === "free") {
      throw new Error("AI rewrite not available on free plan");
    } else if (user.subscriptionTier === "single_scan") {
      throw new Error("AI rewrite not available on 24h pass");
    }
    // interview_sprint has unlimited, so no check needed

    await ctx.db.patch(user._id, {
      aiRewritesUsed: currentUsage + 1,
    });

    return { success: true, usedRewrites: currentUsage + 1 };
  },
});

/**
 * Mark plan expiration popup as shown
 */
export const markExpirationPopupShown = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      planExpirationPopupShown: true,
    });

    return { success: true };
  },
});

/**
 * Check if we should show expiration popup
 */
export const shouldShowExpirationPopup = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

    if (!user) return false;

    const now = Date.now();

    // Check if plan expired and popup not shown yet
    const hasExpired =
      (user.subscriptionTier === "single_scan" || user.subscriptionTier === "interview_sprint") &&
      user.sprintExpiresAt &&
      user.sprintExpiresAt <= now;

    const isSingleDebugFixExhausted =
      user.subscriptionTier === "single_debug_fix" && user.singleDebugFixUsed;

    if ((hasExpired || isSingleDebugFixExhausted) && !user.planExpirationPopupShown) {
      return {
        shouldShow: true,
        tier: user.subscriptionTier,
        reason: hasExpired ? "expired" : "exhausted",
      };
    }

    return { shouldShow: false };
  },
});

/**
 * Internal: Check and downgrade expired plans (called by cron)
 */
export const checkAndDowngradeExpiredPlans = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all users with expired plans
    const expiredUsers = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("subscriptionTier"), "single_scan"),
            q.eq(q.field("subscriptionTier"), "interview_sprint")
          ),
          q.lt(q.field("sprintExpiresAt"), now)
        )
      )
      .collect();

    let downgraded = 0;
    for (const user of expiredUsers) {
      await ctx.db.patch(user._id, {
        subscriptionTier: "free",
        planExpirationPopupShown: false,
      });
      downgraded++;
    }

    // Find single_debug_fix users who exhausted their usage
    const exhaustedSingleDebugFix = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("subscriptionTier"), "single_debug_fix"),
          q.eq(q.field("singleDebugFixUsed"), true)
        )
      )
      .collect();

    for (const user of exhaustedSingleDebugFix) {
      await ctx.db.patch(user._id, {
        subscriptionTier: "free",
        planExpirationPopupShown: false,
      });
      downgraded++;
    }

    return { success: true, downgraded };
  },
});
