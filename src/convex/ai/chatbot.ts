"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { callOpenRouter } from "./apiClient";
// Use require to avoid "Type instantiation is excessively deep and possibly infinite" error
const internalAny = require("../_generated/api").internal;

export const chat = action({
  args: {
    message: v.string(),
    history: v.array(v.object({ role: v.string(), content: v.string() })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check user subscription status via internal query
    const user = await ctx.runQuery(internalAny.users.getUserInternal, { subject: identity.subject });
    
    const hasActiveSprint = user?.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    if (!hasActiveSprint && user?.subscriptionTier !== "interview_sprint") {
      throw new Error("PLAN_RESTRICTION: Upgrade to Interview Sprint to use AI Chat.");
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("AI not configured");

    const messages = args.history.map(h => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.content,
    }));

    messages.push({ role: "user", content: args.message });

    return await callOpenRouter(apiKey, {
      model: "google/gemini-2.0-flash-exp:free",
      messages: messages,
    });
  },
});