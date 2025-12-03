"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

export const createCheckoutSession = action({
  args: { plan: v.union(v.literal("pro"), v.literal("team")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover",
    });

    const domain = process.env.CONVEX_SITE_URL || "http://localhost:5173";
    
    const priceId = args.plan === "pro" 
      ? process.env.STRIPE_PRICE_ID_PRO 
      : process.env.STRIPE_PRICE_ID_TEAM;

    if (!priceId) throw new Error("Price ID not configured");

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${domain}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/dashboard`,
      metadata: {
        userId: identity.subject,
        plan: args.plan,
      },
    });

    return session.url;
  },
});

export const handleCheckoutSuccess = action({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover",
    });

    const session = await stripe.checkout.sessions.retrieve(args.sessionId);

    if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
       const plan = session.metadata?.plan as "pro" | "team";
       const userId = session.metadata?.userId;
       
       if (plan && userId) {
         if (userId !== identity.subject) {
            throw new Error("User mismatch");
         }

         await ctx.runMutation(internal.users.updateSubscription, {
           tokenIdentifier: userId,
           plan: plan,
         });
       }
    }
  }
});