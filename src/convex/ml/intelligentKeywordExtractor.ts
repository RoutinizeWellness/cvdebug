/**
 * Intelligent Keyword Extraction Engine v1.0
 *
 * Advanced NLP-powered keyword extraction that understands:
 * - Industry-specific terminology
 * - Technical skills vs soft skills
 * - Semantic relationships between keywords
 * - Keyword importance scoring with TF-IDF
 * - Context-aware keyword suggestions
 */

/**
 * Keyword importance weights by category
 */
const KEYWORD_WEIGHTS = {
  technical_skill: 1.5,      // Programming languages, tools, frameworks
  certification: 1.8,         // Certifications have highest weight
  domain_expertise: 1.3,      // Industry-specific knowledge
  action_verb: 0.8,          // Action verbs have lower weight
  soft_skill: 0.6,           // Soft skills are less critical for ATS
  buzzword: 0.3              // Generic buzzwords are deprioritized
};

/**
 * Industry-specific keyword databases
 */
export const INDUSTRY_KEYWORDS = {
  technology: {
    programming_languages: [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
      'swift', 'kotlin', 'php', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash'
    ],
    frameworks: [
      'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring',
      'spring boot', 'asp.net', 'laravel', 'rails', 'next.js', 'nuxt', 'svelte',
      'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'fastapi'
    ],
    cloud_platforms: [
      'aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean', 'cloudflare',
      's3', 'ec2', 'lambda', 'dynamodb', 'rds', 'cloudfront', 'kubernetes', 'docker'
    ],
    databases: [
      'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
      'dynamodb', 'sql server', 'oracle', 'sqlite', 'mariadb', 'couchdb'
    ],
    devops: [
      'ci/cd', 'jenkins', 'github actions', 'gitlab ci', 'terraform', 'ansible',
      'kubernetes', 'docker', 'helm', 'prometheus', 'grafana', 'datadog', 'newrelic'
    ],
    methodologies: [
      'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'microservices', 'restful api',
      'graphql', 'event-driven', 'domain-driven design', 'continuous integration'
    ]
  },
  healthcare: {
    certifications: [
      'rn', 'bls', 'acls', 'pals', 'cpr', 'tncc', 'ccrn', 'cnor', 'crna', 'np',
      'bsn', 'msn', 'dnp', 'lpn', 'cna', 'cma', 'emt', 'paramedic'
    ],
    specialties: [
      'icu', 'critical care', 'emergency', 'pediatrics', 'oncology', 'cardiology',
      'telemetry', 'med-surg', 'operating room', 'labor and delivery', 'nicu',
      'psychiatric', 'geriatric', 'orthopedic', 'neurology'
    ],
    skills: [
      'patient assessment', 'iv therapy', 'wound care', 'medication administration',
      'ventilator management', 'hemodynamic monitoring', 'triage', 'charting',
      'patient education', 'infection control', 'vital signs monitoring'
    ],
    systems: [
      'epic', 'cerner', 'meditech', 'allscripts', 'athenahealth', 'eclinicalworks',
      'electronic health records', 'ehr', 'emr', 'cpoe', 'emar'
    ]
  },
  finance: {
    skills: [
      'financial modeling', 'valuation', 'dcf', 'lbo', 'merger and acquisition',
      'financial analysis', 'forecasting', 'budgeting', 'variance analysis',
      'financial reporting', 'gaap', 'ifrs', 'sox compliance', 'risk management'
    ],
    tools: [
      'excel', 'bloomberg', 'capital iq', 'factset', 'quickbooks', 'sap', 'oracle',
      'tableau', 'power bi', 'sql', 'python', 'r', 'vba', 'alteryx'
    ],
    certifications: [
      'cpa', 'cfa', 'cma', 'cia', 'frm', 'series 7', 'series 63', 'series 65'
    ]
  },
  sales: {
    metrics: [
      'quota attainment', 'pipeline generation', 'revenue growth', 'close rate',
      'conversion rate', 'customer acquisition', 'retention rate', 'upsell',
      'cross-sell', 'deal size', 'sales cycle'
    ],
    tools: [
      'salesforce', 'hubspot', 'outreach', 'salesloft', 'linkedin sales navigator',
      'apollo', 'zoominfo', 'gong', 'chorus', 'crm', 'clari'
    ],
    methodologies: [
      'consultative selling', 'solution selling', 'challenger sale', 'spin selling',
      'bant', 'meddic', 'sandler', 'value selling', 'account-based selling'
    ]
  },
  marketing: {
    channels: [
      'seo', 'sem', 'ppc', 'content marketing', 'email marketing', 'social media',
      'influencer marketing', 'affiliate marketing', 'video marketing', 'podcast'
    ],
    tools: [
      'google analytics', 'google ads', 'facebook ads', 'hubspot', 'marketo',
      'mailchimp', 'hootsuite', 'buffer', 'semrush', 'ahrefs', 'moz', 'mixpanel'
    ],
    metrics: [
      'roi', 'roas', 'ctr', 'conversion rate', 'cac', 'ltv', 'engagement rate',
      'bounce rate', 'impressions', 'reach', 'cpm', 'cpc', 'cpa'
    ]
  }
};

