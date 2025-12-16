"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { buildRewritePrompt } from "./prompts";
import { callOpenRouter } from "./apiClient";

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
    const resume = await ctx.runQuery(internal.resumes.getResumeInternal, { id: args.id });
    if (!resume || (resume.userId !== identity.subject && identity.email !== "tiniboti@gmail.com")) {
      throw new Error("Unauthorized");
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = buildRewritePrompt(args.ocrText, args.jobDescription);

    try {
      const rewrittenText = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-001",
        messages: [{ role: "user", content: prompt }]
      });

      await ctx.runMutation(internal.resumes.updateResumeMetadata, {
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
