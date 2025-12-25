"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { callOpenRouter } from "./apiClient";

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
        throw new Error("OPENROUTER_API_KEY not configured");
      }

      const response = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }]
      });

      // callOpenRouter returns a string, so we need to parse it
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      // Validate response has content
      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error("Empty or invalid AI response");
      }

      return {
        questions: parsed.questions || [],
        storyPrompts: parsed.storyPrompts || [],
        weaknessFraming: parsed.weaknessFraming || [],
        closingQuestions: parsed.closingQuestions || [],
        interrogation: parsed.interrogation || []
      };
    } catch (error) {
      console.error("Interview prep generation failed:", error);
      
      // Fallback Algorithm: Return high-quality static content so the user never sees a blank state
      const fallbackQuestions = [
        { 
          question: `What specifically interests you about the ${args.jobTitle} role at ${args.company}?`, 
          tip: "Connect your personal career goals and values with the company's mission. Be specific about why this company." 
        },
        { 
          question: "Can you walk me through a complex project where you had to overcome significant technical challenges?", 
          tip: "Use the STAR method (Situation, Task, Action, Result). Focus 70% of your answer on the 'Action' you took." 
        },
        { 
          question: "Describe a time you had a conflict with a stakeholder or team member. How did you resolve it?", 
          tip: "Focus on your emotional intelligence, communication skills, and ability to find common ground." 
        },
        { 
          question: "How do you prioritize your work when you have multiple conflicting deadlines?", 
          tip: "Discuss your framework for decision making (e.g., impact vs. urgency) and how you communicate with stakeholders." 
        },
        { 
          question: "What is your greatest professional weakness, and how are you managing it?", 
          tip: "Choose a real weakness, but focus on the systems and habits you've built to overcome it." 
        }
      ];

      const fallbackStories = [
        "Prepare a story about a time you improved a process or system efficiency.",
        "Prepare a story about a time you mentored a junior team member or shared knowledge.",
        "Prepare a story about a mistake you made, what you learned, and how you fixed it.",
        "Prepare a story about delivering a project under high pressure or tight constraints."
      ];

      const fallbackWeaknesses = [
        "Frame 'perfectionism' as 'attention to detail' but mention you balance it with strict deadlines.",
        "Frame 'lack of specific tool experience' by highlighting your ability to learn new technologies quickly.",
        "Frame 'taking on too much' as 'enthusiasm' but explain how you are learning to delegate better."
      ];

      const fallbackClosing = [
        "What are the most immediate challenges the person in this role will need to tackle in the first 90 days?",
        "How does the team collaborate and share knowledge?",
        "What does success look like for this team over the next year?",
        "Can you tell me about the team culture and values?"
      ];

      // Generate interrogation questions from missing keywords if available
      const fallbackInterrogation = args.missingKeywords && args.missingKeywords.length > 0 
        ? args.missingKeywords.slice(0, 3).map(kw => ({
            question: `I noticed you don't have ${kw} listed on your resume. Can you explain your experience with it?`,
            context: `Missing Keyword: ${kw}`
          })) 
        : [
            { question: "What is your experience with the core technologies listed in the job description?", context: "General technical validation" },
            { question: "Why are you looking to leave your current role?", context: "Motivation check" }
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