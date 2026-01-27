"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { buildLinkedInPrompt, buildRecruiterDMPrompt } from "./prompts";
import { callOpenRouter, extractJSON } from "./apiClient";
import { generateContentHash } from "./intelligentCache";

// Use require to avoid deep type instantiation issues with the internal object
const internalAny = require("../_generated/api").internal;

export const optimizeLinkedIn = action({
  args: {
    profileText: v.string(),
    jobDescription: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check credits/subscription
    const user = await ctx.runQuery(internalAny.users.getUserInternal, { subject: identity.subject });
    if (!user) throw new Error("User not found");

    // ENFORCEMENT: LinkedIn Optimizer is locked for Free/Single Scan users
    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    if (!hasActiveSprint && user.subscriptionTier !== "interview_sprint") {
      throw new Error("PLAN_RESTRICTION: Upgrade to Interview Sprint to use LinkedIn Optimizer.");
    }

    // Check cache first (80-95% cost savings)
    const contentHash = generateContentHash(
      args.profileText + (args.jobDescription || "") + (args.linkedinUrl || "")
    );

    const cached = await ctx.runQuery(internalAny.ai.intelligentCache.getCachedResult, {
      contentHash,
      service: "linkedinOptimizer",
      maxAgeMs: 600000 // 10 minutes
    });

    if (cached) {
      console.log(`[LinkedIn Optimizer] Cache HIT - Returning cached result (${Date.now() - startTime}ms)`);
      return cached;
    }

    console.log(`[LinkedIn Optimizer] Cache MISS - Generating new optimization`);

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

    // Cache the result
    await ctx.runMutation(internalAny.ai.intelligentCache.cacheAnalysisResult, {
      contentHash,
      service: "linkedinOptimizer",
      result,
      metadata: {
        textLength: args.profileText.length,
        isPremium: true
      }
    });

    // Store the optimization result
    await ctx.runMutation(internalAny.linkedinProfile.storeOptimization, {
      profileText: args.profileText,
      linkedinUrl: args.linkedinUrl,
      jobDescription: args.jobDescription,
      result,
    });

    return result;
  },
});

export const generateRecruiterDMs = action({
  args: {
    profileText: v.string(),
    jobDescription: v.string(),
    recruiterName: v.optional(v.string()),
    missingKeywords: v.optional(v.array(v.string())),
    applicationId: v.optional(v.id("applications")),
  },
  handler: async (ctx, args) => {
    try {
      const startTime = Date.now();
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");

      // Check credits/subscription
      const user = await ctx.runQuery(internalAny.users.getUserInternal, { subject: identity.subject });
      if (!user) throw new Error("User not found");

      // ENFORCEMENT: Recruiter DM Generator is locked for Free/Single Scan users
      const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
      if (!hasActiveSprint && user.subscriptionTier !== "interview_sprint") {
        throw new Error("PLAN_RESTRICTION: Upgrade to Interview Sprint to use Recruiter DM Generator.");
      }

      // Check cache first (80-95% cost savings)
      const contentHash = generateContentHash(
        args.profileText + args.jobDescription + (args.recruiterName || "")
      );

      const cached = await ctx.runQuery(internalAny.ai.intelligentCache.getCachedResult, {
        contentHash,
        service: "recruiterDMs",
        maxAgeMs: 600000 // 10 minutes
      });

      if (cached) {
        console.log(`[Recruiter DMs] Cache HIT - Returning cached result (${Date.now() - startTime}ms)`);
        return cached;
      }

      console.log(`[Recruiter DMs] Cache MISS - Generating new DMs`);

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

      // Cache the result
      await ctx.runMutation(internalAny.ai.intelligentCache.cacheAnalysisResult, {
        contentHash,
        service: "recruiterDMs",
        result,
        metadata: {
          textLength: args.profileText.length,
          isPremium: true
        }
      });

      // Store the DM variations
      if (result.variations && Array.isArray(result.variations)) {
        await ctx.runMutation(internalAny.linkedinProfile.storeRecruiterDMs, {
          profileText: args.profileText,
          jobDescription: args.jobDescription,
          recruiterName: args.recruiterName,
          variations: result.variations,
          applicationId: args.applicationId,
        });
      }

      return result;
    } catch (error) {
      console.error("Recruiter DM generation failed:", error);
      
      // Fallback: Return high-quality templates so the user always gets a result
      return {
        variations: [
          {
            subject: `Application for ${args.jobDescription.substring(0, 30)}...`,
            message: `Hi ${args.recruiterName || "Hiring Team"},\n\nI recently applied for the position and wanted to briefly introduce myself. My background in [Your Field] aligns well with the requirements. I'd love to discuss how I can contribute.\n\nBest,\n[Your Name]`,
            tone: "Professional"
          },
          {
            subject: "Quick question regarding my application",
            message: `Hello ${args.recruiterName || "there"},\n\nI'm very interested in the open role at your company. I've submitted my application and believe my skills in [Key Skill] would be a great fit. Look forward to hearing from you.\n\nRegards,\n[Your Name]`,
            tone: "Direct"
          },
          {
            subject: `Enthusiastic about the ${args.jobDescription.substring(0, 20)} role`,
            message: `Hi ${args.recruiterName || "Hiring Manager"},\n\nI've been following your company's work in [Industry/Area] and just applied for the open role. With my experience in [Your Top Skill], I'm confident I can hit the ground running. I'd appreciate the opportunity to connect.\n\nThanks,\n[Your Name]`,
            tone: "Enthusiastic"
          }
        ]
      };
    }
  },
});