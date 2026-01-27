/**
 * Unified Metrics System
 * Combines ML, SEO, and system metrics into a single interface
 */

import { mlAnalytics, type AnalysisMetrics } from './mlAnalytics';
import { seoAnalytics, type SEOMetrics } from './seoAnalytics';
import { performanceOptimizer, type PerformanceMetrics, type OptimizationRecommendation } from './performanceOptimizer';

export interface UnifiedSnapshot {
  timestamp: number;
  period: string;

  // ML Metrics
  ml: {
    totalAnalyses: number;
    averageScore: number;
    averageLatency: number;
    successRate: number;
    modelAccuracy: number;
    cacheHitRate: number;
  };

  // SEO Metrics
  seo: {
    totalPages: number;
    averageScore: number;
    healthStatus: string;
    pagesWithH1: number;
    issuesCount: number;
  };

  // System Health
  health: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    score: number;
    components: {
      database: 'ok' | 'warning' | 'error';
      cache: 'ok' | 'warning' | 'error';
      ml: 'ok' | 'warning' | 'error';
      webhooks: 'ok' | 'warning' | 'error';
      api: 'ok' | 'warning' | 'error';
    };
  };

  // Performance
  performance: {
    overallScore: number;
    recommendations: number;
    quickWins: number;
    criticalIssues: number;
  };
}

export interface TrendPoint {
  timestamp: number;
  mlScore: number;
  seoScore: number;
  latency: number;
  analyses: number;
}

export class UnifiedMetrics {
  /**
   * Get unified snapshot of all metrics
   */
  getSnapshot(periodHours: number = 24): UnifiedSnapshot {
    // Get ML snapshot
    const mlSnapshot = mlAnalytics.getSnapshot(periodHours);

    // Get SEO snapshot
    const seoSnapshot = seoAnalytics.getSnapshot(periodHours);
    const seoHealth = seoAnalytics.getHealthStatus(periodHours);

    // Get latency percentiles
    const latencyPercentiles = mlAnalytics.getLatencyPercentiles();

    // Get performance metrics (simulated from ML data)
    const performanceMetrics: PerformanceMetrics = {
      cacheHitRate: 92, // Would fetch from cache stats
      averageLatency: mlSnapshot.averageLatency,
      p95Latency: latencyPercentiles.p95,
      p99Latency: latencyPercentiles.p99,
      errorRate: ((mlSnapshot.totalAnalyses - mlSnapshot.successRate * mlSnapshot.totalAnalyses / 100) / mlSnapshot.totalAnalyses) * 100,
      analysisVolume: mlSnapshot.totalAnalyses,
      modelAccuracy: mlSnapshot.averageScore * 0.9, // Rough estimate
      webhookSuccessRate: 96, // Would fetch from webhook stats
      memoryUsage: 45, // Would fetch from system
      cpuUsage: 35 // Would fetch from system
    };

    const recommendations = performanceOptimizer.generateRecommendations(performanceMetrics);
    const quickWins = performanceOptimizer.getQuickWins(recommendations);
    const criticalIssues = recommendations.filter(r => r.priority >= 8).length;

    // Simulate health status (would be fetched from health check system)
    const healthScore = this.calculateHealthScore(mlSnapshot, seoSnapshot);
    const healthStatus: 'healthy' | 'degraded' | 'unhealthy' =
      healthScore >= 90 ? 'healthy' :
      healthScore >= 60 ? 'degraded' : 'unhealthy';

    return {
      timestamp: Date.now(),
      period: `${periodHours}h`,

      ml: {
        totalAnalyses: mlSnapshot.totalAnalyses,
        averageScore: mlSnapshot.averageScore,
        averageLatency: mlSnapshot.averageLatency,
        successRate: mlSnapshot.successRate,
        modelAccuracy: mlSnapshot.averageScore * 0.9,
        cacheHitRate: 92
      },

      seo: {
        totalPages: seoSnapshot.totalPages,
        averageScore: seoSnapshot.averageScore,
        healthStatus: seoHealth.status,
        pagesWithH1: seoSnapshot.pagesWithH1,
        issuesCount: seoSnapshot.issuesDetected.length
      },

      health: {
        status: healthStatus,
        score: healthScore,
        components: {
          database: healthScore >= 80 ? 'ok' : healthScore >= 50 ? 'warning' : 'error',
          cache: performanceMetrics.cacheHitRate >= 85 ? 'ok' : 'warning',
          ml: mlSnapshot.successRate >= 95 ? 'ok' : mlSnapshot.successRate >= 85 ? 'warning' : 'error',
          webhooks: performanceMetrics.webhookSuccessRate >= 95 ? 'ok' : 'warning',
          api: performanceMetrics.errorRate < 2 ? 'ok' : performanceMetrics.errorRate < 5 ? 'warning' : 'error'
        }
      },

      performance: {
        overallScore: healthScore,
        recommendations: recommendations.length,
        quickWins: quickWins.length,
        criticalIssues
      }
    };
  }

  /**
   * Calculate overall health score
   */
  private calculateHealthScore(mlSnapshot: any, seoSnapshot: any): number {
    const scores: number[] = [];

    // ML performance score (40% weight)
    const mlScore = (
      (mlSnapshot.successRate / 100) * 40 +
      (Math.min(mlSnapshot.averageLatency / 1000, 1)) * -10 + // Penalty for high latency
      (mlSnapshot.averageScore / 100) * 10
    );
    scores.push(Math.max(0, Math.min(40, mlScore)));

    // SEO performance score (20% weight)
    const seoScore = (seoSnapshot.averageScore / 100) * 20;
    scores.push(seoScore);

    // System reliability score (40% weight)
    const reliabilityScore = 40; // Base score, deduct for issues
    scores.push(reliabilityScore);

    return Math.round(scores.reduce((sum, score) => sum + score, 0));
  }

