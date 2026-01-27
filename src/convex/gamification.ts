import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const checkAndAwardBadges = mutation({
  args: {
    userId: v.string(),
    resumeScore: v.optional(v.number()),
    matchScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.userId))
      .unique();

    if (!user) return;

    const currentBadges = user.badges || [];
    const newBadges = [];

    // Badge: First Upload
    if (!currentBadges.some(b => b.id === "first_upload")) {
      const resumes = await ctx.db
        .query("resumes")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
      
      if (resumes.length >= 1) {
        newBadges.push({
          id: "first_upload",
          name: "First Steps",
          earnedAt: Date.now(),
          icon: "🎯",
        });
      }
    }

    // Badge: Ready for Google (score >= 85)
    if (args.resumeScore && args.resumeScore >= 85 && !currentBadges.some(b => b.id === "ready_for_google")) {
      newBadges.push({
        id: "ready_for_google",
        name: "Ready for Google",
        earnedAt: Date.now(),
        icon: "🚀",
      });
    }

    // Badge: Top 5% Candidate (score >= 90)
    if (args.resumeScore && args.resumeScore >= 90 && !currentBadges.some(b => b.id === "top_5_percent")) {
      newBadges.push({
        id: "top_5_percent",
        name: "Top 5% Candidate",
        earnedAt: Date.now(),
        icon: "⭐",
      });
    }

    // Badge: Perfect Match (match score >= 95)
    if (args.matchScore && args.matchScore >= 95 && !currentBadges.some(b => b.id === "perfect_match")) {
      newBadges.push({
        id: "perfect_match",
        name: "Perfect Match",
        earnedAt: Date.now(),
        icon: "💎",
      });
    }

    // Badge: Sprint Master (completed 10+ applications during sprint)
    const hasActiveSprint = user.sprintExpiresAt && user.sprintExpiresAt > Date.now();
    if (hasActiveSprint && !currentBadges.some(b => b.id === "sprint_master")) {
      const applications = await ctx.db
        .query("applications")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
      
      if (applications.length >= 10) {
        newBadges.push({
          id: "sprint_master",
          name: "Sprint Master",
          earnedAt: Date.now(),
          icon: "🏆",
        });
      }
    }

    if (newBadges.length > 0) {
      await ctx.db.patch(user._id, {
        badges: [...currentBadges, ...newBadges],
      });
    }

    return newBadges;
  },
});

export const checkGapAlert = mutation({
  args: {
    resumeScore: v.number(),
    missingKeywordsCount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    // Only send gap alert if score is between 60-75 and user hasn't been alerted in last 24 hours
    const shouldAlert = args.resumeScore >= 60 && args.resumeScore <= 75;
    const lastAlert = user.lastGapAlert || 0;
    const hoursSinceAlert = (Date.now() - lastAlert) / (1000 * 60 * 60);

    if (shouldAlert && hoursSinceAlert >= 24) {
      await ctx.db.patch(user._id, {
        lastGapAlert: Date.now(),
      });

      return {
        message: `You're at ${args.resumeScore}% - just ${args.missingKeywordsCount} keywords away from the interview zone! 🎯`,
        action: "Add missing keywords now",
        urgency: "high",
      };
    }

    return null;
  },
});

export const getUserBadges = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    return user.badges || [];
  },
});

export const calculateProbabilityScore = query({
  args: {
    resumeId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { score: 0, factors: [] };

    let baseScore = 50;
    const factors = [];

    if (args.resumeId) {
      const resume = await ctx.db.get(args.resumeId);
      if (resume) {
        // Resume score factor (0-40 points)
        const resumeScore = resume.score || 0;
        const resumeFactor = Math.round((resumeScore / 100) * 40);
        baseScore += resumeFactor;
        factors.push({ name: "Resume Quality", points: resumeFactor, max: 40 });

        // Keyword match factor (0-30 points)
        const matchedCount = resume.matchedKeywords?.length || 0;
        const missingCount = resume.missingKeywords?.length || 0;
        const totalKeywords = matchedCount + missingCount;
        const keywordFactor = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 30) : 0;
        baseScore += keywordFactor;
        factors.push({ name: "Keyword Match", points: keywordFactor, max: 30 });

        // Format quality factor (0-20 points)
        const formatIssues = resume.formatIssues?.length || 0;
        const formatFactor = Math.max(0, 20 - (formatIssues * 5));
        baseScore += formatFactor;
        factors.push({ name: "Format Quality", points: formatFactor, max: 20 });

        // Text integrity factor (0-10 points)
        const integrity = resume.textLayerIntegrity || 0;
        const integrityFactor = Math.round((integrity / 100) * 10);
        baseScore += integrityFactor;
        factors.push({ name: "Text Integrity", points: integrityFactor, max: 10 });
      }
    }

    return {
      score: Math.min(100, baseScore),
      factors,
      nextMilestone: baseScore < 70 ? 70 : baseScore < 85 ? 85 : 95,
    };
  },
});
