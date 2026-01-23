/**
 * Intelligent Resume Analyzer v1.0
 *
 * Combines multiple ML/NLP techniques for comprehensive resume analysis:
 * - Intelligent keyword extraction with industry-specific databases
 * - Advanced ATS compatibility scoring
 * - Semantic matching between resume and job description
 * - Context-aware recommendations
 * - Seniority level detection
 */

import {
  extractIntelligentKeywords,
  calculateKeywordSimilarity,
  INDUSTRY_KEYWORDS
} from "./intelligentKeywordExtractor";
import { analyzeSEOContent } from "../../lib/intelligentSEO";

export interface IntelligentAnalysisResult {
  // Scores
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  completenessScore: number;
  atsCompatibilityScore: number;

  // Keywords
  extractedKeywords: Array<{
    term: string;
    score: number;
    category: string;
    frequency: number;
    context: string[];
  }>;
  matchedKeywords: string[];
  missingCriticalKeywords: Array<{
    keyword: string;
    priority: "critical" | "high" | "medium";
    section: string;
    context: string;
    impact: number;
    synonyms: string[];
  }>;
  keywordDensity: number;

  // ATS Analysis
  atsIssues: Array<{
    issue: string;
    severity: "critical" | "high" | "medium" | "low";
    fix: string;
    location: string;
    atsImpact: string;
  }>;

  // Recommendations
  recommendations: Array<{
    category: string;
    priority: "critical" | "high" | "medium" | "low";
    message: string;
    actionable: string;
    impact: number;
  }>;

  // Industry Analysis
  detectedIndustry?: keyof typeof INDUSTRY_KEYWORDS;
  industryMatchScore: number;

  // Job Description Match (if provided)
  jdMatchScore?: number;
  jdKeywordOverlap?: number;
  jdMissingKeywords?: string[];
}

/**
 * Main intelligent analysis function
 */
export function analyzeResumeIntelligently(
  resumeText: string,
  jobDescription?: string,
  targetIndustry?: keyof typeof INDUSTRY_KEYWORDS
): IntelligentAnalysisResult {

  console.log("[Intelligent Analyzer] Starting comprehensive analysis");
  console.log(`[Intelligent Analyzer] Resume length: ${resumeText.length} chars`);
  console.log(`[Intelligent Analyzer] Has JD: ${!!jobDescription}, Target Industry: ${targetIndustry || "auto-detect"}`);

  // Step 1: Detect industry if not provided
  const detectedIndustry = targetIndustry || detectIndustry(resumeText);
  console.log(`[Intelligent Analyzer] Detected/Target Industry: ${detectedIndustry}`);

  // Step 2: Extract keywords intelligently
  const keywordExtraction = extractIntelligentKeywords(
    resumeText,
    jobDescription,
    detectedIndustry
  );

  console.log(`[Intelligent Analyzer] Extracted ${keywordExtraction.keywords.length} keywords`);
  console.log(`[Intelligent Analyzer] Keyword density: ${keywordExtraction.keyword_density}%`);
  console.log(`[Intelligent Analyzer] Missing critical: ${keywordExtraction.missing_critical.length}`);

  // Step 3: Analyze ATS compatibility
  const atsAnalysis = analyzeATSCompatibility(resumeText);
  console.log(`[Intelligent Analyzer] ATS Score: ${atsAnalysis.score}/100`);

  // Step 4: If job description provided, analyze match
  let jdAnalysis = null;
  if (jobDescription && jobDescription.trim().length > 50) {
    jdAnalysis = analyzeJobDescriptionMatch(resumeText, jobDescription, keywordExtraction);
    console.log(`[Intelligent Analyzer] JD Match Score: ${jdAnalysis.matchScore}/100`);
  }

  // Step 5: Calculate scores
  const scores = calculateScores(
    keywordExtraction,
    atsAnalysis,
    jdAnalysis,
    resumeText
  );

  console.log(`[Intelligent Analyzer] Final Scores - Overall: ${scores.overall}, Keywords: ${scores.keywords}, Format: ${scores.format}, Completeness: ${scores.completeness}`);

  // Step 6: Generate recommendations
  const recommendations = generateIntelligentRecommendations(
    keywordExtraction,
    atsAnalysis,
    jdAnalysis,
    scores
  );

  console.log(`[Intelligent Analyzer] Generated ${recommendations.length} recommendations`);

  // Step 7: Format missing keywords with priority
  const missingCriticalKeywords = formatMissingKeywords(
    keywordExtraction.missing_critical,
    keywordExtraction.suggestions,
    jdAnalysis?.missingKeywords || []
  );

  // Step 8: Calculate industry match score
  const industryMatchScore = calculateIndustryMatch(keywordExtraction, detectedIndustry);

  return {
    overallScore: scores.overall,
    keywordScore: scores.keywords,
    formatScore: scores.format,
    completenessScore: scores.completeness,
    atsCompatibilityScore: atsAnalysis.score,

    extractedKeywords: keywordExtraction.keywords,
    matchedKeywords: keywordExtraction.keywords.slice(0, 30).map(k => k.term),
    missingCriticalKeywords,
    keywordDensity: keywordExtraction.keyword_density,

    atsIssues: atsAnalysis.issues.map((issue, idx) => ({
      issue: issue.issue,
      severity: issue.severity,
      fix: issue.fix,
      location: issue.location || "Overall",
      atsImpact: issue.impact
    })),

    recommendations,

    detectedIndustry,
    industryMatchScore,

    jdMatchScore: jdAnalysis?.matchScore,
    jdKeywordOverlap: jdAnalysis?.keywordOverlap,
    jdMissingKeywords: jdAnalysis?.missingKeywords
  };
}

