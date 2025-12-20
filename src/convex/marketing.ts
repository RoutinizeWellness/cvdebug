"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "resend";
import { Id } from "./_generated/dataModel";

// Helper to get Resend instance
const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("RESEND_API_KEY not set");
    return null;
  }
  return new Resend(key);
};

const FROM_EMAIL = "CVDebug <noreply@cvdebug.com>";

// Email #1: Welcome + What to Expect (Trigger: Signup)
export const sendOnboardingEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    variant: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    
    const subject = "👋 Welcome to CVDebug (Your First Step)";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${firstName},</p>
        <p>Thanks for joining. You're here because you want to stop sending resumes into black holes.</p>
        
        <h3>How CVDebug Works:</h3>
        <ol>
          <li>Upload your PDF.</li>
          <li>Our AI simulates an ATS (Applicant Tracking System).</li>
          <li>We tell you exactly what to delete and what to add.</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            🚀 Run your first free scan here
          </a>
        </div>
        
        <p><strong>Tip:</strong> Use the same PDF you send to companies.</p>
        
        <p>Best regards,<br>The CVDebug Team</p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: args.email,
        subject,
        html,
      });
      console.log(`Sent Email #1 (Onboarding) to ${args.email}`);
    } catch (error) {
      console.error("Failed to send Email #1:", error);
    }
  },
});

// Email #2: The "Nudge" (Trigger: 24h without scanning)
export const sendActivationReminderEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    const subject = "⏳ Did you forget to scan your resume?";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${firstName},</p>
        <p>I noticed you created your account but haven't uploaded your resume yet.</p>
        <p>It only takes 10 seconds to know if your format is readable by hiring robots. Better to know now than after receiving 50 rejections.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Scan my resume now
          </a>
        </div>
        
        <p>Best regards,<br>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #2 (Activation Reminder) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #2:", error); }
  },
});

// Email #3: Parsing Error Detected (0% Score)
export const sendParsingErrorEmail = internalAction({
  args: { 
    email: v.string(), 
    name: v.optional(v.string()),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    const subject = "⚠️ Alert: Your file cannot be read (0% Score)";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${firstName},</p>
        <p>Your last scan resulted in a score of <strong style="color: #ef4444;">0%</strong>.</p>
        
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #991b1b;">⚠️ Don't panic.</p>
          <p style="margin: 8px 0 0 0; color: #7f1d1d;">This doesn't mean your experience is bad, it means your file format is corrupted (Encoding Error).</p>
        </div>
        
        <p><strong>If you had sent this file to a real company, you would have been automatically rejected.</strong></p>
        
        <h3>How to fix it:</h3>
        <ol>
          <li>Open your PDF in Chrome/Edge.</li>
          <li>Press <strong>Print (Ctrl+P)</strong> → "Save as PDF".</li>
          <li>Upload that new file.</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Try again here
          </a>
        </div>
        
        <p>Best regards,<br>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #3 (Parsing Error) to ${args.email}`);
    } catch (error) { 
      console.error("Failed to send Email #3:", error); 
    }
  },
});

// Email #3b: Last Chance (Trigger: 72h sin uso) - REMOVED, not in new spec
export const sendActivationLastChanceEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = "Last chance: Free ATS scan expires soon";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>${firstName},</p>
        <p>Your free ATS scan expires in 24 hours.</p>
        <p>If you're job hunting, don't let it go to waste.</p>
        <p>Quick check: <a href="https://resume-ats-optimizer.convex.site/dashboard">https://resume-ats-optimizer.convex.site/dashboard</a></p>
        <p>Takes 2 minutes. Could explain why you're not getting callbacks.</p>
        <p>The CVDebug Team</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">P.S. After expiry, scans are $4.99. Use your free one while you can!</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #3 (Last Chance) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #3:", error); }
  },
});

