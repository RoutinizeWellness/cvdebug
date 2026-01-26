import { query, mutation, action, internalMutation, internalAction } from "./_generated/server";
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
        console.log("Admin check failed:", identity?.email);
        return [];
      }

      console.log("Fetching users for admin...");
      const users = await ctx.db.query("users").order("desc").take(500); // Increased limit to 500
      console.log(`Found ${users.length} users`);
      
      // Enhance user data with resume counts
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const resumes = await ctx.db
            .query("resumes")
            .withIndex("by_user", (q) => q.eq("userId", user.tokenIdentifier))
            .collect();
          
          return {
            ...user,
            resumeCount: resumes.length,
            lastScanDate: resumes.length > 0 ? Math.max(...resumes.map(r => r._creationTime)) : null,
          };
        })
      );
      
      return usersWithStats;
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
    const singleDebugFixUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "single_debug_fix")).collect();
    const singleScanUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "single_scan")).collect();
    const sprintUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "interview_sprint")).collect();

    // Calculate total revenue (approximate)
    const singleDebugFixRevenue = singleDebugFixUsers.length * 5.99;
    const singleScanRevenue = singleScanUsers.length * 14.99;
    const sprintRevenue = sprintUsers.length * 24.99;
    const totalRevenue = singleDebugFixRevenue + singleScanRevenue + sprintRevenue;

    return {
      free: freeUsers.length,
      singleDebugFix: singleDebugFixUsers.length,
      singleScan: singleScanUsers.length,
      interviewSprint: sprintUsers.length,
      total: freeUsers.length + singleDebugFixUsers.length + singleScanUsers.length + sprintUsers.length,
      revenue: {
        singleDebugFix: singleDebugFixRevenue,
        singleScan: singleScanRevenue,
        sprint: sprintRevenue,
        total: totalRevenue,
      }
    };
  }
});

// Get only paying users (premium)
export const getPremiumUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      return [];
    }

    // Get single_debug_fix users (€5.99)
    const singleDebugFixUsers = await ctx.db
      .query("users")
      .withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "single_debug_fix"))
      .order("desc")
      .take(200);

    // Get single_scan users (€14.99 - 24h Pass)
    const singleScanUsers = await ctx.db
      .query("users")
      .withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "single_scan"))
      .order("desc")
      .take(200);

    // Get interview_sprint users (€24.99 - 7 Day Sprint)
    const sprintUsers = await ctx.db
      .query("users")
      .withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "interview_sprint"))
      .order("desc")
      .take(200);

    // Combine and sort by creation time
    const premiumUsers = [...singleDebugFixUsers, ...singleScanUsers, ...sprintUsers]
      .sort((a, b) => b._creationTime - a._creationTime);

    // Enhance with payment info
    const usersWithPaymentInfo = premiumUsers.map(user => {
      let plan = "Unknown";
      let revenue = 0;
      let isActive = false;

      if (user.subscriptionTier === "single_debug_fix") {
        plan = "Arreglo Rápido (€5.99)";
        revenue = 5.99;
        // Single Debug Fix is active if they still have credits OR haven't used it yet
        isActive = (user.credits || 0) > 0 || !user.singleDebugFixUsed;
      } else if (user.subscriptionTier === "single_scan") {
        plan = "Pase 24h (€14.99)";
        revenue = 14.99;
        // 24h Pass is active if they still have credits
        isActive = (user.credits || 0) > 0;
      } else if (user.subscriptionTier === "interview_sprint") {
        plan = "Sprint 7 Días (€24.99)";
        revenue = 24.99;
        // Sprint is active if not expired
        isActive = user.sprintExpiresAt ? user.sprintExpiresAt > Date.now() : false;
      }

      return {
        _id: user._id,
        _creationTime: user._creationTime,
        email: user.email,
        name: user.name,
        plan,
        revenue,
        credits: user.credits || 0,
        isActive,
        sprintExpiresAt: user.sprintExpiresAt,
        lastSeen: user.lastSeen,
      };
    });

    return usersWithPaymentInfo;
  }
});

