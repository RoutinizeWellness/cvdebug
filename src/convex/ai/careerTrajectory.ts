/**
 * PHASE 3 - FEATURE 6: CAREER TRAJECTORY PREDICTOR
 *
 * AI-powered career path prediction and planning
 *
 * Features:
 * - Predict next logical career move
 * - Career growth timeline
 * - Skill development roadmap
 * - Salary progression forecast
 * - Industry transition analysis
 * - Leadership track identification
 *
 * COMPETITIVE ADVANTAGE:
 * - LinkedIn: Basic suggestions ❌
 * - Indeed: No career planning ❌
 * - CVDebug: Full trajectory prediction ✅
 */

import { v } from "convex/values";

/**
 * Current career state
 */
export interface CareerState {
  currentRole: string;
  yearsInRole: number;
  totalYearsExperience: number;
  currentSalary: number;
  skills: string[];
  education: string;
  industry: string;
  companySize: "startup" | "small" | "medium" | "large" | "enterprise";
  seniorityLevel: "junior" | "mid" | "senior" | "lead" | "director" | "vp" | "c-level";
  achievements: string[];
}

/**
 * Predicted next role
 */
export interface NextRolePrediction {
  title: string;
  timeframe: string;             // e.g., "6-12 months", "1-2 years"
  probability: number;           // 0-100%
  salaryRange: { min: number; max: number };
  requiredSkills: string[];
  skillsYouHave: string[];
  skillGaps: string[];
  estimatedLearningTime: number; // Hours
  reasoningFactors: string[];
  preparation: string[];         // Steps to prepare
}

/**
 * Career trajectory
 */
export interface CareerTrajectory {
  currentState: {
    role: string;
    level: string;
    salary: number;
    yearsExperience: number;
  };
  nextRoles: NextRolePrediction[]; // Ordered by likelihood
  longTermPath: Array<{
    role: string;
    level: string;
    timeframe: string;
    salaryRange: { min: number; max: number };
    keyMilestones: string[];
  }>;
  salaryProjection: Array<{
    year: number;
    conservativeEstimate: number;
    expectedEstimate: number;
    optimisticEstimate: number;
  }>;
  skillDevelopmentPlan: Array<{
    skill: string;
    priority: "immediate" | "short-term" | "long-term";
    reason: string;
    estimatedTime: number;
  }>;
  alternativePaths: Array<{
    pathName: string;
    description: string;
    viability: number;          // 0-100%
    requiredTransition: string;
  }>;
  recommendations: string[];
}

/**
 * Career ladder by industry/role
 */
