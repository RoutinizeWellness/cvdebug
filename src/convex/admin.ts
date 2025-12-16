import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

// Admin-only query to get all users
export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      
      // Security check: Only allow specific admin email
      if (!identity || identity.email !== "tiniboti@gmail.com") {
        return [];
      }

      const users = await ctx.db.query("users").order("desc").collect();
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
});

export const getUserPaymentHistory = action({
  args: { customerId: v.string(), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    const autumnSecretKey = process.env.AUTUMN_SECRET_KEY;
    if (!autumnSecretKey) {
      return { results: [{ type: "config_error", error: "AUTUMN_SECRET_KEY not configured" }] };
    }

    const results = [];
    console.log(`[PAYMENT HISTORY] Checking for customer: ${args.customerId}, email: ${args.email}`);
    
    // Autumn doesn't provide direct payment history endpoints
    // Instead, we show what we know from our database
    results.push({ 
      type: "info", 
      message: "Autumn manages billing through Stripe webhooks. Payment history is not directly queryable via API.",
      note: "Use the 'Manual Grant' feature below to add credits if a payment was processed but not reflected."
    });

    // Try to get customer info from Autumn (if endpoint exists)
    try {
      const res = await fetch(`https://api.useautumn.com/v1/customers/${args.customerId}`, {
        headers: { "Authorization": `Bearer ${autumnSecretKey}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`[PAYMENT HISTORY] Customer data:`, JSON.stringify(data).substring(0, 300));
        results.push({ type: "customer_info", data });
      } else {
        console.log(`[PAYMENT HISTORY] Customer endpoint returned ${res.status}`);
      }
    } catch (e: any) {
      console.log(`[PAYMENT HISTORY] Error fetching customer:`, e.message);
    }

    if (results.length === 1) {
      results.push({ 
        type: "recommendation", 
        message: "To verify payments: Check your Stripe dashboard or use 'Manual Grant' to add credits directly." 
      });
    }

    return { results };
  }
});

export const getAdminStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      return null;
    }

    const freeUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "free")).collect();
    const singleScanUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "single_scan")).collect();
    const bulkPackUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "bulk_pack")).collect();

    return {
      free: freeUsers.length,
      singleScan: singleScanUsers.length,
      bulkPack: bulkPackUsers.length,
      total: freeUsers.length + singleScanUsers.length + bulkPackUsers.length
    };
  }
});

export const fixInconsistentUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Find users who have credits > 2 (default free is 2) but are still marked as "free"
    // This implies they bought credits but the tier wasn't updated
    const allUsers = await ctx.db.query("users").collect();
    let fixedCount = 0;

    for (const user of allUsers) {
      if (user.subscriptionTier === "free" && (user.credits || 0) > 2) {
        // Heuristic: If they have > 2 credits, they likely paid.
        // 3 credits = 2 (free) + 1 (single scan)
        // 7 credits = 2 (free) + 5 (bulk pack)
        
        let newTier: "single_scan" | "bulk_pack" = "single_scan";
        if ((user.credits || 0) >= 7) {
          newTier = "bulk_pack";
        }

        await ctx.db.patch(user._id, {
          subscriptionTier: newTier
        });
        fixedCount++;
      }
    }

    return `Fixed ${fixedCount} inconsistent users.`;
  }
});

export const fixSpecificReportedUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Specific users reported with missing credits from payments
    // We include their IDs to ensure we find them or create them if missing
    const fixes = [
      { 
        email: "juratbupt@gmail.com", 
        id: "user_36Zmp3s64EbsVfdDLX96yQ3SJCKjuratbupt",
        creditsToAdd: 2, 
        plan: "single_scan",
        name: "JULAITI SHAYIDING"
      },
      { 
        email: "adty910@gmail.com", 
        id: "user_36eucfnySMbebZiqtME2txTRtNCadty9",
        creditsToAdd: 2, 
        plan: "single_scan",
        name: "Aditya Ganesh Kumar"
      },
      { 
        email: "lyp@oregonstate.edu", 
        id: "user_36crk9hfwis3yHRHsvuYwIfxicrlyp",
        creditsToAdd: 3, 
        plan: "single_scan",
        name: "Phillip Ly"
      },
      { 
        email: "lyp@oregonstate.edu", 
        id: "user_36cqEBADYopX7SoGUqp9nduJyWclyp",
        creditsToAdd: 1, // Ensure this duplicate ID also has access if used
        plan: "single_scan",
        name: "Phillip Ly (Alt)"
      }
    ];

    let logs = [];
    let fixedCount = 0;

    for (const fix of fixes) {
      // 1. Try to find by Token Identifier (Clerk ID)
      let user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", fix.id))
        .unique();

      // 2. If not found by ID, try by Email
      if (!user) {
        user = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", fix.email))
          .unique();
      }

      if (user) {
        // Update existing user
        const currentCredits = user.credits || 0;
        // Only add credits if they seem low (avoid double adding if run multiple times)
        // But since this is a manual fix for reported issues, we'll ensure they have AT LEAST the amount
        const newCredits = Math.max(currentCredits, fix.creditsToAdd);
        
        await ctx.db.patch(user._id, {
          subscriptionTier: fix.plan as "single_scan" | "bulk_pack",
          credits: newCredits,
          // Ensure token identifier is correct if we found by email
          tokenIdentifier: user.tokenIdentifier || fix.id 
        });
        
        logs.push(`✅ Updated ${fix.email} (${user._id}): Set to ${fix.plan}, Credits ${currentCredits} -> ${newCredits}`);
        fixedCount++;
      } else {
        // 3. Create user if they don't exist
        const newUserId = await ctx.db.insert("users", {
          tokenIdentifier: fix.id,
          name: fix.name,
          email: fix.email,
          subscriptionTier: fix.plan as "single_scan" | "bulk_pack",
          credits: fix.creditsToAdd,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A",
          lastSeen: Date.now(),
        });
        
        logs.push(`✨ Created NEW user ${fix.email} (${newUserId}) with ${fix.creditsToAdd} credits`);
        fixedCount++;
      }
    }

    return `Processed ${fixedCount}/${fixes.length} users.\n${logs.join("\n")}`;
  }
});

export const fixKnownMissingUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    const idsToFix = [
      "user_36Zmp3s64EbsVfdDLX96yQ3SJCKjuratbupt",
      "user_36eucfnySMbebZiqtME2txTRtNCadty9",
      "user_36crk9hfwis3yHRHsvuYwIfxicrlyp",
      "user_36cqEBADYopX7SoGUqp9nduJyWclyp"
    ];

    // Also try to match by email parts if ID fails, based on user report
    const emailPatterns = [
      "oregonstate.edu",
      "gmail.com" 
    ];

    let fixedCount = 0;
    let logs = [];

    // 1. Fix by ID
    for (const id of idsToFix) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", id))
        .unique();

      if (user) {
        logs.push(`Found user by ID: ${user.name} (${user.email})`);
        if (user.subscriptionTier !== "single_scan" && user.subscriptionTier !== "bulk_pack") {
           const currentCredits = user.credits || 0;
           const newCredits = currentCredits < 1 ? 1 : currentCredits;
           
           await ctx.db.patch(user._id, {
             subscriptionTier: "single_scan",
             credits: newCredits
           });
           fixedCount++;
           logs.push(`Updated ${user.email} to single_scan`);
        } else {
          logs.push(`User ${user.email} is already ${user.subscriptionTier}`);
        }
      } else {
        logs.push(`User with ID ${id} not found`);
      }
    }

    // 2. Fallback: Fix by Email if they look like the reported users and are still free
    // This is a heuristic to catch them if the ID was wrong but email matches
    if (fixedCount < 4) {
       const potentialUsers = await ctx.db.query("users").collect();
       for (const user of potentialUsers) {
          if (user.subscriptionTier === "free" && user.email) {
             // Check if this looks like one of the reported users
             const isMatch = 
                (user.email.includes("oregonstate.edu") && user.name?.includes("Phillip")) ||
                (user.email.includes("gmail.com") && user.name?.includes("Aditya")) ||
                (user.email.includes("gmail.com") && user.name?.includes("JULAITI"));
             
             if (isMatch) {
                await ctx.db.patch(user._id, {
                   subscriptionTier: "single_scan",
                   credits: Math.max(user.credits || 0, 1)
                });
                fixedCount++;
                logs.push(`Found & Fixed by Email Match: ${user.name} (${user.email})`);
             }
          }
       }
    }

    return `Fixed ${fixedCount} users. Logs: ${logs.join(", ")}`;
  }
});

export const grantPurchase = mutation({
  args: { 
    identifier: v.string(), 
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Try to find by email first
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.identifier))
      .unique();

    // If not found, try by tokenIdentifier
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.identifier))
        .unique();
    }

    const creditsToAdd = args.plan === "single_scan" ? 1 : args.plan === "bulk_pack" ? 5 : 0;

    if (user) {
      const currentCredits = user.credits ?? 0;
      await ctx.db.patch(user._id, {
        subscriptionTier: args.plan,
        credits: currentCredits + creditsToAdd,
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

      return `Successfully granted ${args.plan} (+${creditsToAdd} credits) to ${user.email || user.name}`;
    } else {
      // User not found - Create them if identifier is an email
      if (args.identifier.includes("@")) {
        const newUserId = await ctx.db.insert("users", {
          tokenIdentifier: `manual_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Temporary ID
          name: args.name || "Valued Customer",
          email: args.identifier,
          subscriptionTier: args.plan,
          credits: creditsToAdd,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A",
          lastSeen: Date.now(),
        });

        // Send confirmation email
        await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
          email: args.identifier,
          name: args.name,
          plan: args.plan,
          credits: creditsToAdd
        });

        return `Created NEW user ${args.identifier} with ${args.plan} and ${creditsToAdd} credits. They will be linked when they login.`;
      } else {
        throw new Error(`User not found and identifier '${args.identifier}' is not a valid email to create a new user.`);
      }
    }
  },
});

