/**
 * Test Webhook System
 * Script to test webhook registration and triggering
 */

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

/**
 * Test webhook system by registering and triggering events
 */
export const testWebhookSystem = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    console.log("[Test] Starting webhook system test...");

    // Step 1: Register a test webhook
    console.log("[Test] Registering test webhook...");
    const webhookId = await ctx.runMutation(internal.webhooks.webhookSystem.registerWebhook, {
      url: "https://webhook.site/test-endpoint",
      events: ["analysis.completed", "anomaly.detected"],
      secret: "test_secret_key_123",
      maxRetries: 3,
      filters: {
        severity: "high"
      }
    });

    console.log(`[Test] Webhook registered with ID: ${webhookId}`);

    // Step 2: Trigger a test event (analysis.completed)
    console.log("[Test] Triggering analysis.completed event...");
    const result1 = await ctx.runAction(internal.webhooks.webhookSystem.triggerWebhook, {
      type: "analysis.completed",
      data: {
        resumeId: "test_resume_123",
        score: 85,
        analysisTime: 1250
      },
      metadata: {
        userId: "test_user_456",
        resumeId: "test_resume_123",
        severity: "low"
      }
    });

    console.log(`[Test] Event triggered: ${result1.eventId}, webhooks: ${result1.webhooksTriggered}`);

    // Step 3: Trigger a high severity anomaly event (should match filter)
    console.log("[Test] Triggering high severity anomaly event...");
    const result2 = await ctx.runAction(internal.webhooks.webhookSystem.triggerWebhook, {
      type: "anomaly.detected",
      data: {
        anomalyType: "high_latency",
        message: "Analysis latency exceeded 3000ms",
        affectedCount: 15
      },
      metadata: {
        severity: "high"
      }
    });

    console.log(`[Test] Anomaly event triggered: ${result2.eventId}, webhooks: ${result2.webhooksTriggered}`);

    // Step 4: Trigger model updated event
    console.log("[Test] Triggering model.updated event...");
    const result3 = await ctx.runAction(internal.webhooks.webhookSystem.notifyModelUpdated, {
      modelVersion: 5,
      accuracy: 91.5,
      trainingExamples: 3500
    });

    console.log("[Test] Model update notification sent");

    return {
      success: true,
      webhookId,
      events: [
        { type: "analysis.completed", eventId: result1.eventId, triggered: result1.webhooksTriggered },
        { type: "anomaly.detected", eventId: result2.eventId, triggered: result2.webhooksTriggered },
        { type: "model.updated", triggered: true }
      ]
    };
  }
});

/**
 * List all registered webhooks
 */
export const listWebhooks = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    const webhooks = await ctx.runMutation(internal.webhooks.webhookSystem.getMatchingWebhooks, {
      eventType: "analysis.completed"
    });

    console.log(`[Test] Found ${webhooks.length} webhooks`);

    for (const webhook of webhooks) {
      console.log(`[Test] Webhook:`, {
        id: webhook._id,
        url: webhook.url,
        events: webhook.events,
        enabled: webhook.enabled,
        successCount: webhook.successCount,
        failureCount: webhook.failureCount
      });
    }

    return webhooks;
  }
});

/**
 * Generate test analytics data
 */
export const generateTestAnalytics = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    console.log("[Test] Generating test analytics data...");

    const industries = ["technology", "healthcare", "finance", "sales", "marketing"];
    const events: Array<{ eventId: string; score: number; industry: string; latency: number }> = [];

    // Generate 50 test analysis events
    for (let i = 0; i < 50; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const score = 50 + Math.random() * 50; // Score between 50-100
      const latency = 800 + Math.random() * 2000; // Latency between 800-2800ms

      const result = await ctx.runAction(internal.webhooks.webhookSystem.triggerWebhook, {
        type: "analysis.completed",
        data: {
          resumeId: `test_resume_${i}`,
          score: Math.round(score),
          analysisTime: Math.round(latency),
          industry
        },
        metadata: {
          userId: `test_user_${i % 10}`,
          resumeId: `test_resume_${i}`,
          severity: score < 60 ? "high" : score < 75 ? "medium" : "low"
        }
      });

      events.push({
        eventId: result.eventId,
        score: Math.round(score),
        industry,
        latency: Math.round(latency)
      });

      // Add small delay to spread timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log(`[Test] Generated ${events.length} test events`);

    return {
      success: true,
      eventsGenerated: events.length,
      summary: {
        averageScore: events.reduce((sum, e) => sum + e.score, 0) / events.length,
        averageLatency: events.reduce((sum, e) => sum + e.latency, 0) / events.length,
        industries: industries.map(ind => ({
          industry: ind,
          count: events.filter(e => e.industry === ind).length
        }))
      }
    };
  }
});
