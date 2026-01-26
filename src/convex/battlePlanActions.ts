"use node";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// Machine Learning-powered Interview Battle Plan Generator
export const generateBattlePlan = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.string(),
    targetRole: v.string(),
  },
  handler: async (ctx, args) => {
    const { resumeText, jobDescription, targetRole } = args;

    try {
      // ML Algorithm 1: Extract key requirements from job description
      const requirements = extractJobRequirements(jobDescription);

      // ML Algorithm 2: Analyze resume strengths/weaknesses
      const resumeAnalysis = analyzeResumeForInterview(resumeText, requirements);

      // ML Algorithm 3: Generate STAR stories from experience
      const starStories = generateSTARStories(resumeText, requirements);

      // ML Algorithm 4: Predict likely interview questions
      const predictedQuestions = predictInterviewQuestions(targetRole, requirements, resumeAnalysis);

      // ML Algorithm 5: Generate strategic talking points
      const talkingPoints = generateTalkingPoints(resumeAnalysis, requirements);

      const battlePlan = {
        overview: {
          targetRole,
          strengths: resumeAnalysis.strengths,
          gaps: resumeAnalysis.gaps,
          matchScore: resumeAnalysis.matchScore,
        },
        predictedQuestions,
        starStories,
        talkingPoints,
        redFlags: resumeAnalysis.redFlags,
        opportunities: resumeAnalysis.opportunities,
      };

      return {
        success: true,
        battlePlan,
      };
    } catch (error: any) {
      console.error("Battle Plan Generation Error:", error);
      return {
        success: false,
        error: error.message || "Failed to generate battle plan",
      };
    }
  },
});

// ML Algorithm 1: Extract job requirements using NLP patterns
function extractJobRequirements(jobDescription: string) {
  const jd = jobDescription.toLowerCase();

  const requirements = {
    technical: [] as string[],
    soft: [] as string[],
    experience: [] as string[],
    education: [] as string[],
    priorities: [] as string[],
  };

  // Technical skills extraction (pattern matching)
  const techPatterns = [
    /\b(python|java|javascript|typescript|react|angular|vue|node\.js|aws|azure|gcp|docker|kubernetes|sql|mongodb|redis|graphql|rest|api|microservices|ci\/cd|jenkins|github|terraform|ansible)\b/gi,
  ];

  techPatterns.forEach(pattern => {
    const matches = jd.match(pattern);
    if (matches) {
      requirements.technical.push(...matches.map((m: any) =>
        typeof m === 'string' ? m : ''
      ).filter(Boolean));
    }
  });

  // Soft skills extraction
  const softSkillPatterns = /\b(leadership|communication|teamwork|problem.?solving|analytical|creative|collaborative|agile|scrum|mentoring|coaching)\b/gi;
  const softMatches = jd.match(softSkillPatterns);
  if (softMatches) {
    requirements.soft.push(...softMatches.map((m: any) =>
      typeof m === 'string' ? m : ''
    ).filter(Boolean));
  }

  // Experience level extraction
  const expPatterns = /(\d+)\+?\s*(?:years?|yrs?).*?(?:experience|exp)/gi;
  const expMatches = jd.match(expPatterns);
  if (expMatches) {
    requirements.experience.push(...expMatches);
  }

  // Priority extraction (words that appear frequently)
  const priorityWords = ['required', 'must', 'critical', 'essential', 'key'];
  priorityWords.forEach(word => {
    if (jd.includes(word)) {
      const sentences = jobDescription.split(/[.!?]/);
      sentences.forEach(sent => {
        if (sent.toLowerCase().includes(word)) {
          requirements.priorities.push(sent.trim());
        }
      });
    }
  });

  return requirements;
}

