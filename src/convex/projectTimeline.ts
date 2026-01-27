import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const addTimelineEvent = internalMutation({
  args: {
    projectId: v.id("projects"),
    type: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return;

    const projectCreationTime = project._creationTime;
    const now = Date.now();
    const dayNumber = Math.floor((now - projectCreationTime) / (1000 * 60 * 60 * 24)) + 1;

    await ctx.db.insert("projectTimeline", {
      projectId: args.projectId,
      userId: project.userId,
      type: args.type,
      title: args.title,
      description: args.description,
      timestamp: now,
      dayNumber,
    });
  },
});

export const getProjectTimeline = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== identity.subject) return [];

    return await ctx.db
      .query("projectTimeline")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .take(50);
  },
});
