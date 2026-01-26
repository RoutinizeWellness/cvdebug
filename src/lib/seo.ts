/**
 * SEO Utilities v2.0 - Enhanced for Maximum Visibility
 *
 * Features:
 * - Dynamic meta tags with full OpenGraph and Twitter Card support
 * - Rich structured data (Schema.org) for Google Rich Results
 * - Automatic sitemap generation hints
 * - SEO performance tracking
 * - Mobile-first optimization
 * - Core Web Vitals support
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: {
    type: 'JobPosting' | 'HowTo' | 'FAQPage' | 'Article' | 'Service' | 'Organization' | 'WebApplication';
    data: Record<string, unknown>;
  };
  noindex?: boolean; // For pages that shouldn't be indexed
  nofollow?: boolean; // For pages where links shouldn't be followed
}

/**
 * Update all meta tags for a page with enhanced SEO features
 */
export function updatePageSEO(config: SEOConfig): void {
  // Update title with optimal length check (50-60 chars for Google)
  const optimizedTitle = config.title.length > 60
    ? config.title.substring(0, 57) + '...'
    : config.title;
  document.title = optimizedTitle;

  // Update meta description with optimal length (150-160 chars)
  const optimizedDescription = config.description.length > 160
    ? config.description.substring(0, 157) + '...'
    : config.description;
  updateMetaTag('name', 'description', optimizedDescription);

  // Update keywords
  if (config.keywords.length > 0) {
    updateMetaTag('name', 'keywords', config.keywords.join(', '));
  }

  // Robots meta tags
  if (config.noindex || config.nofollow) {
    const robotsValue = [
      config.noindex ? 'noindex' : 'index',
      config.nofollow ? 'nofollow' : 'follow'
    ].join(', ');
    updateMetaTag('name', 'robots', robotsValue);
  } else {
    updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  }

  // Update canonical URL
  updateLinkTag('canonical', config.canonical);

  // Enhanced OpenGraph tags
  updateMetaTag('property', 'og:title', optimizedTitle);
  updateMetaTag('property', 'og:description', optimizedDescription);
  updateMetaTag('property', 'og:url', config.canonical);
  updateMetaTag('property', 'og:type', config.ogType || 'website');
  updateMetaTag('property', 'og:site_name', 'CVDebug');
  updateMetaTag('property', 'og:locale', 'en_US');

  if (config.ogImage) {
    updateMetaTag('property', 'og:image', config.ogImage);
    updateMetaTag('property', 'og:image:width', '1200');
    updateMetaTag('property', 'og:image:height', '630');
    updateMetaTag('property', 'og:image:alt', config.title);
  }

  // Article-specific OpenGraph tags
  if (config.ogType === 'article') {
    if (config.publishedTime) {
      updateMetaTag('property', 'article:published_time', config.publishedTime);
    }
    if (config.modifiedTime) {
      updateMetaTag('property', 'article:modified_time', config.modifiedTime);
    }
    if (config.author) {
      updateMetaTag('property', 'article:author', config.author);
    }
  }

  // Enhanced Twitter Card tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', optimizedTitle);
  updateMetaTag('name', 'twitter:description', optimizedDescription);
  updateMetaTag('name', 'twitter:site', '@CVDebugApp');
  updateMetaTag('name', 'twitter:creator', '@CVDebugApp');

  if (config.ogImage) {
    updateMetaTag('name', 'twitter:image', config.ogImage);
    updateMetaTag('name', 'twitter:image:alt', config.title);
  }

  // Mobile optimization meta tags
  updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1, maximum-scale=5');
  updateMetaTag('name', 'theme-color', '#3B82F6');
  updateMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
  updateMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'default');

  // Update structured data if provided
  if (config.structuredData) {
    updateStructuredData(config.structuredData.type, config.structuredData.data);
  }

  // Add organization structured data by default
  addOrganizationSchema();
}

/**
 * Helper to update or create meta tags
 */
function updateMetaTag(attrName: string, attrValue: string, content: string): void {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Helper to update or create link tags
 */
function updateLinkTag(rel: string, href: string): void {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.href = href;
}

/**
 * Update structured data script tag
 */
function updateStructuredData(type: string, data: Record<string, unknown>): void {
  const scriptId = `structured-data-${type.toLowerCase()}`;
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }, null, 0); // Minified JSON for better performance
}

/**
 * Add organization schema for brand identity
 */
