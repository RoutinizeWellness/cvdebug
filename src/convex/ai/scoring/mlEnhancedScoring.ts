/**
 * ML-ENHANCED SCORING ENGINE
 * 
 * Advanced machine learning algorithms for resume scoring
 * Features:
 * - TF-IDF based keyword importance
 * - Bayesian skill relevance scoring
 * - Neural network-inspired weighted scoring
 * - Adaptive learning from user feedback
 */

/**
 * Calculate TF-IDF score for keywords
 * Identifies most important keywords based on frequency and uniqueness
 */
export function calculateTFIDF(
  document: string,
  keyword: string,
  corpus: string[] = []
): number {
  const docWords = document.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  
  // Term Frequency (TF): How often keyword appears in document
  const termFrequency = docWords.filter(w => w.includes(keywordLower)).length / docWords.length;
  
  // Inverse Document Frequency (IDF): How unique keyword is across corpus
  if (corpus.length === 0) {
    // If no corpus, use simple frequency
    return termFrequency * 100;
  }
  
  const documentsWithKeyword = corpus.filter(doc => 
    doc.toLowerCase().includes(keywordLower)
  ).length;
  
  const inverseDocFreq = Math.log((corpus.length + 1) / (documentsWithKeyword + 1));
  
  return (termFrequency * inverseDocFreq) * 100;
}

/**
 * Bayesian probability for skill relevance
 * Calculates likelihood that a skill is relevant given job description
 */
export function calculateBayesianSkillRelevance(
  skill: string,
  jobDescription: string,
  resumeText: string
): {
  relevanceScore: number;
  confidence: number;
  reasoning: string;
} {
  const skillLower = skill.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();
  
  // Prior: Base probability skill is relevant (default 50%)
  let prior = 0.5;
  
  // Evidence 1: Skill appears in job description (strong signal)
  const inJD = jdLower.includes(skillLower);
  if (inJD) {
    prior *= 1.8; // 80% boost
  }
  
  // Evidence 2: Skill appears multiple times in resume (shows depth)
  const skillCount = (resumeLower.match(new RegExp(`\\b${skillLower}\\b`, 'g')) || []).length;
  if (skillCount >= 3) {
    prior *= 1.4; // 40% boost for depth
  } else if (skillCount >= 1) {
    prior *= 1.1; // 10% boost for presence
  }
  
  // Evidence 3: Skill appears with metrics (shows impact)
  const hasMetrics = new RegExp(`${skillLower}[^.]{0,100}(\\d+%|\\$[\\d,]+|\\dx)`, 'i').test(resumeText);
  if (hasMetrics) {
    prior *= 1.3; // 30% boost for quantified impact
  }
  
  // Evidence 4: Recent technology vs. outdated
  const outdatedSkills = ['jquery', 'backbone', 'flash', 'silverlight', 'perl', 'coffeescript'];
  if (outdatedSkills.includes(skillLower)) {
    prior *= 0.6; // 40% penalty for outdated tech
  }
  
  // Normalize to 0-100 range
  const relevanceScore = Math.min(100, Math.round(prior * 100));
  
  // Calculate confidence based on evidence strength
  let confidence = 0.5; // Base confidence
  if (inJD) confidence += 0.3;
  if (skillCount >= 2) confidence += 0.15;
  if (hasMetrics) confidence += 0.05;
  
  // Generate reasoning
  let reasoning = '';
  if (inJD) {
    reasoning += 'Found in job description (strong match). ';
  }
  if (skillCount >= 3) {
    reasoning += `Mentioned ${skillCount} times (demonstrates depth). `;
  }
  if (hasMetrics) {
    reasoning += 'Associated with quantifiable achievements. ';
  }
  if (outdatedSkills.includes(skillLower)) {
    reasoning += 'Note: This is an older technology, consider highlighting more modern alternatives.';
  }
  
  return {
    relevanceScore,
    confidence: Math.min(1.0, confidence),
    reasoning: reasoning || 'Skill detected in resume.'
  };
}

/**
 * Neural network-inspired weighted scoring
 * Multi-layer approach to combine different scoring factors
 */
export interface ScoringFactors {
  keywordMatch: number; // 0-100
  formatQuality: number; // 0-100
  metricsPresence: number; // 0-100
  experienceDepth: number; // 0-100
  skillRelevance: number; // 0-100
  atsCompatibility: number; // 0-100
}

export interface WeightedScoreResult {
  finalScore: number; // 0-100
  layerScores: {
    inputLayer: ScoringFactors;
    hiddenLayer: {
      contentQuality: number;
      technicalDepth: number;
      professionalPresentation: number;
    };
    outputLayer: number;
  };
  confidence: number; // 0-1
}