export const fixInconsistentUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Find users who have credits > 1 (default free is 1) but are still marked as "free"
    // This implies they bought credits but the tier wasn't updated
    const allUsers = await ctx.db.query("users").collect();
    let fixedCount = 0;

    for (const user of allUsers) {
      if (user.subscriptionTier === "free" && (user.credits || 0) >= 1) {
        // Heuristic: If they have credits, they likely paid.
        // If they have sprint access, they're on interview_sprint
        // Otherwise they're on single_scan if they have 1 credit

        let newTier: "single_scan" | "interview_sprint" = "single_scan";
        if (user.sprintExpiresAt && user.sprintExpiresAt > Date.now()) {
          newTier = "interview_sprint";
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
        creditsToAdd: 1,
        plan: "single_scan",
        name: "Phillip Ly (Alt)"
      }
    ];

    let logs = [];
    let fixedCount = 0;

    for (const fix of fixes) {
      let user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", fix.id))
        .unique();

      if (!user) {
        user = await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", fix.email))
          .unique();
      }

      if (user) {
        const currentCredits = user.credits || 0;
        const newCredits = Math.max(currentCredits, fix.creditsToAdd);
        
        await ctx.db.patch(user._id, {
          subscriptionTier: fix.plan as "single_scan" | "interview_sprint",
          credits: newCredits,
          tokenIdentifier: user.tokenIdentifier || fix.id
        });
        
        logs.push(`✅ Updated ${fix.email} (${user._id}): Set to ${fix.plan}, Credits ${currentCredits} -> ${newCredits}`);
        fixedCount++;
      } else {
        const newUserId = await ctx.db.insert("users", {
          tokenIdentifier: fix.id,
          name: fix.name,
          email: fix.email,
          subscriptionTier: fix.plan as "single_scan" | "interview_sprint",
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

    const usersToSync = [
      { email: "shreyasbedi1@gmail.com", name: "Shrey Bedi" },
      { email: "adty910@gmail.com", name: "Aditya Ganesh Kumar" },
      { email: "omingakirstinecyril@gmail.com", name: "Kirstine Cyril Ominga" },
      { email: "tiniboti@gmail.com", name: "Tini Boti" },
      { email: "karenarasimhababu2002@gmail.com", name: "Narasimha Kare" }
    ];

    let fixedCount = 0;
    let logs = [];

    for (const u of usersToSync) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", u.email))
        .unique();

      if (!existing) {
        // Create user with a temporary token that will be updated on next login
        await ctx.db.insert("users", {
          tokenIdentifier: `clerk_import_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          name: u.name,
          email: u.email,
          subscriptionTier: "free",
          credits: 1,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A",
          lastSeen: Date.now(),
        });
        fixedCount++;
        logs.push(`Created ${u.email}`);
      } else {
        logs.push(`Exists ${u.email}`);
      }
    }

    return `Synced ${fixedCount} users. Logs: ${logs.join(", ")}`;
  }
});

export const grantPurchase = mutation({
  args: {
    identifier: v.string(),
    plan: v.union(v.literal("single_debug_fix"), v.literal("single_scan"), v.literal("interview_sprint")),
    name: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.identifier))
      .unique();

    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.identifier))
        .unique();
    }

    const creditsToAdd = args.plan === "single_debug_fix" ? 1 : args.plan === "single_scan" ? 1 : 0;
    const sprintDuration = args.plan === "interview_sprint" ? 7 * 24 * 60 * 60 * 1000 : undefined;

    if (user) {
      const currentCredits = user.credits ?? 0;
      const updates: any = {
        subscriptionTier: args.plan,
        credits: currentCredits + creditsToAdd,
      };
      
      if (sprintDuration) {
        updates.sprintExpiresAt = Date.now() + sprintDuration;
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

      return `Successfully granted ${args.plan} to ${user.email || user.name}`;
    } else {
      if (args.identifier.includes("@")) {
        const newUserData: any = {
          tokenIdentifier: `manual_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          name: args.name || "Valued Customer",
          email: args.identifier,
          subscriptionTier: args.plan,
          credits: creditsToAdd,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A",
          lastSeen: Date.now(),
        };
        
        if (sprintDuration) {
          newUserData.sprintExpiresAt = Date.now() + sprintDuration;
        }
        
        const newUserId = await ctx.db.insert("users", newUserData);

        await ctx.scheduler.runAfter(0, internalAny.marketing.sendPurchaseConfirmationEmail, {
          email: args.identifier,
          name: args.name,
          plan: args.plan,
          credits: creditsToAdd
        });

        return `Created NEW user ${args.identifier} with ${args.plan}. They will be linked when they login.`;
      } else {
        throw new Error(`User not found and identifier '${args.identifier}' is not a valid email to create a new user.`);
      }
    }
  },
});

// Sync users from payments table - fix users who paid but tier not updated
export const syncUsersFromPayments = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    console.log("[syncUsersFromPayments] ====== START ======");

    // Get all completed payments
    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    console.log(`[syncUsersFromPayments] Found ${payments.length} completed payments`);

    let syncedCount = 0;
    const logs: string[] = [];

    for (const payment of payments) {
      const user = await ctx.db.get(payment.userId);

      if (!user) {
        logs.push(`⚠️ Payment ${payment.transactionId}: User not found (userId: ${payment.userId})`);
        continue;
      }

      // Check if user tier matches payment
      const expectedTier = payment.plan;
      const currentTier = user.subscriptionTier;

      if (currentTier !== expectedTier) {
        console.log(`[syncUsersFromPayments] Mismatch found: ${user.email} has tier "${currentTier}" but paid for "${expectedTier}"`);

        // Update user to match payment
        const updates: any = {
          subscriptionTier: expectedTier,
        };

        if (expectedTier === "single_scan") {
          updates.credits = Math.max(user.credits || 0, 1); // Ensure at least 1 credit
        } else if (expectedTier === "interview_sprint") {
          // Check if sprint is still active or needs renewal
          if (!user.sprintExpiresAt || user.sprintExpiresAt < Date.now()) {
            updates.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
          }
        }

        await ctx.db.patch(user._id, updates);
        syncedCount++;
        logs.push(`✅ Synced ${user.email}: ${currentTier} → ${expectedTier}`);
      } else {
        logs.push(`✓ ${user.email}: Already synced (${currentTier})`);
      }
    }

    console.log(`[syncUsersFromPayments] ====== END: Synced ${syncedCount}/${payments.length} users ======`);

    return {
      success: true,
      syncedCount,
      totalPayments: payments.length,
      logs: logs.slice(0, 50), // Limit logs to 50 entries
    };
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

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = args.rawText.match(emailRegex) || [];

    if (matches.length === 0) {
      return "No emails found in the provided text.";
    }

    const emailCounts: Record<string, number> = {};
    for (const email of matches) {
      const normalized = email.toLowerCase();
      emailCounts[normalized] = (emailCounts[normalized] || 0) + 1;
    }

    let logs = [];
    let successCount = 0;

    for (const [email, count] of Object.entries(emailCounts)) {
      const creditsToAdd = count; 
      const plan = count >= 5 ? "interview_sprint" : "single_scan";

      let user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();

      if (user) {
        const currentCredits = user.credits || 0;
        const updates: any = {
          credits: currentCredits + creditsToAdd,
          subscriptionTier: plan
        };
        
        if (plan === "interview_sprint") {
          updates.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
        }
        
        await ctx.db.patch(user._id, updates);
        logs.push(`✅ ${email}: Added ${creditsToAdd} credits (Total: ${currentCredits + creditsToAdd})`);
        successCount++;
      } else {
        const newUserData: any = {
          tokenIdentifier: `bulk_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          name: email.split("@")[0],
          email: email,
          subscriptionTier: plan,
          credits: creditsToAdd,
          trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
          emailVariant: "A",
          lastSeen: Date.now(),
        };
        
        if (plan === "interview_sprint") {
          newUserData.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
        }
        
        await ctx.db.insert("users", newUserData);
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
    plan: v.union(v.literal("free"), v.literal("single_debug_fix"), v.literal("single_scan"), v.literal("interview_sprint")),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    const updates: any = {
      subscriptionTier: args.plan,
      credits: args.credits,
    };

    if (args.plan === "interview_sprint") {
      updates.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    }

    // Reset singleDebugFixUsed if assigning single_debug_fix plan
    if (args.plan === "single_debug_fix") {
      updates.singleDebugFixUsed = false;
    }

    await ctx.db.patch(args.userId, updates);
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    plan: v.optional(v.union(v.literal("free"), v.literal("single_debug_fix"), v.literal("single_scan"), v.literal("interview_sprint"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      throw new Error(`User with email ${args.email} already exists in Convex`);
    }

    // Schedule Clerk user creation
    const clerkResult = await ctx.scheduler.runAfter(0, internalAny.adminActions.createUserInClerk, {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
    });

    // Create user in Convex database
    const plan = args.plan || "free";
    const name = `${args.firstName || ''} ${args.lastName || ''}`.trim() || args.email.split("@")[0];

    const userData: any = {
      tokenIdentifier: `pending_clerk_${Date.now()}_${Math.random().toString(36).substring(7)}`, // Will be updated when user logs in
      name: name,
      email: args.email,
      subscriptionTier: plan,
      credits: plan === "single_debug_fix" || plan === "single_scan" ? 1 : 0,
      trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
      emailVariant: "A",
      lastSeen: Date.now(),
    };

    if (plan === "interview_sprint") {
      userData.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    }

    if (plan === "single_debug_fix") {
      userData.singleDebugFixUsed = false;
    }

    const newUserId = await ctx.db.insert("users", userData);

    return `Successfully created user ${args.email} in both Clerk and Convex with plan: ${plan}`;
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    // Get user data before deletion
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete from Convex database
    await ctx.db.delete(args.userId);

    // Schedule deletion from Clerk
    if (user.tokenIdentifier) {
      await ctx.scheduler.runAfter(0, internalAny.adminActions.deleteUserFromClerk, {
        tokenIdentifier: user.tokenIdentifier,
      });
    }
  },
});

export const simulateWebhookEvent = action({
  args: {
    email: v.string(),
    plan: v.union(v.literal("single_debug_fix"), v.literal("single_scan"), v.literal("interview_sprint")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    const user = await ctx.runQuery(internalAny.users.getUserByEmail, { email: args.email });
    if (!user) {
      throw new Error(`User with email ${args.email} not found. Please ensure the user exists first.`);
    }

    if (!user.tokenIdentifier) {
       throw new Error("User has no token identifier (Clerk ID). Cannot simulate webhook.");
    }

    console.log(`Simulating webhook for user ${user.email} (${user.tokenIdentifier})`);

    await ctx.runMutation(internalAny.users.updateSubscription, {
      tokenIdentifier: user.tokenIdentifier,
      plan: args.plan,
    });

    return `✅ Simulated payment processed for ${args.email}. Credits updated directly.`;
  }
});

export const importUsersFromCSV = mutation({
  args: {
    csvData: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized");
    }

    const lines = args.csvData.split('\n');
    let count = 0;
    let updatedCount = 0;
    
    // Skip header
    const startIndex = lines[0].startsWith('id,') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV parsing (basic split by comma)
      const parts = line.split(',');
      const id = parts[0];
      const firstName = parts[1];
      const lastName = parts[2];
      const email = parts[4];
      
      if (!id || !email) continue;

      const name = `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0];

      // Check if user exists
      let user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", id)).unique();
      if (!user) {
        user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", email)).unique();
      }

      if (user) {
        // Update if needed
        if (user.tokenIdentifier !== id) {
             await ctx.db.patch(user._id, {
                tokenIdentifier: id,
             });
             updatedCount++;
        }
      } else {
        // Create
        await ctx.db.insert("users", {
            tokenIdentifier: id,
            name: name,
            email: email,
            subscriptionTier: "free",
            credits: 1,
            trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
            emailVariant: "A",
            lastSeen: Date.now(),
        });
        count++;
      }
    }
    return `Processed ${lines.length - startIndex} records. Created ${count} new users. Updated ${updatedCount} existing users.`;
  }
});

