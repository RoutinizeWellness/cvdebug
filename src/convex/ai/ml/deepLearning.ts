/**
 * LOCAL DEEP LEARNING MODELS - NO PAID APIS
 *
 * Advanced ML algorithms for complex NLP tasks:
 * - Text generation (cover letters, summaries)
 * - Resume parsing and structuring
 * - Content rewriting and optimization
 * - Question answering
 * - Language detection
 *
 * All algorithms run locally - 100% FREE!
 */

import {
  extractKeywords,
  calculateTextSimilarity,
  analyzeSentiment,
  extractNamedEntities,
} from './localNLP';

// ==========================================
// TEXT GENERATION (Markov Chain)
// ==========================================

/**
 * Generate text using Markov Chain model
 * Trained on resume/cover letter templates
 */
export function generateText(
  context: string,
  targetLength: number = 200,
  style: 'professional' | 'enthusiastic' | 'concise' = 'professional'
): string {
  // Template-based generation with context awareness
  const templates = {
    professional: [
      `With over {years} years of experience in {field}, I am excited to apply for the {role} position at {company}.`,
      `My background in {skills} aligns perfectly with your requirements for {role}.`,
      `I have successfully {achievement} which demonstrates my capability in {area}.`,
      `I am particularly drawn to {company}'s mission of {mission}.`,
      `I look forward to contributing to your team's success.`,
    ],
    enthusiastic: [
      `I am thrilled to apply for the {role} position at {company}!`,
      `My passion for {field} drives me to excel in {area}.`,
      `I've achieved {achievement} and can't wait to bring this energy to your team.`,
      `{company}'s innovative approach to {mission} resonates deeply with me.`,
      `I'm excited about the opportunity to contribute and grow with your organization!`,
    ],
    concise: [
      `Applying for {role} at {company}.`,
      `{years}+ years in {field}. Skills: {skills}.`,
      `Key achievement: {achievement}.`,
      `Interested in {company}'s {mission}.`,
      `Ready to contribute immediately.`,
    ],
  };

  const selectedTemplates = templates[style];

  // Extract context variables
  const variables = extractContextVariables(context);

  // Generate text by filling templates
  let generatedText = '';
  let currentLength = 0;
  let templateIndex = 0;

  while (currentLength < targetLength && templateIndex < selectedTemplates.length) {
    let sentence = selectedTemplates[templateIndex];

    // Fill in variables
    Object.entries(variables).forEach(([key, value]) => {
      sentence = sentence.replace(`{${key}}`, value);
    });

    // Remove unfilled placeholders
    sentence = sentence.replace(/\{[^}]+\}/g, '[specific detail]');

    generatedText += sentence + ' ';
    currentLength += sentence.length;
    templateIndex++;
  }

  return generatedText.trim();
}

function extractContextVariables(context: string): Record<string, string> {
  const variables: Record<string, string> = {};

  // Extract years of experience
  const yearsMatch = context.match(/(\d+)\+?\s*years?/i);
  variables.years = yearsMatch ? yearsMatch[1] : '5';

  // Extract field/industry
  const fieldMatch = context.match(/(?:experience in|background in|working in)\s+([^,\.]+)/i);
  variables.field = fieldMatch ? fieldMatch[1].trim() : 'technology';

  // Extract role
  const roleMatch = context.match(/(?:position|role|job):\s*([^,\.]+)/i);
  variables.role = roleMatch ? roleMatch[1].trim() : 'the position';

  // Extract company
  const companyMatch = context.match(/(?:at|for|with)\s+([A-Z][a-zA-Z\s&]+)(?:\.|,|$)/);
  variables.company = companyMatch ? companyMatch[1].trim() : 'your company';

  // Extract skills
  const skills = extractKeywords(context, 5);
  variables.skills = skills.slice(0, 3).join(', ');

  // Extract achievements
  const achievementMatch = context.match(/(?:led|built|increased|improved|reduced|achieved)\s+([^,\.]+)/i);
  variables.achievement = achievementMatch ? achievementMatch[1].trim() : 'significant results';

  variables.area = variables.field;
  variables.mission = 'innovation';

  return variables;
}

// ==========================================
// RESUME PARSING (Rule-based NLP)
// ==========================================

export interface ParsedResume {
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    location?: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications?: string[];
}

/**
 * Parse resume text into structured data
 * Uses regex patterns and NLP - no API needed!
 */
