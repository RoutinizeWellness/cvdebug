/**
 * Adaptive Recommendation System
 * Uses ML learning weights to provide personalized, context-aware recommendations
 */

import { initializeModelWeights, type ModelWeights, analyzeFeatureImportance } from '@/convex/ml/learningEngine';

export interface AdaptiveRecommendation {
  id: string;
  title: string;
  description: string;
  impact: number; // 0-100
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'keywords' | 'format' | 'completeness' | 'ats' | 'experience' | 'metrics';
  actionSteps: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  confidence: number; // 0-1, how confident the model is
  personalizedReason: string; // Why this matters for THIS user
}

export interface ResumeContext {
  industry: string;
  targetRole?: string;
  experienceYears: number;
  currentScore: number;
  keywordScore: number;
  formatScore: number;
  completenessScore: number;
  atsScore: number;
  hasMetrics: boolean;
  actionVerbCount: number;
  technicalSkillsCount: number;
}

/**
 * Generate personalized recommendations using learned model weights
 */
export function generateAdaptiveRecommendations(
  context: ResumeContext,
  modelWeights: ModelWeights = initializeModelWeights(),
  limit: number = 10
): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];

  // Analyze feature importance to prioritize recommendations
  const featureImportance = analyzeFeatureImportance(modelWeights);

  // Calculate potential impact for each area
  const impacts = calculatePotentialImpacts(context, modelWeights, featureImportance);

  // Generate keyword recommendations if high impact
  if (impacts.keywords > 15 && context.keywordScore < 80) {
    recommendations.push({
      id: 'keywords-1',
      title: 'Optimize Keyword Density',
      description: `Your keyword score (${context.keywordScore}/100) is below target. Based on ${modelWeights.trainingExamples} successful resumes, keyword optimization has a ${modelWeights.keywordDensity.toFixed(2)}x impact on success.`,
      impact: Math.min(impacts.keywords, 100),
      priority: impacts.keywords > 30 ? 'critical' : impacts.keywords > 20 ? 'high' : 'medium',
      category: 'keywords',
      actionSteps: [
        'Review the job description for technical terms and skills',
        'Identify 3-5 must-have keywords missing from your resume',
        'Integrate keywords naturally into your experience bullets',
        'Use variations and synonyms of key terms'
      ],
      estimatedTime: '15-20 min',
      difficulty: 'easy',
      confidence: modelWeights.keywordDensity,
      personalizedReason: `In ${context.industry}, keyword density is ${(getIndustryMultiplier(context.industry, modelWeights) * 100 - 100).toFixed(0)}% more important than average.`
    });
  }

  // Format recommendations
  if (impacts.format > 12 && context.formatScore < 85) {
    recommendations.push({
      id: 'format-1',
      title: 'Improve ATS Formatting',
      description: `Format improvements could increase your score by ${impacts.format.toFixed(0)} points. Our model shows a ${modelWeights.formatScore.toFixed(2)}x correlation with interview success.`,
      impact: Math.min(impacts.format, 100),
      priority: impacts.format > 25 ? 'critical' : impacts.format > 15 ? 'high' : 'medium',
      category: 'format',
      actionSteps: [
        'Use standard section headings (Experience, Education, Skills)',
        'Avoid tables, text boxes, and multi-column layouts',
        'Use simple bullet points (•) instead of special characters',
        'Ensure consistent font sizes and spacing'
      ],
      estimatedTime: '10-15 min',
      difficulty: 'easy',
      confidence: modelWeights.formatScore,
      personalizedReason: 'ATS parsing failures are the #1 cause of qualified candidates being rejected.'
    });
  }

  // Metrics and quantification
  if (impacts.metrics > 10 && !context.hasMetrics) {
    recommendations.push({
      id: 'metrics-1',
      title: 'Add Quantifiable Achievements',
      description: `Resumes with metrics have a ${(modelWeights.hasMetrics * 100).toFixed(0)}% higher success rate. This could boost your score by ${impacts.metrics.toFixed(0)} points.`,
      impact: Math.min(impacts.metrics, 100),
      priority: 'high',
      category: 'metrics',
      actionSteps: [
        'Review each bullet point and ask "How much?" or "By what percentage?"',
        'Add numbers: revenue impact, team size, time saved, efficiency gains',
        'Use concrete metrics: "Increased sales by 35%" vs "Increased sales"',
        'Include scale: "Led team of 8", "Managed $2M budget"'
      ],
      estimatedTime: '20-25 min',
      difficulty: 'medium',
      confidence: modelWeights.hasMetrics,
      personalizedReason: 'Quantified achievements are 3x more memorable to hiring managers and show clear business impact.'
    });
  }

  // Action verbs
  if (impacts.actionVerbs > 8 && context.actionVerbCount < 15) {
    recommendations.push({
      id: 'action-verbs-1',
      title: 'Strengthen Action Verbs',
      description: `Strong action verbs correlate with ${(modelWeights.actionVerbs * 100).toFixed(0)}% higher success rate. Potential impact: +${impacts.actionVerbs.toFixed(0)} points.`,
      impact: Math.min(impacts.actionVerbs, 100),
      priority: 'medium',
      category: 'keywords',
      actionSteps: [
        'Replace weak verbs: "Responsible for" → "Led", "Helped" → "Drove"',
        'Use power verbs: Architected, Optimized, Spearheaded, Transformed',
        'Start each bullet with a strong action verb',
        'Vary your verbs - avoid repetition'
      ],
      estimatedTime: '10-15 min',
      difficulty: 'easy',
      confidence: modelWeights.actionVerbs,
      personalizedReason: 'Action verbs demonstrate ownership and leadership, key traits for mid-level+ roles.'
    });
  }

  // Technical skills
  if (impacts.technicalSkills > 8 && context.technicalSkillsCount < 10) {
    recommendations.push({
      id: 'tech-skills-1',
      title: 'Expand Technical Skills Section',
      description: `Technical skills have a ${(modelWeights.technicalSkills * 100).toFixed(0)}% correlation with success in ${context.industry}. Add ${10 - context.technicalSkillsCount} more relevant skills.`,
      impact: Math.min(impacts.technicalSkills, 100),
      priority: context.industry === 'technology' ? 'high' : 'medium',
      category: 'completeness',
      actionSteps: [
        'List programming languages, frameworks, and tools you\'ve used',
        'Include certifications and specialized knowledge',
        'Add both hard skills (Python, AWS) and methodologies (Agile, CI/CD)',
        'Match skills to job description keywords'
      ],
      estimatedTime: '5-10 min',
      difficulty: 'easy',
      confidence: modelWeights.technicalSkills,
      personalizedReason: `${context.industry} roles place ${(getIndustryMultiplier(context.industry, modelWeights) * 100 - 100).toFixed(0)}% more weight on technical breadth.`
    });
  }

  // Experience optimization
  if (impacts.experience > 10 && context.completenessScore < 80) {
    recommendations.push({
      id: 'completeness-1',
      title: 'Enhance Work Experience Details',
      description: `Completeness score of ${context.completenessScore}/100 is below optimal. This improvement could add ${impacts.experience.toFixed(0)} points based on our ${modelWeights.version}.0 model.`,
      impact: Math.min(impacts.experience, 100),
      priority: 'high',
      category: 'completeness',
      actionSteps: [
        'Add 3-5 bullets per role (minimum)',
        'Include company context (size, industry, your scope)',
        'Describe impact and results, not just responsibilities',
        'Use STAR method: Situation, Task, Action, Result'
      ],
      estimatedTime: '25-30 min',
      difficulty: 'medium',
      confidence: modelWeights.completenessScore,
      personalizedReason: 'Detailed experience sections help ATS algorithms understand your expertise depth.'
    });
  }

  // Industry-specific recommendations
  const industryMultiplier = getIndustryMultiplier(context.industry, modelWeights);
  if (industryMultiplier > 1.05) {
    recommendations.push({
      id: 'industry-1',
      title: `Optimize for ${context.industry} Industry`,
      description: `Our model shows ${context.industry} resumes perform ${((industryMultiplier - 1) * 100).toFixed(0)}% better with industry-specific optimization.`,
      impact: 15,
      priority: 'medium',
      category: 'keywords',
      actionSteps: [
        `Research top skills and certifications in ${context.industry}`,
        'Use industry-standard terminology and jargon',
        'Highlight relevant domain expertise',
        'Include industry-specific achievements'
      ],
      estimatedTime: '15-20 min',
      difficulty: 'medium',
      confidence: 0.85,
      personalizedReason: `${context.industry} roles have unique expectations that our model has learned from ${modelWeights.trainingExamples} examples.`
    });
  }

  // ATS compatibility
  if (impacts.ats > 15 && context.atsScore < 75) {
    recommendations.push({
      id: 'ats-1',
      title: 'Critical: Fix ATS Compatibility Issues',
      description: `ATS score of ${context.atsScore}/100 means many systems may fail to parse your resume. This has a ${(modelWeights.atsCompatibility * 100).toFixed(0)}% impact on success.`,
      impact: Math.min(impacts.ats, 100),
      priority: 'critical',
      category: 'ats',
      actionSteps: [
        'Convert to simple .docx or PDF format (no images)',
        'Remove headers/footers with important info',
        'Use standard fonts (Arial, Calibri, Times New Roman)',
        'Test with an ATS parser to verify readability'
      ],
      estimatedTime: '15-20 min',
      difficulty: 'medium',
      confidence: modelWeights.atsCompatibility,
      personalizedReason: '75% of resumes are rejected by ATS before a human sees them. This is your #1 priority.'
    });
  }

  // Sort by impact and limit
  recommendations.sort((a, b) => b.impact - a.impact);

  return recommendations.slice(0, limit);
}

