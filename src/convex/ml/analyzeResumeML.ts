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
 * Detect role from resume text using keyword analysis
 */
async function detectRoleFromResume(resumeText: string): Promise<string> {
  const text = resumeText.toLowerCase();

  // SDR/BDR detection (high priority)
  const sdrKeywords = [
    "sdr", "bdr", "sales development", "business development",
    "cold calling", "outbound", "prospecting", "pipeline generation",
    "quota attainment", "lead qualification"
  ];

  const sdrMatches = sdrKeywords.filter(kw => text.includes(kw)).length;
  if (sdrMatches >= 3) return "Sales (SDR/BDR)";

  // Software Engineering
  const swKeywords = [
    "software engineer", "developer", "frontend", "backend", "fullstack",
    "react", "node.js", "python", "javascript", "api", "microservices"
  ];
  const swMatches = swKeywords.filter(kw => text.includes(kw)).length;
  if (swMatches >= 4) return "Software Engineering";

  // Data Science
  const dsKeywords = [
    "data scientist", "machine learning", "ml", "ai", "deep learning",
    "tensorflow", "pytorch", "pandas", "numpy", "sql", "python"
  ];
  const dsMatches = dsKeywords.filter(kw => text.includes(kw)).length;
  if (dsMatches >= 4) return "Data Science";

  // Product Management
  const pmKeywords = [
    "product manager", "product management", "roadmap", "agile", "scrum",
    "stakeholder", "mvp", "user stories", "product strategy"
  ];
  const pmMatches = pmKeywords.filter(kw => text.includes(kw)).length;
  if (pmMatches >= 3) return "Product Management";

  // Marketing
  const mktKeywords = [
    "marketing", "seo", "sem", "content marketing", "digital marketing",
    "google analytics", "facebook ads", "email marketing", "growth"
  ];
  const mktMatches = mktKeywords.filter(kw => text.includes(kw)).length;
  if (mktMatches >= 3) return "Marketing";

  return "General";
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