const CAREER_LADDERS: Record<string, Array<{
  level: string;
  typicalTitles: string[];
  yearsExperience: { min: number; max: number };
  salaryMultiplier: number;      // Relative to baseline
  keyResponsibilities: string[];
}>> = {
  "software_engineering": [
    {
      level: "junior",
      typicalTitles: ["Junior Developer", "Software Engineer I", "Associate Engineer"],
      yearsExperience: { min: 0, max: 2 },
      salaryMultiplier: 1.0,
      keyResponsibilities: ["Write code", "Fix bugs", "Learn best practices"]
    },
    {
      level: "mid",
      typicalTitles: ["Software Engineer", "Software Engineer II", "Developer"],
      yearsExperience: { min: 2, max: 5 },
      salaryMultiplier: 1.3,
      keyResponsibilities: ["Own features", "Code reviews", "Mentor juniors"]
    },
    {
      level: "senior",
      typicalTitles: ["Senior Software Engineer", "Senior Developer", "Software Engineer III"],
      yearsExperience: { min: 5, max: 8 },
      salaryMultiplier: 1.7,
      keyResponsibilities: ["System design", "Technical leadership", "Cross-team collaboration"]
    },
    {
      level: "lead",
      typicalTitles: ["Staff Engineer", "Principal Engineer", "Tech Lead"],
      yearsExperience: { min: 8, max: 12 },
      salaryMultiplier: 2.2,
      keyResponsibilities: ["Architecture", "Technical strategy", "Mentorship at scale"]
    },
    {
      level: "director",
      typicalTitles: ["Engineering Manager", "Director of Engineering", "Senior Staff Engineer"],
      yearsExperience: { min: 10, max: 15 },
      salaryMultiplier: 2.8,
      keyResponsibilities: ["Team management", "Roadmap planning", "Hiring"]
    },
    {
      level: "vp",
      typicalTitles: ["VP of Engineering", "Head of Engineering", "Distinguished Engineer"],
      yearsExperience: { min: 12, max: 20 },
      salaryMultiplier: 3.5,
      keyResponsibilities: ["Org strategy", "Budget", "Executive decisions"]
    },
    {
      level: "c-level",
      typicalTitles: ["CTO", "Chief Architect", "VP of Product Engineering"],
      yearsExperience: { min: 15, max: 30 },
      salaryMultiplier: 5.0,
      keyResponsibilities: ["Company vision", "Tech strategy", "Board-level decisions"]
    }
  ],
  "product_management": [
    {
      level: "junior",
      typicalTitles: ["Associate Product Manager", "Junior PM"],
      yearsExperience: { min: 0, max: 2 },
      salaryMultiplier: 1.0,
      keyResponsibilities: ["User research", "Feature specs", "Stakeholder communication"]
    },
    {
      level: "mid",
      typicalTitles: ["Product Manager", "PM"],
      yearsExperience: { min: 2, max: 5 },
      salaryMultiplier: 1.4,
      keyResponsibilities: ["Product roadmap", "Feature prioritization", "Metrics ownership"]
    },
    {
      level: "senior",
      typicalTitles: ["Senior Product Manager", "Senior PM"],
      yearsExperience: { min: 5, max: 8 },
      salaryMultiplier: 1.8,
      keyResponsibilities: ["Product strategy", "Cross-functional leadership", "Launch major features"]
    },
    {
      level: "lead",
      typicalTitles: ["Lead Product Manager", "Principal PM", "Group PM"],
      yearsExperience: { min: 8, max: 12 },
      salaryMultiplier: 2.3,
      keyResponsibilities: ["Multi-product strategy", "Team mentorship", "Business impact"]
    },
    {
      level: "director",
      typicalTitles: ["Director of Product", "Head of Product"],
      yearsExperience: { min: 10, max: 15 },
      salaryMultiplier: 3.0,
      keyResponsibilities: ["Product org management", "Vision", "Hiring"]
    },
    {
      level: "vp",
      typicalTitles: ["VP of Product", "Chief Product Officer"],
      yearsExperience: { min: 12, max: 20 },
      salaryMultiplier: 4.0,
      keyResponsibilities: ["Company product strategy", "P&L ownership", "Executive team"]
    }
  ],
  "data_science": [
    {
      level: "junior",
      typicalTitles: ["Data Analyst", "Junior Data Scientist"],
      yearsExperience: { min: 0, max: 2 },
      salaryMultiplier: 1.0,
      keyResponsibilities: ["Data cleaning", "Basic analysis", "Visualization"]
    },
    {
      level: "mid",
      typicalTitles: ["Data Scientist", "ML Engineer"],
      yearsExperience: { min: 2, max: 5 },
      salaryMultiplier: 1.4,
      keyResponsibilities: ["Build models", "Feature engineering", "Model deployment"]
    },
    {
      level: "senior",
      typicalTitles: ["Senior Data Scientist", "Senior ML Engineer"],
      yearsExperience: { min: 5, max: 8 },
      salaryMultiplier: 1.9,
      keyResponsibilities: ["Complex modeling", "ML infrastructure", "Research"]
    },
    {
      level: "lead",
      typicalTitles: ["Staff Data Scientist", "Principal ML Engineer", "Research Scientist"],
      yearsExperience: { min: 8, max: 12 },
      salaryMultiplier: 2.5,
      keyResponsibilities: ["ML strategy", "Novel algorithms", "Thought leadership"]
    },
    {
      level: "director",
      typicalTitles: ["Director of Data Science", "Head of ML"],
      yearsExperience: { min: 10, max: 15 },
      salaryMultiplier: 3.2,
      keyResponsibilities: ["Team management", "ML roadmap", "Cross-org impact"]
    }
  ]
};

/**
 * Identify current level on career ladder
 */
