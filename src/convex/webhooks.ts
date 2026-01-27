/**
 * Webhook System for Real-time Notifications
 *
 * Supports webhooks for:
 * - Resume analysis completion
 * - ML model updates
 * - Performance alerts
 * - User feedback
 * - System health changes
 */

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const http = httpRouter();

/**
 * Webhook for external integrations
 * POST /webhooks/analysis-complete
 */
http.route({
  path: "/webhooks/analysis-complete",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { resumeId, userId, score, analysisData } = body as any;

      // Validate payload
      if (!resumeId || !userId) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Process webhook
      console.log(`[Webhook] Analysis complete for resume ${resumeId}, score: ${score}`);

      // Send to notification service
      await ctx.runMutation(internal.notifications.sendAnalysisComplete, {
        resumeId,
        userId,
        score: score || 0,
        timestamp: Date.now()
      });

      return new Response(
        JSON.stringify({ success: true, message: "Webhook received" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error: any) {
      console.error("[Webhook] Error processing analysis-complete:", error);
      return new Response(
        JSON.stringify({ error: "Internal server error", message: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  })
});

/**
 * Webhook for ML model performance alerts
 * POST /webhooks/ml-alert
 */
http.route({
  path: "/webhooks/ml-alert",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { alertType, severity, message, metrics } = body as any;

      console.log(`[Webhook] ML Alert: ${alertType} (${severity}) - ${message}`);

      // Store alert
      await ctx.runMutation(internal.monitoring.recordAlert, {
        alertType,
        severity,
        message,
        metrics: metrics || {},
        timestamp: Date.now()
      });

      // Send notification to admins if critical
      if (severity === "critical") {
        await ctx.runMutation(internal.notifications.notifyAdmins, {
          subject: `Critical ML Alert: ${alertType}`,
          message,
          priority: "high"
        });
      }

      return new Response(
        JSON.stringify({ success: true, alertRecorded: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error: any) {
      console.error("[Webhook] Error processing ml-alert:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  })
});

/**
 * Webhook for user feedback
 * POST /webhooks/feedback
 */
http.route({
  path: "/webhooks/feedback",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { resumeId, userId, rating, feedback, helpful } = body as any;

      console.log(`[Webhook] Feedback received - Resume: ${resumeId}, Rating: ${rating}/5`);

      // Store feedback for ML learning
      await ctx.runMutation(internal.feedback.recordFeedback, {
        resumeId,
        userId,
        rating: rating || 0,
        feedback: feedback || "",
        helpful: helpful || false,
        timestamp: Date.now()
      });

      // Trigger ML model learning from significant feedback
      if (rating <= 2 || rating >= 4) {
        console.log(`[Webhook] Significant feedback received for resume ${resumeId}: ${rating}/5`);

        // Schedule background model update (non-blocking)
        await ctx.scheduler.runAfter(0, internal.ml.learningEngine.learnFromFeedback, {
          resumeId,
          rating,
          feedback: feedback || "",
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: "Thank you for your feedback!" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error: any) {
      console.error("[Webhook] Error processing feedback:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  })
});

/**
 * Health check endpoint
 * GET /webhooks/health
 */
http.route({
  path: "/webhooks/health",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response(
      JSON.stringify({
        status: "healthy",
        timestamp: Date.now(),
        version: "1.0.0",
        uptime: process.uptime ? process.uptime() : 0
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  })
});

export default http;
