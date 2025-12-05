import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
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
    // Default credits to 1 for new users (Free tier)
    return {
      ...identity,
      subscriptionTier: user?.subscriptionTier || "free",
      credits: user?.credits ?? 1,
      trialEndsOn: user?.trialEndsOn,
      _id: user?._id,
    };
  },
});

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Check if we've already stored this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this user before but their name/email has changed, update it.
      if (user.name !== identity.name || user.email !== identity.email) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
        });
      }
      return user._id;
    }

    // If it's a new user, create them in the database
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.subject,
      name: identity.name,
      email: identity.email,
      subscriptionTier: "free",
      credits: 1, // Default to 1 credit for free tier
      trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000), // 15-day trial
    });

    return userId;
  },
});

export const getInternalUser = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const updateSubscription = internalMutation({
  args: { 
    tokenIdentifier: v.string(), 
    plan: v.union(v.literal("free"), v.literal("single_scan"), v.literal("bulk_pack")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    const creditsToAdd = args.plan === "single_scan" ? 1 : args.plan === "bulk_pack" ? 5 : 0;

    if (user) {
      const currentCredits = user.credits ?? 1;
      await ctx.db.patch(user._id, { 
        subscriptionTier: args.plan,
        credits: currentCredits + creditsToAdd 
      });
    } else {
       const identity = await ctx.auth.getUserIdentity();
       if (identity && identity.subject === args.tokenIdentifier) {
          // New user created via subscription (unlikely but possible)
          // Base 1 credit + purchased credits
          await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: identity.email,
            name: identity.name,
            subscriptionTier: args.plan,
            credits: 1 + creditsToAdd,
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
  
  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", identity.subject))
    .unique();

  return {
    _id: identity.subject, // Use the subject (Clerk ID) as the ID for auth checks
    dbUser: user, // Return the actual DB user doc if it exists
    ...identity,
  };
};