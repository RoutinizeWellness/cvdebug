"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

// ML-BASED BATTLE PLAN GENERATOR
// Uses pattern matching, gap analysis, and algorithmic predictions (NO AI API NEEDED)

interface GapAnalysis {
  missingSkills: string[];
  weakAreas: string[];
  overqualified: string[];
  matchScore: number;
}

interface BattlePlan {
  role: string;
  generatedAt: number;
  hardestQuestions: Array<{
    question: string;
    why: string;
    howToAnswer: string;
    severity: "high" | "medium" | "low";
    type: string;
  }>;
  strategicPoints: Array<{
    strength: string;
    positioning: string;
    deflectionTactic: string;
    icon: string;
    confidence: string;
  }>;
  killerQuestion: {
    question: string;
    why: string;
    timing: string;
    expectedResponse: string;
  };
  confidence: {
    matchScore: number;
    strengths: number;
    gaps: number;
    recommendation: string;
  };
}

// SKILL DATABASES FOR ML MATCHING
const SKILL_CATEGORIES = {
  languages: ['javascript', 'typescript', 'python', 'java', 'c++', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'php'],
  frameworks: ['react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'rails', 'laravel'],
  databases: ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'neo4j'],
  cloud: ['aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform', 'jenkins', 'gitlab', 'circleci'],
  leadership: ['team lead', 'managed', 'mentored', 'architected', 'designed', 'led team', 'supervised'],
  methodology: ['agile', 'scrum', 'devops', 'ci/cd', 'tdd', 'microservices', 'event-driven'],
};

// QUESTION TEMPLATES BY GAP TYPE
const QUESTION_TEMPLATES = {
  missing_skill: {
    technical: [
      "I see your resume doesn't mention {skill}. How would you approach learning it for this role?",
      "This role heavily uses {skill}. Can you describe your experience with similar technologies?",
      "We use {skill} extensively. What's your strategy for getting up to speed quickly?"
    ],
    approach: [
      "Acknowledge the gap honestly, highlight transferable skills from similar tech, show you've already started learning (certificates, side projects, online courses). Emphasize quick learning ability with past examples.",
      "Frame it as growth opportunity: 'While {skill} is new to me, I've mastered [similar tech] in just 3 months and I learn by doing—I've already completed [X] and built [Y] to prepare for this role.'",
      "Use the competency transfer approach: '{skill} and {your_skill} share core principles. I've proven I can master new tech quickly—when I learned {your_skill}, I was productive in 2 weeks and expert-level in 3 months.'"
    ]
  },
  experience_gap: {
    questions: [
      "This is a senior role requiring {X} years. Can you walk through your most complex project?",
      "How do you handle the responsibility of making architectural decisions that affect the whole team?",
      "Tell me about a time you had to mentor junior developers through a challenging technical problem."
    ],
    answers: [
      "Use your MOST impressive accomplishment—scale it with metrics. Focus on leadership, impact, and decision-making. 'In my last role, I architected a system serving {X} users, led {Y} engineers, reduced costs by {Z}%. While my title was [level], my responsibilities matched this role.'",
      "Emphasize ownership and impact over title: 'I may have {X} years, but I've been the technical decision-maker on projects handling {scale/complexity/impact}. I've led incident responses affecting {X} users, mentored {Y} engineers, and made architecture calls that saved ${Z}K.'",
      "Bridge the gap with accelerated growth: 'I've compressed typical senior-level learnings into {X} years by working at a high-growth startup where I wore multiple hats, made production decisions daily, and learned from failures quickly.'"
    ]
  },
  cultural_fit: {
    questions: [
      "How do you handle disagreements with team members about technical approaches?",
      "Describe a situation where you had to give difficult feedback to a colleague.",
      "Tell me about a time you failed. What did you learn?"
    ],
    answers: [
      "Show emotional intelligence and data-driven thinking: 'I document both approaches, propose experiments with clear metrics. Recently disagreed on [X]—ran 2-week spike, my colleague's approach won. Learned [Y], relationship strengthened, shipped faster.'",
      "Demonstrate maturity: 'I gave feedback to a senior engineer about code reviews slowing sprints. Started with listening—learned they were overwhelmed. We pair-programmed on reviews for a week, created templates, review time dropped 40%.'",
      "Be vulnerable but show growth: 'I launched a feature without proper load testing—it crashed at 10K users. Cost 2 hours downtime. I owned it, led post-mortem, implemented staged rollouts and load testing procedures. Never happened again. Failure taught me operational excellence.'"
    ]
  }
};

