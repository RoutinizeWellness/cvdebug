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

  // Email
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
  if (emailMatch) contact.email = emailMatch[1];

  // Phone
  const phoneMatch = text.match(/\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) contact.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;

  // GitHub
  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) contact.github = `https://github.com/${githubMatch[1]}`;

  // Website/Portfolio
  const websiteMatch = text.match(/(?:website|portfolio|personal site)[:\s]+([a-zA-Z0-9.-]+\.[a-z]{2,})/i);
  if (websiteMatch) contact.website = websiteMatch[1];

  // Location
  const locationMatch = text.match(/(?:location|based in|city)[:\s]+([a-zA-Z\s,]+)/i);
  if (locationMatch) contact.location = locationMatch[1].trim();

  return contact;
}

function extractEducation(text: string) {
  const degrees: Array<any> = [];
  let highestDegree: string | undefined;
  let totalYears = 0;

  const degreePatterns = [
    { pattern: /\b(phd|ph\.d\.|doctorate)\s+(?:in\s+)?([a-zA-Z\s]+)/gi, level: 'PhD', years: 4 },
    { pattern: /\b(master'?s?|m\.s\.|m\.a\.|mba)\s+(?:in\s+)?([a-zA-Z\s]+)/gi, level: 'Masters', years: 2 },
    { pattern: /\b(bachelor'?s?|b\.s\.|b\.a\.|b\.sc\.)\s+(?:in\s+)?([a-zA-Z\s]+)/gi, level: 'Bachelors', years: 4 },
    { pattern: /\b(associate'?s?|a\.s\.|a\.a\.)\s+(?:in\s+)?([a-zA-Z\s]+)/gi, level: 'Associates', years: 2 }
  ];

  for (const { pattern, level, years } of degreePatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const field = match[2]?.trim();
      degrees.push({ degree: level, field });
      totalYears = Math.max(totalYears, years);
      if (!highestDegree) highestDegree = level;
    }
  }

  // Extract GPA
  const gpaMatch = text.match(/gpa[:\s]+(\d\.\d{1,2})/i);
  if (gpaMatch && degrees.length > 0) {
    degrees[0].gpa = gpaMatch[1];
  }

  return { highestDegree, degrees, totalYearsEducation: totalYears };
}

function extractExperience(text: string) {
  // Extract years of experience
  const yearPatterns = [
    /(\d+)\+?\s*years?\s+(?:of\s+)?experience/i,
    /(\d{4})\s*[-–]\s*(?:present|current|now)/gi,
    /(\d{4})\s*[-–]\s*(\d{4})/gi
  ];

  let totalYears = 0;
  const experienceYears: number[] = [];

  // Direct experience mention
  const directMatch = text.match(yearPatterns[0]);
  if (directMatch) {
    totalYears = parseInt(directMatch[1]);
  }

  // Calculate from date ranges
  const dateRanges = text.matchAll(yearPatterns[2]);
  for (const match of dateRanges) {
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);
    if (end > start && end - start < 50) {
      experienceYears.push(end - start);
    }
  }

  // Current job (ongoing)
  const currentMatches = [...text.matchAll(yearPatterns[1])];
  const currentYear = new Date().getFullYear();
  for (const match of currentMatches) {
    const start = parseInt(match[1]);
    if (currentYear - start < 50) {
      experienceYears.push(currentYear - start);
    }
  }

  if (experienceYears.length > 0 && totalYears === 0) {
    totalYears = experienceYears.reduce((a, b) => a + b, 0);
  }

  // Extract companies
  const companies: string[] = [];
  const companyPatterns = [
    /(?:at|@)\s+([A-Z][a-zA-Z0-9\s&.]+(?:Inc|LLC|Ltd|Corporation|Corp)?)/g,
    /(?:worked\s+at|employed\s+by)\s+([A-Z][a-zA-Z0-9\s&.]+)/gi
  ];

  for (const pattern of companyPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const company = match[1].trim();
      if (company.length > 2 && company.length < 50 && !companies.includes(company)) {
        companies.push(company);
      }
    }
  }

  // Extract job titles
  const titles: string[] = [];
  const titlePatterns = [
    /\b(senior|lead|principal|staff|chief)\s+(engineer|developer|architect|designer|manager|analyst|scientist)/gi,
    /\b(software|frontend|backend|full[\s-]?stack|data|product|project)\s+(engineer|developer|manager|analyst)/gi,
    /\b(engineer|developer|designer|analyst|manager|director|vp|ceo|cto|cfo|architect)/gi
  ];

  for (const pattern of titlePatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const title = match[0].trim();
      if (!titles.includes(title)) {
        titles.push(title);
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

  // Technical skills
  const technicalKeywords = [
    'javascript', 'python', 'java', 'typescript', 'react', 'angular', 'vue', 'node.js',
    'sql', 'nosql', 'mongodb', 'postgresql', 'redis', 'aws', 'azure', 'gcp',
    'docker', 'kubernetes', 'terraform', 'jenkins', 'git', 'ci/cd',
    'machine learning', 'deep learning', 'ai', 'data science', 'nlp'
  ];

  const technical = technicalKeywords.filter(skill => lowerText.includes(skill));

  // Tools
  const toolsKeywords = [
    'jira', 'confluence', 'figma', 'sketch', 'photoshop', 'illustrator',
    'tableau', 'power bi', 'excel', 'slack', 'notion', 'linear'
  ];

  const tools = toolsKeywords.filter(tool => lowerText.includes(tool));

  // Programming languages
  const languagesKeywords = [
    'javascript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'
  ];

  const languages = languagesKeywords.filter(lang => lowerText.includes(lang));

  // Soft skills
  const softSkillsKeywords = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'analytical',
    'project management', 'stakeholder management', 'mentoring', 'collaboration'
  ];

  const softSkills = softSkillsKeywords.filter(skill => lowerText.includes(skill));

  // Frameworks
  const frameworksKeywords = [
    'react', 'angular', 'vue', 'express', 'django', 'flask', 'spring', 'laravel'
  ];

  const frameworks = frameworksKeywords.filter(fw => lowerText.includes(fw));

  // Databases
  const databasesKeywords = [
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra'
  ];

  const databases = databasesKeywords.filter(db => lowerText.includes(db));

  // Cloud
  const cloudKeywords = ['aws', 'azure', 'gcp', 'heroku', 'digitalocean', 'vercel', 'netlify'];
  const cloud = cloudKeywords.filter(c => lowerText.includes(c));

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
  const certPatterns = [
    /(?:certified|certification)[:\s]+([a-zA-Z0-9\s\-]+)/gi,
    /\b(aws certified|azure certified|google cloud certified|pmp|cissp|ceh|comptia)/gi
  ];

  for (const pattern of certPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const cert = match[1] || match[0];
      if (cert.length > 3 && cert.length < 100) {
        certifications.push(cert.trim());
      }
    }
  }

  return [...new Set(certifications)].slice(0, 10);
}

function extractAwards(text: string) {
  const awards: string[] = [];
  const awardPatterns = [
    /(?:awarded|award|recognition)[:\s]+([a-zA-Z0-9\s\-]+)/gi,
    /\b(employee of the (?:month|year)|best performer|top performer|excellence award)/gi
  ];

  for (const pattern of awardPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const award = match[1] || match[0];
      if (award.length > 5 && award.length < 100) {
        awards.push(award.trim());
      }
    }
  }

  return [...new Set(awards)].slice(0, 10);
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

  // Percentages
  const percentMatches = [...text.matchAll(/\d+(?:\.\d+)?%/g)];
  percentages.push(...percentMatches.map(m => m[0]));

  // Money
  const moneyMatches = [...text.matchAll(/\$[\d,]+(?:\.\d+)?[kmb]?/gi)];
  moneyValues.push(...moneyMatches.map(m => m[0]));

  // Multipliers
  const multMatches = [...text.matchAll(/\d+x\s+/gi)];
  multipliers.push(...multMatches.map(m => m[0].trim()));

  // Team sizes
  const teamMatches = [...text.matchAll(/(?:team\s+of|managed|led)\s+(\d+)/gi)];
  teamSizes.push(...teamMatches.map(m => m[1]));

  // User scales
  const userMatches = [...text.matchAll(/(\d+[km]?)\s+(?:users|customers|clients)/gi)];
  userScales.push(...userMatches.map(m => m[1]));

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
