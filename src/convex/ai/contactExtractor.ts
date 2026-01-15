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

  // Extract LinkedIn - multiple patterns
  const linkedinPatterns = [
    // Full URL: https://www.linkedin.com/in/username
    /https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi,
    // Without protocol: linkedin.com/in/username
    /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/gi,
    // Just username after "LinkedIn:" or "LinkedIn profile:"
    /linkedin[:\s]+\/?([a-zA-Z0-9_-]+)/gi
  ];

  for (const pattern of linkedinPatterns) {
    const linkedinMatch = text.match(pattern);
    if (linkedinMatch && linkedinMatch[0]) {
      let linkedinUrl = linkedinMatch[0].trim();

      // Normalize to full URL
      if (!linkedinUrl.startsWith('http')) {
        if (linkedinUrl.startsWith('linkedin.com')) {
          linkedinUrl = 'https://' + linkedinUrl;
        } else if (linkedinUrl.includes('linkedin.com/in/')) {
          linkedinUrl = 'https://' + linkedinUrl;
        } else {
          // Extract username and build URL
          const usernameMatch = linkedinUrl.match(/([a-zA-Z0-9_-]+)$/);
          if (usernameMatch) {
            linkedinUrl = `https://linkedin.com/in/${usernameMatch[1]}`;
          }
        }
      }

      contactInfo.linkedin = linkedinUrl;
      break;
    }
  }

  // Extract GitHub - multiple patterns
  const githubPatterns = [
    // Full URL: https://github.com/username
    /https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)/gi,
    // Without protocol: github.com/username
    /github\.com\/([a-zA-Z0-9_-]+)/gi,
    // Just username after "GitHub:" or "Github profile:"
    /github[:\s]+\/?([a-zA-Z0-9_-]+)/gi
  ];

  for (const pattern of githubPatterns) {
    const githubMatch = text.match(pattern);
    if (githubMatch && githubMatch[0]) {
      let githubUrl = githubMatch[0].trim();

      // Normalize to full URL
      if (!githubUrl.startsWith('http')) {
        if (githubUrl.startsWith('github.com')) {
          githubUrl = 'https://' + githubUrl;
        } else {
          // Extract username and build URL
          const usernameMatch = githubUrl.match(/([a-zA-Z0-9_-]+)$/);
          if (usernameMatch) {
            githubUrl = `https://github.com/${usernameMatch[1]}`;
          }
        }
      }

      contactInfo.github = githubUrl;
      break;
    }
  }

  return contactInfo;
}
