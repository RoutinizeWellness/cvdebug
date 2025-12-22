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
          subject: `⚠️ ${args.criticalIssuesCount} Critical Issues Detected in Your Resume`,
          html: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #ef4444; margin-bottom: 16px;">⚠️ Urgent: ATS Rejection Risk Detected</h2>
              
              <p>Hi ${firstName},</p>
              
              <p>We just finished analyzing your resume and found <strong style="color: #ef4444;">${args.criticalIssuesCount} critical issues</strong> that will likely cause automatic rejection by ATS systems.</p>
              
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; font-weight: 600; color: #991b1b;">Your Current ATS Score: ${args.resumeScore}%</p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #7f1d1d;">Most companies auto-reject resumes below 70%</p>
              </div>
              
              <p><strong>Common issues we found:</strong></p>
              <ul style="color: #374151;">
                <li>Unreadable text layers (images/graphics)</li>
                <li>Missing critical keywords from job descriptions</li>
                <li>Formatting that breaks ATS parsers</li>
              </ul>
              
              <p>The good news? These are fixable in minutes with our Interview Sprint plan.</p>
              
              <a href="https://cvdebug.com/dashboard?upgrade=true" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 16px 0;">
                Fix My Resume Now →
              </a>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
                Don't let a fixable resume issue cost you your dream job.<br/>
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