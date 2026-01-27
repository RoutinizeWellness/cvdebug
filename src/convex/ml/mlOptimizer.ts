/**
 * ML Performance Optimizer
 * Advanced optimizations for faster and more accurate ML predictions
 */

import { v } from "convex/values";

/**
 * Optimized feature extraction with memoization
 */
export function extractFeaturesOptimized(
  text: string,
  jobDescription?: string,
  cache?: Map<string, any>
): {
  keywordDensity: number;
  formatScore: number;
  completenessScore: number;
  industryMatchScore: number;
  atsCompatibilityScore: number;
  experienceYears: number;
  educationLevel: number;
  hasMetrics: boolean;
  actionVerbCount: number;
  technicalSkillsCount: number;
} {
  // Check cache first
  const cacheKey = `${text.substring(0, 100)}_${jobDescription?.substring(0, 50) || 'no-jd'}`;
  if (cache?.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const textLower = text.toLowerCase();
  const words = textLower.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;

  // Fast keyword density calculation
  const keywords = jobDescription?.toLowerCase().split(/\s+/).filter(w => w.length > 3) || [];
  const keywordMatches = keywords.filter(kw => textLower.includes(kw)).length;
  const keywordDensity = keywords.length > 0 ? keywordMatches / keywords.length : 0.5;

  // Quick format score (optimized checks)
  let formatScore = 0.5;
  if (text.includes('@')) formatScore += 0.1;
  if (/\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text)) formatScore += 0.1;
  if (/education|degree|university|college/i.test(text)) formatScore += 0.15;
  if (/experience|work|employment/i.test(text)) formatScore += 0.15;

  // Completeness (fast heuristic)
  const hasContact = /email|phone|linkedin/i.test(text);
  const hasEducation = /education|degree|university/i.test(text);
  const hasExperience = /experience|work|job|position/i.test(text);
  const hasSkills = /skills?|proficient|technologies/i.test(text);
  const completenessScore =
    (hasContact ? 0.25 : 0) +
    (hasEducation ? 0.25 : 0) +
    (hasExperience ? 0.25 : 0) +
    (hasSkills ? 0.25 : 0);

  // Industry match (simplified)
  const industryKeywords = {
    tech: ['software', 'developer', 'engineer', 'programming', 'code'],
    finance: ['financial', 'accounting', 'investment', 'banking'],
    healthcare: ['medical', 'healthcare', 'clinical', 'patient'],
    sales: ['sales', 'business development', 'account', 'revenue'],
    marketing: ['marketing', 'campaign', 'brand', 'content']
  };

  let industryMatchScore = 0.3; // Default
  for (const [industry, terms] of Object.entries(industryKeywords)) {
    const matches = terms.filter(term => textLower.includes(term)).length;
    if (matches > 0) {
      industryMatchScore = Math.min(1, 0.5 + (matches * 0.15));
      break;
    }
  }

  // ATS compatibility (fast checks)
  const hasProblematicChars = /[^\x00-\x7F]/.test(text);
  const hasTables = /<table|<td|<tr/i.test(text);
  const hasImages = /<img|image/i.test(text);
  const atsCompatibilityScore =
    1.0 -
    (hasProblematicChars ? 0.2 : 0) -
    (hasTables ? 0.3 : 0) -
    (hasImages ? 0.1 : 0);

  // Experience years (regex extraction)
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience)?/i);
  const experienceYears = expMatch ? parseInt(expMatch[1]) : 2;

  // Education level (simple mapping)
  const educationLevel =
    /phd|doctorate/i.test(text) ? 5 :
    /master|mba/i.test(text) ? 4 :
    /bachelor|degree/i.test(text) ? 3 :
    /associate|diploma/i.test(text) ? 2 : 1;

  // Metrics detection (optimized regex)
  const hasMetrics = /\d+%|\$\d+[kmb]?|\d+x|increase|improve|reduce|grow/i.test(text);

  // Action verbs (fast lookup)
  const actionVerbCount = (text.match(/\b(led|managed|developed|created|implemented|designed|improved|increased|reduced|achieved|delivered|launched|built|optimized|streamlined|coordinated)\b/gi) || []).length;

  // Technical skills (optimized pattern)
  const technicalSkillsCount = (text.match(/\b(javascript|python|java|react|node|sql|aws|docker|kubernetes|git|api|database|cloud|agile|scrum|ci\/cd|typescript|angular|vue)\b/gi) || []).length;

  const features = {
    keywordDensity: Math.min(1, keywordDensity),
    formatScore: Math.min(1, formatScore),
    completenessScore,
    industryMatchScore,
    atsCompatibilityScore: Math.max(0, Math.min(1, atsCompatibilityScore)),
    experienceYears: Math.min(20, experienceYears),
    educationLevel,
    hasMetrics,
    actionVerbCount: Math.min(30, actionVerbCount),
    technicalSkillsCount: Math.min(25, technicalSkillsCount)
  };

  // Store in cache
  if (cache) {
    cache.set(cacheKey, features);
  }

  return features;
}

