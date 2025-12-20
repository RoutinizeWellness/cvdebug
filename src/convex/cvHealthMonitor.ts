import { v } from "convex/values";
import { internalMutation, internalAction } from "./_generated/server";

const internalAny = require("./_generated/api").internal;

export const checkTextLayerIntegrity = internalAction({
  args: {
    resumeId: v.id("resumes"),
    ocrText: v.string(),
  },
  handler: async (ctx, args) => {
    const runMutation = (fn: any, mutationArgs: any) => (ctx as any).runMutation(fn, mutationArgs);

    // Algorithm: Detect "Image Trap" issues
    const text = args.ocrText;
    
    // Check 1: Text length (should be substantial)
    const hasSubstantialText = text.length > 100;
    
    // Check 2: Readable characters ratio
    const readableChars = text.match(/[a-zA-Z0-9]/g)?.length || 0;
    const totalChars = text.length;
    const readableRatio = totalChars > 0 ? readableChars / totalChars : 0;
    
    // Check 3: Detect invisible/zero-width characters
    const hasInvisibleChars = /[\u200B-\u200D\uFEFF]/.test(text);
    
    // Check 4: Detect excessive whitespace (sign of poor extraction)
    const whitespaceRatio = (text.match(/\s/g)?.length || 0) / totalChars;
    
    // Calculate integrity score (0-100)
    let integrityScore = 100;
    
    if (!hasSubstantialText) integrityScore -= 50;
    if (readableRatio < 0.7) integrityScore -= 30;
    if (hasInvisibleChars) integrityScore -= 20;
    if (whitespaceRatio > 0.5) integrityScore -= 20;
    
    // STRICT CHECK for "Image Trap" / Encoding issues requested by user
    // If readability is below 95% (simulated here by readableRatio < 0.95 for strictness), 
    // we flag it as a specific high-priority alert.
    // Note: Real OCR vs Text extraction comparison requires the original PDF buffer which we don't have here,
    // so we use heuristics on the extracted text quality.
    const isEncodingBroken = readableRatio < 0.95 || hasInvisibleChars;

    integrityScore = Math.max(0, integrityScore);
    
    // Determine if it's an "Image Trap"
    const hasImageTrap = integrityScore < 50 || isEncodingBroken;
    
    await runMutation(internalAny.cvHealthMonitor.updateHealthStatus, {
      resumeId: args.resumeId,
      textLayerIntegrity: integrityScore,
      hasImageTrap,
      lastIntegrityCheck: Date.now(),
    });

    // Update project health if linked
    const resume = await (ctx as any).runQuery(internalAny.resumes.getResumeInternal, {
      id: args.resumeId,
    });

    if (resume?.projectId) {
      const healthStatus = integrityScore >= 80 ? "healthy" : integrityScore >= 50 ? "warning" : "critical";
      
      await runMutation(internalAny.projects.updateProjectHealth, {
        projectId: resume.projectId,
        healthStatus,
      });
    }

    return { integrityScore, hasImageTrap };
  },
});

export const updateHealthStatus = internalMutation({
  args: {
    resumeId: v.id("resumes"),
    textLayerIntegrity: v.number(),
    hasImageTrap: v.boolean(),
    lastIntegrityCheck: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.resumeId, {
      textLayerIntegrity: args.textLayerIntegrity,
      hasImageTrap: args.hasImageTrap,
      lastIntegrityCheck: args.lastIntegrityCheck,
    });
  },
});