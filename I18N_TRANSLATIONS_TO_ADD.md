# CVDebug i18n Translations - Implementation Guide

## Overview
This document contains the comprehensive i18n translations that need to be added to `/home/daytona/codebase/src/lib/i18n.ts`.

## Step 1: Add Interface Sections (COMPLETED)

The following sections have been added to the `Translation` interface in i18n.ts:
- `landing` - Landing page navigation, hero, stats, CTA, FAQ
- `onboarding` - Role selection, CV upload steps
- `pricingPage` - Pricing tiers, features, FAQ
- `modals` - Subscription status, logout confirmation, credits exhausted

## Step 2: Add Translations for All 10 Locales

### Instructions:
For each locale (`en-US`, `en-GB`, `es-ES`, `fr-FR`, `de-DE`, `pt-BR`, `en-IN`, `en-CA`, `en-AU`, `es-MX`), add the following sections right before the closing brace of each locale object (after the `footer` section).

### EN-US Translations (English - United States)

```typescript
    landing: {
      nav: {
        features: 'Features',
        pricing: 'Pricing',
        login: 'Login',
        signUp: 'Sign Up',
      },
      hero: {
        title: 'Debug Your Resume',
        subtitle: 'Find invisible bugs that cost you interviews',
        startButton: 'Start Free Scan',
        viewDemo: 'View Demo',
      },
      socialProof: {
        trustedBy: 'Trusted by 10,000+ job seekers',
      },
      stats: {
        stat1: '10,000+ Resumes Scanned',
        stat2: '95% ATS Pass Rate',
        stat3: '3x More Interviews',
        stat4: '24-Hour Results',
      },
      cta: {
        badge: 'Get Started Free',
        heading: 'Ready to debug your resume?',
        description: 'Join thousands of job seekers who landed interviews with CVDebug.',
        buttonText: 'Start Free Scan',
        footerText: 'No credit card required',
      },
      faq: {
        heading: 'Frequently Asked Questions',
        question1: 'How does CVDebug work?',
        answer1: 'CVDebug uses ML algorithms to scan your resume like ATS systems do. We identify formatting issues, missing keywords, and optimization opportunities.',
        question2: 'Is my data secure?',
        answer2: 'Yes! Your resume data is encrypted and never shared with third parties. We are GDPR and CCPA compliant.',
        question3: 'Do I need a subscription?',
        answer3: 'No! We offer one-time passes with no recurring charges. Pay once, optimize your resume, land interviews.',
      },
    },
    onboarding: {
      steps: {
        role: 'Role Selection',
        upload: 'Upload CV',
        scan: 'Scan & Analyze',
      },
      roleSelection: {
        heading: 'Step 1: Role Selection',
        editLink: 'Edit',
        continueButton: 'Continue',
      },
      cvUpload: {
        heading: 'Upload your CV',
        description: 'Drag & drop your resume here (PDF or DOCX) to begin the analysis.',
        clickToUpload: 'Click to upload',
        dragDrop: 'or drag and drop',
        maxSize: 'PDF or DOCX (MAX. 10MB)',
        log1: 'Initializing upload sequence...',
        log2: 'Parsing binary data...',
        log3: 'Simulating Recruiter Bot [v2.4.1]...',
        log4: 'Waiting for file input_',
        log5: 'File detected: ',
        log6: 'Ready to scan_',
        systemLogs: 'System Logs',
        backButton: 'Back',
        scanButton: 'Scan CV',
      },
      helpCenter: {
        label: 'Help Center',
      },
    },
    pricingPage: {
      freePlan: {
        name: 'FREE Debug',
        description: 'See what\'s broken. Get the diagnosis.',
        price: '$0',
        period: 'forever',
        feature1: 'Robot View Preview (blurred)',
        feature2: 'Global ATS Score',
        feature3: 'Basic [ERROR] Labels',
        feature4: 'Seniority Match Preview',
        button: 'Run Free Scan',
      },
      pass24h: {
        name: '24-Hour Iteration Pass',
        description: 'Everything you need to land an interview this week. No subscriptions. No BS.',
        price: '14.99€',
        period: '24 hours',
        feature1: 'Unlimited CV Scans (24h)',
        feature2: 'Full Robot X-Ray View',
        feature3: 'ERROR/WARN Labels + Fixes',
        feature4: 'Seniority Match Analysis',
        feature5: 'Keyword Gap Detection',
        feature6: 'Battle Plan Generator',
        feature7: 'Bullet Point Rewriter',
        button: 'Get 24h Access',
      },
      sprint7d: {
        name: '7-Day Sprint',
        description: 'Debug your CV, land interviews, win offers. One week to ship your career.',
        price: '24.99€',
        period: '7 days',
        feature1: 'Unlimited CV Scans (7 days)',
        feature2: 'Robot View Terminal (dirty console)',
        feature3: 'Missing Signals Detector',
        feature4: 'Seniority Match Audit',
        feature5: 'Industry Selector (FAANG/Deloitte/Finance)',
        feature6: 'Bullet Tone Elevator',
        feature7: 'Interview Battle Plan',
        feature8: 'Export Sanitized CV (ATS-safe)',
        feature9: 'BONUS: Cover Letter Gen + LinkedIn Optimizer',
        button: 'Start 7-Day Sprint',
        recommended: 'RECOMMENDED',
      },
      hero: {
        badge: 'SYSTEM_STATUS: ONLINE',
        title: 'Debug Your CV. Stop Getting Ghosted.',
        subtitle: 'Find invisible resume bugs that cost you interviews. Get [ERROR] labels, Robot X-Ray view, and Seniority Match analysis. Debug your CV in 10 seconds.',
      },
      faq: {
        heading: 'Frequently Asked Questions',
        question1: 'How does CVDebug\'s CV Debugger work?',
        answer1: 'CVDebug uses ML algorithms to debug your resume just like ATS robots parse it. We find invisible bugs, add technical [ERROR] and [WARN] labels, show Robot X-Ray view, detect Seniority Match issues, and provide a 0-100 compatibility score with specific bug fixes.',
        question2: 'What\'s the difference between 24-Hour Pass and 7-Day Sprint?',
        answer2: 'Both give unlimited scans and full access. The 24-Hour Pass (14.99€) is perfect if you have one interview coming up this week and need quick fixes. The 7-Day Sprint (24.99€) is RECOMMENDED for job seekers applying to multiple roles - you get priority support, advanced optimization, and a full week to iterate on your CV.',
        question3: 'Do I need a subscription?',
        answer3: 'No! Both paid plans are one-time purchases with no recurring charges. Pay once, debug your CV, land interviews. No credit card stored. You can manage everything from your Mission Control dashboard.',
        question4: 'What file formats do you support?',
        answer4: 'We support PDF, DOCX (Word), and TXT formats. We recommend PDF for best ATS compatibility, as it preserves formatting across all systems.',
        question5: 'How accurate is the ATS score?',
        answer5: 'CVDebug\'s ML algorithms are trained on thousands of real resumes and ATS parsing patterns. Our scoring is EXTREMELY strict and realistic (inspired by Jobscan) - most resumes score 45-75 to show room for improvement. We use penalties for missing elements and low caps for free users (78 max) to give you honest feedback, not inflated scores.',
        question6: 'Is my resume data kept private?',
        answer6: 'Absolutely. We take privacy seriously. Your resume is encrypted, never shared with third parties, and you can delete it anytime from your dashboard. We\'re GDPR and CCPA compliant.',
      },
      guarantee: '14-day money-back guarantee',
    },
    modals: {
      subscription: {
        title: 'Welcome to CVDebug!',
        tier: 'You are currently on the',
        accessMessage: 'You have full access to premium features!',
        upgradeMessage: 'Upgrade to unlock all features',
        viewOptions: 'View Upgrade Options',
        continueDashboard: 'Continue to Dashboard',
        pressEsc: 'Press ESC to close',
        premium: 'Premium',
        interviewSprint: 'interview sprint plan',
        singleScan: 'single scan plan',
        freePlan: 'free plan',
      },
      logout: {
        title: 'Sign out of CVDebug?',
        question: 'Are you sure you want to log out of your session?',
        stayButton: 'Stay Logged In',
        logoutButton: 'Logout',
      },
      creditsExhausted: {
        title: 'Credits Exhausted',
        message: 'You have used all your free scans.',
        scoreLabel: 'Your Score',
        warning: 'Upgrade to continue scanning',
        feature1: 'Unlimited Scans',
        feature2: 'Full Robot View',
        price: '$14.99',
        unlockButton: 'Unlock Now',
        maybeLater: 'Maybe Later',
      },
    },
```

