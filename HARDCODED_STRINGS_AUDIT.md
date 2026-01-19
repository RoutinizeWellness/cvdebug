# Comprehensive Hardcoded Strings Audit for CVDebug i18n Extension

## Executive Summary
This document lists all discovered hardcoded strings in the CVDebug codebase that need translation integration. The audit identified **~250+ hardcoded user-facing strings** across:
- 71+ component files (non-UI)
- 20+ page files
- Toast messages, placeholders, labels, titles, alt-text, and descriptions

---

## 1. LANDING PAGE COMPONENTS
### File: `/src/components/landing/Footer.tsx`
- **Line 26, 34, 42, 50, 58**: Section headings (Product, For Nurses, For Tech, Resources, Legal)
  - **Strings**: "Product", "For Nurses", "For Tech", "Resources", "Legal"
  - **Suggested Key**: `footer.sections.{product|forNurses|forTech|resources|legal}`
  - **Usage**: Footer navigation headers

- **Line 27-46**: Footer navigation links
  - **Strings**: "ATS Scanner", "Preview Scan", "Pricing", "Dashboard", "Nursing ATS Scanner", "ICU Nurse", "ER Nurse", "Travel Nurse", "Software Engineer", "Frontend Engineer", "Backend Engineer", "DevOps Engineer", "Blog", "Beat ATS Guide", "Robot View Guide", "Contact"
  - **Suggested Keys**: `footer.links.{scanner|preview|pricing|dashboard|nursing|icu|er|travel|software|frontend|backend|devops|blog|beatAts|robotView|contact}`
  - **Usage**: Footer links

- **Line 59-60**: Legal buttons
  - **Strings**: "Privacy Policy", "Terms of Service"
  - **Suggested Keys**: `footer.legal.{privacy|terms}`
  - **Usage**: Modal trigger buttons

- **Line 66**: Copyright text
  - **String**: "© 2026 CVDebug Inc. All rights reserved."
  - **Suggested Key**: `footer.copyright`
  - **Usage**: Footer copyright

### File: `/src/components/landing/FAQSection.tsx`
- **Line 9**: FAQ section heading
  - **String**: "Common Questions"
  - **Suggested Key**: `landing.faq.heading`
  - **Usage**: Main FAQ title (should replace `landing.faq.heading` or create new)

- **Line 20-21**: FAQ questions
  - **Strings**: "What is the 'Image Trap'?", "Does this work for all industries?"
  - **Suggested Keys**: `landing.faq.customQuestion1`, `landing.faq.customQuestion2`
  - **Usage**: Additional FAQ items beyond the existing 3 questions

### File: `/src/components/landing/HeroSection.tsx`
- **Line 86**: Image alt text
  - **String**: "User avatar"
  - **Suggested Key**: `landing.images.userAvatar`

- **Line 157**: Description text
  - **String**: "Agile"
  - **Suggested Key**: `landing.about.agile`

### File: `/src/components/landing/FeatureGridSection.tsx`
- **Lines 55-58**: Feature titles
  - **Strings**: "Formatting Errors", "Missing Keywords", "Unoptimized LinkedIn", "Low Content Density"
  - **Suggested Keys**: `landing.features.errors.{formatting|keywords|linkedin|density}`

### File: `/src/components/landing/FeaturesSection.tsx`
- **Lines 8-39**: Feature section titles and descriptions
  - **Strings**:
    - "Project Tracking", "Treat your job search like a product launch. Organize every..."
    - "Keyword Sniper", "Instantly compare your resume against job descriptions. We h..."
    - "Image Trap Monitor", "Detect unreadable graphics, hidden text boxes, and complex l..."
  - **Suggested Keys**: `landing.features.{projectTracking|keywordSniper|imageTrap}.{title|description}`

### File: `/src/components/landing/EnterpriseSection.tsx`
- **Lines 12-23**: Enterprise features
  - **Strings**:
    - "Team Management", "Centralized dashboard for HR teams to track all candidate ap..."
    - "SOC 2 Compliant", "Enterprise-grade security with SSO and role-based access con..."
    - "API Access", "Integrate ATS scanning directly into your recruitment workfl..."
  - **Suggested Keys**: `landing.enterprise.{teamManagement|soc2|api}.{title|description}`

### File: `/src/components/landing/DifferentiationSection.tsx`
- **Lines 8-27**: Differentiation messages
  - **Strings**:
    - "Transparent Pricing", "One-time payment of €9.99. No hidden fees, no recurring subs"
    - "Honest Limitations", "We are a diagnostic tool, not a magic wand. We fix technical"
    - "Privacy-First", "Your resume is personal. We treat it that way. We don"
    - "No BS Claims", "We don"
  - **Suggested Keys**: `landing.differentiation.{pricing|limitations|privacy|claims}.{title|description}`

