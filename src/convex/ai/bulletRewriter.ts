"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { callOpenRouter, extractJSON } from "./apiClient";

// Cast to any to avoid deep type instantiation issues
const internalAny = require("../_generated/api").internal;

// ============================================================================
// ADVANCED ANALYTICS: Weakness Detection & Context Analysis
// ============================================================================

interface BulletAnalysis {
  weaknessScore: number; // 0-100, higher = weaker
  hasMetrics: boolean;
  hasStrongVerb: boolean;
  hasPassiveLanguage: boolean;
  hasVagueTerms: boolean;
  suggestedFocus: "metrics" | "action" | "impact" | "balanced";
  weaknessReasons: string[];
}

interface ContextAnalysis {
  detectedRole: string;
  detectedIndustry: string;
  isTechnical: boolean;
  isBusiness: boolean;
  isCreative: boolean;
  keywordContext: string[];
  recommendedMetricTypes: string[];
}

/**
 * STEP 1: Analyze bullet weaknesses using advanced regex patterns and statistical scoring
 */
function analyzeBulletWeaknesses(bullet: string): BulletAnalysis {
  let weaknessScore = 0;
  const weaknessReasons: string[] = [];

  // Pattern 1: Check for metrics (percentages, money, numbers)
  const metricPatterns = [
    /\d+%/g,                                    // Percentages: 45%
    /\$[\d,]+(?:\.\d+)?[kmb]?/gi,              // Money: $50K, $1.5M
    /\d+[+]?\s*(?:users|customers|clients|team|people|systems|projects)/gi, // Scale
    /\d+x\s+(?:faster|better|more|improvement)/gi, // Multipliers
    /(?:increased|decreased|reduced|improved|grew)\s+(?:by\s+)?\d+%/gi, // Impact %
  ];
  const hasMetrics = metricPatterns.some(pattern => pattern.test(bullet));
  if (!hasMetrics) {
    weaknessScore += 30; // CRITICAL penalty for no metrics
    weaknessReasons.push("No quantifiable metrics (percentages, money, scale)");
  }

  // Pattern 2: Detect weak/passive verbs (HIGHEST penalty)
  const weakVerbPatterns = [
    /\b(?:responsible\s+for|in\s+charge\s+of|duties\s+include[d]?)\b/gi,
    /\b(?:helped|assisted|participated|contributed|worked\s+on|involved\s+in)\b/gi,
    /\b(?:was|were|had|did)\s+\w+ing\b/gi, // Passive constructions: "was managing"
  ];
  const hasPassiveLanguage = weakVerbPatterns.some(pattern => pattern.test(bullet));
  if (hasPassiveLanguage) {
    weaknessScore += 25;
    weaknessReasons.push("Contains passive/weak verbs (responsible for, helped, worked on)");
  }

  // Pattern 3: Check for strong action verbs
  const strongVerbPatterns = [
    /\b(?:Led|Managed|Drove|Architected|Built|Launched|Scaled|Optimized|Transformed)\b/gi,
    /\b(?:Achieved|Delivered|Implemented|Engineered|Designed|Increased|Reduced|Generated)\b/gi,
    /\b(?:Spearheaded|Pioneered|Orchestrated|Facilitated|Streamlined|Automated)\b/gi,
  ];
  const hasStrongVerb = strongVerbPatterns.some(pattern => pattern.test(bullet));
  if (!hasStrongVerb) {
    weaknessScore += 15;
    weaknessReasons.push("Missing strong action verbs");
  }

  // Pattern 4: Detect vague/fluffy terms
  const vaguePatterns = [
    /\b(?:various|several|multiple|many|some|few)\b/gi,
    /\b(?:things|stuff|activities|tasks|duties|responsibilities)\b/gi,
    /\b(?:good|great|excellent|nice|better)\b/gi, // Subjective without metrics
  ];
  const hasVagueTerms = vaguePatterns.some(pattern => pattern.test(bullet));
  if (hasVagueTerms) {
    weaknessScore += 15;
    weaknessReasons.push("Contains vague terms (various, several, things, good)");
  }

  // Pattern 5: Check bullet length (too short or too long)
  const wordCount = bullet.split(/\s+/).length;
  if (wordCount < 8) {
    weaknessScore += 10;
    weaknessReasons.push("Too short - lacks detail");
  } else if (wordCount > 35) {
    weaknessScore += 5;
    weaknessReasons.push("Too long - needs to be more concise");
  }

  // Determine suggested focus based on analysis
  let suggestedFocus: "metrics" | "action" | "impact" | "balanced";
  if (!hasMetrics) {
    suggestedFocus = "metrics"; // Needs metrics desperately
  } else if (!hasStrongVerb || hasPassiveLanguage) {
    suggestedFocus = "action"; // Needs stronger verbs
  } else if (weaknessScore > 20) {
    suggestedFocus = "impact"; // Needs to emphasize results
  } else {
    suggestedFocus = "balanced"; // Already decent, just polish
  }

  return {
    weaknessScore: Math.min(100, weaknessScore),
    hasMetrics,
    hasStrongVerb,
    hasPassiveLanguage,
    hasVagueTerms,
    suggestedFocus,
    weaknessReasons,
  };
}