export const importUsersFromCSVInternal = internalMutation({
  args: {
    csvData: v.string(),
  },
  handler: async (ctx, args) => {
    const lines = args.csvData.split('\n');
    let count = 0;
    let updatedCount = 0;
    const logs = [];
    
    // Skip header
    const startIndex = lines[0].startsWith('id,') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV parsing (basic split by comma)
      const parts = line.split(',');
      const id = parts[0];
      const firstName = parts[1];
      const lastName = parts[2];
      const email = parts[4];
      
      if (!id || !email) continue;

      const name = `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0];

      // Check if user exists
      let user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", id)).unique();
      if (!user) {
        user = await ctx.db.query("users").withIndex("by_email", q => q.eq("email", email)).unique();
      }

      if (user) {
        // Update if needed
        if (user.tokenIdentifier !== id) {
             await ctx.db.patch(user._id, {
                tokenIdentifier: id,
             });
             updatedCount++;
        }
      } else {
        // Create
        await ctx.db.insert("users", {
            tokenIdentifier: id,
            name: name,
            email: email,
            subscriptionTier: "free",
            credits: 1,
            trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
            emailVariant: "A",
            lastSeen: Date.now(),
        });
        count++;
      }
    }
    return `Processed ${lines.length - startIndex} records. Created ${count} new users. Updated ${updatedCount} existing users.`;
  }
});