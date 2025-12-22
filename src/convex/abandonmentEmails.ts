import { v } from "convex/values";
import { internalMutation, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const internalAny = require("./_generated/api").internal;

export const scheduleAbandonmentEmail = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const twoHoursFromNow = Date.now() + (2 * 60 * 60 * 1000);
    
    await ctx.scheduler.runAt(twoHoursFromNow, internalAny.abandonmentEmails.sendAbandonmentEmail, {
      userId: args.userId,
      email: args.email,
      resumeId: args.resumeId,
    });

    console.log(`[Abandonment] Scheduled email for ${args.email} in 2 hours`);
  },
});

export const sendAbandonmentEmail = internalAction({
  args: {
    userId: v.string(),
    email: v.string(),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internalAny.users.getUserByTokenIdentifier, {
      tokenIdentifier: args.userId,
    });

    if (!user) return;

    if (user.subscriptionTier !== "free" || (user.credits && user.credits > 0)) {
      console.log(`[Abandonment] User ${args.email} already converted, skipping email`);
      return;
    }

    const resume = await ctx.runQuery(internalAny.resumes.getResumeInternal, {
      id: args.resumeId,
    });

    if (!resume) return;

    const criticalIssuesCount = (resume.formatIssues?.length || 0) + (resume.missingKeywords?.length || 0);

    await ctx.runAction(internalAny.marketing.sendAbandonmentEmail, {
      email: args.email,
      name: user.name,
      criticalIssuesCount,
      resumeScore: resume.score || 0,
    });

    console.log(`[Abandonment] Sent urgency email to ${args.email}`);
  },
});