/**
 * STEP 2: Detect role and industry context using keyword matching
 */
function analyzeRoleAndIndustry(
  bullet: string,
  context?: { role?: string; industry?: string }
): ContextAnalysis {
  const text = `${bullet} ${context?.role || ""} ${context?.industry || ""}`.toLowerCase();

  // Technical roles detection
  const technicalKeywords = [
    /\b(?:engineer|developer|software|code|api|database|system|architect|devops|backend|frontend)\b/gi,
    /\b(?:react|node|python|java|aws|docker|kubernetes|sql|nosql|ci\/cd)\b/gi,
  ];
  const isTechnical = technicalKeywords.some(pattern => pattern.test(text));

  // Business roles detection
  const businessKeywords = [
    /\b(?:analyst|manager|product|business|strategy|stakeholder|requirements|process)\b/gi,
    /\b(?:revenue|profit|roi|growth|efficiency|optimization|cost\s*savings|budget)\b/gi,
  ];
  const isBusiness = businessKeywords.some(pattern => pattern.test(text));

  // Creative roles detection
  const creativeKeywords = [
    /\b(?:design|creative|ux|ui|brand|visual|content|marketing|campaign)\b/gi,
  ];
  const isCreative = creativeKeywords.some(pattern => pattern.test(text));

  // Extract keywords from bullet
  const keywordContext: string[] = [];
  if (/\b(?:team|led|manage[d]?|mentor)\b/gi.test(text)) keywordContext.push("leadership");
  if (/\b(?:data|analytics|report|dashboard|insight)\b/gi.test(text)) keywordContext.push("data-driven");
  if (/\b(?:customer|user|client|stakeholder)\b/gi.test(text)) keywordContext.push("customer-facing");
  if (/\b(?:process|workflow|efficiency|automation)\b/gi.test(text)) keywordContext.push("process-improvement");
  if (/\b(?:scale|growth|expand|increase)\b/gi.test(text)) keywordContext.push("growth-focused");

  // Recommend metric types based on context
  const recommendedMetricTypes: string[] = [];
  if (isTechnical) {
    recommendedMetricTypes.push("latency reduction", "uptime %", "throughput", "cost savings");
  }
  if (isBusiness) {
    recommendedMetricTypes.push("revenue impact", "ROI", "efficiency gains", "stakeholder satisfaction");
  }
  if (isCreative) {
    recommendedMetricTypes.push("engagement increase", "conversion rate", "brand awareness", "user satisfaction");
  }
  if (keywordContext.includes("leadership")) {
    recommendedMetricTypes.push("team size", "productivity gains", "retention rate");
  }

  // Detect role type
  let detectedRole = context?.role || "Unknown";
  if (isTechnical && detectedRole === "Unknown") detectedRole = "Technical";
  if (isBusiness && detectedRole === "Unknown") detectedRole = "Business";
  if (isCreative && detectedRole === "Unknown") detectedRole = "Creative";

  // Detect industry
  let detectedIndustry = context?.industry || "Unknown";
  if (/\b(?:fintech|finance|banking|trading)\b/gi.test(text)) detectedIndustry = "Finance";
  if (/\b(?:health|medical|patient|clinical)\b/gi.test(text)) detectedIndustry = "Healthcare";
  if (/\b(?:retail|ecommerce|shop|store)\b/gi.test(text)) detectedIndustry = "Retail";
  if (/\b(?:saas|software|cloud|platform)\b/gi.test(text)) detectedIndustry = "SaaS/Tech";

  return {
    detectedRole,
    detectedIndustry,
    isTechnical,
    isBusiness,
    isCreative,
    keywordContext,
    recommendedMetricTypes,
  };
}

