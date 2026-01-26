/**
 * Enhanced ML Analyzer - Integration Layer
 *
 * This module brings together all ML/AI enhancements:
 * - User profile learning and adaptation
 * - Semantic keyword matching
 * - Vector embeddings for deep understanding
 * - Continuous learning from feedback
 * - Predictive scoring with ML features
 *
 * V2.0 - HYPER-PERSONALIZED INTELLIGENT ANALYSIS
 */

import { extractIntelligentKeywords } from "../ml/intelligentKeywordExtractor";
import { analyzeResumeIntelligently } from "../ml/intelligentAnalyzer";
import { MLEngine, extractFeatures, predictScore } from "./mlEngine";
import { extractUserProfileHelper } from "./userProfileLearning";
import { QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Enhanced Analysis Result with ML predictions and user adaptation
 */
export interface EnhancedAnalysisResult {
  // Core scores
  overallScore: number;
  mlPredictedScore: number;
  confidence: number;

  // Breakdown
  keywordScore: number;
  formatScore: number;
  completenessScore: number;
  atsCompatibilityScore: number;

  // ML Insights
  mlFactors: Array<{
    feature: string;
    impact: number;
    weight: number;
  }>;

  // Keywords (with semantic understanding)
  extractedKeywords: Array<{
    term: string;
    score: number;
    category: string;
    frequency: number;
    context: string[];
    semanticScore?: number;
    synonyms?: string[];
  }>;

  missingCriticalKeywords: Array<{
    keyword: string;
    priority: "critical" | "high" | "medium";
    reason: string;
    section: string;
    impact: number;
  }>;

  semanticMatches?: Array<{
    term: string;
    matchedTo: string;
    similarity: number;
  }>;

  // User-specific insights
  personalizedInsights: {
    industry: string;
    seniority: string;
    avgScore: number;
    trend: 'improving' | 'stable' | 'declining';
    strengthAreas: string[];
    improvementAreas: string[];
  };

  // Recommendations (hyper-personalized)
  recommendations: Array<{
    category: string;
    priority: "critical" | "high" | "medium" | "low";
    message: string;
    actionable: string;
    impact: number;
    personalizedFor?: string; // "Your background in X..."
  }>;

  // ATS Analysis
  atsIssues: Array<{
    issue: string;
    severity: "critical" | "high" | "medium" | "low";
    fix: string;
    location: string;
    atsImpact: string;
  }>;
}

/**
 * Main enhanced analysis function
 * Integrates all ML/AI capabilities with user profile adaptation
 */
export async function analyzeResumeEnhanced(
  ctx: QueryCtx,
  resumeText: string,
  userId: Id<"users">,
  resumeId?: Id<"resumes">,
  jobDescription?: string,
  category?: string
): Promise<EnhancedAnalysisResult> {

  console.log("[Enhanced ML] Starting hyper-personalized analysis");

  // Step 1: Extract user profile for personalization
  const rawProfile = await extractUserProfileHelper(ctx, userId);

  if (!rawProfile) {
    console.log("[Enhanced ML] No user profile found, using base analysis only");
    // Fallback to base analysis without personalization
    const baseAnalysis = analyzeResumeIntelligently(
      resumeText,
      jobDescription,
      category as any
    );

    return {
      overallScore: baseAnalysis.overallScore,
      mlPredictedScore: baseAnalysis.overallScore,
      confidence: 50,
      keywordScore: baseAnalysis.keywordScore,
      formatScore: baseAnalysis.formatScore,
      completenessScore: baseAnalysis.completenessScore,
      atsCompatibilityScore: baseAnalysis.atsCompatibilityScore,
      mlFactors: [],
      extractedKeywords: baseAnalysis.extractedKeywords,
      missingCriticalKeywords: baseAnalysis.missingCriticalKeywords.map(mkw => ({
        keyword: mkw.keyword,
        priority: mkw.priority,
        reason: mkw.context,
        section: mkw.section,
        impact: mkw.impact
      })),
      personalizedInsights: {
        industry: 'General',
        seniority: 'Mid',
        avgScore: baseAnalysis.overallScore,
        trend: 'stable',
        strengthAreas: [],
        improvementAreas: []
      },
      recommendations: baseAnalysis.recommendations,
      atsIssues: baseAnalysis.atsIssues
    };
  }

  console.log(`[Enhanced ML] User profile: ${rawProfile.dominantIndustry} ${rawProfile.dominantSeniority}`);

  // Compute trend from improvementTrend
  const trend: 'improving' | 'stable' | 'declining' =
    rawProfile.improvementTrend > 2 ? 'improving' :
    rawProfile.improvementTrend < -2 ? 'declining' : 'stable';

  const userProfile = {
    ...rawProfile,
    avgScore: rawProfile.averageScore,
    trend
  };

  // Step 2: Run intelligent analyzer (base analysis)
  const baseAnalysis = analyzeResumeIntelligently(
    resumeText,
    jobDescription,
    category as any
  );

  // Step 3: Extract ML features
  const mlFeatures = extractFeatures(resumeText, category || 'general');
  console.log(`[Enhanced ML] ML features extracted - Technical: ${mlFeatures.technicalDensity.toFixed(1)}%, Impact: ${mlFeatures.impactScore.toFixed(1)}`);

  // Step 4: Run ML prediction with user profile
  const mlPrediction = predictScore(
    mlFeatures,
    undefined, // TODO: Load historical data
    {
      industry: userProfile.dominantIndustry || 'General',
      seniority: userProfile.dominantSeniority || 'Mid',
      avgScore: userProfile.avgScore,
      trend: userProfile.trend
    }
  );
  console.log(`[Enhanced ML] ML predicted score: ${mlPrediction.predictedScore} (confidence: ${mlPrediction.confidence}%)`);

  // Step 5: Enhanced keyword extraction with semantic matching
  const enhancedKeywords = extractIntelligentKeywords(
    resumeText,
    jobDescription,
    (userProfile.dominantIndustry || 'technology') as any,
    {
      industry: userProfile.dominantIndustry || 'General',
      seniority: userProfile.dominantSeniority || 'Mid',
      topSkills: userProfile.topSkills || []
    }
  );

  console.log(`[Enhanced ML] Enhanced keywords: ${enhancedKeywords.unique_keyword_count} unique, ${enhancedKeywords.semanticMatches?.length || 0} semantic matches`);

  // Step 6: Calculate final score (blend base + ML)
  const baseScore = baseAnalysis.overallScore;
  const mlScore = mlPrediction.predictedScore;
  const confidence = mlPrediction.confidence / 100;

  // Weighted blend: More confidence = more weight on ML
  const finalScore = Math.round(
    (baseScore * (1 - confidence * 0.4)) + (mlScore * confidence * 0.4)
  );

  console.log(`[Enhanced ML] Final score: ${finalScore} (base: ${baseScore}, ML: ${mlScore}, confidence: ${confidence * 100}%)`);

  // Step 7: Generate personalized insights
  const personalizedInsights = {
    industry: userProfile.dominantIndustry || 'General',
    seniority: userProfile.dominantSeniority || 'Mid',
    avgScore: userProfile.avgScore,
    trend: userProfile.trend,
    strengthAreas: identifyStrengths(mlFeatures, userProfile),
    improvementAreas: identifyImprovementAreas(mlFeatures, userProfile)
  };

  // Step 8: Generate hyper-personalized recommendations
  const recommendations = generatePersonalizedRecommendations(
    baseAnalysis,
    mlPrediction,
    userProfile,
    mlFeatures
  );

  // Step 9: Format missing keywords with priorities
  const missingCritical = baseAnalysis.missingCriticalKeywords.map(mkw => ({
    keyword: mkw.keyword,
    priority: mkw.priority,
    reason: personalizeReason(mkw.context, userProfile),
    section: mkw.section,
    impact: mkw.impact
  }));

  return {
    overallScore: finalScore,
    mlPredictedScore: mlScore,
    confidence: mlPrediction.confidence,

    keywordScore: baseAnalysis.keywordScore,
    formatScore: baseAnalysis.formatScore,
    completenessScore: baseAnalysis.completenessScore,
    atsCompatibilityScore: baseAnalysis.atsCompatibilityScore,

    mlFactors: mlPrediction.contributingFactors,

    extractedKeywords: enhancedKeywords.keywords,
    missingCriticalKeywords: missingCritical,
    semanticMatches: enhancedKeywords.semanticMatches,

    personalizedInsights,
    recommendations,

    atsIssues: baseAnalysis.atsIssues
  };
}

/**
 * Identify user's strength areas based on ML features and profile
 */
function identifyStrengths(
  features: any,
  userProfile: any
): string[] {
  const strengths: string[] = [];

  if (features.technicalDensity > 60) {
    strengths.push(`Strong technical vocabulary (${features.technicalDensity.toFixed(0)}% density)`);
  }

  if (features.impactScore > 70) {
    strengths.push(`Excellent demonstration of impact and results`);
  }

  if (features.metricDensity > 1.5) {
    strengths.push(`Good use of quantifiable metrics`);
  }

  if (features.actionVerbDensity > 6) {
    strengths.push(`Strong action verbs throughout`);
  }

  if (features.professionalTone > 85) {
    strengths.push(`Professional and polished tone`);
  }

  if (features.coherenceScore > 85) {
    strengths.push(`Well-structured and coherent`);
  }

  return strengths.length > 0 ? strengths : ['Solid foundation to build upon'];
}

/**
 * Identify improvement areas based on ML analysis and user profile
 */
function identifyImprovementAreas(
  features: any,
  userProfile: any
): string[] {
  const improvements: string[] = [];

  if (features.technicalDensity < 30 && userProfile.dominantIndustry?.toLowerCase().includes('tech')) {
    improvements.push(`Add more technical keywords for ${userProfile.dominantIndustry} roles`);
  }

  if (features.impactScore < 50) {
    improvements.push(`Emphasize measurable impact and achievements`);
  }

  if (features.metricDensity < 0.8) {
    improvements.push(`Include more quantifiable results (numbers, percentages, scale)`);
  }

  if (features.actionVerbDensity < 4) {
    improvements.push(`Use stronger action verbs to start bullet points`);
  }

  if (features.professionalTone < 70) {
    improvements.push(`Improve professional tone and avoid casual language`);
  }

  if (features.coherenceScore < 70) {
    improvements.push(`Improve structure and consistency`);
  }

  return improvements;
}

/**
 * Generate hyper-personalized recommendations
 */
function generatePersonalizedRecommendations(
  baseAnalysis: any,
  mlPrediction: any,
  userProfile: any,
  features: any
): Array<{
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  message: string;
  actionable: string;
  impact: number;
  personalizedFor?: string;
}> {
  const recommendations: any[] = [];

  // Add base recommendations with personalization
  for (const rec of baseAnalysis.recommendations) {
    recommendations.push({
      ...rec,
      personalizedFor: `Tailored for ${userProfile.dominantSeniority} ${userProfile.dominantIndustry} roles`
    });
  }

  // Add ML-driven recommendations
  const weakFactors = mlPrediction.contributingFactors
    .filter((f: any) => f.impact < 3)
    .slice(0, 3);

  for (const factor of weakFactors) {
    const featureName = factor.feature;
    const value = (features as any)[featureName];

    if (featureName === 'technicalDensity' && value < 40) {
      recommendations.push({
        category: 'Technical Skills',
        priority: 'high' as const,
        message: `Your technical keyword density is ${value.toFixed(1)}%, below optimal for ${userProfile.dominantIndustry}`,
        actionable: userProfile.dominantIndustry?.toLowerCase().includes('tech')
          ? 'Add specific technologies, frameworks, and tools you\'ve used. Examples: React, AWS, Python, Docker'
          : 'Include relevant industry-specific terminology and tools',
        impact: 18,
        personalizedFor: `Based on your ${userProfile.dominantIndustry} background`
      });
    }

    if (featureName === 'impactScore' && value < 50) {
      recommendations.push({
        category: 'Impact & Results',
        priority: 'high' as const,
        message: `Impact score is ${value}/100 - needs stronger achievement statements`,
        actionable: userProfile.dominantSeniority === 'senior' || userProfile.dominantSeniority === 'lead'
          ? 'Emphasize leadership impact: teams led, initiatives spearheaded, strategic outcomes delivered'
          : 'Focus on tangible results: projects completed, problems solved, efficiency gains',
        impact: 20,
        personalizedFor: `Expectations for ${userProfile.dominantSeniority}-level roles`
      });
    }
  }

  // Sort by priority and impact
  const priorityOrder: Record<"critical" | "high" | "medium" | "low", number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3
  };
  recommendations.sort((a, b) => {
    const aPriority = priorityOrder[a.priority as "critical" | "high" | "medium" | "low"] || 3;
    const bPriority = priorityOrder[b.priority as "critical" | "high" | "medium" | "low"] || 3;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return b.impact - a.impact;
  });

  return recommendations.slice(0, 10);
}

/**
 * Personalize reason text based on user profile
 */
function personalizeReason(reason: string, userProfile: any): string {
  return reason.replace(
    /Add "(.*?)"/g,
    (match, keyword) => `Add "${keyword}" - important for ${userProfile.dominantSeniority} ${userProfile.dominantIndustry} roles`
  );
}
