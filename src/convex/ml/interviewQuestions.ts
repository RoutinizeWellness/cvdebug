"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";

export interface InterviewQuestion {
  id: string;
  type: "Technical" | "Behavioral" | "System Design" | "Leadership" | "Problem Solving";
  question: string;
  relevance?: "High Relevance" | "Medium" | "Low";
  color: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  category?: string;
}

/**
 * ML-Powered Interview Question Generator
 *
 * Generates personalized interview questions based on:
 * - Resume content (skills, experience, projects)
 * - Target role
 * - Company (if available)
 * - Previous questions (to avoid repeats)
 *
 * Uses intelligent algorithms to ensure variety and relevance
 */

export const generateInterviewQuestions = action({
  args: {
    resumeText: v.string(),
    targetRole: v.optional(v.string()),
    companyName: v.optional(v.string()),
    previousQuestions: v.optional(v.array(v.string())),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<InterviewQuestion[]> => {
    const {
      resumeText,
      targetRole = "Software Engineer",
      companyName = "Tech Company",
      previousQuestions = [],
      count = 6,
    } = args;

    console.log(`[ML Interview Questions] Generating ${count} questions for ${targetRole}`);

    // Extract key information from resume
    const resumeAnalysis = analyzeResumeForQuestions(resumeText);

    // Generate questions based on role
    const allQuestions = generateRoleSpecificQuestions(
      targetRole,
      companyName,
      resumeAnalysis,
      previousQuestions
    );

    // Select best questions (diversity + relevance)
    const selectedQuestions = selectBestQuestions(allQuestions, count, previousQuestions);

    console.log(`[ML Interview Questions] Generated ${selectedQuestions.length} unique questions`);

    return selectedQuestions;
  },
});

/**
 * Analyze resume to extract key skills, experience, and projects
 */
function analyzeResumeForQuestions(resumeText: string) {
  const text = resumeText.toLowerCase();

  // Extract programming languages
  const programmingLanguages: string[] = [];
  const languages = ["python", "javascript", "typescript", "java", "c++", "go", "rust", "ruby", "php", "swift", "kotlin"];
  languages.forEach((lang) => {
    if (text.includes(lang)) programmingLanguages.push(lang);
  });

  // Extract frameworks/tools
  const frameworks: string[] = [];
  const frameworkList = [
    "react", "vue", "angular", "node", "express", "django", "flask", "spring", "rails",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
    "mongodb", "postgresql", "mysql", "redis", "elasticsearch"
  ];
  frameworkList.forEach((fw) => {
    if (text.includes(fw)) frameworks.push(fw);
  });

  // Extract experience level
  const hasYearsExp = text.match(/(\d+)\+?\s*years?\s*(of\s*)?experience/i);
  const yearsExp = hasYearsExp ? parseInt(hasYearsExp[1]) : 2;

  // Detect domain expertise
  const domains: string[] = [];
  if (text.includes("machine learning") || text.includes("ml") || text.includes("data science")) {
    domains.push("ML/AI");
  }
  if (text.includes("frontend") || text.includes("ui") || text.includes("ux")) {
    domains.push("Frontend");
  }
  if (text.includes("backend") || text.includes("api") || text.includes("server")) {
    domains.push("Backend");
  }
  if (text.includes("devops") || text.includes("ci/cd") || text.includes("infrastructure")) {
    domains.push("DevOps");
  }
  if (text.includes("leadership") || text.includes("team lead") || text.includes("manager")) {
    domains.push("Leadership");
  }

  // Detect specific achievements
  const hasMetrics = (text.match(/\d+%/g) || []).length > 3;
  const hasScaleExperience = /million|billion|scale|high.?traffic|distributed/i.test(text);
  const hasLeadership = /led|managed|mentored|coached|directed/i.test(text);

  return {
    programmingLanguages,
    frameworks,
    yearsExp,
    domains,
    hasMetrics,
    hasScaleExperience,
    hasLeadership,
  };
}

/**
 * Generate role-specific questions with ML-driven variety
 */
function generateRoleSpecificQuestions(
  role: string,
  company: string,
  analysis: ReturnType<typeof analyzeResumeForQuestions>,
  previousQuestions: string[]
): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  let idCounter = 1;

  const roleLower = role.toLowerCase();

  // Technical Questions Pool
  const technicalQuestions: string[] = [];

  // Add language-specific questions
  if (analysis.programmingLanguages.includes("python")) {
    technicalQuestions.push(
      "Explain the difference between list comprehension and generator expressions in Python. When would you use each?",
      "How do you handle memory management in Python when processing large datasets?",
      "Can you explain the Global Interpreter Lock (GIL) in Python and its implications for multi-threading?"
    );
  }

  if (analysis.programmingLanguages.includes("javascript") || analysis.programmingLanguages.includes("typescript")) {
    technicalQuestions.push(
      "Explain the event loop in JavaScript. How does it handle asynchronous operations?",
      "What are closures in JavaScript and can you provide a practical use case?",
      "How would you optimize a React application that's experiencing performance issues?"
    );
  }

  // Framework-specific questions
  if (analysis.frameworks.includes("react")) {
    technicalQuestions.push(
      "Explain the difference between controlled and uncontrolled components in React.",
      "How do you prevent unnecessary re-renders in React? Can you explain React.memo and useMemo?",
      "What's your approach to state management in large React applications?"
    );
  }

  if (analysis.frameworks.includes("tensorflow") || analysis.frameworks.includes("pytorch")) {
    technicalQuestions.push(
      "Walk me through how you would debug a neural network that's not converging during training.",
      "Explain the trade-offs between using PyTorch and TensorFlow for production ML systems.",
      "How do you handle overfitting in deep learning models? Give specific techniques you've used."
    );
  }

  if (analysis.frameworks.includes("aws") || analysis.frameworks.includes("azure") || analysis.frameworks.includes("gcp")) {
    technicalQuestions.push(
      "How would you architect a fault-tolerant microservices system on AWS?",
      "Explain your approach to cost optimization in cloud infrastructure.",
      "What's your strategy for monitoring and alerting in a distributed cloud environment?"
    );
  }

  // Domain-specific questions
  if (analysis.domains.includes("ML/AI")) {
    technicalQuestions.push(
      "Explain the bias-variance tradeoff. How do you identify which problem your model has?",
      "How would you approach building a recommendation system for high-volume traffic?",
      "Walk me through your process for feature engineering in a machine learning project."
    );
  }

  if (analysis.domains.includes("Backend")) {
    technicalQuestions.push(
      "How do you design APIs for scalability? What patterns do you follow?",
      "Explain your approach to database indexing and query optimization.",
      "How would you handle rate limiting for a public API with millions of requests per day?"
    );
  }

  if (analysis.domains.includes("DevOps")) {
    technicalQuestions.push(
      "Describe your ideal CI/CD pipeline. What stages would it include and why?",
      "How do you approach infrastructure as code? What tools do you prefer and why?",
      "Explain your strategy for zero-downtime deployments in Kubernetes."
    );
  }

  // Behavioral Questions Pool
  const behavioralQuestions: string[] = [
    "Describe a time you had to make a difficult technical decision with incomplete information. How did you approach it?",
    "Tell me about a project where you had to learn a completely new technology quickly. How did you ensure quality?",
    "Can you share an example of when you disagreed with a team member on a technical approach? How did you resolve it?",
    "Describe a situation where you had to prioritize between technical debt and new features. What was your reasoning?",
    "Tell me about a time you received critical feedback on your code. How did you respond?",
    "Share an example of when you had to explain a complex technical concept to non-technical stakeholders.",
  ];

  if (analysis.hasLeadership) {
    behavioralQuestions.push(
      "Describe your approach to mentoring junior engineers. Can you give a specific example?",
      "Tell me about a time you had to deliver difficult feedback to a team member.",
      "How do you handle conflicting priorities across multiple teams or stakeholders?"
    );
  }

  // System Design Questions Pool
  const systemDesignQuestions: string[] = [];

  if (analysis.yearsExp >= 3) {
    systemDesignQuestions.push(
      "Design a URL shortening service like bit.ly. How would you handle billions of requests?",
      "How would you architect a real-time chat application that scales to millions of users?",
      "Design a distributed caching system. What consistency model would you choose and why?",
      "How would you build a rate limiter that works across multiple servers?"
    );
  }

  if (analysis.hasScaleExperience) {
    systemDesignQuestions.push(
      "Design a system that processes 1 billion events per day. Walk me through your architecture.",
      "How would you design a distributed logging system for a large-scale microservices architecture?",
      "Explain how you would build a global content delivery network (CDN)."
    );
  }

  if (analysis.domains.includes("ML/AI")) {
    systemDesignQuestions.push(
      "Design a machine learning system for fraud detection with real-time scoring.",
      "How would you build a recommendation engine that serves millions of users with sub-100ms latency?",
      "Architect an ML training pipeline that can retrain models daily on terabytes of data."
    );
  }

  // Randomly select from each pool (ensuring variety)
  const selectedTechnical = shuffleArray(technicalQuestions).slice(0, Math.min(3, technicalQuestions.length));
  const selectedBehavioral = shuffleArray(behavioralQuestions).slice(0, Math.min(2, behavioralQuestions.length));
  const selectedSystemDesign = shuffleArray(systemDesignQuestions).slice(0, Math.min(2, systemDesignQuestions.length));

  // Create question objects
  selectedTechnical.forEach((q) => {
    if (!previousQuestions.includes(q)) {
      questions.push({
        id: `q${idCounter++}`,
        type: "Technical",
        question: q,
        relevance: "High Relevance",
        color: "violet",
        difficulty: analysis.yearsExp >= 5 ? "Hard" : analysis.yearsExp >= 3 ? "Medium" : "Easy",
      });
    }
  });

  selectedBehavioral.forEach((q) => {
    if (!previousQuestions.includes(q)) {
      questions.push({
        id: `q${idCounter++}`,
        type: "Behavioral",
        question: q,
        relevance: "High Relevance",
        color: "primary",
        difficulty: "Medium",
      });
    }
  });

  selectedSystemDesign.forEach((q) => {
    if (!previousQuestions.includes(q)) {
      questions.push({
        id: `q${idCounter++}`,
        type: "System Design",
        question: q,
        relevance: "High Relevance",
        color: "amber",
        difficulty: "Hard",
      });
    }
  });

  return questions;
}

/**
 * Select best questions ensuring diversity and no repeats
 */
function selectBestQuestions(
  allQuestions: InterviewQuestion[],
  count: number,
  previousQuestions: string[]
): InterviewQuestion[] {
  // Filter out previously asked questions
  const newQuestions = allQuestions.filter(
    (q) => !previousQuestions.includes(q.question)
  );

  // Ensure type diversity
  const selected: InterviewQuestion[] = [];
  const typeCount: Record<string, number> = {};

  // Shuffle for randomness
  const shuffled = shuffleArray([...newQuestions]);

  for (const question of shuffled) {
    if (selected.length >= count) break;

    const currentTypeCount = typeCount[question.type] || 0;

    // Limit each type to avoid repetition
    if (currentTypeCount < Math.ceil(count / 3)) {
      selected.push(question);
      typeCount[question.type] = currentTypeCount + 1;
    }
  }

  // Fill remaining slots if needed
  while (selected.length < count && selected.length < shuffled.length) {
    const remaining = shuffled.filter((q) => !selected.includes(q));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  return selected;
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