/**
 * AI Bullet Rewriter using the Google XYZ Formula with Advanced Analytics
 * Transforms weak bullet points into impact-driven ones with metrics
 *
 * Formula: "Accomplished [X] as measured by [Y], by doing [Z]"
 * Example: "Led a team of 10, increasing productivity by 25% through implementing agile workflows"
 */
export const rewriteBullet = internalAction({
  args: {
    bulletPoint: v.string(),
    context: v.optional(v.object({
      role: v.optional(v.string()),
      company: v.optional(v.string()),
      industry: v.optional(v.string()),
      experienceLevel: v.optional(v.union(v.literal("student"), v.literal("mid"), v.literal("senior"))),
    })),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    try {
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY not configured");
      }

      // STEP 1: Analyze the original bullet for weaknesses
      const analysis = analyzeBulletWeaknesses(args.bulletPoint);

      // STEP 2: Detect role and industry context for tailored suggestions
      const contextAnalysis = analyzeRoleAndIndustry(args.bulletPoint, args.context);

      // STEP 3: Build enhanced prompt with analysis insights
      const prompt = buildBulletRewritePrompt(
        args.bulletPoint,
        args.context,
        analysis,
        contextAnalysis
      );
      const model = "google/gemini-2.0-flash-exp:free";

      console.log(`[Bullet Rewriter] Rewriting bullet: "${args.bulletPoint}"`);
      console.log(`[Bullet Rewriter] Analysis - Weakness Score: ${analysis.weaknessScore}/100, Focus: ${analysis.suggestedFocus}`);
      console.log(`[Bullet Rewriter] Context - Role: ${contextAnalysis.detectedRole}, Industry: ${contextAnalysis.detectedIndustry}`);
      console.log(`[Bullet Rewriter] Issues: ${analysis.weaknessReasons.join(", ")}`);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API request timeout after 20s")), 20000)
      );

      const apiPromise = callOpenRouter(apiKey, {
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = (await Promise.race([apiPromise, timeoutPromise])) as string;

      const result = extractJSON(content);

      if (!result || !result.rewritten) {
        throw new Error("Invalid API response structure");
      }

      console.log(`[Bullet Rewriter] Successfully rewrote bullet in ${Date.now() - startTime}ms`);

      // Log success
      await ctx.runMutation(internalAny.aiMonitoring.logAISuccess, {
        service: "bulletRewriter",
        model: model,
        userId: undefined,
        duration: Date.now() - startTime,
      });

      return {
        success: true,
        rewritten: result.rewritten,
        metric: result.metric,
        impact: result.impact,
        alternatives: result.alternatives || [],
        analysis: {
          weaknessScore: analysis.weaknessScore,
          hasMetrics: analysis.hasMetrics,
          hasStrongVerb: analysis.hasStrongVerb,
          hasPassiveLanguage: analysis.hasPassiveLanguage,
          hasVagueTerms: analysis.hasVagueTerms,
          suggestedFocus: analysis.suggestedFocus,
          weaknessReasons: analysis.weaknessReasons,
        },
        contextAnalysis: {
          detectedRole: contextAnalysis.detectedRole,
          detectedIndustry: contextAnalysis.detectedIndustry,
          recommendedMetricTypes: contextAnalysis.recommendedMetricTypes,
        },
      };
    } catch (error: any) {
      console.error("[Bullet Rewriter] Error:", error);

      // Log failure
      await ctx.runMutation(internalAny.aiMonitoring.logAIFailure, {
        service: "bulletRewriter",
        model: "gemini",
        errorType: "api_error",
        errorMessage: error.message,
        userId: undefined,
        duration: Date.now() - startTime,
        usedFallback: false,
      });

      throw new Error(`Failed to rewrite bullet: ${error.message}`);
    }
  },
});

