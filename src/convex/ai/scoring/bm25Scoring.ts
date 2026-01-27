// BM25 Algorithm Implementation - Industry Standard (Better than TF-IDF)
// BM25 (Best Matching 25) is used by Elasticsearch, Lucene, and major search engines
// Provides better ranking than TF-IDF by addressing its known weaknesses:
// 1. Saturation of term frequency (TF-IDF increases linearly, BM25 asymptotically approaches a limit)
// 2. Document length normalization (longer documents aren't unfairly penalized)
// 3. Better handling of common vs rare terms

import { synonymMap, getKeywordsForCategory, type RoleCategory } from "../config/keywords";

export interface BM25Config {
  k1: number;  // Term frequency saturation parameter (default 1.5)
  b: number;   // Length normalization parameter (default 0.75)
  useJobDescriptionCorpus?: boolean;  // Use JD as reference corpus
}

export interface BM25Result {
  term: string;
  score: number;
  frequency: number;
  documentFrequency: number;
  relevance: "critical" | "important" | "moderate" | "low";
}

/**
 * Calculate BM25 score for a single term in a document
 *
 * BM25 Formula:
 * score(term, doc) = IDF(term) * [(f(term, doc) * (k1 + 1)) / (f(term, doc) + k1 * (1 - b + b * (|doc| / avgdl)))]
 *
 * Where:
 * - f(term, doc) = frequency of term in document
 * - |doc| = length of document in words
 * - avgdl = average document length in the corpus
 * - k1 = term frequency saturation parameter (typically 1.5)
 * - b = length normalization (typically 0.75)
 * - IDF = log((N - df + 0.5) / (df + 0.5) + 1), where N = number of docs, df = docs containing term
 */
