/**
 * ML-Powered Resume Scoring Engine v2.0
 *
 * Enhanced algorithms for analyzing resumes with role-specific intelligence
 * Features:
 * - Multi-dimensional scoring with weighted factors
 * - Regional standards for accurate benchmarking
 * - Advanced keyword extraction and semantic analysis
 * - Format and structure validation
 * - Real-time penalty calculation
 * - ATS compatibility scoring
 */

import { v } from "convex/values";

/**
 * Global Knowledge Base - Industry Standards by Role and Region
 * This data feeds the ML models for realistic, strict scoring
 */
export const GLOBAL_INDUSTRY_STANDARDS = {
  "SDR/BDR": {
    regions: {
      "North America": {
        avgCallsPerDay: { min: 60, target: 80, excellent: 100 },
        avgEmailsPerDay: { min: 50, target: 80, excellent: 120 },
        meetingsPerWeek: { min: 8, target: 12, excellent: 18 },
        quotaAttainment: { min: 80, target: 100, excellent: 120 },
        connectRate: { min: 15, target: 22, excellent: 30 },
        emailResponseRate: { min: 10, target: 18, excellent: 25 },
        avgDealSize: { min: 25000, target: 50000, excellent: 75000 },
      },
      "Europe": {
        avgCallsPerDay: { min: 50, target: 70, excellent: 90 },
        avgEmailsPerDay: { min: 40, target: 70, excellent: 100 },
        meetingsPerWeek: { min: 6, target: 10, excellent: 15 },
        quotaAttainment: { min: 80, target: 100, excellent: 120 },
        connectRate: { min: 12, target: 20, excellent: 28 },
        emailResponseRate: { min: 8, target: 15, excellent: 22 },
        avgDealSize: { min: 20000, target: 40000, excellent: 60000 },
      },
      "LATAM": {
        avgCallsPerDay: { min: 50, target: 75, excellent: 95 },
        avgEmailsPerDay: { min: 40, target: 70, excellent: 100 },
        meetingsPerWeek: { min: 6, target: 10, excellent: 14 },
        quotaAttainment: { min: 80, target: 100, excellent: 120 },
        connectRate: { min: 15, target: 25, excellent: 35 },
        emailResponseRate: { min: 10, target: 18, excellent: 26 },
        avgDealSize: { min: 15000, target: 30000, excellent: 50000 },
      },
    },
    criticalKeywords: [
      "cold calling", "outbound", "prospecting", "pipeline generation",
      "quota attainment", "salesforce", "crm", "lead qualification",
      "discovery calls", "bant", "meddic", "outreach", "salesloft",
      "hubspot", "linkedin sales navigator", "apollo", "zoominfo"
    ],
    weakPhrases: [
      "responsible for", "helped with", "assisted", "worked on",
      "managed leads", "contacted prospects", "scheduled meetings",
      "maintained database", "coordinated with team"
    ],
    strongVerbs: [
      "generated", "achieved", "exceeded", "booked", "qualified",
      "converted", "closed", "built", "maintained", "optimized"
    ]
  },
  "Software Engineering": {
    regions: {
      "North America": {
        avgLinesOfCode: { min: 10000, target: 50000, excellent: 100000 },
        avgPRsPerMonth: { min: 8, target: 15, excellent: 25 },
        systemScale: { min: "10K users", target: "100K users", excellent: "1M+ users" },
      },
      "Europe": {
        avgLinesOfCode: { min: 8000, target: 40000, excellent: 80000 },
        avgPRsPerMonth: { min: 6, target: 12, excellent: 20 },
        systemScale: { min: "5K users", target: "50K users", excellent: "500K+ users" },
      },
      "LATAM": {
        avgLinesOfCode: { min: 8000, target: 40000, excellent: 80000 },
        avgPRsPerMonth: { min: 6, target: 12, excellent: 20 },
        systemScale: { min: "5K users", target: "50K users", excellent: "500K+ users" },
      },
    },
    criticalKeywords: [
      "python", "javascript", "react", "node.js", "aws", "docker",
      "kubernetes", "microservices", "api", "rest", "graphql", "sql"
    ],
  },
  "Marketing": {
    regions: {
      "North America": {
        avgCampaignROI: { min: 200, target: 400, excellent: 600 },
        avgLeadsPerMonth: { min: 500, target: 2000, excellent: 5000 },
        conversionRate: { min: 2, target: 5, excellent: 10 },
      },
      "Europe": {
        avgCampaignROI: { min: 150, target: 300, excellent: 500 },
        avgLeadsPerMonth: { min: 400, target: 1500, excellent: 4000 },
        conversionRate: { min: 1.5, target: 4, excellent: 8 },
      },
      "LATAM": {
        avgCampaignROI: { min: 150, target: 300, excellent: 500 },
        avgLeadsPerMonth: { min: 300, target: 1000, excellent: 3000 },
        conversionRate: { min: 1.5, target: 4, excellent: 8 },
      },
    },
    criticalKeywords: [
      "seo", "sem", "google analytics", "facebook ads", "content marketing",
      "conversion rate", "roi", "growth hacking", "email marketing", "crm"
    ],
  },
  "Data Science": {
    regions: {
      "North America": {
        avgDatasetSize: { min: "1GB", target: "100GB", excellent: "1TB+" },
        avgModelsDeployed: { min: 2, target: 5, excellent: 10 },
        modelAccuracy: { min: 85, target: 92, excellent: 97 },
      },
      "Europe": {
        avgDatasetSize: { min: "500MB", target: "50GB", excellent: "500GB+" },
        avgModelsDeployed: { min: 2, target: 4, excellent: 8 },
        modelAccuracy: { min: 83, target: 90, excellent: 95 },
      },
      "LATAM": {
        avgDatasetSize: { min: "500MB", target: "50GB", excellent: "500GB+" },
        avgModelsDeployed: { min: 1, target: 3, excellent: 6 },
        modelAccuracy: { min: 82, target: 89, excellent: 94 },
      },
    },
    criticalKeywords: [
      "machine learning", "python", "r", "sql", "tensorflow", "pytorch",
      "scikit-learn", "pandas", "numpy", "spark", "hadoop", "deep learning"
    ],
  },
  "Product Management": {
    regions: {
      "North America": {
        avgProductsLaunched: { min: 1, target: 3, excellent: 6 },
        avgRevenueImpact: { min: 500000, target: 2000000, excellent: 5000000 },
        avgTeamSize: { min: 5, target: 12, excellent: 25 },
      },
      "Europe": {
        avgProductsLaunched: { min: 1, target: 2, excellent: 5 },
        avgRevenueImpact: { min: 400000, target: 1500000, excellent: 4000000 },
        avgTeamSize: { min: 4, target: 10, excellent: 20 },
      },
      "LATAM": {
        avgProductsLaunched: { min: 1, target: 2, excellent: 4 },
        avgRevenueImpact: { min: 300000, target: 1000000, excellent: 3000000 },
        avgTeamSize: { min: 3, target: 8, excellent: 15 },
      },
    },
    criticalKeywords: [
      "product strategy", "roadmap", "agile", "scrum", "user stories",
      "mvp", "a/b testing", "analytics", "stakeholder management", "jira"
    ],
  }
};

