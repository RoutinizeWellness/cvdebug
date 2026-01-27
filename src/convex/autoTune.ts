"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { autoTuneBullets } from "./ai/autoTuneEngine";

/**
 * Auto-Tune Resume Action
 * Automatically optimizes resume bullets using ML and algorithms
 */
export const autoTuneResume = action({
  args: {
    resumeText: v.string(),
    missingKeywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const result = await autoTuneBullets(
        args.resumeText,
        args.missingKeywords
      );

      return result;
    } catch (error) {
      console.error("Auto-tune failed:", error);
      throw new Error("Failed to auto-tune resume");
    }
  },
});
