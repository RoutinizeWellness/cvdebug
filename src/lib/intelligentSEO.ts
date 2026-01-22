/**
 * Intelligent SEO Content Generator v1.0
 *
 * AI-powered SEO optimization that:
 * - Generates dynamic meta descriptions based on user intent
 * - Creates contextual title tags with keyword optimization
 * - Suggests related keywords for better ranking
 * - Generates schema markup automatically
 * - Optimizes content for featured snippets
 */

/**
 * User intent patterns for search queries
 */
const SEARCH_INTENT_PATTERNS = {
  informational: [
    /^what\s+is/i,
    /^how\s+to/i,
    /^why\s+/i,
    /^when\s+/i,
    /guide/i,
    /tutorial/i,
    /learn/i
  ],
  transactional: [
    /buy/i,
    /purchase/i,
    /price/i,
    /cost/i,
    /deal/i,
    /discount/i,
    /free/i
  ],
  navigational: [
    /login/i,
    /sign\s+in/i,
    /download/i,
    /app/i,
    /website/i
  ],
  commercial: [
    /best/i,
    /top/i,
    /review/i,
    /comparison/i,
    /vs/i,
    /alternative/i
  ]
};

/**
 * LSI (Latent Semantic Indexing) keywords for ATS/Resume niche
 */
const LSI_KEYWORDS = {
  ats_resume: [
    'applicant tracking system',
    'resume parser',
    'job application',
    'resume optimization',
    'keyword matching',
    'resume screening',
    'hiring software',
    'recruitment technology',
    'cv scanner',
    'resume format'
  ],
  job_search: [
    'job hunting',
    'career advancement',
    'employment opportunities',
    'job market',
    'professional development',
    'interview preparation',
    'career transition',
    'job application tips'
  ],
  resume_writing: [
    'resume builder',
    'cv writing',
    'resume template',
    'professional summary',
    'work experience',
    'skills section',
    'resume formatting',
    'achievement statements'
  ]
};

/**
 * Generate intelligent title tag
 */
export interface TitleGenerationOptions {
  primaryKeyword: string;
  secondaryKeywords?: string[];
  brandName?: string;
  location?: string;
  intent?: 'informational' | 'transactional' | 'navigational' | 'commercial';
  maxLength?: number;
}

export function generateIntelligentTitle(options: TitleGenerationOptions): string {
  const {
    primaryKeyword,
    secondaryKeywords = [],
    brandName = 'CVDebug',
    location,
    intent = 'transactional',
    maxLength = 60
  } = options;

  let title = '';

  // Structure based on intent
  switch (intent) {
    case 'informational':
      title = `How to ${primaryKeyword} | Complete Guide`;
      break;

    case 'transactional':
      title = `Free ${primaryKeyword}`;
      if (secondaryKeywords.length > 0) {
        title += ` & ${secondaryKeywords[0]}`;
      }
      title += ` | ${brandName}`;
      break;

    case 'commercial':
      title = `Best ${primaryKeyword}`;
      if (secondaryKeywords.length > 0) {
        title += ` - ${secondaryKeywords[0]}`;
      }
      title += ` | ${brandName}`;
      break;

    case 'navigational':
      title = `${brandName} - ${primaryKeyword}`;
      break;
  }

  // Add location if provided
  if (location && title.length + location.length + 5 < maxLength) {
    title = title.replace(` | ${brandName}`, ` in ${location} | ${brandName}`);
  }

  // Ensure title is within length limit
  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + '...';
  }

  return title;
}

/**
 * Generate intelligent meta description
 */
export interface DescriptionGenerationOptions {
  primaryKeyword: string;
  features?: string[];
  benefits?: string[];
  socialProof?: string;
  cta?: string;
  maxLength?: number;
}

export function generateIntelligentDescription(options: DescriptionGenerationOptions): string {
  const {
    primaryKeyword,
    features = [],
    benefits = [],
    socialProof,
    cta = 'Get started free',
    maxLength = 160
  } = options;

  let description = '';

  // Start with primary keyword and value proposition
  description = `${primaryKeyword} that `;

  // Add top benefit
  if (benefits.length > 0) {
    description += `${benefits[0].toLowerCase()}. `;
  }

  // Add key features (max 2)
  if (features.length > 0) {
    const featureText = features.slice(0, 2).join(', ');
    if (description.length + featureText.length + 2 < maxLength - 20) {
      description += `${featureText}. `;
    }
  }

  // Add social proof if it fits
  if (socialProof && description.length + socialProof.length + 2 < maxLength - 15) {
    description += `${socialProof}. `;
  }

  // Add CTA at the end
  if (description.length + cta.length + 1 < maxLength) {
    description += `${cta}.`;
  }

  // Ensure within length limit
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }

  return description;
}

