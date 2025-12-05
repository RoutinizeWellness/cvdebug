"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const createCheckoutSession = action({
  args: { plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")) },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const autumnSecretKey = process.env.AUTUMN_SECRET_KEY;
    if (!autumnSecretKey) throw new Error("AUTUMN_SECRET_KEY is not set");

    const user = await ctx.runQuery(internal.users.getInternalUser, {});
    if (!user) throw new Error("User not found");

    // Map internal plan names to Autumn Product IDs
    // User specified: bulk_pack -> bulk_pack, single_scan -> single_scan
    const productId = args.plan;

    console.log(`Initiating Autumn checkout for ${args.plan} (Product ID: ${productId})`);

    try {
      const siteUrl = process.env.CONVEX_SITE_URL;
      if (!siteUrl) throw new Error("CONVEX_SITE_URL is not set");

      // Create a checkout session with Autumn
      // Using the standard Autumn API endpoint for creating checkout sessions
      const response = await fetch("https://api.useautumn.com/v1/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${autumnSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          customer_email: user.email,
          customer_id: user.tokenIdentifier, // Use tokenIdentifier as customer ID
          success_url: `${siteUrl}/dashboard?payment=success&plan=${args.plan}`,
          cancel_url: `${siteUrl}/dashboard?payment=cancelled`,
          metadata: {
            userId: user._id,
            plan: args.plan,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Autumn API Error:", errorText);
        throw new Error(`Autumn API error: ${response.status} ${errorText}`);
      }

      const data = (await response.json()) as { url?: string; checkout_url?: string };
      
      // Assuming Autumn returns a checkout_url or url
      if (data.url) {
        return data.url;
      } else if (data.checkout_url) {
        return data.checkout_url;
      } else {
        console.error("Unexpected Autumn response:", data);
        throw new Error("Invalid response from payment provider");
      }
    } catch (error: any) {
      console.error("Billing Error:", error);
      // Throw the actual error message so it can be seen in the UI/Logs
      throw new Error(`Billing Error: ${error.message}`);
    }
  },
});

export const handleCheckoutSuccess = action({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    // Handle Autumn webhook or success callback here
  }
});