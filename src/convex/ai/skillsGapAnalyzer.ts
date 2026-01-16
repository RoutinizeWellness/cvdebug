/**
 * PHASE 3 - FEATURE 3: SKILLS GAP ANALYZER + LEARNING PATHS
 *
 * Intelligent skills gap analysis with personalized learning recommendations
 *
 * Features:
 * - Detect missing skills from job requirements
 * - Prioritize skills by impact on hiring
 * - Generate learning paths with resources
 * - Estimate time to proficiency
 * - Skill transfer analysis (leverage existing skills)
 * - Industry-specific learning recommendations
 *
 * COMPETITIVE ADVANTAGE:
 * - Jobscan: Basic keyword detection ❌
 * - Resume Worded: No learning paths ❌
 * - CVDebug: Full learning roadmap ✅
 */

import { v } from "convex/values";

/**
 * Skill levels
 */
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

/**
 * Learning resource types
 */
export type ResourceType =
  | "course"
  | "tutorial"
  | "book"
  | "certification"
  | "bootcamp"
  | "documentation"
  | "practice"
  | "project";

/**
 * Skill gap with priority and impact
 */
export interface SkillGap {
  skill: string;
  category: "technical" | "soft" | "certification" | "tool" | "framework";
  priority: "critical" | "high" | "medium" | "low";
  impact: number;              // 0-100: impact on hiring probability
  currentLevel: SkillLevel | "none";
  requiredLevel: SkillLevel;
  timeToLearn: number;         // Hours
  relatedSkills: string[];     // Skills you have that can help
  demandTrend: "rising" | "stable" | "declining";
  marketValue: number;         // Salary impact ($K per year)
}

/**
 * Learning resource recommendation
 */
export interface LearningResource {
  title: string;
  type: ResourceType;
  provider: string;
  url: string;
  duration: number;            // Hours
  cost: number;                // USD (0 for free)
  rating: number;              // 0-5 stars
  relevance: number;           // 0-100
  difficulty: SkillLevel;
  certification: boolean;
  description: string;
}

/**
 * Learning path for a skill
 */
export interface LearningPath {
  skill: string;
  currentLevel: SkillLevel | "none";
  targetLevel: SkillLevel;
  totalTime: number;           // Hours
  phases: Array<{
    phase: number;
    level: SkillLevel;
    description: string;
    duration: number;          // Hours
    milestones: string[];
    resources: LearningResource[];
  }>;
  projects: string[];          // Suggested projects to build
  certifications: string[];    // Recommended certifications
}

/**
 * Complete skills gap analysis
 */
export interface SkillsGapAnalysis {
  overallReadiness: number;    // 0-100
  criticalGaps: SkillGap[];
  highPriorityGaps: SkillGap[];
  mediumPriorityGaps: SkillGap[];
  lowPriorityGaps: SkillGap[];
  strengths: string[];         // Skills you have that match well
  transferableSkills: string[]; // Skills you have that can transfer
  learningPaths: Record<string, LearningPath>;
  timeToReady: number;         // Hours to close critical gaps
  estimatedCost: number;       // USD for recommended resources
  quickWins: string[];         // Skills that are easy and high-impact
  recommendations: string[];
}

/**
 * Comprehensive skill database
 */
