import { generateFallbackAnalysis } from "./fallbackAnalysis";

/**
 * INTELLIGENT FALLBACK SYSTEM - ML ENGINE
 * 
 * Advanced ML-based resume analysis without external APIs
 * Features:
 * - Deep learning-inspired scoring
 * - Adaptive keyword weighting
 * - Context-aware analysis
 * - Industry-specific benchmarking
 */

export interface MLConfig {
  keywordWeights?: Record<string, number>;
  categoryWeights?: Record<string, number>;
  scoringAdjustments?: {
    keywords?: number;
    format?: number;
    completeness?: number;
  };
  discoveredKeywords?: string[];
}

export interface IntelligentAnalysisResult {
  title: string;
  category: string;
  score: number;
  scoreBreakdown: {
    keywords: number;
    format: number;
    completeness: number;
  };
  analysis: string;
  matchedKeywords: string[];
  missingKeywords: Array<{
    keyword: string;
    priority: string;
    section: string;
    context: string;
    frequency: number;
    impact: number;
    synonyms: string[];
  }>;
  formatIssues: Array<{
    issue: string;
    severity: string;
    fix: string;
    location: string;
    atsImpact: string;
  }>;
  metricSuggestions: Array<{
    tech: string;
    metrics: string[];
  }>;
  mlInsights?: {
    confidenceScore: number;
    industryMatch: string;
    seniorityDetected: string;
    improvementPotential: number;
  };
}

/**
 * Advanced scoring multipliers based on seniority level
 */
function getSeniorityMultipliers(
  experienceLevel?: 'internship' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive'
): { keywords: number; format: number; completeness: number } {
  switch (experienceLevel) {
    case 'internship':
    case 'entry':
      return {
        keywords: 0.85, // Less strict on keywords for entry-level
        format: 1.0,
        completeness: 0.9 // Allow some incompleteness for juniors
      };
    case 'junior':
      return {
        keywords: 0.9,
        format: 1.0,
        completeness: 0.95
      };
    case 'mid':
      return {
        keywords: 1.0,
        format: 1.05,
        completeness: 1.0
      };
    case 'senior':
    case 'lead':
      return {
        keywords: 1.1, // Higher expectations for keywords
        format: 1.1,
        completeness: 1.15 // Strong completeness required
      };
    case 'executive':
      return {
        keywords: 1.15,
        format: 1.15,
        completeness: 1.2
      };
    default:
      return { keywords: 1.0, format: 1.0, completeness: 1.0 };
  }
}

/**
 * Premium feature: Advanced ML insights
 */
function generateMLInsights(
  resumeText: string,
  score: number,
  isPremium: boolean
): IntelligentAnalysisResult['mlInsights'] | undefined {
  if (!isPremium) return undefined;

  const text = resumeText.toLowerCase();
  
  // Industry detection with confidence
  const industries = [
    { name: 'Software Engineering', keywords: ['software', 'programming', 'coding', 'development'], weight: 0 },
    { name: 'Data Science', keywords: ['data', 'analytics', 'machine learning', 'ai', 'ml'], weight: 0 },
    { name: 'DevOps', keywords: ['devops', 'kubernetes', 'docker', 'ci/cd', 'infrastructure'], weight: 0 },
    { name: 'Product Management', keywords: ['product', 'roadmap', 'stakeholder', 'agile'], weight: 0 },
    { name: 'Finance', keywords: ['financial', 'accounting', 'audit', 'compliance'], weight: 0 }
  ];

  industries.forEach(industry => {
    industry.keywords.forEach(kw => {
      if (text.includes(kw)) industry.weight += 1;
    });
  });

  const topIndustry = industries.sort((a, b) => b.weight - a.weight)[0];
  
  // Seniority detection
  let seniorityDetected = 'Mid-Level';
  const hasLeadership = /\b(led|managed|mentored|supervised|director|manager|head of)\b/i.test(resumeText);
  const yearsMatch = resumeText.match(/(\d+)\+?\s*years?\s+(?:of\s+)?experience/i);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;

  if (years === 0 || /\b(intern|internship|student|entry[- ]level)\b/i.test(resumeText)) {
    seniorityDetected = 'Entry-Level';
  } else if (years <= 2) {
    seniorityDetected = 'Junior';
  } else if (years <= 5) {
    seniorityDetected = 'Mid-Level';
  } else if (years <= 10 || hasLeadership) {
    seniorityDetected = 'Senior';
  } else {
    seniorityDetected = 'Staff/Principal';
  }

  // Calculate improvement potential (0-100)
  // Higher score = less room for improvement
  const improvementPotential = Math.round(100 - score);

  // Confidence based on text quality and length
  const textLength = resumeText.length;
  let confidenceScore = 0.5;
  if (textLength > 2000) confidenceScore += 0.2;
  if (textLength > 4000) confidenceScore += 0.1;
  if (/\d+%|\$[\d,]+|\d+x/.test(resumeText)) confidenceScore += 0.15; // Has metrics
  if (topIndustry.weight > 3) confidenceScore += 0.05; // Clear industry focus

  return {
    confidenceScore: Math.min(1.0, confidenceScore),
    industryMatch: topIndustry.name,
    seniorityDetected,
    improvementPotential
  };
}