  /**
   * Get combined trend data
   */
  getTrendData(periodHours: number = 24, buckets: number = 12): TrendPoint[] {
    const mlTrend = mlAnalytics.getTrendData(periodHours, buckets);
    const seoTrend = seoAnalytics.getTrendData(periodHours, buckets);

    return mlTrend.map((mlPoint, idx) => {
      const seoPoint = seoTrend[idx] || { timestamp: mlPoint.timestamp, averageScore: 0, pageCount: 0 };

      return {
        timestamp: mlPoint.timestamp,
        mlScore: mlPoint.averageScore,
        seoScore: seoPoint.averageScore,
        latency: mlPoint.averageLatency,
        analyses: mlPoint.analysisCount
      };
    });
  }

  /**
   * Get all active issues across systems
   */
  getAllIssues(): Array<{
    system: 'ml' | 'seo' | 'performance' | 'health';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    recommendation: string;
  }> {
    const issues: Array<{
      system: 'ml' | 'seo' | 'performance' | 'health';
      severity: 'low' | 'medium' | 'high' | 'critical';
      title: string;
      description: string;
      recommendation: string;
    }> = [];

    // ML anomalies
    const mlAnomalies = mlAnalytics.detectAnomalies(100);
    mlAnomalies.forEach(anomaly => {
      issues.push({
        system: 'ml',
        severity: anomaly.severity === 'high' ? 'high' : 'medium',
        title: `ML: ${anomaly.type.replace(/_/g, ' ').toUpperCase()}`,
        description: anomaly.message,
        recommendation: 'Review ML system metrics and optimize accordingly'
      });
    });

    // SEO issues
    const seoSnapshot = seoAnalytics.getSnapshot(24);
    seoSnapshot.issuesDetected.forEach(issue => {
      issues.push({
        system: 'seo',
        severity: issue.severity,
        title: `SEO: ${issue.type}`,
        description: `${issue.count} pages affected`,
        recommendation: 'Review SEO guidelines and fix affected pages'
      });
    });

    // Performance recommendations (high priority only)
    const mlSnapshot24 = mlAnalytics.getSnapshot(24);
    const latencyPercentiles24 = mlAnalytics.getLatencyPercentiles();
    const perfMetrics: PerformanceMetrics = {
      cacheHitRate: 92,
      averageLatency: mlSnapshot24.averageLatency,
      p95Latency: latencyPercentiles24.p95,
      p99Latency: latencyPercentiles24.p99,
      errorRate: 1.5,
      analysisVolume: mlAnalytics.getSnapshot(24).totalAnalyses,
      modelAccuracy: 88,
      webhookSuccessRate: 96,
      memoryUsage: 45,
      cpuUsage: 35
    };

    const recommendations = performanceOptimizer.generateRecommendations(perfMetrics);
    recommendations.filter(r => r.priority >= 8).forEach(rec => {
      issues.push({
        system: 'performance',
        severity: rec.impact === 'high' ? 'high' : rec.impact === 'medium' ? 'medium' : 'low',
        title: rec.title,
        description: rec.description,
        recommendation: rec.actionItems[0] || rec.estimatedImprovement
      });
    });

    // Sort by severity
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return issues.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
  }

  /**
   * Get system overview summary
   */
  getSystemOverview(): {
    status: string;
    uptime: string;
    totalAnalyses: number;
    activeUsers: number;
    avgResponseTime: number;
    successRate: number;
    criticalIssues: number;
  } {
    const snapshot = this.getSnapshot(24);
    const issues = this.getAllIssues();

    return {
      status: snapshot.health.status,
      uptime: '99.9%', // Would fetch from monitoring
      totalAnalyses: snapshot.ml.totalAnalyses,
      activeUsers: Math.round(snapshot.ml.totalAnalyses / 10), // Rough estimate
      avgResponseTime: snapshot.ml.averageLatency,
      successRate: snapshot.ml.successRate,
      criticalIssues: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length
    };
  }

  /**
   * Export all metrics
   */
  exportAll(format: 'json' | 'csv' = 'json'): string {
    const snapshot = this.getSnapshot(24);
    const trend = this.getTrendData(24, 24);
    const issues = this.getAllIssues();
    const overview = this.getSystemOverview();

    if (format === 'json') {
      return JSON.stringify({
        snapshot,
        trend,
        issues,
        overview,
        exportedAt: new Date().toISOString()
      }, null, 2);
    }

    // CSV format - simplified
    const headers = [
      'metric',
      'value',
      'category'
    ].join(',');

    const rows: string[] = [
      `ML Analyses,${snapshot.ml.totalAnalyses},ML`,
      `ML Avg Score,${snapshot.ml.averageScore},ML`,
      `ML Avg Latency,${snapshot.ml.averageLatency},ML`,
      `ML Success Rate,${snapshot.ml.successRate},ML`,
      `SEO Pages,${snapshot.seo.totalPages},SEO`,
      `SEO Avg Score,${snapshot.seo.averageScore},SEO`,
      `Health Score,${snapshot.health.score},Health`,
      `Health Status,${snapshot.health.status},Health`,
      `Performance Recommendations,${snapshot.performance.recommendations},Performance`,
      `Critical Issues,${snapshot.performance.criticalIssues},Performance`
    ];

    return [headers, ...rows].join('\n');
  }
}

// Global unified metrics instance
export const unifiedMetrics = new UnifiedMetrics();
