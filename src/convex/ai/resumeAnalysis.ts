"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { buildResumeAnalysisPrompt } from "./prompts";
import { callOpenRouter, extractJSON, generateFallbackAnalysis } from "./apiClient";

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
        analysis: "Resume text is too short or unreadable. Please try a different file format (PDF/Word).",
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

    if (!apiKey) {
      console.log("[AI Analysis] No OPENROUTER_API_KEY set, using ML-based analysis");
      analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, mlConfig);
      usedFallback = true;
    } else {
      try {
        const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);
        const model = "google/gemini-2.0-flash-exp:free";
        
        console.log(`[AI Analysis] Sending request to OpenRouter with model ${model}`);

        const content = await callOpenRouter(apiKey, {
          model: model,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });
        
        console.log("[AI Analysis] Received response, length:", content.length);

        analysisResult = extractJSON(content);
        console.log("[AI Analysis] Successfully parsed AI response");
        
      } catch (error: any) {
        console.error("[AI Analysis] OpenRouter failed, using ML-based analysis:", error.message);
        analysisResult = generateFallbackAnalysis(cleanText, args.jobDescription, mlConfig);
        usedFallback = true;
      }
    }

    const { title, category, score, scoreBreakdown, missingKeywords, formatIssues, analysis, metricSuggestions } = analysisResult;
    
    await runMutation(ctx, internalAny.resumes.updateResumeMetadata, {
      id: args.id,
      title,
      category,
      analysis,
      score,
      scoreBreakdown,
      missingKeywords,
      formatIssues,
      metricSuggestions: metricSuggestions || [],
      status: "completed",
    });
    
    console.log(`[AI Analysis] Successfully completed for resume ${args.id} with score ${score} (ML-based: ${usedFallback})`);
  },
});