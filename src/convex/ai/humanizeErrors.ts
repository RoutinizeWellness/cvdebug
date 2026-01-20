/**
 * Humanize AI Error Messages
 *
 * Converts technical error messages into friendly, Reddit-style language
 * that users can actually understand and act on.
 */

export interface HumanizedError {
  title: string;
  message: string;
  action: string;
  severity: 'bug' | 'warning' | 'info';
}

/**
 * Converts technical parsing errors into human-friendly messages
 */
export function humanizeParsingError(technicalError: string): HumanizedError {
  // Convert "Parsing error in date field" -> "I found a bug in your dates section"
  if (technicalError.toLowerCase().includes('date') || technicalError.toLowerCase().includes('format')) {
    return {
      title: "🐛 Found a bug in your dates section",
      message: "Some of your dates look a bit wonky. ATS robots get confused when dates aren't consistent (like mixing \"Jan 2020\" with \"2020-01\" in the same resume). Pick one format and stick with it throughout.",
      action: "Quick fix: Check all your dates and make them match. Example: \"Jan 2020 - Present\" everywhere.",
      severity: 'bug'
    };
  }

  if (technicalError.toLowerCase().includes('contact') || technicalError.toLowerCase().includes('email') || technicalError.toLowerCase().includes('phone')) {
    return {
      title: "📧 Your contact info needs some love",
      message: "I'm having trouble reading your email or phone number. Could be hidden behind formatting, or maybe the font is doing something weird. ATS bots are picky about this stuff.",
      action: "Make sure your email and phone are in plain text at the top. No fancy formatting, no images, just clean text.",
      severity: 'bug'
    };
  }

  if (technicalError.toLowerCase().includes('skill') || technicalError.toLowerCase().includes('keyword')) {
    return {
      title: "🎯 Missing some key skills",
      message: "Your resume is missing keywords that ATS robots are looking for. These are specific terms from the job description that you need to include (if you actually have those skills, of course).",
      action: "Read the job posting carefully and add those exact terms to your experience bullets. Don't lie, but don't be modest either.",
      severity: 'warning'
    };
  }

  if (technicalError.toLowerCase().includes('format') || technicalError.toLowerCase().includes('structure')) {
    return {
      title: "📄 Format issue detected",
      message: "Something about your resume's structure is confusing the ATS. Could be tables, columns, or text boxes. These things look nice to humans but robots can't read them properly.",
      action: "Stick to a simple, single-column layout with standard section headings. Save the fancy design for when you're talking to actual humans.",
      severity: 'warning'
    };
  }

  if (technicalError.toLowerCase().includes('experience') || technicalError.toLowerCase().includes('work history')) {
    return {
      title: "💼 Work experience section needs clarity",
      message: "I found some issues in your work history. Maybe job titles are unclear, or dates are missing, or the descriptions are too vague. ATS systems need clear, structured information here.",
      action: "Use this format: \"Job Title | Company Name | Month Year - Month Year\" followed by bullet points with achievements.",
      severity: 'warning'
    };
  }

  if (technicalError.toLowerCase().includes('education')) {
    return {
      title: "🎓 Education section unclear",
      message: "Your education section is a bit hard to parse. Make sure you have: Degree name, School name, and Graduation year (or expected graduation).",
      action: "Format like this: \"Bachelor of Science in Computer Science | University Name | 2020\"",
      severity: 'info'
    };
  }

  if (technicalError.toLowerCase().includes('scan') || technicalError.toLowerCase().includes('image') || technicalError.toLowerCase().includes('ocr')) {
    return {
      title: "🚨 CRITICAL: Your resume looks like a scanned image",
      message: "Okay, this is a big one. Your resume appears to be a scanned image or screenshot instead of actual text. ATS systems literally cannot read this - it's like showing a picture of a book to a blind person. You need to fix this ASAP.",
      action: "Don't scan your resume. Don't screenshot it. Create it in Word/Google Docs and export as PDF using 'Save as PDF' or 'Print to PDF'. The text needs to be selectable.",
      severity: 'bug'
    };
  }

  // Generic fallback with friendly tone
  return {
    title: "⚠️ Found something weird in your resume",
    message: "There's an issue that might trip up ATS systems, but I'm not 100% sure what it is. Could be formatting, could be missing info, could be something else entirely.",
    action: "Double-check your resume for: consistent formatting, complete contact info, clear section headings, and no images/graphics.",
    severity: 'warning'
  };
}

/**
 * Creates a human-friendly complete analysis message
 */
export function createFriendlyAnalysis(
  score: number,
  issues: HumanizedError[],
  positives: string[] = []
): string {
  let message = '';

  // Opening based on score
  if (score >= 80) {
    message += "🎉 **Nice work!** Your resume is in pretty good shape.\n\n";
  } else if (score >= 60) {
    message += "👍 **Not bad!** Your resume has potential, but there's room for improvement.\n\n";
  } else if (score >= 40) {
    message += "🔧 **Needs some work** Your resume has some issues that are holding it back.\n\n";
  } else {
    message += "🚨 **Houston, we have a problem** Your resume needs serious attention before you start applying.\n\n";
  }

  // List what's good (if anything)
  if (positives.length > 0) {
    message += "**What's working:**\n";
    positives.forEach(item => {
      message += `✅ ${item}\n`;
    });
    message += "\n";
  }

  // List issues in order of severity
  if (issues.length > 0) {
    const bugs = issues.filter(e => e.severity === 'bug');
    const warnings = issues.filter(e => e.severity === 'warning');
    const infos = issues.filter(e => e.severity === 'info');

    if (bugs.length > 0) {
      message += "**🐛 Bugs you need to squash:**\n\n";
      bugs.forEach(bug => {
        message += `**${bug.title}**\n`;
        message += `${bug.message}\n\n`;
        message += `*Action:* ${bug.action}\n\n`;
      });
    }

    if (warnings.length > 0) {
      message += "**⚠️ Things to improve:**\n\n";
      warnings.forEach(warn => {
        message += `**${warn.title}**\n`;
        message += `${warn.message}\n\n`;
        message += `*Action:* ${warn.action}\n\n`;
      });
    }

    if (infos.length > 0) {
      message += "**💡 Nice-to-haves:**\n\n";
      infos.forEach(info => {
        message += `**${info.title}**\n`;
        message += `${info.message}\n\n`;
        message += `*Action:* ${info.action}\n\n`;
      });
    }
  }

  // Closing encouragement
  message += "---\n\n";
  if (score >= 80) {
    message += "You're ready to start applying! Just make sure you customize for each job.\n\n";
  } else if (score >= 60) {
    message += "Fix the issues above and you'll be golden. You got this! 💪\n\n";
  } else {
    message += "Don't panic! These are all fixable. Take it one step at a time.\n\n";
  }

  message += "*Need help?* Hit up support at cvdebug@outlook.com\n";
  message += "*Pro tip:* Most of these fixes take less than 30 minutes. Worth it to 10x your interview rate.";

  return message;
}

/**
 * Humanizes a format issue object
 */
export function humanizeFormatIssue(issue: any): HumanizedError {
  const issueText = typeof issue === 'string' ? issue : (issue.issue || issue.message || '');
  return humanizeParsingError(issueText);
}
