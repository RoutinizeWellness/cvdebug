/**
 * Industry-Specific Scoring Models
 *
 * Different industries value different things:
 * - Tech: Technical skills, GitHub, projects
 * - Finance: Certifications, compliance, quantitative results
 * - Healthcare: Licenses, patient outcomes, certifications
 * - Marketing: Campaigns, metrics, creative portfolio
 *
 * Jobscan uses one-size-fits-all scoring ❌
 * CVDebug adapts scoring to industry context ✅
 */

export type Industry =
  | "Technology"
  | "Finance"
  | "Healthcare"
  | "Marketing"
  | "Consulting"
  | "Engineering"
  | "Education"
  | "Retail"
  | "Manufacturing"
  | "General";

export interface IndustryWeights {
  keywords: number;          // Importance of keyword matching
  metrics: number;           // Importance of quantifiable results
  certifications: number;    // Importance of licenses/certs
  education: number;         // Importance of degrees
  experience: number;        // Importance of years of experience
  technicalSkills: number;   // Importance of hard skills
  softSkills: number;        // Importance of soft skills
  actionVerbs: number;       // Importance of strong action verbs
  formatting: number;        // Importance of ATS-friendly format
}

export interface IndustryModel {
  industry: Industry;
  weights: IndustryWeights;
  criticalKeywords: string[];
  preferredMetrics: string[];
  redFlags: string[];
  bonusFactors: string[];
  description: string;
}

/**
 * Industry-specific scoring models
 * Each model is tuned based on what recruiters in that industry prioritize
 */