export function identifyCurrentLevel(state: CareerState): {
  ladder: string;
  currentLevel: string;
  currentLevelIndex: number;
  nextLevelIndex: number;
} {
  // Determine career ladder based on role
  let ladder = "software_engineering"; // Default

  const roleLower = state.currentRole.toLowerCase();
  if (roleLower.includes("product") || roleLower.includes("pm")) {
    ladder = "product_management";
  } else if (roleLower.includes("data") || roleLower.includes("ml") || roleLower.includes("scientist")) {
    ladder = "data_science";
  }

  const careerLadder = CAREER_LADDERS[ladder];

  // Find current level based on experience and title
  let currentLevelIndex = 0;

  for (let i = 0; i < careerLadder.length; i++) {
    const level = careerLadder[i];

    // Check if title matches
    const titleMatch = level.typicalTitles.some(title =>
      roleLower.includes(title.toLowerCase()) || title.toLowerCase().includes(roleLower)
    );

    // Check if experience fits
    const experienceMatch = state.totalYearsExperience >= level.yearsExperience.min &&
                           state.totalYearsExperience <= level.yearsExperience.max;

    if (titleMatch || experienceMatch) {
      currentLevelIndex = i;
      break;
    }
  }

  const currentLevel = careerLadder[currentLevelIndex];
  const nextLevelIndex = Math.min(currentLevelIndex + 1, careerLadder.length - 1);

  return {
    ladder,
    currentLevel: currentLevel.level,
    currentLevelIndex,
    nextLevelIndex
  };
}

/**
 * Predict next role
 */
