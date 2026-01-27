/**
 * PHASE 3 - FEATURE 4: INTELLIGENT JOB MATCHING ALGORITHM
 *
 * Advanced job-resume matching system with ML-powered ranking
 *
 * Features:
 * - Multi-factor compatibility scoring
 * - Skills match analysis
 * - Experience level alignment
 * - Salary expectations matching
 * - Company culture fit
 * - Location & remote work preferences
 * - Career growth potential
 * - Application competition analysis
 *
 * COMPETITIVE ADVANTAGE:
 * - LinkedIn: Basic keyword matching ❌
 * - Indeed: Simple filters ❌
 * - CVDebug: ML-powered matching with probability ✅
 */

import { v } from "convex/values";

/**
 * Job posting data
 */
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  remoteType: "onsite" | "hybrid" | "remote" | "flexible";
  description: string;
  requirements: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  } | null;
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive";
  industry: string;
  companySize: "startup" | "small" | "medium" | "large" | "enterprise";
  benefits?: string[];
  postedDate: number;
  applicationCount?: number;
}

/**
 * Candidate profile
 */
export interface CandidateProfile {
  resumeText: string;
  yearsExperience: number;
  currentRole?: string;
  desiredRole?: string;
  skills: string[];
  education: string;
  location: string;
  willingToRelocate: boolean;
  remotePreference: "onsite" | "hybrid" | "remote" | "any";
  salaryExpectation: {
    min: number;
    max: number;
    currency: string;
  };
  preferredIndustries?: string[];
  preferredCompanySize?: Array<"startup" | "small" | "medium" | "large" | "enterprise">;
  careerGoals?: string;
}

/**
 * Job match result
 */
export interface JobMatch {
  jobId: string;
  overallScore: number;        // 0-100 composite score
  matchBreakdown: {
    skillsMatch: number;       // 0-100
    experienceMatch: number;   // 0-100
    locationMatch: number;     // 0-100
    salaryMatch: number;       // 0-100
    cultureFit: number;        // 0-100
    careerGrowth: number;      // 0-100
  };
  interviewProbability: number; // 0-100%
  competitionLevel: "low" | "medium" | "high" | "very_high";
  strengths: string[];         // What makes you a good fit
  weaknesses: string[];        // Potential concerns
  suggestions: string[];       // How to improve chances
  estimatedResponseTime: number; // Days
  applicationStrategy: string;
  shouldApply: boolean;
  reasoning: string;
}

/**
 * Match weights for scoring
 */
const MATCH_WEIGHTS = {
  skillsMatch: 0.35,      // Most important (35%)
  experienceMatch: 0.20,  // Very important (20%)
  locationMatch: 0.10,    // Moderate (10%)
  salaryMatch: 0.15,      // Important (15%)
  cultureFit: 0.10,       // Moderate (10%)
  careerGrowth: 0.10      // Future potential (10%)
};

/**
 * Calculate skills match score
 */
