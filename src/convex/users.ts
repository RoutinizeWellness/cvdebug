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
    if (!identity) {
      console.log("storeUser called without identity");
      return null;
    }
    console.log("storeUser called for:", identity.email, identity.subject);

    // Check if we've already stored this user
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .first();

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

    // ANTI-CHEAT: ONE FREE DIAGNOSTIC SCAN PER DEVICE (Fingerprint-based)
    // Strategy: "The Diagnostic Hook" - Users get 1 free scan to see their CV is broken
    let initialCredits = 1; // HARD LIMIT: ONE FREE SCAN PER DEVICE
    let isPotentialDuplicate = false;
    let freeTrialBlocked = false;

    if (args.deviceFingerprint) {
      const fingerprint = args.deviceFingerprint;
      const existingDeviceUsage = await ctx.db
        .query("deviceUsage")
        .withIndex("by_visitor_id", (q) => q.eq("visitorId", fingerprint))
        .first();
      
      if (existingDeviceUsage && existingDeviceUsage.creditsConsumed > 0) {
        // This device has already used the free diagnostic scan
        initialCredits = 0;
        isPotentialDuplicate = true;
        freeTrialBlocked = true;
        console.log(`[ANTI-CHEAT] Device ${fingerprint.substring(0, 8)}... already used free scan. Blocking.`);
      }
    }

    // Check for existing user by email (e.g. created via Admin Manual Grant)
    if (identity.email) {
      const existingUserByEmail = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email!))
        .first();
      
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
    plan: v.union(v.literal("free"), v.literal("basic_pro"), v.literal("interview_sprint"), v.literal("lifetime")),
  },
  handler: async (ctx, args) => {
    console.log(`[updateSubscription] ====== START ======`);
    console.log(`[updateSubscription] 📥 Input - tokenIdentifier: ${args.tokenIdentifier}, plan: ${args.plan}`);

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    console.log(`[updateSubscription] 👤 User found:`, user ? `YES (${user.email}, ID: ${user._id})` : 'NO');

    // Free: 5 parses/month, Basic Pro: 20 parses/month, Interview Sprint: Unlimited, Lifetime: Unlimited
    const creditsToAdd = args.plan === "basic_pro" ? 20 : 0;
    console.log(`[updateSubscription] 💳 Plan: ${args.plan}, Credits to add: ${creditsToAdd}`);

    if (user) {
      const currentCredits = user.credits ?? 0;
      console.log(`[updateSubscription] 📊 Current state - Tier: ${user.subscriptionTier}, Credits: ${currentCredits}`);
      console.log(`[updateSubscription] 🔄 Updating to - Tier: ${args.plan}`);

      const updates: any = {
        subscriptionTier: args.plan,
        freeTrialUsed: true, // Mark as used to prevent re-using free scan
      };

      if (args.plan === "basic_pro") {
        updates.credits = 20; // Basic Pro gets 20 parses per month
        updates.freeScansUsed = 0; // Reset monthly counter
      } else if (args.plan === "interview_sprint") {
        const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
        updates.sprintExpiresAt = expiresAt;
        updates.credits = 0; // Sprint users don't need credits
        console.log(`[updateSubscription] 📅 Sprint expires at: ${new Date(expiresAt).toISOString()}`);
      } else if (args.plan === "lifetime") {
        updates.credits = 0; // Lifetime users don't need credits
      } else if (args.plan === "free") {
        updates.freeScansUsed = 0; // Reset monthly counter
      }

      console.log(`[updateSubscription] 💾 Updates to apply:`, updates);
      await ctx.db.patch(user._id, updates);
      console.log(`[updateSubscription] ✅ User patched successfully`);

      // Verify the update
      const updatedUser = await ctx.db.get(user._id);
      console.log(`[updateSubscription] 🔍 Verification - New tier: ${updatedUser?.subscriptionTier}, Credits: ${updatedUser?.credits}`);

      if (user.email) {
        console.log(`[updateSubscription] 📧 Scheduling confirmation email for ${user.email}`);
        await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
          email: user.email,
          name: user.name,
          plan: args.plan,
          credits: creditsToAdd
        });
      }
    } else {
       console.log(`[updateSubscription] ⚠️ User not found by token ${args.tokenIdentifier.substring(0, 10)}...`);
       console.log(`[updateSubscription] 🔍 Attempting to create/recover via identity...`);
       const identity = await ctx.auth.getUserIdentity();

       if (identity && identity.subject === args.tokenIdentifier) {
          console.log(`[updateSubscription] ✅ Identity verified. Creating new user for ${identity.email}`);
          const newUserData: any = {
            tokenIdentifier: args.tokenIdentifier,
            email: identity.email,
            name: identity.name,
            subscriptionTier: args.plan,
            credits: 1 + creditsToAdd,
            lastSeen: Date.now(),
          };

          if (args.plan === "interview_sprint") {
            newUserData.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
          }

          const newUserId = await ctx.db.insert("users", newUserData);
          console.log(`[updateSubscription] ✅ New user created with ID: ${newUserId}`);

          if (identity.email) {
            console.log(`[updateSubscription] 📧 Scheduling confirmation email for new user ${identity.email}`);
            await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
              email: identity.email,
              name: identity.name,
              plan: args.plan,
              credits: creditsToAdd
            });
          }
       } else {
          console.error(`[updateSubscription] ❌ FAILED: User not found and identity does not match`);
          console.error(`[updateSubscription] Identity subject: ${identity?.subject || 'null'}`);
          console.error(`[updateSubscription] Expected tokenIdentifier: ${args.tokenIdentifier}`);
       }
    }
    console.log(`[updateSubscription] ====== END ======`);
  },
});

