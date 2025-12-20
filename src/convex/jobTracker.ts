import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getJobHistory = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.neq(q.field("jobTitle"), undefined))
      .order("desc")
      .take(50);

    return resumes.map((r) => ({
      _id: r._id,
      title: r.title,
      jobTitle: r.jobTitle,
      company: r.company,
      score: r.score,
      createdAt: r._creationTime,
    }));
  },
});

export const updateJobDetails = mutation({
  args: {
    resumeId: v.id("resumes"),
    jobTitle: v.string(),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) throw new Error("Resume not found");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity || resume.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.resumeId, {
      jobTitle: args.jobTitle,
      company: args.company,
    });
  },
});
