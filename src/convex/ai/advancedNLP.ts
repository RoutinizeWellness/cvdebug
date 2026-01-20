// Advanced NLP Engine - 100% Local, No External APIs
// Uses TF-IDF, Cosine Similarity, and Pattern Matching

export interface DocumentVector {
  terms: Map<string, number>; // term -> frequency
  magnitude: number; // for cosine similarity
}

/**
 * TF-IDF (Term Frequency - Inverse Document Frequency)
 * Identifies the most important keywords in a document
 */
export function calculateTFIDF(document: string, corpus: string[]): Map<string, number> {
  const tokens = tokenize(document);
  const termFrequency = calculateTermFrequency(tokens);
  const idf = calculateIDF(corpus);

  const tfidf = new Map<string, number>();

  termFrequency.forEach((tf, term) => {
    const idfScore = idf.get(term) || 0;
    tfidf.set(term, tf * idfScore);
  });

  return tfidf;
}

/**
 * Tokenize text into meaningful terms (n-grams)
 */
function tokenize(text: string): string[] {
  const cleaned = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ');
  const tokens: string[] = [];

  // Unigrams (single words)
  words.forEach(word => {
    if (word.length > 2 && !isStopWord(word)) {
      tokens.push(word);
    }
  });

  // Bigrams (two-word phrases)
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (!isStopWord(words[i]) && !isStopWord(words[i + 1])) {
      tokens.push(bigram);
    }
  }

  // Trigrams (three-word phrases)
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (!isStopWord(words[i]) && !isStopWord(words[i + 1]) && !isStopWord(words[i + 2])) {
      tokens.push(trigram);
    }
  }

  return tokens;
}

/**
 * Calculate term frequency (TF)
 */
function calculateTermFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const total = tokens.length;

  tokens.forEach(token => {
    tf.set(token, (tf.get(token) || 0) + 1);
  });

  // Normalize by total count
  tf.forEach((count, term) => {
    tf.set(term, count / total);
  });

  return tf;
}

/**
 * Calculate inverse document frequency (IDF)
 */
function calculateIDF(corpus: string[]): Map<string, number> {
  const idf = new Map<string, number>();
  const documentCount = corpus.length;

  // Count how many documents contain each term
  const termDocCount = new Map<string, number>();

  corpus.forEach(doc => {
    const terms = new Set(tokenize(doc));
    terms.forEach(term => {
      termDocCount.set(term, (termDocCount.get(term) || 0) + 1);
    });
  });

  // Calculate IDF for each term
  termDocCount.forEach((docCount, term) => {
    idf.set(term, Math.log(documentCount / docCount));
  });

  return idf;
}

/**
 * Stop words (common words to ignore)
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
  'that', 'these', 'those', 'you', 'your', 'we', 'our', 'they', 'their',
  'it', 'its', 'he', 'she', 'him', 'her', 'his', 'about', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
]);

function isStopWord(word: string): boolean {
  return STOP_WORDS.has(word.toLowerCase());
}

/**
 * Cosine Similarity - Measure how similar two documents are
 */
export function cosineSimilarity(doc1: string, doc2: string): number {
  const vec1 = createDocumentVector(doc1);
  const vec2 = createDocumentVector(doc2);

  let dotProduct = 0;

  vec1.terms.forEach((freq1, term) => {
    const freq2 = vec2.terms.get(term) || 0;
    dotProduct += freq1 * freq2;
  });

  if (vec1.magnitude === 0 || vec2.magnitude === 0) {
    return 0;
  }

  return dotProduct / (vec1.magnitude * vec2.magnitude);
}

/**
 * Create document vector for cosine similarity
 */
function createDocumentVector(text: string): DocumentVector {
  const tokens = tokenize(text);
  const terms = new Map<string, number>();

  tokens.forEach(token => {
    terms.set(token, (terms.get(token) || 0) + 1);
  });

  // Calculate magnitude
  let magnitude = 0;
  terms.forEach(freq => {
    magnitude += freq * freq;
  });
  magnitude = Math.sqrt(magnitude);

  return { terms, magnitude };
}

/**
 * Extract key phrases using TF-IDF
 */