// Email #4: Recovery Email (1h after free scan, details not unlocked)
export const sendRecoveryEmail = internalAction({
  args: { 
    email: v.string(), 
    name: v.optional(v.string()), 
    score: v.number(),
    totalErrors: v.number(),
    firstError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = `⚠️ Your resume scored ${args.score}% - Don't let ATS reject you`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Your analysis is complete.</p>
        
        <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400e;">Result: ${args.score}/100</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; color: #92400e;">Critical Errors: ${args.totalErrors}</p>
        </div>

        <p>We've detected that you're missing essential keywords for the position. Your full report is locked.</p>
        
        <p><strong>Unlock it for the price of a coffee ($4.99) and stop losing opportunities.</strong></p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?unlock=true" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Unlock Report
          </a>
        </div>

        <p style="font-size: 12px; color: #666; text-align: center;">One-time payment • No subscription • Instant access</p>
        
        <p>Best regards,<br>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #4 (Post Scan) to ${args.email}`);
    } catch (error) { 
      console.error("Failed to send Email #4:", error); 
    }
  },
});

// Email #4: Post Free-Scan (Trigger: Usaron free scan)
export const sendPostScanEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()), score: v.number() },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = `Your ATS score: ${args.score}% - here's what it means`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>You scanned your resume and got <strong>${args.score}% ATS compatibility</strong>.</p>
        <p>Here's what that means:</p>
        <ul style="list-style: none; padding-left: 0;">
          <li>📊 0-50%: High risk of auto-rejection</li>
          <li>📊 51-70%: Might get through, but not optimized</li>
          <li>📊 71-85%: Good chance of passing ATS</li>
          <li>📊 86-100%: Excellent ATS compatibility</li>
        </ul>
        <p><strong>Your score: ${args.score}%</strong></p>
        <p>The free preview showed you have a problem.</p>
        <p>The paid version ($4.99) shows exactly how to fix it:</p>
        <ul>
          <li>✅ List of missing keywords</li>
          <li>✅ Where to add them</li>
          <li>✅ Format issues to fix</li>
          <li>✅ Priority ranking</li>
        </ul>
        <p>Want to see what's blocking you?</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?plan=single_scan" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Upgrade for $4.99</a>
        </div>
        <p>Questions? Reply to this email.</p>
        <p>The ResumeATS Team</p>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">P.S. Most users improve their score by 15-25% after implementing fixes.</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #4 (Post Scan) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #4:", error); }
  },
});

// Email #5: Value Reminder (Trigger: 48h después, no upgrade)
export const sendValueReminderEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()), score: v.number() },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = `${firstName}, still at ${args.score}%?`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>You checked your ATS score 2 days ago: <strong>${args.score}%</strong></p>
        <p>Quick question: Did you make any changes to your resume?</p>
        <p>If you're still job hunting and want to improve that score, here's what the full analysis shows:</p>
        <ul>
          <li>Exact keywords you're missing</li>
          <li>Which sections to update</li>
          <li>Format issues ATS can't read</li>
          <li>Step-by-step fixes</li>
        </ul>
        <p>$4.99 for the full breakdown.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?plan=single_scan" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">See full analysis</a>
        </div>
        <p>Or let me know what would make this more useful!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #5 (Value Reminder) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #5:", error); }
  },
});

// Email #6: Discount (Trigger: 7 días, no upgrade)
export const sendDiscountEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    const subject = "50% off your ATS analysis (24h only)";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>${firstName},</p>
        <p>You scanned your resume a week ago but haven't upgraded.</p>
        <p>I'm offering 50% off for the next 24 hours:</p>
        <p><strong>$4.99 → $2.50</strong></p>
        <p>Use code: <strong>WEEK50</strong></p>
        <p>This shows:</p>
        <ul>
          <li>✅ All missing keywords</li>
          <li>✅ Specific fixes</li>
          <li>✅ Priority order</li>
        </ul>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?plan=single_scan&discount=WEEK50" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Claim 50% discount</a>
        </div>
        <p>Expires: ${dateString}</p>
        <p>If you're not interested, no worries - just let me know what would be more helpful!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #6 (Discount) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #6:", error); }
  },
});

// Email #7: Win-Back (Trigger: 30 días inactivo)
export const sendWinBackEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = "Miss you! Here's what's new";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>Haven't seen you in a while!</p>
        <p>Since you last checked, we've added:</p>
        <ul>
          <li>LinkedIn Profile Analysis</li>
          <li>Improved Keyword Matching</li>
        </ul>
        <p>Your free scan is still waiting if you want to try again: <a href="https://resume-ats-optimizer.convex.site/dashboard">https://resume-ats-optimizer.convex.site/dashboard</a></p>
        <p>Or if you had issues before, reply and let me know how I can help!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Email #7 (Win-Back) to ${args.email}`);
    } catch (error) { console.error("Failed to send Email #7:", error); }
  },
});

