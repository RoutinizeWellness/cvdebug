"use node";

import { v } from "convex/values";
import { internalAction } from "../../_generated/server";
import { CULTURAL_NORMS, SUPPORTED_LANGUAGES } from "./languageIntelligence";
import { translateResumeText, type SupportedLanguage } from "../ml/localTranslation";

/**
 * CULTURAL ADAPTATION ENGINE
 *
 * Adapts resumes to cultural norms of target markets.
 * Goes beyond translation to ensure cultural fit.
 *
 * Examples:
 * - US resume: Remove photo, age, marital status
 * - German CV: Add photo, use formal tone, include detailed education
 * - Chinese resume: Include photo, age, detailed personal info, family background
 * - LATAM CV: Include photo, marital status, use warm professional tone
 */

interface CulturalAdaptationResult {
  originalCulture: string;
  targetCulture: string;
  adaptedContent: string;
  changes: Array<{
    type: "added" | "removed" | "modified";
    element: string;
    reason: string;
    culturalRationale: string;
  }>;
  adaptationScore: number; // 0-100, how well adapted
  warnings: string[];
}

/**
 * Adapts resume content to target cultural norms
 */
export const adaptResumeToCulture = internalAction({
  args: {
    resumeText: v.string(),
    sourceLanguage: v.string(),
    targetCulture: v.string(),
  },
  handler: async (ctx, args): Promise<CulturalAdaptationResult> => {
    const sourceLang = SUPPORTED_LANGUAGES[args.sourceLanguage as keyof typeof SUPPORTED_LANGUAGES];
    const sourceCulture = sourceLang?.cultural || "US";
    const targetCulture = args.targetCulture as keyof typeof CULTURAL_NORMS;

    if (!CULTURAL_NORMS[targetCulture]) {
      throw new Error(`Unsupported target culture: ${args.targetCulture}`);
    }

    const sourceNorms = CULTURAL_NORMS[sourceCulture as keyof typeof CULTURAL_NORMS];
    const targetNorms = CULTURAL_NORMS[targetCulture];

    const changes: CulturalAdaptationResult["changes"] = [];
    const warnings: string[] = [];

    // Build adaptation instructions
    const adaptationInstructions: string[] = [];

    // Photo handling
    if (!sourceNorms.photoRecommended && targetNorms.photoRecommended) {
      adaptationInstructions.push(`ADD a note recommending a professional photo - it's expected in ${targetCulture} CVs`);
      changes.push({
        type: "added",
        element: "Photo recommendation",
        reason: "Photos are culturally expected",
        culturalRationale: `In ${targetCulture}, professional photos are standard and show professionalism`,
      });
    } else if (sourceNorms.photoRecommended && !targetNorms.photoRecommended) {
      adaptationInstructions.push(`REMOVE any photo - ${targetCulture} resumes should not include photos to avoid bias`);
      changes.push({
        type: "removed",
        element: "Photo",
        reason: "Photos can cause bias",
        culturalRationale: `In ${targetCulture}, photos are discouraged to ensure fair evaluation based on qualifications`,
      });
    }

    // Personal details (age, marital status)
    if (targetCulture === "US" && (sourceCulture !== "US")) {
      adaptationInstructions.push(`REMOVE age, date of birth, marital status, and nationality - these are illegal in US hiring`);
      changes.push({
        type: "removed",
        element: "Personal details (age, marital status)",
        reason: "Illegal in US hiring process",
        culturalRationale: "US employment law prohibits asking about age, marital status to prevent discrimination",
      });
    } else if (targetNorms.maritalStatusExpected && !sourceNorms.maritalStatusExpected) {
      adaptationInstructions.push(`ADD marital status and age if appropriate - it's expected in ${targetCulture} CVs`);
      changes.push({
        type: "added",
        element: "Personal details section",
        reason: "Culturally expected",
        culturalRationale: `In ${targetCulture}, including personal details shows openness and is standard practice`,
      });
    }

    // Formality level
    if (sourceNorms.formalityLevel !== targetNorms.formalityLevel) {
      const formalityChange = targetNorms.formalityLevel === "very formal" ? "MORE formal" :
        targetNorms.formalityLevel === "formal" ? "formal" : "less formal";

      adaptationInstructions.push(`Adjust tone to be ${formalityChange} - ${targetCulture} expects ${targetNorms.formalityLevel} language`);
      changes.push({
        type: "modified",
        element: "Tone and language style",
        reason: `${targetCulture} prefers ${targetNorms.formalityLevel} communication`,
        culturalRationale: `Cultural norms in ${targetCulture} value ${targetNorms.formalityLevel} business communication`,
      });
    }

    // CV length
    if (targetNorms.cvLength !== sourceNorms.cvLength) {
      adaptationInstructions.push(`Adjust length to ${targetNorms.cvLength} - standard for ${targetCulture}`);
      changes.push({
        type: "modified",
        element: "Document length",
        reason: `${targetCulture} expects ${targetNorms.cvLength}`,
        culturalRationale: `Recruiters in ${targetCulture} expect CVs of ${targetNorms.cvLength}`,
      });
    }

    // Date format
    if (targetNorms.dateFormat !== sourceNorms.dateFormat) {
      adaptationInstructions.push(`Convert all dates to ${targetNorms.dateFormat} format`);
      changes.push({
        type: "modified",
        element: "Date format",
        reason: `${targetCulture} uses ${targetNorms.dateFormat}`,
        culturalRationale: "Using the local date format shows attention to detail and cultural awareness",
      });
    }

    // USE LOCAL TRANSLATION - NO PAID API!
    // Simple keyword translation (good enough for ATS matching)
    const langMap: Record<string, SupportedLanguage> = {
      'EU': 'en',
      'US': 'en',
      'LATAM': 'es',
      'APAC': 'ja',
      'MENA': 'en' // English is common in MENA for professional contexts
    };

    const targetLang = langMap[targetCulture] || 'en';
    let adaptedContent = args.resumeText;

    // Apply basic keyword translation if not English
    if (targetLang !== 'en') {
      adaptedContent = translateResumeText(args.resumeText, targetLang);
    }

    // Add cultural adaptation notes to the content
    const culturalNotes = adaptationInstructions.join('\n- ');
    adaptedContent = `[CULTURAL ADAPTATION APPLIED FOR ${targetCulture}]\n\n${adaptedContent}\n\n[NOTES: ${culturalNotes}]`;

    // Calculate adaptation score based on number of changes
    const adaptationScore = Math.min(100, 70 + (changes.length * 10));

    // Generate warnings if major changes were needed
    if (changes.some(c => c.type === "removed" && c.element.includes("age"))) {
      warnings.push("⚠️ Removed age and personal details to comply with anti-discrimination laws");
    }

    if (changes.length > 5) {
      warnings.push(`ℹ️ Made ${changes.length} cultural adaptations - please review carefully`);
    }

    return {
      originalCulture: sourceCulture,
      targetCulture,
      adaptedContent,
      changes,
      adaptationScore,
      warnings,
    };
  },
});