export function predictNextRole(state: CareerState): NextRolePrediction[] {
  const { ladder, currentLevelIndex, nextLevelIndex } = identifyCurrentLevel(state);
  const careerLadder = CAREER_LADDERS[ladder];
  const nextLevel = careerLadder[nextLevelIndex];
  const currentLevel = careerLadder[currentLevelIndex];

  const predictions: NextRolePrediction[] = [];

  // 1. Vertical progression (promotion)
  if (nextLevelIndex > currentLevelIndex) {
    const timeInLevel = state.totalYearsExperience - currentLevel.yearsExperience.min;
    const typicalTimeToNext = currentLevel.yearsExperience.max - currentLevel.yearsExperience.min;

    // Calculate probability based on time in level
    let probability = Math.min(90, (timeInLevel / typicalTimeToNext) * 100);

    // Adjust based on achievements
    if (state.achievements.length >= 5) probability += 10;
    else if (state.achievements.length >= 3) probability += 5;

    // Adjust based on company size (faster progression in smaller companies)
    const sizeMultiplier = {
      startup: 1.2,
      small: 1.1,
      medium: 1.0,
      large: 0.9,
      enterprise: 0.8
    };
    probability *= sizeMultiplier[state.companySize];

    probability = Math.min(95, Math.max(5, probability));

    // Determine timeframe
    let timeframe = "";
    if (timeInLevel >= typicalTimeToNext) {
      timeframe = "Ready now - 6 months";
    } else if (timeInLevel >= typicalTimeToNext * 0.7) {
      timeframe = "6-12 months";
    } else {
      timeframe = "1-2 years";
    }

    // Required skills for next level
    const baseSkillsNeeded = {
      "mid": ["code review", "mentoring", "system design basics"],
      "senior": ["system architecture", "technical leadership", "cross-team collaboration"],
      "lead": ["org-wide impact", "technical strategy", "executive communication"],
      "director": ["people management", "hiring", "roadmap planning"],
      "vp": ["org strategy", "budget management", "executive presence"],
      "c-level": ["company vision", "board communication", "M&A experience"]
    };

    const requiredSkills = baseSkillsNeeded[nextLevel.level as keyof typeof baseSkillsNeeded] || [];
    const skillsYouHave = requiredSkills.filter(skill =>
      state.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    );
    const skillGaps = requiredSkills.filter(skill => !skillsYouHave.includes(skill));

    const baseSalary = state.currentSalary;
    const salaryRange = {
      min: Math.round(baseSalary * nextLevel.salaryMultiplier * 0.9),
      max: Math.round(baseSalary * nextLevel.salaryMultiplier * 1.15)
    };

    predictions.push({
      title: nextLevel.typicalTitles[0],
      timeframe,
      probability: Math.round(probability),
      salaryRange,
      requiredSkills,
      skillsYouHave,
      skillGaps,
      estimatedLearningTime: skillGaps.length * 60, // 60 hours per skill
      reasoningFactors: [
        `${timeInLevel.toFixed(1)} years in current level`,
        `${state.achievements.length} notable achievements`,
        `${skillsYouHave.length}/${requiredSkills.length} required skills`,
        `${state.companySize} company promotion pace`
      ],
      preparation: [
        `Master ${skillGaps.slice(0, 2).join(" and ")}`,
        `Lead ${nextLevel.level === "senior" ? "1-2" : "2-3"} major projects`,
        `Demonstrate ${nextLevel.keyResponsibilities[0].toLowerCase()}`,
        "Build visibility with leadership"
      ]
    });
  }

  // 2. Lateral move (same level, different company/role)
  const lateralRoles = currentLevel.typicalTitles.filter(title => title !== state.currentRole);
  if (lateralRoles.length > 0) {
    predictions.push({
      title: lateralRoles[0],
      timeframe: "Anytime",
      probability: 75,
      salaryRange: {
        min: Math.round(state.currentSalary * 1.1),
        max: Math.round(state.currentSalary * 1.3)
      },
      requiredSkills: [],
      skillsYouHave: state.skills.slice(0, 5),
      skillGaps: [],
      estimatedLearningTime: 0,
      reasoningFactors: [
        "Similar role in different context",
        "Can leverage existing experience",
        "Market demand for your level"
      ],
      preparation: [
        "Update resume with recent achievements",
        "Network with target companies",
        "Research industry trends"
      ]
    });
  }

  // 3. Specialized track (e.g., IC to management or vice versa)
  if (currentLevelIndex >= 2) { // Mid-level or above
    const isCurrentlyIC = !state.currentRole.toLowerCase().includes("manager");

    if (isCurrentlyIC) {
      // IC → Management track
      predictions.push({
        title: "Engineering Manager",
        timeframe: "1-2 years",
        probability: 60,
        salaryRange: {
          min: Math.round(state.currentSalary * 1.2),
          max: Math.round(state.currentSalary * 1.5)
        },
        requiredSkills: ["people management", "1:1s", "hiring", "performance reviews"],
        skillsYouHave: state.skills.filter(s =>
          s.toLowerCase().includes("mentor") || s.toLowerCase().includes("lead")
        ),
        skillGaps: ["people management", "hiring", "performance reviews"],
        estimatedLearningTime: 200,
        reasoningFactors: [
          "Natural progression for senior ICs",
          "Leadership experience through mentoring",
          "Interest in people development"
        ],
        preparation: [
          "Mentor 2-3 junior engineers",
          "Lead a small team on a project",
          "Take management training courses",
          "Shadow current managers"
        ]
      });
    } else {
      // Management → IC track
      predictions.push({
        title: "Staff Engineer",
        timeframe: "1-2 years",
        probability: 50,
        salaryRange: {
          min: Math.round(state.currentSalary * 0.95),
          max: Math.round(state.currentSalary * 1.2)
        },
        requiredSkills: ["deep technical expertise", "system design", "technical writing"],
        skillsYouHave: [],
        skillGaps: ["hands-on coding", "technical depth", "architecture design"],
        estimatedLearningTime: 400,
        reasoningFactors: [
          "Return to individual contributor track",
          "Requires rebuilding technical skills",
          "Less common transition"
        ],
        preparation: [
          "Contribute to codebase regularly",
          "Lead technical design reviews",
          "Write technical RFCs",
          "Mentor on technical topics"
        ]
      });
    }
  }

  // Sort by probability
  return predictions.sort((a, b) => b.probability - a.probability);
}

/**
 * Project long-term career path (5-10 years)
 */
export function projectLongTermPath(state: CareerState): CareerTrajectory["longTermPath"] {
  const { ladder, currentLevelIndex } = identifyCurrentLevel(state);
  const careerLadder = CAREER_LADDERS[ladder];

  const path: CareerTrajectory["longTermPath"] = [];
  let currentYear = 0;
  let currentSalary = state.currentSalary;

  // Project next 3-4 levels
  for (let i = currentLevelIndex + 1; i < Math.min(currentLevelIndex + 4, careerLadder.length); i++) {
    const level = careerLadder[i];
    const previousLevel = careerLadder[i - 1];

    // Estimate years to reach this level
    const yearsToLevel = Math.ceil((level.yearsExperience.min + level.yearsExperience.max) / 2) -
                        Math.ceil((previousLevel.yearsExperience.min + previousLevel.yearsExperience.max) / 2);
    currentYear += yearsToLevel;

    // Project salary
    currentSalary *= level.salaryMultiplier / previousLevel.salaryMultiplier;

    path.push({
      role: level.typicalTitles[0],
      level: level.level,
      timeframe: currentYear <= 2 ? `${currentYear} years` : `${currentYear} years`,
      salaryRange: {
        min: Math.round(currentSalary * 0.9),
        max: Math.round(currentSalary * 1.2)
      },
      keyMilestones: [
        ...level.keyResponsibilities.slice(0, 2),
        `Lead ${level.level === "lead" ? "multiple" : "large"} teams/projects`,
        `Impact ${level.level === "director" ? "organization" : level.level === "vp" ? "company" : "team"} strategy`
      ]
    });
  }

  return path;
}

