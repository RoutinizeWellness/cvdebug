import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

interface SmartRecommendationsProps {
  userId: Id<"users">;
  resumeId?: Id<"resumes">;
}

export function SmartRecommendations({ userId, resumeId }: SmartRecommendationsProps) {
  const data = useQuery(api.ai.recommendations.getPersonalizedRecommendations, {
    userId,
    resumeId,
  });

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (!data) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-[#1E293B] animate-pulse" />
          <h3 className="text-lg font-semibold">Loading AI Recommendations...</h3>
        </div>
      </Card>
    );
  }

  const { recommendations, insights } = data;
  const visibleRecommendations = recommendations.filter(
    (_: any, index: number) => !dismissedIds.has(`rec-${index}`)
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "high":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "medium":
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="w-5 h-5 text-[#334155]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#1E293B]" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-400",
          badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
        };
      case "high":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-800",
          text: "text-orange-700 dark:text-orange-400",
          badge: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300",
        };
      case "medium":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-700 dark:text-yellow-400",
          badge: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
        };
      case "low":
        return {
          bg: "bg-[#F8FAFC] dark:bg-[#1E293B]/20",
          border: "border-[#E2E8F0] dark:border-[#334155]",
          text: "text-[#1E293B] dark:text-[#CBD5E1]",
          badge: "bg-[#F1F5F9] dark:bg-[#1E293B]/40 text-[#1E293B] dark:text-[#94A3B8]",
        };
      default:
        return {
          bg: "bg-[#F8FAFC] dark:bg-[#0F172A]/20",
          border: "border-[#E2E8F0] dark:border-[#1E293B]",
          text: "text-[#1E293B] dark:text-[#CBD5E1]",
          badge: "bg-[#F1F5F9] dark:bg-[#0F172A]/40 text-[#1E293B] dark:text-[#94A3B8]",
        };
    }
  };

  const handleDismiss = (index: number) => {
    setDismissedIds(prev => new Set([...prev, `rec-${index}`]));
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "improving") {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    }
    return <TrendingUp className="w-4 h-4 text-slate-400 rotate-180" />;
  };

  return (
    <div className="space-y-6">
      {/* Insights Header */}
      <Card className="p-6 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-purple-900/20 dark:to-blue-900/20 border-[#E2E8F0] dark:border-[#1E293B]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-purple-900/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1E293B] dark:text-[#CBD5E1]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                AI-Powered Insights
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Personalized recommendations based on your history
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {insights.totalResumes}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Total Resumes
            </p>
          </div>

          <div className="text-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {insights.avgScore}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Average Score
            </p>
          </div>

          <div className="text-center p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              {getTrendIcon(insights.trend || "stable")}
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {insights.improvement > 0 ? "+" : ""}
                {insights.improvement}
              </p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Recent Trend
            </p>
          </div>
        </div>
      </Card>

      {/* Recommendations List */}
      {visibleRecommendations.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            You're doing great!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            No critical recommendations at the moment. Keep up the good work!
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {visibleRecommendations.map((rec: any, index: number) => {
              const colors = getTypeColor(rec.type);
              return (
                <motion.div
                  key={`rec-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 border-2 ${colors.border} ${colors.bg} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getTypeIcon(rec.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-semibold ${colors.text}`}>
                                {rec.title}
                              </h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}
                              >
                                +{rec.impact}% impact
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {rec.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 dark:text-slate-500">
                                {rec.category}
                              </span>
                              {rec.actionable && (
                                <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                  Actionable
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDismiss(index)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>

                        {rec.actionable && (
                          <button
                            className={`mt-2 flex items-center gap-2 text-sm font-medium ${colors.text} hover:underline`}
                          >
                            Take Action
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
