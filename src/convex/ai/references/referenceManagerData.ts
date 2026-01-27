import { v } from "convex/values";
import { internalQuery, internalMutation } from "../../_generated/server";

/**
 * Data access layer for reference manager
 * Separated from actions to avoid "use node" restrictions
 */

export const insertReference = internalMutation({
  args: {
    userId: v.string(),
    name: v.string(),
    title: v.string(),
    company: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    relationship: v.union(v.literal("manager"), v.literal("colleague"), v.literal("mentor"), v.literal("client"), v.literal("professor")),
    duration: v.string(),
    strengthScore: v.number(),
    seniority: v.union(v.literal("entry"), v.literal("mid"), v.literal("senior"), v.literal("executive")),
    relevance: v.number(),
    credibility: v.number(),
    preferredContact: v.union(v.literal("email"), v.literal("phone"), v.literal("linkedin")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("references", args);
  },
});

export const getUserReferences = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("references")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getReference = internalQuery({
  args: { referenceId: v.id("references") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.referenceId);
  },
});

export const getUserByToken = internalQuery({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();
  },
});

export const createReferenceRequest = internalMutation({
  args: {
    userId: v.string(),
    referenceId: v.id("references"),
    jobTitle: v.string(),
    company: v.string(),
    emailSubject: v.string(),
    emailBody: v.string(),
    requestSentAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("referenceRequests", {
      ...args,
      status: "pending",
      remindersSent: 0,
    });
  },
});

export const updateReferenceLastContacted = internalMutation({
  args: {
    referenceId: v.id("references"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.referenceId, {
      lastContactedAt: args.timestamp,
    });
  },
});

export const getPendingRequests = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("referenceRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

export const updateReminderSent = internalMutation({
  args: {
    requestId: v.id("referenceRequests"),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.requestId);
    if (request) {
      await ctx.db.patch(args.requestId, {
        remindersSent: request.remindersSent + 1,
        lastReminderAt: args.timestamp,
      });
    }
  },
});