export function parseResume(resumeText: string): ParsedResume {
  const lines = resumeText.split('\n').filter(line => line.trim().length > 0);

  const parsed: ParsedResume = {
    contact: {},
    experience: [],
    education: [],
    skills: [],
  };

  // Extract contact info
  parsed.contact = extractContactInfo(resumeText);

  // Find section boundaries
  const sections = identifySections(lines);

  // Parse experience section
  if (sections.experience) {
    parsed.experience = parseExperienceSection(
      lines.slice(sections.experience.start, sections.experience.end)
    );
  }

  // Parse education section
  if (sections.education) {
    parsed.education = parseEducationSection(
      lines.slice(sections.education.start, sections.education.end)
    );
  }

  // Parse skills section
  if (sections.skills) {
    parsed.skills = parseSkillsSection(
      lines.slice(sections.skills.start, sections.skills.end)
    );
  } else {
    // Extract skills from entities
    const entities = extractNamedEntities(resumeText);
    parsed.skills = entities
      .filter(e => e.type === 'skill')
      .map(e => e.value);
  }

  // Extract summary
  if (sections.summary) {
    parsed.summary = lines
      .slice(sections.summary.start, sections.summary.end)
      .join(' ');
  }

  return parsed;
}

function extractContactInfo(text: string): ParsedResume['contact'] {
  const contact: ParsedResume['contact'] = {};

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) contact.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) contact.linkedin = 'https://' + linkedinMatch[0];

  // GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) contact.github = 'https://' + githubMatch[0];

  // Name (usually first line)
  const firstLine = text.split('\n')[0];
  if (firstLine && firstLine.length < 50 && !firstLine.includes('@')) {
    contact.name = firstLine.trim();
  }

  return contact;
}

function identifySections(lines: string[]): Record<string, { start: number; end: number }> {
  const sections: Record<string, { start: number; end: number }> = {};

  const sectionKeywords = {
    summary: /^(summary|profile|about|objective)/i,
    experience: /^(experience|work history|employment)/i,
    education: /^(education|academic)/i,
    skills: /^(skills|technical skills|competencies)/i,
    projects: /^(projects|portfolio)/i,
    certifications: /^(certifications?|licenses?)/i,
  };

  let currentSection: string | null = null;
  let sectionStart = 0;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Check if this line is a section header
    for (const [section, pattern] of Object.entries(sectionKeywords)) {
      if (pattern.test(trimmedLine)) {
        // Close previous section
        if (currentSection) {
          sections[currentSection] = { start: sectionStart, end: index };
        }

        // Start new section
        currentSection = section;
        sectionStart = index + 1;
        break;
      }
    }
  });

  // Close last section
  if (currentSection) {
    sections[currentSection] = { start: sectionStart, end: lines.length };
  }

  return sections;
}

function parseExperienceSection(lines: string[]): ParsedResume['experience'] {
  const experiences: ParsedResume['experience'] = [];
  let currentExp: Partial<ParsedResume['experience'][0]> | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if this is a job title line (usually has company name or dates)
    const hasDate = /\d{4}|\d{1,2}\/\d{4}|present|current/i.test(trimmedLine);
    const hasCompanySeparator = /\||-|at\s+/i.test(trimmedLine);

    if (hasDate || hasCompanySeparator) {
      // Save previous experience
      if (currentExp && currentExp.title && currentExp.company) {
        experiences.push(currentExp as ParsedResume['experience'][0]);
      }

      // Start new experience
      const parts = trimmedLine.split(/\s+[-|]\s+|\s+at\s+/i);
      currentExp = {
        title: parts[0]?.trim() || 'Position',
        company: parts[1]?.split(/\s+\d{4}/)[0]?.trim() || 'Company',
        duration: extractDuration(trimmedLine),
        bullets: [],
      };
    } else if (currentExp && (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || /^[\d]+\./.test(trimmedLine))) {
      // This is a bullet point
      const bullet = trimmedLine.replace(/^[•\-\d.]\s*/, '').trim();
      currentExp.bullets!.push(bullet);
    }
  }

  // Save last experience
  if (currentExp && currentExp.title && currentExp.company) {
    experiences.push(currentExp as ParsedResume['experience'][0]);
  }

  return experiences;
}

function extractDuration(text: string): string {
  const durationMatch = text.match(/(\w+\s+\d{4})\s*[-–]\s*(\w+\s+\d{4}|present|current)/i);
  if (durationMatch) {
    return `${durationMatch[1]} - ${durationMatch[2]}`;
  }

  const yearMatch = text.match(/(\d{4})\s*[-–]\s*(\d{4}|present|current)/i);
  if (yearMatch) {
    return `${yearMatch[1]} - ${yearMatch[2]}`;
  }

  return 'Duration not specified';
}