export function calculateBM25(
  term: string,
  document: string,
  referenceCorpus: string[],
  config: BM25Config = { k1: 1.5, b: 0.75 }
): number {
  const { k1, b } = config;

  // Calculate term frequency in target document
  const termLower = term.toLowerCase();
  const docLower = document.toLowerCase();
  const docWords = docLower.split(/\s+/);

  // Count exact and fuzzy matches
  let termFreq = 0;
  const termRegex = new RegExp(`\\b${termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
  const matches = docLower.match(termRegex);
  termFreq = matches ? matches.length : 0;

  // Check synonyms for additional matches
  const synonyms = synonymMap[termLower] || [];
  for (const syn of synonyms) {
    const synRegex = new RegExp(`\\b${syn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const synMatches = docLower.match(synRegex);
    if (synMatches) {
      termFreq += synMatches.length * 0.8; // Synonym matches weighted at 80%
    }
  }

  if (termFreq === 0) return 0;

  // Document length
  const docLength = docWords.length;

  // Calculate average document length across corpus
  const avgDocLength = referenceCorpus.reduce((sum, doc) => {
    return sum + doc.split(/\s+/).length;
  }, 0) / referenceCorpus.length;

  // Calculate document frequency (how many docs contain this term)
  let documentFrequency = 0;
  for (const doc of referenceCorpus) {
    const docRegex = new RegExp(`\\b${termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (docRegex.test(doc)) {
      documentFrequency++;
    }
  }

  // Calculate IDF with BM25 formula (better than standard IDF)
  const N = referenceCorpus.length;
  const idf = Math.log((N - documentFrequency + 0.5) / (documentFrequency + 0.5) + 1);

  // Calculate BM25 score
  const numerator = termFreq * (k1 + 1);
  const denominator = termFreq + k1 * (1 - b + b * (docLength / avgDocLength));
  const bm25Score = idf * (numerator / denominator);

  return bm25Score;
}

/**
 * Enhanced BM25 scoring with context awareness
 * This extends vanilla BM25 with domain-specific optimizations
 */
export function calculateContextualBM25(
  term: string,
  document: string,
  referenceCorpus: string[],
  config: BM25Config = { k1: 1.5, b: 0.75 }
): BM25Result {
  const baseBM25Score = calculateBM25(term, document, referenceCorpus, config);

  // Context multipliers for resume-specific optimization
  let contextMultiplier = 1.0;
  const termLower = term.toLowerCase();
  const docLower = document.toLowerCase();

  // 1. Recency bonus - terms in first 30% of document are more relevant
  const firstThird = document.substring(0, document.length * 0.3).toLowerCase();
  const termInFirstThird = firstThird.includes(termLower);
  if (termInFirstThird) {
    contextMultiplier *= 1.25; // 25% boost for recent experience
  }

  // 2. Context patterns - check if term appears with action verbs or experience keywords
  const actionContext = [
    `(developed|built|designed|implemented|created|led|managed|architected).*${termLower}`,
    `${termLower}.*(experience|project|system|solution|platform|application)`
  ];

  const hasStrongContext = actionContext.some(pattern =>
    new RegExp(pattern, 'i').test(docLower)
  );

  if (hasStrongContext) {
    contextMultiplier *= 1.3; // 30% boost for strong context
  }

  // 3. Skill proficiency indicators
  const proficiencyPattern = new RegExp(
    `(expert|proficient|advanced|senior|lead|principal).*${termLower}|${termLower}.*(expert|proficient|advanced)`,
    'i'
  );

  if (proficiencyPattern.test(docLower)) {
    contextMultiplier *= 1.2; // 20% boost for demonstrated proficiency
  }

  // 4. Quantifiable results near the term
  const hasMetrics = /\d+%|\$\d+|[0-9]+x|[0-9]+ (users|customers|teams|projects)/i.test(
    docLower.substring(
      Math.max(0, docLower.indexOf(termLower) - 100),
      Math.min(docLower.length, docLower.indexOf(termLower) + 100)
    )
  );

  if (hasMetrics) {
    contextMultiplier *= 1.15; // 15% boost for quantifiable impact
  }

  const finalScore = baseBM25Score * contextMultiplier;

  // Count term frequency for reporting
  const termRegex = new RegExp(`\\b${termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const matches = docLower.match(termRegex);
  const frequency = matches ? matches.length : 0;

  // Count document frequency
  let documentFrequency = 0;
  for (const doc of referenceCorpus) {
    if (new RegExp(`\\b${termLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(doc)) {
      documentFrequency++;
    }
  }

  // Determine relevance tier based on final score
  let relevance: "critical" | "important" | "moderate" | "low";
  if (finalScore > 8.0) relevance = "critical";
  else if (finalScore > 5.0) relevance = "important";
  else if (finalScore > 2.0) relevance = "moderate";
  else relevance = "low";

  return {
    term,
    score: finalScore,
    frequency,
    documentFrequency,
    relevance
  };
}

/**
 * Extract and rank keywords from job description using BM25
 * This replaces the TF-IDF approach with superior BM25 ranking
 */
export function extractKeywordsWithBM25(
  jobDescription: string,
  resume: string,
  category: RoleCategory,
  topN: number = 50
): BM25Result[] {
  if (!jobDescription || jobDescription.trim().length === 0) {
    return [];
  }

  const jdLower = jobDescription.toLowerCase();
  const jdWords = jdLower.match(/\b[a-z0-9]+\b/g) || [];

  // Build reference corpus (JD + resume for context)
  const referenceCorpus = [jobDescription, resume];

  // Stop words to exclude
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'we', 'you', 'they', 'our', 'your', 'their', 'from', 'by', 'about',
    'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out',
    'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
    'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
  ]);

  // Extract candidate terms (unigrams, bigrams, trigrams)
  const candidateTerms = new Set<string>();

  // Unigrams
  jdWords.forEach(word => {
    if (word.length >= 3 && !stopWords.has(word)) {
      candidateTerms.add(word);
    }
  });

  // Bigrams
  for (let i = 0; i < jdWords.length - 1; i++) {
    const word1 = jdWords[i];
    const word2 = jdWords[i + 1];

    if (word1.length >= 3 && word2.length >= 3 && (!stopWords.has(word1) || !stopWords.has(word2))) {
      const bigram = `${word1} ${word2}`;
      if (bigram.length >= 6) {
        candidateTerms.add(bigram);
      }
    }
  }

  // Trigrams (for technical phrases)
  for (let i = 0; i < jdWords.length - 2; i++) {
    const word1 = jdWords[i];
    const word2 = jdWords[i + 1];
    const word3 = jdWords[i + 2];

    if (word1.length >= 3 && word3.length >= 3 && (!stopWords.has(word1) && !stopWords.has(word3))) {
      const trigram = `${word1} ${word2} ${word3}`;
      if (trigram.length >= 10) {
        candidateTerms.add(trigram);
      }
    }
  }

  // Add category-relevant keywords as candidates
  const categoryKeywords = getKeywordsForCategory(category);
  categoryKeywords.forEach(kw => {
    if (jdLower.includes(kw.toLowerCase())) {
      candidateTerms.add(kw.toLowerCase());
    }
  });

  // Calculate BM25 scores for all candidate terms
  const bm25Results: BM25Result[] = [];

  for (const term of candidateTerms) {
    const result = calculateContextualBM25(term, jobDescription, referenceCorpus, {
      k1: 1.5,
      b: 0.75
    });

    // Only include terms with meaningful scores
    if (result.score > 0.5) {
      bm25Results.push(result);
    }
  }

  // Sort by BM25 score (descending) and return top N
  return bm25Results
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Calculate overall keyword match score using BM25
 * This is a drop-in replacement for the TF-IDF based scoring
 */
export function calculateBM25KeywordScore(
  resume: string,
  jobDescription: string | undefined,
  category: RoleCategory,
  maxScore: number = 30
): number {
  if (!jobDescription || jobDescription.trim().length === 0) {
    // Fallback to category-based scoring without JD
    return calculateCategoryBasedBM25Score(resume, category, maxScore);
  }

  // Extract top keywords from JD using BM25
  const topKeywords = extractKeywordsWithBM25(jobDescription, resume, category, 50);

  // Calculate match score based on how many top keywords appear in resume
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const keyword of topKeywords) {
    const resumeResult = calculateContextualBM25(keyword.term, resume, [jobDescription, resume]);

    // Weight by JD importance (higher BM25 score in JD = more important)
    const importance = keyword.score / 10; // Normalize
    maxPossibleScore += importance;

    if (resumeResult.score > 0) {
      // Award points based on presence and quality in resume
      const matchQuality = Math.min(1.0, resumeResult.score / keyword.score);
      totalScore += importance * matchQuality;
    }
  }

  // Normalize to maxScore
  const normalizedScore = maxPossibleScore > 0
    ? (totalScore / maxPossibleScore) * maxScore
    : 0;

  return Math.min(maxScore, Math.round(normalizedScore * 10) / 10);
}

/**
 * Category-based BM25 scoring (when no JD is provided)
 */
function calculateCategoryBasedBM25Score(
  resume: string,
  category: RoleCategory,
  maxScore: number
): number {
  const categoryKeywords = getKeywordsForCategory(category);
  const referenceCorpus = [resume]; // Use resume itself as corpus

  let totalScore = 0;
  let keywordsFound = 0;

  // Sample top keywords from category (top 100)
  const topCategoryKeywords = categoryKeywords.slice(0, 100);

  for (const keyword of topCategoryKeywords) {
    const result = calculateContextualBM25(keyword, resume, referenceCorpus, {
      k1: 1.2, // Slightly lower k1 for category matching
      b: 0.75
    });

    if (result.score > 0) {
      keywordsFound++;
      totalScore += result.score;
    }
  }

  // Normalize based on coverage and quality
  const coverage = keywordsFound / topCategoryKeywords.length;
  const avgQuality = totalScore / (keywordsFound || 1);

  // Combined score: 60% coverage, 40% quality
  const normalizedScore = (coverage * 0.6 + Math.min(1.0, avgQuality / 5.0) * 0.4) * maxScore;

  return Math.min(maxScore, Math.round(normalizedScore * 10) / 10);
}
