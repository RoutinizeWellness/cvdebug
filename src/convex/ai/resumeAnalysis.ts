"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { buildResumeAnalysisPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";

// Type-safe wrapper to avoid deep type instantiation errors
const runMutation = (ctx: any, fn: any, args: any) => (ctx as any).runMutation(fn, args);

// Cast internal to any to avoid type instantiation issues
const internalAny = require("../_generated/api").internal;

export const analyzeResume = internalAction({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.log("No OPENROUTER_API_KEY set, skipping AI analysis");
      await runMutation(ctx, internalAny.resumes.updateResumeMetadata, {
        id: args.id,
        title: "Resume",
        category: "Uncategorized",
        analysis: "AI not configured.",
        score: 0,
        status: "failed",
      });
      return;
    }

    // Clean OCR text
    const cleanText = args.ocrText.replace(/\0/g, '').replace(/[\uFFFD\uFFFE\uFFFF]/g, '');

    // Sanity check
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

    try {
      const prompt = buildResumeAnalysisPrompt(cleanText, args.jobDescription);

      console.log(`[AI Analysis] Sending request to OpenRouter with model google/gemini-2.0-flash-001`);

      const content = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }]
      });
      
      console.log("DEBUG: AI Raw Response length:", content.length);

      const parsed = extractJSON(content);
      const { title, category, score, scoreBreakdown, missingKeywords, formatIssues, analysis, metricSuggestions } = parsed;
      
      await runMutation(ctx, internalAny.resumes.updateResumeMetadata, {
        id: args.id,
        title,
        category,
        analysis,
        score,
        scoreBreakdown,
        missingKeywords,
        formatIssues,
        metricSuggestions,
        status: "completed",
      });
      
      console.log(`[AI Analysis] Successfully completed for resume ${args.id} with score ${score}`);
      
    } catch (error: any) {
      console.error("[AI Analysis] Error analyzing resume:", error);
      console.error("[AI Analysis] Error stack:", error.stack);
      await runMutation(ctx, internalAny.resumes.updateResumeMetadata, {
        id: args.id,
        title: "Resume",
        category: "Uncategorized",
        analysis: `AI analysis failed: ${error.message || "Unknown error"}. Please try again or contact support.`,
        score: 0,
        scoreBreakdown: { keywords: 0, format: 0, completeness: 0 },
        status: "failed",
      });
      
      throw error;
    }
  },
});