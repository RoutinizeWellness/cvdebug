import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema(
  {
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    subscriptionTier: v.union(
      v.literal("free"),
      v.literal("single_debug_fix"),
      v.literal("single_scan"),
      v.literal("interview_sprint"),
      v.literal("iteration_pass")
    ),
    credits: v.optional(v.number()),
    sprintExpiresAt: v.optional(v.number()),
    // User profile information for adaptive scoring
    experienceLevel: v.optional(v.union(
      v.literal("internship"),    // 0-1 years, looking for internships
      v.literal("entry"),          // 0-2 years, entry-level positions
      v.literal("junior"),         // 2-4 years, junior roles
      v.literal("mid"),            // 4-7 years, mid-level roles
      v.literal("senior"),         // 7-10 years, senior roles
      v.literal("lead"),           // 10+ years, lead/staff roles
      v.literal("executive")       // C-level, VP, Director
    )),
    targetRole: v.optional(v.string()), // E.g., "Software Engineer", "SDR", "Product Manager"
    // Single Debug Fix tracking
    aiRewritesUsed: v.optional(v.number()), // Track AI rewrites used for single_debug_fix plan
    singleDebugFixUsed: v.optional(v.boolean()), // Track if single_debug_fix has been used
    // Plan expiration notifications
    planExpirationEmailSent: v.optional(v.boolean()),
    planExpirationPopupShown: v.optional(v.boolean()),
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
    retargetingEmail7dSent: v.optional(v.boolean()),
    lastRetargetingEmailSent: v.optional(v.number()),
    // New anti-cheat email flags
    invisibilityAlertSent: v.optional(v.boolean()),
    fomoGapEmailSent: v.optional(v.boolean()),
    // User preferences
    analyticsSharing: v.optional(v.boolean()),
    emailPreferences: v.optional(v.any()), // Custom email preferences per category
    unsubscribedFromMarketing: v.optional(v.boolean()),
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"])
  .index("by_subscription_tier", ["subscriptionTier"])
  .index("by_device_fingerprint", ["deviceFingerprint"]),

  // Email log for frequency tracking and analytics
  emailLog: defineTable({
    userId: v.string(),
    category: v.string(), // ONBOARDING, RESUME_TIPS, etc.
    emailType: v.string(), // Specific email template
    subject: v.string(),
    timestamp: v.number(),
    opened: v.boolean(),
    clicked: v.boolean(),
  })
  .index("by_user_and_timestamp", ["userId", "timestamp"])
  .index("by_category", ["category"]),

  // Notifications table (for batching into digest emails)
  notifications: defineTable({
    userId: v.string(),
    category: v.string(),
    title: v.string(),
    message: v.string(),
    timestamp: v.number(),
    read: v.boolean(),
    emailSent: v.boolean(),
    actionUrl: v.optional(v.string()),
  })
  .index("by_user", ["userId"])
  .index("by_user_and_read", ["userId", "read"]),

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
    lastStatusUpdate: v.optional(v.number()), // For Ghosting Alert
    // Keyword gap analysis
    missingKeywords: v.optional(v.array(v.string())),
    matchedKeywords: v.optional(v.array(v.string())),
    // Cover letter
    coverLetterId: v.optional(v.id("coverLetters")),
    // Notes
    notes: v.optional(v.string()),
    // NEW: Application Timeline (Sunk Cost)
    events: v.optional(v.array(v.object({
      type: v.string(), // "status_change", "note", "email_sent", "interview_scheduled", "created"
      title: v.string(),
      description: v.optional(v.string()),
      timestamp: v.number(),
    }))),
    // NEW: Interview Prep Data
    interviewPrep: v.optional(v.object({
      questions: v.array(v.object({
        question: v.string(),
        answer: v.optional(v.string()),
        keyPoints: v.optional(v.array(v.string())),
      })),
      generatedAt: v.number(),
    })),
    // NEW: CV Snapshot (saved when status changes to "interviewing")
    cvSnapshotId: v.optional(v.id("resumes")), // Reference to the exact CV version used
    cvSnapshotKeywords: v.optional(v.array(v.string())), // Keywords present in this CV version
    // A/B Testing: Track which CV version was used
    cvVersionName: v.optional(v.string()), // e.g., "V1_React_Focused", "V2_Backend_Heavy"
    cvVersionScore: v.optional(v.number()), // The ATS score when this CV was used
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
      subject: v.optional(v.string()),
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
    projectId: v.optional(v.id("projects")),
    title: v.string(),
    url: v.string(),
    storageId: v.optional(v.id("_storage")),
    mimeType: v.string(),
    category: v.optional(v.string()),
    ocrText: v.optional(v.string()),
    analysis: v.optional(v.string()),
    rewrittenText: v.optional(v.string()),
    score: v.optional(v.number()),
    previousScore: v.optional(v.number()), // NEW: Track score history
    scoreHistory: v.optional(v.array(v.object({ // NEW: Full history tracking
      score: v.number(),
      timestamp: v.number(),
      verifiedBySecondaryModel: v.optional(v.boolean()),
    }))),
    processingDuration: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("deep_processing")
    )),
    detailsUnlocked: v.optional(v.boolean()),
    jobDescription: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    scoreBreakdown: v.optional(v.object({
      keywords: v.number(),
      format: v.number(),
      completeness: v.number(),
    })),
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
    metricSuggestions: v.optional(v.array(v.object({
      tech: v.string(),
      metrics: v.array(v.string()),
    }))),
    textLayerIntegrity: v.optional(v.number()),
    hasImageTrap: v.optional(v.boolean()),
    lastIntegrityCheck: v.optional(v.number()),
    parsingErrorEmailSent: v.optional(v.boolean()),
    lowScoreEmailSent: v.optional(v.boolean()),
    // Extracted contact information
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    github: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    targetMarket: v.optional(v.union(
      v.literal("USA"),
      v.literal("UK"),
      v.literal("DACH"), // Germany, Austria, Switzerland
      v.literal("EU"),
      v.literal("LATAM"),
      v.literal("APAC")
    )),
    // ML-extracted comprehensive data
    extractedData: v.optional(v.object({
      // Education
      highestDegree: v.optional(v.string()),
      totalYearsEducation: v.optional(v.number()),
      // Experience
      totalYearsExperience: v.optional(v.number()),
      companies: v.optional(v.array(v.string())),
      jobTitles: v.optional(v.array(v.string())),
      currentRole: v.optional(v.string()),
      seniorityLevel: v.optional(v.string()),
      // Skills
      technicalSkills: v.optional(v.array(v.string())),
      tools: v.optional(v.array(v.string())),
      frameworks: v.optional(v.array(v.string())),
      databases: v.optional(v.array(v.string())),
      cloudPlatforms: v.optional(v.array(v.string())),
      softSkills: v.optional(v.array(v.string())),
      // Certifications & Awards
      certifications: v.optional(v.array(v.string())),
      awards: v.optional(v.array(v.string())),
      spokenLanguages: v.optional(v.array(v.string())),
      // Metrics & Quality
      totalMetrics: v.optional(v.number()),
      hasActionVerbs: v.optional(v.boolean()),
      hasQuantifiableResults: v.optional(v.boolean()),
      averageBulletQuality: v.optional(v.number()),
      readabilityScore: v.optional(v.number()),
      keywordDensity: v.optional(v.number()),
      // Achievement analysis
      achievementCount: v.optional(v.number()),
      metricsWithImpact: v.optional(v.number()),
    })),
    // NEW: Manual resume builder fields
    personalInfo: v.optional(v.object({
      fullName: v.string(),
      email: v.string(),
      phone: v.string(),
      location: v.string(),
      linkedin: v.optional(v.string()),
      website: v.optional(v.string()),
      summary: v.string(),
    })),
    experience: v.optional(v.array(v.object({
      id: v.string(),
      company: v.string(),
      position: v.string(),
      location: v.string(),
      startDate: v.string(),
      endDate: v.string(),
      current: v.boolean(),
      description: v.string(),
    }))),
    education: v.optional(v.array(v.object({
      id: v.string(),
      institution: v.string(),
      degree: v.string(),
      field: v.string(),
      location: v.string(),
      startDate: v.string(),
      endDate: v.string(),
      current: v.boolean(),
      gpa: v.optional(v.string()),
    }))),
    skills: v.optional(v.array(v.string())),
    projects: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      description: v.string(),
      technologies: v.array(v.string()),
      link: v.optional(v.string()),
    }))),
    certifications: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      issuer: v.string(),
      date: v.string(),
    }))),
    languages: v.optional(v.array(v.object({
      id: v.string(),
      language: v.string(),
      proficiency: v.string(),
    }))),
  })
    .index("by_user", ["userId"])
    .index("by_project", ["projectId"])
    .index("by_user_and_category", ["userId", "category"])
    .searchIndex("search_ocr", {
      searchField: "ocrText",
      filterFields: ["userId", "category"],
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
    .index("by_feedback_type", ["feedbackType"])
    .index("by_timestamp", ["timestamp"]),

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

  // NEW: Resume Outcomes Tracking - For feedback loop and ML improvement
  resumeOutcomes: defineTable({
    resumeId: v.id("resumes"),
    userId: v.string(),
    applicationId: v.optional(v.id("applications")),
    outcome: v.union(
      v.literal("interview_received"),
      v.literal("offer_received"),
      v.literal("rejected"),
      v.literal("no_response"),
      v.literal("ghosted")
    ),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    industry: v.optional(v.string()),
    // Resume characteristics at time of application
    resumeScore: v.number(),
    keywordsUsed: v.array(v.string()),
    bulletPointsCount: v.optional(v.number()),
    metricsCount: v.optional(v.number()),
    actionVerbsCount: v.optional(v.number()),
    starMethodScore: v.optional(v.number()), // NEW: STAR completeness
    bm25Score: v.optional(v.number()), // NEW: BM25 keyword score
    // Context
    appliedDate: v.number(),
    responseDate: v.optional(v.number()),
    daysToResponse: v.optional(v.number()),
    // Learning signals
    wasSuccessful: v.boolean(), // True for interview/offer, False for rejected/no response
    confidenceScore: v.optional(v.number()), // User's confidence in the outcome data (1-5)
    notes: v.optional(v.string()),
  })
    .index("by_resume", ["resumeId"])
    .index("by_user", ["userId"])
    .index("by_outcome", ["outcome"])
    .index("by_success", ["wasSuccessful"])
    .index("by_user_and_outcome", ["userId", "outcome"])
    .index("by_applied_date", ["appliedDate"]),

  // ML Learning: Store learned weights and configurations
  mlConfig: defineTable({
    keywordWeights: v.any(),
    categoryWeights: v.any(),
    scoringAdjustments: v.any(),
    discoveredKeywords: v.optional(v.array(v.string())),
    lastUpdated: v.number(),
  }),

  // ML Model Weights: Store continuous learning model state
  mlModelWeights: defineTable({
    weights: v.any(), // ModelWeights interface from learningEngine
    version: v.number(),
    lastUpdated: v.number(),
  })
    .index("by_version", ["version"]),

  // NEW: Store evaluation results
  evaluationResults: defineTable({
    accuracy: v.number(),
    results: v.any(),
    timestamp: v.number(),
  }),

  // ML Analysis Data Collection: Silent background collection for algorithm improvement
  mlAnalysisData: defineTable({
    resumeId: v.id("resumes"),
    userId: v.string(),
    mlScores: v.object({
      overallScore: v.number(),
      keywordMatchScore: v.number(),
      actionVerbScore: v.number(),
      sentimentScore: v.number(),
      structureScore: v.number()
    }),
    topKeywords: v.array(v.string()),
    matchedKeywords: v.optional(v.array(v.string())),
    missingKeywords: v.optional(v.array(v.string())),
    actionVerbs: v.optional(v.array(v.string())),
    weakPhrases: v.optional(v.array(v.string())),
    entities: v.optional(v.object({
      skills: v.array(v.string()),
      technologies: v.array(v.string()),
      companies: v.array(v.string())
    })),
    skillsFound: v.optional(v.array(v.string())),
    bulletAnalysis: v.optional(v.object({
      strongCount: v.number(),
      weakCount: v.number(),
      avgQuality: v.number()
    })),
    formatMetrics: v.optional(v.object({
      sectionCount: v.number(),
      hasContactInfo: v.boolean(),
      hasProperHeadings: v.boolean(),
      readabilityScore: v.number()
    })),
    recommendations: v.array(v.union(
      v.string(),
      v.object({
        type: v.string(),
        title: v.string(),
        impact: v.number()
      })
    )),
    sentiment: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"]),

  // ML Performance Metrics: Track cache performance and prediction latency
  mlMetrics: defineTable({
    metricType: v.union(
      v.literal("cache_hit"),
      v.literal("cache_miss"),
      v.literal("prediction_latency"),
      v.literal("feature_extraction_latency"),
      v.literal("analysis_complete")
    ),
    value: v.number(),
    metadata: v.object({
      role: v.optional(v.string()),
      region: v.optional(v.string()),
      cacheKey: v.optional(v.string()),
    }),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_metric_type", ["metricType"])
    .index("by_type_and_timestamp", ["metricType", "timestamp"]),

  // NEW: ML Training Data - Advanced ML system for continuous learning
  mlTrainingData: defineTable({
    userId: v.string(),
    resumeId: v.id("resumes"),
    resumeHash: v.string(),
    features: v.object({
      wordCount: v.number(),
      averageSentenceLength: v.number(),
      uniqueWordRatio: v.number(),
      technicalDensity: v.number(),
      sectionCount: v.number(),
      bulletPointCount: v.number(),
      experienceYears: v.number(),
      educationLevel: v.number(),
      actionVerbDensity: v.number(),
      metricDensity: v.number(),
      quantifiableResultsCount: v.number(),
      readabilityScore: v.number(),
      professionalTone: v.number(),
      industryAlignment: v.number(),
      impactScore: v.number(),
      sentimentScore: v.number(),
      coherenceScore: v.number(),
      relevanceScore: v.number()
    }),
    predictedScore: v.number(),
    actualScore: v.number(),
    category: v.string(),
    isPremium: v.boolean(),
    userFeedback: v.optional(v.object({
      rescanned: v.boolean(),
      clickedUpgrade: v.boolean(),
      viewedDetails: v.boolean(),
      timeSpent: v.number(),
      editedResume: v.boolean()
    })),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_resume", ["resumeId"])
    .index("by_resume_hash", ["resumeHash"])
    .index("by_category", ["category"])
    .index("by_timestamp", ["timestamp"]),

  // NEW: ML Evaluations - Track model performance over time
  mlEvaluations: defineTable({
    accuracy: v.number(),
    results: v.any(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"]),

  // NEW: Intelligent Cache - Reduce AI API costs by 80-95%
  analysisCache: defineTable({
    contentHash: v.string(),
    service: v.string(), // "resumeAnalysis", "bulletRewrite", etc
    result: v.any(),
    userId: v.optional(v.string()),
    metadata: v.optional(v.object({
      textLength: v.number(),
      category: v.optional(v.string()),
      isPremium: v.boolean()
    })),
    createdAt: v.number(),
    lastAccessedAt: v.number(),
    accessCount: v.number(),
  })
    .index("by_content_hash", ["contentHash"])
    .index("by_service", ["service"])
    .index("by_created_at", ["createdAt"])
    .index("by_user", ["userId"]),

  waitlist: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),

  payments: defineTable({
    userId: v.id("users"),
    tokenIdentifier: v.string(),
    email: v.string(),
    plan: v.union(
      v.literal("single_debug_fix"),
      v.literal("single_scan"),
      v.literal("interview_sprint"),
      v.literal("iteration_pass")
    ),
    transactionId: v.string(),
    amount: v.number(),
    status: v.string(),
    purchasedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_transaction_id", ["transactionId"])
    .index("by_email", ["email"]),

  // AI Service Monitoring
  aiServiceLogs: defineTable({
    service: v.string(), // "chatbot", "resumeAnalysis", "interviewPrep", etc.
    model: v.string(), // "gemini-2.0-flash", "deepseek-chat", "fallback"
    errorType: v.string(), // "success", "timeout", "api_error", "parse_error", "rate_limit"
    errorMessage: v.optional(v.string()),
    userId: v.optional(v.string()),
    duration: v.optional(v.number()),
    usedFallback: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_service", ["service"])
    .index("by_user", ["userId"]),

  // User Feedback on AI Features
  aiFeedback: defineTable({
    userId: v.string(),
    featureType: v.union(
      v.literal("chatbot"),
      v.literal("resume_analysis"),
      v.literal("interview_prep"),
      v.literal("cover_letter"),
      v.literal("keyword_sniper"),
      v.literal("linkedin_optimizer"),
      v.literal("recruiter_dm")
    ),
    rating: v.union(
      v.literal("helpful"),
      v.literal("somewhat_helpful"),
      v.literal("not_helpful")
    ),
    wasAIGenerated: v.boolean(),
    comment: v.optional(v.string()),
    relatedId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_feature", ["featureType"])
    .index("by_timestamp", ["timestamp"]),

  // Blog Posts - SEO optimized content
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(), // URL-friendly version
    excerpt: v.string(), // Short description for SEO
    content: v.string(), // Full markdown/HTML content
    author: v.string(),
    category: v.string(), // "ATS Tips", "Resume Writing", "Job Search", etc.
    tags: v.array(v.string()), // Keywords for SEO
    featuredImage: v.optional(v.string()), // URL to image
    published: v.boolean(),
    publishedAt: v.optional(v.number()),
    // SEO fields
    metaTitle: v.optional(v.string()), // Custom SEO title
    metaDescription: v.optional(v.string()), // Custom SEO description
    keywords: v.array(v.string()), // SEO keywords
    canonicalUrl: v.optional(v.string()),
    readingTime: v.optional(v.number()), // Minutes
    views: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_published_and_date", ["published", "publishedAt"])
    .index("by_category", ["category"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["published", "category"],
    }),

  // Product Hunt Launch Tracking
  productHuntTracking: defineTable({
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    timestamp: v.number(),
    converted: v.boolean(),
    convertedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_converted", ["converted"]),

  // Coupons for special offers
  coupons: defineTable({
    code: v.string(), // e.g., "PH50", "LAUNCH2026"
    discountPercent: v.number(), // 50 for 50% off
    active: v.boolean(),
    maxUses: v.optional(v.number()), // null = unlimited
    usedCount: v.number(),
    expiresAt: v.optional(v.number()),
    createdBy: v.string(), // admin email
    description: v.optional(v.string()),
  })
    .index("by_code", ["code"])
    .index("by_active", ["active"]),

  // Coupon usage tracking
  couponUsages: defineTable({
    userId: v.string(),
    email: v.optional(v.string()),
    couponId: v.id("coupons"),
    couponCode: v.string(),
    discountPercent: v.number(),
    appliedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_coupon", ["couponId"])
    .index("by_user_and_coupon", ["userId", "couponId"]),

  // PHASE 3 - API Tables
  // API Keys for external integrations
  apiKeys: defineTable({
    key: v.string(),
    userId: v.string(),
    name: v.string(), // User-friendly name
    tier: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
    active: v.boolean(),
    rateLimit: v.number(), // Requests per hour
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
    lastUsedAt: v.optional(v.number()),
  })
    .index("by_key", ["key"])
    .index("by_user", ["userId"])
    .index("by_user_and_active", ["userId", "active"]),

  // API Usage tracking
  apiUsage: defineTable({
    apiKey: v.string(),
    endpoint: v.string(),
    requestId: v.string(),
    timestamp: v.number(),
    processingTime: v.number(),
    cached: v.boolean(),
  })
    .index("by_api_key_and_timestamp", ["apiKey", "timestamp"])
    .index("by_endpoint", ["endpoint"])
    .index("by_timestamp", ["timestamp"]),

  // Scoring cache for API
  scoringCache: defineTable({
    resumeHash: v.string(),
    jobDescriptionHash: v.string(),
    result: v.any(),
    timestamp: v.number(),
  })
    .index("by_hashes", ["resumeHash", "jobDescriptionHash"])
    .index("by_timestamp", ["timestamp"]),

  // Webhook deliveries
  webhookDeliveries: defineTable({
    requestId: v.string(),
    webhookUrl: v.string(),
    payload: v.any(),
    status: v.union(v.literal("delivered"), v.literal("failed")),
    timestamp: v.number(),
    retryCount: v.optional(v.number()),
  })
    .index("by_request_id", ["requestId"])
    .index("by_timestamp", ["timestamp"]),

  // ==========================================
  // PHASE 4 TABLES - REVOLUTIONARY FEATURES
  // ==========================================

  // Multi-language analyses
  languageAnalyses: defineTable({
    resumeId: v.id("resumes"),
    userId: v.string(),
    detectedLanguage: v.string(),
    languageConfidence: v.number(),
    culturalContext: v.string(),
    culturalComplianceScore: v.number(),
    atsScores: v.object({
      originalLanguage: v.number(),
      english: v.number(),
    }),
    recommendations: v.array(v.any()),
    translationAvailable: v.boolean(),
    timestamp: v.number(),
  })
    .index("by_resume", ["resumeId"])
    .index("by_user", ["userId"])
    .index("by_language", ["detectedLanguage"])
    .index("by_timestamp", ["timestamp"]),

  // Video resume analyses
  videoResumes: defineTable({
    userId: v.string(),
    storageId: v.id("_storage"),
    fileName: v.string(),
    duration: v.number(), // seconds
    fileSize: v.number(), // bytes
    mimeType: v.string(),
    status: v.union(v.literal("uploading"), v.literal("processing"), v.literal("completed"), v.literal("failed")),
    analysis: v.optional(v.object({
      overallScore: v.number(),
      visualPresentation: v.any(),
      audioQuality: v.any(),
      speechAnalysis: v.any(),
      contentQuality: v.any(),
      recommendations: v.array(v.any()),
    })),
    processingStartedAt: v.optional(v.number()),
    processingCompletedAt: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"]),

  // Social media profiles
  socialProfiles: defineTable({
    userId: v.string(),
    platform: v.union(v.literal("linkedin"), v.literal("github"), v.literal("portfolio")),
    profileUrl: v.string(),
    username: v.optional(v.string()),
    scrapedData: v.any(), // Flexible structure per platform
    brandScore: v.optional(v.number()),
    lastSyncedAt: v.number(),
    syncStatus: v.union(v.literal("synced"), v.literal("error"), v.literal("pending")),
    errorMessage: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_platform", ["platform"])
    .index("by_user_and_platform", ["userId", "platform"])
    .index("by_last_synced", ["lastSyncedAt"]),

  // Unified brand analysis
  brandAnalyses: defineTable({
    userId: v.string(),
    overallBrandScore: v.number(),
    platforms: v.any(), // LinkedIn, GitHub, Portfolio scores
    consistencyAnalysis: v.any(),
    brandStrength: v.any(),
    recommendations: v.array(v.any()),
    competitivePosition: v.any(),
    generatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_score", ["overallBrandScore"])
    .index("by_timestamp", ["generatedAt"]),

  // References
  references: defineTable({
    userId: v.string(),
    name: v.string(),
    title: v.string(),
    company: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    relationship: v.union(v.literal("manager"), v.literal("colleague"), v.literal("mentor"), v.literal("client"), v.literal("professor")),
    duration: v.string(), // e.g., "2020-2023"
    strengthScore: v.number(), // 0-100
    seniority: v.union(v.literal("entry"), v.literal("mid"), v.literal("senior"), v.literal("executive")),
    relevance: v.number(), // 0-100
    credibility: v.number(), // 0-100
    responseRate: v.optional(v.number()), // 0-1
    avgResponseTime: v.optional(v.number()), // hours
    lastContactedAt: v.optional(v.number()),
    preferredContact: v.union(v.literal("email"), v.literal("phone"), v.literal("linkedin")),
  })
    .index("by_user", ["userId"])
    .index("by_strength", ["strengthScore"])
    .index("by_user_and_strength", ["userId", "strengthScore"]),

  // Reference requests
  referenceRequests: defineTable({
    userId: v.string(),
    referenceId: v.id("references"),
    jobTitle: v.string(),
    company: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("declined"), v.literal("expired")),
    emailSubject: v.string(),
    emailBody: v.string(),
    requestSentAt: v.number(),
    remindersSent: v.number(),
    lastReminderAt: v.optional(v.number()),
    responseReceivedAt: v.optional(v.number()),
    recommendation: v.optional(v.string()),
    sentiment: v.optional(v.number()), // -1 to 1
    strengthScore: v.optional(v.number()), // 0-100
  })
    .index("by_user", ["userId"])
    .index("by_reference", ["referenceId"])
    .index("by_status", ["status"])
    .index("by_sent_at", ["requestSentAt"]),

  // Automated job applications
  automatedApplications: defineTable({
    userId: v.string(),
    jobTitle: v.string(),
    company: v.string(),
    jobUrl: v.string(),
    platform: v.string(), // linkedin, greenhouse, lever, workday, indeed, other
    status: v.union(
      v.literal("applied"),
      v.literal("reviewing"),
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
    appliedAt: v.number(),
    lastUpdated: v.optional(v.number()),
    tailoredResumeSnapshot: v.any(), // Snapshot of tailored resume used
    coverLetter: v.optional(v.string()),
    matchScore: v.optional(v.number()), // 0-100
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_applied_at", ["appliedAt"]),

  // Application outcomes for ML training
  applicationOutcomes: defineTable({
    userId: v.string(),
    applicationId: v.id("automatedApplications"),
    outcome: v.union(
      v.literal("interview"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("no_response")
    ),
    matchScore: v.number(),
    userExperience: v.number(),
    skillsMatched: v.number(),
    daysToResponse: v.optional(v.number()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_outcome", ["outcome"])
    .index("by_timestamp", ["timestamp"]),

  // Market intelligence reports
  marketIntelligence: defineTable({
    userId: v.string(),
    reportType: v.union(v.literal("salary"), v.literal("skills_demand"), v.literal("role_transition"), v.literal("location"), v.literal("competitive")),
    currentRole: v.string(),
    currentSalary: v.optional(v.number()),
    experience: v.number(), // years
    location: v.string(),
    skills: v.array(v.string()),
    data: v.any(), // Flexible structure per report type
    generatedAt: v.number(),
    expiresAt: v.number(), // Reports expire after 7 days
  })
    .index("by_user", ["userId"])
    .index("by_type", ["reportType"])
    .index("by_user_and_type", ["userId", "reportType"])
    .index("by_generated_at", ["generatedAt"])
    .index("by_expires_at", ["expiresAt"]),

  // Job market data (scraped from job boards)
  jobMarketData: defineTable({
    role: v.string(),
    location: v.string(),
    industry: v.string(),
    salaryRange: v.object({
      min: v.number(),
      max: v.number(),
      median: v.number(),
    }),
    demandScore: v.number(), // 0-100
    growthRate: v.number(), // % YoY
    competitionLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    topSkills: v.array(v.string()),
    topCompanies: v.array(v.string()),
    scrapedAt: v.number(),
    source: v.string(), // "linkedin", "indeed", etc.
  })
    .index("by_role", ["role"])
    .index("by_location", ["location"])
    .index("by_role_and_location", ["role", "location"])
    .index("by_scraped_at", ["scrapedAt"]),

  // Skills demand forecast
  skillsDemandForecast: defineTable({
    skill: v.string(),
    category: v.union(v.literal("technical"), v.literal("soft"), v.literal("tool"), v.literal("certification")),
    currentDemand: v.number(), // Job postings mentioning skill
    trend: v.union(v.literal("rising"), v.literal("stable"), v.literal("declining")),
    growthRate: v.number(), // % YoY
    forecast6Months: v.number(),
    forecast12Months: v.number(),
    salaryPremium: v.number(), // $ increase for having this skill
    learningTime: v.number(), // hours
    roi: v.number(), // salary premium / learning time
    updatedAt: v.number(),
  })
    .index("by_skill", ["skill"])
    .index("by_trend", ["trend"])
    .index("by_growth_rate", ["growthRate"])
    .index("by_roi", ["roi"])
    .index("by_updated_at", ["updatedAt"]),

  // Newsletter subscribers - The Resume Debugger weekly newsletter
  newsletterSubscribers: defineTable({
    email: v.string(),
    source: v.union(v.literal("landing"), v.literal("post-scan"), v.literal("dashboard")),
    subscribedAt: v.number(),
    isActive: v.boolean(),
    emailsSent: v.number(),
    unsubscribedAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_source", ["source"])
    .index("by_is_active", ["isActive"]),

  // Webhooks - Real-time event notifications
  webhooks: defineTable({
    url: v.string(),
    events: v.array(v.string()),
    enabled: v.boolean(),
    secret: v.optional(v.string()),
    retryPolicy: v.object({
      maxRetries: v.number(),
      backoffMs: v.number()
    }),
    filters: v.optional(v.any()),
    createdAt: v.number(),
    lastTriggered: v.optional(v.number()),
    successCount: v.number(),
    failureCount: v.number()
  })
    .index("by_enabled", ["enabled"])
    .index("by_created_at", ["createdAt"]),

  // Error Tracking System
  errorLogs: defineTable({
    message: v.string(),
    stack: v.optional(v.string()),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    category: v.union(
      v.literal("validation"),
      v.literal("authentication"),
      v.literal("authorization"),
      v.literal("database"),
      v.literal("network"),
      v.literal("api"),
      v.literal("ml_processing"),
      v.literal("file_processing"),
      v.literal("payment"),
      v.literal("unknown")
    ),
    userId: v.optional(v.id("users")),
    metadata: v.object({
      endpoint: v.optional(v.string()),
      userAgent: v.optional(v.string()),
      ip: v.optional(v.string()),
      requestId: v.optional(v.string()),
      additionalData: v.optional(v.any()),
    }),
    resolved: v.boolean(),
    resolvedAt: v.optional(v.number()),
    resolution: v.optional(v.string()),
    occurrenceCount: v.number(),
    firstOccurrence: v.number(),
    lastOccurrence: v.number(),
  })
    .index("by_last_occurrence", ["lastOccurrence"])
    .index("by_severity", ["severity"])
    .index("by_resolved", ["resolved"])
    .index("by_category_and_severity", ["category", "severity"]),

  // Recommendation Interaction Tracking
  recommendationInteractions: defineTable({
    userId: v.id("users"),
    recommendationType: v.string(),
    action: v.union(
      v.literal("viewed"),
      v.literal("clicked"),
      v.literal("dismissed"),
      v.literal("completed")
    ),
    metadata: v.any(),
    timestamp: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_type_and_action", ["recommendationType", "action"]),

  // Smart Notifications
  smartNotifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    metadata: v.any(),
    status: v.union(
      v.literal("pending"),
      v.literal("scheduled"),
      v.literal("delivered"),
      v.literal("failed")
    ),
    scheduledFor: v.number(),
    createdAt: v.number(),
    read: v.boolean(),
    readAt: v.optional(v.number()),
  })
    .index("by_user_and_created", ["userId", "createdAt"])
    .index("by_status_and_scheduled", ["status", "scheduledFor"])
    .index("by_priority", ["priority"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;