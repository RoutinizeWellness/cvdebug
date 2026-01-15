/**
 * Advanced Scoring Engine - Beyond Jobscan
 *
 * Implements sophisticated scoring algorithms that consider:
 * - Contextual relevance
 * - Semantic similarity
 * - Industry-specific weighting
 * - Temporal analysis (recent vs outdated skills)
 * - Skill clustering and relationships
 * - Achievement quality scoring
 */

import { v } from "convex/values";

// ==================== SEMANTIC SIMILARITY SCORING ====================

export interface SemanticMatch {
  score: number; // 0-100
  confidence: number; // 0-1
  reasoning: string;
  alternatives: string[];
}

/**
 * Calculate semantic similarity between resume content and job requirements
 * Uses advanced NLP concepts without external APIs
 */
export function calculateSemanticSimilarity(
  resumeText: string,
  jobDescription: string
): SemanticMatch {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();

  // Extract key phrases (n-grams)
  const resumePhrases = extractKeyPhrases(resumeLower);
  const jobPhrases = extractKeyPhrases(jobLower);

  // Calculate overlap with synonym awareness
  let matchCount = 0;
  let totalWeight = 0;
  const alternatives: string[] = [];

  for (const jobPhrase of jobPhrases) {
    const weight = getPhraseWeight(jobPhrase);
    totalWeight += weight;

    // Direct match
    if (resumePhrases.has(jobPhrase)) {
      matchCount += weight;
      continue;
    }

    // Synonym match
    const synonyms = getSynonyms(jobPhrase);
    const hasSymonym = synonyms.some(syn => resumePhrases.has(syn));
    if (hasSymonym) {
      matchCount += weight * 0.8; // 80% credit for synonyms
      continue;
    }

    // Related concept match
    const related = getRelatedConcepts(jobPhrase);
    const hasRelated = related.some(rel => resumePhrases.has(rel));
    if (hasRelated) {
      matchCount += weight * 0.5; // 50% credit for related concepts
    } else {
      alternatives.push(jobPhrase);
    }
  }

  const score = totalWeight > 0 ? Math.round((matchCount / totalWeight) * 100) : 0;
  const confidence = Math.min(1, jobPhrases.size / 20); // More phrases = higher confidence

  let reasoning = '';
  if (score >= 80) {
    reasoning = 'Excellent alignment with job requirements. Resume demonstrates strong match.';
  } else if (score >= 60) {
    reasoning = 'Good match with some gaps. Consider adding missing key skills.';
  } else if (score >= 40) {
    reasoning = 'Moderate alignment. Significant opportunities to improve keyword coverage.';
  } else {
    reasoning = 'Limited match detected. Resume needs substantial optimization for this role.';
  }

  return {
    score,
    confidence,
    reasoning,
    alternatives: alternatives.slice(0, 10),
  };
}

