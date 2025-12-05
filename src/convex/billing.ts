"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const createCheckoutSession = action({
  args: { plan: v.union(v.literal("pro"), v.literal("team")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Autumn Integration
    // You need to configure your Autumn Secret Key and Product IDs in the dashboard
    const autumnSecretKey = process.env.AUTUMN_SECRET_KEY;
    if (!autumnSecretKey) throw new Error("AUTUMN_SECRET_KEY is not set");

    // TODO: Replace with actual Autumn API call
    // Example:
    // const response = await fetch("https://api.useautumn.com/v1/checkout", {
    //   method: "POST",
    //   headers: { "Authorization": `Bearer ${autumnSecretKey}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({ ... })
    // });
    
    console.log("Initiating Autumn checkout for:", args.plan);
    
    // For now, returning a placeholder or error until configured
    throw new Error("Autumn integration needs to be fully configured with Product IDs.");
  },
});

export const handleCheckoutSuccess = action({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    // Handle Autumn webhook or success callback here
  }
});