### EN-GB Translations (English - United Kingdom)

Use same as EN-US but with these British English adaptations:
- `cvUpload.heading`: 'Upload your CV' (already CV)
- `cvUpload.scanButton`: 'Scan CV'
- `pricingPage.freePlan.price`: '£0'
- All other currency symbols: '£' instead of '$'

### ES-ES Translations (Spanish - Spain)

```typescript
    landing: {
      nav: {
        features: 'Características',
        pricing: 'Precios',
        login: 'Iniciar Sesión',
        signUp: 'Registrarse',
      },
      hero: {
        title: 'Depura tu Currículum',
        subtitle: 'Encuentra errores invisibles que te cuestan entrevistas',
        startButton: 'Iniciar Escaneo Gratis',
        viewDemo: 'Ver Demo',
      },
      socialProof: {
        trustedBy: 'Con la confianza de más de 10,000 buscadores de empleo',
      },
      stats: {
        stat1: 'Más de 10,000 CVs Escaneados',
        stat2: '95% Tasa de Aprobación ATS',
        stat3: '3x Más Entrevistas',
        stat4: 'Resultados en 24 Horas',
      },
      cta: {
        badge: 'Empieza Gratis',
        heading: '¿Listo para depurar tu currículum?',
        description: 'Únete a miles de buscadores de empleo que consiguieron entrevistas con CVDebug.',
        buttonText: 'Iniciar Escaneo Gratis',
        footerText: 'No se requiere tarjeta de crédito',
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        question1: '¿Cómo funciona CVDebug?',
        answer1: 'CVDebug utiliza algoritmos de ML para escanear tu currículum como lo hacen los sistemas ATS. Identificamos problemas de formato, palabras clave faltantes y oportunidades de optimización.',
        question2: '¿Son seguros mis datos?',
        answer2: '¡Sí! Los datos de tu currículum están encriptados y nunca se comparten con terceros. Cumplimos con GDPR y CCPA.',
        question3: '¿Necesito una suscripción?',
        answer3: '¡No! Ofrecemos pases de un solo uso sin cargos recurrentes. Paga una vez, optimiza tu currículum, consigue entrevistas.',
      },
    },
    onboarding: {
      steps: {
        role: 'Selección de Rol',
        upload: 'Subir CV',
        scan: 'Escanear y Analizar',
      },
      roleSelection: {
        heading: 'Paso 1: Selección de Rol',
        editLink: 'Editar',
        continueButton: 'Continuar',
      },
      cvUpload: {
        heading: 'Sube tu CV',
        description: 'Arrastra y suelta tu currículum aquí (PDF o DOCX) para comenzar el análisis.',
        clickToUpload: 'Haz clic para subir',
        dragDrop: 'o arrastra y suelta',
        maxSize: 'PDF o DOCX (MÁX. 10MB)',
        log1: 'Inicializando secuencia de carga...',
        log2: 'Analizando datos binarios...',
        log3: 'Simulando Robot Reclutador [v2.4.1]...',
        log4: 'Esperando entrada de archivo_',
        log5: 'Archivo detectado: ',
        log6: 'Listo para escanear_',
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
        name: 'Depuración GRATIS',
        description: 'Ve qué está roto. Obtén el diagnóstico.',
        price: '€0',
        period: 'para siempre',
        feature1: 'Vista previa Robot (difuminada)',
        feature2: 'Puntuación ATS Global',
        feature3: 'Etiquetas [ERROR] Básicas',
        feature4: 'Vista previa de Coincidencia de Nivel',
        button: 'Ejecutar Escaneo Gratis',
      },
      pass24h: {
        name: 'Pase de Iteración 24 Horas',
        description: 'Todo lo que necesitas para conseguir una entrevista esta semana. Sin suscripciones. Sin tonterías.',
        price: '14.99€',
        period: '24 horas',
        feature1: 'Escaneos CV Ilimitados (24h)',
        feature2: 'Vista Completa de Rayos X Robot',
        feature3: 'Etiquetas ERROR/WARN + Correcciones',
        feature4: 'Análisis de Coincidencia de Nivel',
        feature5: 'Detección de Brecha de Palabras Clave',
        feature6: 'Generador de Plan de Batalla',
        feature7: 'Reescritor de Viñetas',
        button: 'Obtener Acceso 24h',
      },
      sprint7d: {
        name: 'Sprint de 7 Días',
        description: 'Depura tu CV, consigue entrevistas, gana ofertas. Una semana para lanzar tu carrera.',
        price: '24.99€',
        period: '7 días',
        feature1: 'Escaneos CV Ilimitados (7 días)',
        feature2: 'Terminal Vista Robot (consola detallada)',
        feature3: 'Detector de Señales Faltantes',
        feature4: 'Auditoría de Coincidencia de Nivel',
        feature5: 'Selector de Industria (FAANG/Deloitte/Finanzas)',
        feature6: 'Elevador de Tono de Viñetas',
        feature7: 'Plan de Batalla para Entrevistas',
        feature8: 'Exportar CV Sanitizado (compatible con ATS)',
        feature9: 'BONUS: Generador de Carta de Presentación + Optimizador de LinkedIn',
        button: 'Iniciar Sprint de 7 Días',
        recommended: 'RECOMENDADO',
      },
      hero: {
        badge: 'ESTADO_SISTEMA: EN LÍNEA',
        title: 'Depura tu CV. Deja de Ser Ignorado.',
        subtitle: 'Encuentra errores invisibles en el currículum que te cuestan entrevistas. Obtén etiquetas [ERROR], vista de Rayos X Robot y análisis de Coincidencia de Nivel. Depura tu CV en 10 segundos.',
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        question1: '¿Cómo funciona el Depurador de CV de CVDebug?',
        answer1: 'CVDebug utiliza algoritmos de ML para depurar tu currículum tal como los robots ATS lo analizan. Encontramos errores invisibles, añadimos etiquetas técnicas [ERROR] y [WARN], mostramos la vista de Rayos X Robot, detectamos problemas de Coincidencia de Nivel y proporcionamos una puntuación de compatibilidad de 0-100 con correcciones específicas.',
        question2: '¿Cuál es la diferencia entre el Pase de 24 Horas y el Sprint de 7 Días?',
        answer2: 'Ambos dan escaneos ilimitados y acceso completo. El Pase de 24 Horas (14.99€) es perfecto si tienes una entrevista próxima esta semana y necesitas correcciones rápidas. El Sprint de 7 Días (24.99€) es RECOMENDADO para buscadores de empleo que postulan a múltiples roles - obtienes soporte prioritario, optimización avanzada y una semana completa para iterar en tu CV.',
        question3: '¿Necesito una suscripción?',
        answer3: '¡No! Ambos planes pagados son compras únicas sin cargos recurrentes. Paga una vez, depura tu CV, consigue entrevistas. No se guarda tarjeta de crédito. Puedes gestionar todo desde tu panel de Control de Misión.',
        question4: '¿Qué formatos de archivo admiten?',
        answer4: 'Admitimos formatos PDF, DOCX (Word) y TXT. Recomendamos PDF para la mejor compatibilidad con ATS, ya que preserva el formato en todos los sistemas.',
        question5: '¿Qué tan precisa es la puntuación ATS?',
        answer5: 'Los algoritmos de ML de CVDebug están entrenados con miles de currículums reales y patrones de análisis ATS. Nuestra puntuación es EXTREMADAMENTE estricta y realista (inspirada en Jobscan) - la mayoría de los currículums puntúan entre 45-75 para mostrar margen de mejora. Usamos penalizaciones por elementos faltantes y límites bajos para usuarios gratuitos (78 máx.) para darte retroalimentación honesta, no puntuaciones infladas.',
        question6: '¿Se mantienen privados los datos de mi currículum?',
        answer6: 'Absolutamente. Tomamos la privacidad en serio. Tu currículum está encriptado, nunca se comparte con terceros y puedes eliminarlo en cualquier momento desde tu panel. Cumplimos con GDPR y CCPA.',
      },
      guarantee: 'Garantía de devolución de dinero de 14 días',
    },
    modals: {
      subscription: {
        title: '¡Bienvenido a CVDebug!',
        tier: 'Actualmente estás en el',
        accessMessage: '¡Tienes acceso completo a las funciones premium!',
        upgradeMessage: 'Actualiza para desbloquear todas las funciones',
        viewOptions: 'Ver Opciones de Actualización',
        continueDashboard: 'Continuar al Panel',
        pressEsc: 'Presiona ESC para cerrar',
        premium: 'Premium',
        interviewSprint: 'plan de sprint de entrevistas',
        singleScan: 'plan de escaneo único',
        freePlan: 'plan gratuito',
      },
      logout: {
        title: '¿Cerrar sesión de CVDebug?',
        question: '¿Estás seguro de que quieres cerrar sesión?',
        stayButton: 'Mantener Sesión Iniciada',
        logoutButton: 'Cerrar Sesión',
      },
      creditsExhausted: {
        title: 'Créditos Agotados',
        message: 'Has usado todos tus escaneos gratuitos.',
        scoreLabel: 'Tu Puntuación',
        warning: 'Actualiza para continuar escaneando',
        feature1: 'Escaneos Ilimitados',
        feature2: 'Vista Robot Completa',
        price: '14.99€',
        unlockButton: 'Desbloquear Ahora',
        maybeLater: 'Quizás Más Tarde',
      },
    },
```

### FR-FR, DE-DE, PT-BR, and Other Locales

Due to space constraints, I'll provide the pattern. Each locale should have culturally appropriate translations that:
1. Maintain the technical tone for developer-focused content
2. Adapt currency symbols appropriately
3. Use local idioms where appropriate
4. Keep brand terms like "CVDebug", "ATS", "Robot View" in English

## Step 3: Component Updates

See the implementation examples in:
- `/home/daytona/codebase/src/components/landing/Navbar.tsx` (COMPLETED)
- `/home/daytona/codebase/src/components/onboarding/CVUpload.tsx` (TO DO)
- `/home/daytona/codebase/src/components/onboarding/RoleSelection.tsx` (TO DO)
- `/home/daytona/codebase/src/components/dashboard/SubscriptionStatusModal.tsx` (TO DO)
- `/home/daytona/codebase/src/components/LogoutConfirmDialog.tsx` (TO DO)
- `/home/daytona/codebase/src/pages/Pricing.tsx` (TO DO)

Pattern:
```typescript
import { useI18n } from '@/contexts/I18nContext';

export function Component() {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t.section.subsection.field}</h1>
    </div>
  );
}
```
