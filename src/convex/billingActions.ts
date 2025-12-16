"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { Autumn } from "autumn-js";

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

      // Initialize Autumn SDK with configuration object
      const autumn = new Autumn({ secretKey });

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

      // Call Autumn SDK checkout method
      const response = await autumn.checkout({
        customer_id: identity.subject, // Use Clerk's subject as customer_id
        product_id: productId,
        success_url: args.resumeId 
          ? `${args.origin}/dashboard?resumeId=${args.resumeId}&unlocked=true`
          : `${args.origin}/dashboard?payment=success`,
        customer_data: {
          email: identity.email,
          name: identity.name || identity.email,
        },
      });

      console.log("[Billing] Autumn response:", response);

      // Handle Result type from Autumn SDK
      if (response.error) {
        console.error("[Billing] Autumn checkout failed:", response.error);
        throw new Error(response.error?.message || "Failed to create checkout session");
      }

      if (!response.data?.url) {
        console.error("[Billing] No checkout URL in response:", response);
        throw new Error("Invalid response from payment provider: Missing checkout URL");
      }
      
      return response.data.url;
    } catch (error: any) {
      console.error("[Billing] Checkout error:", error);
      // Ensure the error message is propagated
      throw new Error(error.message || "Failed to create checkout session");
    }
  },
});