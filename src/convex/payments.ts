"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";

export const createCheckoutSession = action({
  args: { plan: v.string() },
  handler: async (ctx, args) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const domain = process.env.CONVEX_SITE_URL || "http://localhost:5173";
    const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
    const teamPriceId = process.env.STRIPE_PRICE_ID_TEAM;

    if (!stripeKey) {
      throw new Error("Stripe API key not configured (STRIPE_SECRET_KEY)");
    }

    // Initialize Stripe without a specific API version to use the account default or SDK default
    const stripe = new Stripe(stripeKey);

    let priceId;
    if (args.plan === "pro") {
        priceId = proPriceId;
    } else if (args.plan === "team") {
        priceId = teamPriceId;
    }

    if (!priceId) {
        throw new Error(`Price ID for ${args.plan} plan not configured in environment variables (STRIPE_PRICE_ID_PRO or STRIPE_PRICE_ID_TEAM).`);
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${domain}/dashboard?success=true`,
        cancel_url: `${domain}/dashboard?canceled=true`,
      });

      return session.url;
    } catch (error: any) {
      console.error("Stripe error:", error.message);
      throw new Error(`Stripe error: ${error.message}`);
    }
  },
});