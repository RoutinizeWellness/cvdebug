import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Track user feedback on analysis quality
export const recordFeedback = mutation({
  args: {
    resumeId: v.id("resumes"),
    feedbackType: v.union(
      v.literal("score_too_high"),
      v.literal("score_too_low"),
      v.literal("missing_keyword"),
      v.literal("wrong_category"),
      v.literal("helpful"),
      v.literal("not_helpful")
    ),
    details: v.optional(v.string()),
    suggestedScore: v.optional(v.number()),
    suggestedCategory: v.optional(v.string()),
    suggestedKeywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("mlFeedback", {
      resumeId: args.resumeId,
      userId: identity.subject,
      feedbackType: args.feedbackType,
      details: args.details,
      suggestedScore: args.suggestedScore,
      suggestedCategory: args.suggestedCategory,
      suggestedKeywords: args.suggestedKeywords,
      originalScore: resume.score,
      originalCategory: resume.category,
      timestamp: Date.now(),
    });

    console.log(`[ML Learning] Feedback recorded for resume ${args.resumeId}: ${args.feedbackType}`);
  },
});

// Track successful job applications (user reports they got interview/job)
export const recordSuccess = mutation({
  args: {
    resumeId: v.id("resumes"),
    outcomeType: v.union(
      v.literal("interview"),
      v.literal("offer"),
      v.literal("hired")
    ),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const resume = await ctx.db.get(args.resumeId);
    if (!resume || resume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("mlSuccessTracking", {
      resumeId: args.resumeId,
      userId: identity.subject,
      outcomeType: args.outcomeType,
      jobTitle: args.jobTitle,
      company: args.company,
      resumeScore: resume.score,
      resumeCategory: resume.category,
      keywords: resume.missingKeywords,
      timestamp: Date.now(),
    });

    console.log(`[ML Learning] Success recorded for resume ${args.resumeId}: ${args.outcomeType}`);
  },
});

// Learn from keyword patterns in successful resumes
export const getKeywordLearningData = query({
  handler: async (ctx) => {
    const successfulResumes = await ctx.db
      .query("mlSuccessTracking")
      .order("desc")
      .take(100);

    const keywordFrequency: Record<string, { count: number; avgScore: number; successRate: number }> = {};

    for (const success of successfulResumes) {
      const resume = await ctx.db.get(success.resumeId);
      if (!resume || !resume.ocrText) continue;

      const words = resume.ocrText.toLowerCase().match(/\b[a-z0-9]+\b/g) || [];
      words.forEach(word => {
        if (word.length >= 3) {
          if (!keywordFrequency[word]) {
            keywordFrequency[word] = { count: 0, avgScore: 0, successRate: 0 };
          }
          keywordFrequency[word].count++;
          keywordFrequency[word].avgScore += resume.score || 0;
        }
      });
    }

    // Calculate averages
    Object.keys(keywordFrequency).forEach(word => {
      keywordFrequency[word].avgScore /= keywordFrequency[word].count;
      keywordFrequency[word].successRate = keywordFrequency[word].count / successfulResumes.length;
    });

    return keywordFrequency;
  },
});

// Get category accuracy metrics
export const getCategoryAccuracy = query({
  handler: async (ctx) => {
    const feedback = await ctx.db
      .query("mlFeedback")
      .filter(q => q.eq(q.field("feedbackType"), "wrong_category"))
      .take(100);

    const categoryErrors: Record<string, { predicted: string; actual: string; count: number }[]> = {};

    for (const fb of feedback) {
      const original = fb.originalCategory || "Unknown";
      const suggested = fb.suggestedCategory || "Unknown";
      
      if (!categoryErrors[original]) {
        categoryErrors[original] = [];
      }
      
      const existing = categoryErrors[original].find(e => e.actual === suggested);
      if (existing) {
        existing.count++;
      } else {
        categoryErrors[original].push({ predicted: original, actual: suggested, count: 1 });
      }
    }

    return categoryErrors;
  },
});

// Automated learning process to update weights and discover new keywords
export const processLearningData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch recent data
    const successes = await ctx.db.query("mlSuccessTracking").order("desc").take(50);
    const feedback = await ctx.db.query("mlFeedback").order("desc").take(50);
    
    // 2. Calculate New Keyword Weights based on Feedback
    const newKeywordWeights: Record<string, number> = {};
    const newCategoryWeights: Record<string, number> = {};
    const newScoringAdjustments = { keywords: 0, format: 0, completeness: 0 };

    // Process Feedback
    let scoreHighCount = 0;
    let scoreLowCount = 0;

    for (const f of feedback) {
        if (f.feedbackType === "missing_keyword" && f.suggestedKeywords) {
            for (const k of f.suggestedKeywords) {
                // Boost weight for user-suggested missing keywords
                newKeywordWeights[k] = (newKeywordWeights[k] || 1) + 0.2;
            }
        }
        if (f.feedbackType === "wrong_category" && f.suggestedCategory) {
             // Boost weight for user-corrected categories
             newCategoryWeights[f.suggestedCategory] = (newCategoryWeights[f.suggestedCategory] || 0) + 0.5;
        }
        if (f.feedbackType === "score_too_high") scoreHighCount++;
        if (f.feedbackType === "score_too_low") scoreLowCount++;
    }

    // Adjust global scoring based on bias (Self-Calibration)
    if (scoreHighCount > scoreLowCount) {
        newScoringAdjustments.keywords = -0.02; // Slightly harder
        newScoringAdjustments.completeness = -0.02;
    } else if (scoreLowCount > scoreHighCount) {
        newScoringAdjustments.keywords = 0.02; // Slightly easier
        newScoringAdjustments.completeness = 0.02;
    }

    // 3. Synonym & Keyword Discovery from Successful Resumes
    const wordFrequency: Record<string, number> = {};
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'my', 'me', 'we', 'our', 'us', 'you', 'your', 'he', 'she', 'it', 'they', 'them', 'from', 'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among']);

    for (const s of successes) {
        // Boost category weight for successful outcomes
        if (s.resumeCategory) {
            newCategoryWeights[s.resumeCategory] = (newCategoryWeights[s.resumeCategory] || 0) + 0.3;
        }

        // Analyze text for new keywords if we can access the resume
        const resume = await ctx.db.get(s.resumeId);
        if (resume && resume.ocrText) {
            const words = resume.ocrText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
            for (const word of words) {
                if (!stopWords.has(word)) {
                    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
                }
            }
        }
    }

    // Identify potential new keywords (appear in > 20% of successful resumes)
    const discoveredKeywords: string[] = [];
    const threshold = Math.max(3, successes.length * 0.2);
    
    for (const [word, count] of Object.entries(wordFrequency)) {
        if (count >= threshold) {
            discoveredKeywords.push(word);
        }
    }

    // 4. Update Configuration
    const existingConfig = await ctx.db.query("mlConfig").order("desc").first();
    
    // Merge with existing weights
    const finalKeywordWeights = { ...(existingConfig?.keywordWeights || {}), ...newKeywordWeights };
    const finalCategoryWeights = { ...(existingConfig?.categoryWeights || {}), ...newCategoryWeights };
    
    // Accumulate adjustments
    const finalScoringAdjustments = {
        keywords: (existingConfig?.scoringAdjustments?.keywords || 0) + newScoringAdjustments.keywords,
        format: (existingConfig?.scoringAdjustments?.format || 0) + newScoringAdjustments.format,
        completeness: (existingConfig?.scoringAdjustments?.completeness || 0) + newScoringAdjustments.completeness,
    };

    // Merge discovered keywords
    const existingDiscovered = new Set(existingConfig?.discoveredKeywords || []);
    discoveredKeywords.forEach(k => existingDiscovered.add(k));

    await ctx.db.insert("mlConfig", {
        keywordWeights: finalKeywordWeights,
        categoryWeights: finalCategoryWeights,
        scoringAdjustments: finalScoringAdjustments,
        discoveredKeywords: Array.from(existingDiscovered),
        lastUpdated: Date.now(),
    });
    
    console.log(`[ML Learning] Automated update complete. Discovered ${discoveredKeywords.length} potential keywords.`);
  }
});

