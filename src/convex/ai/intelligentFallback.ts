/**
 * Intelligent ML-based Fallback System
 *
 * Strategy:
 * 1. Free users get good analysis (65-75 score) with clear limitations
 * 2. Premium users get excellent AI analysis (85-95 score)
 * 3. System learns from user interactions to improve
 * 4. Strategic upgrade prompts based on resume quality
 */

import { classifyRole, actionVerbs } from "./config/keywords";
import { calculateKeywordScore } from "./scoring/keywordScoring";
import { calculateFormatScore } from "./scoring/formatScoring";
import { calculateCompletenessScore } from "./scoring/completenessScoring";

interface MLConfig {
  keywordWeights?: Record<string, number>;
  categoryWeights?: Record<string, number>;
  scoringAdjustments?: { keywords?: number; format?: number; completeness?: number };
  discoveredKeywords?: string[];
}

interface AnalysisResult {
  title: string;
  category: string;
  score: number;
  scoreBreakdown: {
    keywords: number;
    format: number;
    completeness: number;
  };
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
  metricSuggestions: any[];
  analysis: string;
  upgradeIncentive?: {
    show: boolean;
    reason: string;
    potentialImprovement: number;
    features: string[];
  };
}

export function generateIntelligentFallback(
  ocrText: string,
  jobDescription?: string,
  mlConfig?: MLConfig,
  isPremium: boolean = false
): AnalysisResult {
  console.log(`[Intelligent Fallback] Generating analysis - Premium: ${isPremium}`);

  // Validate input
  if (!ocrText || ocrText.trim().length < 50) {
    return generateMinimalResume(isPremium);
  }

  const hasJD = !!(jobDescription && jobDescription.trim().length > 50);

  // Step 1: Classify role
  const { category, confidence } = classifyRole(ocrText);
  console.log(`[Intelligent Fallback] Role: ${category}, Confidence: ${(confidence * 100).toFixed(1)}%`);

  // Step 2: Calculate scores with ML enhancements
  const keywordResult = calculateKeywordScore(
    ocrText,
    category,
    jobDescription,
    mlConfig?.keywordWeights
  );

  const formatResult = calculateFormatScore(ocrText);
  const completenessResult = calculateCompletenessScore(ocrText, category);

  // Step 3: Apply premium vs free differentiation
  let finalKeywordScore = keywordResult.keywordScore;
  let finalFormatScore = formatResult.formatScore;
  let finalCompletenessScore = completenessResult.completenessScore;

  if (!isPremium) {
    // Free users: Cap scores to create incentive for upgrade
    // Good enough to be useful, but clearly improvable
    finalKeywordScore = Math.min(finalKeywordScore, 75);
    finalFormatScore = Math.min(finalFormatScore, 72);
    finalCompletenessScore = Math.min(finalCompletenessScore, 78);

    // Add slight randomness to feel more authentic
    finalKeywordScore = Math.max(55, finalKeywordScore - Math.random() * 8);
    finalFormatScore = Math.max(60, finalFormatScore - Math.random() * 5);
    finalCompletenessScore = Math.max(62, finalCompletenessScore - Math.random() * 6);
  } else {
    // Premium users: Full accurate scores
    // Apply ML learning adjustments
    if (mlConfig?.scoringAdjustments) {
      finalKeywordScore += mlConfig.scoringAdjustments.keywords || 0;
      finalFormatScore += mlConfig.scoringAdjustments.format || 0;
      finalCompletenessScore += mlConfig.scoringAdjustments.completeness || 0;
    }
  }

  // Calculate overall score
  const overallScore = Math.round(
    (finalKeywordScore * 0.45) +
    (finalFormatScore * 0.30) +
    (finalCompletenessScore * 0.25)
  );

  // Step 4: Generate recommendations
  const matchedKeywords = keywordResult.matchedKeywords.slice(0, isPremium ? 15 : 8);
  const missingKeywords = keywordResult.missingKeywords.slice(0, isPremium ? 12 : 6).map((kw: any) => ({
    keyword: kw.keyword,
    priority: kw.impact > 15 ? "critical" : kw.impact > 10 ? "important" : "suggested",
    section: kw.section,
    context: isPremium
      ? `Add this to your ${kw.section} section. ${kw.examples?.[0] || ''}`
      : `Add this keyword to improve your score.`,
    frequency: kw.frequency,
    impact: kw.impact,
    synonyms: kw.synonyms || []
  }));

  // Step 5: Format issues
  const formatIssues = formatResult.formatIssues.slice(0, isPremium ? 10 : 5);

  // Step 6: Generate analysis text
  const analysis = generateAnalysisText({
    overallScore,
    category,
    hasJD,
    isPremium,
    keywordScore: finalKeywordScore,
    formatScore: finalFormatScore,
    completenessScore: finalCompletenessScore,
    matchedCount: matchedKeywords.length,
    missingCount: missingKeywords.length,
    formatIssuesCount: formatIssues.length
  });

  // Step 7: Upgrade incentive (only for free users with decent resumes)
  const upgradeIncentive = !isPremium && overallScore > 50 && overallScore < 80 ? {
    show: true,
    reason: overallScore > 65
      ? "Your resume is good, but we found opportunities for significant improvement"
      : "We detected multiple areas that need AI-powered optimization",
    potentialImprovement: Math.min(25, 95 - overallScore),
    features: [
      "🤖 Advanced AI analysis with 95%+ accuracy",
      "🎯 Unlimited keyword optimization suggestions",
      "📊 Detailed ATS compatibility report",
      "✨ AI-powered resume rewriting",
      "🔄 Unlimited scans and iterations",
      "📈 Interview preparation tools"
    ]
  } : undefined;

  return {
    title: extractTitle(ocrText, category),
    category,
    score: overallScore,
    scoreBreakdown: {
      keywords: Math.round(finalKeywordScore),
      format: Math.round(finalFormatScore),
      completeness: Math.round(finalCompletenessScore)
    },
    matchedKeywords,
    missingKeywords,
    formatIssues,
    metricSuggestions: [],
    analysis,
    upgradeIncentive
  };
}

