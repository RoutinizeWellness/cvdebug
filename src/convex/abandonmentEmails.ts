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

export const scheduleLowScoreFollowUp = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    resumeId: v.id("resumes"),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const twentyFourHoursFromNow = Date.now() + (24 * 60 * 60 * 1000);
    
    await ctx.scheduler.runAt(twentyFourHoursFromNow, internalAny.abandonmentEmails.sendLowScoreFollowUp, {
      userId: args.userId,
      email: args.email,
      resumeId: args.resumeId,
      score: args.score,
    });

    console.log(`[LowScore] Scheduled tips email for ${args.email} in 24 hours`);
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

export const sendLowScoreFollowUp = internalAction({
  args: {
    userId: v.string(),
    email: v.string(),
    resumeId: v.id("resumes"),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internalAny.users.getUserByTokenIdentifier, {
      tokenIdentifier: args.userId,
    });

    if (!user) return;

    const resume = await ctx.runQuery(internalAny.resumes.getResumeInternal, {
      id: args.resumeId,
    });

    if (!resume) return;

    const totalErrors = (resume.formatIssues?.length || 0) + (resume.missingKeywords?.length || 0);
    const firstError = resume.formatIssues?.[0] 
      ? (typeof resume.formatIssues[0] === 'string' ? resume.formatIssues[0] : resume.formatIssues[0].issue)
      : resume.missingKeywords?.[0]
        ? (typeof resume.missingKeywords[0] === 'string' 
            ? `Missing keyword: ${resume.missingKeywords[0]}` 
            : `Missing keyword: ${resume.missingKeywords[0].keyword}`)
        : "Format and keyword optimization needed";

    await ctx.runAction(internalAny.marketing.sendRecoveryEmail, {
      email: args.email,
      name: user.name,
      score: args.score,
      totalErrors,
      firstError,
    });

    console.log(`[LowScore] Sent recovery email to ${args.email}`);
  },
});