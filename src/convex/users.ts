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

    // Admin Override: Give full access to the admin
    if (identity.email === "tiniboti@gmail.com") {
      return {
        ...identity,
        subscriptionTier: "bulk_pack",
        credits: 999999,
        trialEndsOn: undefined,
        _id: user?._id,
      };
    }
      
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
      credits: 2, // Default to 2 credits for free tier
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
        // Don't change subscriptionTier to single_scan as it's a one-time purchase, 
        // unless we want to track "last purchased". 
        // For now, we just add credits.
        credits: currentCredits + creditsToAdd 
      });
    } else {
       const identity = await ctx.auth.getUserIdentity();
       if (identity && identity.subject === args.tokenIdentifier) {
          await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: identity.email,
            name: identity.name,
            subscriptionTier: "free", // Keep as free, just add credits
            credits: 1 + creditsToAdd,
          });
       }
    }
  },
});

export const purchaseCredits = mutation({
  args: { 
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const creditsToAdd = args.plan === "single_scan" ? 1 : args.plan === "bulk_pack" ? 5 : 0;
    const currentCredits = user.credits ?? 0;

    await ctx.db.patch(user._id, {
      credits: currentCredits + creditsToAdd,
    });
    
    return { success: true, credits: currentCredits + creditsToAdd };
  },
});

export const getBetaStatus = query({
  args: {},
  handler: async (ctx) => {
    // Count users to determine claimed spots
    // We take up to 101 to know if we exceeded 100
    const users = await ctx.db.query("users").take(101);
    const realCount = users.length;
    
    // Marketing logic: Start at 47 to show social proof if low
    // This ensures the site doesn't look empty initially
    const baseCount = 47;
    const displayClaimed = Math.max(realCount, baseCount);
    const total = 100;
    
    return {
      claimed: Math.min(displayClaimed, total),
      total,
      remaining: Math.max(0, total - displayClaimed),
      isSoldOut: displayClaimed >= total
    };
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