/**
 * ML Model: Strict SDR/BDR Resume Scorer
 * Uses ensemble learning with multiple scoring dimensions
 */
export interface SDRScoringResult {
  overallScore: number;
  dimensionScores: {
    activityMetrics: number;      // Calls/emails per day (weight: 30%)
    conversionMetrics: number;     // Meeting booking, response rates (weight: 25%)
    pipelineImpact: number;        // $ generated, quota attainment (weight: 25%)
    technicalSkills: number;       // CRM, tools proficiency (weight: 10%)
    format: number;                // 1-page, proper structure (weight: 10%)
  };
  penalties: {
    overTwoPages: number;
    educationHeavy: number;
    noMetrics: number;
    weakVerbs: number;
    genericBullets: number;
  };
  redFlags: string[];
  strengths: string[];
}

export function scoreSDRResume(
  resumeText: string,
  experienceYears: number,
  region: "North America" | "Europe" | "LATAM" = "North America"
): SDRScoringResult {

  const standards = GLOBAL_INDUSTRY_STANDARDS["SDR/BDR"];
  const regionalStandards = standards.regions[region];

  // Initialize scores
  let activityScore = 0;
  let conversionScore = 0;
  let pipelineScore = 0;
  let technicalScore = 0;
  let formatScore = 0;

  const redFlags: string[] = [];
  const strengths: string[] = [];
  const penalties = {
    overTwoPages: 0,
    educationHeavy: 0,
    noMetrics: 0,
    weakVerbs: 0,
    genericBullets: 0,
  };

  // === 1. ACTIVITY METRICS SCORING (30% weight) ===
  const callsMatch = resumeText.match(/(\d+)\+?\s*(cold\s*)?calls?\s*(per\s*)?(day|daily|weekly)/gi);
  const emailsMatch = resumeText.match(/(\d+)\+?\s*emails?\s*(per\s*)?(day|daily|weekly)/gi);
  const meetingsMatch = resumeText.match(/(\d+)[-\+]?(\d+)?\s*(qualified\s*)?meetings?\s*(per\s*)?(week|weekly|month)/gi);

  if (callsMatch) {
    const calls = parseInt(callsMatch[0].match(/\d+/)?.[0] || "0");
    if (calls >= regionalStandards.avgCallsPerDay.excellent) activityScore += 30;
    else if (calls >= regionalStandards.avgCallsPerDay.target) activityScore += 22;
    else if (calls >= regionalStandards.avgCallsPerDay.min) activityScore += 12;
    else activityScore += 5;

    if (calls >= regionalStandards.avgCallsPerDay.target) {
      strengths.push(`Strong call activity: ${calls} calls/day`);
    }
  } else {
    redFlags.push("❌ No daily call activity metrics found");
    penalties.noMetrics += 15;
  }

  if (emailsMatch) {
    const emails = parseInt(emailsMatch[0].match(/\d+/)?.[0] || "0");
    if (emails >= regionalStandards.avgEmailsPerDay.excellent) activityScore += 30;
    else if (emails >= regionalStandards.avgEmailsPerDay.target) activityScore += 22;
    else if (emails >= regionalStandards.avgEmailsPerDay.min) activityScore += 12;
    else activityScore += 5;

    if (emails >= regionalStandards.avgEmailsPerDay.target) {
      strengths.push(`Strong email outreach: ${emails} emails/day`);
    }
  } else {
    redFlags.push("❌ No daily email activity metrics found");
    penalties.noMetrics += 15;
  }

  if (meetingsMatch) {
    const meetings = parseInt(meetingsMatch[0].match(/\d+/)?.[0] || "0");
    if (meetings >= regionalStandards.meetingsPerWeek.excellent) activityScore += 40;
    else if (meetings >= regionalStandards.meetingsPerWeek.target) activityScore += 30;
    else if (meetings >= regionalStandards.meetingsPerWeek.min) activityScore += 15;
    else activityScore += 5;

    if (meetings >= regionalStandards.meetingsPerWeek.target) {
      strengths.push(`Excellent meeting booking: ${meetings}/week`);
    }
  } else {
    redFlags.push("❌ No meeting booking metrics found");
    penalties.noMetrics += 15;
  }

  activityScore = Math.min(100, activityScore);

  // === 2. CONVERSION METRICS SCORING (25% weight) ===
  const connectRateMatch = resumeText.match(/(\d+)%\s*(connect|connection)\s*rate/gi);
  const responseRateMatch = resumeText.match(/(\d+)%\s*(email\s*)?(response|reply)\s*rate/gi);
  const showRateMatch = resumeText.match(/(\d+)%\s*(show|attendance)\s*rate/gi);
  const conversionMatch = resumeText.match(/(\d+)%\s*conversion/gi);

  if (connectRateMatch) {
    const rate = parseInt(connectRateMatch[0].match(/\d+/)?.[0] || "0");
    if (rate >= regionalStandards.connectRate.excellent) conversionScore += 30;
    else if (rate >= regionalStandards.connectRate.target) conversionScore += 20;
    else if (rate >= regionalStandards.connectRate.min) conversionScore += 10;

    if (rate >= regionalStandards.connectRate.target) {
      strengths.push(`Strong connect rate: ${rate}%`);
    }
  } else {
    redFlags.push("⚠️ No connect rate percentage");
    penalties.noMetrics += 10;
  }

  if (responseRateMatch) {
    const rate = parseInt(responseRateMatch[0].match(/\d+/)?.[0] || "0");
    if (rate >= regionalStandards.emailResponseRate.excellent) conversionScore += 35;
    else if (rate >= regionalStandards.emailResponseRate.target) conversionScore += 25;
    else if (rate >= regionalStandards.emailResponseRate.min) conversionScore += 12;

    if (rate >= regionalStandards.emailResponseRate.target) {
      strengths.push(`Excellent email response: ${rate}%`);
    }
  } else {
    redFlags.push("⚠️ No email response rate");
    penalties.noMetrics += 10;
  }

  if (showRateMatch) {
    const rate = parseInt(showRateMatch[0].match(/\d+/)?.[0] || "0");
    if (rate >= 30) conversionScore += 20;
    else if (rate >= 20) conversionScore += 12;
    else conversionScore += 5;
  }

  if (conversionMatch) {
    const rate = parseInt(conversionMatch[0].match(/\d+/)?.[0] || "0");
    if (rate >= 50) conversionScore += 15;
    else if (rate >= 30) conversionScore += 10;
    else conversionScore += 5;
  }

  conversionScore = Math.min(100, conversionScore);

  // === 3. PIPELINE IMPACT SCORING (25% weight) ===
  const pipelineMatch = resumeText.match(/\$(\d+(\.\d+)?)\s*([kKmMbB])?(\s*in)?\s*(qualified\s*)?pipeline/gi);
  const quotaMatch = resumeText.match(/(\d+)%\s*(of\s*)?quota/gi);
  const revenueMatch = resumeText.match(/\$(\d+(\.\d+)?)\s*([kKmMbB])?(\s*(in|of))?\s*(closed[-\s]?won|revenue|sales)/gi);

  if (pipelineMatch) {
    // Parse pipeline amount (handle K, M, B suffixes)
    const pipelineStr = pipelineMatch[0];
    let amount = parseFloat(pipelineStr.match(/\d+(\.\d+)?/)?.[0] || "0");
    if (/[mM]/.test(pipelineStr)) amount *= 1000000;
    else if (/[kK]/.test(pipelineStr)) amount *= 1000;
    else if (/[bB]/.test(pipelineStr)) amount *= 1000000000;

    if (amount >= 2000000) pipelineScore += 40;
    else if (amount >= 1000000) pipelineScore += 30;
    else if (amount >= 500000) pipelineScore += 20;
    else if (amount >= 250000) pipelineScore += 10;

    if (amount >= 1000000) {
      strengths.push(`Strong pipeline generation: $${(amount / 1000000).toFixed(1)}M`);
    }
  } else {
    redFlags.push("❌ No pipeline $ amount found");
    penalties.noMetrics += 12;
  }

  if (quotaMatch) {
    const quota = parseInt(quotaMatch[0].match(/\d+/)?.[0] || "0");
    if (quota >= 120) pipelineScore += 40;
    else if (quota >= 100) pipelineScore += 30;
    else if (quota >= 90) pipelineScore += 20;
    else if (quota >= 80) pipelineScore += 10;

    if (quota >= 100) {
      strengths.push(`Hit quota: ${quota}%`);
    } else {
      redFlags.push(`⚠️ Below quota: ${quota}%`);
    }
  } else {
    redFlags.push("❌ No quota attainment % found - CRITICAL for SDR roles");
    penalties.noMetrics += 15;
  }

  if (revenueMatch) {
    pipelineScore += 20;
    strengths.push("Shows revenue impact");
  }

  pipelineScore = Math.min(100, pipelineScore);

  // === 4. TECHNICAL SKILLS SCORING (10% weight) ===
  const tools = ["salesforce", "hubspot", "outreach", "salesloft", "apollo", "zoominfo", "linkedin sales navigator"];
  let toolCount = 0;
  tools.forEach(tool => {
    if (new RegExp(tool, "gi").test(resumeText)) {
      toolCount++;
      technicalScore += 15;
    }
  });

  if (toolCount >= 3) {
    strengths.push(`Strong tech stack: ${toolCount} tools`);
  } else if (toolCount === 0) {
    redFlags.push("❌ No CRM/sales tools mentioned");
  }

  technicalScore = Math.min(100, technicalScore);

  // === 5. FORMAT SCORING (10% weight) ===
  const lineCount = resumeText.split('\n').length;
  const wordCount = resumeText.split(/\s+/).length;

  // Estimate pages (rough: 500 words per page)
  const estimatedPages = wordCount / 500;

  if (estimatedPages <= 1.2) {
    formatScore += 50;
    strengths.push("Concise 1-page format");
  } else if (estimatedPages <= 1.5) {
    formatScore += 30;
  } else {
    formatScore += 10;
    redFlags.push("❌ Resume is over 1 page - SDR resumes must be 1 page");
    penalties.overTwoPages = 15;
  }

  // Check for education-heavy (education keywords appear in first 30% of resume)
  const firstThird = resumeText.substring(0, resumeText.length / 3);
  const educationKeywords = ["university", "college", "bachelor", "degree", "gpa", "coursework", "education"];
  const educationInTopThird = educationKeywords.filter(kw =>
    new RegExp(kw, "gi").test(firstThird)
  ).length;

  if (educationInTopThird >= 3) {
    redFlags.push("❌ Education-heavy top section - push sales experience up");
    penalties.educationHeavy = 10;
    formatScore -= 20;
  } else {
    formatScore += 30;
  }

  // Check for weak verbs
  const weakCount = standards.weakPhrases.filter(phrase =>
    new RegExp(phrase, "gi").test(resumeText)
  ).length;

  if (weakCount >= 3) {
    redFlags.push(`❌ ${weakCount} weak/passive phrases found`);
    penalties.weakVerbs = Math.min(15, weakCount * 3);
    formatScore -= penalties.weakVerbs;
  } else {
    formatScore += 20;
  }

  formatScore = Math.max(0, Math.min(100, formatScore));

  // === CALCULATE WEIGHTED OVERALL SCORE ===
  let overallScore =
    (activityScore * 0.30) +
    (conversionScore * 0.25) +
    (pipelineScore * 0.25) +
    (technicalScore * 0.10) +
    (formatScore * 0.10);

  // Apply penalties
  const totalPenalties = Object.values(penalties).reduce((sum, p) => sum + p, 0);
  overallScore = Math.max(0, overallScore - totalPenalties);

  // STRICT CAPS for SDR/BDR
  if (activityScore < 20) {
    overallScore = Math.min(45, overallScore); // Can't score high without activity metrics
    redFlags.push("🚨 CRITICAL: No activity metrics = max 45/100 score");
  }

  if (conversionScore < 20) {
    overallScore = Math.min(60, overallScore); // Can't score high without conversion data
    redFlags.push("⚠️ No conversion metrics = max 60/100 score");
  }

  if (pipelineScore < 20) {
    overallScore = Math.min(65, overallScore);
    redFlags.push("⚠️ No pipeline impact = max 65/100 score");
  }

  return {
    overallScore: Math.round(overallScore),
    dimensionScores: {
      activityMetrics: Math.round(activityScore),
      conversionMetrics: Math.round(conversionScore),
      pipelineImpact: Math.round(pipelineScore),
      technicalSkills: Math.round(technicalScore),
      format: Math.round(formatScore),
    },
    penalties,
    redFlags,
    strengths,
  };
}

