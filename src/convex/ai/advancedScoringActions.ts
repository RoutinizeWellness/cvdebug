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
      const skillRelevance = analyzeSkillRelevance(skills, 'software');

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

      // Quick estimates
      const keywordScore = estimateKeywordScore(resumeText, jobDescription);
      const impactMetricsCount = countImpactMetrics(resumeText);
      const bulletPoints = extractBulletPoints(resumeText);
      const achievementQuality = scoreAchievementQuality(bulletPoints);

      // Quick overall score calculation
      const quickScore = Math.round(
        keywordScore * 0.4 +
        achievementQuality.score * 0.3 +
        Math.min(100, (impactMetricsCount / 15) * 100) * 0.3
      );

      return {
        success: true,
        data: {
          quickScore,
          keywordScore,
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

// ==================== HELPER FUNCTIONS ====================

function extractBulletPoints(text: string): string[] {
  // Match various bullet point patterns
  const patterns = [
    /^[\s]*[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*]\s+(.+)$/gm,
    /^\s*[-–—]\s+(.+)$/gm,
  ];

  const bullets: string[] = [];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 20) {
        bullets.push(match[1].trim());
      }
    }
  }

  // If no bullets found, try splitting by newlines and filtering
  if (bullets.length === 0) {
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 30 && !trimmed.match(/^[A-Z\s]{5,}$/)) {
        bullets.push(trimmed);
      }
    }
  }

  return bullets.slice(0, 50); // Max 50 bullets
}

function extractSkillsFromText(text: string): string[] {
  const lowerText = text.toLowerCase();
  const commonSkills = [
    'javascript', 'python', 'java', 'typescript', 'react', 'node.js', 'aws',
    'docker', 'kubernetes', 'sql', 'mongodb', 'postgresql', 'git', 'linux',
    'agile', 'scrum', 'ci/cd', 'rest api', 'graphql', 'microservices',
  ];

  const foundSkills: string[] = [];

  for (const skill of commonSkills) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

function estimateKeywordScore(resumeText: string, jobDescription: string): number {
  if (!jobDescription) return 70; // Default if no job description

  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract words from job description
  const jobWords = jobLower
    .split(/\s+/)
    .filter(w => w.length > 4) // Only words longer than 4 chars
    .filter(w => !['about', 'would', 'should', 'could', 'their', 'where', 'which'].includes(w));

  const uniqueJobWords = new Set(jobWords);
  let matchCount = 0;

  for (const word of uniqueJobWords) {
    if (resumeLower.includes(word)) {
      matchCount++;
    }
  }

  const score = Math.round((matchCount / uniqueJobWords.size) * 100);
  return Math.min(100, Math.max(0, score));
}

function countImpactMetrics(text: string): number {
  const metricPatterns = [
    /\d+(?:\.\d+)?%/g,
    /\$[\d,]+(?:\.\d+)?[kmb]?/gi,
    /\d+x\s+/gi,
    /\d+(?:,\d{3})+/g,
    /(?:\d+\+?\s*(?:years?|months?|weeks?|days?))/gi,
  ];

  let count = 0;
  const foundMetrics = new Set<string>();

  for (const pattern of metricPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(m => {
        foundMetrics.add(m.toLowerCase());
      });
    }
  }

  return foundMetrics.size;
}

function getGrade(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