/**
 * Extract LSI keywords from content
 */
export function extractLSIKeywords(
  content: string,
  primaryKeyword: string,
  count: number = 10
): string[] {
  const contentLower = content.toLowerCase();
  const relevantLSI: Array<{ keyword: string; relevance: number }> = [];

  // Check all LSI keyword categories
  for (const [category, keywords] of Object.entries(LSI_KEYWORDS)) {
    for (const lsiKeyword of keywords) {
      // Calculate relevance score based on co-occurrence with primary keyword
      const keywordOccurrences = (contentLower.match(new RegExp(`\\b${lsiKeyword}\\b`, 'gi')) || []).length;

      if (keywordOccurrences > 0) {
        // Higher relevance if LSI keyword appears near primary keyword
        const proximityBonus = checkProximity(contentLower, primaryKeyword.toLowerCase(), lsiKeyword);

        relevantLSI.push({
          keyword: lsiKeyword,
          relevance: keywordOccurrences + proximityBonus
        });
      }
    }
  }

  // Sort by relevance and return top keywords
  return relevantLSI
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, count)
    .map(item => item.keyword);
}

/**
 * Check if two keywords appear close to each other
 */
function checkProximity(text: string, keyword1: string, keyword2: string, maxDistance: number = 50): number {
  const regex1 = new RegExp(`\\b${keyword1}\\b`, 'gi');
  const regex2 = new RegExp(`\\b${keyword2}\\b`, 'gi');

  let match1;
  let proximityScore = 0;

  while ((match1 = regex1.exec(text)) !== null) {
    let match2;
    regex2.lastIndex = 0;

    while ((match2 = regex2.exec(text)) !== null) {
      const distance = Math.abs(match1.index - match2.index);

      if (distance <= maxDistance) {
        proximityScore += 1;
      }
    }
  }

  return proximityScore;
}

/**
 * Detect search intent from query
 */
export function detectSearchIntent(query: string): string {
  const queryLower = query.toLowerCase();

  for (const [intent, patterns] of Object.entries(SEARCH_INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(queryLower)) {
        return intent;
      }
    }
  }

  return 'informational'; // Default intent
}

/**
 * Generate FAQ schema for featured snippets
 */
export interface FAQSchemaOptions {
  questions: Array<{
    question: string;
    answer: string;
  }>;
  context?: string;
}

export function generateFAQSchema(options: FAQSchemaOptions): Record<string, unknown> {
  const { questions, context } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    })),
    ...(context && { about: context })
  };
}

/**
 * Generate HowTo schema for step-by-step content
 */
export interface HowToSchemaOptions {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  totalTime?: string;
  estimatedCost?: string;
}

export function generateHowToSchema(options: HowToSchemaOptions): Record<string, unknown> {
  const { name, description, steps, totalTime, estimatedCost } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(estimatedCost && { estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: estimatedCost } }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  };
}

/**
 * Optimize content for featured snippets
 */
export interface SnippetOptimizationResult {
  optimizedContent: string;
  snippetType: 'paragraph' | 'list' | 'table';
  suggestions: string[];
}

export function optimizeForFeaturedSnippet(
  content: string,
  targetKeyword: string,
  questionFormat?: string
): SnippetOptimizationResult {
  const suggestions: string[] = [];
  let snippetType: 'paragraph' | 'list' | 'table' = 'paragraph';
  let optimizedContent = content;

  // Check if content answers a question
  if (questionFormat) {
    // For "what is" questions, use paragraph format (40-60 words)
    if (/^what\s+is/i.test(questionFormat)) {
      snippetType = 'paragraph';
      const words = content.split(/\s+/);

      if (words.length > 60) {
        optimizedContent = words.slice(0, 58).join(' ') + '...';
        suggestions.push('Shortened answer to 58 words for optimal snippet length');
      } else if (words.length < 40) {
        suggestions.push('Consider expanding answer to 40-60 words for better snippet chances');
      }
    }

    // For "how to" questions, use list format
    if (/^how\s+to/i.test(questionFormat)) {
      snippetType = 'list';

      // Check if content has list format
      if (!content.includes('1.') && !content.includes('•') && !content.includes('-')) {
        suggestions.push('Convert answer to numbered list format (1., 2., 3., etc.)');
      }
    }

    // For comparison questions, use table format
    if (/vs|versus|compare|difference/i.test(questionFormat)) {
      snippetType = 'table';
      suggestions.push('Consider using table format for comparison data');
    }
  }

  // Ensure content starts with target keyword
  if (!content.toLowerCase().startsWith(targetKeyword.toLowerCase())) {
    suggestions.push(`Start content with target keyword: "${targetKeyword}"`);
  }

  // Check for clear, concise language
  const avgWordLength = content.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / content.split(/\s+/).length;

  if (avgWordLength > 6) {
    suggestions.push('Use simpler language (average word length > 6 characters)');
  }

  return {
    optimizedContent,
    snippetType,
    suggestions
  };
}

