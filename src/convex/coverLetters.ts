import { v } from "convex/values";
import { mutation, query, internalAction } from "./_generated/server";
import { getCurrentUser } from "./users";
import { callOpenRouter, extractJSON } from "./ai/apiClient";

const internalAny = require("./_generated/api").internal;

export const generateCoverLetter = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const application = await ctx.db.get(args.applicationId);
    if (!application || application.userId !== identity.subject) {
      throw new Error("Application not found or unauthorized");
    }

    // ENFORCEMENT: AI Cover Letter is locked for Free/Single Debug Fix users
    // Available for: 24h Pass (unlimited), 7-Day Sprint (unlimited)
    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    const hasAccess = hasActiveSprint ||
                      user.subscriptionTier === "single_scan" ||
                      user.subscriptionTier === "interview_sprint";

    if (!hasAccess) {
      throw new Error("PLAN_RESTRICTION: Upgrade to 24-Hour Pass or Interview Sprint to use AI Cover Letter Generator.");
    }

    // Schedule AI generation
    await ctx.scheduler.runAfter(0, internalAny.coverLetters.generateCoverLetterAI, {
      applicationId: args.applicationId,
      userId: identity.subject,
    });

    return { success: true, message: "Cover letter generation started" };
  },
});

export const generateCoverLetterAI = internalAction({
  args: {
    applicationId: v.id("applications"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    const runQuery = (fn: any, queryArgs: any) => (ctx as any).runQuery(fn, queryArgs);
    const runMutation = (fn: any, mutationArgs: any) => (ctx as any).runMutation(fn, mutationArgs);

    try {
      const application = await runQuery(internalAny.applications.getApplicationInternal, {
        id: args.applicationId,
      });

      if (!application) throw new Error("Application not found");

      const project = await runQuery(internalAny.projects.getProjectInternal, {
        id: application.projectId,
      });

      if (!project || !project.masterCvId) {
        throw new Error("Project or master CV not found");
      }

      const resume = await runQuery(internalAny.resumes.getResumeInternal, {
        id: project.masterCvId,
      });

      if (!resume || !resume.ocrText) {
        throw new Error("Resume text not available");
      }

      const prompt = buildCoverLetterPrompt(
        resume.ocrText,
        application.jobTitle,
        application.companyName,
        application.jobDescriptionText || "",
        application.missingKeywords || []
      );

      console.log("[Cover Letter] Starting AI generation");
      const startTime = Date.now();

      try {
        const content = await callOpenRouter(apiKey, {
          model: "google/gemini-2.0-flash-exp:free",
          messages: [{ role: "user", content: prompt }],
        });

        const duration = Date.now() - startTime;
        console.log(`[Cover Letter] ✅ Generated in ${duration}ms`);

        // Check existing cover letters for versioning
        const existingLetters = await runQuery(internalAny.coverLetters.getCoverLettersByApplication, {
          applicationId: args.applicationId,
        });

        const version = existingLetters.length + 1;

        await runMutation(internalAny.coverLetters.saveCoverLetter, {
          applicationId: args.applicationId,
          userId: args.userId,
          content,
          version,
          keywordsBridged: application.missingKeywords || [],
        });

      } catch (primaryError: any) {
        console.error("[Cover Letter] ❌ Primary AI failed:", primaryError.message);
        
        // Try fallback model
        try {
          console.log("[Cover Letter] Attempting fallback model: deepseek-chat");
          const content = await callOpenRouter(apiKey, {
            model: "deepseek/deepseek-chat",
            messages: [{ role: "user", content: prompt }],
          });

          console.log("[Cover Letter] ✅ Fallback model succeeded");

          const existingLetters = await runQuery(internalAny.coverLetters.getCoverLettersByApplication, {
            applicationId: args.applicationId,
          });

          const version = existingLetters.length + 1;

          await runMutation(internalAny.coverLetters.saveCoverLetter, {
            applicationId: args.applicationId,
            userId: args.userId,
            content,
            version,
            keywordsBridged: application.missingKeywords || [],
          });

        } catch (fallbackError: any) {
          console.error("[Cover Letter] ❌ Fallback model also failed:", fallbackError.message);
          
          // Generate template-based cover letter
          const templateContent = generateTemplateCoverLetter(
            application.jobTitle,
            application.companyName,
            application.missingKeywords || []
          );

          console.log("[Cover Letter] ✅ Using template fallback");

          const existingLetters = await runQuery(internalAny.coverLetters.getCoverLettersByApplication, {
            applicationId: args.applicationId,
          });

          const version = existingLetters.length + 1;

          await runMutation(internalAny.coverLetters.saveCoverLetter, {
            applicationId: args.applicationId,
            userId: args.userId,
            content: templateContent,
            version,
            keywordsBridged: application.missingKeywords || [],
          });
        }
      }
    } catch (error: any) {
      console.error("[Cover Letter] ❌ CRITICAL ERROR:", error.message);
      throw error;
    }
  },
});

function buildCoverLetterPrompt(
  resumeText: string,
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  missingKeywords: string[]
): string {
  // ML Algorithm 1: Extract company insights from job description
  const companyInsights = extractCompanyInsights(jobDescription, companyName);

  // ML Algorithm 2: Identify strongest achievements from resume
  const achievements = extractTopAchievements(resumeText);

  // ML Algorithm 3: Analyze job requirements priority
  const requirements = analyzeRequirementPriority(jobDescription);

  // ML Algorithm 4: Generate keyword integration strategy
  const keywordStrategy = generateKeywordIntegrationPlan(missingKeywords, resumeText);

  return `You are an AI-powered Cover Letter Generator using Machine Learning algorithms for ATS optimization and persuasion psychology.

**ML-ANALYZED DATA:**

Target Role: ${jobTitle} at ${companyName}
Detected Company Values: ${companyInsights.values.join(", ")}
Company Keywords: ${companyInsights.keywords.join(", ")}

**CANDIDATE'S STRONGEST ACHIEVEMENTS (ML-RANKED):**
${achievements.map((a, i) => `${i + 1}. ${a}`).join("\n")}

**JOB REQUIREMENTS (AI-PRIORITIZED):**
High Priority: ${requirements.high.join(", ")}
Medium Priority: ${requirements.medium.join(", ")}

**MISSING KEYWORDS (MUST INTEGRATE):**
${keywordStrategy.map(k => `- ${k.keyword}: ${k.integrationContext}`).join("\n")}

**FULL JOB DESCRIPTION:**
${jobDescription.substring(0, 3000)}

**RESUME EXCERPT:**
${resumeText.substring(0, 4000)}

**AI GENERATION INSTRUCTIONS:**
Use the following ML-optimized framework:

1. **Opening Hook (Psychological Trigger):**
   - Reference specific company value/initiative found in analysis
   - Create immediate relevance connection
   - Use power words: "excited", "passionate", "proven track record"

2. **Achievement Bridge (Pattern Matching):**
   - Map candidate's strongest achievements to high-priority requirements
   - Use STAR method with quantifiable metrics
   - Naturally integrate 3-5 missing keywords with specific examples
   - Format: "My experience [KEYWORD] resulted in [METRIC]"

3. **Value Proposition (NLP-Optimized):**
   - Highlight unique differentiators
   - Address medium-priority requirements
   - Show cultural fit with company values
   - Use industry-specific terminology

4. **Strong Close (Call-to-Action):**
   - Express genuine enthusiasm
   - Confidently request next steps
   - Reinforce key value proposition

**OUTPUT REQUIREMENTS:**
- 3-4 paragraphs, 250-300 words
- ATS score: 85%+ (keyword density 2-3%)
- Professional yet personable tone
- No clichés ("detail-oriented", "team player")
- Return ONLY the letter, no preamble

Generate the cover letter now:`;
}

// ML Algorithm 1: Extract company insights
function extractCompanyInsights(jobDescription: string, companyName: string) {
  const jd = jobDescription.toLowerCase();

  const values: string[] = [];
  const keywords: string[] = [];

  // Value detection patterns
  const valuePatterns = [
    { pattern: /\b(innovation|innovative|cutting.?edge)\b/gi, value: "Innovation" },
    { pattern: /\b(collaboration|collaborative|team)\b/gi, value: "Collaboration" },
    { pattern: /\b(growth|scale|scaling)\b/gi, value: "Growth-oriented" },
    { pattern: /\b(impact|meaningful|mission)\b/gi, value: "Impact-driven" },
    { pattern: /\b(customer|user.?centric|user.?focused)\b/gi, value: "Customer-focused" },
  ];

  valuePatterns.forEach(({ pattern, value }) => {
    if (pattern.test(jd)) {
      values.push(value);
    }
  });

  // Extract repeated important keywords
  const importantTerms = jd.match(/\b[a-z]{4,}\b/g) || [];
  const frequency: Record<string, number> = {};

  importantTerms.forEach((term: string) => {
    if (term.length > 5 && !['where', 'there', 'their', 'about', 'would', 'should'].includes(term)) {
      frequency[term] = (frequency[term] || 0) + 1;
    }
  });

  // Get top 5 most frequent keywords
  Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([term]) => keywords.push(term));

  return {
    values: values.slice(0, 3),
    keywords: keywords.length > 0 ? keywords : [companyName.toLowerCase()]
  };
}

