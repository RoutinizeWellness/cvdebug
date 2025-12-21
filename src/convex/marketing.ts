"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

export const sendStatusEngagementEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    companyName: v.string(),
    jobTitle: v.string(),
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[Email] Resend API key not configured");
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <noreply@cvdebug.com>",
          to: args.email,
          subject: `Did you land the interview at ${args.companyName}?`,
          html: `
            <h2>Hi ${args.name},</h2>
            <p>We noticed you applied to <strong>${args.jobTitle}</strong> at <strong>${args.companyName}</strong> 48 hours ago.</p>
            <p>Have you heard back? Update your application status to see your next steps:</p>
            <ul>
              <li>📧 <strong>Interviewing</strong> - Get AI-powered interview prep tips</li>
              <li>✅ <strong>Accepted</strong> - Celebrate your win!</li>
              <li>❌ <strong>Rejected</strong> - Get insights on what to improve</li>
            </ul>
            <p><a href="https://cvdebug.com/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Update Status</a></p>
            <p>Keep pushing forward!</p>
            <p>- The CVDebug Team</p>
          `,
        }),
      });

      if (!response.ok) {
        console.error("[Email] Failed to send status engagement email:", await response.text());
      } else {
        console.log(`[Email] Status engagement email sent to ${args.email}`);
      }
    } catch (error: any) {
      console.error("[Email] Error sending status engagement email:", error.message);
    }
  },
});

export const sendParsingErrorEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[Email] Resend API key not configured");
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <noreply@cvdebug.com>",
          to: args.email,
          subject: "⚠️ Your CV has parsing issues",
          html: `
            <h2>Hi ${args.name || "there"},</h2>
            <p>We detected issues parsing your resume. This could mean:</p>
            <ul>
              <li>🚨 <strong>Image Trap Detected</strong> - Your PDF may have invisible text layers</li>
              <li>📄 <strong>Format Issues</strong> - ATS systems might reject your CV</li>
            </ul>
            <p>Don't worry - we can help fix this!</p>
            <p><a href="https://cvdebug.com/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Details & Fix</a></p>
            <p>- The CVDebug Team</p>
          `,
        }),
      });

      if (!response.ok) {
        console.error("[Email] Failed to send parsing error email:", await response.text());
      } else {
        console.log(`[Email] Parsing error email sent to ${args.email}`);
      }
    } catch (error: any) {
      console.error("[Email] Error sending parsing error email:", error.message);
    }
  },
});