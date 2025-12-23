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
      user.subscriptionTier === "interview_sprint"
    );

    console.log(`[Cron] Found ${expiredUsers.length} expired Interview Sprint subscriptions`);

    for (const user of expiredUsers) {
      await ctx.db.patch(user._id, {
        subscriptionTier: "free",
        sprintExpiresAt: undefined,
        credits: 0, // No credits after sprint expires
      });
      
      console.log(`[Cron] Expired Interview Sprint for user ${user.email}`);
    }

    return { expired: expiredUsers.length };
  },
});
