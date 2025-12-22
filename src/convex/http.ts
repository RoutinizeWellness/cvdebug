import { httpRouter } from "convex/server";
import { handleWebhook } from "./billing";
import { httpAction } from "./_generated/server";

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
      const payload = await req.json();
      const eventType = payload.type;

      console.log(`[Clerk Webhook] ✅ Received event: ${eventType}`);
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