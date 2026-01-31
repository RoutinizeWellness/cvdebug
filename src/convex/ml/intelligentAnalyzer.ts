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
import { classifyRole, RoleCategory } from "../ai/config/keywords";
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

  // Section Analysis
  sectionStrength: Array<{ section: string; strength: number; feedback: string }>;
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

  // Step 2.5: Classify role to adjust scoring
  const roleInfo = classifyRole(resumeText);
  console.log(`[Intelligent Analyzer] Detected Role: ${roleInfo.category}, Confidence: ${Math.round(roleInfo.confidence * 100)}%`);

  // Step 3: Analyze ATS compatibility
  const atsAnalysis = analyzeATSCompatibility(resumeText);
  console.log(`[Intelligent Analyzer] ATS Score: ${atsAnalysis.score}/100`);

  // Step 4: If job description provided, analyze match
  let jdAnalysis = null;
  if (jobDescription && jobDescription.trim().length > 50) {
    jdAnalysis = analyzeJobDescriptionMatch(resumeText, jobDescription, keywordExtraction);
    console.log(`[Intelligent Analyzer] JD Match Score: ${jdAnalysis.matchScore}/100`);
  }

  // Step 4.5: Metrics detection for scoring
  const metricPatterns = [
    /\d+%|\$\d+/gi,
    /team of \d+/gi,
    /\d+\+?\s*(?:years|users|customers|projects|clients)/gi,
    /(?:increased|reduced|saved|generated|grew|boosted).*\d+/gi
  ];
  const specificMetricCount = (resumeText.match(/\d+%|\$\d+/g) || []).length;
  const isEntryLevel = /\b(student|intern|junior|entry|trainee|apprentice)\b/gi.test(resumeText);

  // Step 5: Calculate scores
  const scores = calculateScores(
    keywordExtraction,
    atsAnalysis,
    jdAnalysis,
    resumeText,
    roleInfo.category,
    specificMetricCount
  );

  console.log(`[Intelligent Analyzer] Final Scores - Overall: ${scores.overall}, Keywords: ${scores.keywords}, Format: ${scores.format}, Completeness: ${scores.completeness}`);

  // Step 6: Generate recommendations
  const recommendations = generateIntelligentRecommendations(
    keywordExtraction,
    atsAnalysis,
    jdAnalysis,
    scores,
    roleInfo.category,
    specificMetricCount,
    isEntryLevel
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
    sectionStrength: analyzeSectionStrength(resumeText),

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

  // Check for standard sections with capitalization
  const sections = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'SUMMARY', 'PROJECTS'];
  const foundSections = sections.filter(s =>
    new RegExp(`\\b${s}\\b`, 'g').test(resumeText)
  );

  if (foundSections.length < 3) {
    // Check for lowercase versions if uppercase not found
    const lowerSections = ['experience', 'education', 'skills', 'summary', 'projects'];
    const foundLower = lowerSections.filter(s =>
      new RegExp(`\\b${s}\\b`, 'gi').test(resumeText)
    );

    if (foundLower.length < 3) {
      score -= 15;
      issues.push({
        issue: "Missing standard section headers",
        severity: "high",
        fix: "Add clear, bold sections: EXPERIENCE, EDUCATION, SKILLS",
        location: "Document structure",
        impact: "ATS may not categorize content correctly"
      });
    } else if (foundSections.length < foundLower.length) {
      score -= 5;
      issues.push({
        issue: "Section headers are not capitalized",
        severity: "medium",
        fix: "Capitalize section headers (e.g., EXPERIENCE instead of Experience) for better ATS parsing",
        location: "Section titles",
        impact: "Some ATS systems better recognize ALL CAPS headers"
      });
    }
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

  // Check for dates (MM/YYYY or Month YYYY)
  const standardDates = resumeText.match(/\b(0[1-9]|1[0-2])\/\d{4}\b/g) || [];
  const monthNames = resumeText.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/gi) || [];
  const yearRanges = resumeText.match(/\b\d{4}\s*[-–—]\s*(?:\d{4}|present|current)\b/gi) || [];

  const totalDateSignals = standardDates.length + monthNames.length + yearRanges.length;

  if (totalDateSignals < 2) {
    score -= 10;
    issues.push({
      issue: "Insufficient date information found",
      severity: "high",
      fix: "Provide clear dates for each role and degree using MM/YYYY or Month YYYY format",
      location: "Experience/Education sections",
      impact: "ATS cannot calculate your years of experience accurately"
    });
  } else if (standardDates.length + monthNames.length === 0 && yearRanges.length > 0) {
    score -= 5;
    issues.push({
      issue: "Dates only show years (e.g., 2020-2022)",
      severity: "medium",
      fix: "Include months (e.g., Jan 2020 - Dec 2022) to help ATS calculate precise experience duration",
      location: "Date ranges",
      impact: "ATS may underestimate experience by rounding down years"
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
  resumeText: string,
  role: RoleCategory,
  specificMetricCount: number
): { overall: number; keywords: number; format: number; completeness: number } {

  // STRICT: Keyword scoring based on real ATS requirements
  // No free points - must earn everything
  let keywordScore = 0;

  // 1. Keyword density MUST be in optimal range (3-8% like real ATS)
  // 1. Keyword density MUST be in optimal range (3-8% like real ATS)
  if (keywordExtraction.keyword_density >= 3 && keywordExtraction.keyword_density <= 8) {
    keywordScore += 25; // Optimal range (increased from 20)
  } else if (keywordExtraction.keyword_density >= 2 && keywordExtraction.keyword_density < 3) {
    keywordScore += 12; // Too sparse
  } else if (keywordExtraction.keyword_density > 8 && keywordExtraction.keyword_density <= 12) {
    keywordScore += 5; // Too dense (keyword stuffing)
  } else if (keywordExtraction.keyword_density > 12) {
    keywordScore -= 20; // Critical: Keyword stuffing detected
  } else {
    keywordScore += 0; // Outside acceptable range
  }

  // 2. Unique keyword count (must have variety)
  // Granular scoring: Each unique keyword up to 20 gives points
  const varietyScore = Math.min(25, keywordExtraction.unique_keyword_count * 1.5);
  keywordScore += varietyScore;

  // 3. Job description match (critical for real ATS)
  if (jdAnalysis && jdAnalysis.keywordOverlap > 0) {
    const matchBonus = Math.min(30, jdAnalysis.keywordOverlap * 0.4);
    keywordScore += matchBonus;
  } else {
    // No JD provided or no match = minimal baseline
    keywordScore += 5;
  }

  // INCREASED WEIGHT: Metrics are the #1 thing recruiters look for
  const metricPatterns = [
    /\d+%|\$\d+/gi,
    /team of \d+/gi,
    /\d+\+?\s*(?:years|users|customers|projects|clients)/gi,
    /(?:increased|reduced|saved|generated|grew|boosted).*\d+/gi
  ];

  const hasMetrics = metricPatterns.some(pattern => pattern.test(resumeText));

  // Granular metrics scoring: 6 points per specific metric, max 30
  // (Was 4 points, max 20)
  const metricsScore = Math.min(30, specificMetricCount * 6);
  keywordScore += metricsScore;

  if (metricsScore === 0 && !hasMetrics) {
    // No quantifiable results = major red flag for real ATS
    keywordScore -= 15; // Increased penalty from -10
  }

  keywordScore = Math.max(0, Math.min(100, keywordScore));

  // Format score is ATS compatibility (already strict)
  const formatScore = atsAnalysis.score;

  // Completeness score based on sections and REAL content quality
  const completenessScore = calculateCompletenessScore(resumeText, role);

  // STRICT: Overall score - Real ATS are harsh
  // Keywords = 50% (most important), Completeness = 30%, Format = 20%
  const overall = Math.round(
    (keywordScore * 0.50) + // 50% keywords - Real ATS prioritize relevant skills
    (completenessScore * 0.30) + // 30% completeness - Must have substance
    (formatScore * 0.20) // 20% format - Less critical than content
  );

  // REALISTIC: No artificial floor - if CV is bad, score should be bad
  return {
    overall: Math.min(100, overall), // NO minimum floor
    keywords: Math.min(100, keywordScore), // NO minimum floor
    format: Math.max(10, Math.min(100, formatScore)), // Min 10 (completely broken format)
    completeness: Math.min(100, completenessScore) // NO minimum floor
  };
}

/**
 * Calculate completeness score - STRICT: Real ATS requirements
 * A generic Harvard template should NOT score high without real content
 */
function calculateCompletenessScore(resumeText: string, role: RoleCategory): number {
  let score = 0; // NO free points - must earn everything

  // CRITICAL SECTIONS (Must have these or fail)
  let criticalSections = 0;

  // Experience section - MUST have with actual job titles and dates
  // ADAPTIVE: If student/entry roles, accept projects/volunteer
  const isEntryLevel = /\b(student|intern|junior|entry|trainee|apprentice)\b/gi.test(resumeText);
  const hasExperienceSection = /\b(experience|work history|employment|professional experience|internships?|projects?)\b/gi.test(resumeText);
  const hasJobTitles = /\b(developer|engineer|manager|analyst|consultant|specialist|coordinator|designer|architect|lead|senior|junior|intern|volunteer)\b/gi.test(resumeText);
  const hasDates = /\d{4}\s*[-–—]\s*(?:\d{4}|present|current)/gi.test(resumeText);

  if (hasExperienceSection && (hasJobTitles || isEntryLevel) && hasDates) {
    score += 30; // Increased from 25
    criticalSections++;
  } else if (hasExperienceSection) {
    score += 10; // Increased from 5
  }

  // Education section - MUST have with degree and institution
  const hasEducationSection = /\b(education|academic|qualifications?)\b/gi.test(resumeText);
  const hasDegree = /\b(bachelor|master|phd|doctorate|b\.s\.|m\.s\.|mba|associate)\b/gi.test(resumeText);
  const hasInstitution = /\b(university|college|institute|school)\b/gi.test(resumeText);

  if (hasEducationSection && (hasDegree || hasInstitution)) {
    score += 20; // Education with real content
    criticalSections++;
  } else if (hasEducationSection) {
    score += 5; // Has section but no real content
  }

  // Skills section - MUST have with actual skills listed (not just section name)
  const hasSkillsSection = /\b(skills?|competencies|technologies|technical expertise)\b/gi.test(resumeText);
  const hasActualSkills = /\b(python|java|javascript|c\+\+|c#|react|sql|aws|azure|docker|kubernetes|agile|scrum)\b/gi.test(resumeText);

  if (hasSkillsSection && hasActualSkills) {
    score += 20; // Skills with real technologies
    criticalSections++;
  } else if (hasSkillsSection) {
    score += 5; // Has section but generic/no real skills
  }

  // PENALTY: If missing critical sections, major score reduction
  if (criticalSections < 2) {
    score -= 20; // Missing too many critical sections
  }

  // STRICT: Check for SUBSTANCE (not just section headers)
  // Must have bullet points with actual achievements
  const bulletPoints = resumeText.match(/^[\s]*[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*]\s+.+$/gm) || [];
  if (bulletPoints.length >= 5) {
    score += 15; // Has detailed bullet points
  } else if (bulletPoints.length >= 3) {
    score += 8; // Has some bullet points
  } else {
    score -= 10; // No bullet points = no detail
  }

  // STRICT: Must have quantifiable achievements (numbers, metrics)
  const hasMetrics = /\d+%|\$\d+[kmb]?|team of \d+|\d+\+?\s*(?:years|users|customers|projects)/gi.test(resumeText);
  const metricCount = (resumeText.match(/\d+%|\$\d+/g) || []).length;

  if (metricCount >= 4) {
    score += 20; // Increased from 15
  } else if (metricCount >= 2) {
    score += 12; // Increased from 8
  } else if (hasMetrics) {
    score += 6;
  } else {
    score -= 15; // Increased penalty from -10
  }

  // STRICT: Check for action verbs (shows real work)
  const actionVerbs = /\b(led|managed|developed|implemented|designed|built|created|launched|improved|optimized|achieved|delivered|coordinated|established)\b/gi;
  const verbCount = (resumeText.match(actionVerbs) || []).length;

  if (verbCount >= 8) {
    score += 10; // Strong action verbs
  } else if (verbCount >= 4) {
    score += 5; // Some action verbs
  } else {
    score -= 5; // Weak/passive language
  }

  // Optional sections (minor bonus only)
  if (/\bprojects?\b/gi.test(resumeText)) score += 3;
  if (/\bcertifications?\b/gi.test(resumeText)) score += 3;
  if (/\b(awards?|achievements?|honors?)\b/gi.test(resumeText)) score += 2;
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
  scores: any,
  role: RoleCategory,
  metricCount: number,
  isEntryLevel: boolean
): Array<{
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  message: string;
  actionable: string;
  impact: number;
}> {

  const recommendations: Array<{
    category: string;
    priority: "critical" | "high" | "medium" | "low";
    message: string;
    actionable: string;
    impact: number;
  }> = [];

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

  // Metrics recommendation (ADAPTED TO ROLE)
  if (metricCount < 4) {
    let metricSuggestion = "Add quantifiable results using numbers and percentages (e.g., 'Increased efficiency by 15%')";

    if (role === "Software Engineering") {
      metricSuggestion = "Add technical metrics (e.g., 'Reduced API latency by 30%', 'Managed 10k+ concurrent users', 'Saved 10 hours/week via automation')";
    } else if (role === "Cloud & DevOps") {
      metricSuggestion = "Focus on reliability and scale (e.g., 'Achieved 99.99% uptime', 'Reduced deployment time by 50% using CI/CD', 'Cut cloud costs by 20% through optimization')";
    } else if (role === "Cybersecurity") {
      metricSuggestion = "Highlight threat reduction (e.g., 'Detected and mitigated 500+ security threats', 'Achieved 100% compliance in SOC2 audit', 'Reduced vulnerability window by 40%')";
    } else if (role === "Project/Program Management") {
      metricSuggestion = "Show delivery excellence (e.g., 'Delivered $1M project 2 weeks ahead of schedule', 'Improved team velocity by 25%', 'Managed cross-functional team of 20+')";
    } else if (role === "Design & Creative") {
      metricSuggestion = "Show user impact (e.g., 'Increased conversion rate by 15% through UI redesign', 'Improved user satisfaction score by 20%', 'Reduced user drop-off by 30%')";
    } else if (role === "Marketing") {
      metricSuggestion = "Include marketing KPIs (e.g., 'Improved CTR by 15%', 'Grew social reach by 50k', 'Reduced CAC by 20%')";
    } else if (role === "Sales") {
      metricSuggestion = "List sales achievements (e.g., 'Exceeded quota by 125%', 'Generated $100k+ in new pipeline', '20% increase in conversion rate')";
    } else if (role === "Healthcare/Medical") {
      metricSuggestion = "Focus on patient outcomes and efficiency (e.g., 'Improved patient throughput by 15%', 'Reduced clinical errors by 20%', 'Managed caseload of 50+ patients daily')";
    } else if (role === "Finance/Fintech") {
      metricSuggestion = "Highlight financial precision (e.g., 'Managed $2M+ portfolio', 'Reduced audit time by 30%', 'Identified $50k in cost savings through financial modeling')";
    } else if (role === "Education") {
      metricSuggestion = "Add classroom metrics (e.g., 'Improved student test scores by 15%', 'Managed cohort of 30+ students', 'Reduced administrative time by 20%')";
    } else if (isEntryLevel) {
      metricSuggestion = "Even without experience, use numbers: 'Completed 5 projects', 'Achieved 95% grade in Capstone', 'Led team of 4 in university project'";
    }

    recommendations.push({
      category: "Impact",
      priority: metricCount < 2 ? "high" : "medium" as const,
      message: "Lacks quantifiable achievements",
      actionable: metricSuggestion,
      impact: metricCount < 2 ? 18 : 12
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
  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => {
    const aPriority = priorityOrder[a.priority as string] ?? 99;
    const bPriority = priorityOrder[b.priority as string] ?? 99;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
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
 * Analyze section strength based on density and presence
 */
function analyzeSectionStrength(resumeText: string): Array<{ section: string; strength: number; feedback: string }> {
  const sections = [
    { name: 'EXPERIENCE', patterns: [/\b(EXPERIENCE|WORK HISTORY|EMPLOYMENT|PROFESSIONAL EXPERIENCE)\b/g], weight: 40 },
    { name: 'EDUCATION', patterns: [/\b(EDUCATION|ACADEMIC|QUALIFICATIONS)\b/g], weight: 20 },
    { name: 'SKILLS', patterns: [/\b(SKILLS|COMPETENCIES|TECHNOLOGIES)\b/g], weight: 25 },
    { name: 'SUMMARY', patterns: [/\b(SUMMARY|PROFILE|OBJECTIVE|PROFESSIONAL SUMMARY)\b/g], weight: 15 }
  ];

  return sections.map(s => {
    // Check for exact caps match first (ATS preferred)
    let hasSection = s.patterns.some(p => p.test(resumeText));
    let feedback = "";
    let strength = 0;

    if (!hasSection) {
      // Try case-insensitive
      const pLower = new RegExp(s.patterns[0].source, 'gi');
      if (pLower.test(resumeText)) {
        strength = 30;
        feedback = "NON_CAPITALIZED_HEADER";
      } else {
        strength = 0;
        feedback = "SECTION_NOT_FOUND";
      }
    } else {
      // Analyze content density
      const parts = resumeText.split(s.patterns[0]);
      const content = parts.length > 1 ? parts[1].split(/[A-Z]{5,}/)[0] : "";
      const wordCount = content.trim().split(/\s+/).length;

      if (wordCount > 80) {
        strength = 100;
        feedback = "OPTIMAL_DENSITY";
      } else if (wordCount > 30) {
        strength = 70;
        feedback = "SUFFICIENT_DETAIL";
      } else {
        strength = 40;
        feedback = "LOW_DETAIL";
      }
    }

    return { section: s.name, strength, feedback };
  });
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
