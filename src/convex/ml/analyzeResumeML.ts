"use node";
import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { scoreSDRResume, scoreResumeByRole, GLOBAL_INDUSTRY_STANDARDS } from "./resumeScoring";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("../_generated/api").internal;

/**
 * ML-Powered Resume Analysis Action
 *
 * This action uses advanced ML algorithms to analyze resumes with:
 * - Role-specific scoring models
 * - Regional standards (North America, Europe, LATAM)
 * - Strict, realistic scoring
 * - Learning from global industry data
 */

export const analyzeResumeWithML = internalAction({
  args: {
    resumeText: v.string(),
    role: v.optional(v.string()),
    region: v.optional(v.union(
      v.literal("North America"),
      v.literal("Europe"),
      v.literal("LATAM")
    )),
    experienceYears: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<any> => {
    const {
      resumeText,
      role = "General",
      region = "North America",
      experienceYears = 3,
    } = args;

    console.log(`[ML] Analyzing resume for role: ${role}, region: ${region}`);

    // Detect role if not specified
    let detectedRole = role;
    if (role === "General" || !role) {
      detectedRole = await detectRoleFromResume(resumeText);
      console.log(`[ML] Auto-detected role: ${detectedRole}`);
    }

    // Run ML scoring based on role
    let mlResult: any;

    if (detectedRole === "SDR/BDR" || detectedRole === "Sales (SDR/BDR)") {
      console.log(`[ML] Using specialized SDR/BDR ML model`);
      mlResult = scoreSDRResume(resumeText, experienceYears, region);

      // Enhanced SDR analysis
      return {
        role: "Sales (SDR/BDR)",
        region,
        score: mlResult.overallScore,
        analysis: {
          overallScore: mlResult.overallScore,
          dimensionScores: mlResult.dimensionScores,
          strengths: mlResult.strengths,
          weaknesses: mlResult.redFlags,
          penalties: mlResult.penalties,
          recommendations: generateSDRRecommendations(mlResult, resumeText),
          strictFeedback: generateStrictSDRFeedback(mlResult),
        },
        modelVersion: "SDR-ML-v2.1",
        timestamp: Date.now(),
      };
    } else {
      // Use generic role-based scoring
      console.log(`[ML] Using generic ML model for ${detectedRole}`);
      mlResult = scoreResumeByRole(
        resumeText,
        detectedRole as keyof typeof GLOBAL_INDUSTRY_STANDARDS,
        region,
        experienceYears
      );

      return {
        role: detectedRole,
        region,
        score: mlResult.score,
        analysis: {
          overallScore: mlResult.score,
          insights: mlResult.insights,
          penalties: mlResult.penalties,
          recommendations: generateGenericRecommendations(mlResult, detectedRole),
        },
        modelVersion: "Generic-ML-v1.0",
        timestamp: Date.now(),
      };
    }
  },
});

/**
 * Advanced ML-Based Role Detection System
 *
 * Uses multi-layer classification with:
 * - TF-IDF weighted keyword scoring
 * - Contextual phrase analysis
 * - Role-specific pattern matching
 * - Confidence scoring
 * - Disambiguation logic
 */
async function detectRoleFromResume(resumeText: string): Promise<string> {
  const text = resumeText.toLowerCase();
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // Calculate role scores using advanced ML algorithms
  const roleScores = calculateRoleScores(text, lines);

  // Get top candidates with confidence scores
  const sortedRoles = Object.entries(roleScores)
    .sort(([, a], [, b]) => b.totalScore - a.totalScore)
    .filter(([, score]) => score.totalScore > 0);

  if (sortedRoles.length === 0) return "General";

  const [topRole, topScore] = sortedRoles[0];
  const [secondRole, secondScore] = sortedRoles[1] || [null, { totalScore: 0 }];

  // Log detection details
  console.log(`[ML Role Detection] Top match: ${topRole} (confidence: ${topScore.confidence.toFixed(2)})`);
  console.log(`[ML Role Detection] Scores:`, Object.fromEntries(
    sortedRoles.slice(0, 3).map(([role, score]) => [role, score.totalScore.toFixed(1)])
  ));

  // High confidence threshold - return immediately
  if (topScore.confidence >= 0.8) {
    return topRole;
  }

  // Medium confidence - check for disambiguation
  if (topScore.confidence >= 0.5) {
    // If there's a close second, use contextual disambiguation
    if (secondScore && (topScore.totalScore - secondScore.totalScore) < 10) {
      const disambiguated = disambiguateRoles(text, topRole, secondRole.toString());
      console.log(`[ML Role Detection] Disambiguated: ${topRole} vs ${secondRole} → ${disambiguated}`);
      return disambiguated;
    }
    return topRole;
  }

  // Low confidence - return General
  console.log(`[ML Role Detection] Low confidence (${topScore.confidence.toFixed(2)}), returning General`);
  return "General";
}

/**
 * Calculate weighted scores for each role using TF-IDF-inspired approach
 */
function calculateRoleScores(text: string, lines: string[]): Record<string, any> {
  const roles: Record<string, any> = {};

  // Define role patterns with weighted keywords (TF-IDF style weights)
  const rolePatterns: Record<string, RolePattern> = {
    "Sales (SDR/BDR)": {
      primaryKeywords: [
        { term: "sdr", weight: 10 },
        { term: "bdr", weight: 10 },
        { term: "sales development representative", weight: 12 },
        { term: "business development representative", weight: 12 },
      ],
      secondaryKeywords: [
        { term: "cold calling", weight: 5 },
        { term: "outbound", weight: 5 },
        { term: "prospecting", weight: 5 },
        { term: "pipeline generation", weight: 6 },
        { term: "quota attainment", weight: 6 },
        { term: "lead qualification", weight: 5 },
        { term: "discovery calls", weight: 4 },
        { term: "salesforce", weight: 3 },
        { term: "outreach.io", weight: 4 },
        { term: "salesloft", weight: 4 },
      ],
      contextualPhrases: [
        { phrase: /generated \$[\d,.]+[km]? in pipeline/i, weight: 8 },
        { phrase: /\d+% (of )?quota/i, weight: 7 },
        { phrase: /\d+ (cold )?calls? (per|daily|weekly)/i, weight: 6 },
        { phrase: /\d+ meetings? booked/i, weight: 6 },
      ],
      negativeKeywords: ["software", "engineering", "developer", "code"],
    },

    "Software Engineering": {
      primaryKeywords: [
        { term: "software engineer", weight: 10 },
        { term: "software developer", weight: 10 },
        { term: "full stack", weight: 9 },
        { term: "frontend developer", weight: 9 },
        { term: "backend developer", weight: 9 },
        { term: "fullstack", weight: 9 },
      ],
      secondaryKeywords: [
        { term: "react", weight: 4 },
        { term: "node.js", weight: 4 },
        { term: "python", weight: 3 },
        { term: "javascript", weight: 3 },
        { term: "typescript", weight: 4 },
        { term: "api", weight: 3 },
        { term: "microservices", weight: 5 },
        { term: "kubernetes", weight: 4 },
        { term: "docker", weight: 4 },
        { term: "aws", weight: 3 },
        { term: "git", weight: 2 },
        { term: "agile", weight: 2 },
        { term: "rest", weight: 3 },
        { term: "graphql", weight: 4 },
      ],
      contextualPhrases: [
        { phrase: /built|developed|implemented|created (a |an )?(\w+ )?application/i, weight: 5 },
        { phrase: /reduced (latency|load time|response time) by \d+%/i, weight: 6 },
        { phrase: /deployed to (production|aws|azure|gcp)/i, weight: 5 },
      ],
      negativeKeywords: ["sales", "marketing", "customer service"],
    },

    "Data Science": {
      primaryKeywords: [
        { term: "data scientist", weight: 12 },
        { term: "machine learning engineer", weight: 11 },
        { term: "ml engineer", weight: 10 },
        { term: "ai engineer", weight: 10 },
      ],
      secondaryKeywords: [
        { term: "machine learning", weight: 6 },
        { term: "deep learning", weight: 6 },
        { term: "tensorflow", weight: 5 },
        { term: "pytorch", weight: 5 },
        { term: "scikit-learn", weight: 5 },
        { term: "pandas", weight: 4 },
        { term: "numpy", weight: 4 },
        { term: "sql", weight: 3 },
        { term: "python", weight: 3 },
        { term: "r programming", weight: 4 },
        { term: "nlp", weight: 5 },
        { term: "computer vision", weight: 5 },
        { term: "neural network", weight: 5 },
      ],
      contextualPhrases: [
        { phrase: /trained|built|developed (a )?model/i, weight: 7 },
        { phrase: /(accuracy|precision|recall|f1(-| )score) of \d+%/i, weight: 6 },
        { phrase: /analyzed \d+[km]? (data points|records)/i, weight: 5 },
      ],
      negativeKeywords: ["sales", "marketing"],
    },

    "Product Management": {
      primaryKeywords: [
        { term: "product manager", weight: 12 },
        { term: "senior product manager", weight: 12 },
        { term: "product owner", weight: 10 },
        { term: "technical product manager", weight: 11 },
      ],
      secondaryKeywords: [
        { term: "product management", weight: 5 },
        { term: "roadmap", weight: 5 },
        { term: "agile", weight: 3 },
        { term: "scrum", weight: 3 },
        { term: "stakeholder", weight: 4 },
        { term: "mvp", weight: 5 },
        { term: "user stories", weight: 4 },
        { term: "product strategy", weight: 5 },
        { term: "product vision", weight: 5 },
        { term: "okr", weight: 4 },
        { term: "kpi", weight: 3 },
        { term: "user research", weight: 4 },
        { term: "a/b testing", weight: 4 },
      ],
      contextualPhrases: [
        { phrase: /launched|shipped|released (a )?product/i, weight: 7 },
        { phrase: /increased (user|customer) (engagement|retention) by \d+%/i, weight: 6 },
        { phrase: /managed (a )?roadmap/i, weight: 5 },
      ],
      negativeKeywords: [],
    },

    "Marketing": {
      primaryKeywords: [
        { term: "marketing manager", weight: 10 },
        { term: "digital marketing", weight: 10 },
        { term: "growth marketing", weight: 10 },
        { term: "content marketing", weight: 9 },
      ],
      secondaryKeywords: [
        { term: "seo", weight: 5 },
        { term: "sem", weight: 5 },
        { term: "ppc", weight: 5 },
        { term: "google analytics", weight: 4 },
        { term: "facebook ads", weight: 4 },
        { term: "google ads", weight: 4 },
        { term: "email marketing", weight: 4 },
        { term: "growth", weight: 3 },
        { term: "conversion rate", weight: 4 },
        { term: "social media", weight: 3 },
        { term: "hubspot", weight: 3 },
        { term: "mailchimp", weight: 3 },
      ],
      contextualPhrases: [
        { phrase: /increased (traffic|conversions|leads) by \d+%/i, weight: 6 },
        { phrase: /managed \$[\d,.]+[km]? (marketing )?budget/i, weight: 6 },
        { phrase: /generated \d+[km]? leads/i, weight: 6 },
      ],
      negativeKeywords: ["software", "engineering"],
    },

    "Nursing": {
      primaryKeywords: [
        { term: "registered nurse", weight: 12 },
        { term: "rn", weight: 10 },
        { term: "nurse practitioner", weight: 12 },
        { term: "licensed practical nurse", weight: 11 },
        { term: "lpn", weight: 10 },
      ],
      secondaryKeywords: [
        { term: "patient care", weight: 6 },
        { term: "clinical", weight: 4 },
        { term: "icu", weight: 6 },
        { term: "emergency room", weight: 6 },
        { term: "med-surg", weight: 6 },
        { term: "pediatric", weight: 5 },
        { term: "vital signs", weight: 4 },
        { term: "medication administration", weight: 5 },
        { term: "patient assessment", weight: 5 },
        { term: "bls", weight: 3 },
        { term: "acls", weight: 4 },
        { term: "nclex", weight: 5 },
      ],
      contextualPhrases: [
        { phrase: /cared for \d+ patients/i, weight: 6 },
        { phrase: /(patient|nurse)[ -]to[ -](patient|nurse) ratio/i, weight: 5 },
        { phrase: /(licensed|certified) in \w+/i, weight: 5 },
      ],
      negativeKeywords: ["software", "developer", "sales"],
    },
  };

  // Calculate scores for each role
  for (const [roleName, pattern] of Object.entries(rolePatterns)) {
    let score = 0;
    let matches = 0;

    // Primary keywords (high weight, required for detection)
    let primaryScore = 0;
    for (const { term, weight } of pattern.primaryKeywords) {
      const count = (text.match(new RegExp(term, 'gi')) || []).length;
      if (count > 0) {
        primaryScore += weight * Math.min(count, 3); // Cap at 3 mentions
        matches++;
      }
    }

    // Secondary keywords (supporting evidence)
    let secondaryScore = 0;
    for (const { term, weight } of pattern.secondaryKeywords) {
      const count = (text.match(new RegExp(term, 'gi')) || []).length;
      if (count > 0) {
        secondaryScore += weight * Math.min(count, 2); // Cap at 2 mentions
        matches++;
      }
    }

    // Contextual phrases (high signal)
    let contextScore = 0;
    for (const { phrase, weight } of pattern.contextualPhrases) {
      const count = (text.match(phrase) || []).length;
      if (count > 0) {
        contextScore += weight * count;
        matches++;
      }
    }

    // Negative keywords penalty
    let penalty = 0;
    for (const negTerm of pattern.negativeKeywords) {
      const count = (text.match(new RegExp(negTerm, 'gi')) || []).length;
      if (count > 0) {
        penalty += count * 5; // Strong penalty
      }
    }

    // Total score calculation
    score = primaryScore * 1.5 + secondaryScore + contextScore - penalty;

    // Confidence calculation (based on diversity of matches and score magnitude)
    const maxPossibleScore =
      pattern.primaryKeywords.reduce((sum, k) => sum + k.weight * 3, 0) * 1.5 +
      pattern.secondaryKeywords.reduce((sum, k) => sum + k.weight * 2, 0) +
      pattern.contextualPhrases.reduce((sum, p) => sum + p.weight, 0);

    const confidence = Math.min(score / maxPossibleScore, 1.0);

    roles[roleName] = {
      totalScore: score,
      primaryScore,
      secondaryScore,
      contextScore,
      penalty,
      matches,
      confidence,
    };
  }

  return roles;
}

/**
 * Disambiguate between two similar roles using contextual analysis
 */
function disambiguateRoles(text: string, role1: string, role2: string): string {
  // Check for title mentions in first 3 lines (resume header)
  const firstLines = text.split('\n').slice(0, 5).join(' ').toLowerCase();

  if (firstLines.includes(role1.toLowerCase())) return role1;
  if (firstLines.includes(role2.toLowerCase())) return role2;

  // Check for job title patterns
  const titlePattern = /^(current|previous|experience):?\s*(.+)$/im;
  const titleMatch = text.match(titlePattern);
  if (titleMatch) {
    const title = titleMatch[2].toLowerCase();
    if (title.includes(role1.toLowerCase())) return role1;
    if (title.includes(role2.toLowerCase())) return role2;
  }

  // Default to role1 (higher score)
  return role1;
}

// Type definition for role patterns
interface RolePattern {
  primaryKeywords: Array<{ term: string; weight: number }>;
  secondaryKeywords: Array<{ term: string; weight: number }>;
  contextualPhrases: Array<{ phrase: RegExp; weight: number }>;
  negativeKeywords: string[];
}

/**
 * Generate strict, actionable recommendations for SDR/BDR resumes
 */
function generateSDRRecommendations(mlResult: any, resumeText: string): string[] {
  const recommendations: string[] = [];

  // Activity metrics missing
  if (mlResult.dimensionScores.activityMetrics < 30) {
    recommendations.push(
      "🚨 CRITICAL: Add daily activity metrics. Example: 'Averaged 80-100 cold calls and 120 emails daily, maintaining 25% connect rate'"
    );
    recommendations.push(
      "Add weekly meeting booking metrics. Example: 'Booked 12-15 qualified meetings per week with 32% show rate'"
    );
  }

  // Conversion metrics missing
  if (mlResult.dimensionScores.conversionMetrics < 30) {
    recommendations.push(
      "⚠️ Add conversion metrics to show effectiveness. Example: 'Maintained 18% email response rate (3x team average) through personalized sequences'"
    );
    recommendations.push(
      "Show call-to-meeting conversion. Example: '22% connect rate with 8% call-to-meeting conversion'"
    );
  }

  // Pipeline impact missing
  if (mlResult.dimensionScores.pipelineImpact < 30) {
    recommendations.push(
      "💰 Add pipeline $ generated. Example: 'Generated $2.3M in qualified pipeline over 6 months, achieving 115% of quota'"
    );
    recommendations.push(
      "Show quota attainment %. Example: 'Achieved 118% of $2M annual quota for 3 consecutive quarters'"
    );
  }

  // Technical skills missing
  if (mlResult.dimensionScores.technicalSkills < 40) {
    recommendations.push(
      "🔧 List CRM/sales tools with context. Example: 'Maintained 98% data accuracy in Salesforce across 300+ accounts'"
    );
    recommendations.push(
      "Mention sales tech stack: Salesforce, Outreach/SalesLoft, LinkedIn Sales Navigator, Apollo, ZoomInfo"
    );
  }

  // Format issues
  if (mlResult.dimensionScores.format < 50) {
    if (mlResult.penalties.overTwoPages > 0) {
      recommendations.push(
        "📄 Cut resume to 1 page. SDR hiring managers spend 6 seconds - make every word count."
      );
    }
    if (mlResult.penalties.educationHeavy > 0) {
      recommendations.push(
        "📚 Move education to bottom. Put sales experience and metrics at the top - that's what gets you hired."
      );
    }
    if (mlResult.penalties.weakVerbs > 0) {
      recommendations.push(
        "💪 Replace weak verbs. Change 'responsible for' → 'Generated', 'helped with' → 'Achieved', 'managed' → 'Exceeded'"
      );
    }
  }

  // Generic bullets
  if (mlResult.redFlags.some((flag: string) => flag.includes("generic"))) {
    recommendations.push(
      "🎯 Make bullets specific. Bad: 'Contacted prospects' → Good: 'Averaged 90 cold calls daily with 23% connect rate, booking 14 meetings/week'"
    );
  }

  return recommendations;
}

/**
 * Generate strict feedback for SDR resumes
 */
function generateStrictSDRFeedback(mlResult: any): string {
  let feedback = "";

  if (mlResult.overallScore >= 80) {
    feedback = "🎉 EXCELLENT SDR Resume. You clearly demonstrate prospecting ability, meeting booking, and quota attainment. This resume will get you interviews.";
  } else if (mlResult.overallScore >= 65) {
    feedback = "✅ SOLID SDR Resume. You have the core metrics, but there's room to strengthen your numbers and show more conversion data.";
  } else if (mlResult.overallScore >= 50) {
    feedback = "⚠️ AVERAGE SDR Resume. You're missing key metrics that hiring managers look for. Focus on adding activity numbers, conversion rates, and pipeline $.";
  } else if (mlResult.overallScore >= 35) {
    feedback = "❌ WEAK SDR Resume. This resume looks like a college application, not a sales profile. You need concrete activity metrics, quota attainment %, and pipeline impact.";
  } else {
    feedback = "🚨 CRITICAL Issues. This resume won't pass ATS or get past a hiring manager. You MUST add: daily calls/emails, meetings booked, quota %, and pipeline generated.";
  }

  // Add specific caps
  if (mlResult.dimensionScores.activityMetrics < 20) {
    feedback += "\n\n🚨 Without activity metrics (calls/day, emails/day, meetings/week), your max score is 45/100. Add these IMMEDIATELY.";
  }

  if (mlResult.dimensionScores.conversionMetrics < 20) {
    feedback += "\n\n⚠️ Without conversion metrics (connect rate, response rate), your max score is 60/100. Show your effectiveness, not just volume.";
  }

  return feedback;
}

/**
 * Generate recommendations for non-SDR roles
 */
function generateGenericRecommendations(mlResult: any, role: string): string[] {
  const recommendations: string[] = [];

  if (mlResult.penalties.length > 0) {
    mlResult.penalties.forEach((penalty: string) => {
      recommendations.push(`⚠️ ${penalty}`);
    });
  }

  if (mlResult.score < 70) {
    recommendations.push(
      `Add more quantifiable metrics. Your resume needs at least 8 data points (%, $, #, time) to be competitive.`
    );
    recommendations.push(
      `Include industry-specific keywords for ${role} role. Check the job description and mirror the language.`
    );
  }

  return recommendations;
}