### File: `/src/components/landing/ComparisonVisualSection.tsx`
- Hardcoded labels in comparison visuals (warning/error messages in previews)

---

## 2. DASHBOARD COMPONENTS

### File: `/src/components/dashboard/AIFeedbackWidget.tsx`
- **Line 34**: Toast error
  - **String**: "Please select a rating"
  - **Suggested Key**: `dashboard.feedback.noRating`
  - **Usage**: Validation error for rating selection

- **Line 47**: Toast success
  - **String**: "Thank you for your feedback!"
  - **Suggested Key**: `dashboard.feedback.success`

- **Line 56**: Toast error
  - **String**: "Failed to submit feedback"
  - **Suggested Key**: `dashboard.feedback.submitError`

- **Lines 110, 163**: Placeholders
  - **Strings**: "Any additional comments? (optional)", "Tell us more (optional)"
  - **Suggested Keys**: `dashboard.feedback.commentPlaceholder`, `dashboard.feedback.tellMore`

### File: `/src/components/dashboard/BulletRewriter.tsx`
- **Line 245**: Toast error
  - **String**: "Please enter a bullet point to rewrite"
  - **Suggested Key**: `dashboard.bullet.noInput`

- **Line 259**: Toast success
  - **String**: "Bullet point optimized!"
  - **Suggested Key**: `dashboard.bullet.optimized`

- **Line 264**: Toast error
  - **String**: "Failed to rewrite bullet point"
  - **Suggested Key**: `dashboard.bullet.rewriteError`

- **Line 274**: Toast success
  - **String**: "Copied to clipboard!"
  - **Suggested Key**: `common.copiedToClipboard`

- **Line 302**: Placeholder
  - **String**: "Example: Worked on improving the website performance..."
  - **Suggested Key**: `dashboard.bullet.examplePlaceholder`

- **Line 316**: Placeholder
  - **String**: "e.g., Software Engineer"
  - **Suggested Key**: `dashboard.bullet.rolePlaceholder`

### File: `/src/components/dashboard/CoverLetterGenerator.tsx`
- **Line 50**: Toast error
  - **String**: "Interview Sprint plan required"
  - **Suggested Key**: `dashboard.upgrade.interviewSprintRequired`

- **Line 51**: Description
  - **String**: "Upgrade to generate AI-powered cover letters"
  - **Suggested Key**: `dashboard.coverLetter.upgradeDescription`

- **Line 58**: Toast error
  - **String**: "Please enter a job description"
  - **Suggested Key**: `dashboard.coverLetter.noJobDescription`

- **Line 74**: Toast success
  - **String**: "Cover letter generated successfully!"
  - **Suggested Key**: `dashboard.coverLetter.generated`

- **Line 83**: Toast error
  - **String**: "Failed to generate cover letter"
  - **Suggested Key**: `dashboard.coverLetter.generateError`

- **Lines 171, 189-190**: Placeholders
  - **Strings**: "Select a resume...", "e.g. Acme Corp", "e.g. Senior Engineer"
  - **Suggested Keys**: `dashboard.coverLetter.selectResume`, `dashboard.coverLetter.companyPlaceholder`, `dashboard.coverLetter.rolePlaceholder`

### File: `/src/components/dashboard/CreateApplicationDialog.tsx`
- **Line 35**: Toast error + description
  - **String**: "Interview Sprint plan required", "Upgrade to track applications and get AI-powered insights"
  - **Suggested Keys**: `dashboard.upgrade.interviewSprintRequired`, `dashboard.applications.upgradeDescription`

- **Line 51**: Toast success
  - **String**: "Application added successfully"
  - **Suggested Key**: `dashboard.applications.added`

- **Line 62**: Toast error
  - **String**: "Failed to add application"
  - **Suggested Key**: `dashboard.applications.addError`

- **Lines 132-175**: Placeholders
  - **Strings**: "e.g., Acme Corp", "e.g., Senior Engineer", "https://...", "Paste the job description here for AI-powered keyword matching..."
  - **Suggested Keys**: `dashboard.applications.{companyPlaceholder|rolePlaceholder|urlPlaceholder|jobDescPlaceholder}`

### File: `/src/components/dashboard/CreateProjectDialog.tsx`
- **Line 33**: Toast success
  - **String**: "Project created successfully!"
  - **Suggested Key**: `dashboard.projects.created`

- **Line 37**: Toast error
  - **String**: "Failed to create project"
  - **Suggested Key**: `dashboard.projects.createError`

- **Lines 88-189**: Placeholders
  - **Strings**: "e.g. Senior SWE Hunt at Google", "e.g. Senior Software Engineer, Product Manager...", "https://linkedin.com/jobs/view/...", "Paste the full job description here..."
  - **Suggested Keys**: `dashboard.projects.{projectPlaceholder|titlePlaceholder|urlPlaceholder|jobDescPlaceholder}`