export const INDUSTRY_MODELS: Record<Industry, IndustryModel> = {
  Technology: {
    industry: "Technology",
    weights: {
      keywords: 0.25,        // Very important - tech stack matters
      metrics: 0.20,         // Important - scale, performance
      certifications: 0.10,  // Moderate - AWS, etc.
      education: 0.08,       // Less important - skills > degrees
      experience: 0.12,      // Important but not critical
      technicalSkills: 0.15, // VERY important
      softSkills: 0.05,      // Less emphasized
      actionVerbs: 0.03,     // Less critical
      formatting: 0.02       // Least important for tech
    },
    criticalKeywords: [
      "javascript", "python", "react", "node.js", "aws", "docker", "kubernetes",
      "api", "microservices", "ci/cd", "git", "sql", "nosql", "rest", "graphql"
    ],
    preferredMetrics: [
      "latency reduction", "throughput increase", "uptime percentage",
      "user growth", "system scale", "code coverage", "deployment frequency"
    ],
    redFlags: [
      "no github/portfolio", "outdated tech stack", "no version control mention",
      "no quantifiable impact", "buzzwords without substance"
    ],
    bonusFactors: [
      "open source contributions", "technical blog", "github stars",
      "conference talks", "side projects", "hackathon wins"
    ],
    description: "Tech industry values hands-on skills, modern tech stack, and measurable impact over credentials"
  },

  Finance: {
    industry: "Finance",
    weights: {
      keywords: 0.18,
      metrics: 0.25,         // VERY important - ROI, revenue, cost savings
      certifications: 0.20,  // Critical - CFA, CPA, Series 7, etc.
      education: 0.15,       // Important - MBA, target schools
      experience: 0.10,
      technicalSkills: 0.05,
      softSkills: 0.05,
      actionVerbs: 0.01,
      formatting: 0.01
    },
    criticalKeywords: [
      "financial modeling", "valuation", "dcf", "excel", "bloomberg",
      "risk management", "portfolio", "m&a", "due diligence", "compliance",
      "sox", "gaap", "ifrs", "derivatives", "trading"
    ],
    preferredMetrics: [
      "revenue generated", "cost savings", "roi percentage", "aum growth",
      "deal size", "portfolio performance", "risk reduction"
    ],
    redFlags: [
      "no quantifiable financial results", "missing certifications",
      "vague responsibilities", "no compliance knowledge", "poor formatting"
    ],
    bonusFactors: [
      "ivy league mba", "cfa charter", "cpa license", "series 7/63",
      "bulge bracket experience", "published research"
    ],
    description: "Finance demands precision, credentials, and quantifiable business impact"
  },

  Healthcare: {
    industry: "Healthcare",
    weights: {
      keywords: 0.15,
      metrics: 0.20,         // Patient outcomes, cost savings
      certifications: 0.30,  // CRITICAL - licenses, ACLS, BLS, etc.
      education: 0.15,       // Important - medical degrees
      experience: 0.10,
      technicalSkills: 0.05,
      softSkills: 0.03,
      actionVerbs: 0.01,
      formatting: 0.01
    },
    criticalKeywords: [
      "patient care", "emr", "epic", "cerner", "hipaa", "clinical",
      "diagnosis", "treatment", "protocol", "quality improvement",
      "acls", "bls", "pals", "rn", "md", "np", "pa"
    ],
    preferredMetrics: [
      "patient satisfaction scores", "readmission reduction",
      "treatment outcomes", "cost per patient", "quality metrics",
      "infection rate reduction", "wait time improvement"
    ],
    redFlags: [
      "expired licenses", "no current certifications", "hipaa violations",
      "no patient outcome metrics", "gaps in clinical experience"
    ],
    bonusFactors: [
      "board certification", "fellowship", "research publications",
      "teaching experience", "leadership in quality initiatives"
    ],
    description: "Healthcare prioritizes licenses, patient outcomes, and compliance over everything"
  },

  Marketing: {
    industry: "Marketing",
    weights: {
      keywords: 0.20,
      metrics: 0.30,         // VERY important - ROI, conversions, growth
      certifications: 0.05,  // Less important
      education: 0.05,
      experience: 0.15,
      technicalSkills: 0.10,
      softSkills: 0.10,      // More important - creativity, communication
      actionVerbs: 0.04,
      formatting: 0.01
    },
    criticalKeywords: [
      "seo", "sem", "google analytics", "facebook ads", "content marketing",
      "email marketing", "conversion rate", "cro", "a/b testing",
      "social media", "brand strategy", "campaign", "roi", "cac", "ltv"
    ],
    preferredMetrics: [
      "roi percentage", "conversion rate improvement", "cac reduction",
      "engagement increase", "revenue attributed", "lead generation",
      "brand awareness growth", "email open rates"
    ],
    redFlags: [
      "no quantifiable campaign results", "no digital marketing experience",
      "outdated tactics", "no analytics mention", "vague achievements"
    ],
    bonusFactors: [
      "portfolio of campaigns", "case studies", "viral campaigns",
      "industry awards", "speaking engagements", "published content"
    ],
    description: "Marketing values creative impact backed by data-driven results"
  },

  Consulting: {
    industry: "Consulting",
    weights: {
      keywords: 0.15,
      metrics: 0.25,
      certifications: 0.10,
      education: 0.20,       // Very important - target schools
      experience: 0.15,
      technicalSkills: 0.05,
      softSkills: 0.08,      // Important - client management
      actionVerbs: 0.01,
      formatting: 0.01
    },
    criticalKeywords: [
      "strategy", "transformation", "change management", "stakeholder",
      "executive", "business case", "roi", "implementation",
      "project management", "client facing", "presentation", "analysis"
    ],
    preferredMetrics: [
      "cost savings delivered", "revenue growth enabled",
      "efficiency improvement", "client satisfaction", "project value",
      "transformation impact", "strategic initiatives"
    ],
    redFlags: [
      "no client-facing experience", "weak business impact",
      "poor communication skills", "no quantifiable results"
    ],
    bonusFactors: [
      "mbb experience", "top mba", "case competition wins",
      "executive presentations", "published thought leadership"
    ],
    description: "Consulting emphasizes business impact, education, and client management"
  },

  Engineering: {
    industry: "Engineering",
    weights: {
      keywords: 0.20,
      metrics: 0.20,
      certifications: 0.15,  // PE license, etc.
      education: 0.15,       // Engineering degrees
      experience: 0.15,
      technicalSkills: 0.10,
      softSkills: 0.03,
      actionVerbs: 0.01,
      formatting: 0.01
    },
    criticalKeywords: [
      "autocad", "revit", "solidworks", "fea", "cad", "structural",
      "mechanical", "electrical", "civil", "design", "analysis",
      "pe license", "eit", "leed", "codes", "standards"
    ],
    preferredMetrics: [
      "project value", "cost savings", "efficiency improvement",
      "safety record", "on-time delivery", "budget performance"
    ],
    redFlags: [
      "no pe license (for senior roles)", "no cad proficiency",
      "safety violations", "project failures", "no design experience"
    ],
    bonusFactors: [
      "pe license", "multiple discipline experience",
      "complex project leadership", "patents", "published papers"
    ],
    description: "Engineering values technical proficiency, licensure, and project success"
  },

  Education: {
    industry: "Education",
    weights: {
      keywords: 0.15,
      metrics: 0.15,
      certifications: 0.25,  // Teaching licenses critical
      education: 0.20,       // Advanced degrees valued
      experience: 0.15,
      technicalSkills: 0.03,
      softSkills: 0.05,
      actionVerbs: 0.01,
      formatting: 0.01
    },
    criticalKeywords: [
      "curriculum", "lesson planning", "assessment", "differentiation",
      "classroom management", "student outcomes", "pedagogy",
      "special education", "iep", "common core", "state standards"
    ],
    preferredMetrics: [
      "student achievement scores", "graduation rate improvement",
      "test score gains", "parent satisfaction", "retention rates"
    ],
    redFlags: [
      "expired teaching license", "no classroom experience",
      "weak student outcomes", "disciplinary issues"
    ],
    bonusFactors: [
      "national board certification", "ed.d/ph.d", "grants awarded",
      "curriculum development", "teacher of the year"
    ],
    description: "Education prioritizes licensure, student outcomes, and pedagogical expertise"
  },

  Retail: {
    industry: "Retail",
    weights: {
      keywords: 0.15,
      metrics: 0.30,         // Sales numbers critical
      certifications: 0.03,
      education: 0.05,
      experience: 0.20,      // Relevant experience valued
      technicalSkills: 0.08,
      softSkills: 0.15,      // Customer service critical
      actionVerbs: 0.03,
      formatting: 0.01
    },
    criticalKeywords: [
      "sales", "revenue", "customer service", "merchandising",
      "inventory", "pos", "kpi", "conversion", "upselling",
      "team leadership", "store operations", "visual merchandising"
    ],
    preferredMetrics: [
      "sales growth percentage", "revenue targets exceeded",
      "customer satisfaction scores", "conversion rate",
      "average transaction value", "inventory turnover"
    ],
    redFlags: [
      "no sales metrics", "poor customer service record",
      "inventory shrinkage", "missed targets consistently"
    ],
    bonusFactors: [
      "consistent top performer", "store opening experience",
      "multi-location management", "turnaround success"
    ],
    description: "Retail values sales performance, customer service, and operational excellence"
  },

  Manufacturing: {
    industry: "Manufacturing",
    weights: {
      keywords: 0.18,
      metrics: 0.25,         // Efficiency, quality metrics
      certifications: 0.15,  // Six Sigma, Lean, etc.
      education: 0.10,
      experience: 0.18,
      technicalSkills: 0.08,
      softSkills: 0.04,
      actionVerbs: 0.01,
      formatting: 0.01
    },
    criticalKeywords: [
      "lean manufacturing", "six sigma", "continuous improvement",
      "quality control", "iso", "5s", "kaizen", "tpm",
      "production", "efficiency", "yield", "oee", "supply chain"
    ],
    preferredMetrics: [
      "efficiency improvement", "defect rate reduction",
      "cost per unit", "oee percentage", "yield improvement",
      "downtime reduction", "inventory optimization"
    ],
    redFlags: [
      "no lean/six sigma knowledge", "poor quality metrics",
      "safety incidents", "no process improvement experience"
    ],
    bonusFactors: [
      "six sigma black belt", "lean certification",
      "plant turnaround success", "zero defect initiatives"
    ],
    description: "Manufacturing emphasizes efficiency, quality, and continuous improvement"
  },

  General: {
    industry: "General",
    weights: {
      keywords: 0.20,
      metrics: 0.20,
      certifications: 0.10,
      education: 0.10,
      experience: 0.15,
      technicalSkills: 0.10,
      softSkills: 0.10,
      actionVerbs: 0.03,
      formatting: 0.02
    },
    criticalKeywords: [],
    preferredMetrics: [
      "percentage improvements", "cost savings", "revenue growth",
      "efficiency gains", "project completion", "team productivity"
    ],
    redFlags: [
      "no quantifiable results", "vague responsibilities",
      "poor formatting", "typos", "inconsistent dates"
    ],
    bonusFactors: [
      "leadership experience", "cross-functional work",
      "awards and recognition", "published work"
    ],
    description: "Balanced scoring for roles that don't fit specific industries"
  }
};

