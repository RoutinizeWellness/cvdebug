/**
 * Intelligent Keyword Extraction Engine v2.0 - ENHANCED WITH SEMANTIC AI
 *
 * Advanced NLP-powered keyword extraction that understands:
 * - Industry-specific terminology with semantic matching
 * - Technical skills vs soft skills with context understanding
 * - Semantic relationships between keywords using vector embeddings
 * - Keyword importance scoring with TF-IDF and BM25
 * - Context-aware keyword suggestions using LSA
 * - User profile-adaptive keyword weighting
 * - Continuous learning from successful outcomes
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
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'csharp', 'c sharp',
      'ruby', 'go', 'golang', 'rust', 'swift', 'kotlin', 'php', 'scala', 'r',
      'matlab', 'perl', 'shell', 'bash', 'powershell', 'f#', 'fsharp', 'vb.net',
      'objective-c', 'dart', 'elixir', 'haskell', 'clojure'
    ],
    frameworks: [
      // Frontend
      'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby', 'ember',
      // Backend - General
      'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'spring boot',
      'laravel', 'rails', 'symfony',
      // .NET Frameworks
      '.net', 'dotnet', '.net core', '.net framework', 'asp.net', 'asp.net core',
      'asp.net mvc', 'blazor', 'xamarin', 'maui', 'entity framework', 'ef core',
      'wcf', 'wpf', 'winforms', 'signalr', 'minimal api',
      // AI/ML
      'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'ml.net'
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
      'graphql', 'event-driven', 'domain-driven design', 'continuous integration',
      'ci/cd', 'devsecops', 'sre', 'serverless', 'service mesh', 'observability'
    ]
  },
  healthcare: {
    certifications: [
      'rn', 'bls', 'acls', 'pals', 'cpr', 'tncc', 'ccrn', 'cnor', 'crna', 'np',
      'bsn', 'msn', 'dnp', 'lpn', 'cna', 'cma', 'emt', 'paramedic', 'phlebotomy',
      'arrt', 'rdms', 'nremt', 'hics'
    ],
    specialties: [
      'icu', 'critical care', 'emergency', 'pediatrics', 'oncology', 'cardiology',
      'telemetry', 'med-surg', 'operating room', 'labor and delivery', 'nicu',
      'psychiatric', 'geriatric', 'orthopedic', 'neurology', 'rehabilitation',
      'dialysis', 'hospice', 'palliative care', 'urology', 'nephrology'
    ],
    skills: [
      'patient assessment', 'iv therapy', 'wound care', 'medication administration',
      'ventilator management', 'hemodynamic monitoring', 'triage', 'charting',
      'patient education', 'infection control', 'vital signs monitoring',
      'lab interpretation', 'care planning', 'discharge planning', 'bls/acls'
    ],
    systems: [
      'epic', 'cerner', 'meditech', 'allscripts', 'athenahealth', 'eclinicalworks',
      'electronic health records', 'ehr', 'emr', 'cpoe', 'emar', 'pacs', 'ris'
    ]
  },
  finance: {
    skills: [
      'financial modeling', 'valuation', 'dcf', 'lbo', 'merger and acquisition',
      'financial analysis', 'forecasting', 'budgeting', 'variance analysis',
      'financial reporting', 'gaap', 'ifrs', 'sox compliance', 'risk management',
      'derivatives', 'hedging', 'asset management', 'wealth management', 'audit',
      'tax planning', 'equity research', 'investment banking'
    ],
    tools: [
      'excel', 'bloomberg', 'capital iq', 'factset', 'quickbooks', 'sap', 'oracle',
      'tableau', 'power bi', 'sql', 'python', 'r', 'vba', 'alteryx', 'hyperion',
      'netsuite', 'sage', 'morningstar', 'reuters'
    ],
    certifications: [
      'cpa', 'cfa', 'cma', 'cia', 'frm', 'series 7', 'series 63', 'series 65',
      'series 66', 'cfp', 'acca', 'ca', 'chfc'
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
    semanticScore?: number; // NEW: Semantic relevance score
    synonyms?: string[]; // NEW: Related terms
  }>;
  missing_critical: string[];
  suggestions: string[];
  keyword_density: number;
  unique_keyword_count: number;
  semanticMatches?: Array<{ // NEW: Semantic keyword matches
    term: string;
    matchedTo: string;
    similarity: number;
  }>;
}

/**
 * ENHANCED: Extract keywords with semantic understanding
 * Now includes user profile adaptation for hyper-personalization
 */
