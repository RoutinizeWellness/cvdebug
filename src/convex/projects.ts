import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createProject = mutation({
  args: {
    name: v.string(),
    targetRole: v.string(),
    description: v.optional(v.string()),
    masterCvId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const projectId = await ctx.db.insert("projects", {
      userId: identity.subject,
      name: args.name,
      targetRole: args.targetRole,
      description: args.description,
      masterCvId: args.masterCvId,
      status: "active",
      healthStatus: "healthy",
      lastHealthCheck: Date.now(),
    });

    return projectId;
  },
});

export const getProjects = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("paused"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    if (args.status) {
      return await ctx.db
        .query("projects")
        .withIndex("by_user_and_status", (q) => 
          q.eq("userId", identity.subject).eq("status", args.status)
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();
  },
});

export const updateProjectHealth = mutation({
  args: {
    projectId: v.id("projects"),
    healthStatus: v.union(v.literal("healthy"), v.literal("warning"), v.literal("critical")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity || project.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.projectId, {
      healthStatus: args.healthStatus,
      lastHealthCheck: Date.now(),
    });
  },
});

export const updateProjectStatus = mutation({
  args: {
    projectId: v.id("projects"),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity || project.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.projectId, {
      status: args.status,
    });
  },
});