/**
 * Detect industry from job description or resume
 */
export function detectIndustry(text: string): Industry {
  const textLower = text.toLowerCase();
  const industryScores: Partial<Record<Industry, number>> = {};

  // Score each industry based on keyword presence
  for (const [industry, model] of Object.entries(INDUSTRY_MODELS)) {
    let score = 0;

    for (const keyword of model.criticalKeywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > 0) {
      industryScores[industry as Industry] = score;
    }
  }

  // Return industry with highest score, or "General" if none
  const entries = Object.entries(industryScores);
  if (entries.length === 0) return "General";

  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0] as Industry;
}

/**
 * Calculate industry-adjusted score
 */
export function calculateIndustryScore(
  baseScores: {
    keywords: number;
    metrics: number;
    certifications: number;
    education: number;
    experience: number;
    technicalSkills: number;
    softSkills: number;
    actionVerbs: number;
    formatting: number;
  },
  industry: Industry
): {
  totalScore: number;
  breakdown: Record<string, { weight: number; score: number; weightedScore: number }>;
  industryFit: "excellent" | "good" | "fair" | "poor";
} {
  const model = INDUSTRY_MODELS[industry];
  const breakdown: Record<string, { weight: number; score: number; weightedScore: number }> = {};

  let totalScore = 0;

  // Calculate weighted scores
  for (const [component, weight] of Object.entries(model.weights)) {
    const score = baseScores[component as keyof typeof baseScores] || 0;
    const weightedScore = score * weight;
    totalScore += weightedScore;

    breakdown[component] = {
      weight,
      score,
      weightedScore: Math.round(weightedScore * 10) / 10
    };
  }

  // Determine industry fit
  let industryFit: "excellent" | "good" | "fair" | "poor";
  if (totalScore >= 85) industryFit = "excellent";
  else if (totalScore >= 70) industryFit = "good";
  else if (totalScore >= 55) industryFit = "fair";
  else industryFit = "poor";

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    breakdown,
    industryFit
  };
}

