// Internationalization configuration for CVDebug
// Supports multiple countries and languages

export type SupportedLocale = 'en' | 'es' | 'fr' | 'de' | 'pt';

export interface Translation {
  // Hero Section
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustIndicator: string;
  };
  // Features
  features: {
    robotView: string;
    keywordGap: string;
    seniorityMatch: string;
    instantScan: string;
  };
  // Pricing
  pricing: {
    free: string;
    pass24h: string;
    sprint7d: string;
    currency: string;
    enterprise: {
      badge: string;
      title: string;
      subtitle: string;
      description: string;
      contactSales: string;
      viewPricing: string;
      feature1: string;
      feature1Desc: string;
      feature2: string;
      feature2Desc: string;
      feature3: string;
      feature3Desc: string;
    };
  };
  pricingLanding: {
    title: string;
    subtitle: string;
    // Free tier
    freeTitle: string;
    freeSubtitle: string;
    freeScanButton: string;
    freeFeature1: string;
    freeFeature2: string;
    freeFeature3: string;
    freeFeature4: string;
    freeGuarantee: string;
    // Single debug fix (€5.99)
    singleDebugBadge: string;
    singleDebugTitle: string;
    singleDebugSubtitle: string;
    singleDebugButton: string;
    singleDebugFeature1: string;
    singleDebugFeature2: string;
    singleDebugFeature3: string;
    singleDebugFeature4: string;
    singleDebugFeature5: string;
    singleDebugGuarantee: string;
    // 24h Pass (€14.99)
    pass24hBadge: string;
    pass24hTitle: string;
    pass24hSubtitle: string;
    pass24hButton: string;
    pass24hFeature1: string;
    pass24hFeature2: string;
    pass24hFeature3: string;
    pass24hFeature4: string;
    pass24hFeature5: string;
    pass24hFeature6: string;
    pass24hFeature7: string;
    pass24hGuarantee: string;
    // 7 Day Sprint (€24.99)
    sprint7dBadge: string;
    sprint7dTitle: string;
    sprint7dSubtitle: string;
    sprint7dBeforePrice: string;
    sprint7dButton: string;
    sprint7dFeature1: string;
    sprint7dFeature2: string;
    sprint7dFeature3: string;
    sprint7dFeature4: string;
    sprint7dFeature5: string;
    sprint7dFeature6: string;
    sprint7dFeature7: string;
    sprint7dGuarantee: string;
  };
  pricingDialog: {
    quickFix: string;
    pass24h: string;
    price24h: string;
    access24h: string;
    unlimitedScans24h: string;
    fullErrorReport: string;
    robotXRayView: string;
    keywordOptimizer: string;
    battlePlanGenerator: string;
    get24hPass: string;
    sprint7d: string;
    price7d: string;
    access7d: string;
    unlimitedScans7d: string;
    recommended: string;
    tryFree: string;
    noThanksJust24h: string;
    title: string;
    subtitle: string;
    start7DaySprint: string;
    secureCheckout: string;
    // Upsell section
    waitBeforeCheckout: string;
    applyingToOneJob: string;
    justMoreGetSprint: string;
    whyUpgrade: string;
    save60: string;
    unlimitedScansNotOne: string;
    aiCoverLetters: string;
    linkedinOptimization: string;
    candidatesChoseSprint: string;
    upgradeToSprint: string;
    // More hardcoded strings
    scorePreview: string;
    errorLabels: string;
    topKeywords: string;
    bestValue: string;
    sevenDaySprint: string;
    sevenDaysAccess: string;
    unlimitedCVScans: string;
    robotViewTerminal: string;
    missingSignalsDetector: string;
    seniorityMatchAudit: string;
    industrySelectorFAANG: string;
    bulletToneElevator: string;
    bonusExtras: string;
    coverLetterGen: string;
    linkedinOptimizer: string;
    devsJoined: string;
    sprintTestimonial: string;
    fastStart: string;
    loginToPurchase: string;
    checkoutFailed: string;
    checkoutError: string;
  };
  // Dashboard
  dashboard: {
    welcome: string;
    uploadCv: string;
    analyzing: string;
    score: string;
    issues: string;
    signIn: string;
    continueDashboard: string;
    welcomeBack: string;
    uploadMasterCv: string;
    uploadToStart: string;
    noKeywordsYet: string;
    noResumeFound: string;
    uploadToSeeATS: string;
    uploadToSeeText: string;
    resumeEditor: string;
    downloadAsTxt: string;
    noResumeLoaded: string;
    uploadToGetStarted: string;
    // New nav items
    masterCvs: string;
    tools: string;
    applications: string;
    match: string;
    missionControl: string;
    // Tool names
    keywordSniper: string;
    writingForge: string;
    bulletRewriter: string;
    coverLetterGen: string;
    linkedinOptimizer: string;
    // Actions
    upgradeToFix: string;
    aiRewrite: string;
    addJob: string;
    toolsMenu: string;
    // Status messages
    visibilityDebugger: string;
    autoRejectDetected: string;
    criticalError: string;
    // Success Insights
    successInsights: string;
    personalizedAnalytics: string;
    trackApplicationsToUnlock: string;
    personalDataMoat: string;
    yourPersonalDataAdvantage: string;
    moat: string;
    vsAverage: string;
    successRateLabel: string;
    applicationsCount: string;
    interviewsCount: string;
    topPerformingKeywords: string;
    dataUniqueToYou: string;
  };
  // Resume Detail Dialog
  resumeDetail: {
    // LinkedIn Upsell
    linkedinUpsellTitle: string;
    linkedinUpsellDescription: string;
    optimizeLinkedIn: string;
    maybeLater: string;
    checkLinkedIn: string;
    moreCallbacks: string;
    // Critical Errors
    zeroMetricsTitle: string;
    businessImpact: string;
    atsAutoReject: string;
    recruitersSpend6Seconds: string;
    higherCallbackRate: string;
    immediateFix: string;
    increasedSales: string;
    reducedCosts: string;
    ledTeam: string;
    // Tabs
    editTab: string;
    robotView: string;
    progressTab: string;
    actionPlanTab: string;
    interviewTab: string;
    recruiterTab: string;
    // Actions
    apply: string;
    optimizing: string;
    reanalyze: string;
    cancel: string;
  };
  // Preview Scan
  previewScan: {
    title: string;
    subtitle: string;
    dropHere: string;
    orBrowse: string;
    supports: string;
    addJobDesc: string;
    targetJobPosition: string;
    jobDescPlaceholder: string;
    jobDescAdded: string;
  };
  // Navigation
  nav: {
    features: string;
    pricing: string;
    login: string;
    logIn: string;
    signUp: string;
    dashboard: string;
    blog: string;
    product: string;
  };
  // Buttons
  buttons: {
    uploadResume: string;
    uploadNewCv: string;
    tryFree: string;
    getSingleScan: string;
    startSprint: string;
    checkMyResume: string;
    seeHowItWorks: string;
    viewFullReport: string;
    managePlan: string;
    upgradeNow: string;
    buyMoreCredits: string;
    launchTool: string;
  };
  // Navbar
  navbar: {
    analyzer: string;
    tools: string;
    pricing: string;
    dashboard: string;
    login: string;
    scanResume: string;
    scan: string;
  };
  // Auth
  auth: {
    loading: string;
    analyzing: string;
    parsing: string;
    optimizing: string;
    headline: string;
    subtitle: string;
    initSession: string;
    enterCredentials: string;
    signIn: string;
    signUp: string;
    noAccount: string;
    haveAccount: string;
    deployNew: string;
    signInLink: string;
    version: string;
    systemStatus: string;
    blueprintTitle: string;
    blueprintSubtitle: string;
    blueprintDescription: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    termsAgreement: string;
    atsVision: string;
    atsVisionDesc: string;
    aiAnalysis: string;
    aiAnalysisDesc: string;
    trackApps: string;
    trackAppsDesc: string;
  };
  // Sidebar
  sidebar: {
    home: string;
    myResumes: string;
    aiTools: string;
    eliteMatch: string;
    settings: string;
    adminPanel: string;
    sprintActive: string;
    days: string;
    hours: string;
    minutes: string;
    managePlan: string;
    upgradeNow: string;
    proPlan: string;
    freePlan: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    landingPage: string;
    signOut: string;
    upload: string;
    download: string;
    edit: string;
  };
  // Showcase Gallery
  showcase: {
    badge: string;
    heading: string;
    subheading: string;
    description: string;
    robotTech: string;
    robotDesc: string;
    instantScore: string;
    instantDesc: string;
    smartKeyword: string;
    smartDesc: string;
    enterpriseSec: string;
    enterpriseDesc: string;
    ctaBanner: string;
    ctaSubtext: string;
    ctaButton: string;
  };
  // Comparison Section
  comparison: {
    badge: string;
    heading: string;
    description: string;
    humanView: string;
    robotView: string;
  };
  // Footer
  footer: {
    description: string;
    product: string;
    pricing: string;
    freeScanner: string;
    blog: string;
    resources: string;
    aboutUs: string;
    contactUs: string;
    legal: string;
    privacy: string;
    terms: string;
    copyright: string;
    systemStatus: string;
    online: string;
  };
  // Landing Page
  landing: {
    nav: {
      features: string;
      pricing: string;
      login: string;
      signUp: string;
    };
    hero: {
      title: string;
      subtitle: string;
      startButton: string;
      viewDemo: string;
    };
    socialProof: {
      trustedBy: string;
    };
    stats: {
      stat1: string;
      stat2: string;
      stat3: string;
      stat4: string;
    };
    cta: {
      badge: string;
      heading: string;
      description: string;
      buttonText: string;
      footerText: string;
      secondary: string;
      button: string;
    };
    faq: {
      heading: string;
      question1: string;
      answer1: string;
      question2: string;
      answer2: string;
      question3: string;
      answer3: string;
      stillHaveQuestions: string;
      tryFreeScan: string;
    };
    testimonials: {
      badge: string;
      heading: string;
      subheading: string;
      subtitle: string;
      joinThousands: string;
      subreddits: string;
    };
    enterprise: {
      badge: string;
      title: string;
      subtitle: string;
      description: string;
      contactSales: string;
      viewPricing: string;
      feature1: string;
      feature1Desc: string;
      feature2: string;
      feature2Desc: string;
      feature3: string;
      feature3Desc: string;
    };
    finalCta: {
      heading: string;
      description: string;
      button: string;
      footer: string;
    };
  };
  // Onboarding
  onboarding: {
    steps: {
      role: string;
      upload: string;
      scan: string;
    };
    roleSelection: {
      heading: string;
      editLink: string;
      continueButton: string;
    };
    cvUpload: {
      heading: string;
      description: string;
      clickToUpload: string;
      dragDrop: string;
      maxSize: string;
      log1: string;
      log2: string;
      log3: string;
      log4: string;
      log5: string;
      log6: string;
      systemLogs: string;
      backButton: string;
      scanButton: string;
    };
    helpCenter: {
      label: string;
    };
  };
  // Pricing Page
  pricingPage: {
    freePlan: {
      name: string;
      description: string;
      price: string;
      period: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      button: string;
    };
    pass24h: {
      name: string;
      description: string;
      price: string;
      period: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      feature5: string;
      feature6: string;
      feature7: string;
      button: string;
    };
    sprint7d: {
      name: string;
      description: string;
      price: string;
      period: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      feature5: string;
      feature6: string;
      feature7: string;
      feature8: string;
      feature9: string;
      button: string;
      recommended: string;
    };
    hero: {
      badge: string;
      title: string;
      subtitle: string;
    };
    faq: {
      heading: string;
      question1: string;
      answer1: string;
      question2: string;
      answer2: string;
      question3: string;
      answer3: string;
      question4: string;
      answer4: string;
      question5: string;
      answer5: string;
      question6: string;
      answer6: string;
    };
    guarantee: string;
  };
  // Modals
  modals: {
    subscription: {
      title: string;
      tier: string;
      accessMessage: string;
      upgradeMessage: string;
      viewOptions: string;
      continueDashboard: string;
      pressEsc: string;
      premium: string;
      interviewSprint: string;
      singleScan: string;
      freePlan: string;
      // Score explanation
      scoreChanged: string;
      nowMatching: string;
      realVisibility: string;
      whyLower: string;
      industryStandards: string;
    };
    logout: {
      title: string;
      question: string;
      stayButton: string;
      logoutButton: string;
    };
    creditsExhausted: {
      title: string;
      message: string;
      scoreLabel: string;
      warning: string;
      feature1: string;
      feature2: string;
      price: string;
      unlockButton: string;
      maybeLater: string;
    };
  };
  // Toast Messages
  toasts: {
    errors: {
      selectRating: string;
      submissionFailed: string;
      fileRequired: string;
      invalidFormat: string;
      uploadFailed: string;
      aiProcessingError: string;
      fetchError: string;
      unauthorized: string;
      noCredits: string;
      apiKeyNotConfigured: string;
      noTransactionId: string;
      checkoutError: string;
      loginRequired: string;
      initiateError: string;
    };
    success: {
      feedbackSubmitted: string;
      cvUploaded: string;
      saved: string;
      deleted: string;
      updated: string;
      copied: string;
      downloaded: string;
      generated: string;
      optimized: string;
      applied: string;
    };
    warnings: {
      fileTooLarge: string;
      limitReached: string;
      replaceBrackets: string;
    };
  };
  // Images Alt Text
  images: {
    userAvatar: string;
    logo: string;
    feature: string;
  };
  // Admin Panel
  admin: {
    title: string;
    users: string;
    analytics: string;
    settings: string;
    import: {
      syncComplete: string;
      syncFailed: string;
      importFailed: string;
      importSuccess: string;
    };
    grant: {
      emailPlaceholder: string;
      namePlaceholder: string;
      planPlaceholder: string;
    };
    payment: {
      emailPlaceholder: string;
    };
    payments: {
      received: string;
    };
    usersTable: {
      searchPlaceholder: string;
      updated: string;
      updateError: string;
    };
    fix: {
      error: string;
      complete: string;
      reportedError: string;
      reportedComplete: string;
      deleteSuccess: string;
      deleteError: string;
    };
  };
  // AI Tools
  tools: {
    writingForge: {
      title: string;
      description: string;
      placeholder: string;
      analyzing: string;
      error: string;
      noText: string;
      tooShort: string;
      generating: string;
      improvementReady: string;
      noResume: string;
      emptyResume: string;
      saveError: string;
      saved: string;
      saveFailed: string;
      noTextToRegenerate: string;
      regenerating: string;
      regenerated: string;
      preparingPdf: string;
      editPlaceholder: string;
    };
    interviewBattle: {
      title: string;
      description: string;
      noResumeText: string;
      regenerating: string;
      questionsRegenerated: string;
      generateError: string;
      enhancing: string;
      answerEnhanced: string;
      actionPlaceholder: string;
      downloading: string;
      noJobDesc: string;
      battlePlanGenerated: string;
      battlePlanError: string;
      jobDescPlaceholder: string;
      invalidJobDesc: string;
      shortResume: string;
      requiresSubscription: string;
    };
    linkedIn: {
      title: string;
      description: string;
      upgradeDescription: string;
      noProfileText: string;
      analyzed: string;
      scanError: string;
      noBioOptimization: string;
      bioOptimized: string;
    };
    answerFinder: {
      title: string;
      searchPlaceholder: string;
    };
    keywordSniper: {
      title: string;
      uploadResume: string;
      pasteJob: string;
      analyzing: string;
      generateError: string;
      applied: string;
      rewritten: string;
      exampleDescription: string;
    };
    bullet: {
      noInput: string;
      optimized: string;
      rewriteError: string;
      examplePlaceholder: string;
      rolePlaceholder: string;
      powerStatementCopied: string;
    };
    coverLetter: {
      title: string;
      upgradeDescription: string;
      noJobDescription: string;
      generated: string;
      generateError: string;
      selectResume: string;
      companyPlaceholder: string;
      rolePlaceholder: string;
    };
    dm: {
      title: string;
      noProfile: string;
      generated: string;
      generateError: string;
      copied: string;
      namePlaceholder: string;
    };
    headline: {
      title: string;
      copied: string;
    };
    liveOptimizer: {
      title: string;
      placeholder: string;
    };
  };
  // Dashboard Extended
  dashboardExtended: {
    applications: {
      upgradeDescription: string;
      added: string;
      addError: string;
      companyPlaceholder: string;
      rolePlaceholder: string;
      urlPlaceholder: string;
      jobDescPlaceholder: string;
    };
    projects: {
      created: string;
      createError: string;
      projectPlaceholder: string;
      titlePlaceholder: string;
      urlPlaceholder: string;
      jobDescPlaceholder: string;
      uploadSuccess: string;
    };
    ats: {
      textCopied: string;
      textDownloaded: string;
      searchPlaceholder: string;
    };
    fluff: {
      metricCopied: string;
      copyError: string;
      copyErrorDescription: string;
      noMetricSelected: string;
      noMetricDescription: string;
    };
    sanitize: {
      noResume: string;
      success: string;
      successDescription: string;
      error: string;
    };
    scanning: {
      fileValidation: string;
      fileValidationSubtitle: string;
      layoutIntegrity: string;
      layoutIntegritySubtitle: string;
      keywordMatch: string;
      keywordMatchSubtitle: string;
      timeline: string;
      timelineSubtitle: string;
      scoring: string;
      scoringSubtitle: string;
    };
    metrics: {
      noQuantified: string;
      replaceBrackets: string;
      updated: string;
    };
    insights: {
      overall: string;
      keywordMatch: string;
      actionVerbs: string;
      impact: string;
      structure: string;
    };
    kanban: {
      applied: string;
      interviewing: string;
      accepted: string;
    };
    analysis: {
      error: string;
    };
    reportUnlocked: string;
    resumeDeleted: string;
    upgrade: {
      interviewSprintRequired: string;
    };
    feedback: {
      noRating: string;
      success: string;
      submitError: string;
      commentPlaceholder: string;
      tellMore: string;
    };
  };
  // Payment
  payment: {
    success: string;
    creditError: string;
    noTransactionId: string;
    receiptDownloaded: string;
    downloadError: string;
    checkoutError: string;
    loginRequired: string;
    initiateError: string;
  };
  // Pages
  pages: {
    nursing: {
      title: string;
      clinical: string;
      healthcare: string;
      credentials: string;
    };
    medSurg: {
      title: string;
      generic: string;
      patientRatios: string;
      surgicalExperience: string;
    };
    softwareEngineer: {
      title: string;
      techStack: string;
      faang: string;
      systemDesign: string;
    };
    dataAnalyst: {
      title: string;
      skills: string;
      metrics: string;
      techStack: string;
    };
    finance: {
      title: string;
      ibKeywords: string;
      format: string;
      metricsOptimizer: string;
    };
    about: {
      title: string;
      missionDriven: string;
      jobSeeker: string;
      innovation: string;
      privacyTitle: string;
    };
    blog: {
      title: string;
    };
    privacy: {
      title: string;
    };
    terms: {
      title: string;
    };
    contact: {
      title: string;
      email: string;
      chat: string;
      responseTime: string;
      location: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
    };
  };
  // Preview Scan
  previewScanExtended: {
    processError: string;
  };
  // Hero Section (HeroSection.tsx)
  heroSection: {
    badge: string;
    mainHeadline: string;
    diagnosticNote: string;
    oneTimePayment: string;
    checkResumeButton: string;
    seeHowButton: string;
    trustedBy: string;
    jobSeekers: string;
    criticalFixNeeded: string;
    missingKeywordsAlert: string;
  };
  // CTA Section (CTASection.tsx)
  ctaSection: {
    payOnceBadge: string;
    readyHeading: string;
    description: string;
    startButton: string;
    footnote: string;
  };
  // Testimonials Section
  testimonialsSection: {
    badge: string;
    heading: string;
    description: string;
    ctaText: string;
  };
  // FAQ Section
  faqSection: {
    heading: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
  };
  // Pricing Section (Landing Page)
  pricingSection: {
    heading: string;
    subheading: string;
    freePreview: string;
    free: string;
    seeScore: string;
    tryFree: string;
    singleScan: string;
    oneCompleteFix: string;
    getSingleScan: string;
    interviewSprint: string;
    sevenDaysUnlimited: string;
    startSprint: string;
    bestValue: string;
  };
  // Stats Section
  statsSection: {
    rejectionRate: string;
    rejectionLabel: string;
    noBSLabel: string;
    transparentPricing: string;
    analysisTime: string;
    avgTimeLabel: string;
    secureLabel: string;
    dataRetention: string;
  };
  // Features Bento
  featuresBento: {
    scatteredResumesTitle: string;
    projectBasedTitle: string;
    projectBasedDesc: string;
    healthMonitorTitle: string;
    healthMonitorDesc: string;
    keywordGapTitle: string;
    keywordGapDesc: string;
    aiCoverLetterTitle: string;
    aiCoverLetterDesc: string;
  };
  // Free Tier View (Paywall Component)
  freeTierView: {
    founderAudit: string;
    byAlbert: string;
    bottomPercentile: string;
    yourScore: string;
    autoRejected: string;
    thoseWhoGetInterviews: string;
    pointsHigher: string;
    passATSFilters: string;
    missingKeywords: string;
    unlockList: string;
    robotViewTitle: string;
    freePreviewBadge: string;
    robotViewDesc: string;
    robotViewWarning: string;
    noTextExtracted: string;
    parsingError: string;
    hiddenContent: string;
    chatGPTCantFix: string;
    moreErrors: string;
    topCriticalErrors: string;
    showingErrors: string;
    missingCriticalKeywords: string;
    highImpact: string;
    keywordsHidden: string;
    getCertified: string;
    unlockPackage: string;
    certificationPackage: string;
    allKeywords: string;
    allFormatErrors: string;
    aiRewrite: string;
    atsCertifiedPDF: string;
    pdfSanitizer: string;
    getCertifiedButton: string;
    albertReview: string;
    videoFeedback: string;
    manualReviewButton: string;
    oneTimePayment: string;
    instantAccess: string;
    noSubscription: string;
    socialProof: string;
    interviewIncrease: string;
  };
  // ATS Overview
  atsOverview: {
    title: string;
    scoreOf100: string;
    beatingPercentile: string;
    eliteReady: string;
    visibilityGap: string;
    criticalDanger: string;
    topCriticalFailures: string;
    technicalVsHuman: string;
    technicalSignalDesc: string;
    technicalSignal: string;
    humanSignal: string;
    humanSignalDesc: string;
    balanceNote: string;
    contactCheck: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    missing: string;
    seniorityInference: string;
    aiInference: string;
    soundLikeSenior: string;
    impactBreakdown: string;
    actionVerbs: string;
    quantifiableMetrics: string;
    targetMetrics: string;
    softSkills: string;
  };
  // Forms
  forms: {
    companyName: string;
    companyPlaceholder: string;
    jobTitle: string;
    jobTitlePlaceholder: string;
    jobUrl: string;
    jobUrlOptional: string;
    jobUrlPlaceholder: string;
    jobDescription: string;
    jobDescRecommended: string;
    jobDescPlaceholder: string;
    jobDescHint: string;
    cancel: string;
    addApplication: string;
    adding: string;
    addedSuccess: string;
    addedError: string;
  };
  // Dialogs
  dialogs: {
    addNewApplication: string;
    sprintRequired: string;
    upgradeMessage: string;
    upgradeNow: string;
    sprintRequiredError: string;
    upgradeForInsights: string;
  };
  // Score Card
  scoreCard: {
    resumeIs: string;
    ofBots: string;
    excellent: string;
    needsOptimization: string;
    criticalIssues: string;
    excellentMessage: string;
    optimizationMessage: string;
    criticalMessage: string;
    downloadReport: string;
    shareResults: string;
  };
  // Keyword Analysis
  keywordAnalysis: {
    title: string;
    subtitle: string;
    matchRate: string;
    foundSignals: string;
    total: string;
    groupByType: string;
    listView: string;
    gridView: string;
    missingCriticalSignals: string;
    highImpact: string;
    fixingIncreases: string;
    viewExamples: string;
    autoAdd: string;
    industryKeywordFrequency: string;
    aiPowered: string;
    showingExamples: string;
    viewHowTopCandidates: string;
    displayingFlatList: string;
    keywordsOrganized: string;
    switchedToView: string;
    showingAllKeywords: string;
    groupedByType: string;
    noMissingSignals: string;
    excellentKeywordCoverage: string;
    matchType: string;
    exactMatch: string;
    synonymMatch: string;
    semanticMatch: string;
    foundInResume: string;
    clickToHide: string;
    // Paywall content
    criticalSignalsLocked: string;
    unlockFullAnalysis: string;
    unlockDescription: string;
    quantifiedImpact: string;
    specificDescriptions: string;
    aiRecommendations: string;
    increaseScoreBy: string;
    detailedImpactAnalysis: string;
    impactPerKeyword: string;
    specificForEachKeyword: string;
    recommendedLocation: string;
    autoAddWithAI: string;
    unlockComplete: string;
    sevenDayPlan: string;
    keywordsMissingLocked: string;
    unlockCompleteList: string;
    unlockButton: string;
  };
  // Fluff Detector
  fluffDetector: {
    locked: string;
    unlockPremium: string;
    description: string;
    weakPhraseAnalysis: string;
    quantifiedMetrics: string;
    actionableReplacements: string;
    unlockFluff: string;
  };
  // Interview Prep
  interviewPrep: {
    locked: string;
    unlockBattlePlan: string;
    description: string;
    expectedQuestions: string;
    starStories: string;
    talkingPoints: string;
    unlockInterview: string;
  };
  // Recruiter DM
  recruiterDM: {
    locked: string;
    unlockDMGenerator: string;
    description: string;
    personalizedMessages: string;
    multipleVariations: string;
    keywordOptimized: string;
    unlockRecruiter: string;
  };
  // Conversion Banner
  conversionBanner: {
    currentBracket: string;
    youAreInBracket: string;
    unlockSprint: string;
    sprintEngine: string;
    reach: string;
    matchFaang: string;
    instantly: string;
    pointsBoost: string;
    faangKeywords: string;
    hourAccess: string;
    get24hPass: string;
    oneTimePayment: string;
    fixEverything: string;
    noSubscription: string;
    devsUpgraded: string;
    avgIncrease: string;
    points: string;
  };
  // ATS Simulation
  atsSimulation: {
    seniorityMatch: string;
    detectedLevel: string;
    experienceAudit: string;
    signalDensity: string;
    score: string;
    expected: string;
    signals: string;
    strength: string;
    junior: string;
    mid: string;
    senior: string;
    lead: string;
    match: string;
    review: string;
    year: string;
    years: string;
    strong: string;
    medium: string;
    weak: string;
    readability: string;
    highIntegrity: string;
    industryPatterns: string;
    imageTraps: string;
    safe: string;
    noneDetected: string;
    noInvisibleElements: string;
    atsGlobalScore: string;
    parsingEfficiency: string;
    liveAnalysis: string;
    fullReport: string;
  };
  // Keyword Sniper
  keywordSniper: {
    title: string;
    subtitle: string;
    noJobDescription: string;
    noJobDescriptionDesc: string;
    howToUseTitle: string;
    howToStep1: string;
    howToStep2: string;
    howToStep3: string;
    howToStep4: string;
    backToDashboard: string;
    interviewSprintRequired: string;
    injectKeywordsDesc: string;
    keywordInjection: string;
    liveScoreTracking: string;
    priorityTargeting: string;
    contextAwareAI: string;
    upgradeToSprint: string;
    back: string;
    targeting: string;
    currentResume: string;
    aiPremiumTools: string;
    viewExamples: string;
    viewExamplesDesc: string;
    applyMetric: string;
    applyMetricDesc: string;
    rewriteAll: string;
    rewriteAllDesc: string;
    battlePlan: string;
    battlePlanDesc: string;
    suggestionApplied: string;
    noMissingKeywords: string;
    rewriteSuccess: string;
    lockedTitle: string;
    lockedDesc: string;
    upgradeNow: string;
  };
  // Create Project Dialog
  createProject: {
    title: string;
    subtitle: string;
    projectName: string;
    projectNamePlaceholder: string;
    targetRole: string;
    targetRolePlaceholder: string;
    targetRoleHint: string;
    jobDescription: string;
    optional: string;
    linkUrl: string;
    pasteText: string;
    urlPlaceholder: string;
    textPlaceholder: string;
    aiAnalysisTitle: string;
    aiAnalysisDesc: string;
    cancel: string;
    createButton: string;
    creating: string;
    successMessage: string;
    errorMessage: string;
  };
  // Create Application Dialog
  createApplication: {
    title: string;
    sprintRequired: string;
    upgradeDesc: string;
    upgradeNow: string;
    companyName: string;
    companyPlaceholder: string;
    jobTitle: string;
    jobTitlePlaceholder: string;
    jobUrl: string;
    optional: string;
    urlPlaceholder: string;
    jobDescription: string;
    recommendedAI: string;
    descriptionPlaceholder: string;
    cancel: string;
    addApplication: string;
    adding: string;
    planRequired: string;
    planRequiredDesc: string;
    successMessage: string;
    errorMessage: string;
    featureRestricted: string;
  };
  // Mission Control
  missionControl: {
    title: string;
    welcomeBack: string;
    eliminateBugs: string;
    newApplication: string;
    visibilityScore: string;
    howRecruitersFind: string;
    activeApplications: string;
    interviewsScheduled: string;
    missingSignals: string;
    critical: string;
    impactingMatchScore: string;
    robotViewTitle: string;
    robotViewSubtitle: string;
    uploadToSeeExtraction: string;
    missingKeywords: string;
    allKeywordsDetected: string;
    needPoints: string;
    reachEliteTier: string;
    viewFullReport: string;
    uploadResume: string;
    careerHealth: string;
    elite: string;
    pro: string;
    rising: string;
    starter: string;
    progressToElite: string;
    cvScore: string;
    applications: string;
    interviews: string;
    applicationKanban: string;
    viewAll: string;
    applied: string;
    noApplicationsYet: string;
    position: string;
    company: string;
    recent: string;
    interviewing: string;
    noInterviewsYet: string;
    inProgress: string;
    accepted: string;
    noOffersYet: string;
    topErrors: string;
    noCVLoaded: string;
    consoleBash: string;
    noCriticalErrors: string;
    allSystemsOperational: string;
    debugMasterCV: string;
    missingKeyword: string;
    matchScoreImpact: string;
    dateFormatInconsistency: string;
    atExperienceBlock: string;
  };
  // ATS Report
  atsReport: {
    missingSignals: string;
    critical: string;
    important: string;
    niceToHave: string;
    fix: string;
    invisibleToBot: string;
    atsWillReject: string;
    needsOptimization: string;
    readyToApply: string;
    context: string;
    offerRequires: string;
    youNeedToAdd: string;
    missingThisToken: string;
    addSignalsOf: string;
    upgrade: string;
    percentInvisible: string;
    needsOptimizationBefore: string;
  };
  // Projects View
  projectsView: {
    searchPlaceholder: string;
    uploadNewMasterCV: string;
    allProjects: string;
    highMatch: string;
    needsReview: string;
    archived: string;
    sortBy: string;
    lastUpdated: string;
    loadingProjects: string;
    noProjectsYet: string;
    noProjectsDesc: string;
    createFirstProject: string;
    matchScore: string;
    stable: string;
    missingData: string;
    highPriority: string;
    strong: string;
    moderate: string;
    low: string;
    hoursAgo: string;
    daysAgo: string;
    weeksAgo: string;
    openProjectBoard: string;
    createNewProject: string;
    createNewProjectDesc: string;
  };
  // Resume Grid
  resumeGrid: {
    loadingResumes: string;
    analyzing: string;
    error: string;
    excellent: string;
    moderate: string;
    critical: string;
    noResumesFound: string;
    noResumesDesc: string;
    uploadResume: string;
    createManually: string;
    createProject: string;
    searchPlaceholder: string;
    listView: string;
    gridView: string;
    resumeName: string;
    uploadDate: string;
    lastAnalyzed: string;
    healthScore: string;
    actions: string;
    viewDetails: string;
    reAnalyze: string;
    delete: string;
    justNow: string;
    showing: string;
    to: string;
    of: string;
    results: string;
    previous: string;
    next: string;
    noSearchResults: string;
  };
  // AI Feedback Widget
  aiFeedback: {
    rateResponse: string;
    howHelpful: string;
    feedbackHelps: string;
    helpful: string;
    okay: string;
    notHelpful: string;
    additionalComments: string;
    submitFeedback: string;
    thankYou: string;
    wasHelpful: string;
    yes: string;
    somewhat: string;
    no: string;
    tellMore: string;
    submit: string;
    selectRating: string;
    feedbackSubmitted: string;
    submitError: string;
  };
  // Elite Match Tool
  eliteMatchTool: {
    title: string;
    subtitle: string;
    urlLabel: string;
    urlPlaceholder: string;
    urlHelp: string;
    textLabel: string;
    textPlaceholder: string;
    textHelp: string;
    analyzeButton: string;
    featureExtraction: string;
    featureExtractionDesc: string;
    gapAnalysis: string;
    gapAnalysisDesc: string;
    autoFix: string;
    autoFixDesc: string;
    premiumTitle: string;
    premiumSubtitle: string;
    premiumFeatures: string;
    scoreTitle: string;
    scoreExcellent: string;
    scoreGood: string;
    scoreNeedsWork: string;
    missingCritical: string;
    matchedSkills: string;
    robotViewTitle: string;
    redZones: string;
    greenZones: string;
    recommendations: string;
    analyzeAnother: string;
    applyFix: string;
    applyFixSuccess: string;
    analyzingStep1: string;
    analyzingStep2: string;
    analyzingStep3: string;
    analyzingStep4: string;
    errorAnalyzing: string;
    errorUnknown: string;
  };
  // Ecosystem Prompts
  ecosystem: {
    copyPasteTip: {
      badge: string;
      title: string;
      description: string;
      actionLabel: string;
      successMessage: string;
    };
    linkedinReminder: {
      badge: string;
      title: string;
      description: string;
      actionLabel: string;
    };
    keyboardShortcuts: {
      badge: string;
      title: string;
      description: string;
      actionLabel: string;
      infoMessage: string;
    };
    dismissLabel: string;
    freeLabel: string;
    bookmarklet: {
      title: string;
      step1Title: string;
      step1Copy: string;
      step1Copied: string;
      step2Title: string;
      step2Instructions: string[];
      step3Title: string;
      step3Description: string;
      proTip: string;
      successCopied: string;
      openingChecklist: string;
      comingSoon: string;
    };
  };
}

export const translations: Record<SupportedLocale, Translation> = {
  'en': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: '12,847 job seekers debugged their resumes with CVDebug. Avg. 8 days to first interview. Avg. 2.4 job offers per person. 89% hired within 60 days.',
      ctaPrimary: 'See Robot View - Free',
      ctaSecondary: 'Sign Up for Full Access',
      trustIndicator: '3.2x more interviews • 14 days avg. to job offer • No random tool testing',
    },
    features: {
      robotView: 'Robot View Terminal',
      keywordGap: 'Missing Signals Detector',
      seniorityMatch: 'Seniority Match Audit',
      instantScan: 'Instant ATS Score',
    },
    pricing: {
      free: 'Free Scan',
      pass24h: '24-Hour Pass',
      sprint7d: '7-Day Sprint',
      currency: '$',
      enterprise: {
        badge: 'Enterprise',
        title: 'Scale Your Hiring',
        subtitle: 'Without Compromise',
        description: 'Built for recruiting teams that process thousands of applications. Get volume discounts, dedicated support, and custom integrations.',
        contactSales: 'Contact Sales',
        viewPricing: 'View Pricing',
        feature1: 'Team Management',
        feature1Desc: 'Centralized dashboard for HR teams to track all candidate applications',
        feature2: 'SOC 2 Compliant',
        feature2Desc: 'Enterprise-grade security with SSO and role-based access control',
        feature3: 'API Access',
        feature3Desc: 'Integrate ATS scanning directly into your recruitment workflow',
      },
    },
    pricingLanding: {
      title: 'Simple Pricing',
      subtitle: 'Pay once. Fix forever. No subscriptions.',
      // Free tier
      freeTitle: 'FREE Debug',
      freeSubtitle: 'Discover which keywords the robot DOESN\'T see',
      freeScanButton: 'Scan for Free',
      freeFeature1: 'Invisibility Detection (2 keywords)',
      freeFeature2: 'Global ATS Score',
      freeFeature3: 'Robot View (locked)',
      freeFeature4: 'Preview Seniority Match',
      freeGuarantee: '✓ READABLE TEMPLATE GUARANTEED',
      // Single debug fix (€5.99)
      singleDebugBadge: 'FIX IT ONCE',
      singleDebugTitle: 'Quick Fix',
      singleDebugSubtitle: 'Fix your CV for the price of a coffee',
      singleDebugButton: 'Fix My CV →',
      singleDebugFeature1: '1 Complete Deep Scan',
      singleDebugFeature2: 'Robot View Unlocked',
      singleDebugFeature3: '1 AI Optimization (Rewrite)',
      singleDebugFeature4: 'Auto-Keyword Injection',
      singleDebugFeature5: 'Export Optimized CV',
      singleDebugGuarantee: '✓ READABLE TEMPLATE GUARANTEED',
      // 24h Pass (€14.99)
      pass24hBadge: 'HOT FIX / URGENT',
      pass24hTitle: '24h Pass',
      pass24hSubtitle: 'Instant Debug for tomorrow\'s interview',
      pass24hButton: '24h Access →',
      pass24hFeature1: 'Unlimited Scans (24h)',
      pass24hFeature2: 'Full Robot X-Ray View',
      pass24hFeature3: '[ERROR] + [WARN] + Fixes Tags',
      pass24hFeature4: 'Keyword Gap Detector',
      pass24hFeature5: 'Cover Letter Generator',
      pass24hFeature6: '100% ATS-Readable Template',
      pass24hFeature7: 'Unlimited Cover Letter Generator',
      pass24hGuarantee: '✓ GUARANTEED',
      // 7 Day Sprint (€24.99)
      sprint7dBadge: 'INTENSIVE / RECOMMENDED',
      sprint7dTitle: '7-Day Sprint',
      sprint7dSubtitle: 'Beast Mode. Full 7-day attack',
      sprint7dBeforePrice: '€49.99',
      sprint7dButton: 'Start 7-Day Sprint →',
      sprint7dFeature1: 'Unlimited Scans (7 days)',
      sprint7dFeature2: 'Industry Selector (FAANG/Finance)',
      sprint7dFeature3: 'Bullet Tone Elevator (AI Rewrite)',
      sprint7dFeature4: 'Interview Battle Plan',
      sprint7dFeature5: 'DM Scripts for Recruiters',
      sprint7dFeature6: 'Cover Letter + LinkedIn Optimizer',
      sprint7dFeature7: 'Recruiter DM Templates',
      sprint7dGuarantee: '✓ 100% READABLE TEMPLATE GUARANTEED',
    },
    pricingDialog: {
      quickFix: 'Quick Fix',
      pass24h: '24h Pass',
      price24h: '$14.99',
      access24h: '24-hour access',
      unlimitedScans24h: 'Unlimited Scans (24h)',
      fullErrorReport: 'Full [ERROR] Report',
      robotXRayView: 'Robot X-Ray View',
      keywordOptimizer: 'Keyword Optimizer',
      battlePlanGenerator: 'Battle Plan Generator',
      get24hPass: 'Get 24h Pass',
      sprint7d: '7-Day Sprint',
      price7d: '$39.99',
      access7d: '7-day access',
      unlimitedScans7d: 'Unlimited Scans (7 Days)',
      recommended: 'RECOMMENDED',
      tryFree: 'Try Free',
      noThanksJust24h: 'No thanks, just 24h Pass',
      title: 'Simple, Transparent Pricing',
      subtitle: 'One-time payments for professional results. No recurring subscriptions or hidden fees.',
      start7DaySprint: 'Start 7-Day Sprint 🚀',
      secureCheckout: 'Secure 256-bit Encrypted Checkout',
      // Upsell section
      waitBeforeCheckout: '⚠️ WAIT! Before You Checkout...',
      applyingToOneJob: 'Are You Applying to Only ONE Job?',
      justMoreGetSprint: 'For just €10 more, get the Interview Sprint.',
      whyUpgrade: 'Why Upgrade?',
      save60: 'Save 60%',
      unlimitedScansNotOne: 'Unlimited scans for 7 days (not just one)',
      aiCoverLetters: 'AI-powered cover letters for every application',
      linkedinOptimization: 'LinkedIn profile optimization included',
      candidatesChoseSprint: '1,200+ candidates chose Interview Sprint and landed roles at:',
      upgradeToSprint: 'Yes, Upgrade to Sprint (€24.99) 🚀',
      // More hardcoded strings
      scorePreview: 'Score Preview',
      errorLabels: '[ERROR] Labels',
      topKeywords: 'Top 2 Keywords',
      bestValue: 'BEST VALUE',
      sevenDaySprint: '7-Day Sprint',
      sevenDaysAccess: '7 days full access',
      unlimitedCVScans: 'Unlimited CV Scans (7d)',
      robotViewTerminal: 'Robot View Terminal',
      missingSignalsDetector: 'Missing Signals Detector',
      seniorityMatchAudit: 'Seniority Match Audit',
      industrySelectorFAANG: 'Industry Selector (FAANG/Finance)',
      bulletToneElevator: 'Bullet Tone Elevator',
      bonusExtras: 'Bonus Extras:',
      coverLetterGen: 'Cover Letter Gen',
      linkedinOptimizer: 'LinkedIn Optimizer',
      devsJoined: '1,200+ devs joined',
      sprintTestimonial: '"Sprint helped me fix bugs and land 5 interviews in 1 week"',
      fastStart: 'FAST START',
      loginToPurchase: 'Please log in to purchase credits',
      checkoutFailed: 'Failed to start checkout',
      checkoutError: 'Failed to initiate checkout',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your resume',
      analyzing: 'Analyzing your resume...',
      score: 'ATS Score',
      issues: 'Issues Found',
      signIn: 'Sign In',
      continueDashboard: 'Continue to Dashboard',
      welcomeBack: 'Welcome back',
      uploadMasterCv: 'Upload your Master CV',
      uploadToStart: 'Upload resume to start',
      noKeywordsYet: 'No keywords yet',
      noResumeFound: 'No Resume Found',
      uploadToSeeATS: 'Upload a resume to see how ATS robots interpret your document.',
      uploadToSeeText: 'Upload a resume to see raw text extraction',
      resumeEditor: 'Resume Editor',
      downloadAsTxt: 'Download as .txt',
      noResumeLoaded: 'No resume loaded. Upload a resume from the dashboard to start editing.',
      uploadToGetStarted: 'Upload a resume to get started',
      // New nav items
      masterCvs: 'Master CVs',
      tools: 'AI Tools',
      applications: 'Applications',
      match: 'Elite Match',
      missionControl: 'Mission Control',
      // Tool names
      keywordSniper: 'Keyword Sniper',
      writingForge: 'Writing Forge',
      bulletRewriter: 'Bullet Rewriter',
      coverLetterGen: 'Cover Letter',
      linkedinOptimizer: 'LinkedIn Optimizer',
      // Actions
      upgradeToFix: 'Upgrade to Fix',
      aiRewrite: 'AI Rewrite',
      addJob: 'Add Job',
      toolsMenu: 'Tools',
      // Status messages
      visibilityDebugger: 'Visibility Debugger',
      autoRejectDetected: 'AUTO_REJECT DETECTED',
      criticalError: 'CRITICAL ERROR',
      // Success Insights
      successInsights: 'Success Insights',
      personalizedAnalytics: 'Personalized analytics unlocked soon',
      trackApplicationsToUnlock: 'Track 3+ applications and get your first interview to unlock personalized insights',
      personalDataMoat: 'Your personal data moat awaits',
      yourPersonalDataAdvantage: 'Your personal data advantage',
      moat: 'MOAT',
      vsAverage: 'vs average',
      successRateLabel: 'success rate',
      applicationsCount: 'Applications',
      interviewsCount: 'Interviews',
      topPerformingKeywords: 'Top Performing Keywords',
      dataUniqueToYou: '🔒 This data is unique to you and cannot be replicated by competitors',
    },
    resumeDetail: {
      // LinkedIn Upsell
      linkedinUpsellTitle: 'CV Optimized → LinkedIn is Next',
      linkedinUpsellDescription: 'Your CV is ready (Score: {score}%). 89% of recruiters check LinkedIn before contacting. Don\'t lose opportunities due to an outdated profile.',
      optimizeLinkedIn: 'Optimize LinkedIn Now',
      maybeLater: 'Maybe Later',
      checkLinkedIn: 'check LinkedIn',
      moreCallbacks: 'more callbacks',
      // Critical Errors
      zeroMetricsTitle: 'ZERO METRICS = AUTO-REJECT',
      businessImpact: 'BUSINESS IMPACT:',
      atsAutoReject: 'of ATS systems auto-reject resumes without numbers',
      recruitersSpend6Seconds: 'Recruiters spend 6 seconds - metrics catch attention instantly',
      higherCallbackRate: 'higher callback rate when quantifiable achievements present',
      immediateFix: 'IMMEDIATE FIX:',
      increasedSales: 'Increased sales by',
      reducedCosts: 'Reduced costs by',
      ledTeam: 'Led team of',
      // Tabs
      editTab: 'Edit',
      robotView: 'Robot View',
      progressTab: 'Progress',
      actionPlanTab: 'Action Plan',
      interviewTab: 'Interview',
      recruiterTab: 'Recruiter',
      // Actions
      apply: 'Apply',
      optimizing: 'Optimizing...',
      reanalyze: 'Re-analyze',
      cancel: 'Cancel',
    },
    previewScan: {
      title: 'Deep Diagnostic Scan',
      subtitle: 'See exactly how ATS systems parse your resume - no signup required',
      dropHere: 'Drop your resume here',
      orBrowse: 'or click to browse files',
      supports: 'Supports PDF, Word, and Images',
      addJobDesc: 'Add target job description for better matching (optional)',
      targetJobPosition: 'Target Job Position',
      jobDescPlaceholder: 'Paste the full job description here...',
      jobDescAdded: 'Job description added - will enhance keyword analysis',
    },
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      login: 'Login',
      logIn: 'Log in',
      signUp: 'Sign Up',
      dashboard: 'Dashboard',
      blog: 'Blog',
      product: 'Product',
    },
    buttons: {
      uploadResume: 'Upload Resume',
      uploadNewCv: 'Upload New CV',
      tryFree: 'Try Free',
      getSingleScan: 'Get Single Scan',
      startSprint: 'Start Sprint',
      checkMyResume: 'Check My Resume',
      seeHowItWorks: 'See How It Works',
      viewFullReport: 'View Full Report',
      managePlan: 'Manage Plan',
      upgradeNow: 'Upgrade Now',
      buyMoreCredits: 'Buy More Credits',
      launchTool: 'Launch Tool',
    },
    navbar: {
      analyzer: 'Analyzer',
      tools: 'Tools',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      login: 'Log in',
      scanResume: 'Scan Resume',
      scan: 'Scan',
    },
    auth: {
      loading: 'Initializing session...',
      analyzing: 'ANALYZING_STRUCTURE...',
      parsing: 'PARSING_KEYWORDS...',
      optimizing: 'OPTIMIZING_ATS_SCORE...',
      headline: 'Debug your career history with precision.',
      subtitle: 'Join thousands of job seekers who optimized their resumes with AI-powered analysis and landed their dream jobs.',
      initSession: 'Initialize Session',
      enterCredentials: 'Enter your credentials to access the console',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      noAccount: 'No account found?',
      haveAccount: 'Already have an account?',
      deployNew: '[Deploy new profile]',
      signInLink: '[Sign in]',
      version: 'v2.4.0-stable',
      systemStatus: 'System Operational',
      blueprintTitle: 'Debug Your Resume Like a Pro',
      blueprintSubtitle: 'Join thousands of job seekers who\'ve optimized their resumes with AI-powered insights and landed their dream jobs.',
      blueprintDescription: 'Join thousands of job seekers who\'ve optimized their resumes with AI-powered insights and landed their dream jobs.',
      feature1Title: 'ATS Robot Vision',
      feature1Desc: 'See exactly what recruiters\' systems see',
      feature2Title: 'AI-Powered Analysis',
      feature2Desc: 'Get instant feedback on keywords, format, and impact',
      feature3Title: 'Track Applications',
      feature3Desc: 'Manage your job search in one place',
      termsAgreement: 'By continuing, you agree to our Terms of Service and Privacy Policy',
      atsVision: 'ATS Robot Vision',
      atsVisionDesc: 'See exactly what recruiters\' systems see',
      aiAnalysis: 'AI-Powered Analysis',
      aiAnalysisDesc: 'Get instant feedback on keywords, format, and impact',
      trackApps: 'Track Applications',
      trackAppsDesc: 'Manage your job search in one place',
    },
    sidebar: {
      home: 'Home',
      myResumes: 'My Resumes',
      aiTools: 'AI Tools',
      eliteMatch: 'Match Elite',
      settings: 'Settings',
      adminPanel: 'Admin Panel',
      sprintActive: 'Sprint Active',
      days: 'DAYS',
      hours: 'HRS',
      minutes: 'MIN',
      managePlan: 'Manage Plan',
      upgradeNow: 'Upgrade Now',
      proPlan: 'Pro Plan',
      freePlan: 'Free Plan',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      landingPage: 'Landing Page',
      signOut: 'Sign Out',
      upload: 'Upload',
      download: 'Download',
      edit: 'Edit',
    },
    showcase: {
      badge: 'Free ATS Scanner',
      heading: 'Beat ATS Systems',
      subheading: 'In 10 Seconds',
      description: 'See your resume the way robots see it. Get instant feedback and land more interviews.',
      robotTech: 'Robot View Technology',
      robotDesc: 'See exactly what ATS robots see - no guessing',
      instantScore: 'Instant ATS Score',
      instantDesc: 'Get your compatibility score in 10 seconds',
      smartKeyword: 'Smart Keyword Analysis',
      smartDesc: 'AI-powered matching with job descriptions',
      enterpriseSec: 'Enterprise Security',
      enterpriseDesc: 'Your data stays private and secure',
      ctaBanner: 'Get Your Free ATS Score',
      ctaSubtext: 'Scan your resume in 10 seconds - no signup required',
      ctaButton: 'Try Free Scan →',
    },
    comparison: {
      badge: 'Reality Check',
      heading: 'What you see vs. What they see',
      description: 'Most modern resume templates look great to humans but are a nightmare for robots. Columns, icons, and graphics often break the parsing logic.',
      humanView: 'Human View (PDF)',
      robotView: 'Robot View (Parsed)',
    },
    footer: {
      description: 'Beat ATS systems with AI-powered resume optimization. Get hired faster.',
      product: 'Product',
      pricing: 'Pricing',
      freeScanner: 'Free Scanner',
      blog: 'Blog',
      resources: 'Resources',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      copyright: '© 2026 CVDebug Inc. All rights reserved. System Status:',
      systemStatus: 'System Status:',
      online: 'Online',
    },
    landing: {
      nav: {
        features: 'Features',
        pricing: 'Pricing',
        login: 'Log in',
        signUp: 'Sign Up',
      },
      hero: {
        title: 'Debug Your Resume Like a Pro',
        subtitle: 'Stop getting rejected. See exactly what ATS systems see and fix it in minutes.',
        startButton: 'Start Free Scan',
        viewDemo: 'View Demo',
      },
      socialProof: {
        trustedBy: 'Trusted by job seekers at',
      },
      stats: {
        stat1: '50,000+ resumes scanned',
        stat2: '3.2x more interviews on average',
        stat3: '14 days avg. time to job offer',
        stat4: '89% hired within 60 days',
      },
      cta: {
        badge: 'Get Started',
        heading: 'Ready to land your dream job?',
        description: '12,847 job seekers used CVDebug. Average time to first interview: 8 days. Average job offers: 2.4 per person. Stop trying random tools and join those who succeeded.',
        buttonText: 'Start Free Scan Now',
        footerText: 'No credit card required',
        secondary: 'Still have questions? Try our free ATS scanner now',
        button: 'Scan Your Resume Free →',
      },
      faq: {
        heading: 'Frequently Asked Questions',
        question1: 'What is an ATS system?',
        answer1: 'ATS (Applicant Tracking System) is software that companies use to filter resumes before they reach human recruiters. Most large companies use ATS, and it can reject up to 75% of resumes.',
        question2: 'How does CVDebug help me?',
        answer2: 'CVDebug shows you exactly how ATS systems parse your resume, identifies missing keywords, and provides actionable recommendations to improve your ATS score.',
        question3: 'Is my data secure?',
        answer3: 'Yes! We use enterprise-grade encryption and never share your data with third parties. Your resume is processed securely and deleted after analysis unless you save it.',
        stillHaveQuestions: 'Still have questions? Try our free ATS scanner now',
        tryFreeScan: 'Scan Your Resume Free →',
      },
      testimonials: {
        badge: 'Reddit Wall of Love',
        heading: 'Trusted by Redditors Worldwide',
        subheading: 'Real feedback from r/resumes, r/developersIndia, r/cscareerquestions, and more.',
        subtitle: 'Real feedback from r/resumes, r/developersIndia, r/cscareerquestions, and more.',
        joinThousands: 'Join thousands of job seekers optimizing their resumes',
        subreddits: 'r/resumes, r/developersIndia, r/cscareerquestions, r/ProductManagement, r/datascience',
      },
      enterprise: {
        badge: 'Enterprise',
        title: 'Scale Your Hiring',
        subtitle: 'Without Compromise',
        description: 'Built for recruiting teams that process thousands of applications. Get volume discounts, dedicated support, and custom integrations.',
        contactSales: 'Contact Sales',
        viewPricing: 'View Pricing',
        feature1: 'Team Management',
        feature1Desc: 'Centralized dashboard for HR teams to track all candidate applications',
        feature2: 'SOC 2 Compliant',
        feature2Desc: 'Enterprise-grade security with SSO and role-based access control',
        feature3: 'API Access',
        feature3Desc: 'Integrate ATS scanning directly into your recruitment workflow',
      },
      finalCta: {
        heading: 'Ready to debug your career?',
        description: 'Join 10,000+ developers who fixed their parsing errors and doubled their interview rate.',
        button: 'Check My Visibility (Free Scan)',
        footer: 'No credit card required • GDPR Compliant • Instant Result',
      },
    },
    onboarding: {
      steps: {
        role: 'Role',
        upload: 'Upload',
        scan: 'Scan',
      },
      roleSelection: {
        heading: 'What role are you targeting?',
        editLink: 'Edit',
        continueButton: 'Continue',
      },
      cvUpload: {
        heading: 'Upload Your Resume',
        description: 'Drop your resume file or click to browse',
        clickToUpload: 'Click to upload',
        dragDrop: 'or drag and drop',
        maxSize: 'PDF, DOC, DOCX up to 10MB',
        log1: '[INIT] Parsing document structure...',
        log2: '[SCAN] Analyzing keywords and formatting...',
        log3: '[CHECK] Running ATS compatibility checks...',
        log4: '[MATCH] Comparing with job requirements...',
        log5: '[SCORE] Calculating final score...',
        log6: '[DONE] Analysis complete!',
        systemLogs: 'System Logs',
        backButton: 'Back',
        scanButton: 'Scan Resume',
      },
      helpCenter: {
        label: 'Help Center',
      },
    },
    pricingPage: {
      freePlan: {
        name: 'Free Scan',
        description: 'Perfect for trying out CVDebug',
        price: '0',
        period: 'one-time',
        feature1: '1 free resume scan',
        feature2: 'Basic ATS score',
        feature3: 'Robot view preview',
        feature4: 'Keyword analysis',
        button: 'Start Free Scan',
      },
      pass24h: {
        name: '24-Hour Pass',
        description: 'Unlimited scans for one day',
        price: '9',
        period: '24 hours',
        feature1: 'Unlimited resume scans',
        feature2: 'Full ATS compatibility report',
        feature3: 'Detailed keyword analysis',
        feature4: 'Formatting recommendations',
        feature5: 'Download PDF reports',
        feature6: 'Email support',
        feature7: '24-hour access',
        button: 'Get 24-Hour Pass',
      },
      sprint7d: {
        name: '7-Day Sprint',
        description: 'Perfect for job hunting',
        price: '29',
        period: '7 days',
        feature1: 'Everything in 24-Hour Pass',
        feature2: 'Unlimited resume versions',
        feature3: 'AI-powered optimization',
        feature4: 'Custom job matching',
        feature5: 'Priority support',
        feature6: 'Resume builder access',
        feature7: 'Cover letter analysis',
        feature8: 'LinkedIn optimization tips',
        feature9: '7-day access',
        button: 'Start 7-Day Sprint',
        recommended: 'Most Popular',
      },
      hero: {
        badge: 'Pricing',
        title: 'Choose Your Plan',
        subtitle: 'Get the perfect plan for your job search',
      },
      faq: {
        heading: 'Pricing FAQ',
        question1: 'Can I cancel anytime?',
        answer1: 'Yes! You can cancel your subscription at any time. No questions asked.',
        question2: 'What payment methods do you accept?',
        answer2: 'We accept all major credit cards, PayPal, and Apple Pay.',
        question3: 'Is there a refund policy?',
        answer3: 'Yes, we offer a 7-day money-back guarantee if you\'re not satisfied with our service.',
        question4: 'Can I upgrade my plan?',
        answer4: 'Absolutely! You can upgrade from any plan to a higher tier at any time.',
        question5: 'Do you offer discounts?',
        answer5: 'Yes! We offer student discounts and bulk pricing for career centers. Contact us for details.',
        question6: 'What happens after my plan expires?',
        answer6: 'You\'ll keep access to your saved reports, but you\'ll need to renew to create new scans.',
      },
      guarantee: '30-day money-back guarantee',
    },
    modals: {
      subscription: {
        title: 'Subscription Status',
        tier: 'Current Tier',
        accessMessage: 'You have full access to all features',
        upgradeMessage: 'Upgrade to unlock premium features',
        viewOptions: 'View Options',
        continueDashboard: 'Continue to Dashboard',
        pressEsc: 'Press ESC to close',
        premium: 'Premium',
        interviewSprint: '7-Day Sprint',
        singleScan: '24-Hour Pass',
        freePlan: 'Free Plan',
        scoreChanged: 'Your score changed? Here\'s why',
        nowMatching: 'Now matching your CV against Industry Standards.',
        realVisibility: 'Your real visibility is',
        whyLower: 'The preview scan was a quick check. The dashboard shows your actual ATS compatibility.',
        industryStandards: 'We compare against real job market requirements.',
      },
      logout: {
        title: 'Log Out',
        question: 'Are you sure you want to log out?',
        stayButton: 'Stay Logged In',
        logoutButton: 'Log Out',
      },
      creditsExhausted: {
        title: 'Credits Exhausted',
        message: 'You\'ve used all your free scans',
        scoreLabel: 'Your Score',
        warning: 'Upgrade to see your full analysis',
        feature1: 'Detailed ATS compatibility report',
        feature2: 'Keyword optimization suggestions',
        price: '$9',
        unlockButton: 'Unlock Full Report',
        maybeLater: 'Maybe Later',
      },
    },
    toasts: {
      errors: {
        selectRating: 'Please select a rating',
        submissionFailed: 'Failed to submit feedback',
        fileRequired: 'Please select a file',
        invalidFormat: 'Invalid file format',
        uploadFailed: 'Upload failed',
        aiProcessingError: 'AI processing error',
        fetchError: 'Failed to fetch data',
        unauthorized: 'Unauthorized access',
        noCredits: 'No credits remaining. Please upgrade to continue.',
        apiKeyNotConfigured: 'API key not configured. Please contact support at cvdebug@outlook.com',
        noTransactionId: 'No transaction ID available',
        checkoutError: 'Failed to start checkout',
        loginRequired: 'Please log in to purchase credits',
        initiateError: 'Failed to initiate checkout',
      },
      success: {
        feedbackSubmitted: 'Thank you for your feedback!',
        cvUploaded: 'CV Uploaded Successfully!',
        saved: 'Changes saved!',
        deleted: 'Deleted successfully',
        updated: 'Updated successfully',
        copied: 'Copied to clipboard!',
        downloaded: 'Downloaded successfully',
        generated: 'Generated successfully!',
        optimized: 'Optimized successfully!',
        applied: 'Applied successfully!',
      },
      warnings: {
        fileTooLarge: 'File is too large',
        limitReached: 'Limit reached',
        replaceBrackets: 'Don\'t forget to replace the [bracketed] values with your actual numbers!',
      },
    },
    images: {
      userAvatar: 'User avatar',
      logo: 'CVDebug logo',
      feature: 'Feature illustration',
    },
    admin: {
      title: 'Admin Panel',
      users: 'Users',
      analytics: 'Analytics',
      settings: 'Settings',
      import: {
        syncComplete: 'Sync Complete',
        syncFailed: 'Sync Failed',
        importFailed: 'Import Failed',
        importSuccess: 'Import Successful',
      },
      grant: {
        emailPlaceholder: 'user@example.com or user_2...',
        namePlaceholder: 'John Doe',
        planPlaceholder: 'Select plan',
      },
      payment: {
        emailPlaceholder: 'User Email',
      },
      payments: {
        received: '💰 New Payment Received!',
      },
      usersTable: {
        searchPlaceholder: 'Search users...',
        updated: 'User updated successfully',
        updateError: 'Failed to update user',
      },
      fix: {
        error: 'Failed to fix users',
        complete: 'Fix Complete',
        reportedError: 'Failed to fix reported users',
        reportedComplete: 'Reported Users Fix Complete',
        deleteSuccess: 'User deleted',
        deleteError: 'Failed to delete user',
      },
    },
    tools: {
      writingForge: {
        title: 'Writing Forge',
        description: 'AI-powered resume editor',
        placeholder: 'Paste your resume text here...',
        analyzing: 'Analyzing with AI...',
        error: 'Processing error',
        noText: 'No text to process',
        tooShort: 'Text is too short',
        generating: 'Generating improvements...',
        improvementReady: 'Improvements ready!',
        noResume: 'No resume text to edit',
        emptyResume: 'Resume cannot be empty',
        saveError: 'Unable to save changes',
        saved: 'Changes saved!',
        saveFailed: 'Failed to save changes',
        noTextToRegenerate: 'No resume text to regenerate',
        regenerating: 'Regenerating with AI...',
        regenerated: 'Resume regenerated!',
        preparingPdf: 'Preparing PDF download...',
        editPlaceholder: 'Edit your resume text here...',
      },
      interviewBattle: {
        title: 'Interview Battle Plan',
        description: 'Prepare for your interviews with AI-generated strategy',
        noResumeText: 'Not enough resume text to generate questions',
        regenerating: 'Regenerating questions with ML algorithms...',
        questionsRegenerated: 'Questions regenerated with ML! Fresh questions based on your resume.',
        generateError: 'Failed to generate questions. Using fallback questions.',
        enhancing: 'Enhancing your answer with AI...',
        answerEnhanced: 'Answer enhanced with AI suggestions!',
        actionPlaceholder: 'Describe the actions you took...',
        downloading: 'Downloading strategy document...',
        noJobDesc: 'Please paste the job description first',
        battlePlanGenerated: 'Battle plan generated!',
        battlePlanError: 'Failed to generate battle plan',
        jobDescPlaceholder: 'Paste the full job description here...',
        invalidJobDesc: 'Please provide a valid job description to generate interview prep.',
        shortResume: 'Resume text is too short. Please upload a valid resume first.',
        requiresSubscription: 'Failed to generate prep. This feature requires an active subscription.',
      },
      linkedIn: {
        title: 'LinkedIn Optimizer',
        description: 'Optimize your LinkedIn profile for maximum visibility',
        upgradeDescription: 'Upgrade to optimize your LinkedIn profile',
        noProfileText: 'Please paste your LinkedIn profile text',
        analyzed: '✅ LinkedIn profile analyzed successfully!',
        scanError: 'Failed to scan profile. Please try again.',
        noBioOptimization: 'No bio optimization available. Please scan your profile first.',
        bioOptimized: '✅ Optimized bio copied to clipboard! Paste it into your LinkedIn profile',
      },
      answerFinder: {
        title: 'Answer Finder',
        searchPlaceholder: 'Search by keyword...',
      },
      keywordSniper: {
        title: 'Keyword Sniper',
        uploadResume: 'Upload Resume',
        pasteJob: 'Paste Job Description',
        analyzing: 'Analyzing keywords...',
        generateError: 'Failed to generate phrases. Please try again.',
        applied: 'Suggestion applied! Your resume has been updated.',
        rewritten: 'Resume rewritten successfully!',
        exampleDescription: 'View how top candidates incorporate this keyword effectively.',
      },
      bullet: {
        noInput: 'Please enter a bullet point to rewrite',
        optimized: 'Bullet point optimized!',
        rewriteError: 'Failed to rewrite bullet point',
        examplePlaceholder: 'Example: Worked on improving the website performance...',
        rolePlaceholder: 'e.g., Software Engineer',
        powerStatementCopied: 'Power Statement copied!',
      },
      coverLetter: {
        title: 'Cover Letter Generator',
        upgradeDescription: 'Upgrade to generate AI-powered cover letters',
        noJobDescription: 'Please enter a job description',
        generated: 'Cover letter generated successfully!',
        generateError: 'Failed to generate cover letter',
        selectResume: 'Select a resume...',
        companyPlaceholder: 'e.g. Acme Corp',
        rolePlaceholder: 'e.g. Senior Engineer',
      },
      dm: {
        title: 'DM Generator',
        noProfile: 'Profile text is missing. Please analyze your profile first.',
        generated: 'DMs generated successfully!',
        generateError: 'Failed to generate DMs. Please try again.',
        copied: 'DM copied to clipboard!',
        namePlaceholder: 'e.g. Sarah Smith',
      },
      headline: {
        title: 'Headline Optimizer',
        copied: 'Headline copied to clipboard!',
      },
      liveOptimizer: {
        title: 'Live Resume Optimizer',
        placeholder: 'Paste your resume content here and watch the score update in real-time...',
      },
    },
    dashboardExtended: {
      applications: {
        upgradeDescription: 'Upgrade to track applications and get AI-powered insights',
        added: 'Application added successfully',
        addError: 'Failed to add application',
        companyPlaceholder: 'e.g., Acme Corp',
        rolePlaceholder: 'e.g., Senior Engineer',
        urlPlaceholder: 'https://...',
        jobDescPlaceholder: 'Paste the job description here for AI-powered keyword matching...',
      },
      projects: {
        created: 'Project created successfully!',
        createError: 'Failed to create project',
        projectPlaceholder: 'e.g. Senior SWE Hunt at Google',
        titlePlaceholder: 'e.g. Senior Software Engineer, Product Manager...',
        urlPlaceholder: 'https://linkedin.com/jobs/view/...',
        jobDescPlaceholder: 'Paste the full job description here...',
        uploadSuccess: 'CV Uploaded Successfully!',
      },
      ats: {
        textCopied: 'Raw text copied to clipboard',
        textDownloaded: 'Raw text downloaded',
        searchPlaceholder: 'Search by keyword...',
      },
      fluff: {
        metricCopied: 'Metric copied to clipboard!',
        copyError: 'Failed to copy to clipboard',
        copyErrorDescription: 'Please try selecting the text manually.',
        noMetricSelected: 'Please select a metric first',
        noMetricDescription: 'Choose one of the AI-suggested quantifications above.',
      },
      sanitize: {
        noResume: 'Cannot sanitize: Resume ID missing',
        success: 'PDF Sanitized successfully!',
        successDescription: 'Text layer integrity has been restored.',
        error: 'Failed to sanitize PDF',
      },
      scanning: {
        fileValidation: 'File Validation',
        fileValidationSubtitle: 'PDF structure is valid.',
        layoutIntegrity: 'Layout Integrity',
        layoutIntegritySubtitle: 'Checking margins & text-flow.',
        keywordMatch: 'Keyword Match',
        keywordMatchSubtitle: 'PENDING',
        timeline: 'Experience Timeline',
        timelineSubtitle: 'Analyzing career progression.',
        scoring: 'Scoring & Report',
        scoringSubtitle: 'Calculating final score.',
      },
      metrics: {
        noQuantified: 'Please provide a quantified version',
        replaceBrackets: 'Don\'t forget to replace the [bracketed] values with your actual numbers!',
        updated: 'Bullet point updated with metrics!',
      },
      insights: {
        overall: 'Overall',
        keywordMatch: 'Keyword Match',
        actionVerbs: 'Action Verbs',
        impact: 'Impact',
        structure: 'Structure',
      },
      kanban: {
        applied: 'Applied',
        interviewing: 'Interviewing',
        accepted: 'Accepted',
      },
      analysis: {
        error: 'Resume analysis failed. Please try again.',
      },
      reportUnlocked: '🎉 Resume report unlocked! Your credits have been applied.',
      resumeDeleted: 'Resume deleted',
      upgrade: {
        interviewSprintRequired: 'Interview Sprint plan required',
      },
      feedback: {
        noRating: 'Please select a rating',
        success: 'Thank you for your feedback!',
        submitError: 'Failed to submit feedback',
        commentPlaceholder: 'Any additional comments? (optional)',
        tellMore: 'Tell us more (optional)',
      },
    },
    payment: {
      success: 'Payment successful! Unlocking your resume report...',
      creditError: 'Payment recorded but credit update failed. Please contact support',
      noTransactionId: 'No transaction ID available',
      receiptDownloaded: 'Receipt downloaded successfully',
      downloadError: 'Failed to download receipt',
      checkoutError: 'Failed to start checkout',
      loginRequired: 'Please log in to purchase credits',
      initiateError: 'Failed to initiate checkout',
    },
    pages: {
      nursing: {
        title: 'ATS Scanner for Nurses',
        clinical: 'Clinical Keywords Optimizer',
        healthcare: 'Healthcare ATS Compatibility',
        credentials: 'License & Credential Validator',
      },
      medSurg: {
        title: 'Med-Surg Nurse ATS Optimizer',
        generic: 'Generic',
        patientRatios: 'Patient Ratios Not Quantified',
        surgicalExperience: 'Surgical Experience Buried',
      },
      softwareEngineer: {
        title: 'Software Engineer Keyword Sniper',
        techStack: 'Tech Stack Keyword Sniper',
        faang: 'FAANG ATS Compatibility',
        systemDesign: 'System Design Validator',
      },
      dataAnalyst: {
        title: 'Resume Debug for Data Analysts',
        skills: 'Technical Skills Parser',
        metrics: 'Metrics Impact Analyzer',
        techStack: 'Tech Stack Keyword Matcher',
      },
      finance: {
        title: 'Finance Internship ATS Optimizer',
        ibKeywords: 'IB Keywords Validator',
        format: 'Internship Format Checker',
        metricsOptimizer: 'Finance Metrics Optimizer',
      },
      about: {
        title: 'About CVDebug - AI-Powered ATS Resume Optimization',
        missionDriven: 'Mission-Driven',
        jobSeeker: 'Job Seeker First',
        innovation: 'Innovation',
        privacyTitle: 'Privacy & Trust',
      },
      blog: {
        title: 'ATS Resume Tips & Job Search Strategies Blog | CVDebug',
      },
      privacy: {
        title: 'Privacy Policy | CVDebug',
      },
      terms: {
        title: 'Terms & Conditions | CVDebug',
      },
      contact: {
        title: 'Contact Us | CVDebug Support',
        email: 'Email Support',
        chat: 'Live Chat',
        responseTime: 'Response Time',
        location: 'Location',
        namePlaceholder: 'John Doe',
        emailPlaceholder: 'john@example.com',
        messagePlaceholder: 'How can we help you?',
      },
    },
    previewScanExtended: {
      processError: 'Failed to process file',
    },
    heroSection: {
      badge: 'New: ML-Enhanced ATS Analysis',
      mainHeadline: 'Is ATS blocking <br />your resume?',
      diagnosticNote: 'CVDebug is a diagnostic tool, not a magic solution.',
      oneTimePayment: 'One-time payment, no subscriptions.',
      checkResumeButton: 'Check My Resume',
      seeHowButton: 'See How It Works',
      trustedBy: 'Trusted by',
      jobSeekers: 'job seekers',
      criticalFixNeeded: 'Critical Fix Needed',
      missingKeywordsAlert: 'Your resume is missing 3 critical keywords found in the job description',
    },
    ctaSection: {
      payOnceBadge: 'Pay once, use anytime',
      readyHeading: 'Ready to beat the ATS?',
      description: 'Get ML-enhanced analysis with TF-IDF keyword weighting, format detection, and actionable fixes. 1 scan = 1 credit. No subscriptions.',
      startButton: 'Start Your First Scan',
      footnote: '✨ First scan free • Credits never expire • Instant results',
    },
    testimonialsSection: {
      badge: 'Reddit Wall of Love',
      heading: 'Trusted by Redditors Worldwide',
      description: 'Real feedback from r/resumes, r/developersIndia, r/cscareerquestions, and more.',
      ctaText: 'Join thousands of job seekers optimizing their resumes',
    },
    faqSection: {
      heading: 'Common Questions',
      q1: 'Do you sell my data?',
      a1: 'Never. Your resume is parsed in memory and stored securely only for your session. We do not sell data to recruiters or third parties.',
      q2: 'What is the "Image Trap"?',
      a2: 'Many modern resume templates (from Canva or Photoshop) export text as flattened images. ATS systems cannot read images, so your experience is invisible. CVDebug detects this and shows you exactly what the ATS sees.',
      q3: 'Does this work for all industries?',
      a3: 'Yes, but it is optimized for technical and corporate roles where ATS usage is highest. Creative fields may have different requirements.',
    },
    pricingSection: {
      heading: 'Simple Pricing',
      subheading: 'Pay once. Fix forever. No subscriptions.',
      freePreview: 'Free Preview',
      free: 'Free',
      seeScore: 'See your ATS score',
      tryFree: 'Try Free',
      singleScan: 'Single Scan',
      oneCompleteFix: 'One complete fix',
      getSingleScan: 'Get Single Scan',
      interviewSprint: 'Interview Sprint',
      sevenDaysUnlimited: '7 days unlimited',
      startSprint: 'Start Sprint',
      bestValue: '🚀 BEST VALUE',
    },
    statsSection: {
      rejectionRate: '75%',
      rejectionLabel: 'Resumes rejected by ATS',
      noBSLabel: 'No BS',
      transparentPricing: 'Transparent Pricing',
      analysisTime: '10s',
      avgTimeLabel: 'Average analysis time',
      secureLabel: 'Secure',
      dataRetention: 'Data deleted in 30 days',
    },
    featuresBento: {
      scatteredResumesTitle: 'Why scattered resumes kill your job search',
      projectBasedTitle: 'Project-Based Tracking',
      projectBasedDesc: 'Create job search projects and track every application with match scores, tailored cover letters, and keyword gaps. See which companies are ghosting you.',
      healthMonitorTitle: 'Real-Time Health Monitor',
      healthMonitorDesc: 'Continuous CV integrity checks alert you instantly if formatting breaks or keywords drift. Keep your master CV ATS-ready 24/7.',
      keywordGapTitle: 'Keyword Gap Analysis',
      keywordGapDesc: 'See side-by-side what Google wants vs. what Meta wants. Copy-paste job descriptions and get instant TF-IDF scored keyword matches.',
      aiCoverLetterTitle: 'AI Cover Letter Generator',
      aiCoverLetterDesc: 'Generate tailored cover letters that explicitly bridge your keyword gaps. Each letter references your actual missing skills from the gap analysis.',
    },
    freeTierView: {
      founderAudit: 'Founder\'s Audit',
      byAlbert: 'by Albert',
      bottomPercentile: 'You\'re in the Bottom {percentileRank}% of Candidates',
      yourScore: 'Your Score',
      autoRejected: 'Auto-rejected by 90% of companies',
      thoseWhoGetInterviews: 'Those Who Get Interviews',
      pointsHigher: '{missingPoints} points higher',
      passATSFilters: 'Pass ATS filters',
      missingKeywords: 'You\'re missing {missingCount} critical keywords they have',
      unlockList: '[Unlock full list for $9.99]',
      robotViewTitle: '🤖 Robot View',
      freePreviewBadge: 'FREE PREVIEW',
      robotViewDesc: 'This is exactly what the ATS sees when parsing your resume',
      robotViewWarning: 'If your text is missing, garbled, or out of order here, the ATS cannot read your resume. This is the #1 reason for auto-rejection.',
      noTextExtracted: 'No text extracted. This means ATS systems cannot read your resume at all.',
      parsingError: '[PARSING ERROR DETECTED]',
      hiddenContent: '⚠️ Hidden content blocked by ATS parser',
      chatGPTCantFix: '💡 ChatGPT cannot fix this. Only our PDF Sanitizer can repair parsing errors.',
      moreErrors: '+{number} more parsing errors hidden',
      topCriticalErrors: 'Top Critical Errors',
      showingErrors: 'Showing 2 of {formatCount}',
      missingCriticalKeywords: '🔑 Missing Critical Keywords',
      highImpact: 'High Impact',
      keywordsHidden: '{number} Critical Keywords Hidden',
      getCertified: 'Get Your Resume Certified by CVDebug',
      unlockPackage: 'Unlock {missingCount} exact keywords + {formatCount} critical fixes for one-time payment of €9.99',
      certificationPackage: '✅ ATS Certification Package:',
      allKeywords: 'All {total} missing keywords with exact placement',
      allFormatErrors: 'All {total} format errors with 1-click fixes',
      aiRewrite: 'AI-powered rewrite suggestions',
      atsCertifiedPDF: '✅ ATS-Certified PDF download with badge',
      pdfSanitizer: '⚡ 3-second One-Click PDF Sanitizer',
      getCertifiedButton: 'Get Certified - Only €9.99',
      albertReview: 'Albert reviews your CV personally',
      videoFeedback: '3-min video with brutal feedback + all fixes',
      manualReviewButton: 'I want the manual review →',
      oneTimePayment: '✓ One-time payment',
      instantAccess: '✓ Instant access',
      noSubscription: '✓ No subscription',
      socialProof: '2,847 users unlocked their reports this week and',
      interviewIncrease: 'increased their interview rate by 2x',
    },
    atsOverview: {
      title: 'ATS Compatibility Score',
      scoreOf100: '/ 100',
      beatingPercentile: 'You are beating {percentile}% of other applicants',
      eliteReady: 'Elite / Ready to Apply',
      visibilityGap: 'The Visibility Gap',
      criticalDanger: 'Critical Danger',
      topCriticalFailures: 'Top Critical Failures',
      technicalVsHuman: 'Technical vs. Human Signal',
      technicalSignalDesc: 'Format, fonts, structure — can the bot read it?',
      technicalSignal: 'Technical Signal',
      humanSignal: 'Human Signal',
      humanSignalDesc: 'Seniority, power verbs, impact — impressive to humans?',
      balanceNote: 'Balance is key: A readable resume (bot) isn\'t the same as a selling resume (human). You need both.',
      contactCheck: 'Fast Check: Contact & Socials',
      email: 'Email',
      phone: 'Phone',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      missing: 'Missing',
      seniorityInference: 'Seniority Inference',
      aiInference: 'AI Inference: You sound like a',
      soundLikeSenior: 'Sound like a Senior Architect',
      impactBreakdown: 'Impact Breakdown',
      actionVerbs: 'Action Verbs',
      quantifiableMetrics: 'Quantifiable Metrics',
      targetMetrics: 'Target: {number} metrics',
      softSkills: 'Soft Skills',
    },
    forms: {
      companyName: 'Company Name',
      companyPlaceholder: 'e.g., Acme Corp',
      jobTitle: 'Job Title',
      jobTitlePlaceholder: 'e.g., Senior Engineer',
      jobUrl: 'Job Posting URL',
      jobUrlOptional: '(Optional)',
      jobUrlPlaceholder: 'https://...',
      jobDescription: 'Job Description',
      jobDescRecommended: '(Recommended for AI Analysis)',
      jobDescPlaceholder: 'Paste the job description here for AI-powered keyword matching...',
      jobDescHint: 'Add the job description to get instant keyword gap analysis',
      cancel: 'Cancel',
      addApplication: 'Add Application',
      adding: 'Adding...',
      addedSuccess: 'Application added successfully',
      addedError: 'Failed to add application',
    },
    dialogs: {
      addNewApplication: 'Add New Application',
      sprintRequired: 'Interview Sprint Required',
      upgradeMessage: 'Upgrade to track applications, get keyword analysis, and receive ghosting alerts.',
      upgradeNow: 'Upgrade Now',
      sprintRequiredError: 'Interview Sprint plan required',
      upgradeForInsights: 'Upgrade to track applications and get AI-powered insights',
    },
    scoreCard: {
      resumeIs: 'Your resume is',
      ofBots: '{percentage} of bots.',
      excellent: 'Excellent',
      needsOptimization: 'Needs Optimization',
      criticalIssues: 'Critical Issues',
      excellentMessage: 'Great job! Your resume is well-optimized for ATS systems.',
      optimizationMessage: 'We found some issues that might be getting you rejected. Let\'s fix them.',
      criticalMessage: 'We found 3 critical errors that might be getting you rejected automatically. These need immediate attention.',
      downloadReport: 'Download Report',
      shareResults: 'Share Results',
    },
    keywordAnalysis: {
      title: 'Keyword Analysis',
      subtitle: 'Semantic matching against standard Data Science JDs.',
      matchRate: 'Match Rate',
      foundSignals: 'Found Signals',
      total: 'Total',
      groupByType: 'Group by Type',
      listView: 'List View',
      gridView: 'Grid View',
      missingCriticalSignals: 'Missing Critical Signals',
      highImpact: 'High Impact',
      fixingIncreases: 'Fixing these increases score by ~15%',
      viewExamples: 'View Examples',
      autoAdd: 'Auto-Add',
      industryKeywordFrequency: 'Industry Keyword Frequency',
      aiPowered: 'AI-Powered',
      showingExamples: 'Showing examples for',
      viewHowTopCandidates: 'View how top candidates incorporate this keyword effectively.',
      displayingFlatList: 'Displaying in flat list',
      keywordsOrganized: 'Keywords organized by category',
      switchedToView: 'Switched to',
      showingAllKeywords: 'Showing all keywords',
      groupedByType: 'Grouped by type',
      noMissingSignals: 'No Missing Signals',
      excellentKeywordCoverage: 'Great job! Your resume has excellent keyword coverage.',
      matchType: 'Match Type',
      exactMatch: 'Exact Match',
      synonymMatch: 'Synonym Match',
      semanticMatch: 'Semantic Match',
      foundInResume: 'Found in resume',
      clickToHide: 'Click to hide details',
      // Paywall content
      criticalSignalsLocked: 'Critical Signals Locked',
      unlockFullAnalysis: 'Unlock Full Analysis',
      unlockDescription: 'Unlock the complete missing keywords analysis with quantified impact, specific descriptions, and AI recommendations to increase your score by up to +15%.',
      quantifiedImpact: 'quantified impact',
      specificDescriptions: 'specific descriptions',
      aiRecommendations: 'AI recommendations',
      increaseScoreBy: 'to increase your score by up to +15%',
      detailedImpactAnalysis: 'Detailed impact analysis (+2% per keyword)',
      impactPerKeyword: '+2% per keyword',
      specificForEachKeyword: 'Specific descriptions for each keyword',
      recommendedLocation: 'Recommended location in resume',
      autoAddWithAI: 'Auto-Add with AI (Writing Forge)',
      unlockComplete: 'Unlock Complete Analysis',
      sevenDayPlan: '7-Day Plan • €24.99',
      keywordsMissingLocked: 'Missing Keywords Locked',
      unlockCompleteList: 'Unlock the complete list of critical keywords with quantified impact (+15% score).',
      unlockButton: 'Unlock',
    },
    fluffDetector: {
      locked: 'Fluff Detector Locked',
      unlockPremium: 'Unlock Premium Analysis',
      description: 'Unlock AI-powered fluff detection to identify weak phrases, unquantified achievements, and get actionable replacements.',
      weakPhraseAnalysis: 'Weak phrase detection with context',
      quantifiedMetrics: 'Unquantified achievements analysis',
      actionableReplacements: 'AI-powered actionable replacements',
      unlockFluff: 'Unlock Fluff Detector',
    },
    interviewPrep: {
      locked: 'Interview Battle Plan Locked',
      unlockBattlePlan: 'Unlock Interview Prep',
      description: 'Generate personalized interview prep with expected questions, STAR stories, and strategic talking points based on your resume and job description.',
      expectedQuestions: 'Expected interview questions',
      starStories: 'STAR format story suggestions',
      talkingPoints: 'Strategic talking points',
      unlockInterview: 'Unlock Battle Plan',
    },
    recruiterDM: {
      locked: 'Recruiter DM Generator Locked',
      unlockDMGenerator: 'Unlock DM Generator',
      description: 'Generate personalized recruiter messages with multiple variations optimized with keywords from your target job description.',
      personalizedMessages: 'Personalized recruiter messages',
      multipleVariations: '3 variations per message',
      keywordOptimized: 'Keyword-optimized for your target role',
      unlockRecruiter: 'Unlock DM Generator',
    },
    conversionBanner: {
      currentBracket: 'Current Bracket',
      youAreInBracket: 'You are in the',
      unlockSprint: 'Unlock the',
      sprintEngine: 'Sprint Engine',
      reach: 'to reach',
      matchFaang: 'and match',
      instantly: 'instantly',
      pointsBoost: 'points boost potential',
      faangKeywords: 'FAANG-level keywords',
      hourAccess: '24-hour access',
      get24hPass: 'Get 24-Hour Sprint Pass',
      oneTimePayment: 'One-time payment',
      fixEverything: 'Fix everything in 24 hours. No subscription.',
      noSubscription: 'No subscription',
      devsUpgraded: 'devs upgraded this week',
      avgIncrease: 'Avg. score increase',
      points: 'points',
    },
    atsSimulation: {
      seniorityMatch: 'Seniority Match Analysis',
      detectedLevel: 'Detected Level',
      experienceAudit: 'Experience Audit',
      signalDensity: 'Signal Density',
      score: 'Score',
      expected: 'Expected',
      signals: 'signals',
      strength: 'Strength',
      junior: 'Junior',
      mid: 'Mid',
      senior: 'Senior',
      lead: 'Lead',
      match: 'Match',
      review: 'Review',
      year: 'year',
      years: 'years',
      strong: 'STRONG',
      medium: 'MEDIUM',
      weak: 'WEAK',
      readability: 'Readability',
      highIntegrity: 'High Integrity',
      industryPatterns: 'Structure follows industry standard patterns',
      imageTraps: 'Image Traps',
      safe: 'Safe',
      noneDetected: 'None Detected',
      noInvisibleElements: 'No invisible elements or keyword stuffing',
      atsGlobalScore: 'ATS Global Score',
      parsingEfficiency: 'Score based on parsing efficiency',
      liveAnalysis: 'Live Analysis',
      fullReport: 'Full Report',
    },
    keywordSniper: {
      title: 'Keyword Sniper Tool',
      subtitle: 'Optimize your bullet points with AI-powered keyword injection',
      noJobDescription: 'No Job Description Analyzed Yet',
      noJobDescriptionDesc: 'The Keyword Sniper needs a job description to analyze and extract missing keywords.',
      howToUseTitle: 'How to use Keyword Sniper:',
      howToStep1: 'Create a project with your target role',
      howToStep2: 'Add a job application with the job description',
      howToStep3: 'Analyze the job description to extract keywords',
      howToStep4: 'Return here to get AI-powered keyword suggestions',
      backToDashboard: 'Back to Dashboard',
      interviewSprintRequired: 'Interview Sprint Required',
      injectKeywordsDesc: 'Inject missing keywords into your resume bullets with AI-powered suggestions.',
      keywordInjection: 'Keyword injection',
      liveScoreTracking: 'Live score tracking',
      priorityTargeting: 'Priority targeting',
      contextAwareAI: 'Context-aware AI',
      upgradeToSprint: 'Upgrade to Interview Sprint',
      back: 'Back',
      targeting: 'Targeting',
      currentResume: 'Current Resume',
      aiPremiumTools: 'AI Premium Tools',
      viewExamples: 'View Examples',
      viewExamplesDesc: 'See senior-level examples of how to integrate keywords naturally',
      applyMetric: 'Apply Metric',
      applyMetricDesc: 'Transform weak bullets into quantified impact statements',
      rewriteAll: 'Rewrite All',
      rewriteAllDesc: 'AI engine to rewrite your entire CV at senior+ level',
      battlePlan: 'Battle Plan',
      battlePlanDesc: 'Generate hardest questions + strategic answers for interviews',
      suggestionApplied: 'Suggestion applied! Your resume has been updated.',
      noMissingKeywords: 'No missing keywords to show examples for',
      rewriteSuccess: 'Resume rewritten successfully!',
      lockedTitle: 'Interview Sprint Required',
      lockedDesc: 'Unlock the Keyword Sniper Tool to inject missing keywords and boost your ATS score.',
      upgradeNow: 'Upgrade Now',
    },
    createProject: {
      title: 'Create New Project',
      subtitle: 'Configure your job search campaign',
      projectName: 'Project Name',
      projectNamePlaceholder: 'e.g. Senior SWE Hunt at Google',
      targetRole: 'Target Role',
      targetRolePlaceholder: 'e.g. Senior Software Engineer, Product Manager...',
      targetRoleHint: 'Type any role or select from suggestions. This helps the AI tune resume suggestions.',
      jobDescription: 'Job Description',
      optional: '(Optional)',
      linkUrl: 'Link URL',
      pasteText: 'Paste Text',
      urlPlaceholder: 'https://linkedin.com/jobs/view/...',
      textPlaceholder: 'Paste the full job description here...',
      aiAnalysisTitle: 'AI Analysis Enabled',
      aiAnalysisDesc: 'We\'ll extract keywords from the JD to optimize your CV and calculate match scores.',
      cancel: 'Cancel',
      createButton: 'Create Project',
      creating: 'Creating...',
      successMessage: 'Project created successfully!',
      errorMessage: 'Failed to create project',
    },
    createApplication: {
      title: 'Add New Application',
      sprintRequired: 'Interview Sprint Required',
      upgradeDesc: 'Upgrade to track applications, get keyword analysis, and receive ghosting alerts.',
      upgradeNow: 'Upgrade Now',
      companyName: 'Company Name',
      companyPlaceholder: 'e.g., Acme Corp',
      jobTitle: 'Job Title',
      jobTitlePlaceholder: 'e.g., Senior Engineer',
      jobUrl: 'Job Posting URL',
      optional: '(Optional)',
      urlPlaceholder: 'https://...',
      jobDescription: 'Job Description',
      recommendedAI: '(Recommended for AI Analysis)',
      descriptionPlaceholder: 'Paste the job description here for AI-powered keyword matching...',
      cancel: 'Cancel',
      addApplication: 'Add Application',
      adding: 'Adding...',
      planRequired: 'Interview Sprint plan required',
      planRequiredDesc: 'Upgrade to track applications and get AI-powered insights',
      successMessage: 'Application added successfully',
      errorMessage: 'Failed to add application',
      featureRestricted: 'This feature is only available with an active Interview Sprint subscription',
    },
    missionControl: {
      title: 'Mission Control',
      welcomeBack: 'Welcome back',
      eliminateBugs: 'Eliminate bugs until you reach 95% visibility.',
      newApplication: 'New Application',
      visibilityScore: 'Visibility Score',
      howRecruitersFind: 'How recruiters find your resume',
      activeApplications: 'Active Applications',
      interviewsScheduled: 'interviews scheduled',
      missingSignals: 'Missing Signals',
      critical: 'CRITICAL',
      impactingMatchScore: 'Impacting match score by',
      robotViewTitle: 'Robot View: What ATS Actually Reads',
      robotViewSubtitle: 'Is critical information missing from your resume?',
      uploadToSeeExtraction: 'Upload a resume to see raw text extraction',
      missingKeywords: 'Missing',
      allKeywordsDetected: 'All critical keywords detected',
      needPoints: 'Need',
      reachEliteTier: 'points to reach ELITE tier',
      viewFullReport: 'View Full Report',
      uploadResume: 'Upload Resume',
      careerHealth: 'Career Health',
      elite: 'ELITE',
      pro: 'PRO',
      rising: 'RISING',
      starter: 'STARTER',
      progressToElite: 'Progress to ELITE (85%+)',
      cvScore: 'CV Score',
      applications: 'Applications',
      interviews: 'Interviews',
      applicationKanban: 'Application Kanban',
      viewAll: 'VIEW ALL',
      applied: 'Applied',
      noApplicationsYet: 'No applications yet',
      position: 'Position',
      company: 'Company',
      recent: 'Recent',
      interviewing: 'Interviewing',
      noInterviewsYet: 'No interviews yet',
      inProgress: 'In Progress',
      accepted: 'Accepted',
      noOffersYet: 'No offers yet',
      topErrors: 'Top Errors',
      noCVLoaded: 'No CV loaded',
      consoleBash: 'console — bash',
      noCriticalErrors: 'No critical errors detected',
      allSystemsOperational: 'All systems operational',
      debugMasterCV: 'DEBUG MASTER CV',
      missingKeyword: 'Missing keyword',
      matchScoreImpact: 'match_score impact:',
      dateFormatInconsistency: 'Date format inconsistency found',
      atExperienceBlock: 'at Experience.block (Line 42)',
    },
    atsReport: {
      missingSignals: 'Missing Signals',
      critical: 'CRITICAL',
      important: 'IMPORTANT',
      niceToHave: 'NICE TO HAVE',
      fix: 'Fix',
      invisibleToBot: 'Invisible to the Bot',
      atsWillReject: '⚠️ The ATS will automatically reject you',
      needsOptimization: 'You need to optimize your CV BEFORE applying',
      readyToApply: 'Ready to Apply',
      context: 'Context',
      offerRequires: 'The offer requires',
      youNeedToAdd: 'You need to add this skill',
      missingThisToken: 'but your CV only mentions',
      addSignalsOf: 'You need to add signals of',
      upgrade: 'Upgrade',
      percentInvisible: '% Invisible to the Bot',
      needsOptimizationBefore: 'Needs optimization BEFORE applying',
    },
    projectsView: {
      searchPlaceholder: 'Search projects, tags...',
      uploadNewMasterCV: 'Upload New Master CV',
      allProjects: 'All Projects',
      highMatch: 'High Match',
      needsReview: 'Needs Review',
      archived: 'Archived',
      sortBy: 'Sort by:',
      lastUpdated: 'Last Updated',
      loadingProjects: 'Loading projects...',
      noProjectsYet: 'No projects yet',
      noProjectsDesc: 'Create your first project to start tracking applications and optimizing your resume.',
      createFirstProject: 'Create Your First Project',
      matchScore: 'Match Score',
      stable: 'Stable',
      missingData: 'Missing Data',
      highPriority: 'High Priority',
      strong: 'Strong',
      moderate: 'Moderate',
      low: 'Low',
      hoursAgo: 'h ago',
      daysAgo: 'd ago',
      weeksAgo: 'w ago',
      openProjectBoard: 'Open Project Board',
      createNewProject: 'Create New Project',
      createNewProjectDesc: 'Start a new mission or upload a CV to analyze.',
    },
    resumeGrid: {
      loadingResumes: 'Loading your resumes...',
      analyzing: 'Analyzing...',
      error: 'Error',
      excellent: 'Excellent',
      moderate: 'Moderate',
      critical: 'Critical',
      noResumesFound: 'No resumes found',
      noResumesDesc: 'Upload your resume to get an instant ATS score and AI-powered feedback.',
      uploadResume: 'Upload Resume',
      createManually: 'Create Manually',
      createProject: 'Create Project',
      searchPlaceholder: 'Search resumes by name, skill, or ID...',
      listView: 'List View',
      gridView: 'Grid View',
      resumeName: 'Resume Name',
      uploadDate: 'Upload Date',
      lastAnalyzed: 'Last Analyzed',
      healthScore: 'Health Score',
      actions: 'Actions',
      viewDetails: 'View Details',
      reAnalyze: 'Re-Analyze',
      delete: 'Delete',
      justNow: 'Just now',
      showing: 'Showing',
      to: 'to',
      of: 'of',
      results: 'results',
      previous: 'Previous',
      next: 'Next',
      noSearchResults: 'No resumes match your search query.',
    },
    aiFeedback: {
      rateResponse: 'Rate this response',
      howHelpful: 'How helpful was this response?',
      feedbackHelps: 'Your feedback helps us improve our AI.',
      helpful: 'Helpful',
      okay: 'Okay',
      notHelpful: 'Not Helpful',
      additionalComments: 'Additional comments (optional)...',
      submitFeedback: 'Submit Feedback',
      thankYou: 'Thank you for your feedback!',
      wasHelpful: 'Was this response helpful?',
      yes: 'Yes',
      somewhat: 'Somewhat',
      no: 'No',
      tellMore: 'Tell us more (optional)...',
      submit: 'Submit',
      selectRating: 'Please select a rating',
      feedbackSubmitted: 'Thank you! Feedback submitted.',
      submitError: 'Failed to submit feedback. Please try again.',
    },
    eliteMatchTool: {
      title: 'Elite Match Tool',
      subtitle: 'Analyze your resume against any job offer with local ML precision. Identify gaps and optimize for ATS instantly.',
      urlLabel: 'LinkedIn URL (Recommended)',
      urlPlaceholder: 'https://www.linkedin.com/jobs/view/...',
      urlHelp: 'Paste the direct LinkedIn job posting link for best extraction results.',
      textLabel: 'Paste Job Description',
      textPlaceholder: 'About the role:\nWe are looking for a Senior Full Stack Developer with 5+ years of experience...\n\nRequirements:\n- Strong experience with React and Node.js\n- Experience with Kubernetes and AWS',
      textHelp: 'Copy and paste the full job description from any portal.',
      analyzeButton: 'Analyze Match Score',
      featureExtraction: 'Entity Extraction',
      featureExtractionDesc: 'Not just keywords: we extract Hard Skills, Soft Skills, and Industry Metrics with deep semantic understanding.',
      gapAnalysis: 'Gap Analysis',
      gapAnalysisDesc: 'We identify EXACTLY what signals are missing from your profile to pass high-risk ATS filters.',
      autoFix: 'AI Auto-Fix',
      autoFixDesc: 'One-click AI rewriting that intelligently integrates missing signals into your existing resume narrative.',
      premiumTitle: 'Elite Match Tool is Premium',
      premiumSubtitle: 'Analyze your resume against any offer using local ML (0 API costs)',
      premiumFeatures: '• Entity extraction with TF-IDF & Cosine Similarity\n• Critical/important/nice-to-have gap analysis\n• Robot View with red/green zones\n• Specific Auto-Fix suggestions',
      scoreTitle: 'Match Score',
      scoreExcellent: 'Excellent match! Apply with confidence.',
      scoreGood: 'Good match, but there are important gaps.',
      scoreNeedsWork: 'You need to improve your resume for this offer.',
      missingCritical: 'Missing Critical Signals',
      matchedSkills: 'Matched Skills',
      robotViewTitle: 'Robot View',
      redZones: 'Red Zones',
      greenZones: 'Green Zones',
      recommendations: 'Auto-Fix Recommendations',
      analyzeAnother: 'Analyze Another Job',
      applyFix: 'Apply Auto-Fix',
      applyFixSuccess: 'Auto-Fix suggestions copied! Navigate to Edit tab to apply changes.',
      analyzingStep1: 'Extracting Recruiter Intent...',
      analyzingStep2: 'Analyzing Hard Skills Requirements...',
      analyzingStep3: 'Detecting Soft Skills Signals...',
      analyzingStep4: 'Generating Missing Signals Report...',
      errorAnalyzing: 'Error analyzing the match: ',
      errorUnknown: 'Unknown error',
    },
    ecosystem: {
      copyPasteTip: {
        badge: 'FREE',
        title: '💡 Pro Tip: Copy from LinkedIn',
        description: 'Go to a job posting on LinkedIn → Select all text → Ctrl+C → Paste it in \'Add Job Description\'. Automatic, no extensions needed.',
        actionLabel: 'Got it',
        successMessage: 'Perfect! Use Ctrl+C on any job posting.',
      },
      linkedinReminder: {
        badge: 'FREE',
        title: '🔗 Reminder: Update LinkedIn',
        description: 'Your CV is at {score}%. 89% of recruiters search LinkedIn before calling. Copy your CV improvements to your LinkedIn profile.',
        actionLabel: 'Go to LinkedIn',
      },
      keyboardShortcuts: {
        badge: 'FREE',
        title: '⌨️ Keyboard Shortcuts',
        description: 'Ctrl+V to paste job description quickly. Esc to close modals. Work faster without leaving the keyboard.',
        actionLabel: 'See More Shortcuts',
        infoMessage: 'Shortcuts: Ctrl+V (paste JD), Esc (close), Tab (navigate)',
      },
      dismissLabel: 'Not interested',
      freeLabel: '100% FREE',
      bookmarklet: {
        title: 'Scanner Installation (1 minute)',
        step1Title: 'Copy the bookmarklet',
        step1Copy: 'Copy Bookmarklet',
        step1Copied: 'Copied!',
        step2Title: 'Create a bookmark',
        step2Instructions: [
          'Right-click on the bookmarks bar',
          'Select "Add page"',
          'Name: "Job Scanner"',
          'URL: Paste the copied code'
        ],
        step3Title: 'Use it on any site',
        step3Description: 'Go to LinkedIn, Indeed, or any job posting → Click the "Job Scanner" bookmark → Text will be extracted → Paste it in your resume analyzer',
        proTip: 'Works on ANY website. LinkedIn, Indeed, Glassdoor, company X...',
        successCopied: 'Bookmarklet copied! Now drag it to your bookmarks bar.',
        openingChecklist: 'Opening LinkedIn checklist...',
        comingSoon: 'Coming soon: Recruiter email analyzer',
      },
    },
  },
  'es': {
    hero: {
      title: 'Deja de preguntarte por qué te ignoran.',
      subtitle: '12.847 candidatos depuraron su CV con CVDebug. Media de 8 días hasta primera entrevista. Media de 2,4 ofertas de trabajo por persona. 89% contratados en 60 días.',
      ctaPrimary: 'Ver Vista Robot - Gratis',
      ctaSecondary: 'Regístrate para Acceso Completo',
      trustIndicator: '3,2x más entrevistas • 14 días media hasta oferta • Sin probar herramientas al azar',
    },
    features: {
      robotView: 'Terminal Vista Robot',
      keywordGap: 'Detector de Señales Faltantes',
      seniorityMatch: 'Auditoría de Nivel Senior',
      instantScan: 'Puntuación ATS Instantánea',
    },
    pricing: {
      free: 'Escaneo Gratis',
      pass24h: 'Pase 24 Horas',
      sprint7d: 'Sprint 7 Días',
      currency: '€',
      enterprise: {
        badge: 'Empresarial',
        title: 'Escala Tu Contratación',
        subtitle: 'Sin Compromisos',
        description: 'Diseñado para equipos de reclutamiento que procesan miles de aplicaciones. Obtén descuentos por volumen, soporte dedicado e integraciones personalizadas.',
        contactSales: 'Contactar Ventas',
        viewPricing: 'Ver Precios',
        feature1: 'Gestión de Equipo',
        feature1Desc: 'Panel centralizado para equipos de RRHH para rastrear todas las aplicaciones de candidatos',
        feature2: 'Cumplimiento SOC 2',
        feature2Desc: 'Seguridad de nivel empresarial con SSO y control de acceso basado en roles',
        feature3: 'Acceso a API',
        feature3Desc: 'Integra el escaneo ATS directamente en tu flujo de trabajo de reclutamiento',
      },
    },
    pricingLanding: {
      title: 'Precios Simples',
      subtitle: 'Paga una vez. Arregla para siempre. Sin suscripciones.',
      // Free tier
      freeTitle: 'FREE Debug',
      freeSubtitle: 'Discover which keywords the robot DOESN\'T see',
      freeScanButton: 'Escanear Gratis',
      freeFeature1: 'Detección de Invisibilidad (2 keywords)',
      freeFeature2: 'Global ATS Score',
      freeFeature3: 'Vista Robot (bloqueada)',
      freeFeature4: 'Preview Seniority Match',
      freeGuarantee: '✓ PLANTILLA LEGIBLE GARANTIZADA',
      // Single debug fix (€5.99)
      singleDebugBadge: 'ARREGLA DE UNA VEZ',
      singleDebugTitle: 'Arreglo Rápido',
      singleDebugSubtitle: 'Arregla tu CV por el precio de un café',
      singleDebugButton: 'Arreglar Mi CV →',
      singleDebugFeature1: '1 Escaneo Profundo Completo',
      singleDebugFeature2: 'Vista Robot Desbloqueada',
      singleDebugFeature3: '1 Optimización AI (Rewrite)',
      singleDebugFeature4: 'Auto-Inyección Keywords',
      singleDebugFeature5: 'Exportar CV Optimizado',
      singleDebugGuarantee: '✓ PLANTILLA LEGIBLE GARANTIZADA',
      // 24h Pass (€14.99)
      pass24hBadge: 'HOT FIX / URGENTE',
      pass24hTitle: 'Pase 24h',
      pass24hSubtitle: 'Debug Inmediato para entrevista mañana',
      pass24hButton: 'Acceso 24h →',
      pass24hFeature1: 'Scans Ilimitados (24h)',
      pass24hFeature2: 'Vista X-Ray Robot Completa',
      pass24hFeature3: 'Etiquetas [ERROR] + [WARN] + Fixes',
      pass24hFeature4: 'Detector Gap de Keywords',
      pass24hFeature5: 'Generador de Cover Letter',
      pass24hFeature6: 'Plantilla 100% Legible por ATS',
      pass24hFeature7: 'Generador Cover Letter Ilimitado',
      pass24hGuarantee: '✓ GARANTIZADA',
      // 7 Day Sprint (€24.99)
      sprint7dBadge: 'INTENSIVO / RECOMENDADO',
      sprint7dTitle: 'Sprint 7 Días',
      sprint7dSubtitle: 'Modo Bestia. Ataque total de 7 días',
      sprint7dBeforePrice: '€49.99',
      sprint7dButton: 'Empezar Sprint 7 Días →',
      sprint7dFeature1: 'Scans Ilimitados (7 días)',
      sprint7dFeature2: 'Selector Industria (FAANG/Finanzas)',
      sprint7dFeature3: 'Elevador Tono Viñetas (AI Rewrite)',
      sprint7dFeature4: 'Battle Plan Entrevistas',
      sprint7dFeature5: 'Guiones de DM para Recruiters',
      sprint7dFeature6: 'Cover Letter + LinkedIn Optimizer',
      sprint7dFeature7: 'Recruiter DM Templates',
      sprint7dGuarantee: '✓ PLANTILLA 100% LEGIBLE GARANTIZADA',
    },
    pricingDialog: {
      quickFix: 'Solución Rápida',
      pass24h: 'Pase 24h',
      price24h: '€14.99',
      access24h: 'acceso de 24 horas',
      unlimitedScans24h: 'Escaneos Ilimitados (24h)',
      fullErrorReport: 'Informe Completo de [ERRORES]',
      robotXRayView: 'Vista Rayos X del Robot',
      keywordOptimizer: 'Optimizador de Palabras Clave',
      battlePlanGenerator: 'Generador de Plan de Batalla',
      get24hPass: 'Obtener Pase 24h',
      sprint7d: 'Sprint 7 Días',
      price7d: '€39.99',
      access7d: 'acceso de 7 días',
      unlimitedScans7d: 'Escaneos Ilimitados (7 Días)',
      recommended: 'RECOMENDADO',
      tryFree: 'Probar Gratis',
      noThanksJust24h: 'No gracias, solo Pase 24h',
      title: 'Precios Simples y Transparentes',
      subtitle: 'Pagos únicos para resultados profesionales. Sin suscripciones recurrentes ni tarifas ocultas.',
      start7DaySprint: 'Comenzar Sprint 7 Días 🚀',
      secureCheckout: 'Pago Seguro Encriptado de 256 bits',
      // Upsell section
      waitBeforeCheckout: '⚠️ ¡ESPERA! Antes de finalizar...',
      applyingToOneJob: '¿Postulas Solo a UN Trabajo?',
      justMoreGetSprint: 'Por solo €10 más, obtén el Interview Sprint.',
      whyUpgrade: '¿Por qué mejorar?',
      save60: 'Ahorra 60%',
      unlimitedScansNotOne: 'Escaneos ilimitados por 7 días (no solo uno)',
      aiCoverLetters: 'Cartas de presentación con IA para cada aplicación',
      linkedinOptimization: 'Optimización de perfil de LinkedIn incluida',
      candidatesChoseSprint: '1,200+ candidatos eligieron Interview Sprint y consiguieron roles en:',
      upgradeToSprint: 'Sí, mejorar a Sprint (€24.99) 🚀',
      // More hardcoded strings
      scorePreview: 'Vista Previa del Puntaje',
      errorLabels: 'Etiquetas [ERROR]',
      topKeywords: 'Top 2 Palabras Clave',
      bestValue: 'MEJOR VALOR',
      sevenDaySprint: 'Sprint de 7 Días',
      sevenDaysAccess: '7 días de acceso completo',
      unlimitedCVScans: 'Escaneos de CV Ilimitados (7d)',
      robotViewTerminal: 'Terminal Vista Robot',
      missingSignalsDetector: 'Detector de Señales Faltantes',
      seniorityMatchAudit: 'Auditoría de Nivel de Experiencia',
      industrySelectorFAANG: 'Selector de Industria (FAANG/Finanzas)',
      bulletToneElevator: 'Elevador de Tono de Viñetas',
      bonusExtras: 'Extras de Bonificación:',
      coverLetterGen: 'Generador de Cartas',
      linkedinOptimizer: 'Optimizador de LinkedIn',
      devsJoined: '1,200+ desarrolladores se unieron',
      sprintTestimonial: '"Sprint me ayudó a corregir errores y conseguir 5 entrevistas en 1 semana"',
      fastStart: 'INICIO RÁPIDO',
      loginToPurchase: 'Inicia sesión para comprar créditos',
      checkoutFailed: 'Error al iniciar el pago',
      checkoutError: 'Error al iniciar el proceso de pago',
    },
    dashboard: {
      welcome: 'Bienvenido de nuevo',
      uploadCv: 'Sube tu CV',
      analyzing: 'Analizando tu CV...',
      score: 'Puntuación ATS',
      issues: 'Problemas Encontrados',
      signIn: 'Iniciar Sesión',
      continueDashboard: 'Continuar al Panel',
      welcomeBack: 'Bienvenido de nuevo',
      uploadMasterCv: 'Sube tu CV Maestro',
      uploadToStart: 'Sube tu CV para empezar',
      noKeywordsYet: 'Aún no hay palabras clave',
      noResumeFound: 'No se Encontró CV',
      uploadToSeeATS: 'Sube un CV para ver cómo los robots ATS interpretan tu documento.',
      uploadToSeeText: 'Sube un CV para ver la extracción de texto sin procesar',
      resumeEditor: 'Editor de CV',
      downloadAsTxt: 'Descargar como .txt',
      noResumeLoaded: 'No hay CV cargado. Sube un CV desde el panel para empezar a editar.',
      uploadToGetStarted: 'Sube un CV para comenzar',
      masterCvs: 'CVs Maestros',
      tools: 'Herramientas IA',
      applications: 'Aplicaciones',
      match: 'Elite Match',
      missionControl: 'Centro de Control',
      keywordSniper: 'Francotirador de Palabras Clave',
      writingForge: 'Forja de Escritura',
      bulletRewriter: 'Reescritor de Viñetas',
      coverLetterGen: 'Carta de Presentación',
      linkedinOptimizer: 'Optimizador de LinkedIn',
      upgradeToFix: 'Actualizar para Arreglar',
      aiRewrite: 'Reescritura IA',
      addJob: 'Añadir Trabajo',
      toolsMenu: 'Herramientas',
      visibilityDebugger: 'Debugger de Visibilidad',
      autoRejectDetected: 'AUTO-RECHAZO DETECTADO',
      criticalError: 'ERROR CRÍTICO',
      // Success Insights
      successInsights: 'Insights de Éxito',
      personalizedAnalytics: 'Análisis personalizados próximamente',
      trackApplicationsToUnlock: 'Rastrea 3+ aplicaciones y consigue tu primera entrevista para desbloquear insights personalizados',
      personalDataMoat: 'Tu ventaja de datos personales te espera',
      yourPersonalDataAdvantage: 'Tu ventaja de datos personales',
      moat: 'VENTAJA',
      vsAverage: 'vs promedio',
      successRateLabel: 'tasa de éxito',
      applicationsCount: 'Aplicaciones',
      interviewsCount: 'Entrevistas',
      topPerformingKeywords: 'Palabras Clave de Mayor Rendimiento',
      dataUniqueToYou: '🔒 Estos datos son únicos para ti y no pueden ser replicados por competidores',
    },
    resumeDetail: {
      linkedinUpsellTitle: 'CV Optimizado → LinkedIn es el Siguiente Paso',
      linkedinUpsellDescription: 'Tu CV está listo (Score: {score}%). 89% de los reclutadores revisan LinkedIn antes de contactar. No pierdas oportunidades por un perfil desactualizado.',
      optimizeLinkedIn: 'Optimizar LinkedIn Ahora',
      maybeLater: 'Más Tarde',
      checkLinkedIn: 'revisan LinkedIn',
      moreCallbacks: 'más llamadas',
      zeroMetricsTitle: 'CERO MÉTRICAS = AUTO-RECHAZO',
      businessImpact: 'IMPACTO DE NEGOCIO:',
      atsAutoReject: 'de sistemas ATS auto-rechazan CVs sin números',
      recruitersSpend6Seconds: 'Los reclutadores pasan 6 segundos - las métricas captan atención al instante',
      higherCallbackRate: 'tasa de llamadas más alta cuando hay logros cuantificables',
      immediateFix: 'SOLUCIÓN INMEDIATA:',
      increasedSales: 'Aumenté las ventas en',
      reducedCosts: 'Reduje los costos en',
      ledTeam: 'Lideré un equipo de',
      editTab: 'Editar',
      robotView: 'Vista Robot',
      progressTab: 'Progreso',
      actionPlanTab: 'Plan de Acción',
      interviewTab: 'Entrevista',
      recruiterTab: 'Reclutador',
      apply: 'Aplicar',
      optimizing: 'Optimizando...',
      reanalyze: 'Re-analizar',
      cancel: 'Cancelar',
    },
    previewScan: {
      title: 'Escaneo Diagnóstico Profundo',
      subtitle: 'Ve exactamente cómo los sistemas ATS analizan tu CV - sin registro',
      dropHere: 'Suelta tu CV aquí',
      orBrowse: 'o haz clic para examinar archivos',
      supports: 'Compatible con PDF, Word e Imágenes',
      addJobDesc: 'Añadir descripción del puesto objetivo para mejor coincidencia (opcional)',
      targetJobPosition: 'Puesto de Trabajo Objetivo',
      jobDescPlaceholder: 'Pega aquí la descripción completa del trabajo...',
      jobDescAdded: 'Descripción del trabajo añadida - mejorará el análisis de palabras clave',
    },
    nav: {
      features: 'Características',
      pricing: 'Precios',
      login: 'Entrar',
      logIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      dashboard: 'Panel',
      blog: 'Blog',
      product: 'Producto',
    },
    buttons: {
      uploadResume: 'Subir CV',
      uploadNewCv: 'Subir Nuevo CV',
      tryFree: 'Prueba Gratis',
      getSingleScan: 'Obtener Escaneo Único',
      startSprint: 'Iniciar Sprint',
      checkMyResume: 'Revisar Mi CV',
      seeHowItWorks: 'Ver Cómo Funciona',
      viewFullReport: 'Ver Informe Completo',
      managePlan: 'Administrar Plan',
      upgradeNow: 'Actualizar Ahora',
      buyMoreCredits: 'Comprar Más Créditos',
      launchTool: 'Lanzar Herramienta',
    },
    navbar: {
      analyzer: 'Analizador',
      tools: 'Herramientas',
      pricing: 'Precios',
      dashboard: 'Panel',
      login: 'Iniciar sesión',
      scanResume: 'Escanear CV',
      scan: 'Escanear',
    },
    auth: {
      loading: 'Iniciando sesión...',
      analyzing: 'ANALIZANDO_ESTRUCTURA...',
      parsing: 'ANALIZANDO_PALABRAS...',
      optimizing: 'OPTIMIZANDO_PUNTUACIÓN...',
      headline: 'Depura tu historial profesional con precisión.',
      subtitle: 'Únete a miles de personas que optimizaron sus CVs con análisis impulsado por IA y consiguieron sus trabajos soñados.',
      initSession: 'Inicializar Sesión',
      enterCredentials: 'Ingresa tus credenciales para acceder a la consola',
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      noAccount: '¿No tienes cuenta?',
      haveAccount: '¿Ya tienes cuenta?',
      deployNew: '[Crear perfil nuevo]',
      signInLink: '[Iniciar sesión]',
      version: 'v2.4.0-stable',
      systemStatus: 'Sistema Operativo',
      blueprintTitle: 'Depura tu CV como un Profesional',
      blueprintSubtitle: 'Únete a miles de buscadores de empleo que han optimizado sus CVs con insights impulsados por IA y han conseguido sus trabajos soñados.',
      blueprintDescription: 'Únete a miles de buscadores de empleo que han optimizado sus CVs con insights impulsados por IA y han conseguido sus trabajos soñados.',
      feature1Title: 'Visión Robot ATS',
      feature1Desc: 'Ve exactamente lo que ven los sistemas de reclutadores',
      feature2Title: 'Análisis con IA',
      feature2Desc: 'Obtén retroalimentación instantánea sobre palabras clave, formato e impacto',
      feature3Title: 'Seguimiento de Solicitudes',
      feature3Desc: 'Gestiona tu búsqueda de empleo en un solo lugar',
      termsAgreement: 'Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad',
      atsVision: 'Visión ATS Robot',
      atsVisionDesc: 'Ve exactamente lo que ven los sistemas de reclutadores',
      aiAnalysis: 'Análisis con IA',
      aiAnalysisDesc: 'Obtén retroalimentación instantánea sobre palabras clave, formato e impacto',
      trackApps: 'Rastrea Aplicaciones',
      trackAppsDesc: 'Administra tu búsqueda de empleo en un solo lugar',
    },
    sidebar: {
      home: 'Inicio',
      myResumes: 'Mis CVs',
      aiTools: 'Herramientas IA',
      eliteMatch: 'Match Elite',
      settings: 'Configuración',
      adminPanel: 'Panel Admin',
      sprintActive: 'Sprint Activo',
      days: 'DÍAS',
      hours: 'HRS',
      minutes: 'MIN',
      managePlan: 'Gestionar Plan',
      upgradeNow: 'Actualizar Ahora',
      proPlan: 'Plan Pro',
      freePlan: 'Plan Gratis',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      landingPage: 'Página Principal',
      signOut: 'Cerrar Sesión',
      upload: 'Subir',
      download: 'Descargar',
      edit: 'Editar',
    },
    showcase: {
      badge: 'Escáner ATS Gratuito',
      heading: 'Supera los Sistemas ATS',
      subheading: 'En 10 Segundos',
      description: 'Ve tu CV como lo ven los robots. Obtén comentarios instantáneos y consigue más entrevistas.',
      robotTech: 'Tecnología Vista Robot',
      robotDesc: 'Ve exactamente lo que ven los robots ATS - sin adivinar',
      instantScore: 'Puntuación ATS Instantánea',
      instantDesc: 'Obtén tu puntuación de compatibilidad en 10 segundos',
      smartKeyword: 'Análisis Inteligente de Palabras Clave',
      smartDesc: 'Coincidencia con descripciones de trabajo con IA',
      enterpriseSec: 'Seguridad Empresarial',
      enterpriseDesc: 'Tus datos permanecen privados y seguros',
      ctaBanner: 'Obtén tu Puntuación ATS Gratuita',
      ctaSubtext: 'Escanea tu CV en 10 segundos - sin registro',
      ctaButton: 'Prueba el Escaneo Gratis →',
    },
    comparison: {
      badge: 'Verificación de Realidad',
      heading: 'Lo que ves vs. Lo que ven ellos',
      description: 'La mayoría de las plantillas de CV modernas se ven geniales para los humanos pero son una pesadilla para los robots. Las columnas, iconos y gráficos a menudo rompen la lógica de análisis.',
      humanView: 'Vista Humana (PDF)',
      robotView: 'Vista Robot (Analizado)',
    },
    footer: {
      description: 'Supera los sistemas ATS con optimización de CV con IA. Consigue trabajo más rápido.',
      product: 'Producto',
      pricing: 'Precios',
      freeScanner: 'Escáner Gratuito',
      blog: 'Blog',
      resources: 'Recursos',
      aboutUs: 'Sobre Nosotros',
      contactUs: 'Contáctanos',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
      copyright: '© 2026 CVDebug Inc. Todos los derechos reservados. Estado del Sistema:',
      systemStatus: 'Estado del Sistema:',
      online: 'En Línea',
    },
    landing: {
      nav: {
        features: 'Características',
        pricing: 'Precios',
        login: 'Iniciar sesión',
        signUp: 'Registrarse',
      },
      hero: {
        title: 'Depura Tu CV Como un Profesional',
        subtitle: 'Deja de ser rechazado. Ve exactamente lo que ven los sistemas ATS y corrígelo en minutos.',
        startButton: 'Iniciar Escaneo Gratis',
        viewDemo: 'Ver Demo',
      },
      socialProof: {
        trustedBy: 'Confiado por profesionales en',
      },
      stats: {
        stat1: 'Más de 50,000 CVs analizados',
        stat2: '89% más de entrevistas',
        stat3: 'Escaneo en 10 segundos',
        stat4: 'Seguridad de nivel empresarial',
      },
      cta: {
        badge: 'Comenzar',
        heading: '¿Listo para conseguir el trabajo de tus sueños?',
        description: 'Únete a miles de profesionales exitosos que mejoraron sus CVs con CVDebug.',
        buttonText: 'Iniciar Escaneo Gratis Ahora',
        footerText: 'No se requiere tarjeta de crédito',
        secondary: '¿Aún tienes preguntas? Prueba nuestro escáner ATS gratis ahora',
        button: 'Escanea Tu CV Gratis →',
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        question1: '¿Qué es un sistema ATS?',
        answer1: 'ATS (Sistema de Seguimiento de Candidatos) es un software que las empresas usan para filtrar CVs antes de que lleguen a los reclutadores. La mayoría de las grandes empresas usan ATS, y puede rechazar hasta el 75% de los CVs.',
        question2: '¿Cómo me ayuda CVDebug?',
        answer2: 'CVDebug te muestra exactamente cómo los sistemas ATS analizan tu CV, identifica palabras clave faltantes y proporciona recomendaciones para mejorar tu puntuación ATS.',
        question3: '¿Mis datos están seguros?',
        answer3: '¡Sí! Utilizamos encriptación de nivel empresarial y nunca compartimos tus datos con terceros. Tu CV se procesa de forma segura y se elimina después del análisis a menos que lo guardes.',
        stillHaveQuestions: '¿Aún tienes preguntas? Prueba nuestro escáner ATS gratis ahora',
        tryFreeScan: 'Escanea Tu CV Gratis →',
      },
      testimonials: {
        badge: 'Muro de Amor de Reddit',
        heading: 'Confiado por Redditors en Todo el Mundo',
        subheading: 'Comentarios reales de r/resumes, r/developersIndia, r/cscareerquestions, y más.',
        subtitle: 'Comentarios reales de r/resumes, r/developersIndia, r/cscareerquestions, y más.',
        joinThousands: 'Únete a miles de buscadores de empleo optimizando sus CVs',
        subreddits: 'r/resumes, r/developersIndia, r/cscareerquestions, r/ProductManagement, r/datascience',
      },
      enterprise: {
        badge: 'Empresarial',
        title: 'Escala Tu Contratación',
        subtitle: 'Sin Compromisos',
        description: 'Diseñado para equipos de reclutamiento que procesan miles de aplicaciones. Obtén descuentos por volumen, soporte dedicado e integraciones personalizadas.',
        contactSales: 'Contactar Ventas',
        viewPricing: 'Ver Precios',
        feature1: 'Gestión de Equipo',
        feature1Desc: 'Panel centralizado para equipos de RRHH para rastrear todas las aplicaciones de candidatos',
        feature2: 'Cumplimiento SOC 2',
        feature2Desc: 'Seguridad de nivel empresarial con SSO y control de acceso basado en roles',
        feature3: 'Acceso a API',
        feature3Desc: 'Integra el escaneo ATS directamente en tu flujo de trabajo de reclutamiento',
      },
      finalCta: {
        heading: '¿Listo para depurar tu carrera?',
        description: 'Únete a más de 10,000 desarrolladores que corrigieron sus errores de análisis y duplicaron su tasa de entrevistas.',
        button: 'Verifica Mi Visibilidad (Escaneo Gratis)',
        footer: 'No se requiere tarjeta de crédito • Cumplimiento RGPD • Resultado Instantáneo',
      },
    },
    onboarding: {
      steps: {
        role: 'Rol',
        upload: 'Subir',
        scan: 'Escanear',
      },
      roleSelection: {
        heading: '¿A qué puesto aspiras?',
        editLink: 'Editar',
        continueButton: 'Continuar',
      },
      cvUpload: {
        heading: 'Sube Tu CV',
        description: 'Suelta tu archivo de CV o haz clic para buscar',
        clickToUpload: 'Haz clic para subir',
        dragDrop: 'o arrastra y suelta',
        maxSize: 'PDF, DOC, DOCX hasta 10MB',
        log1: '[INIT] Analizando estructura del documento...',
        log2: '[SCAN] Analizando palabras clave y formato...',
        log3: '[CHECK] Ejecutando verificaciones de compatibilidad ATS...',
        log4: '[MATCH] Comparando con requisitos del trabajo...',
        log5: '[SCORE] Calculando puntuación final...',
        log6: '[DONE] ¡Análisis completo!',
        systemLogs: 'Registros del Sistema',
        backButton: 'Atrás',
        scanButton: 'Escanear CV',
      },
      helpCenter: {
        label: 'Centro de Ayuda',
      },
    },
    pricingPage: {
      freePlan: {
        name: 'Escaneo Gratis',
        description: 'Perfecto para probar CVDebug',
        price: '0',
        period: 'único',
        feature1: '1 escaneo de CV gratis',
        feature2: 'Puntuación ATS básica',
        feature3: 'Vista previa robot',
        feature4: 'Análisis de palabras clave',
        button: 'Iniciar Escaneo Gratis',
      },
      pass24h: {
        name: 'Pase 24 Horas',
        description: 'Escaneos ilimitados por un día',
        price: '9',
        period: '24 horas',
        feature1: 'Escaneos de CV ilimitados',
        feature2: 'Informe completo de compatibilidad ATS',
        feature3: 'Análisis detallado de palabras clave',
        feature4: 'Recomendaciones de formato',
        feature5: 'Descarga de informes PDF',
        feature6: 'Soporte por email',
        feature7: 'Acceso de 24 horas',
        button: 'Obtener Pase de 24 Horas',
      },
      sprint7d: {
        name: 'Sprint 7 Días',
        description: 'Perfecto para búsqueda de empleo',
        price: '29',
        period: '7 días',
        feature1: 'Todo en el Pase de 24 Horas',
        feature2: 'Versiones de CV ilimitadas',
        feature3: 'Optimización con IA',
        feature4: 'Coincidencia personalizada de trabajos',
        feature5: 'Soporte prioritario',
        feature6: 'Acceso al creador de CVs',
        feature7: 'Análisis de carta de presentación',
        feature8: 'Consejos de optimización de LinkedIn',
        feature9: 'Acceso de 7 días',
        button: 'Iniciar Sprint de 7 Días',
        recommended: 'Más Popular',
      },
      hero: {
        badge: 'Precios',
        title: 'Elige Tu Plan',
        subtitle: 'Obtén el plan perfecto para tu búsqueda de empleo',
      },
      faq: {
        heading: 'Preguntas Frecuentes sobre Precios',
        question1: '¿Puedo cancelar en cualquier momento?',
        answer1: '¡Sí! Puedes cancelar tu suscripción en cualquier momento. Sin preguntas.',
        question2: '¿Qué métodos de pago aceptan?',
        answer2: 'Aceptamos todas las tarjetas de crédito principales, PayPal y Apple Pay.',
        question3: '¿Hay política de reembolso?',
        answer3: 'Sí, ofrecemos garantía de devolución de dinero de 7 días si no estás satisfecho con nuestro servicio.',
        question4: '¿Puedo actualizar mi plan?',
        answer4: '¡Absolutamente! Puedes actualizar de cualquier plan a uno superior en cualquier momento.',
        question5: '¿Ofrecen descuentos?',
        answer5: 'Sí! Ofrecemos descuentos para estudiantes y precios especiales para centros de carrera. Contáctanos para detalles.',
        question6: '¿Qué pasa después de que expire mi plan?',
        answer6: 'Mantendrás acceso a tus informes guardados, pero necesitarás renovar para crear nuevos escaneos.',
      },
      guarantee: 'Garantía de devolución de dinero de 30 días',
    },
    modals: {
      subscription: {
        title: 'Estado de Suscripción',
        tier: 'Plan Actual',
        accessMessage: 'Tienes acceso completo a todas las funciones',
        upgradeMessage: 'Actualiza para desbloquear funciones premium',
        viewOptions: 'Ver Opciones',
        continueDashboard: 'Continuar al Panel',
        pressEsc: 'Presiona ESC para cerrar',
        premium: 'Premium',
        interviewSprint: 'Sprint 7 Días',
        singleScan: 'Pase 24 Horas',
        freePlan: 'Plan Gratis',
        scoreChanged: '¿Tu puntuación cambió? Aquí está el porqué',
        nowMatching: 'Ahora comparamos tu CV contra Estándares de la Industria.',
        realVisibility: 'Tu visibilidad real es',
        whyLower: 'El escaneo de vista previa fue una revisión rápida. El panel muestra tu compatibilidad ATS real.',
        industryStandards: 'Comparamos contra requisitos reales del mercado laboral.',
      },
      logout: {
        title: 'Cerrar Sesión',
        question: '¿Estás seguro de que quieres cerrar sesión?',
        stayButton: 'Mantener Sesión',
        logoutButton: 'Cerrar Sesión',
      },
      creditsExhausted: {
        title: 'Créditos Agotados',
        message: 'Has usado todos tus escaneos gratuitos',
        scoreLabel: 'Tu Puntuación',
        warning: 'Actualiza para ver tu análisis completo',
        feature1: 'Informe detallado de compatibilidad ATS',
        feature2: 'Sugerencias de optimización de palabras clave',
        price: '9€',
        unlockButton: 'Desbloquear Informe Completo',
        maybeLater: 'Quizás Después',
      },
    },
    toasts: {
      errors: {
        selectRating: 'Por favor selecciona una calificación',
        submissionFailed: 'Error al enviar comentarios',
        fileRequired: 'Por favor selecciona un archivo',
        invalidFormat: 'Formato de archivo inválido',
        uploadFailed: 'Error al cargar',
        aiProcessingError: 'Error de procesamiento de IA',
        fetchError: 'Error al obtener datos',
        unauthorized: 'Acceso no autorizado',
        noCredits: 'No quedan créditos. Por favor actualiza para continuar.',
        apiKeyNotConfigured: 'Clave API no configurada. Por favor contacta soporte en cvdebug@outlook.com',
        noTransactionId: 'No hay ID de transacción disponible',
        checkoutError: 'Error al iniciar pago',
        loginRequired: 'Por favor inicia sesión para comprar créditos',
        initiateError: 'Error al iniciar pago',
      },
      success: {
        feedbackSubmitted: '¡Gracias por tus comentarios!',
        cvUploaded: '¡CV Cargado Exitosamente!',
        saved: '¡Cambios guardados!',
        deleted: 'Eliminado exitosamente',
        updated: 'Actualizado exitosamente',
        copied: '¡Copiado al portapapeles!',
        downloaded: 'Descargado exitosamente',
        generated: '¡Generado exitosamente!',
        optimized: '¡Optimizado exitosamente!',
        applied: '¡Aplicado exitosamente!',
      },
      warnings: {
        fileTooLarge: 'El archivo es demasiado grande',
        limitReached: 'Límite alcanzado',
        replaceBrackets: '¡No olvides reemplazar los valores [entre corchetes] con tus números reales!',
      },
    },
    images: {
      userAvatar: 'Avatar de usuario',
      logo: 'Logo de CVDebug',
      feature: 'Ilustración de función',
    },
    admin: {
      title: 'Panel Admin',
      users: 'Usuarios',
      analytics: 'Analíticas',
      settings: 'Configuración',
      import: {
        syncComplete: 'Sincronización Completa',
        syncFailed: 'Sincronización Fallida',
        importFailed: 'Importación Fallida',
        importSuccess: 'Importación Exitosa',
      },
      grant: {
        emailPlaceholder: 'usuario@ejemplo.com o user_2...',
        namePlaceholder: 'Juan Pérez',
        planPlaceholder: 'Seleccionar plan',
      },
      payment: {
        emailPlaceholder: 'Email del Usuario',
      },
      payments: {
        received: '💰 ¡Nuevo Pago Recibido!',
      },
      usersTable: {
        searchPlaceholder: 'Buscar usuarios...',
        updated: 'Usuario actualizado exitosamente',
        updateError: 'Error al actualizar usuario',
      },
      fix: {
        error: 'Error al arreglar usuarios',
        complete: 'Arreglo Completo',
        reportedError: 'Error al arreglar usuarios reportados',
        reportedComplete: 'Arreglo de Usuarios Reportados Completo',
        deleteSuccess: 'Usuario eliminado',
        deleteError: 'Error al eliminar usuario',
      },
    },
    tools: {
      writingForge: {
        title: 'Forja de Escritura',
        description: 'Editor de CV con IA',
        placeholder: 'Pega el texto de tu CV aquí...',
        analyzing: 'Analizando con IA...',
        error: 'Error de procesamiento',
        noText: 'Sin texto para procesar',
        tooShort: 'El texto es demasiado corto',
        generating: 'Generando mejoras...',
        improvementReady: '¡Mejoras listas!',
        noResume: 'Sin texto de CV para editar',
        emptyResume: 'El CV no puede estar vacío',
        saveError: 'No se pueden guardar los cambios',
        saved: '¡Cambios guardados!',
        saveFailed: 'Error al guardar cambios',
        noTextToRegenerate: 'Sin texto de CV para regenerar',
        regenerating: 'Regenerando con IA...',
        regenerated: '¡CV regenerado!',
        preparingPdf: 'Preparando descarga de PDF...',
        editPlaceholder: 'Edita el texto de tu CV aquí...',
      },
      interviewBattle: {
        title: 'Plan de Batalla para Entrevistas',
        description: 'Prepárate para entrevistas con estrategia generada por IA',
        noResumeText: 'No hay suficiente texto de CV para generar preguntas',
        regenerating: 'Regenerando preguntas con algoritmos ML...',
        questionsRegenerated: '¡Preguntas regeneradas con ML! Preguntas frescas basadas en tu CV.',
        generateError: 'Error al generar preguntas. Usando preguntas de respaldo.',
        enhancing: 'Mejorando tu respuesta con IA...',
        answerEnhanced: '¡Respuesta mejorada con sugerencias de IA!',
        actionPlaceholder: 'Describe las acciones que tomaste...',
        downloading: 'Descargando documento de estrategia...',
        noJobDesc: 'Por favor pega la descripción del trabajo primero',
        battlePlanGenerated: '¡Plan de batalla generado!',
        battlePlanError: 'Error al generar plan de batalla',
        jobDescPlaceholder: 'Pega aquí la descripción completa del trabajo...',
        invalidJobDesc: 'Por favor proporciona una descripción de trabajo válida para generar preparación de entrevista.',
        shortResume: 'El texto del CV es demasiado corto. Por favor carga un CV válido primero.',
        requiresSubscription: 'Error al generar preparación. Esta función requiere una suscripción activa.',
      },
      linkedIn: {
        title: 'Optimizador de LinkedIn',
        description: 'Optimiza tu perfil de LinkedIn para máxima visibilidad',
        upgradeDescription: 'Actualiza para optimizar tu perfil de LinkedIn',
        noProfileText: 'Por favor pega el texto de tu perfil de LinkedIn',
        analyzed: '✅ ¡Perfil de LinkedIn analizado exitosamente!',
        scanError: 'Error al escanear perfil. Por favor intenta de nuevo.',
        noBioOptimization: 'No hay optimización de biografía disponible. Por favor escanea tu perfil primero.',
        bioOptimized: '✅ ¡Biografía optimizada copiada al portapapeles! Pégala en tu perfil de LinkedIn',
      },
      answerFinder: {
        title: 'Buscador de Respuestas',
        searchPlaceholder: 'Buscar por palabra clave...',
      },
      keywordSniper: {
        title: 'Francotirador de Palabras Clave',
        uploadResume: 'Cargar CV',
        pasteJob: 'Pegar Descripción del Trabajo',
        analyzing: 'Analizando palabras clave...',
        generateError: 'Error al generar frases. Por favor intenta de nuevo.',
        applied: '¡Sugerencia aplicada! Tu CV ha sido actualizado.',
        rewritten: '¡CV reescrito exitosamente!',
        exampleDescription: 'Ver cómo los mejores candidatos incorporan esta palabra clave efectivamente.',
      },
      bullet: {
        noInput: 'Por favor ingresa un punto para reescribir',
        optimized: '¡Punto optimizado!',
        rewriteError: 'Error al reescribir punto',
        examplePlaceholder: 'Ejemplo: Trabajé en mejorar el rendimiento del sitio web...',
        rolePlaceholder: 'ej., Ingeniero de Software',
        powerStatementCopied: '¡Declaración Poderosa copiada!',
      },
      coverLetter: {
        title: 'Generador de Cartas de Presentación',
        upgradeDescription: 'Actualiza para generar cartas de presentación con IA',
        noJobDescription: 'Por favor ingresa una descripción de trabajo',
        generated: '¡Carta de presentación generada exitosamente!',
        generateError: 'Error al generar carta de presentación',
        selectResume: 'Seleccionar un CV...',
        companyPlaceholder: 'ej. Acme Corp',
        rolePlaceholder: 'ej. Ingeniero Senior',
      },
      dm: {
        title: 'Generador de MDs',
        noProfile: 'Falta texto de perfil. Por favor analiza tu perfil primero.',
        generated: '¡MDs generados exitosamente!',
        generateError: 'Error al generar MDs. Por favor intenta de nuevo.',
        copied: '¡MD copiado al portapapeles!',
        namePlaceholder: 'ej. Sarah Smith',
      },
      headline: {
        title: 'Optimizador de Titular',
        copied: '¡Titular copiado al portapapeles!',
      },
      liveOptimizer: {
        title: 'Optimizador de CV en Vivo',
        placeholder: 'Pega el contenido de tu CV aquí y observa la puntuación actualizarse en tiempo real...',
      },
    },
    dashboardExtended: {
      applications: {
        upgradeDescription: 'Actualiza para rastrear aplicaciones y obtener insights con IA',
        added: 'Aplicación agregada exitosamente',
        addError: 'Error al agregar aplicación',
        companyPlaceholder: 'ej., Acme Corp',
        rolePlaceholder: 'ej., Ingeniero Senior',
        urlPlaceholder: 'https://...',
        jobDescPlaceholder: 'Pega la descripción del trabajo aquí para coincidencia de palabras clave con IA...',
      },
      projects: {
        created: '¡Proyecto creado exitosamente!',
        createError: 'Error al crear proyecto',
        projectPlaceholder: 'ej. Búsqueda de Ingeniero Senior en Google',
        titlePlaceholder: 'ej. Ingeniero de Software Senior, Product Manager...',
        urlPlaceholder: 'https://linkedin.com/jobs/view/...',
        jobDescPlaceholder: 'Pega aquí la descripción completa del trabajo...',
        uploadSuccess: '¡CV Cargado Exitosamente!',
      },
      ats: {
        textCopied: 'Texto sin formato copiado al portapapeles',
        textDownloaded: 'Texto sin formato descargado',
        searchPlaceholder: 'Buscar por palabra clave...',
      },
      fluff: {
        metricCopied: '¡Métrica copiada al portapapeles!',
        copyError: 'Error al copiar al portapapeles',
        copyErrorDescription: 'Por favor intenta seleccionar el texto manualmente.',
        noMetricSelected: 'Por favor selecciona una métrica primero',
        noMetricDescription: 'Elige una de las cuantificaciones sugeridas por IA arriba.',
      },
      sanitize: {
        noResume: 'No se puede sanitizar: falta ID de CV',
        success: '¡PDF sanitizado exitosamente!',
        successDescription: 'La integridad de la capa de texto ha sido restaurada.',
        error: 'Error al sanitizar PDF',
      },
      scanning: {
        fileValidation: 'Validación de Archivo',
        fileValidationSubtitle: 'La estructura del PDF es válida.',
        layoutIntegrity: 'Integridad del Diseño',
        layoutIntegritySubtitle: 'Verificando márgenes y flujo de texto.',
        keywordMatch: 'Coincidencia de Palabras Clave',
        keywordMatchSubtitle: 'PENDIENTE',
        timeline: 'Línea de Tiempo de Experiencia',
        timelineSubtitle: 'Analizando progresión de carrera.',
        scoring: 'Puntuación e Informe',
        scoringSubtitle: 'Calculando puntuación final.',
      },
      metrics: {
        noQuantified: 'Por favor proporciona una versión cuantificada',
        replaceBrackets: '¡No olvides reemplazar los valores [entre corchetes] con tus números reales!',
        updated: '¡Punto actualizado con métricas!',
      },
      insights: {
        overall: 'General',
        keywordMatch: 'Coincidencia de Palabras Clave',
        actionVerbs: 'Verbos de Acción',
        impact: 'Impacto',
        structure: 'Estructura',
      },
      kanban: {
        applied: 'Aplicado',
        interviewing: 'En Entrevistas',
        accepted: 'Aceptado',
      },
      analysis: {
        error: 'El análisis del CV falló. Por favor intenta de nuevo.',
      },
      reportUnlocked: '🎉 ¡Informe de CV desbloqueado! Tus créditos han sido aplicados.',
      resumeDeleted: 'CV eliminado',
      upgrade: {
        interviewSprintRequired: 'Se requiere plan Sprint de Entrevistas',
      },
      feedback: {
        noRating: 'Por favor selecciona una calificación',
        success: '¡Gracias por tus comentarios!',
        submitError: 'Error al enviar comentarios',
        commentPlaceholder: '¿Algún comentario adicional? (opcional)',
        tellMore: 'Cuéntanos más (opcional)',
      },
    },
    payment: {
      success: '¡Pago exitoso! Desbloqueando tu informe de CV...',
      creditError: 'Pago registrado pero actualización de créditos falló. Por favor contacta soporte',
      noTransactionId: 'No hay ID de transacción disponible',
      receiptDownloaded: 'Recibo descargado exitosamente',
      downloadError: 'Error al descargar recibo',
      checkoutError: 'Error al iniciar pago',
      loginRequired: 'Por favor inicia sesión para comprar créditos',
      initiateError: 'Error al iniciar pago',
    },
    pages: {
      nursing: {
        title: 'Escáner ATS para Enfermeras',
        clinical: 'Optimizador de Palabras Clave Clínicas',
        healthcare: 'Compatibilidad ATS de Salud',
        credentials: 'Validador de Licencias y Credenciales',
      },
      medSurg: {
        title: 'Optimizador ATS para Enfermeras Med-Surg',
        generic: 'Genérico',
        patientRatios: 'Proporciones de Pacientes No Cuantificadas',
        surgicalExperience: 'Experiencia Quirúrgica Enterrada',
      },
      softwareEngineer: {
        title: 'Francotirador de Palabras Clave para Ingenieros de Software',
        techStack: 'Francotirador de Palabras Clave de Tech Stack',
        faang: 'Compatibilidad ATS FAANG',
        systemDesign: 'Validador de Diseño de Sistemas',
      },
      dataAnalyst: {
        title: 'Depuración de CV para Analistas de Datos',
        skills: 'Analizador de Habilidades Técnicas',
        metrics: 'Analizador de Impacto de Métricas',
        techStack: 'Coincidencia de Palabras Clave de Tech Stack',
      },
      finance: {
        title: 'Optimizador ATS para Pasantías Financieras',
        ibKeywords: 'Validador de Palabras Clave IB',
        format: 'Verificador de Formato de Pasantías',
        metricsOptimizer: 'Optimizador de Métricas Financieras',
      },
      about: {
        title: 'Acerca de CVDebug - Optimización de CV ATS con IA',
        missionDriven: 'Impulsado por la Misión',
        jobSeeker: 'Buscador de Empleo Primero',
        innovation: 'Innovación',
        privacyTitle: 'Privacidad y Confianza',
      },
      blog: {
        title: 'Consejos de CV ATS y Estrategias de Búsqueda de Empleo Blog | CVDebug',
      },
      privacy: {
        title: 'Política de Privacidad | CVDebug',
      },
      terms: {
        title: 'Términos y Condiciones | CVDebug',
      },
      contact: {
        title: 'Contáctanos | Soporte CVDebug',
        email: 'Soporte por Email',
        chat: 'Chat en Vivo',
        responseTime: 'Tiempo de Respuesta',
        location: 'Ubicación',
        namePlaceholder: 'Juan Pérez',
        emailPlaceholder: 'juan@ejemplo.com',
        messagePlaceholder: '¿Cómo podemos ayudarte?',
      },
    },
    previewScanExtended: {
      processError: 'Error al procesar archivo',
    },
    heroSection: {
      badge: 'Nuevo: Análisis ATS Mejorado con ML',
      mainHeadline: '¿Los ATS están bloqueando <br />tu currículum?',
      diagnosticNote: 'CVDebug es una herramienta de diagnóstico, no una solución mágica.',
      oneTimePayment: 'Pago único, sin suscripciones.',
      checkResumeButton: 'Revisar Mi CV',
      seeHowButton: 'Ver Cómo Funciona',
      trustedBy: 'Confiado por',
      jobSeekers: 'profesionales',
      criticalFixNeeded: 'Corrección Crítica Necesaria',
      missingKeywordsAlert: 'Tu currículum carece de 3 palabras clave críticas encontradas en la descripción del trabajo',
    },
    ctaSection: {
      payOnceBadge: 'Paga una vez, usa cuando quieras',
      readyHeading: '¿Listo para vencer al ATS?',
      description: 'Obtén análisis mejorado con ML con ponderación de palabras clave TF-IDF, detección de formato y correcciones accionables. 1 escaneo = 1 crédito. Sin suscripciones.',
      startButton: 'Iniciar Tu Primer Escaneo',
      footnote: '✨ Primer escaneo gratis • Los créditos nunca expiran • Resultados instantáneos',
    },
    testimonialsSection: {
      badge: 'Muro de Amor de Reddit',
      heading: 'Confiado por Redditors en Todo el Mundo',
      description: 'Comentarios reales de r/resumes, r/developersIndia, r/cscareerquestions y más.',
      ctaText: 'Únete a miles de profesionales optimizando sus currículums',
    },
    faqSection: {
      heading: 'Preguntas Comunes',
      q1: '¿Venden mis datos?',
      a1: 'Nunca. Tu currículum se analiza en memoria y se almacena de forma segura solo para tu sesión. No vendemos datos a reclutadores ni terceros.',
      q2: '¿Qué es la "Trampa de Imagen"?',
      a2: 'Muchas plantillas de currículum modernas (de Canva o Photoshop) exportan texto como imágenes aplanadas. Los sistemas ATS no pueden leer imágenes, por lo que tu experiencia es invisible. CVDebug detecta esto y te muestra exactamente lo que ve el ATS.',
      q3: '¿Funciona para todas las industrias?',
      a3: 'Sí, pero está optimizado para roles técnicos y corporativos donde el uso de ATS es más alto. Los campos creativos pueden tener requisitos diferentes.',
    },
    pricingSection: {
      heading: 'Precios Simples',
      subheading: 'Paga una vez. Arregla para siempre. Sin suscripciones.',
      freePreview: 'Vista Previa Gratuita',
      free: 'Gratis',
      seeScore: 'Ver tu puntuación ATS',
      tryFree: 'Prueba Gratis',
      singleScan: 'Escaneo Único',
      oneCompleteFix: 'Una corrección completa',
      getSingleScan: 'Obtener Escaneo Único',
      interviewSprint: 'Sprint de Entrevistas',
      sevenDaysUnlimited: '7 días ilimitados',
      startSprint: 'Iniciar Sprint',
      bestValue: '🚀 MEJOR VALOR',
    },
    statsSection: {
      rejectionRate: '75%',
      rejectionLabel: 'CVs rechazados por ATS',
      noBSLabel: 'Sin Tonterías',
      transparentPricing: 'Precios Transparentes',
      analysisTime: '10s',
      avgTimeLabel: 'Tiempo promedio de análisis',
      secureLabel: 'Seguro',
      dataRetention: 'Datos eliminados en 30 días',
    },
    featuresBento: {
      scatteredResumesTitle: 'Por qué los currículums dispersos matan tu búsqueda de empleo',
      projectBasedTitle: 'Seguimiento Basado en Proyectos',
      projectBasedDesc: 'Crea proyectos de búsqueda de empleo y rastrea cada aplicación con puntuaciones de coincidencia, cartas de presentación personalizadas y brechas de palabras clave. Ve qué empresas te están ignorando.',
      healthMonitorTitle: 'Monitor de Salud en Tiempo Real',
      healthMonitorDesc: 'Las verificaciones continuas de integridad del CV te alertan instantáneamente si el formato se rompe o las palabras clave se desvían. Mantén tu CV maestro listo para ATS 24/7.',
      keywordGapTitle: 'Análisis de Brecha de Palabras Clave',
      keywordGapDesc: 'Ve lado a lado lo que Google quiere vs. lo que Meta quiere. Copia y pega descripciones de trabajos y obtén coincidencias de palabras clave puntuadas por TF-IDF instantáneas.',
      aiCoverLetterTitle: 'Generador de Cartas de Presentación IA',
      aiCoverLetterDesc: 'Genera cartas de presentación personalizadas que cierran explícitamente tus brechas de palabras clave. Cada carta hace referencia a tus habilidades faltantes reales del análisis de brecha.',
    },
    freeTierView: {
      founderAudit: 'Auditoría del Fundador',
      byAlbert: 'por Albert',
      bottomPercentile: 'Estás en el {percentileRank}% Inferior de Candidatos',
      yourScore: 'Tu Puntuación',
      autoRejected: 'Auto-rechazado por el 90% de las empresas',
      thoseWhoGetInterviews: 'Quienes Obtienen Entrevistas',
      pointsHigher: '{missingPoints} puntos más alto',
      passATSFilters: 'Pasan los filtros ATS',
      missingKeywords: 'Te faltan {missingCount} palabras clave críticas que ellos tienen',
      unlockList: '[Desbloquear lista completa por €9.99]',
      robotViewTitle: '🤖 Vista Robot',
      freePreviewBadge: 'VISTA PREVIA GRATUITA',
      robotViewDesc: 'Esto es exactamente lo que el ATS ve al analizar tu currículum',
      robotViewWarning: 'Si tu texto falta, está confuso o desordenado aquí, el ATS no puede leer tu currículum. Esta es la razón #1 de auto-rechazo.',
      noTextExtracted: 'No se extrajo texto. Esto significa que los sistemas ATS no pueden leer tu currículum en absoluto.',
      parsingError: '[ERROR DE ANÁLISIS DETECTADO]',
      hiddenContent: '⚠️ Contenido oculto bloqueado por el analizador ATS',
      chatGPTCantFix: '💡 ChatGPT no puede arreglar esto. Solo nuestro Sanitizador de PDF puede reparar errores de análisis.',
      moreErrors: '+{number} más errores de análisis ocultos',
      topCriticalErrors: 'Principales Errores Críticos',
      showingErrors: 'Mostrando 2 de {formatCount}',
      missingCriticalKeywords: '🔑 Palabras Clave Críticas Faltantes',
      highImpact: 'Alto Impacto',
      keywordsHidden: '{number} Palabras Clave Críticas Ocultas',
      getCertified: 'Certifica Tu Currículum con CVDebug',
      unlockPackage: 'Desbloquea {missingCount} palabras clave exactas + {formatCount} correcciones críticas por un pago único de €9.99',
      certificationPackage: '✅ Paquete de Certificación ATS:',
      allKeywords: 'Todas las {total} palabras clave faltantes con ubicación exacta',
      allFormatErrors: 'Todos los {total} errores de formato con correcciones de 1 clic',
      aiRewrite: 'Sugerencias de reescritura con IA',
      atsCertifiedPDF: '✅ Descarga de PDF Certificado ATS con insignia',
      pdfSanitizer: '⚡ Sanitizador de PDF de Un Clic en 3 segundos',
      getCertifiedButton: 'Certificarse - Solo €9.99',
      albertReview: 'Albert revisa tu CV personalmente',
      videoFeedback: 'Video de 3 min con comentarios brutales + todas las correcciones',
      manualReviewButton: 'Quiero la revisión manual →',
      oneTimePayment: '✓ Pago único',
      instantAccess: '✓ Acceso instantáneo',
      noSubscription: '✓ Sin suscripción',
      socialProof: '2,847 usuarios desbloquearon sus informes esta semana y',
      interviewIncrease: 'aumentaron su tasa de entrevistas 2x',
    },
    atsOverview: {
      title: 'Puntuación de Compatibilidad ATS',
      scoreOf100: '/ 100',
      beatingPercentile: 'Estás superando al {percentile}% de otros candidatos',
      eliteReady: 'Elite / Listo para Aplicar',
      visibilityGap: 'La Brecha de Visibilidad',
      criticalDanger: 'Peligro Crítico',
      topCriticalFailures: 'Principales Fallas Críticas',
      technicalVsHuman: 'Señal Técnica vs. Humana',
      technicalSignalDesc: 'Formato, fuentes, estructura — ¿puede el bot leerlo?',
      technicalSignal: 'Señal Técnica',
      humanSignal: 'Señal Humana',
      humanSignalDesc: 'Antigüedad, verbos de poder, impacto — ¿impresionante para humanos?',
      balanceNote: 'El equilibrio es clave: Un CV legible (bot) no es lo mismo que un CV que vende (humano). Necesitas ambos.',
      contactCheck: 'Verificación Rápida: Contacto y Redes',
      email: 'Email',
      phone: 'Teléfono',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      missing: 'Faltante',
      seniorityInference: 'Inferencia de Antigüedad',
      aiInference: 'Inferencia IA: Suenas como un',
      soundLikeSenior: 'Suena como un Arquitecto Senior',
      impactBreakdown: 'Desglose de Impacto',
      actionVerbs: 'Verbos de Acción',
      quantifiableMetrics: 'Métricas Cuantificables',
      targetMetrics: 'Objetivo: {number} métricas',
      softSkills: 'Habilidades Blandas',
    },
    forms: {
      companyName: 'Nombre de la Empresa',
      companyPlaceholder: 'ej., Acme Corp',
      jobTitle: 'Título del Trabajo',
      jobTitlePlaceholder: 'ej., Ingeniero Senior',
      jobUrl: 'URL de la Oferta de Trabajo',
      jobUrlOptional: '(Opcional)',
      jobUrlPlaceholder: 'https://...',
      jobDescription: 'Descripción del Trabajo',
      jobDescRecommended: '(Recomendado para Análisis IA)',
      jobDescPlaceholder: 'Pega la descripción del trabajo aquí para coincidencia de palabras clave con IA...',
      jobDescHint: 'Agrega la descripción del trabajo para obtener análisis instantáneo de brecha de palabras clave',
      cancel: 'Cancelar',
      addApplication: 'Agregar Aplicación',
      adding: 'Agregando...',
      addedSuccess: 'Aplicación agregada exitosamente',
      addedError: 'Error al agregar aplicación',
    },
    dialogs: {
      addNewApplication: 'Agregar Nueva Aplicación',
      sprintRequired: 'Sprint de Entrevistas Requerido',
      upgradeMessage: 'Actualiza para rastrear aplicaciones, obtener análisis de palabras clave y recibir alertas de ignoramiento.',
      upgradeNow: 'Actualizar Ahora',
      sprintRequiredError: 'Plan Sprint de Entrevistas requerido',
      upgradeForInsights: 'Actualiza para rastrear aplicaciones y obtener información con IA',
    },
    scoreCard: {
      resumeIs: 'Tu currículum está',
      ofBots: '{percentage} de los bots.',
      excellent: 'Excelente',
      needsOptimization: 'Necesita Optimización',
      criticalIssues: 'Problemas Críticos',
      excellentMessage: '¡Buen trabajo! Tu currículum está bien optimizado para sistemas ATS.',
      optimizationMessage: 'Encontramos algunos problemas que podrían estar causando rechazos. Vamos a corregirlos.',
      criticalMessage: 'Encontramos 3 errores críticos que podrían estar causando rechazo automático. Estos necesitan atención inmediata.',
      downloadReport: 'Descargar Informe',
      shareResults: 'Compartir Resultados',
    },
    keywordAnalysis: {
      title: 'Análisis de Palabras Clave',
      subtitle: 'Coincidencia semántica con descripciones de trabajo estándar.',
      matchRate: 'Tasa de Coincidencia',
      foundSignals: 'Señales Encontradas',
      total: 'Total',
      groupByType: 'Agrupar por Tipo',
      listView: 'Vista de Lista',
      gridView: 'Vista de Cuadrícula',
      missingCriticalSignals: 'Señales Críticas Faltantes',
      highImpact: 'Alto Impacto',
      fixingIncreases: 'Arreglar esto aumenta la puntuación en ~15%',
      viewExamples: 'Ver Ejemplos',
      autoAdd: 'Añadir Auto',
      industryKeywordFrequency: 'Frecuencia de Palabras Clave de la Industria',
      aiPowered: 'Impulsado por IA',
      showingExamples: 'Mostrando ejemplos para',
      viewHowTopCandidates: 'Ve cómo los mejores candidatos incorporan esta palabra clave de manera efectiva.',
      displayingFlatList: 'Mostrando en lista plana',
      keywordsOrganized: 'Palabras clave organizadas por categoría',
      switchedToView: 'Cambiado a',
      showingAllKeywords: 'Mostrando todas las palabras clave',
      groupedByType: 'Agrupado por tipo',
      noMissingSignals: 'Sin Señales Faltantes',
      excellentKeywordCoverage: '¡Buen trabajo! Tu currículum tiene una excelente cobertura de palabras clave.',
      matchType: 'Tipo de Coincidencia',
      exactMatch: 'Coincidencia Exacta',
      synonymMatch: 'Coincidencia de Sinónimo',
      semanticMatch: 'Coincidencia Semántica',
      foundInResume: 'Encontrado en currículum',
      clickToHide: 'Click para ocultar detalles',
      // Paywall content
      criticalSignalsLocked: 'Señales Críticas Bloqueadas',
      unlockFullAnalysis: 'Desbloquear Análisis Completo',
      unlockDescription: 'Desbloquea el análisis completo de keywords faltantes con impacto cuantificado, descripciones específicas, y recomendaciones de IA para aumentar tu score hasta +15%.',
      quantifiedImpact: 'impacto cuantificado',
      specificDescriptions: 'descripciones específicas',
      aiRecommendations: 'recomendaciones de IA',
      increaseScoreBy: 'para aumentar tu score hasta +15%',
      detailedImpactAnalysis: 'Análisis de impacto detallado (+2% por keyword)',
      impactPerKeyword: '+2% por keyword',
      specificForEachKeyword: 'Descripciones específicas para cada keyword',
      recommendedLocation: 'Ubicación recomendada en el CV',
      autoAddWithAI: 'Auto-Add con IA (Writing Forge)',
      unlockComplete: 'Desbloquear Análisis Completo',
      sevenDayPlan: 'Plan de 7 días • €24.99',
      keywordsMissingLocked: 'Keywords Faltantes Bloqueadas',
      unlockCompleteList: 'Desbloquea la lista completa de keywords críticas con impacto cuantificado (+15% score).',
      unlockButton: 'Desbloquear',
    },
    fluffDetector: {
      locked: 'Detector de Fluff Bloqueado',
      unlockPremium: 'Desbloquear Análisis Premium',
      description: 'Desbloquea la detección de fluff con IA para identificar frases débiles, logros sin cuantificar, y obtener reemplazos accionables.',
      weakPhraseAnalysis: 'Detección de frases débiles con contexto',
      quantifiedMetrics: 'Análisis de logros sin cuantificar',
      actionableReplacements: 'Reemplazos accionables con IA',
      unlockFluff: 'Desbloquear Detector de Fluff',
    },
    interviewPrep: {
      locked: 'Plan de Batalla de Entrevista Bloqueado',
      unlockBattlePlan: 'Desbloquear Prep de Entrevista',
      description: 'Genera preparación personalizada de entrevista con preguntas esperadas, historias STAR, y puntos de conversación estratégicos basados en tu CV y descripción del trabajo.',
      expectedQuestions: 'Preguntas de entrevista esperadas',
      starStories: 'Sugerencias de historias formato STAR',
      talkingPoints: 'Puntos de conversación estratégicos',
      unlockInterview: 'Desbloquear Plan de Batalla',
    },
    recruiterDM: {
      locked: 'Generador de DM para Recruiters Bloqueado',
      unlockDMGenerator: 'Desbloquear Generador de DM',
      description: 'Genera mensajes personalizados para recruiters con múltiples variaciones optimizadas con keywords de tu descripción del trabajo objetivo.',
      personalizedMessages: 'Mensajes personalizados para recruiters',
      multipleVariations: '3 variaciones por mensaje',
      keywordOptimized: 'Optimizado con keywords para tu rol objetivo',
      unlockRecruiter: 'Desbloquear Generador de DM',
    },
    conversionBanner: {
      currentBracket: 'Rango Actual',
      youAreInBracket: 'Estás en el',
      unlockSprint: 'Desbloquea el',
      sprintEngine: 'Motor Sprint',
      reach: 'para alcanzar',
      matchFaang: 'y coincidir con',
      instantly: 'instantáneamente',
      pointsBoost: 'puntos de aumento potencial',
      faangKeywords: 'palabras clave nivel FAANG',
      hourAccess: 'acceso de 24 horas',
      get24hPass: 'Obtener Pase Sprint de 24 Horas',
      oneTimePayment: 'Pago único',
      fixEverything: 'Arregla todo en 24 horas. Sin suscripción.',
      noSubscription: 'Sin suscripción',
      devsUpgraded: 'devs actualizaron esta semana',
      avgIncrease: 'Aumento promedio de puntuación',
      points: 'puntos',
    },
    atsSimulation: {
      seniorityMatch: 'Análisis de Coincidencia de Seniority',
      detectedLevel: 'Nivel Detectado',
      experienceAudit: 'Auditoría de Experiencia',
      signalDensity: 'Densidad de Señales',
      score: 'Puntuación',
      expected: 'Esperado',
      signals: 'señales',
      strength: 'Fuerza',
      junior: 'Junior',
      mid: 'Mid',
      senior: 'Senior',
      lead: 'Lead',
      match: 'Coincide',
      review: 'Revisar',
      year: 'año',
      years: 'años',
      strong: 'FUERTE',
      medium: 'MEDIA',
      weak: 'DÉBIL',
      readability: 'Legibilidad',
      highIntegrity: 'Alta Integridad',
      industryPatterns: 'La estructura sigue patrones estándar de la industria',
      imageTraps: 'Trampas de Imagen',
      safe: 'Seguro',
      noneDetected: 'Ninguno Detectado',
      noInvisibleElements: 'Sin elementos invisibles ni keyword stuffing',
      atsGlobalScore: 'Puntuación Global ATS',
      parsingEfficiency: 'Puntuación basada en eficiencia de análisis',
      liveAnalysis: 'Análisis en Vivo',
      fullReport: 'Informe Completo',
    },
    keywordSniper: {
      title: 'Herramienta Keyword Sniper',
      subtitle: 'Optimiza tus bullets con inyección de keywords potenciada por IA',
      noJobDescription: 'Sin Descripción de Trabajo Analizada',
      noJobDescriptionDesc: 'Keyword Sniper necesita una descripción de trabajo para analizar y extraer keywords faltantes.',
      howToUseTitle: 'Cómo usar Keyword Sniper:',
      howToStep1: 'Crea un proyecto con tu rol objetivo',
      howToStep2: 'Añade una aplicación de trabajo con la descripción',
      howToStep3: 'Analiza la descripción para extraer keywords',
      howToStep4: 'Vuelve aquí para obtener sugerencias de IA',
      backToDashboard: 'Volver al Panel',
      interviewSprintRequired: 'Interview Sprint Requerido',
      injectKeywordsDesc: 'Inyecta keywords faltantes en tus bullets con sugerencias de IA.',
      keywordInjection: 'Inyección de keywords',
      liveScoreTracking: 'Seguimiento de puntuación en vivo',
      priorityTargeting: 'Objetivo prioritario',
      contextAwareAI: 'IA consciente del contexto',
      upgradeToSprint: 'Actualizar a Interview Sprint',
      back: 'Atrás',
      targeting: 'Objetivo',
      currentResume: 'CV Actual',
      aiPremiumTools: 'Herramientas Premium IA',
      viewExamples: 'Ver Ejemplos',
      viewExamplesDesc: 'Ver ejemplos de nivel senior sobre cómo integrar keywords naturalmente',
      applyMetric: 'Aplicar Métrica',
      applyMetricDesc: 'Transforma bullets débiles en declaraciones de impacto cuantificadas',
      rewriteAll: 'Reescribir Todo',
      rewriteAllDesc: 'Motor de IA para reescribir tu CV completo a nivel senior+',
      battlePlan: 'Plan de Batalla',
      battlePlanDesc: 'Genera las preguntas más difíciles + respuestas estratégicas para entrevistas',
      suggestionApplied: '¡Sugerencia aplicada! Tu CV ha sido actualizado.',
      noMissingKeywords: 'No hay keywords faltantes para mostrar ejemplos',
      rewriteSuccess: '¡CV reescrito con éxito!',
      lockedTitle: 'Interview Sprint Requerido',
      lockedDesc: 'Desbloquea la Herramienta Keyword Sniper para inyectar keywords faltantes y mejorar tu puntuación ATS.',
      upgradeNow: 'Actualizar Ahora',
    },
    createProject: {
      title: 'Crear Nuevo Proyecto',
      subtitle: 'Configura tu campaña de búsqueda de empleo',
      projectName: 'Nombre del Proyecto',
      projectNamePlaceholder: 'ej. Búsqueda SWE Senior en Google',
      targetRole: 'Rol Objetivo',
      targetRolePlaceholder: 'ej. Ingeniero de Software Senior, Product Manager...',
      targetRoleHint: 'Escribe cualquier rol o selecciona de las sugerencias. Esto ayuda a la IA a ajustar las sugerencias del CV.',
      jobDescription: 'Descripción del Trabajo',
      optional: '(Opcional)',
      linkUrl: 'URL del Enlace',
      pasteText: 'Pegar Texto',
      urlPlaceholder: 'https://linkedin.com/jobs/view/...',
      textPlaceholder: 'Pega la descripción completa del trabajo aquí...',
      aiAnalysisTitle: 'Análisis de IA Habilitado',
      aiAnalysisDesc: 'Extraeremos keywords de la descripción para optimizar tu CV y calcular scores de coincidencia.',
      cancel: 'Cancelar',
      createButton: 'Crear Proyecto',
      creating: 'Creando...',
      successMessage: '¡Proyecto creado con éxito!',
      errorMessage: 'Error al crear el proyecto',
    },
    createApplication: {
      title: 'Agregar Nueva Solicitud',
      sprintRequired: 'Interview Sprint Requerido',
      upgradeDesc: 'Actualiza para rastrear solicitudes, obtener análisis de keywords y recibir alertas de ghosting.',
      upgradeNow: 'Actualizar Ahora',
      companyName: 'Nombre de la Empresa',
      companyPlaceholder: 'ej., Acme Corp',
      jobTitle: 'Título del Puesto',
      jobTitlePlaceholder: 'ej., Ingeniero Senior',
      jobUrl: 'URL de la Oferta de Trabajo',
      optional: '(Opcional)',
      urlPlaceholder: 'https://...',
      jobDescription: 'Descripción del Trabajo',
      recommendedAI: '(Recomendado para Análisis de IA)',
      descriptionPlaceholder: 'Pega la descripción del trabajo aquí para coincidencia de keywords con IA...',
      cancel: 'Cancelar',
      addApplication: 'Agregar Solicitud',
      adding: 'Agregando...',
      planRequired: 'Plan Interview Sprint requerido',
      planRequiredDesc: 'Actualiza para rastrear solicitudes y obtener insights con IA',
      successMessage: 'Solicitud agregada con éxito',
      errorMessage: 'Error al agregar la solicitud',
      featureRestricted: 'Esta función solo está disponible con una suscripción activa de Interview Sprint',
    },
    missionControl: {
      title: 'Control de Misión',
      welcomeBack: 'Bienvenido de nuevo',
      eliminateBugs: 'Elimina errores hasta alcanzar el 95% de visibilidad.',
      newApplication: 'Nueva Solicitud',
      visibilityScore: 'Puntuación de Visibilidad',
      howRecruitersFind: 'Cómo los reclutadores encuentran tu CV',
      activeApplications: 'Solicitudes Activas',
      interviewsScheduled: 'entrevistas programadas',
      missingSignals: 'Señales Faltantes',
      critical: 'CRÍTICO',
      impactingMatchScore: 'Impactando puntuación de coincidencia en',
      robotViewTitle: 'Vista Robot: Lo que ATS Realmente Lee',
      robotViewSubtitle: '¿Falta información crítica en tu CV?',
      uploadToSeeExtraction: 'Sube un CV para ver la extracción de texto sin procesar',
      missingKeywords: 'Faltantes',
      allKeywordsDetected: 'Todas las palabras clave críticas detectadas',
      needPoints: 'Necesitas',
      reachEliteTier: 'puntos para alcanzar el nivel ELITE',
      viewFullReport: 'Ver Informe Completo',
      uploadResume: 'Subir CV',
      careerHealth: 'Salud Profesional',
      elite: 'ELITE',
      pro: 'PRO',
      rising: 'RISING',
      starter: 'STARTER',
      progressToElite: 'Progreso a ELITE (85%+)',
      cvScore: 'Puntuación CV',
      applications: 'Solicitudes',
      interviews: 'Entrevistas',
      applicationKanban: 'Kanban de Solicitudes',
      viewAll: 'VER TODO',
      applied: 'Aplicado',
      noApplicationsYet: 'Aún no hay solicitudes',
      position: 'Posición',
      company: 'Empresa',
      recent: 'Reciente',
      interviewing: 'Entrevistando',
      noInterviewsYet: 'Aún no hay entrevistas',
      inProgress: 'En Progreso',
      accepted: 'Aceptado',
      noOffersYet: 'Aún no hay ofertas',
      topErrors: 'Principales Errores',
      noCVLoaded: 'No hay CV cargado',
      consoleBash: 'consola — bash',
      noCriticalErrors: 'No se detectaron errores críticos',
      allSystemsOperational: 'Todos los sistemas operativos',
      debugMasterCV: 'DEBUG MASTER CV',
      missingKeyword: 'Palabra clave faltante',
      matchScoreImpact: 'impacto en match_score:',
      dateFormatInconsistency: 'Inconsistencia de formato de fecha encontrada',
      atExperienceBlock: 'en Experience.block (Línea 42)',
    },
    atsReport: {
      missingSignals: 'Señales Faltantes',
      critical: 'CRÍTICO',
      important: 'IMPORTANTE',
      niceToHave: 'DESEABLE',
      fix: 'Arreglar',
      invisibleToBot: 'Invisible para el Bot',
      atsWillReject: '⚠️ El ATS te descartará automáticamente',
      needsOptimization: 'Necesitas optimizar tu CV ANTES de aplicar',
      readyToApply: 'Listo para Aplicar',
      context: 'Contexto',
      offerRequires: 'La oferta requiere',
      youNeedToAdd: 'Necesitas añadir esta habilidad',
      missingThisToken: 'pero tu CV solo menciona',
      addSignalsOf: 'Necesitas añadir señales de',
      upgrade: 'Actualizar',
      percentInvisible: '% Invisible para el Bot',
      needsOptimizationBefore: 'Necesita optimización ANTES de aplicar',
    },
    projectsView: {
      searchPlaceholder: 'Buscar proyectos, etiquetas...',
      uploadNewMasterCV: 'Cargar Nuevo CV Maestro',
      allProjects: 'Todos los Proyectos',
      highMatch: 'Alta Coincidencia',
      needsReview: 'Necesita Revisión',
      archived: 'Archivado',
      sortBy: 'Ordenar por:',
      lastUpdated: 'Última Actualización',
      loadingProjects: 'Cargando proyectos...',
      noProjectsYet: 'Aún no hay proyectos',
      noProjectsDesc: 'Crea tu primer proyecto para comenzar a rastrear solicitudes y optimizar tu CV.',
      createFirstProject: 'Crear Tu Primer Proyecto',
      matchScore: 'Puntuación de Coincidencia',
      stable: 'Estable',
      missingData: 'Datos Faltantes',
      highPriority: 'Alta Prioridad',
      strong: 'Fuerte',
      moderate: 'Moderado',
      low: 'Bajo',
      hoursAgo: 'h atrás',
      daysAgo: 'd atrás',
      weeksAgo: 's atrás',
      openProjectBoard: 'Abrir Panel de Proyecto',
      createNewProject: 'Crear Nuevo Proyecto',
      createNewProjectDesc: 'Inicia una nueva misión o carga un CV para analizar.',
    },
    resumeGrid: {
      loadingResumes: 'Cargando tus currículums...',
      analyzing: 'Analizando...',
      error: 'Error',
      excellent: 'Excelente',
      moderate: 'Moderado',
      critical: 'Crítico',
      noResumesFound: 'No se encontraron currículums',
      noResumesDesc: 'Sube tu currículum para obtener una puntuación ATS instantánea y retroalimentación impulsada por IA.',
      uploadResume: 'Subir Currículum',
      createManually: 'Crear Manualmente',
      createProject: 'Crear Proyecto',
      searchPlaceholder: 'Buscar currículums por nombre, habilidad o ID...',
      listView: 'Vista de Lista',
      gridView: 'Vista de Cuadrícula',
      resumeName: 'Nombre del Currículum',
      uploadDate: 'Fecha de Carga',
      lastAnalyzed: 'Último Análisis',
      healthScore: 'Puntuación de Salud',
      actions: 'Acciones',
      viewDetails: 'Ver Detalles',
      reAnalyze: 'Re-Analizar',
      delete: 'Eliminar',
      justNow: 'Justo ahora',
      showing: 'Mostrando',
      to: 'a',
      of: 'de',
      results: 'resultados',
      previous: 'Anterior',
      next: 'Siguiente',
      noSearchResults: 'No se encontraron currículums que coincidan con tu búsqueda.',
    },
    aiFeedback: {
      rateResponse: 'Calificar respuesta',
      howHelpful: '¿Qué tan útil fue esta respuesta?',
      feedbackHelps: 'Tu opinión nos ayuda a mejorar nuestra IA.',
      helpful: 'Útil',
      okay: 'Regular',
      notHelpful: 'No útil',
      additionalComments: 'Comentarios adicionales (opcional)...',
      submitFeedback: 'Enviar opinión',
      thankYou: '¡Gracias por tu opinión!',
      wasHelpful: '¿Fue útil esta respuesta?',
      yes: 'Sí',
      somewhat: 'Un poco',
      no: 'No',
      tellMore: 'Cuéntanos más (opcional)...',
      submit: 'Enviar',
      selectRating: 'Por favor selecciona una calificación',
      feedbackSubmitted: '¡Gracias! Opinión enviada.',
      submitError: 'Error al enviar opinión. Inténtalo de nuevo.',
    },
    eliteMatchTool: {
      title: 'Elite Match Tool',
      subtitle: 'Analiza tu CV contra cualquier oferta con precisión ML local. Identifica gaps y optimiza para ATS instantáneamente.',
      urlLabel: 'URL de LinkedIn (Recomendado)',
      urlPlaceholder: 'https://www.linkedin.com/jobs/view/...',
      urlHelp: 'Pega el link directo de la oferta de LinkedIn para mejores resultados de extracción.',
      textLabel: 'Pega la Descripción del Trabajo',
      textPlaceholder: 'Sobre el rol:\nBuscamos un Senior Full Stack Developer con 5+ años de experiencia...\n\nRequisitos:\n- Experiencia sólida con React y Node.js\n- Experiencia con Kubernetes y AWS',
      textHelp: 'Copia y pega la descripción completa del trabajo de cualquier portal.',
      analyzeButton: 'Analizar Puntuación de Coincidencia',
      featureExtraction: 'Extracción de Entidades',
      featureExtractionDesc: 'No solo palabras clave: extraemos Hard Skills, Soft Skills y Métricas de Industria con comprensión semántica profunda.',
      gapAnalysis: 'Análisis de Gaps',
      gapAnalysisDesc: 'Identificamos EXACTAMENTE qué señales faltan en tu perfil para pasar los filtros ATS de alto riesgo.',
      autoFix: 'Auto-Fix con IA',
      autoFixDesc: 'Reescritura con IA de un clic que integra inteligentemente las señales faltantes en tu narrativa de CV existente.',
    sprint7dBeforePrice: '€49.99',
      premiumFeatures: '• Extracción de entidades con TF-IDF & Cosine Similarity\\n• Gap analysis crítico/importante/nice-to-have\\n• Robot View con zonas rojas/verdes\\n• Auto-Fix suggestions específicas',
      scoreTitle: 'Puntuación de Coincidencia',
      scoreExcellent: 'Excelente match! Aplica con confianza.',
      scoreGood: 'Buen match, pero hay gaps importantes.',
      scoreNeedsWork: 'Necesitas mejorar tu CV para esta oferta.',
      missingCritical: 'Señales Críticas Faltantes',
      matchedSkills: 'Habilidades Coincidentes',
      robotViewTitle: 'Robot View',
      redZones: 'Red Zones',
      greenZones: 'Green Zones',
      recommendations: 'Auto-Fix Recommendations',
      analyzeAnother: 'Analyze Another Job',
      applyFix: 'Apply Auto-Fix',
      applyFixSuccess: 'Auto-Fix suggestions copied! Navigate to Edit tab to apply changes.',
      analyzingStep1: 'Extracting Recruiter Intent...',
      analyzingStep2: 'Analyzing Hard Skills Requirements...',
      analyzingStep3: 'Detecting Soft Skills Signals...',
      analyzingStep4: 'Generating Missing Signals Report...',
      errorAnalyzing: 'Error al analizar el match: ',
      errorUnknown: 'Error desconocido',
    },
    ecosystem: {
      copyPasteTip: {
        badge: 'GRATIS',
        title: '💡 Pro Tip: Copia desde LinkedIn',
        description: 'Ve a un job posting en LinkedIn → Selecciona todo el texto → Ctrl+C → Pégalo en \'Add Job Description\'. Automático, sin extensiones.',
        actionLabel: 'Entendido',
        successMessage: '¡Perfecto! Usa Ctrl+C en cualquier job posting.',
      },
      linkedinReminder: {
        badge: 'GRATIS',
        title: '🔗 Recordatorio: Actualiza LinkedIn',
        description: 'Tu CV está en {score}%. 89% de reclutadores buscan en LinkedIn antes de llamar. Copia las mejoras de tu CV a tu perfil de LinkedIn.',
        actionLabel: 'Ir a LinkedIn',
      },
      keyboardShortcuts: {
        badge: 'GRATIS',
        title: '⌨️ Atajos de Teclado',
        description: 'Ctrl+V para pegar job description rápido. Esc para cerrar modales. Trabaja más rápido sin salir del teclado.',
        actionLabel: 'Ver Más Atajos',
        infoMessage: 'Atajos: Ctrl+V (pegar JD), Esc (cerrar), Tab (navegar)',
      },
      dismissLabel: 'No me interesa',
      freeLabel: '100% GRATIS',
      bookmarklet: {
        title: 'Instalación del Scanner (1 minuto)',
        step1Title: 'Copia el bookmarklet',
        step1Copy: 'Copiar Bookmarklet',
        step1Copied: '¡Copiado!',
        step2Title: 'Crea un marcador',
        step2Instructions: [
          'Haz clic derecho en la barra de marcadores',
          'Selecciona "Agregar página"',
          'Nombre: "Job Scanner"',
          'URL: Pega el código copiado'
        ],
        step3Title: 'Úsalo en cualquier sitio',
        step3Description: 'Ve a LinkedIn, Indeed, o cualquier job posting → Haz clic en el marcador "Job Scanner" → Se extraerá el texto → Pégalo en tu analizador de CV',
        proTip: 'Funciona en CUALQUIER página web. LinkedIn, Indeed, Glassdoor, empresa X...',
        successCopied: '¡Bookmarklet copiado! Ahora arrástralo a tu barra de marcadores.',
        openingChecklist: 'Abriendo checklist de LinkedIn...',
        comingSoon: 'Función próximamente: Analizador de emails de reclutadores',
      },
    },
  },
  'fr': {
    hero: {
      title: 'Arrêtez de vous demander pourquoi on vous ignore.',
      subtitle: 'Déboguez les bugs invisibles de votre CV et obtenez des entretiens en 7 jours.',
      ctaPrimary: 'Voir Vue Robot - Gratuit',
      ctaSecondary: 'S\'inscrire pour Accès Complet',
      trustIndicator: 'Sans carte • Sans inscription • Résultats instantanés en 10 secondes',
    },
    features: {
      robotView: 'Terminal Vue Robot',
      keywordGap: 'Détecteur de Signaux Manquants',
      seniorityMatch: 'Audit de Niveau Senior',
      instantScan: 'Score ATS Instantané',
    },
    pricing: {
      free: 'Scan Gratuit',
      pass24h: 'Pass 24 Heures',
      sprint7d: 'Sprint 7 Jours',
      currency: '€',
      enterprise: {
        badge: 'Entreprise',
        title: 'Développez Votre Recrutement',
        subtitle: 'Sans Compromis',
        description: 'Conçu pour les équipes de recrutement qui traitent des milliers de candidatures. Bénéficiez de remises sur volume, d\'un support dédié et d\'intégrations personnalisées.',
        contactSales: 'Contacter les Ventes',
        viewPricing: 'Voir les Tarifs',
        feature1: 'Gestion d\'Équipe',
        feature1Desc: 'Tableau de bord centralisé pour les équipes RH pour suivre toutes les candidatures',
        feature2: 'Conformité SOC 2',
        feature2Desc: 'Sécurité de niveau entreprise avec SSO et contrôle d\'accès basé sur les rôles',
        feature3: 'Accès API',
        feature3Desc: 'Intégrez le scan ATS directement dans votre flux de travail de recrutement',
      },
    },
    pricingLanding: {
      title: 'Tarifs Simples',
      subtitle: 'Payez une fois. Corrigez pour toujours. Sans abonnements.',
      freeTitle: 'FREE Debug',
      freeSubtitle: 'Découvrez quels mots-clés le robot NE voit PAS',
      freeScanButton: 'Scanner Gratuitement',
      freeFeature1: 'Détection d\'Invisibilité (2 mots-clés)',
      freeFeature2: 'Score ATS Global',
      freeFeature3: 'Vue Robot (verrouillée)',
      freeFeature4: 'Aperçu Correspondance Séniorité',
      freeGuarantee: '✓ MODÈLE LISIBLE GARANTI',
      singleDebugBadge: 'RÉPARER EN UNE FOIS',
      singleDebugTitle: 'Correction Rapide',
      singleDebugSubtitle: 'Réparez votre CV pour le prix d\'un café',
      singleDebugButton: 'Réparer Mon CV →',
      singleDebugFeature1: '1 Scan Profond Complet',
      singleDebugFeature2: 'Vue Robot Déverrouillée',
      singleDebugFeature3: '1 Optimisation IA (Réécriture)',
      singleDebugFeature4: 'Injection Auto de Mots-clés',
      singleDebugFeature5: 'Exporter CV Optimisé',
      singleDebugGuarantee: '✓ MODÈLE LISIBLE GARANTI',
      pass24hBadge: 'CORRECTIF RAPIDE / URGENT',
      pass24hTitle: 'Pass 24h',
      pass24hSubtitle: 'Debug Immédiat pour l\'entretien de demain',
      pass24hButton: 'Accès 24h →',
      pass24hFeature1: 'Scans Illimités (24h)',
      pass24hFeature2: 'Vue Rayon X Robot Complète',
      pass24hFeature3: 'Étiquettes [ERREUR] + [AVERT] + Corrections',
      pass24hFeature4: 'Détecteur d\'Écart de Mots-clés',
      pass24hFeature5: 'Générateur de Lettre de Motivation',
      pass24hFeature6: 'Modèle 100% Lisible par ATS',
      pass24hGuarantee: '✓ GARANTI',
      sprint7dBadge: 'INTENSIF / RECOMMANDÉ',
      sprint7dTitle: 'Sprint 7 Jours',
      sprint7dSubtitle: 'Mode Bête. Attaque totale de 7 jours',
      sprint7dBeforePrice: '€49.99',
      sprint7dButton: 'Commencer Sprint 7 Jours →',
      sprint7dFeature1: 'Scans Illimités (7 jours)',
      sprint7dFeature2: 'Sélecteur d\'Industrie (FAANG/Finance)',
      sprint7dFeature3: 'Élévateur de Ton (Réécriture IA)',
      sprint7dFeature4: 'Plan de Bataille d\'Entretiens',
      sprint7dFeature5: 'Scripts de DM pour Recruteurs',
      sprint7dFeature6: 'Lettre de Motivation + Optimiseur LinkedIn',
      sprint7dGuarantee: '✓ MODÈLE 100% LISIBLE GARANTI',
    },
    pricingDialog: {
      quickFix: 'Solution Rapide',
      pass24h: 'Pass 24h',
      price24h: '€14.99',
      access24h: 'accès 24 heures',
      unlimitedScans24h: 'Scans Illimités (24h)',
      fullErrorReport: 'Rapport Complet d\'[ERREURS]',
      robotXRayView: 'Vue Rayons X du Robot',
      keywordOptimizer: 'Optimiseur de Mots-clés',
      battlePlanGenerator: 'Générateur de Plan de Bataille',
      get24hPass: 'Obtenir Pass 24h',
      sprint7d: 'Sprint 7 Jours',
      price7d: '€39.99',
      access7d: 'accès 7 jours',
      unlimitedScans7d: 'Scans Illimités (7 Jours)',
      recommended: 'RECOMMANDÉ',
      tryFree: 'Essayer Gratuitement',
      noThanksJust24h: 'Non merci, juste Pass 24h',
      title: 'Tarification Simple et Transparente',
      subtitle: 'Paiements uniques pour des résultats professionnels. Pas d\'abonnements récurrents ni de frais cachés.',
      start7DaySprint: 'Commencer Sprint 7 Jours 🚀',
      secureCheckout: 'Paiement Sécurisé Crypté 256 bits',
      // Upsell section
      waitBeforeCheckout: '⚠️ ATTENDEZ! Avant de payer...',
      applyingToOneJob: 'Postulez-vous pour UN SEUL Emploi?',
      justMoreGetSprint: 'Pour seulement €10 de plus, obtenez l\'Interview Sprint.',
      whyUpgrade: 'Pourquoi mettre à niveau?',
      save60: 'Économisez 60%',
      unlimitedScansNotOne: 'Scans illimités pendant 7 jours (pas un seul)',
      aiCoverLetters: 'Lettres de motivation générées par IA pour chaque candidature',
      linkedinOptimization: 'Optimisation du profil LinkedIn incluse',
      candidatesChoseSprint: '1,200+ candidats ont choisi Interview Sprint et ont décroché des postes chez:',
      upgradeToSprint: 'Oui, passer au Sprint (€24.99) 🚀',
      // More hardcoded strings
      scorePreview: 'Aperçu du Score',
      errorLabels: 'Étiquettes [ERREUR]',
      topKeywords: 'Top 2 Mots-Clés',
      bestValue: 'MEILLEUR RAPPORT',
      sevenDaySprint: 'Sprint de 7 Jours',
      sevenDaysAccess: '7 jours d\'accès complet',
      unlimitedCVScans: 'Scans de CV Illimités (7j)',
      robotViewTerminal: 'Terminal Vue Robot',
      missingSignalsDetector: 'Détecteur de Signaux Manquants',
      seniorityMatchAudit: 'Audit de Correspondance d\'Expérience',
      industrySelectorFAANG: 'Sélecteur d\'Industrie (FAANG/Finance)',
      bulletToneElevator: 'Améliorateur de Ton des Puces',
      bonusExtras: 'Extras Bonus:',
      coverLetterGen: 'Générateur de Lettres',
      linkedinOptimizer: 'Optimiseur LinkedIn',
      devsJoined: '1,200+ développeurs ont rejoint',
      sprintTestimonial: '"Sprint m\'a aidé à corriger des bugs et décrocher 5 entretiens en 1 semaine"',
      fastStart: 'DÉMARRAGE RAPIDE',
      loginToPurchase: 'Connectez-vous pour acheter des crédits',
      checkoutFailed: 'Échec du démarrage du paiement',
      checkoutError: 'Échec de l\'initialisation du paiement',
    },
    dashboard: {
      welcome: 'Bon retour',
      uploadCv: 'Téléchargez votre CV',
      analyzing: 'Analyse de votre CV...',
      score: 'Score ATS',
      issues: 'Problèmes Trouvés',
      signIn: 'Se Connecter',
      continueDashboard: 'Continuer vers le Tableau de Bord',
      welcomeBack: 'Bon retour',
      uploadMasterCv: 'Téléchargez votre CV Principal',
      uploadToStart: 'Téléchargez votre CV pour commencer',
      noKeywordsYet: 'Pas encore de mots-clés',
      noResumeFound: 'Aucun CV Trouvé',
      uploadToSeeATS: 'Téléchargez un CV pour voir comment les robots ATS interprètent votre document.',
      uploadToSeeText: 'Téléchargez un CV pour voir l\'extraction de texte brut',
      resumeEditor: 'Éditeur de CV',
      downloadAsTxt: 'Télécharger en .txt',
      noResumeLoaded: 'Aucun CV chargé. Téléchargez un CV depuis le tableau de bord pour commencer l\'édition.',
      uploadToGetStarted: 'Téléchargez un CV pour commencer',
      masterCvs: 'CVs Principaux',
      tools: 'Outils IA',
      applications: 'Candidatures',
      match: 'Elite Match',
      missionControl: 'Centre de Contrôle',
      keywordSniper: 'Sniper de Mots-Clés',
      writingForge: 'Forge d\'Écriture',
      bulletRewriter: 'Réécriture de Puces',
      coverLetterGen: 'Lettre de Motivation',
      linkedinOptimizer: 'Optimiseur LinkedIn',
      upgradeToFix: 'Mettre à Niveau pour Corriger',
      aiRewrite: 'Réécriture IA',
      addJob: 'Ajouter Emploi',
      toolsMenu: 'Outils',
      visibilityDebugger: 'Débogueur de Visibilité',
      autoRejectDetected: 'AUTO-REJET DÉTECTÉ',
      criticalError: 'ERREUR CRITIQUE',
      // Success Insights
      successInsights: 'Insights de Succès',
      personalizedAnalytics: 'Analyses personnalisées bientôt disponibles',
      trackApplicationsToUnlock: 'Suivez 3+ candidatures et obtenez votre premier entretien pour débloquer des insights personnalisés',
      personalDataMoat: 'Votre avantage de données personnelles vous attend',
      yourPersonalDataAdvantage: 'Votre avantage de données personnelles',
      moat: 'AVANTAGE',
      vsAverage: 'vs moyenne',
      successRateLabel: 'taux de succès',
      applicationsCount: 'Candidatures',
      interviewsCount: 'Entretiens',
      topPerformingKeywords: 'Mots-Clés les Plus Performants',
      dataUniqueToYou: '🔒 Ces données sont uniques à vous et ne peuvent être répliquées par les concurrents',
    },
    resumeDetail: {
      linkedinUpsellTitle: 'CV Optimisé → LinkedIn est le Suivant',
      linkedinUpsellDescription: 'Votre CV est prêt (Score: {score}%). 89% des recruteurs consultent LinkedIn avant de contacter. Ne perdez pas d\'opportunités à cause d\'un profil obsolète.',
      optimizeLinkedIn: 'Optimiser LinkedIn Maintenant',
      maybeLater: 'Plus Tard',
      checkLinkedIn: 'consultent LinkedIn',
      moreCallbacks: 'plus de rappels',
      zeroMetricsTitle: 'ZÉRO MÉTRIQUE = AUTO-REJET',
      businessImpact: 'IMPACT COMMERCIAL:',
      atsAutoReject: 'des systèmes ATS rejettent automatiquement les CV sans chiffres',
      recruitersSpend6Seconds: 'Les recruteurs passent 6 secondes - les métriques attirent l\'attention instantanément',
      higherCallbackRate: 'taux de rappel plus élevé quand il y a des réalisations quantifiables',
      immediateFix: 'CORRECTION IMMÉDIATE:',
      increasedSales: 'Augmentation des ventes de',
      reducedCosts: 'Réduction des coûts de',
      ledTeam: 'Direction d\'une équipe de',
      editTab: 'Éditer',
      robotView: 'Vue Robot',
      progressTab: 'Progrès',
      actionPlanTab: 'Plan d\'Action',
      interviewTab: 'Entretien',
      recruiterTab: 'Recruteur',
      apply: 'Appliquer',
      optimizing: 'Optimisation...',
      reanalyze: 'Ré-analyser',
      cancel: 'Annuler',
    },
    previewScan: {
      title: 'Scan Diagnostique Approfondi',
      subtitle: 'Voyez exactement comment les systèmes ATS analysent votre CV - sans inscription',
      dropHere: 'Déposez votre CV ici',
      orBrowse: 'ou cliquez pour parcourir les fichiers',
      supports: 'Supporte PDF, Word et Images',
      addJobDesc: 'Ajouter la description du poste cible pour une meilleure correspondance (optionnel)',
      targetJobPosition: 'Poste Cible',
      jobDescPlaceholder: 'Collez ici la description complète du poste...',
      jobDescAdded: 'Description du poste ajoutée - améliorera l\'analyse des mots-clés',
    },
    nav: {
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      login: 'Connexion',
      logIn: 'Se Connecter',
      signUp: 'S\'inscrire',
      dashboard: 'Tableau de Bord',
      blog: 'Blog',
      product: 'Produit',
    },
    buttons: {
      uploadResume: 'Télécharger CV',
      uploadNewCv: 'Télécharger Nouveau CV',
      tryFree: 'Essayer Gratuitement',
      getSingleScan: 'Obtenir un Scan Unique',
      startSprint: 'Démarrer le Sprint',
      checkMyResume: 'Vérifier Mon CV',
      seeHowItWorks: 'Voir Comment Ça Marche',
      viewFullReport: 'Voir le Rapport Complet',
      managePlan: 'Gérer le Plan',
      upgradeNow: 'Mettre à Niveau',
      buyMoreCredits: 'Acheter Plus de Crédits',
      launchTool: 'Lancer l\'Outil',
    },
    navbar: {
      analyzer: 'Analyseur',
      tools: 'Outils',
      pricing: 'Tarifs',
      dashboard: 'Tableau de Bord',
      login: 'Se connecter',
      scanResume: 'Scanner CV',
      scan: 'Scanner',
    },
    auth: {
      loading: 'Initialisation de la session...',
      analyzing: 'ANALYSE_STRUCTURE...',
      parsing: 'ANALYSE_MOTS_CLÉS...',
      optimizing: 'OPTIMISATION_SCORE_ATS...',
      headline: 'Déboguez votre parcours professionnel avec précision.',
      subtitle: 'Rejoignez des milliers de chercheurs d\'emploi qui ont optimisé leurs CV avec une analyse basée sur l\'IA et ont décroché l\'emploi de leurs rêves.',
      initSession: 'Initialiser la Session',
      enterCredentials: 'Entrez vos identifiants pour accéder à la console',
      signIn: 'Se Connecter',
      signUp: 'S\'inscrire',
      noAccount: 'Pas de compte?',
      haveAccount: 'Vous avez déjà un compte?',
      deployNew: '[Créer nouveau profil]',
      signInLink: '[Se connecter]',
      version: 'v2.4.0-stable',
      systemStatus: 'Système Opérationnel',
      blueprintTitle: 'Déboguez Votre CV comme un Pro',
      blueprintSubtitle: 'Rejoignez des milliers de chercheurs d\'emploi qui ont optimisé leurs CVs avec des insights alimentés par l\'IA et ont décroché leurs emplois de rêve.',
      blueprintDescription: 'Rejoignez des milliers de chercheurs d\'emploi qui ont optimisé leurs CVs avec des insights alimentés par l\'IA et ont décroché leurs emplois de rêve.',
      feature1Title: 'Vision Robot ATS',
      feature1Desc: 'Voyez exactement ce que voient les systèmes des recruteurs',
      feature2Title: 'Analyse Alimentée par l\'IA',
      feature2Desc: 'Obtenez des retours instantanés sur les mots-clés, le format et l\'impact',
      feature3Title: 'Suivi des Candidatures',
      feature3Desc: 'Gérez votre recherche d\'emploi en un seul endroit',
      termsAgreement: 'En continuant, vous acceptez nos Conditions de Service et Politique de Confidentialité',
      atsVision: 'Vision ATS Robot',
      atsVisionDesc: 'Voyez exactement ce que voient les systèmes de recruteurs',
      aiAnalysis: 'Analyse Alimentée par IA',
      aiAnalysisDesc: 'Recevez des commentaires instantanés sur les mots-clés, le format et l\'impact',
      trackApps: 'Suivi des Candidatures',
      trackAppsDesc: 'Gérez votre recherche d\'emploi en un seul endroit',
    },
    sidebar: {
      home: 'Accueil',
      myResumes: 'Mes CVs',
      aiTools: 'Outils IA',
      eliteMatch: 'Match Elite',
      settings: 'Paramètres',
      adminPanel: 'Panneau Admin',
      sprintActive: 'Sprint Actif',
      days: 'JOURS',
      hours: 'HRS',
      minutes: 'MIN',
      managePlan: 'Gérer le Plan',
      upgradeNow: 'Mettre à Niveau',
      proPlan: 'Plan Pro',
      freePlan: 'Plan Gratuit',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      landingPage: 'Page d\'Accueil',
      signOut: 'Se Déconnecter',
      upload: 'Télécharger',
      download: 'Télécharger',
      edit: 'Modifier',
    },
    showcase: {
      badge: 'Scanner ATS Gratuit',
      heading: 'Battez les Systèmes ATS',
      subheading: 'En 10 Secondes',
      description: 'Voyez votre CV comme les robots le voient. Obtenez des retours instantanés et décrochez plus d\'entretiens.',
      robotTech: 'Technologie Vue Robot',
      robotDesc: 'Voyez exactement ce que voient les robots ATS - sans deviner',
      instantScore: 'Score ATS Instantané',
      instantDesc: 'Obtenez votre score de compatibilité en 10 secondes',
      smartKeyword: 'Analyse Intelligente des Mots-Clés',
      smartDesc: 'Correspondance alimentée par l\'IA avec les descriptions de poste',
      enterpriseSec: 'Sécurité Entreprise',
      enterpriseDesc: 'Vos données restent privées et sécurisées',
      ctaBanner: 'Obtenez Votre Score ATS Gratuit',
      ctaSubtext: 'Scannez votre CV en 10 secondes - sans inscription',
      ctaButton: 'Essayez le Scan Gratuit →',
    },
    comparison: {
      badge: 'Vérification de Réalité',
      heading: 'Ce que vous voyez vs. Ce qu\'ils voient',
      description: 'La plupart des modèles de CV modernes sont magnifiques pour les humains mais sont un cauchemar pour les robots. Les colonnes, icônes et graphiques cassent souvent la logique d\'analyse.',
      humanView: 'Vue Humaine (PDF)',
      robotView: 'Vue Robot (Analysé)',
    },
    footer: {
      description: 'Battez les systèmes ATS avec l\'optimisation de CV alimentée par l\'IA. Soyez embauché plus rapidement.',
      product: 'Produit',
      pricing: 'Tarifs',
      freeScanner: 'Scanner Gratuit',
      blog: 'Blog',
      resources: 'Ressources',
      aboutUs: 'À Propos',
      contactUs: 'Contactez-nous',
      legal: 'Légal',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions Générales',
      copyright: '© 2026 CVDebug Inc. Tous droits réservés. État du Système:',
      systemStatus: 'État du Système:',
      online: 'En Ligne',
    },
    landing: {
      nav: {
        features: 'Fonctionnalités',
        pricing: 'Tarifs',
        login: 'Se connecter',
        signUp: 'S\'inscrire',
      },
      hero: {
        title: 'Déboguez Votre CV Comme un Pro',
        subtitle: 'Arrêtez d\'être rejeté. Voyez exactement ce que les systèmes ATS voient et corrigez-le en quelques minutes.',
        startButton: 'Commencer le Scan Gratuit',
        viewDemo: 'Voir la Démo',
      },
      socialProof: {
        trustedBy: 'Approuvé par les chercheurs d\'emploi chez',
      },
      stats: {
        stat1: 'Plus de 50 000 CVs analysés',
        stat2: '89% de taux d\'entretien supérieur',
        stat3: 'Scan en 10 secondes',
        stat4: 'Sécurité de niveau entreprise',
      },
      cta: {
        badge: 'Commencer',
        heading: 'Prêt à décrocher l\'emploi de vos rêves?',
        description: 'Rejoignez des milliers de chercheurs d\'emploi qui ont amélioré leurs CVs avec CVDebug.',
        buttonText: 'Commencer le Scan Gratuit Maintenant',
        footerText: 'Aucune carte de crédit requise',
        secondary: 'Vous avez encore des questions? Essayez notre scanner ATS gratuit maintenant',
        button: 'Scannez Votre CV Gratuitement →',
      },
      faq: {
        heading: 'Foire Aux Questions',
        question1: 'Qu\'est-ce qu\'un système ATS?',
        answer1: 'ATS (Applicant Tracking System) est un logiciel que les entreprises utilisent pour filtrer les CVs avant qu\'ils n\'atteignent les recruteurs humains. La plupart des grandes entreprises utilisent ATS, et il peut rejeter jusqu\'à 75% des CVs.',
        question2: 'Comment CVDebug m\'aide-t-il?',
        answer2: 'CVDebug vous montre exactement comment les systèmes ATS analysent votre CV, identifie les mots-clés manquants et fournit des recommandations pour améliorer votre score ATS.',
        question3: 'Mes données sont-elles sécurisées?',
        answer3: 'Oui! Nous utilisons un cryptage de niveau entreprise et ne partageons jamais vos données avec des tiers. Votre CV est traité en toute sécurité et supprimé après analyse, sauf si vous le sauvegardez.',
        stillHaveQuestions: 'Vous avez encore des questions? Essayez notre scanner ATS gratuit maintenant',
        tryFreeScan: 'Scannez Votre CV Gratuitement →',
      },
      testimonials: {
        badge: 'Mur d\'Amour Reddit',
        heading: 'Approuvé par les Redditors du Monde Entier',
        subheading: 'Retours réels de r/resumes, r/developersIndia, r/cscareerquestions, et plus.',
        subtitle: 'Retours réels de r/resumes, r/developersIndia, r/cscareerquestions, et plus.',
        joinThousands: 'Rejoignez des milliers de chercheurs d\'emploi optimisant leurs CVs',
        subreddits: 'r/resumes, r/developersIndia, r/cscareerquestions, r/ProductManagement, r/datascience',
      },
      enterprise: {
        badge: 'Entreprise',
        title: 'Développez Votre Recrutement',
        subtitle: 'Sans Compromis',
        description: 'Conçu pour les équipes de recrutement qui traitent des milliers de candidatures. Bénéficiez de remises sur volume, d\'un support dédié et d\'intégrations personnalisées.',
        contactSales: 'Contacter les Ventes',
        viewPricing: 'Voir les Tarifs',
        feature1: 'Gestion d\'Équipe',
        feature1Desc: 'Tableau de bord centralisé pour les équipes RH pour suivre toutes les candidatures',
        feature2: 'Conformité SOC 2',
        feature2Desc: 'Sécurité de niveau entreprise avec SSO et contrôle d\'accès basé sur les rôles',
        feature3: 'Accès API',
        feature3Desc: 'Intégrez le scan ATS directement dans votre flux de travail de recrutement',
      },
      finalCta: {
        heading: 'Prêt à déboguer votre carrière?',
        description: 'Rejoignez plus de 10 000 développeurs qui ont corrigé leurs erreurs d\'analyse et doublé leur taux d\'entretien.',
        button: 'Vérifiez Ma Visibilité (Scan Gratuit)',
        footer: 'Aucune carte de crédit requise • Conformité RGPD • Résultat Instantané',
      },
    },
    onboarding: {
      steps: {
        role: 'Rôle',
        upload: 'Télécharger',
        scan: 'Scanner',
      },
      roleSelection: {
        heading: 'Quel poste visez-vous?',
        editLink: 'Modifier',
        continueButton: 'Continuer',
      },
      cvUpload: {
        heading: 'Téléchargez Votre CV',
        description: 'Déposez votre fichier CV ou cliquez pour parcourir',
        clickToUpload: 'Cliquez pour télécharger',
        dragDrop: 'ou glissez-déposez',
        maxSize: 'PDF, DOC, DOCX jusqu\'à 10MB',
        log1: '[INIT] Analyse de la structure du document...',
        log2: '[SCAN] Analyse des mots-clés et du formatage...',
        log3: '[CHECK] Vérifications de compatibilité ATS...',
        log4: '[MATCH] Comparaison avec les exigences du poste...',
        log5: '[SCORE] Calcul du score final...',
        log6: '[DONE] Analyse terminée!',
        systemLogs: 'Journaux Système',
        backButton: 'Retour',
        scanButton: 'Scanner le CV',
      },
      helpCenter: {
        label: 'Centre d\'Aide',
      },
    },
    pricingPage: {
      freePlan: {
        name: 'Scan Gratuit',
        description: 'Parfait pour essayer CVDebug',
        price: '0',
        period: 'unique',
        feature1: '1 scan de CV gratuit',
        feature2: 'Score ATS de base',
        feature3: 'Aperçu vue robot',
        feature4: 'Analyse de mots-clés',
        button: 'Commencer le Scan Gratuit',
      },
      pass24h: {
        name: 'Pass 24 Heures',
        description: 'Scans illimités pendant une journée',
        price: '9',
        period: '24 heures',
        feature1: 'Scans de CV illimités',
        feature2: 'Rapport complet de compatibilité ATS',
        feature3: 'Analyse détaillée des mots-clés',
        feature4: 'Recommandations de formatage',
        feature5: 'Téléchargement de rapports PDF',
        feature6: 'Support par email',
        feature7: 'Accès de 24 heures',
        button: 'Obtenir le Pass 24 Heures',
      },
      sprint7d: {
        name: 'Sprint 7 Jours',
        description: 'Parfait pour la recherche d\'emploi',
        price: '29',
        period: '7 jours',
        feature1: 'Tout dans le Pass 24 Heures',
        feature2: 'Versions de CV illimitées',
        feature3: 'Optimisation alimentée par l\'IA',
        feature4: 'Correspondance d\'emploi personnalisée',
        feature5: 'Support prioritaire',
        feature6: 'Accès au créateur de CV',
        feature7: 'Analyse de lettre de motivation',
        feature8: 'Conseils d\'optimisation LinkedIn',
        feature9: 'Accès de 7 jours',
        button: 'Commencer le Sprint 7 Jours',
        recommended: 'Le Plus Populaire',
      },
      hero: {
        badge: 'Tarifs',
        title: 'Choisissez Votre Plan',
        subtitle: 'Obtenez le plan parfait pour votre recherche d\'emploi',
      },
      faq: {
        heading: 'FAQ Tarifs',
        question1: 'Puis-je annuler à tout moment?',
        answer1: 'Oui! Vous pouvez annuler votre abonnement à tout moment. Sans poser de questions.',
        question2: 'Quels modes de paiement acceptez-vous?',
        answer2: 'Nous acceptons toutes les principales cartes de crédit, PayPal et Apple Pay.',
        question3: 'Y a-t-il une politique de remboursement?',
        answer3: 'Oui, nous offrons une garantie de remboursement de 7 jours si vous n\'êtes pas satisfait de notre service.',
        question4: 'Puis-je améliorer mon plan?',
        answer4: 'Absolument! Vous pouvez passer de n\'importe quel plan à un niveau supérieur à tout moment.',
        question5: 'Offrez-vous des réductions?',
        answer5: 'Oui! Nous offrons des réductions pour étudiants et des tarifs de groupe pour les centres de carrière. Contactez-nous pour plus de détails.',
        question6: 'Que se passe-t-il après l\'expiration de mon plan?',
        answer6: 'Vous conserverez l\'accès à vos rapports sauvegardés, mais vous devrez renouveler pour créer de nouveaux scans.',
      },
      guarantee: 'Garantie de remboursement de 30 jours',
    },
    modals: {
      subscription: {
        title: 'Statut de l\'Abonnement',
        tier: 'Niveau Actuel',
        accessMessage: 'Vous avez un accès complet à toutes les fonctionnalités',
        upgradeMessage: 'Améliorez pour débloquer les fonctionnalités premium',
        viewOptions: 'Voir les Options',
        continueDashboard: 'Continuer vers le Tableau de Bord',
        pressEsc: 'Appuyez sur ESC pour fermer',
        premium: 'Premium',
        interviewSprint: 'Sprint 7 Jours',
        singleScan: 'Pass 24 Heures',
        freePlan: 'Plan Gratuit',
        scoreChanged: 'Votre score a changé ? Voici pourquoi',
        nowMatching: 'Nous comparons maintenant votre CV aux Normes de l\'Industrie.',
        realVisibility: 'Votre visibilité réelle est',
        whyLower: 'Le scan de prévisualisation était une vérification rapide. Le tableau de bord montre votre compatibilité ATS réelle.',
        industryStandards: 'Nous comparons aux exigences réelles du marché du travail.',
      },
      logout: {
        title: 'Se Déconnecter',
        question: 'Êtes-vous sûr de vouloir vous déconnecter?',
        stayButton: 'Rester Connecté',
        logoutButton: 'Se Déconnecter',
      },
      creditsExhausted: {
        title: 'Crédits Épuisés',
        message: 'Vous avez utilisé tous vos scans gratuits',
        scoreLabel: 'Votre Score',
        warning: 'Améliorez pour voir votre analyse complète',
        feature1: 'Rapport détaillé de compatibilité ATS',
        feature2: 'Suggestions d\'optimisation de mots-clés',
        price: '9€',
        unlockButton: 'Débloquer le Rapport Complet',
        maybeLater: 'Peut-être Plus Tard',
      },
    },
    toasts: {
      errors: {
        selectRating: 'Veuillez sélectionner une note',
        submissionFailed: 'Échec de l\'envoi des commentaires',
        fileRequired: 'Veuillez sélectionner un fichier',
        invalidFormat: 'Format de fichier invalide',
        uploadFailed: 'Échec du téléchargement',
        aiProcessingError: 'Erreur de traitement IA',
        fetchError: 'Échec de récupération des données',
        unauthorized: 'Accès non autorisé',
        noCredits: 'Plus de crédits disponibles. Veuillez mettre à niveau pour continuer.',
        apiKeyNotConfigured: 'Clé API non configurée. Veuillez contacter le support à cvdebug@outlook.com',
        noTransactionId: 'Aucun ID de transaction disponible',
        checkoutError: 'Échec du démarrage du paiement',
        loginRequired: 'Veuillez vous connecter pour acheter des crédits',
        initiateError: 'Échec de l\'initialisation du paiement',
      },
      success: {
        feedbackSubmitted: 'Merci pour vos commentaires !',
        cvUploaded: 'CV Téléchargé avec Succès !',
        saved: 'Modifications enregistrées !',
        deleted: 'Supprimé avec succès',
        updated: 'Mis à jour avec succès',
        copied: 'Copié dans le presse-papiers !',
        downloaded: 'Téléchargé avec succès',
        generated: 'Généré avec succès !',
        optimized: 'Optimisé avec succès !',
        applied: 'Appliqué avec succès !',
      },
      warnings: {
        fileTooLarge: 'Le fichier est trop volumineux',
        limitReached: 'Limite atteinte',
        replaceBrackets: 'N\'oubliez pas de remplacer les valeurs [entre crochets] par vos chiffres réels !',
      },
    },
    images: {
      userAvatar: 'Avatar utilisateur',
      logo: 'Logo CVDebug',
      feature: 'Illustration de fonctionnalité',
    },
    admin: {
      title: 'Panneau Admin',
      users: 'Utilisateurs',
      analytics: 'Analyses',
      settings: 'Paramètres',
      import: {
        syncComplete: 'Synchronisation Terminée',
        syncFailed: 'Échec de Synchronisation',
        importFailed: 'Échec de l\'Importation',
        importSuccess: 'Importation Réussie',
      },
      grant: {
        emailPlaceholder: 'utilisateur@exemple.com ou user_2...',
        namePlaceholder: 'Jean Dupont',
        planPlaceholder: 'Sélectionner un forfait',
      },
      payment: {
        emailPlaceholder: 'Email de l\'Utilisateur',
      },
      payments: {
        received: '💰 Nouveau Paiement Reçu !',
      },
      usersTable: {
        searchPlaceholder: 'Rechercher des utilisateurs...',
        updated: 'Utilisateur mis à jour avec succès',
        updateError: 'Échec de mise à jour de l\'utilisateur',
      },
      fix: {
        error: 'Échec de correction des utilisateurs',
        complete: 'Correction Terminée',
        reportedError: 'Échec de correction des utilisateurs signalés',
        reportedComplete: 'Correction des Utilisateurs Signalés Terminée',
        deleteSuccess: 'Utilisateur supprimé',
        deleteError: 'Échec de suppression de l\'utilisateur',
      },
    },
    tools: {
      writingForge: {
        title: 'Forge d\'Écriture',
        description: 'Éditeur de CV propulsé par IA',
        placeholder: 'Collez le texte de votre CV ici...',
        analyzing: 'Analyse avec l\'IA...',
        error: 'Erreur de traitement',
        noText: 'Aucun texte à traiter',
        tooShort: 'Le texte est trop court',
        generating: 'Génération d\'améliorations...',
        improvementReady: 'Améliorations prêtes !',
        noResume: 'Aucun texte de CV à éditer',
        emptyResume: 'Le CV ne peut pas être vide',
        saveError: 'Impossible d\'enregistrer les modifications',
        saved: 'Modifications enregistrées !',
        saveFailed: 'Échec de l\'enregistrement des modifications',
        noTextToRegenerate: 'Aucun texte de CV à régénérer',
        regenerating: 'Régénération avec l\'IA...',
        regenerated: 'CV régénéré !',
        preparingPdf: 'Préparation du téléchargement PDF...',
        editPlaceholder: 'Modifiez le texte de votre CV ici...',
      },
      interviewBattle: {
        title: 'Plan de Bataille d\'Entretien',
        description: 'Préparez vos entretiens avec une stratégie générée par IA',
        noResumeText: 'Pas assez de texte de CV pour générer des questions',
        regenerating: 'Régénération des questions avec algorithmes ML...',
        questionsRegenerated: 'Questions régénérées avec ML ! Nouvelles questions basées sur votre CV.',
        generateError: 'Échec de génération des questions. Utilisation des questions de secours.',
        enhancing: 'Amélioration de votre réponse avec l\'IA...',
        answerEnhanced: 'Réponse améliorée avec suggestions IA !',
        actionPlaceholder: 'Décrivez les actions que vous avez prises...',
        downloading: 'Téléchargement du document de stratégie...',
        noJobDesc: 'Veuillez d\'abord coller la description du poste',
        battlePlanGenerated: 'Plan de bataille généré !',
        battlePlanError: 'Échec de génération du plan de bataille',
        jobDescPlaceholder: 'Collez ici la description complète du poste...',
        invalidJobDesc: 'Veuillez fournir une description de poste valide pour générer la préparation d\'entretien.',
        shortResume: 'Le texte du CV est trop court. Veuillez d\'abord télécharger un CV valide.',
        requiresSubscription: 'Échec de génération de la préparation. Cette fonctionnalité nécessite un abonnement actif.',
      },
      linkedIn: {
        title: 'Optimiseur LinkedIn',
        description: 'Optimisez votre profil LinkedIn pour une visibilité maximale',
        upgradeDescription: 'Mettez à niveau pour optimiser votre profil LinkedIn',
        noProfileText: 'Veuillez coller le texte de votre profil LinkedIn',
        analyzed: '✅ Profil LinkedIn analysé avec succès !',
        scanError: 'Échec de l\'analyse du profil. Veuillez réessayer.',
        noBioOptimization: 'Aucune optimisation de bio disponible. Veuillez d\'abord analyser votre profil.',
        bioOptimized: '✅ Bio optimisée copiée dans le presse-papiers ! Collez-la dans votre profil LinkedIn',
      },
      answerFinder: {
        title: 'Chercheur de Réponses',
        searchPlaceholder: 'Rechercher par mot-clé...',
      },
      keywordSniper: {
        title: 'Sniper de Mots-Clés',
        uploadResume: 'Télécharger CV',
        pasteJob: 'Coller la Description du Poste',
        analyzing: 'Analyse des mots-clés...',
        generateError: 'Échec de génération des phrases. Veuillez réessayer.',
        applied: 'Suggestion appliquée ! Votre CV a été mis à jour.',
        rewritten: 'CV réécrit avec succès !',
        exampleDescription: 'Découvrez comment les meilleurs candidats intègrent efficacement ce mot-clé.',
      },
      bullet: {
        noInput: 'Veuillez entrer un point à réécrire',
        optimized: 'Point optimisé !',
        rewriteError: 'Échec de réécriture du point',
        examplePlaceholder: 'Exemple : J\'ai travaillé sur l\'amélioration des performances du site web...',
        rolePlaceholder: 'ex., Ingénieur Logiciel',
        powerStatementCopied: 'Déclaration Puissante copiée !',
      },
      coverLetter: {
        title: 'Générateur de Lettre de Motivation',
        upgradeDescription: 'Mettez à niveau pour générer des lettres de motivation propulsées par IA',
        noJobDescription: 'Veuillez entrer une description de poste',
        generated: 'Lettre de motivation générée avec succès !',
        generateError: 'Échec de génération de la lettre de motivation',
        selectResume: 'Sélectionner un CV...',
        companyPlaceholder: 'ex. Acme Corp',
        rolePlaceholder: 'ex. Ingénieur Senior',
      },
      dm: {
        title: 'Générateur de Messages',
        noProfile: 'Texte de profil manquant. Veuillez d\'abord analyser votre profil.',
        generated: 'Messages générés avec succès !',
        generateError: 'Échec de génération des messages. Veuillez réessayer.',
        copied: 'Message copié dans le presse-papiers !',
        namePlaceholder: 'ex. Sarah Smith',
      },
      headline: {
        title: 'Optimiseur de Titre',
        copied: 'Titre copié dans le presse-papiers !',
      },
      liveOptimizer: {
        title: 'Optimiseur de CV en Direct',
        placeholder: 'Collez le contenu de votre CV ici et regardez le score se mettre à jour en temps réel...',
      },
    },
    dashboardExtended: {
      applications: {
        upgradeDescription: 'Mettez à niveau pour suivre les candidatures et obtenir des insights propulsés par IA',
        added: 'Candidature ajoutée avec succès',
        addError: 'Échec de l\'ajout de la candidature',
        companyPlaceholder: 'ex., Acme Corp',
        rolePlaceholder: 'ex., Ingénieur Senior',
        urlPlaceholder: 'https://...',
        jobDescPlaceholder: 'Collez la description du poste ici pour une correspondance de mots-clés propulsée par IA...',
      },
      projects: {
        created: 'Projet créé avec succès !',
        createError: 'Échec de création du projet',
        projectPlaceholder: 'ex. Recherche d\'Ingénieur Senior chez Google',
        titlePlaceholder: 'ex. Ingénieur Logiciel Senior, Chef de Produit...',
        urlPlaceholder: 'https://linkedin.com/jobs/view/...',
        jobDescPlaceholder: 'Collez ici la description complète du poste...',
        uploadSuccess: 'CV Téléchargé avec Succès !',
      },
      ats: {
        textCopied: 'Texte brut copié dans le presse-papiers',
        textDownloaded: 'Texte brut téléchargé',
        searchPlaceholder: 'Rechercher par mot-clé...',
      },
      fluff: {
        metricCopied: 'Métrique copiée dans le presse-papiers !',
        copyError: 'Échec de copie dans le presse-papiers',
        copyErrorDescription: 'Veuillez essayer de sélectionner le texte manuellement.',
        noMetricSelected: 'Veuillez d\'abord sélectionner une métrique',
        noMetricDescription: 'Choisissez l\'une des quantifications suggérées par IA ci-dessus.',
      },
      sanitize: {
        noResume: 'Impossible de nettoyer : ID de CV manquant',
        success: 'PDF nettoyé avec succès !',
        successDescription: 'L\'intégrité de la couche de texte a été restaurée.',
        error: 'Échec du nettoyage du PDF',
      },
      scanning: {
        fileValidation: 'Validation du Fichier',
        fileValidationSubtitle: 'La structure du PDF est valide.',
        layoutIntegrity: 'Intégrité de la Mise en Page',
        layoutIntegritySubtitle: 'Vérification des marges et du flux de texte.',
        keywordMatch: 'Correspondance de Mots-Clés',
        keywordMatchSubtitle: 'EN ATTENTE',
        timeline: 'Chronologie de l\'Expérience',
        timelineSubtitle: 'Analyse de la progression de carrière.',
        scoring: 'Notation et Rapport',
        scoringSubtitle: 'Calcul du score final.',
      },
      metrics: {
        noQuantified: 'Veuillez fournir une version quantifiée',
        replaceBrackets: 'N\'oubliez pas de remplacer les valeurs [entre crochets] par vos chiffres réels !',
        updated: 'Point mis à jour avec des métriques !',
      },
      insights: {
        overall: 'Global',
        keywordMatch: 'Correspondance de Mots-Clés',
        actionVerbs: 'Verbes d\'Action',
        impact: 'Impact',
        structure: 'Structure',
      },
      kanban: {
        applied: 'Postulé',
        interviewing: 'En Entretien',
        accepted: 'Accepté',
      },
      analysis: {
        error: 'L\'analyse du CV a échoué. Veuillez réessayer.',
      },
      reportUnlocked: '🎉 Rapport de CV débloqué ! Vos crédits ont été appliqués.',
      resumeDeleted: 'CV supprimé',
      upgrade: {
        interviewSprintRequired: 'Forfait Sprint d\'Entretien requis',
      },
      feedback: {
        noRating: 'Veuillez sélectionner une note',
        success: 'Merci pour vos commentaires !',
        submitError: 'Échec de l\'envoi des commentaires',
        commentPlaceholder: 'Des commentaires supplémentaires ? (optionnel)',
        tellMore: 'Dites-nous en plus (optionnel)',
      },
    },
    payment: {
      success: 'Paiement réussi ! Déblocage de votre rapport de CV...',
      creditError: 'Paiement enregistré mais échec de mise à jour des crédits. Veuillez contacter le support',
      noTransactionId: 'Aucun ID de transaction disponible',
      receiptDownloaded: 'Reçu téléchargé avec succès',
      downloadError: 'Échec du téléchargement du reçu',
      checkoutError: 'Échec du démarrage du paiement',
      loginRequired: 'Veuillez vous connecter pour acheter des crédits',
      initiateError: 'Échec de l\'initialisation du paiement',
    },
    pages: {
      nursing: {
        title: 'Scanner ATS pour Infirmières',
        clinical: 'Optimiseur de Mots-Clés Cliniques',
        healthcare: 'Compatibilité ATS Santé',
        credentials: 'Validateur de Licence et Accréditation',
      },
      medSurg: {
        title: 'Optimiseur ATS pour Infirmières Médico-Chirurgicales',
        generic: 'Générique',
        patientRatios: 'Ratios de Patients Non Quantifiés',
        surgicalExperience: 'Expérience Chirurgicale Enfouie',
      },
      softwareEngineer: {
        title: 'Sniper de Mots-Clés pour Ingénieurs Logiciels',
        techStack: 'Sniper de Mots-Clés Tech Stack',
        faang: 'Compatibilité ATS FAANG',
        systemDesign: 'Validateur de Conception de Systèmes',
      },
      dataAnalyst: {
        title: 'Débogage de CV pour Analystes de Données',
        skills: 'Analyseur de Compétences Techniques',
        metrics: 'Analyseur d\'Impact des Métriques',
        techStack: 'Correspondance de Mots-Clés Tech Stack',
      },
      finance: {
        title: 'Optimiseur ATS pour Stages en Finance',
        ibKeywords: 'Validateur de Mots-Clés IB',
        format: 'Vérificateur de Format de Stage',
        metricsOptimizer: 'Optimiseur de Métriques Financières',
      },
      about: {
        title: 'À Propos de CVDebug - Optimisation de CV ATS Propulsée par IA',
        missionDriven: 'Guidé par la Mission',
        jobSeeker: 'Chercheur d\'Emploi d\'Abord',
        innovation: 'Innovation',
        privacyTitle: 'Confidentialité et Confiance',
      },
      blog: {
        title: 'Conseils CV ATS et Stratégies de Recherche d\'Emploi Blog | CVDebug',
      },
      privacy: {
        title: 'Politique de Confidentialité | CVDebug',
      },
      terms: {
        title: 'Conditions Générales | CVDebug',
      },
      contact: {
        title: 'Contactez-Nous | Support CVDebug',
        email: 'Support Email',
        chat: 'Chat en Direct',
        responseTime: 'Temps de Réponse',
        location: 'Localisation',
        namePlaceholder: 'Jean Dupont',
        emailPlaceholder: 'jean@exemple.com',
        messagePlaceholder: 'Comment pouvons-nous vous aider ?',
      },
    },
    previewScanExtended: {
      processError: 'Échec du traitement du fichier',
    },
    heroSection: {
      badge: 'Nouveau : Analyse ATS améliorée par ML',
      mainHeadline: 'L\'ATS bloque-t-il <br />votre CV ?',
      diagnosticNote: 'CVDebug est un outil de diagnostic, pas une solution magique.',
      oneTimePayment: 'Paiement unique, pas d\'abonnements.',
      checkResumeButton: 'Vérifier Mon CV',
      seeHowButton: 'Voir Comment Ça Marche',
      trustedBy: 'Approuvé par',
      jobSeekers: 'demandeurs d\'emploi',
      criticalFixNeeded: 'Correction Critique Nécessaire',
      missingKeywordsAlert: 'Votre CV manque de 3 mots-clés critiques trouvés dans la description du poste',
    },
    ctaSection: {
      payOnceBadge: 'Payez une fois, utilisez à tout moment',
      readyHeading: 'Prêt à battre l\'ATS ?',
      description: 'Obtenez une analyse améliorée par ML avec pondération des mots-clés TF-IDF, détection de format et corrections actionnables. 1 scan = 1 crédit. Pas d\'abonnements.',
      startButton: 'Démarrer Votre Premier Scan',
      footnote: '✨ Premier scan gratuit • Les crédits n\'expirent jamais • Résultats instantanés',
    },
    testimonialsSection: {
      badge: 'Mur d\'Amour Reddit',
      heading: 'Approuvé par les Redditors du Monde Entier',
      description: 'Vrais commentaires de r/resumes, r/developersIndia, r/cscareerquestions, et plus.',
      ctaText: 'Rejoignez des milliers de chercheurs d\'emploi optimisant leurs CVs',
    },
    faqSection: {
      heading: 'Questions Fréquentes',
      q1: 'Vendez-vous mes données ?',
      a1: 'Jamais. Votre CV est analysé en mémoire et stocké en toute sécurité uniquement pour votre session. Nous ne vendons pas de données aux recruteurs ou à des tiers.',
      q2: 'Qu\'est-ce que le "Piège de l\'Image" ?',
      a2: 'De nombreux modèles de CV modernes (de Canva ou Photoshop) exportent le texte sous forme d\'images aplaties. Les systèmes ATS ne peuvent pas lire les images, donc votre expérience est invisible. CVDebug détecte cela et vous montre exactement ce que l\'ATS voit.',
      q3: 'Cela fonctionne-t-il pour toutes les industries ?',
      a3: 'Oui, mais il est optimisé pour les rôles techniques et d\'entreprise où l\'utilisation de l\'ATS est la plus élevée. Les domaines créatifs peuvent avoir des exigences différentes.',
    },
    pricingSection: {
      heading: 'Tarification Simple',
      subheading: 'Payez une fois. Corrigez pour toujours. Pas d\'abonnements.',
      freePreview: 'Aperçu Gratuit',
      free: 'Gratuit',
      seeScore: 'Voir votre score ATS',
      tryFree: 'Essayer Gratuitement',
      singleScan: 'Scan Unique',
      oneCompleteFix: 'Une correction complète',
      getSingleScan: 'Obtenir Scan Unique',
      interviewSprint: 'Sprint d\'Entretien',
      sevenDaysUnlimited: '7 jours illimités',
      startSprint: 'Démarrer le Sprint',
      bestValue: '🚀 MEILLEURE VALEUR',
    },
    statsSection: {
      rejectionRate: '75%',
      rejectionLabel: 'CVs rejetés par l\'ATS',
      noBSLabel: 'Pas de BS',
      transparentPricing: 'Tarification Transparente',
      analysisTime: '10s',
      avgTimeLabel: 'Temps d\'analyse moyen',
      secureLabel: 'Sécurisé',
      dataRetention: 'Données supprimées sous 30 jours',
    },
    featuresBento: {
      scatteredResumesTitle: 'Pourquoi les CVs dispersés tuent votre recherche d\'emploi',
      projectBasedTitle: 'Suivi Basé sur les Projets',
      projectBasedDesc: 'Créez des projets de recherche d\'emploi et suivez chaque candidature avec des scores de correspondance, des lettres de motivation personnalisées et des écarts de mots-clés. Voyez quelles entreprises vous ignorent.',
      healthMonitorTitle: 'Moniteur de Santé en Temps Réel',
      healthMonitorDesc: 'Les vérifications continues de l\'intégrité du CV vous alertent instantanément si le formatage se casse ou si les mots-clés dérivent. Gardez votre CV maître prêt pour l\'ATS 24/7.',
      keywordGapTitle: 'Analyse des Écarts de Mots-Clés',
      keywordGapDesc: 'Voyez côte à côte ce que Google veut vs. ce que Meta veut. Copiez-collez les descriptions de postes et obtenez des correspondances de mots-clés notées TF-IDF instantanées.',
      aiCoverLetterTitle: 'Générateur de Lettres de Motivation IA',
      aiCoverLetterDesc: 'Générez des lettres de motivation personnalisées qui comblent explicitement vos écarts de mots-clés. Chaque lettre fait référence à vos compétences manquantes réelles de l\'analyse d\'écart.',
    },
    freeTierView: {
      founderAudit: 'Audit du Fondateur',
      byAlbert: 'par Albert',
      bottomPercentile: 'Vous êtes dans le {percentileRank}% Inférieur des Candidats',
      yourScore: 'Votre Score',
      autoRejected: 'Auto-rejeté par 90% des entreprises',
      thoseWhoGetInterviews: 'Ceux Qui Obtiennent des Entretiens',
      pointsHigher: '{missingPoints} points de plus',
      passATSFilters: 'Passent les filtres ATS',
      missingKeywords: 'Il vous manque {missingCount} mots-clés critiques qu\'ils ont',
      unlockList: '[Débloquer la liste complète pour 9,99 €]',
      robotViewTitle: '🤖 Vue Robot',
      freePreviewBadge: 'APERÇU GRATUIT',
      robotViewDesc: 'C\'est exactement ce que l\'ATS voit lors de l\'analyse de votre CV',
      robotViewWarning: 'Si votre texte est manquant, brouillé ou désordonné ici, l\'ATS ne peut pas lire votre CV. C\'est la raison #1 de rejet automatique.',
      noTextExtracted: 'Aucun texte extrait. Cela signifie que les systèmes ATS ne peuvent pas du tout lire votre CV.',
      parsingError: '[ERREUR D\'ANALYSE DÉTECTÉE]',
      hiddenContent: '⚠️ Contenu masqué bloqué par l\'analyseur ATS',
      chatGPTCantFix: '💡 ChatGPT ne peut pas réparer cela. Seul notre Nettoyeur PDF peut réparer les erreurs d\'analyse.',
      moreErrors: '+{number} erreurs d\'analyse supplémentaires masquées',
      topCriticalErrors: 'Principales Erreurs Critiques',
      showingErrors: 'Affichage de 2 sur {formatCount}',
      missingCriticalKeywords: '🔑 Mots-Clés Critiques Manquants',
      highImpact: 'Impact Élevé',
      keywordsHidden: '{number} Mots-Clés Critiques Masqués',
      getCertified: 'Faites Certifier Votre CV par CVDebug',
      unlockPackage: 'Débloquez {missingCount} mots-clés exacts + {formatCount} corrections critiques pour un paiement unique de 9,99 €',
      certificationPackage: '✅ Forfait de Certification ATS :',
      allKeywords: 'Tous les {total} mots-clés manquants avec emplacement exact',
      allFormatErrors: 'Toutes les {total} erreurs de format avec corrections en 1 clic',
      aiRewrite: 'Suggestions de réécriture alimentées par l\'IA',
      atsCertifiedPDF: '✅ Téléchargement de PDF certifié ATS avec badge',
      pdfSanitizer: '⚡ Nettoyeur PDF en Un Clic en 3 secondes',
      getCertifiedButton: 'Se Faire Certifier - Seulement 9,99 €',
      albertReview: 'Albert examine votre CV personnellement',
      videoFeedback: 'Vidéo de 3 min avec retour brutal + toutes les corrections',
      manualReviewButton: 'Je veux l\'examen manuel →',
      oneTimePayment: '✓ Paiement unique',
      instantAccess: '✓ Accès instantané',
      noSubscription: '✓ Pas d\'abonnement',
      socialProof: '2 847 utilisateurs ont débloqué leurs rapports cette semaine et',
      interviewIncrease: 'ont augmenté leur taux d\'entretien de 2x',
    },
    atsOverview: {
      title: 'Score de Compatibilité ATS',
      scoreOf100: '/ 100',
      beatingPercentile: 'Vous battez {percentile}% des autres candidats',
      eliteReady: 'Elite / Prêt à Postuler',
      visibilityGap: 'L\'Écart de Visibilité',
      criticalDanger: 'Danger Critique',
      topCriticalFailures: 'Principales Défaillances Critiques',
      technicalVsHuman: 'Signal Technique vs. Humain',
      technicalSignalDesc: 'Format, polices, structure — le bot peut-il le lire ?',
      technicalSignal: 'Signal Technique',
      humanSignal: 'Signal Humain',
      humanSignalDesc: 'Ancienneté, verbes de pouvoir, impact — impressionnant pour les humains ?',
      balanceNote: 'L\'équilibre est la clé : Un CV lisible (bot) n\'est pas la même chose qu\'un CV vendeur (humain). Vous avez besoin des deux.',
      contactCheck: 'Vérification Rapide : Contact et Réseaux',
      email: 'Email',
      phone: 'Téléphone',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      missing: 'Manquant',
      seniorityInference: 'Inférence d\'Ancienneté',
      aiInference: 'Inférence IA : Vous ressemblez à un',
      soundLikeSenior: 'Ressemble à un Architecte Senior',
      impactBreakdown: 'Répartition de l\'Impact',
      actionVerbs: 'Verbes d\'Action',
      quantifiableMetrics: 'Métriques Quantifiables',
      targetMetrics: 'Cible : {number} métriques',
      softSkills: 'Compétences Douces',
    },
    forms: {
      companyName: 'Nom de l\'Entreprise',
      companyPlaceholder: 'ex., Acme Corp',
      jobTitle: 'Titre du Poste',
      jobTitlePlaceholder: 'ex., Ingénieur Senior',
      jobUrl: 'URL de l\'Offre d\'Emploi',
      jobUrlOptional: '(Facultatif)',
      jobUrlPlaceholder: 'https://...',
      jobDescription: 'Description du Poste',
      jobDescRecommended: '(Recommandé pour l\'Analyse IA)',
      jobDescPlaceholder: 'Collez la description du poste ici pour la correspondance de mots-clés alimentée par l\'IA...',
      jobDescHint: 'Ajoutez la description du poste pour obtenir une analyse instantanée des écarts de mots-clés',
      cancel: 'Annuler',
      addApplication: 'Ajouter une Candidature',
      adding: 'Ajout...',
      addedSuccess: 'Candidature ajoutée avec succès',
      addedError: 'Échec de l\'ajout de la candidature',
    },
    dialogs: {
      addNewApplication: 'Ajouter une Nouvelle Candidature',
      sprintRequired: 'Sprint d\'Entretien Requis',
      upgradeMessage: 'Mettez à niveau pour suivre les candidatures, obtenir une analyse de mots-clés et recevoir des alertes d\'ignorement.',
      upgradeNow: 'Mettre à Niveau Maintenant',
      sprintRequiredError: 'Plan Sprint d\'Entretien requis',
      upgradeForInsights: 'Mettez à niveau pour suivre les candidatures et obtenir des informations alimentées par l\'IA',
    },
    scoreCard: {
      resumeIs: 'Votre CV est',
      ofBots: '{percentage} des bots.',
      excellent: 'Excellent',
      needsOptimization: 'Nécessite une Optimisation',
      criticalIssues: 'Problèmes Critiques',
      excellentMessage: 'Bon travail ! Votre CV est bien optimisé pour les systèmes ATS.',
      optimizationMessage: 'Nous avons trouvé quelques problèmes qui pourraient vous faire rejeter. Corrigeons-les.',
      criticalMessage: 'Nous avons trouvé 3 erreurs critiques qui pourraient vous faire rejeter automatiquement. Celles-ci nécessitent une attention immédiate.',
      downloadReport: 'Télécharger le Rapport',
      shareResults: 'Partager les Résultats',
    },
    keywordAnalysis: {
      title: 'Analyse des Mots-clés',
      subtitle: 'Correspondance sémantique avec les descriptions de poste standard.',
      matchRate: 'Taux de Correspondance',
      foundSignals: 'Signaux Trouvés',
      total: 'Total',
      groupByType: 'Grouper par Type',
      listView: 'Vue Liste',
      gridView: 'Vue Grille',
      missingCriticalSignals: 'Signaux Critiques Manquants',
      highImpact: 'Impact Élevé',
      fixingIncreases: 'Corriger cela augmente le score d\'environ 15%',
      viewExamples: 'Voir les Exemples',
      autoAdd: 'Ajout Auto',
      industryKeywordFrequency: 'Fréquence des Mots-clés de l\'Industrie',
      aiPowered: 'Propulsé par IA',
      showingExamples: 'Affichage d\'exemples pour',
      viewHowTopCandidates: 'Voir comment les meilleurs candidats intègrent efficacement ce mot-clé.',
      displayingFlatList: 'Affichage en liste plate',
      keywordsOrganized: 'Mots-clés organisés par catégorie',
      switchedToView: 'Basculé vers',
      showingAllKeywords: 'Affichage de tous les mots-clés',
      groupedByType: 'Groupé par type',
      noMissingSignals: 'Aucun Signal Manquant',
      excellentKeywordCoverage: 'Bon travail ! Votre CV a une excellente couverture de mots-clés.',
      matchType: 'Type de Correspondance',
      exactMatch: 'Correspondance Exacte',
      synonymMatch: 'Correspondance Synonyme',
      semanticMatch: 'Correspondance Sémantique',
      foundInResume: 'Trouvé dans le CV',
      clickToHide: 'Cliquez pour masquer les détails',
      // Paywall content
      criticalSignalsLocked: 'Signaux Critiques Verrouillés',
      unlockFullAnalysis: 'Débloquer l\'Analyse Complète',
      unlockDescription: 'Débloquez l\'analyse complète des mots-clés manquants avec impact quantifié, descriptions spécifiques, et recommandations IA pour augmenter votre score jusqu\'à +15%.',
      quantifiedImpact: 'impact quantifié',
      specificDescriptions: 'descriptions spécifiques',
      aiRecommendations: 'recommandations IA',
      increaseScoreBy: 'pour augmenter votre score jusqu\'à +15%',
      detailedImpactAnalysis: 'Analyse d\'impact détaillée (+2% par mot-clé)',
      impactPerKeyword: '+2% par mot-clé',
      specificForEachKeyword: 'Descriptions spécifiques pour chaque mot-clé',
      recommendedLocation: 'Emplacement recommandé dans le CV',
      autoAddWithAI: 'Ajout Auto avec IA (Writing Forge)',
      unlockComplete: 'Débloquer l\'Analyse Complète',
      sevenDayPlan: 'Plan de 7 jours • €24.99',
      keywordsMissingLocked: 'Mots-clés Manquants Verrouillés',
      unlockCompleteList: 'Débloquez la liste complète des mots-clés critiques avec impact quantifié (+15% score).',
      unlockButton: 'Débloquer',
    },
    fluffDetector: {
      locked: 'Détecteur de Fluff Verrouillé',
      unlockPremium: 'Débloquer l\'Analyse Premium',
      description: 'Débloquez la détection de fluff alimentée par IA pour identifier les phrases faibles, les réalisations non quantifiées, et obtenir des remplacements actionnables.',
      weakPhraseAnalysis: 'Détection de phrases faibles avec contexte',
      quantifiedMetrics: 'Analyse des réalisations non quantifiées',
      actionableReplacements: 'Remplacements actionnables alimentés par IA',
      unlockFluff: 'Débloquer le Détecteur de Fluff',
    },
    interviewPrep: {
      locked: 'Plan de Bataille d\'Entretien Verrouillé',
      unlockBattlePlan: 'Débloquer la Préparation d\'Entretien',
      description: 'Générez une préparation d\'entretien personnalisée avec des questions attendues, des histoires STAR, et des points de discussion stratégiques basés sur votre CV et la description du poste.',
      expectedQuestions: 'Questions d\'entretien attendues',
      starStories: 'Suggestions d\'histoires format STAR',
      talkingPoints: 'Points de discussion stratégiques',
      unlockInterview: 'Débloquer le Plan de Bataille',
    },
    recruiterDM: {
      locked: 'Générateur de DM pour Recruteurs Verrouillé',
      unlockDMGenerator: 'Débloquer le Générateur de DM',
      description: 'Générez des messages personnalisés pour les recruteurs avec plusieurs variations optimisées avec les mots-clés de votre description de poste cible.',
      personalizedMessages: 'Messages personnalisés pour recruteurs',
      multipleVariations: '3 variations par message',
      keywordOptimized: 'Optimisé avec mots-clés pour votre rôle cible',
      unlockRecruiter: 'Débloquer le Générateur de DM',
    },
    conversionBanner: {
      currentBracket: 'Bracket Actuel',
      youAreInBracket: 'Vous êtes dans le',
      unlockSprint: 'Débloquez le',
      sprintEngine: 'Moteur Sprint',
      reach: 'pour atteindre',
      matchFaang: 'et égaler',
      instantly: 'instantanément',
      pointsBoost: 'potentiel d\'augmentation de points',
      faangKeywords: 'mots-clés niveau FAANG',
      hourAccess: 'accès 24 heures',
      get24hPass: 'Obtenir un Pass Sprint 24h',
      oneTimePayment: 'Paiement unique',
      fixEverything: 'Tout corriger en 24 heures. Pas d\'abonnement.',
      noSubscription: 'Pas d\'abonnement',
      devsUpgraded: 'développeurs mis à niveau cette semaine',
      avgIncrease: 'Augmentation moyenne du score',
      points: 'points',
    },
    atsSimulation: {
      seniorityMatch: 'Analyse de Correspondance de Séniorité',
      detectedLevel: 'Niveau Détecté',
      experienceAudit: 'Audit d\'Expérience',
      signalDensity: 'Densité de Signaux',
      score: 'Score',
      expected: 'Attendu',
      signals: 'signaux',
      strength: 'Force',
      junior: 'Junior',
      mid: 'Intermédiaire',
      senior: 'Senior',
      lead: 'Lead',
      match: 'Correspond',
      review: 'Réviser',
      year: 'année',
      years: 'années',
      strong: 'FORT',
      medium: 'MOYEN',
      weak: 'FAIBLE',
      readability: 'Lisibilité',
      highIntegrity: 'Haute Intégrité',
      industryPatterns: 'La structure suit les modèles standard de l\'industrie',
      imageTraps: 'Pièges d\'Image',
      safe: 'Sûr',
      noneDetected: 'Aucun Détecté',
      noInvisibleElements: 'Aucun élément invisible ou bourrage de mots-clés',
      atsGlobalScore: 'Score Global ATS',
      parsingEfficiency: 'Score basé sur l\'efficacité d\'analyse',
      liveAnalysis: 'Analyse en Direct',
      fullReport: 'Rapport Complet',
    },
    keywordSniper: {
      title: 'Outil Keyword Sniper',
      subtitle: 'Optimisez vos points avec injection de mots-clés IA',
      noJobDescription: 'Aucune Description de Poste Analysée',
      noJobDescriptionDesc: 'Keyword Sniper a besoin d\'une description de poste pour analyser et extraire les mots-clés manquants.',
      howToUseTitle: 'Comment utiliser Keyword Sniper :',
      howToStep1: 'Créez un projet avec votre rôle cible',
      howToStep2: 'Ajoutez une candidature avec la description du poste',
      howToStep3: 'Analysez la description pour extraire les mots-clés',
      howToStep4: 'Revenez ici pour obtenir des suggestions IA',
      backToDashboard: 'Retour au Tableau de Bord',
      interviewSprintRequired: 'Interview Sprint Requis',
      injectKeywordsDesc: 'Injectez des mots-clés manquants dans vos points avec des suggestions IA.',
      keywordInjection: 'Injection de mots-clés',
      liveScoreTracking: 'Suivi du score en direct',
      priorityTargeting: 'Ciblage prioritaire',
      contextAwareAI: 'IA consciente du contexte',
      upgradeToSprint: 'Passer à Interview Sprint',
      back: 'Retour',
      targeting: 'Ciblage',
      currentResume: 'CV Actuel',
      aiPremiumTools: 'Outils Premium IA',
      viewExamples: 'Voir des Exemples',
      viewExamplesDesc: 'Voir des exemples de niveau senior sur l\'intégration naturelle des mots-clés',
      applyMetric: 'Appliquer une Métrique',
      applyMetricDesc: 'Transformez des points faibles en déclarations d\'impact quantifiées',
      rewriteAll: 'Tout Réécrire',
      rewriteAllDesc: 'Moteur IA pour réécrire votre CV complet au niveau senior+',
      battlePlan: 'Plan de Bataille',
      battlePlanDesc: 'Générez les questions les plus difficiles + réponses stratégiques pour les entretiens',
      suggestionApplied: 'Suggestion appliquée ! Votre CV a été mis à jour.',
      noMissingKeywords: 'Aucun mot-clé manquant pour afficher des exemples',
      rewriteSuccess: 'CV réécrit avec succès !',
      lockedTitle: 'Interview Sprint Requis',
      lockedDesc: 'Débloquez l\'Outil Keyword Sniper pour injecter des mots-clés manquants et améliorer votre score ATS.',
      upgradeNow: 'Mettre à Niveau Maintenant',
    },
    createProject: {
      title: 'Créer un Nouveau Projet',
      subtitle: 'Configurez votre campagne de recherche d\'emploi',
      projectName: 'Nom du Projet',
      projectNamePlaceholder: 'ex. Recherche SWE Senior chez Google',
      targetRole: 'Rôle Cible',
      targetRolePlaceholder: 'ex. Ingénieur Logiciel Senior, Chef de Produit...',
      targetRoleHint: 'Tapez n\'importe quel rôle ou sélectionnez parmi les suggestions. Cela aide l\'IA à ajuster les suggestions de CV.',
      jobDescription: 'Description du Poste',
      optional: '(Optionnel)',
      linkUrl: 'URL du Lien',
      pasteText: 'Coller le Texte',
      urlPlaceholder: 'https://linkedin.com/jobs/view/...',
      textPlaceholder: 'Collez la description complète du poste ici...',
      aiAnalysisTitle: 'Analyse IA Activée',
      aiAnalysisDesc: 'Nous extrairons les mots-clés de la description pour optimiser votre CV et calculer les scores de correspondance.',
      cancel: 'Annuler',
      createButton: 'Créer un Projet',
      creating: 'Création...',
      successMessage: 'Projet créé avec succès !',
      errorMessage: 'Échec de la création du projet',
    },
    createApplication: {
      title: 'Ajouter une Nouvelle Candidature',
      sprintRequired: 'Interview Sprint Requis',
      upgradeDesc: 'Passez à la version supérieure pour suivre les candidatures, obtenir une analyse des mots-clés et recevoir des alertes de ghosting.',
      upgradeNow: 'Mettre à Niveau Maintenant',
      companyName: 'Nom de l\'Entreprise',
      companyPlaceholder: 'ex., Acme Corp',
      jobTitle: 'Titre du Poste',
      jobTitlePlaceholder: 'ex., Ingénieur Senior',
      jobUrl: 'URL de l\'Offre d\'Emploi',
      optional: '(Facultatif)',
      urlPlaceholder: 'https://...',
      jobDescription: 'Description du Poste',
      recommendedAI: '(Recommandé pour l\'Analyse IA)',
      descriptionPlaceholder: 'Collez la description du poste ici pour la correspondance des mots-clés par IA...',
      cancel: 'Annuler',
      addApplication: 'Ajouter une Candidature',
      adding: 'Ajout...',
      planRequired: 'Plan Interview Sprint requis',
      planRequiredDesc: 'Passez à la version supérieure pour suivre les candidatures et obtenir des informations basées sur l\'IA',
      successMessage: 'Candidature ajoutée avec succès',
      errorMessage: 'Échec de l\'ajout de la candidature',
      featureRestricted: 'Cette fonctionnalité n\'est disponible qu\'avec un abonnement Interview Sprint actif',
    },
    missionControl: {
      title: 'Centre de Contrôle',
      welcomeBack: 'Bon retour',
      eliminateBugs: 'Éliminez les bugs jusqu\'à atteindre 95% de visibilité.',
      newApplication: 'Nouvelle Candidature',
      visibilityScore: 'Score de Visibilité',
      howRecruitersFind: 'Comment les recruteurs trouvent votre CV',
      activeApplications: 'Candidatures Actives',
      interviewsScheduled: 'entretiens programmés',
      missingSignals: 'Signaux Manquants',
      critical: 'CRITIQUE',
      impactingMatchScore: 'Impact sur le score de correspondance de',
      robotViewTitle: 'Vue Robot : Ce que l\'ATS Lit Réellement',
      robotViewSubtitle: 'Des informations critiques manquent-elles dans votre CV ?',
      uploadToSeeExtraction: 'Téléchargez un CV pour voir l\'extraction de texte brut',
      missingKeywords: 'Manquants',
      allKeywordsDetected: 'Tous les mots-clés critiques détectés',
      needPoints: 'Besoin de',
      reachEliteTier: 'points pour atteindre le niveau ELITE',
      viewFullReport: 'Voir le Rapport Complet',
      uploadResume: 'Télécharger le CV',
      careerHealth: 'Santé Professionnelle',
      elite: 'ELITE',
      pro: 'PRO',
      rising: 'RISING',
      starter: 'STARTER',
      progressToElite: 'Progression vers ELITE (85%+)',
      cvScore: 'Score CV',
      applications: 'Candidatures',
      interviews: 'Entretiens',
      applicationKanban: 'Kanban des Candidatures',
      viewAll: 'VOIR TOUT',
      applied: 'Postulé',
      noApplicationsYet: 'Pas encore de candidatures',
      position: 'Poste',
      company: 'Entreprise',
      recent: 'Récent',
      interviewing: 'En Entretien',
      noInterviewsYet: 'Pas encore d\'entretiens',
      inProgress: 'En Cours',
      accepted: 'Accepté',
      noOffersYet: 'Pas encore d\'offres',
      topErrors: 'Erreurs Principales',
      noCVLoaded: 'Aucun CV chargé',
      consoleBash: 'console — bash',
      noCriticalErrors: 'Aucune erreur critique détectée',
      allSystemsOperational: 'Tous les systèmes opérationnels',
      debugMasterCV: 'DEBUG MASTER CV',
      missingKeyword: 'Mot-clé manquant',
      matchScoreImpact: 'impact sur match_score :',
      dateFormatInconsistency: 'Incohérence de format de date trouvée',
      atExperienceBlock: 'à Experience.block (Ligne 42)',
    },
    atsReport: {
      missingSignals: 'Signaux Manquants',
      critical: 'CRITIQUE',
      important: 'IMPORTANT',
      niceToHave: 'SOUHAITABLE',
      fix: 'Corriger',
      invisibleToBot: 'Invisible au Bot',
      atsWillReject: '⚠️ L\'ATS vous rejettera automatiquement',
      needsOptimization: 'Vous devez optimiser votre CV AVANT de postuler',
      readyToApply: 'Prêt à Postuler',
      context: 'Contexte',
      offerRequires: 'L\'offre nécessite',
      youNeedToAdd: 'Vous devez ajouter cette compétence',
      missingThisToken: 'mais votre CV ne mentionne que',
      addSignalsOf: 'Vous devez ajouter des signaux de',
      upgrade: 'Mettre à Niveau',
      percentInvisible: '% Invisible au Bot',
      needsOptimizationBefore: 'Nécessite une optimisation AVANT de postuler',
    },
    projectsView: {
      searchPlaceholder: 'Rechercher projets, tags...',
      uploadNewMasterCV: 'Télécharger Nouveau CV Principal',
      allProjects: 'Tous les Projets',
      highMatch: 'Forte Correspondance',
      needsReview: 'À Réviser',
      archived: 'Archivé',
      sortBy: 'Trier par:',
      lastUpdated: 'Dernière Mise à Jour',
      loadingProjects: 'Chargement des projets...',
      noProjectsYet: 'Pas encore de projets',
      noProjectsDesc: 'Créez votre premier projet pour commencer à suivre les candidatures et optimiser votre CV.',
      createFirstProject: 'Créer Votre Premier Projet',
      matchScore: 'Score de Correspondance',
      stable: 'Stable',
      missingData: 'Données Manquantes',
      highPriority: 'Haute Priorité',
      strong: 'Fort',
      moderate: 'Modéré',
      low: 'Faible',
      hoursAgo: 'h',
      daysAgo: 'j',
      weeksAgo: 's',
      openProjectBoard: 'Ouvrir le Tableau de Projet',
      createNewProject: 'Créer Nouveau Projet',
      createNewProjectDesc: 'Lancez une nouvelle mission ou téléchargez un CV à analyser.',
    },
    resumeGrid: {
      loadingResumes: 'Chargement de vos CV...',
      analyzing: 'Analyse en cours...',
      error: 'Erreur',
      excellent: 'Excellent',
      moderate: 'Modéré',
      critical: 'Critique',
      noResumesFound: 'Aucun CV trouvé',
      noResumesDesc: 'Téléchargez votre CV pour obtenir un score ATS instantané et des retours alimentés par IA.',
      uploadResume: 'Télécharger CV',
      createManually: 'Créer Manuellement',
      createProject: 'Créer Projet',
      searchPlaceholder: 'Rechercher des CV par nom, compétence ou ID...',
      listView: 'Vue Liste',
      gridView: 'Vue Grille',
      resumeName: 'Nom du CV',
      uploadDate: 'Date de Téléchargement',
      lastAnalyzed: 'Dernière Analyse',
      healthScore: 'Score de Santé',
      actions: 'Actions',
      viewDetails: 'Voir Détails',
      reAnalyze: 'Ré-analyser',
      delete: 'Supprimer',
      justNow: 'À l\'instant',
      showing: 'Affichage',
      to: 'à',
      of: 'de',
      results: 'résultats',
      previous: 'Précédent',
      next: 'Suivant',
      noSearchResults: 'Aucun CV ne correspond à votre recherche.',
    },
    aiFeedback: {
      rateResponse: 'Noter cette réponse',
      howHelpful: 'Cette réponse vous a-t-elle été utile ?',
      feedbackHelps: 'Vos commentaires nous aident à améliorer notre IA.',
      helpful: 'Utile',
      okay: 'Correct',
      notHelpful: 'Pas utile',
      additionalComments: 'Commentaires supplémentaires (optionnel)...',
      submitFeedback: 'Envoyer les commentaires',
      thankYou: 'Merci pour vos commentaires !',
      wasHelpful: 'Cette réponse a-t-elle été utile ?',
      yes: 'Oui',
      somewhat: 'Un peu',
      no: 'Non',
      tellMore: 'Dites-nous en plus (optionnel)...',
      submit: 'Envoyer',
      selectRating: 'Veuillez sélectionner une note',
      feedbackSubmitted: 'Merci ! Commentaires envoyés.',
      submitError: 'Échec de l\'envoi des commentaires. Veuillez réessayer.',
    },
    eliteMatchTool: {
      title: 'Elite Match Tool',
      subtitle: 'Analyze your resume against any job offer with local ML precision. Identify gaps and optimize for ATS instantly.',
      urlLabel: 'LinkedIn URL (Recommended)',
      urlPlaceholder: 'https://www.linkedin.com/jobs/view/...',
      urlHelp: 'Paste the direct LinkedIn job posting link for best extraction results.',
      textLabel: 'Paste Job Description',
      textPlaceholder: 'About the role:\nWe are looking for a Senior Full Stack Developer with 5+ years of experience...\n\nRequirements:\n- Strong experience with React and Node.js\n- Experience with Kubernetes and AWS',
      textHelp: 'Copy and paste the full job description from any portal.',
      analyzeButton: 'Analyze Match Score',
      featureExtraction: 'Entity Extraction',
      featureExtractionDesc: 'Not just keywords: we extract Hard Skills, Soft Skills, and Industry Metrics with deep semantic understanding.',
      gapAnalysis: 'Gap Analysis',
      gapAnalysisDesc: 'We identify EXACTLY what signals are missing from your profile to pass high-risk ATS filters.',
      autoFix: 'AI Auto-Fix',
      autoFixDesc: 'One-click AI rewriting that intelligently integrates missing signals into your existing resume narrative.',
      premiumTitle: 'Elite Match Tool is Premium',
      premiumSubtitle: 'Analyze your resume against any offer using local ML (0 API costs)',
      premiumFeatures: '• Entity extraction with TF-IDF & Cosine Similarity\n• Critical/important/nice-to-have gap analysis\n• Robot View with red/green zones\n• Specific Auto-Fix suggestions',
      scoreTitle: 'Match Score',
      scoreExcellent: 'Excellent match! Apply with confidence.',
      scoreGood: 'Good match, but there are important gaps.',
      scoreNeedsWork: 'You need to improve your resume for this offer.',
      missingCritical: 'Missing Critical Signals',
      matchedSkills: 'Matched Skills',
      robotViewTitle: 'Robot View',
      redZones: 'Red Zones',
      greenZones: 'Green Zones',
      recommendations: 'Auto-Fix Recommendations',
      analyzeAnother: 'Analyze Another Job',
      applyFix: 'Apply Auto-Fix',
      applyFixSuccess: 'Auto-Fix suggestions copied! Navigate to Edit tab to apply changes.',
      analyzingStep1: 'Extracting Recruiter Intent...',
      analyzingStep2: 'Analyzing Hard Skills Requirements...',
      analyzingStep3: 'Detecting Soft Skills Signals...',
      analyzingStep4: 'Generating Missing Signals Report...',
      errorAnalyzing: 'Error analyzing the match: ',
      errorUnknown: 'Unknown error',
    },
    ecosystem: {
      copyPasteTip: {
        badge: 'GRATUIT',
        title: '💡 Astuce Pro : Copiez depuis LinkedIn',
        description: 'Allez sur une offre d\'emploi sur LinkedIn → Sélectionnez tout le texte → Ctrl+C → Collez-le dans \'Ajouter description du poste\'. Automatique, sans extensions.',
        actionLabel: 'Compris',
        successMessage: 'Parfait ! Utilisez Ctrl+C sur n\'importe quelle offre d\'emploi.',
      },
      linkedinReminder: {
        badge: 'GRATUIT',
        title: '🔗 Rappel : Mettez à jour LinkedIn',
        description: 'Votre CV est à {score}%. 89% des recruteurs recherchent sur LinkedIn avant d\'appeler. Copiez les améliorations de votre CV sur votre profil LinkedIn.',
        actionLabel: 'Aller sur LinkedIn',
      },
      keyboardShortcuts: {
        badge: 'GRATUIT',
        title: '⌨️ Raccourcis Clavier',
        description: 'Ctrl+V pour coller rapidement la description du poste. Esc pour fermer les modales. Travaillez plus vite sans quitter le clavier.',
        actionLabel: 'Voir Plus de Raccourcis',
        infoMessage: 'Raccourcis : Ctrl+V (coller JD), Esc (fermer), Tab (naviguer)',
      },
      dismissLabel: 'Pas intéressé',
      freeLabel: '100% GRATUIT',
      bookmarklet: {
        title: 'Scanner Installation (1 minute)',
        step1Title: 'Copy the bookmarklet',
        step1Copy: 'Copy Bookmarklet',
        step1Copied: 'Copied!',
        step2Title: 'Create a bookmark',
        step2Instructions: ['Right-click on the bookmarks bar', 'Select "Add page"', 'Name: "Job Scanner"', 'URL: Paste the copied code'],
        step3Title: 'Use it on any site',
        step3Description: 'Go to LinkedIn, Indeed, or any job posting → Click the "Job Scanner" bookmark → Text will be extracted → Paste it in your resume analyzer',
        proTip: 'Works on ANY website. LinkedIn, Indeed, Glassdoor, company X...',
        successCopied: 'Bookmarklet copied! Now drag it to your bookmarks bar.',
        openingChecklist: 'Opening LinkedIn checklist...',
        comingSoon: 'Coming soon: Recruiter email analyzer',
      },
    },
  },
  'de': {
    hero: {
      title: 'Hören Sie auf zu raten, warum Sie ignoriert werden.',
      subtitle: 'Beheben Sie die unsichtbaren Fehler Ihres Lebenslaufs und erhalten Sie in 7 Tagen Vorstellungsgespräche.',
      ctaPrimary: 'Roboter-Ansicht sehen - Kostenlos',
      ctaSecondary: 'Für vollen Zugang anmelden',
      trustIndicator: 'Keine Kreditkarte • Keine Anmeldung • Sofortergebnisse in 10 Sekunden',
    },
    features: {
      robotView: 'Roboter-Ansicht Terminal',
      keywordGap: 'Fehlende Signal-Detektor',
      seniorityMatch: 'Senior-Level Audit',
      instantScan: 'Sofortiger ATS-Score',
    },
    pricing: {
      free: 'Kostenloser Scan',
      pass24h: '24-Stunden-Pass',
      sprint7d: '7-Tage-Sprint',
      currency: '€',
      enterprise: {
        badge: 'Unternehmen',
        title: 'Skalieren Sie Ihre Einstellung',
        subtitle: 'Ohne Kompromisse',
        description: 'Entwickelt für Recruiting-Teams, die Tausende von Bewerbungen bearbeiten. Erhalten Sie Mengenrabatte, dedizierten Support und individuelle Integrationen.',
        contactSales: 'Vertrieb Kontaktieren',
        viewPricing: 'Preise Ansehen',
        feature1: 'Team-Management',
        feature1Desc: 'Zentralisiertes Dashboard für HR-Teams zur Verfolgung aller Bewerbungen',
        feature2: 'SOC 2 Konform',
        feature2Desc: 'Sicherheit auf Unternehmensniveau mit SSO und rollenbasierter Zugriffskontrolle',
        feature3: 'API-Zugang',
        feature3Desc: 'Integrieren Sie ATS-Scanning direkt in Ihren Recruiting-Workflow',
      },
    },
    pricingLanding: {
      title: 'Einfache Preise',
      subtitle: 'Einmal zahlen. Für immer beheben. Keine Abonnements.',
      // Free tier
      freeTitle: 'FREE Debug',
      freeSubtitle: 'Entdecken Sie, welche Keywords der Roboter NICHT sieht',
      freeScanButton: 'Kostenlos Scannen',
      freeFeature1: 'Unsichtbarkeits-Erkennung (2 Keywords)',
      freeFeature2: 'Globaler ATS-Score',
      freeFeature3: 'Roboter-Ansicht (gesperrt)',
      freeFeature4: 'Vorschau Senioritäts-Match',
      freeGuarantee: '✓ LESBARE VORLAGE GARANTIERT',
      // Single debug fix (€5.99)
      singleDebugBadge: 'EINMAL BEHEBEN',
      singleDebugTitle: 'Schnelle Lösung',
      singleDebugSubtitle: 'Beheben Sie Ihren Lebenslauf für den Preis eines Kaffees',
      singleDebugButton: 'Meinen CV Reparieren →',
      singleDebugFeature1: '1 Vollständiger Tiefen-Scan',
      singleDebugFeature2: 'Roboter-Ansicht Freigeschaltet',
      singleDebugFeature3: '1 KI-Optimierung (Neuschreiben)',
      singleDebugFeature4: 'Auto-Keyword-Injektion',
      singleDebugFeature5: 'Optimierten CV Exportieren',
      singleDebugGuarantee: '✓ LESBARE VORLAGE GARANTIERT',
      // 24h Pass (€14.99)
      pass24hBadge: 'SCHNELLE LÖSUNG / DRINGEND',
      pass24hTitle: '24h Pass',
      pass24hSubtitle: 'Sofortiges Debugging für das morgige Interview',
      pass24hButton: '24h Zugang →',
      pass24hFeature1: 'Unbegrenzte Scans (24h)',
      pass24hFeature2: 'Vollständige Roboter-Röntgenansicht',
      pass24hFeature3: '[FEHLER] + [WARNUNG] + Behebungs-Tags',
      pass24hFeature4: 'Keyword-Lücken-Detektor',
      pass24hFeature5: 'Anschreiben-Generator',
      pass24hFeature6: '100% ATS-Lesbare Vorlage',
      pass24hGuarantee: '✓ GARANTIERT',
      // 7 Day Sprint (€24.99)
      sprint7dBadge: 'INTENSIV / EMPFOHLEN',
      sprint7dTitle: '7-Tage-Sprint',
      sprint7dSubtitle: 'Bestien-Modus. Vollständiger 7-Tage-Angriff',
      sprint7dBeforePrice: '€49.99',
      sprint7dButton: '7-Tage-Sprint Starten →',
      sprint7dFeature1: 'Unbegrenzte Scans (7 Tage)',
      sprint7dFeature2: 'Branchen-Auswahl (FAANG/Finanzen)',
      sprint7dFeature3: 'Stichpunkt-Ton-Elevator (KI-Neuschreiben)',
      sprint7dFeature4: 'Interview-Kampfplan',
      sprint7dFeature5: 'DM-Skripte für Recruiter',
      sprint7dFeature6: 'Anschreiben + LinkedIn-Optimierer',
      sprint7dGuarantee: '✓ 100% LESBARE VORLAGE GARANTIERT',
    },
    pricingDialog: {
      quickFix: 'Schnelle Lösung',
      pass24h: '24h Pass',
      price24h: '€14.99',
      access24h: '24-Stunden-Zugang',
      unlimitedScans24h: 'Unbegrenzte Scans (24h)',
      fullErrorReport: 'Vollständiger [FEHLER] Bericht',
      robotXRayView: 'Roboter-Röntgenansicht',
      keywordOptimizer: 'Keyword-Optimierer',
      battlePlanGenerator: 'Kampfplan-Generator',
      get24hPass: '24h Pass Erhalten',
      sprint7d: '7-Tage-Sprint',
      price7d: '€39.99',
      access7d: '7-Tage-Zugang',
      unlimitedScans7d: 'Unbegrenzte Scans (7 Tage)',
      recommended: 'EMPFOHLEN',
      tryFree: 'Kostenlos Testen',
      noThanksJust24h: 'Nein danke, nur 24h Pass',
      title: 'Einfache, Transparente Preise',
      subtitle: 'Einmalige Zahlungen für professionelle Ergebnisse. Keine wiederkehrenden Abonnements oder versteckte Gebühren.',
      start7DaySprint: '7-Tage-Sprint Starten 🚀',
      secureCheckout: 'Sichere 256-Bit-Verschlüsselte Kasse',
      // Upsell section
      waitBeforeCheckout: '⚠️ WARTEN SIE! Bevor Sie bezahlen...',
      applyingToOneJob: 'Bewerben Sie sich nur auf EINEN Job?',
      justMoreGetSprint: 'Für nur €10 mehr erhalten Sie den Interview Sprint.',
      whyUpgrade: 'Warum upgraden?',
      save60: 'Sparen Sie 60%',
      unlimitedScansNotOne: 'Unbegrenzte Scans für 7 Tage (nicht nur einen)',
      aiCoverLetters: 'KI-generierte Anschreiben für jede Bewerbung',
      linkedinOptimization: 'LinkedIn-Profiloptimierung inklusive',
      candidatesChoseSprint: '1,200+ Kandidaten wählten Interview Sprint und bekamen Jobs bei:',
      upgradeToSprint: 'Ja, auf Sprint upgraden (€24.99) 🚀',
      // More hardcoded strings
      scorePreview: 'Score-Vorschau',
      errorLabels: '[FEHLER]-Labels',
      topKeywords: 'Top 2 Schlüsselwörter',
      bestValue: 'BESTER WERT',
      sevenDaySprint: '7-Tage-Sprint',
      sevenDaysAccess: '7 Tage voller Zugriff',
      unlimitedCVScans: 'Unbegrenzte CV-Scans (7T)',
      robotViewTerminal: 'Roboter-Ansicht-Terminal',
      missingSignalsDetector: 'Fehlende-Signale-Detektor',
      seniorityMatchAudit: 'Erfahrungsstufen-Audit',
      industrySelectorFAANG: 'Branchenauswahl (FAANG/Finanzen)',
      bulletToneElevator: 'Stichpunkt-Ton-Elevator',
      bonusExtras: 'Bonus-Extras:',
      coverLetterGen: 'Anschreiben-Generator',
      linkedinOptimizer: 'LinkedIn-Optimierer',
      devsJoined: '1,200+ Entwickler sind beigetreten',
      sprintTestimonial: '"Sprint half mir, Bugs zu beheben und 5 Interviews in 1 Woche zu bekommen"',
      fastStart: 'SCHNELLER START',
      loginToPurchase: 'Melden Sie sich an, um Guthaben zu kaufen',
      checkoutFailed: 'Checkout-Start fehlgeschlagen',
      checkoutError: 'Checkout-Initialisierung fehlgeschlagen',
    },
    dashboard: {
      welcome: 'Willkommen zurück',
      uploadCv: 'Laden Sie Ihren Lebenslauf hoch',
      analyzing: 'Analysiere deinen Lebenslauf...',
      score: 'ATS-Score',
      issues: 'Gefundene Probleme',
      signIn: 'Anmelden',
      continueDashboard: 'Weiter zum Dashboard',
      welcomeBack: 'Willkommen zurück',
      uploadMasterCv: 'Laden Sie Ihren Hauptlebenslauf hoch',
      uploadToStart: 'Lebenslauf hochladen um zu starten',
      noKeywordsYet: 'Noch keine Schlüsselwörter',
      noResumeFound: 'Kein Lebenslauf Gefunden',
      uploadToSeeATS: 'Laden Sie einen Lebenslauf hoch, um zu sehen, wie ATS-Roboter Ihr Dokument interpretieren.',
      uploadToSeeText: 'Laden Sie einen Lebenslauf hoch, um die Rohtext-Extraktion zu sehen',
      resumeEditor: 'Lebenslauf-Editor',
      downloadAsTxt: 'Als .txt herunterladen',
      noResumeLoaded: 'Kein Lebenslauf geladen. Laden Sie einen Lebenslauf vom Dashboard hoch, um mit der Bearbeitung zu beginnen.',
      uploadToGetStarted: 'Laden Sie einen Lebenslauf hoch, um zu beginnen',
      masterCvs: 'Hauptlebensläufe',
      tools: 'KI-Werkzeuge',
      applications: 'Bewerbungen',
      match: 'Elite Match',
      missionControl: 'Missionskontrolle',
      keywordSniper: 'Keyword-Scharfschütze',
      writingForge: 'Schreib-Schmiede',
      bulletRewriter: 'Aufzählungsumschreiber',
      coverLetterGen: 'Anschreiben',
      linkedinOptimizer: 'LinkedIn-Optimierer',
      upgradeToFix: 'Upgrade zum Beheben',
      aiRewrite: 'KI-Umschreibung',
      addJob: 'Job Hinzufügen',
      toolsMenu: 'Werkzeuge',
      visibilityDebugger: 'Sichtbarkeits-Debugger',
      autoRejectDetected: 'AUTO-ABLEHNUNG ERKANNT',
      criticalError: 'KRITISCHER FEHLER',
      // Success Insights
      successInsights: 'Erfolgs-Einblicke',
      personalizedAnalytics: 'Personalisierte Analysen bald verfügbar',
      trackApplicationsToUnlock: 'Verfolgen Sie 3+ Bewerbungen und erhalten Sie Ihr erstes Interview, um personalisierte Einblicke freizuschalten',
      personalDataMoat: 'Ihr persönlicher Datenvorteil erwartet Sie',
      yourPersonalDataAdvantage: 'Ihr persönlicher Datenvorteil',
      moat: 'VORTEIL',
      vsAverage: 'vs Durchschnitt',
      successRateLabel: 'Erfolgsrate',
      applicationsCount: 'Bewerbungen',
      interviewsCount: 'Interviews',
      topPerformingKeywords: 'Top-performante Schlüsselwörter',
      dataUniqueToYou: '🔒 Diese Daten sind einzigartig für Sie und können nicht von Wettbewerbern repliziert werden',
    },
    resumeDetail: {
      linkedinUpsellTitle: 'CV Optimiert → LinkedIn ist als Nächstes',
      linkedinUpsellDescription: 'Ihr CV ist bereit (Score: {score}%). 89% der Recruiter prüfen LinkedIn vor der Kontaktaufnahme. Verlieren Sie keine Chancen durch ein veraltetes Profil.',
      optimizeLinkedIn: 'LinkedIn Jetzt Optimieren',
      maybeLater: 'Später Vielleicht',
      checkLinkedIn: 'prüfen LinkedIn',
      moreCallbacks: 'mehr Rückrufe',
      zeroMetricsTitle: 'NULL METRIKEN = AUTO-ABLEHNUNG',
      businessImpact: 'GESCHÄFTLICHE AUSWIRKUNG:',
      atsAutoReject: 'der ATS-Systeme lehnen Lebensläufe ohne Zahlen automatisch ab',
      recruitersSpend6Seconds: 'Recruiter verbringen 6 Sekunden - Metriken ziehen sofort Aufmerksamkeit an',
      higherCallbackRate: 'höhere Rückrufrate bei quantifizierbaren Erfolgen',
      immediateFix: 'SOFORTIGE LÖSUNG:',
      increasedSales: 'Umsatzsteigerung um',
      reducedCosts: 'Kostensenkung um',
      ledTeam: 'Leitung eines Teams von',
      editTab: 'Bearbeiten',
      robotView: 'Roboter-Ansicht',
      progressTab: 'Fortschritt',
      actionPlanTab: 'Aktionsplan',
      interviewTab: 'Interview',
      recruiterTab: 'Recruiter',
      apply: 'Anwenden',
      optimizing: 'Optimierung...',
      reanalyze: 'Neu Analysieren',
      cancel: 'Abbrechen',
    },
    previewScan: {
      title: 'Tiefgehender Diagnosescan',
      subtitle: 'Sehen Sie genau, wie ATS-Systeme Ihren Lebenslauf analysieren - keine Anmeldung erforderlich',
      dropHere: 'Legen Sie Ihren Lebenslauf hier ab',
      orBrowse: 'oder klicken Sie zum Durchsuchen der Dateien',
      supports: 'Unterstützt PDF, Word und Bilder',
      addJobDesc: 'Zielbeschreibung hinzufügen für bessere Übereinstimmung (optional)',
      targetJobPosition: 'Zielposition',
      jobDescPlaceholder: 'Fügen Sie hier die vollständige Stellenbeschreibung ein...',
      jobDescAdded: 'Stellenbeschreibung hinzugefügt - verbessert die Schlüsselwortanalyse',
    },
    nav: {
      features: 'Funktionen',
      pricing: 'Preise',
      login: 'Anmelden',
      logIn: 'Anmelden',
      signUp: 'Registrieren',
      dashboard: 'Dashboard',
      blog: 'Blog',
      product: 'Produkt',
    },
    buttons: {
      uploadResume: 'Lebenslauf hochladen',
      uploadNewCv: 'Neuen Lebenslauf hochladen',
      tryFree: 'Kostenlos testen',
      getSingleScan: 'Einzelnen Scan erhalten',
      startSprint: 'Sprint starten',
      checkMyResume: 'Meinen Lebenslauf prüfen',
      seeHowItWorks: 'So funktioniert es',
      viewFullReport: 'Vollständigen Bericht anzeigen',
      managePlan: 'Plan verwalten',
      upgradeNow: 'Jetzt upgraden',
      buyMoreCredits: 'Mehr Credits kaufen',
      launchTool: 'Tool starten',
    },
    navbar: {
      analyzer: 'Analysator',
      tools: 'Werkzeuge',
      pricing: 'Preise',
      dashboard: 'Dashboard',
      login: 'Anmelden',
      scanResume: 'Lebenslauf scannen',
      scan: 'Scannen',
    },
    auth: {
      loading: 'Sitzung wird initialisiert...',
      analyzing: 'STRUKTUR_ANALYSIEREN...',
      parsing: 'SCHLÜSSELWÖRTER_PARSEN...',
      optimizing: 'ATS_SCORE_OPTIMIEREN...',
      headline: 'Debuggen Sie Ihre Karrieregeschichte mit Präzision.',
      subtitle: 'Schließen Sie sich Tausenden von Arbeitssuchenden an, die ihre Lebensläufe mit KI-gestützter Analyse optimiert und ihren Traumjob gefunden haben.',
      initSession: 'Sitzung initialisieren',
      enterCredentials: 'Geben Sie Ihre Anmeldedaten ein, um auf die Konsole zuzugreifen',
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      noAccount: 'Kein Konto gefunden?',
      haveAccount: 'Haben Sie bereits ein Konto?',
      deployNew: '[Neues Profil erstellen]',
      signInLink: '[Anmelden]',
      version: 'v2.4.0-stable',
      systemStatus: 'System Betriebsbereit',
      blueprintTitle: 'Debuggen Sie Ihren Lebenslauf wie ein Profi',
      blueprintSubtitle: 'Schließen Sie sich Tausenden von Arbeitssuchenden an, die ihre Lebensläufe mit KI-gestützten Insights optimiert und ihre Traumjobs bekommen haben.',
      blueprintDescription: 'Schließen Sie sich Tausenden von Arbeitssuchenden an, die ihre Lebensläufe mit KI-gestützten Insights optimiert und ihre Traumjobs bekommen haben.',
      feature1Title: 'ATS-Roboter-Vision',
      feature1Desc: 'Sehen Sie genau, was die Systeme der Personalvermittler sehen',
      feature2Title: 'KI-gestützte Analyse',
      feature2Desc: 'Erhalten Sie sofortiges Feedback zu Schlüsselwörtern, Format und Wirkung',
      feature3Title: 'Bewerbungen Verfolgen',
      feature3Desc: 'Verwalten Sie Ihre Jobsuche an einem Ort',
      termsAgreement: 'Indem Sie fortfahren, stimmen Sie unseren Nutzungsbedingungen und Datenschutzrichtlinien zu',
      atsVision: 'ATS-Roboter-Vision',
      atsVisionDesc: 'Sehen Sie genau, was die Systeme der Personalvermittler sehen',
      aiAnalysis: 'KI-gestützte Analyse',
      aiAnalysisDesc: 'Erhalten Sie sofortiges Feedback zu Schlüsselwörtern, Format und Wirkung',
      trackApps: 'Bewerbungen Verfolgen',
      trackAppsDesc: 'Verwalten Sie Ihre Jobsuche an einem Ort',
    },
    sidebar: {
      home: 'Startseite',
      myResumes: 'Meine Lebensläufe',
      aiTools: 'KI-Tools',
      eliteMatch: 'Elite Match',
      settings: 'Einstellungen',
      adminPanel: 'Admin-Panel',
      sprintActive: 'Sprint Aktiv',
      days: 'TAGE',
      hours: 'STD',
      minutes: 'MIN',
      managePlan: 'Plan verwalten',
      upgradeNow: 'Jetzt upgraden',
      proPlan: 'Pro-Plan',
      freePlan: 'Kostenloser Plan',
    },
    common: {
      loading: 'Wird geladen...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      landingPage: 'Startseite',
      signOut: 'Abmelden',
      upload: 'Hochladen',
      download: 'Herunterladen',
      edit: 'Bearbeiten',
    },
    showcase: {
      badge: 'Kostenloser ATS-Scanner',
      heading: 'ATS-Systeme Schlagen',
      subheading: 'In 10 Sekunden',
      description: 'Sehen Sie Ihren Lebenslauf so, wie Roboter ihn sehen. Erhalten Sie sofortiges Feedback und landen Sie mehr Vorstellungsgespräche.',
      robotTech: 'Roboter-Ansicht Technologie',
      robotDesc: 'Sehen Sie genau, was ATS-Roboter sehen - kein Raten',
      instantScore: 'Sofortiger ATS-Score',
      instantDesc: 'Erhalten Sie Ihren Kompatibilitätswert in 10 Sekunden',
      smartKeyword: 'Intelligente Schlüsselwort-Analyse',
      smartDesc: 'KI-gestützte Übereinstimmung mit Stellenbeschreibungen',
      enterpriseSec: 'Unternehmenssicherheit',
      enterpriseDesc: 'Ihre Daten bleiben privat und sicher',
      ctaBanner: 'Holen Sie sich Ihren Kostenlosen ATS-Score',
      ctaSubtext: 'Scannen Sie Ihren Lebenslauf in 10 Sekunden - keine Anmeldung',
      ctaButton: 'Kostenlosen Scan Testen →',
    },
    comparison: {
      badge: 'Realitätscheck',
      heading: 'Was Sie sehen vs. Was sie sehen',
      description: 'Die meisten modernen Lebenslauf-Vorlagen sehen für Menschen großartig aus, sind aber ein Albtraum für Roboter. Spalten, Symbole und Grafiken brechen oft die Analyse-Logik.',
      humanView: 'Menschliche Ansicht (PDF)',
      robotView: 'Roboter-Ansicht (Analysiert)',
    },
    footer: {
      description: 'Schlagen Sie ATS-Systeme mit KI-gestützter Lebenslauf-Optimierung. Schneller eingestellt werden.',
      product: 'Produkt',
      pricing: 'Preise',
      freeScanner: 'Kostenloser Scanner',
      blog: 'Blog',
      resources: 'Ressourcen',
      aboutUs: 'Über Uns',
      contactUs: 'Kontaktieren Sie Uns',
      legal: 'Rechtliches',
      privacy: 'Datenschutzrichtlinie',
      terms: 'Allgemeine Geschäftsbedingungen',
      copyright: '© 2026 CVDebug Inc. Alle Rechte vorbehalten. Systemstatus:',
      systemStatus: 'Systemstatus:',
      online: 'Online',
    },
    landing: {
      nav: {
        features: 'Funktionen',
        pricing: 'Preise',
        login: 'Anmelden',
        signUp: 'Registrieren',
      },
      hero: {
        title: 'Debuggen Sie Ihren Lebenslauf Wie ein Profi',
        subtitle: 'Hören Sie auf, abgelehnt zu werden. Sehen Sie genau, was ATS-Systeme sehen und beheben Sie es in Minuten.',
        startButton: 'Kostenlosen Scan Starten',
        viewDemo: 'Demo Ansehen',
      },
      socialProof: {
        trustedBy: 'Vertraut von Jobsuchenden bei',
      },
      stats: {
        stat1: 'Über 50.000 Lebensläufe analysiert',
        stat2: '89% höhere Interviewrate',
        stat3: '10-Sekunden Scanzeit',
        stat4: 'Sicherheit auf Unternehmensniveau',
      },
      cta: {
        badge: 'Loslegen',
        heading: 'Bereit, Ihren Traumjob zu bekommen?',
        description: 'Schließen Sie sich Tausenden erfolgreicher Jobsuchender an, die ihre Lebensläufe mit CVDebug verbessert haben.',
        buttonText: 'Jetzt Kostenlosen Scan Starten',
        footerText: 'Keine Kreditkarte erforderlich',
        secondary: 'Haben Sie noch Fragen? Probieren Sie jetzt unseren kostenlosen ATS-Scanner aus',
        button: 'Scannen Sie Ihren Lebenslauf Kostenlos →',
      },
      faq: {
        heading: 'Häufig Gestellte Fragen',
        question1: 'Was ist ein ATS-System?',
        answer1: 'ATS (Applicant Tracking System) ist eine Software, die Unternehmen verwenden, um Lebensläufe zu filtern, bevor sie menschliche Recruiter erreichen. Die meisten großen Unternehmen verwenden ATS, und es kann bis zu 75% der Lebensläufe ablehnen.',
        question2: 'Wie hilft mir CVDebug?',
        answer2: 'CVDebug zeigt Ihnen genau, wie ATS-Systeme Ihren Lebenslauf analysieren, identifiziert fehlende Schlüsselwörter und bietet umsetzbare Empfehlungen zur Verbesserung Ihres ATS-Scores.',
        question3: 'Sind meine Daten sicher?',
        answer3: 'Ja! Wir verwenden Verschlüsselung auf Unternehmensniveau und geben Ihre Daten niemals an Dritte weiter. Ihr Lebenslauf wird sicher verarbeitet und nach der Analyse gelöscht, es sei denn, Sie speichern ihn.',
        stillHaveQuestions: 'Haben Sie noch Fragen? Probieren Sie jetzt unseren kostenlosen ATS-Scanner aus',
        tryFreeScan: 'Scannen Sie Ihren Lebenslauf Kostenlos →',
      },
      testimonials: {
        badge: 'Reddit Liebeswand',
        heading: 'Vertraut von Redditors Weltweit',
        subheading: 'Echtes Feedback von r/resumes, r/developersIndia, r/cscareerquestions, und mehr.',
        subtitle: 'Echtes Feedback von r/resumes, r/developersIndia, r/cscareerquestions, und mehr.',
        joinThousands: 'Schließen Sie sich Tausenden von Jobsuchenden an, die ihre Lebensläufe optimieren',
        subreddits: 'r/resumes, r/developersIndia, r/cscareerquestions, r/ProductManagement, r/datascience',
      },
      enterprise: {
        badge: 'Unternehmen',
        title: 'Skalieren Sie Ihre Einstellung',
        subtitle: 'Ohne Kompromisse',
        description: 'Entwickelt für Recruiting-Teams, die Tausende von Bewerbungen bearbeiten. Erhalten Sie Mengenrabatte, dedizierten Support und individuelle Integrationen.',
        contactSales: 'Vertrieb Kontaktieren',
        viewPricing: 'Preise Ansehen',
        feature1: 'Team-Management',
        feature1Desc: 'Zentralisiertes Dashboard für HR-Teams zur Verfolgung aller Bewerbungen',
        feature2: 'SOC 2 Konform',
        feature2Desc: 'Sicherheit auf Unternehmensniveau mit SSO und rollenbasierter Zugriffskontrolle',
        feature3: 'API-Zugang',
        feature3Desc: 'Integrieren Sie ATS-Scanning direkt in Ihren Recruiting-Workflow',
      },
      finalCta: {
        heading: 'Bereit, Ihre Karriere zu debuggen?',
        description: 'Schließen Sie sich über 10.000 Entwicklern an, die ihre Parsing-Fehler behoben und ihre Interview-Rate verdoppelt haben.',
        button: 'Meine Sichtbarkeit Prüfen (Kostenloser Scan)',
        footer: 'Keine Kreditkarte erforderlich • DSGVO-konform • Sofortiges Ergebnis',
      },
    },
    onboarding: {
      steps: {
        role: 'Rolle',
        upload: 'Hochladen',
        scan: 'Scannen',
      },
      roleSelection: {
        heading: 'Welche Position streben Sie an?',
        editLink: 'Bearbeiten',
        continueButton: 'Weiter',
      },
      cvUpload: {
        heading: 'Laden Sie Ihren Lebenslauf Hoch',
        description: 'Legen Sie Ihre Lebenslauf-Datei ab oder klicken Sie zum Durchsuchen',
        clickToUpload: 'Klicken zum Hochladen',
        dragDrop: 'oder Drag & Drop',
        maxSize: 'PDF, DOC, DOCX bis 10MB',
        log1: '[INIT] Dokumentstruktur wird analysiert...',
        log2: '[SCAN] Schlüsselwörter und Formatierung werden analysiert...',
        log3: '[CHECK] ATS-Kompatibilitätsprüfungen werden ausgeführt...',
        log4: '[MATCH] Vergleich mit Jobanforderungen...',
        log5: '[SCORE] Endgültiger Score wird berechnet...',
        log6: '[DONE] Analyse abgeschlossen!',
        systemLogs: 'Systemprotokolle',
        backButton: 'Zurück',
        scanButton: 'Lebenslauf Scannen',
      },
      helpCenter: {
        label: 'Hilfezentrum',
      },
    },
    pricingPage: {
      freePlan: {
        name: 'Kostenloser Scan',
        description: 'Perfekt zum Ausprobieren von CVDebug',
        price: '0',
        period: 'einmalig',
        feature1: '1 kostenloser Lebenslauf-Scan',
        feature2: 'Basis ATS-Score',
        feature3: 'Roboter-Ansicht Vorschau',
        feature4: 'Schlüsselwort-Analyse',
        button: 'Kostenlosen Scan Starten',
      },
      pass24h: {
        name: '24-Stunden-Pass',
        description: 'Unbegrenzte Scans für einen Tag',
        price: '9',
        period: '24 Stunden',
        feature1: 'Unbegrenzte Lebenslauf-Scans',
        feature2: 'Vollständiger ATS-Kompatibilitätsbericht',
        feature3: 'Detaillierte Schlüsselwort-Analyse',
        feature4: 'Formatierungsempfehlungen',
        feature5: 'PDF-Berichte herunterladen',
        feature6: 'E-Mail-Support',
        feature7: '24-Stunden Zugang',
        button: '24-Stunden-Pass Erhalten',
      },
      sprint7d: {
        name: '7-Tage-Sprint',
        description: 'Perfekt für die Jobsuche',
        price: '29',
        period: '7 Tage',
        feature1: 'Alles im 24-Stunden-Pass',
        feature2: 'Unbegrenzte Lebenslauf-Versionen',
        feature3: 'KI-gestützte Optimierung',
        feature4: 'Individuelle Job-Zuordnung',
        feature5: 'Prioritäts-Support',
        feature6: 'Zugang zum Lebenslauf-Builder',
        feature7: 'Anschreiben-Analyse',
        feature8: 'LinkedIn-Optimierungstipps',
        feature9: '7-Tage Zugang',
        button: '7-Tage-Sprint Starten',
        recommended: 'Beliebteste',
      },
      hero: {
        badge: 'Preise',
        title: 'Wählen Sie Ihren Plan',
        subtitle: 'Holen Sie sich den perfekten Plan für Ihre Jobsuche',
      },
      faq: {
        heading: 'Preis-FAQ',
        question1: 'Kann ich jederzeit kündigen?',
        answer1: 'Ja! Sie können Ihr Abonnement jederzeit kündigen. Keine Fragen gestellt.',
        question2: 'Welche Zahlungsmethoden akzeptieren Sie?',
        answer2: 'Wir akzeptieren alle gängigen Kreditkarten, PayPal und Apple Pay.',
        question3: 'Gibt es eine Rückerstattungsrichtlinie?',
        answer3: 'Ja, wir bieten eine 7-Tage-Geld-zurück-Garantie, wenn Sie mit unserem Service nicht zufrieden sind.',
        question4: 'Kann ich meinen Plan upgraden?',
        answer4: 'Absolut! Sie können jederzeit von jedem Plan auf eine höhere Stufe upgraden.',
        question5: 'Bieten Sie Rabatte an?',
        answer5: 'Ja! Wir bieten Studentenrabatte und Mengenpreise für Karrierezentren. Kontaktieren Sie uns für Details.',
        question6: 'Was passiert nach Ablauf meines Plans?',
        answer6: 'Sie behalten Zugriff auf Ihre gespeicherten Berichte, müssen aber erneuern, um neue Scans zu erstellen.',
      },
      guarantee: '30-Tage-Geld-zurück-Garantie',
    },
    modals: {
      subscription: {
        title: 'Abonnementstatus',
        tier: 'Aktuelle Stufe',
        accessMessage: 'Sie haben vollen Zugriff auf alle Funktionen',
        upgradeMessage: 'Upgraden Sie, um Premium-Funktionen freizuschalten',
        viewOptions: 'Optionen Anzeigen',
        continueDashboard: 'Weiter zum Dashboard',
        pressEsc: 'Drücken Sie ESC zum Schließen',
        premium: 'Premium',
        interviewSprint: '7-Tage-Sprint',
        singleScan: '24-Stunden-Pass',
        freePlan: 'Kostenloser Plan',
        scoreChanged: 'Ihr Score hat sich geändert? Hier ist warum',
        nowMatching: 'Wir vergleichen Ihren Lebenslauf jetzt mit Branchenstandards.',
        realVisibility: 'Ihre tatsächliche Sichtbarkeit ist',
        whyLower: 'Der Vorschau-Scan war eine schnelle Prüfung. Das Dashboard zeigt Ihre tatsächliche ATS-Kompatibilität.',
        industryStandards: 'Wir vergleichen mit echten Anforderungen des Arbeitsmarktes.',
      },
      logout: {
        title: 'Abmelden',
        question: 'Sind Sie sicher, dass Sie sich abmelden möchten?',
        stayButton: 'Angemeldet Bleiben',
        logoutButton: 'Abmelden',
      },
      creditsExhausted: {
        title: 'Credits Aufgebraucht',
        message: 'Sie haben alle Ihre kostenlosen Scans verwendet',
        scoreLabel: 'Ihr Score',
        warning: 'Upgraden Sie, um Ihre vollständige Analyse zu sehen',
        feature1: 'Detaillierter ATS-Kompatibilitätsbericht',
        feature2: 'Schlüsselwort-Optimierungsvorschläge',
        price: '9€',
        unlockButton: 'Vollständigen Bericht Freischalten',
        maybeLater: 'Vielleicht Später',
      },
    },
    toasts: {
      errors: {
        selectRating: 'Bitte wählen Sie eine Bewertung',
        submissionFailed: 'Feedback-Übermittlung fehlgeschlagen',
        fileRequired: 'Bitte wählen Sie eine Datei',
        invalidFormat: 'Ungültiges Dateiformat',
        uploadFailed: 'Upload fehlgeschlagen',
        aiProcessingError: 'KI-Verarbeitungsfehler',
        fetchError: 'Daten konnten nicht abgerufen werden',
        unauthorized: 'Unbefugter Zugriff',
        noCredits: 'Keine Credits mehr verfügbar. Bitte upgraden, um fortzufahren.',
        apiKeyNotConfigured: 'API-Schlüssel nicht konfiguriert. Bitte kontaktieren Sie den Support unter cvdebug@outlook.com',
        noTransactionId: 'Keine Transaktions-ID verfügbar',
        checkoutError: 'Checkout konnte nicht gestartet werden',
        loginRequired: 'Bitte einloggen, um Credits zu kaufen',
        initiateError: 'Zahlung konnte nicht initiiert werden',
      },
      success: {
        feedbackSubmitted: 'Vielen Dank für Ihr Feedback!',
        cvUploaded: 'CV Erfolgreich Hochgeladen!',
        saved: 'Änderungen gespeichert!',
        deleted: 'Erfolgreich gelöscht',
        updated: 'Erfolgreich aktualisiert',
        copied: 'In Zwischenablage kopiert!',
        downloaded: 'Erfolgreich heruntergeladen',
        generated: 'Erfolgreich generiert!',
        optimized: 'Erfolgreich optimiert!',
        applied: 'Erfolgreich angewendet!',
      },
      warnings: {
        fileTooLarge: 'Datei ist zu groß',
        limitReached: 'Limit erreicht',
        replaceBrackets: 'Vergessen Sie nicht, die Werte [in eckigen Klammern] durch Ihre tatsächlichen Zahlen zu ersetzen!',
      },
    },
    images: {
      userAvatar: 'Benutzer-Avatar',
      logo: 'CVDebug-Logo',
      feature: 'Feature-Illustration',
    },
    admin: {
      title: 'Admin-Panel',
      users: 'Benutzer',
      analytics: 'Analytics',
      settings: 'Einstellungen',
      import: {
        syncComplete: 'Synchronisierung Abgeschlossen',
        syncFailed: 'Synchronisierung Fehlgeschlagen',
        importFailed: 'Import Fehlgeschlagen',
        importSuccess: 'Import Erfolgreich',
      },
      grant: {
        emailPlaceholder: 'benutzer@beispiel.de oder user_2...',
        namePlaceholder: 'Max Mustermann',
        planPlaceholder: 'Plan auswählen',
      },
      payment: {
        emailPlaceholder: 'Benutzer-E-Mail',
      },
      payments: {
        received: '💰 Neue Zahlung Erhalten!',
      },
      usersTable: {
        searchPlaceholder: 'Benutzer suchen...',
        updated: 'Benutzer erfolgreich aktualisiert',
        updateError: 'Benutzeraktualisierung fehlgeschlagen',
      },
      fix: {
        error: 'Benutzer-Fix fehlgeschlagen',
        complete: 'Fix Abgeschlossen',
        reportedError: 'Fix gemeldeter Benutzer fehlgeschlagen',
        reportedComplete: 'Fix Gemeldeter Benutzer Abgeschlossen',
        deleteSuccess: 'Benutzer gelöscht',
        deleteError: 'Benutzer-Löschung fehlgeschlagen',
      },
    },
    tools: {
      writingForge: {
        title: 'Schreibwerkstatt',
        description: 'KI-gesteuerter CV-Editor',
        placeholder: 'Fügen Sie Ihren CV-Text hier ein...',
        analyzing: 'Mit KI analysieren...',
        error: 'Verarbeitungsfehler',
        noText: 'Kein Text zum Verarbeiten',
        tooShort: 'Text ist zu kurz',
        generating: 'Verbesserungen generieren...',
        improvementReady: 'Verbesserungen bereit!',
        noResume: 'Kein CV-Text zum Bearbeiten',
        emptyResume: 'CV darf nicht leer sein',
        saveError: 'Änderungen konnten nicht gespeichert werden',
        saved: 'Änderungen gespeichert!',
        saveFailed: 'Speichern fehlgeschlagen',
        noTextToRegenerate: 'Kein CV-Text zum Regenerieren',
        regenerating: 'Mit KI regenerieren...',
        regenerated: 'CV regeneriert!',
        preparingPdf: 'PDF-Download vorbereiten...',
        editPlaceholder: 'Bearbeiten Sie Ihren CV hier...',
      },
      interviewBattle: {
        title: 'Interview-Battle',
        description: 'Üben Sie Interviewfragen mit KI',
        noResumeText: 'Bitte laden Sie zuerst einen CV hoch',
        regenerating: 'Regeneriere Fragen...',
        questionsRegenerated: 'Fragen regeneriert!',
        generateError: 'Fragenerstellung fehlgeschlagen',
        enhancing: 'Verbessere Antwort...',
        answerEnhanced: 'Antwort verbessert!',
        actionPlaceholder: 'Was haben Sie getan?',
        downloading: 'Lade herunter...',
        noJobDesc: 'Keine Stellenbeschreibung',
        battlePlanGenerated: 'Battle Plan generiert!',
        battlePlanError: 'Battle Plan-Generierung fehlgeschlagen',
        jobDescPlaceholder: 'Stellenbeschreibung einfügen...',
        invalidJobDesc: 'Ungültige Stellenbeschreibung',
        shortResume: 'CV ist zu kurz',
        requiresSubscription: 'Erfordert Abo',
      },
      linkedIn: {
        title: 'LinkedIn-Optimierer',
        description: 'Optimieren Sie Ihr LinkedIn-Profil',
        upgradeDescription: 'Upgrade für LinkedIn-Optimierung',
        noProfileText: 'Bitte geben Sie Profiltext ein',
        analyzed: 'Profil analysiert!',
        scanError: 'Scan fehlgeschlagen',
        noBioOptimization: 'Keine Bio-Optimierung verfügbar',
        bioOptimized: 'Bio optimiert!',
      },
      answerFinder: {
        title: 'Antwort-Finder',
        searchPlaceholder: 'Suche nach Antworten...',
      },
      keywordSniper: {
        title: 'Keyword-Sniper',
        uploadResume: 'CV hochladen',
        pasteJob: 'Stellenbeschreibung einfügen',
        analyzing: 'Analysiere Keywords...',
        generateError: 'Generierung fehlgeschlagen',
        applied: 'Angewendet!',
        rewritten: 'Umgeschrieben!',
        exampleDescription: 'Beispiel-Stellenbeschreibung',
      },
      bullet: {
        noInput: 'Keine Eingabe',
        optimized: 'Optimiert!',
        rewriteError: 'Umschreiben fehlgeschlagen',
        examplePlaceholder: 'Beispiel-Bullet-Point...',
        rolePlaceholder: 'Rolle eingeben...',
        powerStatementCopied: 'Power Statement kopiert!',
      },
      coverLetter: {
        title: 'Anschreiben-Generator',
        upgradeDescription: 'Upgrade für Anschreiben',
        noJobDescription: 'Keine Stellenbeschreibung',
        generated: 'Anschreiben generiert!',
        generateError: 'Generierung fehlgeschlagen',
        selectResume: 'CV auswählen',
        companyPlaceholder: 'Firmenname',
        rolePlaceholder: 'Stellentitel',
      },
      dm: {
        title: 'DM-Generator',
        noProfile: 'Kein Profil',
        generated: 'DM generiert!',
        generateError: 'Generierung fehlgeschlagen',
        copied: 'Kopiert!',
        namePlaceholder: 'Name eingeben',
      },
      headline: {
        title: 'Headline-Generator',
        copied: 'Headline kopiert!',
      },
      liveOptimizer: {
        title: 'Live-Optimierer',
        placeholder: 'Text hier eingeben...',
      },
    },
    dashboardExtended: {
      applications: {
        upgradeDescription: 'Upgraden Sie, um Bewerbungen zu verfolgen und KI-gestützte Insights zu erhalten',
        added: 'Bewerbung erfolgreich hinzugefügt',
        addError: 'Fehler beim Hinzufügen der Bewerbung',
        companyPlaceholder: 'z.B., Acme GmbH',
        rolePlaceholder: 'z.B., Senior Ingenieur',
        urlPlaceholder: 'https://...',
        jobDescPlaceholder: 'Fügen Sie die Stellenbeschreibung hier ein für KI-gestütztes Schlüsselwort-Matching...',
      },
      projects: {
        created: 'Projekt erfolgreich erstellt!',
        createError: 'Fehler beim Erstellen des Projekts',
        projectPlaceholder: 'z.B. Senior SWE Suche bei Google',
        titlePlaceholder: 'z.B. Senior Software-Ingenieur, Produktmanager...',
        urlPlaceholder: 'https://linkedin.com/jobs/view/...',
        jobDescPlaceholder: 'Fügen Sie hier die vollständige Stellenbeschreibung ein...',
        uploadSuccess: 'Lebenslauf Erfolgreich Hochgeladen!',
      },
      ats: {
        textCopied: 'Rohtext in die Zwischenablage kopiert',
        textDownloaded: 'Rohtext heruntergeladen',
        searchPlaceholder: 'Nach Schlüsselwort suchen...',
      },
      fluff: {
        metricCopied: 'Metrik in die Zwischenablage kopiert!',
        copyError: 'Fehler beim Kopieren in die Zwischenablage',
        copyErrorDescription: 'Bitte versuchen Sie, den Text manuell auszuwählen.',
        noMetricSelected: 'Bitte wählen Sie zuerst eine Metrik',
        noMetricDescription: 'Wählen Sie eine der oben vorgeschlagenen KI-Quantifizierungen.',
      },
      sanitize: {
        noResume: 'Kann nicht bereinigen: Lebenslauf-ID fehlt',
        success: 'PDF erfolgreich bereinigt!',
        successDescription: 'Die Integrität der Textebene wurde wiederhergestellt.',
        error: 'Fehler beim Bereinigen des PDFs',
      },
      scanning: {
        fileValidation: 'Dateivalidierung',
        fileValidationSubtitle: 'PDF-Struktur ist gültig.',
        layoutIntegrity: 'Layout-Integrität',
        layoutIntegritySubtitle: 'Überprüfe Ränder und Textfluss.',
        keywordMatch: 'Schlüsselwort-Übereinstimmung',
        keywordMatchSubtitle: 'AUSSTEHEND',
        timeline: 'Erfahrungs-Zeitlinie',
        timelineSubtitle: 'Analysiere Karriereverlauf.',
        scoring: 'Bewertung und Bericht',
        scoringSubtitle: 'Berechne Endbewertung.',
      },
      metrics: {
        noQuantified: 'Bitte geben Sie eine quantifizierte Version an',
        replaceBrackets: 'Vergessen Sie nicht, die [geklammerten] Werte durch Ihre tatsächlichen Zahlen zu ersetzen!',
        updated: 'Aufzählungspunkt mit Metriken aktualisiert!',
      },
      insights: {
        overall: 'Gesamt',
        keywordMatch: 'Schlüsselwort-Übereinstimmung',
        actionVerbs: 'Aktionsverben',
        impact: 'Wirkung',
        structure: 'Struktur',
      },
      kanban: {
        applied: 'Beworben',
        interviewing: 'Im Interview',
        accepted: 'Angenommen',
      },
      analysis: {
        error: 'Lebenslaufanalyse fehlgeschlagen. Bitte versuchen Sie es erneut.',
      },
      reportUnlocked: '🎉 Lebenslaufbericht freigeschaltet! Ihre Credits wurden angewendet.',
      resumeDeleted: 'Lebenslauf gelöscht',
      upgrade: {
        interviewSprintRequired: 'Interview-Sprint-Plan erforderlich',
      },
      feedback: {
        noRating: 'Bitte wählen Sie eine Bewertung',
        success: 'Vielen Dank für Ihr Feedback!',
        submitError: 'Fehler beim Übermitteln des Feedbacks',
        commentPlaceholder: 'Weitere Kommentare? (optional)',
        tellMore: 'Erzählen Sie uns mehr (optional)',
      },
    },
    pages: {
      nursing: {
        title: 'ATS-Scanner für Krankenschwestern',
        clinical: 'Klinische Schlüsselwort-Optimierer',
        healthcare: 'Gesundheitswesen-ATS-Kompatibilität',
        credentials: 'Lizenz- und Zertifikatsvalidator',
      },
      medSurg: {
        title: 'Med-Surg Krankenschwester ATS-Optimierer',
        generic: 'Generisch',
        patientRatios: 'Patientenverhältnisse Nicht Quantifiziert',
        surgicalExperience: 'Chirurgische Erfahrung Vergraben',
      },
      softwareEngineer: {
        title: 'Software-Ingenieur Schlüsselwort-Scharfschütze',
        techStack: 'Tech-Stack Schlüsselwort-Scharfschütze',
        faang: 'FAANG ATS-Kompatibilität',
        systemDesign: 'Systemdesign-Validator',
      },
      dataAnalyst: {
        title: 'Lebenslauf-Debug für Datenanalysten',
        skills: 'Technische Fähigkeiten-Parser',
        metrics: 'Metriken-Wirkungsanalyse',
        techStack: 'Tech-Stack Schlüsselwort-Matcher',
      },
      finance: {
        title: 'Finanz-Praktikum ATS-Optimierer',
        ibKeywords: 'IB-Schlüsselwort-Validator',
        format: 'Praktikumsformat-Prüfer',
        metricsOptimizer: 'Finanzmetriken-Optimierer',
      },
      about: {
        title: 'Über CVDebug - KI-gestützte ATS-Lebenslauf-Optimierung',
        missionDriven: 'Missionsgetrieben',
        jobSeeker: 'Arbeitssuchender Zuerst',
        innovation: 'Innovation',
        privacyTitle: 'Datenschutz und Vertrauen',
      },
      blog: {
        title: 'ATS-Lebenslauf-Tipps und Jobsuche-Strategien Blog | CVDebug',
      },
      privacy: {
        title: 'Datenschutzrichtlinie | CVDebug',
      },
      terms: {
        title: 'Allgemeine Geschäftsbedingungen | CVDebug',
      },
      contact: {
        title: 'Kontaktieren Sie Uns | CVDebug Support',
        email: 'E-Mail-Support',
        chat: 'Live-Chat',
        responseTime: 'Antwortzeit',
        location: 'Standort',
        namePlaceholder: 'Max Mustermann',
        emailPlaceholder: 'max@beispiel.de',
        messagePlaceholder: 'Wie können wir Ihnen helfen?',
      },
    },
    payment: {
      success: 'Zahlung erfolgreich! Entsperren Sie Ihren CV-Bericht...',
      creditError: 'Zahlung registriert, aber Guthaben-Update fehlgeschlagen. Bitte kontaktieren Sie Support',
      noTransactionId: 'Keine Transaktions-ID verfügbar',
      receiptDownloaded: 'Quittung erfolgreich heruntergeladen',
      downloadError: 'Fehler beim Herunterladen der Quittung',
      checkoutError: 'Fehler beim Starten der Zahlung',
      loginRequired: 'Bitte melden Sie sich an, um Guthaben zu kaufen',
      initiateError: 'Fehler beim Einleiten der Zahlung',
    },
    previewScanExtended: {
      processError: 'Fehler beim Verarbeiten der Datei',
    },
    heroSection: {
      badge: 'Neu: ML-Verbesserte ATS-Analyse',
      mainHeadline: 'Blockiert ATS <br />Ihren Lebenslauf?',
      diagnosticNote: 'CVDebug ist ein Diagnose-Tool, keine Zauberlösung.',
      oneTimePayment: 'Einmalzahlung, keine Abonnements.',
      checkResumeButton: 'Meinen Lebenslauf Prüfen',
      seeHowButton: 'So Funktioniert Es',
      trustedBy: 'Vertraut von',
      jobSeekers: 'Jobsuchenden',
      criticalFixNeeded: 'Kritische Korrektur Erforderlich',
      missingKeywordsAlert: 'In Ihrem Lebenslauf fehlen 3 kritische Schlüsselwörter aus der Stellenbeschreibung',
    },
    ctaSection: {
      payOnceBadge: 'Einmal zahlen, jederzeit nutzen',
      readyHeading: 'Bereit, das ATS zu schlagen?',
      description: 'Erhalten Sie ML-verbesserte Analyse mit TF-IDF-Schlüsselwortgewichtung, Formaterkennung und umsetzbaren Korrekturen. 1 Scan = 1 Credit. Keine Abonnements.',
      startButton: 'Ihren Ersten Scan Starten',
      footnote: '✨ Erster Scan kostenlos • Credits verfallen nie • Sofortige Ergebnisse',
    },
    testimonialsSection: {
      badge: 'Reddit Wall of Love',
      heading: 'Vertraut von Redditors Weltweit',
      description: 'Echtes Feedback von r/resumes, r/developersIndia, r/cscareerquestions und mehr.',
      ctaText: 'Schließen Sie sich Tausenden von Jobsuchenden an, die ihre Lebensläufe optimieren',
    },
    faqSection: {
      heading: 'Häufige Fragen',
      q1: 'Verkaufen Sie meine Daten?',
      a1: 'Niemals. Ihr Lebenslauf wird im Speicher analysiert und sicher nur für Ihre Sitzung gespeichert. Wir verkaufen keine Daten an Recruiter oder Dritte.',
      q2: 'Was ist die "Bild-Falle"?',
      a2: 'Viele moderne Lebenslauf-Vorlagen (von Canva oder Photoshop) exportieren Text als abgeflachte Bilder. ATS-Systeme können Bilder nicht lesen, daher ist Ihre Erfahrung unsichtbar. CVDebug erkennt dies und zeigt Ihnen genau, was das ATS sieht.',
      q3: 'Funktioniert dies für alle Branchen?',
      a3: 'Ja, aber es ist für technische und Unternehmensrollen optimiert, wo die ATS-Nutzung am höchsten ist. Kreative Bereiche können unterschiedliche Anforderungen haben.',
    },
    pricingSection: {
      heading: 'Einfache Preise',
      subheading: 'Einmal zahlen. Für immer beheben. Keine Abonnements.',
      freePreview: 'Kostenlose Vorschau',
      free: 'Kostenlos',
      seeScore: 'Sehen Sie Ihren ATS-Score',
      tryFree: 'Kostenlos Testen',
      singleScan: 'Einzelner Scan',
      oneCompleteFix: 'Eine vollständige Korrektur',
      getSingleScan: 'Einzelnen Scan Erhalten',
      interviewSprint: 'Interview-Sprint',
      sevenDaysUnlimited: '7 Tage unbegrenzt',
      startSprint: 'Sprint Starten',
      bestValue: '🚀 BESTER WERT',
    },
    statsSection: {
      rejectionRate: '75%',
      rejectionLabel: 'Lebensläufe von ATS abgelehnt',
      noBSLabel: 'Kein BS',
      transparentPricing: 'Transparente Preisgestaltung',
      analysisTime: '10s',
      avgTimeLabel: 'Durchschnittliche Analysezeit',
      secureLabel: 'Sicher',
      dataRetention: 'Daten gelöscht in 30 Tagen',
    },
    featuresBento: {
      scatteredResumesTitle: 'Warum verstreute Lebensläufe Ihre Jobsuche töten',
      projectBasedTitle: 'Projektbasiertes Tracking',
      projectBasedDesc: 'Erstellen Sie Jobsuchprojekte und verfolgen Sie jede Bewerbung mit Match-Scores, maßgeschneiderten Anschreiben und Schlüsselwort-Lücken. Sehen Sie, welche Unternehmen Sie ignorieren.',
      healthMonitorTitle: 'Echtzeit-Gesundheitsmonitor',
      healthMonitorDesc: 'Kontinuierliche CV-Integritätsprüfungen warnen Sie sofort, wenn Formatierung bricht oder Schlüsselwörter abdriften. Halten Sie Ihren Master-CV 24/7 ATS-bereit.',
      keywordGapTitle: 'Schlüsselwort-Lückenanalyse',
      keywordGapDesc: 'Sehen Sie nebeneinander, was Google will vs. was Meta will. Kopieren Sie Stellenbeschreibungen und erhalten Sie sofortige TF-IDF-bewertete Schlüsselwort-Übereinstimmungen.',
      aiCoverLetterTitle: 'KI-Anschreibengenerator',
      aiCoverLetterDesc: 'Generieren Sie maßgeschneiderte Anschreiben, die Ihre Schlüsselwort-Lücken explizit schließen. Jedes Anschreiben bezieht sich auf Ihre tatsächlich fehlenden Fähigkeiten aus der Lückenanalyse.',
    },
    freeTierView: {
      founderAudit: 'Gründer-Audit',
      byAlbert: 'von Albert',
      bottomPercentile: 'Sie sind in den unteren {percentileRank}% der Kandidaten',
      yourScore: 'Ihr Score',
      autoRejected: 'Automatisch abgelehnt von 90% der Unternehmen',
      thoseWhoGetInterviews: 'Diejenigen, die Interviews bekommen',
      pointsHigher: '{missingPoints} Punkte höher',
      passATSFilters: 'ATS-Filter bestehen',
      missingKeywords: 'Ihnen fehlen {missingCount} kritische Schlüsselwörter, die sie haben',
      unlockList: '[Vollständige Liste für €9,99 freischalten]',
      robotViewTitle: '🤖 Roboter-Ansicht',
      freePreviewBadge: 'KOSTENLOSE VORSCHAU',
      robotViewDesc: 'Dies ist genau das, was das ATS beim Parsen Ihres Lebenslaufs sieht',
      robotViewWarning: 'Wenn Ihr Text hier fehlt, verstümmelt oder durcheinander ist, kann das ATS Ihren Lebenslauf nicht lesen. Dies ist der Grund #1 für automatische Ablehnung.',
      noTextExtracted: 'Kein Text extrahiert. Dies bedeutet, dass ATS-Systeme Ihren Lebenslauf überhaupt nicht lesen können.',
      parsingError: '[PARSING-FEHLER ERKANNT]',
      hiddenContent: '⚠️ Versteckter Inhalt vom ATS-Parser blockiert',
      chatGPTCantFix: '💡 ChatGPT kann dies nicht beheben. Nur unser PDF-Sanitizer kann Parsing-Fehler reparieren.',
      moreErrors: '+{number} weitere Parsing-Fehler versteckt',
      topCriticalErrors: 'Top Kritische Fehler',
      showingErrors: 'Zeige 2 von {formatCount}',
      missingCriticalKeywords: '🔑 Fehlende Kritische Schlüsselwörter',
      highImpact: 'Hohe Auswirkung',
      keywordsHidden: '{number} Kritische Schlüsselwörter Versteckt',
      getCertified: 'Lassen Sie Ihren Lebenslauf von CVDebug Zertifizieren',
      unlockPackage: '{missingCount} exakte Schlüsselwörter + {formatCount} kritische Korrekturen für einmalige Zahlung von €9,99 freischalten',
      certificationPackage: '✅ ATS-Zertifizierungspaket:',
      allKeywords: 'Alle {total} fehlenden Schlüsselwörter mit exakter Platzierung',
      allFormatErrors: 'Alle {total} Formatfehler mit 1-Klick-Korrekturen',
      aiRewrite: 'KI-gestützte Umschreibungsvorschläge',
      atsCertifiedPDF: '✅ ATS-Zertifizierter PDF-Download mit Badge',
      pdfSanitizer: '⚡ 3-Sekunden Ein-Klick PDF-Sanitizer',
      getCertifiedButton: 'Zertifiziert werden - Nur €9,99',
      albertReview: 'Albert überprüft Ihren CV persönlich',
      videoFeedback: '3-min Video mit brutalem Feedback + allen Korrekturen',
      manualReviewButton: 'Ich möchte die manuelle Überprüfung →',
      oneTimePayment: '✓ Einmalzahlung',
      instantAccess: '✓ Sofortiger Zugriff',
      noSubscription: '✓ Kein Abonnement',
      socialProof: '2.847 Benutzer haben ihre Berichte diese Woche freigeschaltet und',
      interviewIncrease: 'ihre Interviewrate um das 2-fache erhöht',
    },
    atsOverview: {
      title: 'ATS-Kompatibilitätsscore',
      scoreOf100: '/ 100',
      beatingPercentile: 'Sie schlagen {percentile}% der anderen Bewerber',
      eliteReady: 'Elite / Bereit zur Bewerbung',
      visibilityGap: 'Die Sichtbarkeitslücke',
      criticalDanger: 'Kritische Gefahr',
      topCriticalFailures: 'Top Kritische Ausfälle',
      technicalVsHuman: 'Technisches vs. Menschliches Signal',
      technicalSignalDesc: 'Format, Schriftarten, Struktur — kann der Bot es lesen?',
      technicalSignal: 'Technisches Signal',
      humanSignal: 'Menschliches Signal',
      humanSignalDesc: 'Seniorität, Power-Verben, Wirkung — beeindruckend für Menschen?',
      balanceNote: 'Balance ist der Schlüssel: Ein lesbarer Lebenslauf (Bot) ist nicht dasselbe wie ein verkaufender Lebenslauf (Mensch). Sie brauchen beides.',
      contactCheck: 'Schnellcheck: Kontakt & Sozial',
      email: 'Email',
      phone: 'Telefon',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      missing: 'Fehlend',
      seniorityInference: 'Seniorität Schlussfolgerung',
      aiInference: 'KI-Schlussfolgerung: Sie klingen wie ein',
      soundLikeSenior: 'Klingen wie ein Senior Architect',
      impactBreakdown: 'Wirkungsaufschlüsselung',
      actionVerbs: 'Aktionsverben',
      quantifiableMetrics: 'Quantifizierbare Metriken',
      targetMetrics: 'Ziel: {number} Metriken',
      softSkills: 'Soft Skills',
    },
    forms: {
      companyName: 'Firmenname',
      companyPlaceholder: 'z.B., Acme Corp',
      jobTitle: 'Stellenbezeichnung',
      jobTitlePlaceholder: 'z.B., Senior Ingenieur',
      jobUrl: 'Job-Posting URL',
      jobUrlOptional: '(Optional)',
      jobUrlPlaceholder: 'https://...',
      jobDescription: 'Stellenbeschreibung',
      jobDescRecommended: '(Empfohlen für KI-Analyse)',
      jobDescPlaceholder: 'Fügen Sie die Stellenbeschreibung hier für KI-gestütztes Schlüsselwort-Matching ein...',
      jobDescHint: 'Fügen Sie die Stellenbeschreibung hinzu, um sofortige Schlüsselwort-Lückenanalyse zu erhalten',
      cancel: 'Abbrechen',
      addApplication: 'Bewerbung Hinzufügen',
      adding: 'Hinzufügen...',
      addedSuccess: 'Bewerbung erfolgreich hinzugefügt',
      addedError: 'Fehler beim Hinzufügen der Bewerbung',
    },
    dialogs: {
      addNewApplication: 'Neue Bewerbung Hinzufügen',
      sprintRequired: 'Interview-Sprint Erforderlich',
      upgradeMessage: 'Upgraden Sie, um Bewerbungen zu verfolgen, Schlüsselwortanalyse zu erhalten und Ghosting-Warnungen zu empfangen.',
      upgradeNow: 'Jetzt Upgraden',
      sprintRequiredError: 'Interview-Sprint-Plan erforderlich',
      upgradeForInsights: 'Upgraden Sie, um Bewerbungen zu verfolgen und KI-gestützte Insights zu erhalten',
    },
    scoreCard: {
      resumeIs: 'Ihr Lebenslauf ist',
      ofBots: '{percentage} der Bots.',
      excellent: 'Ausgezeichnet',
      needsOptimization: 'Benötigt Optimierung',
      criticalIssues: 'Kritische Probleme',
      excellentMessage: 'Gute Arbeit! Ihr Lebenslauf ist gut für ATS-Systeme optimiert.',
      optimizationMessage: 'Wir haben einige Probleme gefunden, die zu Ablehnungen führen könnten. Lassen Sie uns diese beheben.',
      criticalMessage: 'Wir haben 3 kritische Fehler gefunden, die zu automatischer Ablehnung führen könnten. Diese benötigen sofortige Aufmerksamkeit.',
      downloadReport: 'Bericht Herunterladen',
      shareResults: 'Ergebnisse Teilen',
    },
    keywordAnalysis: {
      title: 'Schlüsselwortanalyse',
      subtitle: 'Semantische Übereinstimmung mit Standard-Stellenbeschreibungen.',
      matchRate: 'Übereinstimmungsrate',
      foundSignals: 'Gefundene Signale',
      total: 'Gesamt',
      groupByType: 'Nach Typ Gruppieren',
      listView: 'Listenansicht',
      gridView: 'Rasteransicht',
      missingCriticalSignals: 'Fehlende Kritische Signale',
      highImpact: 'Hohe Auswirkung',
      fixingIncreases: 'Das Beheben erhöht die Punktzahl um ~15%',
      viewExamples: 'Beispiele Anzeigen',
      autoAdd: 'Auto-Hinzufügen',
      industryKeywordFrequency: 'Häufigkeit von Branchen-Schlüsselwörtern',
      aiPowered: 'KI-Gestützt',
      showingExamples: 'Beispiele anzeigen für',
      viewHowTopCandidates: 'Sehen Sie, wie Top-Kandidaten dieses Schlüsselwort effektiv einsetzen.',
      displayingFlatList: 'Anzeige in flacher Liste',
      keywordsOrganized: 'Schlüsselwörter nach Kategorie organisiert',
      switchedToView: 'Gewechselt zu',
      showingAllKeywords: 'Alle Schlüsselwörter anzeigen',
      groupedByType: 'Nach Typ gruppiert',
      noMissingSignals: 'Keine Fehlenden Signale',
      excellentKeywordCoverage: 'Gute Arbeit! Ihr Lebenslauf hat eine ausgezeichnete Schlüsselwort-Abdeckung.',
      matchType: 'Übereinstimmungstyp',
      exactMatch: 'Exakte Übereinstimmung',
      synonymMatch: 'Synonym-Übereinstimmung',
      semanticMatch: 'Semantische Übereinstimmung',
      foundInResume: 'Im Lebenslauf gefunden',
      clickToHide: 'Klicken zum Ausblenden',
      // Paywall content
      criticalSignalsLocked: 'Kritische Signale Gesperrt',
      unlockFullAnalysis: 'Vollständige Analyse Freischalten',
      unlockDescription: 'Schalten Sie die vollständige Analyse fehlender Schlüsselwörter mit quantifizierter Wirkung, spezifischen Beschreibungen und KI-Empfehlungen frei, um Ihre Punktzahl um bis zu +15% zu erhöhen.',
      quantifiedImpact: 'quantifizierte Wirkung',
      specificDescriptions: 'spezifische Beschreibungen',
      aiRecommendations: 'KI-Empfehlungen',
      increaseScoreBy: 'um Ihre Punktzahl um bis zu +15% zu erhöhen',
      detailedImpactAnalysis: 'Detaillierte Wirkungsanalyse (+2% pro Schlüsselwort)',
      impactPerKeyword: '+2% pro Schlüsselwort',
      specificForEachKeyword: 'Spezifische Beschreibungen für jedes Schlüsselwort',
      recommendedLocation: 'Empfohlener Standort im Lebenslauf',
      autoAddWithAI: 'Auto-Add mit KI (Writing Forge)',
      unlockComplete: 'Vollständige Analyse Freischalten',
      sevenDayPlan: '7-Tage-Plan • €24.99',
      keywordsMissingLocked: 'Fehlende Schlüsselwörter Gesperrt',
      unlockCompleteList: 'Schalten Sie die vollständige Liste kritischer Schlüsselwörter mit quantifizierter Wirkung (+15% Punktzahl) frei.',
      unlockButton: 'Freischalten',
    },
    fluffDetector: {
      locked: 'Fluff-Detektor Gesperrt',
      unlockPremium: 'Premium-Analyse Freischalten',
      description: 'Schalten Sie KI-gestützte Fluff-Erkennung frei, um schwache Phrasen, nicht quantifizierte Erfolge zu identifizieren und umsetzbare Ersetzungen zu erhalten.',
      weakPhraseAnalysis: 'Erkennung schwacher Phrasen mit Kontext',
      quantifiedMetrics: 'Analyse nicht quantifizierter Erfolge',
      actionableReplacements: 'KI-gestützte umsetzbare Ersetzungen',
      unlockFluff: 'Fluff-Detektor Freischalten',
    },
    interviewPrep: {
      locked: 'Interview-Schlachtplan Gesperrt',
      unlockBattlePlan: 'Interview-Vorbereitung Freischalten',
      description: 'Generieren Sie personalisierte Interview-Vorbereitung mit erwarteten Fragen, STAR-Geschichten und strategischen Gesprächsthemen basierend auf Ihrem Lebenslauf und der Stellenbeschreibung.',
      expectedQuestions: 'Erwartete Interview-Fragen',
      starStories: 'STAR-Format-Geschichtenvorschläge',
      talkingPoints: 'Strategische Gesprächsthemen',
      unlockInterview: 'Schlachtplan Freischalten',
    },
    recruiterDM: {
      locked: 'Recruiter-DM-Generator Gesperrt',
      unlockDMGenerator: 'DM-Generator Freischalten',
      description: 'Generieren Sie personalisierte Recruiter-Nachrichten mit mehreren Variationen, optimiert mit Schlüsselwörtern aus Ihrer Ziel-Stellenbeschreibung.',
      personalizedMessages: 'Personalisierte Recruiter-Nachrichten',
      multipleVariations: '3 Variationen pro Nachricht',
      keywordOptimized: 'Schlüsselwort-optimiert für Ihre Zielrolle',
      unlockRecruiter: 'DM-Generator Freischalten',
    },
    conversionBanner: {
      currentBracket: 'Aktuelle Stufe',
      youAreInBracket: 'Sie sind in der',
      unlockSprint: 'Schalten Sie die',
      sprintEngine: 'Sprint-Engine frei',
      reach: 'um zu erreichen',
      matchFaang: 'und entsprechen',
      instantly: 'sofort',
      pointsBoost: 'Punktesteigerungspotenzial',
      faangKeywords: 'FAANG-Level-Keywords',
      hourAccess: '24-Stunden-Zugang',
      get24hPass: '24-Stunden-Sprint-Pass erhalten',
      oneTimePayment: 'Einmalige Zahlung',
      fixEverything: 'Alles in 24 Stunden beheben. Kein Abonnement.',
      noSubscription: 'Kein Abonnement',
      devsUpgraded: 'Entwickler haben diese Woche aktualisiert',
      avgIncrease: 'Durchschnittliche Score-Steigerung',
      points: 'Punkte',
    },
    atsSimulation: {
      seniorityMatch: 'Senioritäts-Übereinstimmungsanalyse',
      detectedLevel: 'Erkanntes Level',
      experienceAudit: 'Erfahrungsaudit',
      signalDensity: 'Signaldichte',
      score: 'Punktzahl',
      expected: 'Erwartet',
      signals: 'signale',
      strength: 'Stärke',
      junior: 'Junior',
      mid: 'Mittel',
      senior: 'Senior',
      lead: 'Lead',
      match: 'Übereinstimmung',
      review: 'Überprüfen',
      year: 'jahr',
      years: 'jahre',
      strong: 'STARK',
      medium: 'MITTEL',
      weak: 'SCHWACH',
      readability: 'Lesbarkeit',
      highIntegrity: 'Hohe Integrität',
      industryPatterns: 'Struktur folgt Industriestandardmustern',
      imageTraps: 'Bildfallen',
      safe: 'Sicher',
      noneDetected: 'Keine erkannt',
      noInvisibleElements: 'Keine unsichtbaren Elemente oder Keyword-Stuffing',
      atsGlobalScore: 'ATS Globaler Score',
      parsingEfficiency: 'Score basierend auf Parsing-Effizienz',
      liveAnalysis: 'Live-Analyse',
      fullReport: 'Vollständiger Bericht',
    },
    keywordSniper: {
      title: 'Keyword Sniper Tool',
      subtitle: 'Optimieren Sie Ihre Bulletpoints mit KI-gestützter Keyword-Injektion',
      noJobDescription: 'Keine Stellenbeschreibung Analysiert',
      noJobDescriptionDesc: 'Keyword Sniper benötigt eine Stellenbeschreibung, um fehlende Keywords zu analysieren und zu extrahieren.',
      howToUseTitle: 'So verwenden Sie Keyword Sniper:',
      howToStep1: 'Erstellen Sie ein Projekt mit Ihrer Zielrolle',
      howToStep2: 'Fügen Sie eine Bewerbung mit der Stellenbeschreibung hinzu',
      howToStep3: 'Analysieren Sie die Beschreibung, um Keywords zu extrahieren',
      howToStep4: 'Kehren Sie hierher zurück, um KI-Vorschläge zu erhalten',
      backToDashboard: 'Zurück zum Dashboard',
      interviewSprintRequired: 'Interview Sprint Erforderlich',
      injectKeywordsDesc: 'Fügen Sie fehlende Keywords in Ihre Bulletpoints mit KI-Vorschlägen ein.',
      keywordInjection: 'Keyword-Injektion',
      liveScoreTracking: 'Live-Score-Tracking',
      priorityTargeting: 'Prioritäts-Targeting',
      contextAwareAI: 'Kontextbewusste KI',
      upgradeToSprint: 'Upgrade auf Interview Sprint',
      back: 'Zurück',
      targeting: 'Targeting',
      currentResume: 'Aktueller Lebenslauf',
      aiPremiumTools: 'KI-Premium-Tools',
      viewExamples: 'Beispiele Ansehen',
      viewExamplesDesc: 'Sehen Sie Senior-Level-Beispiele zur natürlichen Integration von Keywords',
      applyMetric: 'Metrik Anwenden',
      applyMetricDesc: 'Wandeln Sie schwache Bulletpoints in quantifizierte Impact-Statements um',
      rewriteAll: 'Alles Neu Schreiben',
      rewriteAllDesc: 'KI-Engine zum Umschreiben Ihres gesamten Lebenslaufs auf Senior+-Level',
      battlePlan: 'Schlachtplan',
      battlePlanDesc: 'Generieren Sie die schwierigsten Fragen + strategische Antworten für Interviews',
      suggestionApplied: 'Vorschlag angewendet! Ihr Lebenslauf wurde aktualisiert.',
      noMissingKeywords: 'Keine fehlenden Keywords zum Anzeigen von Beispielen',
      rewriteSuccess: 'Lebenslauf erfolgreich neu geschrieben!',
      lockedTitle: 'Interview Sprint Erforderlich',
      lockedDesc: 'Schalten Sie das Keyword Sniper Tool frei, um fehlende Keywords einzufügen und Ihren ATS-Score zu verbessern.',
      upgradeNow: 'Jetzt Upgraden',
    },
    createProject: {
      title: 'Neues Projekt Erstellen',
      subtitle: 'Konfigurieren Sie Ihre Jobsuchkampagne',
      projectName: 'Projektname',
      projectNamePlaceholder: 'z.B. Senior SWE Suche bei Google',
      targetRole: 'Zielrolle',
      targetRolePlaceholder: 'z.B. Senior Software-Ingenieur, Produktmanager...',
      targetRoleHint: 'Geben Sie eine beliebige Rolle ein oder wählen Sie aus Vorschlägen. Dies hilft der KI, Lebenslauf-Vorschläge anzupassen.',
      jobDescription: 'Stellenbeschreibung',
      optional: '(Optional)',
      linkUrl: 'Link-URL',
      pasteText: 'Text Einfügen',
      urlPlaceholder: 'https://linkedin.com/jobs/view/...',
      textPlaceholder: 'Fügen Sie hier die vollständige Stellenbeschreibung ein...',
      aiAnalysisTitle: 'KI-Analyse Aktiviert',
      aiAnalysisDesc: 'Wir extrahieren Keywords aus der Stellenbeschreibung, um Ihren Lebenslauf zu optimieren und Match-Scores zu berechnen.',
      cancel: 'Abbrechen',
      createButton: 'Projekt Erstellen',
      creating: 'Erstellen...',
      successMessage: 'Projekt erfolgreich erstellt!',
      errorMessage: 'Fehler beim Erstellen des Projekts',
    },
    createApplication: {
      title: 'Neue Bewerbung Hinzufügen',
      sprintRequired: 'Interview Sprint Erforderlich',
      upgradeDesc: 'Upgrade, um Bewerbungen zu verfolgen, Keyword-Analysen zu erhalten und Ghosting-Warnungen zu bekommen.',
      upgradeNow: 'Jetzt Upgraden',
      companyName: 'Firmenname',
      companyPlaceholder: 'z.B., Acme Corp',
      jobTitle: 'Stellenbezeichnung',
      jobTitlePlaceholder: 'z.B., Senior-Ingenieur',
      jobUrl: 'Stellenanzeigen-URL',
      optional: '(Optional)',
      urlPlaceholder: 'https://...',
      jobDescription: 'Stellenbeschreibung',
      recommendedAI: '(Empfohlen für KI-Analyse)',
      descriptionPlaceholder: 'Fügen Sie hier die Stellenbeschreibung für KI-gestütztes Keyword-Matching ein...',
      cancel: 'Abbrechen',
      addApplication: 'Bewerbung Hinzufügen',
      adding: 'Wird hinzugefügt...',
      planRequired: 'Interview Sprint Plan erforderlich',
      planRequiredDesc: 'Upgrade für Bewerbungsverfolgung und KI-gestützte Insights',
      successMessage: 'Bewerbung erfolgreich hinzugefügt',
      errorMessage: 'Fehler beim Hinzufügen der Bewerbung',
      featureRestricted: 'Diese Funktion ist nur mit einem aktiven Interview Sprint Abonnement verfügbar',
    },
    missionControl: {
      title: 'Missionskontrolle',
      welcomeBack: 'Willkommen zurück',
      eliminateBugs: 'Beseitigen Sie Fehler, bis Sie 95% Sichtbarkeit erreichen.',
      newApplication: 'Neue Bewerbung',
      visibilityScore: 'Sichtbarkeitswert',
      howRecruitersFind: 'Wie Recruiter Ihren Lebenslauf finden',
      activeApplications: 'Aktive Bewerbungen',
      interviewsScheduled: 'Vorstellungsgespräche geplant',
      missingSignals: 'Fehlende Signale',
      critical: 'KRITISCH',
      impactingMatchScore: 'Beeinträchtigt Match-Score um',
      robotViewTitle: 'Roboter-Ansicht: Was ATS Tatsächlich Liest',
      robotViewSubtitle: 'Fehlen kritische Informationen in Ihrem Lebenslauf?',
      uploadToSeeExtraction: 'Laden Sie einen Lebenslauf hoch, um die Rohtextextraktion zu sehen',
      missingKeywords: 'Fehlend',
      allKeywordsDetected: 'Alle kritischen Schlüsselwörter erkannt',
      needPoints: 'Benötigen',
      reachEliteTier: 'Punkte, um ELITE-Stufe zu erreichen',
      viewFullReport: 'Vollständigen Bericht Anzeigen',
      uploadResume: 'Lebenslauf Hochladen',
      careerHealth: 'Karrieregesundheit',
      elite: 'ELITE',
      pro: 'PRO',
      rising: 'RISING',
      starter: 'STARTER',
      progressToElite: 'Fortschritt zu ELITE (85%+)',
      cvScore: 'CV-Score',
      applications: 'Bewerbungen',
      interviews: 'Vorstellungsgespräche',
      applicationKanban: 'Bewerbungs-Kanban',
      viewAll: 'ALLE ANZEIGEN',
      applied: 'Beworben',
      noApplicationsYet: 'Noch keine Bewerbungen',
      position: 'Position',
      company: 'Unternehmen',
      recent: 'Aktuell',
      interviewing: 'Im Gespräch',
      noInterviewsYet: 'Noch keine Vorstellungsgespräche',
      inProgress: 'In Bearbeitung',
      accepted: 'Angenommen',
      noOffersYet: 'Noch keine Angebote',
      topErrors: 'Hauptfehler',
      noCVLoaded: 'Kein CV geladen',
      consoleBash: 'konsole — bash',
      noCriticalErrors: 'Keine kritischen Fehler erkannt',
      allSystemsOperational: 'Alle Systeme betriebsbereit',
      debugMasterCV: 'DEBUG MASTER CV',
      missingKeyword: 'Fehlendes Schlüsselwort',
      matchScoreImpact: 'match_score Auswirkung:',
      dateFormatInconsistency: 'Datumsformat-Inkonsistenz gefunden',
      atExperienceBlock: 'bei Experience.block (Zeile 42)',
    },
    atsReport: {
      missingSignals: 'Fehlende Signale',
      critical: 'KRITISCH',
      important: 'WICHTIG',
      niceToHave: 'WÜNSCHENSWERT',
      fix: 'Beheben',
      invisibleToBot: 'Unsichtbar für den Bot',
      atsWillReject: '⚠️ Das ATS wird Sie automatisch ablehnen',
      needsOptimization: 'Sie müssen Ihren Lebenslauf VORHER optimieren',
      readyToApply: 'Bereit zur Bewerbung',
      context: 'Kontext',
      offerRequires: 'Das Angebot erfordert',
      youNeedToAdd: 'Sie müssen diese Fähigkeit hinzufügen',
      missingThisToken: 'aber Ihr Lebenslauf erwähnt nur',
      addSignalsOf: 'Sie müssen Signale hinzufügen von',
      upgrade: 'Upgrade',
      percentInvisible: '% Unsichtbar für den Bot',
      needsOptimizationBefore: 'Benötigt Optimierung VOR der Bewerbung',
    },
    projectsView: {
      searchPlaceholder: 'Projekte, Tags suchen...',
      uploadNewMasterCV: 'Neuen Master-CV hochladen',
      allProjects: 'Alle Projekte',
      highMatch: 'Hohe Übereinstimmung',
      needsReview: 'Überprüfung erforderlich',
      archived: 'Archiviert',
      sortBy: 'Sortieren nach:',
      lastUpdated: 'Zuletzt aktualisiert',
      loadingProjects: 'Projekte werden geladen...',
      noProjectsYet: 'Noch keine Projekte',
      noProjectsDesc: 'Erstellen Sie Ihr erstes Projekt, um Bewerbungen zu verfolgen und Ihren Lebenslauf zu optimieren.',
      createFirstProject: 'Ihr Erstes Projekt Erstellen',
      matchScore: 'Übereinstimmungswert',
      stable: 'Stabil',
      missingData: 'Fehlende Daten',
      highPriority: 'Hohe Priorität',
      strong: 'Stark',
      moderate: 'Moderat',
      low: 'Niedrig',
      hoursAgo: 'Std',
      daysAgo: 'T',
      weeksAgo: 'W',
      openProjectBoard: 'Projekt-Board öffnen',
      createNewProject: 'Neues Projekt erstellen',
      createNewProjectDesc: 'Starten Sie eine neue Mission oder laden Sie einen CV zur Analyse hoch.',
    },
    resumeGrid: {
      loadingResumes: 'Ihre Lebensläufe werden geladen...',
      analyzing: 'Analysiere...',
      error: 'Fehler',
      excellent: 'Ausgezeichnet',
      moderate: 'Moderat',
      critical: 'Kritisch',
      noResumesFound: 'Keine Lebensläufe gefunden',
      noResumesDesc: 'Laden Sie Ihren Lebenslauf hoch, um einen sofortigen ATS-Score und KI-gestütztes Feedback zu erhalten.',
      uploadResume: 'Lebenslauf Hochladen',
      createManually: 'Manuell Erstellen',
      createProject: 'Projekt Erstellen',
      searchPlaceholder: 'Lebensläufe nach Name, Fähigkeit oder ID suchen...',
      listView: 'Listenansicht',
      gridView: 'Rasteransicht',
      resumeName: 'Lebenslauf Name',
      uploadDate: 'Upload-Datum',
      lastAnalyzed: 'Zuletzt Analysiert',
      healthScore: 'Gesundheitswert',
      actions: 'Aktionen',
      viewDetails: 'Details Anzeigen',
      reAnalyze: 'Neu Analysieren',
      delete: 'Löschen',
      justNow: 'Gerade eben',
      showing: 'Anzeigen',
      to: 'bis',
      of: 'von',
      results: 'Ergebnisse',
      previous: 'Zurück',
      next: 'Weiter',
      noSearchResults: 'Keine Lebensläufe entsprechen Ihrer Suchanfrage.',
    },
    aiFeedback: {
      rateResponse: 'Antwort bewerten',
      howHelpful: 'Wie hilfreich war diese Antwort?',
      feedbackHelps: 'Ihr Feedback hilft uns, unsere KI zu verbessern.',
      helpful: 'Hilfreich',
      okay: 'In Ordnung',
      notHelpful: 'Nicht hilfreich',
      additionalComments: 'Zusätzliche Kommentare (optional)...',
      submitFeedback: 'Feedback senden',
      thankYou: 'Vielen Dank für Ihr Feedback!',
      wasHelpful: 'War diese Antwort hilfreich?',
      yes: 'Ja',
      somewhat: 'Etwas',
      no: 'Nein',
      tellMore: 'Erzählen Sie uns mehr (optional)...',
      submit: 'Senden',
      selectRating: 'Bitte wählen Sie eine Bewertung',
      feedbackSubmitted: 'Danke! Feedback gesendet.',
      submitError: 'Feedback konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
    },
    eliteMatchTool: {
      title: 'Elite Match Tool',
      subtitle: 'Analyze your resume against any job offer with local ML precision. Identify gaps and optimize for ATS instantly.',
      urlLabel: 'LinkedIn URL (Recommended)',
      urlPlaceholder: 'https://www.linkedin.com/jobs/view/...',
      urlHelp: 'Paste the direct LinkedIn job posting link for best extraction results.',
      textLabel: 'Paste Job Description',
      textPlaceholder: 'About the role:\nWe are looking for a Senior Full Stack Developer with 5+ years of experience...\n\nRequirements:\n- Strong experience with React and Node.js\n- Experience with Kubernetes and AWS',
      textHelp: 'Copy and paste the full job description from any portal.',
      analyzeButton: 'Analyze Match Score',
      featureExtraction: 'Entity Extraction',
      featureExtractionDesc: 'Not just keywords: we extract Hard Skills, Soft Skills, and Industry Metrics with deep semantic understanding.',
      gapAnalysis: 'Gap Analysis',
      gapAnalysisDesc: 'We identify EXACTLY what signals are missing from your profile to pass high-risk ATS filters.',
      autoFix: 'AI Auto-Fix',
      autoFixDesc: 'One-click AI rewriting that intelligently integrates missing signals into your existing resume narrative.',
      premiumTitle: 'Elite Match Tool is Premium',
      premiumSubtitle: 'Analyze your resume against any offer using local ML (0 API costs)',
      premiumFeatures: '• Entity extraction with TF-IDF & Cosine Similarity\n• Critical/important/nice-to-have gap analysis\n• Robot View with red/green zones\n• Specific Auto-Fix suggestions',
      scoreTitle: 'Match Score',
      scoreExcellent: 'Excellent match! Apply with confidence.',
      scoreGood: 'Good match, but there are important gaps.',
      scoreNeedsWork: 'You need to improve your resume for this offer.',
      missingCritical: 'Missing Critical Signals',
      matchedSkills: 'Matched Skills',
      robotViewTitle: 'Robot View',
      redZones: 'Red Zones',
      greenZones: 'Green Zones',
      recommendations: 'Auto-Fix Recommendations',
      analyzeAnother: 'Analyze Another Job',
      applyFix: 'Apply Auto-Fix',
      applyFixSuccess: 'Auto-Fix suggestions copied! Navigate to Edit tab to apply changes.',
      analyzingStep1: 'Extracting Recruiter Intent...',
      analyzingStep2: 'Analyzing Hard Skills Requirements...',
      analyzingStep3: 'Detecting Soft Skills Signals...',
      analyzingStep4: 'Generating Missing Signals Report...',
      errorAnalyzing: 'Error analyzing the match: ',
      errorUnknown: 'Unknown error',
    },
    ecosystem: {
      copyPasteTip: {
        badge: 'KOSTENLOS',
        title: '💡 Profi-Tipp: Von LinkedIn kopieren',
        description: 'Gehen Sie zu einer Stellenanzeige auf LinkedIn → Wählen Sie den gesamten Text → Strg+C → Fügen Sie ihn in \'Stellenbeschreibung hinzufügen\' ein. Automatisch, keine Erweiterungen erforderlich.',
        actionLabel: 'Verstanden',
        successMessage: 'Perfekt! Verwenden Sie Strg+C bei jeder Stellenanzeige.',
      },
      linkedinReminder: {
        badge: 'KOSTENLOS',
        title: '🔗 Erinnerung: LinkedIn aktualisieren',
        description: 'Ihr Lebenslauf steht bei {score}%. 89% der Recruiter suchen auf LinkedIn, bevor sie anrufen. Kopieren Sie Ihre Lebenslaufverbesserungen in Ihr LinkedIn-Profil.',
        actionLabel: 'Zu LinkedIn gehen',
      },
      keyboardShortcuts: {
        badge: 'KOSTENLOS',
        title: '⌨️ Tastaturkürzel',
        description: 'Strg+V zum schnellen Einfügen der Stellenbeschreibung. Esc zum Schließen von Modalen. Arbeiten Sie schneller, ohne die Tastatur zu verlassen.',
        actionLabel: 'Mehr Shortcuts anzeigen',
        infoMessage: 'Shortcuts: Strg+V (JD einfügen), Esc (schließen), Tab (navigieren)',
      },
      dismissLabel: 'Nicht interessiert',
      freeLabel: '100% KOSTENLOS',
      bookmarklet: {
        title: 'Scanner Installation (1 minute)',
        step1Title: 'Copy the bookmarklet',
        step1Copy: 'Copy Bookmarklet',
        step1Copied: 'Copied!',
        step2Title: 'Create a bookmark',
        step2Instructions: ['Right-click on the bookmarks bar', 'Select "Add page"', 'Name: "Job Scanner"', 'URL: Paste the copied code'],
        step3Title: 'Use it on any site',
        step3Description: 'Go to LinkedIn, Indeed, or any job posting → Click the "Job Scanner" bookmark → Text will be extracted → Paste it in your resume analyzer',
        proTip: 'Works on ANY website. LinkedIn, Indeed, Glassdoor, company X...',
        successCopied: 'Bookmarklet copied! Now drag it to your bookmarks bar.',
        openingChecklist: 'Opening LinkedIn checklist...',
        comingSoon: 'Coming soon: Recruiter email analyzer',
      },
    },
  },
  'pt': {
    hero: {
      title: 'Pare de adivinhar por que você está sendo ignorado.',
      subtitle: 'Depure os bugs invisíveis do seu currículo e consiga entrevistas em 7 dias.',
      ctaPrimary: 'Ver Visão Robô - Grátis',
      ctaSecondary: 'Cadastre-se para Acesso Completo',
      trustIndicator: 'Sem cartão • Sem cadastro • Resultados instantâneos em 10 segundos',
    },
    features: {
      robotView: 'Terminal Visão Robô',
      keywordGap: 'Detector de Sinais Ausentes',
      seniorityMatch: 'Auditoria de Nível Senior',
      instantScan: 'Pontuação ATS Instantânea',
    },
    pricing: {
      free: 'Scan Grátis',
      pass24h: 'Passe 24 Horas',
      sprint7d: 'Sprint 7 Dias',
      currency: 'R$',
      enterprise: {
        badge: 'Empresarial',
        title: 'Escale Seu Recrutamento',
        subtitle: 'Sem Concessões',
        description: 'Desenvolvido para equipes de recrutamento que processam milhares de candidaturas. Obtenha descontos por volume, suporte dedicado e integrações personalizadas.',
        contactSales: 'Contatar Vendas',
        viewPricing: 'Ver Preços',
        feature1: 'Gestão de Equipe',
        feature1Desc: 'Painel centralizado para equipes de RH rastrearem todas as candidaturas',
        feature2: 'Conformidade SOC 2',
        feature2Desc: 'Segurança de nível empresarial com SSO e controle de acesso baseado em funções',
        feature3: 'Acesso à API',
        feature3Desc: 'Integre o escaneamento ATS diretamente no seu fluxo de trabalho de recrutamento',
      },
    },
    pricingLanding: {
      title: 'Preços Simples',
      subtitle: 'Pague uma vez. Corrija para sempre. Sem assinaturas.',
      // Free tier
      freeTitle: 'FREE Debug',
      freeSubtitle: 'Descubra quais palavras-chave o robô NÃO vê',
      freeScanButton: 'Escanear Grátis',
      freeFeature1: 'Detecção de Invisibilidade (2 palavras-chave)',
      freeFeature2: 'Pontuação ATS Global',
      freeFeature3: 'Visão Robô (bloqueada)',
      freeFeature4: 'Prévia Correspondência de Senioridade',
      freeGuarantee: '✓ MODELO LEGÍVEL GARANTIDO',
      // Single debug fix (€5.99)
      singleDebugBadge: 'CORRIJA DE UMA VEZ',
      singleDebugTitle: 'Solução Rápida',
      singleDebugSubtitle: 'Corrija seu currículo pelo preço de um café',
      singleDebugButton: 'Corrigir Meu CV →',
      singleDebugFeature1: '1 Escaneamento Profundo Completo',
      singleDebugFeature2: 'Visão Robô Desbloqueada',
      singleDebugFeature3: '1 Otimização de IA (Reescrita)',
      singleDebugFeature4: 'Auto-Injeção de Palavras-chave',
      singleDebugFeature5: 'Exportar CV Otimizado',
      singleDebugGuarantee: '✓ MODELO LEGÍVEL GARANTIDO',
      // 24h Pass (€14.99)
      pass24hBadge: 'CORREÇÃO RÁPIDA / URGENTE',
      pass24hTitle: 'Passe 24h',
      pass24hSubtitle: 'Debug Imediato para entrevista de amanhã',
      pass24hButton: 'Acesso 24h →',
      pass24hFeature1: 'Scans Ilimitados (24h)',
      pass24hFeature2: 'Visão Raio-X Robô Completa',
      pass24hFeature3: 'Tags [ERRO] + [AVISO] + Correções',
      pass24hFeature4: 'Detector de Lacunas de Palavras-chave',
      pass24hFeature5: 'Gerador de Carta de Apresentação',
      pass24hFeature6: 'Modelo 100% Legível por ATS',
      pass24hGuarantee: '✓ GARANTIDO',
      // 7 Day Sprint (€24.99)
      sprint7dBadge: 'INTENSIVO / RECOMENDADO',
      sprint7dTitle: 'Sprint 7 Dias',
      sprint7dSubtitle: 'Modo Fera. Ataque total de 7 dias',
      sprint7dBeforePrice: '€49.99',
      sprint7dButton: 'Começar Sprint 7 Dias →',
      sprint7dFeature1: 'Scans Ilimitados (7 dias)',
      sprint7dFeature2: 'Seletor de Indústria (FAANG/Finanças)',
      sprint7dFeature3: 'Elevador de Tom de Marcadores (Reescrita IA)',
      sprint7dFeature4: 'Plano de Batalha para Entrevistas',
      sprint7dFeature5: 'Scripts de DM para Recrutadores',
      sprint7dFeature6: 'Carta de Apresentação + Otimizador LinkedIn',
      sprint7dGuarantee: '✓ MODELO 100% LEGÍVEL GARANTIDO',
    },
    pricingDialog: {
      quickFix: 'Solução Rápida',
      pass24h: 'Passe 24h',
      price24h: 'R$74.99',
      access24h: 'acesso de 24 horas',
      unlimitedScans24h: 'Scans Ilimitados (24h)',
      fullErrorReport: 'Relatório Completo de [ERROS]',
      robotXRayView: 'Vista Raio-X do Robô',
      keywordOptimizer: 'Otimizador de Palavras-chave',
      battlePlanGenerator: 'Gerador de Plano de Batalha',
      get24hPass: 'Obter Passe 24h',
      sprint7d: 'Sprint 7 Dias',
      price7d: 'R$199.99',
      access7d: 'acesso de 7 dias',
      unlimitedScans7d: 'Scans Ilimitados (7 Dias)',
      recommended: 'RECOMENDADO',
      tryFree: 'Experimentar Grátis',
      noThanksJust24h: 'Não obrigado, apenas Passe 24h',
      title: 'Preços Simples e Transparentes',
      subtitle: 'Pagamentos únicos para resultados profissionais. Sem assinaturas recorrentes ou taxas ocultas.',
      start7DaySprint: 'Começar Sprint 7 Dias 🚀',
      secureCheckout: 'Pagamento Seguro Criptografado de 256 bits',
      // Upsell section
      waitBeforeCheckout: '⚠️ AGUARDE! Antes de finalizar...',
      applyingToOneJob: 'Você está se candidatando a Apenas UM Emprego?',
      justMoreGetSprint: 'Por apenas €10 a mais, obtenha o Interview Sprint.',
      whyUpgrade: 'Por que atualizar?',
      save60: 'Economize 60%',
      unlimitedScansNotOne: 'Escaneamentos ilimitados por 7 dias (não apenas um)',
      aiCoverLetters: 'Cartas de apresentação com IA para cada candidatura',
      linkedinOptimization: 'Otimização de perfil do LinkedIn incluída',
      candidatesChoseSprint: '1,200+ candidatos escolheram Interview Sprint e conseguiram vagas em:',
      upgradeToSprint: 'Sim, atualizar para Sprint (€24.99) 🚀',
      // More hardcoded strings
      scorePreview: 'Prévia da Pontuação',
      errorLabels: 'Etiquetas [ERRO]',
      topKeywords: 'Top 2 Palavras-Chave',
      bestValue: 'MELHOR VALOR',
      sevenDaySprint: 'Sprint de 7 Dias',
      sevenDaysAccess: '7 dias de acesso completo',
      unlimitedCVScans: 'Escaneamentos de CV Ilimitados (7d)',
      robotViewTerminal: 'Terminal Visão Robô',
      missingSignalsDetector: 'Detector de Sinais Faltantes',
      seniorityMatchAudit: 'Auditoria de Correspondência de Senioridade',
      industrySelectorFAANG: 'Seletor de Indústria (FAANG/Finanças)',
      bulletToneElevator: 'Elevador de Tom de Marcadores',
      bonusExtras: 'Extras Bônus:',
      coverLetterGen: 'Gerador de Cartas',
      linkedinOptimizer: 'Otimizador do LinkedIn',
      devsJoined: '1,200+ desenvolvedores se juntaram',
      sprintTestimonial: '"Sprint me ajudou a corrigir bugs e conseguir 5 entrevistas em 1 semana"',
      fastStart: 'INÍCIO RÁPIDO',
      loginToPurchase: 'Faça login para comprar créditos',
      checkoutFailed: 'Falha ao iniciar o checkout',
      checkoutError: 'Falha ao iniciar o processo de checkout',
    },
    dashboard: {
      welcome: 'Bem-vindo de volta',
      uploadCv: 'Carregue seu currículo',
      analyzing: 'Analisando seu currículo...',
      score: 'Pontuação ATS',
      issues: 'Problemas Encontrados',
      signIn: 'Entrar',
      continueDashboard: 'Continuar para o Painel',
      welcomeBack: 'Bem-vindo de volta',
      uploadMasterCv: 'Carregue seu Currículo Principal',
      uploadToStart: 'Carregue seu currículo para começar',
      noKeywordsYet: 'Ainda sem palavras-chave',
      noResumeFound: 'Nenhum Currículo Encontrado',
      uploadToSeeATS: 'Carregue um currículo para ver como os robôs ATS interpretam seu documento.',
      uploadToSeeText: 'Carregue um currículo para ver a extração de texto bruto',
      resumeEditor: 'Editor de Currículo',
      downloadAsTxt: 'Baixar como .txt',
      noResumeLoaded: 'Nenhum currículo carregado. Carregue um currículo do painel para começar a editar.',
      uploadToGetStarted: 'Carregue um currículo para começar',
      masterCvs: 'Currículos Mestres',
      tools: 'Ferramentas IA',
      applications: 'Candidaturas',
      match: 'Elite Match',
      missionControl: 'Centro de Controle',
      keywordSniper: 'Atirador de Palavras-Chave',
      writingForge: 'Forja de Escrita',
      bulletRewriter: 'Reescritor de Marcadores',
      coverLetterGen: 'Carta de Apresentação',
      linkedinOptimizer: 'Otimizador do LinkedIn',
      upgradeToFix: 'Atualizar para Corrigir',
      aiRewrite: 'Reescrita IA',
      addJob: 'Adicionar Emprego',
      toolsMenu: 'Ferramentas',
      visibilityDebugger: 'Debugger de Visibilidade',
      autoRejectDetected: 'AUTO-REJEIÇÃO DETECTADA',
      criticalError: 'ERRO CRÍTICO',
      // Success Insights
      successInsights: 'Insights de Sucesso',
      personalizedAnalytics: 'Análises personalizadas em breve',
      trackApplicationsToUnlock: 'Rastreie 3+ candidaturas e consiga sua primeira entrevista para desbloquear insights personalizados',
      personalDataMoat: 'Sua vantagem de dados pessoais te espera',
      yourPersonalDataAdvantage: 'Sua vantagem de dados pessoais',
      moat: 'VANTAGEM',
      vsAverage: 'vs média',
      successRateLabel: 'taxa de sucesso',
      applicationsCount: 'Candidaturas',
      interviewsCount: 'Entrevistas',
      topPerformingKeywords: 'Palavras-Chave de Melhor Desempenho',
      dataUniqueToYou: '🔒 Estes dados são únicos para você e não podem ser replicados por concorrentes',
    },
    resumeDetail: {
      linkedinUpsellTitle: 'CV Otimizado → LinkedIn é o Próximo',
      linkedinUpsellDescription: 'Seu CV está pronto (Score: {score}%). 89% dos recrutadores verificam o LinkedIn antes de entrar em contato. Não perca oportunidades por causa de um perfil desatualizado.',
      optimizeLinkedIn: 'Otimizar LinkedIn Agora',
      maybeLater: 'Talvez Mais Tarde',
      checkLinkedIn: 'verificam LinkedIn',
      moreCallbacks: 'mais retornos',
      zeroMetricsTitle: 'ZERO MÉTRICAS = AUTO-REJEIÇÃO',
      businessImpact: 'IMPACTO DE NEGÓCIO:',
      atsAutoReject: 'dos sistemas ATS rejeitam automaticamente currículos sem números',
      recruitersSpend6Seconds: 'Recrutadores passam 6 segundos - métricas chamam atenção instantaneamente',
      higherCallbackRate: 'taxa de retorno mais alta quando há conquistas quantificáveis',
      immediateFix: 'CORREÇÃO IMEDIATA:',
      increasedSales: 'Aumentei as vendas em',
      reducedCosts: 'Reduzi os custos em',
      ledTeam: 'Liderei uma equipe de',
      editTab: 'Editar',
      robotView: 'Visão Robô',
      progressTab: 'Progresso',
      actionPlanTab: 'Plano de Ação',
      interviewTab: 'Entrevista',
      recruiterTab: 'Recrutador',
      apply: 'Aplicar',
      optimizing: 'Otimizando...',
      reanalyze: 'Re-analisar',
      cancel: 'Cancelar',
    },
    previewScan: {
      title: 'Scan Diagnóstico Profundo',
      subtitle: 'Veja exatamente como os sistemas ATS analisam seu currículo - sem cadastro',
      dropHere: 'Solte seu currículo aqui',
      orBrowse: 'ou clique para procurar arquivos',
      supports: 'Suporta PDF, Word e Imagens',
      addJobDesc: 'Adicionar descrição da vaga alvo para melhor correspondência (opcional)',
      targetJobPosition: 'Posição Alvo',
      jobDescPlaceholder: 'Cole aqui a descrição completa da vaga...',
      jobDescAdded: 'Descrição da vaga adicionada - melhorará a análise de palavras-chave',
    },
    nav: {
      features: 'Recursos',
      pricing: 'Preços',
      login: 'Entrar',
      logIn: 'Entrar',
      signUp: 'Cadastrar',
      dashboard: 'Painel',
      blog: 'Blog',
      product: 'Produto',
    },
    buttons: {
      uploadResume: 'Carregar Currículo',
      uploadNewCv: 'Carregar Novo Currículo',
      tryFree: 'Experimentar Grátis',
      getSingleScan: 'Obter Scan Único',
      startSprint: 'Iniciar Sprint',
      checkMyResume: 'Verificar Meu Currículo',
      seeHowItWorks: 'Ver Como Funciona',
      viewFullReport: 'Ver Relatório Completo',
      managePlan: 'Gerenciar Plano',
      upgradeNow: 'Atualizar Agora',
      buyMoreCredits: 'Comprar Mais Créditos',
      launchTool: 'Iniciar Ferramenta',
    },
    navbar: {
      analyzer: 'Analisador',
      tools: 'Ferramentas',
      pricing: 'Preços',
      dashboard: 'Painel',
      login: 'Entrar',
      scanResume: 'Escanear Currículo',
      scan: 'Escanear',
    },
    auth: {
      loading: 'Iniciando sessão...',
      analyzing: 'ANALISANDO_ESTRUTURA...',
      parsing: 'ANALISANDO_PALAVRAS...',
      optimizing: 'OTIMIZANDO_PONTUAÇÃO_ATS...',
      headline: 'Depure seu histórico profissional com precisão.',
      subtitle: 'Junte-se a milhares de candidatos que otimizaram seus currículos com análise baseada em IA e conquistaram seus empregos dos sonhos.',
      initSession: 'Inicializar Sessão',
      enterCredentials: 'Digite suas credenciais para acessar o console',
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      noAccount: 'Não tem conta?',
      haveAccount: 'Já tem uma conta?',
      deployNew: '[Criar novo perfil]',
      signInLink: '[Entrar]',
      version: 'v2.4.0-stable',
      systemStatus: 'Sistema Operacional',
      blueprintTitle: 'Depure Seu Currículo como um Profissional',
      blueprintSubtitle: 'Junte-se a milhares de candidatos que otimizaram seus currículos com insights alimentados por IA e conseguiram seus empregos dos sonhos.',
      blueprintDescription: 'Junte-se a milhares de candidatos que otimizaram seus currículos com insights alimentados por IA e conseguiram seus empregos dos sonhos.',
      feature1Title: 'Visão Robô ATS',
      feature1Desc: 'Veja exatamente o que os sistemas dos recrutadores veem',
      feature2Title: 'Análise Alimentada por IA',
      feature2Desc: 'Obtenha feedback instantâneo sobre palavras-chave, formato e impacto',
      feature3Title: 'Acompanhar Candidaturas',
      feature3Desc: 'Gerencie sua busca de emprego em um só lugar',
      termsAgreement: 'Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade',
      atsVision: 'Visão de Robô ATS',
      atsVisionDesc: 'Veja exatamente o que os sistemas de recrutadores veem',
      aiAnalysis: 'Análise com IA',
      aiAnalysisDesc: 'Receba feedback instantâneo sobre palavras-chave, formato e impacto',
      trackApps: 'Rastreie Candidaturas',
      trackAppsDesc: 'Gerencie sua busca de emprego em um só lugar',
    },
    sidebar: {
      home: 'Início',
      myResumes: 'Meus Currículos',
      aiTools: 'Ferramentas IA',
      eliteMatch: 'Match Elite',
      settings: 'Configurações',
      adminPanel: 'Painel Admin',
      sprintActive: 'Sprint Ativo',
      days: 'DIAS',
      hours: 'HRS',
      minutes: 'MIN',
      managePlan: 'Gerenciar Plano',
      upgradeNow: 'Atualizar Agora',
      proPlan: 'Plano Pro',
      freePlan: 'Plano Gratuito',
    },
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      landingPage: 'Página Inicial',
      signOut: 'Sair',
      upload: 'Enviar',
      download: 'Baixar',
      edit: 'Editar',
    },
    showcase: {
      badge: 'Scanner ATS Gratuito',
      heading: 'Vença os Sistemas ATS',
      subheading: 'Em 10 Segundos',
      description: 'Veja seu currículo como os robôs veem. Obtenha feedback instantâneo e consiga mais entrevistas.',
      robotTech: 'Tecnologia Visão Robô',
      robotDesc: 'Veja exatamente o que os robôs ATS veem - sem adivinhação',
      instantScore: 'Pontuação ATS Instantânea',
      instantDesc: 'Obtenha sua pontuação de compatibilidade em 10 segundos',
      smartKeyword: 'Análise Inteligente de Palavras-Chave',
      smartDesc: 'Correspondência alimentada por IA com descrições de vagas',
      enterpriseSec: 'Segurança Empresarial',
      enterpriseDesc: 'Seus dados permanecem privados e seguros',
      ctaBanner: 'Obtenha Sua Pontuação ATS Grátis',
      ctaSubtext: 'Escaneie seu currículo em 10 segundos - sem cadastro',
      ctaButton: 'Experimente o Scan Grátis →',
    },
    comparison: {
      badge: 'Verificação de Realidade',
      heading: 'O que você vê vs. O que eles veem',
      description: 'A maioria dos modelos de currículo modernos parecem ótimos para humanos, mas são um pesadelo para robôs. Colunas, ícones e gráficos frequentemente quebram a lógica de análise.',
      humanView: 'Visão Humana (PDF)',
      robotView: 'Visão Robô (Analisado)',
    },
    footer: {
      description: 'Vença os sistemas ATS com otimização de currículo alimentada por IA. Seja contratado mais rápido.',
      product: 'Produto',
      pricing: 'Preços',
      freeScanner: 'Scanner Gratuito',
      blog: 'Blog',
      resources: 'Recursos',
      aboutUs: 'Sobre Nós',
      contactUs: 'Fale Conosco',
      legal: 'Legal',
      privacy: 'Política de Privacidade',
      terms: 'Termos e Condições',
      copyright: '© 2026 CVDebug Inc. Todos os direitos reservados. Status do Sistema:',
      systemStatus: 'Status do Sistema:',
      online: 'Online',
    },
    landing: {
      nav: {
        features: 'Recursos',
        pricing: 'Preços',
        login: 'Entrar',
        signUp: 'Cadastrar',
      },
      hero: {
        title: 'Depure Seu Currículo Como um Profissional',
        subtitle: 'Pare de ser rejeitado. Veja exatamente o que os sistemas ATS veem e corrija em minutos.',
        startButton: 'Iniciar Scan Grátis',
        viewDemo: 'Ver Demonstração',
      },
      socialProof: {
        trustedBy: 'Confiado por profissionais em',
      },
      stats: {
        stat1: 'Mais de 50.000 currículos analisados',
        stat2: '89% mais entrevistas',
        stat3: 'Scan em 10 segundos',
        stat4: 'Segurança de nível empresarial',
      },
      cta: {
        badge: 'Começar',
        heading: 'Pronto para conseguir o emprego dos seus sonhos?',
        description: 'Junte-se a milhares de profissionais bem-sucedidos que melhoraram seus currículos com CVDebug.',
        buttonText: 'Iniciar Scan Grátis Agora',
        footerText: 'Não é necessário cartão de crédito',
        secondary: 'Ainda tem dúvidas? Experimente nosso scanner ATS gratuito agora',
        button: 'Escaneie Seu Currículo Grátis →',
      },
      faq: {
        heading: 'Perguntas Frequentes',
        question1: 'O que é um sistema ATS?',
        answer1: 'ATS (Sistema de Rastreamento de Candidatos) é um software que as empresas usam para filtrar currículos antes que cheguem aos recrutadores humanos. A maioria das grandes empresas usa ATS, e pode rejeitar até 75% dos currículos.',
        question2: 'Como o CVDebug me ajuda?',
        answer2: 'O CVDebug mostra exatamente como os sistemas ATS analisam seu currículo, identifica palavras-chave ausentes e fornece recomendações práticas para melhorar sua pontuação ATS.',
        question3: 'Meus dados estão seguros?',
        answer3: 'Sim! Usamos criptografia de nível empresarial e nunca compartilhamos seus dados com terceiros. Seu currículo é processado com segurança e excluído após a análise, a menos que você o salve.',
        stillHaveQuestions: 'Ainda tem dúvidas? Experimente nosso scanner ATS gratuito agora',
        tryFreeScan: 'Escaneie Seu Currículo Grátis →',
      },
      testimonials: {
        badge: 'Mural de Amor do Reddit',
        heading: 'Confiado por Redditors em Todo o Mundo',
        subheading: 'Feedback real de r/resumes, r/developersIndia, r/cscareerquestions, e mais.',
        subtitle: 'Feedback real de r/resumes, r/developersIndia, r/cscareerquestions, e mais.',
        joinThousands: 'Junte-se a milhares de candidatos otimizando seus currículos',
        subreddits: 'r/resumes, r/developersIndia, r/cscareerquestions, r/ProductManagement, r/datascience',
      },
      enterprise: {
        badge: 'Empresarial',
        title: 'Escale Seu Recrutamento',
        subtitle: 'Sem Concessões',
        description: 'Desenvolvido para equipes de recrutamento que processam milhares de candidaturas. Obtenha descontos por volume, suporte dedicado e integrações personalizadas.',
        contactSales: 'Contatar Vendas',
        viewPricing: 'Ver Preços',
        feature1: 'Gestão de Equipe',
        feature1Desc: 'Painel centralizado para equipes de RH rastrearem todas as candidaturas',
        feature2: 'Conformidade SOC 2',
        feature2Desc: 'Segurança de nível empresarial com SSO e controle de acesso baseado em funções',
        feature3: 'Acesso à API',
        feature3Desc: 'Integre o escaneamento ATS diretamente no seu fluxo de trabalho de recrutamento',
      },
      finalCta: {
        heading: 'Pronto para depurar sua carreira?',
        description: 'Junte-se a mais de 10.000 desenvolvedores que corrigiram seus erros de análise e dobraram sua taxa de entrevistas.',
        button: 'Verificar Minha Visibilidade (Scan Grátis)',
        footer: 'Não é necessário cartão de crédito • Conformidade LGPD • Resultado Instantâneo',
      },
    },
    onboarding: {
      steps: {
        role: 'Função',
        upload: 'Carregar',
        scan: 'Escanear',
      },
      roleSelection: {
        heading: 'Qual função você está almejando?',
        editLink: 'Editar',
        continueButton: 'Continuar',
      },
      cvUpload: {
        heading: 'Carregue Seu Currículo',
        description: 'Solte seu arquivo de currículo ou clique para procurar',
        clickToUpload: 'Clique para carregar',
        dragDrop: 'ou arraste e solte',
        maxSize: 'PDF, DOC, DOCX até 10MB',
        log1: '[INIT] Analisando estrutura do documento...',
        log2: '[SCAN] Analisando palavras-chave e formatação...',
        log3: '[CHECK] Executando verificações de compatibilidade ATS...',
        log4: '[MATCH] Comparando com requisitos da vaga...',
        log5: '[SCORE] Calculando pontuação final...',
        log6: '[DONE] Análise concluída!',
        systemLogs: 'Logs do Sistema',
        backButton: 'Voltar',
        scanButton: 'Escanear Currículo',
      },
      helpCenter: {
        label: 'Central de Ajuda',
      },
    },
    pricingPage: {
      freePlan: {
        name: 'Scan Grátis',
        description: 'Perfeito para experimentar o CVDebug',
        price: '0',
        period: 'único',
        feature1: '1 scan de currículo grátis',
        feature2: 'Pontuação ATS básica',
        feature3: 'Visualização robô',
        feature4: 'Análise de palavras-chave',
        button: 'Iniciar Scan Grátis',
      },
      pass24h: {
        name: 'Passe 24 Horas',
        description: 'Scans ilimitados por um dia',
        price: '45',
        period: '24 horas',
        feature1: 'Scans de currículo ilimitados',
        feature2: 'Relatório completo de compatibilidade ATS',
        feature3: 'Análise detalhada de palavras-chave',
        feature4: 'Recomendações de formatação',
        feature5: 'Download de relatórios PDF',
        feature6: 'Suporte por email',
        feature7: 'Acesso de 24 horas',
        button: 'Obter Passe de 24 Horas',
      },
      sprint7d: {
        name: 'Sprint 7 Dias',
        description: 'Perfeito para busca de emprego',
        price: '145',
        period: '7 dias',
        feature1: 'Tudo no Passe de 24 Horas',
        feature2: 'Versões de currículo ilimitadas',
        feature3: 'Otimização com IA',
        feature4: 'Correspondência personalizada de vagas',
        feature5: 'Suporte prioritário',
        feature6: 'Acesso ao criador de currículos',
        feature7: 'Análise de carta de apresentação',
        feature8: 'Dicas de otimização do LinkedIn',
        feature9: 'Acesso de 7 dias',
        button: 'Iniciar Sprint de 7 Dias',
        recommended: 'Mais Popular',
      },
      hero: {
        badge: 'Preços',
        title: 'Escolha Seu Plano',
        subtitle: 'Obtenha o plano perfeito para sua busca de emprego',
      },
      faq: {
        heading: 'Perguntas Frequentes sobre Preços',
        question1: 'Posso cancelar a qualquer momento?',
        answer1: 'Sim! Você pode cancelar sua assinatura a qualquer momento. Sem perguntas.',
        question2: 'Quais métodos de pagamento vocês aceitam?',
        answer2: 'Aceitamos todos os principais cartões de crédito, PayPal e Apple Pay.',
        question3: 'Existe política de reembolso?',
        answer3: 'Sim, oferecemos garantia de reembolso de 7 dias se você não estiver satisfeito com nosso serviço.',
        question4: 'Posso fazer upgrade do meu plano?',
        answer4: 'Com certeza! Você pode fazer upgrade de qualquer plano para um nível superior a qualquer momento.',
        question5: 'Vocês oferecem descontos?',
        answer5: 'Sim! Oferecemos descontos para estudantes e preços especiais para centros de carreira. Entre em contato para mais detalhes.',
        question6: 'O que acontece após meu plano expirar?',
        answer6: 'Você manterá acesso aos seus relatórios salvos, mas precisará renovar para criar novos scans.',
      },
      guarantee: 'Garantia de reembolso de 30 dias',
    },
    modals: {
      subscription: {
        title: 'Status da Assinatura',
        tier: 'Plano Atual',
        accessMessage: 'Você tem acesso completo a todos os recursos',
        upgradeMessage: 'Faça upgrade para desbloquear recursos premium',
        viewOptions: 'Ver Opções',
        continueDashboard: 'Continuar para o Painel',
        pressEsc: 'Pressione ESC para fechar',
        premium: 'Premium',
        interviewSprint: 'Sprint 7 Dias',
        singleScan: 'Passe 24 Horas',
        freePlan: 'Plano Gratuito',
        scoreChanged: 'Sua pontuação mudou? Veja o porquê',
        nowMatching: 'Agora comparamos seu CV com os Padrões da Indústria.',
        realVisibility: 'Sua visibilidade real é',
        whyLower: 'O scan de prévia foi uma verificação rápida. O painel mostra sua compatibilidade ATS real.',
        industryStandards: 'Comparamos com requisitos reais do mercado de trabalho.',
      },
      logout: {
        title: 'Sair',
        question: 'Tem certeza de que deseja sair?',
        stayButton: 'Continuar Conectado',
        logoutButton: 'Sair',
      },
      creditsExhausted: {
        title: 'Créditos Esgotados',
        message: 'Você usou todos os seus scans gratuitos',
        scoreLabel: 'Sua Pontuação',
        warning: 'Faça upgrade para ver sua análise completa',
        feature1: 'Relatório detalhado de compatibilidade ATS',
        feature2: 'Sugestões de otimização de palavras-chave',
        price: 'R$ 45',
        unlockButton: 'Desbloquear Relatório Completo',
        maybeLater: 'Talvez Depois',
      },
    },
    toasts: {
      errors: {
        selectRating: 'Por favor, selecione uma avaliação',
        submissionFailed: 'Falha no envio do feedback',
        fileRequired: 'Por favor, selecione um arquivo',
        invalidFormat: 'Formato de arquivo inválido',
        uploadFailed: 'Falha no upload',
        aiProcessingError: 'Erro no processamento da IA',
        fetchError: 'Falha ao buscar dados',
        unauthorized: 'Acesso não autorizado',
        noCredits: 'Sem créditos disponíveis. Faça upgrade para continuar.',
        apiKeyNotConfigured: 'Chave API não configurada. Entre em contato com o suporte em cvdebug@outlook.com',
        noTransactionId: 'Nenhum ID de transação disponível',
        checkoutError: 'Falha ao iniciar checkout',
        loginRequired: 'Por favor, faça login para comprar créditos',
        initiateError: 'Falha ao iniciar pagamento',
      },
      success: {
        feedbackSubmitted: 'Obrigado pelo seu feedback!',
        cvUploaded: 'CV Enviado com Sucesso!',
        saved: 'Alterações salvas!',
        deleted: 'Excluído com sucesso',
        updated: 'Atualizado com sucesso',
        copied: 'Copiado para a área de transferência!',
        downloaded: 'Baixado com sucesso',
        generated: 'Gerado com sucesso!',
        optimized: 'Otimizado com sucesso!',
        applied: 'Aplicado com sucesso!',
      },
      warnings: {
        fileTooLarge: 'Arquivo muito grande',
        limitReached: 'Limite atingido',
        replaceBrackets: 'Não se esqueça de substituir os valores [entre colchetes] pelos seus números reais!',
      },
    },
    images: {
      userAvatar: 'Avatar do usuário',
      logo: 'Logo CVDebug',
      feature: 'Ilustração do recurso',
    },
    admin: {
      title: 'Painel Admin',
      users: 'Usuários',
      analytics: 'Analytics',
      settings: 'Configurações',
      import: {
        syncComplete: 'Sincronização Concluída',
        syncFailed: 'Sincronização Falhou',
        importFailed: 'Importação Falhou',
        importSuccess: 'Importação Bem-Sucedida',
      },
      grant: {
        emailPlaceholder: 'usuario@exemplo.com ou user_2...',
        namePlaceholder: 'João Silva',
        planPlaceholder: 'Selecionar plano',
      },
      payment: {
        emailPlaceholder: 'E-mail do Usuário',
      },
      payments: {
        received: '💰 Novo Pagamento Recebido!',
      },
      usersTable: {
        searchPlaceholder: 'Buscar usuários...',
        updated: 'Usuário atualizado com sucesso',
        updateError: 'Falha ao atualizar usuário',
      },
      fix: {
        error: 'Falha ao corrigir usuários',
        complete: 'Correção Concluída',
        reportedError: 'Falha ao corrigir usuários reportados',
        reportedComplete: 'Correção de Usuários Reportados Concluída',
        deleteSuccess: 'Usuário excluído',
        deleteError: 'Falha ao excluir usuário',
      },
    },
    tools: {
      writingForge: {
        title: 'Forja de Escrita',
        description: 'Editor de CV com IA',
        placeholder: 'Cole o texto do seu CV aqui...',
        analyzing: 'Analisando com IA...',
        error: 'Erro no processamento',
        noText: 'Nenhum texto para processar',
        tooShort: 'Texto muito curto',
        generating: 'Gerando melhorias...',
        improvementReady: 'Melhorias prontas!',
        noResume: 'Nenhum texto de CV para editar',
        emptyResume: 'CV não pode estar vazio',
        saveError: 'Não foi possível salvar as alterações',
        saved: 'Alterações salvas!',
        saveFailed: 'Falha ao salvar alterações',
        noTextToRegenerate: 'Nenhum texto de CV para regenerar',
        regenerating: 'Regenerando com IA...',
        regenerated: 'CV regenerado!',
        preparingPdf: 'Preparando download do PDF...',
        editPlaceholder: 'Edite seu CV aqui...',
      },
      interviewBattle: {
        title: 'Battle de Entrevistas',
        description: 'Pratique perguntas de entrevista com IA',
        noResumeText: 'Por favor, envie um CV primeiro',
        regenerating: 'Regenerando perguntas...',
        questionsRegenerated: 'Perguntas regeneradas!',
        generateError: 'Falha na geração de perguntas',
        enhancing: 'Melhorando resposta...',
        answerEnhanced: 'Resposta melhorada!',
        actionPlaceholder: 'O que você fez?',
        downloading: 'Baixando...',
        noJobDesc: 'Sem descrição da vaga',
        battlePlanGenerated: 'Plano de Battle gerado!',
        battlePlanError: 'Falha na geração do Plano de Battle',
        jobDescPlaceholder: 'Cole a descrição da vaga...',
        invalidJobDesc: 'Descrição da vaga inválida',
        shortResume: 'CV muito curto',
        requiresSubscription: 'Requer assinatura',
      },
      linkedIn: {
        title: 'Otimizador de LinkedIn',
        description: 'Otimize seu perfil do LinkedIn',
        upgradeDescription: 'Upgrade para otimização do LinkedIn',
        noProfileText: 'Por favor, insira texto do perfil',
        analyzed: 'Perfil analisado!',
        scanError: 'Falha no scan',
        noBioOptimization: 'Sem otimização de bio disponível',
        bioOptimized: 'Bio otimizada!',
      },
      answerFinder: {
        title: 'Localizador de Respostas',
        searchPlaceholder: 'Buscar por respostas...',
      },
      keywordSniper: {
        title: 'Sniper de Palavras-Chave',
        uploadResume: 'Enviar CV',
        pasteJob: 'Colar descrição da vaga',
        analyzing: 'Analisando palavras-chave...',
        generateError: 'Falha na geração',
        applied: 'Aplicado!',
        rewritten: 'Reescrito!',
        exampleDescription: 'Descrição de exemplo',
      },
      bullet: {
        noInput: 'Sem entrada',
        optimized: 'Otimizado!',
        rewriteError: 'Falha na reescrita',
        examplePlaceholder: 'Exemplo de bullet point...',
        rolePlaceholder: 'Inserir cargo...',
        powerStatementCopied: 'Power Statement copiado!',
      },
      coverLetter: {
        title: 'Gerador de Carta de Apresentação',
        upgradeDescription: 'Upgrade para carta de apresentação',
        noJobDescription: 'Sem descrição da vaga',
        generated: 'Carta gerada!',
        generateError: 'Falha na geração',
        selectResume: 'Selecionar CV',
        companyPlaceholder: 'Nome da empresa',
        rolePlaceholder: 'Título da vaga',
      },
      dm: {
        title: 'Gerador de DM',
        noProfile: 'Sem perfil',
        generated: 'DM gerada!',
        generateError: 'Falha na geração',
        copied: 'Copiado!',
        namePlaceholder: 'Inserir nome',
      },
      headline: {
        title: 'Gerador de Headline',
        copied: 'Headline copiada!',
      },
      liveOptimizer: {
        title: 'Otimizador ao Vivo',
        placeholder: 'Digite o texto aqui...',
      },
    },
    dashboardExtended: {
      applications: {
        upgradeDescription: 'Faça upgrade para rastrear candidaturas e obter insights com IA',
        added: 'Candidatura adicionada com sucesso',
        addError: 'Erro ao adicionar candidatura',
        companyPlaceholder: 'ex., Acme Corp',
        rolePlaceholder: 'ex., Engenheiro Sênior',
        urlPlaceholder: 'https://...',
        jobDescPlaceholder: 'Cole a descrição da vaga aqui para correspondência de palavras-chave com IA...',
      },
      projects: {
        created: 'Projeto criado com sucesso!',
        createError: 'Erro ao criar projeto',
        projectPlaceholder: 'ex. Busca por Engenheiro Sênior no Google',
        titlePlaceholder: 'ex. Engenheiro de Software Sênior, Gerente de Produto...',
        urlPlaceholder: 'https://linkedin.com/jobs/view/...',
        jobDescPlaceholder: 'Cole aqui a descrição completa da vaga...',
        uploadSuccess: 'CV Carregado com Sucesso!',
      },
      ats: {
        textCopied: 'Texto bruto copiado para a área de transferência',
        textDownloaded: 'Texto bruto baixado',
        searchPlaceholder: 'Pesquisar por palavra-chave...',
      },
      fluff: {
        metricCopied: 'Métrica copiada para a área de transferência!',
        copyError: 'Erro ao copiar para a área de transferência',
        copyErrorDescription: 'Por favor, tente selecionar o texto manualmente.',
        noMetricSelected: 'Por favor, selecione uma métrica primeiro',
        noMetricDescription: 'Escolha uma das quantificações sugeridas pela IA acima.',
      },
      sanitize: {
        noResume: 'Não é possível higienizar: ID do CV ausente',
        success: 'PDF higienizado com sucesso!',
        successDescription: 'A integridade da camada de texto foi restaurada.',
        error: 'Erro ao higienizar PDF',
      },
      scanning: {
        fileValidation: 'Validação do Arquivo',
        fileValidationSubtitle: 'A estrutura do PDF é válida.',
        layoutIntegrity: 'Integridade do Layout',
        layoutIntegritySubtitle: 'Verificando margens e fluxo de texto.',
        keywordMatch: 'Correspondência de Palavras-Chave',
        keywordMatchSubtitle: 'PENDENTE',
        timeline: 'Linha do Tempo da Experiência',
        timelineSubtitle: 'Analisando progressão de carreira.',
        scoring: 'Pontuação e Relatório',
        scoringSubtitle: 'Calculando pontuação final.',
      },
      metrics: {
        noQuantified: 'Por favor, forneça uma versão quantificada',
        replaceBrackets: 'Não se esqueça de substituir os valores [entre colchetes] pelos seus números reais!',
        updated: 'Ponto de marcador atualizado com métricas!',
      },
      insights: {
        overall: 'Geral',
        keywordMatch: 'Correspondência de Palavras-Chave',
        actionVerbs: 'Verbos de Ação',
        impact: 'Impacto',
        structure: 'Estrutura',
      },
      kanban: {
        applied: 'Candidatado',
        interviewing: 'Em Entrevista',
        accepted: 'Aceito',
      },
      analysis: {
        error: 'A análise do CV falhou. Por favor, tente novamente.',
      },
      reportUnlocked: '🎉 Relatório de CV desbloqueado! Seus créditos foram aplicados.',
      resumeDeleted: 'CV excluído',
      upgrade: {
        interviewSprintRequired: 'Plano Sprint de Entrevista necessário',
      },
      feedback: {
        noRating: 'Por favor, selecione uma avaliação',
        success: 'Obrigado pelo seu feedback!',
        submitError: 'Erro ao enviar feedback',
        commentPlaceholder: 'Algum comentário adicional? (opcional)',
        tellMore: 'Conte-nos mais (opcional)',
      },
    },
    pages: {
      nursing: {
        title: 'Scanner ATS para Enfermeiras',
        clinical: 'Otimizador de Palavras-Chave Clínicas',
        healthcare: 'Compatibilidade ATS de Saúde',
        credentials: 'Validador de Licença e Credenciais',
      },
      medSurg: {
        title: 'Otimizador ATS para Enfermeiras Med-Surg',
        generic: 'Genérico',
        patientRatios: 'Proporções de Pacientes Não Quantificadas',
        surgicalExperience: 'Experiência Cirúrgica Enterrada',
      },
      softwareEngineer: {
        title: 'Atirador de Palavras-Chave para Engenheiros de Software',
        techStack: 'Atirador de Palavras-Chave de Tech Stack',
        faang: 'Compatibilidade ATS FAANG',
        systemDesign: 'Validador de Design de Sistemas',
      },
      dataAnalyst: {
        title: 'Depuração de CV para Analistas de Dados',
        skills: 'Analisador de Habilidades Técnicas',
        metrics: 'Analisador de Impacto de Métricas',
        techStack: 'Correspondência de Palavras-Chave de Tech Stack',
      },
      finance: {
        title: 'Otimizador ATS para Estágios Financeiros',
        ibKeywords: 'Validador de Palavras-Chave IB',
        format: 'Verificador de Formato de Estágio',
        metricsOptimizer: 'Otimizador de Métricas Financeiras',
      },
      about: {
        title: 'Sobre o CVDebug - Otimização de CV ATS com IA',
        missionDriven: 'Orientado pela Missão',
        jobSeeker: 'Candidato em Primeiro Lugar',
        innovation: 'Inovação',
        privacyTitle: 'Privacidade e Confiança',
      },
      blog: {
        title: 'Dicas de CV ATS e Estratégias de Busca de Emprego Blog | CVDebug',
      },
      privacy: {
        title: 'Política de Privacidade | CVDebug',
      },
      terms: {
        title: 'Termos e Condições | CVDebug',
      },
      contact: {
        title: 'Fale Conosco | Suporte CVDebug',
        email: 'Suporte por Email',
        chat: 'Chat ao Vivo',
        responseTime: 'Tempo de Resposta',
        location: 'Localização',
        namePlaceholder: 'João Silva',
        emailPlaceholder: 'joao@exemplo.com',
        messagePlaceholder: 'Como podemos ajudá-lo?',
      },
    },
    payment: {
      success: 'Pagamento bem-sucedido! Desbloqueando seu relatório de CV...',
      creditError: 'Pagamento registrado mas falha ao atualizar créditos. Por favor contate o suporte',
      noTransactionId: 'Nenhuma ID de transação disponível',
      receiptDownloaded: 'Recibo baixado com sucesso',
      downloadError: 'Erro ao baixar recibo',
      checkoutError: 'Erro ao iniciar pagamento',
      loginRequired: 'Por favor faça login para comprar créditos',
      initiateError: 'Erro ao iniciar pagamento',
    },
    previewScanExtended: {
      processError: 'Erro ao processar arquivo',
    },
    heroSection: {
      badge: 'Novo: Análise ATS Aprimorada com ML',
      mainHeadline: 'O ATS está bloqueando <br />seu currículo?',
      diagnosticNote: 'CVDebug é uma ferramenta de diagnóstico, não uma solução mágica.',
      oneTimePayment: 'Pagamento único, sem assinaturas.',
      checkResumeButton: 'Verificar Meu Currículo',
      seeHowButton: 'Ver Como Funciona',
      trustedBy: 'Confiado por',
      jobSeekers: 'profissionais',
      criticalFixNeeded: 'Correção Crítica Necessária',
      missingKeywordsAlert: 'Seu currículo está faltando 3 palavras-chave críticas encontradas na descrição do trabalho',
    },
    ctaSection: {
      payOnceBadge: 'Pague uma vez, use quando quiser',
      readyHeading: 'Pronto para vencer o ATS?',
      description: 'Obtenha análise aprimorada com ML com ponderação de palavras-chave TF-IDF, detecção de formato e correções acionáveis. 1 scan = 1 crédito. Sem assinaturas.',
      startButton: 'Iniciar Seu Primeiro Scan',
      footnote: '✨ Primeiro scan grátis • Créditos nunca expiram • Resultados instantâneos',
    },
    testimonialsSection: {
      badge: 'Muro de Amor do Reddit',
      heading: 'Confiado por Redditors no Mundo Todo',
      description: 'Feedback real de r/resumes, r/developersIndia, r/cscareerquestions e mais.',
      ctaText: 'Junte-se a milhares de profissionais otimizando seus currículos',
    },
    faqSection: {
      heading: 'Perguntas Comuns',
      q1: 'Vocês vendem meus dados?',
      a1: 'Nunca. Seu currículo é analisado em memória e armazenado com segurança apenas para sua sessão. Não vendemos dados para recrutadores ou terceiros.',
      q2: 'O que é a "Armadilha da Imagem"?',
      a2: 'Muitos modelos de currículo modernos (do Canva ou Photoshop) exportam texto como imagens achatadas. Sistemas ATS não conseguem ler imagens, então sua experiência é invisível. CVDebug detecta isso e mostra exatamente o que o ATS vê.',
      q3: 'Funciona para todas as indústrias?',
      a3: 'Sim, mas é otimizado para funções técnicas e corporativas onde o uso de ATS é mais alto. Campos criativos podem ter requisitos diferentes.',
    },
    pricingSection: {
      heading: 'Preços Simples',
      subheading: 'Pague uma vez. Corrija para sempre. Sem assinaturas.',
      freePreview: 'Visualização Gratuita',
      free: 'Grátis',
      seeScore: 'Ver sua pontuação ATS',
      tryFree: 'Experimentar Grátis',
      singleScan: 'Scan Único',
      oneCompleteFix: 'Uma correção completa',
      getSingleScan: 'Obter Scan Único',
      interviewSprint: 'Sprint de Entrevistas',
      sevenDaysUnlimited: '7 dias ilimitados',
      startSprint: 'Iniciar Sprint',
      bestValue: '🚀 MELHOR VALOR',
    },
    statsSection: {
      rejectionRate: '75%',
      rejectionLabel: 'Currículos rejeitados pelo ATS',
      noBSLabel: 'Sem Enrolação',
      transparentPricing: 'Preços Transparentes',
      analysisTime: '10s',
      avgTimeLabel: 'Tempo médio de análise',
      secureLabel: 'Seguro',
      dataRetention: 'Dados excluídos em 30 dias',
    },
    featuresBento: {
      scatteredResumesTitle: 'Por que currículos dispersos matam sua busca de emprego',
      projectBasedTitle: 'Rastreamento Baseado em Projetos',
      projectBasedDesc: 'Crie projetos de busca de emprego e rastreie cada candidatura com pontuações de correspondência, cartas de apresentação personalizadas e lacunas de palavras-chave. Veja quais empresas estão te ignorando.',
      healthMonitorTitle: 'Monitor de Saúde em Tempo Real',
      healthMonitorDesc: 'Verificações contínuas de integridade do CV alertam você instantaneamente se a formatação quebrar ou as palavras-chave desviarem. Mantenha seu CV mestre pronto para ATS 24/7.',
      keywordGapTitle: 'Análise de Lacuna de Palavras-Chave',
      keywordGapDesc: 'Veja lado a lado o que o Google quer vs. o que a Meta quer. Copie e cole descrições de trabalhos e obtenha correspondências de palavras-chave pontuadas por TF-IDF instantâneas.',
      aiCoverLetterTitle: 'Gerador de Cartas de Apresentação IA',
      aiCoverLetterDesc: 'Gere cartas de apresentação personalizadas que fecham explicitamente suas lacunas de palavras-chave. Cada carta faz referência às suas habilidades ausentes reais da análise de lacuna.',
    },
    freeTierView: {
      founderAudit: 'Auditoria do Fundador',
      byAlbert: 'por Albert',
      bottomPercentile: 'Você está nos {percentileRank}% Inferiores de Candidatos',
      yourScore: 'Sua Pontuação',
      autoRejected: 'Auto-rejeitado por 90% das empresas',
      thoseWhoGetInterviews: 'Aqueles Que Conseguem Entrevistas',
      pointsHigher: '{missingPoints} pontos mais alto',
      passATSFilters: 'Passam filtros ATS',
      missingKeywords: 'Você está faltando {missingCount} palavras-chave críticas que eles têm',
      unlockList: '[Desbloquear lista completa por R$ 49,99]',
      robotViewTitle: '🤖 Visão Robô',
      freePreviewBadge: 'VISUALIZAÇÃO GRATUITA',
      robotViewDesc: 'Isto é exatamente o que o ATS vê ao analisar seu currículo',
      robotViewWarning: 'Se seu texto está faltando, confuso ou fora de ordem aqui, o ATS não consegue ler seu currículo. Esta é a razão #1 de rejeição automática.',
      noTextExtracted: 'Nenhum texto extraído. Isso significa que sistemas ATS não conseguem ler seu currículo de forma alguma.',
      parsingError: '[ERRO DE ANÁLISE DETECTADO]',
      hiddenContent: '⚠️ Conteúdo oculto bloqueado pelo analisador ATS',
      chatGPTCantFix: '💡 ChatGPT não pode consertar isso. Apenas nosso Sanitizador de PDF pode reparar erros de análise.',
      moreErrors: '+{number} mais erros de análise ocultos',
      topCriticalErrors: 'Principais Erros Críticos',
      showingErrors: 'Mostrando 2 de {formatCount}',
      missingCriticalKeywords: '🔑 Palavras-Chave Críticas Ausentes',
      highImpact: 'Alto Impacto',
      keywordsHidden: '{number} Palavras-Chave Críticas Ocultas',
      getCertified: 'Certifique Seu Currículo pelo CVDebug',
      unlockPackage: 'Desbloqueie {missingCount} palavras-chave exatas + {formatCount} correções críticas por um pagamento único de R$ 49,99',
      certificationPackage: '✅ Pacote de Certificação ATS:',
      allKeywords: 'Todas as {total} palavras-chave ausentes com colocação exata',
      allFormatErrors: 'Todos os {total} erros de formato com correções de 1 clique',
      aiRewrite: 'Sugestões de reescrita alimentadas por IA',
      atsCertifiedPDF: '✅ Download de PDF Certificado ATS com badge',
      pdfSanitizer: '⚡ Sanitizador de PDF de Um Clique em 3 segundos',
      getCertifiedButton: 'Ser Certificado - Apenas R$ 49,99',
      albertReview: 'Albert revisa seu CV pessoalmente',
      videoFeedback: 'Vídeo de 3 min com feedback brutal + todas as correções',
      manualReviewButton: 'Eu quero a revisão manual →',
      oneTimePayment: '✓ Pagamento único',
      instantAccess: '✓ Acesso instantâneo',
      noSubscription: '✓ Sem assinatura',
      socialProof: '2.847 usuários desbloquearam seus relatórios esta semana e',
      interviewIncrease: 'aumentaram sua taxa de entrevistas em 2x',
    },
    atsOverview: {
      title: 'Pontuação de Compatibilidade ATS',
      scoreOf100: '/ 100',
      beatingPercentile: 'Você está superando {percentile}% dos outros candidatos',
      eliteReady: 'Elite / Pronto para Aplicar',
      visibilityGap: 'A Lacuna de Visibilidade',
      criticalDanger: 'Perigo Crítico',
      topCriticalFailures: 'Principais Falhas Críticas',
      technicalVsHuman: 'Sinal Técnico vs. Humano',
      technicalSignalDesc: 'Formato, fontes, estrutura — o bot consegue ler?',
      technicalSignal: 'Sinal Técnico',
      humanSignal: 'Sinal Humano',
      humanSignalDesc: 'Senioridade, verbos de poder, impacto — impressionante para humanos?',
      balanceNote: 'Equilíbrio é a chave: Um currículo legível (bot) não é o mesmo que um currículo vendedor (humano). Você precisa de ambos.',
      contactCheck: 'Verificação Rápida: Contato e Redes',
      email: 'Email',
      phone: 'Telefone',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      missing: 'Ausente',
      seniorityInference: 'Inferência de Senioridade',
      aiInference: 'Inferência IA: Você soa como um',
      soundLikeSenior: 'Soa como um Arquiteto Senior',
      impactBreakdown: 'Detalhamento de Impacto',
      actionVerbs: 'Verbos de Ação',
      quantifiableMetrics: 'Métricas Quantificáveis',
      targetMetrics: 'Alvo: {number} métricas',
      softSkills: 'Soft Skills',
    },
    forms: {
      companyName: 'Nome da Empresa',
      companyPlaceholder: 'ex., Acme Corp',
      jobTitle: 'Título do Trabalho',
      jobTitlePlaceholder: 'ex., Engenheiro Senior',
      jobUrl: 'URL da Vaga de Emprego',
      jobUrlOptional: '(Opcional)',
      jobUrlPlaceholder: 'https://...',
      jobDescription: 'Descrição do Trabalho',
      jobDescRecommended: '(Recomendado para Análise IA)',
      jobDescPlaceholder: 'Cole a descrição do trabalho aqui para correspondência de palavras-chave alimentada por IA...',
      jobDescHint: 'Adicione a descrição do trabalho para obter análise instantânea de lacuna de palavras-chave',
      cancel: 'Cancelar',
      addApplication: 'Adicionar Candidatura',
      adding: 'Adicionando...',
      addedSuccess: 'Candidatura adicionada com sucesso',
      addedError: 'Falha ao adicionar candidatura',
    },
    dialogs: {
      addNewApplication: 'Adicionar Nova Candidatura',
      sprintRequired: 'Sprint de Entrevistas Necessário',
      upgradeMessage: 'Atualize para rastrear candidaturas, obter análise de palavras-chave e receber alertas de ignoramento.',
      upgradeNow: 'Atualizar Agora',
      sprintRequiredError: 'Plano Sprint de Entrevistas necessário',
      upgradeForInsights: 'Atualize para rastrear candidaturas e obter insights alimentados por IA',
    },
    scoreCard: {
      resumeIs: 'Seu currículo está',
      ofBots: '{percentage} dos bots.',
      excellent: 'Excelente',
      needsOptimization: 'Precisa de Otimização',
      criticalIssues: 'Problemas Críticos',
      excellentMessage: 'Bom trabalho! Seu currículo está bem otimizado para sistemas ATS.',
      optimizationMessage: 'Encontramos alguns problemas que podem estar causando rejeições. Vamos corrigi-los.',
      criticalMessage: 'Encontramos 3 erros críticos que podem estar causando rejeição automática. Estes precisam de atenção imediata.',
      downloadReport: 'Baixar Relatório',
      shareResults: 'Compartilhar Resultados',
    },
    keywordAnalysis: {
      title: 'Análise de Palavras-chave',
      subtitle: 'Correspondência semântica com descrições de trabalho padrão.',
      matchRate: 'Taxa de Correspondência',
      foundSignals: 'Sinais Encontrados',
      total: 'Total',
      groupByType: 'Agrupar por Tipo',
      listView: 'Visualização em Lista',
      gridView: 'Visualização em Grade',
      missingCriticalSignals: 'Sinais Críticos Ausentes',
      highImpact: 'Alto Impacto',
      fixingIncreases: 'Corrigir isso aumenta a pontuação em ~15%',
      viewExamples: 'Ver Exemplos',
      autoAdd: 'Adicionar Auto',
      industryKeywordFrequency: 'Frequência de Palavras-chave da Indústria',
      aiPowered: 'Alimentado por IA',
      showingExamples: 'Mostrando exemplos para',
      viewHowTopCandidates: 'Veja como os principais candidatos incorporam essa palavra-chave de forma eficaz.',
      displayingFlatList: 'Exibindo em lista plana',
      keywordsOrganized: 'Palavras-chave organizadas por categoria',
      switchedToView: 'Alternado para',
      showingAllKeywords: 'Mostrando todas as palavras-chave',
      groupedByType: 'Agrupado por tipo',
      noMissingSignals: 'Sem Sinais Ausentes',
      excellentKeywordCoverage: 'Bom trabalho! Seu currículo tem uma excelente cobertura de palavras-chave.',
      matchType: 'Tipo de Correspondência',
      exactMatch: 'Correspondência Exata',
      synonymMatch: 'Correspondência de Sinônimo',
      semanticMatch: 'Correspondência Semântica',
      foundInResume: 'Encontrado no Currículo',
      clickToHide: 'Clique para Ocultar',
      // Paywall content
      criticalSignalsLocked: 'Sinais Críticos Bloqueados',
      unlockFullAnalysis: 'Desbloquear Análise Completa',
      unlockDescription: 'Desbloqueie a análise completa de palavras-chave ausentes com impacto quantificado, descrições específicas e recomendações de IA para aumentar sua pontuação em até +15%.',
      quantifiedImpact: 'impacto quantificado',
      specificDescriptions: 'descrições específicas',
      aiRecommendations: 'recomendações de IA',
      increaseScoreBy: 'para aumentar sua pontuação em até +15%',
      detailedImpactAnalysis: 'Análise de impacto detalhada (+2% por palavra-chave)',
      impactPerKeyword: '+2% por palavra-chave',
      specificForEachKeyword: 'Descrições específicas para cada palavra-chave',
      recommendedLocation: 'Localização recomendada no currículo',
      autoAddWithAI: 'Adicionar Auto com IA (Writing Forge)',
      unlockComplete: 'Desbloquear Análise Completa',
      sevenDayPlan: 'Plano de 7 dias • €24.99',
      keywordsMissingLocked: 'Palavras-chave Ausentes Bloqueadas',
      unlockCompleteList: 'Desbloqueie a lista completa de palavras-chave críticas com impacto quantificado (+15% pontuação).',
      unlockButton: 'Desbloquear',
    },
    fluffDetector: {
      locked: 'Detector de Fluff Bloqueado',
      unlockPremium: 'Desbloquear Análise Premium',
      description: 'Desbloqueie a detecção de fluff alimentada por IA para identificar frases fracas, conquistas não quantificadas, e obter substituições acionáveis.',
      weakPhraseAnalysis: 'Detecção de frases fracas com contexto',
      quantifiedMetrics: 'Análise de conquistas não quantificadas',
      actionableReplacements: 'Substituições acionáveis alimentadas por IA',
      unlockFluff: 'Desbloquear Detector de Fluff',
    },
    interviewPrep: {
      locked: 'Plano de Batalha de Entrevista Bloqueado',
      unlockBattlePlan: 'Desbloquear Preparação de Entrevista',
      description: 'Gere preparação de entrevista personalizada com perguntas esperadas, histórias STAR, e pontos de conversa estratégicos baseados no seu currículo e descrição da vaga.',
      expectedQuestions: 'Perguntas de entrevista esperadas',
      starStories: 'Sugestões de histórias formato STAR',
      talkingPoints: 'Pontos de conversa estratégicos',
      unlockInterview: 'Desbloquear Plano de Batalha',
    },
    recruiterDM: {
      locked: 'Gerador de DM para Recrutadores Bloqueado',
      unlockDMGenerator: 'Desbloquear Gerador de DM',
      description: 'Gere mensagens personalizadas para recrutadores com múltiplas variações otimizadas com palavras-chave da sua descrição de vaga alvo.',
      personalizedMessages: 'Mensagens personalizadas para recrutadores',
      multipleVariations: '3 variações por mensagem',
      keywordOptimized: 'Otimizado com palavras-chave para sua função alvo',
      unlockRecruiter: 'Desbloquear Gerador de DM',
    },
    conversionBanner: {
      currentBracket: 'Categoria Atual',
      youAreInBracket: 'Você está na',
      unlockSprint: 'Desbloqueie o',
      sprintEngine: 'Motor Sprint',
      reach: 'para alcançar',
      matchFaang: 'e igualar',
      instantly: 'instantaneamente',
      pointsBoost: 'potencial de aumento de pontos',
      faangKeywords: 'palavras-chave nível FAANG',
      hourAccess: 'acesso de 24 horas',
      get24hPass: 'Obter Passe Sprint de 24h',
      oneTimePayment: 'Pagamento único',
      fixEverything: 'Corrija tudo em 24 horas. Sem assinatura.',
      noSubscription: 'Sem assinatura',
      devsUpgraded: 'desenvolvedores atualizaram esta semana',
      avgIncrease: 'Aumento médio de pontuação',
      points: 'pontos',
    },
    atsSimulation: {
      seniorityMatch: 'Análise de Correspondência de Senioridade',
      detectedLevel: 'Nível Detectado',
      experienceAudit: 'Auditoria de Experiência',
      signalDensity: 'Densidade de Sinais',
      score: 'Pontuação',
      expected: 'Esperado',
      signals: 'sinais',
      strength: 'Força',
      junior: 'Júnior',
      mid: 'Pleno',
      senior: 'Sênior',
      lead: 'Lead',
      match: 'Corresponde',
      review: 'Revisar',
      year: 'ano',
      years: 'anos',
      strong: 'FORTE',
      medium: 'MÉDIO',
      weak: 'FRACO',
      readability: 'Legibilidade',
      highIntegrity: 'Alta Integridade',
      industryPatterns: 'Estrutura segue padrões padrão da indústria',
      imageTraps: 'Armadilhas de Imagem',
      safe: 'Seguro',
      noneDetected: 'Nenhum Detectado',
      noInvisibleElements: 'Sem elementos invisíveis ou preenchimento de palavras-chave',
      atsGlobalScore: 'Pontuação Global ATS',
      parsingEfficiency: 'Pontuação baseada na eficiência de análise',
      liveAnalysis: 'Análise ao Vivo',
      fullReport: 'Relatório Completo',
    },
    keywordSniper: {
      title: 'Ferramenta Keyword Sniper',
      subtitle: 'Otimize seus bullets com injeção de palavras-chave por IA',
      noJobDescription: 'Nenhuma Descrição de Vaga Analisada',
      noJobDescriptionDesc: 'Keyword Sniper precisa de uma descrição de vaga para analisar e extrair palavras-chave ausentes.',
      howToUseTitle: 'Como usar Keyword Sniper:',
      howToStep1: 'Crie um projeto com sua função alvo',
      howToStep2: 'Adicione uma candidatura com a descrição da vaga',
      howToStep3: 'Analise a descrição para extrair palavras-chave',
      howToStep4: 'Volte aqui para obter sugestões de IA',
      backToDashboard: 'Voltar ao Painel',
      interviewSprintRequired: 'Interview Sprint Necessário',
      injectKeywordsDesc: 'Injete palavras-chave ausentes em seus bullets com sugestões de IA.',
      keywordInjection: 'Injeção de palavras-chave',
      liveScoreTracking: 'Acompanhamento de pontuação ao vivo',
      priorityTargeting: 'Segmentação prioritária',
      contextAwareAI: 'IA consciente do contexto',
      upgradeToSprint: 'Atualizar para Interview Sprint',
      back: 'Voltar',
      targeting: 'Segmentação',
      currentResume: 'Currículo Atual',
      aiPremiumTools: 'Ferramentas Premium IA',
      viewExamples: 'Ver Exemplos',
      viewExamplesDesc: 'Veja exemplos de nível sênior sobre como integrar palavras-chave naturalmente',
      applyMetric: 'Aplicar Métrica',
      applyMetricDesc: 'Transforme bullets fracos em declarações de impacto quantificadas',
      rewriteAll: 'Reescrever Tudo',
      rewriteAllDesc: 'Motor de IA para reescrever seu currículo completo em nível sênior+',
      battlePlan: 'Plano de Batalha',
      battlePlanDesc: 'Gere as perguntas mais difíceis + respostas estratégicas para entrevistas',
      suggestionApplied: 'Sugestão aplicada! Seu currículo foi atualizado.',
      noMissingKeywords: 'Nenhuma palavra-chave ausente para mostrar exemplos',
      rewriteSuccess: 'Currículo reescrito com sucesso!',
      lockedTitle: 'Interview Sprint Necessário',
      lockedDesc: 'Desbloqueie a Ferramenta Keyword Sniper para injetar palavras-chave ausentes e melhorar sua pontuação ATS.',
      upgradeNow: 'Atualizar Agora',
    },
    createProject: {
      title: 'Criar Novo Projeto',
      subtitle: 'Configure sua campanha de busca de emprego',
      projectName: 'Nome do Projeto',
      projectNamePlaceholder: 'ex. Busca SWE Sênior no Google',
      targetRole: 'Função Alvo',
      targetRolePlaceholder: 'ex. Engenheiro de Software Sênior, Gerente de Produto...',
      targetRoleHint: 'Digite qualquer função ou selecione das sugestões. Isso ajuda a IA a ajustar as sugestões de currículo.',
      jobDescription: 'Descrição da Vaga',
      optional: '(Opcional)',
      linkUrl: 'URL do Link',
      pasteText: 'Colar Texto',
      urlPlaceholder: 'https://linkedin.com/jobs/view/...',
      textPlaceholder: 'Cole a descrição completa da vaga aqui...',
      aiAnalysisTitle: 'Análise de IA Ativada',
      aiAnalysisDesc: 'Extrairemos palavras-chave da descrição para otimizar seu currículo e calcular pontuações de correspondência.',
      cancel: 'Cancelar',
      createButton: 'Criar Projeto',
      creating: 'Criando...',
      successMessage: 'Projeto criado com sucesso!',
      errorMessage: 'Falha ao criar projeto',
    },
    createApplication: {
      title: 'Adicionar Nova Candidatura',
      sprintRequired: 'Interview Sprint Necessário',
      upgradeDesc: 'Atualize para rastrear candidaturas, obter análise de palavras-chave e receber alertas de ghosting.',
      upgradeNow: 'Atualizar Agora',
      companyName: 'Nome da Empresa',
      companyPlaceholder: 'ex., Acme Corp',
      jobTitle: 'Título do Cargo',
      jobTitlePlaceholder: 'ex., Engenheiro Sênior',
      jobUrl: 'URL da Vaga',
      optional: '(Opcional)',
      urlPlaceholder: 'https://...',
      jobDescription: 'Descrição da Vaga',
      recommendedAI: '(Recomendado para Análise de IA)',
      descriptionPlaceholder: 'Cole a descrição da vaga aqui para correspondência de palavras-chave com IA...',
      cancel: 'Cancelar',
      addApplication: 'Adicionar Candidatura',
      adding: 'Adicionando...',
      planRequired: 'Plano Interview Sprint necessário',
      planRequiredDesc: 'Atualize para rastrear candidaturas e obter insights baseados em IA',
      successMessage: 'Candidatura adicionada com sucesso',
      errorMessage: 'Falha ao adicionar candidatura',
      featureRestricted: 'Esta funcionalidade está disponível apenas com uma assinatura Interview Sprint ativa',
    },
    missionControl: {
      title: 'Controle de Missão',
      welcomeBack: 'Bem-vindo de volta',
      eliminateBugs: 'Elimine bugs até alcançar 95% de visibilidade.',
      newApplication: 'Nova Candidatura',
      visibilityScore: 'Pontuação de Visibilidade',
      howRecruitersFind: 'Como recrutadores encontram seu currículo',
      activeApplications: 'Candidaturas Ativas',
      interviewsScheduled: 'entrevistas agendadas',
      missingSignals: 'Sinais Ausentes',
      critical: 'CRÍTICO',
      impactingMatchScore: 'Impactando pontuação de correspondência em',
      robotViewTitle: 'Visão Robô: O que o ATS Realmente Lê',
      robotViewSubtitle: 'Há informações críticas faltando no seu currículo?',
      uploadToSeeExtraction: 'Envie um currículo para ver a extração de texto bruto',
      missingKeywords: 'Faltando',
      allKeywordsDetected: 'Todas as palavras-chave críticas detectadas',
      needPoints: 'Precisa de',
      reachEliteTier: 'pontos para alcançar o nível ELITE',
      viewFullReport: 'Ver Relatório Completo',
      uploadResume: 'Enviar Currículo',
      careerHealth: 'Saúde da Carreira',
      elite: 'ELITE',
      pro: 'PRO',
      rising: 'RISING',
      starter: 'STARTER',
      progressToElite: 'Progresso para ELITE (85%+)',
      cvScore: 'Pontuação CV',
      applications: 'Candidaturas',
      interviews: 'Entrevistas',
      applicationKanban: 'Kanban de Candidaturas',
      viewAll: 'VER TUDO',
      applied: 'Candidatado',
      noApplicationsYet: 'Ainda sem candidaturas',
      position: 'Posição',
      company: 'Empresa',
      recent: 'Recente',
      interviewing: 'Em Entrevista',
      noInterviewsYet: 'Ainda sem entrevistas',
      inProgress: 'Em Andamento',
      accepted: 'Aceito',
      noOffersYet: 'Ainda sem ofertas',
      topErrors: 'Principais Erros',
      noCVLoaded: 'Nenhum CV carregado',
      consoleBash: 'console — bash',
      noCriticalErrors: 'Nenhum erro crítico detectado',
      allSystemsOperational: 'Todos os sistemas operacionais',
      debugMasterCV: 'DEBUG MASTER CV',
      missingKeyword: 'Palavra-chave ausente',
      matchScoreImpact: 'impacto no match_score:',
      dateFormatInconsistency: 'Inconsistência de formato de data encontrada',
      atExperienceBlock: 'em Experience.block (Linha 42)',
    },
    atsReport: {
      missingSignals: 'Sinais Ausentes',
      critical: 'CRÍTICO',
      important: 'IMPORTANTE',
      niceToHave: 'DESEJÁVEL',
      fix: 'Corrigir',
      invisibleToBot: 'Invisível ao Bot',
      atsWillReject: '⚠️ O ATS irá rejeitá-lo automaticamente',
      needsOptimization: 'Você precisa otimizar seu CV ANTES de aplicar',
      readyToApply: 'Pronto para Aplicar',
      context: 'Contexto',
      offerRequires: 'A oferta requer',
      youNeedToAdd: 'Você precisa adicionar esta habilidade',
      missingThisToken: 'mas seu CV apenas menciona',
      addSignalsOf: 'Você precisa adicionar sinais de',
      upgrade: 'Atualizar',
      percentInvisible: '% Invisível ao Bot',
      needsOptimizationBefore: 'Requer otimização ANTES de aplicar',
    },
    projectsView: {
      searchPlaceholder: 'Buscar projetos, tags...',
      uploadNewMasterCV: 'Carregar Novo CV Principal',
      allProjects: 'Todos os Projetos',
      highMatch: 'Alta Correspondência',
      needsReview: 'Requer Revisão',
      archived: 'Arquivado',
      sortBy: 'Ordenar por:',
      lastUpdated: 'Última Atualização',
      loadingProjects: 'Carregando projetos...',
      noProjectsYet: 'Ainda sem projetos',
      noProjectsDesc: 'Crie seu primeiro projeto para começar a rastrear candidaturas e otimizar seu CV.',
      createFirstProject: 'Criar Seu Primeiro Projeto',
      matchScore: 'Pontuação de Correspondência',
      stable: 'Estável',
      missingData: 'Dados Ausentes',
      highPriority: 'Alta Prioridade',
      strong: 'Forte',
      moderate: 'Moderado',
      low: 'Baixo',
      hoursAgo: 'h atrás',
      daysAgo: 'd atrás',
      weeksAgo: 's atrás',
      openProjectBoard: 'Abrir Painel de Projeto',
      createNewProject: 'Criar Novo Projeto',
      createNewProjectDesc: 'Inicie uma nova missão ou carregue um CV para analisar.',
    },
    resumeGrid: {
      loadingResumes: 'Carregando seus currículos...',
      analyzing: 'Analisando...',
      error: 'Erro',
      excellent: 'Excelente',
      moderate: 'Moderado',
      critical: 'Crítico',
      noResumesFound: 'Nenhum currículo encontrado',
      noResumesDesc: 'Envie seu currículo para obter uma pontuação ATS instantânea e feedback alimentado por IA.',
      uploadResume: 'Enviar Currículo',
      createManually: 'Criar Manualmente',
      createProject: 'Criar Projeto',
      searchPlaceholder: 'Buscar currículos por nome, habilidade ou ID...',
      listView: 'Visualização em Lista',
      gridView: 'Visualização em Grade',
      resumeName: 'Nome do Currículo',
      uploadDate: 'Data de Envio',
      lastAnalyzed: 'Última Análise',
      healthScore: 'Pontuação de Saúde',
      actions: 'Ações',
      viewDetails: 'Ver Detalhes',
      reAnalyze: 'Re-Analisar',
      delete: 'Excluir',
      justNow: 'Agora mesmo',
      showing: 'Mostrando',
      to: 'até',
      of: 'de',
      results: 'resultados',
      previous: 'Anterior',
      next: 'Próximo',
      noSearchResults: 'Nenhum currículo corresponde à sua pesquisa.',
    },
    aiFeedback: {
      rateResponse: 'Avaliar resposta',
      howHelpful: 'Quão útil foi esta resposta?',
      feedbackHelps: 'Seu feedback nos ajuda a melhorar nossa IA.',
      helpful: 'Útil',
      okay: 'Regular',
      notHelpful: 'Não útil',
      additionalComments: 'Comentários adicionais (opcional)...',
      submitFeedback: 'Enviar feedback',
      thankYou: 'Obrigado pelo seu feedback!',
      wasHelpful: 'Esta resposta foi útil?',
      yes: 'Sim',
      somewhat: 'Um pouco',
      no: 'Não',
      tellMore: 'Conte-nos mais (opcional)...',
      submit: 'Enviar',
      selectRating: 'Por favor, selecione uma avaliação',
      feedbackSubmitted: 'Obrigado! Feedback enviado.',
      submitError: 'Falha ao enviar feedback. Tente novamente.',
    },
    eliteMatchTool: {
      title: 'Elite Match Tool',
      subtitle: 'Analyze your resume against any job offer with local ML precision. Identify gaps and optimize for ATS instantly.',
      urlLabel: 'LinkedIn URL (Recommended)',
      urlPlaceholder: 'https://www.linkedin.com/jobs/view/...',
      urlHelp: 'Paste the direct LinkedIn job posting link for best extraction results.',
      textLabel: 'Paste Job Description',
      textPlaceholder: 'About the role:\nWe are looking for a Senior Full Stack Developer with 5+ years of experience...\n\nRequirements:\n- Strong experience with React and Node.js\n- Experience with Kubernetes and AWS',
      textHelp: 'Copy and paste the full job description from any portal.',
      analyzeButton: 'Analyze Match Score',
      featureExtraction: 'Entity Extraction',
      featureExtractionDesc: 'Not just keywords: we extract Hard Skills, Soft Skills, and Industry Metrics with deep semantic understanding.',
      gapAnalysis: 'Gap Analysis',
      gapAnalysisDesc: 'We identify EXACTLY what signals are missing from your profile to pass high-risk ATS filters.',
      autoFix: 'AI Auto-Fix',
      autoFixDesc: 'One-click AI rewriting that intelligently integrates missing signals into your existing resume narrative.',
      premiumTitle: 'Elite Match Tool is Premium',
      premiumSubtitle: 'Analyze your resume against any offer using local ML (0 API costs)',
      premiumFeatures: '• Entity extraction with TF-IDF & Cosine Similarity\n• Critical/important/nice-to-have gap analysis\n• Robot View with red/green zones\n• Specific Auto-Fix suggestions',
      scoreTitle: 'Match Score',
      scoreExcellent: 'Excellent match! Apply with confidence.',
      scoreGood: 'Good match, but there are important gaps.',
      scoreNeedsWork: 'You need to improve your resume for this offer.',
      missingCritical: 'Missing Critical Signals',
      matchedSkills: 'Matched Skills',
      robotViewTitle: 'Robot View',
      redZones: 'Red Zones',
      greenZones: 'Green Zones',
      recommendations: 'Auto-Fix Recommendations',
      analyzeAnother: 'Analyze Another Job',
      applyFix: 'Apply Auto-Fix',
      applyFixSuccess: 'Auto-Fix suggestions copied! Navigate to Edit tab to apply changes.',
      analyzingStep1: 'Extracting Recruiter Intent...',
      analyzingStep2: 'Analyzing Hard Skills Requirements...',
      analyzingStep3: 'Detecting Soft Skills Signals...',
      analyzingStep4: 'Generating Missing Signals Report...',
      errorAnalyzing: 'Error analyzing the match: ',
      errorUnknown: 'Unknown error',
    },
    ecosystem: {
      copyPasteTip: {
        badge: 'GRÁTIS',
        title: '💡 Dica Profissional: Copie do LinkedIn',
        description: 'Vá para uma vaga no LinkedIn → Selecione todo o texto → Ctrl+C → Cole em \'Adicionar Descrição da Vaga\'. Automático, sem extensões.',
        actionLabel: 'Entendi',
        successMessage: 'Perfeito! Use Ctrl+C em qualquer vaga de emprego.',
      },
      linkedinReminder: {
        badge: 'GRÁTIS',
        title: '🔗 Lembrete: Atualize o LinkedIn',
        description: 'Seu currículo está em {score}%. 89% dos recrutadores pesquisam no LinkedIn antes de ligar. Copie as melhorias do seu currículo para seu perfil do LinkedIn.',
        actionLabel: 'Ir para o LinkedIn',
      },
      keyboardShortcuts: {
        badge: 'GRÁTIS',
        title: '⌨️ Atalhos de Teclado',
        description: 'Ctrl+V para colar descrição da vaga rapidamente. Esc para fechar modais. Trabalhe mais rápido sem sair do teclado.',
        actionLabel: 'Ver Mais Atalhos',
        infoMessage: 'Atalhos: Ctrl+V (colar descrição), Esc (fechar), Tab (navegar)',
      },
      dismissLabel: 'Não estou interessado',
      freeLabel: '100% GRÁTIS',
      bookmarklet: {
        title: 'Scanner Installation (1 minute)',
        step1Title: 'Copy the bookmarklet',
        step1Copy: 'Copy Bookmarklet',
        step1Copied: 'Copied!',
        step2Title: 'Create a bookmark',
        step2Instructions: ['Right-click on the bookmarks bar', 'Select "Add page"', 'Name: "Job Scanner"', 'URL: Paste the copied code'],
        step3Title: 'Use it on any site',
        step3Description: 'Go to LinkedIn, Indeed, or any job posting → Click the "Job Scanner" bookmark → Text will be extracted → Paste it in your resume analyzer',
        proTip: 'Works on ANY website. LinkedIn, Indeed, Glassdoor, company X...',
        successCopied: 'Bookmarklet copied! Now drag it to your bookmarks bar.',
        openingChecklist: 'Opening LinkedIn checklist...',
        comingSoon: 'Coming soon: Recruiter email analyzer',
      },
    },
  },
};

// Get browser locale or default to en
// NOTE: Always defaults to English. Users must manually change language.
// This prevents automatic Spanish detection for users with Spanish browsers.
export function detectLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en';

  // ALWAYS default to English - do not auto-detect from browser
  // Users can manually switch language via the language selector
  return 'en';

  /* DISABLED: Auto-detection caused issues with Spanish-speaking users
  const browserLang = navigator.language || 'en';
  const supportedLocales: SupportedLocale[] = ['en', 'es', 'fr', 'de', 'pt'];

  // Extract language code (e.g., 'en-US' -> 'en', 'es-MX' -> 'es')
  const langCode = browserLang.split('-')[0];

  // Check if we support this language
  if (supportedLocales.includes(langCode as SupportedLocale)) {
    return langCode as SupportedLocale;
  }

  // Default to English
  return 'en';
  */
}

// Get translations for current locale
export function useTranslation(locale?: SupportedLocale): Translation {
  const currentLocale = locale || detectLocale();
  return translations[currentLocale] || translations['en'];
}

// Format price with currency
export function formatPrice(amount: number, locale?: SupportedLocale): string {
  // Always use $ for simplified pricing
  return `$${amount.toFixed(2)}`;
}
