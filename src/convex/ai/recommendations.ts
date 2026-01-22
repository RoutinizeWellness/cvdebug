/**
 * Intelligent Recommendation System
 * Uses ML patterns and user behavior to provide personalized suggestions
 */

import { internalQuery, query, internalMutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Generate personalized resume improvement recommendations
 * Based on user's resume history, scores, and industry trends
 */
export const getPersonalizedRecommendations = query({
  args: {
    userId: v.id("users"),
    resumeId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    // Get user's resume history
    const userResumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);

    if (userResumes.length === 0) {
      return {
        recommendations: [],
        insights: {
          totalResumes: 0,
          avgScore: 0,
          improvement: 0,
        },
      };
    }

    // Calculate user's average score and trends
    const scores = userResumes
      .filter((r) => r.score !== undefined)
      .map((r) => r.score as number);

    const avgScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    // Calculate improvement trend
    const recentScores = scores.slice(0, 3);
    const olderScores = scores.slice(3, 6);
    const recentAvg = recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : avgScore;
    const olderAvg = olderScores.length > 0
      ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
      : avgScore;
    const improvement = recentAvg - olderAvg;

    // Get current resume for specific recommendations
    const currentResume = args.resumeId
      ? await ctx.db.get(args.resumeId)
      : userResumes[0];

    const recommendations: Array<{
      type: "critical" | "high" | "medium" | "low";
      category: string;
      title: string;
      description: string;
      impact: number;
      actionable: boolean;
    }> = [];

    if (currentResume && currentResume.status === "completed") {
      // Analyze ATS score
      if ((currentResume.atsScore || 0) < 70) {
        recommendations.push({
          type: "critical",
          category: "ATS Optimization",
          title: "Improve ATS Compatibility",
          description: "Your resume scores below 70% on ATS systems. Add more relevant keywords and improve formatting.",
          impact: 25,
          actionable: true,
        });
      }

      // Analyze keyword density
      if ((currentResume.keywordDensity || 0) < 0.03) {
        recommendations.push({
          type: "high",
          category: "Keywords",
          title: "Increase Keyword Relevance",
          description: "Your resume lacks industry-specific keywords. Add 5-7 more relevant terms for your target role.",
          impact: 20,
          actionable: true,
        });
      }

      // Analyze formatting
      if ((currentResume.formattingScore || 0) < 75) {
        recommendations.push({
          type: "medium",
          category: "Formatting",
          title: "Enhance Visual Structure",
          description: "Improve section headers, bullet points, and whitespace for better readability.",
          impact: 15,
          actionable: true,
        });
      }

      // Check for missing sections
      const parsedText = currentResume.parsedText || "";
      if (!parsedText.toLowerCase().includes("experience")) {
        recommendations.push({
          type: "critical",
          category: "Content",
          title: "Add Work Experience Section",
          description: "Your resume is missing a clear work experience section, which is essential for ATS systems.",
          impact: 30,
          actionable: true,
        });
      }

      // Check resume length
      const wordCount = parsedText.split(/\s+/).length;
      if (wordCount < 200) {
        recommendations.push({
          type: "high",
          category: "Content",
          title: "Expand Resume Content",
          description: "Your resume is too short. Aim for 400-600 words with detailed accomplishments and metrics.",
          impact: 18,
          actionable: true,
        });
      } else if (wordCount > 800) {
        recommendations.push({
          type: "medium",
          category: "Content",
          title: "Condense Resume Content",
          description: "Your resume may be too long. Focus on the most impactful achievements and remove redundancies.",
          impact: 12,
          actionable: true,
        });
      }

      // Check for quantifiable achievements
      const hasNumbers = /\d+/.test(parsedText);
      if (!hasNumbers) {
        recommendations.push({
          type: "high",
          category: "Impact",
          title: "Add Quantifiable Achievements",
          description: "Include specific numbers, percentages, or metrics to demonstrate your impact (e.g., '30% increase', '5 projects').",
          impact: 22,
          actionable: true,
        });
      }
    }

    // Industry-specific recommendations based on detected role
    if (currentResume && currentResume.targetRole) {
      const role = currentResume.targetRole.toLowerCase();

      if (role.includes("engineer") || role.includes("developer")) {
        recommendations.push({
          type: "medium",
          category: "Technical Skills",
          title: "Highlight Technical Stack",
          description: "Ensure your resume clearly lists programming languages, frameworks, and tools you've used.",
          impact: 16,
          actionable: true,
        });
      } else if (role.includes("manager") || role.includes("lead")) {
        recommendations.push({
          type: "medium",
          category: "Leadership",
          title: "Emphasize Leadership Experience",
          description: "Highlight team size, projects managed, and leadership accomplishments with specific metrics.",
          impact: 18,
          actionable: true,
        });
      } else if (role.includes("sales") || role.includes("business")) {
        recommendations.push({
          type: "medium",
          category: "Achievements",
          title: "Showcase Revenue Impact",
          description: "Include specific revenue numbers, deals closed, or business growth you've driven.",
          impact: 20,
          actionable: true,
        });
      }
    }

    // Behavioral recommendations based on user patterns
    if (userResumes.length > 3 && improvement < 0) {
      recommendations.push({
        type: "low",
        category: "Strategy",
        title: "Try a Different Approach",
        description: "Your recent resumes show declining scores. Consider a different format or focus on different strengths.",
        impact: 10,
        actionable: false,
      });
    }

    // Sort recommendations by impact (highest first)
    recommendations.sort((a, b) => b.impact - a.impact);

    return {
      recommendations: recommendations.slice(0, 8), // Return top 8
      insights: {
        totalResumes: userResumes.length,
        avgScore: Math.round(avgScore * 10) / 10,
        improvement: Math.round(improvement * 10) / 10,
        trend: improvement > 2 ? "improving" : improvement < -2 ? "declining" : "stable",
      },
    };
  },
});