// Email #8: Purchase Confirmation
export const sendPurchaseConfirmationEmail = internalAction({
  args: { email: v.string(), name: v.optional(v.string()), plan: v.string(), credits: v.number() },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) {
      console.error(`[Email] Failed to send purchase confirmation to ${args.email}: RESEND_API_KEY not configured`);
      return;
    }

    const firstName = args.name?.split(" ")[0] || "Job Seeker";
    const subject = "Purchase Confirmed! 🚀";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hey ${firstName},</p>
        <p>Thanks for your purchase!</p>
        <p>You've successfully upgraded to the <strong>${args.plan.replace("_", " ")}</strong> plan.</p>
        <p>We've added <strong>${args.credits} credits</strong> to your account.</p>
        <p>You can now scan your resume and get detailed feedback to beat the ATS.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
        </div>
        <p>Good luck with your job search!</p>
        <p>The ResumeATS Team</p>
      </div>
    `;

    try {
      const result = await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`[Email] ✅ Purchase confirmation sent successfully to ${args.email}`, result);
    } catch (error) { 
      console.error(`[Email] ❌ Failed to send purchase confirmation to ${args.email}:`, error); 
    }
  },
});

// NEW: Email for users who scanned but didn't unlock (5 days later)
export const sendConversionFollowUpEmail = internalAction({
  args: { 
    email: v.string(), 
    name: v.optional(v.string()), 
    score: v.number(),
    errorCount: v.number(),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    const subject = `Your resume still has issues (Score: ${args.score}/100)`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${firstName},</p>
        
        <p>I noticed you scanned your resume but didn't unlock the full report.</p>
        
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #991b1b;">⚠️ Your Score: ${args.score}/100</p>
          <p style="margin: 8px 0 0 0; color: #7f1d1d;">You still have ${args.errorCount} errors that recruiters will see.</p>
        </div>

        <p><strong>Is it worth losing the job over $5?</strong></p>
        
        <p>Unlock now and discover:</p>
        <ul>
          <li>✅ The complete list of ${args.errorCount} errors</li>
          <li>✅ How to fix each one step by step</li>
          <li>✅ Missing keywords you need</li>
          <li>✅ Format issues blocking your resume</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?unlock=true" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Unlock Report - $4.99
          </a>
        </div>

        <p style="font-size: 12px; color: #666; text-align: center;">One-time payment • No subscription • Instant access</p>
        
        <p>Best regards,<br>The CVDebug Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Conversion Follow-Up Email to ${args.email}`);
    } catch (error) { 
      console.error("Failed to send Conversion Follow-Up Email:", error); 
    }
  },
});