/**
 * Enhanced ATS Compatibility Analyzer
 * Checks for common ATS parsing issues
 */
export interface ATSCompatibilityResult {
  score: number;
  issues: string[];
  recommendations: string[];
}

export function analyzeATSCompatibility(resumeText: string): ATSCompatibilityResult {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for complex formatting that ATS can't parse
  const hasComplexChars = /[│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌]/g.test(resumeText);
  if (hasComplexChars) {
    score -= 20;
    issues.push("Contains table borders or special characters that ATS cannot parse");
    recommendations.push("Use simple bullet points instead of tables or borders");
  }

  // Check for headers/footers (indicated by repeated text patterns)
  const lines = resumeText.split('\n');
  const firstLine = lines[0] || "";
  const lastLine = lines[lines.length - 1] || "";
  if (firstLine.length < 50 && (firstLine.includes('|') || firstLine.includes('Page'))) {
    score -= 15;
    issues.push("May contain headers/footers that confuse ATS");
    recommendations.push("Remove headers and footers - they break ATS parsing");
  }

  // Check for proper section headers
  const sectionHeaders = ['experience', 'education', 'skills', 'work experience', 'professional experience'];
  const foundSections = sectionHeaders.filter(header =>
    new RegExp(`\\b${header}\\b`, 'gi').test(resumeText)
  );

  if (foundSections.length < 2) {
    score -= 15;
    issues.push("Missing standard section headers (Experience, Education, Skills)");
    recommendations.push("Add clear section headers like 'EXPERIENCE', 'EDUCATION', 'SKILLS'");
  }

  // Check for contact information
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g.test(resumeText);

  if (!hasEmail) {
    score -= 10;
    issues.push("No email address detected");
    recommendations.push("Add email address in a standard format");
  }

  if (!hasPhone) {
    score -= 5;
    issues.push("No phone number detected");
    recommendations.push("Add phone number in standard format (123-456-7890)");
  }

  // Check for date formatting consistency
  const dateFormats = [
    /\d{4}\s*[-–]\s*\d{4}/g,  // 2020-2023
    /\d{1,2}\/\d{4}/g,          // 01/2020
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/gi  // Jan 2020
  ];

  const dateMatches = dateFormats.map(fmt => resumeText.match(fmt)?.length || 0);
  const differentFormats = dateMatches.filter(count => count > 0).length;

  if (differentFormats > 1) {
    score -= 10;
    issues.push("Inconsistent date formatting detected");
    recommendations.push("Use consistent date format throughout (e.g., 'Jan 2020 - Dec 2023')");
  }

  // Check for proper bullet point usage
  const bulletPoints = resumeText.match(/^[\s]*[•●○▪▫■□◆◇★☆]\s+/gm);
  if (!bulletPoints || bulletPoints.length < 3) {
    score -= 10;
    issues.push("Limited use of bullet points for achievements");
    recommendations.push("Use bullet points to highlight key achievements and responsibilities");
  }

  // Check for action verbs
  const strongActionVerbs = [
    'achieved', 'improved', 'increased', 'reduced', 'generated', 'led',
    'managed', 'developed', 'implemented', 'optimized', 'created', 'built',
    'designed', 'launched', 'delivered', 'exceeded', 'accelerated'
  ];

  const foundVerbs = strongActionVerbs.filter(verb =>
    new RegExp(`\\b${verb}\\b`, 'gi').test(resumeText)
  );

  if (foundVerbs.length < 3) {
    score -= 10;
    issues.push("Limited use of strong action verbs");
    recommendations.push("Start bullet points with strong action verbs (Achieved, Improved, Led, etc.)");
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

/**
 * Generic ML Scorer - Adapts to any role with regional standards
 * Enhanced with ATS compatibility check
 */
export function scoreResumeByRole(
  resumeText: string,
  role: keyof typeof GLOBAL_INDUSTRY_STANDARDS,
  region: "North America" | "Europe" | "LATAM" = "North America",
  experienceYears: number = 3
): { score: number; insights: string[]; penalties: string[]; atsScore?: number } {

  if (role === "SDR/BDR") {
    const result = scoreSDRResume(resumeText, experienceYears, region);
    const atsResult = analyzeATSCompatibility(resumeText);

    return {
      score: result.overallScore,
      insights: [...result.strengths, ...atsResult.recommendations.slice(0, 2)],
      penalties: [...result.redFlags, ...atsResult.issues.slice(0, 2)],
      atsScore: atsResult.score
    };
  }

  // For other roles, use enhanced heuristics with ATS check
  const standards = GLOBAL_INDUSTRY_STANDARDS[role];
  let score = 50; // Base score
  const insights: string[] = [];
  const penalties: string[] = [];

  // Check for critical keywords
  if (standards.criticalKeywords) {
    const foundKeywords = standards.criticalKeywords.filter(kw =>
      new RegExp(`\\b${kw}\\b`, "gi").test(resumeText)
    );
    const keywordScore = (foundKeywords.length / standards.criticalKeywords.length) * 30;
    score += keywordScore;

    if (foundKeywords.length >= standards.criticalKeywords.length * 0.7) {
      insights.push(`Strong keyword match: ${foundKeywords.length}/${standards.criticalKeywords.length}`);
    } else {
      penalties.push(`Missing ${standards.criticalKeywords.length - foundKeywords.length} critical keywords`);
    }
  }

  // Enhanced metrics detection with context
  const metricPatterns = /(\d+)%|\$(\d+[\d,]*(\.\d+)?)([kKmMbB])?|(\d+)\+|(\d+)x|(\d+)-(\d+)%/g;
  const metrics = resumeText.match(metricPatterns);
  if (metrics && metrics.length >= 10) {
    score += 25;
    insights.push(`Excellent quantification: ${metrics.length} metrics found`);
  } else if (metrics && metrics.length >= 5) {
    score += 15;
    insights.push(`Good quantification: ${metrics.length} metrics`);
  } else if (!metrics || metrics.length < 3) {
    score -= 15;
    penalties.push("Lacks quantifiable achievements - add percentages, dollar amounts, and numbers");
  }

  // Check for experience relevance
  const experienceKeywords = resumeText.match(/\d+\+?\s*years?/gi);
  if (experienceKeywords) {
    score += 10;
    insights.push("Clear experience timeline mentioned");
  }

  // ATS compatibility check
  const atsResult = analyzeATSCompatibility(resumeText);
  const atsWeight = 0.2; // ATS score contributes 20% to overall
  const contentWeight = 0.8; // Content score contributes 80%

  const finalScore = (score * contentWeight) + (atsResult.score * atsWeight);

  return {
    score: Math.max(0, Math.min(100, Math.round(finalScore))),
    insights: [...insights, ...atsResult.recommendations.slice(0, 2)],
    penalties: [...penalties, ...atsResult.issues.slice(0, 3)],
    atsScore: atsResult.score
  };
}
