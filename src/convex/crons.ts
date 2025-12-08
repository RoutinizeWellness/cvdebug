import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

// Run daily at 9am UTC (check for users who signed up 24h ago)
crons.interval("send follow up emails", { hours: 24 }, internal.crons.checkAndSendFollowUps, {});

export const checkAndSendFollowUps = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    const twentyFiveHoursAgo = now - (25 * 60 * 60 * 1000);

    // Find resumes created between 24-25 hours ago that haven't had an email sent
    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_creation_time", (q) => 
        q.gt("_creationTime", twentyFiveHoursAgo).lt("_creationTime", twentyFourHoursAgo)
      )
      .filter((q) => q.eq(q.field("marketingEmailSent"), undefined))
      .take(20);

    for (const resume of resumes) {
      if (!resume.userId) continue;
      
      const user = await ctx.db
        .query("users")
        .filter(q => q.eq(q.field("tokenIdentifier"), resume.userId))
        .first();

      if (user && user.email) {
        // Mark as sent immediately to prevent duplicates
        await ctx.db.patch(resume._id, { marketingEmailSent: true });

        // Schedule email sending
        await ctx.scheduler.runAfter(0, internal.marketing.sendFollowUpEmail, {
          email: user.email,
          name: user.name,
          score: resume.score || 0,
          missingKeywordsCount: resume.missingKeywords?.length || 0,
          topMissingKeyword: resume.missingKeywords?.[0]?.keyword,
        });
      }
    }
  },
});

export default crons;