/**
 * Get AI-powered next best actions for user
 */
export const getNextBestActions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return { actions: [] };

    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(5);

    const actions: Array<{
      priority: "high" | "medium" | "low";
      action: string;
      reason: string;
      link?: string;
    }> = [];

    // Check subscription tier and usage
    if (user.subscriptionTier === "free") {
      if (resumes.length >= 1) {
        actions.push({
          priority: "high",
          action: "Upgrade to Interview Sprint",
          reason: "Unlock unlimited scans, priority parsing, and advanced AI features for 7 days",
          link: "/pricing",
        });
      }
    } else if (user.subscriptionTier === "interview_sprint") {
      const expiresAt = user.sprintExpiresAt || 0;
      const daysLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));

      if (daysLeft <= 2 && daysLeft > 0) {
        actions.push({
          priority: "high",
          action: "Renew Interview Sprint",
          reason: `Your sprint expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Renew now to maintain access`,
          link: "/pricing",
        });
      }
    }

    // Check for incomplete resumes
    const incompleteResumes = resumes.filter(r => r.status === "pending" || r.status === "processing");
    if (incompleteResumes.length > 0) {
      actions.push({
        priority: "medium",
        action: "Complete Pending Resume Analysis",
        reason: `You have ${incompleteResumes.length} resume${incompleteResumes.length === 1 ? '' : 's'} waiting for analysis`,
        link: "/dashboard",
      });
    }

    // Check for low-scoring resumes
    const lowScoreResumes = resumes.filter(r => r.status === "completed" && (r.score || 0) < 60);
    if (lowScoreResumes.length > 0) {
      actions.push({
        priority: "high",
        action: "Improve Low-Scoring Resume",
        reason: `${lowScoreResumes.length} of your resumes score below 60%. Use AI suggestions to improve them`,
        link: "/dashboard",
      });
    }

    // Suggest scanning if no recent activity
    if (resumes.length > 0) {
      const lastScan = resumes[0]._creationTime;
      const daysSinceLastScan = Math.floor((Date.now() - lastScan) / (24 * 60 * 60 * 1000));

      if (daysSinceLastScan > 7) {
        actions.push({
          priority: "low",
          action: "Scan Updated Resume",
          reason: `It's been ${daysSinceLastScan} days since your last scan. Keep your resume optimized`,
          link: "/dashboard",
        });
      }
    }

    // First-time user guidance
    if (resumes.length === 0) {
      actions.push({
        priority: "high",
        action: "Scan Your First Resume",
        reason: "Upload your resume to get instant AI-powered feedback and optimization tips",
        link: "/dashboard",
      });
    }

    return { actions };
  },
});

/**
 * Track recommendation interaction
 */
export const trackRecommendationAction = internalMutation({
  args: {
    userId: v.id("users"),
    recommendationType: v.string(),
    action: v.union(v.literal("viewed"), v.literal("clicked"), v.literal("dismissed"), v.literal("completed")),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("recommendationInteractions", {
      userId: args.userId,
      recommendationType: args.recommendationType,
      action: args.action,
      metadata: args.metadata || {},
      timestamp: Date.now(),
    });
  },
});

/**
 * Get recommendation effectiveness metrics
 */
export const getRecommendationMetrics = internalQuery({
  args: {
    timeWindowDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.timeWindowDays || 30;
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);

    // Sample interactions
    const interactions = await ctx.db
      .query("recommendationInteractions")
      .order("desc")
      .take(1000);

    const recentInteractions = interactions.filter(i => i.timestamp >= cutoff);

    const totalViewed = recentInteractions.filter(i => i.action === "viewed").length;
    const totalClicked = recentInteractions.filter(i => i.action === "clicked").length;
    const totalCompleted = recentInteractions.filter(i => i.action === "completed").length;
    const totalDismissed = recentInteractions.filter(i => i.action === "dismissed").length;

    const clickThroughRate = totalViewed > 0 ? (totalClicked / totalViewed) * 100 : 0;
    const completionRate = totalClicked > 0 ? (totalCompleted / totalClicked) * 100 : 0;
    const dismissalRate = totalViewed > 0 ? (totalDismissed / totalViewed) * 100 : 0;

    return {
      totalViewed,
      totalClicked,
      totalCompleted,
      totalDismissed,
      clickThroughRate: Math.round(clickThroughRate * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      dismissalRate: Math.round(dismissalRate * 10) / 10,
      timeWindow: days,
    };
  },
});
