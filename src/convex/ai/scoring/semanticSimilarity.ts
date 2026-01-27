/**
 * Semantic Similarity Engine
 *
 * Goes beyond simple keyword matching to understand MEANING and CONTEXT
 * Uses TF-IDF vectorization + cosine similarity for document comparison
 *
 * This is what separates elite ATS tools from basic keyword matchers:
 * - Jobscan: Simple word matching ❌
 * - CVDebug: Semantic understanding ✅
 */

import { synonymMap } from "../config/keywords";

export interface SemanticScore {
  similarity: number; // 0-1 score
  matchedConcepts: string[];
  semanticGaps: string[];
  contextualRelevance: number; // 0-100
  explanation: string;
}

export interface TFIDFVector {
  [term: string]: number;
}

/**
 * Calculate Term Frequency (TF)
 * How often a term appears in a document
 */
function calculateTF(term: string, document: string): number {
  const words = document.toLowerCase().split(/\s+/);
  const termCount = words.filter(w => w === term.toLowerCase()).length;
  return termCount / words.length;
}

/**
 * Calculate Inverse Document Frequency (IDF)
 * How rare/important a term is across all documents
 */
function calculateIDF(term: string, documents: string[]): number {
  const docsWithTerm = documents.filter(doc =>
    doc.toLowerCase().includes(term.toLowerCase())
  ).length;

  if (docsWithTerm === 0) return 0;

  return Math.log(documents.length / docsWithTerm);
}

/**
 * Create TF-IDF vector representation of a document
 * This converts text into a mathematical vector for comparison
 */
export function createTFIDFVector(
  document: string,
  corpus: string[],
  maxFeatures: number = 100
): TFIDFVector {
  const vector: TFIDFVector = {};

  // Extract all unique terms
  const words = document.toLowerCase().split(/\s+/);
  const uniqueTerms = new Set(words.filter(w => w.length > 2)); // Filter out short words

  // Calculate TF-IDF for each term
  const tfidfScores: Array<{ term: string; score: number }> = [];

  for (const term of uniqueTerms) {
    const tf = calculateTF(term, document);
    const idf = calculateIDF(term, corpus);
    const tfidf = tf * idf;

    if (tfidf > 0) {
      tfidfScores.push({ term, score: tfidf });
    }
  }

  // Keep only top features
  const topFeatures = tfidfScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxFeatures);

  for (const { term, score } of topFeatures) {
    vector[term] = score;
  }

  return vector;
}

/**
 * Calculate Cosine Similarity between two vectors
 * Measures how similar two documents are (0 = completely different, 1 = identical)
 */
