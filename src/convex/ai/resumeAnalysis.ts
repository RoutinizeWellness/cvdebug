"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { buildResumeAnalysisPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";
import { generateFallbackAnalysis } from "./fallbackAnalysis";

// Cast to any to avoid deep type instantiation issues
const internalAny = require("../_generated/api").internal;

export const analyzeResume = internalAction({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      const cleanText = args.ocrText.replace(/\0/g, '').replace(/[\uFFFD\uFFFE\uFFFF]/g, '');

      if (!cleanText || cleanText.trim().length < 20) {
        console.log(`[AI Analysis] Text too short (${cleanText?.length} chars), marking as failed`);
        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.id,
          title: "Resume",
          category: "Uncategorized",
          analysis: "Resume text is too short or unreadable. Please try:\n\n1. Re-save your resume using 'Print to PDF' or 'Save As PDF'\n2. Convert to Word (.docx) format\n3. Ensure the file contains selectable text (not scanned images)\n4. Try a different PDF viewer to re-export the file",
          score: 0,
          status: "failed",
        });
        return;
      }

      console.log(`[AI Analysis] Starting analysis for resume ${args.id}, text length: ${cleanText.length} chars`);

      const hasJobDescription = args.jobDescription && args.jobDescription.trim().length > 0;
      console.log(`[AI Analysis] Resume ID: ${args.id}, Job Description Provided: ${hasJobDescription}, JD Length: ${args.jobDescription?.length || 0}`);

      const startTime = Date.now();

      let analysisResult;
      let usedFallback = false;
      let verificationScore = null;

      // Always use fallback if no API key OR if API call fails/times out
      if (!apiKey) {
        console.log("[AI Analysis] No OPENROUTER_API_KEY set, using ML-based analysis");
        try {
          analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, undefined);
        } catch (err) {
          console.error("[AI Analysis] Fallback analysis failed:", err);
          throw new Error("Failed to generate fallback analysis");
        }
        usedFallback = true;
      } else {
        try {
          const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);
          const model = "google/gemini-2.0-flash-exp:free";
          
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

          // NEW: Multi-Model Verification for Sprint users
          // Check if this is a Sprint user by querying the resume's user
          const resume = await ctx.runQuery(internalAny.resumes.getResumeInternal, { id: args.id });
          if (resume) {
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
          }
          
        } catch (error: any) {
          console.error("[AI Analysis] Primary AI (Gemini) failed, attempting secondary fallback:", error.message);
          
          try {
            const secondaryModel = "deepseek/deepseek-chat";
            console.log(`[AI Analysis] Attempting secondary model: ${secondaryModel}`);
            
            const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);
            const content = await callOpenRouter(apiKey, {
              model: secondaryModel,
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            });
            
            analysisResult = extractJSON(content);
            console.log("[AI Analysis] Secondary AI model succeeded");
            
          } catch (secondaryError: any) {
            console.error("[AI Analysis] Secondary AI also failed, using ML-based analysis:", secondaryError.message);
            try {
              analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, undefined);
            } catch (err) {
              console.error("[AI Analysis] Fallback analysis failed after all AI attempts:", err);
              throw err;
            }
            usedFallback = true;
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
          throw fallbackError;
        }
      }
    } catch (globalError: any) {
      console.error("[AI Analysis] CRITICAL ERROR:", globalError);
      try {
        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.id,
          title: "Resume",
          category: "Error",
          analysis: "An unexpected error occurred during analysis. Please try uploading again or contact support if the issue persists.",
          score: 0,
          status: "failed",
        });
      } catch (e) {
        console.error("Failed to report critical error to database", e);
      }
    }
  },
});