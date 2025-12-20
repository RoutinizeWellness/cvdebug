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
    
    console.log("[Webhook] Received event:", payload.event);
    console.log("[Webhook] Payload data:", JSON.stringify(payload.data, null, 2));
    
    if (payload.event === "checkout.completed") {
      const { customer_id, product_id, metadata } = payload.data;
      
      console.log(`[Webhook] Processing checkout for customer_id: ${customer_id}, product_id: ${product_id}`);
      
      // customer_id from Autumn is the Clerk tokenIdentifier (identity.subject)
      // Map product_id to plan
      const productSingle = process.env.PRODUCT_SINGLE_SCAN || "single_scan";
      const productSprint = process.env.PRODUCT_INTERVIEW_SPRINT || "interview_sprint";
      
      let plan: "single_scan" | "interview_sprint";
      if (product_id === productSingle) {
        plan = "single_scan";
      } else if (product_id === productSprint) {
        plan = "interview_sprint";
      } else {
        console.error(`[Webhook] Unknown product_id: ${product_id}`);
        return new Response("Unknown product", { status: 400 });
      }

      console.log(`[Webhook] Mapped product to plan: ${plan}`);

      // Update user subscription and credits using customer_id as tokenIdentifier
      await ctx.runMutation(internalAny.users.updateSubscription, {
        tokenIdentifier: customer_id,
        plan: plan,
      });

      console.log(`[Webhook] Credits granted for ${customer_id}`);

      // If resumeId was passed in metadata, unlock that specific resume
      if (metadata?.resumeId) {
        console.log(`[Webhook] Unlocking resume ${metadata.resumeId} for ${customer_id}`);
        
        await ctx.runMutation(internalAny.resumes.unlockResumeAfterPurchase, {
          resumeId: metadata.resumeId,
          userId: customer_id,
        });
        
        console.log(`[Webhook] Resume unlocked successfully`);
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("Event not handled", { status: 200 });
  } catch (error: any) {
    console.error("[Webhook] Error:", error);
    return new Response(`Webhook error: ${error.message}`, { status: 400 });
  }
});