/**
 * Calculate potential score improvements for each category
 */
function calculatePotentialImpacts(
  context: ResumeContext,
  weights: ModelWeights,
  featureImportance: Array<{ feature: string; importance: number; averageImpact: number }>
): Record<string, number> {
  const maxScore = 100;
  const currentScore = context.currentScore;
  const roomForImprovement = maxScore - currentScore;

  return {
    keywords: (1 - context.keywordScore / 100) * weights.keywordDensity * roomForImprovement,
    format: (1 - context.formatScore / 100) * weights.formatScore * roomForImprovement,
    completeness: (1 - context.completenessScore / 100) * weights.completenessScore * roomForImprovement,
    ats: (1 - context.atsScore / 100) * weights.atsCompatibility * roomForImprovement,
    experience: Math.max(0, (10 - context.experienceYears) / 10) * weights.experienceYears * roomForImprovement * 0.5,
    metrics: context.hasMetrics ? 0 : weights.hasMetrics * roomForImprovement,
    actionVerbs: Math.max(0, (20 - context.actionVerbCount) / 20) * weights.actionVerbs * roomForImprovement,
    technicalSkills: Math.max(0, (15 - context.technicalSkillsCount) / 15) * weights.technicalSkills * roomForImprovement
  };
}

/**
 * Get industry-specific multiplier
 */
