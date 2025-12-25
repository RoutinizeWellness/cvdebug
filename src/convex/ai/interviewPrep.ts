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

      return {
        questions: parsed.questions || [],
        storyPrompts: parsed.storyPrompts || [],
        weaknessFraming: parsed.weaknessFraming || [],
        closingQuestions: parsed.closingQuestions || [],
        interrogation: parsed.interrogation || []
      };
    } catch (error) {
      console.error("Interview prep generation failed:", error);
      throw new Error("Failed to generate interview prep guide");
    }
  },
});