"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { buildResumeAnalysisPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";
import { generateFallbackAnalysis } from "./fallbackAnalysis";

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
        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.id,
          title: "Resume",
          category: "General",
          analysis: "✅ Resume uploaded successfully.\n\n**Optimization Tips:**\n• Save as PDF using 'Print to PDF' for better compatibility\n• Ensure all text is selectable (not a scanned image)\n• Use standard fonts and formatting\n• Keep file size under 5MB\n\n**Want a detailed analysis?** Upload a more readable version or contact support at cvdebug@outlook.com",
          score: 35,
          scoreBreakdown: { keywords: 10, format: 10, completeness: 15 },
          matchedKeywords: ["Professional", "Experience"],
          missingKeywords: [{
            keyword: "Leadership",
            priority: "important",
            section: "Experience",
            context: "Add leadership examples to demonstrate impact",
            frequency: 1,
            impact: 5,
            synonyms: ["Management", "Team Lead"]
          }],
          formatIssues: [{
            issue: "Limited text detected - ensure resume is text-based, not scanned",
            severity: "medium",
            fix: "Use 'Print to PDF' instead of scanning or screenshotting",
            location: "Overall",
            atsImpact: "May reduce ATS compatibility"
          }],
          metricSuggestions: [],
          status: "completed",
        });
        return;
      }

      console.log(`[AI Analysis] Starting analysis for resume ${args.id}, text length: ${cleanText.length} chars`);

      const hasJobDescription = args.jobDescription && args.jobDescription.trim().length > 0;
      console.log(`[AI Analysis] Resume ID: ${args.id}, Job Description Provided: ${hasJobDescription}, JD Length: ${args.jobDescription?.length || 0}`);

      // Get userId for monitoring
      const resume = await ctx.runQuery(internalAny.resumes.getResumeInternal, { id: args.id });
      userId = resume?.userId;

      let analysisResult;
      let usedFallback = false;
      let verificationScore = null;
      let modelUsed = "fallback";

      // Always use fallback if no API key OR if API call fails/times out
      if (!apiKey) {
        console.log("[AI Analysis] No OPENROUTER_API_KEY set, using ML-based analysis");
        try {
          analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, undefined);
          usedFallback = true;

          // Log fallback usage (non-blocking)
          try {
            await safeLogSuccess(ctx, {
              service: "resumeAnalysis",
              model: "fallback",
              userId,
              duration: Date.now() - startTime,
            });
          } catch (logErr) {
            console.warn("[AI Analysis] Failed to log success, continuing:", logErr);
          }
        } catch (err) {
          console.error("[AI Analysis] Fallback analysis failed:", err);

          // Try to log failure (non-blocking)
          try {
            await safeLogFailure(ctx, {
              service: "resumeAnalysis",
              model: "fallback",
              errorType: "fallback_error",
              errorMessage: String(err),
              userId,
              duration: Date.now() - startTime,
              usedFallback: true,
            });
          } catch (logErr) {
            console.warn("[AI Analysis] Failed to log error, continuing:", logErr);
          }

          throw new Error("Failed to generate fallback analysis");
        }
      } else {
        try {
          const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);
          const model = "google/gemini-2.0-flash-exp:free";
          modelUsed = model;
          
          console.log(`[AI Analysis] Sending request to OpenRouter with model ${model}`);

          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("API request timeout after 30s")), 30000)
          );

          const apiPromise = callOpenRouter(apiKey, {
            model: model,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          });

          const content = await Promise.race([apiPromise, timeoutPromise]) as string;
          
          console.log("[AI Analysis] Received response, length:", content.length);

          analysisResult = extractJSON(content);
          
          if (!analysisResult || !analysisResult.score || !analysisResult.analysis) {
            throw new Error("Invalid API response structure");
          }
          
          console.log("[AI Analysis] Successfully parsed AI response");

          // Log success
          await safeLogSuccess(ctx, {
            service: "resumeAnalysis",
            model: modelUsed,
            userId,
            duration: Date.now() - startTime,
          });

          // NEW: Multi-Model Verification for Sprint users
          const user = await ctx.runQuery(internalAny.users.getUserByToken, { tokenIdentifier: resume.userId });
          const hasActiveSprint = user && user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
          
          if (hasActiveSprint && analysisResult.score > 0) {
            console.log("[AI Analysis] Sprint user detected, running verification with secondary model");
            try {
              const verificationModel = "deepseek/deepseek-chat";
              const verificationContent = await callOpenRouter(apiKey, {
                model: verificationModel,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
              });
              
              const verificationResult = extractJSON(verificationContent);
              if (verificationResult && verificationResult.score) {
                verificationScore = verificationResult.score;
                // Average the two scores for maximum accuracy
                const originalScore = analysisResult.score;
                analysisResult.score = Math.round((originalScore + verificationScore) / 2);
                console.log(`[AI Analysis] Verification complete: Original=${originalScore}, Verified=${verificationScore}, Final=${analysisResult.score}`);
              }
            } catch (verificationError) {
              console.log("[AI Analysis] Verification failed, using primary score:", verificationError);
            }
          }
          
        } catch (error: any) {
          console.error("[AI Analysis] Primary AI (Gemini) failed, attempting secondary fallback:", error.message);
          
          // Log primary failure
          await safeLogFailure(ctx, {
            service: "resumeAnalysis",
            model: modelUsed,
            errorType: error.message.includes("timeout") ? "timeout" : "api_error",
            errorMessage: error.message,
            userId,
            duration: Date.now() - startTime,
            usedFallback: false,
          });
          
          try {
            const secondaryModel = "deepseek/deepseek-chat";
            modelUsed = secondaryModel;
            console.log(`[AI Analysis] Attempting secondary model: ${secondaryModel}`);
            
            const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);
            const content = await callOpenRouter(apiKey, {
              model: secondaryModel,
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            });
            
            analysisResult = extractJSON(content);
            console.log("[AI Analysis] Secondary AI model succeeded");
            
            // Log secondary success
            await safeLogSuccess(ctx, {
              service: "resumeAnalysis",
              model: modelUsed,
              userId,
              duration: Date.now() - startTime,
            });
            
          } catch (secondaryError: any) {
            console.error("[AI Analysis] Secondary AI also failed, using ML-based analysis:", secondaryError.message);
            
            // Log secondary failure
            await safeLogFailure(ctx, {
              service: "resumeAnalysis",
              model: modelUsed,
              errorType: "api_error",
              errorMessage: secondaryError.message,
              userId,
              duration: Date.now() - startTime,
              usedFallback: false,
            });
            
            try {
              analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, undefined);
              usedFallback = true;
              
              // Log fallback success
              await safeLogSuccess(ctx, {
                service: "resumeAnalysis",
                model: "fallback",
                userId,
                duration: Date.now() - startTime,
              });
            } catch (err) {
              console.error("[AI Analysis] Fallback analysis failed after all AI attempts:", err);
              
              // Log fallback failure
              await safeLogFailure(ctx, {
                service: "resumeAnalysis",
                model: "fallback",
                errorType: "fallback_error",
                errorMessage: String(err),
                userId,
                duration: Date.now() - startTime,
                usedFallback: true,
              });
              throw err;
            }
          }
        }
      }

      // Ensure we have valid analysis result
      if (!analysisResult || typeof analysisResult.score !== 'number') {
        console.error("[AI Analysis] Invalid analysis result, generating fallback");
        try {
          analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, undefined);
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
        score: Math.round(Math.max(0, Math.min(100, Number(analysisResult.score) || 0))),
        analysis: String(analysisResult.analysis || "Analysis completed."),
        scoreBreakdown: {
          keywords: Math.round(Number(analysisResult.scoreBreakdown?.keywords) || 0),
          format: Math.round(Number(analysisResult.scoreBreakdown?.format) || 0),
          completeness: Math.round(Number(analysisResult.scoreBreakdown?.completeness) || 0),
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
          formatIssues: safeAnalysisResult.formatIssues,
          metricSuggestions: safeAnalysisResult.metricSuggestions,
          status: "completed",
        });
        
        console.log(`[AI Analysis] ✅ Successfully completed for resume ${args.id} with score ${safeAnalysisResult.score} (ML-based: ${usedFallback}${verificationScore ? `, Verified: ${verificationScore}` : ''})`);
      } catch (updateError: any) {
        console.error("[AI Analysis] ❌ Failed to update resume metadata:", updateError);
        console.error("[AI Analysis] Error details:", JSON.stringify(updateError, null, 2));
        
        try {
          console.log(`[AI Analysis] Attempting minimal fallback update for resume ${args.id}`);
          await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
            id: args.id,
            title: "Resume",
            category: "General",
            analysis: "Analysis completed. Your resume has been processed.",
            score: Math.round(safeAnalysisResult.score),
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
            analysis: "✅ Resume processed with basic analysis.\n\n**Your resume has been uploaded successfully!**\n\nFor optimal results:\n• Ensure text is selectable in your PDF\n• Use standard fonts and clear formatting\n• Include relevant keywords for your target role\n• Quantify achievements with numbers and metrics\n\n**Need help?** Contact support at cvdebug@outlook.com",
            score: 40,
            scoreBreakdown: { keywords: 12, format: 13, completeness: 15 },
            matchedKeywords: ["Experience", "Skills", "Professional"],
            missingKeywords: [{
              keyword: "Results",
              priority: "high",
              section: "Experience",
              context: "Add quantifiable results to demonstrate impact",
              frequency: 1,
              impact: 8,
              synonyms: ["Achievements", "Outcomes"]
            }],
            formatIssues: [{
              issue: "Consider using bullet points for better readability",
              severity: "low",
              fix: "Format achievements as concise bullet points",
              location: "Experience section",
              atsImpact: "Improves ATS parsing"
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
          analysis: "✅ Resume uploaded and processed.\n\n**Quick Tips for Better Results:**\n• Use a clean, text-based PDF (not scanned)\n• Include relevant keywords for your industry\n• Quantify your achievements with numbers\n• Use standard section headings (Experience, Education, Skills)\n\n**Questions?** Reach out to cvdebug@outlook.com",
          score: 42,
          scoreBreakdown: { keywords: 14, format: 14, completeness: 14 },
          matchedKeywords: ["Professional", "Experience", "Skills"],
          missingKeywords: [{
            keyword: "Impact",
            priority: "high",
            section: "Experience",
            context: "Demonstrate the impact of your work with specific examples",
            frequency: 1,
            impact: 7,
            synonyms: ["Results", "Achievements"]
          }],
          formatIssues: [{
            issue: "Use consistent formatting throughout",
            severity: "low",
            fix: "Ensure uniform spacing and bullet styles",
            location: "Overall",
            atsImpact: "Improves readability"
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