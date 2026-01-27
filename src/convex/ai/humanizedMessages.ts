/**
 * Humanized AI Messages
 * Speaks with casual, Reddit-style tone instead of corporate-speak
 * Makes technical errors feel less intimidating and more actionable
 */

export const humanizedMessages = {
  // Date-related errors
  dateErrors: {
    inconsistent: "Hey, I found a bug in your dates section. Some dates don't match up - like you have 2020-2023 in one place and 2021-2023 in another for the same job. ATS robots get confused by this and might think you're hiding something.",
    format: "Quick fix needed: Your dates are all over the place format-wise. Some are 'Jan 2020', others '01/2020', others '2020-01'. Pick one style and stick with it. Robots love consistency.",
    future: "Uh, you've got a future date in there. Unless you're a time traveler, change that 2027 to whatever year you actually worked there. ATS systems will flag this as an error.",
    missing: "Missing dates alert! I found a job without dates. Even if it was a short gig, add the month/year. 'No dates' = red flag to ATS."
  },

  // Experience section errors
  experienceErrors: {
    noMetrics: "Real talk: Your experience section is missing numbers. 'Managed projects' doesn't tell me anything. 'Managed 5 projects worth $2M, delivered 3 weeks early' - THAT'S what I want to see. Add percentages, dollar signs, team sizes, time saved.",
    vague: "Found some vague bullets in your experience. 'Responsible for customer service' tells me nothing. What did you actually DO? How many customers? What was the result? Be specific.",
    shortBullets: "Your bullets are too short. 'Led team' is 2 words. Expand it: 'Led cross-functional team of 8 engineers through 3 product launches, increasing user engagement 40%.' See the difference?"
  },

  // Skills section errors
  skillsErrors: {
    missing: "Your skills section is MIA or super thin. This is where ATS robots look first for keyword matches. List your actual skills - programming languages, tools, certifications, whatever's relevant.",
    generic: "Skills section is too generic. 'Microsoft Office' in 2026? Come on. Get specific: 'Advanced Excel (VBA, Power Query, Pivot Tables)' or 'Python (pandas, NumPy, scikit-learn)'. Details matter.",
    outdated: "I see some outdated skills in here. Unless you're applying for a legacy maintenance role, maybe skip Flash and Windows XP. Focus on current, in-demand tech."
  },

  // Format issues
  formatErrors: {
    scanned: "Big problem: Your PDF looks like a scanned image. ATS robots can't read images - they need actual text. Save your resume as a PDF from Word/Google Docs instead of scanning it.",
    columns: "Two-column layouts look nice but ATS systems read left-to-right, top-to-bottom. Your info is probably getting jumbled. Stick to single-column format.",
    tables: "Using tables for layout? That's causing parsing issues. ATS robots struggle with tables. Use regular text with proper formatting instead.",
    graphics: "Cool logo/graphics, but they're blocking text that the ATS needs to read. Keep visual elements to a minimum - you can add them back for the human-reviewed version."
  },

  // Content completeness
  completenessErrors: {
    tooShort: "Your resume is pretty thin - less than half a page. Even for entry-level, aim for a full page. Add more detail to your experience, projects, or skills.",
    noSummary: "Missing a summary/profile section at the top. This is prime real estate for keywords. Add 2-3 lines about who you are and what you bring to the table.",
    noEducation: "Where's your education section? Even if you're self-taught, mention relevant courses, certifications, or bootcamps. Completely missing education = red flag."
  },

  // Keywords
  keywordErrors: {
    missing: (keyword: string) => `You're missing '${keyword}' - it's in the job description but not on your resume. If you have this skill/experience, add it. If not, can you reframe something you've done to include it?`,
    misspelled: (keyword: string) => `Heads up: '${keyword}' is misspelled. ATS robots don't do 'close enough' - they want exact matches. Fix the typo.`,
    insufficient: (keyword: string) => `'${keyword}' only appears once. For important keywords, aim for 2-3 natural mentions across different sections (summary, experience, skills).`
  },

  // Parsing errors
  parsingErrors: {
    cantRead: "Can't read parts of your resume. This usually means: 1) It's a scanned image, 2) Text is in a weird format, or 3) Encoding issues. Re-save as a fresh PDF from the source document.",
    encoding: "Character encoding issue detected. Some special characters aren't displaying right. Stick to standard letters, numbers, and common punctuation.",
    structure: "Your resume structure is confusing the parser. Use standard section headers like 'Experience', 'Education', 'Skills' - not creative alternatives like 'My Journey' or 'What I Bring'."
  },

  // Success messages
  success: {
    excellent: "Looking good! Your resume is parsing cleanly and hitting most of the important keywords. Minor tweaks could get you to 90%+, but you're already in solid shape.",
    good: "Nice work! Your resume is ATS-friendly with good keyword coverage. A few areas could use polish, but you should get past the robots no problem.",
    needs_work: "Your resume needs some love. Nothing unfixable, but there are parsing issues and keyword gaps that'll hurt your chances. Check the fixes I suggested below."
  },

  // Overall analysis intro
  analysisIntros: {
    high_score: "✅ **Strong Resume - The Robot Approves**\n\nYour resume parsed well and hits the key points. Here's what I found:",
    medium_score: "⚠️ **Decent Resume - But We Can Do Better**\n\nYou've got the basics down, but some issues are holding you back. Here's the deal:",
    low_score: "🚨 **Houston, We Have Problems**\n\nYour resume is struggling with ATS systems. Don't panic - here's what needs fixing:"
  },

  // Call to action messages
  ctas: {
    fix_now: "Fix these issues and re-scan. Your updated score should jump significantly.",
    need_help: "Stuck? Hit me up at cvdebug@outlook.com - happy to help you sort this out.",
    premium: "Want me to fix all this for you? Check out the Sprint plan for automated rewrites and optimization."
  }
};

// Helper function to generate humanized error messages
export function generateHumanizedError(
  errorType: string,
  details?: any
): string {
  const messages = humanizedMessages;

  switch (errorType) {
    case 'date_inconsistent':
      return messages.dateErrors.inconsistent;
    case 'date_format':
      return messages.dateErrors.format;
    case 'no_metrics':
      return messages.experienceErrors.noMetrics;
    case 'scanned_pdf':
      return messages.formatErrors.scanned;
    case 'missing_keyword':
      return messages.keywordErrors.missing(details?.keyword || 'keyword');
    default:
      return "I found an issue in your resume. Check the details below for the fix.";
  }
}

// Helper to generate full humanized analysis
export function generateHumanizedAnalysis(
  score: number,
  issues: any[]
): string {
  let intro = '';

  if (score >= 80) {
    intro = humanizedMessages.analysisIntros.high_score;
  } else if (score >= 60) {
    intro = humanizedMessages.analysisIntros.medium_score;
  } else {
    intro = humanizedMessages.analysisIntros.low_score;
  }

  // Add issues with humanized messages
  let content = intro + '\n\n';

  if (issues.length > 0) {
    content += '**Issues Found:**\n\n';
    issues.forEach((issue, idx) => {
      content += `${idx + 1}. ${issue.humanMessage || issue.message}\n`;
    });
  }

  content += '\n' + humanizedMessages.ctas.fix_now;

  return content;
}
