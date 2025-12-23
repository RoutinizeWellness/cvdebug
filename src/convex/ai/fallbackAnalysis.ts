import { classifyRole, type RoleCategory, actionVerbs } from "./config/keywords";
import { generateSmartMetricSuggestions } from "./config/metricTemplates";
import { calculateKeywordScore } from "./scoring/keywordScoring";
import { calculateFormatScore } from "./scoring/formatScoring";
import { calculateCompletenessScore } from "./scoring/completenessScoring";
import { formatAnalysisReport } from "./scoring/analysisFormatter";

// Enhanced ML-based fallback analysis with adaptive learning
export function generateFallbackAnalysis(
  ocrText: string, 
  jobDescription?: string,
  mlConfig?: {
    keywordWeights?: Record<string, number>;
    categoryWeights?: Record<string, number>;
    scoringAdjustments?: { keywords?: number; format?: number; completeness?: number };
    discoveredKeywords?: string[];
  }
): any {
  console.log("[Fallback Analysis] Generating ML-based analysis with adaptive learning");
  
  // Validate input - ensure we always return a valid score
  if (!ocrText || ocrText.trim().length < 10) {
    console.warn("[Fallback Analysis] Text too short, returning minimal score");
    return {
      title: "Resume",
      category: "General",
      score: 15,
      scoreBreakdown: { keywords: 0, format: 5, completeness: 10 },
      missingKeywords: [],
      formatIssues: [{
        issue: "Resume text is too short or unreadable",
        severity: "high",
        fix: "Please upload a clearer file with more content",
        location: "Overall",
        atsImpact: "Cannot be parsed by ATS"
      }],
      metricSuggestions: [],
      analysis: "Resume text is too short for proper analysis. Please upload a complete resume."
    };
  }
  
  const hasJD: boolean = !!(jobDescription && jobDescription.trim().length > 0);
  
  // ===== ENHANCED ROLE CLASSIFICATION WITH LEARNED WEIGHTS =====
  
  const { category, confidence } = classifyRole(ocrText);
  
  let adjustedCategory = category;
  if (mlConfig?.categoryWeights) {
    const categoryScores = Object.entries(mlConfig.categoryWeights).map(([cat, weight]) => ({
      category: cat as RoleCategory,
      score: weight as number,
    }));
    
    if (categoryScores.length > 0) {
      const topCategory = categoryScores.sort((a, b) => b.score - a.score)[0];
      if (topCategory.score > confidence) {
        adjustedCategory = topCategory.category;
        console.log(`[ML Learning] Category adjusted from ${category} to ${adjustedCategory} based on learned weights`);
      }
    }
  }
  
  console.log(`[Role Classification] Category: ${adjustedCategory}, Confidence: ${(confidence * 100).toFixed(1)}%`);
  
  // ===== SCORING CALCULATIONS =====
  
  const { foundKeywords, missingKeywords, keywordScore } = calculateKeywordScore(
    ocrText, 
    adjustedCategory, 
    jobDescription, 
    mlConfig
  );
  
  const { formatScore, formatIssues } = calculateFormatScore(ocrText, mlConfig);
  
  const { completenessScore, bulletAnalysis, softSkillsAnalysis } = calculateCompletenessScore(ocrText, mlConfig);
  
  // ===== FINAL SCORE CALCULATION WITH REALISM CURVE =====
  
  let rawScore = keywordScore + formatScore + completenessScore;

  // Apply "Realism Curve" - harder to get high scores
  if (rawScore > 55) {
    rawScore = 55 + (rawScore - 55) * 0.6;
  }
  
  const totalScore = Math.round(Math.min(100, Math.max(0, rawScore)));
  
  // Ensure score is never 0 unless text is completely invalid
  const finalScore = totalScore === 0 && ocrText.trim().length > 50 ? 15 : totalScore;
  
  // ===== ENHANCED METRIC SUGGESTIONS =====
  
  const metricSuggestions = generateSmartMetricSuggestions(ocrText, adjustedCategory, foundKeywords);
  
  // ===== COLLECT DATA FOR REPORT FORMATTING =====
  
  const emailMatch = ocrText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = ocrText.match(/\+?[\d\s()-]{10,}/);
  const text = ocrText.toLowerCase();
  const hasLinkedIn = text.includes("linkedin") || text.includes("linked.in");
  const hasExperience = /experience|work history|employment/i.test(ocrText);
  const hasEducation = /education|academic|degree/i.test(ocrText);
  const hasSkills = /skills|technical skills|competencies/i.test(ocrText);
  
  const datePatterns = [
    /\d{1,2}\/\d{4}/g,
    /\d{4}-\d{2}/g,
    /[A-Z][a-z]+ \d{4}/g
  ];
  const dateMatches = datePatterns.map(pattern => (ocrText.match(pattern) || []).length);
  const hasConsistentDates = dateMatches.filter(count => count > 0).length <= 1;
  
  const metricPatterns = [
    /\d+%/g,
    /\$[\d,]+/g,
    /\d+\+?\s*(users|customers|clients)/gi,
    /increased|improved|reduced|optimized/gi,
    /\d+x\s/g,
    /\d+\s*(million|billion|thousand)/gi,
  ];
  let metricCount = 0;
  metricPatterns.forEach(pattern => {
    const matches = ocrText.match(pattern);
    if (matches) metricCount += matches.length;
  });
  
  // Use imported actionVerbs
  const strongVerbs = new RegExp(`\\b(${actionVerbs.join('|')})\\b`, 'gi');
  const strongVerbMatches = (ocrText.match(strongVerbs) || []).length;
  
  // ===== GENERATE DETAILED ANALYSIS =====
  
  const analysis = formatAnalysisReport({
    adjustedCategory,
    confidence,
    totalScore: finalScore,
    keywordScore,
    formatScore,
    completenessScore,
    foundKeywords,
    missingKeywords,
    formatIssues,
    metricSuggestions,
    bulletAnalysis,
    softSkillsAnalysis,
    hasJD: hasJD,
    emailMatch,
    phoneMatch,
    hasLinkedIn,
    hasExperience,
    hasEducation,
    hasSkills,
    hasConsistentDates,
    metricCount,
    strongVerbMatches,
    ocrTextLength: ocrText.length
  });

  return {
    title: `${adjustedCategory} Resume`,
    category: adjustedCategory,
    score: finalScore,
    scoreBreakdown: {
      keywords: Math.round(keywordScore),
      format: Math.round(formatScore),
      completeness: Math.round(completenessScore)
    },
    matchedKeywords: foundKeywords.map(kw => kw.keyword).slice(0, 50),
    missingKeywords: missingKeywords.slice(0, 10).map(kw => ({
      keyword: kw.keyword,
      priority: kw.priority,
      section: "Experience",
      context: `Add "${kw.keyword}" to relevant experience bullets with specific context and metrics. Example: "Implemented ${kw.keyword} to achieve [specific result with numbers]"`,
      frequency: kw.frequency,
      impact: kw.impact,
      synonyms: kw.synonyms || []
    })),
    formatIssues,
    metricSuggestions,
    analysis
  };
}