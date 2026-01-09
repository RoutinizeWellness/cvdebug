/**
 * Programmatic SEO Strategy for CVDebug
 * This file defines the SEO strategy, internal linking, and sitemap generation
 */

export interface SEOPage {
  url: string;
  title: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
  category: string;
  relatedPages: string[]; // URLs for internal linking
  keywords: string[]; // Primary SEO keywords
}

export const seoPages: Record<string, SEOPage> = {
  // Core pages
  home: {
    url: "/",
    title: "Free ATS Resume Scanner & Robot View | CVDebug",
    priority: 1.0,
    changefreq: "weekly",
    category: "core",
    relatedPages: [
      "/ats-scanner-for-nurses",
      "/senior-frontend-engineer-ats",
      "/devops-engineer-kubernetes-ats"
    ],
    keywords: ["ATS resume scanner", "resume parser", "robot view", "applicant tracking system"]
  },

  // Nursing niche pages
  nursesGeneral: {
    url: "/ats-scanner-for-nurses",
    title: "Free ATS Resume Scanner for Nurses | CVDebug",
    priority: 0.9,
    changefreq: "weekly",
    category: "nursing",
    relatedPages: [
      "/med-surg-nurse-ats-optimizer",
      "/icu-nurse-ats-optimizer",
      "/er-nurse-ats-optimizer",
      "/travel-nurse-ats-optimizer"
    ],
    keywords: ["nursing resume ATS", "RN resume scanner", "nurse ATS optimizer", "healthcare resume"]
  },

  medSurgNurse: {
    url: "/med-surg-nurse-ats-optimizer",
    title: "Free ATS Resume Scanner for Med-Surg Nurses | CVDebug",
    priority: 0.8,
    changefreq: "monthly",
    category: "nursing",
    relatedPages: [
      "/ats-scanner-for-nurses",
      "/icu-nurse-ats-optimizer",
      "/er-nurse-ats-optimizer"
    ],
    keywords: ["med-surg nurse resume", "medical surgical nursing ATS", "post-operative care resume", "surgical nurse keywords"]
  },

  icuNurse: {
    url: "/icu-nurse-ats-optimizer",
    title: "Free ATS Resume Scanner for ICU Nurses | CVDebug",
    priority: 0.8,
    changefreq: "monthly",
    category: "nursing",
    relatedPages: [
      "/ats-scanner-for-nurses",
      "/med-surg-nurse-ats-optimizer",
      "/er-nurse-ats-optimizer"
    ],
    keywords: ["ICU nurse resume", "critical care nursing ATS", "CVICU resume", "hemodynamic monitoring keywords"]
  },

  erNurse: {
    url: "/er-nurse-ats-optimizer",
    title: "Free ATS Resume Scanner for ER Nurses | CVDebug",
    priority: 0.8,
    changefreq: "monthly",
    category: "nursing",
    relatedPages: [
      "/ats-scanner-for-nurses",
      "/icu-nurse-ats-optimizer",
      "/travel-nurse-ats-optimizer"
    ],
    keywords: ["ER nurse resume", "emergency department ATS", "trauma nursing keywords", "ESI triage resume"]
  },

  travelNurse: {
    url: "/travel-nurse-ats-optimizer",
    title: "Free ATS Resume Scanner for Travel Nurses | CVDebug",
    priority: 0.8,
    changefreq: "monthly",
    category: "nursing",
    relatedPages: [
      "/ats-scanner-for-nurses",
      "/icu-nurse-ats-optimizer",
      "/er-nurse-ats-optimizer"
    ],
    keywords: ["travel nurse resume", "compact nursing license", "healthcare staffing ATS", "13-week assignment resume"]
  },

  // Tech niche pages
  seniorFrontend: {
    url: "/senior-frontend-engineer-ats",
    title: "ATS Resume Scanner for Senior Frontend Engineers | CVDebug",
    priority: 0.8,
    changefreq: "monthly",
    category: "tech",
    relatedPages: [
      "/devops-engineer-kubernetes-ats",
      "/software-engineer-keyword-sniper",
      "/optimize/google-sde"
    ],
    keywords: ["senior frontend resume", "React engineer ATS", "frontend architecture keywords", "Core Web Vitals resume"]
  },

  devopsKubernetes: {
    url: "/devops-engineer-kubernetes-ats",
    title: "ATS Resume Scanner for DevOps/Kubernetes Engineers | CVDebug",
    priority: 0.8,
    changefreq: "monthly",
    category: "tech",
    relatedPages: [
      "/senior-frontend-engineer-ats",
      "/software-engineer-keyword-sniper"
    ],
    keywords: ["DevOps resume ATS", "Kubernetes engineer resume", "cloud infrastructure keywords", "SRE resume scanner"]
  },

  // Other niches
  dataAnalysts: {
    url: "/resume-debug-for-data-analysts",
    title: "Free Resume Debug for Data Analysts | CVDebug",
    priority: 0.7,
    changefreq: "monthly",
    category: "tech",
    relatedPages: [
      "/senior-frontend-engineer-ats",
      "/devops-engineer-kubernetes-ats"
    ],
    keywords: ["data analyst resume", "SQL keywords", "Python data science ATS", "analytics resume scanner"]
  },

  financeInternship: {
    url: "/finance-internship-ats-optimizer",
    title: "Finance Internship ATS Optimizer | CVDebug",
    priority: 0.7,
    changefreq: "monthly",
    category: "finance",
    relatedPages: [
      "/resume-debug-for-data-analysts"
    ],
    keywords: ["finance internship resume", "investment banking ATS", "financial modeling keywords", "internship resume optimizer"]
  }
};

