/**
 * Machine Learning Text Analysis Utilities
 * Uses NLP techniques for intelligent resume analysis
 */

// TF-IDF (Term Frequency-Inverse Document Frequency) implementation
export class TFIDF {
  private documents: string[] = [];
  private vocabulary: Set<string> = new Set();
  private idf: Map<string, number> = new Map();

  constructor(documents: string[]) {
    this.documents = documents;
    this.buildVocabulary();
    this.calculateIDF();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'or', 'but', 'in', 'with',
      'to', 'for', 'of', 'as', 'by', 'an', 'be', 'this', 'that', 'from',
      'was', 'are', 'been', 'has', 'have', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can'
    ]);
    return stopWords.has(word);
  }

  private buildVocabulary() {
    this.documents.forEach(doc => {
      const tokens = this.tokenize(doc);
      tokens.forEach(token => this.vocabulary.add(token));
    });
  }

  private calculateIDF() {
    const docCount = this.documents.length;

    this.vocabulary.forEach(term => {
      const docsContainingTerm = this.documents.filter(doc =>
        this.tokenize(doc).includes(term)
      ).length;

      this.idf.set(term, Math.log(docCount / (1 + docsContainingTerm)));
    });
  }

  public getTFIDF(document: string): Map<string, number> {
    const tokens = this.tokenize(document);
    const termFreq = new Map<string, number>();

    // Calculate term frequency
    tokens.forEach(token => {
      termFreq.set(token, (termFreq.get(token) || 0) + 1);
    });

    // Normalize by document length
    const docLength = tokens.length;
    termFreq.forEach((freq, term) => {
      termFreq.set(term, freq / docLength);
    });

    // Calculate TF-IDF
    const tfidf = new Map<string, number>();
    termFreq.forEach((tf, term) => {
      const idf = this.idf.get(term) || 0;
      tfidf.set(term, tf * idf);
    });

    return tfidf;
  }

  public getTopKeywords(document: string, topN: number = 10): Array<{ keyword: string; score: number }> {
    const tfidf = this.getTFIDF(document);

    return Array.from(tfidf.entries())
      .map(([keyword, score]) => ({ keyword, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }
}

// Cosine Similarity for document matching
export function cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  const allKeys = new Set([...vec1.keys(), ...vec2.keys()]);

  allKeys.forEach(key => {
    const v1 = vec1.get(key) || 0;
    const v2 = vec2.get(key) || 0;

    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  if (mag1 === 0 || mag2 === 0) return 0;

  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

// N-gram extraction for phrase detection
export function extractNGrams(text: string, n: number = 2): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const ngrams: string[] = [];

  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }

  return ngrams;
}

// Sentiment Analysis (simplified - based on keyword presence)
export function analyzeSentiment(text: string): { score: number; label: string } {
  const positive = [
    'achieved', 'improved', 'increased', 'optimized', 'successful', 'led',
    'developed', 'created', 'delivered', 'enhanced', 'streamlined', 'pioneered',
    'accelerated', 'transformed', 'excellent', 'outstanding', 'innovative'
  ];

  const negative = [
    'failed', 'decreased', 'reduced', 'problem', 'issue', 'difficult',
    'responsible for', 'helped with', 'worked on', 'assisted', 'participated'
  ];

  const words = text.toLowerCase().split(/\s+/);
  let score = 0;

  words.forEach(word => {
    if (positive.some(p => word.includes(p))) score += 1;
    if (negative.some(n => word.includes(n))) score -= 1;
  });

  const normalized = Math.max(-1, Math.min(1, score / words.length * 10));

  return {
    score: normalized,
    label: normalized > 0.3 ? 'strong' : normalized < -0.3 ? 'weak' : 'neutral'
  };
}

// Action Verb Detection using ML patterns
export function detectActionVerbs(text: string): Array<{ verb: string; strength: number }> {
  const strongVerbs = new Map([
    ['achieved', 0.95], ['delivered', 0.9], ['led', 0.95], ['spearheaded', 0.98],
    ['architected', 0.92], ['engineered', 0.88], ['optimized', 0.85], ['transformed', 0.93],
    ['pioneered', 0.96], ['launched', 0.87], ['drove', 0.90], ['executed', 0.85],
    ['implemented', 0.80], ['developed', 0.75], ['created', 0.75], ['built', 0.78],
    ['designed', 0.80], ['established', 0.82], ['improved', 0.75], ['increased', 0.78]
  ]);

  const weakVerbs = new Map([
    ['helped', 0.3], ['assisted', 0.35], ['worked', 0.25], ['responsible', 0.2],
    ['participated', 0.3], ['involved', 0.25], ['contributed', 0.4], ['supported', 0.35]
  ]);

  const sentences = text.split(/[.!?]+/);
  const detectedVerbs: Array<{ verb: string; strength: number }> = [];

  sentences.forEach(sentence => {
    const firstWords = sentence.trim().toLowerCase().split(/\s+/).slice(0, 3);

    firstWords.forEach(word => {
      if (strongVerbs.has(word)) {
        detectedVerbs.push({ verb: word, strength: strongVerbs.get(word)! });
      } else if (weakVerbs.has(word)) {
        detectedVerbs.push({ verb: word, strength: weakVerbs.get(word)! });
      }
    });
  });

  return detectedVerbs;
}

// Named Entity Recognition (simplified - for skills, companies, technologies)
export function extractEntities(text: string): {
  skills: string[];
  technologies: string[];
  companies: string[];
} {
  const skillPatterns = [
    /\b(python|java|javascript|typescript|c\+\+|ruby|go|rust|kotlin|swift)\b/gi,
    /\b(react|angular|vue|node|express|django|flask|spring|laravel)\b/gi,
    /\b(sql|nosql|mongodb|postgresql|mysql|redis|elasticsearch)\b/gi,
    /\b(aws|azure|gcp|kubernetes|docker|terraform|jenkins)\b/gi,
    /\b(machine learning|ml|ai|deep learning|nlp|computer vision)\b/gi,
    /\b(agile|scrum|kanban|ci\/cd|devops|microservices)\b/gi
  ];

  const techPatterns = [
    /\b(rest|graphql|api|grpc|websocket|http)\b/gi,
    /\b(git|github|gitlab|bitbucket|svn)\b/gi,
    /\b(linux|unix|windows|macos|ios|android)\b/gi,
    /\b(webpack|vite|rollup|babel|typescript)\b/gi
  ];

  const skills = new Set<string>();
  const technologies = new Set<string>();

  skillPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => skills.add(match.toLowerCase()));
    }
  });

  techPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => technologies.add(match.toLowerCase()));
    }
  });

  return {
    skills: Array.from(skills),
    technologies: Array.from(technologies),
    companies: [] // Would need a company database for accurate detection
  };
}

