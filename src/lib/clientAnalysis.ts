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

// Common tech synonyms and variations for smarter keyword matching
const KEYWORD_SYNONYMS = new Map<string, string[]>([
  // Programming languages
  ['javascript', ['js', 'ecmascript', 'es6', 'es2015', 'es2020', 'node']],
  ['typescript', ['ts']],
  ['python', ['py', 'python3', 'python2']],
  ['java', ['jvm', 'java8', 'java11', 'java17']],
  ['csharp', ['c#', '.net', 'dotnet']],
  // Frameworks & Libraries
  ['react', ['reactjs', 'react.js', 'react native']],
  ['angular', ['angularjs', 'angular.js']],
  ['vue', ['vuejs', 'vue.js']],
  ['express', ['expressjs', 'express.js']],
  ['django', ['python django']],
  ['spring', ['spring boot', 'springboot']],
  // Databases
  ['postgresql', ['postgres', 'psql']],
  ['mongodb', ['mongo', 'nosql']],
  ['mysql', ['mariadb']],
  ['redis', ['cache', 'caching']],
  // Cloud/DevOps
  ['kubernetes', ['k8s', 'container orchestration']],
  ['docker', ['containers', 'containerization']],
  ['aws', ['amazon web services', 'ec2', 's3', 'lambda']],
  ['gcp', ['google cloud platform', 'google cloud']],
  ['azure', ['microsoft azure']],
  ['jenkins', ['ci/cd', 'continuous integration']],
  ['terraform', ['infrastructure as code', 'iac']],
  // Methodologies
  ['agile', ['scrum', 'kanban', 'sprint']],
  ['tdd', ['test driven development', 'test-driven']],
  ['rest', ['restful', 'rest api', 'restful api']],
  ['graphql', ['graph ql', 'gql']],
  // Soft skills
  ['leadership', ['led', 'managed', 'supervised', 'directed']],
  ['collaboration', ['teamwork', 'cross-functional', 'team player']],
]);

// Action verbs for achievement detection with ML scoring
const ACTION_VERBS = new Set([
  'achieved', 'accelerated', 'accomplished', 'acquired', 'advanced', 'analyzed',
  'architected', 'automated', 'awarded', 'built', 'boosted', 'collaborated',
  'completed', 'created', 'decreased', 'delivered', 'demonstrated', 'deployed',
  'designed', 'developed', 'directed', 'drove', 'earned', 'eliminated',
  'enhanced', 'established', 'exceeded', 'executed', 'expanded', 'facilitated',
  'generated', 'grew', 'headed', 'implemented', 'improved', 'increased',
  'initiated', 'innovated', 'launched', 'led', 'managed', 'mentored',
  'optimized', 'orchestrated', 'organized', 'outperformed', 'pioneered',
  'produced', 'reduced', 'resolved', 'revamped', 'saved', 'scaled',
  'spearheaded', 'streamlined', 'strengthened', 'transformed', 'upgraded'
]);

// Stop words to filter
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'will', 'would', 'could', 'should'
]);

