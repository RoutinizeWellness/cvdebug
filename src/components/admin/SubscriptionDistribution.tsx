import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { CardSkeleton } from "@/components/ui/skeleton";

interface SubscriptionTier {
  name: string;
  count: number;
  percentage: number;
  color: string;
  darkColor: string;
  icon: string;
}

/**
 * Subscription Distribution Component
 * Displays subscription tier distribution with donut chart
 */
export function SubscriptionDistribution() {
  const subscriptionStats = useQuery(api.admin.stats.getSubscriptionStats);

  if (!subscriptionStats) {
    return <CardSkeleton />;
  }

  const total = subscriptionStats.byTier.free +
                subscriptionStats.byTier.single_scan +
                subscriptionStats.byTier.interview_sprint;

  const tiers: SubscriptionTier[] = [
    {
      name: "Interview Sprint",
      count: subscriptionStats.byTier.interview_sprint,
      percentage: (subscriptionStats.byTier.interview_sprint / total) * 100,
      color: "#1E293B",
      darkColor: "#A78BFA",
      icon: "⚡",
    },
    {
      name: "24h Pass",
      count: subscriptionStats.byTier.single_scan,
      percentage: (subscriptionStats.byTier.single_scan / total) * 100,
      color: "#64748B",
      darkColor: "#94A3B8",
      icon: "🎯",
    },
    {
      name: "Free",
      count: subscriptionStats.byTier.free,
      percentage: (subscriptionStats.byTier.free / total) * 100,
      color: "#64748B",
      darkColor: "#94A3B8",
      icon: "👤",
    },
  ];

  // Donut chart parameters
  const size = 200;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentRotation = -90; // Start from top

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] dark:bg-[#0F172A]/30 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-[#1E293B] dark:text-[#94A3B8]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Subscription Distribution
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Breakdown by tier
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Donut Chart */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <svg width={size} height={size} className="transform -rotate-90">
            {tiers.map((tier, index) => {
              const percentage = tier.percentage;
              const offset = circumference - (percentage / 100) * circumference;
              const rotation = currentRotation;

              // Update rotation for next segment
              currentRotation += (percentage / 100) * 360;

              return (
                <motion.circle
                  key={tier.name}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={tier.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                  style={{
                    transformOrigin: 'center',
                    transform: `rotate(${rotation}deg)`,
                  }}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>{`${tier.name}: ${tier.count} users (${percentage.toFixed(1)}%)`}</title>
                </motion.circle>
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-3xl font-bold text-slate-900 dark:text-white"
            >
              {total.toLocaleString()}
            </motion.p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="flex-1 space-y-3 w-full">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: tier.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tier.icon}</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {tier.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tier.percentage.toFixed(1)}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {tier.count.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">users</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Conversion metrics */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-xs font-medium text-green-700 dark:text-green-400">
              Conversion Rate
            </p>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-300">
            {subscriptionStats.conversionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-1">
            Free to paid conversion
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="p-4 rounded-lg bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0F172A]/20 dark:to-[#0F172A]/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#1E293B] dark:text-[#94A3B8]" />
            <p className="text-xs font-medium text-[#0F172A] dark:text-[#94A3B8]">
              Paying Users
            </p>
          </div>
          <p className="text-2xl font-bold text-[#0F172A] dark:text-[#CBD5E1]">
            {subscriptionStats.totalPaying.toLocaleString()}
          </p>
          <p className="text-xs text-[#1E293B] dark:text-[#1E293B] mt-1">
            Active subscriptions
          </p>
        </motion.div>
      </div>
    </Card>
  );
}
