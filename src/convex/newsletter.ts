import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Newsletter subscription management
 * Captures emails for "The Resume Debugger" weekly newsletter
 */

export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.union(v.literal("landing"), v.literal("post-scan"), v.literal("dashboard"))
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    // Validate email format
    if (!email.includes("@") || email.length < 5) {
      throw new Error("Invalid email format");
    }

    // Check if already subscribed
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (existing) {
      // Update source if different
      if (existing.source !== args.source) {
        await ctx.db.patch(existing._id, {
          source: args.source,
          updatedAt: Date.now()
        });
      }
      return { success: true, alreadySubscribed: true };
    }

    // Create new subscriber
    await ctx.db.insert("newsletterSubscribers", {
      email,
      source: args.source,
      subscribedAt: Date.now(),
      isActive: true,
      emailsSent: 0
    });

    return { success: true, alreadySubscribed: false };
  }
});

export const unsubscribe = mutation({
  args: {
    email: v.string()
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", q => q.eq("email", email))
      .first();

    if (!subscriber) {
      throw new Error("Email not found");
    }

    await ctx.db.patch(subscriber._id, {
      isActive: false,
      unsubscribedAt: Date.now()
    });

    return { success: true };
  }
});

export const getSubscriberCount = query({
  args: {},
  handler: async (ctx) => {
    // OPTIMIZED: Use index instead of filter
    const subscribers = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_is_active", (q) => q.eq("isActive", true))
      .collect();

    return {
      total: subscribers.length,
      bySource: {
        landing: subscribers.filter(s => s.source === "landing").length,
        postScan: subscribers.filter(s => s.source === "post-scan").length,
        dashboard: subscribers.filter(s => s.source === "dashboard").length
      }
    };
  }
});
