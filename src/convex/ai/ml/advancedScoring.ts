/**
 * Advanced ML-Powered Scoring Integration
 *
 * Integrates cutting-edge free ML technologies:
 * - Vector Embeddings (Word2Vec-style, LSA)
 * - Transformer-based encoding (BERT-inspired)
 * - Semantic search and similarity
 * - Advanced keyword extraction (TextRank)
 *
 * All algorithms are free and open-source, running locally without API costs
 */

import {
  generateWordEmbeddings,
  documentToEmbedding,
  cosineSimilarity as vectorCosineSimilarity,
  applyLSA,
  semanticSearch,
  advancedSemanticSimilarity,
  extractKeyPhrases
} from './vectorEmbeddings';

import {
  ResumeTransformerEncoder,
  transformerMatchScore,
  getAttentionWeights
} from './transformerLite';

/**
 * Enhanced keyword scoring using Transformer + Vector Embeddings
 */
export function mlEnhancedKeywordAnalysis(
  resumeText: string,
  jobDescription: string
): {
  overallMatch: number;
  semanticSimilarity: number;
  transformerScore: number;
  lsaScore: number;
  word2vecScore: number;
  missingCriticalKeywords: Array<{
    keyword: string;
    importance: number;
    semanticDistance: number;
  }>;
  resumeStrengths: string[];
  improvementAreas: string[];
  attentionHighlights: Array<{ token: string; importance: number }>;
} {
  // Method 1: Transformer-based analysis (BERT-inspired)
  const transformerResult = transformerMatchScore(resumeText, jobDescription);

  // Method 2: Advanced semantic similarity (ensemble)
  const semanticResult = advancedSemanticSimilarity(resumeText, jobDescription);

  // Method 3: Extract key phrases using TextRank
  const resumePhrases = extractKeyPhrases(resumeText, 15);
  const jdPhrases = extractKeyPhrases(jobDescription, 20);

  // Find missing critical keywords with semantic distance
  const resumePhraseSet = new Set(resumePhrases.map(p => p.phrase));
  const missingCriticalKeywords = jdPhrases
    .filter(jdPhrase => !resumePhraseSet.has(jdPhrase.phrase))
    .map(jdPhrase => {
      // Calculate semantic distance using word embeddings
      const wordEmbeddings = generateWordEmbeddings([resumeText, jdPhrase.phrase]);
      const resumeEmb = documentToEmbedding(resumeText, wordEmbeddings);
      const keywordEmb = documentToEmbedding(jdPhrase.phrase, wordEmbeddings);
      const similarity = vectorCosineSimilarity(resumeEmb, keywordEmb);

      return {
        keyword: jdPhrase.phrase,
        importance: jdPhrase.score,
        semanticDistance: 1 - similarity // Distance = 1 - similarity
      };
    })
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  // Identify resume strengths (high-scoring phrases present in both)
  const resumeStrengths = resumePhrases
    .filter(rPhrase => jdPhrases.some(jdP => jdP.phrase === rPhrase.phrase))
    .map(p => p.phrase)
    .slice(0, 8);

  // Get attention highlights from transformer
  const encoder = new ResumeTransformerEncoder(64, 4, 2);
  const importantTokens = encoder.extractImportantTokens(resumeText, 15);

  // Calculate overall match (weighted ensemble)
  const overallMatch =
    transformerResult.overallScore * 0.40 +
    semanticResult.similarity * 0.35 +
    (transformerResult.keywordOverlap * 0.25);

  return {
    overallMatch: Math.round(overallMatch * 100) / 100,
    semanticSimilarity: Math.round(semanticResult.similarity * 1000) / 1000,
    transformerScore: Math.round(transformerResult.overallScore * 1000) / 1000,
    lsaScore: Math.round(semanticResult.lsaSim * 1000) / 1000,
    word2vecScore: Math.round(semanticResult.word2vecSim * 1000) / 1000,
    missingCriticalKeywords,
    resumeStrengths,
    improvementAreas: missingCriticalKeywords.slice(0, 5).map(k => k.keyword),
    attentionHighlights: importantTokens
  };
}

/**
 * Semantic resume search across multiple candidates
 */
export function semanticResumeRanking(
  jobDescription: string,
  resumes: Array<{ id: string; text: string }>
): Array<{
  id: string;
  score: number;
  transformerScore: number;
  semanticScore: number;
  rank: number;
}> {
  const encoder = new ResumeTransformerEncoder(64, 4, 2);
  const jdEmbedding = encoder.encodeToSingleVector(jobDescription);

  // Score each resume
  const scoredResumes = resumes.map(resume => {
    // Transformer similarity
    const transformerScore = encoder.similarity(resume.text, jobDescription);

    // Semantic similarity (ensemble)
    const semanticResult = advancedSemanticSimilarity(resume.text, jobDescription);

    // Combined score
    const score = (transformerScore * 0.6) + (semanticResult.similarity * 0.4);

    return {
      id: resume.id,
      score,
      transformerScore,
      semanticScore: semanticResult.similarity
    };
  });

  // Rank resumes
  scoredResumes.sort((a, b) => b.score - a.score);

  return scoredResumes.map((resume, idx) => ({
    ...resume,
    rank: idx + 1
  }));
}

/**
 * Extract skill gaps using ML
 */
