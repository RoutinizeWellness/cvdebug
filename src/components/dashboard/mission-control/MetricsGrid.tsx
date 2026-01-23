import { Eye, Send, AlertTriangle, TrendingUp, Zap, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";

const apiAny = api as any;

interface Metric {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: "up" | "down";
    value: string;
    label: string;
  };
  icon: any;
  progress?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

interface MetricsGridProps {
  metrics?: Metric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  // Fetch REAL data from backend
  const resumes = useQuery(apiAny.resumes.getResumes);
  const applications = useQuery(apiAny.jobTracker.getJobHistory);

  const calculatedMetrics: Metric[] = useMemo(() => {
    // Get latest resume with completed analysis
    const latestResume = resumes && resumes.length > 0
      ? resumes.find((r: any) => r.status === "completed" && r.score) || resumes[0]
      : null;

    const currentScore = latestResume?.score || 0;

    // Calculate score improvement from previous resume
    const previousScore = resumes && resumes.length > 1
      ? resumes[1]?.score || 0
      : 0;

    const scoreImprovement = previousScore > 0
      ? Math.round(currentScore - previousScore)
      : 0;

    // Count active applications
    const activeApplications = applications?.filter((app: any) =>
      app.status === "applied" || app.status === "interviewing"
    ).length || 0;

    // Count interviewing applications
    const interviewingCount = applications?.filter((app: any) =>
      app.status === "interviewing"
    ).length || 0;

    // Get missing keywords from latest resume
    const missingKeywords = latestResume?.missingKeywords || [];
    const criticalKeywords = Array.isArray(missingKeywords)
      ? missingKeywords.slice(0, 3)
      : [];
    const missingCount = criticalKeywords.length;

    return [
      {
        title: "Visibility Score",
        value: Math.round(currentScore),
        subtitle: "/100",
        trend: scoreImprovement !== 0 ? {
          direction: scoreImprovement > 0 ? "up" : "down",
          value: `${scoreImprovement > 0 ? '+' : ''}${scoreImprovement}%`,
          label: "from last scan",
        } : undefined,
        icon: Eye,
        progress: Math.round(currentScore),
        variant: currentScore >= 75 ? "success" : currentScore >= 50 ? "warning" : "danger",
      },
      {
        title: "Active Applications",
        value: activeApplications,
        trend: interviewingCount > 0 ? {
          direction: "up",
          value: interviewingCount.toString(),
          label: interviewingCount === 1 ? "interview scheduled" : "interviews scheduled",
        } : undefined,
        icon: Send,
        progress: Math.min(100, activeApplications * 10),
        variant: "default",
      },
      {
        title: "Missing Signals",
        value: missingCount,
        subtitle: missingCount > 0 ? "CRITICAL" : "",
        trend: missingCount > 0 ? {
          direction: "down",
          value: `-${missingCount * 5}%`,
          label: "Impacting match score by",
        } : undefined,
        icon: AlertTriangle,
        progress: missingCount > 0 ? Math.min(100, missingCount * 10) : 0,
        variant: missingCount > 0 ? "danger" : "success",
      },
    ];
  }, [resumes, applications]);

  const data = metrics || calculatedMetrics;

  const getVariantColors = (variant: string) => {
    switch (variant) {
      case "success":
        return {
          bar: "bg-[#22C55E] shadow-[0_0_10px_#10b981]",
          trend: "text-emerald-400 bg-emerald-400/10",
          icon: "text-emerald-400",
          border: "",
        };
      case "danger":
        return {
          bar: "bg-rose-500 shadow-[0_0_10px_#f43f5e]",
          trend: "text-rose-400 bg-rose-500/10",
          icon: "text-rose-500",
          border: "border-rose-500/20",
        };
      case "warning":
        return {
          bar: "bg-yellow-500 shadow-[0_0_10px_#eab308]",
          trend: "text-yellow-400 bg-yellow-400/10",
          icon: "text-yellow-400",
          border: "border-yellow-500/20",
        };
      default:
        return {
          bar: "bg-[#3B82F6] shadow-[0_0_10px_#3b82f6]",
          trend: "text-[#94A3B8] bg-[#475569]/10",
          icon: "text-[#94A3B8]",
          border: "",
        };
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((metric, index) => {
        const colors = getVariantColors(metric.variant || "default");
        const TrendIcon = metric.trend?.direction === "up" ? TrendingUp : ArrowDown;

        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`glass-panel rounded-xl p-5 relative overflow-hidden group ${colors.border}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <metric.icon className="h-16 w-16 text-[#0F172A]" />
            </div>

            <div className="flex flex-col gap-1 relative z-10">
              <p className="text-[#64748B] text-sm font-medium uppercase tracking-wider">
                {metric.title}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-[#0F172A] text-4xl font-mono font-bold">
                  {metric.value}
                  {metric.subtitle && metric.variant !== "danger" && (
                    <span className="text-xl text-[#64748B]">{metric.subtitle}</span>
                  )}
                </p>
                {metric.subtitle && metric.variant === "danger" && (
                  <span className="text-rose-400 font-bold text-sm bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {metric.subtitle}
                  </span>
                )}
              </div>

              {metric.trend && (
                <div
                  className={`flex items-center gap-1 mt-2 text-xs font-mono ${
                    metric.variant === "danger" ? "" : "w-fit px-2 py-1 rounded " + colors.trend
                  }`}
                >
                  {metric.variant !== "danger" ? (
                    <>
                      <TrendIcon className="h-3.5 w-3.5" />
                      {metric.trend.value} {metric.trend.label}
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3.5 w-3.5" />
                      {metric.trend.label} {metric.trend.value}
                    </>
                  )}
                </div>
              )}
            </div>

            {metric.progress !== undefined && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className={`h-full ${colors.bar}`}
                ></motion.div>
              </div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
