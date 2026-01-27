/**
 * Admin Statistics Queries
 * Real-time system statistics for the admin dashboard
 */

import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get overall system statistics
 */
export const getSystemStats = query({
  args: {},
  handler: async (ctx) => {
    // OPTIMIZED: Limit to prevent memory issues
    // Get total users (sample for large datasets)
    const users = await ctx.db.query("users").take(10000);
    const totalUsers = users.length;

    // Get active users (last 24 hours)
    const last24h = Date.now() - (24 * 60 * 60 * 1000);
    const activeUsers = users.filter(u => u.lastSeen && u.lastSeen > last24h).length;

    // Get total resumes
    const resumes = await ctx.db.query("resumes").order("desc").take(10000);
    const totalResumes = resumes.length;

    // Get resumes analyzed in last 24 hours
    const recentResumes = resumes.filter(r => r._creationTime > last24h).length;

    // Calculate growth rates (last 7 days vs previous 7 days)
    const last7days = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const last14days = Date.now() - (14 * 24 * 60 * 60 * 1000);

    const usersLast7 = users.filter(u => u._creationTime > last7days).length;
    const usersPrevious7 = users.filter(u => u._creationTime > last14days && u._creationTime <= last7days).length;
    const userGrowth = usersPrevious7 > 0
      ? ((usersLast7 - usersPrevious7) / usersPrevious7) * 100
      : 0;

    const resumesLast7 = resumes.filter(r => r._creationTime > last7days).length;
    const resumesPrevious7 = resumes.filter(r => r._creationTime > last14days && r._creationTime <= last7days).length;
    const resumeGrowth = resumesPrevious7 > 0
      ? ((resumesLast7 - resumesPrevious7) / resumesPrevious7) * 100
      : 0;

    // Calculate system health (based on success rates)
    const completedResumes = resumes.filter(r => r.status === "completed").length;
    const failedResumes = resumes.filter(r => r.status === "failed").length;
    const successRate = totalResumes > 0
      ? (completedResumes / (completedResumes + failedResumes)) * 100
      : 100;

    return {
      totalUsers,
      activeUsers,
      totalResumes,
      recentResumes,
      userGrowth: Math.round(userGrowth * 10) / 10,
      resumeGrowth: Math.round(resumeGrowth * 10) / 10,
      systemHealth: Math.round(successRate * 10) / 10,
      timestamp: Date.now(),
    };
  },
});

/**
 * Get subscription statistics
 */
export const getSubscriptionStats = query({
  args: {},
  handler: async (ctx) => {
    // OPTIMIZED: Limit for performance
    const users = await ctx.db.query("users").take(10000);

    const byTier = {
      free: users.filter(u => u.subscriptionTier === "free").length,
      single_scan: users.filter(u => u.subscriptionTier === "single_scan").length,
      interview_sprint: users.filter(u => u.subscriptionTier === "interview_sprint").length,
    };

    const totalPaying = byTier.single_scan + byTier.interview_sprint;
    const conversionRate = users.length > 0
      ? (totalPaying / users.length) * 100
      : 0;

    return {
      byTier,
      totalPaying,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };
  },
});

/**
 * Get recent activity
 */
export const getRecentActivity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get recent resumes
    const recentResumes = await ctx.db
      .query("resumes")
      .order("desc")
      .take(limit);

    // Get recent users
    const recentUsers = await ctx.db
      .query("users")
      .order("desc")
      .take(limit);

    return {
      recentResumes: recentResumes.map(r => ({
        id: r._id,
        title: r.title,
        userId: r.userId,
        score: r.score,
        createdAt: r._creationTime,
        status: r.status,
      })),
      recentUsers: recentUsers.map(u => ({
        id: u._id,
        email: u.email,
        name: u.name,
        subscriptionTier: u.subscriptionTier,
        createdAt: u._creationTime,
      })),
    };
  },
});

/**
 * Get performance metrics overview
 */
export const getPerformanceOverview = query({
  args: {},
  handler: async (ctx) => {
    const resumes = await ctx.db.query("resumes").take(1000);

    // Calculate average processing time
    const resumesWithDuration = resumes.filter(r => r.processingDuration);
    const avgProcessingTime = resumesWithDuration.length > 0
      ? resumesWithDuration.reduce((sum, r) => sum + (r.processingDuration || 0), 0) / resumesWithDuration.length
      : 0;

    // Calculate average score
    const resumesWithScore = resumes.filter(r => r.score);
    const avgScore = resumesWithScore.length > 0
      ? resumesWithScore.reduce((sum, r) => sum + (r.score || 0), 0) / resumesWithScore.length
      : 0;

    // Success rate
    const completedCount = resumes.filter(r => r.status === "completed").length;
    const failedCount = resumes.filter(r => r.status === "failed").length;
    const successRate = (completedCount + failedCount) > 0
      ? (completedCount / (completedCount + failedCount)) * 100
      : 100;

    return {
      avgProcessingTime: Math.round(avgProcessingTime),
      avgScore: Math.round(avgScore * 10) / 10,
      successRate: Math.round(successRate * 10) / 10,
      totalProcessed: resumes.length,
    };
  },
});

/**
 * Get error logs (recent failures)
 */
export const getErrorLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;

    const failedResumes = await ctx.db
      .query("resumes")
      .filter(q => q.eq(q.field("status"), "failed"))
      .order("desc")
      .take(limit);

    return failedResumes.map(r => ({
      id: r._id,
      title: r.title,
      userId: r.userId,
      createdAt: r._creationTime,
      processingDuration: r.processingDuration,
    }));
  },
});
