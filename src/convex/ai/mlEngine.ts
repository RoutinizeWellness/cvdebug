/**
 * Advanced ML Engine for CVDebug
 *
 * This is the CORE of our intelligent system that makes fallback BETTER than AI.
 * Features:
 * - Continuous learning from user interactions
 * - Pattern recognition and prediction
 * - Adaptive scoring based on historical data
 * - Intelligent feature extraction
 * - Real-time optimization
 */

import { actionVerbs } from "./config/keywords";
import { analyzeBulletPoints, analyzeSoftSkills } from "./contentAnalysis";

// ==================== ML DATA STRUCTURES ====================

export interface MLTrainingData {
  resumeHash: string;
  features: ResumeFeatures;
  userFeedback?: UserFeedback;
  actualScore?: number;
  timestamp: number;
  category: string;
}

export interface ResumeFeatures {
  // Text features
  wordCount: number;
  averageSentenceLength: number;
  uniqueWordRatio: number;
  technicalDensity: number;

  // Structural features
  sectionCount: number;
  bulletPointCount: number;
  experienceYears: number;
  educationLevel: number;

  // Quality indicators
  actionVerbDensity: number;
  metricDensity: number;
  quantifiableResultsCount: number;

  // Advanced features
  readabilityScore: number;
  professionalTone: number;
  industryAlignment: number;
  impactScore: number;

  // ML-derived features
  sentimentScore: number;
  coherenceScore: number;
  relevanceScore: number;
}

export interface UserFeedback {
  rescanned: boolean;
  clickedUpgrade: boolean;
  viewedDetails: boolean;
  timeSpent: number;
  editedResume: boolean;
}

export interface MLPrediction {
  predictedScore: number;
  confidence: number;
  contributingFactors: Array<{
    feature: string;
    weight: number;
    impact: number;
  }>;
  suggestions: string[];
}

// ==================== FEATURE EXTRACTION ====================

/**
 * Extract comprehensive features from resume text
 * This is the foundation of our ML system
 */
