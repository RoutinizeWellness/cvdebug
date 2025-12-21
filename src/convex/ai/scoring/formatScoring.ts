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
  
  // Enhanced contact information detection
  const emailMatch = ocrText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = ocrText.match(/\+?[\d\s().-]{10,}/);
  const hasLinkedIn = ocrText.toLowerCase().includes("linkedin") || ocrText.toLowerCase().includes("linked.in");
  const hasGithub = ocrText.toLowerCase().includes("github.com");
  const hasPortfolio = /portfolio|website|personal site/i.test(ocrText) || /https?:\/\/[\w.-]+\.\w+/i.test(ocrText);
  
  if (emailMatch) {
    formatScore += 5;
  } else {
    formatIssues.push({
      issue: "Missing email address",
      severity: "high",
      fix: "Add a professional email address at the top of your resume (e.g., firstname.lastname@email.com)",
      location: "Header",
      atsImpact: "ATS cannot contact you without email - automatic rejection"
    });
  }
  
  if (phoneMatch) {
    formatScore += 5;
  } else {
    formatIssues.push({
      issue: "Missing phone number",
      severity: "medium",
      fix: "Add your phone number in the header with proper formatting (e.g., +1-555-123-4567)",
      location: "Header",
      atsImpact: "Reduces contact options for recruiters"
    });
  }
  
  if (hasLinkedIn) {
    formatScore += 3;
  } else {
    formatIssues.push({
      issue: "Missing LinkedIn profile",
      severity: "medium",
      fix: "Add your LinkedIn profile URL to increase credibility",
      location: "Header",
      atsImpact: "Recruiters expect to see LinkedIn profiles for verification"
    });
  }
  
  if (hasGithub || hasPortfolio) {
    formatScore += 2;
  }
  
  // Enhanced section detection
  const hasExperience = /experience|work history|employment|professional background/i.test(ocrText);
  const hasEducation = /education|academic|degree|university|college/i.test(ocrText);
  const hasSkills = /skills|technical skills|competencies|technologies|tools/i.test(ocrText);
  const hasProjects = /projects|portfolio|work samples/i.test(ocrText);
  
  if (hasExperience) formatScore += 6;
  else formatIssues.push({
    issue: "Missing 'Experience' section header",
    severity: "high",
    fix: "Add a clear 'Experience' or 'Work History' section header",
    location: "Body",
    atsImpact: "ATS cannot identify your work experience - major parsing failure"
  });
  
  if (hasEducation) formatScore += 4;
  else formatIssues.push({
    issue: "Missing 'Education' section",
    severity: "medium",
    fix: "Add an 'Education' section with your degrees and institutions",
    location: "Body",
    atsImpact: "Many ATS systems require education information"
  });
  
  if (hasSkills) formatScore += 4;
  else formatIssues.push({
    issue: "Missing 'Skills' section",
    severity: "medium",
    fix: "Add a dedicated 'Skills' section listing your technical and professional competencies",
    location: "Body",
    atsImpact: "ATS keyword matching relies heavily on a skills section"
  });
  
  if (hasProjects) formatScore += 2;
  
  // Enhanced date format consistency check
  const datePatterns = [
    { pattern: /\d{1,2}\/\d{4}/g, name: "MM/YYYY" },
    { pattern: /\d{4}-\d{2}/g, name: "YYYY-MM" },
    { pattern: /[A-Z][a-z]+ \d{4}/g, name: "Month YYYY" },
    { pattern: /\d{4}/g, name: "YYYY only" }
  ];
  
  const dateMatches = datePatterns.map(({ pattern, name }) => ({
    name,
    count: (ocrText.match(pattern) || []).length
  }));
  
  const usedFormats = dateMatches.filter(d => d.count > 0);
  const hasConsistentDates = usedFormats.length <= 1;
  
  if (hasConsistentDates && usedFormats.length > 0) {
    formatScore += 3;
  } else if (usedFormats.length > 1) {
    formatIssues.push({
      issue: "Inconsistent date formats",
      severity: "medium",
      fix: `Use a single date format throughout (recommended: 'Month YYYY' e.g., 'January 2020'). Found: ${usedFormats.map(f => f.name).join(", ")}`,
      location: "Experience section",
      atsImpact: "Confuses ATS timeline parsing, may misorder your experience"
    });
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
  formatScore = Math.min(30, formatScore * scoringMultiplier);
  
  return { formatScore, formatIssues };
}