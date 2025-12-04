import { query, mutation, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Get the current signed in user identity. Returns null if the user is not signed in.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();
      
    // Prefer the local DB subscription tier, but fallback to "free"
    // In a full Clerk integration, we might also check identity.tokenParsed.public_metadata
    return {
      ...identity,
      subscriptionTier: user?.subscriptionTier || "free",
    };
  },
});

export const upgradePlan = action({
  args: { plan: v.union(v.literal("free"), v.literal("pro"), v.literal("team")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error("CLERK_SECRET_KEY is not set. Please set it in the Convex dashboard.");
    }

    // Update Clerk Metadata
    const response = await fetch(`https://api.clerk.com/v1/users/${identity.subject}/metadata`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${clerkSecretKey}`,
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

    // Update Local DB
    await ctx.runMutation(internal.users.updateSubscription, {
      tokenIdentifier: identity.subject,
      plan: args.plan,
    });
  },
});

export const updateSubscription = internalMutation({
  args: { 
    tokenIdentifier: v.string(), 
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("team")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, { subscriptionTier: args.plan });
    } else {
      // Should not happen if user is created on login, but safe to handle
      // We need to get email/name from somewhere if creating, but for now just patch if exists
      // or insert minimal
       const identity = await ctx.auth.getUserIdentity();
       if (identity && identity.subject === args.tokenIdentifier) {
          await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: identity.email,
            name: identity.name,
            subscriptionTier: args.plan,
          });
       }
    }
  },
});

/**
 * Use this function internally to get the current user data.
 */
export const getCurrentUser = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return {
    _id: identity.subject, // Use the subject (Clerk ID) as the ID
    ...identity,
  };
};