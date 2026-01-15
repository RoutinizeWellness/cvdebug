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

  // Extract email - enhanced patterns
  const emailPatterns = [
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  ];

  for (const pattern of emailPatterns) {
    const emailMatch = text.match(pattern);
    if (emailMatch && emailMatch[0]) {
      // Clean up email (remove any surrounding characters)
      const cleanEmail = emailMatch[0].replace(/[<>()[\]{}]/g, '').trim();
      // Validate it looks like a real email
      if (cleanEmail.includes('@') && cleanEmail.includes('.') && cleanEmail.length > 5) {
        contactInfo.email = cleanEmail;
        break;
      }
    }
  }

  // Extract phone - enhanced patterns for international formats
  const phonePatterns = [
    // US/International with country code: +1 (555) 123-4567
    /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    // US format: (555) 123-4567 or 555-123-4567
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    // International: +44 20 7123 4567
    /\+\d{1,3}\s?\d{2,4}\s?\d{4}\s?\d{4}/g,
    // Simple: 555.123.4567
    /\d{3}[.-]\d{3}[.-]\d{4}/g
  ];

  for (const pattern of phonePatterns) {
    const phoneMatch = text.match(pattern);
    if (phoneMatch && phoneMatch[0]) {
      const cleanPhone = phoneMatch[0].trim();
      // Validate it has enough digits
      const digitCount = cleanPhone.replace(/\D/g, '').length;
      if (digitCount >= 10 && digitCount <= 15) {
        contactInfo.phone = cleanPhone;
        break;
      }
    }
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

      // Validate username (3-100 chars, alphanumeric with dash/underscore, not common words)
      if (username && username.length >= 3 && username.length <= 100) {
        const commonWords = ['profile', 'linkedin', 'in', 'com', 'http', 'https', 'www'];
        if (!commonWords.includes(username.toLowerCase())) {
          contactInfo.linkedin = `https://linkedin.com/in/${username}`;
          break;
        }
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

      // Validate username (2-39 chars per GitHub rules, not common words)
      if (username && username.length >= 2 && username.length <= 39) {
        const commonWords = ['profile', 'github', 'com', 'http', 'https', 'www'];
        if (!commonWords.includes(username.toLowerCase())) {
          contactInfo.github = `https://github.com/${username}`;
          break;
        }
      }
    }
  }

  return contactInfo;
}
