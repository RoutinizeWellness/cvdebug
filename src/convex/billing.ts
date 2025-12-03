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

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-11-17.clover",
    });

    const domain = process.env.CONVEX_SITE_URL || "http://localhost:5173";
    
    const priceId = args.plan === "pro" 
      ? process.env.STRIPE_PRICE_ID_PRO 
      : process.env.STRIPE_PRICE_ID_TEAM;

    if (!priceId) throw new Error("Price ID not configured for this plan");

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

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, {
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

         // 1. Update Clerk Metadata
         await updateClerkMetadata(userId, plan);

         // 2. Update Local DB
         await ctx.runMutation(internal.users.updateSubscription, {
           tokenIdentifier: userId,
           plan: plan,
         });
       }
    }
  }
});

export const downgradeSubscription = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // 1. Update Clerk Metadata
    await updateClerkMetadata(identity.subject, "free");

    // 2. Update Local DB
    await ctx.runMutation(internal.users.updateSubscription, {
      tokenIdentifier: identity.subject,
      plan: "free",
    });
  }
});

async function updateClerkMetadata(userId: string, plan: string) {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error("CLERK_SECRET_KEY is not set");
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${clerkSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: {
          subscriptionTier: plan,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Clerk API Error:", errorText);
      throw new Error(`Failed to update Clerk metadata: ${response.statusText}`);
    }
}