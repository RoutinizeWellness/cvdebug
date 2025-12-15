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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      throw new Error("Not authenticated");
    }

    const secretKey = process.env.AUTUMN_SECRET_KEY;
    if (!secretKey) {
      throw new Error("AUTUMN_SECRET_KEY not configured");
    }

    const prices = {
      single_scan: "price_single_scan_id",
      bulk_pack: "price_bulk_pack_id",
    };

    try {
      const response = await fetch("https://api.autumnpay.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          customer_email: identity.email,
          price_id: prices[args.plan],
          success_url: args.resumeId 
            ? `${args.origin}/dashboard?resumeId=${args.resumeId}&unlocked=true`
            : `${args.origin}/dashboard?payment=success`,
          cancel_url: `${args.origin}/dashboard?payment=cancelled`,
          metadata: {
            plan: args.plan,
            resumeId: args.resumeId || null,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Autumn API error: ${error}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      throw new Error(error.message || "Failed to create checkout session");
    }
  },
});
