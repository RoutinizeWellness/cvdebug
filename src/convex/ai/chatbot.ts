"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { callOpenRouter } from "./apiClient";

export const chat = action({
  args: {
    message: v.string(),
    history: v.array(v.object({ role: v.string(), content: v.string() })),
  },
  handler: async (ctx, args) => {
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
