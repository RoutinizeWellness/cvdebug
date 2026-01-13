import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Info,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { useMemo } from "react";

interface CVVersionAnalyticsProps {
  userId: string;
}

export function CVVersionAnalytics({ userId }: CVVersionAnalyticsProps) {
  const analytics = useQuery(api.abTesting.getCVVersionAnalytics, { userId });

  const sortedVersions = useMemo(() => {
    if (!analytics?.versions) return [];
    return [...analytics.versions].sort((a, b) => b.successRate - a.successRate);
  }, [analytics]);

  if (!analytics) {
    return (
      <div className="glass-panel rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      </div>
    );
  }

  if (!analytics.hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-8 text-center"
      >
        <BarChart3 className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No A/B Testing Data Yet</h3>
        <p className="text-slate-600 text-sm mb-6">
          {analytics.message}
        </p>
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-400 text-sm font-semibold mb-2">💡 Pro Tip:</p>
          <p className="text-slate-600 text-sm">
            When adding applications, label each CV version (e.g., "V1_React", "V2_Backend").
            We'll automatically track which versions get you more interviews!
          </p>
        </div>
      </motion.div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-600/10 border-emerald-500/20";
      case "warning":
        return "bg-yellow-600/10 border-yellow-500/20";
      case "info":
        return "bg-blue-600/10 border-blue-500/20";
      default:
        return "bg-slate-50/50 border-slate-200/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              🧪 A/B Testing Dashboard
            </h3>
            <p className="text-slate-600 text-sm">
              Track which CV versions get you more interviews
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">
              {analytics.interviewRate}%
            </div>
            <div className="text-xs text-slate-500">Overall Interview Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50/50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Total Applications</div>
            <div className="text-2xl font-bold text-slate-900">
              {analytics.totalApplications}
            </div>
          </div>
          <div className="bg-slate-50/50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">CV Versions Tested</div>
            <div className="text-2xl font-bold text-slate-900">
              {analytics.versions.length}
            </div>
          </div>
          <div className="bg-slate-50/50 rounded-lg p-4">
            <div className="text-sm text-slate-500 mb-1">Best Version</div>
            <div className="text-sm font-bold text-emerald-400 truncate">
              {analytics.bestVersion?.versionName || "N/A"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      {analytics.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h4 className="text-lg font-bold text-slate-900">📊 Insights</h4>
          {analytics.insights.map((insight: any, index: number) => (
            <div
              key={index}
              className={`glass-panel rounded-lg p-4 border ${getInsightBg(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h5 className="text-slate-900 font-semibold mb-1">{insight.title}</h5>
                  <p className="text-slate-600 text-sm">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* CV Versions Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-xl p-6"
      >
        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Version Performance Leaderboard
        </h4>

        <div className="space-y-3">
          {sortedVersions.map((version, index) => {
            const isWinner = index === 0 && sortedVersions.length > 1;
            const isLoser = index === sortedVersions.length - 1 && sortedVersions.length > 1;

            return (
              <div
                key={version.versionName}
                className={`bg-slate-50/30 rounded-lg p-4 border ${
                  isWinner
                    ? "border-emerald-500/50 bg-emerald-600/10"
                    : isLoser
                    ? "border-red-500/30"
                    : "border-slate-200/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-2xl font-bold ${
                        isWinner ? "text-emerald-400" : "text-slate-500"
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-slate-900 font-bold">{version.versionName}</h5>
                        {isWinner && (
                          <span className="px-2 py-1 bg-emerald-600/20 text-emerald-400 text-xs font-semibold rounded">
                            🏆 BEST
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs">
                        {version.totalApplications} applications tracked
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-3xl font-bold ${
                        version.successRate >= 50
                          ? "text-emerald-400"
                          : version.successRate >= 25
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {version.successRate}%
                    </div>
                    <div className="text-xs text-slate-500">Success Rate</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/50 rounded p-2">
                    <div className="text-xs text-slate-500">Interviews</div>
                    <div className="text-lg font-bold text-slate-900">
                      {version.interviews}
                    </div>
                  </div>
                  <div className="bg-white/50 rounded p-2">
                    <div className="text-xs text-slate-500">Offers</div>
                    <div className="text-lg font-bold text-slate-900">{version.offers}</div>
                  </div>
                  <div className="bg-white/50 rounded p-2">
                    <div className="text-xs text-slate-500">Avg Score</div>
                    <div className="text-lg font-bold text-slate-900">
                      {version.averageScore}
                    </div>
                  </div>
                  <div className="bg-white/50 rounded p-2">
                    <div className="text-xs text-slate-500">Status</div>
                    <div className="flex items-center gap-1">
                      {version.successRate > sortedVersions[0]?.successRate / 2 ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        version.successRate >= 50
                          ? "bg-emerald-500"
                          : version.successRate >= 25
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${version.successRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* How to Improve */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel rounded-xl p-6 bg-gradient-to-r from-blue-600/10 to-teal-600/10 border-blue-500/20"
      >
        <h4 className="text-lg font-bold text-slate-900 mb-3">💡 How to Use This Data</h4>
        <ul className="space-y-2 text-slate-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">1.</span>
            <span>
              When applying to jobs, note which CV version you're using (e.g., "V1_React", "V2_Backend")
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">2.</span>
            <span>
              After 5+ applications per version, check which one has a higher interview rate
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">3.</span>
            <span>
              Focus on your winning version and iterate on losing ones with keyword changes
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">4.</span>
            <span>
              This is YOUR unique data - competitors can't replicate it. Use it to your advantage!
            </span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
