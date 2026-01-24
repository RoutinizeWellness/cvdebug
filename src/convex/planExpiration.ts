/**
 * Plan Expiration Helper Functions
 * Internal queries and mutations for plan expiration management
 */

import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get users who need expiration email
 */
export const getUsersNeedingExpirationEmail = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find users with expired time-based plans who haven't received email
    const expiredTimeBased = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("subscriptionTier"), "single_scan"),
            q.eq(q.field("subscriptionTier"), "interview_sprint")
          ),
          q.lt(q.field("sprintExpiresAt"), now),
          q.neq(q.field("planExpirationEmailSent"), true)
        )
      )
      .collect();

    // Find single_debug_fix users who exhausted their usage
    const exhaustedSingleDebugFix = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("subscriptionTier"), "single_debug_fix"),
          q.eq(q.field("singleDebugFixUsed"), true),
          q.neq(q.field("planExpirationEmailSent"), true)
        )
      )
      .collect();

    return [...expiredTimeBased, ...exhaustedSingleDebugFix];
  },
});

/**
 * Mark expiration email as sent
 */
export const markExpirationEmailSent = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      planExpirationEmailSent: true,
    });

    return { success: true };
  },
});
