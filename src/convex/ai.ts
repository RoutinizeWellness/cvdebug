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
        analysis: "### ⚠️ Parsing Error\\n\\nWe could not extract enough text from this file. It might be an image-only PDF without OCR data, or the file is corrupted.\\n\\n**Recommendation:**\\n- Try converting your resume to a standard text-based PDF.\\n- Ensure the file is not password protected.",
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

      ### ENHANCED ML-POWERED SCORING ALGORITHM (0-100):
      
      **CRITICAL CALIBRATION RULES:**
      - Most real-world resumes score 45-75 (industry average: 62)
      - Scores above 85 require exceptional optimization across ALL dimensions
      - Be STRICT and REALISTIC - don't inflate scores
      - Each point deduction must be justified by specific deficiencies
      
      ${hasJobDescription ? '**TAILORED MODE ACTIVATED**: Apply TF-IDF weighting - keywords appearing 3+ times in JD are "critical" (5 pts each), 2 times are "important" (3 pts), 1 time is "nice-to-have" (1 pt).' : ''}

      ### COMPONENT 1: Parsing & Format Quality (30 points)
      
      **Structure Detection Algorithm:**
      - Scan for standard section headers (Experience, Education, Skills, Summary/Objective) → +8 pts if all present
      - Verify chronological order and date consistency → +6 pts if consistent
      - Identify complete contact information block (email, phone, LinkedIn) → +5 pts if complete
      - Check for single-column layout (ATS-friendly) → +6 pts if single-column
      - Assess readability (proper spacing, clear hierarchy) → +5 pts if excellent
      
      **Format Issues Detection & Penalties:**
      - Multi-column layouts (causes text jumbling) → -10 points
      - Tables/graphics (invisible to text parsers) → -8 points
      - Inconsistent date formats (MM/YYYY vs Month Year) → -5 points
      - Missing critical section headers → -6 points
      - Poor spacing/wall of text → -4 points
      - Special characters or symbols that break parsing → -3 points
      
      **Scoring Bands:**
      - 25-30: Perfect ATS formatting, single-column, clear headers, consistent dates
      - 18-24: Minor issues, mostly readable with 1-2 format problems
      - 10-17: Significant parsing problems affecting readability
      - 0-9: Severely garbled, multi-column, or unparseable

      ### COMPONENT 2: Keyword Matching & Semantic Analysis (40 points)
      
      ${hasJobDescription 
        ? `**TF-IDF-Inspired Weighting Algorithm:**
        1. Extract ALL technical skills, tools, methodologies, certifications from JD
        2. Calculate frequency weights:
           - 3+ mentions = CRITICAL (5 points each, max 25 pts total)
           - 2 mentions = IMPORTANT (3 points each, max 10 pts total)
           - 1 mention = NICE-TO-HAVE (1 point each, max 5 pts total)
        3. Match rate formula: (matched_weight / total_possible_weight) × 40
        
        **Contextual Scoring Rules:**
        - Keyword in project description WITH metrics = 100% of points
        - Keyword in experience bullets with context = 80% of points
        - Keyword in skills list only = 50% of points
        - Keyword stuffing (>15 skills with no context) = -8 points penalty
        
        **Critical Threshold Penalties:**
        - Missing 5+ high-frequency JD keywords → cap total score at 55
        - Missing 3-4 critical keywords → cap at 65
        - Missing 1-2 critical keywords → cap at 75`
        : `**Industry Benchmark Matching:**
        1. Identify role category (Engineering, Marketing, Sales, Design, etc.)
        2. Compare against top 20 industry-standard skills for that role
        3. Calculate coverage: (matched_skills / 20) × 40
        4. Bonus points for emerging/high-demand skills (+5 pts max)`
      }
      
      **Semantic Matching Intelligence:**
      - Recognize synonyms: "JavaScript" = "JS", "Machine Learning" = "ML", "React.js" = "React"
      - Acronym expansion: "AWS" includes "Amazon Web Services"
      - Tool variations: "Photoshop" = "Adobe Photoshop" = "PS"
      
      **Recency Weighting:**
      - Skills in most recent role (last 2 years) → 1.5x weight
      - Skills in older roles (2-5 years) → 1.0x weight
      - Skills older than 5 years → 0.5x weight

      ### COMPONENT 3: Content Quality & Impact (30 points)
      
      **Quantifiable Metrics Algorithm (15 points):**
      - Count metrics/numbers in experience bullets (%, $, #, X times, X users, etc.)
      - Scoring:
        * 8+ quantified achievements across all roles = 15 points
        * 5-7 quantified achievements = 11 points
        * 3-4 quantified achievements = 7 points
        * 1-2 quantified achievements = 3 points
        * 0 quantified achievements = 0 points
      
      **Action Verb Strength Analysis (8 points):**
      - Strong impact verbs (Led, Architected, Optimized, Increased, Reduced, Launched) = 8 points
      - Moderate verbs (Managed, Developed, Implemented, Created) = 5 points
      - Weak verbs (Responsible for, Worked on, Helped with, Assisted) = 2 points
      - Passive voice or no action verbs = 0 points
      
      **Completeness & Professional Polish (7 points):**
      - Contact info (email + phone) = 2 points
      - LinkedIn URL or portfolio link = 1 point
      - Education section with degree/institution = 2 points
      - 2+ years of relevant experience = 2 points

      ### ROLE-SPECIFIC OPTIMIZATION GUIDANCE:
      
      **For Engineering/Technical Roles (Civil, Structural, Mechanical, Software, Data, etc.):**
      
      **Project-Based Achievement Framework:**
      Every bullet should answer: WHAT project + WHAT scale + WHAT you did + WHAT result
      
      **Required Project Details:**
      - Project name/type (e.g., "6-story multifamily wood-frame building", "E-commerce platform")
      - Scale/scope (floors, area in m²/ft², budget, users, data volume)
      - Technologies/materials used (wood, steel, RC, Python, AWS, React, etc.)
      - Standards/codes applied (IBC, ASCE 7, Eurocode, WCAG, SOC 2, etc.)
      - YOUR specific contribution (what YOU designed, built, optimized)
      - Quantifiable impact (cost savings, performance gains, time reduction)
      
      **Metric Templates for Engineering:**
      - Structural: "Designed gravity and lateral systems for [X m² / X-story] [material] building using [code/software], reducing material cost by Y% / meeting Z seismic requirements"
      - Software: "Architected [system/feature] serving [X users/requests] using [tech stack], improving [metric] by Y% and reducing [cost/latency] by Z%"
      - Data: "Built [pipeline/model] processing [X TB/records] using [tools], achieving [accuracy/speed] and enabling [business outcome]"
      
      **Format Recommendation:**
      - Keep main resume to 1 page (2 pages max for 10+ years experience)
      - Consider a separate 1-page project sheet with 2-3 representative projects
      - Use bullet format: "Designed [system] for [specific project details] using [tools/codes], achieving [quantifiable result]"

      **For Marketing/Sales/Business Roles:**
      - Focus on: campaign results, conversion rates, revenue impact, audience growth, ROI
      - Metrics: "Increased conversions by X%", "Generated $Y in revenue", "Grew audience from A to B", "Achieved X% ROI"

      **For Product/Design/UX Roles:**
      - Focus on: user impact, feature adoption, design system contributions, usability improvements
      - Metrics: "Improved user retention by X%", "Designed feature used by Y users", "Reduced friction by Z%", "Increased NPS by X points"

      ### ML-ENHANCED OUTPUT GENERATION:
      
      Return a JSON object with the following structure:
      
      {
        "title": "Candidate Name / Role Title",
        "category": "Engineering" | "Marketing" | "Sales" | "Design" | "Product" | "Finance" | "HR" | "Operations" | "Other",
        "score": <integer 0-100, STRICTLY CALIBRATED>,
        "scoreBreakdown": {
          "keywords": <0-40>,
          "format": <0-30>,
          "completeness": <0-30>
        },
        "missingKeywords": [
          {
            "keyword": "Specific Skill/Tool Name",
            "priority": "critical" | "important" | "nice-to-have",
            "frequency": <1-10, exact count in JD or industry importance>,
            "impact": <1-10, estimated score increase if added>,
            "section": "Skills" | "Experience" | "Summary" | "Education",
            "context": "Detailed advice on how to naturally incorporate this keyword with example usage",
            "synonyms": ["alternative term 1", "alternative term 2"]
          }
        ],
        "formatIssues": [
          {
            "issue": "Specific problem detected in the resume",
            "severity": "high" | "medium" | "low",
            "fix": "Step-by-step solution with before/after example",
            "location": "Specific section or line where found",
            "atsImpact": "Explanation of how this affects ATS parsing"
          }
        ],
        "metricSuggestions": [
          {
            "tech": "Technology/System/Skill Area",
            "metrics": [
              "Metric template 1 with [placeholders]",
              "Metric template 2 with [placeholders]",
              "Metric template 3 with [placeholders]"
            ]
          }
        ],
        "analysis": "Detailed Markdown analysis (see structure below)"
      }

      ### ANALYSIS MARKDOWN STRUCTURE:
      
      ${hasJobDescription ? `### 🎯 Tailored Job Match Analysis
      
      **Match Score: [X]%**
      
      This resume is ${hasJobDescription ? 'specifically analyzed against the provided job description' : 'evaluated against general industry standards'}.
      
      **Critical Missing Keywords from JD:**
      - [Keyword 1] (appears X times in JD) - Add to [Section]
      - [Keyword 2] (appears X times in JD) - Add to [Section]
      - [Keyword 3] (appears X times in JD) - Add to [Section]
      
      **Keyword Match Rate:** [X]% of critical JD keywords found
      
      ---
      
      ` : ''}### 🤖 ATS Parsing Report
      
      **Parsing Quality: [Excellent/Good/Fair/Poor]**
      
      [Specific analysis of how well the ATS can read this resume. Mention any parsing artifacts, jumbled sections, or unreadable areas found in the raw text.]
      
      **Contact Information:** [Readable/Partially Readable/Not Found]
      **Section Headers:** [All Present/Some Missing/Unclear]
      **Date Formats:** [Consistent/Inconsistent]
      **Layout:** [Single-column/Multi-column]
      
      ---
      
      ### 📊 Detailed Score Breakdown
      
      **Keywords & Content Match: [X]/40 points**
      - [Explanation of keyword score]
      - Top 3 missing critical keywords: [keyword1], [keyword2], [keyword3]
      - [Specific gaps identified]
      
      **Format & Parseability: [X]/30 points**
      - [Explanation of format score]
      - Top 2 format issues: [issue1], [issue2]
      - [Specific formatting problems]
      
      **Completeness & Impact: [X]/30 points**
      - [Explanation of completeness score]
      - Quantified achievements: [count]
      - Action verb strength: [Strong/Moderate/Weak]
      
      ---
      
      ### 🔑 Critical Missing Keywords (Priority: HIGH)
      
      ${hasJobDescription ? 'Based on the job description analysis:' : 'Based on industry standards for this role:'}
      
      1. **[Keyword 1]** (${hasJobDescription ? 'appears X times in JD' : 'industry-critical skill'})
         - Why critical: [Explanation]
         - Where to add: [Specific section]
         - How to add: "[Example bullet point incorporating this keyword naturally]"
      
      2. **[Keyword 2]** (${hasJobDescription ? 'appears X times in JD' : 'high-demand skill'})
         - Why critical: [Explanation]
         - Where to add: [Specific section]
         - How to add: "[Example bullet point]"
      
      [Continue for 3-5 keywords]
      
      ---
      
      ### ⚠️ Format Issues Blocking ATS
      
      1. **[Issue Name]** (Severity: [High/Medium/Low])
         - Problem: [Detailed description]
         - ATS Impact: [How this breaks parsing]
         - Fix: [Step-by-step solution]
         - Example: 
           ❌ Before: [problematic format]
           ✅ After: [corrected format]
      
      [Continue for all detected issues]
      
      ---
      
      ### 🎯 Action Plan to Reach 75%+ Score
      
      Follow these steps in order for maximum impact:
      
      1. **[Specific action]** - Expected impact: +[X] points
         - [Detailed instructions]
      
      2. **[Specific action]** - Expected impact: +[X] points
         - [Detailed instructions]
      
      3. **[Specific action]** - Expected impact: +[X] points
         - [Detailed instructions]
      
      **Total Potential Improvement:** +[XX] points → **New Projected Score: [XX]%**
      
      ---
      
      ### 💡 Pro Tips for This Role
      
      ${hasJobDescription ? '**For this specific position:**' : '**For this role category:**'}
      
      1. **[Tip 1 specific to role/industry]**
         - [Detailed explanation with examples]
      
      2. **[Tip 2 specific to role/industry]**
         - [Detailed explanation with examples]
      
      3. **[Tip 3 specific to role/industry]**
         - [Detailed explanation with examples]
      
      ${args.ocrText.toLowerCase().includes('engineer') || args.ocrText.toLowerCase().includes('structural') || args.ocrText.toLowerCase().includes('civil') ? `
      **Special Advice for Engineering Roles:**
      
      Make projects the stars of your resume, not generic duties. Instead of:
      ❌ "Responsible for structural design and analysis"
      
      Use:
      ✅ "Designed gravity and lateral systems for 6-story, 5,000 m² wood-frame apartment using IBC 2018/ETABS, reducing material cost by 12% while meeting seismic requirements"
      
      Consider creating a 1-page project sheet with 2-3 representative projects showing:
      - Building/project type and scale
      - Materials and codes used
      - Your specific contributions
      - Quantifiable results
      ` : ''}
      
      ---
      
      ### 📈 Competitive Benchmark
      
      - **Your Score:** [X]%
      - **Industry Average:** 62%
      - **Top 25% Threshold:** 75%
      - **Top 10% Threshold:** 85%
      
      ${hasJobDescription ? 'With the improvements suggested above, you can reach the top 25% of applicants for this specific role.' : 'With the improvements suggested above, you can significantly improve your ATS performance.'}
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