// ML-based Resume Scoring
export function scoreResume(resumeText: string, jobDescription: string): {
  overallScore: number;
  keywordMatch: number;
  actionVerbScore: number;
  sentimentScore: number;
  structureScore: number;
} {
  // Keyword matching using TF-IDF
  const tfidf = new TFIDF([resumeText, jobDescription]);
  const resumeVector = tfidf.getTFIDF(resumeText);
  const jobVector = tfidf.getTFIDF(jobDescription);
  const keywordMatch = cosineSimilarity(resumeVector, jobVector) * 100;

  // Action verb strength
  const verbs = detectActionVerbs(resumeText);
  const avgVerbStrength = verbs.length > 0
    ? verbs.reduce((sum, v) => sum + v.strength, 0) / verbs.length
    : 0.5;
  const actionVerbScore = avgVerbStrength * 100;

  // Sentiment (impact)
  const sentiment = analyzeSentiment(resumeText);
  const sentimentScore = ((sentiment.score + 1) / 2) * 100; // Normalize to 0-100

  // Structure score (has sections, proper formatting)
  const hasSections = /experience|education|skills|projects/gi.test(resumeText);
  const hasBullets = /[•\-\*]/g.test(resumeText) || /^\d+\./gm.test(resumeText);
  const hasMetrics = /\d+%|\$\d+|\d+[kmb]\+?/gi.test(resumeText);

  const structureScore = (
    (hasSections ? 40 : 0) +
    (hasBullets ? 30 : 0) +
    (hasMetrics ? 30 : 0)
  );

  // Overall weighted score
  const overallScore = (
    keywordMatch * 0.4 +
    actionVerbScore * 0.25 +
    sentimentScore * 0.15 +
    structureScore * 0.2
  );

  return {
    overallScore: Math.round(overallScore),
    keywordMatch: Math.round(keywordMatch),
    actionVerbScore: Math.round(actionVerbScore),
    sentimentScore: Math.round(sentimentScore),
    structureScore: Math.round(structureScore)
  };
}
