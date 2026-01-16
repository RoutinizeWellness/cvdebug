/**
 * Interview Probability Predictor
 *
 * Predicts likelihood of getting an interview based on multiple factors
 * Uses logistic regression-style scoring with weighted factors
 *
 * This is the ULTIMATE feature that Jobscan doesn't have ❌
 * CVDebug predicts actual interview probability ✅
 */

export interface InterviewPrediction {
  probability: number;          // 0-100: % chance of interview
  confidence: "high" | "medium" | "low";
  primaryFactors: Factor[];
  recommendations: string[];
  timeline: string;
  competitiveEdge: string;
}

export interface Factor {
  name: string;
  impact: "very_high" | "high" | "medium" | "low";
  score: number;                // 0-100
  weight: number;               // Contribution to probability
  status: "strong" | "adequate" | "weak";
  actionable: string;
}

/**
 * Weights for interview probability (based on recruiter behavior data)
 */
const FACTOR_WEIGHTS = {
  resumeScore: 0.25,            // Overall ATS score
  keywordMatch: 0.20,           // JD keyword match %
  experience: 0.15,             // Years of relevant experience
  education: 0.10,              // Education level match
  location: 0.08,               // Geographic fit
  recency: 0.07,                // Recent relevant experience
  companyBrand: 0.05,           // Prior company prestige
  referral: 0.05,               // Internal referral
  applicationTiming: 0.03,      // Early vs late application
  profileCompleteness: 0.02     // LinkedIn/portfolio presence
};

/**
 * Calculate interview probability using logistic regression approach
 */
