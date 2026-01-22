/**
 * Automated Cleanup and Maintenance Jobs
 * Handles data retention, old record deletion, and system optimization
 * COST-OPTIMIZED: Processes in small batches to prevent excessive spend
 */

import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Clean up old metrics data (older than 30 days)
 * BATCH SIZE: 50 records per run to prevent excessive costs
 */
export const cleanupOldMetrics = internalMutation({
  args: {},
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    // Process mlMetrics in batches of 50
    const oldMetrics = await ctx.db
      .query("mlMetrics")
      .withIndex("by_timestamp", (q) => q.lt("timestamp", thirtyDaysAgo))
      .take(50);

    let deletedCount = 0;
    for (const metric of oldMetrics) {
      await ctx.db.delete(metric._id);
      deletedCount++;
    }

    return {
      deleted: deletedCount,
      remaining: oldMetrics.length === 50, // More records to process
    };
  },
});

/**
 * Clean up old ML feedback data (older than 90 days)
 * BATCH SIZE: 50 records per run
 */
export const cleanupOldFeedback = internalMutation({
  args: {},
  handler: async (ctx) => {
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);

    const oldFeedback = await ctx.db
      .query("mlFeedback")
      .withIndex("by_timestamp", (q) => q.lt("timestamp", ninetyDaysAgo))
      .take(50);

    let deletedCount = 0;
    for (const feedback of oldFeedback) {
      await ctx.db.delete(feedback._id);
      deletedCount++;
    }

    return {
      deleted: deletedCount,
      remaining: oldFeedback.length === 50,
    };
  },
});

/**
 * Clean up failed resumes older than 7 days
 * BATCH SIZE: 50 records per run
 */
export const cleanupFailedResumes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    // Get old failed resumes in small batches
    const allResumes = await ctx.db
      .query("resumes")
      .order("desc")
      .take(200); // Sample to find failed ones

    const failedResumes = allResumes
      .filter(r => r.status === "failed" && r._creationTime < sevenDaysAgo)
      .slice(0, 50); // Batch limit

    let deletedCount = 0;
    for (const resume of failedResumes) {
      await ctx.db.delete(resume._id);
      deletedCount++;
    }

    return {
      deleted: deletedCount,
    };
  },
});

/**
 * Archive old completed resumes (older than 180 days)
 * Instead of deleting, marks them as archived for data retention
 * BATCH SIZE: 30 records per run
 */
export const archiveOldResumes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const sixMonthsAgo = Date.now() - (180 * 24 * 60 * 60 * 1000);

    const oldResumes = await ctx.db
      .query("resumes")
      .order("desc")
      .take(100);

    const resumesToArchive = oldResumes
      .filter(r =>
        r.status === "completed" &&
        r._creationTime < sixMonthsAgo &&
        !(r as any).archived
      )
      .slice(0, 30); // Batch limit

    let archivedCount = 0;
    for (const resume of resumesToArchive) {
      await ctx.db.patch(resume._id, {
        archived: true,
      } as any);
      archivedCount++;
    }

    return {
      archived: archivedCount,
    };
  },
});

/**
 * Clean up old waitlist entries (older than 90 days)
 * BATCH SIZE: 50 records per run
 */
export const cleanupInactiveWaitlist = internalMutation({
  args: {},
  handler: async (ctx) => {
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);

    const oldEntries = await ctx.db
      .query("waitlist")
      .order("desc")
      .take(100);

    const toDelete = oldEntries
      .filter(entry => entry._creationTime < ninetyDaysAgo)
      .slice(0, 50); // Batch limit

    let deletedCount = 0;
    for (const entry of toDelete) {
      await ctx.db.delete(entry._id);
      deletedCount++;
    }

    return {
      deleted: deletedCount,
    };
  },
});

/**
 * Update user last seen timestamps for active sessions
 * BATCH SIZE: 100 users per run
 */
export const updateActiveUserTimestamps = internalMutation({
  args: {
    userIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let updatedCount = 0;

    // Limit to 100 to prevent excessive operations
    const userIdsToUpdate = args.userIds.slice(0, 100);

    for (const userId of userIdsToUpdate) {
      try {
        const user = await ctx.db.get(userId);
        if (user) {
          await ctx.db.patch(userId, {
            lastSeen: now,
          });
          updatedCount++;
        }
      } catch (error) {
        // Skip if user doesn't exist
        console.warn(`Failed to update user ${userId}:`, error);
      }
    }

    return {
      updated: updatedCount,
    };
  },
});

/**
 * Comprehensive cleanup summary
 * Returns stats about cleanable data without deleting
 */
export const getCleanupStats = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = now - (90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = now - (180 * 24 * 60 * 60 * 1000);

    // Sample data to estimate cleanup potential
    const metrics = await ctx.db
      .query("mlMetrics")
      .withIndex("by_timestamp", (q) => q.lt("timestamp", thirtyDaysAgo))
      .take(100);

    const feedback = await ctx.db
      .query("mlFeedback")
      .withIndex("by_timestamp", (q) => q.lt("timestamp", ninetyDaysAgo))
      .take(100);

    const resumes = await ctx.db
      .query("resumes")
      .order("desc")
      .take(500);

    const failedResumes = resumes.filter(
      r => r.status === "failed" && r._creationTime < (now - 7 * 24 * 60 * 60 * 1000)
    );

    const archivableResumes = resumes.filter(
      r => r.status === "completed" && r._creationTime < sixMonthsAgo && !(r as any).archived
    );

    return {
      oldMetrics: metrics.length,
      oldFeedback: feedback.length,
      failedResumes: failedResumes.length,
      archivableResumes: archivableResumes.length,
      timestamp: now,
    };
  },
});
