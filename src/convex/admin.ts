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

    let fixedCount = 0;
    let logs = [];

    for (const id of idsToFix) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", id))
        .unique();

      if (user) {
        logs.push(`Found user ${user.name} (${user.email})`);
        // Update to single_scan if not already
        if (user.subscriptionTier !== "single_scan" && user.subscriptionTier !== "bulk_pack") {
           // Also ensure they have at least 1 credit if they are single_scan
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