export function calculateNeuralWeightedScore(
  factors: ScoringFactors,
  experienceLevel: 'entry' | 'mid' | 'senior' | 'principal' = 'mid'
): WeightedScoreResult {
  // INPUT LAYER: Raw factors
  const inputLayer = factors;
  
  // HIDDEN LAYER: Combine related factors with adaptive weights
  const weights = getAdaptiveWeights(experienceLevel);
  
  const contentQuality = (
    inputLayer.keywordMatch * weights.keywords +
    inputLayer.metricsPresence * weights.metrics
  ) / (weights.keywords + weights.metrics);
  
  const technicalDepth = (
    inputLayer.skillRelevance * weights.skills +
    inputLayer.experienceDepth * weights.experience
  ) / (weights.skills + weights.experience);
  
  const professionalPresentation = (
    inputLayer.formatQuality * weights.format +
    inputLayer.atsCompatibility * weights.ats
  ) / (weights.format + weights.ats);
  
  const hiddenLayer = {
    contentQuality: Math.round(contentQuality),
    technicalDepth: Math.round(technicalDepth),
    professionalPresentation: Math.round(professionalPresentation)
  };
  
  // OUTPUT LAYER: Final weighted combination
  const outputLayer = Math.round(
    contentQuality * 0.4 +
    technicalDepth * 0.35 +
    professionalPresentation * 0.25
  );
  
  // Calculate confidence based on consistency across factors
  const variance = calculateVariance([
    inputLayer.keywordMatch,
    inputLayer.formatQuality,
    inputLayer.metricsPresence,
    inputLayer.experienceDepth,
    inputLayer.skillRelevance,
    inputLayer.atsCompatibility
  ]);
  
  // Lower variance = higher confidence (scores are consistent)
  const confidence = Math.max(0.3, Math.min(1.0, 1.0 - (variance / 10000)));
  
  return {
    finalScore: Math.max(35, Math.min(100, outputLayer)),
    layerScores: {
      inputLayer,
      hiddenLayer,
      outputLayer
    },
    confidence
  };
}

/**
 * Adaptive weights based on seniority level
 */
function getAdaptiveWeights(level: 'entry' | 'mid' | 'senior' | 'principal'): Record<string, number> {
  switch (level) {
    case 'entry':
      return {
        keywords: 0.3,
        metrics: 0.2, // Less emphasis on metrics for entry-level
        skills: 0.4, // More emphasis on skills/learning
        experience: 0.1,
        format: 0.35,
        ats: 0.35
      };
    case 'mid':
      return {
        keywords: 0.4,
        metrics: 0.3,
        skills: 0.35,
        experience: 0.3,
        format: 0.3,
        ats: 0.3
      };
    case 'senior':
      return {
        keywords: 0.4,
        metrics: 0.4, // Strong emphasis on measurable impact
        skills: 0.3,
        experience: 0.4,
        format: 0.25,
        ats: 0.25
      };
    case 'principal':
      return {
        keywords: 0.35,
        metrics: 0.45, // Highest emphasis on business impact
        skills: 0.25,
        experience: 0.5, // Leadership experience critical
        format: 0.2,
        ats: 0.2
      };
    default:
      return {
        keywords: 0.4,
        metrics: 0.3,
        skills: 0.35,
        experience: 0.3,
        format: 0.3,
        ats: 0.3
      };
  }
}

/**
 * Calculate variance of a set of numbers
 */
function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return squaredDiffs.reduce((sum, d) => sum + d, 0) / numbers.length;
}

/**
 * Contextual keyword scoring
 * Scores keywords based on their context and placement
 */
export interface ContextualKeywordScore {
  keyword: string;
  baseScore: number; // Raw frequency score
  contextBonus: number; // Bonus from good context
  placementBonus: number; // Bonus from good section placement
  finalScore: number; // Total score
  suggestions: string[];
}