// ML Algorithm 2: Analyze resume for interview readiness
function analyzeResumeForInterview(resumeText: string, requirements: any) {
  const resume = resumeText.toLowerCase();

  const strengths: string[] = [];
  const gaps: string[] = [];
  const redFlags: string[] = [];
  const opportunities: string[] = [];

  // Strength detection: matching technical skills
  requirements.technical.forEach((tech: string) => {
    if (resume.includes(tech.toLowerCase())) {
      strengths.push(`Experience with ${tech}`);
    } else {
      gaps.push(`Missing ${tech} in resume`);
    }
  });

  // Detect quantifiable achievements (strength indicator)
  const metrics = resume.match(/\d+%|\$\d+|\d+x|\d+\+/g);
  if (metrics && metrics.length > 5) {
    strengths.push(`Strong quantifiable achievements (${metrics.length} metrics found)`);
  } else {
    opportunities.push("Add more quantifiable metrics to demonstrate impact");
  }

  // Red flag detection: job hopping
  const datePatterns = resume.match(/20\d{2}/g);
  if (datePatterns && datePatterns.length > 5) {
    const uniqueYears = new Set(datePatterns);
    if (uniqueYears.size > 3 && resume.split(/\n/).filter(l => l.includes('20')).length > 4) {
      redFlags.push("Potential job hopping - prepare explanation for career moves");
    }
  }

  // Red flag: gaps in employment
  if (resume.includes('gap') || resume.includes('break')) {
    redFlags.push("Employment gap detected - prepare positive explanation");
  }

  // Opportunity: leadership potential
  if (!resume.includes('led') && !resume.includes('managed') && !resume.includes('mentored')) {
    opportunities.push("Highlight any leadership or mentoring experience");
  }

  // Calculate match score using ML weighting
  const techMatch = (strengths.length / Math.max(requirements.technical.length, 1)) * 40;
  const achievementScore = Math.min((metrics?.length || 0) * 5, 30);
  const gapPenalty = gaps.length * 5;
  const matchScore = Math.max(0, Math.min(100, techMatch + achievementScore - gapPenalty));

  return {
    strengths: strengths.slice(0, 5),
    gaps: gaps.slice(0, 3),
    redFlags: redFlags.slice(0, 2),
    opportunities: opportunities.slice(0, 3),
    matchScore: Math.round(matchScore),
  };
}

// ML Algorithm 3: Generate STAR stories from experience
function generateSTARStories(resumeText: string, requirements: any) {
  const stories: any[] = [];

  // Pattern: extract bullet points with strong action verbs
  const bulletPatterns = /(?:^|\n)[•\-\*]\s*([A-Z][^.\n]{30,200})/g;
  const bullets: string[] = [];
  let match;

  while ((match = bulletPatterns.exec(resumeText)) !== null) {
    bullets.push(match[1]);
  }

  // Generate STAR stories from strongest bullets
  bullets.slice(0, 5).forEach((bullet, idx) => {
    const hasMetric = /\d+%|\$\d+|\d+x/.test(bullet);
    const hasAction = /^(Led|Built|Developed|Improved|Reduced|Increased|Created|Designed|Implemented|Managed)/i.test(bullet);

    if (hasMetric && hasAction) {
      stories.push({
        id: idx + 1,
        situation: `During my time working on ${extractContext(bullet)}`,
        task: `I was responsible for ${extractTask(bullet)}`,
        action: bullet,
        result: extractMetric(bullet) || "Successfully delivered the project",
        keywords: findRelevantKeywords(bullet, requirements),
      });
    }
  });

  return stories.length > 0 ? stories : [
    {
      id: 1,
      situation: "Review your recent projects",
      task: "Identify challenges you solved",
      action: "Describe specific actions you took",
      result: "Highlight quantifiable results",
      keywords: requirements.technical.slice(0, 3),
    }
  ];
}

