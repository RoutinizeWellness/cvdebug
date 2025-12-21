"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { buildLinkedInPrompt, buildRecruiterDMPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";

// Use require to avoid deep type instantiation issues with the internal object
const internalAny = require("../_generated/api").internal;

export const optimizeLinkedIn = action({
  args: {
    profileText: v.string(),
    jobDescription: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check credits/subscription
    const user = await ctx.runQuery(internalAny.users.getUserInternal, { subject: identity.subject });
    if (!user) throw new Error("User not found");

    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    if (!hasActiveSprint) {
      const currentCredits = user.credits ?? 0;
      if (currentCredits <= 0) {
        throw new Error("CREDITS_EXHAUSTED");
      }
      // Deduct credit
      await ctx.runMutation(internalAny.users.deductCreditInternal, { userId: user._id });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = buildLinkedInPrompt(args.profileText, args.jobDescription, args.linkedinUrl);

    const content = await callOpenRouter(apiKey, {
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = extractJSON(content);
    if (!result) {
        throw new Error("Failed to parse AI response");
    }
    return result;
  },
});

export const generateRecruiterDMs = action({
  args: {
    profileText: v.string(),
    jobDescription: v.string(),
    recruiterName: v.optional(v.string()),
    missingKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check credits/subscription
    const user = await ctx.runQuery(internalAny.users.getUserInternal, { subject: identity.subject });
    if (!user) throw new Error("User not found");

    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    if (!hasActiveSprint) {
      const currentCredits = user.credits ?? 0;
      if (currentCredits <= 0) {
        throw new Error("CREDITS_EXHAUSTED");
      }
      // Deduct credit
      await ctx.runMutation(internalAny.users.deductCreditInternal, { userId: user._id });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = buildRecruiterDMPrompt(
      args.profileText, 
      args.jobDescription, 
      args.recruiterName,
      args.missingKeywords
    );

    const content = await callOpenRouter(apiKey, {
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = extractJSON(content);
    if (!result) {
        throw new Error("Failed to parse AI response");
    }
    return result;
  },
});