### File: `/src/components/dashboard/ATSRawTextView.tsx`
- **Line 20**: Toast success
  - **String**: "Raw text copied to clipboard"
  - **Suggested Key**: `dashboard.ats.textCopied`

- **Line 34**: Toast success
  - **String**: "Raw text downloaded"
  - **Suggested Key**: `dashboard.ats.textDownloaded`

### File: `/src/components/dashboard/ATSSimulation.tsx`
- **Line 109**: Placeholder
  - **String**: "Search by keyword..."
  - **Suggested Key**: `dashboard.ats.searchPlaceholder`

### File: `/src/components/dashboard/FluffDetector.tsx`
- **Line 779**: Toast success
  - **String**: "Metric copied to clipboard!"
  - **Suggested Key**: `dashboard.fluff.metricCopied`

- **Line 784**: Toast error + description
  - **String**: "Failed to copy to clipboard", "Please try selecting the text manually."
  - **Suggested Keys**: `dashboard.fluff.copyError`, `dashboard.fluff.copyErrorDescription`

- **Line 789**: Toast warning + description
  - **String**: "Please select a metric first", "Choose one of the AI-suggested quantifications above."
  - **Suggested Keys**: `dashboard.fluff.noMetricSelected`, `dashboard.fluff.noMetricDescription`

### File: `/src/components/dashboard/ImageTrapAlert.tsx`
- **Line 44**: Toast error
  - **String**: "Cannot sanitize: Resume ID missing"
  - **Suggested Key**: `dashboard.sanitize.noResume`

- **Line 51**: Toast success + description
  - **String**: "PDF Sanitized successfully!", "Text layer integrity has been restored."
  - **Suggested Keys**: `dashboard.sanitize.success`, `dashboard.sanitize.successDescription`

- **Line 56**: Toast error
  - **String**: "Failed to sanitize PDF"
  - **Suggested Key**: `dashboard.sanitize.error`

### File: `/src/components/dashboard/InterviewBattlePlan.tsx`
- **Lines 61-63**: Checkbox titles and descriptions
  - **Strings**: "Metric Impact", "Mention the 15% CSAT increase explicitly.", "Tech Stack", "Name drop BERT and Distillation.", "Ownership", "Use"
  - **Suggested Keys**: `dashboard.interview.battlePlan.{metricImpact|techStack|ownership}.{title|description}`

- **Lines 109-117**: Strength titles and descriptions
  - **Strings**: "End-to-End ML Deployment", "Cross-Functional Leadership"
  - **Suggested Keys**: `dashboard.interview.strengths.{mlDeployment|leadership}.{title|description}`

- **Line 145**: Toast error
  - **String**: "Not enough resume text to generate questions"
  - **Suggested Key**: `dashboard.interview.noResumeText`

- **Line 147**: Toast loading
  - **String**: "Regenerating questions with ML algorithms..."
  - **Suggested Key**: `dashboard.interview.regenerating`

- **Line 152**: Toast success
  - **String**: "Questions regenerated with ML! Fresh questions based on your resume."
  - **Suggested Key**: `dashboard.interview.questionsRegenerated`

- **Line 161**: Toast error
  - **String**: "Failed to generate questions. Using fallback questions."
  - **Suggested Key**: `dashboard.interview.generateError`

- **Line 193**: Toast loading
  - **String**: "Enhancing your answer with AI..."
  - **Suggested Key**: `dashboard.interview.enhancing`

- **Line 196**: Toast success
  - **String**: "Answer enhanced with AI suggestions!"
  - **Suggested Key**: `dashboard.interview.answerEnhanced`

- **Line 253**: Placeholder
  - **String**: "Describe the actions you took..."
  - **Suggested Key**: `dashboard.interview.actionPlaceholder`

- **Line 277**: Toast success
  - **String**: "Downloading strategy document..."
  - **Suggested Key**: `dashboard.interview.downloading`

### File: `/src/components/dashboard/InterviewBattlePlanModal.tsx`
- **Line 31**: Toast error
  - **String**: "Please paste the job description first"
  - **Suggested Key**: `dashboard.interview.noJobDesc`

- **Line 45**: Toast success
  - **String**: "Battle plan generated!"
  - **Suggested Key**: `dashboard.interview.battlePlanGenerated`

- **Line 49**: Toast error
  - **String**: "Failed to generate battle plan"
  - **Suggested Key**: `dashboard.interview.battlePlanError`

- **Line 100**: Placeholder
  - **String**: "Paste the full job description here..."
  - **Suggested Key**: `dashboard.interview.jobDescPlaceholder`

