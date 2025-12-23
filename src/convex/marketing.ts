"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// Professional email template wrapper
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 32px 24px; text-align: center; }
    .logo { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; color: #1e293b; line-height: 1.6; }
    .cta-button { display: inline-block; background: #8b5cf6; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 16px 0; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }
    .cta-button:hover { background: #7c3aed; }
    .alert-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 4px; }
    .success-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px; }
    .info-box { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px; }
    .checklist { list-style: none; padding: 0; margin: 16px 0; }
    .checklist li { padding: 8px 0; padding-left: 28px; position: relative; }
    .checklist li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0; }
    .signature { margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">CVDebug</div>
    </div>
    ${content}
    <div class="footer">
      <p style="margin: 0 0 8px 0;">© 2024 CVDebug. All rights reserved.</p>
      <p style="margin: 0; font-size: 12px;">Your ATS Safety Net for Job Applications</p>
    </div>
  </div>
</body>
</html>
`;

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

    const firstName = args.name.split(" ")[0] || "there";

    const content = `
      <div class="content">
        <h2 style="color: #1e293b; margin: 0 0 16px 0;">Application Status Update</h2>
        <p>Hi ${firstName},</p>
        <p>We noticed you applied to <strong>${args.jobTitle}</strong> at <strong>${args.companyName}</strong> 48 hours ago.</p>
        
        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">Track Your Progress</p>
          <p style="margin: 8px 0 0 0; font-size: 14px;">Update your application status to unlock personalized next steps:</p>
        </div>

        <ul class="checklist">
          <li><strong>Interviewing</strong> – Get AI-powered interview prep tips</li>
          <li><strong>Accepted</strong> – Celebrate your win!</li>
          <li><strong>Rejected</strong> – Get insights on what to improve</li>
        </ul>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">Update Application Status</a>
        </div>

        <p>Keep pushing forward!</p>

        <div class="signature">
          <p style="margin: 0;"><strong>The CVDebug Team</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Your Principal Technical Recruiter AI</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: `Did you land the interview at ${args.companyName}?`,
          html: emailTemplate(content),
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

    const firstName = args.name?.split(" ")[0] || "there";

    const content = `
      <div class="content">
        <h2 style="color: #dc2626; margin: 0 0 16px 0;">⚠️ Critical: Resume Parsing Issues Detected</h2>
        <p>Hi ${firstName},</p>
        <p>Our ATS simulation has detected <strong>critical parsing errors</strong> in your resume that could prevent recruiters from seeing your qualifications.</p>
        
        <div class="alert-box">
          <p style="margin: 0; font-weight: 600; color: #991b1b;">What This Means:</p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px; color: #7f1d1d;">
            <li><strong>Image Trap Detected</strong> – Your PDF may contain invisible text layers that ATS systems cannot read</li>
            <li><strong>Format Issues</strong> – Complex formatting is blocking automated parsing</li>
            <li><strong>Hidden Content</strong> – Some of your experience may be invisible to recruiters</li>
          </ul>
        </div>

        <p><strong>The Fix:</strong> We've prepared a detailed analysis showing exactly what the ATS sees (and what it's missing).</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">View Robot Vision Report →</a>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">Quick Action Steps:</p>
          <ol style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;">
            <li>Review your "Robot View" to see what ATS systems actually read</li>
            <li>Use our Sanitized Version tool to extract clean text</li>
            <li>Re-upload using our ATS-safe template</li>
          </ol>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 24px;">Don't let a technical glitch cost you an interview. Most candidates never discover these issues until it's too late.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>The CVDebug Team</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Your Principal Technical Recruiter AI</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: "⚠️ URGENT: Your Resume Has Parsing Errors",
          html: emailTemplate(content),
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

    const content = `
      <div class="content">
        <h2 style="color: #dc2626; margin: 0 0 16px 0;">⚠️ Invisibility Alert: Your Resume May Be Hidden</h2>
        <p>Hi ${firstName},</p>
        <p>You started a resume scan but didn't finish reviewing your results. Our initial analysis flagged potential <strong>"Invisibility Issues"</strong> that could be blocking your applications.</p>
        
        <div class="alert-box">
          <p style="margin: 0; font-weight: 600; color: #991b1b;">Critical Findings:</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #7f1d1d;">
            We detected <strong>${args.criticalIssuesCount} critical issues</strong> that prevent ATS systems from reading your resume correctly. If the robot can't read it, the recruiter never sees it.
          </p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Your Current ATS Score</p>
          <p style="margin: 0; font-size: 48px; font-weight: 800; color: ${args.resumeScore >= 70 ? '#10b981' : args.resumeScore >= 50 ? '#f59e0b' : '#ef4444'};">${args.resumeScore}%</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">Industry Average: 62%</p>
        </div>

        <p><strong>What's at stake:</strong> ATS systems reject resumes with complex formatting, hidden text layers, or graphics before a human ever sees them. You could be perfectly qualified but invisible.</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard?resumeId=latest" class="cta-button">View My Robot Report →</a>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">Why This Matters:</p>
          <p style="margin: 8px 0 0 0; font-size: 14px;">75% of resumes are rejected by ATS before reaching human eyes. Don't let formatting be the reason you're overlooked.</p>
        </div>

        <div class="signature">
          <p style="margin: 0;"><strong>The CVDebug Team</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Your Principal Technical Recruiter AI</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: "⚠️ Invisibility Alert: Your Resume Might Be Hidden from ATS",
          html: emailTemplate(content),
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

export const sendOnboardingEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    variant: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[Email] Resend API key not configured");
      return;
    }

    const firstName = args.name?.split(" ")[0] || "there";

    const content = `
      <div class="content">
        <h2 style="color: #8b5cf6; margin: 0 0 16px 0;">Welcome to CVDebug! 🎉</h2>
        <p>Hi ${firstName},</p>
        <p>Thanks for joining CVDebug! You're now equipped with AI-powered tools to ensure your resume gets past the robots and into human hands.</p>
        
        <div class="success-box">
          <p style="margin: 0; font-weight: 600; color: #065f46;">What You Can Do Now:</p>
          <ul class="checklist">
            <li>Upload your resume for instant ATS analysis</li>
            <li>See exactly what robots see with "Robot View"</li>
            <li>Get AI-powered keyword optimization</li>
            <li>Generate tailored cover letters</li>
            <li>Track applications in Mission Control</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">Start Your First Scan →</a>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">Pro Tip:</p>
          <p style="margin: 8px 0 0 0; font-size: 14px;">Upload your resume and paste a job description to get a personalized keyword gap analysis. Most users find 5-10 critical missing keywords in their first scan.</p>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 24px;">Need help? Just reply to this email – we're here to help you land that interview.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>The CVDebug Team</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Your Principal Technical Recruiter AI</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: "Welcome to CVDebug – Your ATS Safety Net",
          html: emailTemplate(content),
        }),
      });

      if (!response.ok) {
        console.error("[Email] Onboarding email failed:", await response.text());
      } else {
        console.log(`[Email] Onboarding email sent to ${args.email}`);
      }
    } catch (error: any) {
      console.error("[Email] Error sending onboarding email:", error.message);
    }
  },
});

export const sendPurchaseConfirmationEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.union(v.literal("single_scan"), v.literal("interview_sprint")),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[Email] Resend API key not configured");
      return;
    }

    const firstName = args.name?.split(" ")[0] || "there";
    const planName = args.plan === "interview_sprint" ? "Interview Sprint (7 Days)" : "Single Scan";
    const isSprint = args.plan === "interview_sprint";

    const content = `
      <div class="content">
        <h2 style="color: #10b981; margin: 0 0 16px 0;">✅ Payment Confirmed!</h2>
        <p>Hi ${firstName},</p>
        <p>Your payment has been processed successfully. You now have full access to:</p>
        
        <div class="success-box">
          <h3 style="margin: 0 0 12px 0; color: #065f46;">${planName}</h3>
          ${isSprint ? `
            <ul class="checklist">
              <li>Unlimited resume scans for 7 days</li>
              <li>AI keyword suggestions with Bullet Point Sniper</li>
              <li>Cover letter generator</li>
              <li>LinkedIn profile optimizer</li>
              <li>Multi-model AI verification</li>
              <li>Priority support</li>
            </ul>
          ` : `
            <ul class="checklist">
              <li>1 complete resume analysis with full ATS report</li>
              <li>Keyword gap analysis</li>
              <li>Format integrity check</li>
              <li>PDF sanitization tool</li>
            </ul>
          `}
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">Go to Mission Control →</a>
        </div>

        ${isSprint ? `
          <div class="info-box">
            <p style="margin: 0; font-weight: 600; color: #1e40af;">Make the Most of Your Sprint:</p>
            <ol style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;">
              <li>Upload your master resume for baseline analysis</li>
              <li>Create projects for each target role</li>
              <li>Use Bullet Point Sniper to fill keyword gaps</li>
              <li>Generate tailored cover letters for each application</li>
              <li>Track your progress in the Kanban board</li>
            </ol>
          </div>
        ` : ''}

        <p style="font-size: 14px; color: #64748b; margin-top: 24px;">Questions? Reply to this email anytime – we're here to help you succeed.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>The CVDebug Team</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Your Principal Technical Recruiter AI</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: `Payment Confirmed – ${planName}`,
          html: emailTemplate(content),
        }),
      });

      if (!response.ok) {
        console.error("[Email] Purchase confirmation email failed:", await response.text());
      } else {
        console.log(`[Email] Purchase confirmation email sent to ${args.email}`);
      }
    } catch (error: any) {
      console.error("[Email] Error sending purchase confirmation email:", error.message);
    }
  },
});