const SKILL_DATABASE: Record<string, {
  category: "technical" | "soft" | "certification" | "tool" | "framework";
  relatedSkills: string[];
  learningTime: { beginner: number; intermediate: number; advanced: number };
  marketValue: number;         // Annual salary impact
  demandTrend: "rising" | "stable" | "declining";
  prerequisites: string[];
}> = {
  // Programming Languages
  "javascript": {
    category: "technical",
    relatedSkills: ["typescript", "react", "node.js", "web development"],
    learningTime: { beginner: 120, intermediate: 200, advanced: 400 },
    marketValue: 8000,
    demandTrend: "stable",
    prerequisites: []
  },
  "typescript": {
    category: "technical",
    relatedSkills: ["javascript", "react", "node.js"],
    learningTime: { beginner: 40, intermediate: 80, advanced: 160 },
    marketValue: 12000,
    demandTrend: "rising",
    prerequisites: ["javascript"]
  },
  "python": {
    category: "technical",
    relatedSkills: ["data science", "machine learning", "django", "flask"],
    learningTime: { beginner: 100, intermediate: 180, advanced: 350 },
    marketValue: 10000,
    demandTrend: "rising",
    prerequisites: []
  },
  "java": {
    category: "technical",
    relatedSkills: ["spring boot", "kotlin", "android"],
    learningTime: { beginner: 150, intermediate: 250, advanced: 450 },
    marketValue: 9000,
    demandTrend: "stable",
    prerequisites: []
  },
  "go": {
    category: "technical",
    relatedSkills: ["microservices", "docker", "kubernetes"],
    learningTime: { beginner: 80, intermediate: 140, advanced: 280 },
    marketValue: 15000,
    demandTrend: "rising",
    prerequisites: []
  },
  "rust": {
    category: "technical",
    relatedSkills: ["systems programming", "c++"],
    learningTime: { beginner: 200, intermediate: 350, advanced: 600 },
    marketValue: 18000,
    demandTrend: "rising",
    prerequisites: []
  },

  // Frontend Frameworks
  "react": {
    category: "framework",
    relatedSkills: ["javascript", "typescript", "redux", "next.js"],
    learningTime: { beginner: 60, intermediate: 120, advanced: 240 },
    marketValue: 10000,
    demandTrend: "stable",
    prerequisites: ["javascript"]
  },
  "vue": {
    category: "framework",
    relatedSkills: ["javascript", "typescript", "nuxt"],
    learningTime: { beginner: 50, intermediate: 100, advanced: 200 },
    marketValue: 8000,
    demandTrend: "stable",
    prerequisites: ["javascript"]
  },
  "angular": {
    category: "framework",
    relatedSkills: ["typescript", "rxjs"],
    learningTime: { beginner: 80, intermediate: 150, advanced: 300 },
    marketValue: 9000,
    demandTrend: "declining",
    prerequisites: ["typescript"]
  },
  "svelte": {
    category: "framework",
    relatedSkills: ["javascript", "typescript"],
    learningTime: { beginner: 40, intermediate: 80, advanced: 160 },
    marketValue: 11000,
    demandTrend: "rising",
    prerequisites: ["javascript"]
  },

  // Backend Frameworks
  "node.js": {
    category: "framework",
    relatedSkills: ["javascript", "typescript", "express", "nest.js"],
    learningTime: { beginner: 60, intermediate: 120, advanced: 240 },
    marketValue: 10000,
    demandTrend: "stable",
    prerequisites: ["javascript"]
  },
  "django": {
    category: "framework",
    relatedSkills: ["python", "rest api", "postgresql"],
    learningTime: { beginner: 70, intermediate: 130, advanced: 250 },
    marketValue: 9000,
    demandTrend: "stable",
    prerequisites: ["python"]
  },
  "spring boot": {
    category: "framework",
    relatedSkills: ["java", "microservices", "rest api"],
    learningTime: { beginner: 90, intermediate: 160, advanced: 320 },
    marketValue: 11000,
    demandTrend: "stable",
    prerequisites: ["java"]
  },

  // Cloud Platforms
  "aws": {
    category: "tool",
    relatedSkills: ["ec2", "s3", "lambda", "cloud architecture"],
    learningTime: { beginner: 100, intermediate: 200, advanced: 400 },
    marketValue: 15000,
    demandTrend: "rising",
    prerequisites: []
  },
  "azure": {
    category: "tool",
    relatedSkills: ["cloud architecture", "devops"],
    learningTime: { beginner: 100, intermediate: 200, advanced: 400 },
    marketValue: 13000,
    demandTrend: "rising",
    prerequisites: []
  },
  "gcp": {
    category: "tool",
    relatedSkills: ["cloud architecture", "kubernetes"],
    learningTime: { beginner: 90, intermediate: 180, advanced: 360 },
    marketValue: 14000,
    demandTrend: "rising",
    prerequisites: []
  },

  // DevOps & Tools
  "docker": {
    category: "tool",
    relatedSkills: ["kubernetes", "containerization", "devops"],
    learningTime: { beginner: 40, intermediate: 80, advanced: 160 },
    marketValue: 12000,
    demandTrend: "stable",
    prerequisites: []
  },
  "kubernetes": {
    category: "tool",
    relatedSkills: ["docker", "devops", "cloud architecture"],
    learningTime: { beginner: 80, intermediate: 160, advanced: 320 },
    marketValue: 18000,
    demandTrend: "rising",
    prerequisites: ["docker"]
  },
  "terraform": {
    category: "tool",
    relatedSkills: ["infrastructure as code", "aws", "devops"],
    learningTime: { beginner: 50, intermediate: 100, advanced: 200 },
    marketValue: 15000,
    demandTrend: "rising",
    prerequisites: []
  },
  "jenkins": {
    category: "tool",
    relatedSkills: ["ci/cd", "devops", "automation"],
    learningTime: { beginner: 40, intermediate: 80, advanced: 160 },
    marketValue: 10000,
    demandTrend: "stable",
    prerequisites: []
  },

  // Databases
  "postgresql": {
    category: "tool",
    relatedSkills: ["sql", "database design", "data modeling"],
    learningTime: { beginner: 60, intermediate: 120, advanced: 240 },
    marketValue: 9000,
    demandTrend: "stable",
    prerequisites: []
  },
  "mongodb": {
    category: "tool",
    relatedSkills: ["nosql", "database design"],
    learningTime: { beginner: 40, intermediate: 80, advanced: 160 },
    marketValue: 10000,
    demandTrend: "stable",
    prerequisites: []
  },
  "redis": {
    category: "tool",
    relatedSkills: ["caching", "nosql"],
    learningTime: { beginner: 30, intermediate: 60, advanced: 120 },
    marketValue: 11000,
    demandTrend: "stable",
    prerequisites: []
  },

  // Machine Learning / AI
  "machine learning": {
    category: "technical",
    relatedSkills: ["python", "tensorflow", "pytorch", "data science"],
    learningTime: { beginner: 150, intermediate: 300, advanced: 600 },
    marketValue: 25000,
    demandTrend: "rising",
    prerequisites: ["python"]
  },
  "tensorflow": {
    category: "framework",
    relatedSkills: ["python", "machine learning", "deep learning"],
    learningTime: { beginner: 80, intermediate: 160, advanced: 320 },
    marketValue: 20000,
    demandTrend: "stable",
    prerequisites: ["python", "machine learning"]
  },
  "pytorch": {
    category: "framework",
    relatedSkills: ["python", "machine learning", "deep learning"],
    learningTime: { beginner: 70, intermediate: 140, advanced: 280 },
    marketValue: 22000,
    demandTrend: "rising",
    prerequisites: ["python", "machine learning"]
  },

  // Certifications
  "aws certified solutions architect": {
    category: "certification",
    relatedSkills: ["aws", "cloud architecture"],
    learningTime: { beginner: 120, intermediate: 80, advanced: 40 },
    marketValue: 20000,
    demandTrend: "rising",
    prerequisites: ["aws"]
  },
  "pmp": {
    category: "certification",
    relatedSkills: ["project management", "leadership"],
    learningTime: { beginner: 100, intermediate: 60, advanced: 30 },
    marketValue: 15000,
    demandTrend: "stable",
    prerequisites: []
  },
  "cissp": {
    category: "certification",
    relatedSkills: ["cybersecurity", "security"],
    learningTime: { beginner: 150, intermediate: 100, advanced: 50 },
    marketValue: 22000,
    demandTrend: "rising",
    prerequisites: []
  },

  // Soft Skills
  "leadership": {
    category: "soft",
    relatedSkills: ["team management", "communication", "decision making"],
    learningTime: { beginner: 100, intermediate: 200, advanced: 400 },
    marketValue: 18000,
    demandTrend: "stable",
    prerequisites: []
  },
  "project management": {
    category: "soft",
    relatedSkills: ["leadership", "agile", "scrum"],
    learningTime: { beginner: 80, intermediate: 150, advanced: 300 },
    marketValue: 15000,
    demandTrend: "stable",
    prerequisites: []
  },
  "communication": {
    category: "soft",
    relatedSkills: ["presentation", "writing", "leadership"],
    learningTime: { beginner: 60, intermediate: 120, advanced: 240 },
    marketValue: 12000,
    demandTrend: "stable",
    prerequisites: []
  }
};

