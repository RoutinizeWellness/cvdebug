export interface FormatResult {
  formatScore: number;
  formatIssues: Array<{
    issue: string;
    severity: string;
    fix: string;
    location: string;
    atsImpact: string;
  }>;
}

export function calculateFormatScore(
  ocrText: string,
  mlConfig?: any
): FormatResult {
  let formatScore = 0;
  const formatIssues: Array<{issue: string, severity: string, fix: string, location: string, atsImpact: string}> = [];

  // Advanced contact information detection with scoring
  // Email: Multiple patterns for validation
  const emailPatterns = [
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,  // Standard email
    /\b[\w.-]+@[\w.-]+\.(?:com|org|net|edu|gov|io|dev)\b/gi  // Common TLDs
  ];

  let emailMatch = null;
  let emailQuality = 0;
  for (const pattern of emailPatterns) {
    const matches = ocrText.match(pattern);
    if (matches && matches.length > 0) {
      emailMatch = matches[0];
      // Score email quality
      if (!/\d{3,}/.test(emailMatch)) emailQuality += 2; // No excessive numbers
      if (/^[a-z]+\.[a-z]+@/i.test(emailMatch)) emailQuality += 2; // firstname.lastname format
      if (!/[._-]{2,}/.test(emailMatch)) emailQuality += 1; // No repeated separators
      break;
    }
  }

  // Phone: Enhanced detection with international support
  const phonePatterns = [
    /\+\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,  // International
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,  // US format
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,  // Simple format
    /\d{10,}/g  // Fallback: 10+ digits
  ];

  let phoneMatch = null;
  let phoneQuality = 0;
  for (const pattern of phonePatterns) {
    const matches = ocrText.match(pattern);
    if (matches && matches.length > 0) {
      phoneMatch = matches[0];
      // Score phone quality
      if (/\+\d{1,3}/.test(phoneMatch)) phoneQuality += 2; // Has country code
      if (/[\s().-]/.test(phoneMatch)) phoneQuality += 1; // Has formatting
      break;
    }
  }

  // LinkedIn: Advanced detection with profile validation
  const linkedInPatterns = [
    /linkedin\.com\/in\/[\w-]+/gi,  // Full profile URL
    /linked\.in\/[\w-]+/gi,  // Short URL
    /\blinkedin\b/gi  // Fallback: just mentions LinkedIn
  ];

  let hasLinkedIn = false;
  let linkedInQuality = 0;
  for (const pattern of linkedInPatterns) {
    if (pattern.test(ocrText)) {
      hasLinkedIn = true;
      if (/linkedin\.com\/in\/[\w-]+/i.test(ocrText)) linkedInQuality = 3; // Full URL
      else if (/linked\.in\/[\w-]+/i.test(ocrText)) linkedInQuality = 2; // Short URL
      else linkedInQuality = 1; // Just mentions
      break;
    }
  }

  // GitHub: Enhanced detection with username validation
  const githubPatterns = [
    /github\.com\/[\w-]+/gi,  // Full profile URL
    /git\.io\/[\w-]+/gi,  // Short URL
    /\bgithub\b.*?[\w-]{3,}/gi  // GitHub + username nearby
  ];

  let hasGithub = false;
  let githubQuality = 0;
  for (const pattern of githubPatterns) {
    if (pattern.test(ocrText)) {
      hasGithub = true;
      if (/github\.com\/[\w-]+/i.test(ocrText)) githubQuality = 2;
      else githubQuality = 1;
      break;
    }
  }

  // Portfolio: Multi-pattern detection with domain validation
  const portfolioPatterns = [
    /\b(?:portfolio|personal\s*(?:site|website|page))\b/gi,
    /https?:\/\/(?:www\.)?[\w-]+\.(?:com|dev|io|me|tech|codes?|design|works?)\b/gi,
    /\b[\w-]+\.(?:dev|io|me|tech)\b/gi  // Modern TLDs
  ];

  let hasPortfolio = false;
  let portfolioQuality = 0;
  for (const pattern of portfolioPatterns) {
    if (pattern.test(ocrText)) {
      hasPortfolio = true;
      if (/https?:\/\//.test(ocrText)) portfolioQuality = 2; // Has full URL
      else portfolioQuality = 1;
      break;
    }
  }
  
  // Score contact info with STRICT quality bonuses - much lower points
  if (emailMatch) {
    formatScore += 3 + Math.floor(emailQuality / 2); // 3-4 points (was 5-10)
  } else {
    // Check if @ symbol exists (indicates email might be present but unreadable)
    const hasAtSymbol = /@/.test(ocrText);
    formatIssues.push({
      issue: hasAtSymbol ? "Email may be in image or incorrectly formatted" : "Contact email not detected",
      severity: "critical",
      fix: hasAtSymbol
        ? "Email found but may be in an image. Place it in plain text at the top (firstname.lastname@domain.com)"
        : "Add professional email in plain text header: firstname.lastname@domain.com. Never embed in images.",
      location: "Header",
      atsImpact: hasAtSymbol
        ? "ATS may not parse email from images - 70% chance of rejection"
        : "ATS cannot contact you without email - automatic rejection"
    });
  }

  if (phoneMatch) {
    formatScore += 2 + Math.floor(phoneQuality / 2); // 2-3 points (was 5-8)
  } else {
    // Check if numbers exist that could be a phone
    const hasNumberSequence = /\d{3,}/.test(ocrText);
    formatIssues.push({
      issue: hasNumberSequence ? "Phone number detected but format unclear" : "Contact phone not detected",
      severity: "high",
      fix: hasNumberSequence
        ? "Format phone clearly: +1-555-123-4567 or (555) 123-4567 in header"
        : "Add phone number in standard format: +1-555-123-4567 or (555) 123-4567",
      location: "Header",
      atsImpact: hasNumberSequence
        ? "Improper format may prevent ATS from extracting phone number"
        : "Reduces contact options for recruiters - may be skipped"
    });
  }

  if (hasLinkedIn) {
    formatScore += 1 + Math.floor(linkedInQuality / 2); // 1-2 points (was 3-5)
  } else {
    formatIssues.push({
      issue: "LinkedIn profile not detected",
      severity: "high",
      fix: "Add LinkedIn URL (linkedin.com/in/yourname) in header to enable recruiter verification",
      location: "Header",
      atsImpact: "85% of recruiters verify candidates on LinkedIn - absence raises red flags and reduces callbacks by 40%"
    });
  }

  if (hasGithub) {
    formatScore += 1; // 1 point only (was 2-3)
  }

  if (hasPortfolio) {
    formatScore += 1; // 1 point only (was 2-3)
  }

  // Advanced section detection with weighted scoring
  interface SectionPattern {
    name: string;
    patterns: RegExp[];
    weight: number;
    required: boolean;
  }

  const sections: SectionPattern[] = [
    {
      name: "Experience",
      patterns: [
        /^(?:professional\s+)?experience\s*$/im,  // Exact header match
        /^work\s+(?:history|experience)\s*$/im,
        /^employment\s+(?:history|background)\s*$/im,
        /\b(?:professional|work)\s+(?:experience|history|background)\b/gi  // Fallback
      ],
      weight: 3, // REDUCED from 6 - be stricter
      required: true
    },
    {
      name: "Education",
      patterns: [
        /^education\s*$/im,  // Exact header
        /^academic\s+(?:background|qualifications)\s*$/im,
        /\b(?:education|academic|degree|university|college|bachelor|master|phd)\b/gi  // Fallback
      ],
      weight: 2, // REDUCED from 4
      required: true
    },
    {
      name: "Skills",
      patterns: [
        /^(?:technical\s+)?skills\s*$/im,  // Exact header
        /^(?:core\s+)?competencies\s*$/im,
        /^technologies\s*(?:&|and)?\s*tools\s*$/im,
        /\b(?:skills|competencies|technologies|tools|expertise)\b/gi  // Fallback
      ],
      weight: 2, // REDUCED from 4
      required: true
    },
    {
      name: "Projects",
      patterns: [
        /^projects\s*$/im,
        /^portfolio\s*$/im,
        /^(?:key|notable)\s+projects\s*$/im,
        /\b(?:projects|portfolio|work\s+samples)\b/gi
      ],
      weight: 1, // REDUCED from 2
      required: false
    }
  ];

  // Score each section with quality assessment
  sections.forEach(section => {
    let found = false;
    let qualityScore = 0;

    // Try exact matches first (higher quality)
    for (let i = 0; i < section.patterns.length; i++) {
      if (section.patterns[i].test(ocrText)) {
        found = true;
        // Earlier patterns (more specific) get bonus
        qualityScore = section.patterns.length - i;
        break;
      }
    }

    if (found) {
      formatScore += section.weight + Math.min(qualityScore - 1, 2); // Up to +2 bonus for exact matches
    } else if (section.required) {
      formatIssues.push({
        issue: `Missing '${section.name}' section header`,
        severity: section.weight >= 5 ? "high" : "medium",
        fix: `Add a clear '${section.name}' section header to help ATS parse your resume correctly`,
        location: "Body",
        atsImpact: section.weight >= 5
          ? `ATS cannot identify your ${section.name.toLowerCase()} - major parsing failure`
          : `Many ATS systems require ${section.name.toLowerCase()} information`
      });
    }
  });

  // Detect legacy/problematic sections that hurt ATS parsing
  const problematicSections = [
    { pattern: /\b(?:references?|referees?)\b/gi, name: "References" },
    { pattern: /\b(?:objective|career\s+objective)\b/gi, name: "Objective" }
  ];

  problematicSections.forEach(({ pattern, name }) => {
    if (pattern.test(ocrText)) {
      formatIssues.push({
        issue: `Contains outdated '${name}' section`,
        severity: "low",
        fix: `Remove the '${name}' section - it wastes valuable space and is outdated`,
        location: "Body",
        atsImpact: "Takes up space that could be used for achievements and keywords"
      });
    }
  });

  // Advanced date format consistency check with regex precision
  interface DatePattern {
    pattern: RegExp;
    name: string;
    quality: number; // ATS parsability score
  }

  const datePatterns: DatePattern[] = [
    {
      pattern: /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b/gi,
      name: "Month YYYY",
      quality: 5  // Best for ATS
    },
    {
      pattern: /\b(?:0?[1-9]|1[0-2])\/\d{4}\b/g,
      name: "MM/YYYY",
      quality: 4
    },
    {
      pattern: /\b\d{4}-(?:0[1-9]|1[0-2])\b/g,
      name: "YYYY-MM",
      quality: 3
    },
    {
      pattern: /\b(?:0?[1-9]|1[0-2])-\d{4}\b/g,
      name: "MM-YYYY",
      quality: 3
    },
    {
      pattern: /\b\d{4}\s*-\s*(?:Present|Current|Now)\b/gi,
      name: "YYYY - Present",
      quality: 4
    },
    {
      pattern: /\b\d{4}\b/g,
      name: "YYYY only",
      quality: 2  // Least precise
    }
  ];

  // Analyze date format usage with quality scoring
  const dateAnalysis = datePatterns.map(({ pattern, name, quality }) => {
    const matches = ocrText.match(pattern) || [];
    return {
      name,
      count: matches.length,
      quality,
      totalQuality: matches.length * quality
    };
  }).filter(d => d.count > 0);

  // Calculate consistency and quality
  const totalDates = dateAnalysis.reduce((sum, d) => sum + d.count, 0);
  const hasMultipleFormats = dateAnalysis.length > 2; // Allow 2 formats (date + "Present")

  if (totalDates > 0) {
    if (!hasMultipleFormats) {
      // Bonus for consistent format
      const avgQuality = dateAnalysis.reduce((sum, d) => sum + d.totalQuality, 0) / totalDates;
      formatScore += Math.round(avgQuality); // 2-5 points based on format quality
    } else {
      // Penalty for inconsistent formats
      const formatsList = dateAnalysis
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(d => `${d.name} (${d.count}x)`)
        .join(", ");

      formatIssues.push({
        issue: "Inconsistent date formats detected",
        severity: "medium",
        fix: `Use a single date format throughout. Recommended: 'Month YYYY' (e.g., 'January 2020'). Currently using: ${formatsList}`,
        location: "Experience section",
        atsImpact: "Confuses ATS timeline parsing - may misorder your experience chronologically"
      });
    }
  }

  const { checkCapitalization, checkRepetitiveStarts } = require("../qualityChecks");
  
  const capitalizationIssues = checkCapitalization(ocrText);
  if (capitalizationIssues.length > 0) {
    formatIssues.push({
      issue: "Incorrect Technical Capitalization",
      severity: "low",
      fix: `Correct the capitalization of technical terms: ${capitalizationIssues.join(", ")}`,
      location: "Skills/Experience",
      atsImpact: "Indicates lack of attention to detail to human recruiters"
    });
  } else {
    formatScore += 2;
  }

  const repetitionIssues = checkRepetitiveStarts(ocrText);
  if (repetitionIssues.length > 0) {
    formatIssues.push({
      issue: "Repetitive Sentence Starters",
      severity: "medium",
      fix: `Vary your action verbs. Found repetition: ${repetitionIssues.join(", ")}`,
      location: "Experience Bullets",
      atsImpact: "Reduces readability and engagement"
    });
  } else {
    formatScore += 2;
  }
  
  // Check for bullet point formatting
  const bulletPoints = ocrText.match(/^[•\-\*]\s/gm);
  if (bulletPoints && bulletPoints.length >= 5) {
    formatScore += 2;
  }
  
  // Check for proper spacing and structure
  const lines = ocrText.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  const avgLineLength = nonEmptyLines.reduce((sum, l) => sum + l.length, 0) / nonEmptyLines.length;
  
  if (avgLineLength > 30 && avgLineLength < 120) {
    formatScore += 1;
  }
  
  const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.format || 0);
  formatScore = Math.min(25, formatScore * scoringMultiplier); // REDUCED from 30 - be stricter
  
  return { formatScore, formatIssues };
}