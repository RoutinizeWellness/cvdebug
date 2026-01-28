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
      throw new Error("PLAN_RESTRICTION: Upgrade to Career Sprint to use Keyword Sniper.");
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

    try {
      console.log(`[Keyword Sniper] Generating phrases for: ${args.missingKeyword}`);
      const startTime = Date.now();

      // Call AI with correct signature
      const response = await callOpenRouter(apiKey, {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const duration = Date.now() - startTime;
      console.log(`[Keyword Sniper] ✅ Generated in ${duration}ms`);

      // Parse response
      try {
        const result = JSON.parse(response);
        return {
          keyword: args.missingKeyword,
          phrases: result.phrases || [],
          placementSuggestion: result.placementSuggestion || "Experience",
          priority: result.priority || "important",
        };
      } catch (parseError) {
        console.error("[Keyword Sniper] Failed to parse response:", parseError);
        throw new Error("Invalid AI response format");
      }
    } catch (primaryError: any) {
      console.error("[Keyword Sniper] ❌ Primary AI failed:", primaryError.message);

      // Try fallback model
      try {
        console.log("[Keyword Sniper] Attempting fallback model: deepseek-chat");
        const response = await callOpenRouter(apiKey, {
          model: "deepseek/deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        });

        console.log("[Keyword Sniper] ✅ Fallback model succeeded");

        const result = JSON.parse(response);
        return {
          keyword: args.missingKeyword,
          phrases: result.phrases || [],
          placementSuggestion: result.placementSuggestion || "Experience",
          priority: result.priority || "important",
        };
      } catch (fallbackError: any) {
        console.error("[Keyword Sniper] ❌ Fallback model also failed:", fallbackError.message);

        // Enhanced template-based fallback with context awareness
        const contextHint = resumeText.toLowerCase().includes(args.missingKeyword.toLowerCase())
          ? `building on your existing ${args.missingKeyword} experience`
          : `demonstrating ${args.missingKeyword} expertise`;

        return {
          keyword: args.missingKeyword,
          phrases: [
            {
              text: `Leveraged ${args.missingKeyword} to optimize system performance by 30%, reducing processing time and enhancing user experience across 100K+ daily active users.`,
              metrics: ["30% improvement", "100K+ users"],
              actionVerb: "Leveraged",
              context: `Performance-focused bullet ${contextHint}. Customize with your actual metrics.`
            },
            {
              text: `Implemented ${args.missingKeyword} across 5+ enterprise projects, resulting in $200K annual cost savings and 45% faster delivery cycles.`,
              metrics: ["$200K savings", "45% faster", "5+ projects"],
              actionVerb: "Implemented",
              context: `Business impact bullet emphasizing scale and ROI. Replace with your specific achievements.`
            },
            {
              text: `Led cross-functional team of 8 engineers in adopting ${args.missingKeyword} best practices, achieving 99.9% uptime and serving 2M+ requests per day.`,
              metrics: ["99.9% uptime", "2M+ requests", "8 engineers"],
              actionVerb: "Led",
              context: `Leadership bullet showcasing team impact and reliability. Adjust team size and metrics to match your experience.`
            }
          ],
          placementSuggestion: "Experience",
          priority: "important",
        };
      }
    }
  },
});