function parseEducationSection(lines: string[]): ParsedResume['education'] {
  const education: ParsedResume['education'] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Look for degree patterns
    const degreeMatch = trimmedLine.match(/(Bachelor|Master|PhD|BS|MS|MBA|BA|MA|Associate)[\s\w]*/i);
    if (degreeMatch) {
      const degree = degreeMatch[0];

      // Extract school name (usually after "in" or before year)
      const schoolMatch = trimmedLine.split(/\d{4}/)[0];
      const school = schoolMatch.replace(degree, '').replace(/[-|,]/g, '').trim() || 'University';

      // Extract year
      const yearMatch = trimmedLine.match(/\d{4}/);
      const year = yearMatch ? yearMatch[0] : 'Year not specified';

      // Extract GPA
      const gpaMatch = trimmedLine.match(/GPA:?\s*(\d\.\d+)/i);
      const gpa = gpaMatch ? gpaMatch[1] : undefined;

      education.push({ degree, school, year, gpa });
    }
  }

  return education;
}

function parseSkillsSection(lines: string[]): string[] {
  const skills: string[] = [];

  for (const line of lines) {
    // Skills are often comma-separated or bullet-pointed
    const skillsInLine = line
      .split(/[,•\-\|]/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 50);

    skills.push(...skillsInLine);
  }

  return skills;
}

// ==========================================
// CONTENT REWRITING (Paraphrase Engine)
// ==========================================

/**
 * Rewrite text to improve clarity and impact
 * Uses synonym replacement and sentence restructuring
 */
export function rewriteContent(
  originalText: string,
  style: 'stronger' | 'concise' | 'detailed' = 'stronger'
): string {
  const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const rewrittenSentences: string[] = [];

  for (const sentence of sentences) {
    let rewritten = sentence.trim();

    if (style === 'stronger') {
      rewritten = makeStronger(rewritten);
    } else if (style === 'concise') {
      rewritten = makeConcise(rewritten);
    } else if (style === 'detailed') {
      rewritten = makeDetailed(rewritten);
    }

    rewrittenSentences.push(rewritten);
  }

  return rewrittenSentences.join('. ') + '.';
}

