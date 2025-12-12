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

    // Check for empty or insufficient text
    if (!args.ocrText || args.ocrText.trim().length < 50) {
      console.log("OCR Text is too short or empty.");
      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
        id: args.id,
        title: "Resume (Unreadable)",
        category: "Uncategorized",
        analysis: "### ⚠️ Parsing Error\nWe could not extract enough text from this file. It might be an image-only PDF without OCR data, or the file is corrupted.\n\n**Recommendation:**\n- Try converting your resume to a standard text-based PDF.\n- Ensure the file is not password protected.",
        score: 0,
        scoreBreakdown: { keywords: 0, format: 0, completeness: 0 }
      });
      return;
    }

    // Log job description usage for validation
    const hasJobDescription = args.jobDescription && args.jobDescription.trim().length > 0;
    console.log(`[AI Analysis] Resume ID: ${args.id}, Job Description Provided: ${hasJobDescription}, JD Length: ${args.jobDescription?.length || 0}`);

    try {
      const jobDescriptionContext = hasJobDescription 
        ? `"${args.jobDescription}"`
        : `"General Industry Standards for the detected role"`;

      const prompt = `You are an advanced ATS (Applicant Tracking System) Simulator (simulating systems like Taleo, Greenhouse, Lever).
      Your goal is to strictly evaluate the resume's machine-readability and content match against the target role.

      CONTEXT:
      - Job Description: ${jobDescriptionContext}
      ${hasJobDescription ? '- IMPORTANT: This is a TAILORED analysis. Score heavily based on keyword matches from the provided job description.' : '- This is a GENERAL analysis based on industry standards.'}
      - RAW PARSED TEXT (What the ATS sees):
      "${args.ocrText.substring(0, 30000)}"

      ### SCORING ALGORITHM (0-100):
      Be strict but fair. Most resumes score between 40-70. Scores above 80 should be rare and require near-perfect optimization.
      ${hasJobDescription ? '\n**TAILORED MODE**: Prioritize exact keyword matches from the job description. Missing critical JD keywords should significantly lower the score.' : ''}

      1. **Parsing & Format (30%)**:
         - **CRITICAL**: Does the raw text look garbled? Are headers (Experience, Education) clearly identifiable?
         - Penalize for: Multi-column layouts (often parse poorly), graphics/icons (not visible in text), missing dates, or complex tables.
         - If the raw text is a wall of text without structure, score this < 50.
         - If the text is readable but formatting is messy, score 50-70.

      2. **Keyword Matching (40%)**:
         ${hasJobDescription 
           ? '- Extract ALL hard skills, soft skills, and key phrases from the provided Job Description.\n         - Calculate exact match rate. Each missing critical keyword should reduce score by 3-5 points.\n         - **CRITICAL**: If the resume is missing 5+ key skills from the JD, score should be < 60.'
           : '- Extract hard skills from general industry standards for the detected role.\n         - Calculate a match rate.'
         }
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
         - "score": Calculated weighted score (integer). ${hasJobDescription ? 'IMPORTANT: Be strict with tailored scoring - missing JD keywords should significantly impact score.' : ''}
         - "scoreBreakdown": { "keywords": number, "format": number, "completeness": number }.
         - "missingKeywords": Array of objects. Identify exactly 10 ${hasJobDescription ? 'missing keywords FROM THE JOB DESCRIPTION' : 'critical missing keywords'}. Structure: { "keyword": "Skill Name", "priority": "critical" | "important" | "nice-to-have", "frequency": number, "impact": number, "section": "Skills" | "Experience" | "Summary" | "Education" }.
           - "critical": Essential hard skills for the role ${hasJobDescription ? '(from JD)' : ''}.
           - "frequency": How many times this keyword appears in the JD (estimate 1-5).
           - "impact": Estimated score increase if fixed (1-10).
           - "section": Recommended section to add this keyword.
         - "formatIssues": Array of objects. Identify exactly 5 specific formatting or structural issues. Structure: { "issue": "Description of the issue", "severity": "high" | "medium" | "low", "fix": "Specific actionable fix" }.
         - "analysis": A Markdown string. **DO NOT use generic advice.** Be specific to THIS resume ${hasJobDescription ? 'and the provided job description' : ''}.
            Structure:
            ${hasJobDescription ? '### 🎯 Tailored Analysis\n(Explain how well this resume matches the specific job description. List exact missing keywords from the JD with their frequency in the JD. Be specific about which sections need these keywords.)\n\n' : ''}
            ### 🤖 ATS Parsing Report
            (Did the parser fail on any sections? Is the contact info readable? Mention specific parsing artifacts found in the raw text. Rate parsing quality: Excellent/Good/Fair/Poor)

            ### 📊 Score Breakdown Analysis
            (Explain each component score in detail:
            - Keywords: X/40 points - Why? List top 3 missing critical keywords.
            - Format: X/30 points - Why? List top 2 format issues.
            - Completeness: X/30 points - Why? What's missing or weak?)

            ### 🔑 Critical Missing Keywords (Priority: HIGH)
            (List 3-5 top missing hard skills${hasJobDescription ? ' from the job description' : ''} with:
            - Keyword name
            - Why it's critical (appears X times in JD, required skill, etc.)
            - Exact section to add it to
            - Example of how to incorporate it naturally)

            ### ⚠️ Format Issues Blocking ATS
            (List specific format problems that prevent ATS from reading correctly:
            - Issue description
            - Why it's a problem
            - Exact fix with before/after example if possible)

            ### 🛠️ Action Plan to Reach 75%+ Score
            (Provide a numbered, step-by-step action plan:
            1. [Specific action] - Expected impact: +X points
            2. [Specific action] - Expected impact: +X points
            etc.
            Total potential improvement: +XX points → New score: XX%)

            ### 💡 Pro Tips for This Role
            (2-3 specific tips based on the role/industry that would make this resume stand out to both ATS and human recruiters)

      Example JSON: 
      {
        "title": "Product Manager - Jane Doe", 
        "category": "Product", 
        "score": 58, 
        "scoreBreakdown": { "keywords": 50, "format": 70, "completeness": 55 },
        "missingKeywords": [
          { "keyword": "Python", "priority": "critical", "frequency": 3, "impact": 8, "section": "Skills" },
          { "keyword": "SQL", "priority": "important", "frequency": 2, "impact": 6, "section": "Experience" },
          { "keyword": "Agile", "priority": "nice-to-have", "frequency": 1, "impact": 4, "section": "Experience" }
        ],
        "formatIssues": [
          { "issue": "Two-column layout detected", "severity": "high", "fix": "Convert to single-column format. ATS reads left-to-right and may jumble content." },
          { "issue": "Date format inconsistent", "severity": "medium", "fix": "Use consistent format: 'Jan 2020 - Dec 2022' throughout" }
        ],
        "analysis": "${hasJobDescription ? '### 🎯 Tailored Analysis\\n\\nThis resume matches 45% of the job description keywords. The JD mentions \\"Python\\" 3 times, \\"SQL\\" 2 times, and \\"Agile\\" once - all missing from your resume. Add these to your Skills section and weave them into your Experience bullets.\\n\\n' : ''}### 🤖 ATS Parsing Report\\n\\nParsing Quality: Fair\\n\\nThe two-column layout caused the 'Skills' section to be read *after* 'Education', confusing the parser. Contact info is readable but LinkedIn URL is missing.\\n\\n### 📊 Score Breakdown Analysis\\n\\nKeywords: 20/40 points - Missing 6 critical technical skills from the JD\\nFormat: 21/30 points - Two-column layout and inconsistent dates\\nCompleteness: 17/30 points - No quantifiable metrics in experience bullets\\n\\n### 🔑 Critical Missing Keywords\\n\\n1. Python (appears 3x in JD) - Add to Skills section and mention in 2-3 project bullets\\n2. SQL (appears 2x in JD) - Add specific SQL achievements with metrics\\n3. Agile (appears 1x in JD) - Mention Agile/Scrum methodology in Experience\\n\\n### 🛠️ Action Plan to Reach 75%+ Score\\n\\n1. Add Python, SQL, Agile to Skills section - Impact: +12 points\\n2. Convert to single-column layout - Impact: +9 points\\n3. Add 3-5 quantifiable metrics to Experience - Impact: +13 points\\n4. Add LinkedIn URL to contact info - Impact: +3 points\\n\\nTotal improvement: +37 points → New score: 95%"
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
      const { title, category, score, scoreBreakdown, missingKeywords, formatIssues, analysis } = parsed;
      
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
        scoreBreakdown: { keywords: 0, format: 0, completeness: 0 },
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verify ownership
    const resume = await ctx.runQuery(internal.resumes.getResumeInternal, { id: args.id });
    if (!resume || (resume.userId !== identity.subject && identity.email !== "tiniboti@gmail.com")) {
      throw new Error("Unauthorized");
    }

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