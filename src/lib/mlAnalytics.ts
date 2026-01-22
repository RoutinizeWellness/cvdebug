/**
 * ML Analytics and Monitoring System
 *
 * Tracks:
 * - Model performance over time
 * - Prediction accuracy
 * - Feature importance trends
 * - User satisfaction metrics
 * - System health and latency
 */

export interface AnalysisMetrics {
  timestamp: number;
  analysisId: string;
  userId: string;

  // Input characteristics
  resumeLength: number;
  industry: string;
  hasJobDescription: boolean;

  // Model performance
  modelVersion: number;
  analysisTime: number; // milliseconds
  confidenceScore: number; // 0-1

  // Predictions
  overallScore: number;
  keywordScore: number;
  formatScore: number;
  completenessScore: number;
  atsScore: number;

  // User interaction
  userEngagement?: {
    timeOnPage: number;
    appliedRecommendations: number;
    downloadedReport: boolean;
    sharedResults: boolean;
  };

  // Outcome (if available)
  userFeedback?: {
    rating: number; // 1-5
    helpful: boolean;
    accuracy: 'too_low' | 'accurate' | 'too_high';
  };
}

export interface PerformanceSnapshot {
  period: string;
  totalAnalyses: number;
  averageScore: number;
  averageLatency: number;
  successRate: number;
  userSatisfaction: number;
  topIssues: Array<{ issue: string; frequency: number }>;
  topKeywords: Array<{ keyword: string; frequency: number }>;
  industryBreakdown: Record<string, number>;
}

/**
 * Analytics aggregator
 */
export class MLAnalytics {
  private metrics: AnalysisMetrics[] = [];
  private maxMetrics: number = 10000;