export const purchaseCredits = mutation({
  args: {
    plan: v.union(v.literal("basic_pro"), v.literal("interview_sprint"), v.literal("lifetime")),
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

    console.log(`[PURCHASE] User ${user._id} (${user.email}) purchasing plan: ${args.plan}`);

    const updates: any = {
      subscriptionTier: args.plan,
      freeTrialUsed: true, // Prevent re-using free scan after purchase
    };

    if (args.plan === "basic_pro") {
      // Basic Pro: 20 parses per month
      updates.credits = 20;
      updates.freeScansUsed = 0;
      console.log(`[PURCHASE] Basic Pro: Granting 20 parses per month`);
    } else if (args.plan === "interview_sprint") {
      // Interview Sprint: Unlimited scans for 30 days
      updates.sprintExpiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000);
      updates.credits = 0; // No credits needed for sprint
      console.log(`[PURCHASE] Interview Sprint: 30 days unlimited access granted`);
    } else if (args.plan === "lifetime") {
      // Lifetime: Unlimited forever
      updates.credits = 0;
      console.log(`[PURCHASE] Lifetime: Unlimited access granted`);
    }

    await ctx.db.patch(user._id, updates);
    
    if (user.email) {
      await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
        email: user.email,
        name: user.name,
        plan: args.plan,
        credits: args.plan === "basic_pro" ? 20 : 0
      });
    }
    
    return { success: true, credits: args.plan === "basic_pro" ? 20 : 0 };
  },
});

export const getBetaStatus = query({
  args: {},
  handler: async (ctx) => {
    const basicProUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "basic_pro"))
      .take(100);

    const sprintUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "interview_sprint"))
      .take(100);

    const lifetimeUsers = await ctx.db.query("users")
      .withIndex("by_subscription_tier", (q) => q.eq("subscriptionTier", "lifetime"))
      .take(100);

    const uniqueEmails = new Set<string>();
    [...basicProUsers, ...sprintUsers, ...lifetimeUsers].forEach(user => {
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

export const getUserByTokenIdentifier = internalQuery({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    // Admin Override
    if (user && user.email === "tiniboti@gmail.com") {
      return {
        ...user,
        subscriptionTier: "interview_sprint" as const,
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

export const getActiveSprintUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Get all users with active sprint
    const allUsers = await ctx.db.query("users").take(1000);
    
    return allUsers.filter(user => 
      user.sprintExpiresAt && user.sprintExpiresAt > now
    );
  },
});

export const createUserFromMigration = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`[Migration] Creating user: ${args.email}`);

    // Check if user already exists by token
    const existingByToken = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    if (existingByToken) {
      console.log(`[Migration] User already exists by token: ${args.email}`);
      return existingByToken._id;
    }

    // Check if user already exists by email
    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingByEmail) {
      console.log(`[Migration] User exists by email, updating token: ${args.email}`);
      await ctx.db.patch(existingByEmail._id, {
        tokenIdentifier: args.tokenIdentifier,
        name: args.name,
        lastSeen: Date.now(),
      });
      return existingByEmail._id;
    }

    // Create new user with 1 free credit
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      subscriptionTier: "free",
      credits: 1,
      trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
      emailVariant: "A",
      lastSeen: Date.now(),
    });

    console.log(`[Migration] ✅ Created user ${args.email} with ID ${userId}`);
    return userId;
  },
});

export const expireInterviewSprints = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    // Get all users with active sprint
    const allUsers = await ctx.db.query("users").take(1000);
    
    const expiredUsers = allUsers.filter(user => 
      user.sprintExpiresAt && 
      user.sprintExpiresAt <= now &&
      user.subscriptionTier === "interview_sprint"
    );

    console.log(`[Cron] Found ${expiredUsers.length} expired Interview Sprint subscriptions`);

    for (const user of expiredUsers) {
      await ctx.db.patch(user._id, {
        subscriptionTier: "free",
        sprintExpiresAt: undefined,
        credits: 0, // No credits after sprint expires
      });
      
      console.log(`[Cron] Expired Interview Sprint for user ${user.email}`);
    }

    return { expired: expiredUsers.length };
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