"use node";

/**
 * Advanced Scoring Actions
 * Connects the advanced scoring engine to the frontend
 */

import { v } from "convex/values";
import { action } from "../_generated/server";
import {
  calculateSemanticSimilarity,
  scoreAchievementQuality,
  analyzeSkillRelevance,
  calculateComprehensiveScore,
  analyzeCompetitivePosition,
} from "./advancedScoringEngine";
import { 
  extractBulletPoints, 
  extractSkillsFromText, 
  estimateKeywordScore, 
  countImpactMetrics, 
  getGrade 
} from "./lib/scoringHelpers";

/**
 * Run complete comprehensive scoring analysis
 * This is the main entry point for advanced scoring
 */
export const runComprehensiveScoring = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.optional(v.string()),
    extractedData: v.optional(v.any()),
    jobLevel: v.optional(v.union(
      v.literal("junior"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("principal")
    )),
  },
  handler: async (ctx, args) => {
    const {
      resumeText,
      jobDescription = '',
      extractedData,
      jobLevel = 'mid',
    } = args;

    try {
      // 1. Calculate semantic similarity
      const semanticMatch = calculateSemanticSimilarity(resumeText, jobDescription);

      // 2. Extract and score bullet points
      const bulletPoints = extractBulletPoints(resumeText);
      const achievementQuality = scoreAchievementQuality(bulletPoints);

      // 3. Analyze skill relevance
      const skills = extractedData?.skills?.technical || extractSkillsFromText(resumeText);
      const skillRelevance = Array.isArray(skills) && skills.length > 0
        ? analyzeSkillRelevance(skills, 'software')
        : [];

      // 4. Get keyword and impact scores (from extracted data or estimate)
      const keywordScore = extractedData?.keywordScore || estimateKeywordScore(resumeText, jobDescription);
      const impactMetricsCount = extractedData?.impactMetricsCount || countImpactMetrics(resumeText);
      const atsCompatibilityScore = extractedData?.atsCompatibilityScore || 75;

      // 5. Calculate comprehensive score
      const comprehensiveScore = calculateComprehensiveScore(
        keywordScore,
        achievementQuality,
        skillRelevance,
        impactMetricsCount,
        atsCompatibilityScore,
        semanticMatch
      );

      // 6. Competitive analysis
      const competitiveAnalysis = analyzeCompetitivePosition(
        comprehensiveScore,
        jobLevel
      );

      return {
        success: true,
        data: {
          comprehensiveScore,
          competitiveAnalysis,
          achievementQuality,
          skillRelevance,
          semanticMatch,
          metadata: {
            analyzedAt: new Date().toISOString(),
            jobLevel,
            bulletPointCount: bulletPoints.length,
            skillCount: skills.length,
          },
        },
      };
    } catch (error) {
      console.error('Comprehensive scoring failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

/**
 * Quick score check - faster, lightweight version
 */
export const getQuickScore = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const { resumeText, jobDescription = '' } = args;

      // IMPORTANT: Use EXACT same calculation as dashboard (generateIntelligentFallback)
      // This ensures consistency between landing page preview and full dashboard analysis

      // Calculate keyword score (same as dashboard's finalKeywordScore)
      const keywordScore = estimateKeywordScore(resumeText, jobDescription);

      // Calculate format score (based on metrics and structure)
      const impactMetricsCount = countImpactMetrics(resumeText);
      const bulletPoints = extractBulletPoints(resumeText);
      const hasGoodStructure = bulletPoints.length >= 5;
      const formatScore = Math.round(
        (hasGoodStructure ? 65 : 50) +
        Math.min(20, (impactMetricsCount / 15) * 20)
      );

      // Calculate completeness score (based on achievement quality)
      const achievementQuality = scoreAchievementQuality(bulletPoints);
      const completenessScore = Math.round(achievementQuality.score);

      // EXACT SAME FORMULA AS DASHBOARD (intelligentFallback.ts line 177-181)
      // overallScore = (finalKeywordScore * 0.45) + (finalFormatScore * 0.30) + (finalCompletenessScore * 0.25)
      const quickScore = Math.round(
        (keywordScore * 0.45) +
        (formatScore * 0.30) +
        (completenessScore * 0.25)
      );

      console.log(`[QuickScore] Keyword: ${keywordScore}, Format: ${formatScore}, Completeness: ${completenessScore} → Final: ${quickScore}`);

      return {
        success: true,
        data: {
          score: quickScore, // Changed from quickScore to score for consistency
          quickScore, // Keep for backward compatibility
          keywordScore,
          formatScore,
          completenessScore,
          achievementScore: achievementQuality.score,
          impactMetricsCount,
          estimatedGrade: getGrade(quickScore),
        },
      };
    } catch (error) {
      console.error('Quick score failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

/**
 * Analyze achievement quality only
 */
export const analyzeAchievements = action({
  args: {
    resumeText: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const bulletPoints = extractBulletPoints(args.resumeText);
      const achievementQuality = scoreAchievementQuality(bulletPoints);

      return {
        success: true,
        data: {
          achievementQuality,
          bulletPointCount: bulletPoints.length,
        },
      };
    } catch (error) {
      console.error('Achievement analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

/**
 * Analyze skill relevance only
 */
export const analyzeSkillRelevanceAction = action({
  args: {
    skills: v.array(v.string()),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const skillRelevance = analyzeSkillRelevance(
        args.skills,
        args.industry || 'software'
      );

      return {
        success: true,
        data: {
          skillRelevance,
          summary: {
            totalSkills: args.skills.length,
            highDemand: skillRelevance.filter(s => s.demandLevel === 'high').length,
            current: skillRelevance.filter(s => s.recency === 'current').length,
            outdated: skillRelevance.filter(s => s.recency === 'outdated').length,
          },
        },
      };
    } catch (error) {
      console.error('Skill relevance analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

// ==================== NEW ML ACTIONS ====================

/**
 * Predict interview callback rate with ML
 */
export const predictInterviewRateAction = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.optional(v.string()),
    yearsExperience: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const { resumeText, jobDescription = '', yearsExperience } = args;

      // Get comprehensive score first
      const bulletPoints = extractBulletPoints(resumeText);
      const achievementQuality = scoreAchievementQuality(bulletPoints);
      const skills = extractSkillsFromText(resumeText);
      const skillRelevance = Array.isArray(skills) && skills.length > 0
        ? analyzeSkillRelevance(skills, 'software')
        : [];
      const keywordScore = estimateKeywordScore(resumeText, jobDescription);
      const impactMetricsCount = countImpactMetrics(resumeText);
      const atsCompatibilityScore = 75; // Default, should be calculated properly

      const semanticMatch = calculateSemanticSimilarity(resumeText, jobDescription);

      const comprehensiveScore = calculateComprehensiveScore(
        keywordScore,
        achievementQuality,
        skillRelevance,
        impactMetricsCount,
        atsCompatibilityScore,
        semanticMatch
      );

      // Import the new function
      const { predictInterviewRate } = require('./advancedScoringEngine');
      const hasJobDescription = jobDescription.trim().length > 0;

      const interviewPrediction = predictInterviewRate(
        comprehensiveScore,
        yearsExperience,
        hasJobDescription
      );

      return {
        success: true,
        data: interviewPrediction,
      };
    } catch (error) {
      console.error('Interview rate prediction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

/**
 * Generate personalized recommendations with ML
 */
export const generatePersonalizedRecommendationsAction = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.optional(v.string()),
    yearsExperience: v.number(),
    jobLevel: v.optional(v.union(
      v.literal("junior"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("principal")
    )),
  },
  handler: async (ctx, args) => {
    try {
      const { resumeText, jobDescription = '', yearsExperience, jobLevel = 'mid' } = args;

      // Get comprehensive analysis
      const bulletPoints = extractBulletPoints(resumeText);
      const achievementQuality = scoreAchievementQuality(bulletPoints);
      const skills = extractSkillsFromText(resumeText);
      const skillRelevance = Array.isArray(skills) && skills.length > 0
        ? analyzeSkillRelevance(skills, 'software')
        : [];
      const keywordScore = estimateKeywordScore(resumeText, jobDescription);
      const impactMetricsCount = countImpactMetrics(resumeText);
      const atsCompatibilityScore = 75;
      const semanticMatch = calculateSemanticSimilarity(resumeText, jobDescription);

      const comprehensiveScore = calculateComprehensiveScore(
        keywordScore,
        achievementQuality,
        skillRelevance,
        impactMetricsCount,
        atsCompatibilityScore,
        semanticMatch
      );

      const competitiveAnalysis = analyzeCompetitivePosition(
        comprehensiveScore,
        jobLevel
      );

      // Import the new functions
      const { predictInterviewRate, generatePersonalizedRecommendations } = require('./advancedScoringEngine');
      const hasJobDescription = jobDescription.trim().length > 0;

      const interviewPrediction = predictInterviewRate(
        comprehensiveScore,
        yearsExperience,
        hasJobDescription
      );

      const recommendations = generatePersonalizedRecommendations(
        comprehensiveScore,
        competitiveAnalysis,
        interviewPrediction
      );

      return {
        success: true,
        data: {
          recommendations,
          comprehensiveScore,
          competitiveAnalysis,
          interviewPrediction,
        },
      };
    } catch (error) {
      console.error('Personalized recommendations failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

/**
 * Complete ML Analysis - All features combined
 */
export const runCompleteMLAnalysis = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.optional(v.string()),
    yearsExperience: v.number(),
    jobLevel: v.optional(v.union(
      v.literal("junior"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("principal")
    )),
  },
  handler: async (ctx, args) => {
    try {
      const { resumeText, jobDescription = '', yearsExperience, jobLevel = 'mid' } = args;

      // Full comprehensive analysis
      const bulletPoints = extractBulletPoints(resumeText);
      const achievementQuality = scoreAchievementQuality(bulletPoints);
      const skills = extractSkillsFromText(resumeText);
      const skillRelevance = Array.isArray(skills) && skills.length > 0
        ? analyzeSkillRelevance(skills, 'software')
        : [];
      const keywordScore = estimateKeywordScore(resumeText, jobDescription);
      const impactMetricsCount = countImpactMetrics(resumeText);
      const atsCompatibilityScore = 75;
      const semanticMatch = calculateSemanticSimilarity(resumeText, jobDescription);

      const comprehensiveScore = calculateComprehensiveScore(
        keywordScore,
        achievementQuality,
        skillRelevance,
        impactMetricsCount,
        atsCompatibilityScore,
        semanticMatch
      );

      const competitiveAnalysis = analyzeCompetitivePosition(
        comprehensiveScore,
        jobLevel
      );

      // Import the new ML functions
      const { predictInterviewRate, generatePersonalizedRecommendations } = require('./advancedScoringEngine');
      const hasJobDescription = jobDescription.trim().length > 0;

      const interviewPrediction = predictInterviewRate(
        comprehensiveScore,
        yearsExperience,
        hasJobDescription
      );

      const recommendations = generatePersonalizedRecommendations(
        comprehensiveScore,
        competitiveAnalysis,
        interviewPrediction
      );

      return {
        success: true,
        data: {
          // Core scores
          overallScore: comprehensiveScore.overallScore,
          grade: comprehensiveScore.grade,
          percentile: comprehensiveScore.percentile,

          // Component breakdowns
          componentScores: comprehensiveScore.componentScores,
          achievementQuality,
          skillRelevance,
          semanticMatch,

          // Competitive insights
          competitiveAnalysis,

          // Interview prediction (ML)
          interviewPrediction,

          // Personalized recommendations (ML)
          recommendations,

          // Quick wins and critical issues
          strengths: comprehensiveScore.strengths,
          criticalIssues: comprehensiveScore.criticalIssues,
          quickWins: comprehensiveScore.quickWins,

          // ATS metrics
          estimatedATSPassRate: comprehensiveScore.estimatedATSPassRate,

          // Metadata
          metadata: {
            analyzedAt: new Date().toISOString(),
            jobLevel,
            yearsExperience,
            hasJobDescription,
            bulletPointCount: bulletPoints.length,
            impactMetricsCount,
            skillCount: skills.length,
          },
        },
      };
    } catch (error) {
      console.error('Complete ML analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});