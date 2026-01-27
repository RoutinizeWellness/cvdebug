/**
 * Product Hunt Launch Campaign
 * Handles launch team coordination and special offers
 */

import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all active users for launch team email
export const getLaunchTeam = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);

    // Only admin can access launch team
    if (!currentUser || currentUser.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized - Admin only");
    }

    // Get all users who have an email (active users)
    const users = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("email"), undefined))
      .order("desc")
      .take(500);

    return users.map(user => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      subscriptionTier: user.subscriptionTier,
      creditsUsed: (user.credits || 1) === 1 ? 0 : 1, // Assume 1 credit means unused
      lastSeen: user.lastSeen,
      _creationTime: user._creationTime,
    }));
  },
});

// Track Product Hunt visits and conversions
export const trackProductHuntVisit = mutation({
  args: {
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    await ctx.db.insert("productHuntTracking", {
      userId: identity?.subject,
      email: identity?.email,
      referrer: args.referrer,
      utmSource: args.utmSource || "product_hunt",
      utmCampaign: args.utmCampaign || "launch_2026",
      timestamp: Date.now(),
      converted: false,
    });
  },
});

// Apply Product Hunt special coupon
export const applyProductHuntCoupon = mutation({
  args: {
    couponCode: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Must be logged in");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("No identity");

    // Check if coupon is valid
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.couponCode.toUpperCase()))
      .first();

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (!coupon.active) {
      throw new Error("This coupon is no longer active");
    }

    if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
      throw new Error("This coupon has expired");
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new Error("This coupon has reached its usage limit");
    }

    // Check if user already used this coupon
    const existingUsage = await ctx.db
      .query("couponUsages")
      .withIndex("by_user_and_coupon", (q) =>
        q.eq("userId", identity.subject).eq("couponId", coupon._id)
      )
      .first();

    if (existingUsage) {
      throw new Error("You have already used this coupon");
    }

    // Record coupon usage
    await ctx.db.insert("couponUsages", {
      userId: identity.subject,
      email: identity.email,
      couponId: coupon._id,
      couponCode: coupon.code,
      discountPercent: coupon.discountPercent,
      appliedAt: Date.now(),
    });

    // Update coupon usage count
    await ctx.db.patch(coupon._id, {
      usedCount: (coupon.usedCount || 0) + 1,
    });

    // Mark Product Hunt tracking as converted if applicable
    if (coupon.code === "PH50") {
      const tracking = await ctx.db
        .query("productHuntTracking")
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .order("desc")
        .first();

      if (tracking) {
        await ctx.db.patch(tracking._id, {
          converted: true,
          convertedAt: Date.now(),
        });
      }
    }

    return {
      success: true,
      discount: coupon.discountPercent,
      message: `${coupon.discountPercent}% discount applied!`,
    };
  },
});

// Create Product Hunt launch coupon (admin only)
export const createProductHuntCoupon = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    // Only admin can create coupons
    if (!user || user.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized - Admin only");
    }

    // Check if PH50 coupon already exists
    const existing = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", "PH50"))
      .first();

    if (existing) {
      return { success: true, message: "PH50 coupon already exists", couponId: existing._id };
    }

    // Create PH50 coupon: 50% off, valid for 48 hours, max 100 uses
    const couponId = await ctx.db.insert("coupons", {
      code: "PH50",
      discountPercent: 50,
      active: true,
      maxUses: 100,
      usedCount: 0,
      expiresAt: Date.now() + (48 * 60 * 60 * 1000), // 48 hours
      createdBy: user.email,
      description: "Product Hunt Launch Special - 50% off for 48 hours",
    });

    return {
      success: true,
      message: "PH50 coupon created successfully",
      couponId,
      expiresIn: "48 hours",
    };
  },
});

// Get Product Hunt launch stats (admin only)
export const getProductHuntStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user || user.email !== "tiniboti@gmail.com") {
      throw new Error("Unauthorized - Admin only");
    }

    // Get all Product Hunt visits
    const visits = await ctx.db
      .query("productHuntTracking")
      .order("desc")
      .take(1000);

    const totalVisits = visits.length;
    const conversions = visits.filter(v => v.converted).length;
    const conversionRate = totalVisits > 0 ? (conversions / totalVisits) * 100 : 0;

    // Get PH50 coupon usage
    const ph50Coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", "PH50"))
      .first();

    const couponUsages = ph50Coupon
      ? await ctx.db
          .query("couponUsages")
          .withIndex("by_coupon", (q) => q.eq("couponId", ph50Coupon._id))
          .collect()
      : [];

    return {
      totalVisits,
      conversions,
      conversionRate: Math.round(conversionRate * 10) / 10,
      couponUsages: couponUsages.length,
      couponMaxUses: ph50Coupon?.maxUses || 100,
      couponActive: ph50Coupon?.active || false,
      couponExpiresAt: ph50Coupon?.expiresAt,
    };
  },
});
