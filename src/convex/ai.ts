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
        analysis: "### ⚠️ Parsing Error\\nWe could not extract enough text from this file. It might be an image-only PDF without OCR data, or the file is corrupted.\\n\\n**Recommendation:**\\n- Try converting your resume to a standard text-based PDF.\\n- Ensure the file is not password protected.",
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

      const prompt = `You are an advanced ATS (Applicant Tracking System) Simulator with ML-enhanced analysis capabilities (simulating systems like Taleo, Greenhouse, Lever, Workday).
      Your goal is to strictly evaluate the resume's machine-readability and content match against the target role using sophisticated algorithms.

      CONTEXT:
      - Job Description: ${jobDescriptionContext}
      ${hasJobDescription ? '- IMPORTANT: This is a TAILORED analysis. Use TF-IDF-like weighting for keyword importance from the JD.' : '- This is a GENERAL analysis based on industry standards and role-specific benchmarks.'}
      - RAW PARSED TEXT (What the ATS sees):
      "${args.ocrText.substring(0, 30000)}"

      ### ENHANCED SCORING ALGORITHM (0-100):
      Use ML-inspired scoring with weighted components. Most resumes score 45-75. Scores above 85 require exceptional optimization.
      ${hasJobDescription ? '\\n**TAILORED MODE**: Apply TF-IDF weighting - keywords appearing 3+ times in JD are "critical", 2 times are "important", 1 time is "nice-to-have".' : ''}

      1. **Parsing & Format Quality (30 points)**:
         - **Structure Detection Algorithm**:
           * Check for standard section headers (Experience, Education, Skills, Summary/Objective)
           * Detect chronological order and date consistency
           * Identify contact information block (email, phone, LinkedIn)
         - **Format Issues Detection**:
           * Multi-column layouts (ATS reads left-to-right, causes jumbling) → -8 points
           * Tables/graphics (invisible to text parsers) → -6 points
           * Inconsistent date formats → -4 points
           * Missing section headers → -5 points
           * Poor spacing/wall of text → -3 points
         - **Scoring**:
           * 25-30: Clean, single-column, clear headers, consistent formatting
           * 18-24: Minor issues, mostly readable
           * 10-17: Significant parsing problems
           * 0-9: Severely garbled or unparseable

      2. **Keyword Matching & Context (40 points)**:
         ${hasJobDescription 
           ? '- **TF-IDF-Inspired Weighting**:\\n           * Extract all technical skills, tools, methodologies from JD\\n           * Weight by frequency: 3+ mentions = 5 points each, 2 mentions = 3 points, 1 mention = 1 point\\n           * Calculate match rate: (matched_weight / total_weight) × 40\\n         - **Contextual Analysis**:\\n           * Keyword in project description with metrics = full points\\n           * Keyword in skills list only = 60% of points\\n           * Keyword stuffing (>10 skills with no context) = -5 points penalty\\n         - **Critical Threshold**: Missing 5+ high-frequency JD keywords → cap score at 55'
           : '- **Industry Benchmark Matching**:\\n           * Identify role category (Engineering, Marketing, Sales, etc.)\\n           * Compare against top 20 industry-standard skills for that role\\n           * Calculate coverage percentage'
         }
         - **Semantic Matching**: Consider synonyms (e.g., "JavaScript" = "JS", "Machine Learning" = "ML")
         - **Recency Weighting**: Skills mentioned in recent roles (last 2 years) weighted 1.5x

      3. **Content Quality & Impact (30 points)**:
         - **Quantifiable Metrics Algorithm** (15 points):
           * Count metrics/numbers in experience bullets (%, $, #, X times)
           * 5+ quantified achievements = 15 points
           * 3-4 quantified achievements = 10 points
           * 1-2 quantified achievements = 5 points
           * 0 quantified achievements = 0 points
         - **Action Verb Analysis** (8 points):
           * Strong verbs (Led, Architected, Optimized, Increased) = full points
           * Weak verbs (Responsible for, Worked on, Helped with) = partial points
           * Passive voice = 0 points
         - **Completeness Check** (7 points):
           * Contact info (email, phone) = 2 points
           * LinkedIn URL = 1 point
           * Education section = 2 points
           * 2+ years of experience = 2 points

      ### ROLE-SPECIFIC GUIDANCE:
      
      **For Engineering/Technical Roles (Civil, Structural, Mechanical, Software, etc.):**
      - **Project-Based Achievements**: Strong resumes showcase SPECIFIC projects as stars, not generic duties
      - **Required Project Details**:
        * Project name/type (e.g., "6-story multifamily wood-frame building")
        * Scale/scope (floors, area in m²/ft², budget/cost)
        * Materials/technologies used (wood, steel, RC, specific software)
        * Codes/standards applied (IBC, ASCE 7, Eurocode, etc.)
        * YOUR specific contribution (what YOU designed, calculated, detailed)
      - **Metric Suggestions for Engineering**:
        * "Designed gravity and lateral systems for [X m² / X-story] [material] building using [code/software], reducing material cost by Y% / meeting Z seismic requirements"
        * "Performed structural analysis for [project type] using [software], optimizing [element] design and saving $X"
        * "Detailed [number] connection designs for [project], ensuring compliance with [code] and reducing construction time by Y%"
      - **Format Recommendation**: 
        * Keep main resume to 1 page
        * Link or attach a 1-page project sheet with 2-3 representative projects showing scope and contributions
        * Use bullets like: "Designed [system] for [specific project details] using [tools/codes], achieving [quantifiable result]"

      **For Marketing/Sales Roles:**
      - Focus on campaign results, conversion rates, revenue impact, audience growth
      - Metrics: "Increased conversions by X%", "Generated $Y in revenue", "Grew audience from A to B"

      **For Product/Design Roles:**
      - Focus on user impact, feature adoption, design system contributions
      - Metrics: "Improved user retention by X%", "Designed feature used by Y users", "Reduced friction by Z%"

      4. **ML-Enhanced Output Generation**:
         Return a JSON object with:
         - "title": Candidate Name / Role.
         - "category": One of [Engineering, Marketing, Sales, Design, Product, Finance, HR, Operations, Other].
         - "score": Calculated weighted score (integer, 0-100). ${hasJobDescription ? 'Apply TF-IDF weighting for tailored scoring.' : 'Use industry benchmark comparison.'}
         - "scoreBreakdown": { "keywords": number (0-40), "format": number (0-30), "completeness": number (0-30) }.
         - "missingKeywords": Array of objects (5-10 items). ${hasJobDescription ? 'Extract from JD using frequency analysis' : 'Use industry-standard skill database'}. Structure: { "keyword": "Skill Name", "priority": "critical" | "important" | "nice-to-have", "frequency": number, "impact": number, "section": "Skills" | "Experience" | "Summary" | "Education", "context": "Why this matters and how to add it naturally", "synonyms": ["alt1", "alt2"] }.
           - **Priority Algorithm**:
             * "critical": Appears 3+ times in JD OR top 5 industry-standard skills for role
             * "important": Appears 2 times in JD OR top 10 industry skills
             * "nice-to-have": Appears 1 time in JD OR complementary skills
           - "frequency": Exact count in JD (1-10) or industry importance score (1-10)
           - "impact": ML-estimated score increase (1-10 points) based on keyword weight
           - "section": Optimal placement based on keyword type (technical → Skills, soft → Experience)
           - "context": Actionable advice with example usage
           - "synonyms": Alternative terms ATS might recognize
         - "formatIssues": Array of objects (3-7 items). Use parsing algorithm to detect real issues. Structure: { "issue": "Specific problem detected", "severity": "high" | "medium" | "low", "fix": "Step-by-step solution with before/after", "location": "Section/line where found", "atsImpact": "How this affects ATS parsing" }.
           - **Detection Algorithm**:
             * Scan for multi-column indicators (text jumping, misaligned sections)
             * Check date format consistency (MM/YYYY vs Month Year vs MM-DD-YYYY)
             * Verify section header presence (Experience, Education, Skills)
             * Detect table structures (aligned columns, grid patterns)
           - Only include REAL detected issues, not generic advice
           - "high": Blocks ATS parsing (multi-column, tables, images-as-text)
           - "medium": Reduces accuracy (inconsistent dates, unclear headers)
           - "low": Minor polish (spacing, bullet consistency)
           - "atsImpact": Explain specific parsing failure this causes
         - "metricSuggestions": Array of 3-5 role-specific metric templates. For Engineering roles, focus on project-based achievements with specific details (building type, scale, materials, codes, personal contribution). Structure: { "tech": "Technology/System", "metrics": ["Metric template 1", "Metric template 2", "Metric template 3"] }
         - "analysis": A Markdown string. **DO NOT use generic advice.** Be specific to THIS resume ${hasJobDescription ? 'and the provided job description' : ''}.
            Structure:
            ${hasJobDescription ? '### 🎯 Tailored Analysis\\n(Explain how well this resume matches the specific job description. List exact missing keywords from the JD with their frequency in the JD. Be specific about which sections need these keywords.)\\n\\n' : ''}
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
            (2-3 specific tips based on the role/industry. **For Engineering roles**: Emphasize project-based achievements over generic duties. Recommend creating a 1-page project sheet with 2-3 representative projects showing specific scope, scale, materials, codes, and personal contributions. Example: "Instead of 'Performed structural design duties', use 'Designed gravity and lateral systems for 6-story, 5,000 m² wood-frame apartment using IBC 2018/ETABS, reducing material cost by 12%'")

      Example JSON for Engineering Role: 
      {
        "title": "Structural Engineer - John Doe", 
        "category": "Engineering", 
        "score": 62, 
        "scoreBreakdown": { "keywords": 55, "format": 65, "completeness": 60 },
        "missingKeywords": [
          { "keyword": "ETABS", "priority": "critical", "frequency": 4, "impact": 8, "section": "Skills", "context": "Add to technical skills and mention in project bullets", "synonyms": ["SAP2000", "Structural Analysis Software"] },
          { "keyword": "Seismic Design", "priority": "critical", "frequency": 3, "impact": 7, "section": "Experience", "context": "Specify seismic code compliance in project descriptions", "synonyms": ["Earthquake Engineering", "ASCE 7"] },
          { "keyword": "Steel Connections", "priority": "important", "frequency": 2, "impact": 5, "section": "Experience", "context": "Detail connection design work with quantities", "synonyms": ["Connection Design", "Steel Detailing"] }
        ],
        "formatIssues": [
          { "issue": "Generic duty-based bullets", "severity": "high", "fix": "Replace 'Responsible for structural design' with 'Designed lateral system for 8-story, 12,000 m² RC building using Eurocode 8, optimizing column layout and reducing concrete volume by 15%'", "location": "Experience section", "atsImpact": "Lacks quantifiable project details that ATS and recruiters prioritize" }
        ],
        "metricSuggestions": [
          { "tech": "Structural Analysis (ETABS/SAP2000)", "metrics": ["Performed seismic analysis for [X-story] [material] building using [software], ensuring compliance with [code] and optimizing [element] design", "Analyzed [number] load combinations for [project type], reducing design iterations by X% through [optimization method]", "Modeled [structure type] in [software], identifying critical load paths and achieving Y% material savings"] },
          { "tech": "Steel/RC Design", "metrics": ["Designed [number] steel/RC connections for [project], meeting [code] requirements and reducing fabrication cost by $X", "Detailed structural drawings for [X m²] [building type], coordinating with [discipline] and ensuring [standard] compliance", "Optimized [structural element] design for [project], reducing material weight by X kg while maintaining [performance criteria]"] }
        ],
        "analysis": "### 🤖 ATS Parsing Report\\n\\nParsing Quality: Good\\n\\nYour resume structure is readable, but the Experience section uses generic duty-based language instead of project-specific achievements.\\n\\n### 📊 Score Breakdown Analysis\\n\\nKeywords: 22/40 points - Missing critical technical terms like ETABS, seismic design, and specific codes\\nFormat: 20/30 points - Bullets lack project details (building type, scale, materials, your specific contribution)\\nCompleteness: 20/30 points - No quantifiable metrics in project descriptions\\n\\n### 🛠️ Action Plan to Reach 75%+ Score\\n\\n1. Replace generic bullets with project-based achievements - Impact: +15 points\\n2. Add ETABS, seismic design, and code references to Skills and Experience - Impact: +10 points\\n3. Include project scale (floors, area, cost) and your specific contributions - Impact: +8 points\\n\\nTotal improvement: +33 points → New score: 95%\\n\\n### 💡 Pro Tips for Structural Engineering\\n\\n1. **Make Projects the Stars**: Instead of 'Performed structural design', use 'Designed gravity and lateral systems for 6-story, 5,000 m² wood-frame apartment using IBC 2018/ETABS, reducing material cost by 12%'\\n2. **Create a Project Sheet**: Keep main resume to 1 page, then attach a simple 1-page sheet with 2-3 representative projects (e.g., multifamily wood, commercial steel, renovation) showing scope and your contributions\\n3. **Quantify Everything**: Include building type, floors, area, materials, codes, software, and measurable results (cost savings, efficiency gains, code compliance achievements)"
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
      const { title, category, score, scoreBreakdown, missingKeywords, formatIssues, analysis, metricSuggestions } = parsed;
      
      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
        id: args.id,
        title,
        category,
        analysis,
        score,
        scoreBreakdown,
        missingKeywords,
        formatIssues,
        metricSuggestions,
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