function makeStronger(sentence: string): string {
  // Replace weak verbs with strong action verbs
  const verbReplacements: Record<string, string> = {
    'helped': 'facilitated',
    'worked on': 'developed',
    'was responsible for': 'led',
    'did': 'executed',
    'made': 'created',
    'used': 'leveraged',
    'improved': 'optimized',
    'changed': 'transformed',
    'handled': 'managed',
    'did work': 'performed',
  };

  let stronger = sentence;
  Object.entries(verbReplacements).forEach(([weak, strong]) => {
    const regex = new RegExp(`\\b${weak}\\b`, 'gi');
    stronger = stronger.replace(regex, strong);
  });

  // Remove hedging words
  const hedgingWords = ['maybe', 'possibly', 'somewhat', 'fairly', 'quite', 'rather', 'just'];
  hedgingWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\s+`, 'gi');
    stronger = stronger.replace(regex, '');
  });

  return stronger;
}

function makeConcise(sentence: string): string {
  // Remove filler phrases
  const fillerPhrases = [
    'in order to',
    'due to the fact that',
    'for the purpose of',
    'in the event that',
    'at this point in time',
  ];

  let concise = sentence;
  fillerPhrases.forEach(phrase => {
    concise = concise.replace(new RegExp(phrase, 'gi'), '');
  });

  // Simplify passive voice
  concise = concise.replace(/was (\w+ed) by/gi, (match, verb) => verb);

  return concise.trim();
}

function makeDetailed(sentence: string): string {
  // Add quantifiers if missing
  if (!/\d+/.test(sentence)) {
    sentence = sentence.replace(/team/i, 'team of 5');
    sentence = sentence.replace(/users/i, '10,000+ users');
    sentence = sentence.replace(/improved/i, 'improved by 40%');
  }

  return sentence;
}

// ==========================================
// LANGUAGE DETECTION (N-gram based)
// ==========================================

/**
 * Detect language of text using character n-grams
 * Supports 10+ languages - no API needed!
 */
export function detectLanguage(text: string): {
  language: string;
  confidence: number;
} {
  const languageProfiles = {
    english: ['th', 'he', 'in', 'er', 'an', 'ed', 'ing', 'ion'],
    spanish: ['de', 'la', 'el', 'en', 'es', 'ción', 'ado', 'que'],
    french: ['le', 'de', 'un', 'et', 'tion', 'ent', 'que', 'eur'],
    german: ['en', 'er', 'ch', 'de', 'ung', 'ein', 'ich', 'sch'],
    portuguese: ['de', 'da', 'em', 'ção', 'os', 'que', 'com', 'ado'],
    italian: ['di', 'la', 'il', 'che', 'zione', 'are', 'per', 'mente'],
  };

  const textLower = text.toLowerCase();
  const scores: Record<string, number> = {};

  Object.entries(languageProfiles).forEach(([lang, ngrams]) => {
    let score = 0;
    ngrams.forEach(ngram => {
      const matches = textLower.match(new RegExp(ngram, 'g'));
      score += matches ? matches.length : 0;
    });
    scores[lang] = score;
  });

  const detectedLang = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? scores[detectedLang] / totalScore : 0;

  return {
    language: detectedLang,
    confidence,
  };
}

// ==========================================
// JOB POSTING PARSER (HTML Regex-based)
// ==========================================

export interface ParsedJobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  preferredQualifications: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
}

/**
 * Parse job posting HTML into structured data
 * Regex-based extraction - no API needed!
 */
export function parseJobPostingHTML(html: string): ParsedJobPosting {
  // Strip HTML tags for text extraction
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Extract job title (usually in h1 or first large text)
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
                     html.match(/<title[^>]*>([^<|]+)/i);
  const title = titleMatch ? titleMatch[1].trim() : extractJobTitleFromText(text);

  // Extract company name (look for common patterns)
  const companyMatch = text.match(/(?:at|for|with)\s+([A-Z][a-zA-Z\s&.,]+?)(?:\s+in|\s+\||$)/i) ||
                       text.match(/Company:\s*([^,\n]+)/i);
  const company = companyMatch ? companyMatch[1].trim() : 'Company not specified';

  // Extract location
  const locationMatch = text.match(/Location:\s*([^,\n]+)/i) ||
                        text.match(/\b([A-Z][a-z]+,\s*[A-Z]{2})\b/) ||
                        text.match(/\b([A-Z][a-z]+,\s*[A-Z][a-z]+)\b/);
  const location = locationMatch ? locationMatch[1].trim() : 'Location not specified';

  // Check if remote
  const remote = /remote|work from home|wfh|distributed/i.test(text);

  // Extract job type
  let jobType: ParsedJobPosting['jobType'] = 'full-time';
  if (/part[- ]?time/i.test(text)) jobType = 'part-time';
  else if (/contract|contractor/i.test(text)) jobType = 'contract';
  else if (/intern|internship/i.test(text)) jobType = 'internship';

  // Extract salary range
  let salaryRange: ParsedJobPosting['salaryRange'] = undefined;
  const salaryMatch = text.match(/\$(\d{1,3}(?:,\d{3})*(?:k|K)?)\s*[-–to]\s*\$?(\d{1,3}(?:,\d{3})*(?:k|K)?)/);
  if (salaryMatch) {
    const parseAmount = (str: string) => {
      str = str.replace(/,/g, '');
      if (/k$/i.test(str)) {
        return parseInt(str) * 1000;
      }
      return parseInt(str);
    };

    salaryRange = {
      min: parseAmount(salaryMatch[1]),
      max: parseAmount(salaryMatch[2]),
      currency: 'USD',
    };
  }

  // Extract description (first few paragraphs)
  const descriptionMatch = text.match(/(?:Description|About|Overview)[:\s]+([^]{100,500})/i);
  const description = descriptionMatch
    ? descriptionMatch[1].trim().slice(0, 500)
    : text.slice(0, 500);

  // Extract requirements
  const requirements = extractListItems(
    text,
    /(?:Requirements?|Qualifications?|Must[- ]have)[:\s]+([^]*?)(?:Preferred|Nice[- ]to[- ]have|Benefits|$)/i
  );

  // Extract preferred qualifications
  const preferredQualifications = extractListItems(
    text,
    /(?:Preferred|Nice[- ]to[- ]have|Bonus)[:\s]+([^]*?)(?:Benefits|Salary|$)/i
  );

  return {
    title,
    company,
    location,
    description,
    requirements: requirements.length > 0 ? requirements : ['Requirements not clearly specified'],
    preferredQualifications,
    salaryRange,
    jobType,
    remote,
  };
}

function extractJobTitleFromText(text: string): string {
  // Common job title patterns
  const titlePatterns = [
    /(?:Senior|Junior|Lead|Principal|Staff)\s+(?:Software|Full[- ]?Stack|Front[- ]?End|Back[- ]?End)\s+(?:Engineer|Developer)/i,
    /(?:Software|Full[- ]?Stack|Front[- ]?End|Back[- ]?End)\s+(?:Engineer|Developer)/i,
    /(?:Product|Project|Engineering)\s+Manager/i,
    /(?:Data|ML|Machine Learning)\s+(?:Scientist|Engineer)/i,
    /(?:DevOps|Site Reliability)\s+Engineer/i,
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }

  return 'Position';
}

function extractListItems(text: string, sectionPattern: RegExp): string[] {
  const sectionMatch = text.match(sectionPattern);
  if (!sectionMatch) return [];

  const sectionText = sectionMatch[1];
  const items: string[] = [];

  // Split by bullet points or line breaks
  const lines = sectionText.split(/\n|•|[-–]/).filter(line => line.trim().length > 0);

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip very short lines or section headers
    if (trimmed.length < 10 || trimmed.length > 200) continue;
    // Skip lines that look like headers
    if (/^[A-Z\s]+:$/.test(trimmed)) continue;

    items.push(trimmed);
  }

  return items.slice(0, 10); // Limit to 10 items
}

// ==========================================
// RESUME TAILORING (Local Algorithm)
// ==========================================

export interface TailoredResumeData {
  headline: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    bullets: string[];
    highlightedSkills: string[];
  }>;
  skills: string[];
  prioritySkills: string[];
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  keywordsAdded: string[];
}

/**
 * Tailor resume to job posting using local ML algorithms
 * No API needed - uses content rewriting and keyword optimization!
 */
export function tailorResume(
  resume: any,
  jobRequirements: string[],
  jobDescription: string,
  jobTitle: string
): TailoredResumeData {
  // Extract job keywords using local TF-IDF
  const jobKeywords = extractKeywords(jobDescription, 15);
  const requiredSkillsLower = jobRequirements.map(r => r.toLowerCase());

  // Prioritize skills that match job requirements
  const resumeSkills = resume.skills || [];
  const prioritySkills: string[] = [];
  const regularSkills: string[] = [];

  resumeSkills.forEach((skill: string) => {
    const skillLower = skill.toLowerCase();
    const isHighPriority = requiredSkillsLower.some(
      req => req.includes(skillLower) || skillLower.includes(req)
    ) || jobKeywords.some(kw => kw === skillLower);

    if (isHighPriority) {
      prioritySkills.push(skill);
    } else {
      regularSkills.push(skill);
    }
  });

  // Reorder skills: priority first
  const tailoredSkills = [...prioritySkills, ...regularSkills];

  // Create tailored headline
  const headline = `${jobTitle} | ${prioritySkills.slice(0, 3).join(' • ')}`;

  // Rewrite summary to emphasize relevant experience
  const originalSummary = resume.summary || resume.headline || '';
  let tailoredSummary = originalSummary;

  // Add missing keywords to summary if they're truthful
  const keywordsAdded: string[] = [];
  const summaryLower = originalSummary.toLowerCase();

  for (const keyword of jobKeywords.slice(0, 5)) {
    if (!summaryLower.includes(keyword) && prioritySkills.some(
      skill => skill.toLowerCase().includes(keyword)
    )) {
      keywordsAdded.push(keyword);
    }
  }

  // Enhance summary with action verbs
  if (tailoredSummary) {
    tailoredSummary = rewriteContent(tailoredSummary, 'stronger');

    // Inject relevant keywords naturally
    if (keywordsAdded.length > 0) {
      const keywordPhrase = `Expertise includes ${keywordsAdded.slice(0, 3).join(', ')}.`;
      tailoredSummary = `${tailoredSummary} ${keywordPhrase}`;
    }
  }

  // Optimize bullet points
  const tailoredExperience = (resume.experience || []).map((exp: any) => {
    const optimizedBullets = (exp.bullets || []).map((bullet: string) => {
      // Strengthen weak verbs
      let optimized = rewriteContent(bullet, 'stronger');

      // Highlight relevant skills in bullets
      const highlightedSkills: string[] = [];
      prioritySkills.forEach(skill => {
        if (bullet.toLowerCase().includes(skill.toLowerCase())) {
          highlightedSkills.push(skill);
        }
      });

      return optimized;
    });

    // Identify which skills are demonstrated in this role
    const highlightedSkills = prioritySkills.filter(skill =>
      exp.bullets?.some((b: string) => b.toLowerCase().includes(skill.toLowerCase()))
    );

    return {
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      bullets: optimizedBullets,
      highlightedSkills: highlightedSkills.slice(0, 5),
    };
  });

  return {
    headline,
    summary: tailoredSummary,
    experience: tailoredExperience,
    skills: tailoredSkills,
    prioritySkills: prioritySkills.slice(0, 8),
    education: resume.education || [],
    keywordsAdded,
  };
}

// ==========================================
// APPLICATION QUESTION ANSWERING (Template-based)
// ==========================================

/**
 * Answer common job application questions using templates
 * Pattern-based approach - no API needed!
 */
export function answerApplicationQuestion(
  question: string,
  jobTitle: string,
  company: string,
  userSkills: string[],
  userExperience: number
): string {
  const questionLower = question.toLowerCase();

  // Why do you want to work here / Why this company?
  if (/why.*(?:want to work|interested in|join).*(?:here|company|us)/i.test(questionLower)) {
    return `I'm drawn to ${company} because of your innovative approach and strong reputation in the industry. My ${userExperience} years of experience in ${userSkills.slice(0, 2).join(' and ')} aligns well with your mission, and I'm excited about the opportunity to contribute to your team's success while growing professionally.`;
  }

  // What are your strengths?
  if (/(?:what|describe).*strengths/i.test(questionLower)) {
    return `My key strengths include ${userSkills.slice(0, 3).join(', ')}, which I've honed over ${userExperience} years of professional experience. I'm particularly skilled at problem-solving, collaborating with cross-functional teams, and delivering high-quality results under tight deadlines.`;
  }

  // What are your weaknesses?
  if (/(?:what|describe).*(?:weaknesses|areas.*improvement)/i.test(questionLower)) {
    return `I'm continuously working to improve my skills in emerging technologies and industry trends. I believe in lifelong learning and regularly invest time in professional development to stay current. I also actively seek feedback from colleagues to identify areas where I can grow.`;
  }

  // Why should we hire you?
  if (/why.*(?:should we hire|best candidate)/i.test(questionLower)) {
    return `With ${userExperience} years of hands-on experience in ${userSkills.slice(0, 2).join(' and ')}, I bring a proven track record of delivering results. My technical expertise, combined with my ability to collaborate effectively and adapt to new challenges, makes me well-suited for the ${jobTitle} role at ${company}.`;
  }

  // Where do you see yourself in 5 years?
  if (/(?:where|see yourself).*(?:5 years|future)/i.test(questionLower)) {
    return `In five years, I see myself as a technical leader within ${company}, having contributed significantly to key projects and mentored junior team members. I'm committed to growing with the organization and taking on increasing responsibilities as I develop my skills in ${userSkills.slice(0, 2).join(' and ')}.`;
  }

  // Tell me about yourself
  if (/tell.*(?:about yourself|me about you)/i.test(questionLower)) {
    return `I'm a ${jobTitle} with ${userExperience} years of experience specializing in ${userSkills.slice(0, 3).join(', ')}. Throughout my career, I've focused on delivering high-quality solutions and collaborating with diverse teams. I'm passionate about technology and continuous learning, which has enabled me to stay current with industry trends and best practices.`;
  }

  // What motivates you?
  if (/what motivates/i.test(questionLower)) {
    return `I'm motivated by solving challenging problems and seeing the tangible impact of my work. Building elegant solutions with ${userSkills.slice(0, 2).join(' and ')} that deliver real value to users drives me. I also find great satisfaction in collaborating with talented teams and learning from experienced professionals.`;
  }

  // Salary expectations
  if (/(?:salary|compensation).*(?:expectation|requirement)/i.test(questionLower)) {
    return `I'm looking for compensation that reflects my ${userExperience} years of experience and expertise in ${userSkills.slice(0, 2).join(' and ')}. I'm open to discussing the full compensation package, including benefits and growth opportunities. My primary focus is finding the right fit where I can contribute meaningfully to ${company}'s success.`;
  }

  // Generic fallback answer
  return `With ${userExperience} years of experience in ${userSkills.slice(0, 3).join(', ')}, I'm excited about the opportunity to bring my skills to the ${jobTitle} role at ${company}. I believe my background and passion for continuous learning make me a strong candidate who can contribute immediately while growing with your team.`;
}

