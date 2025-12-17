import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
    users: defineTable({
      tokenIdentifier: v.string(),
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      subscriptionTier: v.union(v.literal("free"), v.literal("single_scan"), v.literal("bulk_pack")),
      credits: v.optional(v.number()),
      endsOn: v.optional(v.number()),
      trialEndsOn: v.optional(v.number()),
      emailVariant: v.optional(v.string()),
      lastSeen: v.optional(v.number()),
      // Email tracking flags - Onboarding
      onboardingEmailSent: v.optional(v.boolean()),
      activationEmail24hSent: v.optional(v.boolean()),
      // Email tracking flags - Conversion
      postScanEmailSent: v.optional(v.boolean()),
      conversionReminderSent: v.optional(v.boolean()),
      // Email tracking flags - Re-engagement
      winBackEmail30dSent: v.optional(v.boolean()),
    })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .index("by_subscription_tier", ["subscriptionTier"]),
  resumes: defineTable({
    userId: v.string(),
    title: v.string(),
    url: v.string(),
    storageId: v.id("_storage"),
    mimeType: v.string(),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("failed"))),
    score: v.optional(v.number()),
    analysis: v.optional(v.string()),
    missingKeywords: v.optional(v.array(v.union(
      v.string(),
      v.object({
        keyword: v.string(),
        priority: v.string(),
        section: v.optional(v.string()),
        context: v.optional(v.string()),
        frequency: v.optional(v.number()),
        impact: v.optional(v.number()),
        synonyms: v.optional(v.array(v.string())),
      })
    ))),
    formatIssues: v.optional(v.array(v.union(
      v.string(),
      v.object({
        issue: v.string(),
        severity: v.optional(v.string()),
        fix: v.optional(v.string()),
        location: v.optional(v.string()),
        atsImpact: v.optional(v.string()),
      })
    ))),
    scoreBreakdown: v.optional(v.object({
      keywords: v.optional(v.number()),
      format: v.optional(v.number()),
      completeness: v.optional(v.number()),
    })),
    ocrText: v.optional(v.string()),
    rewrittenText: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    detailsUnlocked: v.optional(v.boolean()),
    // Email tracking for this specific resume
    parsingErrorEmailSent: v.optional(v.boolean()),
    postScanEmailSent: v.optional(v.boolean()),
    conversionReminderEmailSent: v.optional(v.boolean()),
    metricSuggestions: v.optional(v.array(v.object({
      tech: v.string(),
      metrics: v.array(v.string()),
    }))),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .searchIndex("search_ocr", {
      searchField: "ocrText",
      filterFields: ["userId"],
    }),
    
  // ML Learning: User feedback on analysis quality
  mlFeedback: defineTable({
    resumeId: v.id("resumes"),
    userId: v.string(),
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
    originalScore: v.optional(v.number()),
    originalCategory: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_user", ["userId"])
    .index("by_feedback_type", ["feedbackType"]),

  // ML Learning: Track successful outcomes
  mlSuccessTracking: defineTable({
    resumeId: v.id("resumes"),
    userId: v.string(),
    outcomeType: v.union(
      v.literal("interview"),
      v.literal("offer"),
      v.literal("hired")
    ),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    resumeScore: v.optional(v.number()),
    resumeCategory: v.optional(v.string()),
    keywords: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_user", ["userId"])
    .index("by_outcome", ["outcomeType"]),

  // ML Learning: Store learned weights and configurations
  mlConfig: defineTable({
    keywordWeights: v.any(),
    categoryWeights: v.any(),
    scoringAdjustments: v.any(),
    discoveredKeywords: v.optional(v.array(v.string())),
    lastUpdated: v.number(),
  }),

  // NEW: Store evaluation results
  evaluationResults: defineTable({
    accuracy: v.number(),
    results: v.any(),
    timestamp: v.number(),
  }),

  waitlist: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;