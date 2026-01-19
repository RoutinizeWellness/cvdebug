/**
 * Comprehensive Resume Data Extractor
 *
 * Extracts ALL possible information from resume text:
 * - Contact info (email, phone, LinkedIn, GitHub, website)
 * - Education (degrees, schools, GPA, years)
 * - Experience (companies, titles, years, achievements)
 * - Skills (technical, soft, tools)
 * - Certifications
 * - Languages
 * - Metrics and quantifiable achievements
 */

export interface ComprehensiveResumeData {
  // Contact
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    portfolio?: string;
    location?: string;
  };

  // Education
  education: {
    highestDegree?: string;
    degrees: Array<{
      degree: string;
      field?: string;
      institution?: string;
      year?: string;
      gpa?: string;
    }>;
    totalYearsEducation: number;
  };

  // Experience
  experience: {
    totalYears: number;
    companies: string[];
    titles: string[];
    currentRole?: string;
    seniorityLevel: string; // Entry, Mid, Senior, Staff, Principal, Executive
    achievements: Array<{
      text: string;
      hasMetric: boolean;
      metric?: string;
      impact?: string;
    }>;
  };

  // Skills
  skills: {
    technical: string[];
    tools: string[];
    languages: string[];
    softSkills: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
  };

  // Certifications & Awards
  certifications: string[];
  awards: string[];

  // Language proficiency
  spokenLanguages: Array<{
    language: string;
    proficiency?: string;
  }>;

  // Metrics & Impact
  metrics: {
    totalMetrics: number;
    percentages: string[];
    moneyValues: string[];
    multipliers: string[];
    teamSizes: string[];
    userScales: string[];
  };

  // Quality indicators
  quality: {
    hasActionVerbs: boolean;
    hasQuantifiableResults: boolean;
    averageBulletPointQuality: number; // 0-100
    readabilityScore: number; // 0-100
    keywordDensity: number; // 0-100
  };
}

/**
 * Extract comprehensive data from resume text
 */
export function extractComprehensiveData(text: string): ComprehensiveResumeData {
  const lowerText = text.toLowerCase();

  // ========== CONTACT INFORMATION ==========
  const contact = extractContactInfo(text);

  // ========== EDUCATION ==========
  const education = extractEducation(text);

  // ========== EXPERIENCE ==========
  const experience = extractExperience(text);

  // ========== SKILLS ==========
  const skills = extractSkills(text);

  // ========== CERTIFICATIONS ==========
  const certifications = extractCertifications(text);

  // ========== AWARDS ==========
  const awards = extractAwards(text);

  // ========== LANGUAGES ==========
  const spokenLanguages = extractSpokenLanguages(text);

  // ========== METRICS ==========
  const metrics = extractMetrics(text);

  // ========== QUALITY INDICATORS ==========
  const quality = assessQuality(text);

  return {
    contact,
    education,
    experience,
    skills,
    certifications,
    awards,
    spokenLanguages,
    metrics,
    quality
  };
}

// ========== HELPER FUNCTIONS ==========