/**
 * Project salary growth
 */
export function projectSalary(
  state: CareerState,
  years: number = 10
): CareerTrajectory["salaryProjection"] {
  const projection: CareerTrajectory["salaryProjection"] = [];
  const { ladder, currentLevelIndex } = identifyCurrentLevel(state);
  const careerLadder = CAREER_LADDERS[ladder];

  let currentSalary = state.currentSalary;
  let currentLevel = currentLevelIndex;

  for (let year = 1; year <= years; year++) {
    // Annual raise (3-5%)
    const annualRaise = currentSalary * 0.04;
    currentSalary += annualRaise;

    // Check if promotion year
    const yearsInCurrentLevel = (state.totalYearsExperience + year) -
      careerLadder[currentLevel].yearsExperience.min;

    const typicalTimeToNext = careerLadder[currentLevel].yearsExperience.max -
      careerLadder[currentLevel].yearsExperience.min;

    if (yearsInCurrentLevel >= typicalTimeToNext && currentLevel < careerLadder.length - 1) {
      // Promotion bump (15-30%)
      const nextLevel = careerLadder[currentLevel + 1];
      const promotionMultiplier = nextLevel.salaryMultiplier / careerLadder[currentLevel].salaryMultiplier;
      currentSalary *= promotionMultiplier;
      currentLevel++;
    }

    // Calculate conservative, expected, and optimistic
    projection.push({
      year,
      conservativeEstimate: Math.round(currentSalary * 0.85),  // 15% lower
      expectedEstimate: Math.round(currentSalary),
      optimisticEstimate: Math.round(currentSalary * 1.25)     // 25% higher
    });
  }

  return projection;
}

/**
 * MAIN FUNCTION: Predict full career trajectory
 */
