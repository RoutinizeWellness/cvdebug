import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  CheckCircle2,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

/**
 * Error Tracking Dashboard Component
 * Displays system errors, trends, and resolution status
 */
export function ErrorTrackingDashboard() {
  const [timeWindow, setTimeWindow] = useState<24 | 48 | 168>(24); // 24h, 48h, or 7 days
  const [selectedSeverity, setSelectedSeverity] = useState<
    "all" | "low" | "medium" | "high" | "critical"
  >("all");

  const recentErrors = useQuery(api.monitoring.errorTracking.getRecentErrors, {
    limit: 50,
    severity: selectedSeverity === "all" ? undefined : selectedSeverity,
    resolved: false,
  });

  if (!recentErrors) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-[#1E293B] animate-spin" />
        </div>
      </Card>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "high":
        return (
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      case "medium":
        return (
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        );
      case "low":
        return <Info className="w-5 h-5 text-[#1E293B] dark:text-[#94A3B8]" />;
      default:
        return <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-800",
        };
      case "high":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          text: "text-orange-700 dark:text-orange-400",
          border: "border-orange-200 dark:border-orange-800",
        };
      case "medium":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          text: "text-yellow-700 dark:text-yellow-400",
          border: "border-yellow-200 dark:border-yellow-800",
        };
      case "low":
        return {
          bg: "bg-[#F8FAFC] dark:bg-[#0F172A]/20",
          text: "text-[#0F172A] dark:text-[#94A3B8]",
          border: "border-[#E2E8F0] dark:border-[#0F172A]",
        };
      default:
        return {
          bg: "bg-slate-50 dark:bg-slate-800/50",
          text: "text-slate-700 dark:text-slate-400",
          border: "border-slate-200 dark:border-slate-700",
        };
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Count errors by severity
  const severityCounts = {
    critical: recentErrors.filter((e: any) => e.severity === "critical").length,
    high: recentErrors.filter((e: any) => e.severity === "high").length,
    medium: recentErrors.filter((e: any) => e.severity === "medium").length,
    low: recentErrors.filter((e: any) => e.severity === "low").length,
  };

  const totalOccurrences = recentErrors.reduce(
    (sum: number, e: any) => sum + e.occurrenceCount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Error Tracking
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor and resolve system errors
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedSeverity}
            onChange={(e) =>
              setSelectedSeverity(
                e.target.value as "all" | "low" | "medium" | "high" | "critical"
              )
            }
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4 border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-2xl font-bold text-red-700 dark:text-red-400">
                {severityCounts.critical}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Critical Errors
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {severityCounts.high}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              High Priority
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-4 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {severityCounts.medium}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Medium Priority
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-4 border-2 border-[#E2E8F0] dark:border-[#0F172A]">
            <div className="flex items-center justify-between mb-2">
              <Info className="w-5 h-5 text-[#1E293B] dark:text-[#94A3B8]" />
              <span className="text-2xl font-bold text-[#0F172A] dark:text-[#94A3B8]">
                {severityCounts.low}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Low Priority
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Error List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Unresolved Errors
          </h3>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {totalOccurrences.toLocaleString()} total occurrences
            </span>
          </div>
        </div>

        {recentErrors.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              No unresolved errors. System is running smoothly!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentErrors.map((error: any, index: number) => {
              const colors = getSeverityColor(error.severity);
              return (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${colors.border} ${colors.bg} hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getSeverityIcon(error.severity)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${colors.text}`}>
                            {error.message}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Category: {error.category}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              •
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Last: {formatTimeAgo(error.lastOccurrence)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {error.occurrenceCount > 1 && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${colors.bg} ${colors.text}`}
                            >
                              {error.occurrenceCount}x
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold uppercase ${colors.bg} ${colors.text}`}
                          >
                            {error.severity}
                          </span>
                        </div>
                      </div>

                      {/* Time range */}
                      {error.occurrenceCount > 1 && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                          <span>
                            First: {formatTimeAgo(error.firstOccurrence)}
                          </span>
                          <span>→</span>
                          <span>Last: {formatTimeAgo(error.lastOccurrence)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
