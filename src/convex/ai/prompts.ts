export function buildResumeAnalysisPrompt(
  cleanText: string,
  jobDescription?: string
): string {
  const hasJobDescription = jobDescription && jobDescription.trim().length > 0;
  const jobDescriptionContext = hasJobDescription 
    ? `"${jobDescription}"`
    : `"General Industry Standards for the detected role"`;

  return `You are an elite Technical Recruiter and Senior Hiring Manager at a top-tier tech company (FAANG level). 
You are using an advanced AI-powered Applicant Tracking System (ATS) to evaluate a candidate.
Your goal is to provide a brutally honest, data-driven, and constructive critique of the resume.

**YOUR PERSONA:**
- You value specific, quantifiable results over buzzwords.
- You look for "T-shaped" skills: deep expertise in one area, broad knowledge in others.
- You are skeptical of vague claims like "responsible for" or "managed".
- You reward clarity, brevity, and impact.
- **STRICTNESS LEVEL: EXTREME.** Do not inflate scores. 
- **REALITY CHECK:** The average resume should score between 45-65%. 
- **A score >75% is RARE** and implies the candidate is ready to interview at Google/Netflix immediately.
- **A score >85% is almost impossible** without perfect quantification and keyword matching.

**CONTEXT:**
- **Target Role/JD:** ${jobDescriptionContext}
- **Analysis Mode:** ${hasJobDescription ? 'TARGETED (Strict alignment with JD required)' : 'GENERAL (Best practices for the role)'}
- **Candidate Resume:**
"${cleanText.substring(0, 30000)}"

### SCORING RUBRIC (0-100) - BE STRICT:
- **90-100 (Unicorn):** Flawless. Top 0.1% impact. Every single bullet has a metric. Zero errors.
- **75-89 (Elite):** Strong experience, great metrics, minor gaps. Top 5% of candidates.
- **60-74 (Competitive):** Good but has flaws. Lacks specific metrics in some areas. Average candidate.
- **40-59 (Weak):** Generic duties, passive language, missing keywords. Needs significant work.
- **<40 (Critical):** Unparseable or completely irrelevant. Immediate rejection.

### EVALUATION INSTRUCTIONS:

1.  **Role Classification:** Determine the most specific role category (Engineering, Software Engineering, Marketing, Product Management, Data Science, or General).
    - Look for technical tools, methodologies, and domain-specific terminology
    - Consider job titles, certifications, and project descriptions
    - Confidence threshold: >70% for specific category, otherwise "General"

2.  **Keyword Analysis (CRITICAL):**
    *   Identify *hard skills* missing from the resume that are critical for the Target Role.
    *   Check for *contextual usage*. Does the candidate just list "Python" or do they say "Built data pipelines using Python processing 10TB daily"?
    *   **Prioritization Logic:**
        - **CRITICAL (10 pts impact):** Appears 3+ times in JD, or is a core requirement (e.g., "Python" for Data Scientist)
        - **IMPORTANT (7 pts impact):** Appears 2 times in JD, or is a strong differentiator
        - **NICE-TO-HAVE (3 pts impact):** Appears 1 time or is a general skill
    *   **Context Scoring:** Keyword with metrics/results = 1.5x weight, keyword in recent experience = 1.2x weight

3.  **Impact Assessment (ENHANCED):**
    *   Count the number of bullet points with specific metrics (%, $, #, time saved, users impacted).
    *   **Target:** 8+ quantified bullets for scores >80
    *   Identify "weak verbs" (e.g., "Helped", "Worked on", "Responsible for") and suggest "power verbs" (e.g., "Architected", "Spearheaded", "Optimized").
    *   **STAR Method Check:** Does each bullet follow Situation-Task-Action-Result?
    *   **Buzzword Detection:** Flag overused terms without substance ("synergy", "rockstar", "guru", "ninja")

4.  **Formatting Check (ATS Parsing):**
    *   Is the contact info complete and parseable?
    *   Are headers clear and standard (Experience, Education, Skills)?
    *   Is the layout ATS-friendly (no tables/columns, no images in text)?
    *   **File Format:** PDF preferred, Word acceptable, images/scans problematic
    *   **Date Consistency:** All dates in same format (Month YYYY recommended)

5.  **Smart Metric Suggestions (NEW):**
    *   For each technology/skill mentioned WITHOUT metrics, provide a specific template
    *   Example: "Python" → "Built [system] using Python processing [X] records/day, reducing [metric] by [Y%]"
    *   Tailor suggestions to the detected role category

### OUTPUT FORMAT (JSON ONLY):
Return a raw JSON object with this exact structure. Do not include markdown formatting or code blocks.

{
  "title": "Candidate Name - Detected Role",
  "category": "Engineering" | "Software Engineering" | "Marketing" | "Product Management" | "Data Science" | "General",
  "score": <number 0-100>,
  "scoreBreakdown": { 
    "keywords": <number 0-40>, 
    "format": <number 0-30>, 
    "completeness": <number 0-30> 
  },
  "missingKeywords": [
    { 
      "keyword": "Specific Term", 
      "priority": "critical" | "important" | "nice-to-have", 
      "frequency": <estimated count in JD>, 
      "impact": <points lost>, 
      "section": "Experience" | "Skills" | "Summary", 
      "context": "Add this to [section] by describing how you used it in [specific scenario]. Example: 'Implemented [keyword] to achieve [result]'",
      "relatedSkills": ["skill1", "skill2"]
    }
  ],
  "formatIssues": [
    { 
      "issue": "Short description", 
      "severity": "high" | "medium" | "low", 
      "fix": "Actionable instruction with specific example", 
      "location": "Section Name", 
      "atsImpact": "Why this hurts parsing",
      "priority": <number 1-10>
    }
  ],
  "metricSuggestions": [
    { 
      "tech": "Skill/Tool mentioned in resume", 
      "currentUsage": "How it's currently mentioned (if at all)",
      "suggestedMetric": "Specific template with [placeholders]",
      "example": "Real-world example of strong usage",
      "impact": "Why this matters for ATS/recruiters"
    }
  ],
  "analysis": "Markdown formatted report string. Use H1, H2, H3 for structure. Be direct and encouraging but firm on improvements."
}

### ANALYSIS REPORT TEMPLATE (Markdown):
# 🎯 Executive Summary
**Score: [Score]/100** | **Role:** [Category] | **Confidence:** [X]%
[2-3 sentences summarizing the candidate's level and fit. Be specific about strengths and gaps.]

## 🚨 Critical Fixes (Top 3 - Highest Impact)
1. **[Issue]** (+[X] points potential): [Specific fix with example]
2. **[Issue]** (+[X] points potential): [Specific fix with example]
3. **[Issue]** (+[X] points potential): [Specific fix with example]

## 🔑 Keyword Gap Analysis
### Critical Missing (Must Add)
- **[Keyword]** (Appears [X]x in JD): [Specific integration advice]

### Important Missing (Should Add)
- **[Keyword]**: [Context for adding]

### Contextual Improvements
[Advice on improving existing keyword usage with metrics]

## 📊 Content Impact Review
- **Metrics Found:** [X]/8+ quantified achievements. ${hasJobDescription ? 'Target is 10+ for this role.' : 'Target is 8+ for strong resumes.'}
- **STAR Method:** [X]% of bullets follow Situation-Task-Action-Result
- **Action Verbs:** [Comment on strength/weakness with examples]
- **Buzzwords Detected:** [List if any, with replacement suggestions]

## 💡 Smart Metric Suggestions
[For each skill/tech without metrics, provide specific template]

**Example:**
- **Current:** "Experience with Python"
- **Suggested:** "Built data pipeline using Python processing 5TB daily, reducing processing time by 40%"
- **Why it matters:** Demonstrates scale, impact, and technical depth

## 🎯 Pro Tips for [Role]
[Specific, actionable advice tailored to the role category]

## 📈 Competitive Benchmark
- **Your Score:** [Score]%
- **Industry Average:** 62%
- **Top 25% Threshold:** 75%
- **Top 10% Threshold:** 85%

${hasJobDescription ? '**JD Alignment:** [X]% keyword match | [Y] critical skills missing' : ''}

---
**Next Steps:** [Prioritized action items with estimated time to complete]
`;
}

