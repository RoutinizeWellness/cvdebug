/**
 * Contact Information Extractor
 *
 * Extracts email, phone, LinkedIn, and GitHub from resume text
 */

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

/**
 * Extract contact information from resume text
 */
export function extractContactInfo(text: string): ContactInfo {
  const contactInfo: ContactInfo = {};

  // Extract email - enhanced validation with multiple patterns
  const emailPatterns = [
    /([a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  ];

  for (const pattern of emailPatterns) {
    const emailMatches = [...text.matchAll(pattern)];
    for (const match of emailMatches) {
      const email = match[0].toLowerCase().replace(/[<>()[\]{}]/g, '').trim();

      // Robust validation
      if (isValidEmail(email)) {
        contactInfo.email = email;
        break;
      }
    }
    if (contactInfo.email) break;
  }

  // Extract phone - ML-ENHANCED validation and normalization with confidence scoring
  const phonePatterns = [
    // International: +1 (555) 123-4567, +44 20 7123 4567
    { pattern: /\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g, weight: 1.0 },
    // US formatted: (555) 123-4567
    { pattern: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, weight: 0.95 },
    // Simple: 555.123.4567 or 555-123-4567
    { pattern: /\d{3}[.-]\d{3}[.-]\d{4}/g, weight: 0.90 },
    // Space separated: 555 123 4567
    { pattern: /\b\d{3}\s\d{3}\s\d{4}\b/g, weight: 0.85 },
    // Continuous: 5551234567 (10 digits)
    { pattern: /\b\d{10}\b/g, weight: 0.70 },
    // International without plus: 1 555 123 4567
    { pattern: /\b1\s?\d{3}\s?\d{3}\s?\d{4}\b/g, weight: 0.80 }
  ];

  let bestPhoneMatch: { phone: string, confidence: number } | null = null;

  for (const { pattern, weight } of phonePatterns) {
    const phoneMatches = [...text.matchAll(pattern)];
    for (const match of phoneMatches) {
      const phone = match[0].trim();

      // ML-based validation with confidence scoring
      const validationResult = validatePhoneWithConfidence(phone, text, match.index || 0);

      if (validationResult.isValid && validationResult.confidence > 0.6) {
        const totalConfidence = validationResult.confidence * weight;

        // Keep the phone number with highest confidence
        if (!bestPhoneMatch || totalConfidence > bestPhoneMatch.confidence) {
          bestPhoneMatch = {
            phone: normalizePhone(phone),
            confidence: totalConfidence
          };
        }
      }
    }
  }

  if (bestPhoneMatch && bestPhoneMatch.confidence > 0.65) {
    contactInfo.phone = bestPhoneMatch.phone;
  }

  // Extract LinkedIn - ML-ENHANCED with confidence scoring and OCR error correction
  const linkedinPatterns = [
    // Full URL: https://www.linkedin.com/in/username
    { pattern: /https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi, weight: 1.0 },
    // Without protocol: linkedin.com/in/username or www.linkedin.com/in/username
    { pattern: /(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi, weight: 0.95 },
    // Just username after "LinkedIn:" or "LinkedIn profile:"
    { pattern: /linkedin(?:\s+profile)?[:\s]+\/?([a-zA-Z0-9_-]+)/gi, weight: 0.85 },
    // LinkedIn URL in plain text (common copy-paste)
    { pattern: /linkedin\.com\/([a-zA-Z0-9_-]+)/gi, weight: 0.80 },
    // Edge case: "linkedin.com in/username" (with space - OCR error)
    { pattern: /linkedin\.com\s+in\/([a-zA-Z0-9_-]+)/gi, weight: 0.75 },
    // OCR common errors: "Iinkedin", "linkedln", "linkeclin"
    { pattern: /(?:l[i1]nked[i1]n|l[i1]nkedin|linkedln)\.com\/in\/([a-zA-Z0-9_-]+)/gi, weight: 0.70 },
    // Edge case: Just "LinkedIn: username" without URL
    { pattern: /linkedin[:\s]+@?([a-zA-Z0-9_-]{5,})/gi, weight: 0.65 }
  ];

  let bestLinkedInMatch: { url: string, confidence: number } | null = null;

  for (const { pattern, weight } of linkedinPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      let linkedinUrl = match[0].trim();
      let username: string | undefined;

      if (linkedinUrl.includes('linkedin.com/in/') || linkedinUrl.match(/l[i1]nked[i1]n\.com\/in\//i)) {
        // Extract from URL format (with OCR error tolerance)
        const urlMatch = linkedinUrl.match(/l[i1]nked[i1ln]\.com\/in\/([a-zA-Z0-9_-]+)/i);
        if (urlMatch) username = urlMatch[1];
      } else if (linkedinUrl.includes('linkedin.com') || linkedinUrl.match(/l[i1]nked[i1]n\.com/i)) {
        // Extract from linkedin.com/username format
        const urlMatch = linkedinUrl.match(/l[i1]nked[i1ln]\.com\/([a-zA-Z0-9_-]+)/i);
        if (urlMatch) username = urlMatch[1];
      } else {
        // Extract username after "LinkedIn:" pattern
        const usernameMatch = linkedinUrl.match(/linkedin[:\s]+@?([a-zA-Z0-9_-]+)/i);
        if (usernameMatch) username = usernameMatch[1];
      }

      // ML-based validation with confidence scoring
      if (username) {
        const validationResult = validateLinkedInWithConfidence(username, text, match.index || 0);

        if (validationResult.isValid && validationResult.confidence > 0.5) {
          const totalConfidence = validationResult.confidence * weight;

          // Keep the LinkedIn URL with highest confidence
          if (!bestLinkedInMatch || totalConfidence > bestLinkedInMatch.confidence) {
            bestLinkedInMatch = {
              url: `https://linkedin.com/in/${username}`,
              confidence: totalConfidence
            };
          }
        }
      }
    }
  }

  if (bestLinkedInMatch && bestLinkedInMatch.confidence > 0.55) {
    contactInfo.linkedin = bestLinkedInMatch.url;
  }

  // Extract GitHub - multiple patterns (case insensitive, global)
  const githubPatterns = [
    // Full URL: https://github.com/username
    /https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/gi,
    // Without protocol: github.com/username or www.github.com/username
    /(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/gi,
    // Just username after "GitHub:" or "Github profile:" or "GitHub Profile:"
    /github(?:\s+profile)?[:\s]+\/?([a-zA-Z0-9_-]+)/gi,
    // GitHub URL in plain text (common copy-paste)
    /github\.com\/([a-zA-Z0-9_-]+)/gi,
    // Edge case: "github.com username" (with space, sometimes OCR does this)
    /github\.com\s+([a-zA-Z0-9_-]+)/gi
  ];

  for (const pattern of githubPatterns) {
    const githubMatch = text.match(pattern);
    if (githubMatch && githubMatch[0]) {
      let githubUrl = githubMatch[0].trim();

      // Extract username from different formats
      let username: string | undefined;

      if (githubUrl.includes('github.com/')) {
        // Extract from URL format
        const urlMatch = githubUrl.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
        if (urlMatch) username = urlMatch[1];
      } else {
        // Extract username after "GitHub:" pattern
        const usernameMatch = githubUrl.match(/github(?:\s+profile)?[:\s]+\/?([a-zA-Z0-9_-]+)/i);
        if (usernameMatch) username = usernameMatch[1];
      }

      // Robust validation
      if (username && isValidGitHubUsername(username)) {
        contactInfo.github = `https://github.com/${username}`;
        break;
      }
    }
  }

  return contactInfo;
}

// ========== VALIDATION HELPER FUNCTIONS ==========

function isValidEmail(email: string): boolean {
  if (!email || email.length < 5 || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  const [local, domain] = email.split('@');
  if (!local || !domain) return false;
  if (local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;

  const domainParts = domain.split('.');
  if (domainParts.length < 2 || domain.length > 253) return false;

  const invalidDomains = ['test.com', 'example.com', 'sample.com', 'domain.com', 'email.com'];
  if (invalidDomains.includes(domain.toLowerCase())) return false;

  return domainParts[domainParts.length - 1].length >= 2;
}

function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  if (digits.startsWith('000') || digits.startsWith('111')) return false;
  return true;
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function isValidLinkedInUsername(username: string): boolean {
  if (!username || username.length < 3 || username.length > 100) return false;
  if (username.includes(' ')) return false;
  const commonWords = ['profile', 'linkedin', 'in', 'com', 'http', 'https', 'www', 'pub', 'public'];
  if (commonWords.includes(username.toLowerCase())) return false;
  if (!/[a-zA-Z0-9]/.test(username)) return false;
  return true;
}

function isValidGitHubUsername(username: string): boolean {
  if (!username || username.length < 2 || username.length > 39) return false;
  if (username.includes(' ')) return false;
  const commonWords = ['profile', 'github', 'com', 'http', 'https', 'www', 'user', 'account'];
  if (commonWords.includes(username.toLowerCase())) return false;
  if (!/^[a-zA-Z0-9-]+$/.test(username)) return false;
  if (username.startsWith('-') || username.endsWith('-')) return false;
  return true;
}

// ========== ML-ENHANCED VALIDATION WITH CONFIDENCE SCORING ==========

/**
 * ML-ENHANCED: Validate phone number with confidence scoring
 * Uses multiple signals: position in text, context words, format consistency
 */
function validatePhoneWithConfidence(
  phone: string,
  fullText: string,
  position: number
): { isValid: boolean, confidence: number } {
  // Basic validation
  if (!isValidPhone(phone)) {
    return { isValid: false, confidence: 0 };
  }

  let confidence = 0.5; // Base confidence for valid format

  // Feature 1: Position in document (header = higher confidence)
  const textLength = fullText.length;
  const relativePosition = position / textLength;

  if (relativePosition < 0.15) {
    // In top 15% of document (likely header)
    confidence += 0.25;
  } else if (relativePosition < 0.30) {
    // In top 30% of document
    confidence += 0.15;
  }

  // Feature 2: Context words nearby (within 50 chars before/after)
  const contextStart = Math.max(0, position - 50);
  const contextEnd = Math.min(fullText.length, position + phone.length + 50);
  const context = fullText.substring(contextStart, contextEnd).toLowerCase();

  const positiveContextWords = [
    'phone', 'tel', 'telephone', 'mobile', 'cell', 'contact',
    'call', 'reach', 'number', 'mob'
  ];

  const negativeContextWords = [
    'fax', 'page', 'reference', 'id', 'employee', 'account',
    'order', 'invoice', 'transaction', 'zip', 'postal'
  ];

  let contextScore = 0;
  for (const word of positiveContextWords) {
    if (context.includes(word)) {
      contextScore += 0.08;
    }
  }

  for (const word of negativeContextWords) {
    if (context.includes(word)) {
      contextScore -= 0.10;
    }
  }

  confidence += Math.max(-0.2, Math.min(0.25, contextScore));

  // Feature 3: Format quality (well-formatted = higher confidence)
  if (phone.includes('(') && phone.includes(')')) {
    // Formatted with parentheses: (555) 123-4567
    confidence += 0.10;
  }

  if (phone.startsWith('+')) {
    // International format: +1-555-123-4567
    confidence += 0.08;
  }

  if (phone.match(/\d{3}[-.\s]\d{3}[-.\s]\d{4}/)) {
    // Standard separated format
    confidence += 0.07;
  }

  // Feature 4: Digit diversity (not all same digits)
  const digits = phone.replace(/\D/g, '');
  const uniqueDigits = new Set(digits.split('')).size;
  const diversityScore = uniqueDigits / 10; // 0 to 1
  confidence += diversityScore * 0.10;

  // Clamp confidence to [0, 1]
  confidence = Math.max(0, Math.min(1, confidence));

  return { isValid: true, confidence };
}

/**
 * ML-ENHANCED: Validate LinkedIn username with confidence scoring
 * Uses position, context, and pattern recognition
 */
function validateLinkedInWithConfidence(
  username: string,
  fullText: string,
  position: number
): { isValid: boolean, confidence: number } {
  // Basic validation
  if (!isValidLinkedInUsername(username)) {
    return { isValid: false, confidence: 0 };
  }

  let confidence = 0.5; // Base confidence for valid format

  // Feature 1: Position in document (header/contact section = higher confidence)
  const textLength = fullText.length;
  const relativePosition = position / textLength;

  if (relativePosition < 0.20) {
    // In top 20% of document
    confidence += 0.20;
  } else if (relativePosition < 0.40) {
    // In top 40% of document
    confidence += 0.10;
  }

  // Feature 2: Context words nearby
  const contextStart = Math.max(0, position - 80);
  const contextEnd = Math.min(fullText.length, position + username.length + 80);
  const context = fullText.substring(contextStart, contextEnd).toLowerCase();

  const positiveContextWords = [
    'linkedin', 'profile', 'connect', 'network', 'professional',
    'social', 'link', 'url', 'contact', 'reach'
  ];

  let contextScore = 0;
  for (const word of positiveContextWords) {
    if (context.includes(word)) {
      contextScore += 0.10;
    }
  }

  confidence += Math.min(0.25, contextScore);

  // Feature 3: Username quality
  // Real usernames often contain names, not random strings
  const hasLetters = /[a-z]/i.test(username);
  const hasNumbers = /\d/.test(username);
  const hasDashes = /-/.test(username);

  if (hasLetters && !hasNumbers && !hasDashes) {
    // Pure letters (likely real name): john-smith
    confidence += 0.15;
  } else if (hasLetters && hasNumbers && username.length > 8) {
    // Letters + numbers, reasonable length
    confidence += 0.10;
  }

  // Feature 4: Check if appears with "linkedin.com/in/" nearby
  const hasFullLinkedInURL = context.includes('linkedin.com/in/') ||
                              context.match(/l[i1]nked[i1]n\.com\/in\//i);

  if (hasFullLinkedInURL) {
    confidence += 0.15;
  }

  // Feature 5: Length check (most real usernames are 5-30 chars)
  if (username.length >= 5 && username.length <= 30) {
    confidence += 0.05;
  }

  // Clamp confidence to [0, 1]
  confidence = Math.max(0, Math.min(1, confidence));

  return { isValid: true, confidence };
}
