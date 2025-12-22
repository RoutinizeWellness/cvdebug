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
    const payload = await req.json();
    const eventType = payload.type;

    console.log(`[Clerk Webhook] Received event: ${eventType}`);

    try {
      if (eventType === "user.created" || eventType === "user.updated") {
        const user = payload.data;
        
        // Extract user data
        const userId = user.id;
        const email = user.email_addresses?.[0]?.email_address || "";
        const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || email.split("@")[0];
        
        // Check if user exists
        const existingUser = await ctx.runQuery(require("./_generated/api").internal.users.getUserInternal, {
          subject: userId,
        });

        if (!existingUser) {
          // Create new user
          await ctx.runMutation(require("./_generated/api").internal.users.createUserInternal, {
            tokenIdentifier: userId,
            email,
            name,
          });
          console.log(`[Clerk Webhook] Created user: ${email}`);
        } else {
          // Update existing user
          await ctx.runMutation(require("./_generated/api").internal.users.updateUserInternal, {
            userId: existingUser._id,
            email,
            name,
          });
          console.log(`[Clerk Webhook] Updated user: ${email}`);
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("[Clerk Webhook] Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;