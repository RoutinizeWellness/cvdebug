import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, Target, Lock } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const apiAny = api as any;

export function SuccessInsightsWidget() {
  const { t } = useI18n();
  const analytics = useQuery(apiAny.applications.getSuccessAnalytics);

  // Not enough data yet
  if (!analytics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] border-l-4 border-l-[#3B82F6] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
            <Lock className="h-5 w-5 text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">{t.dashboard.successInsights}</h3>
            <p className="text-xs text-[#64748B]">{t.dashboard.personalizedAnalytics}</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-lg p-4 text-center border border-[#E2E8F0]">
          <p className="text-sm text-[#475569] mb-2">
            {t.dashboard.trackApplicationsToUnlock}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[#8B5CF6] font-mono">
            <Sparkles className="h-4 w-4" />
            <span>{t.dashboard.personalDataMoat}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] border-l-4 border-l-[#22C55E] relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E] to-[#3B82F6] flex items-center justify-center shadow-[0_4px_12px_-2px_rgba(34,197,94,0.3)]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{t.dashboard.successInsights}</h3>
              <p className="text-xs text-[#64748B]">{t.dashboard.yourPersonalDataAdvantage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
            <Sparkles className="h-3.5 w-3.5 text-[#22C55E]" />
            <span className="text-xs font-bold text-[#22C55E]">{t.dashboard.moat}</span>
          </div>
        </div>

        {/* Top Insight */}
        {analytics.topInsight && (
          <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#3B82F6]/10 rounded-lg p-4 mb-4 border border-[#22C55E]/30">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-[#22C55E] mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[#0F172A] font-semibold mb-1">{analytics.topInsight.message}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#22C55E] font-mono font-bold">
                    +{analytics.topInsight.lift}% {t.dashboard.vsAverage}
                  </span>
                  <span className="text-[#64748B]">
                    {analytics.topInsight.successRate}% {t.dashboard.successRateLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#F8FAFC] rounded-lg p-3 text-center border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] mb-1">{t.dashboard.applicationsCount}</p>
            <p className="text-2xl font-bold text-[#0F172A]">{analytics.totalApplications}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg p-3 text-center border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] mb-1">{t.dashboard.interviewsCount}</p>
            <p className="text-2xl font-bold text-[#3B82F6]">{analytics.interviewCount}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg p-3 text-center border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] mb-1">{t.dashboard.successRateLabel}</p>
            <p className="text-2xl font-bold text-[#22C55E]">{analytics.averageSuccessRate}%</p>
          </div>
        </div>

        {/* Top Keywords */}
        {analytics.topKeywords.length > 0 && (
          <div>
            <p className="text-xs text-[#64748B] mb-2 font-semibold uppercase tracking-wider">
              {t.dashboard.topPerformingKeywords}
            </p>
            <div className="space-y-2">
              {analytics.topKeywords.slice(0, 5).map((kw: any, idx: number) => (
                <div key={kw.keyword} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#8B5CF6] font-bold">#{idx + 1}</span>
                    <span className="text-sm text-[#0F172A] font-medium">{kw.keyword}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#64748B]">
                      {kw.interviews}/{kw.total}
                    </span>
                    <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#22C55E] to-[#3B82F6] rounded-full"
                        style={{ width: `${kw.successRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#22C55E] w-10 text-right">
                      {Math.round(kw.successRate)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#64748B] text-center">
            {t.dashboard.dataUniqueToYou}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