export function extractKeyPhrases(text: string, topN: number = 20): Array<{ phrase: string; score: number }> {
  // Use text as its own corpus for basic TF-IDF
  const corpus = [text];
  const tfidf = calculateTFIDF(text, corpus);

  // Sort by score
  const phrases = Array.from(tfidf.entries())
    .map(([phrase, score]) => ({ phrase, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return phrases;
}

/**
 * Semantic similarity using word embeddings (simplified)
 * Based on word co-occurrence patterns
 */
export function semanticSimilarity(word1: string, word2: string, context: string): number {
  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();

  // Exact match
  if (w1 === w2) return 1.0;

  // Check synonyms
  const synonymScore = checkSynonyms(w1, w2);
  if (synonymScore > 0) return synonymScore;

  // Check co-occurrence in context
  const cooccurrence = calculateCooccurrence(w1, w2, context);

  return cooccurrence;
}

/**
 * Check if two words are synonyms
 */
function checkSynonyms(word1: string, word2: string): number {
  const synonymGroups = [
    ['lead', 'manage', 'oversee', 'direct', 'supervise'],
    ['develop', 'build', 'create', 'implement', 'design'],
    ['optimize', 'improve', 'enhance', 'streamline'],
    ['collaborate', 'work with', 'partner', 'coordinate'],
    ['analyze', 'evaluate', 'assess', 'review'],
    ['javascript', 'js', 'ecmascript'],
    ['typescript', 'ts'],
    ['kubernetes', 'k8s'],
    ['postgresql', 'postgres', 'psql'],
    ['mongodb', 'mongo'],
    ['react', 'reactjs', 'react.js'],
    ['node', 'nodejs', 'node.js'],
    ['aws', 'amazon web services'],
    ['gcp', 'google cloud platform', 'google cloud'],
    ['azure', 'microsoft azure']
  ];

  for (const group of synonymGroups) {
    if (group.includes(word1) && group.includes(word2)) {
      return 0.9; // High similarity for synonyms
    }
  }

  return 0;
}

/**
 * Calculate word co-occurrence score
 */
function calculateCooccurrence(word1: string, word2: string, context: string): number {
  const contextLower = context.toLowerCase();
  const words = contextLower.split(/\s+/);

  let cooccurrences = 0;
  const windowSize = 5; // Look within 5 words

  for (let i = 0; i < words.length; i++) {
    if (words[i] === word1) {
      // Check if word2 appears within window
      for (let j = Math.max(0, i - windowSize); j < Math.min(words.length, i + windowSize); j++) {
        if (words[j] === word2) {
          cooccurrences++;
        }
      }
    }
  }

  return Math.min(cooccurrences / 10, 0.5); // Cap at 0.5 similarity
}

/**
 * Extract entities using pattern matching and context
 */
export interface ExtractedPhrase {
  text: string;
  type: 'skill' | 'action' | 'metric' | 'tool' | 'unknown';
  context: string;
  importance: number; // 0-1 score
}

export function extractEntitiesML(text: string): ExtractedPhrase[] {
  const entities: ExtractedPhrase[] = [];

  // Pattern 1: Action verbs + noun phrases
  const actionPattern = /\b(developed?|built?|created?|implemented?|designed?|managed?|led|optimized?|improved?|enhanced?|analyzed?|evaluated?)\s+([a-z\s]{3,40})\b/gi;
  let match;

  while ((match = actionPattern.exec(text)) !== null) {
    const fullMatch = match[0];
    const verb = match[1];
    const object = match[2].trim();

    entities.push({
      text: fullMatch,
      type: 'action',
      context: extractContextWindow(text, match.index, 80),
      importance: 0.8
    });
  }

  // Pattern 2: Years of experience
  const experiencePattern = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp\.?)/gi;
  while ((match = experiencePattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'metric',
      context: extractContextWindow(text, match.index, 60),
      importance: 0.9
    });
  }

  // Pattern 3: Technical tools (capitalized or known terms)
  const toolPattern = /\b([A-Z][a-z]+(?:\.[a-z]+)?|AWS|GCP|SQL|NoSQL|API|CI\/CD|DevOps)\b/g;
  while ((match = toolPattern.exec(text)) !== null) {
    const tool = match[1];

    // Filter out common words
    if (!['The', 'This', 'That', 'These', 'Those', 'And', 'But', 'Or'].includes(tool)) {
      entities.push({
        text: tool,
        type: 'tool',
        context: extractContextWindow(text, match.index, 60),
        importance: 0.7
      });
    }
  }

  // Pattern 4: Percentages and metrics
  const metricPattern = /(\d+)%|\$\d+[KMB]?|(\d+[\+]?\s*(users?|customers?|million|thousand|billion))/gi;
  while ((match = metricPattern.exec(text)) !== null) {
    entities.push({
      text: match[0],
      type: 'metric',
      context: extractContextWindow(text, match.index, 60),
      importance: 0.85
    });
  }

  return entities;
}

/**
 * Extract context window around a match
 */
function extractContextWindow(text: string, index: number, windowSize: number): string {
  const start = Math.max(0, index - windowSize / 2);
  const end = Math.min(text.length, index + windowSize / 2);
  return text.substring(start, end).trim();
}

/**
 * Sentence similarity using word overlap
 */
export function sentenceSimilarity(sent1: string, sent2: string): number {
  const words1 = new Set(tokenize(sent1));
  const words2 = new Set(tokenize(sent2));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size; // Jaccard similarity
}

/**
 * Find the most relevant section in resume for a missing skill
 */
export function findBestInsertionPoint(
  resumeText: string,
  missingSkill: string,
  skillCategory: string
): { section: string; reason: string; exampleText: string } {
  // Split resume into sections
  const sections = splitIntoSections(resumeText);

  let bestSection = 'Experience';
  let bestScore = 0;
  let exampleText = '';

  sections.forEach(section => {
    // Calculate relevance score based on section type and content
    let score = 0;

    // Prefer Experience section for most skills
    if (section.title.toLowerCase().includes('experience') || section.title.toLowerCase().includes('work')) {
      score += 0.5;
    }

    // Prefer Skills section for tool mentions
    if ((section.title.toLowerCase().includes('skill') || section.title.toLowerCase().includes('technical')) &&
        skillCategory === 'tool') {
      score += 0.6;
    }

    // Check semantic similarity with section content
    const similarity = cosineSimilarity(section.content, missingSkill);
    score += similarity * 0.4;

    if (score > bestScore) {
      bestScore = score;
      bestSection = section.title;

      // Extract a relevant sentence from this section
      const sentences = section.content.split(/[.!?]+/);
      exampleText = sentences[0]?.trim() || '';
    }
  });

  const reason = generateInsertionReason(bestSection, missingSkill, skillCategory);

  return { section: bestSection, reason, exampleText };
}

/**
 * Split resume into logical sections
 */
function splitIntoSections(text: string): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = [];

  // Common section headers
  const headerPattern = /^(experience|education|skills?|projects?|certifications?|summary|about|work history|employment|technical skills?|achievements?|awards?)$/im;

  const lines = text.split('\n');
  let currentSection = { title: 'Other', content: '' };

  lines.forEach(line => {
    const trimmed = line.trim();

    if (headerPattern.test(trimmed)) {
      // Save previous section
      if (currentSection.content) {
        sections.push(currentSection);
      }
      // Start new section
      currentSection = { title: trimmed, content: '' };
    } else {
      currentSection.content += line + '\n';
    }
  });

  // Add last section
  if (currentSection.content) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Generate specific reason for insertion point
 */
function generateInsertionReason(section: string, skill: string, category: string): string {
  if (section.toLowerCase().includes('experience')) {
    return `Añade "${skill}" en tu Experience section dentro de un proyecto relevante. Describe HOW you used it, not just that you used it.`;
  }

  if (section.toLowerCase().includes('skill')) {
    return `Añade "${skill}" en tu Skills section, pero también referéncialo en un proyecto específico para dar contexto.`;
  }

  if (section.toLowerCase().includes('project')) {
    return `Crea un proyecto que demuestre tu uso de "${skill}". Los recruiters buscan ejemplos concretos, no listas.`;
  }

  return `Añade "${skill}" en tu ${section} con un ejemplo cuantificable (ej: "Implemented ${skill} to reduce latency by 40%").`;
}
