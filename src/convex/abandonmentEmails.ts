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
    // Schedule for 24 hours later
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

    // If user has improved their score significantly since then, maybe skip? 
    // For now, we'll just send the tips if the specific resume was low scoring.
    
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) return;

    const firstName = user.name?.split(" ")[0] || "there";

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "CVDebug <tips@cvdebug.com>",
          to: args.email,
          subject: `💡 3 Quick Tips to Boost Your ${args.score}% Score`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hi ${firstName},</h2>
              <p>We noticed your recent resume scan scored <strong>${args.score}%</strong>. Here are 3 quick wins to get you over 70%:</p>
              
              <ol>
                <li><strong>Quantify Your Impact:</strong> Add numbers to your bullet points. Instead of "Managed team", try "Managed team of 5, increasing output by 20%".</li>
                <li><strong>Match Keywords:</strong> Use our Keyword Sniper to find exactly what the ATS is looking for.</li>
                <li><strong>Simplify Formatting:</strong> Remove columns and graphics that confuse the robots.</li>
              </ol>
              
              <p><a href="https://cvdebug.com/dashboard" style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Mission Control</a></p>
            </div>
          `,
        }),
      });
      console.log(`[LowScore] Sent tips email to ${args.email}`);
    } catch (error) {
      console.error(`[LowScore] Failed to send email:`, error);
    }
  },
});