/**
 * Detect industry from resume content
 */
function detectIndustry(resumeText: string): keyof typeof INDUSTRY_KEYWORDS | undefined {
  const textLower = resumeText.toLowerCase();
  const industryScores: Record<string, number> = {};

  for (const [industry, categories] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0;

    for (const keywords of Object.values(categories)) {
      for (const keyword of keywords as string[]) {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          score += matches.length;
        }
      }
    }

    industryScores[industry] = score;
  }

  // Get industry with highest score
  const topIndustry = Object.entries(industryScores)
    .sort(([, a], [, b]) => b - a)[0];

  if (topIndustry && topIndustry[1] > 3) {
    return topIndustry[0] as keyof typeof INDUSTRY_KEYWORDS;
  }

  return "technology"; // Default to technology
}

/**
 * Analyze ATS compatibility
 */
interface ATSAnalysis {
  score: number;
  issues: Array<{
    issue: string;
    severity: "critical" | "high" | "medium" | "low";
    fix: string;
    location?: string;
    impact: string;
  }>;
}

function analyzeATSCompatibility(resumeText: string): ATSAnalysis {
  let score = 100;
  const issues: ATSAnalysis['issues'] = [];

  // Check for complex characters
  const hasComplexChars = /[│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌]/g.test(resumeText);
  if (hasComplexChars) {
    score -= 20;
    issues.push({
      issue: "Contains special table characters that ATS cannot parse",
      severity: "critical",
      fix: "Remove table borders and use simple bullet points instead",
      location: "Throughout document",
      impact: "ATS may fail to extract content properly"
    });
  }

  // Check for standard sections
  const sections = ['experience', 'education', 'skills', 'summary'];
  const foundSections = sections.filter(s =>
    new RegExp(`\\b${s}\\b`, 'gi').test(resumeText)
  );

  if (foundSections.length < 2) {
    score -= 15;
    issues.push({
      issue: "Missing standard section headers",
      severity: "high",
      fix: "Add clear sections: EXPERIENCE, EDUCATION, SKILLS",
      location: "Document structure",
      impact: "ATS may not categorize content correctly"
    });
  }

  // Check for contact information
  const hasEmail = /@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);

  if (!hasEmail) {
    score -= 10;
    issues.push({
      issue: "Email address not detected",
      severity: "high",
      fix: "Add a professional email address at the top of your resume",
      location: "Contact section",
      impact: "Recruiters cannot reach you"
    });
  }

  if (!hasPhone) {
    score -= 5;
    issues.push({
      issue: "Phone number not detected",
      severity: "medium",
      fix: "Include phone number in standard format: (123) 456-7890",
      location: "Contact section",
      impact: "Limited contact options for recruiters"
    });
  }

  // Check for bullet points
  const bulletPoints = (resumeText.match(/^[\s]*[•·●○◦▪▫■□\-\*]/gm) || []).length;
  if (bulletPoints < 5) {
    score -= 10;
    issues.push({
      issue: "Few or no bullet points detected",
      severity: "medium",
      fix: "Use bullet points to list achievements and responsibilities",
      location: "Experience section",
      impact: "Harder for ATS to parse structured information"
    });
  }

  // Check for dates
  const dates = resumeText.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/gi) || [];
  const yearRanges = resumeText.match(/\b\d{4}\s*[-–]\s*\d{4}\b/g) || [];

  if (dates.length + yearRanges.length < 2) {
    score -= 8;
    issues.push({
      issue: "Limited date information found",
      severity: "medium",
      fix: "Include dates for all experiences and education (e.g., Jan 2020 - Present)",
      location: "Experience and Education",
      impact: "Cannot verify work history timeline"
    });
  }

  // Check for metrics/numbers
  const metrics = resumeText.match(/\d+[%$]|\$\d+|\d+\+|\d+x|\d+-\d+%/g) || [];
  if (metrics.length < 3) {
    score -= 12;
    issues.push({
      issue: "Lacks quantifiable achievements",
      severity: "high",
      fix: "Add specific metrics: percentages, dollar amounts, team sizes, or time saved",
      location: "Experience section",
      impact: "Cannot demonstrate measurable impact"
    });
  }

  // Check for action verbs
  const actionVerbs = [
    'achieved', 'improved', 'increased', 'delivered', 'led', 'managed',
    'developed', 'created', 'launched', 'optimized', 'reduced', 'generated'
  ];

  const actionVerbCount = actionVerbs.filter(verb =>
    new RegExp(`\\b${verb}\\b`, 'gi').test(resumeText)
  ).length;

  if (actionVerbCount < 3) {
    score -= 8;
    issues.push({
      issue: "Limited use of strong action verbs",
      severity: "medium",
      fix: "Start bullet points with action verbs: achieved, improved, led, developed",
      location: "Experience descriptions",
      impact: "Less compelling and harder to scan"
    });
  }

  return {
    score: Math.max(0, score),
    issues
  };
}