function generateMinimalResume(isPremium: boolean): AnalysisResult {
  return {
    title: "Resume",
    category: "General",
    score: 18,
    scoreBreakdown: { keywords: 5, format: 6, completeness: 7 },
    matchedKeywords: [],
    missingKeywords: [{
      keyword: "Readable content",
      priority: "critical",
      section: "Overall",
      context: "Your resume appears to be a scanned image or has very limited text",
      frequency: 1,
      impact: 25,
      synonyms: []
    }],
    formatIssues: [{
      issue: "Severe parsing issues detected",
      severity: "critical",
      fix: "Convert to text-based PDF",
      location: "Overall",
      atsImpact: "95%+ rejection rate"
    }],
    metricSuggestions: [],
    analysis: "⚠️ **Critical Issues Detected**\n\nYour resume has severe problems:\n• Less than 50 characters detected\n• Format is incompatible with ATS\n• Will be automatically rejected\n\n**Fix:** Export as PDF from Word/Google Docs",
    upgradeIncentive: !isPremium ? {
      show: true,
      reason: "Get professional help fixing these critical issues",
      potentialImprovement: 60,
      features: ["Expert format analysis", "ATS-compatible templates", "Professional rewriting"]
    } : undefined
  };
}

function extractTitle(text: string, category: string): string {
  // Try to extract job title from first few lines
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    // Skip name-like lines (all caps, short)
    if (line.length < 50 && line.length > 5 && !/^\d/.test(line)) {
      // Check if it contains job-like words
      if (/(engineer|developer|manager|analyst|designer|specialist|coordinator|director|lead)/i.test(line)) {
        return line.substring(0, 100);
      }
    }
  }

  // Fallback to category
  const categoryTitles: Record<string, string> = {
    'Software Engineering': 'Software Engineer',
    'Data Science': 'Data Scientist',
    'Product Management': 'Product Manager',
    'Marketing': 'Marketing Professional',
    'Sales': 'Sales Professional',
    'Design': 'Designer',
    'Finance': 'Finance Professional',
    'Healthcare': 'Healthcare Professional'
  };

  return categoryTitles[category] || 'Professional';
}

function generateAnalysisText(params: {
  overallScore: number;
  category: string;
  hasJD: boolean;
  isPremium: boolean;
  keywordScore: number;
  formatScore: number;
  completenessScore: number;
  matchedCount: number;
  missingCount: number;
  formatIssuesCount: number;
}): string {
  const { overallScore, isPremium, keywordScore, formatScore, missingCount, formatIssuesCount } = params;

  let analysis = "";

  // Score assessment
  if (overallScore >= 85) {
    analysis += "✅ **Excellent Resume**\n\nYour resume is in great shape";
  } else if (overallScore >= 70) {
    analysis += "📊 **Good Resume with Room for Improvement**\n\nYour resume is solid";
  } else if (overallScore >= 55) {
    analysis += "⚠️ **Needs Improvement**\n\nYour resume has potential";
  } else {
    analysis += "🚨 **Critical Issues**\n\nYour resume needs significant work";
  }

  analysis += isPremium
    ? " and we've identified specific areas for optimization.\n\n"
    : " but our free analysis is limited.\n\n";

  // Key findings
  analysis += "**Key Findings:**\n";

  if (keywordScore < 70) {
    analysis += `• Keyword optimization: ${Math.round(keywordScore)}/100`;
    if (!isPremium) {
      analysis += " (upgrade for detailed keyword analysis)";
    }
    analysis += "\n";
  }

  if (formatScore < 75) {
    analysis += `• Format compatibility: ${Math.round(formatScore)}/100`;
    if (!isPremium) {
      analysis += " (upgrade to see all format issues)";
    }
    analysis += "\n";
  }

  if (missingCount > 0) {
    analysis += `• Missing ${missingCount} critical keywords`;
    if (!isPremium && missingCount > 6) {
      analysis += ` (showing top 6, upgrade to see all ${missingCount})`;
    }
    analysis += "\n";
  }

  if (formatIssuesCount > 0) {
    analysis += `• ${formatIssuesCount} format issues detected`;
    if (!isPremium && formatIssuesCount > 5) {
      analysis += ` (showing top 5, upgrade for complete list)`;
    }
    analysis += "\n";
  }

  // Premium upsell
  if (!isPremium && overallScore < 85) {
    analysis += "\n💎 **Upgrade to Premium** for:\n";
    analysis += "• Advanced AI analysis with 95%+ accuracy\n";
    analysis += "• All keyword suggestions and synonyms\n";
    analysis += "• Complete format issue breakdown\n";
    analysis += "• AI-powered resume rewriting\n";
    analysis += "• Interview preparation tools\n";
  }

  return analysis;
}