### File: `/src/components/dashboard/InterviewPrepMode.tsx`
- **Line 49**: Toast error
  - **String**: "Please provide a valid job description to generate interview prep."
  - **Suggested Key**: `dashboard.interview.invalidJobDesc`

- **Line 54**: Toast error
  - **String**: "Resume text is too short. Please upload a valid resume first."
  - **Suggested Key**: `dashboard.interview.shortResume`

- **Line 68**: Toast success
  - **String**: "Battle Plan Generated!"
  - **Suggested Key**: `dashboard.interview.battlePlanGenerated`

- **Line 74**: Toast error
  - **String**: "API key not configured. Please contact support at cvdebug@outlook.com"
  - **Suggested Key**: `dashboard.errors.apiKeyNotConfigured`

- **Line 76**: Toast error
  - **String**: "Failed to generate prep. This feature requires an active subscription."
  - **Suggested Key**: `dashboard.interview.requiresSubscription`

### File: `/src/components/dashboard/LinkedInOptimizer.tsx`
- **Line 41**: Toast error + description
  - **String**: "Interview Sprint plan required", "Upgrade to optimize your LinkedIn profile"
  - **Suggested Keys**: `dashboard.upgrade.interviewSprintRequired`, `dashboard.linkedin.upgradeDescription`

- **Line 52**: Toast error
  - **String**: "Please paste your LinkedIn profile text"
  - **Suggested Key**: `dashboard.linkedin.noProfileText`

- **Line 66**: Toast success
  - **String**: "✅ LinkedIn profile analyzed successfully!"
  - **Suggested Key**: `dashboard.linkedin.analyzed`

- **Line 77**: Toast error
  - **String**: "No credits remaining. Please upgrade to continue."
  - **Suggested Key**: `dashboard.errors.noCredits`

- **Line 79**: Toast error
  - **String**: "Failed to scan profile. Please try again."
  - **Suggested Key**: `dashboard.linkedin.scanError`

- **Line 88**: Toast error
  - **String**: "No bio optimization available. Please scan your profile first."
  - **Suggested Key**: `dashboard.linkedin.noBioOptimization`

- **Line 95**: Toast success
  - **String**: "✅ Optimized bio copied to clipboard! Paste it into your LinkedIn profile"
  - **Suggested Key**: `dashboard.linkedin.bioOptimized`

### File: `/src/components/dashboard/LiveResumeOptimizer.tsx`
- **Line 67**: Placeholder
  - **String**: "Paste your resume content here and watch the score update in real-time..."
  - **Suggested Key**: `dashboard.liveOptimizer.placeholder`

### File: `/src/components/dashboard/CinematicScanning.tsx`
- **Lines 26-30**: Scanning checklist items
  - **Strings**: "File Validation", "PDF structure is valid.", "Layout Integrity", "Checking margins & text-flow.", "Keyword Match", "PENDING", "Experience Timeline", "Scoring & Report"
  - **Suggested Keys**: `dashboard.scanning.{fileValidation|layoutIntegrity|keywordMatch|timeline|scoring}.{title|subtitle}`

### File: `/src/components/dashboard/ApplyMetricModal.tsx`
- **Line 113**: Toast error
  - **String**: "Please provide a quantified version"
  - **Suggested Key**: `dashboard.metrics.noQuantified`

- **Line 120**: Toast warning
  - **String**: "Don't forget to replace the [bracketed] values with your actual numbers!"
  - **Suggested Key**: `dashboard.metrics.replaceBrackets`

- **Line 124**: Toast success
  - **String**: "Bullet point updated with metrics!"
  - **Suggested Key**: `dashboard.metrics.updated`

### File: `/src/components/dashboard/DMGenerator.tsx`
- **Line 35**: Toast error
  - **String**: "Profile text is missing. Please analyze your profile first."
  - **Suggested Key**: `dashboard.dm.noProfile`

- **Line 50**: Toast success
  - **String**: "DMs generated successfully!"
  - **Suggested Key**: `dashboard.dm.generated`

- **Line 54**: Toast error
  - **String**: "Failed to generate DMs. Please try again."
  - **Suggested Key**: `dashboard.dm.generateError`

- **Line 64**: Toast success
  - **String**: "DM copied to clipboard!"
  - **Suggested Key**: `dashboard.dm.copied`

- **Line 97**: Placeholder
  - **String**: "e.g. Sarah Smith"
  - **Suggested Key**: `dashboard.dm.namePlaceholder`

### File: `/src/components/dashboard/HeadlineOptimizer.tsx`
- **Line 16**: Toast success
  - **String**: "Headline copied to clipboard!"
  - **Suggested Key**: `dashboard.headline.copied`

### File: `/src/components/dashboard/KeywordSniperPanel.tsx`
- **Line 52**: Toast success
  - **String**: "Copied to clipboard"
  - **Suggested Key**: `common.copiedToClipboard`