// ML Algorithm 2: Extract top achievements
function extractTopAchievements(resumeText: string): string[] {
  const achievements: Array<{ text: string; score: number }> = [];

  // Extract bullet points
  const bullets = resumeText.match(/[•\-\*]\s*([^\n]{30,200})/g) || [];

  bullets.forEach(bullet => {
    let score = 0;
    const cleanBullet = bullet.replace(/^[•\-\*]\s*/, '');

    // Scoring algorithm
    if (/\d+%|\$[\d,]+|\d+x|\d+\+/.test(cleanBullet)) score += 40; // Has metrics
    if (/^(Led|Built|Developed|Improved|Reduced|Increased|Created|Designed|Implemented)/i.test(cleanBullet)) score += 30; // Strong verb
    if (cleanBullet.split(' ').length > 12) score += 20; // Detailed
    if (/\b(team|users|customers|revenue|growth|efficiency)\b/i.test(cleanBullet)) score += 10; // Impact words

    if (score > 40) {
      achievements.push({ text: cleanBullet, score });
    }
  });

  return achievements
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(a => a.text);
}

// ML Algorithm 3: Analyze requirement priority
function analyzeRequirementPriority(jobDescription: string) {
  const jd = jobDescription.toLowerCase();

  const high: string[] = [];
  const medium: string[] = [];

  // High priority indicators
  const highPatterns = /(?:required|must\s+have|essential|critical):\s*([^\n.]{10,100})/gi;
  let match;
  while ((match = highPatterns.exec(jd)) !== null) {
    if (match[1]) high.push(match[1].trim());
  }

  // Medium priority
  const mediumPatterns = /(?:preferred|nice\s+to\s+have|plus|bonus):\s*([^\n.]{10,100})/gi;
  while ((match = mediumPatterns.exec(jd)) !== null) {
    if (match[1]) medium.push(match[1].trim());
  }

  // If no explicit indicators, extract from first sentences
  if (high.length === 0) {
    const sentences = jobDescription.split(/[.!?]/);
    high.push(...sentences.slice(0, 2).map(s => s.trim()).filter(s => s.length > 20));
  }

  return {
    high: high.slice(0, 3),
    medium: medium.slice(0, 2)
  };
}