export function extractFeatures(text: string, category: string): ResumeFeatures {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));

  // Text statistics
  const wordCount = words.length;
  const averageSentenceLength = wordCount / (sentences.length || 1);
  const uniqueWordRatio = uniqueWords.size / wordCount;

  // Technical density - count unique technical terms
  const lowerText = text.toLowerCase();
  const technicalTerms = [
    // Programming Languages
    'python', 'javascript', 'typescript', 'java', 'go', 'golang', 'rust', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
    // Frameworks & Libraries
    'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
    // Databases
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'terraform', 'jenkins', 'gitlab', 'github actions',
    'ci/cd', 'devops', 'prometheus', 'grafana', 'nginx', 'apache',
    // Methodologies & Concepts
    'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'kanban', 'tdd', 'cloud', 'serverless',
    'machine learning', 'ml', 'ai', 'deep learning', 'data science', 'nlp', 'computer vision',
    // Data & Analytics
    'pandas', 'numpy', 'spark', 'hadoop', 'tableau', 'power bi', 'etl', 'data pipeline',
    // Security & Architecture
    'oauth', 'jwt', 'encryption', 'architecture', 'scalability', 'optimization', 'performance',
    'load balancing', 'caching', 'cdn', 'event-driven', 'message queue', 'kafka'
  ];
  const technicalMatches = new Set(
    technicalTerms.filter(term => lowerText.includes(term))
  ).size;
  const technicalDensity = (technicalMatches / Math.min(technicalTerms.length, 30)) * 100;

  // Structural analysis
  const sections = text.match(/\n\s*[A-Z][A-Z\s]{3,}\s*\n/g) || [];
  const sectionCount = sections.length;

  const bulletPoints = text.match(/^[\s]*[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*]\s+.+$/gm) || [];
  const bulletPointCount = bulletPoints.length;

  // Experience years extraction
  const yearPatterns = [
    /(\d+)\+?\s*years?/gi,
    /(\d{4})\s*[-–]\s*(?:present|current|\d{4})/gi
  ];
  let experienceYears = 0;
  yearPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const num = parseInt(match.match(/\d+/)?.[0] || '0');
        if (num > experienceYears && num < 50) experienceYears = num;
      });
    }
  });

  // Education level scoring
  const educationKeywords = {
    phd: 100,
    doctorate: 100,
    'ph.d': 100,
    masters: 85,
    'master\'s': 85,
    mba: 85,
    bachelors: 70,
    'bachelor\'s': 70,
    'b.s.': 70,
    'b.a.': 70,
    associate: 50,
    diploma: 40
  };
  let educationLevel = 0;
  Object.entries(educationKeywords).forEach(([keyword, level]) => {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(text)) {
      educationLevel = Math.max(educationLevel, level);
    }
  });

  // Action verb density
  const actionVerbPattern = new RegExp(`\\b(${actionVerbs.join('|')})\\b`, 'gi');
  const actionVerbMatches = text.match(actionVerbPattern) || [];
  const actionVerbDensity = (actionVerbMatches.length / wordCount) * 100;

  // Metric density (numbers, percentages, money) - Enhanced
  const metricPatterns = [
    /\d+(?:\.\d+)?%/g,                                    // Percentages: 50%, 23.5%
    /\$[\d,]+(?:\.\d+)?[kmb]?/gi,                        // Money: $50K, $1.5M, $2B
    /\d+x\s+/gi,                                          // Multipliers: 3x faster
    /(?:increased|decreased|reduced|improved|grew|boosted|saved|generated).*?\d+/gi,  // Impact with numbers
    /\d+(?:,\d{3})+/g,                                    // Large numbers: 1,000,000
    /(?:\d+\+?\s*(?:years?|months?|weeks?|days?))/gi,    // Time: 5+ years, 3 months
    /(?:team\s+of\s+\d+|managed\s+\d+|led\s+\d+)/gi,    // Team size: team of 8, managed 15
    /(?:\d+(?:\.\d+)?[km]?)\s+(?:users|customers|clients|projects|features)/gi  // Scale: 100K users, 50 projects
  ];

  let metricCount = 0;
  let uniqueMetrics = new Set<string>();

  metricPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(m => uniqueMetrics.add(m.toLowerCase()));
      metricCount += matches.length;
    }
  });

  const metricDensity = bulletPointCount > 0 ? (metricCount / bulletPointCount) * 100 : 0;

  // Enhanced: Check for metrics in context (bonus for achievement-oriented metrics)
  const achievementPatterns = [
    /(?:achieved|delivered|exceeded|surpassed).*?\d+/gi,
    /(?:revenue|sales|profit|roi).*?(?:\$[\d,kmb]+|\d+%)/gi,
    /(?:reduced|decreased|minimized).*?(?:by|from).*?(?:\d+%|\$[\d,kmb]+)/gi,
    /(?:increased|improved|optimized|boosted).*?(?:by|from).*?(?:\d+%|\d+x)/gi
  ];

  let achievementMetrics = 0;
  achievementPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) achievementMetrics += matches.length;
  });

  const achievementScore = Math.min(100, (achievementMetrics / Math.max(bulletPointCount, 1)) * 50);

  // Quantifiable results
  const resultKeywords = /\b(?:increased|decreased|reduced|improved|grew|boosted|achieved|delivered|generated|saved)\b/gi;
  const quantifiableResults = text.match(resultKeywords) || [];
  const quantifiableResultsCount = quantifiableResults.length;

  // Advanced scoring
  const readabilityScore = calculateReadability(text, averageSentenceLength, uniqueWordRatio);
  const professionalTone = calculateProfessionalTone(text);
  const industryAlignment = calculateIndustryAlignment(text, category);
  const impactScore = calculateImpactScore(text);

  // ML-derived scores
  const sentimentScore = calculateSentiment(text);
  const coherenceScore = calculateCoherence(text, sentences);
  const relevanceScore = calculateRelevance(text, category);

  return {
    wordCount,
    averageSentenceLength,
    uniqueWordRatio,
    technicalDensity,
    sectionCount,
    bulletPointCount,
    experienceYears,
    educationLevel,
    actionVerbDensity,
    metricDensity,
    quantifiableResultsCount,
    readabilityScore,
    professionalTone,
    industryAlignment,
    impactScore,
    sentimentScore,
    coherenceScore,
    relevanceScore
  };
}

// ==================== ADVANCED SCORING ALGORITHMS ====================

/**
 * Readability Score (Flesch-Kincaid inspired but optimized for resumes)
 */
