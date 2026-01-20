import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

const internalAny = require("./_generated/api").internal;

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

    // PAID FEATURE: Projects are only for paid users
    const isPaidUser = user.subscriptionTier === "single_scan" || user.subscriptionTier === "interview_sprint";
    if (!isPaidUser) {
      throw new Error("PLAN_RESTRICTION: Upgrade to Single Scan or Interview Sprint to create job search projects.");
    }

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

    let projects;
    if (args.status) {
      projects = await ctx.db
        .query("projects")
        .withIndex("by_user_and_status", (q) => 
          q.eq("userId", identity.subject).eq("status", args.status)
        )
        .order("desc")
        .collect();
    } else {
      projects = await ctx.db
        .query("projects")
        .withIndex("by_user", (q) => q.eq("userId", identity.subject))
        .order("desc")
        .collect();
    }

    // Enrich with Master CV score (globalScore)
    return await Promise.all(projects.map(async (project) => {
      let globalScore = 0;
      if (project.masterCvId) {
        const cv = await ctx.db.get(project.masterCvId);
        if (cv) {
          // Use score from resume if available
          globalScore = (cv as any).score || 0;
        }
      }
      return { ...project, globalScore };
    }));
  },
});

export const getProjectStats = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== identity.subject) {
      return null;
    }

    // Get all applications for this project
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const totalApplications = applications.length;
    const appliedCount = applications.filter(a => a.status === "applied" || a.status === "interviewing").length;
    const interviewingCount = applications.filter(a => a.status === "interviewing").length;
    const rejectedCount = applications.filter(a => a.status === "rejected").length;
    const acceptedCount = applications.filter(a => a.status === "accepted").length;

    // Calculate Average Success Probability (based on match scores)
    let validScoreCount = 0;
    const scoresSum = applications.reduce((sum, app) => {
      let score = (app as any).matchScore || 0;
      // Calculate score from keywords if not explicitly stored
      if (!score) {
        const matched = app.matchedKeywords?.length || 0;
        const missing = app.missingKeywords?.length || 0;
        const total = matched + missing;
        if (total > 0) {
          score = Math.round((matched / total) * 100);
        }
      }
      
      if (score > 0) {
        validScoreCount++;
        return sum + score;
      }
      return sum;
    }, 0);

    const averageSuccessProbability = validScoreCount > 0 
      ? Math.round(scoresSum / validScoreCount) 
      : 0;

    return {
      totalApplications,
      appliedCount,
      interviewingCount,
      rejectedCount,
      acceptedCount,
      averageSuccessProbability,
      conversionRate: appliedCount > 0 ? Math.round((interviewingCount / appliedCount) * 100) : 0,
    };
  },
});

export const validateMasterCVIntegrity = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const project = await ctx.db.get(args.projectId);
    if (!project || project.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    if (!project.masterCvId) {
      return { status: "no_cv", message: "No master CV attached" };
    }

    const resume = await ctx.db.get(project.masterCvId);
    if (!resume) {
      return { status: "error", message: "Master CV not found" };
    }

    // Check if integrity check is recent (within last 24 hours)
    const lastCheck = resume.lastIntegrityCheck || 0;
    const now = Date.now();
    const hoursSinceCheck = (now - lastCheck) / (1000 * 60 * 60);

    if (hoursSinceCheck < 24 && resume.textLayerIntegrity !== undefined) {
      return {
        status: "cached",
        integrityScore: resume.textLayerIntegrity,
        hasImageTrap: resume.hasImageTrap,
        lastCheck,
      };
    }

    // Trigger fresh integrity check
    if (resume.ocrText) {
      await ctx.scheduler.runAfter(0, internalAny.cvHealthMonitor.checkTextLayerIntegrity, {
        resumeId: project.masterCvId,
        ocrText: resume.ocrText,
      });
    }

    return {
      status: "checking",
      message: "Integrity check in progress",
    };
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