/**
 * Intelligent Recommendation System
 * Uses ML patterns and user behavior to provide personalized suggestions
 */

import { internalQuery, query, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { extractUserProfileHelper } from "./userProfileLearning";

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
    // Get user profile for personalized recommendations
    const userProfile = await extractUserProfileHelper(ctx, args.userId);

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
          userProfile: null,
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
      const currentScore = currentResume.score || 0;

      // Personalized score recommendations based on user profile
      if (currentScore < 70) {
        const industryContext = userProfile
          ? `for ${userProfile.dominantIndustry} ${userProfile.dominantSeniority} roles`
          : "for your target roles";

        recommendations.push({
          type: "critical",
          category: "Overall Quality",
          title: `Improve Resume Score ${industryContext}`,
          description: userProfile
            ? `Your resume scores below 70% for ${userProfile.dominantIndustry} roles. Based on your profile as a ${userProfile.dominantSeniority} professional, focus on: ${userProfile.dominantIndustry.toLowerCase().includes('tech') ? 'technical keywords, system architecture, and measurable impact' : userProfile.dominantIndustry.toLowerCase().includes('health') ? 'clinical competencies, certifications, and patient outcomes' : 'relevant keywords, achievements, and industry expertise'}.`
            : "Your resume scores below 70%. Focus on adding relevant keywords, improving formatting, and quantifying achievements.",
          impact: 25,
          actionable: true,
        });
      } else if (currentScore < 80) {
        const seniorityAdvice = userProfile?.dominantSeniority === 'senior' || userProfile?.dominantSeniority === 'lead'
          ? 'leadership impact, team mentoring, and strategic initiatives'
          : userProfile?.dominantSeniority === 'junior'
          ? 'technical fundamentals, learning agility, and project contributions'
          : 'quantifiable results and industry-specific keywords';

        recommendations.push({
          type: "high",
          category: "Optimization",
          title: "Boost Your Score to Elite Level",
          description: userProfile
            ? `You're close to excellence! For ${userProfile.dominantSeniority} ${userProfile.dominantIndustry} roles, emphasize ${seniorityAdvice} to reach 80+.`
            : "You're close to excellence! Add more industry-specific keywords and quantifiable results to reach 80+.",
          impact: 20,
          actionable: true,
        });
      }

      // Check for analysis content
      const analysisText = (currentResume.analysis || "").toLowerCase();
      const ocrText = (currentResume.ocrText || "").toLowerCase();
      const combinedText = analysisText + " " + ocrText;

      // Personalized keyword recommendations
      if (analysisText.includes("keyword") || analysisText.includes("missing")) {
        const keywordAdvice = userProfile
          ? userProfile.dominantIndustry.toLowerCase().includes('tech')
            ? `${userProfile.dominantSeniority === 'senior' || userProfile.dominantSeniority === 'lead' ? 'Technical leadership keywords (e.g., "system architecture", "technical roadmap", "team mentoring")' : 'Core technical keywords (e.g., "agile", "CI/CD", "code review")'} specific to ${userProfile.dominantIndustry}`
            : userProfile.dominantIndustry.toLowerCase().includes('health')
            ? `Clinical keywords like "patient-centered care", "EHR documentation", and relevant certifications (BLS, ACLS, etc.)`
            : `Industry-specific keywords relevant to ${userProfile.dominantIndustry} ${userProfile.dominantSeniority} roles`
          : "relevant industry terms";

        recommendations.push({
          type: "high",
          category: "Keywords",
          title: `Optimize ${userProfile ? userProfile.dominantIndustry : 'Industry'} Keywords`,
          description: userProfile
            ? `Based on your ${userProfile.dominantIndustry} background, add: ${keywordAdvice}.`
            : "Your analysis suggests missing keywords. Review the detailed feedback and add relevant industry terms.",
          impact: 22,
          actionable: true,
        });
      }

      // Check for formatting issues
      if (analysisText.includes("format") || analysisText.includes("structure")) {
        recommendations.push({
          type: "medium",
          category: "Formatting",
          title: "Improve Document Structure",
          description: "Your resume formatting needs attention. Ensure clear sections, consistent styling, and proper spacing.",
          impact: 15,
          actionable: true,
        });
      }

      // Check if OCR text is very short (indicates potential issues)
      if (ocrText.length > 0 && ocrText.length < 200) {
        recommendations.push({
          type: "high",
          category: "Content",
          title: "Expand Resume Content",
          description: "Your resume appears to be too brief. Add detailed accomplishments, metrics, and relevant experiences.",
          impact: 18,
          actionable: true,
        });
      }

      // Personalized quantifiable achievements recommendations
      const hasNumbers = /\d+/.test(ocrText);
      if (!hasNumbers && ocrText.length > 0) {
        const metricsExamples = userProfile
          ? userProfile.dominantIndustry.toLowerCase().includes('tech')
            ? userProfile.dominantSeniority === 'senior' || userProfile.dominantSeniority === 'lead'
              ? '"Led team of 8 engineers", "Reduced latency by 40%", "Architected system serving 1M+ users"'
              : '"Implemented feature used by 50K users", "Reduced bug rate by 25%", "Delivered 15+ projects"'
            : userProfile.dominantIndustry.toLowerCase().includes('health')
            ? '"Managed 20-bed unit", "Improved patient satisfaction by 15%", "Reduced readmission rate by 10%"'
            : '"Increased efficiency by 30%", "Managed $500K budget", "Led team of 5"'
          : "'30% increase', '5 projects', '$2M revenue'";

        recommendations.push({
          type: "high",
          category: "Impact",
          title: `Add Quantifiable Achievements for ${userProfile?.dominantSeniority || 'Your'} ${userProfile?.dominantIndustry || 'Role'}`,
          description: userProfile
            ? `As a ${userProfile.dominantSeniority} ${userProfile.dominantIndustry} professional, include metrics like: ${metricsExamples}.`
            : "Include specific numbers, percentages, or metrics to demonstrate your impact (e.g., '30% increase', '5 projects').",
          impact: 22,
          actionable: true,
        });
      }
    }

    // Personalized industry-specific recommendations based on user profile
    if (userProfile) {
      const industry = userProfile.dominantIndustry.toLowerCase();
      const seniority = userProfile.dominantSeniority;

      if (industry.includes("tech") || industry.includes("engineer")) {
        const techAdvice = seniority === 'senior' || seniority === 'lead'
          ? "system architecture decisions, technical mentoring impact, and cross-team initiatives you've led"
          : seniority === 'junior'
          ? "specific technologies mastered, projects completed, and code quality contributions"
          : "programming languages, frameworks, and technical projects with measurable outcomes";

        recommendations.push({
          type: "medium",
          category: "Technical Excellence",
          title: `Showcase ${seniority} ${industry} Expertise`,
          description: `For ${seniority} ${industry} roles, emphasize: ${techAdvice}.`,
          impact: seniority === 'senior' || seniority === 'lead' ? 18 : 16,
          actionable: true,
        });
      } else if (industry.includes("health") || industry.includes("nurs")) {
        recommendations.push({
          type: "medium",
          category: "Clinical Expertise",
          title: `Highlight ${industry} Competencies`,
          description: `Showcase your clinical skills, certifications (BLS, ACLS, specialty certs), patient care outcomes, and unit-specific experience.`,
          impact: 17,
          actionable: true,
        });
      }

      // Seniority-specific recommendations
      if (seniority === 'senior' || seniority === 'lead') {
        recommendations.push({
          type: "medium",
          category: "Leadership Impact",
          title: "Demonstrate Leadership at Your Level",
          description: `As a ${seniority} professional, highlight: team size managed, mentoring impact, strategic decisions, and organizational influence.`,
          impact: 18,
          actionable: true,
        });
      }
    } else if (currentResume && currentResume.jobTitle) {
      // Fallback to generic recommendations only if no profile exists
      const role = currentResume.jobTitle.toLowerCase();
      if (role.includes("engineer") || role.includes("developer")) {
        recommendations.push({
          type: "medium",
          category: "Technical Skills",
          title: "Highlight Technical Stack",
          description: "Ensure your resume clearly lists programming languages, frameworks, and tools you've used.",
          impact: 16,
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
        userProfile: userProfile ? {
          industry: userProfile.dominantIndustry,
          seniority: userProfile.dominantSeniority,
          topSkills: userProfile.topSkills.slice(0, 5),
        } : null,
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
    const incompleteResumes = resumes.filter(r => r.status === "processing" || r.status === "deep_processing");
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
