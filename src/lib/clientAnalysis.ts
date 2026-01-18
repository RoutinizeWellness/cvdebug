/**
 * Client-Side Resume Analysis
 *
 * This mirrors the server-side analysis from Convex but runs entirely in the browser
 * Uses the same ML algorithms to ensure consistent results between:
 * - PreviewScan (landing page, unauthenticated)
 * - Dashboard (authenticated, full analysis)
 *
 * CRITICAL: Any changes to scoring logic must be applied to BOTH:
 * - src/convex/ai/intelligentFallback.ts (server)
 * - src/lib/clientAnalysis.ts (client) <- THIS FILE
 */

// Contact information patterns (same as contactExtractor.ts)
function extractContactInfo(text: string): {
  email?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
} {
  const contact: any = {};

  // Email detection
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }

  // Phone detection with ML confidence (simplified for client)
  const phonePatterns = [
    /\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    /\d{3}[.-]\d{3}[.-]\d{4}/g,
  ];

  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      contact.phone = matches[0];
      break;
    }
  }

  // LinkedIn detection with OCR tolerance
  const linkedinPatterns = [
    /(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9_-]+)/gi,
    /(?:l[i1]nked[i1]n|linkedln)\.com\/in\/([a-zA-Z0-9_-]+)/gi,
  ];

  for (const pattern of linkedinPatterns) {
    const match = pattern.exec(text);
    if (match) {
      contact.linkedin = match[1];
      break;
    }
  }

  // Location detection
  const locationPatterns = [
    /(?:Location|Address|Based in|City):\s*([^,\n]+(?:,\s*[^,\n]+)?)/i,
    /([A-Z][a-z]+,\s*[A-Z]{2})/g,
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      contact.location = match[1];
      break;
    }
  }

  return contact;
}

// Section detection (same logic as server)
function detectSections(text: string): string[] {
  const sections: string[] = [];
  const lowerText = text.toLowerCase();

  const sectionPatterns = [
    { name: 'contact', patterns: ['email', 'phone', 'linkedin', '@'] },
    { name: 'summary', patterns: ['summary', 'objective', 'profile', 'about'] },
    { name: 'experience', patterns: ['experience', 'employment', 'work history', 'professional experience'] },
    { name: 'education', patterns: ['education', 'academic', 'degree', 'university', 'college'] },
    { name: 'skills', patterns: ['skills', 'technical skills', 'competencies', 'proficiencies'] },
    { name: 'projects', patterns: ['projects', 'portfolio', 'work samples'] },
    { name: 'certifications', patterns: ['certifications', 'certificates', 'licenses'] },
    { name: 'awards', patterns: ['awards', 'honors', 'achievements', 'recognition'] },
  ];

  sectionPatterns.forEach(({ name, patterns }) => {
    if (patterns.some(pattern => lowerText.includes(pattern))) {
      sections.push(name);
    }
  });

  return sections;
}

// Format scoring (same as formatScoring.ts)
function calculateFormatScore(text: string, sectionsDetected: string[]): {
  score: number;
  issues: Array<{ issue: string; severity: string }>;
} {
  const issues: Array<{ issue: string; severity: string }> = [];
  let score = 100;

  // Check for tables (ATS can't parse well)
  if (/\|.*\|.*\|/.test(text)) {
    issues.push({ issue: 'Tables detected - may cause parsing errors', severity: 'high' });
    score -= 15;
  }

  // Check for multiple columns
  if (/\t{2,}/.test(text)) {
    issues.push({ issue: 'Multiple columns detected', severity: 'medium' });
    score -= 10;
  }

  // Check section count
  if (sectionsDetected.length < 4) {
    issues.push({ issue: 'Missing key sections', severity: 'high' });
    score -= 20;
  }

  // Check for special characters that might cause issues
  if (/[^\x00-\x7F]{10,}/.test(text)) {
    issues.push({ issue: 'Excessive special characters detected', severity: 'low' });
    score -= 5;
  }

  return { score: Math.max(0, score), issues };
}

// Keyword scoring (simplified TF-IDF from keywordScoring.ts)
function calculateKeywordScore(text: string, jobDescription?: string): {
  score: number;
  foundKeywords: number;
  totalKeywords: number;
} {
  if (!jobDescription) {
    // Without JD, do basic keyword density check
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words.filter(w => w.length > 3));
    const keywordDensity = uniqueWords.size / Math.max(words.length, 1);

    return {
      score: Math.min(100, keywordDensity * 300),
      foundKeywords: uniqueWords.size,
      totalKeywords: uniqueWords.size
    };
  }

  // With JD, do keyword matching
  const resumeWords = new Set(
    text.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  const jdWords = jobDescription.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3);

  // Count important keywords (appear in JD)
  const jdKeywordCounts = new Map<string, number>();
  jdWords.forEach(word => {
    jdKeywordCounts.set(word, (jdKeywordCounts.get(word) || 0) + 1);
  });

  // Sort by frequency to get most important keywords
  const sortedJDKeywords = Array.from(jdKeywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);

  // Check how many important JD keywords are in resume
  const matchedKeywords = sortedJDKeywords.filter(kw => resumeWords.has(kw));

  const matchRate = matchedKeywords.length / Math.max(sortedJDKeywords.length, 1);
  const score = matchRate * 100;

  return {
    score: Math.round(score),
    foundKeywords: matchedKeywords.length,
    totalKeywords: sortedJDKeywords.length
  };
}