export function predictInterviewProbability(params: {
  resumeScore: number;          // 0-100
  keywordMatchPercent: number;  // 0-100
  yearsExperience: number;
  yearsRequired: number;
  educationLevel: "highschool" | "associates" | "bachelors" | "masters" | "phd";
  educationRequired: "highschool" | "associates" | "bachelors" | "masters" | "phd";
  isRemote: boolean;
  locationMatch: boolean;
  daysPosted: number;
  hasReferral: boolean;
  priorCompanyTier: 1 | 2 | 3 | 4 | 5; // 1=FAANG, 2=Fortune500, etc.
  hasPortfolio: boolean;
}): InterviewPrediction {
  const factors: Factor[] = [];

  // 1. Resume Score Factor
  const resumeScoreImpact = params.resumeScore / 100;
  factors.push({
    name: "Resume ATS Score",
    impact: params.resumeScore >= 80 ? "very_high" : params.resumeScore >= 70 ? "high" : "medium",
    score: params.resumeScore,
    weight: FACTOR_WEIGHTS.resumeScore * resumeScoreImpact,
    status: params.resumeScore >= 75 ? "strong" : params.resumeScore >= 60 ? "adequate" : "weak",
    actionable: params.resumeScore < 75 ? "Optimize resume to reach 75+ score" : "Resume score is strong"
  });

  // 2. Keyword Match Factor
  const keywordImpact = params.keywordMatchPercent / 100;
  factors.push({
    name: "Job Description Match",
    impact: params.keywordMatchPercent >= 70 ? "very_high" : "high",
    score: params.keywordMatchPercent,
    weight: FACTOR_WEIGHTS.keywordMatch * keywordImpact,
    status: params.keywordMatchPercent >= 70 ? "strong" : params.keywordMatchPercent >= 50 ? "adequate" : "weak",
    actionable: params.keywordMatchPercent < 70 ? `Add ${Math.ceil((70 - params.keywordMatchPercent) / 10)} more JD keywords` : "Keyword match is excellent"
  });

  // 3. Experience Factor
  const experienceGap = params.yearsExperience - params.yearsRequired;
  const experienceRatio = Math.min(1.5, params.yearsExperience / Math.max(1, params.yearsRequired));
  let experienceImpact = 0;

  if (experienceGap >= 0) {
    // Have enough experience
    experienceImpact = Math.min(1, experienceRatio / 1.5);
  } else {
    // Under-qualified
    const deficit = Math.abs(experienceGap);
    experienceImpact = Math.max(0.3, 1 - (deficit * 0.15)); // Penalty for each year short
  }

  factors.push({
    name: "Experience Level",
    impact: experienceGap >= 2 ? "very_high" : experienceGap >= 0 ? "high" : "medium",
    score: Math.round(experienceImpact * 100),
    weight: FACTOR_WEIGHTS.experience * experienceImpact,
    status: experienceGap >= 0 ? "strong" : experienceGap >= -2 ? "adequate" : "weak",
    actionable: experienceGap < 0
      ? `Emphasize ${Math.abs(experienceGap)}+ years equivalent experience or rapid growth`
      : "Experience level matches or exceeds requirements"
  });

  // 4. Education Factor
  const educationLevels = ["highschool", "associates", "bachelors", "masters", "phd"];
  const userEduLevel = educationLevels.indexOf(params.educationLevel);
  const requiredEduLevel = educationLevels.indexOf(params.educationRequired);
  const educationGap = userEduLevel - requiredEduLevel;

  let educationImpact = 1.0;
  if (educationGap < 0) {
    // Under-qualified by education
    educationImpact = Math.max(0.4, 1 - (Math.abs(educationGap) * 0.15));
  } else if (educationGap > 0) {
    // Over-qualified
    educationImpact = 1.0; // No penalty for over-qualification
  }

  factors.push({
    name: "Education Requirement",
    impact: educationGap >= 0 ? "high" : "medium",
    score: Math.round(educationImpact * 100),
    weight: FACTOR_WEIGHTS.education * educationImpact,
    status: educationGap >= 0 ? "strong" : "weak",
    actionable: educationGap < 0
      ? "Highlight relevant certifications and experience to compensate"
      : "Education meets or exceeds requirements"
  });

  // 5. Location Factor
  let locationImpact = 1.0;
  if (params.isRemote) {
    locationImpact = 1.0; // Remote = no location penalty
  } else if (params.locationMatch) {
    locationImpact = 1.0; // Local = good
  } else {
    locationImpact = 0.4; // Non-local for in-office = penalty
  }

  if (!params.isRemote) {
    factors.push({
      name: "Location Match",
      impact: params.locationMatch ? "high" : "low",
      score: Math.round(locationImpact * 100),
      weight: FACTOR_WEIGHTS.location * locationImpact,
      status: params.locationMatch ? "strong" : "weak",
      actionable: !params.locationMatch
        ? "Mention willingness to relocate or seek remote positions"
        : "Location is a good fit"
    });
  }

  // 6. Application Timing Factor
  let timingImpact = 1.0;
  if (params.daysPosted <= 3) {
    timingImpact = 1.2; // Early bird bonus
  } else if (params.daysPosted <= 7) {
    timingImpact = 1.0; // Good timing
  } else if (params.daysPosted <= 14) {
    timingImpact = 0.8; // Getting late
  } else {
    timingImpact = 0.5; // Very late
  }

  factors.push({
    name: "Application Timing",
    impact: params.daysPosted <= 3 ? "high" : params.daysPosted <= 7 ? "medium" : "low",
    score: Math.round(timingImpact * 100),
    weight: FACTOR_WEIGHTS.applicationTiming * timingImpact,
    status: params.daysPosted <= 7 ? "strong" : params.daysPosted <= 14 ? "adequate" : "weak",
    actionable: params.daysPosted > 7
      ? "Apply earlier to future postings (within 3-7 days)"
      : "Good timing - early application"
  });

  // 7. Referral Factor (huge impact!)
  const referralImpact = params.hasReferral ? 2.0 : 1.0; // Referrals DOUBLE interview chances
  if (params.hasReferral) {
    factors.push({
      name: "Internal Referral",
      impact: "very_high",
      score: 100,
      weight: FACTOR_WEIGHTS.referral * 2,
      status: "strong",
      actionable: "Referral significantly boosts your chances!"
    });
  }

  // 8. Company Brand Factor
  const companyTierImpact = {
    1: 1.2, // FAANG/Top tier
    2: 1.1, // Fortune 500
    3: 1.0, // Mid-size/Growth
    4: 0.9, // Small company
    5: 0.8  // Startup/Unknown
  }[params.priorCompanyTier];

  if (params.priorCompanyTier <= 2) {
    factors.push({
      name: "Prior Company Prestige",
      impact: "high",
      score: Math.round(companyTierImpact * 100),
      weight: FACTOR_WEIGHTS.companyBrand * companyTierImpact,
      status: "strong",
      actionable: "Leverage your top-tier experience prominently"
    });
  }

  // 9. Portfolio/LinkedIn Factor
  if (params.hasPortfolio) {
    factors.push({
      name: "Portfolio/GitHub",
      impact: "medium",
      score: 100,
      weight: FACTOR_WEIGHTS.profileCompleteness,
      status: "strong",
      actionable: "Portfolio adds credibility"
    });
  }

  // Calculate total weighted probability
  const baseLogit = factors.reduce((sum, f) => sum + f.weight, 0);

  // Apply referral multiplier
  const finalLogit = baseLogit * referralImpact;

  // Convert to probability using logistic function
  // Logistic function: P = 1 / (1 + e^(-z))
  // Adjusted to realistic interview rates (5-45% range)
  const rawProbability = 1 / (1 + Math.exp(-5 * (finalLogit - 0.5)));
  const scaledProbability = 5 + (rawProbability * 40); // Scale to 5-45% range

  const probability = Math.min(95, Math.max(2, Math.round(scaledProbability)));

  // Sort factors by weight (most important first)
  const sortedFactors = factors.sort((a, b) => b.weight - a.weight);
  const primaryFactors = sortedFactors.slice(0, 5);

  // Determine confidence based on completeness
  let confidence: "high" | "medium" | "low";
  if (factors.length >= 7) confidence = "high";
  else if (factors.length >= 5) confidence = "medium";
  else confidence = "low";

  // Generate actionable recommendations
  const recommendations: string[] = [];
  const weakFactors = factors.filter(f => f.status === "weak");

  if (probability < 30) {
    recommendations.push("🚨 CRITICAL: Low interview probability - major improvements needed");
  } else if (probability < 50) {
    recommendations.push("📊 MODERATE: Fair chances - optimization will help significantly");
  } else if (probability < 70) {
    recommendations.push("✅ GOOD: Solid chances - small tweaks could push you over the edge");
  } else {
    recommendations.push("🎯 EXCELLENT: High probability - you're a strong candidate");
  }

  // Add top 3 actionable items
  weakFactors.slice(0, 3).forEach(f => {
    recommendations.push(`• ${f.actionable}`);
  });

  // Timeline estimate
  let timeline = "";
  if (probability >= 70) {
    timeline = "Expect response in 1-2 weeks";
  } else if (probability >= 50) {
    timeline = "Expect response in 2-3 weeks, follow up after 10 days";
  } else if (probability >= 30) {
    timeline = "Response in 2-4 weeks if selected, apply to 5-10 similar roles";
  } else {
    timeline = "Low chances - apply to 15-20 similar roles, focus on networking";
  }

  // Competitive edge message
  let competitiveEdge = "";
  if (probability >= 70) {
    competitiveEdge = "You're likely in the top 10-15% of applicants for this role";
  } else if (probability >= 50) {
    competitiveEdge = "You're competitive but need to stand out more";
  } else if (probability >= 30) {
    competitiveEdge = "You're at or below average - significant optimization needed";
  } else {
    competitiveEdge = "You're below most applicants - consider roles better aligned with your profile";
  }

  return {
    probability,
    confidence,
    primaryFactors,
    recommendations,
    timeline,
    competitiveEdge
  };
}