export function mlSkillGapAnalysis(
  resumeText: string,
  jobDescription: string
): {
  presentSkills: Array<{ skill: string; confidence: number }>;
  missingSkills: Array<{ skill: string; priority: number; examples: string[] }>;
  skillCoverage: number;
} {
  // Extract skills from job description using TextRank
  const jdSkills = extractKeyPhrases(jobDescription, 25);
  const resumeSkills = extractKeyPhrases(resumeText, 30);

  // Use transformer to determine which JD skills are present in resume
  const encoder = new ResumeTransformerEncoder(64, 4, 2);

  const presentSkills: Array<{ skill: string; confidence: number }> = [];
  const missingSkills: Array<{ skill: string; priority: number; examples: string[] }> = [];

  jdSkills.forEach(jdSkill => {
    // Check if skill is semantically present in resume
    let maxSimilarity = 0;

    resumeSkills.forEach(resumeSkill => {
      const similarity = encoder.similarity(resumeSkill.phrase, jdSkill.phrase);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });

    if (maxSimilarity > 0.7) {
      // Skill is present
      presentSkills.push({
        skill: jdSkill.phrase,
        confidence: maxSimilarity
      });
    } else {
      // Skill is missing
      missingSkills.push({
        skill: jdSkill.phrase,
        priority: jdSkill.score,
        examples: [] // Could add context examples here
      });
    }
  });

  const skillCoverage = presentSkills.length / Math.max(jdSkills.length, 1);

  return {
    presentSkills: presentSkills.slice(0, 15),
    missingSkills: missingSkills
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10),
    skillCoverage: Math.round(skillCoverage * 100) / 100
  };
}

/**
 * Context-aware keyword suggestion using attention mechanism
 */
export function mlKeywordSuggestions(
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[]
): Array<{
  keyword: string;
  suggestedContext: string;
  insertionPoint: 'experience' | 'skills' | 'summary' | 'projects';
  priority: 'critical' | 'high' | 'medium';
}> {
  const encoder = new ResumeTransformerEncoder(64, 4, 2);

  // Get attention weights for resume
  const attentionData = getAttentionWeights(resumeText);

  // Find low-attention areas (potential insertion points)
  const avgAttention = attentionData.map(item => {
    const sum = item.weights.reduce((a, b) => a + b, 0);
    return {
      token: item.token,
      avgAttention: sum / item.weights.length
    };
  });

  // Sort to find weakest sections
  avgAttention.sort((a, b) => a.avgAttention - b.avgAttention);
  const weakPoints = avgAttention.slice(0, 10);

  // Generate suggestions for each missing keyword
  const suggestions = missingKeywords.map(keyword => {
    // Determine best insertion point based on keyword semantics
    let insertionPoint: 'experience' | 'skills' | 'summary' | 'projects' = 'skills';

    const keywordLower = keyword.toLowerCase();
    if (keywordLower.includes('led') || keywordLower.includes('managed') || keywordLower.includes('developed')) {
      insertionPoint = 'experience';
    } else if (keywordLower.includes('project') || keywordLower.includes('built')) {
      insertionPoint = 'projects';
    } else if (keywordLower.includes('expert') || keywordLower.includes('proficient')) {
      insertionPoint = 'summary';
    }

    // Determine priority based on frequency in JD
    const jdPhrases = extractKeyPhrases(jobDescription, 30);
    const keywordPhrase = jdPhrases.find(p => p.phrase.includes(keyword));
    const score = keywordPhrase?.score || 0;

    let priority: 'critical' | 'high' | 'medium' = 'medium';
    if (score > 3) priority = 'critical';
    else if (score > 2) priority = 'high';

    // Generate contextual suggestion
    const suggestedContext = `Add "${keyword}" to your ${insertionPoint} section. Example: "Utilized ${keyword} to..."`;

    return {
      keyword,
      suggestedContext,
      insertionPoint,
      priority
    };
  });

  return suggestions.slice(0, 15);
}

/**
 * Document diversity score - checks if resume has varied content
 */
export function calculateDiversityScore(text: string): number {
  const phrases = extractKeyPhrases(text, 50);

  if (phrases.length === 0) return 0;

  // Calculate entropy of phrase scores
  const totalScore = phrases.reduce((sum, p) => sum + p.score, 0);
  const probabilities = phrases.map(p => p.score / totalScore);

  const entropy = -probabilities.reduce((sum, p) => {
    return sum + (p > 0 ? p * Math.log2(p) : 0);
  }, 0);

  // Normalize entropy to 0-1 scale
  const maxEntropy = Math.log2(phrases.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

/**
 * Readability and complexity analysis using ML
 */
export function analyzeReadability(text: string): {
  complexity: number; // 0-1, higher = more complex
  vocabularyRichness: number; // 0-1
  avgSentenceLength: number;
  recommendation: string;
} {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);

  const avgSentenceLength = words.length / Math.max(sentences.length, 1);

  // Vocabulary richness = unique words / total words
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const vocabularyRichness = uniqueWords.size / Math.max(words.length, 1);

  // Complexity based on average word length
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1);
  const complexity = Math.min(1, avgWordLength / 8);

  let recommendation = 'Good balance of complexity and readability.';
  if (complexity > 0.7 && avgSentenceLength > 25) {
    recommendation = 'Consider simplifying sentences and using shorter words for better ATS parsing.';
  } else if (complexity < 0.4 && vocabularyRichness < 0.6) {
    recommendation = 'Consider using more varied vocabulary and professional terminology.';
  }

  return {
    complexity: Math.round(complexity * 100) / 100,
    vocabularyRichness: Math.round(vocabularyRichness * 100) / 100,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    recommendation
  };
}