// NEW: Email for "The Abandoner" - signed up but no scans after 1 hour
export const sendInvisibilityAlertEmail = internalAction({
  args: { 
    email: v.string(), 
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    const subject = "⚠️ Your resume is invisible to recruiters";
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${firstName},</p>
        
        <p>You signed up for CVDebug an hour ago, but you haven't scanned your resume yet.</p>
        
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #991b1b;">⚠️ Here's the truth:</p>
          <p style="margin: 8px 0 0 0; color: #7f1d1d;">75% of resumes are rejected by ATS before a human ever sees them.</p>
        </div>

        <p><strong>Is your resume one of them?</strong></p>
        
        <p>You have <strong>1 free diagnostic scan</strong> waiting. It takes 30 seconds to find out if your resume is ATS-compatible or getting auto-rejected.</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Use My Free Scan Now
          </a>
        </div>

        <p style="font-size: 12px; color: #666; text-align: center;">This scan expires in 14 days. Don't waste it.</p>
        
        <p>Best regards,<br>The CVDebug Team</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent Invisibility Alert Email to ${args.email}`);
    } catch (error) { 
      console.error("Failed to send Invisibility Alert Email:", error); 
    }
  },
});

// NEW: Email for "The Power User" - used free scan but hasn't paid after 24h
export const sendFomoGapEmail = internalAction({
  args: { 
    email: v.string(), 
    name: v.optional(v.string()),
    score: v.number(),
    missingKeywords: v.number(),
  },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) return;

    const firstName = args.name?.split(" ")[0] || "there";
    const subject = `${firstName}, you're only ${args.missingKeywords} keywords away from the Green Zone`;
    
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hi ${firstName},</p>
        
        <p>Yesterday you scanned your resume and got a score of <strong>${args.score}%</strong>.</p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">📊 You're close to the 85%+ "Green Zone"</p>
          <p style="margin: 8px 0 0 0; color: #92400e;">But you're missing <strong>${args.missingKeywords} critical keywords</strong> that recruiters are searching for.</p>
        </div>

        <p><strong>Here's what happens next:</strong></p>
        <ul style="color: #4b5563;">
          <li>Your competitors are optimizing their resumes right now</li>
          <li>They're adding the exact keywords ATS systems scan for</li>
          <li>They're moving to the top of the candidate pile</li>
        </ul>

        <p style="font-size: 18px; font-weight: bold; color: #1f2937;">Don't let them take your interview slot.</p>

        <p>For $4.99, you'll get:</p>
        <ul style="color: #4b5563;">
          <li>✅ All ${args.missingKeywords} missing keywords revealed</li>
          <li>✅ Exact sections where to add them</li>
          <li>✅ ATS-optimized formatting guide</li>
          <li>✅ Instant score boost to 85%+</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://resume-ats-optimizer.convex.site/dashboard?unlock=true" style="background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Unlock My Keywords - $4.99
          </a>
        </div>

        <p style="font-size: 12px; color: #666; text-align: center;">One-time payment • No subscription • Instant access</p>
        
        <p>Best regards,<br>The CVDebug Team</p>
        
        <p style="font-size: 11px; color: #999; margin-top: 30px;">P.S. Every day you wait is another day your competition gets ahead. Secure your interview now.</p>
      </div>
    `;

    try {
      await resend.emails.send({ from: FROM_EMAIL, to: args.email, subject, html });
      console.log(`Sent FOMO Gap Email to ${args.email}`);
    } catch (error) { 
      console.error("Failed to send FOMO Gap Email:", error); 
    }
  },
});

// Test Email Function - Send test email
export const sendTestEmail = internalAction({
  args: { email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const resend = getResend();
    if (!resend) {
      console.error("RESEND_API_KEY not set");
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const testEmail = args.email || "tiniboti@gmail.com";
    const subject = "🧪 Test Email - CVDebug Email System";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ea580c;">✅ Email System Test - CVDebug</h2>
        <p>Hello,</p>
        <p>This is a test email from the CVDebug marketing system.</p>
        
        <div style="background: #f3f4f6; border-left: 4px solid #ea580c; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937;">📧 Configured Emails:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
            <li><strong>Email #1:</strong> Welcome + What to Expect (Trigger: Signup)</li>
            <li><strong>Email #2:</strong> The "Nudge" (Trigger: 24h without scanning)</li>
            <li><strong>Email #3:</strong> Parsing Error Detected (0% Score)</li>
            <li><strong>Email #4:</strong> Recovery Email (1h after free scan, details not unlocked)</li>
            <li><strong>Email #5:</strong> Value Reminder (48h later, no upgrade)</li>
            <li><strong>Email #6:</strong> Discount (7 days, no upgrade)</li>
            <li><strong>Email #7:</strong> Win-Back (30 days inactive)</li>
            <li><strong>Email #8:</strong> Purchase Confirmation</li>
          </ul>
        </div>

        <p><strong>System Status:</strong> ✅ Working correctly</p>
        <p><strong>Test Date:</strong> ${new Date().toLocaleString('en-US')}</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        
        <p style="font-size: 12px; color: #6b7280;">
          This is a test email automatically generated by the CVDebug system.<br>
          If you receive this email, it means Resend is configured correctly.
        </p>
      </div>
    `;

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: testEmail,
        subject,
        html,
      });
      console.log(`✅ Test email sent successfully to ${testEmail}`, result);
      return { success: true, messageId: result.data?.id, sentTo: testEmail };
    } catch (error) {
      console.error("❌ Failed to send test email:", error);
      return { success: false, error: String(error), attemptedEmail: testEmail };
    }
  },
});