"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { generateSpecificRewrites, generateBeforeAfterComparison, generateIndustrySpecificExample, validateRewriteQuality } from "./specificRewriter";
import { extractJobEntities, analyzeGaps } from "./entityExtraction";
import { cosineSimilarity } from "./advancedNLP";

/**
 * Auto-Fix: Generate specific resume rewrites (NO GENERIC BULLSHIT)
 * Uses ML/NLP algorithms to create hyper-specific improvements
 */
export const generateAutoFix = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.string(),
    missingSkills: v.array(v.object({
      text: v.string(),
      category: v.string(),
      importance: v.string()
    })),
    currentScore: v.number(),
    industry: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      console.log('[Auto-Fix] Starting specific rewrite generation...');

      // Step 1: Generate specific rewrites using ML algorithms
      const rewrites = generateSpecificRewrites(
        args.resumeText,
        args.missingSkills,
        args.currentScore
      );

      console.log('[Auto-Fix] Generated rewrites:', {
        instructionCount: rewrites.instructions.length,
        estimatedGain: rewrites.estimatedScoreGain,
        afterScore: rewrites.afterScore
      });

      // Step 2: Generate before/after comparison
      const comparison = generateBeforeAfterComparison(
        args.resumeText,
        rewrites.instructions
      );

      // Step 3: Add industry-specific examples
      const examplesWithIndustry = rewrites.instructions.map(instruction => {
        const skillMatch = args.missingSkills.find(s =>
          instruction.rewrittenText.toLowerCase().includes(s.text.toLowerCase())
        );

        if (skillMatch && args.industry) {
          const industryExample = generateIndustrySpecificExample(
            skillMatch.text,
            args.industry
          );

          return {
            ...instruction,
            industryExample
          };
        }

        return instruction;
      });

      // Step 4: Validate quality (ensure no generic BS)
      const validatedInstructions = examplesWithIndustry.map(instruction => {
        const quality = validateRewriteQuality(instruction.rewrittenText);

        return {
          ...instruction,
          qualityScore: quality.score,
          qualityIssues: quality.issues,
          isValid: quality.isValid
        };
      });

      // Step 5: Generate final optimized resume text
      const optimizedResume = applyRewritesToResume(
        args.resumeText,
        validatedInstructions.filter(i => i.isValid)
      );

      // Step 6: Re-analyze to get new score
      const jobEntities = extractJobEntities(args.jobDescription);
      const newGapAnalysis = analyzeGaps(optimizedResume, jobEntities);

      console.log('[Auto-Fix] New score after optimization:', newGapAnalysis.score);

      return {
        success: true,
        data: {
          instructions: validatedInstructions,
          beforeAfter: comparison,
          beforeScore: rewrites.beforeScore,
          afterScore: newGapAnalysis.score,
          actualScoreGain: newGapAnalysis.score - rewrites.beforeScore,
          optimizedResume,
          stillMissing: newGapAnalysis.missingCritical.map(e => e.text),
          summary: generateSummary(validatedInstructions, rewrites, newGapAnalysis.score)
        }
      };
    } catch (error) {
      console.error('[Auto-Fix] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});

/**
 * Apply rewrites to resume text
 */
function applyRewritesToResume(
  originalResume: string,
  instructions: any[]
): string {
  let optimizedResume = originalResume;

  instructions.forEach(instruction => {
    if (instruction.changeType === 'add_context') {
      // Add new bullet point at the end of the section
      const sectionMatch = optimizedResume.match(new RegExp(`${instruction.section}[\\s\\S]*?(?=\\n\\n|$)`, 'i'));

      if (sectionMatch) {
        const sectionText = sectionMatch[0];
        const updatedSection = sectionText + '\n' + instruction.rewrittenText;

        optimizedResume = optimizedResume.replace(sectionText, updatedSection);
      } else {
        // Section not found, append at end
        optimizedResume += `\n\n${instruction.section}\n${instruction.rewrittenText}`;
      }
    } else if (instruction.changeType === 'add_keyword') {
      // Replace original text with rewritten version
      if (instruction.originalText && instruction.originalText !== '(Nueva bullet point)') {
        const searchText = instruction.originalText.substring(0, 100); // Use first 100 chars
        optimizedResume = optimizedResume.replace(searchText, instruction.rewrittenText);
      }
    }
  });

  return optimizedResume;
}

/**
 * Generate human-readable summary
 */
function generateSummary(
  instructions: any[],
  rewrites: any,
  actualScore: number
): string {
  const validCount = instructions.filter(i => i.isValid).length;
  const invalidCount = instructions.length - validCount;

  const scoreGain = actualScore - rewrites.beforeScore;

  let summary = `✅ Optimización completa:\n\n`;
  summary += `• ${validCount} mejoras específicas aplicadas (${invalidCount} descartadas por ser genéricas)\n`;
  summary += `• Score: ${rewrites.beforeScore}% → ${actualScore}% (+${scoreGain} puntos)\n`;
  summary += `• Nuevo status: ${actualScore >= 85 ? '🎯 Ready to Apply' : actualScore >= 70 ? '⚡ Needs Minor Tweaks' : '⚠️ Needs More Work'}\n\n`;

  if (actualScore >= 85) {
    summary += `🎉 ¡Excelente! Tu CV ahora tiene alta probabilidad de pasar el ATS. Aplica con confianza.\n`;
  } else if (actualScore >= 70) {
    summary += `🔧 Casi listo. Revisa las mejoras sugeridas y personalízalas con TU experiencia real.\n`;
  } else {
    summary += `⚠️ Todavía necesitas trabajo. Considera añadir más experiencia relevante o aplicar a ofertas más alineadas.\n`;
  }

  return summary;
}

/**
 * Preview: Show what will change before user pays
 */
export const previewAutoFix = action({
  args: {
    resumeText: v.string(),
    missingSkills: v.array(v.object({
      text: v.string(),
      category: v.string(),
      importance: v.string()
    })),
    currentScore: v.number()
  },
  handler: async (ctx, args) => {
    try {
      // Generate first 3 rewrites as preview
      const previewSkills = args.missingSkills.slice(0, 3);
      const rewrites = generateSpecificRewrites(
        args.resumeText,
        previewSkills,
        args.currentScore
      );

      const preview = {
        estimatedScoreGain: rewrites.estimatedScoreGain,
        afterScore: rewrites.afterScore,
        sampleRewrites: rewrites.instructions.slice(0, 3).map(i => ({
          section: i.section,
          rewrittenText: i.rewrittenText,
          explanation: i.explanation,
          impactScore: i.impactScore
        })),
        totalChanges: args.missingSkills.length,
        willFix: previewSkills.map(s => s.text),
        remainingSkills: args.missingSkills.slice(3).map(s => s.text)
      };

      return {
        success: true,
        data: preview
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});