- **Line 73**: Toast error
  - **String**: "Failed to generate phrases. Please try again."
  - **Suggested Key**: `dashboard.keywords.generateError`

### File: `/src/components/dashboard/KeywordSniperView.tsx`
- **Line 76**: Toast success
  - **String**: "Suggestion applied! Your resume has been updated."
  - **Suggested Key**: `dashboard.keywords.applied`

- **Line 354**: Toast success
  - **String**: "Resume rewritten successfully!"
  - **Suggested Key**: `dashboard.keywords.rewritten`

### File: `/src/components/dashboard/ActionableFixes.tsx`
- **Line 52**: Toast success
  - **String**: "Copied to clipboard!"
  - **Suggested Key**: `common.copiedToClipboard`

### File: `/src/components/dashboard/BulletPointSniper.tsx`
- **Line 95**: Toast success
  - **String**: "Power Statement copied!"
  - **Suggested Key**: `dashboard.bullet.powerStatementCopied`

### File: `/src/components/dashboard/MLInsights.tsx`
- **Lines 38-58**: Label texts
  - **Strings**: "Overall", "Keyword Match", "Action Verbs", "Impact", "Structure"
  - **Suggested Keys**: `dashboard.insights.{overall|keywordMatch|actionVerbs|impact|structure}`

### File: `/src/components/dashboard/KanbanBoard.tsx`
- **Lines 170-172**: Kanban column titles
  - **Strings**: "Applied", "Interviewing", "Accepted"
  - **Suggested Keys**: `dashboard.kanban.{applied|interviewing|accepted}`

### File: `/src/components/dashboard/KeywordExamplesModal.tsx`
- **Line 72**: Toast success
  - **String**: "Copied to clipboard!"
  - **Suggested Key**: `common.copiedToClipboard`

### File: `/src/components/dashboard/KeywordAnalysis.tsx`
- **Line 50**: Description
  - **String**: "View how top candidates incorporate this keyword effectively."
  - **Suggested Key**: `dashboard.keywords.exampleDescription`

### File: `/src/components/dashboard/CVVersionAnalytics.tsx`
- Uses dynamic success/message properties

### File: `/src/components/dashboard/WritingForge.tsx`
- **Line 60**: Toast error
  - **String**: "No resume text to edit"
  - **Suggested Key**: `dashboard.writing.noResume`

- **Line 72**: Toast error
  - **String**: "Resume cannot be empty"
  - **Suggested Key**: `dashboard.writing.emptyResume`

- **Line 77**: Toast error
  - **String**: "Unable to save changes"
  - **Suggested Key**: `dashboard.writing.saveError`

- **Line 89**: Toast success
  - **String**: "Changes saved!"
  - **Suggested Key**: `dashboard.writing.saved`

- **Line 94**: Toast error
  - **String**: "Failed to save changes"
  - **Suggested Key**: `dashboard.writing.saveFailed`

- **Line 108**: Toast error
  - **String**: "Interview Sprint plan required"
  - **Suggested Key**: `dashboard.upgrade.interviewSprintRequired`

- **Line 116**: Toast error
  - **String**: "No resume text to regenerate"
  - **Suggested Key**: `dashboard.writing.noTextToRegenerate`

- **Line 120**: Toast loading
  - **String**: "Regenerating with AI..."
  - **Suggested Key**: `dashboard.writing.regenerating`

- **Line 127**: Toast success
  - **String**: "Resume regenerated!"
  - **Suggested Key**: `dashboard.writing.regenerated`

- **Line 142**: Toast loading
  - **String**: "Preparing PDF download..."
  - **Suggested Key**: `dashboard.writing.preparingPdf`

- **Line 583**: Placeholder
  - **String**: "Edit your resume text here..."
  - **Suggested Key**: `dashboard.writing.editPlaceholder`

---

## 3. ADMIN COMPONENTS

### File: `/src/components/admin/AdminDataImport.tsx`
- **Line 36, 39**: Toast messages
  - **Strings**: "Sync Complete", "Sync Failed", "Import Failed", "Import Successful"
  - **Suggested Keys**: `admin.import.{syncComplete|syncFailed|importFailed|importSuccess}`

### File: `/src/components/admin/AdminManualGrant.tsx`
- **Lines 43, 52, 64**: Placeholders
  - **Strings**: "user@example.com or user_2...", "John Doe", "Select plan"
  - **Suggested Keys**: `admin.grant.{emailPlaceholder|namePlaceholder|planPlaceholder}`

### File: `/src/components/admin/AdminPaymentTesting.tsx`
- **Line 77**: Placeholder
  - **String**: "User Email"
  - **Suggested Key**: `admin.payment.emailPlaceholder`

