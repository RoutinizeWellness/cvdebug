"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { callOpenRouter } from "./ai/apiClient";
import { buildKeywordSniperPrompt } from "./ai/prompts";

// Use require to avoid deep type instantiation issues
const internalAny = require("./_generated/api").internal;

export const generateKeywordPhrases = action({
  args: {
    missingKeyword: v.string(),
    resumeText: v.string(),
    jobDescription: v.string(),
    targetRole: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check user subscription status
    const user = await ctx.runQuery(internalAny.users.getUserInternal, { subject: identity.subject });
    if (!user) throw new Error("User not found");

    // ENFORCEMENT: Keyword Sniper is locked for Free/Single Scan users
    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    if (!hasActiveSprint && user.subscriptionTier !== "interview_sprint") {
      throw new Error("PLAN_RESTRICTION: Upgrade to Interview Sprint to use Keyword Sniper.");
    }

    // Get API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    const resumeText = args.resumeText;
    const jobDescription = args.jobDescription || "General professional standards";
    const targetRole = args.targetRole || "Professional role";

    // Build prompt
    const prompt = buildKeywordSniperPrompt(
      args.missingKeyword,
      resumeText,
      jobDescription,
      targetRole
    );

    // Call AI with correct signature
    const response = await callOpenRouter(apiKey, {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    // Parse response
    try {
      const result = JSON.parse(response);
      return {
        keyword: args.missingKeyword,
        phrases: result.phrases || [],
        placementSuggestion: result.placementSuggestion || "Experience",
        priority: result.priority || "important",
      };
    } catch (error) {
      console.error("Failed to parse Keyword Sniper response:", error);
      
      // Fallback: Generate basic suggestions
      return {
        keyword: args.missingKeyword,
        phrases: [
          {
            text: `Utilized ${args.missingKeyword} to improve system performance by 25%, reducing processing time and enhancing user experience.`,
            metrics: ["25% improvement"],
            actionVerb: "Utilized",
            context: "Generic template - customize with your specific experience"
          },
          {
            text: `Implemented ${args.missingKeyword} across multiple projects, resulting in $50K cost savings and 40% faster delivery times.`,
            metrics: ["$50K savings", "40% faster"],
            actionVerb: "Implemented",
            context: "Focus on business impact and measurable results"
          },
          {
            text: `Led team of 5 engineers in adopting ${args.missingKeyword}, achieving 99.9% uptime and serving 1M+ daily users.`,
            metrics: ["99.9% uptime", "1M+ users"],
            actionVerb: "Led",
            context: "Emphasize leadership and scale"
          }
        ],
        placementSuggestion: "Experience",
        priority: "important",
      };
    }
  },
});