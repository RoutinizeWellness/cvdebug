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
      // Also update lastSeen for re-engagement tracking
      await ctx.db.patch(user._id, {
        name: identity.name,
        email: identity.email,
        lastSeen: Date.now(),
      });
      return user._id;
    }

    // Check for existing user by email (e.g. created via Admin Manual Grant) to link accounts
    if (identity.email) {
      const existingUserByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email))
        .unique();
      
      if (existingUserByEmail) {
         // Link this user to the Clerk ID
         await ctx.db.patch(existingUserByEmail._id, {
           tokenIdentifier: identity.subject,
           name: identity.name || existingUserByEmail.name,
           lastSeen: Date.now(),
         });
         return existingUserByEmail._id;
      }
    }

    // Assign A/B test variant
    const emailVariant = Math.random() < 0.5 ? "A" : "B";

    // If it's a new user, create them in the database
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.subject,
      name: identity.name,
      email: identity.email,
      subscriptionTier: "free",
      credits: 2, // Default to 2 credits for free tier
      trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000), // 15-day trial
      emailVariant,
      lastSeen: Date.now(),
    });

    // Send onboarding email (Email #1)
    if (identity.email) {
      await ctx.scheduler.runAfter(0, internal.marketing.sendOnboardingEmail, {
        email: identity.email,
        name: identity.name,
        variant: emailVariant,
      });
    }

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
        credits: currentCredits + creditsToAdd,
        subscriptionTier: args.plan
      });
    } else {
       const identity = await ctx.auth.getUserIdentity();
       if (identity && identity.subject === args.tokenIdentifier) {
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

    console.log(`[PURCHASE] Adding ${creditsToAdd} credits to user ${user._id} (${user.email}) for plan ${args.plan}`);

    await ctx.db.patch(user._id, {
      credits: currentCredits + creditsToAdd,
      subscriptionTier: args.plan,
    });
    
    return { success: true, credits: currentCredits + creditsToAdd };
  },
});

export const getBetaStatus = query({
  args: {},
  handler: async (ctx) => {
    // Count paid users (single_scan or bulk_pack)
    // We use the index to efficiently count
    const singleScanUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "single_scan"))
      .collect();
      
    const bulkPackUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "bulk_pack"))
      .collect();

    const realCount = singleScanUsers.length + bulkPackUsers.length;
    // console.log("Beta Status Count:", realCount);
    
    // Marketing logic: Create urgency by showing most spots are taken
    // "Invented" data as requested to make it look urgent
    // Base of 92 claimed spots + actual users
    const baseCount = 92; 
    
    // Calculate total claimed, ensuring we don't show "Sold Out" (100) purely from fake data
    // We want to leave at least 3-4 spots to drive action
    let displayClaimed = baseCount + realCount;
    
    // Cap at 97 to always leave at least 3 spots open for urgency
    if (displayClaimed > 97) {
        displayClaimed = 97;
    }

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