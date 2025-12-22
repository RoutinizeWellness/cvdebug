import { httpRouter } from "convex/server";
import { handleWebhook } from "./billing";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";

const http = httpRouter();

// Autumn webhook for payments
http.route({
  path: "/autumn-webhook",
  method: "POST",
  handler: handleWebhook,
});

// Clerk webhook for user synchronization
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      // Get the webhook signing secret from environment
      const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.error("[Clerk Webhook] ⚠️ CLERK_WEBHOOK_SECRET not configured");
        return new Response(JSON.stringify({ 
          error: "Webhook secret not configured" 
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get the headers
      const svix_id = req.headers.get("svix-id");
      const svix_timestamp = req.headers.get("svix-timestamp");
      const svix_signature = req.headers.get("svix-signature");

      if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error("[Clerk Webhook] ⚠️ Missing svix headers");
        return new Response(JSON.stringify({ 
          error: "Missing svix headers" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get the body
      const body = await req.text();

      // Verify the webhook signature
      const wh = new Webhook(webhookSecret);
      let payload: any;

      try {
        payload = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        });
      } catch (err: any) {
        console.error("[Clerk Webhook] ❌ Signature verification failed:", err.message);
        return new Response(JSON.stringify({ 
          error: "Invalid signature" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const eventType = payload.type;

      console.log(`[Clerk Webhook] ✅ Received verified event: ${eventType}`);
      console.log(`[Clerk Webhook] Payload:`, JSON.stringify(payload, null, 2));

      if (eventType === "user.created" || eventType === "user.updated") {
        const user = payload.data;
        
        // Extract user data
        const userId = user.id;
        const email = user.email_addresses?.[0]?.email_address || "";
        const firstName = user.first_name || "";
        const lastName = user.last_name || "";
        const name = `${firstName} ${lastName}`.trim() || email.split("@")[0];
        
        console.log(`[Clerk Webhook] 📧 Processing user: ${email} (${userId})`);
        console.log(`[Clerk Webhook] ℹ️ Note: User will be created on first login via UserSyncer component`);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Webhook received successfully",
        eventType 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("[Clerk Webhook] ❌ Error:", error);
      console.error("[Clerk Webhook] Stack:", error.stack);
      return new Response(JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;