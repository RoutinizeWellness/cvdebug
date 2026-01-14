"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const rewriteResumeWithAI = action({
  args: {
    resumeData: v.any(), // Full resume JSON
    keywords: v.array(v.string()),
    seniorityLevel: v.string(),
    targetRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // This would integrate with OpenRouter or use vly.ai.completion
    // For now, return a structured response

    const { resumeData, keywords, seniorityLevel, targetRole } = args;

    // Build the AI prompt
    const systemPrompt = `You are a FAANG Resume Expert and Senior Technical Recruiter.
Your job is to rewrite resume bullets to be highly impactful, quantified, and optimized for ATS systems.

RULES:
1. Start every bullet with a strong action verb (Architected, Led, Engineered, Optimized, etc.)
2. MUST include quantifiable metrics (%, $, time saved, scale, users, etc.)
3. Naturally integrate these keywords: ${keywords.join(", ")}
4. Maintain ${seniorityLevel} tone and language
5. Follow the STAR format implicitly (Situation, Task, Action, Result)
6. No fluff or buzzwords without substance
7. Maximum 2 lines per bullet point
8. Focus on IMPACT and RESULTS, not just responsibilities

Return ONLY valid JSON in this exact format:
{
  "rewrittenBullets": [
    {
      "section": "experience",
      "originalBullet": "...",
      "rewrittenBullet": "...",
      "metricsAdded": ["..."],
      "keywordsIntegrated": ["..."]
    }
  ]
}`;

    // In production, this would call OpenRouter API or vly.ai
    // Example:
    /*
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(resumeData) }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
    */

    // Mock response for now
    return {
      success: true,
      rewrittenBullets: [
        {
          section: "experience",
          originalBullet: "Responsible for managing the development team",
          rewrittenBullet: "Led a cross-functional engineering team of 12 developers, delivering 15 high-impact features and reducing sprint cycle time by 30%",
          metricsAdded: ["12 developers", "15 features", "30% reduction"],
          keywordsIntegrated: keywords.slice(0, 2)
        },
        {
          section: "experience",
          originalBullet: "Worked on backend systems",
          rewrittenBullet: `Architected and scaled microservices infrastructure using ${keywords[0] || "Docker"} and Kubernetes, supporting 10M+ daily requests with 99.9% uptime`,
          metricsAdded: ["10M+ requests", "99.9% uptime"],
          keywordsIntegrated: [keywords[0] || "Docker"]
        }
      ],
      keywordsIntegrated: keywords.length,
      totalBulletsRewritten: 2,
      estimatedImpact: "+25 ATS Score points"
    };
  }
});