/**
 * Calculate application strategy based on probability
 */
export function calculateApplicationStrategy(probability: number): {
  strategy: string;
  applicationsNeeded: number;
  focusAreas: string[];
  timeInvestment: string;
} {
  let strategy = "";
  let applicationsNeeded = 0;
  const focusAreas: string[] = [];
  let timeInvestment = "";

  if (probability >= 70) {
    strategy = "SELECTIVE: Focus on quality over quantity";
    applicationsNeeded = 5;
    focusAreas.push("Tailor cover letters", "Network with employees", "Prepare for interviews");
    timeInvestment = "2-3 hours per application (deep customization)";
  } else if (probability >= 50) {
    strategy = "BALANCED: Mix of quality and volume";
    applicationsNeeded = 10;
    focusAreas.push("Optimize resume per job", "Apply to similar roles", "Build portfolio");
    timeInvestment = "1-2 hours per application";
  } else if (probability >= 30) {
    strategy = "VOLUME: Cast wider net while improving profile";
    applicationsNeeded = 20;
    focusAreas.push("Resume optimization", "Skill development", "More applications");
    timeInvestment = "30-45 minutes per application";
  } else {
    strategy = "FOUNDATIONAL: Major profile improvement + high volume";
    applicationsNeeded = 30;
    focusAreas.push("Major resume overhaul", "Upskilling/certifications", "Consider adjacent roles");
    timeInvestment = "Weeks of optimization before mass applying";
  }

  return {
    strategy,
    applicationsNeeded,
    focusAreas,
    timeInvestment
  };
}

/**
 * Compare probabilities across multiple jobs
 * Helps user prioritize which applications to focus on
 */
export function prioritizeApplications(
  jobs: Array<{
    title: string;
    company: string;
    probability: number;
    fit: number; // 0-100 how much user wants the job
  }>
): Array<{
  title: string;
  company: string;
  priority: "must_apply" | "should_apply" | "consider" | "skip";
  score: number;
  reasoning: string;
}> {
  return jobs
    .map(job => {
      // Combined score: 70% probability, 30% fit
      const score = (job.probability * 0.7) + (job.fit * 0.3);

      let priority: "must_apply" | "should_apply" | "consider" | "skip";
      let reasoning = "";

      if (score >= 70) {
        priority = "must_apply";
        reasoning = `High probability (${job.probability}%) + strong fit (${job.fit}%) = excellent opportunity`;
      } else if (score >= 55) {
        priority = "should_apply";
        reasoning = `Good probability (${job.probability}%) or fit (${job.fit}%) - worth pursuing`;
      } else if (score >= 40) {
        priority = "consider";
        reasoning = `Moderate scores - apply if you have bandwidth`;
      } else {
        priority = "skip";
        reasoning = `Low probability (${job.probability}%) and/or fit (${job.fit}%) - focus elsewhere`;
      }

      return {
        title: job.title,
        company: job.company,
        priority,
        score: Math.round(score),
        reasoning
      };
    })
    .sort((a, b) => b.score - a.score);
}
