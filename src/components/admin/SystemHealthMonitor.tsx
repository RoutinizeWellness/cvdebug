import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Activity, CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { CardSkeleton } from "@/components/ui/skeleton";

interface HealthMetric {
  label: string;
  value: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "critical";
  icon: React.ReactNode;
  description: string;
}

/**
 * System Health Monitor Component
 * Real-time system health metrics and status indicators
 */
export function SystemHealthMonitor() {
  const systemStats = useQuery(api.admin.stats.getSystemStats);
  const performanceStats = useQuery(api.admin.stats.getPerformanceOverview);

  if (!systemStats || !performanceStats) {
    return <CardSkeleton />;
  }

  const getHealthStatus = (value: number, thresholds: { excellent: number; good: number; warning: number }): "excellent" | "good" | "warning" | "critical" => {
    if (value >= thresholds.excellent) return "excellent";
    if (value >= thresholds.good) return "good";
    if (value >= thresholds.warning) return "warning";
    return "critical";
  };

  const metrics: HealthMetric[] = [
    {
      label: "System Health",
      value: systemStats.systemHealth,
      unit: "%",
      status: getHealthStatus(systemStats.systemHealth, { excellent: 95, good: 85, warning: 70 }),
      icon: <Activity className="w-5 h-5" />,
      description: "Success rate of resume analysis",
    },
    {
      label: "Average Score",
      value: performanceStats.avgScore,
      unit: "/100",
      status: getHealthStatus(performanceStats.avgScore, { excellent: 75, good: 60, warning: 45 }),
      icon: <CheckCircle2 className="w-5 h-5" />,
      description: "Average resume quality score",
    },
    {
      label: "Success Rate",
      value: performanceStats.successRate,
      unit: "%",
      status: getHealthStatus(performanceStats.successRate, { excellent: 95, good: 85, warning: 70 }),
      icon: <CheckCircle2 className="w-5 h-5" />,
      description: "Analysis completion rate",
    },
    {
      label: "Processing Time",
      value: performanceStats.avgProcessingTime,
      unit: "ms",
      status: getHealthStatus(
        10000 - performanceStats.avgProcessingTime,
        { excellent: 7000, good: 5000, warning: 3000 }
      ),
      icon: <Clock className="w-5 h-5" />,
      description: "Average analysis duration",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return {
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-700 dark:text-green-400",
          border: "border-green-200 dark:border-green-800",
          icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
        };
      case "good":
        return {
          bg: "bg-[#F1F5F9] dark:bg-[#0F172A]/30",
          text: "text-[#0F172A] dark:text-[#94A3B8]",
          border: "border-[#E2E8F0] dark:border-[#0F172A]",
          icon: <CheckCircle2 className="w-5 h-5 text-[#1E293B] dark:text-[#94A3B8]" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "text-yellow-700 dark:text-yellow-400",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
        };
      case "critical":
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-800",
          icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-800/30",
          text: "text-slate-700 dark:text-slate-400",
          border: "border-slate-200 dark:border-slate-700",
          icon: <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
        };
    }
  };

  const overallStatus = metrics.every(m => m.status === "excellent" || m.status === "good")
    ? "healthy"
    : metrics.some(m => m.status === "critical")
    ? "critical"
    : "warning";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            overallStatus === "healthy"
              ? "bg-green-100 dark:bg-green-900/30"
              : overallStatus === "warning"
              ? "bg-yellow-100 dark:bg-yellow-900/30"
              : "bg-red-100 dark:bg-red-900/30"
          }`}>
            {overallStatus === "healthy" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : overallStatus === "warning" ? (
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              System Health
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time monitoring
            </p>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`px-4 py-2 rounded-lg font-semibold ${
            overallStatus === "healthy"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : overallStatus === "warning"
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {overallStatus === "healthy" ? "All Systems Operational" : overallStatus === "warning" ? "Degraded Performance" : "Critical Issues"}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const colors = getStatusColor(metric.status);
          const displayValue = metric.unit === "ms"
            ? metric.value < 1000
              ? `${metric.value}${metric.unit}`
              : `${(metric.value / 1000).toFixed(1)}s`
            : `${metric.value.toFixed(1)}${metric.unit}`;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${colors.border} ${colors.bg} hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={colors.text}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${colors.text}`}>
                      {metric.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {metric.description}
                    </p>
                  </div>
                </div>
                {colors.icon}
              </div>

              <div className="flex items-end justify-between">
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className={`text-3xl font-bold ${colors.text}`}
                >
                  {displayValue}
                </motion.p>

                <span className={`text-xs font-semibold px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
                  {metric.status.toUpperCase()}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: metric.unit === "ms"
                      ? `${Math.min(100, (10000 - metric.value) / 100)}%`
                      : `${Math.min(100, metric.value)}%`
                  }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className={`h-full rounded-full ${
                    metric.status === "excellent" || metric.status === "good"
                      ? "bg-green-500"
                      : metric.status === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Processed</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {performanceStats.totalProcessed.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Now</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {systemStats.activeUsers.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
