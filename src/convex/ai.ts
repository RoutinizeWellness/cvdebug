"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeScreenshot = internalAction({
  args: {
    id: v.id("screenshots"),
    ocrText: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.log("No GOOGLE_API_KEY set, skipping AI analysis");
      await ctx.runMutation(internal.screenshots.updateScreenshotMetadata, {
        id: args.id,
        title: "Screenshot",
        category: "Uncategorized",
      });
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Analyze the following text extracted from a screenshot and provide a concise, descriptive title (max 5-6 words) and a category.
      Categories: Finance, Development, Meetings, Errors, Social Media, Shopping, Other.
      
      Text:
      ${args.ocrText.substring(0, 2000)}
      
      Return ONLY a JSON object with keys "title" and "category". Do not include markdown formatting.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Clean up markdown code blocks if present to ensure valid JSON
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
      
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