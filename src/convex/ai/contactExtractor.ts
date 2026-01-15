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

  // Extract phone - enhanced validation and normalization
  const phonePatterns = [
    // International: +1 (555) 123-4567, +44 20 7123 4567
    /\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
    // US: (555) 123-4567, 555-123-4567
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    // Simple: 555.123.4567
    /\d{3}[.-]\d{3}[.-]\d{4}/g
  ];

  for (const pattern of phonePatterns) {
    const phoneMatches = [...text.matchAll(pattern)];
    for (const match of phoneMatches) {
      const phone = match[0].trim();

      // Robust validation
      if (isValidPhone(phone)) {
        contactInfo.phone = normalizePhone(phone);
        break;
      }
    }
    if (contactInfo.phone) break;
  }

  // Extract LinkedIn - multiple patterns (case insensitive, global)
  const linkedinPatterns = [
    // Full URL: https://www.linkedin.com/in/username
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi,
    // Without protocol: linkedin.com/in/username or www.linkedin.com/in/username
    /(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi,
    // Just username after "LinkedIn:" or "LinkedIn profile:" or "LinkedIn Profile:"
    /linkedin(?:\s+profile)?[:\s]+\/?([a-zA-Z0-9_-]+)/gi,
    // LinkedIn URL in plain text (common copy-paste)
    /linkedin\.com\/([a-zA-Z0-9_-]+)/gi,
    // Edge case: "linkedin.com in/username" (with space)
    /linkedin\.com\s+in\/([a-zA-Z0-9_-]+)/gi
  ];

  for (const pattern of linkedinPatterns) {
    const linkedinMatch = text.match(pattern);
    if (linkedinMatch && linkedinMatch[0]) {
      let linkedinUrl = linkedinMatch[0].trim();

      // Extract username from different formats
      let username: string | undefined;

      if (linkedinUrl.includes('linkedin.com/in/')) {
        // Extract from URL format
        const urlMatch = linkedinUrl.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
        if (urlMatch) username = urlMatch[1];
      } else if (linkedinUrl.includes('linkedin.com')) {
        // Extract from linkedin.com/username format
        const urlMatch = linkedinUrl.match(/linkedin\.com\/([a-zA-Z0-9_-]+)/i);
        if (urlMatch) username = urlMatch[1];
      } else {
        // Extract username after "LinkedIn:" pattern
        const usernameMatch = linkedinUrl.match(/linkedin(?:\s+profile)?[:\s]+\/?([a-zA-Z0-9_-]+)/i);
        if (usernameMatch) username = usernameMatch[1];
      }

      // Robust validation
      if (username && isValidLinkedInUsername(username)) {
        contactInfo.linkedin = `https://linkedin.com/in/${username}`;
        break;
      }
    }
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