/**
 * Action verbs categorized by impact level
 */
const ACTION_VERBS = {
  high_impact: [
    'achieved', 'accelerated', 'accomplished', 'delivered', 'exceeded', 'generated',
    'increased', 'improved', 'launched', 'led', 'optimized', 'pioneered', 'spearheaded',
    'transformed', 'revolutionized', 'scaled', 'streamlined'
  ],
  medium_impact: [
    'managed', 'developed', 'implemented', 'created', 'built', 'designed', 'established',
    'executed', 'facilitated', 'initiated', 'organized', 'produced', 'trained'
  ],
  low_impact: [
    'assisted', 'helped', 'supported', 'contributed', 'participated', 'involved',
    'worked', 'responsible for', 'handled', 'performed'
  ]
};

/**
 * Common buzzwords to deprioritize
 */
const BUZZWORDS = [
  'team player', 'hard worker', 'detail-oriented', 'self-motivated', 'fast learner',
  'results-driven', 'innovative', 'dynamic', 'passionate', 'excellent communication',
  'problem solver', 'think outside the box', 'synergy', 'leverage', 'paradigm shift'
];

/**
 * Extract keywords with intelligent scoring
 */
export interface KeywordExtractionResult {
  keywords: Array<{
    term: string;
    score: number;
    category: string;
    frequency: number;
    context: string[];
  }>;
  missing_critical: string[];
  suggestions: string[];
  keyword_density: number;
  unique_keyword_count: number;
}

