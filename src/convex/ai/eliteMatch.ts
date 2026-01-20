"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { extractJobEntities, analyzeGaps, type JobDescriptionEntities, type GapAnalysis } from "./entityExtraction";

export const analyzeJobMatch = action({
  args: {
    resumeText: v.string(),
    jobDescription: v.string(),
    jobUrl: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    try {
      console.log('[Elite Match] Starting analysis...');

      // Step 1: Extract entities from job description
      const jobEntities: JobDescriptionEntities = extractJobEntities(args.jobDescription);

      console.log('[Elite Match] Extracted entities:', {
        hardSkills: jobEntities.hardSkills.length,
        softSkills: jobEntities.softSkills.length,
        frameworks: jobEntities.frameworks.length,
        tools: jobEntities.tools.length,
        mustHaves: jobEntities.mustHaves.length
      });

      // Step 2: Analyze gaps between resume and job
      const gapAnalysis: GapAnalysis = analyzeGaps(args.resumeText, jobEntities);

      console.log('[Elite Match] Gap analysis complete:', {
        score: gapAnalysis.score,
        missingCritical: gapAnalysis.missingCritical.length,
        missingImportant: gapAnalysis.missingImportant.length,
        matched: gapAnalysis.matched.length
      });

      // Step 3: Generate Robot View
      const robotView = generateRobotView(args.resumeText, gapAnalysis, jobEntities);

      // Step 4: Format response for frontend
      const response = {
        score: gapAnalysis.score,
        missingCritical: gapAnalysis.missingCritical.map(entity => ({
          text: entity.text,
          category: entity.category,
          importance: entity.importance,
          context: entity.context,
          suggestion: generateSpecificSuggestion(entity, args.resumeText)
        })),
        missingImportant: gapAnalysis.missingImportant.map(entity => ({
          text: entity.text,
          category: entity.category,
          importance: entity.importance,
          suggestion: generateSpecificSuggestion(entity, args.resumeText)
        })),
        matched: gapAnalysis.matched.map(e => e.text),
        robotView,
        recommendations: gapAnalysis.suggestions,
        jobEntities: {
          totalHardSkills: jobEntities.hardSkills.length,
          totalSoftSkills: jobEntities.softSkills.length,
          totalFrameworks: jobEntities.frameworks.length,
          totalTools: jobEntities.tools.length,
          criticalCount: jobEntities.mustHaves.length
        }
      };

      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('[Elite Match] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});

/**
 * Generate Robot View - How ATS prioritizes the resume
 */
function generateRobotView(
  resumeText: string,
  gapAnalysis: GapAnalysis,
  jobEntities: JobDescriptionEntities
) {
  const redZones: string[] = [];
  const greenZones: string[] = [];

  // Red Zones (Blockers)
  gapAnalysis.missingCritical.forEach(entity => {
    if (entity.category === 'hard_skill' || entity.category === 'framework' || entity.category === 'tool') {
      redZones.push(
        `Experience section: Missing ${entity.text} references - Critical blocker for ATS`
      );
    } else if (entity.category === 'soft_skill') {
      redZones.push(
        `Leadership section: No ${entity.text} signals detected - Recruiter red flag`
      );
    }
  });

  if (gapAnalysis.missingCritical.length > 3) {
    redZones.push(
      `Overall: ${gapAnalysis.missingCritical.length} critical skills missing - High rejection risk`
    );
  }

  // Check for missing metrics
  const hasMetrics = /\d+%|\d+\+?.*users?|\$\d+/.test(resumeText);
  if (!hasMetrics) {
    redZones.push(
      `Metrics: No quantifiable achievements found - Resume lacks impact signals`
    );
  }

  // Green Zones (Strengths)
  const matchedHardSkills = gapAnalysis.matched.filter(
    e => e.category === 'hard_skill' || e.category === 'framework' || e.category === 'tool'
  );

  if (matchedHardSkills.length > 0) {
    greenZones.push(
      `Technical skills: Strong match with ${matchedHardSkills.slice(0, 3).map(e => e.text).join(', ')}`
    );
  }

  const matchedSoftSkills = gapAnalysis.matched.filter(e => e.category === 'soft_skill');
  if (matchedSoftSkills.length > 0) {
    greenZones.push(
      `Soft skills: Good coverage of ${matchedSoftSkills.map(e => e.text).join(', ')}`
    );
  }

  // Check years of experience
  const yearsMatch = resumeText.match(/(\d+)\+?\s*years?/i);
  const jobYearsMatch = jobEntities.metrics.find(m => /years?/.test(m.text));

  if (yearsMatch && jobYearsMatch) {
    greenZones.push(
      `Years of experience: Matches requirement (${yearsMatch[1]}+ years found)`
    );
  }

  // Default messages if empty
  if (redZones.length === 0) {
    redZones.push('No critical blockers detected - Resume has good ATS compatibility');
  }

  if (greenZones.length === 0) {
    greenZones.push('Some relevant skills detected, but needs optimization');
  }

  return {
    redZones: redZones.slice(0, 5), // Max 5 red zones
    greenZones: greenZones.slice(0, 5) // Max 5 green zones
  };
}

/**
 * Generate specific suggestion for each missing entity
 */
function generateSpecificSuggestion(entity: any, resumeText: string): string {
  const categoryMap: Record<string, string> = {
    'hard_skill': 'skill técnico',
    'soft_skill': 'soft skill',
    'framework': 'framework',
    'tool': 'herramienta',
    'certification': 'certificación',
    'metric': 'métrica'
  };

  const categoryName = categoryMap[entity.category] || 'elemento';

  if (entity.importance === 'critical') {
    return `La oferta pide experiencia en "${entity.text}" (CRÍTICO). Este es un bloqueador - sin esto, el ATS te descarta automáticamente. Necesitas añadir este ${categoryName} con un ejemplo concreto en tu sección de experiencia.`;
  }

  if (entity.importance === 'important') {
    return `Te falta "${entity.text}". Aunque no es crítico, mejorará significativamente tu match score (+5-10%). ${entity.context ? `Contexto en JD: "${entity.context.substring(0, 80)}..."` : 'Añádelo con contexto relevante.'}`;
  }

  return `"${entity.text}" es un nice-to-have. Si tienes experiencia relacionada, menciónalo para destacar.`;
}

/**
 * Extract LinkedIn job ID from URL (future enhancement)
 */
function extractLinkedInJobId(url: string): string | null {
  const match = url.match(/linkedin\.com\/jobs\/view\/(\d+)/);
  return match ? match[1] : null;
}