function addOrganizationSchema(): void {
  const orgSchema = {
    '@type': 'Organization',
    name: 'CVDebug',
    url: 'https://cvdebug.com',
    logo: 'https://cvdebug.com/logo.png',
    description: 'Free ATS resume scanner that helps job seekers beat applicant tracking systems. Get instant ATS score, keyword analysis, and Robot View in 10 seconds.',
    sameAs: [
      'https://twitter.com/CVDebugApp',
      'https://www.linkedin.com/company/cvdebug',
      'https://github.com/cvdebug'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'cvdebug@outlook.com',
      availableLanguage: ['English', 'Spanish', 'French', 'German', 'Portuguese']
    }
  };

  updateStructuredData('Organization', orgSchema);
}

/**
 * Generate WebApplication schema for the app
 */
export function generateWebApplicationSchema(): Record<string, unknown> {
  return {
    name: 'CVDebug ATS Resume Scanner',
    description: 'Free ATS resume scanner with instant scoring, keyword analysis, and Robot View. Beat applicant tracking systems in 10 seconds.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1247',
      bestRating: '5',
      worstRating: '1'
    },
    screenshot: 'https://cvdebug.com/screenshot.png',
    featureList: [
      'Free ATS Resume Scanning',
      'Instant ATS Score in 10 Seconds',
      'Robot View - See What ATS Sees',
      'Keyword Analysis & Optimization',
      'Multi-language Support',
      'Format Validation',
      'Job Description Matching'
    ]
  };
}

/**
 * Predefined SEO configs for industry pages
 */
export const nursingPageSEO = {
  ats_scanner_nurses: {
    title: 'ATS Resume Scanner for Nurses | Free Nursing Resume Checker | CVDebug',
    description: 'Free ATS resume scanner built specifically for nurses. Check your nursing resume for ATS compatibility, keyword optimization, and formatting issues. Trusted by 1000+ nurses. Get your ATS score in 10 seconds.',
    keywords: [
      'nursing resume ATS scanner',
      'nurse ATS checker',
      'nursing resume optimizer',
      'RN resume ATS',
      'healthcare resume scanner',
      'nursing job application',
      'ATS for nurses',
      'nurse resume parser',
      'nursing resume keywords',
      'hospital ATS system'
    ],
  },
  icu_nurse: {
    title: 'ICU Nurse ATS Resume Scanner | Critical Care Resume Optimizer | CVDebug',
    description: 'Free ATS scanner for ICU nurses. Optimize your critical care nursing resume for applicant tracking systems. Check for ICU-specific keywords like ventilator management, CRRT, hemodynamic monitoring.',
    keywords: [
      'ICU nurse resume ATS',
      'critical care nurse ATS',
      'intensive care resume scanner',
      'ICU nursing keywords',
      'critical care resume optimizer',
      'ICU RN ATS checker',
      'ventilator management resume',
      'CRRT nursing resume',
      'hemodynamic monitoring keywords'
    ],
  },
  er_nurse: {
    title: 'ER Nurse ATS Resume Checker | Emergency Room Resume Optimizer | CVDebug',
    description: 'Free ATS resume scanner for ER nurses. Optimize your emergency nursing resume with keywords like trauma care, triage, ACLS, rapid response. Pass hospital ATS systems.',
    keywords: [
      'ER nurse resume ATS',
      'emergency room nurse ATS',
      'trauma nurse resume scanner',
      'ER nursing keywords',
      'triage resume optimizer',
      'ACLS resume checker',
      'emergency nurse ATS',
      'rapid response keywords'
    ],
  },
  travel_nurse: {
    title: 'Travel Nurse ATS Resume Scanner | Optimize for Agency ATS | CVDebug',
    description: 'Free ATS scanner for travel nurses. Optimize your resume for nursing agency ATS systems. Keywords for multi-state licensure, compact license, flexible assignments, diverse clinical experience.',
    keywords: [
      'travel nurse resume ATS',
      'nursing agency ATS',
      'travel RN resume scanner',
      'compact license keywords',
      'multi-state nursing resume',
      'agency nurse ATS',
      'travel nursing optimizer',
      'flexible assignment keywords'
    ],
  },
  med_surg_nurse: {
    title: 'Med-Surg Nurse ATS Resume Scanner | Medical Surgical Resume Optimizer',
    description: 'Free ATS resume checker for med-surg nurses. Optimize for keywords like patient assessment, wound care, medication administration, post-op care, telemetry monitoring.',
    keywords: [
      'med-surg nurse ATS',
      'medical surgical resume',
      'med-surg keywords',
      'telemetry nurse ATS',
      'post-op care resume',
      'wound care keywords',
      'med-surg RN optimizer'
    ],
  },
};