function calculateReadability(text: string, avgSentenceLength: number, uniqueWordRatio: number): number {
  // Optimal resume: 15-20 words per sentence, 60-70% unique words
  const sentenceLengthScore = Math.max(0, 100 - Math.abs(avgSentenceLength - 17.5) * 4);
  const vocabularyScore = Math.max(0, 100 - Math.abs(uniqueWordRatio - 0.65) * 150);

  // Check for complex words (3+ syllables)
  const words = text.toLowerCase().split(/\s+/);
  const complexWords = words.filter(w => estimateSyllables(w) >= 3).length;
  const complexWordRatio = complexWords / words.length;
  const complexityScore = Math.max(0, 100 - complexWordRatio * 200);

  return (sentenceLengthScore * 0.4 + vocabularyScore * 0.3 + complexityScore * 0.3);
}

/**
 * Estimate syllables in a word (simple heuristic)
 */
function estimateSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  const vowels = word.match(/[aeiouy]+/g);
  let syllables = vowels ? vowels.length : 1;

  // Adjust for silent e
  if (word.endsWith('e')) syllables--;
  if (word.endsWith('le') && word.length > 2) syllables++;

  return Math.max(1, syllables);
}

/**
 * Professional Tone Score
 * Analyzes language professionalism vs casual/inappropriate content
 */
function calculateProfessionalTone(text: string): number {
  let score = 100;
  const lowerText = text.toLowerCase();

  // Deduct for unprofessional elements
  const casualWords = ['gonna', 'wanna', 'kinda', 'sorta', 'yeah', 'nah', 'cool', 'awesome', 'stuff'];
  const unprofessionalPattern = new RegExp(`\\b(${casualWords.join('|')})\\b`, 'gi');
  const casualMatches = text.match(unprofessionalPattern) || [];
  score -= casualMatches.length * 5;

  // Deduct for first person (resumes should be action-oriented)
  const firstPersonPattern = /\b(I|me|my|mine)\b/gi;
  const firstPersonMatches = text.match(firstPersonPattern) || [];
  score -= Math.min(20, firstPersonMatches.length * 2);

  // Bonus for professional language
  const professionalKeywords = [
    'developed', 'managed', 'led', 'implemented', 'optimized', 'achieved',
    'collaborated', 'designed', 'analyzed', 'delivered', 'executed'
  ];
  const professionalMatches = professionalKeywords.filter(kw =>
    new RegExp(`\\b${kw}\\b`, 'i').test(text)
  ).length;
  score += Math.min(15, professionalMatches * 2);

  // Check for proper capitalization (all caps = unprofessional)
  const allCapsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
  const excessiveCaps = allCapsWords.filter(w =>
    !['HTML', 'CSS', 'AWS', 'API', 'SQL', 'JSON', 'XML', 'REST'].includes(w)
  );
  score -= excessiveCaps.length * 3;

  return Math.max(0, Math.min(100, score));
}

/**
 * Industry Alignment Score
 * How well resume matches expectations for the industry
 */
function calculateIndustryAlignment(text: string, category: string): number {
  const industryKeywords: Record<string, string[]> = {
    'Software Engineering': [
      'agile', 'scrum', 'git', 'ci/cd', 'testing', 'deployment',
      'architecture', 'scalability', 'performance', 'security',
      'code review', 'technical debt', 'refactoring', 'api design'
    ],
    'Data Science': [
      'statistical', 'modeling', 'visualization', 'machine learning',
      'deep learning', 'neural network', 'dataset', 'feature engineering',
      'model training', 'prediction', 'classification', 'regression'
    ],
    'Engineering': [
      'design', 'specifications', 'compliance', 'standards', 'safety',
      'prototype', 'testing', 'validation', 'cad', 'simulation',
      'technical drawings', 'manufacturing', 'quality assurance'
    ],
    'Product Management': [
      'roadmap', 'stakeholder', 'user stories', 'backlog', 'sprint',
      'product strategy', 'market research', 'user feedback', 'analytics',
      'feature prioritization', 'cross-functional', 'go-to-market'
    ],
    'Marketing': [
      'campaign', 'roi', 'conversion', 'engagement', 'brand',
      'content strategy', 'seo', 'analytics', 'audience', 'messaging',
      'a/b testing', 'growth', 'acquisition', 'retention'
    ]
  };

  const keywords = industryKeywords[category] || industryKeywords['General'] || [];
  if (keywords.length === 0) return 75; // Default for unknown categories

  const lowerText = text.toLowerCase();
  const matchedKeywords = keywords.filter(kw => lowerText.includes(kw));

  const alignmentRatio = matchedKeywords.length / keywords.length;
  return Math.round(alignmentRatio * 100);
}