  /**
   * Record a new analysis
   */
  recordAnalysis(metrics: AnalysisMetrics): void {
    this.metrics.push(metrics);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Recorded:', {
        score: metrics.overallScore,
        time: `${metrics.analysisTime}ms`,
        confidence: metrics.confidenceScore
      });
    }
  }

  /**
   * Get performance snapshot for a time period
   */
  getSnapshot(periodHours: number = 24): PerformanceSnapshot {
    const cutoff = Date.now() - periodHours * 60 * 60 * 1000;
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    if (recentMetrics.length === 0) {
      return this.emptySnapshot(`${periodHours}h`);
    }

    // Calculate averages
    const totalAnalyses = recentMetrics.length;
    const averageScore = recentMetrics.reduce((sum, m) => sum + m.overallScore, 0) / totalAnalyses;
    const averageLatency = recentMetrics.reduce((sum, m) => sum + m.analysisTime, 0) / totalAnalyses;

    // Success rate (score >= 70)
    const successCount = recentMetrics.filter(m => m.overallScore >= 70).length;
    const successRate = (successCount / totalAnalyses) * 100;

    // User satisfaction (from feedback)
    const feedbackMetrics = recentMetrics.filter(m => m.userFeedback);
    const userSatisfaction = feedbackMetrics.length > 0
      ? feedbackMetrics.reduce((sum, m) => sum + (m.userFeedback?.rating || 0), 0) / feedbackMetrics.length
      : 0;

    // Industry breakdown
    const industryBreakdown: Record<string, number> = {};
    for (const metric of recentMetrics) {
      industryBreakdown[metric.industry] = (industryBreakdown[metric.industry] || 0) + 1;
    }

    return {
      period: `${periodHours}h`,
      totalAnalyses,
      averageScore: Math.round(averageScore),
      averageLatency: Math.round(averageLatency),
      successRate: Math.round(successRate),
      userSatisfaction: Math.round(userSatisfaction * 100) / 100,
      topIssues: [],
      topKeywords: [],
      industryBreakdown
    };
  }

  /**
   * Get trend data for charting
   */
  getTrendData(periodHours: number = 24, buckets: number = 24): Array<{
    timestamp: number;
    averageScore: number;
    analysisCount: number;
    averageLatency: number;
  }> {
    const cutoff = Date.now() - periodHours * 60 * 60 * 1000;
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    if (recentMetrics.length === 0) return [];

    const bucketSize = (periodHours * 60 * 60 * 1000) / buckets;
    const trendData = [];

    for (let i = 0; i < buckets; i++) {
      const bucketStart = cutoff + i * bucketSize;
      const bucketEnd = bucketStart + bucketSize;

      const bucketMetrics = recentMetrics.filter(
        m => m.timestamp >= bucketStart && m.timestamp < bucketEnd
      );

      if (bucketMetrics.length > 0) {
        const averageScore = bucketMetrics.reduce((sum, m) => sum + m.overallScore, 0) / bucketMetrics.length;
        const averageLatency = bucketMetrics.reduce((sum, m) => sum + m.analysisTime, 0) / bucketMetrics.length;

        trendData.push({
          timestamp: bucketStart,
          averageScore: Math.round(averageScore),
          analysisCount: bucketMetrics.length,
          averageLatency: Math.round(averageLatency)
        });
      }
    }

    return trendData;
  }

  /**
   * Get model accuracy over time
   */
  getAccuracyMetrics(): {
    overall: number;
    byIndustry: Record<string, number>;
    byScoreRange: Record<string, number>;
  } {
    const metricsWithFeedback = this.metrics.filter(m => m.userFeedback?.accuracy);

    if (metricsWithFeedback.length === 0) {
      return {
        overall: 0,
        byIndustry: {},
        byScoreRange: {}
      };
    }

    // Overall accuracy (accurate feedback)
    const accurateCount = metricsWithFeedback.filter(m => m.userFeedback?.accuracy === 'accurate').length;
    const overall = (accurateCount / metricsWithFeedback.length) * 100;

    // By industry
    const byIndustry: Record<string, number> = {};
    const industryGroups = this.groupBy(metricsWithFeedback, m => m.industry);

    for (const [industry, metrics] of Object.entries(industryGroups)) {
      const accurate = metrics.filter(m => m.userFeedback?.accuracy === 'accurate').length;
      byIndustry[industry] = (accurate / metrics.length) * 100;
    }

    // By score range
    const byScoreRange: Record<string, number> = {};
    const scoreGroups = this.groupBy(metricsWithFeedback, m => {
      if (m.overallScore >= 80) return '80-100';
      if (m.overallScore >= 60) return '60-79';
      if (m.overallScore >= 40) return '40-59';
      return '0-39';
    });

    for (const [range, metrics] of Object.entries(scoreGroups)) {
      const accurate = metrics.filter(m => m.userFeedback?.accuracy === 'accurate').length;
      byScoreRange[range] = (accurate / metrics.length) * 100;
    }

    return {
      overall: Math.round(overall),
      byIndustry,
      byScoreRange
    };
  }

  /**
   * Get latency percentiles
   */
  getLatencyPercentiles(): {
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  } {
    if (this.metrics.length === 0) {
      return { p50: 0, p75: 0, p90: 0, p95: 0, p99: 0 };
    }

    const latencies = this.metrics.map(m => m.analysisTime).sort((a, b) => a - b);

    return {
      p50: this.percentile(latencies, 50),
      p75: this.percentile(latencies, 75),
      p90: this.percentile(latencies, 90),
      p95: this.percentile(latencies, 95),
      p99: this.percentile(latencies, 99)
    };
  }

  /**
   * Detect anomalies in recent analyses
   */
  detectAnomalies(window: number = 100): Array<{
    type: 'high_latency' | 'low_score' | 'low_confidence' | 'error_spike';
    severity: 'low' | 'medium' | 'high';
    message: string;
    affectedCount: number;
  }> {
    const recent = this.metrics.slice(-window);
    if (recent.length < 10) return [];

    const anomalies: Array<{
      type: 'high_latency' | 'low_score' | 'low_confidence' | 'error_spike';
      severity: 'low' | 'medium' | 'high';
      message: string;
      affectedCount: number;
    }> = [];

    // Calculate baseline metrics
    const avgLatency = recent.reduce((sum, m) => sum + m.analysisTime, 0) / recent.length;
    const avgScore = recent.reduce((sum, m) => sum + m.overallScore, 0) / recent.length;
    const avgConfidence = recent.reduce((sum, m) => sum + m.confidenceScore, 0) / recent.length;

    // Detect high latency (> 2x average)
    const highLatency = recent.filter(m => m.analysisTime > avgLatency * 2);
    if (highLatency.length > window * 0.1) {
      anomalies.push({
        type: 'high_latency',
        severity: 'high',
        message: `${highLatency.length} analyses with high latency (> ${Math.round(avgLatency * 2)}ms)`,
        affectedCount: highLatency.length
      });
    }

    // Detect low scores (< 50)
    const lowScore = recent.filter(m => m.overallScore < 50);
    if (lowScore.length > window * 0.2) {
      anomalies.push({
        type: 'low_score',
        severity: 'medium',
        message: `${lowScore.length} analyses with low scores (< 50)`,
        affectedCount: lowScore.length
      });
    }

    // Detect low confidence (< 0.5)
    const lowConfidence = recent.filter(m => m.confidenceScore < 0.5);
    if (lowConfidence.length > window * 0.15) {
      anomalies.push({
        type: 'low_confidence',
        severity: 'medium',
        message: `${lowConfidence.length} analyses with low confidence (< 0.5)`,
        affectedCount: lowConfidence.length
      });
    }

    return anomalies;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.metrics, null, 2);
    }

    // CSV format
    const headers = [
      'timestamp',
      'analysisId',
      'userId',
      'industry',
      'overallScore',
      'analysisTime',
      'confidenceScore'
    ].join(',');

    const rows = this.metrics.map(m =>
      [
        m.timestamp,
        m.analysisId,
        m.userId,
        m.industry,
        m.overallScore,
        m.analysisTime,
        m.confidenceScore
      ].join(',')
    );

    return [headers, ...rows].join('\n');
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics(daysToKeep: number = 30): number {
    const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
    const before = this.metrics.length;
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoff);
    return before - this.metrics.length;
  }

  // Helper methods
  private emptySnapshot(period: string): PerformanceSnapshot {
    return {
      period,
      totalAnalyses: 0,
      averageScore: 0,
      averageLatency: 0,
      successRate: 0,
      userSatisfaction: 0,
      topIssues: [],
      topKeywords: [],
      industryBreakdown: {}
    };
  }

  private percentile(sortedArray: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[index] || 0;
  }

  private groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
}

/**
 * Global analytics instance
 */
export const mlAnalytics = new MLAnalytics();

/**
 * Performance monitoring decorator
 */
export function trackPerformance(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const startTime = performance.now();

    try {
      const result = await originalMethod.apply(this, args);
      const duration = performance.now() - startTime;

      console.log(`[Performance] ${propertyKey} completed in ${duration.toFixed(2)}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance] ${propertyKey} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };

  return descriptor;
}
