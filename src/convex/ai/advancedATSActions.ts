"use node";

/**
 * Advanced ATS Analysis Actions
 * Node.js actions for running advanced ML-powered ATS analysis
 */

import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import {
  analyzeKeywordSaturation,
  analyzeImpactMetrics,
  generateMissingKeywordSuggestions,
  analyzeATSCompatibility,
} from "./advancedATSEngine";

/**
 * Run comprehensive advanced ATS analysis
 * This is the main entry point for the advanced ML analysis
 */
export const runComprehensiveAnalysis = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.optional(v.string()),
    targetIndustry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { resumeText, jobDescription = '', targetIndustry = 'software' } = args;

    try {
      // Run keyword saturation analysis
      const keywordAnalysis = analyzeKeywordSaturation(
        resumeText,
        jobDescription,
        targetIndustry
      );

      // Run impact metrics analysis
      const impactAnalysis = analyzeImpactMetrics(resumeText);

      // Generate missing keyword suggestions
      const missingKeywordSuggestions = generateMissingKeywordSuggestions(
        resumeText,
        jobDescription,
        keywordAnalysis
      );

      // Run ATS compatibility analysis
      const atsCompatibility = analyzeATSCompatibility(
        resumeText,
        keywordAnalysis,
        impactAnalysis
      );

      return {
        success: true,
        data: {
          keywordAnalysis,
          impactAnalysis,
          missingKeywordSuggestions,
          atsCompatibility,
          metadata: {
            analyzedAt: new Date().toISOString(),
            targetIndustry,
            hasJobDescription: jobDescription.length > 0,
            resumeLength: resumeText.length,
          },
        },
      };
    } catch (error) {
      console.error('Advanced ATS analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

/**
 * Get keyword suggestions only (faster, lightweight)
 */
export const getKeywordSuggestions = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.string(),
    targetIndustry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { resumeText, jobDescription, targetIndustry = 'software' } = args;

    try {
      // First analyze current keywords
      const keywordAnalysis = analyzeKeywordSaturation(
        resumeText,
        jobDescription,
        targetIndustry
      );

      // Then generate suggestions
      const suggestions = generateMissingKeywordSuggestions(
        resumeText,
        jobDescription,
        keywordAnalysis
      );

      return {
        success: true,
        data: {
          suggestions,
          currentScore: keywordAnalysis.overallScore,
          matchedCount: keywordAnalysis.matchedKeywords.length,
          missingCount: keywordAnalysis.missingKeywords.length,
        },
      };
    } catch (error) {
      console.error('Keyword suggestions failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});

/**
 * Get impact metrics analysis only
 */
export const getImpactMetrics = action({
  args: {
    resumeText: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const impactAnalysis = analyzeImpactMetrics(args.resumeText);

      return {
        success: true,
        data: impactAnalysis,
      };
    } catch (error) {
      console.error('Impact metrics analysis failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
});
