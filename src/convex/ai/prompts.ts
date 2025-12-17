export function buildResumeAnalysisPrompt(
  cleanText: string,
  jobDescription?: string
): string {
  const hasJobDescription = jobDescription && jobDescription.trim().length > 0;
  const jobDescriptionContext = hasJobDescription 
    ? `"${jobDescription}"`
    : `"General Industry Standards for the detected role"`;

  return `You are an advanced ATS (Applicant Tracking System) Simulator & Expert Technical Recruiter with ML-enhanced analysis capabilities.
Your goal is to strictly evaluate the resume's machine-readability, content impact, and alignment with the target role.

CONTEXT:
- Job Description: ${jobDescriptionContext}
${hasJobDescription ? '- MODE: TARGETED ANALYSIS. Prioritize keywords and skills explicitly mentioned in the JD.' : '- MODE: GENERAL INDUSTRY ANALYSIS. Evaluate against top-tier standards for the detected role.'}
- RAW PARSED TEXT:
"${cleanText.substring(0, 30000)}"

### SCORING ALGORITHM (0-100):
**Calibration:**
- < 50: Critical issues, unparseable, or irrelevant.
- 50-65: Average, generic duties, lacks metrics.
- 66-79: Good, clear impact, relevant keywords.
- 80-89: Excellent, quantified results, perfect tailoring.
- 90+: Top 1% candidate, exceptional impact & authority.

### COMPONENT 1: Parsing & Format (30 pts)
- **Headers:** Clear standard headers (Experience, Education, Skills) [+8]
- **Chronology:** Consistent reverse-chronological order [+6]
- **Contact:** Full block (Email, Phone, LinkedIn/Portfolio) [+5]
- **Layout:** Clean, single-column, no tables/graphics blocking text [+6]
- **Readability:** Good spacing, bullet points, no walls of text [+5]
*Penalties:* Multi-column [-10], Tables [-8], Inconsistent dates [-5].

### COMPONENT 2: Keywords & Technical Match (40 pts)
${hasJobDescription 
  ? `- **Critical Match:** Identify top 5 hard skills in JD. Missing any = -5 pts each.
- **Contextual Usage:** Keywords must appear in *context* (e.g., "Used React to build..." vs just "React" in a list).
- **Frequency:** High-priority JD keywords should appear multiple times.`
  : `- **Industry Standards:** Check against top 20 skills for the detected role.
- **Authority:** Look for advanced tools/concepts (e.g., "Microservices" vs just "Coding").`}

### COMPONENT 3: Content Impact & Quality (30 pts)
- **Metrics Driven:** 15 pts for 8+ quantified bullets (%, $, #). 0 pts for 0 metrics.
- **Action Verbs:** 8 pts for strong openers (Architected, Spearheaded). 0 for "Responsible for".
- **Completeness:** 7 pts for Education, LinkedIn, Summary, 2+ years exp.

### OUTPUT INSTRUCTIONS:
Return a JSON object. NO markdown formatting.
{
  "title": "Candidate Name / Role",
  "category": "Engineering" | "Software Engineering" | "Marketing" | "Product Management" | "Data Science" | "General",
  "score": <0-100>,
  "scoreBreakdown": { "keywords": <0-40>, "format": <0-30>, "completeness": <0-30> },
  "missingKeywords": [
    { "keyword": "Term", "priority": "critical"|"important", "frequency": <JD count>, "impact": <score gain>, "section": "Experience", "context": "Advice..." }
  ],
  "formatIssues": [
    { "issue": "Name", "severity": "high"|"medium", "fix": "Action", "location": "Section", "atsImpact": "Why it matters" }
  ],
  "metricSuggestions": [
    { "tech": "Skill", "metrics": ["Template 1", "Template 2"] }
  ],
  "analysis": "Markdown report..."
}

### ANALYSIS REPORT STRUCTURE (Markdown):
# 🎯 Executive Summary
**Score: [Score]/100** | **Role:** [Category]
[1-2 sentence high-level summary of the candidate's fit]

## 🚨 Critical Fixes (Top 3)
1. **[Issue]**: [Actionable fix]
2. **[Issue]**: [Actionable fix]
3. **[Issue]**: [Actionable fix]

## 🔑 Keyword Gap Analysis
- **Critical Missing:** [List top 3 missing from JD/Industry]
- **Contextual Improvements:** [Advice on how to use existing keywords better]

## 📊 Content Impact Review
- **Metrics:** Found [X] quantified achievements. Target is 8+.
- **Verbs:** [Strong/Weak]. Replace "Responsible for" with "Orchestrated", "Accelerated".

## 💡 Pro Tips for [Role]
[3 specific, advanced tips for this role type]

IMPORTANT: Return ONLY the raw JSON object. Do not wrap it in markdown code blocks.
`;
}

export function buildRewritePrompt(ocrText: string, jobDescription?: string): string {
  return `You are an expert Resume Writer and ATS Optimization Specialist.
Your task is to REWRITE the following resume content to be perfectly optimized for Applicant Tracking Systems (ATS).

Target Job Description (if any):
"${jobDescription || "General professional optimization"}"

Original Resume Text:
"${ocrText.substring(0, 20000)}"

### INSTRUCTIONS:
1. **Improve Clarity & Impact**: Rewrite bullet points to use strong action verbs and include metrics where possible (e.g., "Increased sales by 20%").
2. **ATS Formatting**: Ensure the text is structured with clear headers (Summary, Experience, Education, Skills).
3. **Keyword Integration**: Naturally weave in relevant keywords from the JD or industry standards.
4. **Fix Grammar & Flow**: Correct any errors and ensure a professional tone.
5. **Output Format**: Return ONLY the rewritten resume text in a clean, Markdown format. Do not include explanations or "Here is the rewritten resume" text. Just the resume.
`;
}

export function buildLinkedInPrompt(profileText: string, jobDescription?: string, linkedinUrl?: string): string {
  return `You are an expert LinkedIn Profile Optimizer and Career Coach.
Analyze the following LinkedIn profile data against the target Job Description (if provided).

LinkedIn URL: ${linkedinUrl || "Not provided"}

Target Job Description:
"${jobDescription || "General professional optimization"}"

Profile Text (About, Experience, Skills, etc.):
"${profileText}"

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
}