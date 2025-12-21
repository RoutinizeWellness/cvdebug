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
        subscriptionTier: "interview_sprint",
        credits: 999999,
        sprintExpiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000),
        trialEndsOn: undefined,
        _id: user?._id,
      };
    }
      
    return {
      ...identity,
      subscriptionTier: user?.subscriptionTier || "free",
      credits: user?.credits ?? 1,
      sprintExpiresAt: user?.sprintExpiresAt,
      trialEndsOn: user?.trialEndsOn,
      _id: user?._id,
    };
  },
});

export const storeUser = mutation({
  args: { deviceFingerprint: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Check if we've already stored this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user !== null) {
      // Update existing user
      await ctx.db.patch(user._id, {
        name: identity.name,
        email: identity.email,
        lastSeen: Date.now(),
        deviceFingerprint: args.deviceFingerprint || user.deviceFingerprint,
      });
      
      // Update device usage tracking
      if (args.deviceFingerprint) {
        const fingerprint = args.deviceFingerprint;
        const deviceUsage = await ctx.db
          .query("deviceUsage")
          .withIndex("by_visitor_id", (q) => q.eq("visitorId", fingerprint))
          .first();
        
        if (deviceUsage) {
          await ctx.db.patch(deviceUsage._id, {
            lastUsedAt: Date.now(),
          });
        }
      }
      
      return user._id;
    }

    // ANTI-CHEAT: Check if this device has already consumed credits
    let initialCredits = 1; // HARD LIMIT: ONE FREE SCAN
    let isPotentialDuplicate = false;
    let freeTrialBlocked = false;

    if (args.deviceFingerprint) {
      const fingerprint = args.deviceFingerprint;
      const existingDeviceUsage = await ctx.db
        .query("deviceUsage")
        .withIndex("by_visitor_id", (q) => q.eq("visitorId", fingerprint))
        .first();
      
      if (existingDeviceUsage && existingDeviceUsage.creditsConsumed > 0) {
        // This device has already used credits on another account
        initialCredits = 0;
        isPotentialDuplicate = true;
        freeTrialBlocked = true;
        console.log(`[ANTI-CHEAT] Device ${args.deviceFingerprint} flagged as duplicate. Credits set to 0.`);
      }
    }

    // Check for existing user by email (e.g. created via Admin Manual Grant)
    if (identity.email) {
      const existingUserByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email || ""))
        .unique();
      
      if (existingUserByEmail) {
         await ctx.db.patch(existingUserByEmail._id, {
           tokenIdentifier: identity.subject,
           name: identity.name || existingUserByEmail.name,
           lastSeen: Date.now(),
           deviceFingerprint: args.deviceFingerprint || existingUserByEmail.deviceFingerprint,
           isPotentialDuplicate: isPotentialDuplicate || existingUserByEmail.isPotentialDuplicate,
         });
         return existingUserByEmail._id;
      }
    }

    // Assign A/B test variant
    const emailVariant = Math.random() < 0.5 ? "A" : "B";

    // Create new user with STRICT ONE FREE SCAN policy
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.subject,
      name: identity.name,
      email: identity.email || "",
      subscriptionTier: "free",
      credits: initialCredits, // ONE FREE SCAN (or 0 if device blocked)
      trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
      emailVariant,
      lastSeen: Date.now(),
      deviceFingerprint: args.deviceFingerprint,
      freeTrialUsed: freeTrialBlocked,
      isPotentialDuplicate,
    });

    // Track device usage
    if (args.deviceFingerprint) {
      await ctx.db.insert("deviceUsage", {
        visitorId: args.deviceFingerprint,
        userId: identity.subject,
        email: identity.email,
        creditsConsumed: 0,
        firstUsedAt: Date.now(),
        lastUsedAt: Date.now(),
      });
    }

    // Send onboarding email (Email #1)
    if (identity.email) {
      await ctx.scheduler.runAfter(0, internalAny.marketing.sendOnboardingEmail, {
      email: identity.email || "",
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
    plan: v.union(v.literal("free"), v.literal("single_scan"), v.literal("interview_sprint")),
  },
  handler: async (ctx, args) => {
    console.log(`[updateSubscription] START - Called with args:`, args);

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    const creditsToAdd = args.plan === "single_scan" ? 1 : 0;
    console.log(`[updateSubscription] Plan: ${args.plan}, Credits to add: ${creditsToAdd}`);

    if (user) {
      const currentCredits = user.credits ?? 1;
      console.log(`[updateSubscription] Found user ${user._id} (${user.email}). Updating credits from ${currentCredits} to ${currentCredits + creditsToAdd}`);
      
      const updates: any = { 
        credits: currentCredits + creditsToAdd,
        subscriptionTier: args.plan
      };
      
      if (args.plan === "interview_sprint") {
        updates.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
      }
      
      await ctx.db.patch(user._id, updates);

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
          const newUserData: any = {
            tokenIdentifier: args.tokenIdentifier,
            email: identity.email,
            name: identity.name,
            subscriptionTier: args.plan,
            credits: 1 + creditsToAdd,
          };
          
          if (args.plan === "interview_sprint") {
            newUserData.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
          }
          
          await ctx.db.insert("users", newUserData);
          
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
    plan: v.union(v.literal("single_scan"), v.literal("interview_sprint")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      console.log(`User not found by token ${identity.subject}, attempting recovery...`);
      
      if (identity.email) {
        user = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", identity.email!))
          .unique();
          
        if (user) {
          await ctx.db.patch(user._id, {
            tokenIdentifier: identity.subject,
            name: identity.name || user.name,
            lastSeen: Date.now()
          });
        }
      }
      
      if (!user) {
         const userId = await ctx.db.insert("users", {
          tokenIdentifier: identity.subject,
          name: identity.name,
          email: identity.email || "",
          subscriptionTier: "free",
          credits: 1,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A",
          lastSeen: Date.now(),
        });
        
        user = await ctx.db.get(userId);
      }
    }

    if (!user) throw new Error("User could not be found or created");

    const creditsToAdd = args.plan === "single_scan" ? 1 : 0;
    const currentCredits = user.credits ?? 0;

    console.log(`[PURCHASE] Adding ${creditsToAdd} credits to user ${user._id} (${user.email}) for plan ${args.plan}`);

    const updates: any = {
      credits: currentCredits + creditsToAdd,
      subscriptionTier: args.plan,
    };
    
    if (args.plan === "interview_sprint") {
      updates.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    }

    await ctx.db.patch(user._id, updates);
    
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
    const singleScanUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "single_scan"))
      .take(100);
      
    const sprintUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "interview_sprint"))
      .take(100);

    const uniqueEmails = new Set<string>();
    [...singleScanUsers, ...sprintUsers].forEach(user => {
      if (user.email) uniqueEmails.add(user.email);
    });
    
    const realCount = uniqueEmails.size;
    const baseCount = 97; 
    
    let displayClaimed = baseCount + realCount;
    
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

export const markFreeTrialUsed = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        freeTrialUsed: true,
      });
    }
  },
});

export const checkDeviceFingerprint = query({
  args: { deviceFingerprint: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_device_fingerprint", (q) => q.eq("deviceFingerprint", args.deviceFingerprint))
      .first();

    return {
      freeTrialUsed: existingUser?.freeTrialUsed || false,
      hasExistingAccount: !!existingUser,
    };
  },
});

export const getUserInternal = internalQuery({
  args: { subject: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.subject))
      .unique();

    // Admin Override
    if (user && user.email === "tiniboti@gmail.com") {
      return {
        ...user,
        subscriptionTier: "interview_sprint",
        credits: 999999,
        sprintExpiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000),
      };
    }

    return user;
  },
});

export const deductCreditInternal = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    
    // Admin check (redundant if handled in getUserInternal but good for safety)
    if (user.email === "tiniboti@gmail.com") return;

    const currentCredits = user.credits ?? 0;
    await ctx.db.patch(args.userId, {
      credits: Math.max(0, currentCredits - 1),
    });
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