// Internal mutation to update ML weights based on learning
export const updateMLWeights = internalMutation({
  args: {
    keywordWeights: v.optional(v.any()),
    categoryWeights: v.optional(v.any()),
    scoringAdjustments: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Store updated weights in a configuration table
    const existingConfig = await ctx.db
      .query("mlConfig")
      .order("desc")
      .first();

    if (existingConfig) {
      await ctx.db.patch(existingConfig._id, {
        keywordWeights: args.keywordWeights,
        categoryWeights: args.categoryWeights,
        scoringAdjustments: args.scoringAdjustments,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("mlConfig", {
        keywordWeights: args.keywordWeights || {},
        categoryWeights: args.categoryWeights || {},
        scoringAdjustments: args.scoringAdjustments || {},
        lastUpdated: Date.now(),
      });
    }

    console.log("[ML Learning] ML weights updated based on user feedback");
  },
});

// Get current ML configuration
export const getMLConfig = query({
  handler: async (ctx) => {
    const config = await ctx.db
      .query("mlConfig")
      .order("desc")
      .first();

    return config || {
      keywordWeights: {},
      categoryWeights: {},
      scoringAdjustments: {},
      lastUpdated: Date.now(),
    };
  },
});

// Analytics: Get learning metrics
export const getLearningMetrics = query({
  handler: async (ctx) => {
    const totalFeedback = await ctx.db.query("mlFeedback").take(1000);
    const totalSuccess = await ctx.db.query("mlSuccessTracking").take(1000);

    const feedbackByType: Record<string, number> = {};
    totalFeedback.forEach(fb => {
      feedbackByType[fb.feedbackType] = (feedbackByType[fb.feedbackType] || 0) + 1;
    });

    const successByOutcome: Record<string, number> = {};
    totalSuccess.forEach(s => {
      successByOutcome[s.outcomeType] = (successByOutcome[s.outcomeType] || 0) + 1;
    });

    return {
      totalFeedbackCount: totalFeedback.length,
      totalSuccessCount: totalSuccess.length,
      feedbackByType,
      successByOutcome,
      lastUpdated: Date.now(),
    };
  },
});