// STRENGTH TEMPLATES
const STRENGTH_TEMPLATES = {
  scale: {
    strength: "Proven experience with systems at scale",
    positioning: "Emphasize your scaling experience early. Most candidates talk features; you talk about performance, reliability, and handling millions of users.",
    deflection: "When asked about gaps, pivot to scale: 'What I bring is battle-tested experience debugging issues at {X} scale—that pattern recognition transfers across any stack.'",
    icon: "rocket_launch"
  },
  leadership: {
    strength: "Strong leadership and mentoring track record",
    positioning: "Lead with your people impact. You don't just write code—you multiply team effectiveness and grow engineers.",
    deflection: "Frame gaps as opportunities to lead: 'I may not have used {tech} yet, but I've successfully ramped teams on new tech stacks, created learning paths, and mentored engineers to mastery.'",
    icon: "groups"
  },
  impact: {
    strength: "Demonstrated business impact with metrics",
    positioning: "You speak the language of business: revenue, cost savings, efficiency. Connect technical work to business outcomes.",
    deflection: "Bridge technical gaps to business value: 'My focus is business impact. I've delivered ${X} in savings, {Y}% efficiency gains. The specific tech is just a tool to achieve results.'",
    icon: "trending_up"
  },
  versatility: {
    strength: "Full-stack versatility and broad technical expertise",
    positioning: "You're not siloed—you can work across the stack, understand systems holistically, and connect dots others miss.",
    deflection: "Reframe gaps as specialization choices: 'I'm a generalist who goes deep when needed. My breadth means I can evaluate {missing tech} in context and learn it faster than specialists.'",
    icon: "hub"
  }
};

// KILLER QUESTIONS BY ROLE TYPE
const KILLER_QUESTIONS = {
  engineering: [
    {
      question: "What's your biggest technical challenge right now, and how are you approaching it?",
      why: "Shows you're strategic, interested in real problems, and can think at their level",
      timing: "Ask the hiring manager or tech lead, mid to late in the interview",
      expectedResponse: "Listen for: architecture challenges, scaling pain points, technical debt. These become talking points for your follow-up."
    },
    {
      question: "How do you balance moving fast with building sustainably? Can you share a recent example?",
      why: "Signals you understand startup/scale tradeoffs and care about long-term code quality",
      timing: "Perfect for tech lead or engineering manager",
      expectedResponse: "Good answer: specific example of pragmatic tradeoffs. Red flag: 'we always prioritize speed' or 'we never take shortcuts.'"
    },
    {
      question: "What does the code review culture look like here? How do you handle disagreements?",
      why: "Shows you value collaboration, quality, and learning. Assesses team health",
      timing: "Great for potential teammates or senior engineers",
      expectedResponse: "Look for: respectful debate, psychological safety, learning culture. Red flags: no reviews, rubber-stamping, or toxicity."
    }
  ],
  leadership: [
    {
      question: "What's your vision for this team/product over the next 12 months?",
      why: "Tests if they have a clear strategy. Also shows you think long-term",
      timing: "Direct question to hiring manager or VP",
      expectedResponse: "Strong leaders have clear vision. Vague answers suggest unclear direction or thrash."
    },
    {
      question: "How do you invest in your team's growth? What does career development look like?",
      why: "Signals you care about growth, want to be coached, and value learning culture",
      timing: "Perfect for your potential manager",
      expectedResponse: "Look for: 1-on-1s, mentorship, clear career paths, training budget. Red flags: 'sink or swim' or 'we're too busy for that.'"
    }
  ],
  product: [
    {
      question: "What metrics do you use to measure success for this role/product?",
      why: "Shows you're results-oriented and understand data-driven decision making",
      timing: "Ask product managers or leadership",
      expectedResponse: "Should have clear, quantifiable metrics. Vague answers suggest unclear product strategy."
    }
  ]
};

