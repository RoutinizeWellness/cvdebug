import { internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Internal Query: Get inactive users eligible for retargeting
 */
export const getInactiveUsers = internalQuery({
  args: {
    inactiveSince: v.number(),
    currentTime: v.number()
  },
  handler: async (ctx, args) => {
    const thirtyDaysAgo = args.currentTime - (30 * 24 * 60 * 60 * 1000);

    // Get all users
    const allUsers = await ctx.db.query("users").collect();

    // Filter users who:
    // 1. Haven't been active in 7+ days (lastSeen < inactiveSince OR lastSeen is undefined)
    // 2. Haven't received retargeting email OR last email was 30+ days ago
    // 3. Are not Career Sprint users (we don't want to spam premium users)
    const inactiveUsers = allUsers.filter(user => {
      // Check if user is inactive (lastSeen is old or undefined)
      const isInactive = !user.lastSeen || user.lastSeen < args.inactiveSince;

      // Check if we can send retargeting email
      const canSendEmail = !user.retargetingEmail7dSent ||
        (user.lastRetargetingEmailSent && user.lastRetargetingEmailSent < thirtyDaysAgo);

      // Don't spam premium users
      const isNotPremium = user.subscriptionTier !== "interview_sprint";

      return isInactive && canSendEmail && isNotPremium;
    });

    // Get resume count and latest analysis score for each user
    const usersWithData = await Promise.all(
      inactiveUsers.map(async (user) => {
        // Count resumes for this user
        const resumes = await ctx.db
          .query("resumes")
          .withIndex("by_user", (q) => q.eq("userId", user.tokenIdentifier))
          .collect();

        // Get latest analysis
        const latestAnalysis = await ctx.db
          .query("resumes")
          .withIndex("by_user", (q) => q.eq("userId", user.tokenIdentifier))
          .order("desc")
          .first();

        return {
          ...user,
          resumeCount: resumes.length,
          lastAnalysisScore: latestAnalysis?.score,
        };
      })
    );

    return usersWithData;
  },
});

/**
 * Internal Mutation: Mark retargeting email as sent
 */
export const markRetargetingEmailSent = internalMutation({
  args: {
    userId: v.id("users"),
    timestamp: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      retargetingEmail7dSent: true,
      lastRetargetingEmailSent: args.timestamp
    });

    return { success: true };
  },
});
