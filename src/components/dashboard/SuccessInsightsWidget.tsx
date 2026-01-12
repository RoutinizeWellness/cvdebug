import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Target, Lock } from "lucide-react";

const apiAny = api as any;

export function SuccessInsightsWidget() {
  const analytics = useQuery(apiAny.applications.getSuccessAnalytics);

  // Not enough data yet
  if (!analytics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-6 border-l-4 border-l-purple-500"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <Lock className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Success Insights</h3>
            <p className="text-xs text-slate-400">Personalized analytics unlocked soon</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">
            Track 3+ applications and get your first interview to unlock personalized insights
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-teal-400 font-mono">
            <Sparkles className="h-4 w-4" />
            <span>Your personal data moat awaits</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-xl p-6 border-l-4 border-l-purple-500 relative overflow-hidden"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Success Insights</h3>
              <p className="text-xs text-slate-400">Your personal data advantage</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span className="text-xs font-bold text-teal-400">MOAT</span>
          </div>
        </div>

        {/* Top Insight */}
        {analytics.topInsight && (
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 mb-4 border border-teal-500/30">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-teal-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">{analytics.topInsight.message}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-emerald-400 font-mono">
                    +{analytics.topInsight.lift}% vs average
                  </span>
                  <span className="text-slate-400">
                    {analytics.topInsight.successRate}% success rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Applications</p>
            <p className="text-2xl font-bold text-white">{analytics.totalApplications}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Interviews</p>
            <p className="text-2xl font-bold text-teal-400">{analytics.interviewCount}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-emerald-400">{analytics.averageSuccessRate}%</p>
          </div>
        </div>

        {/* Top Keywords */}
        {analytics.topKeywords.length > 0 && (
          <div>
            <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
              Top Performing Keywords
            </p>
            <div className="space-y-2">
              {analytics.topKeywords.slice(0, 5).map((kw: any, idx: number) => (
                <div key={kw.keyword} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-teal-400">#{idx + 1}</span>
                    <span className="text-sm text-white font-medium">{kw.keyword}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {kw.interviews}/{kw.total}
                    </span>
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${kw.successRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-emerald-400 w-10 text-right">
                      {Math.round(kw.successRate)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            🔒 This data is unique to you and cannot be replicated by competitors
          </p>
        </div>
      </div>
    </motion.div>
  );
}