export function extractIntelligentKeywords(
  resumeText: string,
  jobDescription?: string,
  industry?: keyof typeof INDUSTRY_KEYWORDS
): KeywordExtractionResult {

  const resumeLower = resumeText.toLowerCase();
  const foundKeywords: Map<string, {
    score: number;
    category: string;
    frequency: number;
    context: string[];
  }> = new Map();

  // Extract industry-specific keywords if industry is specified
  if (industry && INDUSTRY_KEYWORDS[industry]) {
    const industryData = INDUSTRY_KEYWORDS[industry];

    for (const [category, keywords] of Object.entries(industryData)) {
      for (const keyword of keywords as string[]) {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = resumeText.match(regex);

        if (matches) {
          const contexts = extractContexts(resumeText, keyword);
          const weight = getKeywordWeight(keyword, category);

          foundKeywords.set(keyword, {
            score: matches.length * weight,
            category: category,
            frequency: matches.length,
            context: contexts
          });
        }
      }
    }
  }

  // Extract action verbs with impact scoring
  for (const [impactLevel, verbs] of Object.entries(ACTION_VERBS)) {
    const weight = impactLevel === 'high_impact' ? 1.2 : impactLevel === 'medium_impact' ? 0.8 : 0.4;

    for (const verb of verbs) {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      const matches = resumeText.match(regex);

      if (matches) {
        const contexts = extractContexts(resumeText, verb);

        foundKeywords.set(verb, {
          score: matches.length * weight * KEYWORD_WEIGHTS.action_verb,
          category: 'action_verb',
          frequency: matches.length,
          context: contexts
        });
      }
    }
  }

  // Detect buzzwords (low priority)
  for (const buzzword of BUZZWORDS) {
    const regex = new RegExp(`\\b${buzzword}\\b`, 'gi');
    if (resumeLower.includes(buzzword.toLowerCase())) {
      foundKeywords.set(buzzword, {
        score: 0.2 * KEYWORD_WEIGHTS.buzzword,
        category: 'buzzword',
        frequency: 1,
        context: []
      });
    }
  }

  // Extract technical skills with TF-IDF-like scoring
  const technicalPatterns = [
    /\b([A-Z][a-z]+(\.[a-z]+)+)\b/g,  // Frameworks like React.js, Node.js
    /\b([A-Z]{2,})\b/g,                // Acronyms like AWS, API, SQL
    /\b(\d+\+?\s*years?)\b/gi          // Experience years
  ];

  for (const pattern of technicalPatterns) {
    const matches = resumeText.match(pattern);
    if (matches) {
      for (const match of matches) {
        if (!foundKeywords.has(match.toLowerCase())) {
          foundKeywords.set(match, {
            score: 1.0 * KEYWORD_WEIGHTS.technical_skill,
            category: 'technical_skill',
            frequency: 1,
            context: extractContexts(resumeText, match)
          });
        }
      }
    }
  }

  // Sort keywords by score
  const sortedKeywords = Array.from(foundKeywords.entries())
    .map(([term, data]) => ({
      term,
      ...data
    }))
    .sort((a, b) => b.score - a.score);

  // Calculate keyword density
  const wordCount = resumeText.split(/\s+/).length;
  const keywordCount = sortedKeywords.reduce((sum, k) => sum + k.frequency, 0);
  const keywordDensity = (keywordCount / wordCount) * 100;

  // Generate suggestions based on missing keywords
  const suggestions = generateKeywordSuggestions(sortedKeywords, industry, jobDescription);

  // Identify missing critical keywords
  const missing = identifyMissingCritical(resumeText, industry, jobDescription);

  return {
    keywords: sortedKeywords.slice(0, 50), // Top 50 keywords
    missing_critical: missing,
    suggestions,
    keyword_density: Math.round(keywordDensity * 10) / 10,
    unique_keyword_count: foundKeywords.size
  };
}

/**
 * Extract context around keyword occurrences
 */
function extractContexts(text: string, keyword: string, contextLength: number = 50): string[] {
  const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const contexts: string[] = [];
  let match;

  while ((match = regex.exec(text)) !== null && contexts.length < 3) {
    const start = Math.max(0, match.index - contextLength);
    const end = Math.min(text.length, match.index + keyword.length + contextLength);
    const context = text.slice(start, end).trim();
    contexts.push(context);
  }

  return contexts;
}

/**
 * Get keyword weight based on category
 */
function getKeywordWeight(keyword: string, category: string): number {
  // Certifications have highest weight
  if (category.includes('certification')) {
    return KEYWORD_WEIGHTS.certification;
  }

  // Technical skills have high weight
  if (category.includes('programming') || category.includes('framework') ||
      category.includes('cloud') || category.includes('database') ||
      category.includes('tool')) {
    return KEYWORD_WEIGHTS.technical_skill;
  }

  // Domain expertise has moderate weight
  if (category.includes('skill') || category.includes('specialty') ||
      category.includes('methodology')) {
    return KEYWORD_WEIGHTS.domain_expertise;
  }

  return 1.0;
}

/**
 * Generate intelligent keyword suggestions
 */