/**
 * Analyze job description match
 */
interface JDAnalysis {
  matchScore: number;
  keywordOverlap: number;
  missingKeywords: string[];
  matchedKeywords: string[];
}

function analyzeJobDescriptionMatch(
  resumeText: string,
  jobDescription: string,
  keywordExtraction: any
): JDAnalysis {

  // Extract keywords from job description
  const jdKeywords = extractJobDescriptionKeywords(jobDescription);

  // Find overlap with resume keywords
  const resumeKeywordSet = new Set(
    keywordExtraction.keywords.map((k: any) => k.term.toLowerCase())
  );

  const matched: string[] = [];
  const missing: string[] = [];

  for (const jdKeyword of jdKeywords) {
    const keywordLower = jdKeyword.toLowerCase();

    // Check exact match or semantic similarity
    let found = false;
    for (const resumeKeyword of resumeKeywordSet) {
      const similarity = calculateKeywordSimilarity(keywordLower, String(resumeKeyword));
      if (similarity > 0.8) {
        found = true;
        matched.push(jdKeyword);
        break;
      }
    }

    if (!found) {
      missing.push(jdKeyword);
    }
  }

  const keywordOverlap = jdKeywords.length > 0
    ? Math.round((matched.length / jdKeywords.length) * 100)
    : 0;

  // Calculate match score (weighted)
  const matchScore = Math.min(100, Math.round(
    (keywordOverlap * 0.6) + // 60% weight on keyword overlap
    (matched.length >= 10 ? 25 : matched.length * 2.5) + // 25% on absolute matches
    (missing.length < 5 ? 15 : Math.max(0, 15 - missing.length)) // 15% on few missing
  ));

  return {
    matchScore,
    keywordOverlap,
    missingKeywords: missing.slice(0, 15), // Top 15 missing
    matchedKeywords: matched
  };
}