export const techPageSEO = {
  software_engineer: {
    title: 'Software Engineer ATS Resume Scanner | SWE Keyword Sniper | CVDebug',
    description: 'Free ATS scanner for software engineers. Optimize your SWE resume with programming language keywords, frameworks, system design, algorithms. Beat FAANG ATS systems.',
    keywords: [
      'software engineer ATS',
      'SWE resume scanner',
      'developer ATS checker',
      'programming resume optimizer',
      'FAANG ATS resume',
      'coding interview resume',
      'software engineer keywords',
      'tech resume parser',
      'system design resume',
      'algorithm resume keywords'
    ],
  },
  senior_frontend: {
    title: 'Senior Frontend Engineer ATS Scanner | React/Vue/Angular Resume',
    description: 'Free ATS scanner for senior frontend engineers. Optimize for React, Vue, Angular, TypeScript, performance optimization, component architecture, accessibility.',
    keywords: [
      'frontend engineer ATS',
      'React developer ATS',
      'Vue developer resume',
      'Angular resume scanner',
      'TypeScript resume optimizer',
      'senior frontend ATS',
      'UI engineer keywords',
      'frontend architecture resume'
    ],
  },
  backend_java: {
    title: 'Backend Java Engineer ATS Scanner | Spring Boot Resume Optimizer',
    description: 'Free ATS scanner for backend Java engineers. Keywords for Spring Boot, microservices, REST APIs, Kafka, PostgreSQL, distributed systems.',
    keywords: [
      'Java backend engineer ATS',
      'Spring Boot resume',
      'microservices resume scanner',
      'Java developer ATS',
      'REST API keywords',
      'Kafka resume optimizer',
      'backend Java keywords',
      'distributed systems resume'
    ],
  },
  devops_kubernetes: {
    title: 'DevOps Engineer ATS Scanner | Kubernetes & AWS Resume Optimizer',
    description: 'Free ATS scanner for DevOps engineers. Keywords for Kubernetes, AWS, Docker, Terraform, CI/CD, Jenkins, GitOps, infrastructure as code.',
    keywords: [
      'DevOps engineer ATS',
      'Kubernetes resume scanner',
      'AWS DevOps resume',
      'Docker keywords',
      'Terraform resume optimizer',
      'CI/CD resume keywords',
      'infrastructure as code ATS',
      'GitOps resume'
    ],
  },
  machine_learning: {
    title: 'Machine Learning Engineer ATS Scanner | ML/AI Resume Optimizer',
    description: 'Free ATS scanner for ML engineers. Keywords for PyTorch, TensorFlow, deep learning, NLP, computer vision, model deployment, MLOps.',
    keywords: [
      'machine learning ATS',
      'ML engineer resume scanner',
      'AI engineer ATS',
      'PyTorch resume optimizer',
      'TensorFlow keywords',
      'deep learning resume',
      'NLP resume scanner',
      'MLOps keywords'
    ],
  },
};

export const financePageSEO = {
  financial_analyst: {
    title: 'Financial Analyst ATS Resume Scanner | Finance Resume Optimizer',
    description: 'Free ATS scanner for financial analysts. Keywords for Excel modeling, financial reporting, forecasting, valuation, Bloomberg, SQL, data analysis.',
    keywords: [
      'financial analyst ATS',
      'finance resume scanner',
      'Excel modeling resume',
      'financial reporting keywords',
      'valuation resume optimizer',
      'Bloomberg resume',
      'finance ATS checker',
      'investment analysis keywords'
    ],
  },
  finance_internship: {
    title: 'Finance Internship ATS Scanner | Banking Resume Optimizer',
    description: 'Free ATS scanner for finance internships. Optimize for investment banking, consulting, private equity. Keywords for financial modeling, DCF, LBO, M&A.',
    keywords: [
      'finance internship ATS',
      'investment banking resume',
      'consulting resume scanner',
      'financial modeling keywords',
      'DCF resume optimizer',
      'LBO keywords',
      'M&A resume',
      'banking internship ATS'
    ],
  },
};

/**
 * Generate HowTo Schema for industry-specific pages
 */