function buildBulletRewritePrompt(
  bulletPoint: string,
  context?: { role?: string; company?: string; industry?: string; experienceLevel?: "student" | "mid" | "senior" },
  analysis?: BulletAnalysis,
  contextAnalysis?: ContextAnalysis
): string {
  const experienceLevel = context?.experienceLevel || "mid";

  // Build enhanced context with analysis insights
  const contextInfo = `
Context:
- Role: ${contextAnalysis?.detectedRole || context?.role || "Unknown"}
- Company: ${context?.company || "Unknown"}
- Industry: ${contextAnalysis?.detectedIndustry || context?.industry || "Unknown"}
- Experience Level: ${experienceLevel}
- Role Type: ${contextAnalysis?.isTechnical ? "Technical" : contextAnalysis?.isBusiness ? "Business" : contextAnalysis?.isCreative ? "Creative" : "General"}
- Detected Focus Areas: ${contextAnalysis?.keywordContext.join(", ") || "None"}
`;

  // Include analysis insights for AI
  const analysisInsights = analysis ? `
BULLET ANALYSIS (Current Weaknesses):
- Weakness Score: ${analysis.weaknessScore}/100 ${analysis.weaknessScore > 50 ? "(CRITICAL - Major improvements needed)" : analysis.weaknessScore > 30 ? "(HIGH - Significant improvements needed)" : "(MODERATE - Polish needed)"}
- Has Metrics: ${analysis.hasMetrics ? "Yes ✓" : "No ✗ (MUST ADD)"}
- Has Strong Verb: ${analysis.hasStrongVerb ? "Yes ✓" : "No ✗ (MUST FIX)"}
- Has Passive Language: ${analysis.hasPassiveLanguage ? "Yes ✗ (REMOVE)" : "No ✓"}
- Has Vague Terms: ${analysis.hasVagueTerms ? "Yes ✗ (REMOVE)" : "No ✓"}
- Suggested Focus: ${analysis.suggestedFocus.toUpperCase()}
- Key Issues: ${analysis.weaknessReasons.join("; ")}

RECOMMENDED METRIC TYPES for this role/industry:
${contextAnalysis?.recommendedMetricTypes.map(m => `  • ${m}`).join("\n") || "  • General business impact metrics"}
` : "";

  // Personalized guidelines based on experience level
  const experienceGuidelines = {
    student: `
STUDENT LEVEL - Emphasize curiosity, learning, and project impact:
- Highlight academic projects, coursework applications, and personal initiatives
- Focus on technical skills acquired and applied
- Emphasize problem-solving approach and eagerness to learn
- Use metrics related to project scope (e.g., "Built X feature serving Y users")
- Showcase initiative and self-directed learning
- Keywords: "Developed", "Built", "Learned", "Explored", "Contributed"
- Example: "Developed a full-stack web app using React and Node.js, serving 500+ users and reducing manual data entry by 60% through automated workflows"`,

    mid: `
MID-LEVEL - Balance technical skills with measurable results:
- Focus on concrete achievements and proven capabilities
- Include both technical metrics and business impact
- Show ownership of features and processes
- Use metrics that demonstrate scope and impact
- Keywords: "Implemented", "Optimized", "Delivered", "Improved", "Managed"
- Example: "Optimized API response time by 40%, reducing server costs by $15K annually through implementing Redis caching and query optimization"`,

    senior: `
SENIOR LEVEL - AGGRESSIVE ROI and leadership focus:
- Lead with business impact: revenue, cost savings, efficiency gains
- Emphasize team leadership, mentorship, and strategic decisions
- Show cross-functional impact and organizational influence
- Use hard numbers: $XXX saved/generated, X% efficiency gain, Y people led
- Keywords: "Led", "Drove", "Architected", "Scaled", "Transformed"
- Example: "Led cross-functional team of 8 engineers to architect microservices platform, reducing deployment time by 75% and enabling $2M+ in annual revenue through faster feature delivery"
- CRITICAL: Every bullet MUST show either: (1) Money impact ($XXX), (2) People led (X team members), or (3) Scale (X users/systems affected)`
  };

  return `You are an expert resume writer specializing in the Google XYZ formula for writing impactful bullet points with ADVANCED ANALYTICS.

${contextInfo}
${analysisInsights}

Original bullet point:
"${bulletPoint}"

Rewrite this bullet point using the Google XYZ formula:
"Accomplished [X] as measured by [Y], by doing [Z]"

Where:
- X = What you accomplished (the action/result)
- Y = How you measured it (metrics, numbers, percentages)
- Z = How you did it (the method/approach)

${experienceGuidelines[experienceLevel]}

CRITICAL INSTRUCTIONS based on analysis:
${analysis?.suggestedFocus === "metrics" ? "⚠️ PRIMARY FOCUS: ADD QUANTIFIABLE METRICS - The original bullet has NO metrics. You MUST infer reasonable metrics based on the role/industry." : ""}
${analysis?.hasPassiveLanguage ? "⚠️ REMOVE passive language (responsible for, helped with, worked on) and replace with strong action verbs." : ""}
${analysis?.hasVagueTerms ? "⚠️ REMOVE vague terms (various, several, things, good) and replace with specific details." : ""}
${analysis && !analysis.hasStrongVerb ? "⚠️ START with a powerful action verb appropriate for the role type." : ""}

General Guidelines:
1. Start with strong action verbs appropriate for the experience level and role type
2. Include specific metrics and numbers (percentages, dollar amounts, time saved, etc.)
3. If the original bullet lacks metrics, make reasonable inferences based on the industry/role context
4. Keep it concise (1-2 lines maximum, 15-30 words ideal)
5. Focus on impact and results, not just responsibilities
6. Use active voice exclusively
7. Avoid weak words like "helped," "participated," "worked on"
8. Use the RECOMMENDED METRIC TYPES listed above for this specific role/industry

Provide 3 variations with different emphasis (prioritize ${analysis?.suggestedFocus || "balanced"} focus):
1. ${analysis?.suggestedFocus === "metrics" ? "METRIC-FOCUSED (PRIMARY)" : "Metric-focused"} - Heavy emphasis on numbers and results
2. ${analysis?.suggestedFocus === "action" ? "ACTION-FOCUSED (PRIMARY)" : "Action-focused"} - Heavy emphasis on the method and approach
3. ${analysis?.suggestedFocus === "balanced" || analysis?.suggestedFocus === "impact" ? "BALANCED/IMPACT (PRIMARY)" : "Balanced"} - Equal emphasis on all elements

Return your response as valid JSON with this structure:
{
  "rewritten": "The best rewritten version using XYZ formula",
  "metric": "The specific metric/measurement used (e.g., '25% increase', '$50K savings')",
  "impact": "The key impact/accomplishment in one phrase",
  "alternatives": [
    {
      "text": "Metric-focused variation",
      "type": "metric-focused"
    },
    {
      "text": "Action-focused variation",
      "type": "action-focused"
    },
    {
      "text": "Balanced variation",
      "type": "balanced"
    }
  ]
}

Remember: The goal is to transform vague responsibilities into quantifiable achievements that match the experience level and catch recruiters' attention.`;
}
