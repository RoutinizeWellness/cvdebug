/**
 * Development script to create test users
 * This bypasses admin authentication for development purposes
 */

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Cast internal to any to avoid type instantiation issues
const internalAny = require("./_generated/api").internal;

export const createTestUser = internalMutation({
  args: {
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    plan: v.optional(v.union(v.literal("free"), v.literal("single_scan"), v.literal("interview_sprint"))),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      console.log(`User with email ${args.email} already exists`);
      return `User ${args.email} already exists with ID: ${existingUser._id}`;
    }

    // Schedule Clerk user creation
    await ctx.scheduler.runAfter(0, internalAny.adminActions.createUserInClerk, {
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
    });

    // Create user in Convex database
    const plan = args.plan || "free";
    const name = `${args.firstName || ''} ${args.lastName || ''}`.trim() || args.email.split("@")[0];

    const userData: any = {
      tokenIdentifier: `pending_clerk_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      name: name,
      email: args.email,
      subscriptionTier: plan,
      credits: plan === "single_scan" ? 1 : 0,
      trialEndsOn: Date.now() + (15 * 24 * 60 * 60 * 1000),
      emailVariant: "A",
      lastSeen: Date.now(),
    };

    if (plan === "interview_sprint") {
      userData.sprintExpiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    }

    const newUserId = await ctx.db.insert("users", userData);

    console.log(`Created user ${args.email} with ID: ${newUserId}`);
    return `Successfully created user ${args.email} in both Clerk and Convex with plan: ${plan} (ID: ${newUserId})`;
  },
});
