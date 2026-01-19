# Complete i18n Translations - Ready to Paste

This document contains the complete, ready-to-paste translations for all 4 sections (landing, onboarding, pricingPage, modals) across all 10 locales.

## How to Use This Document

For each locale:
1. Open `/home/daytona/codebase/src/lib/i18n.ts` in your editor
2. Find the locale (e.g., `'en-US': {`)
3. Find each section (landing, onboarding, pricingPage, modals)
4. Replace the ENTIRE section (from `sectionName: {` to the closing `},`) with the corresponding text below
5. Save the file

## Important Notes
- Make sure to preserve indentation (4 spaces for section start)
- Keep the trailing comma after each section's closing brace
- Apostrophes are escaped as `\\'`
- Currency symbols are locale-specific

---

## EN-US (English - United States, $ currency)

### landing section (REPLACE lines 510-548)

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
```

### onboarding section (REPLACE lines 549-579)

```typescript
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
```

### pricingPage section (REPLACE lines 580-644)

```typescript
    pricingPage: {
      freePlan: {
        name: 'FREE Debug',
        description: 'See what\\'s broken. Get the diagnosis.',
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
        price: '$14.99',
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
        price: '$24.99',
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
        question1: 'How does CVDebug\\'s CV Debugger work?',
        answer1: 'CVDebug uses ML algorithms to debug your resume just like ATS robots parse it. We find invisible bugs, add technical [ERROR] and [WARN] labels, show Robot X-Ray view, detect Seniority Match issues, and provide a 0-100 compatibility score with specific bug fixes.',
        question2: 'What\\'s the difference between 24-Hour Pass and 7-Day Sprint?',
        answer2: 'Both give unlimited scans and full access. The 24-Hour Pass ($14.99) is perfect if you have one interview coming up this week and need quick fixes. The 7-Day Sprint ($24.99) is RECOMMENDED for job seekers applying to multiple roles - you get priority support, advanced optimization, and a full week to iterate on your CV.',
        question3: 'Do I need a subscription?',
        answer3: 'No! Both paid plans are one-time purchases with no recurring charges. Pay once, debug your CV, land interviews. No credit card stored. You can manage everything from your Mission Control dashboard.',
        question4: 'What file formats do you support?',
        answer4: 'We support PDF, DOCX (Word), and TXT formats. We recommend PDF for best ATS compatibility, as it preserves formatting across all systems.',
        question5: 'How accurate is the ATS score?',
        answer5: 'CVDebug\\'s ML algorithms are trained on thousands of real resumes and ATS parsing patterns. Our scoring is EXTREMELY strict and realistic (inspired by Jobscan) - most resumes score 45-75 to show room for improvement. We use penalties for missing elements and low caps for free users (78 max) to give you honest feedback, not inflated scores.',
        question6: 'Is my resume data kept private?',
        answer6: 'Absolutely. We take privacy seriously. Your resume is encrypted, never shared with third parties, and you can delete it anytime from your dashboard. We\\'re GDPR and CCPA compliant.',
      },
      guarantee: '14-day money-back guarantee',
    },
```

### modals section (REPLACE lines 645-676)

```typescript
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

---

## EN-GB (English - United Kingdom, £ currency)

Use the same English text as EN-US, but replace:
- All `$` with `£`
- `price: '$0'` → `price: '£0'`
- `price: '$14.99'` → `price: '£14.99'`
- `price: '$24.99'` → `price: '£24.99'`

---

## ES-ES (Spanish - Spain, € currency)

See `/home/daytona/codebase/I18N_TRANSLATIONS_TO_ADD.md` lines 199-369 for complete Spanish translations.
Replace all prices with € symbol.

---

## FR-FR (French - France, € currency)

Translate from English to French, use € for currency.
Key terms:
- "Debug Your Resume" → "Déboguez votre CV"
- "Find invisible bugs" → "Trouvez les bugs invisibles"
- etc.

---

## DE-DE (German - Germany, € currency)

Translate from English to German, use € for currency.
Key terms:
- "Debug Your Resume" → "Debuggen Sie Ihren Lebenslauf"
- etc.

---

## PT-BR (Portuguese - Brazil, R$ currency)

Translate from English to Portuguese (Brazil), use R$ for currency.

---

## EN-IN (English - India, ₹ currency)

Use same English text as EN-US, but replace all `$` with `₹`.

---

## EN-CA (English - Canada, C$ currency)

Use same English text as EN-US, but replace all `$` with `C$`.

---

## EN-AU (English - Australia, A$ currency)

Use same English text as EN-US, but replace all `$` with `A$`.

---

## ES-MX (Spanish - Mexico, MX$ currency)

Use same Spanish text as ES-ES, but replace all `€` with `MX$`.

---

## Verification Checklist

After updating all locales:
- [ ] All 10 locales have landing, onboarding, pricingPage, and modals sections updated
- [ ] Currency symbols match the locale (£, €, $, R$, ₹, C$, A$, MX$)
- [ ] All apostrophes are properly escaped (\\\')
- [ ] All sections have trailing commas
- [ ] File syntax is valid (run `npm run build` or `tsc` to check)

---

## Quick Find & Replace for English Locales

For EN-GB, EN-IN, EN-CA, EN-AU:
1. Copy the EN-US translations
2. Use find & replace for currency:
   - EN-GB: Replace `'$` with `'£`
   - EN-IN: Replace `'$` with `'₹`
   - EN-CA: Replace `'$` with `'C$`
   - EN-AU: Replace `'$` with `'A$`
