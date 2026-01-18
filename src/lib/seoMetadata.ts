/**
 * SEO Metadata Configuration
 *
 * Centralized metadata for consistent SEO across the application
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  structuredData?: any;
}

export const SEO_CONFIG = {
  siteName: "CVDebug",
  siteUrl: "https://cvdebug.com",
  defaultOgImage: "https://cvdebug.com/og-image.png",
  twitterHandle: "@cvdebug",
  defaultKeywords: [
    "ATS resume checker",
    "resume scanner",
    "ATS optimization",
    "resume keywords",
    "applicant tracking system",
    "resume analyzer",
    "CV checker",
    "job application",
    "resume score",
    "ATS friendly resume",
    "resume parser",
    "free resume checker",
  ],
};

export const PAGE_METADATA: Record<string, PageMetadata> = {
  home: {
    title: "CVDebug - CV Debugger | Debug Resume Bugs & Stop Getting Ghosted 2026",
    description:
      "Free CV Debugger with ML algorithms - Find invisible resume bugs that cost you interviews. Get [ERROR] labels, technical X-Ray view, Seniority Match analysis. Debug your CV in 10 seconds. Trusted by 10,000+ job seekers at FAANG.",
    keywords: SEO_CONFIG.defaultKeywords,
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: SEO_CONFIG.siteUrl,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "CVDebug - CV Debugger",
      applicationCategory: "BusinessApplication",
      description:
        "CV Debugger with ML algorithms - Find invisible resume bugs, get technical [ERROR] labels, and see Robot X-Ray view. Debug your CV and stop getting ghosted.",
      url: SEO_CONFIG.siteUrl,
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "10234",
        bestRating: "5",
        worstRating: "1",
      },
    },
  },
  pricing: {
    title: "Pricing - CVDebug CV Debugger | 24-Hour Pass & 7-Day Sprint Plans",
    description:
      "Choose your debug plan: FREE scan, 24-hour Iteration Pass (14.99€), or 7-Day Sprint (RECOMMENDED). Unlimited CV debugging, [ERROR] fixes, Robot View access. No credit card for free tier.",
    keywords: [
      ...SEO_CONFIG.defaultKeywords,
      "resume checker pricing",
      "ATS scanner cost",
      "free resume analysis",
    ],
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: `${SEO_CONFIG.siteUrl}/pricing`,
  },
  dashboard: {
    title: "Mission Control - CVDebug | Debug Your Resume Bugs",
    description:
      "Mission Control dashboard - View [ERROR] tags, Seniority Match analysis, keyword gaps, and Robot X-Ray view. Track bug fixes and score improvements over time.",
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: `${SEO_CONFIG.siteUrl}/dashboard`,
  },
  blog: {
    title: "CV Debugging Blog - CVDebug | Fix Resume Bugs & Stop Getting Ghosted",
    description:
      "Expert guides on debugging CV bugs, fixing [ERROR] tags, passing ATS robots, and landing more interviews. Learn technical resume optimization from ML analysis experts.",
    keywords: [
      ...SEO_CONFIG.defaultKeywords,
      "resume tips",
      "ATS guide",
      "career advice",
      "job search tips",
      "resume writing",
    ],
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: `${SEO_CONFIG.siteUrl}/blog`,
  },
};

/**
 * Generate role-specific landing page metadata
 */
export function getRoleMetadata(role: string): PageMetadata {
  const roleName = role
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${roleName} CV Debugger - Debug Resume Bugs for ${roleName} | CVDebug`,
    description: `Free CV Debugger for ${roleName} roles. Debug invisible bugs, get [ERROR] labels, and see Robot X-Ray view. Find why your ${roleName} resume gets ghosted and fix ATS compatibility issues in 10 seconds.`,
    keywords: [
      `${role} resume`,
      `${role} ATS checker`,
      `${role} resume optimization`,
      `${role} job application`,
      ...SEO_CONFIG.defaultKeywords,
    ],
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: `${SEO_CONFIG.siteUrl}/resume-checker/${role}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${roleName} CV Debugger`,
      description: `CV Debugger for ${roleName} professionals - Find resume bugs and ATS errors`,
      url: `${SEO_CONFIG.siteUrl}/resume-checker/${role}`,
    },
  };
}

/**
 * Generate location-specific landing page metadata
 */
export function getLocationMetadata(location: string): PageMetadata {
  const locationName = location
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `CV Debugger ${locationName} - Debug Resume Bugs for Local Jobs | CVDebug`,
    description: `Free CV Debugger for ${locationName} job seekers. Debug invisible resume bugs, get [ERROR] labels, and optimize for local employers' ATS systems. Stop getting ghosted - fix your CV in 10 seconds.`,
    keywords: [
      `${location} resume`,
      `${location} ATS checker`,
      `${location} job search`,
      `${location} resume optimization`,
      ...SEO_CONFIG.defaultKeywords,
    ],
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: `${SEO_CONFIG.siteUrl}/ats-resume-checker/${location}`,
  };
}