/**
 * Get industry-specific recommendations
 */
export function getIndustryRecommendations(
  industry: Industry,
  currentScores: {
    keywords: number;
    metrics: number;
    certifications: number;
  }
): string[] {
  const model = INDUSTRY_MODELS[industry];
  const recommendations: string[] = [];

  // Check critical factors for this industry
  if (model.weights.certifications >= 0.15 && currentScores.certifications < 50) {
    recommendations.push(
      `${industry} highly values certifications - consider adding: ${model.criticalKeywords.filter(k => k.includes('certified') || k.includes('license')).slice(0, 3).join(', ')}`
    );
  }

  if (model.weights.metrics >= 0.20 && currentScores.metrics < 60) {
    recommendations.push(
      `Add quantifiable results using metrics relevant to ${industry}: ${model.preferredMetrics.slice(0, 3).join(', ')}`
    );
  }

  if (currentScores.keywords < 70) {
    recommendations.push(
      `Include more ${industry}-specific keywords: ${model.criticalKeywords.slice(0, 5).join(', ')}`
    );
  }

  // Add industry-specific bonus recommendations
  if (model.bonusFactors.length > 0) {
    recommendations.push(
      `Stand out with: ${model.bonusFactors.slice(0, 3).join(', ')}`
    );
  }

  return recommendations;
}
