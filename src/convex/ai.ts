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
      const prompt = `You are an advanced ATS (Applicant Tracking System) simulator and Resume Optimizer.
      Your goal is to "see" the resume exactly as a machine would and provide critical, data-driven feedback.

      Job Description / Target Context:
      "${args.jobDescription || "General optimization (no specific job provided) - Evaluate based on general industry standards for the detected role."}"

      RAW PARSED RESUME TEXT (What the ATS sees):
      "${args.ocrText.substring(0, 30000)}"

      ### INSTRUCTIONS:

      1. **Analyze the "ATS View" (Raw Text)**:
         - This text was extracted via OCR/PDF parsing. 
         - If the text is garbled, out of order, or missing sections (like headers/footers), this indicates a POOR FORMAT that will be rejected by real ATS software.
         - **Penalize the Format score heavily** if the raw text is hard to read or unstructured.

      2. **Industry & Company Specifics**:
         - Detect the industry (e.g., Tech, Finance, Marketing).
         - If a specific company is mentioned in the JD, apply their known values (e.g., Google/FAANG values "Scale", "Metrics"; Startups value "Speed", "Ownership").
         - **Keywords**: Look for specific hard skills, not just generic buzzwords.

      3. **Calculate Detailed Scores (0-100)**:
         - **Keywords (40%)**: Match rate against JD hard skills or Industry standards.
         - **Format (30%)**: Machine-readability. Are standard headers (Experience, Education) present in the RAW text? Is the hierarchy clear?
         - **Completeness (30%)**: Essential sections present? Metrics used? Contact info found?

      4. **Generate Output**:
         Return a JSON object with:
         - "title": Extracted candidate name/role.
         - "category": One of [Engineering, Marketing, Sales, Design, Product, Finance, HR, Operations, Other].
         - "score": Weighted average (Keywords*0.4 + Format*0.3 + Completeness*0.3).
         - "scoreBreakdown": { "keywords": number, "format": number, "completeness": number }.
         - "analysis": A Markdown string structured as:
            ### 👁️ ATS Parsing Analysis
            (Comment specifically on how well the resume was parsed. Did columns break the text? Are headers missing in the raw view?)
            
            ### 🚨 Critical Fixes
            (Top 3 blockers)
            
            ### 🔑 Missing Keywords
            (List specific missing hard skills found in the JD/Industry)
            
            ### 💡 Industry-Specific Tips
            (Advice tailored to the detected industry/role)

      Example JSON: 
      {
        "title": "Software Engineer - John Doe", 
        "category": "Engineering", 
        "score": 65, 
        "scoreBreakdown": { "keywords": 60, "format": 80, "completeness": 55 },
        "analysis": "### 👁️ ATS Parsing Analysis\\nThe two-column layout caused the skills section to merge with the experience..."
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