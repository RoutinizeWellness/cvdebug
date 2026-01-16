import { v } from "convex/values";
import { internalQuery, internalMutation } from "../../_generated/server";

/**
 * Data access layer for market intelligence
 * Separated from actions to avoid "use node" restrictions
 */

export const getMarketDataForRole = internalQuery({
  args: {
    role: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobMarketData")
      .withIndex("by_role_and_location", (q) =>
        q.eq("role", args.role).eq("location", args.location)
      )
      .first();
  },
});

export const getAllSkillsForecasts = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("skillsDemandForecast")
      .withIndex("by_roi")
      .order("desc")
      .take(50); // Top 50 skills by ROI
  },
});

export const getUserSalaryHistory = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("marketIntelligence")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", args.userId).eq("reportType", "salary")
      )
      .order("desc")
      .first();
  },
});

export const saveMarketIntelligence = internalMutation({
  args: {
    userId: v.string(),
    reportType: v.union(
      v.literal("salary"),
      v.literal("skills_demand"),
      v.literal("role_transition"),
      v.literal("location"),
      v.literal("competitive")
    ),
    currentRole: v.string(),
    currentSalary: v.optional(v.number()),
    experience: v.number(),
    location: v.string(),
    skills: v.array(v.string()),
    data: v.any(),
    generatedAt: v.number(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("marketIntelligence", args);
  },
});

export const seedSkillsForecastData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db
      .query("skillsDemandForecast")
      .first();

    if (existing) {
      console.log("Skills forecast data already seeded");
      return;
    }

    const currentYear = new Date().getFullYear();

    const skillsData = [
      {
        skill: "AI/Machine Learning",
        currentDemand: 45000,
        trend: "rising" as const,
        growthRate: 85,
        salaryPremium: 28000,
        learningTime: 200,
      },
      {
        skill: "Kubernetes",
        currentDemand: 38000,
        trend: "rising" as const,
        growthRate: 65,
        salaryPremium: 22000,
        learningTime: 80,
      },
      {
        skill: "React",
        currentDemand: 120000,
        trend: "stable" as const,
        growthRate: 15,
        salaryPremium: 12000,
        learningTime: 60,
      },
      {
        skill: "TypeScript",
        currentDemand: 95000,
        trend: "rising" as const,
        growthRate: 45,
        salaryPremium: 15000,
        learningTime: 40,
      },
      {
        skill: "AWS",
        currentDemand: 150000,
        trend: "rising" as const,
        growthRate: 35,
        salaryPremium: 20000,
        learningTime: 100,
      },
      {
        skill: "Python",
        currentDemand: 180000,
        trend: "stable" as const,
        growthRate: 20,
        salaryPremium: 18000,
        learningTime: 80,
      },
      {
        skill: "DevOps",
        currentDemand: 65000,
        trend: "rising" as const,
        growthRate: 50,
        salaryPremium: 25000,
        learningTime: 120,
      },
      {
        skill: "Data Engineering",
        currentDemand: 42000,
        trend: "rising" as const,
        growthRate: 70,
        salaryPremium: 30000,
        learningTime: 150,
      },
      {
        skill: "Go",
        currentDemand: 28000,
        trend: "rising" as const,
        growthRate: 55,
        salaryPremium: 22000,
        learningTime: 60,
      },
      {
        skill: "Terraform",
        currentDemand: 32000,
        trend: "rising" as const,
        growthRate: 60,
        salaryPremium: 18000,
        learningTime: 50,
      },
      {
        skill: "GraphQL",
        currentDemand: 25000,
        trend: "stable" as const,
        growthRate: 25,
        salaryPremium: 12000,
        learningTime: 30,
      },
      {
        skill: "Rust",
        currentDemand: 18000,
        trend: "rising" as const,
        growthRate: 75,
        salaryPremium: 28000,
        learningTime: 150,
      },
      {
        skill: "Blockchain/Web3",
        currentDemand: 22000,
        trend: "declining" as const,
        growthRate: -15,
        salaryPremium: 35000,
        learningTime: 180,
      },
    ];

    // Calculate forecasts and ROI
    for (const skill of skillsData) {
      const forecast6Months = Math.round(skill.currentDemand * (1 + (skill.growthRate / 100) * 0.5));
      const forecast12Months = Math.round(skill.currentDemand * (1 + skill.growthRate / 100));
      const roi = Math.round((skill.salaryPremium / skill.learningTime) * 100);

      await ctx.db.insert("skillsDemandForecast", {
        skill: skill.skill,
        category: "technical",
        currentDemand: skill.currentDemand,
        trend: skill.trend,
        growthRate: skill.growthRate,
        forecast6Months,
        forecast12Months,
        salaryPremium: skill.salaryPremium,
        learningTime: skill.learningTime,
        roi,
        updatedAt: Date.now(),
      });
    }

    console.log(`Seeded ${skillsData.length} skills forecast records`);
  },
});
