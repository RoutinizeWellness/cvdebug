"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { buildLinkedInPrompt, buildRecruiterDMPrompt } from "./prompts";
import { callOpenRouter } from "./apiClient";

export const optimizeLinkedIn = action({
  args: {
    profileText: v.string(),
    jobDescription: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const prompt = buildLinkedInPrompt(args.profileText, args.jobDescription, args.linkedinUrl);

    const content = await callOpenRouter(apiKey, {
      model: "google/gemini-2.0-flash-exp:free",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const jsonStr = content.replace(/"/g, '"');
    return JSON.parse(jsonStr);
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

    return JSON.parse(content);
  },
});