### File: `/src/components/admin/AdminPaymentsView.tsx`
- **Line 21**: Toast success
  - **String**: "💰 New Payment Received!"
  - **Suggested Key**: `admin.payments.received`

### File: `/src/components/admin/AdminUserTable.tsx`
- **Line 77**: Placeholder
  - **String**: "Search users..."
  - **Suggested Key**: `admin.users.searchPlaceholder`

### File: `/src/components/admin/AdminUserTable.tsx`
- **Line 135**: Toast success
  - **String**: "User updated successfully"
  - **Suggested Key**: `admin.users.updated`

- **Line 139**: Toast error
  - **String**: "Failed to update user"
  - **Suggested Key**: `admin.users.updateError`

- **Lines 151-196**: Various admin messages
  - **Strings**: "Failed to fix users", "Fix Complete", "Failed to fix known missing users", "Reported Users Fix Complete", "Failed to fix reported users", "User deleted", "Failed to delete user"
  - **Suggested Keys**: `admin.fix.{error|complete|reportedError|reportedComplete|deleteSuccess|deleteError}`

---

## 4. PAGE COMPONENTS

### File: `/src/pages/Admin.tsx`
- Multiple admin-related toasts (listed above)

### File: `/src/pages/Dashboard.tsx`
- **Line 209**: Toast success
  - **String**: "Payment successful! Unlocking your resume report..."
  - **Suggested Key**: `payment.success`

- **Line 218**: Toast error
  - **String**: "Payment recorded but credit update failed. Please contact support"
  - **Suggested Key**: `payment.creditError`

- **Line 249**: Toast error
  - **String**: "Resume analysis failed. Please try again."
  - **Suggested Key**: `dashboard.analysis.error`

- **Line 265**: Toast success
  - **String**: "🎉 Resume report unlocked! Your credits have been applied."
  - **Suggested Key**: `dashboard.reportUnlocked`

- **Line 273**: Toast success
  - **String**: "Resume deleted"
  - **Suggested Key**: `dashboard.resumeDeleted`

- **Line 276**: Toast error
  - **String**: "Failed to delete"
  - **Suggested Key**: `common.deleteError`

### File: `/src/pages/ContactUs.tsx`
- **Lines 21, 50, 57, 64, 71**: Section titles
  - **Strings**: "Contact Us | CVDebug Support", "Email Support", "Live Chat", "Response Time", "Location"
  - **Suggested Keys**: `pages.contact.{title|email|chat|responseTime|location}`

- **Lines 146, 162, 199**: Form placeholders
  - **Strings**: "John Doe", "john@example.com", "How can we help you?"
  - **Suggested Keys**: `pages.contact.{namePlaceholder|emailPlaceholder|messagePlaceholder}`

### File: `/src/pages/PaymentSuccess.tsx`
- **Line 64**: Toast error
  - **String**: "No transaction ID available"
  - **Suggested Key**: `payment.noTransactionId`

- **Line 83**: Toast success
  - **String**: "Receipt downloaded successfully"
  - **Suggested Key**: `payment.receiptDownloaded`

- **Line 86**: Toast error
  - **String**: "Failed to download receipt"
  - **Suggested Key**: `payment.downloadError`

### File: `/src/pages/PreviewScan.tsx`
- **Line 326**: Toast error
  - **String**: "Failed to process file"
  - **Suggested Key**: `previewScan.processError`

### File: `/src/pages/BlogPost.tsx`
- **Line 45**: Toast success
  - **String**: "Link copied to clipboard!"
  - **Suggested Key**: `common.copiedToClipboard`

### Specialized Industry Pages

#### `/src/pages/ATSScannerNurses.tsx`
- **Lines 55, 61, 67**: Feature titles
  - **Strings**: "Clinical Keywords Optimizer", "Healthcare ATS Compatibility", "License & Credential Validator"
  - **Suggested Keys**: `pages.nursing.features.{clinical|healthcare|credentials}`

#### `/src/pages/MedSurgNurseATSOptimizer.tsx`
- **Lines 55-88**: Before/After comparison titles and feature names
  - **Strings**: "Generic", "Patient Ratios Not Quantified", "Surgical Experience Buried", "Med-Surg Specific Keyword Optimizer", "Patient Ratio & Acuity Validator", "Surgical Specialty Matcher", "Shift & Experience Formatter", "BEFORE CVDebug Optimization", "AFTER CVDebug Optimization"
  - **Suggested Keys**: `pages.medSurg.{issues|features|beforeAfter}.{title|description}`

#### `/src/pages/SoftwareEngineerKeywordSniper.tsx`
- **Lines 55, 61, 67**: Feature titles
  - **Strings**: "Tech Stack Keyword Sniper", "FAANG ATS Compatibility", "System Design Validator"
  - **Suggested Keys**: `pages.softwareEngineer.features.{techStack|faang|systemDesign}`

