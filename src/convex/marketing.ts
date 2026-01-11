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
        <h2 style="color: #1e293b; margin: 0 0 16px 0;">📋 Application Status Update</h2>
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
          subject: `📋 Update Your ${args.companyName} Application Status`,
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
        <h2 style="color: #dc2626; margin: 0 0 16px 0;">⚠️ Critical: Your Resume Can't Be Read by ATS</h2>
        <p>Hi ${firstName},</p>
        <p>As a Principal Technical Recruiter, I've reviewed your resume through our ATS simulation and identified <strong>critical parsing errors</strong> that will prevent your application from reaching human reviewers.</p>
        
        <div class="alert-box">
          <p style="margin: 0; font-weight: 600; color: #991b1b;">Technical Assessment:</p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px; color: #7f1d1d;">
            <li><strong>Image Trap Detected</strong> – Your PDF contains invisible text layers that ATS systems cannot parse</li>
            <li><strong>Format Corruption</strong> – Complex formatting is blocking automated text extraction</li>
            <li><strong>Hidden Content Risk</strong> – Critical qualifications may be invisible to our screening systems</li>
          </ul>
        </div>

        <p><strong>Professional Recommendation:</strong> I've prepared a detailed "Robot Vision" report showing exactly what our ATS sees versus what you intended. This is the same view every recruiter's system uses.</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">View ATS Analysis Report →</a>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">Immediate Action Required:</p>
          <ol style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;">
            <li>Review your "Robot View" to see what ATS systems actually extract</li>
            <li>Use our Sanitized Version tool to generate clean, parseable text</li>
            <li>Re-upload using our ATS-compliant template format</li>
          </ol>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 24px;">In 15+ years of technical recruiting, I've seen qualified candidates rejected due to parsing errors they never knew existed. Don't let a technical glitch cost you the interview.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>Your Principal Technical Recruiter AI</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">CVDebug Team</p>
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
          subject: "⚠️ URGENT: Your Resume is Unreadable to ATS Systems",
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
        <h2 style="color: #dc2626; margin: 0 0 16px 0;">🚨 Why You're Getting Ghosted by Recruiters</h2>
        <p>Hi ${firstName},</p>
        <p>I noticed your ATS score stopped at <strong>${args.resumeScore}%</strong>.</p>

        <div class="alert-box">
          <p style="margin: 0; font-weight: 600; color: #991b1b;">The Harsh Truth:</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #7f1d1d;">
            <strong>90% of candidates in this range never receive a single callback</strong>. It's not because they lack qualifications – it's because ATS systems make them invisible to recruiters.
          </p>
        </div>

        <div style="background: #7f1d1d; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #fca5a5;">Your Current ATS Score</p>
          <p style="margin: 0; font-size: 48px; font-weight: 800; color: #fecaca;">${args.resumeScore}%</p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #fca5a5;">Candidates who get interviews score 92%+</p>
        </div>

        <p>I've reduced the Single Scan to <strong>$4.99 for 24 hours only</strong> to help you stop being invisible.</p>

        <p><strong>I don't want your $5 if I can't get you the interview.</strong></p>

        <p>If you unlock your report today and don't get more responses within 7 days, I'll refund you. No questions asked.</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard?action=unlock&special=true" class="cta-button" style="background: #dc2626;">🔓 Unlock Report for $4.99 (24h Only)</a>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">Why I'm Reaching Out:</p>
          <p style="margin: 8px 0 0 0; font-size: 14px;">I see your talent. You have ${args.criticalIssuesCount} critical errors that are killing your applications. They're fixable in 5 minutes – but only if you know what they are.</p>
        </div>

        <div class="signature">
          <p style="margin: 0;"><strong>Albert</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">Founder, CVDebug</p>
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
          from: "Albert from CVDebug <cvdebug@cvdebug.com>",
          to: args.email,
          subject: `🚨 Your ${args.resumeScore}% Score: In the 90% Who Never Get Callbacks`,
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
          subject: "🎉 Welcome to CVDebug – Your ATS Safety Net",
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
          subject: `✅ Payment Confirmed – ${planName} Activated`,
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
        <h2 style="color: #f59e0b; margin: 0 0 16px 0;">💡 3 Quick Wins to Boost Your ${args.score}% ATS Score</h2>
        <p>Hi ${firstName},</p>
        <p>I've completed my technical review of your resume. Your current ATS score is <strong>${args.score}%</strong>. The good news? I've identified <strong>${args.totalErrors} specific, fixable issues</strong> that are holding you back from the interview stage.</p>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Top Priority Issue:</p>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">${args.firstError}</p>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">Recruiter's 3-Step Action Plan:</p>
          <ol style="margin: 12px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
            <li><strong>Quantify Every Achievement:</strong> Replace "Managed team" with "Led team of 5 engineers, increasing sprint velocity by 20% and reducing bug count by 35%". Numbers catch my attention immediately.</li>
            <li><strong>Match Job Description Keywords:</strong> Use our Keyword Sniper to identify the exact terms I'm scanning for. If the job posting mentions "React" 5 times and your resume mentions it once, you're missing opportunities.</li>
            <li><strong>Simplify Formatting:</strong> Remove columns, graphics, and tables. I need clean, parseable text. Use standard section headers: "EXPERIENCE", "EDUCATION", "SKILLS".</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">Apply These Fixes Now →</a>
        </div>

        <p style="font-size: 14px; color: #64748b;">In my experience, candidates who address these three areas see a 15-20 point score improvement within 24 hours. You're closer to the interview stage than you think.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>Your Principal Technical Recruiter AI</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">CVDebug Team</p>
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
          subject: `💡 How to Boost Your ${args.score}% ATS Score: 3 Quick Fixes`,
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
        <h2 style="color: #dc2626; margin: 0 0 16px 0;">⏰ Is Your Resume Still Invisible to Recruiters?</h2>
        <p>Hi ${firstName},</p>
        <p>You signed up for CVDebug 2 hours ago but haven't uploaded your resume yet.</p>
        
        <div class="alert-box">
          <p style="margin: 0; font-weight: 600; color: #991b1b;">Here's what you're missing:</p>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #7f1d1d;">
            Our <strong>Robot View</strong> shows you exactly what ATS systems see when they scan your resume. Most users discover their carefully formatted resume is completely unreadable to the robots that decide if you get an interview.
          </p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">The Reality:</p>
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #1e293b;">75% of resumes are rejected by ATS before a human ever sees them</p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/dashboard" class="cta-button">See What Robots See (Free) →</a>
        </div>

        <p style="font-size: 14px; color: #64748b;">It takes 2 minutes to upload and scan. You'll instantly see if your resume has "Image Traps" or parsing errors that are blocking your applications.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>Your Principal Technical Recruiter AI</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">CVDebug Team</p>
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
          subject: "⏰ Your Resume Might Be Invisible – Here's Why",
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

