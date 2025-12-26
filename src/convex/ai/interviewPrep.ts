"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { callOpenRouter, extractJSON } from "./apiClient";

export const generateInterviewPrep = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.string(),
    jobTitle: v.string(),
    company: v.string(),
    missingKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const missingKeywordsList = args.missingKeywords?.join(", ") || "None";
    
    const prompt = `You are a Principal Technical Recruiter preparing a candidate for an interview.

CANDIDATE RESUME:
${args.resumeText}

JOB POSTING:
Title: ${args.jobTitle}
Company: ${args.company}
Description: ${args.jobDescription}

MISSING KEYWORDS / WEAK SPOTS:
${missingKeywordsList}

Generate a comprehensive interview prep guide with:

1. EXPECTED QUESTIONS (5-7 questions):
   - Technical questions based on the job requirements
   - Behavioral questions relevant to the role
   - For each question, provide a strategic tip on how to answer

2. STAR STORY PROMPTS (4-5 prompts):
   - Situations from their resume they should prepare stories about
   - Focus on achievements that align with the job requirements

3. WEAKNESS FRAMING (3 examples):
   - How to frame potential weaknesses as growth opportunities
   - Based on gaps between their resume and job requirements

4. CLOSING QUESTIONS (4-5 questions):
   - Intelligent questions the candidate should ask the interviewer
   - Show genuine interest and strategic thinking

5. INTERROGATION MODE (3 questions):
   - Based on the MISSING KEYWORDS provided above.
   - Ask challenging, direct questions to test if they actually know these skills or why they are missing.
   - If they claim to know a related skill, press them on the specific missing one.
   - Example: "You list Kubernetes but missed 'Helm'. Explain how you manage package deployments."

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {"question": "...", "tip": "..."}
  ],
  "storyPrompts": ["..."],
  "weaknessFraming": ["..."],
  "closingQuestions": ["..."],
  "interrogation": [
    {"question": "...", "context": "..."}
  ]
}`;

    try {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        console.error("[Interview Prep] OPENROUTER_API_KEY not configured");
        throw new Error("OPENROUTER_API_KEY not configured");
      }

      console.log(`[Interview Prep] Generating prep for ${args.jobTitle} at ${args.company}`);

      const response = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }]
      });

      console.log(`[Interview Prep] Received response, length: ${response.length} chars`);
      console.log(`[Interview Prep] First 200 chars: ${response.substring(0, 200)}`);

      // Use the robust extractJSON utility instead of regex
      const parsed = extractJSON(response);

      if (!parsed) {
        console.error("[Interview Prep] Failed to extract JSON from response");
        console.error("[Interview Prep] Raw response:", response);
        throw new Error("Failed to parse AI response - no valid JSON found");
      }

      // Validate response has content
      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        console.error("[Interview Prep] Invalid response structure:", JSON.stringify(parsed));
        throw new Error("Empty or invalid AI response - missing questions array");
      }

      console.log(`[Interview Prep] Successfully parsed ${parsed.questions.length} questions`);

      return {
        questions: parsed.questions || [],
        storyPrompts: parsed.storyPrompts || [],
        weaknessFraming: parsed.weaknessFraming || [],
        closingQuestions: parsed.closingQuestions || [],
        interrogation: parsed.interrogation || []
      };
    } catch (error: any) {
      console.error("[Interview Prep] Generation failed:", error);
      console.error("[Interview Prep] Error details:", {
        message: error.message,
        stack: error.stack,
        jobTitle: args.jobTitle,
        company: args.company
      });
      
      // Enhanced fallback with multiple variations based on role type
      const isEngineeringRole = args.jobTitle.toLowerCase().includes('engineer') || 
                                args.jobTitle.toLowerCase().includes('developer') ||
                                args.jobTitle.toLowerCase().includes('software');
      
      const isManagementRole = args.jobTitle.toLowerCase().includes('manager') ||
                               args.jobTitle.toLowerCase().includes('director') ||
                               args.jobTitle.toLowerCase().includes('lead');
      
      const isDataRole = args.jobTitle.toLowerCase().includes('data') ||
                         args.jobTitle.toLowerCase().includes('analyst') ||
                         args.jobTitle.toLowerCase().includes('scientist');

      // Role-specific fallback questions
      let fallbackQuestions = [
        { 
          question: `What specifically interests you about the ${args.jobTitle} role at ${args.company}?`, 
          tip: "Connect your personal career goals and values with the company's mission. Research recent company news or projects and reference them. Be specific about why THIS company, not just any company." 
        },
        { 
          question: "Can you walk me through a complex project where you had to overcome significant technical challenges?", 
          tip: "Use the STAR method (Situation, Task, Action, Result). Focus 70% of your answer on the 'Action' you took. Include specific technologies, methodologies, and quantifiable results." 
        },
        { 
          question: "Describe a time you had a conflict with a stakeholder or team member. How did you resolve it?", 
          tip: "Focus on your emotional intelligence, communication skills, and ability to find common ground. Show that you can disagree professionally and work toward solutions." 
        },
        { 
          question: "How do you prioritize your work when you have multiple conflicting deadlines?", 
          tip: "Discuss your framework for decision making (e.g., impact vs. urgency matrix, stakeholder communication). Give a specific example with the outcome." 
        },
        { 
          question: "What is your greatest professional weakness, and how are you managing it?", 
          tip: "Choose a real weakness, but focus on the systems and habits you've built to overcome it. Show self-awareness and growth mindset. Avoid clichés like 'I'm a perfectionist.'" 
        }
      ];

      // Add role-specific questions
      if (isEngineeringRole) {
        fallbackQuestions.push(
          {
            question: "Describe your approach to code review and ensuring code quality in a team environment.",
            tip: "Discuss specific practices like automated testing, CI/CD, linting, and how you balance thoroughness with velocity. Mention how you give constructive feedback."
          },
          {
            question: "Tell me about a time you had to make a trade-off between technical debt and shipping a feature quickly.",
            tip: "Show business acumen by explaining how you evaluated the trade-off, communicated with stakeholders, and planned to address the debt later. Include the outcome."
          }
        );
      }

      if (isManagementRole) {
        fallbackQuestions.push(
          {
            question: "How do you handle underperformance on your team?",
            tip: "Describe your approach to feedback, coaching, and performance improvement plans. Show empathy while maintaining accountability. Give a specific example with positive outcome."
          },
          {
            question: "Describe your leadership style and how you adapt it to different team members.",
            tip: "Discuss situational leadership - how you adjust based on experience level, personality, and context. Give examples of coaching junior members vs. empowering senior members."
          }
        );
      }

      if (isDataRole) {
        fallbackQuestions.push(
          {
            question: "Walk me through how you would approach a new data analysis project from scratch.",
            tip: "Outline your process: understanding business requirements, data exploration, hypothesis formation, analysis methodology, validation, and communication of insights. Be methodical."
          },
          {
            question: "How do you ensure the accuracy and reliability of your data analysis?",
            tip: "Discuss data validation techniques, statistical methods, peer review, and how you communicate confidence levels and limitations in your findings."
          }
        );
      }

      // Role-specific story prompts
      let fallbackStories = [
        "Prepare a story about a time you improved a process or system efficiency with measurable results.",
        "Prepare a story about a time you mentored a junior team member or shared knowledge that had lasting impact.",
        "Prepare a story about a mistake you made, what you learned, and how you fixed it (show vulnerability and growth).",
        "Prepare a story about delivering a project under high pressure or tight constraints while maintaining quality."
      ];

      if (isEngineeringRole) {
        fallbackStories.push(
          "Prepare a story about debugging a critical production issue and how you prevented similar issues in the future.",
          "Prepare a story about refactoring or optimizing code that significantly improved performance or maintainability."
        );
      }

      if (isManagementRole) {
        fallbackStories.push(
          "Prepare a story about building or restructuring a team to improve performance and morale.",
          "Prepare a story about navigating organizational change and keeping your team motivated through uncertainty."
        );
      }

      if (isDataRole) {
        fallbackStories.push(
          "Prepare a story about uncovering a non-obvious insight from data that drove business decisions.",
          "Prepare a story about communicating complex technical findings to non-technical stakeholders."
        );
      }

      const fallbackWeaknesses = [
        "Frame 'perfectionism' as 'attention to detail' but mention you balance it with strict deadlines and MVP thinking to avoid over-engineering.",
        "Frame 'lack of specific tool experience' by highlighting your ability to learn new technologies quickly, giving examples of past rapid learning.",
        "Frame 'taking on too much' as 'enthusiasm and ownership' but explain how you're learning to delegate better and set boundaries.",
        "Frame 'impatience with slow progress' as 'results-driven' but mention you're working on appreciating process and building consensus.",
        "Frame 'difficulty saying no' as 'team player mentality' but explain you're developing better prioritization and communication skills."
      ];

      // Role-specific closing questions
      let fallbackClosing = [
        "What are the most immediate challenges the person in this role will need to tackle in the first 90 days?",
        "How does the team collaborate and share knowledge? What tools and processes do you use?",
        "What does success look like for this team over the next year? What are the key metrics or goals?",
        "Can you tell me about the team culture and values? How would you describe the work environment?"
      ];

      if (isEngineeringRole) {
        fallbackClosing.push(
          "What's the current tech stack and are there any planned migrations or major technical initiatives?",
          "How does the team balance new feature development with technical debt and maintenance?",
          "What does the code review and deployment process look like?"
        );
      }

      if (isManagementRole) {
        fallbackClosing.push(
          "What are the biggest challenges facing the team right now that you're hoping this role will help address?",
          "How does the company support professional development and growth for managers?",
          "What's your vision for this team over the next 2-3 years?"
        );
      }

      if (isDataRole) {
        fallbackClosing.push(
          "How does the data team collaborate with other departments? What's the stakeholder engagement model?",
          "What data infrastructure and tools does the team currently use?",
          "How are data insights typically communicated and actioned across the organization?"
        );
      }

      // Generate interrogation questions from missing keywords if available
      const fallbackInterrogation = args.missingKeywords && args.missingKeywords.length > 0 
        ? args.missingKeywords.slice(0, 3).map(kw => ({
            question: `I noticed you don't have ${kw} listed on your resume. Can you explain your experience with it, or how you would approach learning it quickly if hired?`,
            context: `Missing Keyword: ${kw}. This is a gap between your resume and the job requirements. Be honest but show willingness to learn.`
          })) 
        : [
            { 
              question: "What is your experience with the core technologies listed in the job description that aren't on your resume?", 
              context: "General technical validation. Be honest about gaps and emphasize your learning ability and related experience." 
            },
            { 
              question: "Why are you looking to leave your current role, and why now?", 
              context: "Motivation check. Focus on what you're moving toward (growth, new challenges) rather than what you're running from." 
            },
            {
              question: "This role requires [specific skill from job description]. Walk me through your experience with it.",
              context: "Depth check. If you lack direct experience, discuss related skills and how you'd bridge the gap quickly."
            }
          ];

      return {
        questions: fallbackQuestions,
        storyPrompts: fallbackStories,
        weaknessFraming: fallbackWeaknesses,
        closingQuestions: fallbackClosing,
        interrogation: fallbackInterrogation
      };
    }
  },
});