/**
 * Learning resources database
 */
const LEARNING_RESOURCES: Record<string, LearningResource[]> = {
  "javascript": [
    {
      title: "JavaScript: The Complete Guide",
      type: "course",
      provider: "Udemy",
      url: "https://udemy.com/javascript-complete",
      duration: 52,
      cost: 14.99,
      rating: 4.7,
      relevance: 95,
      difficulty: "beginner",
      certification: true,
      description: "Master JavaScript from scratch with hands-on projects"
    },
    {
      title: "You Don't Know JS (book series)",
      type: "book",
      provider: "GitHub",
      url: "https://github.com/getify/You-Dont-Know-JS",
      duration: 60,
      cost: 0,
      rating: 4.9,
      relevance: 100,
      difficulty: "intermediate",
      certification: false,
      description: "Deep dive into JavaScript mechanics"
    }
  ],
  "react": [
    {
      title: "React - The Complete Guide",
      type: "course",
      provider: "Udemy",
      url: "https://udemy.com/react-complete",
      duration: 48,
      cost: 14.99,
      rating: 4.8,
      relevance: 98,
      difficulty: "beginner",
      certification: true,
      description: "Build modern React apps with hooks, Redux, and more"
    },
    {
      title: "Official React Documentation",
      type: "documentation",
      provider: "React.dev",
      url: "https://react.dev",
      duration: 20,
      cost: 0,
      rating: 4.9,
      relevance: 100,
      difficulty: "beginner",
      certification: false,
      description: "Official React docs with interactive examples"
    }
  ],
  "python": [
    {
      title: "100 Days of Code: Python",
      type: "course",
      provider: "Udemy",
      url: "https://udemy.com/100-days-python",
      duration: 100,
      cost: 14.99,
      rating: 4.8,
      relevance: 95,
      difficulty: "beginner",
      certification: true,
      description: "Learn Python by building 100 projects in 100 days"
    },
    {
      title: "Python for Data Science",
      type: "course",
      provider: "Coursera",
      url: "https://coursera.org/python-data-science",
      duration: 40,
      cost: 49,
      rating: 4.7,
      relevance: 90,
      difficulty: "intermediate",
      certification: true,
      description: "Applied Python for data analysis and visualization"
    }
  ],
  "aws": [
    {
      title: "AWS Certified Solutions Architect - Associate",
      type: "certification",
      provider: "AWS Training",
      url: "https://aws.training",
      duration: 120,
      cost: 150,
      rating: 4.6,
      relevance: 100,
      difficulty: "intermediate",
      certification: true,
      description: "Official AWS certification prep course"
    },
    {
      title: "AWS Fundamentals",
      type: "course",
      provider: "Coursera",
      url: "https://coursera.org/aws-fundamentals",
      duration: 30,
      cost: 0,
      rating: 4.5,
      relevance: 85,
      difficulty: "beginner",
      certification: false,
      description: "Introduction to core AWS services"
    }
  ],
  "docker": [
    {
      title: "Docker Mastery",
      type: "course",
      provider: "Udemy",
      url: "https://udemy.com/docker-mastery",
      duration: 20,
      cost: 14.99,
      rating: 4.7,
      relevance: 95,
      difficulty: "beginner",
      certification: true,
      description: "Complete Docker from basics to Swarm"
    }
  ],
  "kubernetes": [
    {
      title: "Kubernetes for Developers",
      type: "course",
      provider: "Udemy",
      url: "https://udemy.com/kubernetes-developers",
      duration: 35,
      cost: 14.99,
      rating: 4.6,
      relevance: 95,
      difficulty: "intermediate",
      certification: true,
      description: "Deploy and manage applications on Kubernetes"
    },
    {
      title: "CKA: Certified Kubernetes Administrator",
      type: "certification",
      provider: "Linux Foundation",
      url: "https://training.linuxfoundation.org/cka",
      duration: 80,
      cost: 395,
      rating: 4.8,
      relevance: 100,
      difficulty: "advanced",
      certification: true,
      description: "Official Kubernetes certification"
    }
  ]
};