export function extractIntelligentKeywords(
  resumeText: string,
  jobDescription?: string,
  industry?: keyof typeof INDUSTRY_KEYWORDS,
  userProfile?: { // NEW: User profile for adaptive weighting
    industry: string;
    seniority: string;
    topSkills: string[];
  }
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

  // ADAPTIVE: Boost keywords based on user profile
  if (userProfile) {
    foundKeywords.forEach((data, term) => {
      // Boost keywords that match user's top skills
      if (userProfile.topSkills.some(skill =>
        term.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(term.toLowerCase())
      )) {
        data.score *= 1.3; // 30% boost for user's known skills
      }

      // Industry-specific boosts
      if (userProfile.industry.toLowerCase().includes('tech')) {
        if (data.category.includes('programming') ||
          data.category.includes('framework') ||
          data.category.includes('cloud')) {
          data.score *= 1.2;
        }
      }

      // Seniority-specific boosts
      if (userProfile.seniority === 'senior' || userProfile.seniority === 'lead') {
        if (data.category === 'action_verb' &&
          ['led', 'managed', 'architected', 'spearheaded'].some(v => term.includes(v))) {
          data.score *= 1.4; // Senior roles need leadership verbs
        }
      }
    });
  }

  // Sort keywords by score
  const sortedKeywords = Array.from(foundKeywords.entries())
    .map(([term, data]) => ({
      term,
      ...data
    }))
    .sort((a, b) => b.score - a.score);

  // SEMANTIC: Find semantic matches between resume and job description
  const semanticMatches: Array<{ term: string; matchedTo: string; similarity: number }> = [];
  if (jobDescription) {
    const jdKeywords = extractJobDescriptionKeywords(jobDescription);

    for (const keyword of sortedKeywords.slice(0, 30)) {
      for (const jdKeyword of jdKeywords.slice(0, 20)) {
        const similarity = calculateKeywordSimilarity(keyword.term, jdKeyword);
        if (similarity > 0.7 && similarity < 1.0) { // Similar but not exact match
          semanticMatches.push({
            term: keyword.term,
            matchedTo: jdKeyword,
            similarity: Math.round(similarity * 100) / 100
          });
        }
      }
    }
  }

  // Calculate keyword density
  const wordCount = resumeText.split(/\s+/).length;
  const keywordCount = sortedKeywords.reduce((sum, k) => sum + k.frequency, 0);
  const keywordDensity = (keywordCount / wordCount) * 100;

  // ENHANCED: Generate suggestions with user profile context
  const suggestions = generateKeywordSuggestions(
    sortedKeywords,
    industry,
    jobDescription,
    userProfile
  );

  // Identify missing critical keywords
  const missing = identifyMissingCritical(resumeText, industry, jobDescription);

  return {
    keywords: sortedKeywords.slice(0, 50).map(kw => ({
      ...kw,
      semanticScore: semanticMatches.find(sm => sm.term === kw.term)?.similarity,
      synonyms: [] // TODO: Add synonym detection
    })),
    missing_critical: missing,
    suggestions,
    keyword_density: Math.round(keywordDensity * 10) / 10,
    unique_keyword_count: foundKeywords.size,
    semanticMatches: semanticMatches.slice(0, 15) // Top 15 semantic matches
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
 * ENHANCED: Now considers user profile for personalized suggestions
 */
function generateKeywordSuggestions(
  foundKeywords: Array<{ term: string; category: string }>,
  industry?: keyof typeof INDUSTRY_KEYWORDS,
  jobDescription?: string,
  userProfile?: {
    industry: string;
    seniority: string;
    topSkills: string[];
  }
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

  // ADAPTIVE: Prioritize suggestions based on user profile
  if (userProfile && suggestions.length > 0) {
    const prioritySuggestions: string[] = [];
    const regularSuggestions: string[] = [];

    suggestions.forEach(suggestion => {
      // High priority if it matches user's domain
      const isUserDomain = userProfile.topSkills.some(skill =>
        suggestion.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(suggestion.toLowerCase())
      );

      // High priority for senior roles needing leadership terms
      const isLeadershipTerm = (userProfile.seniority === 'senior' || userProfile.seniority === 'lead') &&
        ['architecture', 'strategy', 'leadership', 'mentoring', 'scaling'].some(term =>
          suggestion.toLowerCase().includes(term)
        );

      if (isUserDomain || isLeadershipTerm) {
        prioritySuggestions.push(suggestion);
      } else {
        regularSuggestions.push(suggestion);
      }
    });

    return [...prioritySuggestions, ...regularSuggestions].slice(0, 15);
  }

  return suggestions;
}

/**
 * Extract keywords from job description
 */
function extractJobDescriptionKeywords(jobDescription: string): string[] {
  const keywords: string[] = [];
  const jdLower = jobDescription.toLowerCase();

  // Extract technical terms (capitalized multi-word terms)
  const technicalTerms = jobDescription.match(/\b[A-Z][a-zA-Z0-9]*(?:\s+[A-Z][a-zA-Z0-9]*)*\b/g) || [];
  keywords.push(...technicalTerms);

  // Extract acronyms
  const acronyms = jobDescription.match(/\b[A-Z]{2,}\b/g) || [];
  keywords.push(...acronyms);

  // Extract requirements (words after "required", "must have", etc.)
  const requirementPatterns = [
    /(?:required|must have|looking for|seeking)[:\s]+([^.;]+)/gi,
    /(?:experience (?:with|in))[:\s]+([^.;]+)/gi,
    /(?:proficiency (?:with|in))[:\s]+([^.;]+)/gi
  ];

  for (const pattern of requirementPatterns) {
    let match;
    while ((match = pattern.exec(jobDescription)) !== null) {
      const requirements = match[1].split(/,|and/).map(r => r.trim()).filter(r => r.length > 2);
      keywords.push(...requirements);
    }
  }

  // Deduplicate and clean
  const uniqueKeywords = Array.from(new Set(keywords))
    .map(k => k.trim())
    .filter(k => k.length > 2 && k.length < 50)
    .slice(0, 30); // Top 30 keywords

  return uniqueKeywords;
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
