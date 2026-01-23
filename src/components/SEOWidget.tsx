/**
 * SEO Widget Component
 * Displays real-time SEO analysis and recommendations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useSEOAnalyzer, getSEOHealthStatus, formatSEORecommendations } from '@/hooks/useSEOAnalyzer';

interface SEOWidgetProps {
  primaryKeyword: string;
  secondaryKeywords?: string[];
  enabled?: boolean;
  compact?: boolean;
}

export function SEOWidget({
  primaryKeyword,
  secondaryKeywords = [],
  enabled = false,
  compact = false
}: SEOWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const { analysis, isAnalyzing, reanalyze } = useSEOAnalyzer(
    primaryKeyword,
    secondaryKeywords,
    { enabled }
  );

  if (!enabled || !analysis) return null;

  const healthStatus = getSEOHealthStatus(analysis.score);
  const recommendations = formatSEORecommendations(analysis);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-professional overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[#1E293B]" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                SEO Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Real-time optimization score
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Score */}
            <div className="text-right">
              <div className={`text-2xl font-bold ${healthStatus.color}`}>
                {analysis.score}
              </div>
              <div className="text-xs text-slate-500">
                / 100
              </div>
            </div>

            {/* Expand/Collapse */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-3">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.score}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full ${
                analysis.score >= 90 ? 'bg-green-500' :
                analysis.score >= 70 ? 'bg-[#1E293B]' :
                analysis.score >= 50 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {healthStatus.message}
          </p>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 dark:border-slate-800"
          >
            <div className="p-4 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Word Count"
                  value={analysis.wordCount}
                  status={analysis.wordCount >= 300 ? 'good' : 'warning'}
                />
                <StatCard
                  label="Keyword Density"
                  value={`${analysis.keywordDensity.toFixed(2)}%`}
                  status={
                    analysis.keywordDensity >= 1 && analysis.keywordDensity <= 3
                      ? 'good'
                      : 'warning'
                  }
                />
                <StatCard
                  label="Headings"
                  value={analysis.headingCount}
                  status={analysis.headingCount >= 3 ? 'good' : 'warning'}
                />
                <StatCard
                  label="Links"
                  value={analysis.internalLinks + analysis.externalLinks}
                  status={analysis.internalLinks >= 2 ? 'good' : 'warning'}
                />
              </div>

              {/* Issues */}
              {analysis.issues.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                    Issues Found
                  </h4>
                  <div className="space-y-2">
                    {analysis.issues.slice(0, 3).map((issue, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
                    Top Recommendations
                  </h4>
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, idx) => (
                      <RecommendationCard key={idx} recommendation={rec} />
                    ))}
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={reanalyze}
                disabled={isAnalyzing}
                className="w-full py-2 px-4 bg-[#F8FAFC] dark:bg-[#0F172A]/20 text-[#1E293B] dark:text-[#94A3B8] rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#0F172A]/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing...' : 'Reanalyze'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  status
}: {
  label: string;
  value: string | number;
  status: 'good' | 'warning' | 'error';
}) {
  const statusColors = {
    good: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900',
    warning: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900'
  };

  const statusIcons = {
    good: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    warning: <AlertCircle className="w-4 h-4 text-orange-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />
  };

  return (
    <div className={`border rounded-lg p-3 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
        {statusIcons[status]}
      </div>
      <div className="text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation
}: {
  recommendation: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: number;
  };
}) {
  const priorityColors = {
    high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900',
    medium: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900',
    low: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 border-[#E2E8F0] dark:border-[#0F172A]'
  };

  const priorityIcons = {
    high: <AlertCircle className="w-4 h-4 text-red-500" />,
    medium: <AlertCircle className="w-4 h-4 text-orange-500" />,
    low: <TrendingUp className="w-4 h-4 text-[#1E293B]" />
  };

  return (
    <div className={`border rounded-lg p-3 ${priorityColors[recommendation.priority]}`}>
      <div className="flex items-start gap-2 mb-1">
        {priorityIcons[recommendation.priority]}
        <div className="flex-1">
          <h5 className="font-semibold text-sm text-slate-900 dark:text-white">
            {recommendation.title}
          </h5>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {recommendation.description}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-[#1E293B] dark:text-[#94A3B8]">
            +{recommendation.impact}
          </div>
          <div className="text-xs text-slate-500">
            impact
          </div>
        </div>
      </div>
    </div>
  );
}
