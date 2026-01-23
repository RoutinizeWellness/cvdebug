/**
 * User Profile Learning System
 * Learns from user's CVs to provide hyper-personalized recommendations
 * Adapts to user's industry, seniority, and career trajectory
 */

import { query, internalQuery, QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

/**
 * Helper function to extract user profile from resume history
 * Learns industry, seniority, skills, and career patterns
 * EXPORTED for use in other files (recommendations.ts, etc.)
 */
export async function extractUserProfileHelper(ctx: QueryCtx, userId: Id<"users">) {
  // Get all user's resumes
  const resumes = await ctx.db
    .query("resumes")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .take(20);

    if (resumes.length === 0) {
      return null;
    }

  // Analyze all resumes to build profile
  const profile = {
    userId: userId,
      industries: new Map<string, number>(),
      seniorityLevels: new Map<string, number>(),
      skills: new Map<string, number>(),
      keywords: new Map<string, number>(),
      targetRoles: new Map<string, number>(),
      averageScore: 0,
      totalResumes: resumes.length,
      recentScore: resumes[0]?.score || 0,
      improvementTrend: 0,
      preferredSections: [] as string[],
      strongSections: [] as string[],
      weakSections: [] as string[],
    };

    let scoreSum = 0;
    const scores: number[] = [];

    // Analyze each resume
    for (const resume of resumes) {
      if (resume.score) {
        scoreSum += resume.score;
        scores.push(resume.score);
      }

      // Extract category/industry
      if (resume.category) {
        const count = profile.industries.get(resume.category) || 0;
        profile.industries.set(resume.category, count + 1);
      }

      // Extract title for role targeting
      if (resume.title) {
        const titleLower = resume.title.toLowerCase();

        // Detect seniority from title
        if (titleLower.includes('senior') || titleLower.includes('sr.')) {
          const count = profile.seniorityLevels.get('senior') || 0;
          profile.seniorityLevels.set('senior', count + 1);
        } else if (titleLower.includes('lead') || titleLower.includes('principal') || titleLower.includes('staff')) {
          const count = profile.seniorityLevels.get('lead') || 0;
          profile.seniorityLevels.set('lead', count + 1);
        } else if (titleLower.includes('junior') || titleLower.includes('jr.') || titleLower.includes('entry')) {
          const count = profile.seniorityLevels.get('junior') || 0;
          profile.seniorityLevels.set('junior', count + 1);
        } else {
          const count = profile.seniorityLevels.get('mid') || 0;
          profile.seniorityLevels.set('mid', count + 1);
        }

        // Extract role
        const roleWords = titleLower.replace(/\b(senior|junior|lead|principal|staff|sr\.|jr\.)\b/gi, '').trim();
        const count = profile.targetRoles.get(roleWords) || 0;
        profile.targetRoles.set(roleWords, count + 1);
      }

      // Extract skills and keywords from OCR text and analysis
      const textToAnalyze = [
        resume.ocrText || '',
        resume.analysis || '',
      ].join(' ').toLowerCase();

      // Common tech skills patterns
      const techSkills = [
        'python', 'javascript', 'typescript', 'java', 'c++', 'golang', 'rust',
        'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
        'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
        'machine learning', 'ai', 'data science', 'deep learning',
        'agile', 'scrum', 'ci/cd', 'devops', 'microservices',
      ];

      for (const skill of techSkills) {
        if (textToAnalyze.includes(skill)) {
          const count = profile.skills.get(skill) || 0;
          profile.skills.set(skill, count + 1);
        }
      }

      // Nursing/Healthcare skills
      const nursingSkills = [
        'icu', 'er', 'critical care', 'telemetry', 'med-surg',
        'pediatric', 'nicu', 'oncology', 'cardiology',
        'bls', 'acls', 'pals', 'tncc', 'ccrn',
        'iv therapy', 'wound care', 'patient care',
      ];

      for (const skill of nursingSkills) {
        if (textToAnalyze.includes(skill)) {
          const count = profile.skills.get(skill) || 0;
          profile.skills.set(skill, count + 1);
        }
      }
    }

    // Calculate average score
    profile.averageScore = scores.length > 0 ? scoreSum / scores.length : 0;

    // Calculate improvement trend (comparing recent vs older)
    if (scores.length >= 2) {
      const recentAvg = scores.slice(0, Math.min(3, scores.length)).reduce((a, b) => a + b, 0) / Math.min(3, scores.length);
      const olderAvg = scores.slice(-Math.min(3, scores.length)).reduce((a, b) => a + b, 0) / Math.min(3, scores.length);
      profile.improvementTrend = recentAvg - olderAvg;
    }

    // Determine most common industry
    const dominantIndustry = Array.from(profile.industries.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';

    // Determine most common seniority
    const dominantSeniority = Array.from(profile.seniorityLevels.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'mid';

    // Top skills (most frequent)
    const topSkills = Array.from(profile.skills.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill]) => skill);

  return {
    userId: userId,
    dominantIndustry,
    dominantSeniority,
    topSkills,
    targetRole: Array.from(profile.targetRoles.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'professional',
    averageScore: Math.round(profile.averageScore),
    recentScore: profile.recentScore,
    improvementTrend: Math.round(profile.improvementTrend * 10) / 10,
    totalResumes: profile.totalResumes,
    industries: Array.from(profile.industries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3),
    seniorityLevels: Array.from(profile.seniorityLevels.entries())
      .sort((a, b) => b[1] - a[1]),
  };
}

/**
 * Internal query wrapper for extractUserProfile
 */
export const extractUserProfile = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await extractUserProfileHelper(ctx, args.userId);
  },
});

