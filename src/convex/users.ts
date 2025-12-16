import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

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
      await ctx.scheduler.runAfter(0, internalAny.marketing.sendOnboardingEmail, {
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

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const updateSubscription = internalMutation({
  args: { 
    tokenIdentifier: v.string(), 
    plan: v.union(v.literal("free"), v.literal("single_scan"), v.literal("bulk_pack")),
  },
  handler: async (ctx, args) => {
    console.log(`[updateSubscription] START - Called with args:`, args);

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    const creditsToAdd = args.plan === "single_scan" ? 1 : args.plan === "bulk_pack" ? 5 : 0;
    console.log(`[updateSubscription] Plan: ${args.plan}, Credits to add: ${creditsToAdd}`);

    if (user) {
      const currentCredits = user.credits ?? 1;
      console.log(`[updateSubscription] Found user ${user._id} (${user.email}). Updating credits from ${currentCredits} to ${currentCredits + creditsToAdd}`);
      
      await ctx.db.patch(user._id, { 
        credits: currentCredits + creditsToAdd,
        subscriptionTier: args.plan
      });

      // Send confirmation email
      if (user.email) {
        console.log(`[updateSubscription] Scheduling confirmation email for ${user.email}`);
        await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
          email: user.email,
          name: user.name,
          plan: args.plan,
          credits: creditsToAdd
        });
      }
    } else {
       console.log(`[updateSubscription] User not found by token ${args.tokenIdentifier}. Attempting to create/recover via identity...`);
       const identity = await ctx.auth.getUserIdentity();
       
       if (identity && identity.subject === args.tokenIdentifier) {
          console.log(`[updateSubscription] Identity verified. Creating new user for ${identity.email}`);
          await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: identity.email,
            name: identity.name,
            subscriptionTier: args.plan,
            credits: 1 + creditsToAdd,
          });
          
          // Send confirmation email if we have email
          if (identity.email) {
            console.log(`[updateSubscription] Scheduling confirmation email for new user ${identity.email}`);
            await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
              email: identity.email,
              name: identity.name,
              plan: args.plan,
              credits: creditsToAdd
            });
          }
       } else {
          console.error(`[updateSubscription] FAILED: User not found and current identity does not match tokenIdentifier ${args.tokenIdentifier}`);
       }
    }
    console.log(`[updateSubscription] END`);
  },
});

export const purchaseCredits = mutation({
  args: { 
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    // Recovery: If user not found by token (e.g. deleted manually), try email or create
    if (!user) {
      console.log(`User not found by token ${identity.subject}, attempting recovery...`);
      
      // Try by email
      if (identity.email) {
        user = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", identity.email!))
          .unique();
          
        if (user) {
          // Link found user
          await ctx.db.patch(user._id, {
            tokenIdentifier: identity.subject,
            name: identity.name || user.name,
            lastSeen: Date.now()
          });
        }
      }
      
      // If still not found, create new user
      if (!user) {
         const userId = await ctx.db.insert("users", {
          tokenIdentifier: identity.subject,
          name: identity.name,
          email: identity.email,
          subscriptionTier: "free",
          credits: 2,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A", // Default
          lastSeen: Date.now(),
        });
        
        // Fetch the newly created user
        user = await ctx.db.get(userId);
      }
    }

    if (!user) throw new Error("User could not be found or created");

    const creditsToAdd = args.plan === "single_scan" ? 1 : args.plan === "bulk_pack" ? 5 : 0;
    const currentCredits = user.credits ?? 0;

    console.log(`[PURCHASE] Adding ${creditsToAdd} credits to user ${user._id} (${user.email}) for plan ${args.plan}`);

    await ctx.db.patch(user._id, {
      credits: currentCredits + creditsToAdd,
      subscriptionTier: args.plan,
    });
    
    // Send confirmation email
    if (user.email) {
      await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
        email: user.email,
        name: user.name,
        plan: args.plan,
        credits: creditsToAdd
      });
    }
    
    return { success: true, credits: currentCredits + creditsToAdd };
  },
});

export const getBetaStatus = query({
  args: {},
  handler: async (ctx) => {
    // Count paid users (single_scan or bulk_pack) - OPTIMIZED to avoid .collect()
    // Use take() with a reasonable limit instead of loading all users
    const singleScanUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "single_scan"))
      .take(100); // Limit to prevent excessive database reads
      
    const bulkPackUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "bulk_pack"))
      .take(100); // Limit to prevent excessive database reads

    // Deduplicate by email to prevent counting duplicate accounts
    const uniqueEmails = new Set<string>();
    [...singleScanUsers, ...bulkPackUsers].forEach(user => {
      if (user.email) uniqueEmails.add(user.email);
    });
    
    const realCount = uniqueEmails.size;
    // console.log("Beta Status Count:", realCount);
    
    // Marketing logic: Create urgency by showing most spots are taken
    // "Invented" data as requested to make it look urgent
    // Base of 92 claimed spots + actual users
    const baseCount = 97; 
    
    // Calculate total claimed, ensuring we don't show "Sold Out" (100) purely from fake data
    // We want to leave at least 3-4 spots to drive action
    let displayClaimed = baseCount + realCount;
    
    // Cap at 99 to always leave at least 1 spot open for urgency
    if (displayClaimed > 99) {
        displayClaimed = 99;
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