export const processBulkGrants = mutation({
  args: {
    rawText: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Extract emails using regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = args.rawText.match(emailRegex) || [];
    
    if (matches.length === 0) {
      return "No emails found in the provided text.";
    }

    // Count occurrences of each email to determine credits
    const emailCounts: Record<string, number> = {};
    for (const email of matches) {
      const normalized = email.toLowerCase();
      emailCounts[normalized] = (emailCounts[normalized] || 0) + 1;
    }

    let logs = [];
    let successCount = 0;

    for (const [email, count] of Object.entries(emailCounts)) {
      // Determine plan based on count (heuristic)
      // 1-4 occurrences = single_scan * count
      // 5+ occurrences = bulk_pack (or just give them lots of credits)
      const creditsToAdd = count; 
      const plan = count >= 5 ? "bulk_pack" : "single_scan";

      // Find or Create User
      let user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();

      if (user) {
        const currentCredits = user.credits || 0;
        await ctx.db.patch(user._id, {
          credits: currentCredits + creditsToAdd,
          subscriptionTier: plan
        });
        logs.push(`✅ ${email}: Added ${creditsToAdd} credits (Total: ${currentCredits + creditsToAdd})`);
        successCount++;
      } else {
        // Create new user
        await ctx.db.insert("users", {
          tokenIdentifier: `bulk_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          name: email.split("@")[0],
          email: email,
          subscriptionTier: plan,
          credits: creditsToAdd,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A",
          lastSeen: Date.now(),
        });
        logs.push(`✨ ${email}: Created new user with ${creditsToAdd} credits`);
        successCount++;
      }
    }

    return `Processed ${successCount} unique emails.\n\nDetails:\n${logs.join("\n")}`;
  }
});

export const updateUserPlan = mutation({
  args: {
    userId: v.id("users"),
    plan: v.union(v.literal("free"), v.literal("single_scan"), v.literal("bulk_pack")),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.userId, {
      subscriptionTier: args.plan,
      credits: args.credits,
    });
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.userId);
  },
});

export const simulateWebhookEvent = action({
  args: {
    email: v.string(),
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Get user to find their ID (tokenIdentifier) which is required for the webhook logic
    const user = await ctx.runQuery(internalAny.users.getUserByEmail, { email: args.email });
    if (!user) {
      throw new Error(`User with email ${args.email} not found. Please ensure the user exists first.`);
    }

    if (!user.tokenIdentifier) {
       throw new Error("User has no token identifier (Clerk ID). Cannot simulate webhook.");
    }

    console.log(`Simulating webhook for user ${user.email} (${user.tokenIdentifier})`);

    // Directly update the user's subscription (simulating what the webhook would do)
    await ctx.runMutation(internalAny.users.updateSubscription, {
      tokenIdentifier: user.tokenIdentifier,
      plan: args.plan,
    });

    return `✅ Simulated payment processed for ${args.email}. Credits updated directly.`;
  }
});