export const sendRoiEmail = internalAction({
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
        <h2 style="color: #f59e0b; margin: 0 0 16px 0;">💰 The $100,000 Risk You're Taking</h2>
        <p>Hi ${firstName},</p>
        <p>You uploaded your resume to CVDebug yesterday but haven't unlocked the full analysis yet.</p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: 700; color: #92400e; font-size: 18px;">Let's talk about ROI:</p>
          <p style="margin: 12px 0 0 0; color: #78350f; font-size: 14px; line-height: 1.6;">
            You're applying for jobs that pay $80,000-$120,000+ per year. If your resume has parsing errors (which 75% do), you're invisible to recruiters. That's potentially <strong>$100,000+ in lost salary</strong> because of a $5 formatting issue.
          </p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b; text-align: center;">The Math:</p>
          <div style="display: flex; justify-content: space-around; text-align: center;">
            <div>
              <p style="margin: 0; font-size: 32px; font-weight: 800; color: #ef4444;">$100k</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Lost Salary</p>
            </div>
            <div style="align-self: center; font-size: 24px; color: #64748b;">vs</div>
            <div>
              <p style="margin: 0; font-size: 32px; font-weight: 800; color: #10b981;">$4.99</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Full Fix</p>
            </div>
          </div>
        </div>

        <div class="info-box">
          <p style="margin: 0; font-weight: 600; color: #1e40af;">What You Get for $4.99:</p>
          <ul class="checklist">
            <li>All 15+ missing keywords revealed (not just 2)</li>
            <li>All 5+ format errors with exact fixes</li>
            <li>PDF sanitization tool to remove Image Traps</li>
            <li>Keyword gap analysis vs. job descriptions</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://cvdebug.com/pricing" class="cta-button">Unlock Full Report ($4.99) →</a>
        </div>

        <p style="font-size: 14px; color: #64748b;">This is a one-time investment that could unlock 10+ interviews. The ROI is 20,000:1.</p>

        <div class="signature">
          <p style="margin: 0;"><strong>Your Principal Technical Recruiter AI</strong></p>
          <p style="margin: 4px 0 0 0; font-size: 12px;">CVDebug Team</p>
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
          subject: "💰 $100k Lost vs $5 Fix – The Math You Need to See",
          html: emailTemplate(content),
        }),
      });

      if (!response.ok) {
        console.error("[Email] ROI email failed:", await response.text());
      } else {
        console.log(`[Email] ROI email sent to ${args.email}`);
      }
    } catch (error: any) {
      console.error("[Email] Error sending ROI email:", error.message);
    }
  },
});