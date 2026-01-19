#!/usr/bin/env python3
"""
Script to update i18n translations for CVDebug
Updates landing, onboarding, pricingPage, and modals sections for all 10 locales
"""

import re
import sys

def find_section(content, locale_name, section_name):
    """Find a specific section within a locale"""
    # First find the locale
    locale_pattern = rf"'{locale_name}':\s*\{{"
    locale_match = re.search(locale_pattern, content)

    if not locale_match:
        print(f"ERROR: Could not find locale '{locale_name}'")
        return None, None

    locale_start = locale_match.end() - 1  # Position of opening brace

    # Find the next locale or end of translations object
    next_locale_pattern = r"'\w{2}-\w{2}':\s*\{|^\};\s*$"
    next_match = re.search(next_locale_pattern, content[locale_match.end():], re.MULTILINE)

    if next_match:
        locale_end = locale_match.end() + next_match.start()
    else:
        locale_end = len(content)

    locale_content = content[locale_start:locale_end]

    # Find the section within the locale content
    section_pattern = rf"(\s+){section_name}:\s*\{{"
    section_match = re.search(section_pattern, locale_content)

    if not section_match:
        print(f"ERROR: Could not find section '{section_name}' in locale '{locale_name}'")
        return None, None

    section_start_rel = section_match.start()
    section_start_abs = locale_start + section_start_rel

    # Count braces to find section end
    i = section_match.end() - 1  # Start at opening brace
    brace_count = 1
    in_string = False
    string_char = None
    escaped = False

    while i < len(locale_content) and brace_count > 0:
        i += 1
        if i >= len(locale_content):
            break

        char = locale_content[i]

        if escaped:
            escaped = False
            continue

        if char == '\\\\':
            escaped = True
            continue

        if char in ('"', "'", '`') and not in_string:
            in_string = True
            string_char = char
        elif char == string_char and in_string:
            in_string = False
            string_char = None
        elif not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1

    # Find comma after closing brace
    while i < len(locale_content) and locale_content[i] in (' ', '\\n', '\\t'):
        i += 1
    if i < len(locale_content) and locale_content[i] == ',':
        i += 1

    section_end_abs = locale_start + i

    return section_start_abs, section_end_abs

def replace_section(content, locale_name, section_name, new_content):
    """Replace a section in the content"""
    start, end = find_section(content, locale_name, section_name)

    if start is None or end is None:
        print(f"Skipping {locale_name}.{section_name}")
        return content

    new_full_content = content[:start] + new_content + content[end:]
    print(f"✓ Updated {locale_name}.{section_name}")
    return new_full_content

# Read the file
print("Reading src/lib/i18n.ts...")
try:
    with open('src/lib/i18n.ts', 'r', encoding='utf-8') as f:
        content = f.read()
except FileNotFoundError:
    print("ERROR: File src/lib/i18n.ts not found!")
    sys.exit(1)

print(f"File size: {len(content)} characters\\n")

# EN-US translations
print("Updating en-US translations...")

en_us_landing = """    landing: {
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
    },"""

en_us_onboarding = """    onboarding: {
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
    },"""

en_us_pricing = """    pricingPage: {
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
    },"""

en_us_modals = """    modals: {
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
    },"""

# Update en-US
content = replace_section(content, 'en-US', 'landing', en_us_landing)
content = replace_section(content, 'en-US', 'onboarding', en_us_onboarding)
content = replace_section(content, 'en-US', 'pricingPage', en_us_pricing)
content = replace_section(content, 'en-US', 'modals', en_us_modals)

print("\\n✅ All en-US translations updated successfully!")
print("\\nTo see what was updated, run: git diff src/lib/i18n.ts")
print("\\nSaving changes...")

# Write back to file
with open('src/lib/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ File saved successfully!")
print("\\nNext: Update remaining locales (en-GB, es-ES, fr-FR, de-DE, pt-BR, en-IN, en-CA, en-AU, es-MX)")