/**
 * Extract keywords from job description
 */
function extractJobDescriptionKeywords(jobDescription: string): string[] {
  const keywords: string[] = [];
  const jdLower = jobDescription.toLowerCase();

  // Extract technical terms (capitalized multi-word terms)
  const technicalTerms = jobDescription.match(/\b[A-Z][a-zA-Z0-9]*(?:\s+[A-Z][a-zA-Z0-9]*)*\b/g) || [];
  keywords.push(...technicalTerms);

  // Extract acronyms
  const acronyms = jobDescription.match(/\b[A-Z]{2,}\b/g) || [];
  keywords.push(...acronyms);

  // Extract requirements (words after "required", "must have", etc.)
  const requirementPatterns = [
    /(?:required|must have|looking for|seeking)[:\s]+([^.;]+)/gi,
    /(?:experience (?:with|in))[:\s]+([^.;]+)/gi,
    /(?:proficiency (?:with|in))[:\s]+([^.;]+)/gi
  ];

  for (const pattern of requirementPatterns) {
    let match;
    while ((match = pattern.exec(jobDescription)) !== null) {
      const requirements = match[1].split(/,|and/).map(r => r.trim()).filter(r => r.length > 2);
      keywords.push(...requirements);
    }
  }

  // Deduplicate and clean
  const uniqueKeywords = Array.from(new Set(keywords))
    .map(k => k.trim())
    .filter(k => k.length > 2 && k.length < 50)
    .slice(0, 30); // Top 30 keywords

  return uniqueKeywords;
}

/**
 * Calculate all scores
 */
function calculateScores(
  keywordExtraction: any,
  atsAnalysis: ATSAnalysis,
  jdAnalysis: JDAnalysis | null,
  resumeText: string
): { overall: number; keywords: number; format: number; completeness: number } {

  // IMPROVED: Keyword score based on density and variety - MORE FLEXIBLE
  const keywordScore = Math.min(100, Math.round(
    (keywordExtraction.unique_keyword_count * 2.5) + // More unique keywords = better (increased from 2 to 2.5)
    (keywordExtraction.keyword_density > 2 && keywordExtraction.keyword_density < 12 ? 25 :
     keywordExtraction.keyword_density >= 1 ? 15 : 0) + // More flexible density range (was 3-8, now 2-12)
    (jdAnalysis ? jdAnalysis.keywordOverlap * 0.3 : 0) + // JD match bonus
    (keywordExtraction.unique_keyword_count > 10 ? 10 : 0) // Bonus for good variety
  ));

  // Format score is ATS compatibility
  const formatScore = atsAnalysis.score;

  // Completeness score based on sections and content
  const completenessScore = calculateCompletenessScore(resumeText);

  // IMPROVED: Overall score is weighted average with content focus
  const overall = Math.round(
    (keywordScore * 0.40) + // 40% keywords (increased from 35% - content matters most)
    (formatScore * 0.30) + // 30% format/ATS (decreased from 35% - format less critical)
    (completenessScore * 0.30) // 30% completeness (same)
  );

  // IMPROVED: More lenient minimum scores
  return {
    overall: Math.max(35, Math.min(100, overall)), // Raised min from 30 to 35
    keywords: Math.max(20, Math.min(100, keywordScore)), // Raised min from 10 to 20
    format: Math.max(20, Math.min(100, formatScore)), // Raised min from 10 to 20
    completeness: Math.max(20, Math.min(100, completenessScore)) // Raised min from 10 to 20
  };
}

/**
 * Calculate completeness score - IMPROVED: More flexible with format variations
 */