export function buildRewritePrompt(ocrText: string, jobDescription?: string): string {
  return `You are an expert Resume Writer and ATS Optimization Specialist.
Your task is to REWRITE the following resume content to be perfectly optimized for Applicant Tracking Systems (ATS) and human recruiters.

Target Job Description (if any):
"${jobDescription || "General professional optimization"}"

Original Resume Text:
"${ocrText.substring(0, 20000)}"

### INSTRUCTIONS:
1. **STAR Method**: Rewrite every bullet point using the STAR method (Situation, Task, Action, Result).
2. **Quantifiable Impact**: Ensure every bullet point includes a metric (%, $, #) or a clear qualitative result. If exact numbers are missing, use placeholders like "[X]%" or "significant".
3. **Strong Action Verbs**: Start every bullet with a powerful action verb (e.g., "Orchestrated", "Spearheaded", "Engineered"). Avoid passive language like "Responsible for".
4. **Keyword Integration**: Naturally weave in relevant keywords from the JD or industry standards without keyword stuffing.
5. **Formatting**: 
   - Use clear headers: "Professional Summary", "Experience", "Education", "Skills".
   - Keep the layout clean and simple.
6. **Tone**: Professional, confident, and concise.

### OUTPUT FORMAT:
Return ONLY the rewritten resume text in a clean, Markdown format. 
Do not include explanations, preambles, or "Here is the rewritten resume" text. 
Just the resume content.
`;
}

