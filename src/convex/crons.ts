import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

const crons = cronJobs();

// Query to find resumes created > 24h ago that haven't had an email sent
export const checkAndSendEmails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000); // Don't send for very old ones

    // Find resumes created between 24h and 48h ago that haven't been processed
    const resumes = await ctx.db
      .query("resumes")
      .filter((q) => 
        q.and(
          q.lt(q.field("_creationTime"), twentyFourHoursAgo),
          q.gt(q.field("_creationTime"), fortyEightHoursAgo),
          q.eq(q.field("marketingEmailSent"), undefined) // Only if not sent
        )
      )
      .take(20); // Process in batches

    for (const resume of resumes) {
      // Mark as sent immediately to prevent double sending if action fails
      await ctx.db.patch(resume._id, { marketingEmailSent: true });

      // Get user email
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", resume.userId))
        .unique();

      if (user && user.email && user.subscriptionTier === "free") {
        // Schedule the email sending action
        await ctx.scheduler.runAfter(0, internal.marketing.sendFollowUpEmail, {
          email: user.email,
          name: user.name,
          score: resume.score || 0,
          missingKeywordsCount: resume.missingKeywords?.length || 10,
          topMissingKeyword: resume.missingKeywords?.[0],
        });
      }
    }
  },
});

// Run every hour
crons.interval("send follow up emails", { hours: 1 }, internal.crons.checkAndSendEmails, {});

export default crons;