/**
 * Extract required skills from job description
 */
export function extractRequiredSkills(jobDescription: string): Array<{
  skill: string;
  priority: "critical" | "high" | "medium" | "low";
  mentions: number;
}> {
  const text = jobDescription.toLowerCase();
  const requiredSkills: Array<{
    skill: string;
    priority: "critical" | "high" | "medium" | "low";
    mentions: number;
  }> = [];

  // Check all skills in database
  for (const [skill, data] of Object.entries(SKILL_DATABASE)) {
    const skillLower = skill.toLowerCase();
    const mentions = (text.match(new RegExp(skillLower, 'g')) || []).length;

    if (mentions > 0) {
      // Determine priority based on mentions and context
      let priority: "critical" | "high" | "medium" | "low";

      // Check if in "required" or "must have" section
      const requiredSection = text.includes('required') || text.includes('must have');
      const inRequiredContext = requiredSection &&
        text.indexOf(skillLower) > text.indexOf('required');

      if (mentions >= 3 || inRequiredContext) {
        priority = "critical";
      } else if (mentions >= 2) {
        priority = "high";
      } else if (text.includes('preferred') || text.includes('nice to have')) {
        priority = "low";
      } else {
        priority = "medium";
      }

      requiredSkills.push({ skill, priority, mentions });
    }
  }

  return requiredSkills.sort((a, b) => b.mentions - a.mentions);
}