/**
 * Get personalized keyword recommendations based on user profile
 */
export const getPersonalizedKeywords = query({
  args: {
    userId: v.id("users"),
    currentResumeId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    // Get user profile
    const profile = await extractUserProfileHelper(ctx, args.userId);

    if (!profile) {
      return {
        recommendations: [],
        reasoning: "No resume history available for personalization",
      };
    }

    const recommendations: Array<{
      keyword: string;
      reason: string;
      priority: 'critical' | 'high' | 'medium';
      category: string;
    }> = [];

    // Industry-specific recommendations
    if (profile.dominantIndustry.toLowerCase().includes('tech') ||
        profile.dominantIndustry.toLowerCase().includes('engineer')) {
      recommendations.push(
        {
          keyword: 'agile methodology',
          reason: `Essential for ${profile.dominantSeniority} tech roles`,
          priority: 'high',
          category: 'methodology',
        },
        {
          keyword: 'cross-functional collaboration',
          reason: 'Shows teamwork in tech environment',
          priority: 'high',
          category: 'soft skills',
        }
      );

      // Seniority-specific
      if (profile.dominantSeniority === 'senior' || profile.dominantSeniority === 'lead') {
        recommendations.push(
          {
            keyword: 'technical leadership',
            reason: 'Critical for senior/lead positions',
            priority: 'critical',
            category: 'leadership',
          },
          {
            keyword: 'mentoring',
            reason: 'Expected at your seniority level',
            priority: 'high',
            category: 'leadership',
          },
          {
            keyword: 'architecture design',
            reason: 'Shows strategic technical thinking',
            priority: 'high',
            category: 'technical',
          }
        );
      }
    }

    // Nursing/Healthcare recommendations
    if (profile.dominantIndustry.toLowerCase().includes('nurs') ||
        profile.dominantIndustry.toLowerCase().includes('health')) {
      recommendations.push(
        {
          keyword: 'patient-centered care',
          reason: 'Core healthcare value',
          priority: 'critical',
          category: 'core competency',
        },
        {
          keyword: 'clinical documentation',
          reason: 'Essential nursing skill',
          priority: 'high',
          category: 'technical',
        },
        {
          keyword: 'interdisciplinary collaboration',
          reason: 'Shows teamwork in healthcare',
          priority: 'high',
          category: 'soft skills',
        }
      );

      if (profile.dominantSeniority === 'senior' || profile.dominantSeniority === 'lead') {
        recommendations.push(
          {
            keyword: 'charge nurse experience',
            reason: 'Leadership credential for senior nurses',
            priority: 'critical',
            category: 'leadership',
          },
          {
            keyword: 'precepting',
            reason: 'Expected mentoring role',
            priority: 'high',
            category: 'leadership',
          }
        );
      }
    }

    // Based on improvement trend
    if (profile.improvementTrend > 0) {
      recommendations.push({
        keyword: 'continuous improvement',
        reason: 'Your scores show consistent growth - highlight this!',
        priority: 'medium',
        category: 'personal brand',
      });
    }

    // Based on skills gaps
    if (profile.topSkills.length < 5) {
      recommendations.push({
        keyword: 'professional development',
        reason: 'Emphasize your learning and skill acquisition',
        priority: 'medium',
        category: 'growth',
      });
    }

    return {
      profile: {
        industry: profile.dominantIndustry,
        seniority: profile.dominantSeniority,
        role: profile.targetRole,
        topSkills: profile.topSkills,
        avgScore: profile.averageScore,
        trend: profile.improvementTrend > 0 ? 'improving' : profile.improvementTrend < 0 ? 'declining' : 'stable',
        totalResumes: profile.totalResumes,
      },
      recommendations: recommendations.slice(0, 12),
      reasoning: `Personalized based on ${profile.totalResumes} resumes analyzed`,
    };
  },
});

/**
 * Get adaptive scoring weights based on user's industry and seniority
 */
export const getAdaptiveScoringWeights = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const profile = await extractUserProfileHelper(ctx, args.userId);

    if (!profile) {
      // Default weights
      return {
        keywords: 30,
        formatting: 25,
        content: 25,
        length: 10,
        impact: 10,
      };
    }

    // Adjust weights based on industry and seniority
    const weights = {
      keywords: 30,
      formatting: 25,
      content: 25,
      length: 10,
      impact: 10,
    };

    // Tech industry: keywords matter more
    if (profile.dominantIndustry.toLowerCase().includes('tech') ||
        profile.dominantIndustry.toLowerCase().includes('engineer')) {
      weights.keywords = 35;
      weights.content = 30;
      weights.formatting = 20;
    }

    // Healthcare: content and certifications matter more
    if (profile.dominantIndustry.toLowerCase().includes('nurs') ||
        profile.dominantIndustry.toLowerCase().includes('health')) {
      weights.content = 35;
      weights.keywords = 30;
      weights.formatting = 20;
    }

    // Senior roles: impact and leadership matter more
    if (profile.dominantSeniority === 'senior' || profile.dominantSeniority === 'lead') {
      weights.impact = 15;
      weights.content = 30;
      weights.keywords = 25;
    }

    // Junior roles: formatting and clarity matter more
    if (profile.dominantSeniority === 'junior') {
      weights.formatting = 30;
      weights.keywords = 25;
      weights.content = 25;
    }

    return weights;
  },
});