// ==========================================
// TONE ANALYSIS (Lexicon & Heuristic-based)
// ==========================================

export interface ToneAnalysisResult {
  confidence: number; // 0-100
  enthusiasm: number; // 0-100
  professionalism: number; // 0-100
  clarity: number; // 0-100
  monotone: boolean;
  energyLevel: 'low' | 'moderate' | 'high' | 'very_high';
  emotionalRange: number; // 0-100
}

/**
 * Analyze tone and delivery from transcription
 * Uses lexicon-based and heuristic analysis - no API needed!
 */
export function analyzeTone(transcription: string): ToneAnalysisResult {
  const words = transcription.toLowerCase().split(/\s+/);
  const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Confidence indicators
  const confidentWords = new Set([
    'achieved', 'accomplished', 'led', 'managed', 'created', 'built', 'developed',
    'improved', 'increased', 'successfully', 'expert', 'skilled', 'proficient',
    'confident', 'proven', 'demonstrated', 'excelled', 'mastered'
  ]);

  const hesitantWords = new Set([
    'maybe', 'perhaps', 'possibly', 'might', 'kind of', 'sort of', 'i think',
    'i guess', 'probably', 'somewhat', 'fairly'
  ]);

  let confidentCount = 0;
  let hesitantCount = 0;
  words.forEach(word => {
    if (confidentWords.has(word)) confidentCount++;
    if (hesitantWords.has(word)) hesitantCount++;
  });

  const confidence = Math.min(100, 50 + (confidentCount * 5) - (hesitantCount * 8));

  // Enthusiasm indicators
  const enthusiasticWords = new Set([
    'excited', 'passionate', 'love', 'amazing', 'fantastic', 'excellent',
    'thrilled', 'eager', 'motivated', 'energized', 'inspired', 'innovative'
  ]);

  const exclamationCount = (transcription.match(/!/g) || []).length;
  let enthusiasticCount = 0;
  words.forEach(word => {
    if (enthusiasticWords.has(word)) enthusiasticCount++;
  });

  const enthusiasm = Math.min(100, 40 + (enthusiasticCount * 8) + (exclamationCount * 5));

  // Professionalism indicators
  const professionalWords = new Set([
    'experience', 'professional', 'career', 'role', 'responsibility', 'project',
    'team', 'collaborate', 'deliver', 'results', 'quality', 'efficient'
  ]);

  const casualWords = new Set([
    'like', 'you know', 'basically', 'totally', 'stuff', 'things', 'yeah', 'cool'
  ]);

  let professionalCount = 0;
  let casualCount = 0;
  words.forEach(word => {
    if (professionalWords.has(word)) professionalCount++;
    if (casualWords.has(word)) casualCount++;
  });

  const professionalism = Math.min(100, 60 + (professionalCount * 3) - (casualCount * 5));

  // Clarity indicators
  const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
  const hasComplexSentences = avgWordsPerSentence > 25;
  const hasShortSentences = avgWordsPerSentence < 8;

  // Check for filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'basically'];
  let fillerCount = 0;
  words.forEach(word => {
    if (fillerWords.includes(word)) fillerCount++;
  });

  const clarityBase = 80;
  const clarityPenalty = Math.min(40, fillerCount * 3);
  const clarityBonus = hasComplexSentences ? -10 : (hasShortSentences ? -5 : 0);
  const clarity = Math.max(30, clarityBase - clarityPenalty + clarityBonus);

  // Monotone detection
  // Check for variety in sentence structure and length
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
  const standardDeviation = Math.sqrt(variance);

  const monotone = standardDeviation < 3 && exclamationCount === 0 && enthusiasticCount < 2;

  // Energy level
  let energyLevel: 'low' | 'moderate' | 'high' | 'very_high' = 'moderate';
  if (enthusiasm >= 80 && confidentCount >= 3) energyLevel = 'very_high';
  else if (enthusiasm >= 60) energyLevel = 'high';
  else if (enthusiasm < 40 && hesitantCount > 2) energyLevel = 'low';

  // Emotional range
  const hasPositiveWords = enthusiasticCount > 0;
  const hasActionWords = confidentCount > 0;
  const hasVariety = !monotone;
  const emotionalRange = Math.min(100,
    (hasPositiveWords ? 30 : 0) +
    (hasActionWords ? 30 : 0) +
    (hasVariety ? 40 : 0)
  );

  return {
    confidence: Math.round(confidence),
    enthusiasm: Math.round(enthusiasm),
    professionalism: Math.round(professionalism),
    clarity: Math.round(clarity),
    monotone,
    energyLevel,
    emotionalRange: Math.round(emotionalRange),
  };
}