/**
 * Extract current skills from resume
 */
export function extractCurrentSkills(resumeText: string): Array<{
  skill: string;
  level: SkillLevel;
  yearsExperience: number;
}> {
  const text = resumeText.toLowerCase();
  const currentSkills: Array<{
    skill: string;
    level: SkillLevel;
    yearsExperience: number;
  }> = [];

  for (const [skill] of Object.entries(SKILL_DATABASE)) {
    const skillLower = skill.toLowerCase();
    if (text.includes(skillLower)) {
      // Estimate level based on context
      let level: SkillLevel = "beginner";
      const experienceMatch = text.match(new RegExp(`(\\d+)\\+?\\s*years?.*${skillLower}`, 'i'));
      const years = experienceMatch ? parseInt(experienceMatch[1]) : 0;

      if (years >= 5 || text.includes(`expert in ${skillLower}`)) {
        level = "expert";
      } else if (years >= 3 || text.includes(`senior ${skillLower}`)) {
        level = "advanced";
      } else if (years >= 1 || text.includes(`proficient in ${skillLower}`)) {
        level = "intermediate";
      }

      currentSkills.push({
        skill,
        level,
        yearsExperience: years
      });
    }
  }

  return currentSkills;
}

/**
 * Calculate skill gap impact
 */
function calculateImpact(
  skill: string,
  priority: "critical" | "high" | "medium" | "low",
  skillData: typeof SKILL_DATABASE[string]
): number {
  let impact = 0;

  // Priority weight (50%)
  const priorityWeights = { critical: 50, high: 37.5, medium: 25, low: 12.5 };
  impact += priorityWeights[priority];

  // Market value weight (25%)
  impact += (skillData.marketValue / 1000); // Max ~25

  // Demand trend weight (15%)
  const trendWeights = { rising: 15, stable: 10, declining: 5 };
  impact += trendWeights[skillData.demandTrend];

  // Category weight (10%)
  const categoryWeights = {
    certification: 10,
    technical: 8,
    framework: 6,
    tool: 5,
    soft: 4
  };
  impact += categoryWeights[skillData.category];

  return Math.min(100, Math.round(impact));
}

/**
 * Generate learning path for a skill
 */
function generateLearningPath(
  skill: string,
  currentLevel: SkillLevel | "none",
  targetLevel: SkillLevel,
  skillData: typeof SKILL_DATABASE[string]
): LearningPath {
  const levelOrder: Array<SkillLevel | "none"> = ["none", "beginner", "intermediate", "advanced", "expert"];
  const startIndex = levelOrder.indexOf(currentLevel);
  const endIndex = levelOrder.indexOf(targetLevel);

  const phases: LearningPath["phases"] = [];
  let totalTime = 0;

  for (let i = startIndex + 1; i <= endIndex; i++) {
    const level = levelOrder[i] as SkillLevel;
    const duration = skillData.learningTime[level as keyof typeof skillData.learningTime] || 100;
    totalTime += duration;

    // Get resources for this level
    const resources = LEARNING_RESOURCES[skill]?.filter(
      r => r.difficulty === level
    ) || [];

    phases.push({
      phase: i - startIndex,
      level,
      description: `Reach ${level} level in ${skill}`,
      duration,
      milestones: getMilestones(skill, level),
      resources
    });
  }

  return {
    skill,
    currentLevel,
    targetLevel,
    totalTime,
    phases,
    projects: getProjectSuggestions(skill, targetLevel),
    certifications: getCertificationSuggestions(skill)
  };
}

