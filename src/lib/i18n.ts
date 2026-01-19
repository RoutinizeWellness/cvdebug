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
