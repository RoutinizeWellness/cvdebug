import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get user settings including subscription details
export const getUserSettings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      sprintExpiresAt: user.sprintExpiresAt,
      credits: user.credits,
      shareAnalytics: user.shareAnalytics ?? true,
      apiKey: user.apiKey
    };
  }
});

// Update user profile (name, email)
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const updates: any = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;

    await ctx.db.patch(user._id, updates);

    return { success: true };
  }
});

// Toggle analytics sharing
export const toggleAnalyticsSharing = mutation({
  args: {
    enabled: v.boolean()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      shareAnalytics: args.enabled
    });

    return { success: true };
  }
});

// Generate new API key
export const generateApiKey = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Generate a random API key
    const apiKey = `cvd_${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`;

    await ctx.db.patch(user._id, {
      apiKey
    });

    return { success: true, apiKey };
  }
});

// Cancel subscription (set expiry to now)
export const cancelSubscription = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Set expiry to now (cancels immediately)
    await ctx.db.patch(user._id, {
      sprintExpiresAt: Date.now()
    });

    return { success: true };
  }
});

// Request account deletion (admin must complete)
export const requestAccountDeletion = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // Mark for deletion (admin review required)
    await ctx.db.patch(user._id, {
      deletionRequested: true,
      deletionRequestedAt: Date.now()
    });

    return { success: true };
  }
});
