import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

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
      
    return {
      ...identity,
      subscriptionTier: user?.subscriptionTier || "free",
    };
  },
});

export const upgradePlan = mutation({
  args: { plan: v.union(v.literal("pro"), v.literal("team")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, { subscriptionTier: args.plan });
    } else {
      await ctx.db.insert("users", {
        tokenIdentifier: identity.subject,
        email: identity.email,
        name: identity.name,
        subscriptionTier: args.plan,
      });
    }
  },
});

/**
 * Use this function internally to get the current user data.
 */
export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }
  return {
    _id: identity.subject, // Use the subject (Clerk ID) as the ID
    ...identity,
  };
};