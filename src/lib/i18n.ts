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
  };
  // Sidebar
  sidebar: {
    home: string;
    myResumes: string;
    aiTools: string;
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
    };
    faq: {
      heading: string;
      question1: string;
      answer1: string;
      question2: string;
      answer2: string;
      question3: string;
      answer3: string;
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
  // AI Feedback
  aiFeedback: {
    rateResponse: string;
    howHelpful: string;
    feedbackHelps: string;
    helpful: string;
    okay: string;
    notHelpful: string;
    additionalComments: string;
    submitFeedback: string;
    selectRating: string;
    thankYou: string;
    submitError: string;
  };
}

export const translations: Record<SupportedLocale, Translation> = {
  'en': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: 'Debug your resume\'s invisible bugs and land interviews in 7 days.',
      ctaPrimary: 'See Robot View - Free',
      ctaSecondary: 'Sign Up for Full Access',
      trustIndicator: 'No credit card • No sign up required • Instant results in 10 seconds',
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
      subtitle: 'Use our advanced engineering tools to refactor your resume and deploy your best professional profile.',
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
    },
    sidebar: {
      home: 'Home',
      myResumes: 'My Resumes',
      aiTools: 'AI Tools',
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
        stat1: '50,000+ resumes analyzed',
        stat2: '89% higher interview rate',
        stat3: '10-second scan time',
        stat4: 'Enterprise-grade security',
      },
      cta: {
        badge: 'Get Started',
        heading: 'Ready to land your dream job?',
        description: 'Join thousands of successful job seekers who fixed their resumes with CVDebug.',
        buttonText: 'Start Free Scan Now',
        footerText: 'No credit card required',
      },
      faq: {
        heading: 'Frequently Asked Questions',
        question1: 'What is an ATS system?',
        answer1: 'ATS (Applicant Tracking System) is software that companies use to filter resumes before they reach human recruiters. Most large companies use ATS, and it can reject up to 75% of resumes.',
        question2: 'How does CVDebug help me?',
        answer2: 'CVDebug shows you exactly how ATS systems parse your resume, identifies missing keywords, and provides actionable recommendations to improve your ATS score.',
        question3: 'Is my data secure?',
        answer3: 'Yes! We use enterprise-grade encryption and never share your data with third parties. Your resume is processed securely and deleted after analysis unless you save it.',
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
    aiFeedback: {
      rateResponse: 'Rate this response',
      howHelpful: 'How helpful was this?',
      feedbackHelps: 'Your feedback helps us improve our AI features',
      helpful: 'Helpful',
      okay: 'Okay',
      notHelpful: 'Not Helpful',
      additionalComments: 'Any additional comments? (optional)',
      submitFeedback: 'Submit Feedback',
      selectRating: 'Please select a rating',
      thankYou: 'Thank you for your feedback!',
      submitError: 'Failed to submit feedback',
    },
  },
  'es': {
    hero: {
      title: 'Deja de preguntarte por qué te ignoran.',
      subtitle: 'Depura los errores invisibles de tu CV y consigue entrevistas en 7 días.',
      ctaPrimary: 'Ver Vista Robot - Gratis',
      ctaSecondary: 'Regístrate para Acceso Completo',
      trustIndicator: 'Sin tarjeta • Sin registro • Resultados instantáneos en 10 segundos',
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
      subtitle: 'Use our advanced engineering tools to refactor your resume and deploy your best professional profile.',
      initSession: 'Inicializar Sesión',
      enterCredentials: 'Enter your credentials to access the console',
      signIn: 'Iniciar Sesión',
      signUp: 'Registrarse',
      noAccount: '¿No tienes cuenta?',
      haveAccount: '¿Ya tienes cuenta?',
      deployNew: '[Crear perfil nuevo]',
      signInLink: '[Iniciar sesión]',
      version: 'v2.4.0-stable',
      systemStatus: 'Sistema Operativo',
    },
    sidebar: {
      home: 'Inicio',
      myResumes: 'Mis CVs',
      aiTools: 'Herramientas IA',
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
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        question1: '¿Qué es un sistema ATS?',
        answer1: 'ATS (Sistema de Seguimiento de Candidatos) es un software que las empresas usan para filtrar CVs antes de que lleguen a los reclutadores. La mayoría de las grandes empresas usan ATS, y puede rechazar hasta el 75% de los CVs.',
        question2: '¿Cómo me ayuda CVDebug?',
        answer2: 'CVDebug te muestra exactamente cómo los sistemas ATS analizan tu CV, identifica palabras clave faltantes y proporciona recomendaciones para mejorar tu puntuación ATS.',
        question3: '¿Mis datos están seguros?',
        answer3: '¡Sí! Utilizamos encriptación de nivel empresarial y nunca compartimos tus datos con terceros. Tu CV se procesa de forma segura y se elimina después del análisis a menos que lo guardes.',
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
    aiFeedback: {
      rateResponse: 'Califica esta respuesta',
      howHelpful: '¿Qué tan útil fue esto?',
      feedbackHelps: 'Tus comentarios nos ayudan a mejorar nuestras funciones de IA',
      helpful: 'Útil',
      okay: 'Regular',
      notHelpful: 'No Útil',
      additionalComments: '¿Algún comentario adicional? (opcional)',
      submitFeedback: 'Enviar Comentarios',
      selectRating: 'Por favor selecciona una calificación',
      thankYou: '¡Gracias por tus comentarios!',
      submitError: 'Error al enviar comentarios',
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
      subtitle: 'Use our advanced engineering tools to refactor your resume and deploy your best professional profile.',
      initSession: 'Initialiser la Session',
      enterCredentials: 'Enter your credentials to access the console',
      signIn: 'Se Connecter',
      signUp: 'S\'inscrire',
      noAccount: 'Pas de compte?',
      haveAccount: 'Vous avez déjà un compte?',
      deployNew: '[Créer nouveau profil]',
      signInLink: '[Se connecter]',
      version: 'v2.4.0-stable',
      systemStatus: 'Système Opérationnel',
    },
    sidebar: {
      home: 'Accueil',
      myResumes: 'Mes CVs',
      aiTools: 'Outils IA',
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
      },
      faq: {
        heading: 'Foire Aux Questions',
        question1: 'Qu\'est-ce qu\'un système ATS?',
        answer1: 'ATS (Applicant Tracking System) est un logiciel que les entreprises utilisent pour filtrer les CVs avant qu\'ils n\'atteignent les recruteurs humains. La plupart des grandes entreprises utilisent ATS, et il peut rejeter jusqu\'à 75% des CVs.',
        question2: 'Comment CVDebug m\'aide-t-il?',
        answer2: 'CVDebug vous montre exactement comment les systèmes ATS analysent votre CV, identifie les mots-clés manquants et fournit des recommandations pour améliorer votre score ATS.',
        question3: 'Mes données sont-elles sécurisées?',
        answer3: 'Oui! Nous utilisons un cryptage de niveau entreprise et ne partageons jamais vos données avec des tiers. Votre CV est traité en toute sécurité et supprimé après analyse, sauf si vous le sauvegardez.',
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
    aiFeedback: {
      rateResponse: 'Évaluer cette réponse',
      howHelpful: 'Dans quelle mesure cela a-t-il été utile ?',
      feedbackHelps: 'Vos commentaires nous aident à améliorer nos fonctionnalités IA',
      helpful: 'Utile',
      okay: 'Correct',
      notHelpful: 'Pas Utile',
      additionalComments: 'Des commentaires supplémentaires ? (facultatif)',
      submitFeedback: 'Soumettre les Commentaires',
      selectRating: 'Veuillez sélectionner une note',
      thankYou: 'Merci pour vos commentaires !',
      submitError: 'Échec de l\'envoi des commentaires',
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
      subtitle: 'Use our advanced engineering tools to refactor your resume and deploy your best professional profile.',
      initSession: 'Sitzung initialisieren',
      enterCredentials: 'Enter your credentials to access the console',
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      noAccount: 'Kein Konto gefunden?',
      haveAccount: 'Haben Sie bereits ein Konto?',
      deployNew: '[Neues Profil erstellen]',
      signInLink: '[Anmelden]',
      version: 'v2.4.0-stable',
      systemStatus: 'System Betriebsbereit',
    },
    sidebar: {
      home: 'Startseite',
      myResumes: 'Meine Lebensläufe',
      aiTools: 'KI-Tools',
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
      },
      faq: {
        heading: 'Häufig Gestellte Fragen',
        question1: 'Was ist ein ATS-System?',
        answer1: 'ATS (Applicant Tracking System) ist eine Software, die Unternehmen verwenden, um Lebensläufe zu filtern, bevor sie menschliche Recruiter erreichen. Die meisten großen Unternehmen verwenden ATS, und es kann bis zu 75% der Lebensläufe ablehnen.',
        question2: 'Wie hilft mir CVDebug?',
        answer2: 'CVDebug zeigt Ihnen genau, wie ATS-Systeme Ihren Lebenslauf analysieren, identifiziert fehlende Schlüsselwörter und bietet umsetzbare Empfehlungen zur Verbesserung Ihres ATS-Scores.',
        question3: 'Sind meine Daten sicher?',
        answer3: 'Ja! Wir verwenden Verschlüsselung auf Unternehmensniveau und geben Ihre Daten niemals an Dritte weiter. Ihr Lebenslauf wird sicher verarbeitet und nach der Analyse gelöscht, es sei denn, Sie speichern ihn.',
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
    aiFeedback: {
      rateResponse: 'Diese Antwort bewerten',
      howHelpful: 'Wie hilfreich war dies?',
      feedbackHelps: 'Ihr Feedback hilft uns, unsere KI-Funktionen zu verbessern',
      helpful: 'Hilfreich',
      okay: 'Okay',
      notHelpful: 'Nicht Hilfreich',
      additionalComments: 'Zusätzliche Kommentare? (optional)',
      submitFeedback: 'Feedback Absenden',
      selectRating: 'Bitte wählen Sie eine Bewertung',
      thankYou: 'Vielen Dank für Ihr Feedback!',
      submitError: 'Fehler beim Absenden des Feedbacks',
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
      subtitle: 'Use our advanced engineering tools to refactor your resume and deploy your best professional profile.',
      initSession: 'Inicializar Sessão',
      enterCredentials: 'Enter your credentials to access the console',
      signIn: 'Entrar',
      signUp: 'Cadastrar',
      noAccount: 'Não tem conta?',
      haveAccount: 'Já tem uma conta?',
      deployNew: '[Criar novo perfil]',
      signInLink: '[Entrar]',
      version: 'v2.4.0-stable',
      systemStatus: 'Sistema Operacional',
    },
    sidebar: {
      home: 'Início',
      myResumes: 'Meus Currículos',
      aiTools: 'Ferramentas IA',
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
      },
      faq: {
        heading: 'Perguntas Frequentes',
        question1: 'O que é um sistema ATS?',
        answer1: 'ATS (Sistema de Rastreamento de Candidatos) é um software que as empresas usam para filtrar currículos antes que cheguem aos recrutadores humanos. A maioria das grandes empresas usa ATS, e pode rejeitar até 75% dos currículos.',
        question2: 'Como o CVDebug me ajuda?',
        answer2: 'O CVDebug mostra exatamente como os sistemas ATS analisam seu currículo, identifica palavras-chave ausentes e fornece recomendações práticas para melhorar sua pontuação ATS.',
        question3: 'Meus dados estão seguros?',
        answer3: 'Sim! Usamos criptografia de nível empresarial e nunca compartilhamos seus dados com terceiros. Seu currículo é processado com segurança e excluído após a análise, a menos que você o salve.',
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
    aiFeedback: {
      rateResponse: 'Avaliar esta resposta',
      howHelpful: 'Quão útil foi isso?',
      feedbackHelps: 'Seu feedback nos ajuda a melhorar nossos recursos de IA',
      helpful: 'Útil',
      okay: 'Regular',
      notHelpful: 'Não Útil',
      additionalComments: 'Algum comentário adicional? (opcional)',
      submitFeedback: 'Enviar Feedback',
      selectRating: 'Por favor selecione uma avaliação',
      thankYou: 'Obrigado pelo seu feedback!',
      submitError: 'Falha ao enviar feedback',
    },
  },
};

// Get browser locale or default to en
export function detectLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en';

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
