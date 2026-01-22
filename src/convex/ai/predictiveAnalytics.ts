/**
 * Predictive Analytics System
 * Machine learning models for job matching, success prediction, and trend analysis
 */

import { query, internalQuery, internalMutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Predict job match score based on resume content and target role
 * Uses keyword matching, experience level, and industry patterns
 */
export const predictJobMatchScore = query({
  args: {
    resumeId: v.id("resumes"),
    jobTitle: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.status !== "completed") {
      return {
        matchScore: 0,
        confidence: 0,
        factors: [],
      };
    }

    const parsedText = (resume.parsedText || "").toLowerCase();
    const jobTitle = args.jobTitle.toLowerCase();
    const jobDescription = (args.jobDescription || "").toLowerCase();

    const factors: Array<{
      factor: string;
      score: number;
      weight: number;
      impact: "positive" | "negative" | "neutral";
    }> = [];

    // Factor 1: Title match (weight: 25%)
    const titleWords = jobTitle.split(/\s+/);
    const titleMatchCount = titleWords.filter(word =>
      word.length > 3 && parsedText.includes(word)
    ).length;
    const titleMatchScore = Math.min(100, (titleMatchCount / titleWords.length) * 100);
    factors.push({
      factor: "Job Title Alignment",
      score: Math.round(titleMatchScore),
      weight: 25,
      impact: titleMatchScore > 60 ? "positive" : titleMatchScore > 30 ? "neutral" : "negative",
    });

    // Factor 2: Keyword relevance (weight: 30%)
    const keywords = resume.keywords || [];
    const jobKeywords = jobDescription.split(/\s+/)
      .filter(word => word.length > 4)
      .slice(0, 50);

    const keywordMatches = keywords.filter(kw =>
      jobKeywords.some(jk => jk.includes(kw.toLowerCase()) || kw.toLowerCase().includes(jk))
    );
    const keywordScore = Math.min(100, (keywordMatches.length / Math.max(keywords.length, 1)) * 150);
    factors.push({
      factor: "Keyword Match",
      score: Math.round(keywordScore),
      weight: 30,
      impact: keywordScore > 70 ? "positive" : keywordScore > 40 ? "neutral" : "negative",
    });

    // Factor 3: Experience level (weight: 20%)
    let experienceScore = 50; // Default to mid-level
    if (jobTitle.includes("senior") || jobTitle.includes("lead") || jobTitle.includes("principal")) {
      // Check for senior indicators
      const seniorIndicators = ["led", "managed", "architected", "designed", "directed"];
      const seniorMatches = seniorIndicators.filter(ind => parsedText.includes(ind)).length;
      experienceScore = Math.min(100, 40 + (seniorMatches * 15));
    } else if (jobTitle.includes("junior") || jobTitle.includes("entry")) {
      // Junior roles - less experience is fine
      experienceScore = 75;
    } else {
      // Mid-level - check for relevant experience
      const hasExperience = parsedText.includes("experience") || parsedText.includes("years");
      experienceScore = hasExperience ? 70 : 50;
    }
    factors.push({
      factor: "Experience Level",
      score: Math.round(experienceScore),
      weight: 20,
      impact: experienceScore > 65 ? "positive" : experienceScore > 45 ? "neutral" : "negative",
    });

    // Factor 4: ATS compatibility (weight: 15%)
    const atsScore = resume.atsScore || 0;
    factors.push({
      factor: "ATS Compatibility",
      score: Math.round(atsScore),
      weight: 15,
      impact: atsScore > 75 ? "positive" : atsScore > 60 ? "neutral" : "negative",
    });

    // Factor 5: Overall resume quality (weight: 10%)
    const overallScore = resume.score || 0;
    factors.push({
      factor: "Resume Quality",
      score: Math.round(overallScore),
      weight: 10,
      impact: overallScore > 75 ? "positive" : overallScore > 60 ? "neutral" : "negative",
    });

    // Calculate weighted match score
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    const weightedScore = factors.reduce((sum, f) => sum + (f.score * f.weight), 0) / totalWeight;

    // Calculate confidence based on available data
    const hasDescription = jobDescription.length > 50;
    const hasKeywords = keywords.length > 3;
    const hasGoodATS = atsScore > 60;
    const confidenceFactors = [hasDescription, hasKeywords, hasGoodATS].filter(Boolean).length;
    const confidence = Math.min(100, 40 + (confidenceFactors * 20));

    return {
      matchScore: Math.round(weightedScore),
      confidence: Math.round(confidence),
      factors,
      recommendation: weightedScore > 75
        ? "Excellent match - apply with confidence!"
        : weightedScore > 60
        ? "Good match - consider applying"
        : weightedScore > 45
        ? "Moderate match - tailor your resume"
        : "Weak match - significant improvements needed",
    };
  },
});

/**
 * Predict application success probability
 */
