import { httpAction } from "./_generated/server";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

export const handleWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("autumn-signature");
  const body = await request.text();

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const secretKey = process.env.AUTUMN_SECRET_KEY;
  if (!secretKey) {
    console.error("AUTUMN_SECRET_KEY not configured");
    return new Response("Server configuration error", { status: 500 });
  }

  try {
    const payload = JSON.parse(body);
    
    if (payload.event === "checkout.completed") {
      const { customer_email, plan, metadata } = payload.data;
      
      // Get the user who just purchased
      const user = await ctx.runQuery(internalAny.users.getUserByEmail, {
        email: customer_email,
      });

      if (!user) {
        console.error(`[Webhook] User not found: ${customer_email}`);
        return new Response("User not found", { status: 404 });
      }

      // Update user subscription and credits
        await ctx.runMutation(internalAny.users.updateSubscription, {
        tokenIdentifier: user.tokenIdentifier,
        plan: plan as "single_scan" | "bulk_pack",
      });

      // If resumeId was passed in metadata, unlock that specific resume
      if (metadata?.resumeId && user) {
        console.log(`[Webhook] Unlocking resume ${metadata.resumeId} for ${customer_email}`);
        
        // Unlock the resume details immediately after purchase
        await ctx.runMutation(internalAny.resumes.unlockResumeAfterPurchase, {
          resumeId: metadata.resumeId,
          userId: user.tokenIdentifier,
        });
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("Event not handled", { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});