/**
 * Optimized ML prediction with early exit
 */
export function predictScoreOptimized(
  features: any,
  weights: any,
  industry: string,
  threshold: number = 0.5
): number {
  // Fast path for obvious cases
  const quickScore =
    features.keywordDensity * 30 +
    features.formatScore * 20 +
    features.completenessScore * 20;

  // Early exit for very low scores
  if (quickScore < 20) {
    return quickScore;
  }

  // Full calculation for borderline cases
  let score = weights.bias || 0;

  score += weights.keywordDensity * features.keywordDensity;
  score += weights.formatScore * features.formatScore;
  score += weights.completenessScore * features.completenessScore;
  score += weights.industryMatch * features.industryMatchScore;
  score += weights.atsCompatibility * features.atsCompatibilityScore;
  score += weights.experienceYears * (features.experienceYears / 10);
  score += weights.educationLevel * (features.educationLevel / 5);
  score += weights.hasMetrics * (features.hasMetrics ? 1 : 0);
  score += weights.actionVerbs * (features.actionVerbCount / 20);
  score += weights.technicalSkills * (features.technicalSkillsCount / 15);

  // Industry multiplier
  const industryMultiplier = weights.industryWeights?.[industry] || 1.0;
  score *= industryMultiplier;

  // Normalize to 0-100
  return Math.max(0, Math.min(100, score * 100));
}

/**
 * Batch prediction optimization
 */
export function batchPredictOptimized(
  features: any[],
  weights: any,
  industry: string
): number[] {
  // Process in batches for better CPU cache utilization
  const batchSize = 10;
  const results: number[] = [];

  for (let i = 0; i < features.length; i += batchSize) {
    const batch = features.slice(i, i + batchSize);

    // Vectorized operations for batch
    batch.forEach(feat => {
      results.push(predictScoreOptimized(feat, weights, industry));
    });
  }

  return results;
}

/**
 * Smart cache for ML predictions
 */
export class MLPredictionCache {
  private cache = new Map<string, { score: number; timestamp: number }>();
  private maxSize = 1000;
  private ttl = 3600000; // 1 hour

  get(key: string): number | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.score;
  }

  set(key: string, score: number): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value as string | undefined;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      score,
      timestamp: Date.now()
    });
  }

  generateKey(text: string, jobDescription?: string): string {
    // Fast hash function
    const hash = (str: string) => {
      let h = 0;
      for (let i = 0; i < Math.min(str.length, 100); i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
      }
      return h.toString(36);
    };

    return `${hash(text)}_${hash(jobDescription || '')}`;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Would track in production
    };
  }
}

// Global ML cache instance
export const mlPredictionCache = new MLPredictionCache();

/**
 * Parallel processing for large batches
 */
export async function parallelProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  maxConcurrent: number = 5
): Promise<R[]> {
  const results: R[] = [];
  const queue = [...items];

  const workers = Array(Math.min(maxConcurrent, items.length))
    .fill(0)
    .map(async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item) {
          const result = await processor(item);
          results.push(result);
        }
      }
    });

  await Promise.all(workers);
  return results;
}