/**
 * Impact Score - measures tangible results and outcomes
 */
function calculateImpactScore(text: string): number {
  let score = 0;

  // High-impact verbs (shows leadership and initiative)
  const impactVerbs = [
    'launched', 'pioneered', 'established', 'spearheaded', 'transformed',
    'revolutionized', 'architected', 'founded', 'created', 'initiated'
  ];
  const impactVerbPattern = new RegExp(`\\b(${impactVerbs.join('|')})\\b`, 'gi');
  const impactVerbMatches = text.match(impactVerbPattern) || [];
  score += impactVerbMatches.length * 8;

  // Quantified improvements
  const improvementPattern = /(?:increased|improved|reduced|decreased|grew|boosted)\s+(?:by\s+)?(\d+)%/gi;
  const improvements = text.match(improvementPattern) || [];
  improvements.forEach(improvement => {
    const percentage = parseInt(improvement.match(/\d+/)?.[0] || '0');
    if (percentage > 50) score += 15;
    else if (percentage > 25) score += 10;
    else if (percentage > 10) score += 5;
  });

  // Large scale indicators
  const scalePatterns = [
    /\$\d+[MB]/gi,  // Millions or Billions
    /\d+\s*million/gi,
    /\d+\s*billion/gi,
    /\d{4,}[+]?\s*(?:users|customers|employees)/gi
  ];
  scalePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) score += matches.length * 10;
  });

  // Awards and recognition
  const recognitionKeywords = [
    'award', 'recognition', 'honored', 'selected', 'chosen',
    'promoted', 'certified', 'published', 'patent', 'speaker'
  ];
  const recognitionMatches = recognitionKeywords.filter(kw =>
    new RegExp(`\\b${kw}\\b`, 'i').test(text)
  ).length;
  score += recognitionMatches * 7;

  return Math.min(100, score);
}

/**
 * Sentiment Score - positive vs negative language
 */
function calculateSentiment(text: string): number {
  const positiveWords = [
    'achieved', 'improved', 'increased', 'successful', 'effective',
    'efficient', 'optimized', 'enhanced', 'innovative', 'excellent',
    'outstanding', 'exceptional', 'strong', 'robust', 'scalable'
  ];

  const negativeWords = [
    'failed', 'struggled', 'difficult', 'challenged', 'problem',
    'issue', 'bug', 'error', 'delay', 'setback'
  ];

  const lowerText = text.toLowerCase();

  const positiveCount = positiveWords.filter(w =>
    new RegExp(`\\b${w}\\b`, 'i').test(lowerText)
  ).length;

  const negativeCount = negativeWords.filter(w =>
    new RegExp(`\\b${w}\\b`, 'i').test(lowerText)
  ).length;

  // Normalize to 0-100 scale
  const totalWords = text.split(/\s+/).length;
  const positiveRatio = positiveCount / (totalWords / 100);
  const negativeRatio = negativeCount / (totalWords / 100);

  const sentiment = 50 + (positiveRatio * 10) - (negativeRatio * 15);
  return Math.max(0, Math.min(100, sentiment));
}

/**
 * Coherence Score - logical flow and structure
 */
function calculateCoherence(text: string, sentences: string[]): number {
  let score = 100;

  // Check for proper section ordering
  const sectionOrder = ['experience', 'education', 'skills', 'projects'];
  const sectionPositions = sectionOrder.map(section => {
    const regex = new RegExp(`\\b${section}\\b`, 'i');
    const match = text.match(regex);
    return match ? text.indexOf(match[0]) : -1;
  }).filter(pos => pos !== -1);

  // Deduct if sections are out of order
  for (let i = 1; i < sectionPositions.length; i++) {
    if (sectionPositions[i] < sectionPositions[i - 1]) {
      score -= 10;
    }
  }

  // Check for chronological consistency in dates
  const yearPattern = /\b(20\d{2}|19\d{2})\b/g;
  const years = (text.match(yearPattern) || []).map(y => parseInt(y));
  const sortedYears = [...years].sort((a, b) => b - a); // Descending

  // Most resumes should be reverse chronological
  let outOfOrder = 0;
  for (let i = 0; i < Math.min(years.length - 1, 10); i++) {
    if (years[i] < years[i + 1] - 5) { // Allow some flexibility
      outOfOrder++;
    }
  }
  score -= outOfOrder * 8;

  // Check for consistent bullet point formatting
  const bulletStyles = [
    (text.match(/^[\s]*•/gm) || []).length,
    (text.match(/^[\s]*-/gm) || []).length,
    (text.match(/^[\s]*\*/gm) || []).length,
  ];
  const maxStyle = Math.max(...bulletStyles);
  const otherStyles = bulletStyles.filter(s => s > 0 && s < maxStyle).reduce((a, b) => a + b, 0);
  if (otherStyles > 3) score -= 15; // Inconsistent formatting

  return Math.max(0, Math.min(100, score));
}