/**
 * Generate XML sitemap
 */
export const generateSitemap = (): string => {
  const baseUrl = "https://cvdebug.com";
  const today = new Date().toISOString().split('T')[0];

  const urls = Object.values(seoPages).map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

/**
 * Internal linking strategy - get related pages for a given URL
 */
export const getRelatedPages = (currentUrl: string): SEOPage[] => {
  const currentPage = Object.values(seoPages).find(page => page.url === currentUrl);
  if (!currentPage) return [];

  return currentPage.relatedPages
    .map(url => Object.values(seoPages).find(page => page.url === url))
    .filter(Boolean) as SEOPage[];
};

/**
 * Get all pages by category
 */
export const getPagesByCategory = (category: string): SEOPage[] => {
  return Object.values(seoPages).filter(page => page.category === category);
};

/**
 * SEO Content Strategy
 */
export const contentStrategy = {
  // Target keywords per vertical
  nursing: [
    "nursing resume ATS scanner",
    "RN resume optimizer",
    "nurse ATS score",
    "hospital ATS system",
    "nursing resume keywords",
    "HIPAA compliant resume scanner",
    "nursing certifications ATS",
    "patient ratio resume"
  ],

  tech: [
    "software engineer ATS",
    "tech resume scanner",
    "FAANG resume optimizer",
    "engineering keywords ATS",
    "developer resume parser",
    "technical skills ATS",
    "coding resume scanner",
    "tech interview resume"
  ],

  // Long-tail keyword opportunities
  longTail: {
    nursing: [
      "why is my nursing resume getting rejected",
      "how to optimize RN resume for ATS",
      "ICU nurse resume keywords list",
      "travel nurse compact license resume",
      "med-surg patient ratio resume format",
      "ER nurse ESI triage keywords",
      "ACLS BLS PALS resume placement",
      "hemodynamic monitoring resume wording"
    ],
    tech: [
      "senior frontend engineer resume keywords",
      "kubernetes resume ATS optimization",
      "how to show architecture experience resume",
      "Core Web Vitals resume metrics",
      "DevOps cost optimization resume",
      "micro-frontend architecture keywords",
      "cloud infrastructure resume scanner",
      "SRE resume ATS requirements"
    ]
  },

  // Content creation opportunities
  blogTopics: [
    "Complete Guide: ATS Resume Keywords for ICU Nurses in 2026",
    "Why 73% of Nursing Resumes Fail ATS (And How to Fix Yours)",
    "Med-Surg Nurse Resume Template: ATS-Optimized [2026]",
    "Travel Nurse Resume: How to Format Multi-State Licenses for ATS",
    "Senior Frontend Engineer Resume: Architecture Keywords That Matter",
    "DevOps Resume Metrics: Cost Optimization Numbers ATS Systems Love",
    "ER Nurse Resume: ESI Triage Keywords for Hospital ATS Systems",
    "The Robot View: What Healthcare ATS Systems Actually See"
  ],

  // External linking opportunities (partnerships)
  partnerships: [
    "Nurse.com - nursing education",
    "AllNurses.com - nursing community",
    "TravelNursing.org - travel nurse resources",
    "Aya Healthcare Blog - staffing agency",
    "Dev.to - developer community",
    "HashiCorp Blog - DevOps resources",
    "CNCF - Kubernetes community",
    "React.dev - frontend resources"
  ]
};

/**
 * Page expansion roadmap - future niche pages to build
 */
export const expansionRoadmap = {
  nursing: [
    { slug: "pediatric-nurse-ats-optimizer", priority: "high" },
    { slug: "psychiatric-nurse-resume-scanner", priority: "high" },
    { slug: "oncology-nurse-ats-optimizer", priority: "medium" },
    { slug: "nicu-nurse-resume-scanner", priority: "medium" },
    { slug: "operating-room-nurse-ats", priority: "medium" },
    { slug: "nurse-practitioner-ats-optimizer", priority: "high" },
    { slug: "labor-delivery-nurse-resume", priority: "low" },
    { slug: "geriatric-nurse-ats-scanner", priority: "low" }
  ],

  tech: [
    { slug: "backend-engineer-java-ats", priority: "high" },
    { slug: "full-stack-engineer-ats-optimizer", priority: "high" },
    { slug: "mobile-engineer-ios-android-ats", priority: "medium" },
    { slug: "machine-learning-engineer-ats", priority: "high" },
    { slug: "data-engineer-spark-ats", priority: "medium" },
    { slug: "security-engineer-ats-optimizer", priority: "medium" },
    { slug: "product-manager-tech-ats", priority: "high" },
    { slug: "technical-writer-ats-scanner", priority: "low" }
  ],

  other: [
    { slug: "sales-development-rep-ats", priority: "high" },
    { slug: "marketing-manager-ats-optimizer", priority: "medium" },
    { slug: "accountant-cpa-resume-scanner", priority: "medium" },
    { slug: "teacher-k12-ats-optimizer", priority: "medium" },
    { slug: "physical-therapist-ats-scanner", priority: "low" },
    { slug: "pharmacist-ats-optimizer", priority: "low" }
  ]
};

/**
 * Get next pages to build based on priority
 */
export const getNextPagesToBuild = (limit: number = 5): Array<{ slug: string; priority: string; category: string }> => {
  const allPages = [
    ...expansionRoadmap.nursing.map(p => ({ ...p, category: 'nursing' })),
    ...expansionRoadmap.tech.map(p => ({ ...p, category: 'tech' })),
    ...expansionRoadmap.other.map(p => ({ ...p, category: 'other' }))
  ];

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  return allPages
    .sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder])
    .slice(0, limit);
};
