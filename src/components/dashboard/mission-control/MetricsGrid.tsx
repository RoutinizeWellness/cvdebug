import { Eye, Send, AlertTriangle, TrendingUp, Zap, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

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
  const defaultMetrics: Metric[] = [
    {
      title: "Visibility Score",
      value: "88",
      subtitle: "/100",
      trend: {
        direction: "up",
        value: "+5%",
        label: "this week",
      },
      icon: Eye,
      progress: 88,
      variant: "success",
    },
    {
      title: "Active Applications",
      value: "12",
      trend: {
        direction: "up",
        value: "2",
        label: "interviews scheduled",
      },
      icon: Send,
      progress: 40,
      variant: "default",
    },
    {
      title: "Missing Signals",
      value: "3",
      subtitle: "CRITICAL",
      trend: {
        direction: "down",
        value: "-15%",
        label: "Impacting match score by",
      },
      icon: AlertTriangle,
      progress: 25,
      variant: "danger",
    },
  ];

  const data = metrics || defaultMetrics;

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
          trend: "text-blue-400 bg-blue-400/10",
          icon: "text-blue-400",
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
