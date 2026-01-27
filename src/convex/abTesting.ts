import { v } from "convex/values";
import { query } from "./_generated/server";

// Get A/B testing analytics for CV versions
export const getCVVersionAnalytics = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all applications for this user
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (applications.length === 0) {
      return {
        hasData: false,
        message: "No applications tracked yet. Start adding applications to see CV performance analytics!",
        versions: [],
        totalApplications: 0,
        interviewRate: 0,
      };
    }

    // Group applications by CV version
    const versionStats: Record<
      string,
      {
        versionName: string;
        totalApplications: number;
        interviews: number;
        offers: number;
        averageScore: number;
        successRate: number;
        resumeIds: string[];
      }
    > = {};

    for (const app of applications) {
      const versionName = app.cvVersionName || "Unknown Version";

      if (!versionStats[versionName]) {
        versionStats[versionName] = {
          versionName,
          totalApplications: 0,
          interviews: 0,
          offers: 0,
          averageScore: 0,
          successRate: 0,
          resumeIds: [],
        };
      }

      versionStats[versionName].totalApplications++;

      if (app.status === "interviewing") {
        versionStats[versionName].interviews++;
      }

      if (app.status === "accepted") {
        versionStats[versionName].offers++;
      }

      if (app.cvVersionScore) {
        versionStats[versionName].averageScore += app.cvVersionScore;
      }

      if (app.cvSnapshotId) {
        versionStats[versionName].resumeIds.push(app.cvSnapshotId);
      }
    }

    // Calculate success rates and averages
    const versions = Object.values(versionStats).map((stat) => {
      const averageScore =
        stat.averageScore > 0
          ? Math.round(stat.averageScore / stat.totalApplications)
          : 0;

      const successRate =
        stat.totalApplications > 0
          ? Math.round(((stat.interviews + stat.offers) / stat.totalApplications) * 100)
          : 0;

      return {
        ...stat,
        averageScore,
        successRate,
      };
    });

    // Sort by success rate
    versions.sort((a, b) => b.successRate - a.successRate);

    // Calculate overall stats
    const totalApplications = applications.length;
    const totalInterviews = applications.filter(
      (app) => app.status === "interviewing" || app.status === "accepted"
    ).length;
    const overallInterviewRate = Math.round((totalInterviews / totalApplications) * 100);

    // Find best and worst performing versions
    const bestVersion = versions[0];
    const worstVersion = versions[versions.length - 1];

    // Generate insights
    const insights = [];

    if (versions.length > 1 && bestVersion && worstVersion) {
      const improvement = bestVersion.successRate - worstVersion.successRate;
      if (improvement > 10) {
        insights.push({
          type: "success" as const,
          title: "Clear Winner Detected!",
          message: `Your "${bestVersion.versionName}" CV performs ${improvement}% better than "${worstVersion.versionName}". Use this version for future applications!`,
        });
      }
    }

    // Check if any version has high volume but low success
    for (const version of versions) {
      if (version.totalApplications >= 5 && version.successRate < 10) {
        insights.push({
          type: "warning" as const,
          title: `"${version.versionName}" is Underperforming`,
          message: `You've sent ${version.totalApplications} applications with this CV but only ${version.successRate}% success rate. Consider revising it.`,
        });
      }
    }

    // Check if user needs more data
    if (totalApplications < 5) {
      insights.push({
        type: "info" as const,
        title: "Need More Data",
        message: `Track at least 5 applications to get meaningful insights. Current: ${totalApplications}`,
      });
    }

    // Check for consistent high performer
    const consistentWinners = versions.filter(
      (v) => v.totalApplications >= 3 && v.successRate >= 50
    );
    if (consistentWinners.length > 0) {
      insights.push({
        type: "success" as const,
        title: "High Performing CV Found",
        message: `Your "${consistentWinners[0].versionName}" has a ${consistentWinners[0].successRate}% success rate. This is your golden ticket!`,
      });
    }

    return {
      hasData: true,
      versions,
      totalApplications,
      interviewRate: overallInterviewRate,
      bestVersion: bestVersion || null,
      worstVersion: worstVersion || null,
      insights,
      message:
        versions.length > 1
          ? "A/B testing data available. See which CV version gets you more interviews!"
          : "Start creating different CV versions to compare their performance.",
    };
  },
});

// Get detailed comparison between two CV versions
export const compareCVVersions = query({
  args: {
    userId: v.string(),
    versionA: v.string(),
    versionB: v.string(),
  },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const versionAApps = applications.filter(
      (app) => app.cvVersionName === args.versionA
    );
    const versionBApps = applications.filter(
      (app) => app.cvVersionName === args.versionB
    );

    const calculateStats = (apps: typeof applications) => {
      const total = apps.length;
      const interviews = apps.filter(
        (app) => app.status === "interviewing" || app.status === "accepted"
      ).length;
      const offers = apps.filter((app) => app.status === "accepted").length;
      const avgScore =
        apps.reduce((sum, app) => sum + (app.cvVersionScore || 0), 0) / total || 0;

      return {
        total,
        interviews,
        offers,
        avgScore: Math.round(avgScore),
        interviewRate: total > 0 ? Math.round((interviews / total) * 100) : 0,
        offerRate: total > 0 ? Math.round((offers / total) * 100) : 0,
      };
    };

    const statsA = calculateStats(versionAApps);
    const statsB = calculateStats(versionBApps);

    // Determine winner
    let winner: "A" | "B" | "tie" = "tie";
    if (statsA.interviewRate > statsB.interviewRate) {
      winner = "A";
    } else if (statsB.interviewRate > statsA.interviewRate) {
      winner = "B";
    }

    const improvement =
      winner === "A"
        ? statsA.interviewRate - statsB.interviewRate
        : winner === "B"
        ? statsB.interviewRate - statsA.interviewRate
        : 0;

    return {
      versionA: {
        name: args.versionA,
        ...statsA,
      },
      versionB: {
        name: args.versionB,
        ...statsB,
      },
      winner,
      improvement,
      recommendation:
        winner === "tie"
          ? "Both versions perform equally. Keep testing!"
          : `Version ${winner} (${winner === "A" ? args.versionA : args.versionB}) performs ${improvement}% better. Use this for future applications!`,
    };
  },
});
