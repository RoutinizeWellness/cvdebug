"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { buildResumeAnalysisPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";
import { generateFallbackAnalysis } from "./fallbackAnalysis";

const runMutation = (ctx: any, fn: any, args: any) => (ctx as any).runMutation(fn, args);
const runQuery = (ctx: any, fn: any, args: any) => (ctx as any).runQuery(fn, args);

const internalAny = require("../_generated/api").internal;

export const analyzeResume = internalAction({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    const cleanText = args.ocrText.replace(/\0/g, '').replace(/[\uFFFD\uFFFE\uFFFF]/g, '');

    if (!cleanText || cleanText.trim().length < 20) {
      console.log(`[AI Analysis] Text too short (${cleanText?.length} chars), marking as failed`);
      await runMutation(ctx, internalAny.resumes.updateResumeMetadata, {
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

    // Fetch ML learning configuration
    let mlConfig;
    try {
      mlConfig = await runQuery(ctx, internalAny.mlLearning.getMLConfig, {});
      console.log("[ML Learning] Loaded adaptive learning configuration");
    } catch (error) {
      console.log("[ML Learning] No configuration found, using defaults");
      mlConfig = undefined;
    }

    let analysisResult;
    let usedFallback = false;

    // Always use fallback if no API key OR if API call fails/times out
    if (!apiKey) {
      console.log("[AI Analysis] No OPENROUTER_API_KEY set, using ML-based analysis");
      analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, mlConfig);
      usedFallback = true;
    } else {
      try {
        const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);
        const model = "google/gemini-2.0-flash-exp:free";
        
        console.log(`[AI Analysis] Sending request to OpenRouter with model ${model}`);

        // Add timeout wrapper - 30 seconds max
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
        
        // Validate the response has required fields
        if (!analysisResult.score || !analysisResult.analysis) {
          throw new Error("Invalid API response structure");
        }
        
        console.log("[AI Analysis] Successfully parsed AI response");
        
      } catch (error: any) {
        console.error("[AI Analysis] OpenRouter failed, using ML-based analysis:", error.message);
        analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, mlConfig);
        usedFallback = true;
      }
    }

    // Ensure we have valid analysis result
    if (!analysisResult || !analysisResult.score) {
      console.error("[AI Analysis] Invalid analysis result, generating fallback");
      analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, mlConfig);
      usedFallback = true;
    }

    const { title, category, score, scoreBreakdown, missingKeywords, formatIssues, analysis, metricSuggestions } = analysisResult;
    
    try {
      await runMutation(ctx, internalAny.resumes.updateResumeMetadata, {
        id: args.id,
        title: title || "Resume",
        category: category || "General",
        analysis: analysis || "Analysis completed.",
        score: score || 0,
        scoreBreakdown,
        missingKeywords,
        formatIssues,
        metricSuggestions: metricSuggestions || [],
        status: "completed",
      });
      
      console.log(`[AI Analysis] Successfully completed for resume ${args.id} with score ${score} (ML-based: ${usedFallback})`);
    } catch (updateError: any) {
      console.error("[AI Analysis] Failed to update resume metadata:", updateError.message);
      // Try one more time with minimal data
      await runMutation(ctx, internalAny.resumes.updateResumeMetadata, {
        id: args.id,
        title: "Resume",
        category: "General",
        analysis: "Analysis completed with errors. Please try re-uploading.",
        score: score || 0,
        status: "completed",
      });
    }
  },
});