/**
 * SMART EMAIL DISPATCHER
 *
 * Intelligent email sending that:
 * - Checks user tier and preferences
 * - Respects frequency limits
 * - Batches notifications into digests
 * - Prevents email saturation
 */

"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Smart wrapper around email sending
 * Always check this before sending ANY email
 */
export const dispatchEmail = internalAction({
  args: {
    userId: v.string(),
    category: v.string(),
    emailType: v.string(),
    subject: v.string(),
    emailData: v.any(), // Data to pass to email template
  },
  handler: async (ctx, args): Promise<{ sent: boolean; reason?: string }> => {
    // Check if user can receive this email
    const canSend: { canSend: boolean; reason?: string } = await ctx.runQuery(internal.emailPreferences.canSendEmail, {
      userId: args.userId,
      category: args.category,
    });

    if (!canSend.canSend) {
      console.log(`[SmartEmail] Skipping email: ${canSend.reason}`);
      return {
        sent: false,
        reason: canSend.reason,
      };
    }

    // Get user details
    const user = await ctx.runQuery(internal.users.getUserByTokenIdentifier as any, {
      tokenIdentifier: args.userId,
    });

    if (!user) {
      return { sent: false, reason: "User not found" };
    }

    // Route to appropriate email function based on type
    try {
      switch (args.category) {
        case 'APPLICATION_TRACKING':
          if (args.emailType === 'status_engagement') {
            await ctx.runAction(internal.marketing.sendStatusEngagementEmail, {
              email: user.email,
              name: user.name || 'User',
              ...args.emailData,
            });
          }
          break;

        // Add more email types here as needed
        default:
          console.log(`[SmartEmail] Unknown email type: ${args.emailType}`);
          return { sent: false, reason: "Unknown email type" };
      }

      // Log email sent for frequency tracking
      await ctx.runMutation(internal.emailPreferences.logEmailSent, {
        userId: args.userId,
        category: args.category,
        emailType: args.emailType,
        subject: args.subject,
      });

      console.log(`[SmartEmail] ✓ Sent ${args.category}/${args.emailType} to ${user.email}`);
      return { sent: true };

    } catch (error: any) {
      console.error(`[SmartEmail] Error sending email:`, error);
      return {
        sent: false,
        reason: error.message || "Email sending failed",
      };
    }
  },
});

/**
 * Send digest email (batch multiple notifications)
 * Reduces email fatigue by combining similar updates
 */
export const sendDigestEmail = internalAction({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<{ sent: boolean; reason?: string; notificationsCount?: number }> => {
    // Check if user can receive digest emails
    const canSend: { canSend: boolean; reason?: string } = await ctx.runQuery(internal.emailPreferences.canSendEmail, {
      userId: args.userId,
      category: 'RESUME_TIPS', // Use generic category for digests
    });

    if (!canSend.canSend) {
      console.log(`[Digest] Skipping: ${canSend.reason}`);
      return { sent: false, reason: canSend.reason };
    }

    // Get pending notifications
    const digest: {
      total: number;
      byCategory: Record<string, any[]>;
      shouldSendDigest: boolean
    } = await ctx.runQuery(internal.emailPreferences.getPendingDigest, {
      userId: args.userId,
    });

    if (!digest.shouldSendDigest) {
      console.log(`[Digest] Not enough notifications (${digest.total}) to send digest`);
      return { sent: false, reason: "Not enough notifications" };
    }

    // Get user details
    const user = await ctx.runQuery(internal.users.getUserByTokenIdentifier as any, {
      tokenIdentifier: args.userId,
    });

    if (!user) {
      return { sent: false, reason: "User not found" };
    }

    // Build digest email content
    const digestContent = buildDigestEmail(digest.byCategory, user.name || 'User');

    // Send digest (would integrate with actual email service here)
    console.log(`[Digest] Sending digest with ${digest.total} notifications to ${user.email}`);

    // Mark all notifications as emailed
    // (Would implement this in a mutation)

    // Log digest email
    await ctx.runMutation(internal.emailPreferences.logEmailSent, {
      userId: args.userId,
      category: 'RESUME_TIPS',
      emailType: 'daily_digest',
      subject: `Your CVDebug Daily Digest (${digest.total} updates)`,
    });

    return { sent: true, notificationsCount: digest.total };
  },
});

/**
 * Build digest email HTML
 */
function buildDigestEmail(
  groupedNotifications: Record<string, any[]>,
  userName: string
): string {
  let content = `<h2>Hi ${userName},</h2>`;
  content += `<p>Here's your daily digest of updates:</p>`;

  for (const [category, notifications] of Object.entries(groupedNotifications)) {
    content += `<h3>${formatCategoryName(category)}</h3>`;
    content += `<ul>`;

    notifications.forEach(notif => {
      content += `<li><strong>${notif.title}</strong>: ${notif.message}</li>`;
    });

    content += `</ul>`;
  }

  return content;
}

function formatCategoryName(category: string): string {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Tier-specific email helper
 * Ensures only tier-appropriate emails are sent
 */
export const sendTierSpecificEmail = internalAction({
  args: {
    userId: v.string(),
    freeContent: v.optional(v.any()),
    singleScanContent: v.optional(v.any()),
    interviewSprintContent: v.optional(v.any()),
    category: v.string(),
    emailType: v.string(),
  },
  handler: async (ctx, args): Promise<{ sent: boolean; reason?: string }> => {
    const user = await ctx.runQuery(internal.users.getUserByTokenIdentifier as any, {
      tokenIdentifier: args.userId,
    });

    if (!user) {
      return { sent: false, reason: "User not found" };
    }

    // Select content based on tier
    let emailData;
    switch (user.subscriptionTier) {
      case 'free':
        emailData = args.freeContent;
        break;
      case 'single_scan':
        emailData = args.singleScanContent;
        break;
      case 'interview_sprint':
        emailData = args.interviewSprintContent;
        break;
    }

    if (!emailData) {
      console.log(`[TierEmail] No content for ${user.subscriptionTier} tier`);
      return { sent: false, reason: "No content for user tier" };
    }

    // Dispatch the email
    return await ctx.runAction(internal.smartEmailDispatcher.dispatchEmail, {
      userId: args.userId,
      category: args.category,
      emailType: args.emailType,
      subject: emailData.subject,
      emailData,
    });
  },
});
