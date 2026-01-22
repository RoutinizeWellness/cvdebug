/**
 * React Hook for Intelligent SEO
 * Provides dynamic SEO optimization based on page context
 */

import { useEffect } from 'react';
import {
  generateIntelligentTitle,
  generateIntelligentDescription,
  detectSearchIntent,
  type TitleGenerationOptions,
  type DescriptionGenerationOptions
} from '../lib/intelligentSEO';
import { updatePageSEO } from '../lib/seo';

export interface IntelligentSEOConfig {
  // Core keywords
  primaryKeyword: string;
  secondaryKeywords?: string[];

  // Page context
  intent?: 'informational' | 'transactional' | 'navigational' | 'commercial';
  autoDetectIntent?: boolean;

  // Content
  features?: string[];
  benefits?: string[];
  socialProof?: string;
  cta?: string;

  // Metadata
  brandName?: string;
  location?: string;

  // Override (if you want manual control)
  manualTitle?: string;
  manualDescription?: string;

  // Additional SEO
  image?: string;
  canonicalUrl?: string;
}

/**
 * Hook for intelligent SEO optimization
 */
export function useIntelligentSEO(config: IntelligentSEOConfig) {
  useEffect(() => {
    // Detect intent if auto-detect is enabled
    let intent = config.intent;
    if (config.autoDetectIntent && !intent) {
      const query = config.primaryKeyword + ' ' + (config.secondaryKeywords?.join(' ') || '');
      const detectedIntent = detectSearchIntent(query);
      intent = detectedIntent as typeof config.intent;
    }

    // Generate or use manual title
    const title = config.manualTitle || generateIntelligentTitle({
      primaryKeyword: config.primaryKeyword,
      secondaryKeywords: config.secondaryKeywords,
      brandName: config.brandName,
      location: config.location,
      intent: intent || 'transactional',
      maxLength: 60
    });

    // Generate or use manual description
    const description = config.manualDescription || generateIntelligentDescription({
      primaryKeyword: config.primaryKeyword,
      features: config.features,
      benefits: config.benefits,
      socialProof: config.socialProof,
      cta: config.cta,
      maxLength: 160
    });

    // Apply SEO updates
    updatePageSEO({
      title,
      description,
      keywords: [
        config.primaryKeyword,
        ...(config.secondaryKeywords || [])
      ],
      canonical: config.canonicalUrl || window.location.href,
      ogImage: config.image || '/og-image.png'
    });

    console.log('[Intelligent SEO] Applied:', {
      title: title.substring(0, 60),
      description: description.substring(0, 100),
      intent
    });
  }, [
    config.primaryKeyword,
    config.secondaryKeywords?.join(','),
    config.intent,
    config.autoDetectIntent,
    config.manualTitle,
    config.manualDescription
  ]);
}

/**
 * Preset configurations for common pages
 */
export const SEO_PRESETS = {
  landing: {
    primaryKeyword: 'Free ATS Resume Scanner',
    secondaryKeywords: ['Resume Optimization', 'ATS Checker', 'Resume Analysis'],
    intent: 'transactional' as const,
    features: [
      'Instant ATS compatibility check',
      'Keyword optimization',
      'Format analysis'
    ],
    benefits: [
      'Increases your chances of getting past ATS by 73%',
      'Get hired faster with optimized resumes',
      'Beat 90% of competitors'
    ],
    socialProof: 'Trusted by 50,000+ job seekers',
    cta: 'Scan your resume free'
  },

  dashboard: {
    primaryKeyword: 'Resume Analysis Dashboard',
    secondaryKeywords: ['ATS Score', 'Resume Insights', 'Career Tools'],
    intent: 'navigational' as const,
    features: ['Real-time analysis', 'Detailed insights', 'Export reports'],
    benefits: ['Track your progress', 'Compare versions', 'Optimize continuously']
  },

  pricing: {
    primaryKeyword: 'Resume Scanner Pricing',
    secondaryKeywords: ['ATS Tools Plans', 'Resume Services Cost'],
    intent: 'commercial' as const,
    features: ['Free scan', 'Single scan option', 'Unlimited scans'],
    benefits: ['No credit card required', '24h unlimited rescans', 'Priority support'],
    cta: 'Start free scan'
  },

  results: {
    primaryKeyword: 'Resume ATS Analysis Results',
    secondaryKeywords: ['Resume Score', 'ATS Compatibility Report'],
    intent: 'informational' as const,
    features: ['Detailed scoring', 'Keyword analysis', 'Format recommendations'],
    benefits: ['Understand your ATS score', 'Get actionable insights', 'Improve systematically']
  },

  howItWorks: {
    primaryKeyword: 'How ATS Resume Scanners Work',
    secondaryKeywords: ['ATS Parsing', 'Resume Optimization Guide'],
    intent: 'informational' as const,
    features: ['Step-by-step guide', 'ATS insights', 'Best practices'],
    benefits: ['Learn ATS secrets', 'Master resume optimization', 'Increase interview callbacks'],
    cta: 'Try it free'
  }
};

/**
 * Use a preset configuration
 */
export function usePresetSEO(
  presetName: keyof typeof SEO_PRESETS,
  overrides?: Partial<IntelligentSEOConfig>
) {
  const preset = SEO_PRESETS[presetName];

  useIntelligentSEO({
    ...preset,
    ...overrides,
    brandName: 'CVDebug'
  });
}
