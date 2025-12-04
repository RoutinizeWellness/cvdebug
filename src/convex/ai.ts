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

      Job Description:
      "${args.jobDescription || "General optimization (no specific job provided)"}"

      Resume Text:
      "${args.ocrText.substring(0, 4000)}"

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

      2. **Calculate an ATS Score (0-100)** based strictly on:
         - Keyword match (40%): Match against Job Description (or general industry keywords if none provided).
         - Format compatibility (30%): Standard headers, bullet points, readability.
         - Section completeness (30%): Summary, Experience, Education, Skills present.

      3. **Provide a detailed analysis** using Markdown headers:
         ### 🚨 Critical Fixes
         (Top 3 things that will get this resume rejected immediately)
         
         ### 🔑 Missing Keywords
         (List specific keywords from the JD or industry standards missing here)
         
         ### 📝 Formatting & Structure
         (Feedback on layout, bullet points, and section organization)
         
         ### 💡 Pro Tips
         (Actionable advice to stand out)

      Return ONLY a JSON object with keys: "title" (extracted name/role), "category" (from the list above), "score" (number), and "analysis" (string, containing the markdown sections).
      Example: {"title": "Software Engineer - John Doe", "category": "Engineering", "score": 72, "analysis": "### 🚨 Critical Fixes\\n- ..."}
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
      const { title, category, score, analysis } = parsed;
      
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