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
  
  const emailMatch = ocrText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = ocrText.match(/\+?[\d\s()-]{10,}/);
  const hasLinkedIn = ocrText.toLowerCase().includes("linkedin") || ocrText.toLowerCase().includes("linked.in");
  
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
  }
  
  const hasExperience = /experience|work history|employment/i.test(ocrText);
  const hasEducation = /education|academic|degree/i.test(ocrText);
  const hasSkills = /skills|technical skills|competencies/i.test(ocrText);
  
  if (hasExperience) formatScore += 6;
  else formatIssues.push({
    issue: "Missing 'Experience' section header",
    severity: "high",
    fix: "Add a clear 'Experience' or 'Work History' section header",
    location: "Body",
    atsImpact: "ATS cannot identify your work experience - major parsing failure"
  });
  
  if (hasEducation) formatScore += 4;
  if (hasSkills) formatScore += 4;
  
  const datePatterns = [
    /\d{1,2}\/\d{4}/g,
    /\d{4}-\d{2}/g,
    /[A-Z][a-z]+ \d{4}/g
  ];
  
  const dateMatches = datePatterns.map(pattern => (ocrText.match(pattern) || []).length);
  const hasConsistentDates = dateMatches.filter(count => count > 0).length <= 1;
  
  if (hasConsistentDates) {
    formatScore += 3;
  } else {
    formatIssues.push({
      issue: "Inconsistent date formats",
      severity: "medium",
      fix: "Use a single date format throughout (recommended: 'Month YYYY' e.g., 'January 2020')",
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
  
  const scoringMultiplier = 1.0 + (mlConfig?.scoringAdjustments?.format || 0);
  formatScore = Math.min(30, formatScore * scoringMultiplier);
  
  return { formatScore, formatIssues };
}