export function predictCareerTrajectory(state: CareerState): CareerTrajectory {
  const { currentLevel } = identifyCurrentLevel(state);
  const nextRoles = predictNextRole(state);
  const longTermPath = projectLongTermPath(state);
  const salaryProjection = projectSalary(state, 10);

  // Skill development plan
  const immediateSkills: Set<string> = new Set();
  const shortTermSkills: Set<string> = new Set();
  const longTermSkills: Set<string> = new Set();

  // From next role predictions
  if (nextRoles[0]) {
    nextRoles[0].skillGaps.forEach(skill => immediateSkills.add(skill));
  }
  if (nextRoles[1]) {
    nextRoles[1].skillGaps.forEach(skill => shortTermSkills.add(skill));
  }
  if (nextRoles[2]) {
    nextRoles[2].skillGaps.forEach(skill => longTermSkills.add(skill));
  }

  const skillDevelopmentPlan: CareerTrajectory["skillDevelopmentPlan"] = [
    ...Array.from(immediateSkills).map(skill => ({
      skill,
      priority: "immediate" as const,
      reason: "Required for next promotion",
      estimatedTime: 60
    })),
    ...Array.from(shortTermSkills).map(skill => ({
      skill,
      priority: "short-term" as const,
      reason: "Valuable for career optionality",
      estimatedTime: 80
    })),
    ...Array.from(longTermSkills).map(skill => ({
      skill,
      priority: "long-term" as const,
      reason: "Strategic for senior roles",
      estimatedTime: 100
    }))
  ];

  // Alternative career paths
  const alternativePaths: CareerTrajectory["alternativePaths"] = [];

  // Entrepreneurship
  if (state.totalYearsExperience >= 5) {
    alternativePaths.push({
      pathName: "Entrepreneurship",
      description: "Start your own company or join an early-stage startup",
      viability: state.companySize === "startup" ? 75 : 50,
      requiredTransition: "Build side project, validate idea, secure funding or join as founding team member"
    });
  }

  // Consulting
  if (state.totalYearsExperience >= 8) {
    alternativePaths.push({
      pathName: "Independent Consulting",
      description: "Leverage expertise as independent consultant or contractor",
      viability: 70,
      requiredTransition: "Build personal brand, establish client network, create service offerings"
    });
  }

  // Industry switch
  const highGrowthIndustries = ["AI/ML", "Cryptocurrency", "Clean Energy", "Healthcare Tech"];
  const currentInHighGrowth = highGrowthIndustries.some(ind =>
    state.industry.toLowerCase().includes(ind.toLowerCase())
  );

  if (!currentInHighGrowth) {
    alternativePaths.push({
      pathName: "High-Growth Industry Switch",
      description: `Transition to ${highGrowthIndustries[0]} or similar high-growth sector`,
      viability: 65,
      requiredTransition: "Learn industry-specific skills, network in target industry, emphasize transferable experience"
    });
  }

  // Recommendations
  const recommendations: string[] = [];

  if (nextRoles[0]?.probability >= 70) {
    recommendations.push(`You're on track for ${nextRoles[0].title} within ${nextRoles[0].timeframe}. Focus on ${nextRoles[0].preparation[0]}.`);
  } else if (nextRoles[0]) {
    recommendations.push(`To reach ${nextRoles[0].title}, prioritize: ${nextRoles[0].skillGaps.slice(0, 2).join(", ")}`);
  }

  if (state.yearsInRole >= 3) {
    recommendations.push("You've been in current role for 3+ years - consider discussing promotion or exploring new opportunities.");
  }

  if (immediateSkills.size > 0) {
    recommendations.push(`Immediate focus: Learn ${Array.from(immediateSkills).slice(0, 2).join(" and ")} to accelerate career growth.`);
  }

  const currentYearProjection = salaryProjection[4]; // 5 years out
  if (currentYearProjection) {
    recommendations.push(`5-year salary projection: $${(currentYearProjection.conservativeEstimate / 1000).toFixed(0)}K - $${(currentYearProjection.optimisticEstimate / 1000).toFixed(0)}K`);
  }

  if (alternativePaths.some(p => p.viability >= 70)) {
    recommendations.push("Consider alternative paths like entrepreneurship or consulting given your experience level.");
  }

  return {
    currentState: {
      role: state.currentRole,
      level: currentLevel,
      salary: state.currentSalary,
      yearsExperience: state.totalYearsExperience
    },
    nextRoles,
    longTermPath,
    salaryProjection: salaryProjection.filter(p => p.year <= 10),
    skillDevelopmentPlan: skillDevelopmentPlan.slice(0, 10), // Top 10 skills
    alternativePaths,
    recommendations
  };
}

/**
 * Compare multiple career paths
 */
export function compareCareerPaths(
  currentState: CareerState,
  paths: Array<{ name: string; targetRole: string }>
): Array<{
  pathName: string;
  targetRole: string;
  timeToAchieve: string;
  salaryPotential: { min: number; max: number };
  difficulty: "easy" | "medium" | "hard";
  skillGaps: string[];
  pros: string[];
  cons: string[];
  overallScore: number;
}> {
  return paths.map(path => {
    // Mock analysis - in production would do detailed analysis
    const difficulty: "easy" | "medium" | "hard" =
      path.targetRole.includes("Senior") ? "medium" :
      path.targetRole.includes("Lead") || path.targetRole.includes("Principal") ? "hard" : "easy";

    const timeToAchieve = difficulty === "easy" ? "6-12 months" :
                          difficulty === "medium" ? "1-2 years" : "2-4 years";

    const salaryIncrease = difficulty === "easy" ? 1.15 :
                          difficulty === "medium" ? 1.4 : 1.8;

    return {
      pathName: path.name,
      targetRole: path.targetRole,
      timeToAchieve,
      salaryPotential: {
        min: Math.round(currentState.currentSalary * salaryIncrease * 0.9),
        max: Math.round(currentState.currentSalary * salaryIncrease * 1.2)
      },
      difficulty,
      skillGaps: [],
      pros: [`Higher salary potential`, `Clear career progression`],
      cons: [`Requires ${difficulty === "hard" ? "significant" : "some"} skill development`],
      overallScore: difficulty === "easy" ? 85 : difficulty === "medium" ? 75 : 60
    };
  });
}