function calculateCompletenessScore(resumeText: string): number {
  let score = 60; // Increased base score from 50 to 60

  // IMPROVED: Check for essential sections with more variations (English + common patterns)
  // Experience section (various names)
  if (/\b(experience|work history|employment|professional experience|career|positions?)\b/gi.test(resumeText)) {
    score += 12;
  }

  // Education section (various names)
  if (/\b(education|academic|qualifications?|degrees?|university|college)\b/gi.test(resumeText)) {
    score += 12;
  }

  // Skills section (various names)
  if (/\b(skills?|competencies|technologies|technical|expertise|proficiencies)\b/gi.test(resumeText)) {
    score += 10;
  }

  // Summary/Profile (various names)
  if (/\b(summary|about|profile|objective|overview|introduction)\b/gi.test(resumeText)) {
    score += 8;
  }

  // IMPROVED: Check for content indicators (not just section names)
  // Dates indicating work history
  if (/\d{4}\s*[-–—]\s*(?:\d{4}|present|current)/gi.test(resumeText)) {
    score += 5; // Has work history with dates
  }

  // Years of experience mentioned
  if (/\d+\+?\s*years?\s+(?:of\s+)?experience/gi.test(resumeText)) {
    score += 5;
  }

  // Check for optional but valuable sections
  if (/\bprojects?\b/gi.test(resumeText)) score += 4;
  if (/\bcertifications?\b/gi.test(resumeText)) score += 4;
  if (/\b(awards?|achievements?|honors?)\b/gi.test(resumeText)) score += 3;
  if (/\b(languages?|idiomas?)\b/gi.test(resumeText)) score += 2;

  // IMPROVED: More lenient word count requirements
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 150) score -= 15; // Very short (was -20 for < 200)
  else if (wordCount < 300) score -= 5; // Short (was -10 for < 400)
  else if (wordCount >= 500) score += 5; // Good length
  else if (wordCount >= 800) score += 3; // Detailed (was +5 for > 800)

  // BONUS: Technical indicators (good for developer CVs)
  const technicalPatterns = [
    /\b(c#|\.net|java|python|javascript|react|angular|aws|azure)\b/gi,
    /\b(developed|implemented|designed|built|created|deployed)\b/gi,
    /\b(team|led|managed|mentored)\b/gi
  ];

  let technicalScore = 0;
  technicalPatterns.forEach(pattern => {
    if (pattern.test(resumeText)) technicalScore += 2;
  });
  score += Math.min(10, technicalScore);

  return Math.max(20, Math.min(100, score)); // Raised minimum from 0 to 20
}

/**
 * Generate intelligent recommendations
 */
function generateIntelligentRecommendations(
  keywordExtraction: any,
  atsAnalysis: ATSAnalysis,
  jdAnalysis: JDAnalysis | null,
  scores: any
): Array<{
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  message: string;
  actionable: string;
  impact: number;
}> {

  const recommendations = [];

  // Critical ATS issues
  for (const issue of atsAnalysis.issues) {
    if (issue.severity === "critical" || issue.severity === "high") {
      recommendations.push({
        category: "ATS Compatibility",
        priority: issue.severity,
        message: issue.issue,
        actionable: issue.fix,
        impact: issue.severity === "critical" ? 20 : 15
      });
    }
  }

  // Missing critical keywords
  if (keywordExtraction.missing_critical.length > 0) {
    recommendations.push({
      category: "Keywords",
      priority: "high" as const,
      message: `Missing ${keywordExtraction.missing_critical.length} critical industry keywords`,
      actionable: `Add these keywords naturally: ${keywordExtraction.missing_critical.slice(0, 3).join(', ')}`,
      impact: 18
    });
  }

  // Low keyword density
  if (keywordExtraction.keyword_density < 3) {
    recommendations.push({
      category: "Keywords",
      priority: "medium" as const,
      message: "Keyword density is too low",
      actionable: "Incorporate more industry-specific terms and technical skills throughout your resume",
      impact: 12
    });
  }

  // JD mismatch
  if (jdAnalysis && jdAnalysis.matchScore < 60) {
    recommendations.push({
      category: "Job Match",
      priority: "high" as const,
      message: `Only ${jdAnalysis.keywordOverlap}% keyword overlap with job description`,
      actionable: `Add these required keywords: ${jdAnalysis.missingKeywords.slice(0, 5).join(', ')}`,
      impact: 20
    });
  }

  // Keyword suggestions
  if (keywordExtraction.suggestions.length > 0) {
    recommendations.push({
      category: "Skills Enhancement",
      priority: "medium" as const,
      message: "Consider adding related skills",
      actionable: `Suggested keywords: ${keywordExtraction.suggestions.slice(0, 5).join(', ')}`,
      impact: 10
    });
  }

  // Score-based recommendations
  if (scores.format < 70) {
    recommendations.push({
      category: "Format",
      priority: "high" as const,
      message: "Resume format needs improvement for ATS compatibility",
      actionable: "Use a simple, single-column layout with clear section headers and standard fonts",
      impact: 15
    });
  }

  if (scores.completeness < 70) {
    recommendations.push({
      category: "Content",
      priority: "medium" as const,
      message: "Resume appears incomplete",
      actionable: "Ensure all sections (Experience, Education, Skills) are fully detailed with relevant information",
      impact: 12
    });
  }

  // Sort by priority and impact
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.impact - a.impact;
  });

  return recommendations.slice(0, 10); // Top 10 recommendations
}

