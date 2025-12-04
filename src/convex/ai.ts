"use node";

import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const analyzeScreenshot = internalAction({
  args: {
    id: v.id("screenshots"),
    ocrText: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.log("No OPENROUTER_API_KEY set, skipping AI analysis");
      await ctx.runMutation(internal.screenshots.updateScreenshotMetadata, {
        id: args.id,
        title: "Screenshot",
        category: "Uncategorized",
      });
      return;
    }

    try {
      const prompt = `Analyze the following text extracted from a screenshot and provide a concise, descriptive title (max 5-6 words) and a category.
      Categories: Finance, Development, Meetings, Errors, Social Media, Shopping, Other.
      
      Text:
      ${args.ocrText.substring(0, 2000)}
      
      Return ONLY a JSON object with keys "title" and "category". Do not include markdown formatting or code blocks.`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Clean up markdown code blocks if present to ensure valid JSON (just in case)
      const jsonStr = content.replace(/```json/g, '').replace(/```/g, '');
      
      const parsed = JSON.parse(jsonStr);
      const { title, category } = parsed;
      
      await ctx.runMutation(internal.screenshots.updateScreenshotMetadata, {
        id: args.id,
        title,
        category,
      });
    } catch (error) {
      console.error("Error analyzing screenshot:", error);
      await ctx.runMutation(internal.screenshots.updateScreenshotMetadata, {
        id: args.id,
        title: "Screenshot",
        category: "Uncategorized",
      });
    }
  },
});

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: messages,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
});