export const sendRecoveryEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    score: v.number(),
    totalErrors: v.number(),
    firstError: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[Email] Resend API key not configured");
      return;
    }

    const firstName = args.name?.split(" ")[0] || "there";

    const content = `
      <div class="content">
        <h2 style="color: #f59e0b; margin: 0 0 16px 0;">💡 3 Quick Wins to Boost Your ${args.score}% Score</h2>
        <p>Hi ${firstName},</p>
        <p>Your recent resume scan scored <strong>${args.score}%</strong>. The good news? We found <strong>${args.totalErrors} fixable issues</strong> that are holding you back.</p>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Top Issue Detected:</p>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">${args.firstError}</p>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">3 Quick Wins to Get Over 70%:</p>
          <ol style="margin: 12px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
            <li><strong>Quantify Your Impact:</strong> Add numbers to your bullet points. Instead of "Managed team", try "Managed team of 5, increasing output by 20%".</li>
            <li><strong>Match Keywords:</strong> Use our Keyword Sniper to find exactly what the ATS is looking for in the job description.</li>
            <li><strong>Simplify Formatting:</strong> Remove columns, graphics, and tables that confuse ATS parsers.</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">Fix These Issues Now →</a>
        </div>

        <p style="font-size: 14px; color: #64748b;">Most users see a 15-20 point improvement after addressing these three areas. You're closer than you think!</p>

        <div class="signature">
          <p style="margin: 0;"><strong>The CVDebug Team</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Your Principal Technical Recruiter AI</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: `💡 3 Quick Tips to Boost Your ${args.score}% Score`,
          html: emailTemplate(content),
        }),
      });

      if (!response.ok) {
        console.error("[Email] Recovery email failed:", await response.text());
      } else {
        console.log(`[Email] Recovery email sent to ${args.email}`);
      }
    } catch (error: any) {
      console.error("[Email] Error sending recovery email:", error.message);
    }
  },
});

export const sendActivationReminderEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[Email] Resend API key not configured");
      return;
    }

    const firstName = args.name?.split(" ")[0] || "there";

    const content = `
      <div class="content">
        <h2 style="color: #8b5cf6; margin: 0 0 16px 0;">Your Free Resume Scan is Waiting</h2>
        <p>Hi ${firstName},</p>
        <p>You signed up for CVDebug but haven't uploaded your resume yet. Your free ATS analysis is ready whenever you are.</p>
        
        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">What You'll Discover in 2 Minutes:</p>
          <ul class="checklist">
            <li>Your ATS compatibility score (0-100)</li>
            <li>Critical parsing errors that block applications</li>
            <li>Missing keywords from your target job description</li>
            <li>Format issues that confuse robots</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">Upload My Resume →</a>
        </div>

        <p style="font-size: 14px; color: #64748b;">75% of resumes are rejected by ATS before a human sees them. Don't let yours be one of them.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>The CVDebug Team</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Your Principal Technical Recruiter AI</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: "Your Free Resume Scan is Waiting",
          html: emailTemplate(content),
        }),
      });

      if (!response.ok) {
        console.error("[Email] Activation reminder email failed:", await response.text());
      } else {
        console.log(`[Email] Activation reminder email sent to ${args.email}`);
      }
    } catch (error: any) {
      console.error("[Email] Error sending activation reminder email:", error.message);
    }
  },
});