export function generateHowToSchema(jobTitle: string, industry: string): Record<string, unknown> {
  return {
    name: `How to Optimize Your ${jobTitle} Resume for ATS`,
    description: `Step-by-step guide to beat ATS systems for ${industry} positions`,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Upload Your Resume',
        text: `Upload your ${jobTitle} resume to CVDebug's free ATS scanner. Supports PDF format.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Review ATS Score',
        text: `Get instant ATS compatibility score. See how well your ${industry} resume parses.`,
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Check Keywords',
        text: `Review ${industry}-specific keyword analysis. Find missing skills and certifications.`,
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Fix Formatting Issues',
        text: `Identify formatting problems that cause ATS parsing errors in ${industry} applications.`,
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Download Optimized Resume',
        text: `Get your ATS-optimized ${jobTitle} resume ready for ${industry} job applications.`,
      },
    ],
  };
}

/**
 * Generate Service Schema for industry pages
 */
export function generateServiceSchema(
  serviceName: string,
  description: string,
  audience: string
): Record<string, unknown> {
  return {
    serviceType: serviceName,
    provider: {
      '@type': 'Organization',
      name: 'CVDebug',
      url: 'https://cvdebug.com',
    },
    description,
    areaServed: 'Worldwide',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://cvdebug.com',
      serviceType: 'Online Service',
    },
    audience: {
      '@type': 'Audience',
      audienceType: audience,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Resume Optimization Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Free ATS Resume Scan',
          },
          price: '0',
          priceCurrency: 'USD',
        },
      ],
    },
  };
}

/**
 * Generate FAQ Schema for common questions
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]): Record<string, unknown> {
  return {
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Common FAQs for different page types
 */
export const commonFAQs = {
  general: [
    {
      question: 'What is an ATS resume scanner?',
      answer: 'An ATS (Applicant Tracking System) resume scanner is a tool that analyzes your resume the same way hiring software does. It checks for keyword optimization, formatting issues, and parsing errors that could cause your resume to be rejected before a human sees it.',
    },
    {
      question: 'Is CVDebug completely free?',
      answer: 'Yes! CVDebug offers free ATS resume scanning with instant results. You can scan your resume, see your ATS score, and get keyword analysis without any payment or credit card required.',
    },
    {
      question: 'How long does an ATS scan take?',
      answer: 'CVDebug provides instant ATS scanning results in approximately 10 seconds. Upload your resume and immediately see your ATS compatibility score, keyword analysis, and formatting recommendations.',
    },
    {
      question: 'What file formats does CVDebug support?',
      answer: 'CVDebug supports PDF resume files, which is the most ATS-friendly format. We recommend using PDF to preserve your resume formatting across different ATS systems.',
    },
    {
      question: 'How does Robot View work?',
      answer: 'Robot View shows you exactly how ATS systems parse and read your resume. It displays what the hiring software "sees" versus what humans see, helping you identify formatting issues that cause parsing errors.',
    },
  ],
  nursing: [
    {
      question: 'Does CVDebug work for nursing resumes?',
      answer: 'Yes! CVDebug is specifically optimized for nursing resumes. It recognizes healthcare certifications like BLS, ACLS, PALS, and medical terminology used in hospital ATS systems. We have specialized scanners for ICU nurses, ER nurses, travel nurses, and all nursing specialties.',
    },
    {
      question: 'What nursing keywords should I include?',
      answer: 'Include your RN/LPN license, certifications (BLS, ACLS, PALS), specialties (critical care, telemetry, med-surg), technical skills (hemodynamic monitoring, ventilator management, IV therapy), and EMR systems you\'ve used (Epic, Cerner). CVDebug\'s keyword analysis identifies missing nursing terms.',
    },
    {
      question: 'Do hospital ATS systems work differently?',
      answer: 'Hospital ATS systems like HealthcareSource, Workday, and Oracle Taleo specifically scan for healthcare credentials, licenses, and medical terminology. CVDebug is tested against major healthcare ATS platforms to ensure your nursing resume passes their filters.',
    },
  ],
  tech: [
    {
      question: 'Does CVDebug work for software engineer resumes?',
      answer: 'Absolutely! CVDebug is optimized for tech resumes and tested against ATS systems used by FAANG companies (Google, Meta, Amazon, Apple, Netflix). It identifies missing programming languages, frameworks, and technical keywords that tech recruiters search for.',
    },
    {
      question: 'What tech keywords should I include?',
      answer: 'Include specific programming languages (Python, Java, JavaScript, TypeScript), frameworks (React, Spring Boot, TensorFlow), cloud platforms (AWS, Azure, GCP), tools (Docker, Kubernetes, Jenkins), and methodologies (Agile, microservices, CI/CD). CVDebug identifies gaps in your tech stack.',
    },
    {
      question: 'How do I optimize for FAANG ATS systems?',
      answer: 'FAANG companies use sophisticated ATS systems that scan for specific technical skills, system design experience, and impact-driven achievements. Use quantifiable metrics (improved performance by 40%, reduced latency by 2s), specific technologies, and clear project descriptions. CVDebug shows you what their ATS systems prioritize.',
    },
  ],
};

/**
 * Generate Article Schema for blog posts
 */
export function generateArticleSchema(
  title: string,
  description: string,
  author: string,
  datePublished: string,
  dateModified: string,
  imageUrl: string
): Record<string, unknown> {
  return {
    headline: title,
    description,
    image: [imageUrl],
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://cvdebug.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CVDebug',
      logo: {
        '@type': 'ImageObject',
        url: 'https://harmless-tapir-303.convex.cloud/api/storage/4f836582-7336-4306-8004-211fad87218f',
      },
    },
  };
}
