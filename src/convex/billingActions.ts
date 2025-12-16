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

      // Use env vars for prices, or default to the plan names as requested
      const priceSingle = process.env.PRICE_SINGLE_SCAN || "single_scan";
      const priceBulk = process.env.PRICE_BULK_PACK || "bulk_pack";

      const prices = {
        single_scan: priceSingle,
        bulk_pack: priceBulk,
      };

      const priceId = prices[args.plan];
      console.log(`[Billing] Creating session for ${args.plan} with price ${priceId}`);
      console.log(`[Billing] Origin: ${args.origin}`);

      const payload = {
        customer_email: identity.email,
        price_id: priceId,
        success_url: args.resumeId 
          ? `${args.origin}/dashboard?resumeId=${args.resumeId}&unlocked=true`
          : `${args.origin}/dashboard?payment=success`,
        cancel_url: `${args.origin}/dashboard?payment=cancelled`,
        metadata: {
          plan: args.plan,
          resumeId: args.resumeId || null,
        },
      };

      console.log("[Billing] Sending payload to Autumn:", JSON.stringify(payload, null, 2));

      const response = await fetch("https://api.useautumn.com/v1/checkout/sessions", {
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