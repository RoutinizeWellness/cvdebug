import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const unlockResumeDetails = mutation({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the resume
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Check if already unlocked
    if (resume.detailsUnlocked) {
      return { success: true, message: "Already unlocked" };
    }

    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user has credits
    const userCredits = user.credits ?? 0;
    if (userCredits < 1) {
      throw new Error("Insufficient credits. Please purchase a plan to unlock details.");
    }

    // Deduct credit
    await ctx.db.patch(user._id, {
      credits: userCredits - 1,
    });

    // Unlock resume details
    await ctx.db.patch(args.resumeId, {
      detailsUnlocked: true,
    });

    return { success: true, message: "Resume details unlocked!" };
  },
});
