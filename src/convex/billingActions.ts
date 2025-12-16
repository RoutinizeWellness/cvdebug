"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

export const createCheckoutSession = action({
  args: {
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
    origin: v.string(),
    resumeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      console.log("[Billing] Auth Identity:", JSON.stringify(identity, null, 2));

      if (!identity) {
        console.error("[Billing] No user identity found (identity is null)");
        throw new Error("Not authenticated - Please log in again");
      }

      if (!identity.email) {
        console.error("[Billing] User identity has no email:", JSON.stringify(identity));
        throw new Error("Not authenticated - Email missing from profile");
      }

      const secretKey = process.env.AUTUMN_SECRET_KEY?.trim();
      if (!secretKey) {
        console.error("[Billing] AUTUMN_SECRET_KEY is missing");
        throw new Error("Configuration error: Payment system not set up");
      }

      // Autumn expects product_id, not price_id
      // Use env vars for product IDs, or default to the plan names
      const productSingle = process.env.PRODUCT_SINGLE_SCAN || "single_scan";
      const productBulk = process.env.PRODUCT_BULK_PACK || "bulk_pack";

      const products = {
        single_scan: productSingle,
        bulk_pack: productBulk,
      };

      const productId = products[args.plan];
      console.log(`[Billing] Creating session for ${args.plan} with product ${productId}`);
      console.log(`[Billing] Origin: ${args.origin}`);

      // Autumn API expects customer_id and product_id
      const payload = {
        customer_id: identity.subject, // Use Clerk's subject as customer_id
        product_id: productId,
        success_url: args.resumeId 
          ? `${args.origin}/dashboard?resumeId=${args.resumeId}&unlocked=true`
          : `${args.origin}/dashboard?payment=success`,
        cancel_url: `${args.origin}/dashboard?payment=cancelled`,
        customer_data: {
          email: identity.email,
          name: identity.name || identity.email,
        },
      };

      console.log("[Billing] Sending payload to Autumn:", JSON.stringify(payload, null, 2));

      // Correct Autumn API endpoint: /checkout (not /v1/checkout/sessions)
      const response = await fetch("https://api.useautumn.com/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretKey}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log(`[Billing] Autumn Response Status: ${response.status}`);
      console.log(`[Billing] Autumn Response Body: ${responseText}`);

      if (!response.ok) {
        throw new Error(`Payment provider error (${response.status}): ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("[Billing] Failed to parse JSON response:", responseText);
        throw new Error("Invalid JSON response from payment provider");
      }

      console.log("[Billing] Autumn response:", data);

      if (!data.url) {
        console.error("[Billing] No checkout URL in response:", data);
        throw new Error("Invalid response from payment provider: Missing checkout URL");
      }
      
      return data.url;
    } catch (error: any) {
      console.error("[Billing] Checkout error:", error);
      // Ensure the error message is propagated
      throw new Error(error.message || "Failed to create checkout session");
    }
  },
});