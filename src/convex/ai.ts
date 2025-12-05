"use node";

import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const analyzeResume = internalAction({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.log("No OPENROUTER_API_KEY set, skipping AI analysis");
      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
        id: args.id,
        title: "Resume",
        category: "Uncategorized",
        analysis: "AI not configured.",
        score: 0,
      });
      return;
    }

    try {
      const prompt = `You are an advanced ATS (Applicant Tracking System) Simulator (simulating systems like Taleo, Greenhouse, Lever).
      Your goal is to strictly evaluate the resume's machine-readability and content match against the target role.

      CONTEXT:
      - Job Description: "${args.jobDescription || "General Industry Standards for the detected role"}"
      - RAW PARSED TEXT (What the ATS sees):
      "${args.ocrText.substring(0, 30000)}"

      ### SCORING ALGORITHM (0-100):
      Be strict. Most resumes score between 40-70. Scores above 80 should be rare and require near-perfect optimization.

      1. **Parsing & Format (30%)**:
         - **CRITICAL**: Does the raw text look garbled? Are headers (Experience, Education) clearly identifiable?
         - Penalize for: Multi-column layouts (often parse poorly), graphics/icons (not visible in text), missing dates, or complex tables.
         - If the raw text is a wall of text without structure, score this < 50.

      2. **Keyword Matching (40%)**:
         - Extract hard skills from the JD (or imply them from the role).
         - Calculate a match rate. 
         - **Penalize** for "keyword stuffing" (listing skills without context).
         - Look for "contextual keywords" (e.g., "Java" used in a project description vs just a list).

      3. **Content & Impact (30%)**:
         - **Quantifiable Metrics**: Are there numbers? (e.g., "Improved X by Y%"). If no metrics, score this < 60.
         - **Action Verbs**: Strong start to bullets?
         - **Completeness**: Contact info, LinkedIn URL, Education, Experience present?

      4. **Generate Output**:
         Return a JSON object with:
         - "title": Candidate Name / Role.
         - "category": One of [Engineering, Marketing, Sales, Design, Product, Finance, HR, Operations, Other].
         - "score": Calculated weighted score (integer).
         - "scoreBreakdown": { "keywords": number, "format": number, "completeness": number }.
         - "analysis": A Markdown string. **DO NOT use generic advice.** Be specific to THIS resume.
            Structure:
            ### 🤖 ATS Parsing Report
            (Did the parser fail on any sections? Is the contact info readable? Mention specific parsing artifacts found in the raw text.)

            ### 📉 Score Drivers
            (Why is the score X? e.g., "-10 points for missing metrics", "-15 points for unreadable header")

            ### 🔑 Critical Missing Keywords
            (List 3-5 top missing hard skills)

            ### 🛠️ Fixes to Reach Top 10%
            (Specific actionable steps)

      Example JSON: 
      {
        "title": "Product Manager - Jane Doe", 
        "category": "Product", 
        "score": 58, 
        "scoreBreakdown": { "keywords": 50, "format": 70, "completeness": 55 },
        "analysis": "### 🤖 ATS Parsing Report\\nThe two-column layout caused the 'Skills' section to be read *after* 'Education', confusing the parser..."
      }
      `;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const jsonStr = content.replace(/```json/g, '').replace(/```/g, '');
      
      const parsed = JSON.parse(jsonStr);
      const { title, category, score, scoreBreakdown, analysis } = parsed;
      
      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
        id: args.id,
        title,
        category,
        analysis,
        score,
        scoreBreakdown,
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
        id: args.id,
        title: "Resume",
        category: "Uncategorized",
        analysis: "AI not configured or failed to analyze.",
        score: 0,
      });
    }
  },
});

export const rewriteResume = action({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = `You are an expert Resume Writer and ATS Optimization Specialist.
    Your task is to REWRITE the following resume content to be perfectly optimized for Applicant Tracking Systems (ATS).

    Target Job Description (if any):
    "${args.jobDescription || "General professional optimization"}"

    Original Resume Text:
    "${args.ocrText.substring(0, 20000)}"

    ### INSTRUCTIONS:
    1. **Improve Clarity & Impact**: Rewrite bullet points to use strong action verbs and include metrics where possible (e.g., "Increased sales by 20%").
    2. **ATS Formatting**: Ensure the text is structured with clear headers (Summary, Experience, Education, Skills).
    3. **Keyword Integration**: Naturally weave in relevant keywords from the JD or industry standards.
    4. **Fix Grammar & Flow**: Correct any errors and ensure a professional tone.
    5. **Output Format**: Return ONLY the rewritten resume text in a clean, Markdown format. Do not include explanations or "Here is the rewritten resume" text. Just the resume.
    `;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rewrittenText = data.choices[0].message.content;

      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
        id: args.id,
        rewrittenText: rewrittenText,
      });

      return rewrittenText;
    } catch (error) {
      console.error("Error rewriting resume:", error);
      throw new Error("Failed to rewrite resume");
    }
  },
});

export const optimizeLinkedIn = action({
  args: {
    profileText: v.string(),
    jobDescription: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = `You are an expert LinkedIn Profile Optimizer and Career Coach.
    Analyze the following LinkedIn profile data against the target Job Description (if provided).

    LinkedIn URL: ${args.linkedinUrl || "Not provided"}
    
    Target Job Description:
    "${args.jobDescription || "General professional optimization"}"

    Profile Text (About, Experience, Skills, etc.):
    "${args.profileText}"

    Provide a detailed optimization report in JSON format with the following structure:
    {
      "score": number (0-100),
      "headline": "Suggested new headline",
      "about": "Critique of the About section...",
      "missingKeywords": ["keyword1", "keyword2"],
      "actionableTips": ["Tip 1", "Tip 2"]
    }

    Focus on:
    1. SEO keywords for the target role.
    2. Professional branding and impact.
    3. Alignment with the job description.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '');
    
    const parsed = JSON.parse(jsonStr);
    return parsed;
  },
});

export const chat = action({
  args: {
    message: v.string(),
    history: v.array(v.object({ role: v.string(), content: v.string() })),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const messages = args.history.map(h => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content,
    }));

    messages.push({ role: "user", content: args.message });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: messages,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
});