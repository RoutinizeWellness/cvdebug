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
      const prompt = `You are an expert ATS (Applicant Tracking System) optimizer.
      Analyze the resume text against the provided Job Description (if any).
      
      BE EXTREMELY CRITICAL. Do not give high scores easily. 
      - A generic resume should score 40-60.
      - A good resume should score 60-80.
      - Only a perfect match should score 80+.

      Job Description:
      "${args.jobDescription || "General optimization (no specific job provided) - Evaluate based on general industry standards for the detected role."}"

      Resume Text:
      "${args.ocrText.substring(0, 30000)}"

      1. **Categorize the resume** into one of these exact categories: 
         - Engineering
         - Marketing
         - Sales
         - Design
         - Product
         - Finance
         - HR
         - Operations
         - Other

      2. **Calculate a detailed ATS Score Breakdown (0-100 for each):**
         - **Keywords**: How well does it match the JD or role keywords? (If no JD, check for strong industry terms).
         - **Format**: Is it readable? Standard headers? Bullet points? No complex columns?
         - **Completeness**: Does it have Summary, Experience, Education, Skills, Contact Info?

         *Calculate the Total Score as the weighted average: Keywords (40%) + Format (30%) + Completeness (30%).*

      3. **Provide a detailed analysis** using Markdown headers:
         ### 🚨 Critical Fixes
         (Top 3 things that will get this resume rejected immediately)
         
         ### 🔑 Missing Keywords
         (List specific keywords from the JD or industry standards missing here)
         
         ### 📝 Formatting & Structure
         (Feedback on layout, bullet points, and section organization)
         
         ### 💡 Pro Tips
         (Actionable advice to stand out)

      Return ONLY a JSON object with keys: 
      - "title" (extracted name/role)
      - "category" (from the list above)
      - "score" (Total calculated number)
      - "scoreBreakdown" (Object with "keywords", "format", "completeness" as numbers)
      - "analysis" (string, containing the markdown sections)
      
      Example: 
      {
        "title": "Software Engineer - John Doe", 
        "category": "Engineering", 
        "score": 65, 
        "scoreBreakdown": { "keywords": 60, "format": 80, "completeness": 55 },
        "analysis": "### 🚨 Critical Fixes\\n- ..."
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
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
        id: args.id,
        title: "Resume",
        category: "Uncategorized",
        analysis: "AI not configured.",
        score: 0,
      });
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