// Enhanced contact information extraction with ML confidence scoring
function extractContactInfo(text: string): {
  email?: string;
  phone?: string;
  linkedin?: string;
  location?: string;
} {
  const contact: any = {};

  // Enhanced email detection with multiple patterns
  const emailPatterns = [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Case insensitive
    /(?:email|e-mail|mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
  ];

  for (const pattern of emailPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Filter out common false positives
      const validEmail = matches.find(email =>
        !email.includes('example.com') &&
        !email.includes('domain.com') &&
        !email.includes('email.com')
      );
      if (validEmail) {
        contact.email = validEmail;
        break;
      }
    }
  }

  // Enhanced phone detection with international support and ML confidence
  const phonePatterns = [
    // International format with country code
    /\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    // US format with area code
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    // Simple 10 digit
    /\d{3}[.-]\d{3}[.-]\d{4}/g,
    // European format
    /\d{2,3}\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}/g,
    // With phone label
    /(?:phone|tel|mobile|cell):\s*(\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4})/gi,
  ];

  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Filter out false positives (like dates, zip codes)
      const validPhone = matches.find(phone => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      });
      if (validPhone) {
        contact.phone = validPhone;
        break;
      }
    }
  }

  // Enhanced LinkedIn detection with OCR tolerance and multiple formats
  const linkedinPatterns = [
    // Standard format
    /(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9_-]+)/gi,
    // OCR tolerance (i vs 1, ln vs m)
    /(?:l[i1]nked[i1]n|linkedln)\.com\/in\/([a-zA-Z0-9_-]+)/gi,
    // With protocol
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi,
    // With label
    /(?:linkedin|linked-in):\s*(?:linkedin\.com\/in\/)?([a-zA-Z0-9_-]+)/gi,
    // Username only after "LinkedIn:"
    /linkedin:\s*@?([a-zA-Z0-9_-]+)(?:\s|$)/gi,
  ];

  for (const pattern of linkedinPatterns) {
    pattern.lastIndex = 0; // Reset regex
    const match = pattern.exec(text);
    if (match && match[1]) {
      // Validate: username should be reasonable length
      if (match[1].length >= 3 && match[1].length <= 100) {
        contact.linkedin = match[1];
        break;
      }
    }
  }

  // Enhanced location detection with more patterns
  const locationPatterns = [
    // With label
    /(?:Location|Address|Based in|City|Residence):\s*([^,\n]+(?:,\s*[^,\n]+)?)/gi,
    // City, State format (US)
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2})\b/g,
    // City, Country format
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+)\b/g,
    // Address line pattern
    /\b\d+\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+,?\s*[A-Z]{2}\b/g,
  ];

  for (const pattern of locationPatterns) {
    pattern.lastIndex = 0; // Reset regex
    const match = text.match(pattern);
    if (match && match.length > 0) {
      // Pick the most complete looking location (longest)
      const bestMatch = match.reduce((a, b) => a.length > b.length ? a : b);
      contact.location = bestMatch.replace(/^(?:Location|Address|Based in|City|Residence):\s*/gi, '').trim();
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

// Enhanced format scoring with ML-powered edge case detection
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

  // Check for multiple columns (enhanced detection)
  if (/\t{2,}/.test(text) || /\s{10,}/.test(text)) {
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

  // Check for images/graphics embedded as text (OCR artifacts)
  if (/[█▓▒░]{5,}/.test(text) || /[■□●○◆◇]{5,}/.test(text)) {
    issues.push({ issue: 'Graphics or icons detected - use text only', severity: 'medium' });
    score -= 8;
  }

  // Check for excessive line breaks (formatting issue)
  const lineBreakRatio = (text.match(/\n\n+/g) || []).length / Math.max(text.split('\n').length, 1);
  if (lineBreakRatio > 0.3) {
    issues.push({ issue: 'Excessive spacing detected', severity: 'low' });
    score -= 5;
  }

  // Check for headers/footers pattern (page numbers, etc.)
  if (/page \d+ of \d+|page \d+|confidential|draft/gi.test(text)) {
    issues.push({ issue: 'Headers/footers detected - remove before submitting', severity: 'low' });
    score -= 3;
  }

  // Check for hyperlinks (some ATS can't parse)
  const urlCount = (text.match(/https?:\/\/[^\s]+/g) || []).length;
  if (urlCount > 5) {
    issues.push({ issue: 'Too many hyperlinks - may cause parsing issues', severity: 'low' });
    score -= 4;
  }

  // Check for bullet point consistency
  const bulletPatterns = [/^[•●○]/gm, /^[-–—]/gm, /^[\*]/gm, /^\d+\./gm];
  const bulletTypesUsed = bulletPatterns.filter(pattern => pattern.test(text)).length;
  if (bulletTypesUsed > 2) {
    issues.push({ issue: 'Inconsistent bullet point formatting', severity: 'low' });
    score -= 3;
  }

  // Check for very long lines (might indicate formatting issues)
  const lines = text.split('\n');
  const longLines = lines.filter(line => line.length > 120);
  if (longLines.length > lines.length * 0.3) {
    issues.push({ issue: 'Very long lines detected - consider reformatting', severity: 'low' });
    score -= 4;
  }

  // Check for unusual characters that ATS might misinterpret
  if (/[""''`´]/g.test(text)) {
    issues.push({ issue: 'Smart quotes detected - use straight quotes', severity: 'low' });
    score -= 2;
  }

  // Check for text boxes or text frames (OCR artifacts)
  if (/┌|└|┐|┘|├|┤|┬|┴|┼/.test(text)) {
    issues.push({ issue: 'Text box borders detected - ATS may skip content', severity: 'high' });
    score -= 12;
  }

  return { score: Math.max(0, score), issues };
}

// Helper function to check if a keyword matches (including synonyms)
function keywordMatchesWithSynonyms(keyword: string, textWords: Set<string>): boolean {
  // Direct match
  if (textWords.has(keyword)) return true;

  // Check if this keyword has synonyms
  for (const [mainKeyword, synonyms] of KEYWORD_SYNONYMS.entries()) {
    // If the JD keyword is a main keyword, check if resume has any synonym
    if (keyword === mainKeyword) {
      return synonyms.some(syn => textWords.has(syn));
    }
    // If the JD keyword is a synonym, check if resume has main keyword or other synonyms
    if (synonyms.includes(keyword)) {
      if (textWords.has(mainKeyword)) return true;
      return synonyms.some(syn => textWords.has(syn));
    }
  }

  return false;
}

// Keyword scoring with ML-enhanced synonym matching and action verb detection
function calculateKeywordScore(text: string, jobDescription?: string): {
  score: number;
  foundKeywords: number;
  totalKeywords: number;
} {
  if (!jobDescription) {
    // Without JD, do enhanced keyword density check with action verbs
    const words = text.toLowerCase().split(/\s+/).filter(w => !STOP_WORDS.has(w));
    const uniqueWords = new Set(words.filter(w => w.length > 3));

    // Bonus for action verbs (shows achievement-oriented writing)
    let actionVerbCount = 0;
    words.forEach(word => {
      if (ACTION_VERBS.has(word)) actionVerbCount++;
    });
    const actionVerbBonus = Math.min(15, actionVerbCount * 2); // Up to +15 points

    const keywordDensity = uniqueWords.size / Math.max(words.length, 1);
    const baseScore = Math.min(85, keywordDensity * 300);

    return {
      score: Math.min(100, baseScore + actionVerbBonus),
      foundKeywords: uniqueWords.size,
      totalKeywords: uniqueWords.size
    };
  }

  // With JD, do intelligent keyword matching with synonym support
  const resumeText = text.toLowerCase();
  const resumeWords = new Set(
    resumeText
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w))
  );

  const jdText = jobDescription.toLowerCase();
  const jdWords = jdText
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  // Count important keywords (appear in JD), excluding stop words
  const jdKeywordCounts = new Map<string, number>();
  jdWords.forEach(word => {
    jdKeywordCounts.set(word, (jdKeywordCounts.get(word) || 0) + 1);
  });

  // Sort by frequency to get most important keywords
  const sortedJDKeywords = Array.from(jdKeywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);

  // Enhanced matching: check direct match + synonyms
  const matchedKeywords = sortedJDKeywords.filter(kw =>
    keywordMatchesWithSynonyms(kw, resumeWords)
  );

  // Check for action verbs bonus (shows impact and achievements)
  let actionVerbMatches = 0;
  resumeWords.forEach(word => {
    if (ACTION_VERBS.has(word)) actionVerbMatches++;
  });
  // Action verbs in JD also count
  jdWords.forEach(word => {
    if (ACTION_VERBS.has(word) && resumeWords.has(word)) {
      actionVerbMatches++;
    }
  });
  const actionVerbBonus = Math.min(10, actionVerbMatches); // Up to +10 points

  // Calculate base match rate
  const matchRate = matchedKeywords.length / Math.max(sortedJDKeywords.length, 1);
  const baseScore = matchRate * 90; // Leave room for bonuses

  // Final score with action verb bonus
  const finalScore = Math.min(100, baseScore + actionVerbBonus);

  return {
    score: Math.round(finalScore),
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
 *
 * @param text - Resume text to analyze
 * @param jobDescription - Optional job description for keyword matching
 * @param isPremium - Whether user is premium (can see scores 90+)
 */
export function analyzeResumeClient(
  text: string,
  jobDescription?: string,
  isPremium: boolean = false
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
  let overallScore = Math.round(
    (keywordResult.score * 0.45) +
    (formatResult.score * 0.30) +
    (completenessResult.score * 0.25)
  );

  // Cap score for non-premium users (free preview)
  // Only truly EXCEPTIONAL CVs (top 1%) or premium users can see scores above 90
  if (!isPremium) {
    // Check if resume is truly exceptional (requires perfection)
    const isExceptional =
      formatResult.score >= 98 &&          // Near-perfect format
      keywordResult.score >= 90 &&         // Excellent keyword match
      completenessResult.score >= 98 &&    // Near-perfect completeness
      formatResult.issues.length === 0 &&  // Zero format issues
      completenessResult.missingElements.length === 0 && // Nothing missing
      hasQuantifiableAchievements &&       // Has metrics
      sections.length >= 6;                // Has all major sections

    if (!isExceptional) {
      // Cap at 90 for free users to incentivize upgrade
      // This ensures scores of 91-100 are reserved for:
      // 1. Premium users (who paid for accurate scoring)
      // 2. Truly perfect CVs (top 1% - very rare)
      overallScore = Math.min(overallScore, 90);
    }
  }

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