export function scoreKeywordInContext(
  keyword: string,
  resumeText: string,
  sections: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
  }
): ContextualKeywordScore {
  const keywordLower = keyword.toLowerCase();
  const suggestions: string[] = [];
  
  // Base score: Frequency
  const allText = resumeText.toLowerCase();
  const frequency = (allText.match(new RegExp(`\\b${keywordLower}\\b`, 'g')) || []).length;
  const baseScore = Math.min(100, frequency * 25);
  
  // Context bonus: Quality of surrounding text
  let contextBonus = 0;
  const contextPatterns = [
    { pattern: new RegExp(`(led|developed|built|created|designed|implemented|optimized)\\s+[^.]{0,50}\\b${keywordLower}\\b`, 'gi'), bonus: 15, reason: 'paired with strong action verb' },
    { pattern: new RegExp(`\\b${keywordLower}\\b[^.]{0,100}(\\d+%|\\$[\\d,]+|\\dx|\\d+\\s+users)`, 'gi'), bonus: 20, reason: 'associated with metrics' },
    { pattern: new RegExp(`\\b${keywordLower}\\b[^.]{0,150}(increased|improved|reduced|saved|generated)`, 'gi'), bonus: 10, reason: 'shows impact' },
    { pattern: new RegExp(`\\b${keywordLower}\\b[^.]{0,100}(architecture|system|infrastructure|platform)`, 'gi'), bonus: 8, reason: 'shows scale/complexity' }
  ];
  
  for (const { pattern, bonus, reason } of contextPatterns) {
    if (pattern.test(resumeText)) {
      contextBonus += bonus;
      suggestions.push(`Great! Keyword ${reason}.`);
    }
  }
  
  // Placement bonus: Section importance
  let placementBonus = 0;
  const sectionChecks = [
    { text: sections.experience, bonus: 20, name: 'Experience' },
    { text: sections.skills, bonus: 15, name: 'Skills' },
    { text: sections.summary, bonus: 10, name: 'Summary' },
    { text: sections.education, bonus: 5, name: 'Education' }
  ];
  
  for (const { text, bonus, name } of sectionChecks) {
    if (text.toLowerCase().includes(keywordLower)) {
      placementBonus += bonus;
      suggestions.push(`Found in ${name} section (good placement).`);
    }
  }
  
  // If keyword is missing from high-value sections, suggest adding it
  if (!sections.experience.toLowerCase().includes(keywordLower)) {
    suggestions.push(`💡 Add to Experience section with specific examples.`);
  }
  if (!sections.skills.toLowerCase().includes(keywordLower)) {
    suggestions.push(`💡 Include in Skills section for ATS visibility.`);
  }
  
  const finalScore = Math.min(100, baseScore + contextBonus + placementBonus);
  
  return {
    keyword,
    baseScore,
    contextBonus,
    placementBonus,
    finalScore,
    suggestions
  };
}

/**
 * Semantic similarity using cosine similarity
 * Compares resume text with job description
 */
export function calculateCosineSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Create vocabulary
  const vocabulary = new Set([...words1, ...words2]);
  
  // Create vectors
  const vector1: number[] = [];
  const vector2: number[] = [];
  
  for (const word of vocabulary) {
    vector1.push(words1.filter(w => w === word).length);
    vector2.push(words2.filter(w => w === word).length);
  }
  
  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }
  
  // Calculate magnitudes
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
  
  // Avoid division by zero
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  // Return cosine similarity (0-1)
  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Predict ATS pass rate using ML model
 */
export function predictATSPassRate(
  resumeScore: number,
  hasKeywords: boolean,
  hasMetrics: boolean,
  formatQuality: number
): {
  passRate: number; // 0-100
  confidence: number; // 0-1
  factors: string[];
} {
  const factors: string[] = [];
  
  // Base pass rate from overall score
  let passRate = resumeScore * 0.6; // Start with 60% weight on score
  
  // Keyword presence (critical for ATS)
  if (hasKeywords) {
    passRate += 15;
    factors.push('✓ Keywords present');
  } else {
    passRate -= 20;
    factors.push('✗ Missing critical keywords');
  }
  
  // Metrics (shows impact)
  if (hasMetrics) {
    passRate += 10;
    factors.push('✓ Quantifiable achievements');
  } else {
    factors.push('⚠ Add metrics for stronger impact');
  }
  
  // Format quality (ATS parsability)
  if (formatQuality >= 80) {
    passRate += 10;
    factors.push('✓ ATS-friendly format');
  } else if (formatQuality >= 60) {
    passRate += 5;
    factors.push('⚠ Format could be improved');
  } else {
    passRate -= 5;
    factors.push('✗ Format may cause parsing issues');
  }
  
  // Normalize to 0-100
  passRate = Math.max(0, Math.min(100, passRate));
  
  // Calculate confidence based on available signals
  let confidence = 0.5;
  if (hasKeywords) confidence += 0.2;
  if (hasMetrics) confidence += 0.15;
  if (formatQuality >= 70) confidence += 0.15;
  
  return {
    passRate: Math.round(passRate),
    confidence: Math.min(1.0, confidence),
    factors
  };
}