/**
 * Generate blog post metadata
 */
export function getBlogPostMetadata(
  title: string,
  excerpt: string,
  slug: string,
  tags: string[]
): PageMetadata {
  return {
    title: `${title} | CVDebug Blog`,
    description: excerpt,
    keywords: [...tags, ...SEO_CONFIG.defaultKeywords.slice(0, 5)],
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: `${SEO_CONFIG.siteUrl}/blog/${slug}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: excerpt,
      url: `${SEO_CONFIG.siteUrl}/blog/${slug}`,
      author: {
        "@type": "Organization",
        name: "CVDebug",
      },
      publisher: {
        "@type": "Organization",
        name: "CVDebug",
        logo: {
          "@type": "ImageObject",
          url: `${SEO_CONFIG.siteUrl}/logo.png`,
        },
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    },
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Common FAQs for homepage
 */
export const HOMEPAGE_FAQS = [
  {
    question: "What is an ATS and why do I need to optimize my resume for it?",
    answer:
      "An ATS (Applicant Tracking System) is software that 90% of companies use to automatically filter resumes. It scans for keywords, formatting, and relevance before a human ever sees your resume. Without ATS optimization, your resume may never reach a recruiter, even if you're qualified.",
  },
  {
    question: "How does CVDebug's CV Debugger work?",
    answer:
      "CVDebug uses ML algorithms to debug your resume just like ATS robots parse it. We find invisible bugs, add technical [ERROR] and [WARN] labels, show Robot X-Ray view, detect Seniority Match issues, and provide a 0-100 compatibility score with specific bug fixes to implement.",
  },
  {
    question: "Is CVDebug really free?",
    answer:
      "Yes! Our CV Debugger is completely free for basic scans. Upload your resume and get instant [ERROR] labels, keyword gap detection, and ATS compatibility analysis. Register for FREE to unlock Robot X-Ray View and Seniority Match analysis. Premium plans (24-hour Pass or 7-Day Sprint) offer unlimited debugging and priority fixes.",
  },
  {
    question: "What resume formats does CVDebug support?",
    answer:
      "CVDebug supports PDF, DOCX (Word), and TXT formats. We recommend PDF for best ATS compatibility, as it preserves formatting across all systems.",
  },
  {
    question: "How accurate is the ATS score?",
    answer:
      "CVDebug's ML algorithms are trained on thousands of real resumes and ATS parsing patterns. Our scoring is EXTREMELY strict and realistic (inspired by Jobscan) - most resumes score 45-75 to show room for improvement. We use penalties for missing elements and low caps for free users (78 max) to give you honest feedback, not inflated scores.",
  },
  {
    question: "Can CVDebug help with specific roles like SDR, Software Engineer, or Data Scientist?",
    answer:
      "Yes! CVDebug has specialized ML models for different roles including Sales (SDR/BDR), Software Engineering, Data Science, Product Management, and Marketing. Our system applies role-specific scoring criteria and provides tailored recommendations.",
  },
  {
    question: "How long does it take to get my resume analysis?",
    answer:
      "Instant! Upload your resume and you'll get your ATS compatibility score and analysis within seconds. Our AI processes your resume in real-time.",
  },
  {
    question: "Will my resume data be kept private?",
    answer:
      "Absolutely. We take privacy seriously. Your resume is encrypted, never shared with third parties, and you can delete it anytime from your dashboard. We're GDPR and CCPA compliant.",
  },
];