function extractKeyPhrases(text: string): Set<string> {
  const phrases = new Set<string>();

  // 1-grams (single words)
  const words = text.split(/\s+/).filter(w => w.length > 3);
  words.forEach(w => phrases.add(w));

  // 2-grams (two-word phrases)
  for (let i = 0; i < words.length - 1; i++) {
    phrases.add(`${words[i]} ${words[i + 1]}`);
  }

  // 3-grams (three-word phrases)
  for (let i = 0; i < words.length - 2; i++) {
    phrases.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  return phrases;
}

function getPhraseWeight(phrase: string): number {
  // Technical terms get higher weight
  const technicalPatterns = /(?:engineer|developer|architect|manager|lead|senior|principal|api|database|cloud|devops|ml|ai)/i;
  if (technicalPatterns.test(phrase)) return 2;

  // Multi-word phrases get medium weight
  if (phrase.split(' ').length > 1) return 1.5;

  // Single words get base weight
  return 1;
}

function getSynonyms(phrase: string): string[] {
  const synonymMap: Record<string, string[]> = {
    'frontend': ['front-end', 'front end', 'ui', 'client-side'],
    'backend': ['back-end', 'back end', 'server-side', 'api'],
    'fullstack': ['full-stack', 'full stack'],
    'javascript': ['js', 'ecmascript'],
    'typescript': ['ts'],
    'kubernetes': ['k8s', 'container orchestration'],
    'devops': ['dev ops', 'site reliability'],
    'machine learning': ['ml', 'predictive modeling'],
    'deep learning': ['dl', 'neural networks'],
    'database': ['db', 'data storage'],
  };

  return synonymMap[phrase] || [];
}

function getRelatedConcepts(phrase: string): string[] {
  const relatedMap: Record<string, string[]> = {
    'react': ['javascript', 'frontend', 'jsx', 'components'],
    'node': ['javascript', 'backend', 'express', 'npm'],
    'python': ['django', 'flask', 'pandas', 'data'],
    'aws': ['cloud', 'ec2', 's3', 'lambda', 'devops'],
    'docker': ['container', 'kubernetes', 'devops'],
    'sql': ['database', 'query', 'postgresql', 'mysql'],
  };

  return relatedMap[phrase] || [];
}

// ==================== ACHIEVEMENT QUALITY SCORING ====================

export interface AchievementScore {
  score: number; // 0-100
  level: 'basic' | 'good' | 'strong' | 'exceptional';
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

/**
 * Score the quality of achievement bullet points
 * Considers: Action verbs, metrics, impact, specificity, clarity
 */
export function scoreAchievementQuality(bulletPoints: string[]): AchievementScore {
  let totalScore = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  for (const bullet of bulletPoints) {
    const bulletScore = scoreSingleBullet(bullet);
    totalScore += bulletScore.score;

    if (bulletScore.hasActionVerb) strengths.push('Uses strong action verbs');
    else weaknesses.push('Missing action verbs');

    if (bulletScore.hasMetrics) strengths.push('Includes quantifiable metrics');
    else weaknesses.push('Lacks quantifiable results');

    if (bulletScore.hasImpact) strengths.push('Demonstrates business impact');
    else weaknesses.push('Impact not clearly stated');

    if (bulletScore.isSpecific) strengths.push('Specific and detailed');
    else weaknesses.push('Too vague or general');
  }

  const avgScore = bulletPoints.length > 0 ? totalScore / bulletPoints.length : 0;

  // Generate suggestions
  if (weaknesses.includes('Missing action verbs')) {
    suggestions.push('Start each bullet with strong action verbs (Led, Built, Improved, Reduced, Increased)');
  }
  if (weaknesses.includes('Lacks quantifiable results')) {
    suggestions.push('Add numbers, percentages, or metrics to quantify your impact');
  }
  if (weaknesses.includes('Impact not clearly stated')) {
    suggestions.push('Connect your actions to business outcomes (revenue, efficiency, quality)');
  }
  if (weaknesses.includes('Too vague or general')) {
    suggestions.push('Be more specific about technologies, scale, and context');
  }

  const level: 'basic' | 'good' | 'strong' | 'exceptional' =
    avgScore >= 80 ? 'exceptional' :
    avgScore >= 65 ? 'strong' :
    avgScore >= 50 ? 'good' :
    'basic';

  // Deduplicate
  const uniqueStrengths = [...new Set(strengths)];
  const uniqueWeaknesses = [...new Set(weaknesses)];

  return {
    score: Math.round(avgScore),
    level,
    strengths: uniqueStrengths.slice(0, 5),
    weaknesses: uniqueWeaknesses.slice(0, 5),
    suggestions: suggestions.slice(0, 5),
  };
}

function scoreSingleBullet(bullet: string): {
  score: number;
  hasActionVerb: boolean;
  hasMetrics: boolean;
  hasImpact: boolean;
  isSpecific: boolean;
} {
  let score = 0;

  // Check for action verb (20 points)
  const actionVerbs = /^(led|built|developed|created|implemented|designed|managed|improved|increased|reduced|optimized|launched|established|achieved|delivered|coordinated|analyzed|architected|deployed|automated|streamlined|enhanced|drove|executed|generated|spearheaded)/i;
  const hasActionVerb = actionVerbs.test(bullet.trim());
  if (hasActionVerb) score += 20;

  // Check for metrics (30 points)
  const metricPatterns = [
    /\d+%/,
    /\$[\d,]+/,
    /\d+x/,
    /\d+[\d,]*\s*(?:users|customers|revenue|million|thousand)/i,
  ];
  const hasMetrics = metricPatterns.some(p => p.test(bullet));
  if (hasMetrics) score += 30;

  // Check for impact indicators (25 points)
  const impactWords = /(?:improved|increased|reduced|saved|generated|boosted|accelerated|enhanced|grew|achieved|exceeded)/i;
  const hasImpact = impactWords.test(bullet);
  if (hasImpact) score += 25;

  // Check for specificity (25 points)
  const hasTools = /(?:using|with|via|through|leveraging)\s+[A-Z]/i.test(bullet);
  const hasContext = bullet.length > 80; // Longer bullets tend to be more specific
  const isSpecific = hasTools || hasContext;
  if (isSpecific) score += 25;

  return {
    score,
    hasActionVerb,
    hasMetrics,
    hasImpact,
    isSpecific,
  };
}

// ==================== SKILL RECENCY & RELEVANCE ====================

export interface SkillRelevance {
  skill: string;
  relevanceScore: number; // 0-100
  recency: 'current' | 'recent' | 'outdated' | 'legacy';
  demandLevel: 'high' | 'medium' | 'low';
  reasoning: string;
}

/**
 * Analyze skill relevance based on industry trends and recency
 */
export function analyzeSkillRelevance(skills: string[], industry: string = 'software'): SkillRelevance[] {
  return skills.map(skill => {
    const relevance = calculateSkillRelevance(skill, industry);
    return relevance;
  });
}

function calculateSkillRelevance(skill: string, industry: string): SkillRelevance {
  const skillLower = skill.toLowerCase();

  // Current high-demand skills (2024-2026)
  const currentHighDemand = [
    'react', 'typescript', 'python', 'kubernetes', 'aws', 'azure', 'gcp',
    'docker', 'terraform', 'graphql', 'next.js', 'node.js', 'postgresql',
    'machine learning', 'ai', 'llm', 'generative ai', 'mlops', 'data engineering',
  ];

  // Recent medium-demand skills
  const recentMediumDemand = [
    'angular', 'vue', 'java', 'c#', 'ruby', 'php', 'mysql', 'mongodb',
    'jenkins', 'gitlab', 'redis', 'elasticsearch', 'kafka', 'spark',
  ];

  // Outdated/declining skills
  const outdatedSkills = [
    'jquery', 'backbone', 'grunt', 'bower', 'coffeescript', 'flash',
    'silverlight', 'asp.net webforms', 'perl', 'jsp',
  ];

  let relevanceScore = 50; // Base score
  let recency: 'current' | 'recent' | 'outdated' | 'legacy' = 'recent';
  let demandLevel: 'high' | 'medium' | 'low' = 'medium';
  let reasoning = '';

  // Check if current high-demand
  if (currentHighDemand.some(s => skillLower.includes(s))) {
    relevanceScore = 95;
    recency = 'current';
    demandLevel = 'high';
    reasoning = 'Highly sought-after skill in current job market. Strong demand across industries.';
  }
  // Check if recent medium-demand
  else if (recentMediumDemand.some(s => skillLower.includes(s))) {
    relevanceScore = 75;
    recency = 'recent';
    demandLevel = 'medium';
    reasoning = 'Solid skill with consistent market demand. Still widely used in production.';
  }
  // Check if outdated
  else if (outdatedSkills.some(s => skillLower.includes(s))) {
    relevanceScore = 30;
    recency = 'outdated';
    demandLevel = 'low';
    reasoning = 'Declining market demand. Consider learning modern alternatives.';
  }
  // Default for unlisted skills
  else {
    relevanceScore = 60;
    recency = 'recent';
    demandLevel = 'medium';
    reasoning = 'Relevant skill with moderate market presence.';
  }

  return {
    skill,
    relevanceScore,
    recency,
    demandLevel,
    reasoning,
  };
}

// ==================== COMPREHENSIVE RESUME SCORING ====================

export interface ComprehensiveScore {
  overallScore: number; // 0-100
  componentScores: {
    keywordMatch: number;
    achievementQuality: number;
    skillRelevance: number;
    impactMetrics: number;
    atsCompatibility: number;
    semanticAlignment: number;
  };
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  percentile: number; // Estimated percentile vs other candidates
  strengths: string[];
  criticalIssues: string[];
  quickWins: string[]; // Easy improvements with high impact
  estimatedATSPassRate: number; // Probability of passing ATS screening
}

/**
 * Calculate comprehensive resume score combining all factors
 */
export function calculateComprehensiveScore(
  keywordScore: number,
  achievementQuality: AchievementScore,
  skillRelevance: SkillRelevance[],
  impactMetricsCount: number,
  atsCompatibilityScore: number,
  semanticMatch: SemanticMatch
): ComprehensiveScore {
  // Component scores
  const componentScores = {
    keywordMatch: keywordScore,
    achievementQuality: achievementQuality.score,
    skillRelevance: calculateAvgSkillRelevance(skillRelevance),
    impactMetrics: Math.min(100, (impactMetricsCount / 15) * 100), // 15+ metrics = 100
    atsCompatibility: atsCompatibilityScore,
    semanticAlignment: semanticMatch.score,
  };

  // Weighted overall score
  const overallScore = Math.round(
    componentScores.keywordMatch * 0.25 +
    componentScores.achievementQuality * 0.20 +
    componentScores.skillRelevance * 0.15 +
    componentScores.impactMetrics * 0.15 +
    componentScores.atsCompatibility * 0.15 +
    componentScores.semanticAlignment * 0.10
  );

  // Grade assignment
  const grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' =
    overallScore >= 95 ? 'A+' :
    overallScore >= 90 ? 'A' :
    overallScore >= 85 ? 'B+' :
    overallScore >= 80 ? 'B' :
    overallScore >= 75 ? 'C+' :
    overallScore >= 70 ? 'C' :
    overallScore >= 60 ? 'D' :
    'F';

  // Percentile estimation
  const percentile = Math.round(overallScore * 0.95); // Rough estimation

  // Identify strengths
  const strengths: string[] = [];
  if (componentScores.keywordMatch >= 80) strengths.push('Strong keyword optimization');
  if (componentScores.achievementQuality >= 80) strengths.push('High-quality achievements');
  if (componentScores.skillRelevance >= 80) strengths.push('Highly relevant skills');
  if (componentScores.impactMetrics >= 80) strengths.push('Excellent impact metrics');
  if (componentScores.atsCompatibility >= 85) strengths.push('ATS-friendly format');
  if (componentScores.semanticAlignment >= 75) strengths.push('Well-aligned with job requirements');

  // Identify critical issues
  const criticalIssues: string[] = [];
  if (componentScores.keywordMatch < 50) criticalIssues.push('⚠️ CRITICAL: Low keyword match - resume may not pass ATS screening');
  if (componentScores.achievementQuality < 40) criticalIssues.push('⚠️ CRITICAL: Weak achievement descriptions - add metrics and impact');
  if (componentScores.impactMetrics < 30) criticalIssues.push('⚠️ CRITICAL: Very few quantifiable results - add numbers and percentages');
  if (componentScores.atsCompatibility < 60) criticalIssues.push('⚠️ CRITICAL: Poor ATS compatibility - fix formatting issues');

  // Quick wins (high-impact, easy improvements)
  const quickWins: string[] = [];
  if (componentScores.keywordMatch >= 60 && componentScores.keywordMatch < 80) {
    quickWins.push('💡 Add 3-5 missing keywords from job description → +10-15 points');
  }
  if (componentScores.impactMetrics >= 30 && componentScores.impactMetrics < 60) {
    quickWins.push('💡 Add 5 more quantifiable metrics to bullet points → +10 points');
  }
  if (componentScores.achievementQuality >= 50 && componentScores.achievementQuality < 75) {
    quickWins.push('💡 Start 3 more bullets with strong action verbs → +5-8 points');
  }

  // Estimate ATS pass rate
  const estimatedATSPassRate = Math.round(
    Math.min(100, componentScores.keywordMatch * 0.6 + componentScores.atsCompatibility * 0.4)
  );

  return {
    overallScore,
    componentScores,
    grade,
    percentile,
    strengths,
    criticalIssues,
    quickWins,
    estimatedATSPassRate,
  };
}

function calculateAvgSkillRelevance(skills: SkillRelevance[]): number {
  if (skills.length === 0) return 0;
  const sum = skills.reduce((acc, s) => acc + s.relevanceScore, 0);
  return Math.round(sum / skills.length);
}

// ==================== COMPETITIVE ANALYSIS ====================

export interface CompetitiveAnalysis {
  yourScore: number;
  estimatedCompetitorAverage: number;
  percentileRank: number;
  competitiveAdvantages: string[];
  vulnerabilities: string[];
  mustHaveImprovements: string[];
  estimatedCallbackProbability: number; // 0-100
}

/**
 * Analyze how resume compares to competition
 */
export function analyzeCompetitivePosition(
  comprehensiveScore: ComprehensiveScore,
  jobLevel: 'junior' | 'mid' | 'senior' | 'principal'
): CompetitiveAnalysis {
  // Estimated competitor averages by level
  const competitorAverages = {
    junior: 65,
    mid: 72,
    senior: 78,
    principal: 82,
  };

  const estimatedCompetitorAverage = competitorAverages[jobLevel];
  const scoreDiff = comprehensiveScore.overallScore - estimatedCompetitorAverage;

  const competitiveAdvantages: string[] = [];
  const vulnerabilities: string[] = [];
  const mustHaveImprovements: string[] = [];

  // Identify advantages
  if (comprehensiveScore.componentScores.keywordMatch > estimatedCompetitorAverage + 10) {
    competitiveAdvantages.push('Superior keyword optimization vs average candidate');
  }
  if (comprehensiveScore.componentScores.impactMetrics > 70) {
    competitiveAdvantages.push('Strong quantifiable achievements stand out');
  }
  if (comprehensiveScore.componentScores.skillRelevance > 85) {
    competitiveAdvantages.push('Highly relevant modern skill set');
  }

  // Identify vulnerabilities
  if (comprehensiveScore.componentScores.keywordMatch < estimatedCompetitorAverage) {
    vulnerabilities.push('Keyword match below average - competitors may rank higher in ATS');
  }
  if (comprehensiveScore.componentScores.achievementQuality < 60) {
    vulnerabilities.push('Achievement descriptions weaker than typical candidates');
  }
  if (comprehensiveScore.componentScores.impactMetrics < 50) {
    vulnerabilities.push('Fewer metrics than competitors - less impressive at first glance');
  }

  // Must-have improvements to be competitive
  if (comprehensiveScore.overallScore < estimatedCompetitorAverage) {
    mustHaveImprovements.push(`Boost overall score by ${Math.ceil(estimatedCompetitorAverage - comprehensiveScore.overallScore)} points to match average candidate`);
  }
  if (comprehensiveScore.estimatedATSPassRate < 70) {
    mustHaveImprovements.push('Critical: Improve ATS pass rate to avoid being filtered out before human review');
  }

  // Estimate callback probability
  let callbackProbability = 30; // Base rate
  if (scoreDiff > 15) callbackProbability = 85;
  else if (scoreDiff > 10) callbackProbability = 75;
  else if (scoreDiff > 5) callbackProbability = 60;
  else if (scoreDiff > 0) callbackProbability = 50;
  else if (scoreDiff > -5) callbackProbability = 40;

  // Adjust for ATS pass rate
  callbackProbability = Math.round(callbackProbability * (comprehensiveScore.estimatedATSPassRate / 100));

  return {
    yourScore: comprehensiveScore.overallScore,
    estimatedCompetitorAverage,
    percentileRank: comprehensiveScore.percentile,
    competitiveAdvantages,
    vulnerabilities,
    mustHaveImprovements,
    estimatedCallbackProbability: Math.min(95, callbackProbability),
  };
}
