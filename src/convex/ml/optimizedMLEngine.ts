/**
 * Optimized ML Engine
 * High-performance ML inference with caching and batch processing
 */

// Cache for ML predictions to avoid recomputation
const predictionCache = new Map<string, {
  prediction: number;
  timestamp: number;
  ttl: number;
}>();

// Cache TTL: 1 hour
const CACHE_TTL = 60 * 60 * 1000;

/**
 * Generate cache key from features
 */
function generateCacheKey(features: Record<string, number>): string {
  return Object.entries(features)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value.toFixed(2)}`)
    .join('|');
}

/**
 * Get cached prediction or compute new one
 */
export function getCachedPrediction(
  features: Record<string, number>,
  computeFn: () => number
): number {
  const cacheKey = generateCacheKey(features);
  const cached = predictionCache.get(cacheKey);

  // Return cached if valid
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.prediction;
  }

  // Compute new prediction
  const prediction = computeFn();

  // Cache the result
  predictionCache.set(cacheKey, {
    prediction,
    timestamp: Date.now(),
    ttl: CACHE_TTL
  });

  // Cleanup old cache entries (keep last 1000)
  if (predictionCache.size > 1000) {
    const entries = Array.from(predictionCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    predictionCache.delete(entries[0][0]);
  }

  return prediction;
}

/**
 * Optimized feature extraction with minimal allocations
 */
export function extractFeaturesOptimized(text: string, jobDescription: string): Record<string, number> {
  const textLower = text.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  const textLength = text.length;

  // Pre-compute common values
  const wordCount = text.split(/\s+/).length;
  const jdWords = jdLower.split(/\s+/);

  // Feature extraction with minimal regex operations
  return {
    textLength: textLength / 10000, // Normalize
    wordCount: wordCount / 1000, // Normalize
    hasEmail: textLower.includes('@') ? 1 : 0,
    hasPhone: /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text) ? 1 : 0,
    sectionCount: (text.match(/\n\n/g) || []).length / 10,
    bulletPoints: (text.match(/[•\-\*]/g) || []).length / 50,
    jdOverlap: calculateOverlapFast(textLower, jdWords),
    uppercaseRatio: (text.match(/[A-Z]/g) || []).length / textLength,
    numberDensity: (text.match(/\d/g) || []).length / textLength
  };
}

/**
 * Fast overlap calculation using Set intersection
 */
function calculateOverlapFast(text: string, jdWords: string[]): number {
  const textWords = new Set(text.split(/\s+/));
  let matches = 0;

  for (const word of jdWords) {
    if (word.length > 3 && textWords.has(word)) {
      matches++;
    }
  }

  return Math.min(matches / jdWords.length, 1);
}

/**
 * Batch process multiple predictions efficiently
 */
export function batchPredict(
  items: Array<{ text: string; jobDescription: string }>,
  model: (features: Record<string, number>) => number
): number[] {
  // Extract all features first (can be parallelized)
  const allFeatures = items.map(item =>
    extractFeaturesOptimized(item.text, item.jobDescription)
  );

  // Batch predictions with caching
  return allFeatures.map(features =>
    getCachedPrediction(features, () => model(features))
  );
}

/**
 * Optimized keyword matching with Trie data structure
 */
class KeywordTrie {
  private root: Map<string, any> = new Map();

  add(keyword: string) {
    let node = this.root;
    for (const char of keyword.toLowerCase()) {
      if (!node.has(char)) {
        node.set(char, new Map());
      }
      node = node.get(char);
    }
    node.set('$', true); // End marker
  }

  search(text: string): number {
    let matches = 0;
    const textLower = text.toLowerCase();

    for (let i = 0; i < textLower.length; i++) {
      let node = this.root;
      let j = i;

      while (j < textLower.length && node.has(textLower[j])) {
        node = node.get(textLower[j]);
        j++;

        if (node.has('$')) {
          matches++;
          break;
        }
      }
    }

    return matches;
  }
}

/**
 * Build keyword trie for fast matching
 */
export function buildKeywordTrie(keywords: string[]): KeywordTrie {
  const trie = new KeywordTrie();
  for (const keyword of keywords) {
    if (keyword.length > 2) { // Skip very short keywords
      trie.add(keyword);
    }
  }
  return trie;
}

/**
 * Optimized score calculation with early exit
 */
export function calculateScoreOptimized(
  keywordScore: number,
  formatScore: number,
  completenessScore: number,
  isPremium: boolean,
  mlBoost: number = 0
): number {
  // Early exit for very low scores
  if (keywordScore < 20 && formatScore < 30) {
    return isPremium ? 35 : 25;
  }

  // Weighted calculation
  const weights = isPremium
    ? { keyword: 0.45, format: 0.30, completeness: 0.25 }
    : { keyword: 0.40, format: 0.35, completeness: 0.25 };

  let score =
    keywordScore * weights.keyword +
    formatScore * weights.format +
    completenessScore * weights.completeness;

  // Apply ML boost for premium users
  if (isPremium && mlBoost > 0) {
    score = score * 0.7 + mlBoost * 0.3;
  }

  // Clamp and round
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Memory-efficient text chunking for large resumes
 */
export function* chunkText(text: string, chunkSize: number = 1000): Generator<string> {
  for (let i = 0; i < text.length; i += chunkSize) {
    yield text.slice(i, i + chunkSize);
  }
}

/**
 * Parallel keyword extraction (simulate with batching)
 */
export function extractKeywordsBatch(
  chunks: string[],
  trie: KeywordTrie
): number {
  let totalMatches = 0;

  for (const chunk of chunks) {
    totalMatches += trie.search(chunk);
  }

  return totalMatches;
}

/**
 * Clear prediction cache (for testing or memory management)
 */
export function clearPredictionCache(): void {
  predictionCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number;
  hitRate: number;
  avgAge: number;
} {
  const now = Date.now();
  let totalAge = 0;

  for (const entry of predictionCache.values()) {
    totalAge += now - entry.timestamp;
  }

  return {
    size: predictionCache.size,
    hitRate: 0, // Would need to track hits/misses
    avgAge: predictionCache.size > 0 ? totalAge / predictionCache.size : 0
  };
}
