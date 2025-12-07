"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

export const sendFollowUpEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    missingKeywordsCount: v.number(),
    topMissingKeyword: v.optional(v.string()),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log("RESEND_API_KEY not set, skipping email");
      return;
    }

    const resend = new Resend(resendApiKey);
    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const keywordText = args.topMissingKeyword 
      ? `Your top issue: Missing "${args.topMissingKeyword}" keyword` 
      : "Your top issue: Missing critical keywords";

    try {
      await resend.emails.send({
        from: "ResumeATS <onboarding@resend.dev>", // Update this if you have a verified domain
        to: args.email,
        subject: `You're ${args.score}/100 on ATS compatibility`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <p>Hey ${firstName},</p>
            <p>You checked your ATS score yesterday: <strong>${args.score}/100</strong></p>
            <p>Good news: Most issues are fixable in 10 minutes.</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">${keywordText}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">(Free preview showed 1 of ${args.missingKeywordsCount} missing keywords)</p>
            </div>
            <p>Want to see all ${args.missingKeywordsCount} + how to fix them?</p>
            <a href="https://resume-ats-optimizer.convex.site/dashboard?plan=single_scan" style="display: inline-block; background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Get Full Analysis - $4.99</a>
            <p style="margin-top: 20px;">This helped 53 people get interviews this week.</p>
            <p>- The ResumeATS Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 30px;">P.S. Beta price expires in 3 days (47/100 spots claimed)</p>
          </div>
        `,
      });
      console.log(`Sent follow-up email to ${args.email}`);
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  },
});
