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

    // ENFORCEMENT: AI Cover Letter is locked for Free/Single Scan users
    // Only Career Sprint users can use this tool
    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();

    if (!hasActiveSprint && user.subscriptionTier !== "interview_sprint") {
      throw new Error("PLAN_RESTRICTION: Upgrade to Career Sprint to use AI Cover Letter Generator.");
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
  return `You are an expert Cover Letter Writer specializing in ATS-optimized applications.

**Task:** Write a compelling, professional cover letter for the following job application.

**Candidate Resume:**
${resumeText.substring(0, 5000)}

**Target Position:** ${jobTitle} at ${companyName}

**Job Description:**
${jobDescription.substring(0, 3000)}

**Critical Missing Keywords (MUST integrate naturally):**
${missingKeywords.slice(0, 10).join(", ")}

**Instructions:**
1. Open with a strong hook that shows genuine interest in ${companyName}
2. Naturally weave in the missing keywords by providing specific examples from past experience
3. Use the STAR method to demonstrate relevant achievements
4. Show how your background aligns with the role requirements
5. Close with a confident call to action
6. Keep it to 3-4 paragraphs, max 300 words
7. Professional but conversational tone

**Output:** Return ONLY the cover letter text, no preamble or explanations.`;
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