/**
 * Generate breadcrumb schema for better navigation
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Analyze content for SEO score
 */
export interface SEOAnalysisResult {
  score: number;
  issues: string[];
  recommendations: string[];
  keyword_usage: {
    primary: number;
    secondary: Record<string, number>;
  };
}

export function analyzeSEOContent(
  content: string,
  primaryKeyword: string,
  secondaryKeywords: string[] = []
): SEOAnalysisResult {
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  const contentLower = content.toLowerCase();
  const wordCount = content.split(/\s+/).length;

  // Check word count (optimal: 1500-2500 words for blog posts)
  if (wordCount < 300) {
    score -= 20;
    issues.push('Content too short (< 300 words)');
    recommendations.push('Aim for at least 1000 words for better SEO');
  } else if (wordCount < 1000) {
    score -= 10;
    recommendations.push('Consider expanding to 1500+ words for comprehensive coverage');
  }

  // Check primary keyword usage
  const primaryMatches = (contentLower.match(new RegExp(`\\b${primaryKeyword.toLowerCase()}\\b`, 'gi')) || []).length;
  const primaryDensity = (primaryMatches / wordCount) * 100;

  if (primaryMatches === 0) {
    score -= 30;
    issues.push('Primary keyword not found in content');
  } else if (primaryDensity < 0.5) {
    score -= 15;
    issues.push('Primary keyword density too low (< 0.5%)');
    recommendations.push(`Use "${primaryKeyword}" ${Math.ceil(wordCount * 0.01)} times (1% density)`);
  } else if (primaryDensity > 3) {
    score -= 10;
    issues.push('Primary keyword density too high (> 3%) - risk of keyword stuffing');
    recommendations.push('Reduce keyword usage to maintain natural flow');
  }

  // Check secondary keyword usage
  const secondaryUsage: Record<string, number> = {};

  for (const keyword of secondaryKeywords) {
    const matches = (contentLower.match(new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi')) || []).length;
    secondaryUsage[keyword] = matches;

    if (matches === 0) {
      score -= 5;
      recommendations.push(`Consider adding secondary keyword: "${keyword}"`);
    }
  }

  // Check for headings
  const h1Count = (content.match(/<h1/gi) || []).length;
  const h2Count = (content.match(/<h2/gi) || []).length;

  if (h1Count === 0) {
    score -= 15;
    issues.push('Missing H1 heading');
  } else if (h1Count > 1) {
    score -= 10;
    issues.push('Multiple H1 headings (should be only one)');
  }

  if (h2Count === 0) {
    score -= 10;
    issues.push('No H2 subheadings found');
    recommendations.push('Add H2 headings to structure content');
  }

  // Check for internal/external links
  const linkCount = (content.match(/<a\s+href/gi) || []).length;

  if (linkCount === 0) {
    score -= 10;
    recommendations.push('Add internal and external links for better SEO');
  } else if (linkCount < 3) {
    score -= 5;
    recommendations.push('Add more internal links to related content');
  }

  // Check for images with alt text
  const imageCount = (content.match(/<img/gi) || []).length;
  const altCount = (content.match(/alt=/gi) || []).length;

  if (imageCount > 0 && altCount < imageCount) {
    score -= 10;
    issues.push('Some images missing alt text');
    recommendations.push('Add descriptive alt text to all images');
  }

  // Check readability (simple Flesch-Kincaid approximation)
  const sentences = content.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentences;

  if (avgWordsPerSentence > 20) {
    score -= 5;
    recommendations.push('Reduce average sentence length (currently > 20 words)');
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    keyword_usage: {
      primary: primaryMatches,
      secondary: secondaryUsage
    }
  };
}