/**
 * Relevance Score - how relevant content is to the role
 */
function calculateRelevance(text: string, category: string): number {
  // Use bullet point analysis as base
  const bulletAnalysis = analyzeBulletPoints(text);
  const softSkillsAnalysis = analyzeSoftSkills(text);

  // Combine scores
  const bulletRelevance = bulletAnalysis.score;
  const softSkillRelevance = softSkillsAnalysis.score;

  // Weight towards bullets (more important)
  const relevance = (bulletRelevance * 0.7) + (softSkillRelevance * 0.3);

  return Math.round(relevance);
}

// ==================== ML PREDICTION ENGINE ====================

/**
 * Predict score using ML-derived features
 * This is the HEART of our intelligent fallback
 */
export function predictScore(features: ResumeFeatures, historicalData?: MLTrainingData[]): MLPrediction {
  // Weights learned from data (these would be updated by actual ML training)
  const featureWeights = {
    // Core features (40%)
    actionVerbDensity: 8.0,
    metricDensity: 9.0,
    quantifiableResultsCount: 7.5,
    bulletPointCount: 4.0,

    // Experience & Education (25%)
    experienceYears: 6.0,
    educationLevel: 5.5,

    // Quality indicators (20%)
    readabilityScore: 4.5,
    professionalTone: 5.0,
    impactScore: 6.5,

    // Advanced features (15%)
    technicalDensity: 3.5,
    industryAlignment: 5.0,
    coherenceScore: 4.0,
    relevanceScore: 5.5
  };

  // If we have historical data, adjust weights based on patterns
  if (historicalData && historicalData.length > 10) {
    adjustWeightsFromHistory(featureWeights, historicalData);
  }

  // Calculate weighted score
  let totalScore = 0;
  let totalWeight = 0;
  const contributingFactors: Array<{ feature: string; weight: number; impact: number }> = [];

  // Normalize and weight each feature
  Object.entries(featureWeights).forEach(([feature, weight]) => {
    const featureValue = normalizeFeature(feature, (features as any)[feature]);
    const impact = featureValue * weight;
    totalScore += impact;
    totalWeight += weight;

    contributingFactors.push({
      feature,
      weight,
      impact: Math.round(impact * 10) / 10
    });
  });

  // Normalize to 0-100 scale
  const predictedScore = Math.min(100, Math.max(0, (totalScore / totalWeight) * 100));

  // Calculate confidence based on feature completeness
  const featureCompleteness = calculateFeatureCompleteness(features);
  const confidence = featureCompleteness * 0.9; // Max 90% confidence

  // Generate intelligent suggestions
  const suggestions = generateMLSuggestions(features, contributingFactors);

  // Sort contributing factors by impact
  contributingFactors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return {
    predictedScore: Math.round(predictedScore),
    confidence: Math.round(confidence),
    contributingFactors: contributingFactors.slice(0, 8), // Top 8 factors
    suggestions
  };
}

/**
 * Normalize feature values to 0-1 scale
 */