// ML-BASED GAP ANALYSIS
function analyzeGaps(resumeText: string, jobDescription: string): GapAnalysis {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  const missingSkills: string[] = [];
  const weakAreas: string[] = [];
  const overqualified: string[] = [];

  // Analyze each skill category
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    skills.forEach(skill => {
      const inJD = jdLower.includes(skill);
      const inResume = resumeLower.includes(skill);

      if (inJD && !inResume) {
        missingSkills.push(skill);
      }
      if (inResume && !inJD) {
        overqualified.push(skill);
      }
    });
  }

  // Check for experience level mismatch
  const jdYearsMatch = jdLower.match(/(\d+)\+?\s*years?/);
  const resumeYearsMatch = resumeLower.match(/(\d+)\+?\s*years?/g);

  if (jdYearsMatch) {
    const requiredYears = parseInt(jdYearsMatch[1]);
    const hasEnoughExperience = resumeYearsMatch &&
      resumeYearsMatch.some(match => parseInt(match) >= requiredYears);

    if (!hasEnoughExperience) {
      weakAreas.push('experience_level');
    }
  }

  // Check for leadership indicators
  const hasLeadership = SKILL_CATEGORIES.leadership.some(indicator => resumeLower.includes(indicator));
  const needsLeadership = SKILL_CATEGORIES.leadership.some(indicator => jdLower.includes(indicator));

  if (needsLeadership && !hasLeadership) {
    weakAreas.push('leadership_experience');
  }

  // Calculate match score
  const totalJDSkills = missingSkills.length + (weakAreas.length * 2);
  const resumeSkills = overqualified.length;
  const matchScore = Math.max(50, Math.min(95, 85 - (totalJDSkills * 3) + (resumeSkills * 2)));

  return {
    missingSkills: missingSkills.slice(0, 5), // Top 5 gaps
    weakAreas: weakAreas.slice(0, 3),
    overqualified: overqualified.slice(0, 3),
    matchScore: Math.round(matchScore)
  };
}

// GENERATE QUESTIONS BASED ON GAPS
function generateHardestQuestions(gaps: GapAnalysis, role: string): BattlePlan['hardestQuestions'] {
  const questions: BattlePlan['hardestQuestions'] = [];

  // Question 1: Technical gap (if exists)
  if (gaps.missingSkills.length > 0) {
    const missingSkill = gaps.missingSkills[0];
    const template = QUESTION_TEMPLATES.missing_skill.technical[0];
    questions.push({
      question: template.replace('{skill}', missingSkill.toUpperCase()),
      why: `Your resume lacks ${missingSkill} experience, but it's required for this role`,
      howToAnswer: QUESTION_TEMPLATES.missing_skill.approach[0].replace(/{skill}/g, missingSkill),
      severity: "high",
      type: "Technical Gap"
    });
  }

  // Question 2: Experience level (if gap exists)
  if (gaps.weakAreas.includes('experience_level')) {
    questions.push({
      question: QUESTION_TEMPLATES.experience_gap.questions[0].replace('{X}', '5+'),
      why: "They want to assess if you can handle senior-level responsibilities despite fewer years",
      howToAnswer: QUESTION_TEMPLATES.experience_gap.answers[0],
      severity: "high",
      type: "Experience Level"
    });
  }

  // Question 3: Leadership (if needed but missing)
  if (gaps.weakAreas.includes('leadership_experience')) {
    questions.push({
      question: QUESTION_TEMPLATES.experience_gap.questions[2],
      why: "The role requires mentoring and leadership skills",
      howToAnswer: QUESTION_TEMPLATES.experience_gap.answers[1],
      severity: "medium",
      type: "Leadership"
    });
  }

  // Always add a cultural fit question
  questions.push({
    question: QUESTION_TEMPLATES.cultural_fit.questions[0],
    why: "Testing your collaboration skills and ego-less engineering mindset",
    howToAnswer: QUESTION_TEMPLATES.cultural_fit.answers[0],
    severity: "medium",
    type: "Cultural Fit"
  });

  return questions.slice(0, 4); // Max 4 questions
}