/**
 * Get milestones for skill level
 */
function getMilestones(skill: string, level: SkillLevel): string[] {
  const milestones: Record<SkillLevel, string[]> = {
    beginner: [
      `Understand core concepts of ${skill}`,
      `Complete 3-5 basic tutorials`,
      `Build first simple project`
    ],
    intermediate: [
      `Master common patterns and best practices`,
      `Build 2-3 medium complexity projects`,
      `Contribute to open source or team projects`,
      `Debug and optimize code effectively`
    ],
    advanced: [
      `Architect complex systems using ${skill}`,
      `Mentor others and review code`,
      `Optimize performance and scalability`,
      `Handle edge cases and production issues`
    ],
    expert: [
      `Innovate with ${skill} in novel ways`,
      `Speak at conferences or write technical content`,
      `Design and lead major projects`,
      `Recognized as authority in the field`
    ]
  };

  return milestones[level];
}

/**
 * Get project suggestions
 */
function getProjectSuggestions(skill: string, level: SkillLevel): string[] {
  const projects: Record<string, Record<SkillLevel, string[]>> = {
    "react": {
      beginner: ["Todo app with hooks", "Weather dashboard"],
      intermediate: ["E-commerce site with cart", "Social media feed"],
      advanced: ["Real-time chat with WebSockets", "Admin dashboard with complex state"],
      expert: ["Micro-frontend architecture", "Open source UI library"]
    },
    "python": {
      beginner: ["Calculator CLI", "Web scraper"],
      intermediate: ["REST API with Flask", "Data analysis dashboard"],
      advanced: ["Machine learning model deployment", "Distributed task queue"],
      expert: ["High-performance data processing pipeline", "ML framework contribution"]
    },
    "aws": {
      beginner: ["Static website on S3", "EC2 instance setup"],
      intermediate: ["Serverless API with Lambda", "Auto-scaling web app"],
      advanced: ["Multi-region architecture", "CI/CD pipeline"],
      expert: ["Complex multi-account setup", "Cost optimization at scale"]
    }
  };

  return projects[skill]?.[level] || [`Build ${level}-level project with ${skill}`];
}

/**
 * Get certification suggestions
 */
function getCertificationSuggestions(skill: string): string[] {
  const certs: Record<string, string[]> = {
    "aws": ["AWS Certified Solutions Architect - Associate", "AWS Certified Developer"],
    "azure": ["AZ-900: Azure Fundamentals", "AZ-104: Azure Administrator"],
    "kubernetes": ["CKA: Certified Kubernetes Administrator", "CKAD: Certified Kubernetes Application Developer"],
    "python": ["PCEP: Certified Entry-Level Python Programmer", "PCAP: Certified Associate Python Programmer"]
  };

  return certs[skill] || [];
}

/**
 * MAIN FUNCTION: Analyze skills gap
 */
