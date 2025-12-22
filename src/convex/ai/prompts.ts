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

export function buildKeywordSniperPrompt(
  missingKeyword: string,
  resumeText: string,
  jobDescription: string,
  targetRole: string
): string {
  return `You are an expert Resume Writer and ATS Optimization Specialist.
Your task is to generate 3 REAL, SPECIFIC, and ACTIONABLE bullet point phrases that naturally incorporate the keyword "${missingKeyword}" into a resume.

**Context:**
- **Missing Keyword:** "${missingKeyword}"
- **Target Role:** "${targetRole}"
- **Job Description:** "${jobDescription.substring(0, 1000)}..."
- **Current Resume Excerpt:** "${resumeText.substring(0, 1000)}..."

**Requirements:**
1. Each phrase must follow the STAR method (Situation-Task-Action-Result)
2. Include specific metrics (%, $, #, time saved, users impacted)
3. Use strong action verbs (Architected, Spearheaded, Optimized, etc.)
4. Naturally weave in "${missingKeyword}" without keyword stuffing
5. Make it sound authentic and specific to the role
6. Each phrase should be 1-2 sentences maximum

**Output Format (JSON):**
{
  "keyword": "${missingKeyword}",
  "phrases": [
    {
      "text": "Complete bullet point with ${missingKeyword} naturally integrated",
      "metrics": ["specific metric mentioned"],
      "actionVerb": "primary action verb used",
      "context": "Brief explanation of why this works"
    }
  ],
  "placementSuggestion": "Experience" | "Skills" | "Summary",
  "priority": "critical" | "important" | "nice-to-have"
}

Generate exactly 3 distinct phrases that showcase different aspects of using ${missingKeyword}.`;
}

export const buildRewritePrompt = (text: string, jobDescription?: string) => {
  return `
    You are an expert resume writer. Rewrite the following resume section to be more impactful, 
    using strong action verbs and quantifying achievements where possible.
    ${jobDescription ? `Tailor it to this job description: ${jobDescription}` : ""}
    
    Original Text:
    "${text}"
    
    Return only the rewritten text.
  `;
};

export const buildBulletPointPrompt = (keyword: string, context?: string, jobDescription?: string) => {
  return `Act as a Principal Technical Recruiter and Senior Engineering Lead from a top-tier Silicon Valley firm. Your goal is to transform weak, passive resume bullet points into high-impact, data-driven "Power Statements."

CORE PRINCIPLES:
1. FORMULA: Use the Google XYZ Formula: "Accomplished [X] as measured by [Y], by doing [Z]."
2. ACTION VERBS: Start every bullet with a strong action verb (e.g., Spearheaded, Architected, Orchestrated, Optimized, Engineered). Avoid passive terms like "Responsible for" or "Helped with."
3. METRICS-FIRST: Prioritize quantifiable impact (%, $, time saved, user growth). If the user doesn't provide a number, generate a realistic but marked bracket [X%] to signal them to fill it in.
4. KEYWORD INTEGRATION: Seamlessly weave in the target keyword "${keyword}" without making it look forced for the ATS.
5. SENIOR TONE: Sound authoritative, concise, and focused on business value, not just technical tasks.

TONE GUIDELINES:
- No fluff. No "passionate" or "hard-working."
- Focus on "Ownership" and "Scalability."
- Use industry-standard terminology (e.g., "reduced latency," "driven conversion," "automated infrastructure").

INPUT DATA:
- Context/Experience: "${context ? context.substring(0, 500) : "General professional experience"}"
- Targeted Keywords: "${keyword}"
- Job Role/Context: "${jobDescription ? jobDescription.substring(0, 500) : "General Tech Role"}"

TASK:
Generate 3 distinct versions of a bullet point demonstrating this skill:
1. THE PERFORMANCE VERSION: Focus on speed, efficiency, and technical optimization.
2. THE BUSINESS VERSION: Focus on revenue, user growth, or cost reduction.
3. THE LEADERSHIP VERSION: Focus on ownership, cross-functional collaboration, or mentoring.

OUTPUT FORMAT:
Return only a JSON object:
{
  "performance": "...",
  "business": "...",
  "leadership": "..."
}`;
};

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
    "suggested": "Generate a high-impact LinkedIn Headline based on the top 3 highest-rated keywords from the profile/JD match.",
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