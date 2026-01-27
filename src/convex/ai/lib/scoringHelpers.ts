import { calculateBM25KeywordScore } from "../scoring/bm25Scoring";

export function extractBulletPoints(text: string): string[] {
  // Match various bullet point patterns
  const patterns = [
    /^[\s]*[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*]\s+(.+)$/gm,
    /^\s*[-–—]\s+(.+)$/gm,
  ];

  const bullets: string[] = [];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].trim().length > 20) {
        bullets.push(match[1].trim());
      }
    }
  }

  // If no bullets found, try splitting by newlines and filtering
  if (bullets.length === 0) {
    const lines = text.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 30 && !trimmed.match(/^[A-Z\s]{5,}$/)) {
        bullets.push(trimmed);
      }
    }
  }

  return bullets.slice(0, 50); // Max 50 bullets
}

export function extractSkillsFromText(text: string): string[] {
  const lowerText = text.toLowerCase();
  const commonSkills = [
    'javascript', 'python', 'java', 'typescript', 'react', 'node.js', 'aws',
    'docker', 'kubernetes', 'sql', 'mongodb', 'postgresql', 'git', 'linux',
    'agile', 'scrum', 'ci/cd', 'rest api', 'graphql', 'microservices',
  ];

  const foundSkills: string[] = [];

  for (const skill of commonSkills) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

export function estimateKeywordScore(resumeText: string, jobDescription: string): number {
  // Use BM25 algorithm for superior keyword matching (industry standard)
  // BM25 is used by Elasticsearch, Lucene, and beats TF-IDF in most cases

  if (!jobDescription || jobDescription.trim().length === 0) {
    // Fallback to category-based scoring without JD
    return calculateBM25KeywordScore(resumeText, undefined, 'Software Engineering', 100);
  }

  // Calculate BM25 score (0-100 scale)
  const bm25Score = calculateBM25KeywordScore(
    resumeText,
    jobDescription,
    'Software Engineering', // Default category, could be parameterized
    100 // Max score of 100
  );

  return Math.min(100, Math.max(0, Math.round(bm25Score)));
}

export function countImpactMetrics(text: string): number {
  const metricPatterns = [
    /\d+(?:\.\d+)?%/g,
    /\$[\d,]+(?:\.\d+)?[kmb]?/gi,
    /\d+x\s+/gi,
    /\d+(?:,\d{3})+/g,
    /(?:\d+\+?\s*(?:years?|months?|weeks?|days?))/gi,
  ];

  let count = 0;
  const foundMetrics = new Set<string>();

  for (const pattern of metricPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(m => {
        foundMetrics.add(m.toLowerCase());
      });
    }
  }

  return foundMetrics.size;
}

export function getGrade(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}
