"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
export const upgradePlan = action({
  args: { plan: v.union(v.literal("free"), v.literal("pro"), v.literal("team")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("CLERK_SECRET_KEY is not set");
    }

    try {
      const response = await fetch(`https://api.clerk.com/v1/users/${identity.subject}/metadata`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_metadata: {
            subscriptionTier: args.plan,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Clerk API Error:", errorText);
        throw new Error(`Failed to update Clerk metadata: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Clerk metadata update failed:", error);
      throw new Error("Failed to update subscription with Clerk");
    }

    await ctx.runMutation(internal.users.updateSubscription, {
      tokenIdentifier: identity.subject,
      plan: args.plan,
    });
  },
});
