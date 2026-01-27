import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const toggleAnalyticsSharing = mutation({
  args: {
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("NOT_AUTHENTICATED");
    }

    const tokenIdentifier = identity.tokenIdentifier;

    // Get user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();

    if (!existingUser) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    // Update analytics sharing preference
    await ctx.db.patch(existingUser._id, {
      analyticsSharing: args.enabled,
    });

    return { success: true };
  },
});

export const getAnalyticsPreference = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { analyticsSharing: false };
    }

    const tokenIdentifier = identity.tokenIdentifier;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .first();

    return {
      analyticsSharing: user?.analyticsSharing ?? false,
    };
  },
});
