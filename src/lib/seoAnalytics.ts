/**
 * SEO Analytics System
 * Tracks SEO performance metrics and integrates with ML monitoring
 */

export interface SEOMetrics {
  timestamp: number;
  pageUrl: string;
  score: number;
  wordCount: number;
  keywordDensity: number;
  readabilityScore: number;
  hasH1: boolean;
  headingCount: number;
  internalLinks: number;
  externalLinks: number;
  imageCount: number;
  imagesWithAlt: number;
  metaDescriptionLength: number;
  titleLength: number;
  loadTime?: number;
}

export interface SEOSnapshot {
  period: string;
  totalPages: number;
  averageScore: number;
  averageWordCount: number;
  averageKeywordDensity: number;
  averageReadability: number;
  pagesWithH1: number;
  averageLoadTime: number;
  topPerformingPages: Array<{
    url: string;
    score: number;
    wordCount: number;
  }>;
  issuesDetected: Array<{
    type: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
  }>;
}

export class SEOAnalytics {
  private metrics: SEOMetrics[] = [];
  private readonly maxMetrics: number = 5000;

  /**
   * Record SEO metrics for a page
   */
  recordMetrics(metrics: SEOMetrics): void {
    this.metrics.push(metrics);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /**
   * Get SEO snapshot for a time period
   */
  getSnapshot(periodHours: number = 24): SEOSnapshot {
    const cutoff = Date.now() - periodHours * 60 * 60 * 1000;
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    if (recentMetrics.length === 0) {
      return this.getEmptySnapshot(periodHours);
    }

    const totalPages = recentMetrics.length;
    const averageScore = recentMetrics.reduce((sum, m) => sum + m.score, 0) / totalPages;
    const averageWordCount = recentMetrics.reduce((sum, m) => sum + m.wordCount, 0) / totalPages;
    const averageKeywordDensity = recentMetrics.reduce((sum, m) => sum + m.keywordDensity, 0) / totalPages;
    const averageReadability = recentMetrics.reduce((sum, m) => sum + m.readabilityScore, 0) / totalPages;
    const pagesWithH1 = recentMetrics.filter(m => m.hasH1).length;
    const averageLoadTime = recentMetrics
      .filter(m => m.loadTime !== undefined)
      .reduce((sum, m) => sum + (m.loadTime || 0), 0) / totalPages;

    // Top performing pages
    const topPerformingPages = recentMetrics
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(m => ({
        url: m.pageUrl,
        score: m.score,
        wordCount: m.wordCount
      }));

    // Detect issues
    const issuesDetected = this.detectSEOIssues(recentMetrics);

    return {
      period: `${periodHours}h`,
      totalPages,
      averageScore: Math.round(averageScore * 10) / 10,
      averageWordCount: Math.round(averageWordCount),
      averageKeywordDensity: Math.round(averageKeywordDensity * 100) / 100,
      averageReadability: Math.round(averageReadability * 10) / 10,
      pagesWithH1,
      averageLoadTime: Math.round(averageLoadTime),
      topPerformingPages,
      issuesDetected
    };
  }

  /**
   * Detect SEO issues across metrics
   */
  private detectSEOIssues(metrics: SEOMetrics[]): Array<{
    type: string;
    count: number;
    severity: 'low' | 'medium' | 'high';
  }> {
    const issues: Array<{
      type: string;
      count: number;
      severity: 'low' | 'medium' | 'high';
    }> = [];

    // Missing H1
    const missingH1 = metrics.filter(m => !m.hasH1).length;
    if (missingH1 > 0) {
      issues.push({
        type: 'Missing H1 tags',
        count: missingH1,
        severity: 'high'
      });
    }

    // Low word count
    const lowWordCount = metrics.filter(m => m.wordCount < 300).length;
    if (lowWordCount > metrics.length * 0.2) {
      issues.push({
        type: 'Low word count (< 300 words)',
        count: lowWordCount,
        severity: 'medium'
      });
    }

    // Low keyword density
    const lowKeywordDensity = metrics.filter(m => m.keywordDensity < 0.5).length;
    if (lowKeywordDensity > metrics.length * 0.3) {
      issues.push({
        type: 'Low keyword density (< 0.5%)',
        count: lowKeywordDensity,
        severity: 'medium'
      });
    }

    // Images without alt text
    const imagesWithoutAlt = metrics.filter(m => m.imageCount > 0 && m.imagesWithAlt < m.imageCount).length;
    if (imagesWithoutAlt > 0) {
      issues.push({
        type: 'Images missing alt text',
        count: imagesWithoutAlt,
        severity: 'medium'
      });
    }

    // Poor readability
    const poorReadability = metrics.filter(m => m.readabilityScore < 50).length;
    if (poorReadability > metrics.length * 0.2) {
      issues.push({
        type: 'Poor readability score (< 50)',
        count: poorReadability,
        severity: 'low'
      });
    }

    // No internal links
    const noInternalLinks = metrics.filter(m => m.internalLinks === 0).length;
    if (noInternalLinks > 0) {
      issues.push({
        type: 'No internal links',
        count: noInternalLinks,
        severity: 'low'
      });
    }

    return issues.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Get empty snapshot
   */
  private getEmptySnapshot(periodHours: number): SEOSnapshot {
    return {
      period: `${periodHours}h`,
      totalPages: 0,
      averageScore: 0,
      averageWordCount: 0,
      averageKeywordDensity: 0,
      averageReadability: 0,
      pagesWithH1: 0,
      averageLoadTime: 0,
      topPerformingPages: [],
      issuesDetected: []
    };
  }

  /**
   * Get SEO health status
   */
  getHealthStatus(periodHours: number = 24): {
    status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    score: number;
    message: string;
  } {
    const snapshot = this.getSnapshot(periodHours);

    if (snapshot.totalPages === 0) {
      return {
        status: 'poor',
        score: 0,
        message: 'No SEO data available'
      };
    }

    const score = snapshot.averageScore;
    const criticalIssues = snapshot.issuesDetected.filter(i => i.severity === 'high').length;

    if (score >= 90 && criticalIssues === 0) {
      return {
        status: 'excellent',
        score,
        message: 'SEO is performing excellently'
      };
    } else if (score >= 70 && criticalIssues <= 1) {
      return {
        status: 'good',
        score,
        message: 'SEO is performing well'
      };
    } else if (score >= 50) {
      return {
        status: 'needs_improvement',
        score,
        message: `SEO needs improvement - ${criticalIssues} critical issues found`
      };
    } else {
      return {
        status: 'poor',
        score,
        message: `SEO is poor - ${criticalIssues} critical issues found`
      };
    }
  }

  /**
   * Get trend data for charts
   */
  getTrendData(periodHours: number = 24, buckets: number = 12): Array<{
    timestamp: number;
    averageScore: number;
    pageCount: number;
  }> {
    const cutoff = Date.now() - periodHours * 60 * 60 * 1000;
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    if (recentMetrics.length === 0) return [];

    const bucketSize = (periodHours * 60 * 60 * 1000) / buckets;
    const trendData: Array<{
      timestamp: number;
      averageScore: number;
      pageCount: number;
    }> = [];

    for (let i = 0; i < buckets; i++) {
      const bucketStart = cutoff + i * bucketSize;
      const bucketEnd = bucketStart + bucketSize;

      const bucketMetrics = recentMetrics.filter(
        m => m.timestamp >= bucketStart && m.timestamp < bucketEnd
      );

      if (bucketMetrics.length > 0) {
        const averageScore = bucketMetrics.reduce((sum, m) => sum + m.score, 0) / bucketMetrics.length;
        trendData.push({
          timestamp: bucketStart,
          averageScore: Math.round(averageScore * 10) / 10,
          pageCount: bucketMetrics.length
        });
      } else {
        trendData.push({
          timestamp: bucketStart,
          averageScore: 0,
          pageCount: 0
        });
      }
    }

    return trendData;
  }

  /**
   * Export metrics
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.metrics, null, 2);
    }

    // CSV format
    const headers = [
      'timestamp',
      'pageUrl',
      'score',
      'wordCount',
      'keywordDensity',
      'readabilityScore',
      'hasH1',
      'headingCount',
      'internalLinks',
      'externalLinks',
      'imageCount',
      'imagesWithAlt',
      'metaDescriptionLength',
      'titleLength',
      'loadTime'
    ].join(',');

    const rows = this.metrics.map(m =>
      [
        m.timestamp,
        `"${m.pageUrl}"`,
        m.score,
        m.wordCount,
        m.keywordDensity,
        m.readabilityScore,
        m.hasH1,
        m.headingCount,
        m.internalLinks,
        m.externalLinks,
        m.imageCount,
        m.imagesWithAlt,
        m.metaDescriptionLength,
        m.titleLength,
        m.loadTime || ''
      ].join(',')
    );

    return [headers, ...rows].join('\n');
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): SEOMetrics[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Global SEO analytics instance
export const seoAnalytics = new SEOAnalytics();