export function cosineSimilarity(vectorA: TFIDFVector, vectorB: TFIDFVector): number {
  const allTerms = new Set([...Object.keys(vectorA), ...Object.keys(vectorB)]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const term of allTerms) {
    const a = vectorA[term] || 0;
    const b = vectorB[term] || 0;

    dotProduct += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Enhanced Semantic Similarity with Synonym Expansion
 * Expands documents with synonyms before comparison
 */
export function calculateSemanticSimilarity(
  resume: string,
  jobDescription: string
): SemanticScore {
  // Expand both documents with synonyms
  const expandedResume = expandWithSynonyms(resume);
  const expandedJD = expandWithSynonyms(jobDescription);

  // Create corpus (collection of documents)
  const corpus = [expandedResume, expandedJD];

  // Create TF-IDF vectors
  const resumeVector = createTFIDFVector(expandedResume, corpus, 150);
  const jdVector = createTFIDFVector(expandedJD, corpus, 150);

  // Calculate cosine similarity
  const similarity = cosineSimilarity(resumeVector, jdVector);

  // Find matched concepts (terms present in both with high scores)
  const matchedConcepts: string[] = [];
  const semanticGaps: string[] = [];

  for (const term of Object.keys(jdVector)) {
    if (jdVector[term] > 0.01) { // Only consider significant terms
      if (resumeVector[term] && resumeVector[term] > 0.005) {
        matchedConcepts.push(term);
      } else {
        semanticGaps.push(term);
      }
    }
  }

  // Sort by importance
  matchedConcepts.sort((a, b) => (jdVector[b] || 0) - (jdVector[a] || 0));
  semanticGaps.sort((a, b) => (jdVector[b] || 0) - (jdVector[a] || 0));

  // Calculate contextual relevance (0-100)
  const contextualRelevance = Math.round(similarity * 100);

  // Generate explanation
  let explanation = "";
  if (similarity >= 0.75) {
    explanation = "Excellent semantic match - Your experience aligns strongly with the role requirements";
  } else if (similarity >= 0.6) {
    explanation = "Good semantic match - Your background is relevant with some gaps to address";
  } else if (similarity >= 0.45) {
    explanation = "Moderate semantic match - Consider emphasizing transferable skills";
  } else {
    explanation = "Low semantic match - Significant skill gaps detected, focus on relevant experience";
  }

  return {
    similarity: Math.round(similarity * 1000) / 1000, // 3 decimal precision
    matchedConcepts: matchedConcepts.slice(0, 15), // Top 15
    semanticGaps: semanticGaps.slice(0, 10), // Top 10 gaps
    contextualRelevance,
    explanation
  };
}

/**
 * Expand document with synonyms for better matching
 * Example: "javascript" → "javascript js ecmascript node.js"
 */
function expandWithSynonyms(text: string): string {
  let expanded = text;

  for (const [keyword, synonyms] of Object.entries(synonymMap)) {
    const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (keywordRegex.test(text)) {
      // Add synonyms to the text
      expanded += " " + synonyms.join(" ");
    }
  }

  return expanded;
}

/**
 * Calculate Jaccard Similarity (set-based similarity)
 * Useful for understanding skill overlap
 */
export function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}

/**
 * Extract skill sets from text
 */
function extractSkills(text: string): Set<string> {
  const skills = new Set<string>();
  const textLower = text.toLowerCase();

  // Check all keywords from synonymMap
  for (const keyword of Object.keys(synonymMap)) {
    if (textLower.includes(keyword.toLowerCase())) {
      skills.add(keyword);
    }
  }

  return skills;
}

/**
 * Calculate skill overlap percentage
 */
export function calculateSkillOverlap(resume: string, jobDescription: string): {
  overlapPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  totalJDSkills: number;
} {
  const resumeSkills = extractSkills(resume);
  const jdSkills = extractSkills(jobDescription);

  const matchedSkills = [...resumeSkills].filter(skill => jdSkills.has(skill));
  const missingSkills = [...jdSkills].filter(skill => !resumeSkills.has(skill));

  const overlapPercentage = jdSkills.size > 0
    ? Math.round((matchedSkills.length / jdSkills.size) * 100)
    : 0;

  return {
    overlapPercentage,
    matchedSkills,
    missingSkills,
    totalJDSkills: jdSkills.size
  };
}

/**
 * Advanced: Calculate Contextual Relevance Score
 * Considers not just WHAT skills you have, but HOW relevant they are in context
 */
export function calculateContextualRelevance(
  resume: string,
  jobDescription: string
): {
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
} {
  const semantic = calculateSemanticSimilarity(resume, jobDescription);
  const skillOverlap = calculateSkillOverlap(resume, jobDescription);

  // Weighted scoring
  const semanticWeight = 0.6; // 60% weight to semantic similarity
  const skillWeight = 0.4;    // 40% weight to skill overlap

  const score = Math.round(
    (semantic.contextualRelevance * semanticWeight) +
    (skillOverlap.overlapPercentage * skillWeight)
  );

  // Identify strengths
  const strengths: string[] = [];
  if (semantic.contextualRelevance >= 75) {
    strengths.push("Strong semantic alignment with role requirements");
  }
  if (skillOverlap.overlapPercentage >= 70) {
    strengths.push(`Excellent skill match (${skillOverlap.overlapPercentage}% overlap)`);
  }
  if (semantic.matchedConcepts.length >= 10) {
    strengths.push(`${semantic.matchedConcepts.length} key concepts matched`);
  }

  // Identify weaknesses
  const weaknesses: string[] = [];
  if (semantic.contextualRelevance < 60) {
    weaknesses.push("Semantic alignment could be stronger - focus on role-specific terminology");
  }
  if (skillOverlap.overlapPercentage < 50) {
    weaknesses.push(`Only ${skillOverlap.overlapPercentage}% skill overlap - add missing skills`);
  }
  if (semantic.semanticGaps.length > 5) {
    weaknesses.push(`${semantic.semanticGaps.length} important concepts missing from resume`);
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (skillOverlap.missingSkills.length > 0) {
    const topMissing = skillOverlap.missingSkills.slice(0, 5).join(", ");
    recommendations.push(`Add these critical skills: ${topMissing}`);
  }

  if (semantic.semanticGaps.length > 0) {
    const topGaps = semantic.semanticGaps.slice(0, 3).join(", ");
    recommendations.push(`Incorporate terminology around: ${topGaps}`);
  }

  if (score < 70) {
    recommendations.push("Tailor your resume more specifically to this role's requirements");
  }

  return {
    score,
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    recommendations: recommendations.slice(0, 5)
  };
}