// ML Algorithm 4: Generate keyword integration plan
function generateKeywordIntegrationPlan(keywords: string[], resumeText: string) {
  const resume = resumeText.toLowerCase();

  return keywords.slice(0, 5).map(keyword => {
    let integrationContext = "mentioned in my experience";

    // Check if keyword appears in resume for context
    if (resume.includes(keyword.toLowerCase())) {
      integrationContext = "demonstrated through previous projects";
    } else {
      // Suggest related experience
      const relatedTerms = [
        { term: 'leadership', context: "led teams of" },
        { term: 'python', context: "developed with" },
        { term: 'scale', context: "scaled systems handling" },
        { term: 'cloud', context: "architected on AWS/Azure" },
      ];

      const related = relatedTerms.find(r => keyword.toLowerCase().includes(r.term));
      if (related) {
        integrationContext = related.context;
      }
    }

    return {
      keyword,
      integrationContext
    };
  });
}

function generateTemplateCoverLetter(
  jobTitle: string,
  companyName: string,
  missingKeywords: string[]
): string {
  const keywordPhrase = missingKeywords.length > 0 
    ? `My experience with ${missingKeywords.slice(0, 3).join(", ")} aligns well with your requirements.`
    : "My technical background aligns well with your requirements.";

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With a proven track record of delivering high-impact results and driving innovation, I am confident I can contribute meaningfully to your team.

${keywordPhrase} Throughout my career, I have consistently demonstrated the ability to tackle complex challenges, collaborate effectively with cross-functional teams, and deliver projects that exceed expectations. I am particularly drawn to ${companyName}'s commitment to excellence and innovation.

I would welcome the opportunity to discuss how my skills and experience can benefit your organization. Thank you for considering my application. I look forward to the possibility of contributing to ${companyName}'s continued success.

Best regards,
[Your Name]

---
Note: This is a template cover letter generated due to temporary AI service unavailability. Please customize it with your specific experiences and achievements for best results.`;
}

export const saveCoverLetter = mutation({
  args: {
    applicationId: v.id("applications"),
    userId: v.string(),
    content: v.string(),
    version: v.number(),
    keywordsBridged: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const letterId = await ctx.db.insert("coverLetters", {
      applicationId: args.applicationId,
      userId: args.userId,
      content: args.content,
      generatedAt: Date.now(),
      version: args.version,
      keywordsBridged: args.keywordsBridged,
    });

    // Link to application
    await ctx.db.patch(args.applicationId, {
      coverLetterId: letterId,
    });

    return letterId;
  },
});

export const getCoverLettersByApplication = query({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("coverLetters")
      .withIndex("by_application", (q) => q.eq("applicationId", args.applicationId))
      .order("desc")
      .collect();
  },
});