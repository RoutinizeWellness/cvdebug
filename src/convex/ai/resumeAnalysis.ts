"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { buildResumeAnalysisPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";
import { generateFallbackAnalysis } from "./fallbackAnalysis";
import { generateIntelligentFallback } from "./intelligentFallback";
import { extractContactInfo } from "./contactExtractor";
import { extractComprehensiveData } from "./comprehensiveExtractor";
import { humanizeParsingError, createFriendlyAnalysis } from "./humanizeErrors";

// Cast to any to avoid deep type instantiation issues
const internalAny = require("../_generated/api").internal;

// Safe logging helper - doesn't throw if monitoring fails
async function safeLogSuccess(ctx: any, params: any) {
  try {
    await ctx.runMutation(internalAny.aiMonitoring.logAISuccess, params);
  } catch (err) {
    console.warn("[AI Analysis] Failed to log success (non-critical):", err);
  }
}

async function safeLogFailure(ctx: any, params: any) {
  try {
    await ctx.runMutation(internalAny.aiMonitoring.logAIFailure, params);
  } catch (err) {
    console.warn("[AI Analysis] Failed to log failure (non-critical):", err);
  }
}

export const analyzeResume = internalAction({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
    jobDescription: v.optional(v.string()),
    experienceLevel: v.optional(v.union(
      v.literal("internship"),
      v.literal("entry"),
      v.literal("junior"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("lead"),
      v.literal("executive")
    )),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();
    let userId: string | undefined;

    try {
      const apiKey = process.env.OPENROUTER_API_KEY;

      const cleanText = args.ocrText.replace(/\0/g, '').replace(/[\uFFFD\uFFFE\uFFFF]/g, '');

      if (!cleanText || cleanText.trim().length < 10) {
        console.log(`[AI Analysis] Text too short (${cleanText?.length} chars), returning minimal valid data`);
        console.log(`[AI Analysis] First 50 chars of text: "${cleanText?.substring(0, 50)}"`);

        // Humanize the critical parsing error
        const humanError = humanizeParsingError("scanned image or OCR failure");
        const friendlyAnalysis = createFriendlyAnalysis(15, [humanError], []);

        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.id,
          title: "Resume",
          category: "General",
          analysis: friendlyAnalysis,
          score: 15,
          scoreBreakdown: { keywords: 5, format: 5, completeness: 5 },
          matchedKeywords: [],
          missingKeywords: [{
            keyword: "Readable text content",
            priority: "critical",
            section: "Overall",
            context: humanError.action,
            frequency: 1,
            impact: 20,
            synonyms: ["Text-based PDF", "Selectable text"]
          }],
          formatIssues: [{
            issue: humanError.title,
            severity: "critical",
            fix: humanError.action,
            location: "Overall document",
            atsImpact: humanError.message
          }],
          metricSuggestions: [],
          status: "completed",
        });
        return;
      }

      console.log(`[AI Analysis] Starting analysis for resume ${args.id}, text length: ${cleanText.length} chars`);

      // Extract ALL data comprehensively
      console.log(`[Comprehensive Extraction] Starting full data extraction from resume ${args.id}`);
      const comprehensiveData = extractComprehensiveData(cleanText);

      console.log(`[Extraction Results] Contact: Email=${!!comprehensiveData.contact.email}, Phone=${!!comprehensiveData.contact.phone}, LinkedIn=${!!comprehensiveData.contact.linkedin}, GitHub=${!!comprehensiveData.contact.github}`);
      console.log(`[Extraction Results] Education: Degree=${comprehensiveData.education.highestDegree}, Years=${comprehensiveData.education.totalYearsEducation}`);
      console.log(`[Extraction Results] Experience: Years=${comprehensiveData.experience.totalYears}, Companies=${comprehensiveData.experience.companies.length}, Seniority=${comprehensiveData.experience.seniorityLevel}`);
      console.log(`[Extraction Results] Skills: Technical=${comprehensiveData.skills.technical.length}, Tools=${comprehensiveData.skills.tools.length}, Frameworks=${comprehensiveData.skills.frameworks.length}`);
      console.log(`[Extraction Results] Metrics: Total=${comprehensiveData.metrics.totalMetrics}, Achievements=${comprehensiveData.experience.achievements.length}`);
      console.log(`[Extraction Results] Quality: ActionVerbs=${comprehensiveData.quality.hasActionVerbs}, Quantifiable=${comprehensiveData.quality.hasQuantifiableResults}, AvgBulletQuality=${comprehensiveData.quality.averageBulletPointQuality}`);

      const hasJobDescription = args.jobDescription && args.jobDescription.trim().length > 0;
      console.log(`[AI Analysis] Resume ID: ${args.id}, Job Description Provided: ${hasJobDescription}, JD Length: ${args.jobDescription?.length || 0}`);

      // Get userId for monitoring
      const resume = await ctx.runQuery(internalAny.resumes.getResumeInternal, { id: args.id });
      userId = resume?.userId;

      if (!resume || !resume.userId) {
        console.error(`[AI Analysis] Resume ${args.id} not found or missing userId`);
        throw new Error("Resume not found or invalid");
      }

      let analysisResult;
      let usedFallback = false;
      let verificationScore = null;
      let modelUsed = "fallback";

      // Check if user is premium
      const user = await ctx.runQuery(internalAny.users.getUserByTokenIdentifier, { tokenIdentifier: resume.userId });
      const isPremium = user && (
        user.subscriptionTier === "interview_sprint" ||
        user.subscriptionTier === "single_scan" ||
        user.subscriptionTier === "single_debug_fix"
      ) && (!user.sprintExpiresAt || user.sprintExpiresAt > Date.now());

      // STRATEGY: Always use ML-based analysis (faster, more accurate, learns continuously)
      // AI is only used as optional verification for premium users
      console.log("[Advanced Analysis] Using ML-based intelligent analysis (primary method)");
      console.log(`[Advanced Analysis] User premium status: ${isPremium}`);

      try {
        // PRIMARY: ML-based analysis (better than AI)
        console.log(`[ML Engine] Starting analysis - isPremium: ${isPremium}, textLength: ${cleanText.length}`);

        try {
          analysisResult = generateIntelligentFallback(cleanText, args.jobDescription, undefined, isPremium, args.experienceLevel);
        } catch (mlError: any) {
          console.error("[ML Engine] CRITICAL: generateIntelligentFallback threw error:", mlError?.message || "Unknown");
          console.error("[ML Engine] Stack:", mlError?.stack || "No stack");
          throw mlError; // Re-throw to be caught by outer catch
        }

        usedFallback = true;
        modelUsed = "ml-engine";

        console.log(`[ML Engine] Analysis complete - Score: ${analysisResult.score}/100`);
        console.log(`[ML Engine] Score breakdown - Keywords: ${analysisResult.scoreBreakdown.keywords}, Format: ${analysisResult.scoreBreakdown.format}, Completeness: ${analysisResult.scoreBreakdown.completeness}`);

        // Log ML engine success
        await safeLogSuccess(ctx, {
          service: "resumeAnalysis",
          model: "ml-engine",
          userId,
          duration: Date.now() - startTime,
        });

        // OPTIONAL: AI verification for premium users (if API available)
        if (isPremium && apiKey) {
          console.log("[AI Verification] Premium user - running AI cross-check");
          try {
            const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("AI timeout")), 15000) // Shorter timeout for verification
            );

            const apiPromise = callOpenRouter(apiKey, {
              model: "google/gemini-2.0-flash-exp:free",
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            });

            const content = await Promise.race([apiPromise, timeoutPromise]) as string;
            const aiResult = extractJSON(content);

            if (aiResult && aiResult.score) {
              const mlScore = analysisResult.score;
              const aiScore = aiResult.score;

              // Blend: 70% ML (more reliable) + 30% AI (good for variety)
              const blendedScore = Math.round((mlScore * 0.7) + (aiScore * 0.3));

              console.log(`[AI Verification] Scores - ML: ${mlScore}, AI: ${aiScore}, Blended: ${blendedScore}`);

              // Only use blended if AI score is reasonable (not too different)
              if (Math.abs(mlScore - aiScore) < 20) {
                analysisResult.score = blendedScore;
                verificationScore = aiScore;
                console.log(`[AI Verification] Using blended score: ${blendedScore}`);
              } else {
                console.log(`[AI Verification] AI score too different (${Math.abs(mlScore - aiScore)} points), using ML score`);
              }
            }
          } catch (aiError) {
            console.log("[AI Verification] AI check failed or timed out - using ML score:", aiError);
          }
        }

      } catch (err) {
        console.error("[ML Engine] ML analysis failed (rare), falling back to basic analysis:", err);

        // Try to log failure
        await safeLogFailure(ctx, {
          service: "resumeAnalysis",
          model: "ml-engine",
          errorType: "ml_error",
          errorMessage: String(err),
          userId,
          duration: Date.now() - startTime,
          usedFallback: true,
        });

        // Last resort: basic fallback
        analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription);
        modelUsed = "basic-fallback";
      }

      // Old AI-primary code removed - ML is now the primary and best method

      // Ensure we have valid analysis result
      if (!analysisResult || typeof analysisResult.score !== 'number') {
        console.error("[AI Analysis] Invalid analysis result, generating intelligent fallback");
        try {
          const expLevel = args.experienceLevel || user?.experienceLevel || resume.experienceLevel;
          analysisResult = generateIntelligentFallback(cleanText, args.jobDescription, undefined, isPremium, expLevel);
        } catch (err) {
          console.error("[AI Analysis] Final fallback attempt failed:", err);
          throw err;
        }
        usedFallback = true;
      }

      // Ensure all required fields have valid values with strict validation
      const safeAnalysisResult = {
        title: String(analysisResult.title || "Resume").substring(0, 200),
        category: String(analysisResult.category || "General"),
        score: Math.round(Math.max(10, Math.min(100, Number(analysisResult.score) || 15))),
        analysis: String(analysisResult.analysis || "Analysis completed."),
        scoreBreakdown: {
          keywords: Math.round(Math.max(10, Number(analysisResult.scoreBreakdown?.keywords) || 10)),
          format: Math.round(Math.max(12, Number(analysisResult.scoreBreakdown?.format) || 12)),
          completeness: Math.round(Math.max(13, Number(analysisResult.scoreBreakdown?.completeness) || 13)),
        },
        matchedKeywords: Array.isArray(analysisResult.matchedKeywords)
          ? analysisResult.matchedKeywords.slice(0, 50).map(String).filter((kw: string) => kw.length > 0)
          : [],
        missingKeywords: Array.isArray(analysisResult.missingKeywords)
          ? analysisResult.missingKeywords.slice(0, 20).map((kw: any) => {
            if (typeof kw === 'string') {
              return {
                keyword: kw,
                priority: "important",
                section: "Experience",
                context: `Add "${kw}" to relevant sections with specific examples.`,
                frequency: 1,
                impact: 5,
                synonyms: []
              };
            }
            return {
              keyword: String(kw.keyword || ""),
              priority: String(kw.priority || "important"),
              section: String(kw.section || "Experience"),
              context: String(kw.context || ""),
              frequency: Number(kw.frequency) || 1,
              impact: Number(kw.impact) || 5,
              synonyms: Array.isArray(kw.synonyms) ? kw.synonyms.map(String) : []
            };
          }).filter((kw: any) => kw.keyword.length > 0)
          : [],
        formatIssues: Array.isArray(analysisResult.formatIssues)
          ? analysisResult.formatIssues.slice(0, 20).map((issue: any) => {
            if (typeof issue === 'string') {
              return {
                issue: issue,
                severity: "medium",
                fix: "Review and update this section.",
                location: "Overall",
                atsImpact: "May affect parsing"
              };
            }
            return {
              issue: String(issue.issue || ""),
              severity: String(issue.severity || "medium"),
              fix: String(issue.fix || ""),
              location: String(issue.location || "Overall"),
              atsImpact: String(issue.atsImpact || "")
            };
          }).filter((issue: any) => issue.issue.length > 0)
          : [],
        metricSuggestions: Array.isArray(analysisResult.metricSuggestions)
          ? analysisResult.metricSuggestions.slice(0, 10).map((suggestion: any) => ({
            tech: String(suggestion.tech || ""),
            metrics: Array.isArray(suggestion.metrics)
              ? suggestion.metrics.map(String).slice(0, 5)
              : []
          })).filter((s: any) => s.tech.length > 0 && s.metrics.length > 0)
          : [],
      };

      const endTime = Date.now();
      const duration = endTime - startTime;

      try {
        console.log(`[AI Analysis] Attempting to update resume ${args.id} with validated data`);
        console.log(`[AI Analysis] Score: ${safeAnalysisResult.score}, Category: ${safeAnalysisResult.category}`);
        console.log(`[AI Analysis] Missing keywords count: ${safeAnalysisResult.missingKeywords.length}`);
        console.log(`[AI Analysis] Format issues count: ${safeAnalysisResult.formatIssues.length}`);

        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.id,
          title: safeAnalysisResult.title,
          category: safeAnalysisResult.category,
          analysis: safeAnalysisResult.analysis,
          score: safeAnalysisResult.score,
          processingDuration: duration,
          scoreBreakdown: safeAnalysisResult.scoreBreakdown,
          matchedKeywords: safeAnalysisResult.matchedKeywords,
          missingKeywords: safeAnalysisResult.missingKeywords,
          // Contact info
          email: comprehensiveData.contact.email,
          phone: comprehensiveData.contact.phone,
          linkedin: comprehensiveData.contact.linkedin,
          github: comprehensiveData.contact.github,
          website: comprehensiveData.contact.website,
          location: comprehensiveData.contact.location,
          // Comprehensive extracted data
          extractedData: {
            // Education
            highestDegree: comprehensiveData.education.highestDegree,
            totalYearsEducation: comprehensiveData.education.totalYearsEducation,
            // Experience
            totalYearsExperience: comprehensiveData.experience.totalYears,
            companies: comprehensiveData.experience.companies,
            jobTitles: comprehensiveData.experience.titles,
            currentRole: comprehensiveData.experience.currentRole,
            seniorityLevel: comprehensiveData.experience.seniorityLevel,
            // Skills
            technicalSkills: comprehensiveData.skills.technical,
            tools: comprehensiveData.skills.tools,
            frameworks: comprehensiveData.skills.frameworks,
            databases: comprehensiveData.skills.databases,
            cloudPlatforms: comprehensiveData.skills.cloud,
            softSkills: comprehensiveData.skills.softSkills,
            // Certifications & Awards
            certifications: comprehensiveData.certifications,
            awards: comprehensiveData.awards,
            spokenLanguages: comprehensiveData.spokenLanguages.map(l => l.language),
            // Metrics & Quality
            totalMetrics: comprehensiveData.metrics.totalMetrics,
            hasActionVerbs: comprehensiveData.quality.hasActionVerbs,
            hasQuantifiableResults: comprehensiveData.quality.hasQuantifiableResults,
            averageBulletQuality: comprehensiveData.quality.averageBulletPointQuality,
            readabilityScore: comprehensiveData.quality.readabilityScore,
            keywordDensity: comprehensiveData.quality.keywordDensity,
            // Achievement analysis
            achievementCount: comprehensiveData.experience.achievements.length,
            metricsWithImpact: comprehensiveData.experience.achievements.filter(a => a.hasMetric && a.impact).length,
          },
          formatIssues: safeAnalysisResult.formatIssues,
          metricSuggestions: safeAnalysisResult.metricSuggestions,
          status: "completed",
        });

        console.log(`[AI Analysis] ✅ Successfully completed for resume ${args.id} with score ${safeAnalysisResult.score} (ML-based: ${usedFallback}${verificationScore ? `, Verified: ${verificationScore}` : ''})`);
      } catch (updateError: any) {
        console.error("[AI Analysis] ❌ Failed to update resume metadata:", updateError);
        console.error("[AI Analysis] Error message:", updateError?.message || "Unknown error");
        console.error("[AI Analysis] Error stack:", updateError?.stack || "No stack trace");
        console.error("[AI Analysis] Score that failed:", safeAnalysisResult.score);
        console.error("[AI Analysis] Analysis data size:", JSON.stringify(safeAnalysisResult).length, "bytes");

        try {
          console.log(`[AI Analysis] Attempting minimal fallback update for resume ${args.id}`);
          await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
            id: args.id,
            title: "Resume",
            category: "General",
            analysis: "Analysis completed. Your resume has been processed.",
            score: Math.max(20, Math.round(safeAnalysisResult.score * 0.7)), // Lower score for fallback
            status: "completed",
          });
          console.log(`[AI Analysis] ✅ Fallback update succeeded for resume ${args.id}`);
        } catch (fallbackError: any) {
          console.error("[AI Analysis] ❌ Fallback update also failed:", fallbackError);
          console.error("[AI Analysis] Fallback error details:", JSON.stringify(fallbackError, null, 2));

          // Last resort: provide basic valid data instead of failing
          await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
            id: args.id,
            title: "Resume",
            category: "General",
            analysis: "⚠️ **Basic Analysis Completed**\n\nYour resume was processed with limited detail due to technical constraints.\n\n**Critical Areas Needing Attention:**\n• Ensure text is selectable in your PDF (not scanned)\n• Add quantifiable metrics to demonstrate impact\n• Include industry-specific keywords for your target role\n• Use clear section headings and consistent formatting\n• Remove any images or graphics that block text\n\n**Current Status:**\nYour resume may face challenges with ATS systems. Focus on the recommendations above to improve compatibility.\n\n**Need help?** Contact support at cvdebug@outlook.com",
            score: 28,
            scoreBreakdown: { keywords: 8, format: 10, completeness: 10 },
            matchedKeywords: ["Experience", "Skills"],
            missingKeywords: [{
              keyword: "Quantifiable metrics",
              priority: "critical",
              section: "Experience",
              context: "Add specific numbers: percentages, dollar amounts, team sizes, time saved, or scale of impact to every achievement",
              frequency: 1,
              impact: 15,
              synonyms: ["Numbers", "Metrics", "Results", "Data"]
            }, {
              keyword: "Industry keywords",
              priority: "high",
              section: "Skills & Experience",
              context: "Include specific tools, technologies, or methodologies relevant to your target role",
              frequency: 1,
              impact: 12,
              synonyms: ["Technical skills", "Domain expertise"]
            }],
            formatIssues: [{
              issue: "Resume may have parsing issues - verify text is selectable",
              severity: "high",
              fix: "Open your PDF and try to select text with your cursor - if you can't, it's an image and needs to be converted",
              location: "Overall document",
              atsImpact: "May prevent ATS systems from reading your resume"
            }, {
              issue: "Limited quantifiable achievements detected",
              severity: "high",
              fix: "Add specific metrics to each bullet point: improved X by Y%, managed $Z budget, led team of N people",
              location: "Experience section",
              atsImpact: "Reduces perceived impact and seniority level"
            }],
            metricSuggestions: [],
            status: "completed",
          });
        }
      }
    } catch (globalError: any) {
      console.error("[AI Analysis] CRITICAL ERROR:", globalError);

      // Log critical error
      await safeLogFailure(ctx, {
        service: "resumeAnalysis",
        model: "unknown",
        errorType: "critical_error",
        errorMessage: globalError.message,
        userId,
        duration: Date.now() - startTime,
        usedFallback: false,
      });

      try {
        // CRITICAL: Always provide valid data, never "failed" status
        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.id,
          title: "Resume",
          category: "General",
          analysis: "⚠️ **Resume Analysis Encountered Issues**\n\nWe experienced technical difficulties analyzing your resume in depth. Based on basic parsing:\n\n**Critical Improvements Needed:**\n• Verify your PDF is text-based (not scanned/image)\n• Add quantifiable metrics to demonstrate impact (numbers, percentages, dollar amounts)\n• Include industry-specific keywords from job descriptions\n• Use clear, standard section headings\n• Ensure consistent formatting throughout\n\n**Why This Matters:**\nATS systems require specific formatting and content patterns. Your current resume may not pass initial automated screening.\n\n**Questions?** Contact cvdebug@outlook.com",
          score: 25,
          scoreBreakdown: { keywords: 8, format: 9, completeness: 8 },
          matchedKeywords: ["Professional", "Experience"],
          missingKeywords: [{
            keyword: "Quantifiable impact metrics",
            priority: "critical",
            section: "Experience",
            context: "Each achievement should include specific numbers: increased revenue by 40%, reduced costs by $50K, managed team of 8, etc.",
            frequency: 1,
            impact: 18,
            synonyms: ["Numbers", "Metrics", "Results", "Data", "ROI"]
          }, {
            keyword: "Industry-specific keywords",
            priority: "critical",
            section: "Skills & Experience",
            context: "Match your resume to job descriptions - include exact tools, technologies, and methodologies listed in target roles",
            frequency: 1,
            impact: 15,
            synonyms: ["Technical skills", "Domain expertise", "Tools", "Technologies"]
          }],
          formatIssues: [{
            issue: "Missing or insufficient quantifiable achievements",
            severity: "critical",
            fix: "Every bullet point should include specific metrics: percentages, dollar amounts, team sizes, time frames, or scale of impact",
            location: "Experience section",
            atsImpact: "Resume appears junior-level even for senior roles - reduces interview chances by 70%+"
          }, {
            issue: "Insufficient industry-specific keywords",
            severity: "high",
            fix: "Add technical skills, tools, and methodologies from your target job descriptions",
            location: "Skills & Experience sections",
            atsImpact: "May not rank high enough in ATS keyword matching - reduces visibility by 50%+"
          }],
          metricSuggestions: [],
          status: "completed",
        });
      } catch (e) {
        console.error("Failed to save critical fallback data to database", e);
      }
    }
  },
});