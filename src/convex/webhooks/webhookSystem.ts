/**
 * Webhook System v1.0
 *
 * Real-time event notifications for:
 * - Resume analysis completion
 * - Model training updates
 * - System health alerts
 * - User feedback events
 * - Performance anomalies
 */

import { v } from "convex/values";
import { internalMutation, internalAction } from "../_generated/server";

export interface WebhookEvent {
  id: string;
  type:
    | 'analysis.completed'
    | 'analysis.failed'
    | 'model.updated'
    | 'model.performance_degraded'
    | 'cache.cleared'
    | 'anomaly.detected'
    | 'feedback.received'
    | 'user.upgraded';
  timestamp: number;
  data: Record<string, any>;
  metadata?: {
    userId?: string;
    resumeId?: string;
    modelVersion?: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEvent['type'][];
  enabled: boolean;
  secret?: string;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  filters?: {
    userId?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };
  createdAt: number;
  lastTriggered?: number;
  successCount: number;
  failureCount: number;
}

/**
 * Register a webhook subscription
 */
export const registerWebhook = internalMutation({
  args: {
    url: v.string(),
    events: v.array(v.string()),
    secret: v.optional(v.string()),
    maxRetries: v.optional(v.number()),
    filters: v.optional(v.object({
      userId: v.optional(v.string()),
      severity: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    const webhookId = await ctx.db.insert("webhooks", {
      url: args.url,
      events: args.events as WebhookEvent['type'][],
      enabled: true,
      secret: args.secret,
      retryPolicy: {
        maxRetries: args.maxRetries || 3,
        backoffMs: 1000
      },
      filters: args.filters || {},
      createdAt: Date.now(),
      successCount: 0,
      failureCount: 0
    });

    console.log(`[Webhook] Registered webhook ${webhookId} for events: ${args.events.join(', ')}`);
    return webhookId;
  }
});

/**
 * Trigger a webhook event
 */
export const triggerWebhook = internalAction({
  args: {
    type: v.string(),
    data: v.any(),
    metadata: v.optional(v.object({
      userId: v.optional(v.string()),
      resumeId: v.optional(v.string()),
      modelVersion: v.optional(v.number()),
      severity: v.optional(v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      ))
    }))
  },
  handler: async (ctx, args) => {
    const event: WebhookEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: args.type as WebhookEvent['type'],
      timestamp: Date.now(),
      data: args.data,
      metadata: args.metadata
    };

    console.log(`[Webhook] Triggering event: ${event.type}`);

    // Get all matching webhooks
    const webhooks = await ctx.runQuery(require("../_generated/api").internal.webhooks.webhookSystem.getMatchingWebhooks, {
      eventType: event.type,
      userId: event.metadata?.userId,
      severity: event.metadata?.severity
    });

    console.log(`[Webhook] Found ${webhooks.length} matching webhooks`);

    // Send to each webhook
    for (const webhook of webhooks) {
      await ctx.scheduler.runAfter(0, require("../_generated/api").internal.webhooks.webhookSystem.sendWebhook, {
        webhookId: webhook._id,
        event
      });
    }

    return { eventId: event.id, webhooksTriggered: webhooks.length };
  }
});

/**
 * Get matching webhooks for an event
 */
export const getMatchingWebhooks = internalMutation({
  args: {
    eventType: v.string(),
    userId: v.optional(v.string()),
    severity: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ))
  },
  handler: async (ctx, args) => {
    // OPTIMIZED: Use index instead of filter for better performance
    const allWebhooks = await ctx.db
      .query("webhooks")
      .withIndex("by_enabled", (q) => q.eq("enabled", true))
      .collect();

    // Filter webhooks that match the event
    return allWebhooks.filter(webhook => {
      // Check if webhook subscribes to this event type
      if (!webhook.events.includes(args.eventType as any)) {
        return false;
      }

      // Apply filters if present
      if (webhook.filters) {
        if (webhook.filters.userId && webhook.filters.userId !== args.userId) {
          return false;
        }
        if (webhook.filters.severity && webhook.filters.severity !== args.severity) {
          return false;
        }
      }

      return true;
    });
  }
});

/**
 * Send webhook with retries
 */