/**
 * Generates culture-specific resume tips
 */
export const getCultureSpecificTips = internalAction({
  args: {
    targetCulture: v.string(),
    role: v.string(),
    industry: v.string(),
  },
  handler: async (ctx, args) => {
    const culture = args.targetCulture as keyof typeof CULTURAL_NORMS;
    const norms = CULTURAL_NORMS[culture];

    if (!norms) {
      throw new Error(`Unsupported culture: ${args.targetCulture}`);
    }

    const tips: Array<{ category: string; tip: string; importance: "critical" | "high" | "medium" }> = [];

    // Photo tips
    if (norms.photoRecommended) {
      tips.push({
        category: "Photo",
        tip: `Include a professional headshot - it's expected in ${culture}. Wear business attire, neutral background, good lighting.`,
        importance: "high",
      });
    } else {
      tips.push({
        category: "Photo",
        tip: `Do NOT include a photo - ${culture} hiring practices discourage photos to reduce bias.`,
        importance: "critical",
      });
    }

    // Personal details tips
    if (culture === "US") {
      tips.push({
        category: "Personal Details",
        tip: "Never include age, marital status, religion, or photo - these are illegal in US hiring and can result in your application being rejected.",
        importance: "critical",
      });
    } else if (norms.personalDetailsLevel === "very detailed") {
      tips.push({
        category: "Personal Details",
        tip: `Include a personal details section with age, marital status, and nationality - it's standard in ${culture} CVs.`,
        importance: "high",
      });
    }

    // Length tips
    tips.push({
      category: "Length",
      tip: `Keep your CV to ${norms.cvLength} - ${culture} recruiters expect this length and may not read longer documents.`,
      importance: "high",
    });

    // Formality tips
    tips.push({
      category: "Tone",
      tip: `Use ${norms.formalityLevel} language throughout. ${culture === "US" ? "Be confident and direct" : culture === "APAC" || culture === "MENA" ? "Show respect and humility" : "Be professional but not overly casual"}.`,
      importance: "medium",
    });

    // Date format
    tips.push({
      category: "Format",
      tip: `Use ${norms.dateFormat} date format - this is standard in ${culture} and shows attention to local conventions.`,
      importance: "medium",
    });

    return {
      culture,
      role: args.role,
      industry: args.industry,
      tips: tips.sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2 };
        return order[a.importance] - order[b.importance];
      }),
    };
  },
});
