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

export const sendAbandonmentEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    criticalIssuesCount: v.number(),
    resumeScore: v.number(),
  },
  handler: async (ctx, args) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("[Email] RESEND_API_KEY not configured");
      return;
    }

    const firstName = args.name?.split(" ")[0] || "there";

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "CVDebug <alerts@cvdebug.com>",
          to: args.email,
          subject: `⚠️ Invisibility Alert: Your Resume might be hidden from ATS`,
          html: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #ef4444; margin-bottom: 16px;">⚠️ Alert: Your Resume May Be Invisible</h2>
              
              <p>Hi ${firstName},</p>
              
              <p>We noticed you started a resume scan but didn't finish reviewing your results. Our initial check flagged potential <strong>"Invisibility Issues"</strong>.</p>
              
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; font-weight: 600; color: #991b1b;">What this means:</p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #7f1d1d;">
                  ATS robots often can't read resumes with complex formatting, hidden text layers, or graphics. If the robot can't read it, the recruiter never sees it.
                </p>
              </div>
              
              <p><strong>We detected ${args.criticalIssuesCount} critical issues</strong> that could be blocking your applications.</p>
              
              <p>Don't let a technical glitch cost you an interview. Check your "Robot View" now to see exactly what the ATS sees.</p>
              
              <a href="https://cvdebug.com/dashboard?resumeId=latest" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0;">
                View My Robot Report →
              </a>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
                - The CVDebug Team
              </p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        console.error("[Email] Abandonment email failed:", await response.text());
      } else {
        console.log(`[Email] Abandonment email sent to ${args.email}`);
      }
    } catch (error) {
      console.error("[Email] Error sending abandonment email:", error);
    }
  },
});