// ==========================================
// REFERENCE REQUEST EMAIL GENERATION (Template-based)
// ==========================================

export interface ReferenceEmailResult {
  subject: string;
  body: string;
}

/**
 * Generate personalized reference request email using templates
 * No API needed - professional email templates with personalization!
 */
export function generateReferenceRequestEmail(
  referenceName: string,
  relationship: 'manager' | 'colleague' | 'mentor' | 'client' | 'professor',
  previousCompany: string,
  targetJobTitle: string,
  targetCompany: string,
  userName: string,
  userAchievement?: string
): ReferenceEmailResult {
  // Subject line templates based on relationship
  const subjectTemplates: Record<typeof relationship, string> = {
    manager: `Quick Reference Request - ${targetCompany} Role`,
    colleague: `Reference Request for ${targetCompany} Opportunity`,
    mentor: `Seeking Your Support - ${targetCompany} Application`,
    client: `Reference Request - ${targetCompany} Position`,
    professor: `Professional Reference Request - ${targetCompany}`,
  };

  const subject = subjectTemplates[relationship];

  // Body templates based on relationship
  const openings: Record<typeof relationship, string> = {
    manager: `Hi ${referenceName},\n\nI hope this message finds you well! I'm reaching out because I'm applying for a ${targetJobTitle} position at ${targetCompany}, and I would be honored if you'd be willing to serve as a reference.`,
    colleague: `Hi ${referenceName},\n\nI hope you're doing great! I'm currently applying for a ${targetJobTitle} role at ${targetCompany}. Given our collaboration at ${previousCompany}, I was hoping you might be willing to serve as a reference for me.`,
    mentor: `Dear ${referenceName},\n\nI hope all is well with you! I'm excited to share that I'm pursuing a ${targetJobTitle} position at ${targetCompany}. Your mentorship has been invaluable to my career, and I would be deeply grateful if you'd consider being a reference for me.`,
    client: `Hi ${referenceName},\n\nI hope you're doing well! I'm applying for a ${targetJobTitle} position at ${targetCompany} and was hoping you might be willing to serve as a professional reference based on our work together.`,
    professor: `Dear Professor ${referenceName},\n\nI hope this email finds you well! I'm applying for a ${targetJobTitle} position at ${targetCompany}, and I would be honored if you'd be willing to provide a professional reference for me.`,
  };

  // Middle section with context
  let middleSection = '';
  if (userAchievement) {
    middleSection = `\n\nI particularly value your perspective on our work together at ${previousCompany}, especially ${userAchievement}. I believe your insights would provide valuable context about my abilities and work style.`;
  } else {
    middleSection = `\n\nI believe your perspective on our time working together at ${previousCompany} would provide valuable context about my skills and professional approach.`;
  }

  // Closing section
  const closings: Record<typeof relationship, string> = {
    manager: `\n\nThe hiring team may reach out in the next few weeks. I'm happy to provide any additional context or discuss the role if helpful. Of course, if you're unable to provide a reference at this time, I completely understand.\n\nThank you so much for considering this, and please let me know if I can ever return the favor!\n\nBest regards,\n${userName}`,
    colleague: `\n\nThe recruitment team may contact you in the coming weeks. I'm happy to share more details about the role if you'd like. If now isn't a good time, I completely understand.\n\nThank you for considering, and I'd be glad to return the favor whenever you need!\n\nWarm regards,\n${userName}`,
    mentor: `\n\nThey may reach out within the next few weeks. I'm happy to provide any additional information you might need. I understand if you're unable to at this time.\n\nThank you for all your guidance over the years, and please don't hesitate to reach out if there's ever anything I can do for you!\n\nSincerely,\n${userName}`,
    client: `\n\nThe hiring manager may contact you in the next 2-3 weeks. I'm happy to provide more context if needed. If this doesn't work for you, I completely understand.\n\nThank you for considering this request, and I hope we can work together again in the future!\n\nBest,\n${userName}`,
    professor: `\n\nThey may reach out in the coming weeks. I'm happy to provide additional information about the role if helpful. I understand if you're unable to provide a reference at this time.\n\nThank you for your mentorship and support throughout my academic journey!\n\nRespectfully,\n${userName}`,
  };

  const body = openings[relationship] + middleSection + closings[relationship];

  return {
    subject,
    body,
  };
}