export function buildLinkedInPrompt(profileText: string, jobDescription?: string, linkedinUrl?: string): string {
  return `You are an expert LinkedIn Profile Optimizer and Personal Branding Coach.
Analyze the following LinkedIn profile data against the target Job Description (if provided) to maximize visibility and recruiter engagement.

LinkedIn URL: ${linkedinUrl || "Not provided"}

Target Job Description:
"${jobDescription || "General professional optimization"}"

Profile Text (About, Experience, Skills, etc.):
"${profileText}"

Provide a detailed optimization report in JSON format with the following structure:
{
  "score": number (0-100),
  "headline": {
    "current": "Current headline string",
    "suggested": "Suggested punchy, keyword-rich headline based on top 3 matching keywords",
    "critique": "Why the change is needed"
  },
  "about": {
    "critique": "Analysis of the About section (storytelling, hook, call to action)",
    "suggestions": "Specific improvements",
    "rewritten": "A complete rewrite of the About section to be Recruiter-Search Friendly using identified ATS keywords"
  },
  "experience": {
    "critique": "Analysis of experience descriptions",
    "missingKeywords": ["keyword1", "keyword2"]
  },
  "actionableTips": [
    { "section": "Section Name", "tip": "Specific advice" }
  ]
}

Focus on:
1. **SEO & Discoverability**: Keywords in Headline, About, and Experience.
2. **First Impressions**: Professional headline and engaging About section.
3. **Social Proof**: Recommendations, skills endorsements, and project highlights.
4. **Alignment**: Matching the profile to the target role/industry.
`;
}

export function buildRecruiterDMPrompt(
  profileText: string,
  jobDescription: string,
  recruiterName?: string,
  missingKeywords?: string[]
): string {
  const recruiter = recruiterName || "the Hiring Manager";
  const keywordsContext = missingKeywords && missingKeywords.length > 0 
    ? `Highlight these key skills that might be missing from the resume but are present in the profile: ${missingKeywords.join(", ")}`
    : "";

  return `You are an expert Career Coach and Networking Specialist.
Generate 3 distinct LinkedIn Direct Messages (DMs) to send to ${recruiter} regarding a job application.

**Context:**
- **Candidate Profile:** "${profileText.substring(0, 2000)}..."
- **Target Job:** "${jobDescription.substring(0, 2000)}..."
- **Goal:** Get the recruiter to look at the application/resume.
- **Constraint:** Keep it under 150 words per message.

${keywordsContext}

**Output Format (JSON):**
{
  "variations": [
    {
      "tone": "Casual",
      "subject": "Quick question re: [Role]",
      "content": "..."
    },
    {
      "tone": "Professional",
      "subject": "Application for [Role] - [Candidate Name]",
      "content": "..."
    },
    {
      "tone": "Technical/Direct",
      "subject": "[Skill 1] & [Skill 2] Engineer for [Role]",
      "content": "..."
    }
  ]
}
`;
}