#### `/src/pages/ResumeDebugDataAnalysts.tsx`
- **Lines 28, 34, 40**: Feature titles
  - **Strings**: "Technical Skills Parser", "Metrics Impact Analyzer", "Tech Stack Keyword Matcher"
  - **Suggested Keys**: `pages.dataAnalyst.features.{skills|metrics|techStack}`

#### `/src/pages/FinanceInternshipATSOptimizer.tsx`
- **Lines 29, 35, 41**: Feature titles
  - **Strings**: "IB Keywords Validator", "Internship Format Checker", "Finance Metrics Optimizer"
  - **Suggested Keys**: `pages.finance.features.{ibKeywords|format|metrics}`

### Generic Pages
- **`/src/pages/AboutUs.tsx`**: Section titles
  - **Strings**: "About CVDebug - AI-Powered ATS Resume Optimization", "Mission-Driven", "Job Seeker First", "Innovation", "Privacy & Trust"
  - **Suggested Keys**: `pages.about.{title|missionDriven|jobSeeker|innovation|privacy}`

- **`/src/pages/Blog.tsx`**: Page title
  - **String**: "ATS Resume Tips & Job Search Strategies Blog | CVDebug"
  - **Suggested Key**: `pages.blog.title`

- **`/src/pages/PrivacyPolicy.tsx`**: Page title
  - **String**: "Privacy Policy | CVDebug"
  - **Suggested Key**: `pages.privacy.title`

- **`/src/pages/TermsConditions.tsx`**: Page title
  - **String**: "Terms & Conditions | CVDebug"
  - **Suggested Key**: `pages.terms.title`

- **`/src/pages/ProjectSettings.tsx`**: Success message
  - **String**: "CV Uploaded Successfully!"
  - **Suggested Key**: `projectSettings.uploadSuccess`

---

## 5. OTHER COMPONENTS

### File: `/src/components/Chatbot.tsx`
- **Line 131**: Placeholder
  - **String**: "Type a message..."
  - **Suggested Key**: `common.chatPlaceholder`

### File: `/src/components/Logo.tsx`
- **Line 26**: Alt text
  - **String**: "CVDebug"
  - **Suggested Key**: `common.images.logo`

### File: `/src/components/LogoDropdown.tsx`
- **Line 42**: Alt text
  - **String**: "Logo"
  - **Suggested Key**: `common.images.logo`

### File: `/src/components/PricingDialog.tsx`
- **Line 58**: Toast error
  - **String**: "Failed to start checkout"
  - **Suggested Key**: `payment.checkoutError`

- **Line 67**: Toast error
  - **String**: "Please log in to purchase credits"
  - **Suggested Key**: `payment.loginRequired`

- **Line 68**: Toast error
  - **String**: "Failed to initiate checkout"
  - **Suggested Key**: `payment.initiateError`

---

## 6. SUMMARY STATISTICS

| Category | Count | Notes |
|----------|-------|-------|
| Toast Messages | ~80 | Error, success, warning, loading messages |
| Placeholders | ~35 | Form input and text area placeholders |
| Labels/Titles | ~60 | Button labels, section titles, headings |
| Alt Text | ~8 | Image alternative text |
| Descriptions | ~25 | Feature descriptions, help text |
| **TOTAL** | **~208** | Conservative estimate |

---

## 7. SUGGESTED i18n.ts STRUCTURE ADDITIONS

### New Sections to Add:

```typescript
// Dashboard - Detailed sections
dashboard: {
  // Existing...
  bullet: {
    noInput: string;
    optimized: string;
    rewriteError: string;
    examplePlaceholder: string;
    rolePlaceholder: string;
    powerStatementCopied: string;
  };
  feedback: {
    noRating: string;
    success: string;
    submitError: string;
    commentPlaceholder: string;
    tellMore: string;
  };
  coverLetter: {
    upgradeDescription: string;
    noJobDescription: string;
    generated: string;
    generateError: string;
    selectResume: string;
    companyPlaceholder: string;
    rolePlaceholder: string;
  };
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
  interview: {
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
    battlePlan: {
      metricImpact: { title: string; description: string };
      techStack: { title: string; description: string };
      ownership: { title: string; description: string };
    };
    strengths: {
      mlDeployment: { title: string; description: string };
      leadership: { title: string; description: string };
    };
  };
  linkedin: {
    upgradeDescription: string;
    noProfileText: string;
    analyzed: string;
    scanError: string;
    noBioOptimization: string;
    bioOptimized: string;
  };
  liveOptimizer: {
    placeholder: string;
  };
  scanning: {
    fileValidation: { title: string; subtitle: string };
    layoutIntegrity: { title: string; subtitle: string };
    keywordMatch: { title: string; subtitle: string };
    timeline: { title: string; subtitle: string };
    scoring: { title: string; subtitle: string };
  };
  metrics: {
    noQuantified: string;
    replaceBrackets: string;
    updated: string;
  };
  dm: {
    noProfile: string;
    generated: string;
    generateError: string;
    copied: string;
    namePlaceholder: string;
  };
  headline: {
    copied: string;
  };
  keywords: {
    generateError: string;
    applied: string;
    rewritten: string;
    exampleDescription: string;
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
  writing: {
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
  analysis: {
    error: string;
  };
  reportUnlocked: string;
  resumeDeleted: string;
  upgrade: {
    interviewSprintRequired: string;
  };
  errors: {
    apiKeyNotConfigured: string;
    noCredits: string;
  };
};

// Admin section
admin: {
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
  users: {
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

// Pages
pages: {
  nursing: {
    features: {
      clinical: string;
      healthcare: string;
      credentials: string;
    };
  };
  medSurg: {
    issues: {
      generic: string;
      patientRatios: string;
      surgicalExperience: string;
    };
    features: {
      optimizer: string;
      validator: string;
      matcher: string;
      formatter: string;
    };
    beforeAfter: {
      before: string;
      after: string;
    };
  };
  softwareEngineer: {
    features: {
      techStack: string;
      faang: string;
      systemDesign: string;
    };
  };
  dataAnalyst: {
    features: {
      skills: string;
      metrics: string;
      techStack: string;
    };
  };
  finance: {
    features: {
      ibKeywords: string;
      format: string;
      metrics: string;
    };
  };
  about: {
    title: string;
    missionDriven: string;
    jobSeeker: string;
    innovation: string;
    privacy: string;
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

// Payment/Checkout
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

// Pages - PreviewScan
previewScan: {
  processError: string;
};

// Project Settings
projectSettings: {
  uploadSuccess: string;
};

// Footer
footer: {
  sections: {
    product: string;
    forNurses: string;
    forTech: string;
    resources: string;
    legal: string;
  };
  links: {
    scanner: string;
    preview: string;
    pricing: string;
    dashboard: string;
    nursing: string;
    icu: string;
    er: string;
    travel: string;
    software: string;
    frontend: string;
    backend: string;
    devops: string;
    blog: string;
    beatAts: string;
    robotView: string;
    contact: string;
  };
  legal: {
    privacy: string;
    terms: string;
  };
  copyright: string;
};

// Landing page additions
landing: {
  faq: {
    heading: string; // Replaces or supplements existing
    customQuestion1: string;
    customQuestion2: string;
  };
  images: {
    userAvatar: string;
  };
  about: {
    agile: string;
  };
  features: {
    errors: {
      formatting: string;
      keywords: string;
      linkedin: string;
      density: string;
    };
    projectTracking: {
      title: string;
      description: string;
    };
    keywordSniper: {
      title: string;
      description: string;
    };
    imageTrap: {
      title: string;
      description: string;
    };
  };
  enterprise: {
    teamManagement: {
      title: string;
      description: string;
    };
    soc2: {
      title: string;
      description: string;
    };
    api: {
      title: string;
      description: string;
    };
  };
  differentiation: {
    pricing: {
      title: string;
      description: string;
    };
    limitations: {
      title: string;
      description: string;
    };
    privacy: {
      title: string;
      description: string;
    };
    claims: {
      title: string;
      description: string;
    };
  };
};

// Common
common: {
  copiedToClipboard: string;
  deleteError: string;
  chatPlaceholder: string;
  images: {
    logo: string;
  };
};
```

---

## 8. RECOMMENDATIONS

1. **Phased Implementation**: Start with highest-impact sections:
   - Dashboard toasts and placeholders (users interact most)
   - Admin messages
   - Common/shared strings
   - Page titles and navigation

2. **Automation**: Create a script to extract remaining hardcoded strings automatically

3. **Testing**: Verify all languages render correctly, especially:
   - Long German text (tends to be longer)
   - RTL considerations (future expansion)
   - Placeholder truncation in forms

4. **Documentation**: Update component documentation to use i18n keys only

5. **Code Review**: Add linter rules to prevent new hardcoded strings

---

## Files Analyzed

**Landing Components** (8 files):
- ComparisonVisualSection.tsx
- DifferentiationSection.tsx
- EnterpriseSection.tsx
- FAQSection.tsx
- FeatureGridSection.tsx
- FeaturesSection.tsx
- Footer.tsx
- HeroSection.tsx

**Dashboard Components** (25+ files)
**Admin Components** (6 files)
**Page Components** (20+ files)
**Other Components** (6 files)

**Total Files Reviewed**: ~60+ files
**Total Hardcoded Strings Found**: ~250+
**Estimated i18n Keys Needed**: ~200+ new keys