export const sendWebhook = internalAction({
  args: {
    webhookId: v.id("webhooks"),
    event: v.any()
  },
  handler: async (ctx, args) => {
    const webhook = await ctx.runQuery(require("../_generated/api").internal.webhooks.webhookSystem.getWebhook, {
      id: args.webhookId
    });

    if (!webhook) {
      console.error(`[Webhook] Webhook ${args.webhookId} not found`);
      return;
    }

    const event = args.event as WebhookEvent;
    let attempt = 0;
    let success = false;

    while (attempt < webhook.retryPolicy.maxRetries && !success) {
      attempt++;

      try {
        console.log(`[Webhook] Sending to ${webhook.url} (attempt ${attempt}/${webhook.retryPolicy.maxRetries})`);

        // Build payload with signature
        const payload = {
          event_id: event.id,
          event_type: event.type,
          timestamp: event.timestamp,
          data: event.data,
          metadata: event.metadata
        };

        const signature = webhook.secret
          ? await generateSignature(payload, webhook.secret)
          : undefined;

        // Send HTTP request
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature || '',
            'X-Event-Type': event.type,
            'X-Event-ID': event.id
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          success = true;
          console.log(`[Webhook] Successfully sent to ${webhook.url}`);

          // Update success count
          await ctx.runMutation(require("../_generated/api").internal.webhooks.webhookSystem.updateWebhookStats, {
            webhookId: args.webhookId,
            success: true
          });
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error: any) {
        console.error(`[Webhook] Failed to send to ${webhook.url} (attempt ${attempt}):`, error.message);

        if (attempt < webhook.retryPolicy.maxRetries) {
          // Exponential backoff
          const delay = webhook.retryPolicy.backoffMs * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (!success) {
      // Update failure count
      await ctx.runMutation(require("../_generated/api").internal.webhooks.webhookSystem.updateWebhookStats, {
        webhookId: args.webhookId,
        success: false
      });

      // Disable webhook after too many failures
      const webhook = await ctx.runQuery(require("../_generated/api").internal.webhooks.webhookSystem.getWebhook, {
        id: args.webhookId
      });

      if (webhook && webhook.failureCount > 50) {
        console.warn(`[Webhook] Disabling webhook ${args.webhookId} after ${webhook.failureCount} failures`);
        await ctx.runMutation(require("../_generated/api").internal.webhooks.webhookSystem.disableWebhook, {
          webhookId: args.webhookId
        });
      }
    }
  }
});

/**
 * Get webhook by ID
 */
export const getWebhook = internalMutation({
  args: { id: v.id("webhooks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

/**
 * Update webhook statistics
 */
export const updateWebhookStats = internalMutation({
  args: {
    webhookId: v.id("webhooks"),
    success: v.boolean()
  },
  handler: async (ctx, args) => {
    const webhook = await ctx.db.get(args.webhookId);
    if (!webhook) return;

    await ctx.db.patch(args.webhookId, {
      lastTriggered: Date.now(),
      successCount: args.success ? webhook.successCount + 1 : webhook.successCount,
      failureCount: args.success ? webhook.failureCount : webhook.failureCount + 1
    });
  }
});

/**
 * Disable webhook
 */
export const disableWebhook = internalMutation({
  args: { webhookId: v.id("webhooks") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.webhookId, { enabled: false });
  }
});

/**
 * Generate HMAC signature for webhook verification
 */
async function generateSignature(payload: any, secret: string): Promise<string> {
  const payloadString = JSON.stringify(payload);

  // Use Web Crypto API for signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadString)
  );

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Helper functions for common webhook events
 */

export const notifyAnalysisCompleted = internalAction({
  args: {
    resumeId: v.string(),
    userId: v.string(),
    score: v.number(),
    analysisTime: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.runAction(require("../_generated/api").internal.webhooks.webhookSystem.triggerWebhook, {
      type: 'analysis.completed',
      data: {
        resumeId: args.resumeId,
        score: args.score,
        analysisTime: args.analysisTime
      },
      metadata: {
        userId: args.userId,
        resumeId: args.resumeId,
        severity: args.score < 50 ? 'high' : args.score < 70 ? 'medium' : 'low'
      }
    });
  }
});

export const notifyModelUpdated = internalAction({
  args: {
    modelVersion: v.number(),
    accuracy: v.number(),
    trainingExamples: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.runAction(require("../_generated/api").internal.webhooks.webhookSystem.triggerWebhook, {
      type: 'model.updated',
      data: {
        modelVersion: args.modelVersion,
        accuracy: args.accuracy,
        trainingExamples: args.trainingExamples
      },
      metadata: {
        modelVersion: args.modelVersion,
        severity: 'low'
      }
    });
  }
});

export const notifyAnomalyDetected = internalAction({
  args: {
    anomalyType: v.string(),
    severity: v.string(),
    message: v.string(),
    affectedCount: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.runAction(require("../_generated/api").internal.webhooks.webhookSystem.triggerWebhook, {
      type: 'anomaly.detected',
      data: {
        anomalyType: args.anomalyType,
        message: args.message,
        affectedCount: args.affectedCount
      },
      metadata: {
        severity: args.severity as any
      }
    });
  }
});
