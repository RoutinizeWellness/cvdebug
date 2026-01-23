import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Realtime Statistics Card Component
 * Shows live system statistics with animations
 */
export function RealtimeStatsCard() {
  const stats = useQuery(api.admin.stats.getSystemStats);
  const subscriptions = useQuery(api.admin.stats.getSubscriptionStats);

  if (!stats || !subscriptions) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-6 h-6 text-[#1E293B] animate-spin" />
        </div>
      </Card>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `${stats.userGrowth >= 0 ? '+' : ''}${stats.userGrowth}%`,
      changeLabel: "vs last week",
      icon: Users,
      color: "blue",
      trend: stats.userGrowth >= 0 ? "up" : "down",
    },
    {
      label: "Active Users (24h)",
      value: stats.activeUsers.toLocaleString(),
      change: `${stats.recentResumes} scans today`,
      changeLabel: "recent activity",
      icon: Activity,
      color: "green",
      trend: "up",
    },
    {
      label: "Total Resumes",
      value: stats.totalResumes.toLocaleString(),
      change: `${stats.resumeGrowth >= 0 ? '+' : ''}${stats.resumeGrowth}%`,
      changeLabel: "vs last week",
      icon: FileText,
      color: "purple",
      trend: stats.resumeGrowth >= 0 ? "up" : "down",
    },
    {
      label: "System Health",
      value: `${stats.systemHealth}%`,
      change: stats.systemHealth >= 99 ? "Excellent" : stats.systemHealth >= 95 ? "Good" : "Fair",
      changeLabel: "uptime",
      icon: TrendingUp,
      color: stats.systemHealth >= 99 ? "green" : stats.systemHealth >= 95 ? "yellow" : "red",
      trend: "up",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-[#F8FAFC] dark:bg-[#0F172A]/20",
      icon: "text-[#1E293B] dark:text-[#94A3B8]",
      border: "border-[#E2E8F0] dark:border-[#0F172A]",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    purple: {
      bg: "bg-[#F8FAFC] dark:bg-[#0F172A]/20",
      icon: "text-[#1E293B] dark:text-[#94A3B8]",
      border: "border-[#E2E8F0] dark:border-[#0F172A]",
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      icon: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color as keyof typeof colorClasses];

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`p-6 border-2 ${colors.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`${colors.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${colors.icon}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.changeLabel}
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}

      {/* Conversion Rate Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="md:col-span-2 lg:col-span-4"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Subscription Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {subscriptions.byTier.free.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Free Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1E293B] dark:text-[#94A3B8]">
                {subscriptions.byTier.single_scan.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">24-Hour Pass</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1E293B] dark:text-[#94A3B8]">
                {subscriptions.byTier.interview_sprint.toLocaleString()}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Interview Sprint</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {subscriptions.conversionRate}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Conversion Rate</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
