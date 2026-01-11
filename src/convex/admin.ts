import { query, mutation, action, internalMutation } from "./_generated/server";
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
    const basicProUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "basic_pro")).collect();
    const sprintUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "interview_sprint")).collect();
    const lifetimeUsers = await ctx.db.query("users").withIndex("by_subscription_tier", q => q.eq("subscriptionTier", "lifetime")).collect();

    return {
      free: freeUsers.length,
      basicPro: basicProUsers.length,
      interviewSprint: sprintUsers.length,
      lifetime: lifetimeUsers.length,
      total: freeUsers.length + basicProUsers.length + sprintUsers.length + lifetimeUsers.length
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

    // Find users who have credits > 1 (default free is 1) but are still marked as "free"
    // This implies they bought credits but the tier wasn't updated
    const allUsers = await ctx.db.query("users").collect();
    let fixedCount = 0;

    for (const user of allUsers) {
      if (user.subscriptionTier === "free" && (user.credits || 0) > 1) {
        // Heuristic: If they have > 1 credits, they likely paid.
        // If they have sprint access, they're on interview_sprint
        // Otherwise they're on basic_pro if they have credits

        let newTier: "basic_pro" | "interview_sprint" = "basic_pro";
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
          subscriptionTier: fix.plan as "basic_pro" | "interview_sprint" | "lifetime",
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
          subscriptionTier: fix.plan as "basic_pro" | "interview_sprint" | "lifetime",
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
    plan: v.union(v.literal("single_scan"), v.literal("interview_sprint")),
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

    const creditsToAdd = args.plan === "single_scan" ? 1 : 0;
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
    plan: v.union(v.literal("free"), v.literal("single_scan"), v.literal("interview_sprint")),
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

    await ctx.db.patch(args.userId, updates);
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
    plan: v.union(v.literal("single_scan"), v.literal("interview_sprint")),
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