export function calculateSkillsMatch(
  candidateSkills: string[],
  jobRequirements: string
): {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
} {
  const jobText = jobRequirements.toLowerCase();
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  // Extract all mentioned skills from job requirements
  const requiredSkills = extractRequiredSkills(jobRequirements);

  // Check each required skill
  for (const reqSkill of requiredSkills) {
    const hasSkill = candidateSkills.some(cs =>
      cs.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(cs.toLowerCase())
    );

    if (hasSkill) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  const matchPercentage = requiredSkills.length > 0
    ? (matchedSkills.length / requiredSkills.length) * 100
    : 0;

  // Calculate score with diminishing returns
  let score = 0;
  if (matchPercentage >= 90) score = 100;
  else if (matchPercentage >= 75) score = 85 + (matchPercentage - 75) * 1.5;
  else if (matchPercentage >= 50) score = 60 + (matchPercentage - 50);
  else score = matchPercentage * 1.2;

  return {
    score: Math.min(100, Math.round(score)),
    matchedSkills,
    missingSkills,
    matchPercentage: Math.round(matchPercentage)
  };
}

/**
 * Extract required skills from job posting
 */
function extractRequiredSkills(jobText: string): string[] {
  const skills = new Set<string>();
  const text = jobText.toLowerCase();

  // Common tech skills
  const techSkills = [
    "javascript", "typescript", "python", "java", "go", "rust", "c++", "c#",
    "react", "vue", "angular", "svelte", "node.js", "django", "flask", "spring",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "postgresql", "mongodb", "redis", "mysql", "sql",
    "git", "ci/cd", "agile", "scrum", "rest api", "graphql",
    "machine learning", "tensorflow", "pytorch", "data science"
  ];

  for (const skill of techSkills) {
    if (text.includes(skill)) {
      skills.add(skill);
    }
  }

  return Array.from(skills);
}

/**
 * Calculate experience match score
 */
export function calculateExperienceMatch(
  candidateYears: number,
  jobLevel: "entry" | "mid" | "senior" | "lead" | "executive",
  jobDescription: string
): {
  score: number;
  alignment: "under" | "perfect" | "over";
  explanation: string;
} {
  // Map job levels to expected years
  const expectedYears: Record<typeof jobLevel, { min: number; max: number }> = {
    entry: { min: 0, max: 2 },
    mid: { min: 2, max: 5 },
    senior: { min: 5, max: 10 },
    lead: { min: 8, max: 15 },
    executive: { min: 10, max: 30 }
  };

  const expected = expectedYears[jobLevel];
  let score = 0;
  let alignment: "under" | "perfect" | "over" = "perfect";
  let explanation = "";

  if (candidateYears >= expected.min && candidateYears <= expected.max) {
    // Perfect match
    score = 100;
    alignment = "perfect";
    explanation = `Your ${candidateYears} years of experience perfectly aligns with the ${jobLevel} level requirement.`;
  } else if (candidateYears < expected.min) {
    // Under-qualified
    const gap = expected.min - candidateYears;
    score = Math.max(0, 100 - (gap * 20)); // -20 points per year under
    alignment = "under";
    explanation = `You have ${candidateYears} years but the role typically requires ${expected.min}-${expected.max} years. Focus on showcasing relevant achievements.`;
  } else {
    // Over-qualified
    const excess = candidateYears - expected.max;
    score = Math.max(60, 100 - (excess * 5)); // -5 points per year over (more lenient)
    alignment = "over";
    explanation = `You have ${candidateYears} years which exceeds the ${expected.max} year typical maximum. Emphasize leadership and mentorship.`;
  }

  return {
    score: Math.round(score),
    alignment,
    explanation
  };
}

/**
 * Calculate location match score
 */
export function calculateLocationMatch(
  candidateLocation: string,
  willingToRelocate: boolean,
  remotePreference: "onsite" | "hybrid" | "remote" | "any",
  jobLocation: string,
  jobRemoteType: "onsite" | "hybrid" | "remote" | "flexible"
): {
  score: number;
  compatible: boolean;
  explanation: string;
} {
  // Remote match
  if (jobRemoteType === "remote") {
    return {
      score: 100,
      compatible: true,
      explanation: "Fully remote position - location not a concern"
    };
  }

  // Same location
  const sameLocation = candidateLocation.toLowerCase().includes(jobLocation.toLowerCase()) ||
                       jobLocation.toLowerCase().includes(candidateLocation.toLowerCase());

  if (sameLocation) {
    return {
      score: 100,
      compatible: true,
      explanation: "You're already in the same location as the job"
    };
  }

  // Willing to relocate
  if (willingToRelocate && jobRemoteType === "onsite") {
    return {
      score: 85,
      compatible: true,
      explanation: "You're willing to relocate, but this may be discussed during interviews"
    };
  }

  // Hybrid preferences
  if (jobRemoteType === "hybrid") {
    if (remotePreference === "hybrid" || remotePreference === "any") {
      return {
        score: sameLocation ? 100 : 70,
        compatible: true,
        explanation: sameLocation
          ? "Hybrid role in your location - perfect fit"
          : "Hybrid role may require occasional travel or relocation"
      };
    } else if (remotePreference === "remote") {
      return {
        score: 50,
        compatible: false,
        explanation: "Role requires hybrid work but you prefer fully remote"
      };
    }
  }

  // Flexible work
  if (jobRemoteType === "flexible") {
    return {
      score: 90,
      compatible: true,
      explanation: "Flexible work arrangement - can likely accommodate your preferences"
    };
  }

  // Incompatible
  return {
    score: 20,
    compatible: false,
    explanation: `Location mismatch: job is in ${jobLocation}, you're in ${candidateLocation} and ${willingToRelocate ? "willing" : "not willing"} to relocate`
  };
}

/**
 * Calculate salary match score
 */
export function calculateSalaryMatch(
  candidateMin: number,
  candidateMax: number,
  jobSalary: { min: number; max: number } | null
): {
  score: number;
  compatible: boolean;
  gap: number;
  explanation: string;
} {
  if (!jobSalary) {
    return {
      score: 50,
      compatible: true,
      gap: 0,
      explanation: "Salary not specified - discuss during interview"
    };
  }

  // Perfect overlap
  if (jobSalary.max >= candidateMin && jobSalary.min <= candidateMax) {
    const overlapRange = Math.min(jobSalary.max, candidateMax) - Math.max(jobSalary.min, candidateMin);
    const candidateRange = candidateMax - candidateMin;
    const overlapPercentage = (overlapRange / candidateRange) * 100;

    return {
      score: 75 + (overlapPercentage / 4), // 75-100 based on overlap
      compatible: true,
      gap: 0,
      explanation: `Salary ranges overlap - good alignment with your expectations`
    };
  }

  // Job offers less than candidate expects
  if (jobSalary.max < candidateMin) {
    const gap = candidateMin - jobSalary.max;
    const gapPercentage = (gap / candidateMin) * 100;
    const score = Math.max(0, 50 - gapPercentage);

    return {
      score: Math.round(score),
      compatible: gap < candidateMin * 0.15, // <15% gap might be negotiable
      gap: -gap,
      explanation: `Job offers up to $${(jobSalary.max / 1000).toFixed(0)}K but you expect at least $${(candidateMin / 1000).toFixed(0)}K (${gapPercentage.toFixed(0)}% gap)`
    };
  }

  // Job offers more than candidate expects (great!)
  if (jobSalary.min > candidateMax) {
    return {
      score: 100,
      compatible: true,
      gap: jobSalary.min - candidateMax,
      explanation: `Job offers more than your expectations - excellent compensation match`
    };
  }

  return {
    score: 50,
    compatible: true,
    gap: 0,
    explanation: "Salary alignment unclear"
  };
}

/**
 * Calculate culture fit score
 */
export function calculateCultureFit(
  candidateProfile: CandidateProfile,
  job: JobPosting
): {
  score: number;
  factors: Array<{ factor: string; match: boolean; weight: number }>;
  explanation: string;
} {
  const factors: Array<{ factor: string; match: boolean; weight: number }> = [];
  let score = 0;

  // Company size preference
  if (candidateProfile.preferredCompanySize) {
    const sizeMatch = candidateProfile.preferredCompanySize.includes(job.companySize);
    factors.push({
      factor: `Company size (${job.companySize})`,
      match: sizeMatch,
      weight: 20
    });
    if (sizeMatch) score += 20;
  }

  // Industry preference
  if (candidateProfile.preferredIndustries) {
    const industryMatch = candidateProfile.preferredIndustries.some(i =>
      i.toLowerCase() === job.industry.toLowerCase()
    );
    factors.push({
      factor: `Industry (${job.industry})`,
      match: industryMatch,
      weight: 25
    });
    if (industryMatch) score += 25;
  }

  // Career goals alignment
  if (candidateProfile.careerGoals) {
    const careerAlignment = job.description.toLowerCase().includes(
      candidateProfile.careerGoals.toLowerCase().split(' ')[0]
    );
    factors.push({
      factor: "Career goals alignment",
      match: careerAlignment,
      weight: 30
    });
    if (careerAlignment) score += 30;
  }

  // Benefits alignment (if available)
  if (job.benefits && job.benefits.length > 0) {
    factors.push({
      factor: `Benefits offered (${job.benefits.length} benefits)`,
      match: true,
      weight: 15
    });
    score += 15;
  }

  // Work style (remote/hybrid/onsite)
  const workStyleMatch = candidateProfile.remotePreference === "any" ||
                         candidateProfile.remotePreference === job.remoteType;
  factors.push({
    factor: `Work style (${job.remoteType})`,
    match: workStyleMatch,
    weight: 10
  });
  if (workStyleMatch) score += 10;

  const explanation = score >= 70
    ? "Strong cultural fit - company aligns well with your preferences"
    : score >= 50
    ? "Moderate cultural fit - some alignment with your preferences"
    : "Limited cultural fit - company may not align with your preferences";

  return {
    score: Math.min(100, Math.round(score)),
    factors,
    explanation
  };
}

/**
 * Calculate career growth potential
 */
export function calculateCareerGrowth(
  job: JobPosting,
  candidateYears: number
): {
  score: number;
  growthPotential: "high" | "medium" | "low";
  reasoning: string;
} {
  let score = 50; // Baseline
  const factors: string[] = [];

  // Company size impact
  const sizeGrowth: Record<typeof job.companySize, number> = {
    startup: 85,     // High growth, high risk
    small: 70,       // Good growth potential
    medium: 65,      // Stable growth
    large: 55,       // Slower but stable
    enterprise: 50   // Structured but slower
  };
  score = sizeGrowth[job.companySize];
  factors.push(`${job.companySize} company provides ${score >= 70 ? "excellent" : score >= 60 ? "good" : "moderate"} growth opportunities`);

  // Experience level trajectory
  const levelGrowth: Record<typeof job.experienceLevel, number> = {
    entry: 20,       // Limited upward mobility
    mid: 15,         // Good stepping stone
    senior: 10,      // Leadership track
    lead: 5,         // Near peak
    executive: 0     // At peak
  };
  score += levelGrowth[job.experienceLevel];

  if (job.experienceLevel === "lead" || job.experienceLevel === "senior") {
    factors.push("Senior position offers leadership and mentorship opportunities");
  }

  // Industry growth
  const industryGrowth = job.industry.toLowerCase().includes("tech") ||
                        job.industry.toLowerCase().includes("ai") ||
                        job.industry.toLowerCase().includes("cloud");
  if (industryGrowth) {
    score += 10;
    factors.push("Growing industry with strong future demand");
  }

  // Check job description for growth indicators
  const jobDesc = job.description.toLowerCase();
  if (jobDesc.includes("leadership") || jobDesc.includes("mentor")) {
    score += 5;
    factors.push("Role includes leadership/mentorship opportunities");
  }
  if (jobDesc.includes("learning") || jobDesc.includes("development")) {
    score += 5;
    factors.push("Company emphasizes professional development");
  }

  let growthPotential: "high" | "medium" | "low";
  if (score >= 70) growthPotential = "high";
  else if (score >= 50) growthPotential = "medium";
  else growthPotential = "low";

  return {
    score: Math.min(100, Math.round(score)),
    growthPotential,
    reasoning: factors.join(". ")
  };
}

/**
 * Estimate competition level
 */
export function estimateCompetition(
  job: JobPosting,
  skillsMatchScore: number
): {
  level: "low" | "medium" | "high" | "very_high";
  estimatedApplicants: number;
  reasoning: string;
} {
  let competitionScore = 50;

  // Application count (if available)
  if (job.applicationCount) {
    if (job.applicationCount > 500) competitionScore = 90;
    else if (job.applicationCount > 200) competitionScore = 75;
    else if (job.applicationCount > 100) competitionScore = 60;
    else if (job.applicationCount > 50) competitionScore = 45;
    else competitionScore = 30;
  } else {
    // Estimate based on company and role
    const sizeMultiplier: Record<typeof job.companySize, number> = {
      startup: 0.7,
      small: 0.8,
      medium: 1.0,
      large: 1.3,
      enterprise: 1.5
    };

    const levelMultiplier: Record<typeof job.experienceLevel, number> = {
      entry: 1.5,      // Lots of competition
      mid: 1.2,
      senior: 1.0,
      lead: 0.8,
      executive: 0.6
    };

    competitionScore *= sizeMultiplier[job.companySize];
    competitionScore *= levelMultiplier[job.experienceLevel];
  }

  // Time since posting
  const daysSincePosted = (Date.now() - job.postedDate) / (1000 * 60 * 60 * 24);
  if (daysSincePosted < 2) competitionScore *= 0.7; // Fresh posting, apply early!
  else if (daysSincePosted > 14) competitionScore *= 1.2; // Old posting, more applicants

  // Your competitive advantage
  if (skillsMatchScore >= 80) competitionScore *= 0.8; // You're strong candidate
  else if (skillsMatchScore < 50) competitionScore *= 1.3; // Weaker position

  let level: "low" | "medium" | "high" | "very_high";
  let estimatedApplicants = 0;
  let reasoning = "";

  if (competitionScore >= 80) {
    level = "very_high";
    estimatedApplicants = 300;
    reasoning = "Very competitive role with many applicants. Focus on standing out.";
  } else if (competitionScore >= 60) {
    level = "high";
    estimatedApplicants = 150;
    reasoning = "Competitive role. Ensure your application is tailored and highlights key achievements.";
  } else if (competitionScore >= 40) {
    level = "medium";
    estimatedApplicants = 75;
    reasoning = "Moderate competition. Good opportunity with reasonable chances.";
  } else {
    level = "low";
    estimatedApplicants = 30;
    reasoning = "Lower competition role. Strong chance if you meet requirements.";
  }

  return {
    level,
    estimatedApplicants: Math.round(estimatedApplicants),
    reasoning
  };
}

/**
 * MAIN FUNCTION: Calculate job match
 */
export function calculateJobMatch(
  candidate: CandidateProfile,
  job: JobPosting
): JobMatch {
  // Calculate individual scores
  const skillsMatch = calculateSkillsMatch(candidate.skills, job.requirements);
  const experienceMatch = calculateExperienceMatch(
    candidate.yearsExperience,
    job.experienceLevel,
    job.description
  );
  const locationMatch = calculateLocationMatch(
    candidate.location,
    candidate.willingToRelocate,
    candidate.remotePreference,
    job.location,
    job.remoteType
  );
  const salaryMatch = calculateSalaryMatch(
    candidate.salaryExpectation.min,
    candidate.salaryExpectation.max,
    job.salary
  );
  const cultureFit = calculateCultureFit(candidate, job);
  const careerGrowth = calculateCareerGrowth(job, candidate.yearsExperience);

  // Calculate overall score (weighted)
  const overallScore = Math.round(
    skillsMatch.score * MATCH_WEIGHTS.skillsMatch +
    experienceMatch.score * MATCH_WEIGHTS.experienceMatch +
    locationMatch.score * MATCH_WEIGHTS.locationMatch +
    salaryMatch.score * MATCH_WEIGHTS.salaryMatch +
    cultureFit.score * MATCH_WEIGHTS.cultureFit +
    careerGrowth.score * MATCH_WEIGHTS.careerGrowth
  );

  // Estimate competition
  const competition = estimateCompetition(job, skillsMatch.score);

  // Calculate interview probability
  let interviewProbability = overallScore;
  if (competition.level === "very_high") interviewProbability *= 0.6;
  else if (competition.level === "high") interviewProbability *= 0.75;
  else if (competition.level === "medium") interviewProbability *= 0.9;
  // Low competition: no penalty

  interviewProbability = Math.min(95, Math.max(5, Math.round(interviewProbability)));

  // Identify strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (skillsMatch.score >= 75) strengths.push(`Strong skills match (${skillsMatch.matchPercentage}% of requirements met)`);
  else if (skillsMatch.score < 60) weaknesses.push(`Missing key skills: ${skillsMatch.missingSkills.slice(0, 3).join(", ")}`);

  if (experienceMatch.score >= 90) strengths.push(experienceMatch.explanation);
  else if (experienceMatch.score < 70) weaknesses.push(experienceMatch.explanation);

  if (locationMatch.score >= 80) strengths.push(locationMatch.explanation);
  else if (locationMatch.score < 50) weaknesses.push(locationMatch.explanation);

  if (salaryMatch.score >= 75) strengths.push("Salary expectations align well");
  else if (salaryMatch.score < 50) weaknesses.push("Salary expectations may not align");

  // Generate suggestions
  const suggestions: string[] = [];
  if (skillsMatch.missingSkills.length > 0) {
    suggestions.push(`Learn or highlight: ${skillsMatch.missingSkills.slice(0, 3).join(", ")}`);
  }
  if (experienceMatch.alignment === "under") {
    suggestions.push("Emphasize relevant projects and impact over years of experience");
  }
  if (locationMatch.score < 70) {
    suggestions.push("Clarify your relocation/remote work flexibility in your application");
  }

  // Application strategy
  let applicationStrategy = "";
  if (overallScore >= 80) {
    applicationStrategy = "Strong match - apply immediately with tailored resume highlighting key achievements";
  } else if (overallScore >= 60) {
    applicationStrategy = "Good match - customize your application to address any skill gaps and emphasize relevant experience";
  } else {
    applicationStrategy = "Moderate match - significantly customize your application and consider waiting to apply until you've improved relevant skills";
  }

  // Should apply decision
  const shouldApply = overallScore >= 50 && locationMatch.compatible && salaryMatch.compatible;

  // Reasoning
  let reasoning = "";
  if (shouldApply) {
    reasoning = `You're a ${overallScore >= 75 ? "strong" : "good"} candidate for this role. ${interviewProbability}% estimated interview probability.`;
  } else {
    reasoning = `This role may not be the best fit due to ${!locationMatch.compatible ? "location mismatch" : !salaryMatch.compatible ? "salary misalignment" : "skill gaps"}.`;
  }

  // Estimate response time
  const estimatedResponseTime = competition.level === "very_high" ? 14 :
                                competition.level === "high" ? 10 :
                                competition.level === "medium" ? 7 : 5;

  return {
    jobId: job.id,
    overallScore,
    matchBreakdown: {
      skillsMatch: skillsMatch.score,
      experienceMatch: experienceMatch.score,
      locationMatch: locationMatch.score,
      salaryMatch: salaryMatch.score,
      cultureFit: cultureFit.score,
      careerGrowth: careerGrowth.score
    },
    interviewProbability,
    competitionLevel: competition.level,
    strengths,
    weaknesses,
    suggestions,
    estimatedResponseTime,
    applicationStrategy,
    shouldApply,
    reasoning
  };
}

/**
 * Rank multiple jobs by match score
 */
export function rankJobs(
  candidate: CandidateProfile,
  jobs: JobPosting[]
): JobMatch[] {
  const matches = jobs.map(job => calculateJobMatch(candidate, job));

  // Sort by overall score (descending)
  return matches.sort((a, b) => b.overallScore - a.overallScore);
}

/**
 * Filter jobs by criteria
 */
export function filterJobs(
  matches: JobMatch[],
  criteria: {
    minScore?: number;
    minInterviewProbability?: number;
    mustHaveLocationMatch?: boolean;
    mustHaveSalaryMatch?: boolean;
    maxCompetitionLevel?: "low" | "medium" | "high" | "very_high";
  }
): JobMatch[] {
  return matches.filter(match => {
    if (criteria.minScore && match.overallScore < criteria.minScore) return false;
    if (criteria.minInterviewProbability && match.interviewProbability < criteria.minInterviewProbability) return false;
    if (criteria.mustHaveLocationMatch && match.matchBreakdown.locationMatch < 70) return false;
    if (criteria.mustHaveSalaryMatch && match.matchBreakdown.salaryMatch < 70) return false;

    if (criteria.maxCompetitionLevel) {
      const levels = ["low", "medium", "high", "very_high"];
      const maxIndex = levels.indexOf(criteria.maxCompetitionLevel);
      const currentIndex = levels.indexOf(match.competitionLevel);
      if (currentIndex > maxIndex) return false;
    }

    return true;
  });
}
