import { internalMutation, internalQuery } from "./_generated/server";

export const expireInterviewSprints = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Get all users with active sprint
    const allUsers = await ctx.db.query("users").take(1000);

    const expiredUsers = allUsers.filter(user =>
      user.sprintExpiresAt &&
      user.sprintExpiresAt <= now &&
      user.subscriptionTier !== "free"
    );

    console.log(`[Cron] Found ${expiredUsers.length} expired subscriptions`);

    for (const user of expiredUsers) {
      await ctx.db.patch(user._id, {
        subscriptionTier: "free",
        sprintExpiresAt: undefined,
        credits: 0,
        lastExpiredTier: user.subscriptionTier, // Save for popup
        planExpirationPopupShown: false, // Trigger popup on next login
        planExpirationEmailSent: false, // Trigger email workflow
      });

      console.log(`[Cron] Expired plan ${user.subscriptionTier} for user ${user.email}`);

      // Simulate Email Sending
      // In a real app: await sendEmail({ to: user.email, template: "plan_expired" });
      console.log(`[Email Mock] Sending 'Plan Expired & Renew?' email to ${user.email}`);
    }

    return { expired: expiredUsers.length };
  },
});