/**
 * Format missing keywords with context
 */
function formatMissingKeywords(
  missingCritical: string[],
  suggestions: string[],
  jdMissing: string[]
): Array<{
  keyword: string;
  priority: "critical" | "high" | "medium";
  section: string;
  context: string;
  impact: number;
  synonyms: string[];
}> {

  const formatted = [];

  // Critical keywords from industry analysis
  for (const keyword of missingCritical.slice(0, 5)) {
    formatted.push({
      keyword,
      priority: "critical" as const,
      section: "Experience or Skills",
      context: `Add "${keyword}" with specific examples of how you've used or developed this skill`,
      impact: 20,
      synonyms: []
    });
  }

  // High priority from JD
  for (const keyword of jdMissing.slice(0, 8)) {
    if (!formatted.find(k => k.keyword.toLowerCase() === keyword.toLowerCase())) {
      formatted.push({
        keyword,
        priority: "high" as const,
        section: "Experience",
        context: `Required by job description: Include "${keyword}" in your experience or skills section`,
        impact: 18,
        synonyms: []
      });
    }
  }

  // Medium priority suggestions
  for (const keyword of suggestions.slice(0, 7)) {
    if (!formatted.find(k => k.keyword.toLowerCase() === keyword.toLowerCase())) {
      formatted.push({
        keyword,
        priority: "medium" as const,
        section: "Skills",
        context: `Consider adding "${keyword}" if you have relevant experience`,
        impact: 10,
        synonyms: []
      });
    }
  }

  return formatted.slice(0, 20); // Max 20 missing keywords
}

/**
 * Calculate industry match score
 */
function calculateIndustryMatch(
  keywordExtraction: any,
  industry?: keyof typeof INDUSTRY_KEYWORDS
): number {
  if (!industry) return 50; // Default if no industry detected

  const industryKeywords = INDUSTRY_KEYWORDS[industry];
  if (!industryKeywords) return 50;

  // Count how many keywords from this industry are in the resume
  const resumeKeywordSet = new Set(
    keywordExtraction.keywords.map((k: any) => k.term.toLowerCase())
  );

  let matchCount = 0;
  let totalIndustryKeywords = 0;

  for (const keywords of Object.values(industryKeywords)) {
    for (const keyword of keywords as string[]) {
      totalIndustryKeywords++;
      if (resumeKeywordSet.has(keyword.toLowerCase())) {
        matchCount++;
      }
    }
  }

  const matchPercentage = totalIndustryKeywords > 0
    ? (matchCount / totalIndustryKeywords) * 100
    : 0;

  // Scale to 0-100 (having 20% of industry keywords = 80 score)
  return Math.min(100, Math.round(matchPercentage * 4));
}
