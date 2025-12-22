import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    subscriptionTier: v.union(v.literal("free"), v.literal("single_scan"), v.literal("interview_sprint")),
    credits: v.optional(v.number()),
    sprintExpiresAt: v.optional(v.number()),
    hasPriorityParsing: v.optional(v.boolean()),
    badges: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      earnedAt: v.number(),
      icon: v.string(),
    }))),
    lastGapAlert: v.optional(v.number()),
    endsOn: v.optional(v.number()),
    trialEndsOn: v.optional(v.number()),
    emailVariant: v.optional(v.string()),
    lastSeen: v.optional(v.number()),
    deviceFingerprint: v.optional(v.string()),
    freeTrialUsed: v.optional(v.boolean()),
    isPotentialDuplicate: v.optional(v.boolean()),
    // Email tracking flags - Onboarding
    onboardingEmailSent: v.optional(v.boolean()),
    activationEmail24hSent: v.optional(v.boolean()),
    // Email tracking flags - Conversion
    postScanEmailSent: v.optional(v.boolean()),
    conversionReminderSent: v.optional(v.boolean()),
    conversionFollowUpSent: v.optional(v.boolean()),
    // Email tracking flags - Re-engagement
    winBackEmail30dSent: v.optional(v.boolean()),
    // New anti-cheat email flags
    invisibilityAlertSent: v.optional(v.boolean()),
    fomoGapEmailSent: v.optional(v.boolean()),
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"])
  .index("by_subscription_tier", ["subscriptionTier"])
  .index("by_device_fingerprint", ["deviceFingerprint"]),

  // NEW: Device usage tracking for anti-cheat
  deviceUsage: defineTable({
    visitorId: v.string(),
    userId: v.string(),
    email: v.optional(v.string()),
    creditsConsumed: v.number(),
    firstUsedAt: v.number(),
    lastUsedAt: v.number(),
  })
  .index("by_visitor_id", ["visitorId"])
  .index("by_user_id", ["userId"]),

  // NEW: PROJECT MODEL - The core of the new architecture
  projects: defineTable({
    userId: v.string(),
    name: v.string(), // e.g., "Senior Dev Hunt 2026"
    targetRole: v.string(), // e.g., "Senior Software Engineer"
    description: v.optional(v.string()),
    masterCvId: v.optional(v.id("resumes")), // Reference to the base CV
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed")
    )),
    healthStatus: v.optional(v.union(
      v.literal("healthy"), // Green light - CV is ATS-ready
      v.literal("warning"), // Yellow - Minor issues detected
      v.literal("critical") // Red - CV has parsing errors
    )),
    lastHealthCheck: v.optional(v.number()),
  })
  .index("by_user", ["userId"])
  .index("by_user_and_status", ["userId", "status"]),

  // NEW: APPLICATIONS - Track each job application within a project
  applications: defineTable({
    projectId: v.id("projects"),
    userId: v.string(),
    companyName: v.string(),
    jobTitle: v.string(),
    jobDescriptionText: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    matchScore: v.optional(v.number()), // 0-100 score
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("rejected"),
      v.literal("accepted")
    )),
    appliedDate: v.optional(v.number()),
    // Keyword gap analysis
    missingKeywords: v.optional(v.array(v.string())),
    matchedKeywords: v.optional(v.array(v.string())),
    // Cover letter
    coverLetterId: v.optional(v.id("coverLetters")),
    // Notes
    notes: v.optional(v.string()),
  })
  .index("by_project", ["projectId"])
  .index("by_user", ["userId"])
  .index("by_user_and_status", ["userId", "status"])
  .index("by_project_and_status", ["projectId", "status"]),

  // NEW: COVER LETTERS - AI-generated tailored cover letters
  coverLetters: defineTable({
    applicationId: v.id("applications"),
    userId: v.string(),
    content: v.string(),
    generatedAt: v.number(),
    version: v.number(), // Allow regeneration
    keywordsBridged: v.optional(v.array(v.string())), // Keywords explicitly mentioned
  })
  .index("by_application", ["applicationId"])
  .index("by_user", ["userId"]),

  // NEW: LinkedIn DMs - AI-generated recruiter messages
  linkedinDMs: defineTable({
    userId: v.string(),
    applicationId: v.optional(v.id("applications")),
    recruiterName: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    variations: v.array(v.object({
      tone: v.string(),
      content: v.string(),
    })),
    generatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_application", ["applicationId"]),

  // LinkedIn Profile Optimizations - Store audit results
  linkedinOptimizations: defineTable({
    userId: v.string(),
    profileText: v.string(),
    linkedinUrl: v.optional(v.string()),
    jobDescription: v.optional(v.string()),
    score: v.number(),
    headline: v.optional(v.object({
      current: v.string(),
      suggested: v.string(),
      critique: v.string(),
    })),
    about: v.optional(v.object({
      rewritten: v.string(),
      suggestions: v.optional(v.string()),
    })),
    experience: v.optional(v.object({
      missingKeywords: v.array(v.string()),
      matchedKeywords: v.optional(v.array(v.string())),
    })),
    actionableTips: v.array(v.string()),
    generatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_user_and_date", ["userId", "generatedAt"]),

  // NEW: Project Timeline for gamification
  projectTimeline: defineTable({
    projectId: v.id("projects"),
    userId: v.string(),
    type: v.string(), // "resume_uploaded", "resume_analyzed", "cover_letter_generated", etc.
    title: v.string(),
    description: v.string(),
    timestamp: v.number(),
    dayNumber: v.number(), // Day 1, Day 2, etc. relative to project creation
  })
  .index("by_project", ["projectId"])
  .index("by_user", ["userId"]),

  resumes: defineTable({
    userId: v.string(),
    projectId: v.optional(v.id("projects")), // NEW: Link to project
    title: v.string(),
    url: v.string(),
    storageId: v.id("_storage"),
    mimeType: v.string(),
    category: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    status: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("failed"))),
    score: v.optional(v.number()),
    analysis: v.optional(v.string()),
    // NEW: Text layer integrity check
    textLayerIntegrity: v.optional(v.number()), // 0-100 score
    hasImageTrap: v.optional(v.boolean()), // True if CV has invisible text issues
    lastIntegrityCheck: v.optional(v.number()),
    matchedKeywords: v.optional(v.array(v.string())),
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
    .index("by_project", ["projectId"])
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

  payments: defineTable({
    userId: v.id("users"),
    tokenIdentifier: v.string(),
    email: v.string(),
    plan: v.union(v.literal("single_scan"), v.literal("interview_sprint")),
    transactionId: v.string(),
    amount: v.number(),
    status: v.string(),
    purchasedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_transaction_id", ["transactionId"])
    .index("by_email", ["email"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;