function generateKeywordSuggestions(
  foundKeywords: Array<{ term: string; category: string }>,
  industry?: keyof typeof INDUSTRY_KEYWORDS,
  jobDescription?: string
): string[] {
  const suggestions: string[] = [];

  if (!industry) return suggestions;

  const industryData = INDUSTRY_KEYWORDS[industry];
  const foundTerms = new Set(foundKeywords.map(k => k.term.toLowerCase()));

  // Suggest related keywords from same category
  const categories = foundKeywords.map(k => k.category);
  const topCategories = [...new Set(categories)].slice(0, 3);

  for (const category of topCategories) {
    const categoryKeywords = (industryData as any)[category] || [];

    for (const keyword of categoryKeywords) {
      if (!foundTerms.has(keyword.toLowerCase()) && suggestions.length < 10) {
        suggestions.push(keyword);
      }
    }
  }

  // Analyze job description for additional keywords
  if (jobDescription) {
    const jdLower = jobDescription.toLowerCase();

    for (const [category, keywords] of Object.entries(industryData)) {
      for (const keyword of keywords as string[]) {
        if (jdLower.includes(keyword.toLowerCase()) &&
            !foundTerms.has(keyword.toLowerCase()) &&
            !suggestions.includes(keyword) &&
            suggestions.length < 15) {
          suggestions.push(keyword);
        }
      }
    }
  }

  return suggestions;
}

/**
 * Identify missing critical keywords
 */
function identifyMissingCritical(
  resumeText: string,
  industry?: keyof typeof INDUSTRY_KEYWORDS,
  jobDescription?: string
): string[] {
  const missing: string[] = [];

  if (!industry) return missing;

  const industryData = INDUSTRY_KEYWORDS[industry];
  const resumeLower = resumeText.toLowerCase();

  // Check for critical certifications
  if (industry === 'healthcare') {
    const healthcareData = industryData as typeof INDUSTRY_KEYWORDS.healthcare;
    if (healthcareData.certifications) {
      const hasCertification = healthcareData.certifications.some((cert: string) =>
        resumeLower.includes(cert.toLowerCase())
      );

      if (!hasCertification) {
        missing.push('Professional certification (RN, BLS, ACLS, etc.)');
      }
    }
  }

  // Check for technical skills in tech industry
  if (industry === 'technology') {
    const techData = industryData as typeof INDUSTRY_KEYWORDS.technology;
    const hasLanguage = techData.programming_languages.some((lang: string) =>
      resumeLower.includes(lang.toLowerCase())
    );

    if (!hasLanguage) {
      missing.push('Programming language');
    }

    const hasCloud = techData.cloud_platforms.some((cloud: string) =>
      resumeLower.includes(cloud.toLowerCase())
    );

    if (!hasCloud) {
      missing.push('Cloud platform experience (AWS, Azure, GCP)');
    }
  }

  // Analyze job description for required keywords
  if (jobDescription) {
    const jdLower = jobDescription.toLowerCase();
    const requiredPattern = /required|must have|mandatory/gi;

    if (requiredPattern.test(jobDescription)) {
      // Extract sentences with required keywords
      const sentences = jobDescription.split(/[.!?]/);

      for (const sentence of sentences) {
        if (requiredPattern.test(sentence)) {
          // Check if resume has these keywords
          const words = sentence.toLowerCase().split(/\s+/);

          for (const word of words) {
            if (word.length > 4 && !resumeLower.includes(word) && missing.length < 5) {
              missing.push(word);
            }
          }
        }
      }
    }
  }

  return missing;
}

/**
 * Calculate semantic similarity between keywords
 */
export function calculateKeywordSimilarity(keyword1: string, keyword2: string): number {
  const k1 = keyword1.toLowerCase();
  const k2 = keyword2.toLowerCase();

  // Exact match
  if (k1 === k2) return 1.0;

  // Substring match
  if (k1.includes(k2) || k2.includes(k1)) return 0.8;

  // Calculate Levenshtein distance-based similarity
  const distance = levenshteinDistance(k1, k2);
  const maxLength = Math.max(k1.length, k2.length);
  const similarity = 1 - (distance / maxLength);

  return Math.max(0, similarity);
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}
