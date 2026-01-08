"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { callOpenRouter, extractJSON } from "./apiClient";

// Cast to any to avoid deep type instantiation issues
const internalAny = require("../_generated/api").internal;

/**
 * AI Bullet Rewriter using the Google XYZ Formula
 * Transforms weak bullet points into impact-driven ones with metrics
 *
 * Formula: "Accomplished [X] as measured by [Y], by doing [Z]"
 * Example: "Led a team of 10, increasing productivity by 25% through implementing agile workflows"
 */
export const rewriteBullet = internalAction({
  args: {
    bulletPoint: v.string(),
    context: v.optional(v.object({
      role: v.optional(v.string()),
      company: v.optional(v.string()),
      industry: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    try {
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY not configured");
      }

      // Build the prompt for bullet rewriting
      const prompt = buildBulletRewritePrompt(args.bulletPoint, args.context);
      const model = "google/gemini-2.0-flash-exp:free";

      console.log(`[Bullet Rewriter] Rewriting bullet: "${args.bulletPoint}"`);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API request timeout after 20s")), 20000)
      );

      const apiPromise = callOpenRouter(apiKey, {
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = (await Promise.race([apiPromise, timeoutPromise])) as string;

      const result = extractJSON(content);

      if (!result || !result.rewritten) {
        throw new Error("Invalid API response structure");
      }

      console.log(`[Bullet Rewriter] Successfully rewrote bullet in ${Date.now() - startTime}ms`);

      // Log success
      await ctx.runMutation(internalAny.aiMonitoring.logAISuccess, {
        service: "bulletRewriter",
        model: model,
        userId: undefined,
        duration: Date.now() - startTime,
      });

      return {
        success: true,
        rewritten: result.rewritten,
        metric: result.metric,
        impact: result.impact,
        alternatives: result.alternatives || [],
      };
    } catch (error: any) {
      console.error("[Bullet Rewriter] Error:", error);

      // Log failure
      await ctx.runMutation(internalAny.aiMonitoring.logAIFailure, {
        service: "bulletRewriter",
        model: "gemini",
        errorType: "api_error",
        errorMessage: error.message,
        userId: undefined,
        duration: Date.now() - startTime,
        usedFallback: false,
      });

      throw new Error(`Failed to rewrite bullet: ${error.message}`);
    }
  },
});

function buildBulletRewritePrompt(bulletPoint: string, context?: { role?: string; company?: string; industry?: string }): string {
  const contextInfo = context
    ? `
Context:
- Role: ${context.role || "Unknown"}
- Company: ${context.company || "Unknown"}
- Industry: ${context.industry || "Unknown"}
`
    : "";

  return `You are an expert resume writer specializing in the Google XYZ formula for writing impactful bullet points.

${contextInfo}

Original bullet point:
"${bulletPoint}"

Rewrite this bullet point using the Google XYZ formula:
"Accomplished [X] as measured by [Y], by doing [Z]"

Where:
- X = What you accomplished (the action/result)
- Y = How you measured it (metrics, numbers, percentages)
- Z = How you did it (the method/approach)

Guidelines:
1. Start with strong action verbs (Led, Increased, Reduced, Implemented, Optimized, etc.)
2. Include specific metrics and numbers (percentages, dollar amounts, time saved, etc.)
3. If the original bullet lacks metrics, make reasonable inferences based on the industry/role
4. Keep it concise (1-2 lines maximum)
5. Focus on impact and results, not just responsibilities
6. Use active voice
7. Avoid weak words like "helped," "participated," "worked on"

Provide 3 variations with different emphasis:
1. Metric-focused (emphasize the numbers)
2. Action-focused (emphasize the approach)
3. Balanced (equal emphasis)

Return your response as valid JSON with this structure:
{
  "rewritten": "The best rewritten version using XYZ formula",
  "metric": "The specific metric/measurement used (e.g., '25% increase', '$50K savings')",
  "impact": "The key impact/accomplishment in one phrase",
  "alternatives": [
    {
      "text": "Metric-focused variation",
      "type": "metric-focused"
    },
    {
      "text": "Action-focused variation",
      "type": "action-focused"
    },
    {
      "text": "Balanced variation",
      "type": "balanced"
    }
  ]
}

Remember: The goal is to transform vague responsibilities into quantifiable achievements that catch recruiters' attention.`;
}
