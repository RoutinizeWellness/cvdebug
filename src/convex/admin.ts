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