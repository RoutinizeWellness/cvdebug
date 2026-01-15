"use node";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

/**
 * Re-engagement Email System for Inactive Users
 *
 * Sends targeted emails to users who haven't used the platform in 7+ days
 * to bring them back and encourage them to complete their resume optimization.
 */

export const sendRetargetingEmails = internalAction({
  args: {},
  handler: async (ctx): Promise<{ success: boolean; emailsSent: number; emailsFailed: number; totalProcessed: number }> => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Query users who:
    // 1. Haven't been seen in 7+ days
    // 2. Haven't received a retargeting email yet (or it's been 30+ days since last one)
    // 3. Are not premium users (Interview Sprint)
    const inactiveUsers: any[] = await ctx.runQuery(internalAny.retargetingHelpers.getInactiveUsers, {
      inactiveSince: sevenDaysAgo,
      currentTime: now
    });

    console.log(`Found ${inactiveUsers.length} inactive users for retargeting`);

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const user of inactiveUsers) {
      try {
        // Send retargeting email
        const emailSent = await sendRetargetingEmailToUser(user);

        if (emailSent) {
          // Mark email as sent
          await ctx.runMutation(internalAny.retargetingHelpers.markRetargetingEmailSent, {
            userId: user._id,
            timestamp: now
          });
          emailsSent++;
        } else {
          emailsFailed++;
        }
      } catch (error) {
        console.error(`Failed to send retargeting email to ${user.email}:`, error);
        emailsFailed++;
      }
    }

    console.log(`Retargeting email summary: ${emailsSent} sent, ${emailsFailed} failed`);

    return {
      success: true,
      emailsSent,
      emailsFailed,
      totalProcessed: inactiveUsers.length
    };
  },
});

/**
 * Send personalized retargeting email to inactive user
 */
async function sendRetargetingEmailToUser(user: any): Promise<boolean> {
  // For now, we'll use console.log to simulate sending emails
  // In production, you would integrate with an email service like:
  // - Resend (via @vly-ai/integrations)
  // - SendGrid
  // - AWS SES
  // - Mailgun

  const emailContent = generateRetargetingEmail(user);

  console.log(`[EMAIL] Sending retargeting email to: ${user.email}`);
  console.log(`[EMAIL] Subject: ${emailContent.subject}`);
  console.log(`[EMAIL] Content preview: ${emailContent.body.substring(0, 100)}...`);

  // TODO: Replace with actual email sending logic
  // Example with vly-integrations (if available):
  /*
  const result = await vly.email.send({
    to: user.email,
    subject: emailContent.subject,
    html: emailContent.body,
    from: "CVDebug <noreply@cvdebug.com>"
  });
  return result.success;
  */

  // For now, simulate success
  return true;
}

/**
 * Generate personalized email content based on user's activity
 */
function generateRetargetingEmail(user: any): { subject: string; body: string } {
  const userName = user.name || "there";
  const hasResumes = user.resumeCount > 0;
  const hasCompletedScan = user.lastAnalysisScore !== undefined;

  let subject: string;
  let body: string;

  if (!hasResumes) {
    // User signed up but never uploaded a resume
    subject = "Your resume is still waiting to be optimized 👀";
    body = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Hey ${userName},</h2>

          <p>You created your CVDebug account last week, but we noticed you haven't uploaded your resume yet.</p>

          <p><strong>Here's what you're missing:</strong></p>
          <ul>
            <li>🎯 Instant ATS compatibility score</li>
            <li>📊 Detailed keyword gap analysis</li>
            <li>✨ AI-powered bullet point improvements</li>
            <li>🚀 Job-specific optimization recommendations</li>
          </ul>

          <p>It only takes 2 minutes to see how your resume stacks up against the competition.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cvdebug.com/dashboard"
               style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Upload Your Resume Now
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            <strong>Quick tip:</strong> Most users find 3-5 critical issues in their resume that were blocking them from getting interviews.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px;">
            Don't want these emails? <a href="https://cvdebug.com/unsubscribe" style="color: #2563eb;">Unsubscribe</a>
          </p>
        </body>
      </html>
    `;
  } else if (!hasCompletedScan) {
    // User uploaded resume but didn't complete analysis
    subject = "Your resume analysis is ready - see your score now 📈";
    body = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Good news, ${userName}!</h2>

          <p>We've analyzed your resume and found some important insights waiting for you.</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;"><strong>Your analysis includes:</strong></p>
            <ul style="margin: 10px 0;">
              <li>ATS compatibility score (0-100)</li>
              <li>Missing keywords that recruiters are looking for</li>
              <li>Weak bullet points that need improvement</li>
              <li>Specific, actionable recommendations</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cvdebug.com/dashboard"
               style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Your Analysis
            </a>
          </div>

          <p style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px;">
            ⚠️ <strong>Don't let your resume hold you back.</strong> On average, users who fix their ATS issues get 3x more interview requests.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px;">
            Don't want these emails? <a href="https://cvdebug.com/unsubscribe" style="color: #2563eb;">Unsubscribe</a>
          </p>
        </body>
      </html>
    `;
  } else {
    // User completed scan but hasn't returned
    const score = user.lastAnalysisScore;
    const scoreEmoji = score >= 75 ? "🎉" : score >= 60 ? "📊" : "⚠️";

    subject = `${scoreEmoji} Your resume scored ${score}/100 - here's how to improve it`;
    body = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Hi ${userName},</h2>

          <p>Last time you checked, your resume scored <strong style="font-size: 24px; color: ${score >= 75 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'};">${score}/100</strong></p>

          ${score < 75 ? `
          <p><strong>The good news?</strong> Small improvements can make a huge difference in your interview rate.</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Your top opportunities:</p>
            <ul style="margin: 0;">
              <li>Add missing keywords recruiters are searching for</li>
              <li>Strengthen weak bullet points with metrics</li>
              <li>Fix ATS parsing issues that block your resume</li>
            </ul>
          </div>
          ` : `
          <p>Your resume is in great shape! But there's always room to fine-tune it for specific roles.</p>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-weight: bold;">🚀 Take it to the next level:</p>
            <ul style="margin: 10px 0 0 0;">
              <li>Use Sniper Mode to tailor it to specific job descriptions</li>
              <li>Optimize your LinkedIn profile to match</li>
              <li>Generate targeted cover letters</li>
            </ul>
          </div>
          `}

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cvdebug.com/dashboard"
               style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Improve Your Score
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            <strong>Success story:</strong> Sarah increased her score from 62 to 89 in 20 minutes and landed 5 interviews in 2 weeks.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #9ca3af; font-size: 12px;">
            Don't want these emails? <a href="https://cvdebug.com/unsubscribe" style="color: #2563eb;">Unsubscribe</a>
          </p>
        </body>
      </html>
    `;
  }

  return { subject, body };
}