// ML Algorithm 4: Predict interview questions using pattern matching
function predictInterviewQuestions(targetRole: string, requirements: any, analysis: any) {
  const questions: any[] = [];

  // Technical questions based on required skills
  requirements.technical.slice(0, 3).forEach((tech: string, idx: number) => {
    questions.push({
      id: idx + 1,
      category: "Technical",
      question: `Tell me about your experience with ${tech}`,
      difficulty: "Medium",
      suggestedAnswer: `Focus on specific projects where you used ${tech}, quantify your impact, and mention related technologies.`,
      preparationTips: [
        `Review ${tech} documentation and recent projects`,
        "Prepare 2-3 specific examples",
        "Be ready to discuss challenges and solutions"
      ]
    });
  });

  // Behavioral questions based on gaps
  if (analysis.gaps.length > 0) {
    questions.push({
      id: questions.length + 1,
      category: "Behavioral",
      question: `How do you approach learning new technologies?`,
      difficulty: "High",
      suggestedAnswer: "Highlight your learning methodology, provide examples of recently learned skills, and show continuous improvement mindset.",
      preparationTips: [
        "Prepare examples of self-taught skills",
        "Mention online courses, certifications, or projects",
        "Show enthusiasm for the missing skills"
      ]
    });
  }

  // Leadership questions
  questions.push({
    id: questions.length + 1,
    category: "Leadership",
    question: `Tell me about a time you led a challenging project`,
    difficulty: "High",
    suggestedAnswer: "Use STAR method: describe the situation, your specific role, actions you took, and measurable results.",
    preparationTips: [
      "Prepare metrics showing impact",
      "Highlight team collaboration",
      "Emphasize problem-solving skills"
    ]
  });

  // Problem-solving questions
  questions.push({
    id: questions.length + 1,
    category: "Problem Solving",
    question: `Describe a technical challenge you overcame`,
    difficulty: "Medium",
    suggestedAnswer: "Focus on your analytical approach, decision-making process, and the positive outcome.",
    preparationTips: [
      "Choose a relevant technical challenge",
      "Explain your thought process clearly",
      "Mention trade-offs you considered"
    ]
  });

  // Red flag questions if detected
  if (analysis.redFlags.length > 0) {
    questions.push({
      id: questions.length + 1,
      category: "Clarification",
      question: `Why are you looking for a new opportunity?`,
      difficulty: "High",
      suggestedAnswer: "Frame positively: focus on growth, learning, and excitement about the new role rather than negatives about previous positions.",
      preparationTips: [
        "Keep it positive and forward-looking",
        "Emphasize skills you want to develop",
        "Show genuine interest in the company"
      ]
    });
  }

  return questions;
}

// ML Algorithm 5: Generate strategic talking points
function generateTalkingPoints(analysis: any, requirements: any) {
  const points: any[] = [];

  // Strength-based talking points
  analysis.strengths.forEach((strength: string, idx: number) => {
    points.push({
      id: idx + 1,
      topic: strength,
      keyMessage: `Emphasize your proven track record with ${strength}`,
      supportingEvidence: "Prepare 2-3 specific examples with quantifiable results",
      timing: "Use early in interview to establish credibility"
    });
  });

  // Gap mitigation talking points
  analysis.gaps.slice(0, 2).forEach((gap: string, idx: number) => {
    points.push({
      id: points.length + 1,
      topic: `Addressing: ${gap}`,
      keyMessage: "Acknowledge gap but emphasize transferable skills and learning readiness",
      supportingEvidence: "Mention related experience or recent learning efforts",
      timing: "Address proactively if asked, otherwise focus on strengths"
    });
  });

  return points;
}

// Helper functions
function extractContext(bullet: string): string {
  const match = bullet.match(/\b(project|platform|system|service|application|feature)\b/i);
  return match ? match[0] : "this project";
}

function extractTask(bullet: string): string {
  const verbs = ['developing', 'building', 'implementing', 'improving', 'reducing', 'increasing'];
  for (const verb of verbs) {
    if (bullet.toLowerCase().includes(verb)) {
      return verb + " the solution";
    }
  }
  return "delivering the project";
}

function extractMetric(bullet: string): string | null {
  const metricMatch = bullet.match(/(\d+%|\$[\d,]+|\d+x|\d+\+)/);
  return metricMatch ? `Achieved ${metricMatch[0]} improvement` : null;
}

function findRelevantKeywords(text: string, requirements: any): string[] {
  const keywords: string[] = [];
  const textLower = text.toLowerCase();

  requirements.technical.forEach((tech: string) => {
    if (textLower.includes(tech.toLowerCase())) {
      keywords.push(tech);
    }
  });

  return keywords.slice(0, 3);
}