function extractContactInfo(text: string) {
  const contact: any = {};

  // Email - Enhanced validation with multiple patterns and domain checks
  const emailPatterns = [
    /([a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  ];

  for (const pattern of emailPatterns) {
    const emailMatches = [...text.matchAll(pattern)];
    for (const match of emailMatches) {
      const email = match[0].toLowerCase().trim();

      // Validate email structure and domain
      if (isValidEmail(email)) {
        contact.email = email;
        break;
      }
    }
    if (contact.email) break;
  }

  // Phone - Enhanced validation with international support and normalization
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

      // Validate phone has correct digit count and reasonable format
      if (isValidPhone(phone)) {
        contact.phone = normalizePhone(phone);
        break;
      }
    }
    if (contact.phone) break;
  }

  // LinkedIn - Multiple patterns for maximum detection
  const linkedinPatterns = [
    // Full URL with protocol
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
    // Without protocol
    /(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
    // Just "LinkedIn:" or "LinkedIn Profile:" followed by URL or username
    /linkedin(?:\s+profile)?[:\s]+(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
    // LinkedIn with username only (common in CVs)
    /linkedin[:\s]+\/?([a-zA-Z0-9_-]+)(?:\s|$|,|\.|\n)/i,
    // LinkedIn URL without /in/
    /linkedin\.com\/([a-zA-Z0-9_-]+)/i
  ];

  for (const pattern of linkedinPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const username = match[1].trim();
      // Robust validation for LinkedIn username
      if (isValidLinkedInUsername(username)) {
        contact.linkedin = `https://linkedin.com/in/${username}`;
        break;
      }
    }
  }

  // GitHub - Multiple patterns for maximum detection
  const githubPatterns = [
    // Full URL with protocol
    /https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i,
    // Without protocol
    /(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i,
    // Just "GitHub:" or "Github Profile:" followed by URL or username
    /github(?:\s+profile)?[:\s]+(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i,
    // GitHub with username only
    /github[:\s]+\/?([a-zA-Z0-9_-]+)(?:\s|$|,|\.|\n)/i,
    // GitHub URL without specific format
    /github\.com\/([a-zA-Z0-9_-]+)/i
  ];

  for (const pattern of githubPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const username = match[1].trim();
      // Robust validation for GitHub username
      if (isValidGitHubUsername(username)) {
        contact.github = `https://github.com/${username}`;
        break;
      }
    }
  }

  // Website/Portfolio - Enhanced validation
  const websitePatterns = [
    /(?:website|portfolio|personal\s+site)[:\s]+([a-zA-Z0-9.-]+\.[a-z]{2,})/gi,
    /\b(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|net|org|io|dev|me|co))\b/gi
  ];

  for (const pattern of websitePatterns) {
    const websiteMatches = [...text.matchAll(pattern)];
    for (const match of websiteMatches) {
      let website = match[1].trim();

      // Validate it's a reasonable website domain
      if (isValidWebsite(website)) {
        // Add protocol if missing
        if (!website.startsWith('http')) {
          website = `https://${website}`;
        }
        contact.website = website;
        break;
      }
    }
    if (contact.website) break;
  }

  // Location - Enhanced extraction with city, state, country patterns
  const locationPatterns = [
    /(?:location|based\s+in|city|address)[:\s]+([a-zA-Z\s,.-]+(?:USA|US|UK|CA)?)/gi,
    /\b([A-Z][a-z]+,\s+[A-Z]{2}(?:\s+\d{5})?)\b/g, // City, ST format
  ];

  for (const pattern of locationPatterns) {
    const locationMatches = [...text.matchAll(pattern)];
    for (const match of locationMatches) {
      const location = match[1].trim();

      // Validate location is reasonable (2-100 chars, not too many numbers)
      if (isValidLocation(location)) {
        contact.location = location;
        break;
      }
    }
    if (contact.location) break;
  }

  return contact;
}

function extractEducation(text: string) {
  const degrees: Array<any> = [];
  let highestDegree: string | undefined;
  let totalYears = 0;
  const degreeLevels = { PhD: 5, Masters: 3, Bachelors: 2, Associates: 1 };

  const degreePatterns = [
    { pattern: /\b(phd|ph\.d\.|doctorate|doctoral)\s+(?:in\s+)?([a-zA-Z\s]+?)(?:\s+(?:from|at|,)|\d{4}|$)/gi, level: 'PhD', years: 4 },
    { pattern: /\b(master'?s?|m\.s\.|m\.a\.|mba|m\.sc\.|m\.eng\.)\s+(?:in\s+)?([a-zA-Z\s]+?)(?:\s+(?:from|at|,)|\d{4}|$)/gi, level: 'Masters', years: 2 },
    { pattern: /\b(bachelor'?s?|b\.s\.|b\.a\.|b\.sc\.|b\.eng\.)\s+(?:in\s+)?([a-zA-Z\s]+?)(?:\s+(?:from|at|,)|\d{4}|$)/gi, level: 'Bachelors', years: 4 },
    { pattern: /\b(associate'?s?|a\.s\.|a\.a\.)\s+(?:in\s+)?([a-zA-Z\s]+?)(?:\s+(?:from|at|,)|\d{4}|$)/gi, level: 'Associates', years: 2 }
  ];

  for (const { pattern, level, years } of degreePatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      let field = match[2]?.trim();

      // Validate field of study
      if (field && isValidFieldOfStudy(field)) {
        // Clean up field (remove extra words)
        field = cleanFieldOfStudy(field);

        // Extract institution if present
        let institution: string | undefined;
        const institutionMatch = text.match(new RegExp(`${match[0]}.*?(?:from|at)\\s+([A-Z][a-zA-Z\\s&]+(?:University|College|Institute|School))`, 'i'));
        if (institutionMatch) {
          institution = institutionMatch[1].trim();
        }

        // Extract year if present
        let year: string | undefined;
        const yearMatch = text.match(new RegExp(`${match[0]}.*?(\\d{4})`, 'i'));
        if (yearMatch && isValidYear(parseInt(yearMatch[1]))) {
          year = yearMatch[1];
        }

        degrees.push({ degree: level, field, institution, year });
        totalYears = Math.max(totalYears, years);

        // Track highest degree
        if (!highestDegree || degreeLevels[level as keyof typeof degreeLevels] > degreeLevels[highestDegree as keyof typeof degreeLevels]) {
          highestDegree = level;
        }
      }
    }
  }

  // Extract GPA with validation
  const gpaPatterns = [
    /gpa[:\s]+(\d\.\d{1,2})\s*(?:\/\s*4\.0)?/gi,
    /(\d\.\d{1,2})\s*gpa/gi
  ];

  for (const pattern of gpaPatterns) {
    const gpaMatch = text.match(pattern);
    if (gpaMatch && degrees.length > 0) {
      const gpa = parseFloat(gpaMatch[1]);
      // Validate GPA is in reasonable range (0.0 - 4.0)
      if (gpa >= 0.0 && gpa <= 4.0) {
        degrees[0].gpa = gpaMatch[1];
        break;
      }
    }
  }

  return { highestDegree, degrees, totalYearsEducation: totalYears };
}

function extractExperience(text: string) {
  // Extract years of experience with robust validation
  const yearPatterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?(?:professional\s+)?experience/gi,
    /(\d{4})\s*[-–—]\s*(?:present|current|now|today)/gi,
    // Enhanced: Month YYYY - Present format (e.g., "June 2024 - Present", "Jan 2023 - Current")
    /(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{4})\s*[-–—]\s*(?:present|current|now|today)/gi,
    // Month/Year - Present format (e.g., "06/2024 - Present", "12/2023 - Current")
    /(\d{1,2})\/(\d{4})\s*[-–—]\s*(?:present|current|now|today)/gi,
    // Year only ranges
    /(\d{4})\s*[-–—]\s*(\d{4})/gi,
    // Month YYYY - Month YYYY format
    /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})\s*[-–—]\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{4})/gi
  ];

  let totalYears = 0;
  const experienceYears: number[] = [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const minValidYear = 1970;
  const maxValidYear = currentYear + 1;

  // Direct experience mention
  const directMatches = [...text.matchAll(yearPatterns[0])];
  for (const match of directMatches) {
    const years = parseInt(match[1]);
    // Validate years is reasonable (0-60 years)
    if (years > 0 && years <= 60) {
      totalYears = Math.max(totalYears, years);
    }
  }

  // Current job (ongoing) - Year only format (YYYY - Present)
  const currentYearMatches = [...text.matchAll(yearPatterns[1])];
  for (const match of currentYearMatches) {
    const start = parseInt(match[1]);
    if (isValidYear(start) && start <= currentYear && currentYear - start <= 50) {
      experienceYears.push(currentYear - start);
    }
  }

  // Current job with full month name (June 2024 - Present)
  const currentMonthNameMatches = [...text.matchAll(yearPatterns[2])];
  for (const match of currentMonthNameMatches) {
    const startYear = parseInt(match[1]);
    if (isValidYear(startYear) && startYear <= currentYear && currentYear - startYear <= 50) {
      // Calculate fractional years including months
      const yearsDiff = currentYear - startYear;
      // Add partial year (assume mid-year if month not specified, adds ~0.5 years for current year experiences)
      const fractionalYears = startYear === currentYear ? 1 : yearsDiff;
      experienceYears.push(fractionalYears);
    }
  }

  // Current job with MM/YYYY format (06/2024 - Present)
  const currentMonthSlashMatches = [...text.matchAll(yearPatterns[3])];
  for (const match of currentMonthSlashMatches) {
    const startMonth = parseInt(match[1]);
    const startYear = parseInt(match[2]);
    if (isValidYear(startYear) && startYear <= currentYear && currentYear - startYear <= 50 && startMonth >= 1 && startMonth <= 12) {
      const totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonth);
      const years = Math.max(1, Math.floor(totalMonths / 12));
      experienceYears.push(years);
    }
  }

  // Calculate from year-only date ranges (YYYY - YYYY)
  const dateRanges = [...text.matchAll(yearPatterns[4])];
  for (const match of dateRanges) {
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);

    // Validate years are reasonable and in correct order
    if (isValidYear(start) && isValidYear(end) && end >= start && end - start <= 50) {
      experienceYears.push(end - start);
    }
  }

  // Month YYYY - Month YYYY ranges
  const monthRangeMatches = [...text.matchAll(yearPatterns[5])];
  for (const match of monthRangeMatches) {
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    if (isValidYear(start) && isValidYear(end) && end >= start && end - start <= 50) {
      experienceYears.push(end - start);
    }
  }

  // Use calculated years if no direct mention
  if (experienceYears.length > 0 && totalYears === 0) {
    // Sum all unique experiences (cap at 50 years max)
    totalYears = Math.min(50, experienceYears.reduce((a, b) => a + b, 0));
  }

  // Ensure at least 0 years if we found any work history indicators
  if (totalYears === 0 && experienceYears.length > 0) {
    totalYears = Math.max(1, ...experienceYears);
  }

  // Extract companies with robust validation
  const companies: string[] = [];
  const companyPatterns = [
    /(?:at|@|for)\s+([A-Z][a-zA-Z0-9\s&.,']+(?:Inc|LLC|Ltd|Corporation|Corp|Co|Group|Solutions|Technologies)?)/g,
    /(?:worked\s+(?:at|for)|employed\s+(?:by|at))\s+([A-Z][a-zA-Z0-9\s&.,']+)/gi,
    /(?:company|employer)[:\s]+([A-Z][a-zA-Z0-9\s&.,']+)/gi
  ];

  for (const pattern of companyPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      let company = match[1].trim();

      // Clean up and validate company name
      if (isValidCompanyName(company)) {
        company = cleanCompanyName(company);
        if (!companies.includes(company) && companies.length < 20) {
          companies.push(company);
        }
      }
    }
  }

  // Extract job titles with robust validation
  const titles: string[] = [];
  const titlePatterns = [
    // Senior titles
    /\b(senior|lead|principal|staff|chief|head\s+of)\s+(engineer|developer|architect|designer|manager|analyst|scientist|consultant)/gi,
    // Specialized roles
    /\b(software|frontend|backend|full[\s-]?stack|data|product|project|devops|machine\s+learning|ai)\s+(engineer|developer|manager|analyst|architect)/gi,
    // Executive roles
    /\b(chief\s+(?:executive|technology|operating|financial|marketing|data)\s+officer|ceo|cto|coo|cfo|cmo|cdo)/gi,
    // Common roles
    /\b(engineer|developer|designer|analyst|manager|director|consultant|architect|specialist|coordinator)\b/gi
  ];

  const invalidTitles = ['experience', 'education', 'skills', 'summary', 'profile', 'objective', 'references'];

  for (const pattern of titlePatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      let title = match[0].trim();

      // Validate and clean title
      if (isValidJobTitle(title) && !invalidTitles.includes(title.toLowerCase())) {
        title = cleanJobTitle(title);
        if (!titles.includes(title) && titles.length < 15) {
          titles.push(title);
        }
      }
    }
  }

  // Determine seniority
  const seniorityLevel = determineSeniority(totalYears, text);

  // Extract achievements
  const achievements = extractAchievements(text);

  return {
    totalYears,
    companies: companies.slice(0, 10),
    titles: titles.slice(0, 10),
    currentRole: titles[0],
    seniorityLevel,
    achievements
  };
}

function determineSeniority(years: number, text: string): string {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('chief') || lowerText.includes('vp') || lowerText.includes('director')) {
    return 'Executive';
  }
  if (lowerText.includes('principal') || lowerText.includes('distinguished') || years >= 12) {
    return 'Principal';
  }
  if (lowerText.includes('staff') || lowerText.includes('lead') || years >= 8) {
    return 'Staff';
  }
  if (lowerText.includes('senior') || years >= 5) {
    return 'Senior';
  }
  if (years >= 2) {
    return 'Mid';
  }
  return 'Entry';
}

function extractAchievements(text: string) {
  const achievements: Array<any> = [];
  const bulletPoints = text.match(/^[\s]*[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*]\s+.+$/gm) || [];

  for (const bullet of bulletPoints.slice(0, 20)) {
    const cleanBullet = bullet.replace(/^[\s]*[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*]\s+/, '').trim();

    // Check if has metrics
    const hasMetric = /\d+%|\$\d+|[\d,]+\s+(?:users|customers|clients)|improved.*\d+|increased.*\d+/i.test(cleanBullet);

    let metric: string | undefined;
    let impact: string | undefined;

    if (hasMetric) {
      const metricMatch = cleanBullet.match(/(\d+%|\$[\d,kmb]+|\d+x|[\d,]+\s+(?:users|customers))/i);
      if (metricMatch) metric = metricMatch[1];

      const impactMatch = cleanBullet.match(/(increased|improved|reduced|saved|generated|grew|boosted|achieved)/i);
      if (impactMatch) impact = impactMatch[1];
    }

    achievements.push({
      text: cleanBullet.substring(0, 200),
      hasMetric,
      metric,
      impact
    });
  }

  return achievements;
}

function extractSkills(text: string) {
  const lowerText = text.toLowerCase();

  // Technical skills - Context-aware detection with false positive prevention
  const technicalKeywords = [
    // Programming Languages
    { skill: 'javascript', aliases: ['js', 'javascript', 'ecmascript'], context: ['developer', 'engineer', 'programming'] },
    { skill: 'typescript', aliases: ['ts', 'typescript'], context: ['developer', 'engineer'] },
    { skill: 'python', aliases: ['python', 'python3'], context: ['developer', 'data', 'ml', 'engineer'], exclude: ['snake', 'monty'] },
    { skill: 'java', aliases: ['java'], context: ['developer', 'engineer', 'backend'], exclude: ['javascript', 'coffee'] },
    { skill: 'c++', aliases: ['c++', 'cpp'], context: ['developer', 'engineer'] },
    { skill: 'c#', aliases: ['c#', 'csharp'], context: ['developer', 'engineer', '.net'] },
    { skill: 'go', aliases: ['golang', 'go'], context: ['developer', 'engineer', 'backend'] },
    { skill: 'rust', aliases: ['rust'], context: ['developer', 'engineer', 'systems'] },
    { skill: 'php', aliases: ['php'], context: ['developer', 'web', 'backend'] },
    { skill: 'ruby', aliases: ['ruby'], context: ['developer', 'rails'] },
    { skill: 'swift', aliases: ['swift'], context: ['ios', 'developer', 'mobile'] },
    { skill: 'kotlin', aliases: ['kotlin'], context: ['android', 'developer', 'mobile'] },
    // Frontend Frameworks
    { skill: 'react', aliases: ['react', 'react.js', 'reactjs'], context: ['frontend', 'web', 'developer'] },
    { skill: 'angular', aliases: ['angular', 'angularjs'], context: ['frontend', 'web', 'developer'] },
    { skill: 'vue', aliases: ['vue', 'vue.js', 'vuejs'], context: ['frontend', 'web', 'developer'] },
    { skill: 'svelte', aliases: ['svelte'], context: ['frontend', 'web', 'developer'] },
    { skill: 'next.js', aliases: ['next.js', 'nextjs', 'next'], context: ['react', 'frontend', 'web'] },
    // Backend Frameworks
    { skill: 'node.js', aliases: ['node.js', 'nodejs', 'node'], context: ['backend', 'javascript', 'developer'] },
    { skill: 'express', aliases: ['express', 'express.js'], context: ['node', 'backend', 'api'] },
    { skill: 'django', aliases: ['django'], context: ['python', 'backend', 'web'] },
    { skill: 'flask', aliases: ['flask'], context: ['python', 'backend', 'api'] },
    { skill: 'spring', aliases: ['spring', 'spring boot'], context: ['java', 'backend'] },
    { skill: 'laravel', aliases: ['laravel'], context: ['php', 'backend'] },
    // Databases
    { skill: 'sql', aliases: ['sql'], context: ['database', 'data', 'query'] },
    { skill: 'nosql', aliases: ['nosql'], context: ['database', 'mongodb', 'data'] },
    { skill: 'mongodb', aliases: ['mongodb', 'mongo'], context: ['database', 'nosql', 'backend'] },
    { skill: 'postgresql', aliases: ['postgresql', 'postgres'], context: ['database', 'sql', 'backend'] },
    { skill: 'mysql', aliases: ['mysql'], context: ['database', 'sql'] },
    { skill: 'redis', aliases: ['redis'], context: ['cache', 'database', 'backend'] },
    { skill: 'elasticsearch', aliases: ['elasticsearch', 'elastic'], context: ['search', 'database'] },
    { skill: 'dynamodb', aliases: ['dynamodb'], context: ['aws', 'database', 'nosql'] },
    // Cloud Platforms
    { skill: 'aws', aliases: ['aws', 'amazon web services'], context: ['cloud', 'devops', 'infrastructure'] },
    { skill: 'azure', aliases: ['azure', 'microsoft azure'], context: ['cloud', 'devops', 'microsoft'] },
    { skill: 'gcp', aliases: ['gcp', 'google cloud'], context: ['cloud', 'devops', 'google'] },
    // DevOps Tools
    { skill: 'docker', aliases: ['docker'], context: ['devops', 'container', 'deployment'] },
    { skill: 'kubernetes', aliases: ['kubernetes', 'k8s'], context: ['devops', 'container', 'orchestration'] },
    { skill: 'terraform', aliases: ['terraform'], context: ['devops', 'infrastructure', 'iac'] },
    { skill: 'jenkins', aliases: ['jenkins'], context: ['ci/cd', 'devops', 'automation'] },
    { skill: 'git', aliases: ['git'], context: ['version control', 'github', 'gitlab'] },
    // AI/ML
    { skill: 'machine learning', aliases: ['machine learning', 'ml'], context: ['ai', 'data', 'model'] },
    { skill: 'deep learning', aliases: ['deep learning', 'dl'], context: ['ai', 'neural', 'model'] },
    { skill: 'tensorflow', aliases: ['tensorflow'], context: ['ml', 'ai', 'deep learning'] },
    { skill: 'pytorch', aliases: ['pytorch'], context: ['ml', 'ai', 'deep learning'] },
    { skill: 'nlp', aliases: ['nlp', 'natural language processing'], context: ['ai', 'ml', 'text'] }
  ];

  const technical: string[] = [];
  for (const { skill, aliases, context, exclude } of technicalKeywords) {
    // Check if any alias is present
    const hasSkill = aliases.some(alias => {
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lowerText);
    });

    if (hasSkill) {
      // Validate with context (at least one context keyword should be present)
      const hasContext = context.length === 0 || context.some(ctx => lowerText.includes(ctx.toLowerCase()));

      // Check for exclusions (false positive prevention)
      const hasExclusion = exclude && exclude.some(exc => lowerText.includes(exc.toLowerCase()));

      if (hasContext && !hasExclusion && !technical.includes(skill)) {
        technical.push(skill);
      }
    }
  }

  // Tools - Enhanced detection
  const toolsKeywords = [
    'jira', 'confluence', 'figma', 'sketch', 'photoshop', 'illustrator',
    'tableau', 'power bi', 'excel', 'slack', 'notion', 'linear',
    'trello', 'asana', 'monday.com', 'miro', 'invision', 'adobe xd'
  ];

  const tools = toolsKeywords.filter(tool => {
    const regex = new RegExp(`\\b${tool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(lowerText);
  });

  // Programming languages (deduplicated from technical)
  const languages = technical.filter(skill =>
    ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'].includes(skill)
  );

  // Soft skills - Enhanced list
  const softSkillsKeywords = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'project management', 'stakeholder management', 'mentoring', 'collaboration',
    'critical thinking', 'time management', 'adaptability', 'creativity',
    'public speaking', 'negotiation', 'conflict resolution', 'emotional intelligence'
  ];

  const softSkills = softSkillsKeywords.filter(skill => lowerText.includes(skill));

  // Frameworks (deduplicated from technical)
  const frameworks = technical.filter(skill =>
    ['react', 'angular', 'vue', 'svelte', 'next.js', 'express', 'django', 'flask', 'spring', 'laravel'].includes(skill)
  );

  // Databases (deduplicated from technical)
  const databases = technical.filter(skill =>
    ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'sql', 'nosql'].includes(skill)
  );

  // Cloud (deduplicated from technical)
  const cloud = technical.filter(skill =>
    ['aws', 'azure', 'gcp', 'heroku', 'digitalocean', 'vercel', 'netlify'].includes(skill)
  );

  return {
    technical,
    tools,
    languages,
    softSkills,
    frameworks,
    databases,
    cloud
  };
}

function extractCertifications(text: string) {
  const certifications: string[] = [];

  // Known certification patterns - Industry standard certifications
  const knownCertifications = [
    // AWS Certifications
    { pattern: /aws\s+certified\s+solutions\s+architect/gi, name: 'AWS Certified Solutions Architect' },
    { pattern: /aws\s+certified\s+developer/gi, name: 'AWS Certified Developer' },
    { pattern: /aws\s+certified\s+sysops/gi, name: 'AWS Certified SysOps Administrator' },
    { pattern: /aws\s+certified\s+devops/gi, name: 'AWS Certified DevOps Engineer' },
    { pattern: /aws\s+certified\s+cloud\s+practitioner/gi, name: 'AWS Certified Cloud Practitioner' },
    { pattern: /aws\s+certified\s+security/gi, name: 'AWS Certified Security Specialty' },
    { pattern: /aws\s+certified\s+machine\s+learning/gi, name: 'AWS Certified Machine Learning Specialty' },

    // Azure Certifications
    { pattern: /azure\s+(?:solutions\s+)?architect/gi, name: 'Microsoft Azure Solutions Architect' },
    { pattern: /azure\s+developer/gi, name: 'Microsoft Azure Developer' },
    { pattern: /azure\s+administrator/gi, name: 'Microsoft Azure Administrator' },
    { pattern: /azure\s+devops/gi, name: 'Microsoft Azure DevOps Engineer' },
    { pattern: /azure\s+fundamentals/gi, name: 'Microsoft Azure Fundamentals' },
    { pattern: /az-\d{3}/gi, name: 'Microsoft Azure Certification' },

    // Google Cloud Certifications
    { pattern: /google\s+cloud\s+(?:certified\s+)?(?:professional\s+)?architect/gi, name: 'Google Cloud Professional Architect' },
    { pattern: /google\s+cloud\s+(?:certified\s+)?(?:professional\s+)?developer/gi, name: 'Google Cloud Professional Developer' },
    { pattern: /google\s+cloud\s+(?:certified\s+)?(?:professional\s+)?engineer/gi, name: 'Google Cloud Professional Engineer' },
    { pattern: /gcp\s+(?:certified|professional)/gi, name: 'Google Cloud Platform Certification' },

    // Project Management
    { pattern: /\bpmp\b/gi, name: 'Project Management Professional (PMP)' },
    { pattern: /capm\b/gi, name: 'Certified Associate in Project Management (CAPM)' },
    { pattern: /prince2/gi, name: 'PRINCE2' },
    { pattern: /scrum\s+master/gi, name: 'Certified Scrum Master (CSM)' },
    { pattern: /product\s+owner/gi, name: 'Certified Scrum Product Owner (CSPO)' },
    { pattern: /safe\s+(?:agilist|certified)/gi, name: 'SAFe Certified' },

    // Security Certifications
    { pattern: /\bcissp\b/gi, name: 'Certified Information Systems Security Professional (CISSP)' },
    { pattern: /\bceh\b/gi, name: 'Certified Ethical Hacker (CEH)' },
    { pattern: /\bcism\b/gi, name: 'Certified Information Security Manager (CISM)' },
    { pattern: /\bcisa\b/gi, name: 'Certified Information Systems Auditor (CISA)' },
    { pattern: /comptia\s+security\+/gi, name: 'CompTIA Security+' },
    { pattern: /comptia\s+network\+/gi, name: 'CompTIA Network+' },
    { pattern: /comptia\s+a\+/gi, name: 'CompTIA A+' },

    // Developer Certifications
    { pattern: /oracle\s+certified\s+(?:professional|associate)/gi, name: 'Oracle Certified Professional' },
    { pattern: /java\s+certified/gi, name: 'Java Certification' },
    { pattern: /microsoft\s+certified\s+(?:solutions\s+)?(?:developer|associate)/gi, name: 'Microsoft Certified Developer' },
    { pattern: /red\s+hat\s+certified/gi, name: 'Red Hat Certified' },

    // Data & Analytics
    { pattern: /tableau\s+(?:desktop\s+)?(?:certified|specialist)/gi, name: 'Tableau Certification' },
    { pattern: /power\s+bi\s+certified/gi, name: 'Microsoft Power BI Certification' },
    { pattern: /google\s+analytics\s+(?:certified|qualification)/gi, name: 'Google Analytics Certification' },
    { pattern: /cloudera\s+certified/gi, name: 'Cloudera Certification' },

    // Specialized
    { pattern: /kubernetes\s+(?:certified|certification)/gi, name: 'Kubernetes Certification' },
    { pattern: /\bcka\b/gi, name: 'Certified Kubernetes Administrator (CKA)' },
    { pattern: /\bckad\b/gi, name: 'Certified Kubernetes Application Developer (CKAD)' },
    { pattern: /docker\s+certified/gi, name: 'Docker Certified Associate' },
    { pattern: /salesforce\s+certified/gi, name: 'Salesforce Certification' },
    { pattern: /adobe\s+certified/gi, name: 'Adobe Certification' },
    { pattern: /hubspot\s+certified/gi, name: 'HubSpot Certification' },

    // Professional
    { pattern: /\bcpa\b/gi, name: 'Certified Public Accountant (CPA)' },
    { pattern: /six\s+sigma/gi, name: 'Six Sigma Certification' },
    { pattern: /itil\s+(?:v\d+|foundation|expert)/gi, name: 'ITIL Certification' },
    { pattern: /togaf/gi, name: 'TOGAF Certification' }
  ];

  // Check for known certifications
  for (const { pattern, name } of knownCertifications) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0 && !certifications.includes(name)) {
      certifications.push(name);
    }
  }

  // Generic certification patterns (fallback for unknown certifications)
  const genericPatterns = [
    /(?:certified|certification)[:\s]+([A-Z][a-zA-Z0-9\s\-]+(?:Professional|Associate|Expert|Specialist|Administrator|Developer|Engineer))/gi,
    /([A-Z][a-zA-Z0-9\s]+)\s+(?:certified|certification)/gi
  ];

  for (const pattern of genericPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const cert = (match[1] || match[0]).trim();

      // Validate certification name
      if (isValidCertification(cert) && !certifications.includes(cert)) {
        certifications.push(cert);
      }
    }
  }

  return [...new Set(certifications)].slice(0, 15);
}

function extractAwards(text: string) {
  const awards: string[] = [];

  // Known award patterns
  const knownAwardPatterns = [
    // Employee awards
    { pattern: /employee\s+of\s+the\s+(?:month|quarter|year)/gi, extract: true },
    { pattern: /(?:best|top)\s+performer/gi, extract: true },
    { pattern: /excellence\s+award/gi, extract: true },
    { pattern: /outstanding\s+(?:performance|achievement|contribution)/gi, extract: true },
    { pattern: /leadership\s+award/gi, extract: true },
    { pattern: /innovation\s+award/gi, extract: true },
    { pattern: /team\s+player\s+award/gi, extract: true },
    { pattern: /rookie\s+of\s+the\s+year/gi, extract: true },
    { pattern: /rising\s+star\s+award/gi, extract: true },
    { pattern: /president'?s\s+(?:club|award)/gi, extract: true },

    // Academic honors
    { pattern: /dean'?s\s+list/gi, extract: true },
    { pattern: /honor\s+roll/gi, extract: true },
    { pattern: /summa\s+cum\s+laude/gi, extract: true },
    { pattern: /magna\s+cum\s+laude/gi, extract: true },
    { pattern: /cum\s+laude/gi, extract: true },
    { pattern: /academic\s+(?:excellence|achievement)/gi, extract: true },
    { pattern: /valedictorian/gi, extract: true },
    { pattern: /salutatorian/gi, extract: true },

    // Professional recognition
    { pattern: /\d{4}\s+(?:40\s+under\s+40|30\s+under\s+30)/gi, extract: true },
    { pattern: /recognized\s+as\s+(?:top|leading)/gi, extract: true },
    { pattern: /industry\s+award/gi, extract: true },
    { pattern: /patent\s+(?:award|granted)/gi, extract: true }
  ];

  // Check for known awards
  for (const { pattern } of knownAwardPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const award = match[0].trim();
      // Capitalize properly
      const formattedAward = award.charAt(0).toUpperCase() + award.slice(1).toLowerCase();
      if (!awards.includes(formattedAward) && awards.length < 15) {
        awards.push(formattedAward);
      }
    }
  }

  // Generic award patterns (fallback)
  const genericPatterns = [
    /(?:awarded|award|received|won)[:\s]+([A-Z][a-zA-Z0-9\s\-']+(?:Award|Recognition|Honor|Prize|Medal))/gi,
    /([A-Z][a-zA-Z0-9\s\-']+(?:Award|Recognition|Honor|Prize|Medal))/gi
  ];

  for (const pattern of genericPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const award = (match[1] || match[0]).trim();

      // Validate award name
      if (isValidAward(award) && !awards.includes(award) && awards.length < 15) {
        awards.push(award);
      }
    }
  }

  return [...new Set(awards)].slice(0, 15);
}

function extractSpokenLanguages(text: string) {
  const languages: Array<{ language: string; proficiency?: string }> = [];

  const languageNames = [
    'english', 'spanish', 'french', 'german', 'chinese', 'mandarin', 'japanese',
    'korean', 'arabic', 'portuguese', 'russian', 'italian', 'hindi', 'dutch'
  ];

  const proficiencyLevels = ['native', 'fluent', 'proficient', 'intermediate', 'basic', 'conversational'];

  for (const lang of languageNames) {
    const pattern = new RegExp(`\\b${lang}\\b[:\\s]*(${proficiencyLevels.join('|')})?`, 'gi');
    const match = text.match(pattern);
    if (match) {
      const profMatch = proficiencyLevels.find(p => match[0].toLowerCase().includes(p));
      languages.push({
        language: lang.charAt(0).toUpperCase() + lang.slice(1),
        proficiency: profMatch
      });
    }
  }

  return languages;
}

function extractMetrics(text: string) {
  const percentages: string[] = [];
  const moneyValues: string[] = [];
  const multipliers: string[] = [];
  const teamSizes: string[] = [];
  const userScales: string[] = [];

  // Percentages with validation (0-1000%)
  const percentMatches = [...text.matchAll(/\d+(?:\.\d+)?%/g)];
  for (const match of percentMatches) {
    const value = parseFloat(match[0].replace('%', ''));
    // Validate percentage is reasonable (0-1000%)
    if (value >= 0 && value <= 1000) {
      percentages.push(match[0]);
    }
  }

  // Money with validation
  const moneyMatches = [...text.matchAll(/\$[\d,]+(?:\.\d+)?[kmb]?/gi)];
  for (const match of moneyMatches) {
    const moneyStr = match[0];
    // Validate it's a reasonable money value (not just $0 or invalid)
    if (isValidMoneyValue(moneyStr)) {
      moneyValues.push(moneyStr);
    }
  }

  // Multipliers with validation (1x-1000x)
  const multMatches = [...text.matchAll(/(\d+)x\s+/gi)];
  for (const match of multMatches) {
    const multiplier = parseInt(match[1]);
    // Validate multiplier is reasonable (1-1000x)
    if (multiplier >= 1 && multiplier <= 1000) {
      multipliers.push(`${multiplier}x`);
    }
  }

  // Team sizes with validation (2-10000 people)
  const teamMatches = [...text.matchAll(/(?:team\s+of|managed|led|supervised)\s+(\d+)/gi)];
  for (const match of teamMatches) {
    const teamSize = parseInt(match[1]);
    // Validate team size is reasonable (2-10000)
    if (teamSize >= 2 && teamSize <= 10000) {
      teamSizes.push(match[1]);
    }
  }

  // User scales with validation
  const userMatches = [...text.matchAll(/(\d+[km]?)\s+(?:users|customers|clients|downloads|visitors)/gi)];
  for (const match of userMatches) {
    const userScale = match[1];
    // Validate user scale is reasonable
    if (isValidUserScale(userScale)) {
      userScales.push(userScale);
    }
  }

  return {
    totalMetrics: percentages.length + moneyValues.length + multipliers.length + teamSizes.length + userScales.length,
    percentages: [...new Set(percentages)].slice(0, 20),
    moneyValues: [...new Set(moneyValues)].slice(0, 20),
    multipliers: [...new Set(multipliers)].slice(0, 10),
    teamSizes: [...new Set(teamSizes)].slice(0, 10),
    userScales: [...new Set(userScales)].slice(0, 10)
  };
}

function assessQuality(text: string) {
  const actionVerbs = [
    'led', 'managed', 'developed', 'created', 'designed', 'implemented', 'optimized',
    'increased', 'reduced', 'saved', 'achieved', 'launched', 'built', 'engineered'
  ];

  const hasActionVerbs = actionVerbs.some(verb =>
    new RegExp(`\\b${verb}\\b`, 'i').test(text)
  );

  const hasQuantifiableResults = /\d+%|\$\d+|increased|improved|reduced|grew|saved/i.test(text);

  // Calculate average bullet point quality
  const bulletPoints = text.match(/^[\s]*[•●○■▪▫◦▸▹►▻⦿⦾\-–—\*]\s+.+$/gm) || [];
  let qualityScore = 0;

  for (const bullet of bulletPoints) {
    let score = 0;
    if (actionVerbs.some(v => new RegExp(`\\b${v}\\b`, 'i').test(bullet))) score += 30;
    if (/\d+/.test(bullet)) score += 40;
    if (/\d+%|\$\d+/i.test(bullet)) score += 30;
    qualityScore += Math.min(100, score);
  }

  const averageBulletPointQuality = bulletPoints.length > 0 ? qualityScore / bulletPoints.length : 0;

  // Readability (simple Flesch reading ease approximation)
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  const avgWordsPerSentence = words / Math.max(sentences, 1);
  const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 5));

  // Keyword density
  const technicalTerms = ['python', 'javascript', 'react', 'aws', 'sql', 'docker', 'api', 'cloud'];
  const foundTerms = technicalTerms.filter(term => text.toLowerCase().includes(term));
  const keywordDensity = (foundTerms.length / technicalTerms.length) * 100;

  return {
    hasActionVerbs,
    hasQuantifiableResults,
    averageBulletPointQuality: Math.round(averageBulletPointQuality),
    readabilityScore: Math.round(readabilityScore),
    keywordDensity: Math.round(keywordDensity)
  };
}

// ========== VALIDATION HELPER FUNCTIONS ==========

/**
 * Validate email address structure and domain
 */
function isValidEmail(email: string): boolean {
  if (!email || email.length < 5 || email.length > 254) return false;

  // Basic email structure validation
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return false;

  // Split into local and domain parts
  const [local, domain] = email.split('@');
  if (!local || !domain) return false;

  // Validate local part (before @)
  if (local.length > 64) return false;
  if (local.startsWith('.') || local.endsWith('.')) return false;
  if (local.includes('..')) return false;

  // Validate domain part (after @)
  if (domain.length > 253) return false;
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;

  // Check for invalid domains
  const invalidDomains = ['test.com', 'example.com', 'sample.com', 'domain.com', 'email.com'];
  if (invalidDomains.includes(domain.toLowerCase())) return false;

  // Ensure TLD is at least 2 chars
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;

  return true;
}

/**
 * Validate phone number format and digit count
 */
function isValidPhone(phone: string): boolean {
  if (!phone) return false;

  // Extract digits only
  const digits = phone.replace(/\D/g, '');

  // Validate digit count (10-15 digits)
  if (digits.length < 10 || digits.length > 15) return false;

  // Reject obviously invalid patterns (all same digit)
  if (/^(\d)\1+$/.test(digits)) return false;

  // Reject if starts with invalid area codes
  if (digits.startsWith('000') || digits.startsWith('111')) return false;

  return true;
}

/**
 * Normalize phone number to consistent format
 */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  // US format: (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // International format: +X XXX XXX XXXX
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return original if can't normalize
  return phone;
}

/**
 * Validate LinkedIn username
 */
function isValidLinkedInUsername(username: string): boolean {
  if (!username || username.length < 3 || username.length > 100) return false;
  if (username.includes(' ')) return false;

  // Filter out common words and invalid patterns
  const commonWords = ['profile', 'linkedin', 'in', 'com', 'http', 'https', 'www', 'pub', 'public'];
  if (commonWords.includes(username.toLowerCase())) return false;

  // Must contain alphanumeric characters
  if (!/[a-zA-Z0-9]/.test(username)) return false;

  return true;
}

/**
 * Validate GitHub username
 */
function isValidGitHubUsername(username: string): boolean {
  if (!username || username.length < 2 || username.length > 39) return false;
  if (username.includes(' ')) return false;

  // Filter out common words and invalid patterns
  const commonWords = ['profile', 'github', 'com', 'http', 'https', 'www', 'user', 'account'];
  if (commonWords.includes(username.toLowerCase())) return false;

  // GitHub usernames can only contain alphanumeric characters and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(username)) return false;

  // Can't start or end with hyphen
  if (username.startsWith('-') || username.endsWith('-')) return false;

  return true;
}

/**
 * Validate website domain
 */
function isValidWebsite(website: string): boolean {
  if (!website || website.length < 4 || website.length > 253) return false;

  // Remove protocol if present
  let domain = website.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

  // Must have at least one dot
  if (!domain.includes('.')) return false;

  // Filter out invalid domains
  const invalidDomains = ['example.com', 'test.com', 'sample.com', 'domain.com', 'localhost', 'github.com', 'linkedin.com'];
  if (invalidDomains.some(invalid => domain.toLowerCase().includes(invalid))) return false;

  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;
  return domainRegex.test(domain);
}

/**
 * Validate location string
 */
function isValidLocation(location: string): boolean {
  if (!location || location.length < 2 || location.length > 100) return false;

  // Must contain at least some letters
  if (!/[a-zA-Z]/.test(location)) return false;

  // Filter out obviously invalid locations
  const invalidLocations = ['none', 'n/a', 'na', 'unknown', 'location', 'city', 'state', 'country'];
  if (invalidLocations.includes(location.toLowerCase().trim())) return false;

  // Reject if too many numbers (likely not a location)
  const digitCount = (location.match(/\d/g) || []).length;
  if (digitCount > location.length * 0.3) return false;

  return true;
}

/**
 * Validate field of study
 */
function isValidFieldOfStudy(field: string): boolean {
  if (!field || field.length < 2 || field.length > 100) return false;

  // Must contain at least some letters
  if (!/[a-zA-Z]/.test(field)) return false;

  // Filter out common invalid fields
  const invalidFields = ['degree', 'education', 'university', 'college', 'school', 'from', 'at', 'in'];
  if (invalidFields.includes(field.toLowerCase().trim())) return false;

  return true;
}

/**
 * Clean up field of study string
 */
function cleanFieldOfStudy(field: string): string {
  // Remove trailing punctuation and extra words
  return field
    .replace(/\s+(?:from|at|,|\.).*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Validate year is reasonable
 */
function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1970 && year <= currentYear + 1;
}

/**
 * Validate company name
 */
function isValidCompanyName(company: string): boolean {
  if (!company || company.length < 2 || company.length > 100) return false;

  // Must contain at least some letters
  if (!/[a-zA-Z]/.test(company)) return false;

  // Filter out invalid company indicators
  const invalidCompanies = ['experience', 'work', 'employment', 'company', 'employer', 'job', 'position', 'role'];
  if (invalidCompanies.includes(company.toLowerCase().trim())) return false;

  return true;
}

/**
 * Clean up company name
 */
function cleanCompanyName(company: string): string {
  return company
    .replace(/\s*[-–]\s*.*$/, '') // Remove everything after dash
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Validate job title
 */
function isValidJobTitle(title: string): boolean {
  if (!title || title.length < 2 || title.length > 100) return false;

  // Must contain at least some letters
  if (!/[a-zA-Z]/.test(title)) return false;

  return true;
}

/**
 * Clean up job title
 */
function cleanJobTitle(title: string): string {
  // Capitalize first letter of each word
  return title
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

/**
 * Validate money value
 */
function isValidMoneyValue(money: string): boolean {
  if (!money) return false;

  // Extract numeric value
  const numStr = money.replace(/[$,]/g, '').toLowerCase();
  let multiplier = 1;

  if (numStr.endsWith('k')) {
    multiplier = 1000;
  } else if (numStr.endsWith('m')) {
    multiplier = 1000000;
  } else if (numStr.endsWith('b')) {
    multiplier = 1000000000;
  }

  const value = parseFloat(numStr.replace(/[kmb]/gi, '')) * multiplier;

  // Validate value is reasonable ($1 - $1 trillion)
  return value >= 1 && value <= 1000000000000;
}

/**
 * Validate user scale
 */
function isValidUserScale(scale: string): boolean {
  if (!scale) return false;

  // Extract numeric value
  const numStr = scale.toLowerCase();
  let multiplier = 1;

  if (numStr.endsWith('k')) {
    multiplier = 1000;
  } else if (numStr.endsWith('m')) {
    multiplier = 1000000;
  }

  const value = parseFloat(numStr.replace(/[km]/gi, '')) * multiplier;

  // Validate value is reasonable (1 - 10 billion users)
  return value >= 1 && value <= 10000000000;
}

/**
 * Validate certification name
 */
function isValidCertification(cert: string): boolean {
  if (!cert || cert.length < 5 || cert.length > 150) return false;

  // Must contain letters
  if (!/[a-zA-Z]/.test(cert)) return false;

  // Filter out invalid certification keywords
  const invalidKeywords = [
    'certification', 'certified', 'certificate', 'course', 'training',
    'education', 'degree', 'skills', 'experience', 'summary'
  ];

  const lowerCert = cert.toLowerCase().trim();

  // Reject if it's just a keyword without actual cert name
  if (invalidKeywords.includes(lowerCert)) return false;

  // Reject if too short after removing common words
  const cleanedCert = lowerCert
    .replace(/\b(certified|certification|certificate)\b/gi, '')
    .trim();

  if (cleanedCert.length < 3) return false;

  // Should have reasonable word count (1-10 words)
  const wordCount = cert.split(/\s+/).length;
  if (wordCount < 1 || wordCount > 10) return false;

  return true;
}

/**
 * Validate award name
 */
function isValidAward(award: string): boolean {
  if (!award || award.length < 5 || award.length > 150) return false;

  // Must contain letters
  if (!/[a-zA-Z]/.test(award)) return false;

  // Filter out invalid award keywords
  const invalidKeywords = [
    'award', 'awards', 'recognition', 'honor', 'honors',
    'achievement', 'achievements', 'summary', 'skills'
  ];

  const lowerAward = award.toLowerCase().trim();

  // Reject if it's just a keyword without actual award name
  if (invalidKeywords.includes(lowerAward)) return false;

  // Reject if too many numbers (likely not an award)
  const digitCount = (award.match(/\d/g) || []).length;
  if (digitCount > award.length * 0.3) return false;

  // Should have reasonable word count (2-15 words)
  const wordCount = award.split(/\s+/).length;
  if (wordCount < 2 || wordCount > 15) return false;

  return true;
}
