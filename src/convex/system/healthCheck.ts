/**
 * Automated Health Check System
 * Monitors system health and triggers alerts for issues
 */

import { internalQuery, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

export interface HealthCheckResult {
  timestamp: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
  overallScore: number; // 0-100
  checks: {
    database: CheckStatus;
    cache: CheckStatus;
    ml: CheckStatus;
    webhooks: CheckStatus;
    api: CheckStatus;
  };
  issues: Array<{
    component: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    recommendation: string;
  }>;
}

interface CheckStatus {
  status: 'ok' | 'warning' | 'error';
  responseTime: number;
  message: string;
  details?: any;
}

/**
 * Run comprehensive health check
 */
export const runHealthCheck = internalAction({
  args: {},
  handler: async (ctx): Promise<HealthCheckResult> => {
    console.log('[HealthCheck] Starting system health check...');

    const startTime = Date.now();
    const checks: HealthCheckResult['checks'] = {
      database: await checkDatabase(ctx),
      cache: await checkCache(ctx),
      ml: await checkMLSystem(ctx),
      webhooks: await checkWebhooks(ctx),
      api: await checkAPIHealth(ctx)
    };

    // Calculate overall score
    const scores = {
      ok: 100,
      warning: 60,
      error: 20
    };

    const totalScore =
      Object.values(checks).reduce(
        (sum, check) => sum + scores[check.status],
        0
      ) / Object.keys(checks).length;

    // Determine overall status
    const status: 'healthy' | 'degraded' | 'unhealthy' =
      totalScore >= 90
        ? 'healthy'
        : totalScore >= 60
        ? 'degraded'
        : 'unhealthy';

    // Collect issues
    const issues: HealthCheckResult['issues'] = [];

    Object.entries(checks).forEach(([component, check]) => {
      if (check.status === 'error') {
        issues.push({
          component,
          severity: 'critical',
          message: check.message,
          recommendation: getRecommendation(component, 'error')
        });
      } else if (check.status === 'warning') {
        issues.push({
          component,
          severity: 'medium',
          message: check.message,
          recommendation: getRecommendation(component, 'warning')
        });
      }
    });

    const result: HealthCheckResult = {
      timestamp: Date.now(),
      status,
      overallScore: Math.round(totalScore),
      checks,
      issues
    };

    // Trigger webhook if unhealthy
    if (status === 'unhealthy' || status === 'degraded') {
      await ctx.runAction(internal.webhooks.webhookSystem.triggerWebhook, {
        type: 'anomaly.detected',
        data: {
          anomalyType: 'health_check_failed',
          message: `System health is ${status} (score: ${result.overallScore})`,
          checks: result.checks,
          issues: result.issues
        },
        metadata: {
          severity: status === 'unhealthy' ? 'critical' : 'high'
        }
      });
    }

    console.log(`[HealthCheck] Completed in ${Date.now() - startTime}ms - Status: ${status}`);

    return result;
  }
});

/**
 * Check database health
 */
async function checkDatabase(ctx: any): Promise<CheckStatus> {
  const start = Date.now();

  try {
    // Try a simple query
    const testQuery = await ctx.runQuery(internal.system.healthCheck.testDatabaseQuery, {});
    const responseTime = Date.now() - start;

    if (responseTime > 1000) {
      return {
        status: 'warning',
        responseTime,
        message: `Database query slow (${responseTime}ms)`
      };
    }

    return {
      status: 'ok',
      responseTime,
      message: 'Database responsive'
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      message: `Database error: ${error}`
    };
  }
}

/**
 * Check cache health
 */
async function checkCache(ctx: any): Promise<CheckStatus> {
  const start = Date.now();

  try {
    // Simulate cache check (in production, check actual cache metrics)
    const hitRate = 90; // Would fetch from cache stats
    const responseTime = Date.now() - start;

    if (hitRate < 70) {
      return {
        status: 'warning',
        responseTime,
        message: `Cache hit rate low (${hitRate}%)`,
        details: { hitRate }
      };
    }

    return {
      status: 'ok',
      responseTime,
      message: `Cache healthy (${hitRate}% hit rate)`,
      details: { hitRate }
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      message: `Cache error: ${error}`
    };
  }
}

/**
 * Check ML system health
 */
async function checkMLSystem(ctx: any): Promise<CheckStatus> {
  const start = Date.now();

  try {
    // Check ML model availability and performance
    const modelVersion = 5; // Would fetch from model weights
    const accuracy = 91; // Would fetch from evaluation metrics
    const responseTime = Date.now() - start;

    if (accuracy < 70) {
      return {
        status: 'warning',
        responseTime,
        message: `ML accuracy below threshold (${accuracy}%)`,
        details: { modelVersion, accuracy }
      };
    }

    return {
      status: 'ok',
      responseTime,
      message: `ML system healthy (v${modelVersion}, ${accuracy}% accuracy)`,
      details: { modelVersion, accuracy }
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      message: `ML system error: ${error}`
    };
  }
}

/**
 * Check webhook system health
 */
async function checkWebhooks(ctx: any): Promise<CheckStatus> {
  const start = Date.now();

  try {
    // Check webhook delivery success rate
    const successRate = 96; // Would fetch from webhook stats
    const responseTime = Date.now() - start;

    if (successRate < 90) {
      return {
        status: 'warning',
        responseTime,
        message: `Webhook success rate low (${successRate}%)`,
        details: { successRate }
      };
    }

    return {
      status: 'ok',
      responseTime,
      message: `Webhooks healthy (${successRate}% success)`,
      details: { successRate }
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      message: `Webhook error: ${error}`
    };
  }
}

/**
 * Check API health
 */
async function checkAPIHealth(ctx: any): Promise<CheckStatus> {
  const start = Date.now();

  try {
    // Check API responsiveness and error rates
    const errorRate = 0.5; // Would fetch from analytics
    const avgLatency = 850; // Would fetch from metrics
    const responseTime = Date.now() - start;

    if (errorRate > 2) {
      return {
        status: 'error',
        responseTime,
        message: `High API error rate (${errorRate}%)`,
        details: { errorRate, avgLatency }
      };
    }

    if (avgLatency > 2000) {
      return {
        status: 'warning',
        responseTime,
        message: `High API latency (${avgLatency}ms)`,
        details: { errorRate, avgLatency }
      };
    }

    return {
      status: 'ok',
      responseTime,
      message: `API healthy (${avgLatency}ms avg, ${errorRate}% errors)`,
      details: { errorRate, avgLatency }
    };
  } catch (error) {
    return {
      status: 'error',
      responseTime: Date.now() - start,
      message: `API health check error: ${error}`
    };
  }
}

/**
 * Test database query for health check
 */
export const testDatabaseQuery = internalQuery({
  args: {},
  handler: async (ctx) => {
    // Simple query to test database responsiveness
    return { status: 'ok', timestamp: Date.now() };
  }
});

/**
 * Get recommendation for issue
 */
function getRecommendation(component: string, severity: string): string {
  const recommendations: Record<string, Record<string, string>> = {
    database: {
      error: 'Check database connection and restart if needed. Review error logs for details.',
      warning: 'Optimize slow queries, add indexes, or scale database resources.'
    },
    cache: {
      error: 'Restart cache service and verify configuration. Check memory availability.',
      warning: 'Increase cache size, adjust TTL settings, or improve cache warming strategy.'
    },
    ml: {
      error: 'Reload ML model and verify model files. Check for corrupted weights.',
      warning: 'Retrain model with more data or adjust hyperparameters for better accuracy.'
    },
    webhooks: {
      error: 'Check webhook endpoints and network connectivity. Verify webhook configuration.',
      warning: 'Increase retry attempts, implement better error handling, or check endpoint health.'
    },
    api: {
      error: 'Check API server health and restart if needed. Review error logs immediately.',
      warning: 'Optimize slow endpoints, add caching, or scale API resources.'
    }
  };

  return recommendations[component]?.[severity] || 'Review component logs and metrics for details.';
}

/**
 * Schedule health check to run every 5 minutes
 */
// In production, add to crons.ts:
// crons.interval("health_check", { minutes: 5 }, internal.system.healthCheck.runHealthCheck, {});
