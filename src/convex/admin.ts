import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    const fixes = [
      { email: "juratbupt@gmail.com", creditsToAdd: 2, plan: "single_scan" }, // 2 payments
      { email: "adty910@gmail.com", creditsToAdd: 2, plan: "single_scan" },   // 2 payments
      { email: "lyp@oregonstate.edu", creditsToAdd: 3, plan: "single_scan" }  // 3 payments
    ];

    let logs = [];
    let fixedCount = 0;

    for (const fix of fixes) {
      // Try to find by email
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", fix.email))
        .unique();

      if (user) {
        const currentCredits = user.credits || 0;
        // We add the credits because they paid multiple times
        const newCredits = currentCredits + fix.creditsToAdd;
        
        await ctx.db.patch(user._id, {
          subscriptionTier: fix.plan as "single_scan" | "bulk_pack",
          credits: newCredits
        });
        
        logs.push(`✅ Fixed ${fix.email}: Added ${fix.creditsToAdd} credits. Total: ${newCredits}`);
        fixedCount++;
      } else {
        // Try to find by partial email match if exact match fails (e.g. case sensitivity or aliases)
        const potentialUser = await ctx.db.query("users").collect();
        const found = potentialUser.find(u => u.email && u.email.toLowerCase().includes(fix.email.toLowerCase()));
        
        if (found) {
           const currentCredits = found.credits || 0;
           const newCredits = currentCredits + fix.creditsToAdd;
           
           await ctx.db.patch(found._id, {
             subscriptionTier: fix.plan as "single_scan" | "bulk_pack",
             credits: newCredits
           });
           logs.push(`✅ Fixed (Fuzzy Match) ${found.email}: Added ${fix.creditsToAdd} credits. Total: ${newCredits}`);
           fixedCount++;
        } else {
           logs.push(`❌ User ${fix.email} not found in database`);
        }
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
    identifier: v.string(), // Email or TokenIdentifier
    plan: v.union(v.literal("single_scan"), v.literal("bulk_pack")),
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

    if (!user) {
      throw new Error(`User not found with identifier: ${args.identifier}`);
    }

    const creditsToAdd = args.plan === "single_scan" ? 1 : args.plan === "bulk_pack" ? 5 : 0;
    const currentCredits = user.credits ?? 0;

    await ctx.db.patch(user._id, {
      subscriptionTier: args.plan,
      credits: currentCredits + creditsToAdd,
    });

    return `Successfully granted ${args.plan} (+${creditsToAdd} credits) to ${user.email || user.name}`;
  },
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