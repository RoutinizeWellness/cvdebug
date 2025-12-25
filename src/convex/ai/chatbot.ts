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

    try {
      console.log("[AI Chatbot] Sending request to OpenRouter");
      const startTime = Date.now();
      
      const response = await callOpenRouter(apiKey, {
        model: "google/gemini-2.0-flash-exp:free",
        messages: messages,
      });
      
      const duration = Date.now() - startTime;
      console.log(`[AI Chatbot] ✅ Response received in ${duration}ms`);
      
      return response;
    } catch (error: any) {
      console.error("[AI Chatbot] ❌ Primary AI failed:", error.message);
      
      // Try fallback model
      try {
        console.log("[AI Chatbot] Attempting fallback model: deepseek-chat");
        const response = await callOpenRouter(apiKey, {
          model: "deepseek/deepseek-chat",
          messages: messages,
        });
        
        console.log("[AI Chatbot] ✅ Fallback model succeeded");
        return response;
      } catch (fallbackError: any) {
        console.error("[AI Chatbot] ❌ Fallback model also failed:", fallbackError.message);
        
        // Return helpful static response
        const userMessage = args.message.toLowerCase();
        
        if (userMessage.includes("resume") || userMessage.includes("cv")) {
          return "I'm currently experiencing technical difficulties, but I can offer some general resume advice:\n\n1. **Use strong action verbs** like 'Led', 'Implemented', 'Optimized'\n2. **Quantify achievements** with metrics (%, $, time saved)\n3. **Tailor keywords** to match the job description\n4. **Keep formatting simple** for ATS compatibility\n5. **Focus on impact** rather than just responsibilities\n\nPlease try again in a moment, or contact support if this persists.";
        }
        
        if (userMessage.includes("interview") || userMessage.includes("question")) {
          return "I'm currently experiencing technical difficulties, but here are some universal interview tips:\n\n1. **Use the STAR method** (Situation, Task, Action, Result)\n2. **Prepare 3-5 strong stories** from your experience\n3. **Research the company** thoroughly before the interview\n4. **Ask thoughtful questions** about team culture and challenges\n5. **Practice out loud** to build confidence\n\nPlease try again in a moment, or contact support if this persists.";
        }
        
        if (userMessage.includes("keyword") || userMessage.includes("ats")) {
          return "I'm currently experiencing technical difficulties, but here's quick ATS advice:\n\n1. **Mirror job description keywords** naturally in your resume\n2. **Avoid images and complex formatting** that ATS can't parse\n3. **Use standard section headers** (Experience, Education, Skills)\n4. **Include both acronyms and full terms** (e.g., 'AI (Artificial Intelligence)')\n5. **Save as .docx or PDF** with text layer\n\nPlease try again in a moment, or contact support if this persists.";
        }
        
        return "I'm currently experiencing technical difficulties connecting to the AI service. Please try again in a moment. If this issue persists, please contact support.\n\nIn the meantime, you can:\n- Use the Keyword Sniper tool to analyze your resume\n- Check the ATS Robot Vision for formatting issues\n- Review your Interview Prep battle plan\n- Generate a cover letter for your applications";
      }
    }
  },
});