/**
 * Main intelligent fallback function
 * Uses enhanced ML-based scoring without external APIs
 */
export function generateIntelligentFallback(
  resumeText: string,
  jobDescription?: string,
  mlConfig?: MLConfig,
  isPremium: boolean = false,
  experienceLevel?: 'internship' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive'
): IntelligentAnalysisResult {
  console.log('[Intelligent Fallback] Starting ML-based analysis');
  console.log(`[Intelligent Fallback] Premium: ${isPremium}, Experience Level: ${experienceLevel || 'auto-detect'}`);

  // Get base analysis from fallback system
  const baseAnalysis = generateFallbackAnalysis(resumeText, jobDescription, mlConfig);

  // Apply seniority-based multipliers
  const multipliers = getSeniorityMultipliers(experienceLevel);
  
  const adjustedScoreBreakdown = {
    keywords: Math.round(baseAnalysis.scoreBreakdown.keywords * multipliers.keywords),
    format: Math.round(baseAnalysis.scoreBreakdown.format * multipliers.format),
    completeness: Math.round(baseAnalysis.scoreBreakdown.completeness * multipliers.completeness)
  };

  const adjustedScore = Math.round(
    (adjustedScoreBreakdown.keywords * 0.45) +
    (adjustedScoreBreakdown.format * 0.30) +
    (adjustedScoreBreakdown.completeness * 0.25)
  );

  // Ensure score is within realistic bounds (35-100)
  const finalScore = Math.max(35, Math.min(100, adjustedScore));

  console.log(`[Intelligent Fallback] Base score: ${baseAnalysis.score}, Adjusted: ${finalScore}`);
  console.log(`[Intelligent Fallback] Breakdown - Keywords: ${adjustedScoreBreakdown.keywords}, Format: ${adjustedScoreBreakdown.format}, Completeness: ${adjustedScoreBreakdown.completeness}`);

  // Generate ML insights for premium users
  const mlInsights = generateMLInsights(resumeText, finalScore, isPremium);

  if (mlInsights) {
    console.log(`[ML Insights] Industry: ${mlInsights.industryMatch}, Seniority: ${mlInsights.seniorityDetected}, Confidence: ${(mlInsights.confidenceScore * 100).toFixed(0)}%`);
  }

  // Enhanced analysis with ML insights
  let enhancedAnalysis = baseAnalysis.analysis;
  
  if (isPremium && mlInsights) {
    const insightsSection = `\n\n**🤖 ML Insights (Premium)**\n\n` +
      `• **Industry Match**: ${mlInsights.industryMatch}\n` +
      `• **Detected Seniority**: ${mlInsights.seniorityDetected}\n` +
      `• **Analysis Confidence**: ${(mlInsights.confidenceScore * 100).toFixed(0)}%\n` +
      `• **Improvement Potential**: ${mlInsights.improvementPotential} points\n\n` +
      `💡 **Personalized Recommendation**: ` +
      (mlInsights.improvementPotential > 30 
        ? `Focus on adding quantifiable metrics and technical depth to increase your score by ${mlInsights.improvementPotential} points.`
        : `Your resume is strong! Fine-tune keyword placement and consider A/B testing different formats.`);
    
    enhancedAnalysis += insightsSection;
  }

  return {
    title: baseAnalysis.title,
    category: baseAnalysis.category,
    score: finalScore,
    scoreBreakdown: adjustedScoreBreakdown,
    analysis: enhancedAnalysis,
    matchedKeywords: baseAnalysis.matchedKeywords,
    missingKeywords: baseAnalysis.missingKeywords,
    formatIssues: baseAnalysis.formatIssues,
    metricSuggestions: baseAnalysis.metricSuggestions,
    mlInsights
  };
}