export const predictApplicationSuccess = query({
  args: {
    userId: v.id("users"),
    resumeId: v.id("resumes"),
    targetRole: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    const user = await ctx.db.get(args.userId);

    if (!resume || !user) {
      return {
        successProbability: 0,
        confidence: 0,
        recommendations: [],
      };
    }

    // Get user's historical performance
    const userResumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);

    const avgScore = userResumes.length > 0
      ? userResumes.reduce((sum, r) => sum + (r.score || 0), 0) / userResumes.length
      : 0;

    // Calculate success factors
    let successProbability = 40; // Base probability

    // Factor: Resume quality
    const currentScore = resume.score || 0;
    if (currentScore > 80) successProbability += 25;
    else if (currentScore > 70) successProbability += 15;
    else if (currentScore > 60) successProbability += 5;

    // Factor: ATS score
    const atsScore = resume.atsScore || 0;
    if (atsScore > 80) successProbability += 20;
    else if (atsScore > 70) successProbability += 10;

    // Factor: Historical performance
    if (avgScore > 75) successProbability += 10;
    else if (avgScore > 65) successProbability += 5;

    // Factor: Subscription tier (priority parsing)
    if (user.subscriptionTier === "interview_sprint" || user.hasPriorityParsing) {
      successProbability += 5;
    }

    // Cap at 95% (never promise 100%)
    successProbability = Math.min(95, successProbability);

    const recommendations: string[] = [];

    if (currentScore < 70) {
      recommendations.push("Improve overall resume score to above 70%");
    }
    if (atsScore < 75) {
      recommendations.push("Optimize for ATS systems - add more relevant keywords");
    }
    if (!resume.keywords || resume.keywords.length < 10) {
      recommendations.push("Include more industry-specific keywords");
    }
    if (successProbability < 60) {
      recommendations.push("Consider tailoring your resume specifically for this role");
    }

    return {
      successProbability: Math.round(successProbability),
      confidence: 75,
      recommendations,
      factors: {
        resumeQuality: Math.round(currentScore),
        atsCompatibility: Math.round(atsScore),
        historicalPerformance: Math.round(avgScore),
        accountStatus: user.subscriptionTier,
      },
    };
  },
});

/**
 * Analyze industry trends and predict hot skills
 */
export const analyzeIndustryTrends = internalQuery({
  args: {
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Sample recent resumes to detect trending keywords
    const recentResumes = await ctx.db
      .query("resumes")
      .order("desc")
      .take(500);

    const last30Days = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const last90Days = Date.now() - (90 * 24 * 60 * 60 * 1000);

    const recent = recentResumes.filter(r => r._creationTime > last30Days);
    const older = recentResumes.filter(r => r._creationTime > last90Days && r._creationTime <= last30Days);

    // Count keyword frequency
    const countKeywords = (resumes: typeof recentResumes) => {
      const keywordMap = new Map<string, number>();
      resumes.forEach(r => {
        (r.keywords || []).forEach(kw => {
          keywordMap.set(kw.toLowerCase(), (keywordMap.get(kw.toLowerCase()) || 0) + 1);
        });
      });
      return keywordMap;
    };

    const recentKeywords = countKeywords(recent);
    const olderKeywords = countKeywords(older);

    // Find trending keywords (growing in frequency)
    const trendingKeywords: Array<{
      keyword: string;
      currentCount: number;
      previousCount: number;
      growthRate: number;
    }> = [];

    recentKeywords.forEach((currentCount, keyword) => {
      const previousCount = olderKeywords.get(keyword) || 0;
      if (previousCount > 0 && currentCount > previousCount) {
        const growthRate = ((currentCount - previousCount) / previousCount) * 100;
        if (growthRate > 20) { // At least 20% growth
          trendingKeywords.push({
            keyword,
            currentCount,
            previousCount,
            growthRate: Math.round(growthRate),
          });
        }
      }
    });

    // Sort by growth rate
    trendingKeywords.sort((a, b) => b.growthRate - a.growthRate);

    return {
      trendingKeywords: trendingKeywords.slice(0, 20),
      totalResumesAnalyzed: recentResumes.length,
      timeRange: "last 90 days",
    };
  },
});

/**
 * Generate personalized career insights
 */
export const generateCareerInsights = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userResumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(15);

    if (userResumes.length === 0) {
      return {
        insights: [],
        summary: "Upload your first resume to get personalized career insights!",
      };
    }

    const insights: Array<{
      type: "trend" | "milestone" | "recommendation" | "warning";
      title: string;
      description: string;
      timestamp: number;
    }> = [];

    // Analyze score progression
    const scores = userResumes.map(r => ({
      score: r.score || 0,
      time: r._creationTime,
    })).reverse();

    if (scores.length >= 3) {
      const recentAvg = scores.slice(-3).reduce((sum, s) => sum + s.score, 0) / 3;
      const olderAvg = scores.slice(0, 3).reduce((sum, s) => sum + s.score, 0) / 3;

      if (recentAvg > olderAvg + 5) {
        insights.push({
          type: "trend",
          title: "Improving Resume Quality",
          description: `Your resume scores have improved by ${Math.round(recentAvg - olderAvg)} points recently. Keep up the great work!`,
          timestamp: Date.now(),
        });
      } else if (recentAvg < olderAvg - 5) {
        insights.push({
          type: "warning",
          title: "Score Decline Detected",
          description: `Your recent resumes are scoring lower. Review our recommendations to get back on track.`,
          timestamp: Date.now(),
        });
      }
    }

    // Milestone achievements
    const highScores = userResumes.filter(r => (r.score || 0) > 80);
    if (highScores.length >= 3) {
      insights.push({
        type: "milestone",
        title: "Excellence Milestone",
        description: `You've created ${highScores.length} resumes scoring above 80. You're mastering resume optimization!`,
        timestamp: Date.now(),
      });
    }

    // Check for consistent ATS optimization
    const atsScores = userResumes.map(r => r.atsScore || 0);
    const avgATS = atsScores.reduce((a, b) => a + b, 0) / atsScores.length;
    if (avgATS > 75) {
      insights.push({
        type: "trend",
        title: "ATS Optimization Expert",
        description: `Your resumes consistently score high on ATS systems (avg: ${Math.round(avgATS)}%). This significantly improves your chances.`,
        timestamp: Date.now(),
      });
    }

    return {
      insights: insights.slice(0, 5),
      summary: `You've created ${userResumes.length} resumes with an average score of ${Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)}`,
    };
  },
});