export function analyzeSkillsGap(
  resumeText: string,
  jobDescription: string
): SkillsGapAnalysis {
  // Extract skills
  const requiredSkills = extractRequiredSkills(jobDescription);
  const currentSkills = extractCurrentSkills(resumeText);

  // Create skill maps
  const currentSkillMap = new Map(currentSkills.map(s => [s.skill, s]));
  const requiredSkillMap = new Map(requiredSkills.map(s => [s.skill, s]));

  // Calculate gaps
  const gaps: SkillGap[] = [];
  let totalImpact = 0;

  for (const required of requiredSkills) {
    const skillData = SKILL_DATABASE[required.skill];
    if (!skillData) continue;

    const current = currentSkillMap.get(required.skill);
    const currentLevel = current?.level || "none";
    const requiredLevel: SkillLevel = required.priority === "critical" ? "advanced" : "intermediate";

    // Only add gap if skill is missing or insufficient
    if (!current || levelToNumber(currentLevel) < levelToNumber(requiredLevel)) {
      const impact = calculateImpact(required.skill, required.priority, skillData);
      totalImpact += impact;

      // Find related skills user has
      const relatedSkills = skillData.relatedSkills.filter(rs =>
        currentSkillMap.has(rs)
      );

      gaps.push({
        skill: required.skill,
        category: skillData.category,
        priority: required.priority,
        impact,
        currentLevel,
        requiredLevel,
        timeToLearn: skillData.learningTime[requiredLevel],
        relatedSkills,
        demandTrend: skillData.demandTrend,
        marketValue: skillData.marketValue
      });
    }
  }

  // Sort gaps by impact
  gaps.sort((a, b) => b.impact - a.impact);

  // Categorize gaps
  const criticalGaps = gaps.filter(g => g.priority === "critical");
  const highPriorityGaps = gaps.filter(g => g.priority === "high");
  const mediumPriorityGaps = gaps.filter(g => g.priority === "medium");
  const lowPriorityGaps = gaps.filter(g => g.priority === "low");

  // Identify strengths and transferable skills
  const strengths = currentSkills
    .filter(cs => requiredSkillMap.has(cs.skill))
    .map(cs => cs.skill);

  const transferableSkills = currentSkills
    .filter(cs => {
      const skillData = SKILL_DATABASE[cs.skill];
      return skillData?.relatedSkills.some(rs => requiredSkillMap.has(rs));
    })
    .map(cs => cs.skill);

  // Generate learning paths for critical and high priority gaps
  const learningPaths: Record<string, LearningPath> = {};
  let timeToReady = 0;
  let estimatedCost = 0;

  for (const gap of [...criticalGaps, ...highPriorityGaps].slice(0, 5)) {
    const skillData = SKILL_DATABASE[gap.skill];
    if (!skillData) continue;

    const path = generateLearningPath(
      gap.skill,
      gap.currentLevel,
      gap.requiredLevel,
      skillData
    );

    learningPaths[gap.skill] = path;
    timeToReady += path.totalTime;

    // Calculate cost
    const resources = LEARNING_RESOURCES[gap.skill] || [];
    estimatedCost += resources.reduce((sum, r) => sum + r.cost, 0);
  }

  // Identify quick wins (easy + high impact)
  const quickWins = gaps
    .filter(g => g.timeToLearn < 60 && g.impact >= 60)
    .map(g => g.skill)
    .slice(0, 3);

  // Calculate overall readiness
  const requiredImpactSum = requiredSkills.reduce((sum, rs) => {
    const skillData = SKILL_DATABASE[rs.skill];
    if (!skillData) return sum;
    return sum + calculateImpact(rs.skill, rs.priority, skillData);
  }, 0);

  const matchedImpactSum = requiredImpactSum - totalImpact;
  const overallReadiness = requiredImpactSum > 0
    ? Math.round((matchedImpactSum / requiredImpactSum) * 100)
    : 100;

  // Generate recommendations
  const recommendations = generateRecommendations(
    overallReadiness,
    criticalGaps,
    quickWins,
    timeToReady
  );

  return {
    overallReadiness,
    criticalGaps,
    highPriorityGaps,
    mediumPriorityGaps,
    lowPriorityGaps,
    strengths,
    transferableSkills,
    learningPaths,
    timeToReady,
    estimatedCost,
    quickWins,
    recommendations
  };
}

/**
 * Helper: Convert skill level to number
 */
function levelToNumber(level: SkillLevel | "none"): number {
  const map = { none: 0, beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
  return map[level];
}

/**
 * Generate recommendations
 */
function generateRecommendations(
  readiness: number,
  criticalGaps: SkillGap[],
  quickWins: string[],
  timeToReady: number
): string[] {
  const recommendations: string[] = [];

  if (readiness >= 80) {
    recommendations.push("You're well-qualified for this role! Focus on showcasing your existing skills.");
  } else if (readiness >= 60) {
    recommendations.push("You have a solid foundation. Close critical gaps to become a strong candidate.");
  } else {
    recommendations.push("Significant skill gaps detected. Consider targeting roles that better match your current skills or invest in learning.");
  }

  if (criticalGaps.length > 0) {
    recommendations.push(`Priority: Learn ${criticalGaps.slice(0, 3).map(g => g.skill).join(", ")} first - these are critical for the role.`);
  }

  if (quickWins.length > 0) {
    recommendations.push(`Quick wins: ${quickWins.join(", ")} - high impact and can learn quickly.`);
  }

  if (timeToReady > 0) {
    const weeks = Math.ceil(timeToReady / 40); // Assuming 40 hours/week
    recommendations.push(`Estimated time to become interview-ready: ${weeks} weeks of focused learning.`);
  }

  return recommendations;
}
