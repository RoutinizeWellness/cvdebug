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

      Calculate an ATS Score (0-100) based strictly on this breakdown:
      1. Keyword match (40 points): How well do resume keywords match the job description?
      2. Format compatibility (30 points): Is the structure standard? (Implied from text layout)
      3. Section completeness (30 points): Does it have Summary, Experience, Education, Skills?

      Provide a detailed analysis with these specific sections using Markdown headers:
      ### Missing Keywords
      (List specific keywords from the job description missing in the resume)
      
      ### Format Issues
      (Identify any layout or formatting problems)
      
      ### Specific Fixes
      (Actionable recommendations to improve the score)

      Return ONLY a JSON object with keys: "title", "category", "score" (number), and "analysis" (string, containing the markdown sections).
      Example: {"title": "Product Manager - Jane Smith", "category": "Product", "score": 85, "analysis": "### Missing Keywords\\n- Agile\\n- SQL\\n\\n### Format Issues\\n- Use standard bullet points..."}`;

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