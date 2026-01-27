import { useMemo } from 'react';
import {
  TFIDF,
  cosineSimilarity,
  extractNGrams,
  analyzeSentiment,
  detectActionVerbs,
  extractEntities,
  scoreResume
} from '@/lib/ml/textAnalysis';

export interface MLAnalysisResult {
  // Overall scores
  overallScore: number;
  keywordMatchScore: number;
  actionVerbScore: number;
  sentimentScore: number;
  structureScore: number;

  // Detailed insights
  topKeywords: Array<{ keyword: string; score: number }>;
  matchedKeywords: string[];
  missingKeywords: string[];
  actionVerbs: Array<{ verb: string; strength: number }>;
  weakPhrases: Array<{ phrase: string; suggestion: string }>;
  sentiment: { score: number; label: string };
  entities: {
    skills: string[];
    technologies: string[];
    companies: string[];
  };

  // Recommendations
  recommendations: Array<{
    type: 'critical' | 'important' | 'suggestion';
    title: string;
    description: string;
    impact: number;
  }>;
}

export function useMLAnalysis(
  resumeText: string,
  jobDescription: string = ''
): MLAnalysisResult {
  return useMemo(() => {
    if (!resumeText || resumeText.length < 100) {
      return getEmptyResult();
    }

    // 1. Score the resume using ML
    const scores = scoreResume(resumeText, jobDescription || 'software engineer full stack development');

    // 2. Extract keywords using TF-IDF
    const corpus = jobDescription
      ? [resumeText, jobDescription]
      : [resumeText, 'software engineer full stack web development python javascript react node'];

    const tfidf = new TFIDF(corpus);
    const topKeywords = tfidf.getTopKeywords(resumeText, 15);

    // 3. Keyword matching
    const resumeVector = tfidf.getTFIDF(resumeText);
    const jobVector = tfidf.getTFIDF(jobDescription || corpus[1]);

    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    jobVector.forEach((score, keyword) => {
      if (resumeVector.has(keyword) && resumeVector.get(keyword)! > 0) {
        matchedKeywords.push(keyword);
      } else if (score > 0.01) {
        missingKeywords.push(keyword);
      }
    });

    // 4. Action verb analysis
    const actionVerbs = detectActionVerbs(resumeText);

    // 5. Detect weak phrases
    const weakPhrases = detectWeakPhrases(resumeText);

    // 6. Sentiment analysis
    const sentiment = analyzeSentiment(resumeText);

    // 7. Entity extraction
    const entities = extractEntities(resumeText);

    // 8. Generate ML-powered recommendations
    const recommendations = generateRecommendations(
      scores,
      actionVerbs,
      weakPhrases,
      missingKeywords,
      entities
    );

    return {
      overallScore: scores.overallScore,
      keywordMatchScore: scores.keywordMatch,
      actionVerbScore: scores.actionVerbScore,
      sentimentScore: scores.sentimentScore,
      structureScore: scores.structureScore,

      topKeywords,
      matchedKeywords: matchedKeywords.slice(0, 20),
      missingKeywords: missingKeywords.slice(0, 15),
      actionVerbs: actionVerbs.slice(0, 10),
      weakPhrases,
      sentiment,
      entities,

      recommendations
    };
  }, [resumeText, jobDescription]);
}

function detectWeakPhrases(text: string): Array<{ phrase: string; suggestion: string }> {
  const weakPatterns = [
    { pattern: /\bresponsible for\b/gi, phrase: 'responsible for', suggestion: 'Led, Managed, Directed' },
    { pattern: /\bhelped (with|to)\b/gi, phrase: 'helped with/to', suggestion: 'Drove, Executed, Delivered' },
    { pattern: /\bworked on\b/gi, phrase: 'worked on', suggestion: 'Developed, Built, Created' },
    { pattern: /\bassisted (with|in)\b/gi, phrase: 'assisted with/in', suggestion: 'Implemented, Executed' },
    { pattern: /\binvolved in\b/gi, phrase: 'involved in', suggestion: 'Led, Delivered, Drove' },
    { pattern: /\bparticipated in\b/gi, phrase: 'participated in', suggestion: 'Contributed, Executed' }
  ];

  const detected: Array<{ phrase: string; suggestion: string }> = [];

  weakPatterns.forEach(({ pattern, phrase, suggestion }) => {
    if (pattern.test(text)) {
      detected.push({ phrase, suggestion });
    }
  });

  return detected;
}

function generateRecommendations(
  scores: ReturnType<typeof scoreResume>,
  actionVerbs: Array<{ verb: string; strength: number }>,
  weakPhrases: Array<{ phrase: string; suggestion: string }>,
  missingKeywords: string[],
  entities: { skills: string[]; technologies: string[]; companies: string[] }
): Array<{
  type: 'critical' | 'important' | 'suggestion';
  title: string;
  description: string;
  impact: number;
}> {
  const recommendations: Array<{
    type: 'critical' | 'important' | 'suggestion';
    title: string;
    description: string;
    impact: number;
  }> = [];

  // Critical: Low keyword match
  if (scores.keywordMatch < 40) {
    recommendations.push({
      type: 'critical',
      title: 'Low Keyword Match',
      description: `Your resume matches only ${scores.keywordMatch}% of job requirements. Add missing keywords: ${missingKeywords.slice(0, 3).join(', ')}`,
      impact: 25
    });
  }

  // Critical: Weak action verbs
  const weakVerbs = actionVerbs.filter(v => v.strength < 0.5);
  if (weakVerbs.length > 3) {
    recommendations.push({
      type: 'critical',
      title: 'Replace Weak Action Verbs',
      description: `Found ${weakVerbs.length} weak verbs. Use strong action verbs like: Achieved, Led, Delivered, Optimized`,
      impact: 20
    });
  }

  // Important: Missing metrics
  if (scores.structureScore < 60) {
    recommendations.push({
      type: 'important',
      title: 'Add Quantifiable Metrics',
      description: 'Include numbers, percentages, and measurable outcomes (e.g., "Increased revenue by 40%", "Led team of 8")',
      impact: 18
    });
  }

  // Important: Weak phrases detected
  if (weakPhrases.length > 0) {
    recommendations.push({
      type: 'important',
      title: `Remove ${weakPhrases.length} Weak Phrases`,
      description: `Replace passive phrases like "${weakPhrases[0].phrase}" with stronger alternatives`,
      impact: 15
    });
  }

  // Suggestion: Add more skills
  if (entities.skills.length < 5) {
    recommendations.push({
      type: 'suggestion',
      title: 'Expand Technical Skills',
      description: 'Add more specific technologies and frameworks relevant to the role',
      impact: 10
    });
  }

  // Suggestion: Improve sentiment
  if (scores.sentimentScore < 50) {
    recommendations.push({
      type: 'suggestion',
      title: 'Use More Impact-Oriented Language',
      description: 'Focus on achievements and positive outcomes rather than tasks',
      impact: 12
    });
  }

  // Sort by impact (highest first)
  return recommendations.sort((a, b) => b.impact - a.impact).slice(0, 5);
}

function getEmptyResult(): MLAnalysisResult {
  return {
    overallScore: 0,
    keywordMatchScore: 0,
    actionVerbScore: 0,
    sentimentScore: 0,
    structureScore: 0,
    topKeywords: [],
    matchedKeywords: [],
    missingKeywords: [],
    actionVerbs: [],
    weakPhrases: [],
    sentiment: { score: 0, label: 'neutral' },
    entities: { skills: [], technologies: [], companies: [] },
    recommendations: []
  };
}
