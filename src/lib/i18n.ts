// Internationalization configuration for CVDebug
// Supports multiple countries and languages

export type SupportedLocale = 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'de-DE' | 'pt-BR' | 'en-IN' | 'en-CA' | 'en-AU' | 'es-MX';

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
}

export const translations: Record<SupportedLocale, Translation> = {
  'en-US': {
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
  },
  'en-GB': {
    hero: {
      title: 'Stop guessing why you\'re being ghosted.',
      subtitle: 'Debug your CV\'s invisible bugs and land interviews in 7 days.',
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
      currency: '£',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your CV',
      analyzing: 'Analysing your CV...',
      score: 'ATS Score',
      issues: 'Issues Found',
      signIn: 'Sign In',
      continueDashboard: 'Continue to Dashboard',
      welcomeBack: 'Welcome back',
      uploadMasterCv: 'Upload your Master CV',
      uploadToStart: 'Upload CV to start',
      noKeywordsYet: 'No keywords yet',
    },
    previewScan: {
      title: 'Deep Diagnostic Scan',
      subtitle: 'See exactly how ATS systems parse your CV - no signup required',
      dropHere: 'Drop your CV here',
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
      uploadResume: 'Upload CV',
      uploadNewCv: 'Upload New CV',
      tryFree: 'Try Free',
      getSingleScan: 'Get Single Scan',
      startSprint: 'Start Sprint',
      checkMyResume: 'Check My CV',
      seeHowItWorks: 'See How It Works',
      viewFullReport: 'View Full Report',
      managePlan: 'Manage Plan',
      upgradeNow: 'Upgrade Now',
      buyMoreCredits: 'Buy More Credits',
      launchTool: 'Launch Tool',
    },
    navbar: {
      analyzer: 'Analyser',
      tools: 'Tools',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      login: 'Log in',
      scanResume: 'Scan CV',
      scan: 'Scan',
    },
    auth: {
      loading: 'Initialising session...',
      analyzing: 'ANALYSING_STRUCTURE...',
      parsing: 'PARSING_KEYWORDS...',
      optimizing: 'OPTIMISING_ATS_SCORE...',
      headline: 'Debug your career history with precision.',
      subtitle: 'Use our advanced engineering tools to refactor your CV and deploy your best professional profile.',
      initSession: 'Initialise Session',
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
      myResumes: 'My CVs',
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
      description: 'See your CV the way robots see it. Get instant feedback and land more interviews.',
      robotTech: 'Robot View Technology',
      robotDesc: 'See exactly what ATS robots see - no guessing',
      instantScore: 'Instant ATS Score',
      instantDesc: 'Get your compatibility score in 10 seconds',
      smartKeyword: 'Smart Keyword Analysis',
      smartDesc: 'AI-powered matching with job descriptions',
      enterpriseSec: 'Enterprise Security',
      enterpriseDesc: 'Your data stays private and secure',
      ctaBanner: 'Get Your Free ATS Score',
      ctaSubtext: 'Scan your CV in 10 seconds - no signup required',
      ctaButton: 'Try Free Scan →',
    },
    comparison: {
      badge: 'Reality Check',
      heading: 'What you see vs. What they see',
      description: 'Most modern CV templates look great to humans but are a nightmare for robots. Columns, icons, and graphics often break the parsing logic.',
      humanView: 'Human View (PDF)',
      robotView: 'Robot View (Parsed)',
    },
    footer: {
      description: 'Beat ATS systems with AI-powered CV optimisation. Get hired faster.',
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
        title: 'Debug Your CV Like a Pro',
        subtitle: 'Stop getting rejected. See exactly what ATS systems see and fix it in minutes.',
        startButton: 'Start Free Scan',
        viewDemo: 'View Demo',
      },
      socialProof: {
        trustedBy: 'Trusted by job seekers at',
      },
      stats: {
        stat1: '50,000+ CVs analysed',
        stat2: '89% higher interview rate',
        stat3: '10-second scan time',
        stat4: 'Enterprise-grade security',
      },
      cta: {
        badge: 'Get Started',
        heading: 'Ready to land your dream job?',
        description: 'Join thousands of successful job seekers who fixed their CVs with CVDebug.',
        buttonText: 'Start Free Scan Now',
        footerText: 'No credit card required',
      },
      faq: {
        heading: 'Frequently Asked Questions',
        question1: 'What is an ATS system?',
        answer1: 'ATS (Applicant Tracking System) is software that companies use to filter CVs before they reach human recruiters. Most large companies use ATS, and it can reject up to 75% of CVs.',
        question2: 'How does CVDebug help me?',
        answer2: 'CVDebug shows you exactly how ATS systems parse your CV, identifies missing keywords, and provides actionable recommendations to improve your ATS score.',
        question3: 'Is my data secure?',
        answer3: 'Yes! We use enterprise-grade encryption and never share your data with third parties. Your CV is processed securely and deleted after analysis unless you save it.',
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
        heading: 'Upload Your CV',
        description: 'Drop your CV file or click to browse',
        clickToUpload: 'Click to upload',
        dragDrop: 'or drag and drop',
        maxSize: 'PDF, DOC, DOCX up to 10MB',
        log1: '[INIT] Parsing document structure...',
        log2: '[SCAN] Analysing keywords and formatting...',
        log3: '[CHECK] Running ATS compatibility checks...',
        log4: '[MATCH] Comparing with job requirements...',
        log5: '[SCORE] Calculating final score...',
        log6: '[DONE] Analysis complete!',
        systemLogs: 'System Logs',
        backButton: 'Back',
        scanButton: 'Scan CV',
      },
      helpCenter: {
        label: 'Help Centre',
      },
    },
    pricingPage: {
      freePlan: {
        name: 'Free Scan',
        description: 'Perfect for trying out CVDebug',
        price: '0',
        period: 'one-time',
        feature1: '1 free CV scan',
        feature2: 'Basic ATS score',
        feature3: 'Robot view preview',
        feature4: 'Keyword analysis',
        button: 'Start Free Scan',
      },
      pass24h: {
        name: '24-Hour Pass',
        description: 'Unlimited scans for one day',
        price: '7',
        period: '24 hours',
        feature1: 'Unlimited CV scans',
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
        price: '25',
        period: '7 days',
        feature1: 'Everything in 24-Hour Pass',
        feature2: 'Unlimited CV versions',
        feature3: 'AI-powered optimisation',
        feature4: 'Custom job matching',
        feature5: 'Priority support',
        feature6: 'CV builder access',
        feature7: 'Cover letter analysis',
        feature8: 'LinkedIn optimisation tips',
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
        answer5: 'Yes! We offer student discounts and bulk pricing for career centres. Contact us for details.',
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
        feature2: 'Keyword optimisation suggestions',
        price: '£7',
        unlockButton: 'Unlock Full Report',
        maybeLater: 'Maybe Later',
      },
    },
  },
  'es-ES': {
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
  },
  'fr-FR': {
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
  },
  'de-DE': {
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
  },
  'pt-BR': {
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
  },
  'en-IN': {
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
      currency: '₹',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your resume',
      analyzing: 'Analysing your resume...',
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
      analyzer: 'Analyser',
      tools: 'Tools',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      login: 'Log in',
      scanResume: 'Scan Resume',
      scan: 'Scan',
    },
    auth: {
      loading: 'Initialising session...',
      analyzing: 'ANALYSING_STRUCTURE...',
      parsing: 'PARSING_KEYWORDS...',
      optimizing: 'OPTIMISING_ATS_SCORE...',
      headline: 'Debug your career history with precision.',
      subtitle: 'Use our advanced engineering tools to refactor your resume and deploy your best professional profile.',
      initSession: 'Initialise Session',
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
        stat1: '50,000+ resumes analysed',
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
        log2: '[SCAN] Analysing keywords and formatting...',
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
        price: '700',
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
        price: '2,200',
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
        price: '₹700',
        unlockButton: 'Unlock Full Report',
        maybeLater: 'Maybe Later',
      },
    },
  },
  'en-CA': {
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
      currency: 'C$',
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
        price: '12',
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
        price: '39',
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
        price: 'C$12',
        unlockButton: 'Unlock Full Report',
        maybeLater: 'Maybe Later',
      },
    },
  },
  'en-AU': {
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
      currency: 'A$',
    },
    dashboard: {
      welcome: 'Welcome back',
      uploadCv: 'Upload your resume',
      analyzing: 'Analysing your resume...',
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
      analyzer: 'Analyser',
      tools: 'Tools',
      pricing: 'Pricing',
      dashboard: 'Dashboard',
      login: 'Log in',
      scanResume: 'Scan Resume',
      scan: 'Scan',
    },
    auth: {
      loading: 'Initialising session...',
      analyzing: 'ANALYSING_STRUCTURE...',
      parsing: 'PARSING_KEYWORDS...',
      optimizing: 'OPTIMISING_ATS_SCORE...',
      headline: 'Debug your career history with precision.',
      subtitle: 'Use our advanced engineering tools to refactor your resume and deploy your best professional profile.',
      initSession: 'Initialise Session',
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
        stat1: '50,000+ resumes analysed',
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
        log2: '[SCAN] Analysing keywords and formatting...',
        log3: '[CHECK] Running ATS compatibility checks...',
        log4: '[MATCH] Comparing with job requirements...',
        log5: '[SCORE] Calculating final score...',
        log6: '[DONE] Analysis complete!',
        systemLogs: 'System Logs',
        backButton: 'Back',
        scanButton: 'Scan Resume',
      },
      helpCenter: {
        label: 'Help Centre',
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
        price: '14',
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
        price: '45',
        period: '7 days',
        feature1: 'Everything in 24-Hour Pass',
        feature2: 'Unlimited resume versions',
        feature3: 'AI-powered optimisation',
        feature4: 'Custom job matching',
        feature5: 'Priority support',
        feature6: 'Resume builder access',
        feature7: 'Cover letter analysis',
        feature8: 'LinkedIn optimisation tips',
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
        answer5: 'Yes! We offer student discounts and bulk pricing for career centres. Contact us for details.',
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
        feature2: 'Keyword optimisation suggestions',
        price: 'A$14',
        unlockButton: 'Unlock Full Report',
        maybeLater: 'Maybe Later',
      },
    },
  },
  'es-MX': {
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
      currency: 'MX$',
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
        price: '180',
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
        price: '580',
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
        price: 'MX$180',
        unlockButton: 'Desbloquear Informe Completo',
        maybeLater: 'Quizás Después',
      },
    },
  },
};

// Get browser locale or default to en-US
export function detectLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en-US';

  const browserLang = navigator.language || 'en-US';
  const supportedLocales: SupportedLocale[] = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'pt-BR', 'en-IN', 'en-CA', 'en-AU', 'es-MX'];

  // Exact match
  if (supportedLocales.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }

  // Language match (e.g., 'es' -> 'es-ES')
  const langCode = browserLang.split('-')[0];
  const match = supportedLocales.find(locale => locale.startsWith(langCode));

  return match || 'en-US';
}

// Get translations for current locale
export function useTranslation(locale?: SupportedLocale): Translation {
  const currentLocale = locale || detectLocale();
  return translations[currentLocale] || translations['en-US'];
}

// Format price with currency
export function formatPrice(amount: number, locale?: SupportedLocale): string {
  const currentLocale = locale || detectLocale();
  const { currency } = translations[currentLocale].pricing;

  // Special formatting for different currencies
  if (currency === 'R$') return `${currency} ${amount.toFixed(2)}`;
  if (currency === '₹') return `${currency} ${amount.toFixed(0)}`;

  return `${currency}${amount.toFixed(2)}`;
}
