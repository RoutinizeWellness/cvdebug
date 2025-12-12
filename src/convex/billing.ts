"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const createCheckoutSession = action({
  args: { 
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
    origin: v.optional(v.string()),
    resumeId: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized: Please log in.");

    const autumnSecretKey = process.env.AUTUMN_SECRET_KEY;
    if (!autumnSecretKey) {
      console.error("AUTUMN_SECRET_KEY is missing in environment variables");
      throw new Error("Configuration Error: Payment provider is not configured.");
    }

    const siteUrl = args.origin || process.env.CONVEX_SITE_URL;
    if (!siteUrl) {
      console.error("CONVEX_SITE_URL is missing and no origin provided");
      throw new Error("Configuration Error: Site URL is not configured.");
    }

    const user = await ctx.runQuery(internal.users.getInternalUser, {});
    if (!user) throw new Error("User not found in database.");
    if (!user.email) throw new Error("User email is required for billing.");

    // Build success URL with resumeId if provided
    const successUrl = args.resumeId 
      ? `${siteUrl}/dashboard?payment=success&plan=${args.plan}&resumeId=${args.resumeId}`
      : `${siteUrl}/dashboard?payment=success&plan=${args.plan}`;

    console.log(`Creating checkout session. Success URL: ${successUrl}`);

    const productId = args.plan;
    const customerId = user.subject;

    console.log(`Initiating Autumn checkout for ${args.plan} (Product: ${productId}, Customer: ${customerId})`);

    try {
      const response = await fetch("https://api.useautumn.com/v1/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${autumnSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          customer_email: user.email,
          customer_id: customerId,
          success_url: successUrl,
          cancel_url: `${siteUrl}/dashboard?payment=cancelled`,
          metadata: {
            userId: user._id,
            dbId: user.dbUser?._id,
            plan: args.plan,
            resumeId: args.resumeId,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Autumn API Error (${response.status}):`, errorText);
        throw new Error(`Payment provider error: ${errorText}`);
      }

      const data = (await response.json()) as { url?: string; checkout_url?: string };
      
      if (data.url) {
        return data.url;
      } else if (data.checkout_url) {
        return data.checkout_url;
      } else {
        console.error("Unexpected Autumn response format:", data);
        throw new Error("Invalid response from payment provider");
      }
    } catch (error: any) {
      console.error("Billing Action Error:", error);
      throw new Error(error.message || "Failed to create checkout session");
    }
  },
});

export const handleAutumnWebhook = internalAction({
  args: { body: v.string(), signature: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("Received Autumn Webhook:", args.body);
    
    try {
      const event = JSON.parse(args.body);
      
      if (event.type === "payment.succeeded" || event.type === "checkout.session.completed") {
        const data = event.data;
        const metadata = data.metadata || {};
        const { userId, plan } = metadata;
        
        if (userId && plan) {
          console.log(`Processing successful payment for user ${userId} with plan ${plan}`);
          
          await ctx.runMutation(internal.users.updateSubscription, {
            tokenIdentifier: userId,
            plan: plan as "single_scan" | "bulk_pack",
          });
          
          return { success: true };
        } else {
          console.warn("Webhook received but missing metadata (userId or plan)", data);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error processing webhook:", error);
      return { success: false };
    }
  }
});

export const handleCheckoutSuccess = action({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    console.log("Checkout success for session:", args.sessionId);
  }
});