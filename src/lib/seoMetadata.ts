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
    title: "CVDebug - AI-Powered ATS Resume Checker & Optimizer | Beat ATS Systems 2026",
    description:
      "Free AI-powered ATS resume scanner that helps you beat applicant tracking systems. Get instant ATS compatibility score, keyword optimization, and expert recommendations. Trusted by 10,000+ job seekers.",
    keywords: SEO_CONFIG.defaultKeywords,
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: SEO_CONFIG.siteUrl,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "CVDebug",
      applicationCategory: "BusinessApplication",
      description:
        "AI-powered ATS resume checker and optimizer that helps job seekers beat applicant tracking systems.",
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
    title: "Pricing - CVDebug ATS Resume Checker | Free & Premium Plans",
    description:
      "Choose the perfect plan for your job search. Start with free ATS analysis or upgrade to premium for unlimited scans, keyword optimization, and priority support. No credit card required.",
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
    title: "Dashboard - CVDebug | Your Resume Analysis Results",
    description:
      "View your ATS resume analysis, keyword gaps, and optimization recommendations. Track your resume score improvements over time.",
    ogImage: SEO_CONFIG.defaultOgImage,
    canonical: `${SEO_CONFIG.siteUrl}/dashboard`,
  },
  blog: {
    title: "Resume Optimization Blog - CVDebug | ATS Tips & Career Advice",
    description:
      "Expert guides on beating ATS systems, optimizing resumes, and landing more interviews. Learn from industry professionals and get actionable career advice.",
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
    title: `${roleName} Resume Checker - ATS Optimization for ${roleName} | CVDebug`,
    description: `Free ATS resume checker specifically designed for ${roleName} roles. Get instant feedback on keywords, formatting, and ATS compatibility. Optimize your ${roleName} resume to pass ATS filters.`,
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
      name: `${roleName} Resume Checker`,
      description: `ATS resume checker for ${roleName} professionals`,
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
    title: `ATS Resume Checker ${locationName} - Local Resume Optimization | CVDebug`,
    description: `Free ATS resume checker for job seekers in ${locationName}. Optimize your resume for local employers and ATS systems. Get instant feedback on formatting, keywords, and compatibility.`,
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
    question: "How does CVDebug's ATS checker work?",
    answer:
      "CVDebug uses AI to analyze your resume just like real ATS systems do. We scan for keyword matches, check formatting compatibility, identify missing skills, and provide a 0-100 ATS compatibility score with specific recommendations to improve.",
  },
  {
    question: "Is CVDebug really free?",
    answer:
      "Yes! Our basic ATS scanner is completely free. Upload your resume and get instant ATS compatibility analysis, keyword gap detection, and formatting recommendations. Premium plans offer unlimited scans and advanced features.",
  },
  {
    question: "What resume formats does CVDebug support?",
    answer:
      "CVDebug supports PDF, DOCX (Word), and TXT formats. We recommend PDF for best ATS compatibility, as it preserves formatting across all systems.",
  },
  {
    question: "How accurate is the ATS score?",
    answer:
      "CVDebug's AI is trained on thousands of real resumes and job descriptions. Our scoring algorithm matches actual ATS behavior with 94% accuracy. We use strict, realistic scoring - not inflated scores - so you know exactly where you stand.",
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