// Completeness scoring (same as completenessScoring.ts)
function calculateCompletenessScore(
  text: string,
  sections: string[],
  contact: any
): {
  score: number;
  missingElements: string[];
} {
  const missingElements: string[] = [];
  let score = 0;

  // Essential sections (60 points)
  const essentialSections = ['experience', 'education', 'skills'];
  essentialSections.forEach(section => {
    if (sections.includes(section)) {
      score += 20;
    } else {
      missingElements.push(`${section} section`);
    }
  });

  // Contact info (30 points)
  if (contact.email) score += 10;
  else missingElements.push('email address');

  if (contact.phone) score += 10;
  else missingElements.push('phone number');

  if (contact.linkedin) score += 10;
  else missingElements.push('LinkedIn profile');

  // Additional sections (10 points)
  if (sections.includes('summary') || sections.includes('objective')) {
    score += 5;
  }
  if (sections.includes('projects') || sections.includes('certifications')) {
    score += 5;
  }

  return { score, missingElements };
}

/**
 * MAIN CLIENT ANALYSIS FUNCTION
 * This must produce the same score as server-side analysis
 */
export function analyzeResumeClient(
  text: string,
  jobDescription?: string
): {
  overallScore: number;
  formatScore: number;
  keywordScore: number;
  completenessScore: number;
  sections: string[];
  contact: any;
  issues: Array<{ issue: string; severity: string }>;
  missingElements: string[];
  stats: {
    wordCount: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasLinkedIn: boolean;
    hasQuantifiableAchievements: boolean;
  };
} {
  // Extract contact information
  const contact = extractContactInfo(text);

  // Detect sections
  const sections = detectSections(text);

  // Calculate format score
  const formatResult = calculateFormatScore(text, sections);

  // Calculate keyword score
  const keywordResult = calculateKeywordScore(text, jobDescription);

  // Calculate completeness score
  const completenessResult = calculateCompletenessScore(text, sections, contact);

  // Statistics
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const hasQuantifiableAchievements = /\d+%|\d+\+|\$\d+|increased|improved|reduced|saved|led \d+|managed \d+/gi.test(text);

  // Calculate overall score (SAME WEIGHTS AS SERVER)
  // From intelligentFallback.ts line 269-271:
  // Keywords: 45%, Format: 30%, Completeness: 25%
  const overallScore = Math.round(
    (keywordResult.score * 0.45) +
    (formatResult.score * 0.30) +
    (completenessResult.score * 0.25)
  );

  return {
    overallScore: Math.min(overallScore, 100),
    formatScore: formatResult.score,
    keywordScore: keywordResult.score,
    completenessScore: completenessResult.score,
    sections,
    contact,
    issues: formatResult.issues,
    missingElements: completenessResult.missingElements,
    stats: {
      wordCount,
      hasEmail: !!contact.email,
      hasPhone: !!contact.phone,
      hasLinkedIn: !!contact.linkedin,
      hasQuantifiableAchievements
    }
  };
}

/**
 * Generate detailed analysis report (same format as server)
 */
export function generateAnalysisReport(analysisResult: ReturnType<typeof analyzeResumeClient>): string {
  const { overallScore, formatScore, keywordScore, completenessScore, stats, issues, missingElements } = analysisResult;

  let report = `ATS COMPATIBILITY ANALYSIS\n\n`;
  report += `Overall Score: ${overallScore}/100\n`;
  report += `├─ Format: ${formatScore}/100\n`;
  report += `├─ Keywords: ${keywordScore}/100\n`;
  report += `└─ Completeness: ${completenessScore}/100\n\n`;

  report += `DOCUMENT STATS\n`;
  report += `├─ Word Count: ${stats.wordCount}\n`;
  report += `├─ Email: ${stats.hasEmail ? '✓' : '✗'}\n`;
  report += `├─ Phone: ${stats.hasPhone ? '✓' : '✗'}\n`;
  report += `├─ LinkedIn: ${stats.hasLinkedIn ? '✓' : '✗'}\n`;
  report += `└─ Quantifiable Achievements: ${stats.hasQuantifiableAchievements ? '✓' : '✗'}\n\n`;

  if (issues.length > 0) {
    report += `ISSUES DETECTED (${issues.length})\n`;
    issues.forEach((issue, idx) => {
      report += `${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.issue}\n`;
    });
    report += `\n`;
  }

  if (missingElements.length > 0) {
    report += `MISSING ELEMENTS (${missingElements.length})\n`;
    missingElements.forEach((element, idx) => {
      report += `${idx + 1}. ${element}\n`;
    });
  }

  return report;
}