// IDENTIFY STRENGTHS
function identifyStrengths(resumeText: string, gaps: GapAnalysis): BattlePlan['strategicPoints'] {
  const resumeLower = resumeText.toLowerCase();
  const strengths: BattlePlan['strategicPoints'] = [];

  // Check for scale indicators
  const hasScale = /\d+[KMB]\+?\s*(users|requests|transactions|customers)/i.test(resumeText) ||
                   /million|thousand|scale/i.test(resumeText);

  if (hasScale) {
    const template = STRENGTH_TEMPLATES.scale;
    strengths.push({
      ...template,
      confidence: "High - clearly demonstrated in resume"
    });
  }

  // Check for leadership
  const hasLeadership = SKILL_CATEGORIES.leadership.some(indicator => resumeLower.includes(indicator));
  if (hasLeadership) {
    const template = STRENGTH_TEMPLATES.leadership;
    strengths.push({
      ...template,
      confidence: "High - multiple leadership indicators"
    });
  }

  // Check for business impact
  const hasImpact = /\$\d+[KMB]?|\d+%\s*(increase|decrease|improvement|savings)/i.test(resumeText);
  if (hasImpact) {
    const template = STRENGTH_TEMPLATES.impact;
    strengths.push({
      ...template,
      confidence: "High - quantified business outcomes"
    });
  }

  // Check for versatility
  const skillCount = gaps.overqualified.length;
  if (skillCount >= 3) {
    const template = STRENGTH_TEMPLATES.versatility;
    strengths.push({
      ...template,
      confidence: `High - ${skillCount}+ technologies mastered`
    });
  }

  // Ensure at least 2 strengths
  if (strengths.length < 2) {
    strengths.push({
      strength: "Strong technical foundation and problem-solving skills",
      positioning: "Emphasize your ability to learn quickly and solve complex problems. Focus on past achievements that show adaptability.",
      deflection: "When faced with gaps, highlight your learning agility: 'I've mastered [X] technologies in my career—adding [missing skill] is just the next one.'",
      icon: "psychology",
      confidence: "Medium - inferred from overall experience"
    });
  }

  return strengths.slice(0, 3); // Max 3 strengths
}

// SELECT KILLER QUESTION
function selectKillerQuestion(role: string): BattlePlan['killerQuestion'] {
  const roleLower = role.toLowerCase();

  let questionSet = KILLER_QUESTIONS.engineering;
  if (roleLower.includes('lead') || roleLower.includes('manager') || roleLower.includes('director')) {
    questionSet = KILLER_QUESTIONS.leadership;
  } else if (roleLower.includes('product')) {
    questionSet = KILLER_QUESTIONS.product;
  }

  const selected = questionSet[Math.floor(Math.random() * questionSet.length)];
  return selected;
}

export const generateBattlePlan = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.string(),
    targetRole: v.string(),
  },
  handler: async (ctx, args) => {
    const { resumeText, jobDescription, targetRole } = args;

    try {
      console.log("[ML Battle Plan] 🎯 Generating battle plan with ML algorithms...");

      // Step 1: Analyze gaps using ML pattern matching
      const gaps = analyzeGaps(resumeText, jobDescription);
      console.log("[ML Battle Plan] Gap analysis complete:", gaps);

      // Step 2: Generate hardest questions based on gaps
      const hardestQuestions = generateHardestQuestions(gaps, targetRole);

      // Step 3: Identify strategic strengths
      const strategicPoints = identifyStrengths(resumeText, gaps);

      // Step 4: Select killer question
      const killerQuestion = selectKillerQuestion(targetRole);

      // Build final battle plan
      const battlePlan: BattlePlan = {
        role: targetRole,
        generatedAt: Date.now(),
        hardestQuestions,
        strategicPoints,
        killerQuestion,
        confidence: {
          matchScore: gaps.matchScore,
          strengths: strategicPoints.length,
          gaps: gaps.missingSkills.length + gaps.weakAreas.length,
          recommendation: gaps.matchScore >= 80
            ? "Strong match! Focus on demonstrating your strengths confidently."
            : gaps.matchScore >= 70
            ? "Good match with some gaps. Study the provided answers to bridge them."
            : "Some significant gaps. Focus heavily on demonstrating transferable skills and learning agility."
        }
      };

      console.log("[ML Battle Plan] ✅ Battle plan generated successfully");

      return {
        success: true,
        battlePlan
      };

    } catch (error: any) {
      console.error("[ML Battle Plan] ❌ Error:", error);
      throw new Error(`Failed to generate battle plan: ${error.message}`);
    }
  },
});
