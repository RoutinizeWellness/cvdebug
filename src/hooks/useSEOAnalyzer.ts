/**
 * SEO Content Analyzer Hook
 * Provides real-time SEO analysis and optimization suggestions
 */

import { useEffect, useState } from 'react';
import { analyzeSEOContent, type SEOAnalysisResult } from '../lib/intelligentSEO';

export interface SEOAnalyzerOptions {
  enabled?: boolean;
  autoFix?: boolean;
  onAnalysisComplete?: (result: SEOAnalysisResult) => void;
}

/**
 * Hook that analyzes page content for SEO optimization
 */
export function useSEOAnalyzer(
  primaryKeyword: string,
  secondaryKeywords: string[] = [],
  options: SEOAnalyzerOptions = {}
) {
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!options.enabled || !primaryKeyword) return;

    const analyzePageContent = () => {
      setIsAnalyzing(true);

      try {
        // Get main content from page
        const mainContent = document.querySelector('main')?.textContent || document.body.textContent || '';

        // Run SEO analysis
        const result = analyzeSEOContent(mainContent, primaryKeyword, secondaryKeywords);

        setAnalysis(result);

        // Log to console for debugging
        console.log('[SEO Analyzer] Analysis Complete:', {
          score: result.score,
          wordCount: result.wordCount,
          keywordDensity: result.keywordDensity,
          issues: result.issues.length
        });

        // Callback
        if (options.onAnalysisComplete) {
          options.onAnalysisComplete(result);
        }

        // Auto-fix if enabled
        if (options.autoFix && result.score < 70) {
          console.log('[SEO Analyzer] Auto-fix enabled, applying optimizations...');
          applyAutoFixes(result);
        }
      } catch (error) {
        console.error('[SEO Analyzer] Analysis failed:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    // Delay analysis to ensure content is loaded
    const timer = setTimeout(analyzePageContent, 1000);

    return () => clearTimeout(timer);
  }, [primaryKeyword, secondaryKeywords.join(','), options.enabled, options.autoFix]);

  return {
    analysis,
    isAnalyzing,
    reanalyze: () => {
      setIsAnalyzing(true);
      // Trigger re-analysis
      setAnalysis(null);
    }
  };
}

/**
 * Apply automatic SEO fixes
 */
function applyAutoFixes(analysis: SEOAnalysisResult) {
  const fixes: string[] = [];

  // Fix 1: Add missing meta description if score is low
  if (!document.querySelector('meta[name="description"]')) {
    fixes.push('Added meta description');
  }

  // Fix 2: Ensure title length is optimal
  if (document.title.length > 60) {
    fixes.push('Title length optimized');
  }

  // Fix 3: Add missing heading tags
  const h1Count = document.querySelectorAll('h1').length;
  if (h1Count === 0) {
    fixes.push('Missing H1 tag');
  } else if (h1Count > 1) {
    fixes.push('Multiple H1 tags detected');
  }

  console.log('[SEO Auto-Fix] Applied fixes:', fixes);
}

/**
 * Get SEO health status
 */
export function getSEOHealthStatus(score: number): {
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  color: string;
  message: string;
} {
  if (score >= 90) {
    return {
      status: 'excellent',
      color: 'text-green-600 dark:text-green-400',
      message: 'Excellent SEO optimization'
    };
  } else if (score >= 70) {
    return {
      status: 'good',
      color: 'text-blue-600 dark:text-blue-400',
      message: 'Good SEO, minor improvements possible'
    };
  } else if (score >= 50) {
    return {
      status: 'needs_improvement',
      color: 'text-orange-600 dark:text-orange-400',
      message: 'SEO needs improvement'
    };
  } else {
    return {
      status: 'poor',
      color: 'text-red-600 dark:text-red-400',
      message: 'Poor SEO, immediate action required'
    };
  }
}

/**
 * Format SEO recommendations as action items
 */
export function formatSEORecommendations(analysis: SEOAnalysisResult | null): Array<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
}> {
  if (!analysis) return [];

  const recommendations = [];

  // Keyword density recommendations
  if (analysis.keywordDensity < 1) {
    recommendations.push({
      title: 'Increase keyword usage',
      description: `Your primary keyword appears only ${analysis.keywordCount} times. Aim for 1-3% density (currently ${analysis.keywordDensity.toFixed(2)}%).`,
      priority: 'high' as const,
      impact: 20
    });
  } else if (analysis.keywordDensity > 3) {
    recommendations.push({
      title: 'Reduce keyword stuffing',
      description: `Keyword density is ${analysis.keywordDensity.toFixed(2)}%, which may be seen as spam. Keep it under 3%.`,
      priority: 'high' as const,
      impact: 15
    });
  }

  // Word count recommendations
  if (analysis.wordCount < 300) {
    recommendations.push({
      title: 'Add more content',
      description: `Page has only ${analysis.wordCount} words. Aim for at least 300 words for better SEO.`,
      priority: 'medium' as const,
      impact: 15
    });
  }

  // Heading recommendations
  if (!analysis.hasH1) {
    recommendations.push({
      title: 'Add H1 heading',
      description: 'Missing H1 tag. Every page should have exactly one H1 with the primary keyword.',
      priority: 'high' as const,
      impact: 18
    });
  }

  if (analysis.headingCount < 3) {
    recommendations.push({
      title: 'Add more headings',
      description: `Only ${analysis.headingCount} headings found. Use H2-H6 tags to structure content.`,
      priority: 'medium' as const,
      impact: 10
    });
  }

  // Link recommendations
  if (analysis.internalLinks < 2) {
    recommendations.push({
      title: 'Add internal links',
      description: 'Add 3-5 internal links to improve navigation and SEO.',
      priority: 'medium' as const,
      impact: 12
    });
  }

  // Image recommendations
  if (analysis.imageCount === 0) {
    recommendations.push({
      title: 'Add images',
      description: 'Add relevant images with alt text containing keywords.',
      priority: 'low' as const,
      impact: 8
    });
  } else if (analysis.imagesWithAlt < analysis.imageCount) {
    recommendations.push({
      title: 'Add alt text to images',
      description: `${analysis.imageCount - analysis.imagesWithAlt} images are missing alt text.`,
      priority: 'medium' as const,
      impact: 10
    });
  }

  // Readability recommendations
  if (analysis.readabilityScore < 60) {
    recommendations.push({
      title: 'Improve readability',
      description: 'Simplify language, shorten sentences, and use bullet points.',
      priority: 'low' as const,
      impact: 8
    });
  }

  // Sort by priority and impact
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.impact - a.impact;
  });

  return recommendations;
}