function getIndustryMultiplier(industry: string, weights: ModelWeights): number {
  return weights.industryWeights[industry.toLowerCase()] || 1.0;
}

/**
 * Generate quick wins - easy, high-impact changes
 */
export function getQuickWins(
  context: ResumeContext,
  modelWeights: ModelWeights = initializeModelWeights()
): AdaptiveRecommendation[] {
  const allRecommendations = generateAdaptiveRecommendations(context, modelWeights, 20);

  return allRecommendations
    .filter(rec => rec.difficulty === 'easy' && rec.impact >= 10)
    .slice(0, 5);
}

/**
 * Get critical issues that must be fixed
 */
export function getCriticalIssues(
  context: ResumeContext,
  modelWeights: ModelWeights = initializeModelWeights()
): AdaptiveRecommendation[] {
  const allRecommendations = generateAdaptiveRecommendations(context, modelWeights, 20);

  return allRecommendations
    .filter(rec => rec.priority === 'critical' || (rec.priority === 'high' && rec.impact >= 25));
}

/**
 * Estimate total score improvement if all recommendations are followed
 */
export function estimateTotalImprovement(
  context: ResumeContext,
  modelWeights: ModelWeights = initializeModelWeights()
): {
  currentScore: number;
  projectedScore: number;
  improvement: number;
  confidence: number;
} {
  const recommendations = generateAdaptiveRecommendations(context, modelWeights, 20);

  // Diminishing returns: can't just add all impacts
  const totalImpact = recommendations.reduce((sum, rec) => sum + rec.impact, 0);
  const adjustedImpact = totalImpact * 0.6; // 60% of theoretical max due to overlaps

  const projectedScore = Math.min(100, context.currentScore + adjustedImpact);
  const improvement = projectedScore - context.currentScore;

  // Confidence based on number of training examples
  const confidence = Math.min(0.95, 0.5 + (modelWeights.trainingExamples / 1000) * 0.45);

  return {
    currentScore: context.currentScore,
    projectedScore: Math.round(projectedScore),
    improvement: Math.round(improvement),
    confidence
  };
}
