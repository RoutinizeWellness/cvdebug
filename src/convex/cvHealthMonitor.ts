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

    // RELAXED CHECK for "Image Trap" / Encoding issues
    // Normal text has ~60-80% alphanumeric ratio due to punctuation/spaces
    const isEncodingBroken = readableRatio < 0.50 || hasInvisibleChars;

    integrityScore = Math.max(0, integrityScore);

    // Determine if it's an "Image Trap" - only flag truly broken PDFs
    const hasImageTrap = integrityScore < 30 || isEncodingBroken;

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

export const compareOCRvsTextExtraction = internalAction({
  args: {
    resumeId: v.id("resumes"),
    ocrText: v.string(),
    extractedText: v.string(),
  },
  handler: async (ctx, args) => {
    const runMutation = (fn: any, mutationArgs: any) => (ctx as any).runMutation(fn, mutationArgs);

    // Calculate character-level similarity
    const ocrLength = args.ocrText.length;
    const extractedLength = args.extractedText.length;

    // Simple variance calculation
    const lengthVariance = Math.abs(ocrLength - extractedLength) / Math.max(ocrLength, extractedLength);

    // Word-level comparison
    const ocrWords: string[] = args.ocrText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const extractedWords: string[] = args.extractedText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

    const commonWords = ocrWords.filter((word: string) => extractedWords.includes(word));
    const wordVariance = 1 - (commonWords.length / Math.max(ocrWords.length, extractedWords.length));

    // MODULE 2: If variance > 5%, trigger 'Broken PDF' alert
    const isBrokenPDF = lengthVariance > 0.05 || wordVariance > 0.05;

    let integrityScore = 100;
    if (isBrokenPDF) {
      integrityScore = Math.max(0, 100 - (lengthVariance * 100) - (wordVariance * 100));
    }

    await runMutation(internalAny.cvHealthMonitor.updateHealthStatus, {
      resumeId: args.resumeId,
      textLayerIntegrity: Math.round(integrityScore),
      hasImageTrap: isBrokenPDF,
      lastIntegrityCheck: Date.now(),
    });

    return {
      integrityScore: Math.round(integrityScore),
      hasImageTrap: isBrokenPDF,
      lengthVariance,
      wordVariance,
    };
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

// NEW: Continuous PDF Sanitization for Career Sprint users
export const runContinuousSanitization = internalAction({
  args: {},
  handler: async (ctx, args) => {
    const runQuery = (fn: any, queryArgs: any) => (ctx as any).runQuery(fn, queryArgs);
    const runMutation = (fn: any, mutationArgs: any) => (ctx as any).runMutation(fn, mutationArgs);

    console.log("[Continuous Sanitization] Starting scan...");

    // Get all users with active Career Sprint
    const allUsers = await runQuery(internalAny.users.getActiveSprintUsers, {});

    console.log(`[Continuous Sanitization] Found ${allUsers.length} active sprint users`);

    for (const user of allUsers) {
      // Get all resumes for this user
      const resumes = await runQuery(internalAny.resumes.getResumesByUserId, {
        userId: user.tokenIdentifier,
      });

      for (const resume of resumes) {
        // Skip if checked recently (within last 5 minutes)
        if (resume.lastIntegrityCheck && (Date.now() - resume.lastIntegrityCheck) < 5 * 60 * 1000) {
          continue;
        }

        // Skip if no OCR text available
        if (!resume.ocrText || resume.ocrText.length < 50) {
          continue;
        }

        // Run integrity check
        const result = await (ctx as any).runAction(internalAny.cvHealthMonitor.checkTextLayerIntegrity, {
          resumeId: resume._id,
          ocrText: resume.ocrText,
        });

        // Auto-fix if integrity is below 95% for sprint users
        if (result.hasImageTrap || result.integrityScore < 95) {
          console.log(`[Continuous Sanitization] Auto-fixing resume ${resume._id} for user ${user.email} (score: ${result.integrityScore})`);

          await runMutation(internalAny.resumes.autoSanitizePdf, {
            resumeId: resume._id,
          });
        }
      }
    }

    console.log("[Continuous Sanitization] Scan complete");
  },
});