import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get all applications for the current user
export const getJobHistory = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // First, try to get applications from the applications table
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(50);

    if (applications.length > 0) {
      return applications.map((app) => ({
        _id: app._id,
        title: app.jobTitle,
        jobTitle: app.jobTitle,
        company: app.companyName,
        score: app.matchScore,
        status: app.status || "applied",
        appliedDate: app.appliedDate,
        _creationTime: app._creationTime,
      }));
    }

    // Fallback to resumes for backward compatibility
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
      status: "applied",
      _creationTime: r._creationTime,
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

// Create a new application
export const createApplication = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    companyName: v.string(),
    jobTitle: v.string(),
    jobDescriptionText: v.optional(v.string()),
    jobUrl: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("rejected"),
      v.literal("accepted")
    )),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Create a default project if none exists
    let projectId = args.projectId;
    if (!projectId) {
      const defaultProject = await ctx.db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", identity.subject))
        .first();

      if (!defaultProject) {
        projectId = await ctx.db.insert("projects", {
          userId: identity.subject,
          name: "Job Hunt 2026",
          targetRole: "Professional",
          status: "active",
        });
      } else {
        projectId = defaultProject._id;
      }
    }

    const applicationId = await ctx.db.insert("applications", {
      projectId,
      userId: identity.subject,
      companyName: args.companyName,
      jobTitle: args.jobTitle,
      jobDescriptionText: args.jobDescriptionText,
      jobUrl: args.jobUrl,
      status: args.status || "applied",
      appliedDate: Date.now(),
      events: [{
        type: "created",
        title: "Application Created",
        description: `Added ${args.jobTitle} at ${args.companyName}`,
        timestamp: Date.now(),
      }],
    });

    return applicationId;
  },
});

// Update application status
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("draft"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("rejected"),
      v.literal("accepted")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");
    if (application.userId !== identity.subject) throw new Error("Unauthorized");

    const existingEvents = application.events || [];
    const newEvent = {
      type: "status_change",
      title: `Status changed to ${args.status}`,
      description: `Application moved to ${args.status}`,
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      lastStatusUpdate: Date.now(),
      events: [...existingEvents, newEvent],
    });
  },
});

// Delete application
export const deleteApplication = mutation({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");
    if (application.userId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.delete(args.applicationId);
  },
});

// Get application by ID
export const getApplication = query({
  args: {
    applicationId: v.id("applications"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const application = await ctx.db.get(args.applicationId);
    if (!application || application.userId !== identity.subject) {
      return null;
    }

    return application;
  },
});
