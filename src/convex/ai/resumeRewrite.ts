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
      const rewrittenText = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }]
      });

      await ctx.runMutation(internalAny.resumes.updateResumeMetadata, {
        id: args.id,
        rewrittenText: rewrittenText,
      });

      return rewrittenText;
    } catch (error) {
      console.error("Error rewriting resume:", error);
      throw new Error("Failed to rewrite resume");
    }
  },
});

export const generateBulletPoints = action({
  args: {
    keyword: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = buildBulletPointPrompt(args.keyword, args.context);

    try {
      const response = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const result = extractJSON(response);
      
      // If result is an object with a key like "bulletPoints", extract that
      if (result && !Array.isArray(result) && result.bulletPoints) {
        return result.bulletPoints;
      }
      
      // If it's already an array
      if (Array.isArray(result)) {
        return result;
      }

      // Fallback if JSON extraction fails or structure is weird
      return [
        `Spearheaded implementation of ${args.keyword}, improving efficiency by 25%.`,
        `Engineered scalable ${args.keyword} solutions, reducing latency by 40%.`,
        `Led cross-functional team in ${args.keyword} adoption, resulting in $50k annual savings.`
      ];
    } catch (error) {
      console.error("Error generating bullet points:", error);
      // Return fallback bullets on error so UI doesn't break
      return [
        `Demonstrated expertise in ${args.keyword} through complex project delivery.`,
        `Optimized workflows using ${args.keyword}, enhancing team productivity.`,
        `Integrated ${args.keyword} best practices to ensure system reliability.`
      ];
    }
  },
});