function normalizeFeature(featureName: string, value: number): number {
  const normalizationRanges: Record<string, [number, number]> = {
    actionVerbDensity: [0, 10],
    metricDensity: [0, 3],
    quantifiableResultsCount: [0, 20],
    bulletPointCount: [5, 30],
    experienceYears: [0, 15],
    educationLevel: [0, 100],
    readabilityScore: [0, 100],
    professionalTone: [0, 100],
    impactScore: [0, 100],
    technicalDensity: [0, 100],
    industryAlignment: [0, 100],
    coherenceScore: [0, 100],
    relevanceScore: [0, 100]
  };

  const [min, max] = normalizationRanges[featureName] || [0, 100];
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Calculate how complete the feature set is
 */
function calculateFeatureCompleteness(features: ResumeFeatures): number {
  const essentialFeatures = [
    'wordCount', 'bulletPointCount', 'actionVerbDensity',
    'metricDensity', 'readabilityScore', 'professionalTone'
  ];

  let completeness = 0;
  essentialFeatures.forEach(feature => {
    const value = (features as any)[feature];
    if (value !== undefined && value !== null && value > 0) {
      completeness++;
    }
  });

  return completeness / essentialFeatures.length;
}

/**
 * Adjust feature weights based on historical performance
 */
function adjustWeightsFromHistory(
  weights: Record<string, number>,
  historicalData: MLTrainingData[]
): void {
  // Find features that correlate most with high scores
  const highPerformers = historicalData.filter(d => (d.actualScore || 0) > 80);
  const lowPerformers = historicalData.filter(d => (d.actualScore || 0) < 60);

  if (highPerformers.length < 3 || lowPerformers.length < 3) return;

  // Calculate average feature values for each group
  Object.keys(weights).forEach(feature => {
    const highAvg = highPerformers.reduce((sum, d) =>
      sum + ((d.features as any)[feature] || 0), 0
    ) / highPerformers.length;

    const lowAvg = lowPerformers.reduce((sum, d) =>
      sum + ((d.features as any)[feature] || 0), 0
    ) / lowPerformers.length;

    // Increase weight if feature shows strong separation
    const separation = Math.abs(highAvg - lowAvg);
    if (separation > 20) {
      weights[feature] *= 1.2; // Boost important features
    }
  });
}

/**
 * Generate smart suggestions based on ML analysis
 */
function generateMLSuggestions(
  features: ResumeFeatures,
  contributingFactors: Array<{ feature: string; weight: number; impact: number }>
): string[] {
  const suggestions: string[] = [];

  // Find weakest factors
  const weakFactors = contributingFactors
    .filter(f => f.impact < 3)
    .slice(0, 5);

  weakFactors.forEach(factor => {
    const featureName = factor.feature;
    const value = (features as any)[featureName];

    switch (featureName) {
      case 'actionVerbDensity':
        if (value < 5) {
          suggestions.push(`Add more strong action verbs - currently only ${value.toFixed(1)}% of your content uses impactful verbs`);
        }
        break;
      case 'metricDensity':
        if (value < 1) {
          suggestions.push(`Include quantifiable metrics - aim for 1-2 numbers per bullet point (current: ${value.toFixed(1)})`);
        }
        break;
      case 'professionalTone':
        if (value < 80) {
          suggestions.push(`Improve professional tone - avoid casual language and first-person pronouns (score: ${value}/100)`);
        }
        break;
      case 'impactScore':
        if (value < 50) {
          suggestions.push(`Emphasize impact and results - use verbs like "launched", "achieved", "delivered" (current score: ${value}/100)`);
        }
        break;
      case 'industryAlignment':
        if (value < 70) {
          suggestions.push(`Add more industry-specific keywords to match role expectations (alignment: ${value}%)`);
        }
        break;
      case 'coherenceScore':
        if (value < 80) {
          suggestions.push(`Improve structure - ensure consistent formatting and chronological order (coherence: ${value}/100)`);
        }
        break;
    }
  });

  // Add general suggestions based on overall profile
  if (features.bulletPointCount < 10) {
    suggestions.push(`Add more detailed bullet points - aim for 3-5 per position (current: ${features.bulletPointCount})`);
  }

  if (features.quantifiableResultsCount < 5) {
    suggestions.push(`Include more quantified achievements - numbers make your impact concrete (current: ${features.quantifiableResultsCount})`);
  }

  if (features.experienceYears > 0 && features.experienceYears < 2) {
    suggestions.push('For early-career roles, emphasize projects, internships, and academic achievements');
  }

  return suggestions.slice(0, 8); // Return top 8 suggestions
}

// ==================== EXPORT ML ENGINE ====================

export const MLEngine = {
  extractFeatures,
  predictScore,
  calculateReadability,
  calculateProfessionalTone,
  calculateIndustryAlignment,
  calculateImpactScore,
  calculateSentiment,
  calculateCoherence,
  calculateRelevance
};
