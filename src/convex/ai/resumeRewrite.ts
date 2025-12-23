"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { buildRewritePrompt, buildBulletPointPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("../_generated/api").internal;

export const rewriteResume = action({
  args: {
    id: v.id("resumes"),
    ocrText: v.string(),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verify ownership
    const resume = await ctx.runQuery(internalAny.resumes.getResumeInternal, { id: args.id });
    if (!resume || (resume.userId !== identity.subject && identity.email !== "tiniboti@gmail.com")) {
      throw new Error("Unauthorized");
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = buildRewritePrompt(args.ocrText, args.jobDescription);

    try {
      // Primary: Gemini 2.0 Flash (fast + cheap)
      const rewrittenText = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }]
      });

      await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
        id: args.id,
        rewrittenText: rewrittenText,
      });

      return rewrittenText;
    } catch (primaryError) {
      console.error("Primary AI (Gemini) failed for rewrite, trying fallback:", primaryError);
      
      try {
        // Fallback: DeepSeek or Llama
        const fallbackModel = "deepseek/deepseek-chat";
        const rewrittenText = await callOpenRouter(apiKey, {
          model: fallbackModel,
          messages: [{ role: "user", content: prompt }]
        });

        await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
          id: args.id,
          rewrittenText: rewrittenText,
        });

        return rewrittenText;
      } catch (fallbackError) {
        console.error("Fallback AI also failed for rewrite:", fallbackError);
        throw new Error("Failed to rewrite resume - all AI providers unavailable");
      }
    }
  },
});

export const generateBulletPoints = action({
  args: {
    keyword: v.string(),
    currentContext: v.optional(v.string()),
    context: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    // CRITICAL: Use the user's original context to AUGMENT, not invent
    const userContext = args.currentContext || args.context;

    const prompt = buildBulletPointPrompt(args.keyword, userContext, args.jobDescription);

    try {
      // Primary: Gemini 2.0 Flash (fast + cheap)
      const response = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const result = extractJSON(response);
      
      // Handle the new specific format (Performance, Business, Leadership)
      if (result && (result.performance || result.business || result.leadership)) {
        const bullets = [];
        if (result.performance) bullets.push(result.performance);
        if (result.business) bullets.push(result.business);
        if (result.leadership) bullets.push(result.leadership);
        if (bullets.length > 0) return bullets;
      }

      // If result is an object with a key like "bulletPoints", extract that
      if (result && !Array.isArray(result) && result.bulletPoints) {
        return result.bulletPoints;
      }
      
      // If it's already an array
      if (Array.isArray(result)) {
        return result;
      }

      // Fallback if JSON extraction fails or structure is weird
      const contextHint = userContext ? `based on your experience with ${args.keyword}` : `using ${args.keyword}`;
      return [
        `Spearheaded implementation of ${args.keyword} ${contextHint}, improving efficiency by [X%].`,
        `Engineered scalable solutions with ${args.keyword}, reducing latency by [Y%] and saving [$Z] annually.`,
        `Led cross-functional team in ${args.keyword} adoption, resulting in [metric] improvement.`
      ];
    } catch (primaryError) {
      console.error("Primary AI (Gemini) failed for bullet points, trying fallback:", primaryError);
      
      try {
        // Fallback: DeepSeek or Llama
        const fallbackModel = "deepseek/deepseek-chat";
        const response = await callOpenRouter(apiKey, {
          model: fallbackModel,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });

        const result = extractJSON(response);
        
        // Handle the new specific format (Performance, Business, Leadership)
        if (result && (result.performance || result.business || result.leadership)) {
          const bullets = [];
          if (result.performance) bullets.push(result.performance);
          if (result.business) bullets.push(result.business);
          if (result.leadership) bullets.push(result.leadership);
          if (bullets.length > 0) return bullets;
        }

        if (result && !Array.isArray(result) && result.bulletPoints) {
          return result.bulletPoints;
        }
        
        if (Array.isArray(result)) {
          return result;
        }

        // Final fallback
        const contextHint = userContext ? `based on your experience with ${args.keyword}` : `using ${args.keyword}`;
        return [
          `Spearheaded implementation of ${args.keyword} ${contextHint}, improving efficiency by [X%].`,
          `Engineered scalable solutions with ${args.keyword}, reducing latency by [Y%] and saving [$Z] annually.`,
          `Led cross-functional team in ${args.keyword} adoption, resulting in [metric] improvement.`
        ];
      } catch (fallbackError) {
        console.error("Fallback AI also failed for bullet points:", fallbackError);
        // Return fallback bullets on error so UI doesn't break
        const contextHint = userContext ? `leveraging your ${args.keyword} expertise` : `with ${args.keyword}`;
        return [
          `Demonstrated expertise ${contextHint} through complex project delivery.`,
          `Optimized workflows using ${args.keyword}, enhancing team productivity by [X%].`,
          `Integrated ${args.keyword} best practices to ensure system reliability and [metric].`
        ];
      }
    }
  },
});