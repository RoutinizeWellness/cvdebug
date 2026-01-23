/**
 * Intelligent Recommendations Component
 * Displays AI-powered, context-aware recommendations for resume improvement
 */

import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
  Target,
  Clock,
  Zap,
  Award
} from "lucide-react";
import { type Recommendation } from "@/lib/intelligentRecommendations";

interface IntelligentRecommendationsProps {
  recommendations: Recommendation[];
  showQuickWinsOnly?: boolean;
  maxRecommendations?: number;
}

export function IntelligentRecommendations({
  recommendations,
  showQuickWinsOnly = false,
  maxRecommendations = 10
}: IntelligentRecommendationsProps) {

  // Filter and limit recommendations
  const displayRecommendations = recommendations
    .filter(rec => !showQuickWinsOnly || (rec.difficulty === 'easy' && rec.impact >= 60))
    .slice(0, maxRecommendations);

  if (displayRecommendations.length === 0) {
    return (
      <div className="card-professional p-6 text-center">
        <Award className="w-12 h-12 mx-auto mb-3 text-green-500" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Excellent Work!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your resume is in great shape. Keep refining it for specific roles.
        </p>
      </div>
    );
  }

  const getPriorityIcon = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-[#334155]" />;
      case 'low':
        return <CheckCircle2 className="w-5 h-5 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10';
      case 'high':
        return 'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/10';
      case 'medium':
        return 'border-[#E2E8F0] dark:border-[#0F172A] bg-[#F8FAFC] dark:bg-[#0F172A]/10';
      case 'low':
        return 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/10';
    }
  };

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'resume':
        return <Target className="w-4 h-4" />;
      case 'career':
        return <TrendingUp className="w-4 h-4" />;
      case 'interview':
        return <AlertCircle className="w-4 h-4" />;
      case 'job_search':
        return <Zap className="w-4 h-4" />;
      case 'skills':
        return <Award className="w-4 h-4" />;
    }
  };

  const getDifficultyBadge = (difficulty?: Recommendation['difficulty']) => {
    if (!difficulty) return null;

    const colors = {
      easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {showQuickWinsOnly ? '⚡ Quick Wins' : '🎯 Intelligent Recommendations'}
        </h3>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {displayRecommendations.length} {showQuickWinsOnly ? 'quick wins' : 'recommendations'}
        </span>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {displayRecommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`border rounded-lg p-4 transition-all hover:shadow-md ${getPriorityColor(rec.priority)}`}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                {getPriorityIcon(rec.priority)}
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {rec.description}
                  </p>
                </div>
              </div>

              {/* Impact Score */}
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-[#1E293B] dark:text-[#94A3B8]">
                  {rec.impact}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  impact
                </div>
              </div>
            </div>

            {/* Actionable Steps */}
            <div className="bg-white dark:bg-slate-900/50 rounded-md p-3 mb-3">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-[#334155] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  {rec.actionable}
                </p>
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
              {/* Category */}
              <div className="flex items-center gap-1">
                {getCategoryIcon(rec.category)}
                <span className="capitalize">{rec.category.replace('_', ' ')}</span>
              </div>

              {/* Time Estimate */}
              {rec.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{rec.estimatedTime}</span>
                </div>
              )}

              {/* Difficulty */}
              {rec.difficulty && getDifficultyBadge(rec.difficulty)}

              {/* Tags */}
              {rec.tags && rec.tags.length > 0 && (
                <div className="flex items-center gap-1 ml-auto">
                  {rec.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show More Hint */}
      {recommendations.length > maxRecommendations && (
        <div className="text-center pt-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            {recommendations.length - maxRecommendations} more recommendations available
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Quick Wins Component - Shows only easy, high-impact improvements
 */
export function QuickWins({ recommendations }: { recommendations: Recommendation[] }) {
  const quickWins = recommendations
    .filter(r => r.difficulty === 'easy' && r.impact >= 60 && (r.priority === 'critical' || r.priority === 'high'))
    .slice(0, 3);

  return <IntelligentRecommendations recommendations={quickWins} showQuickWinsOnly maxRecommendations={3} />;
}

/**
 * Critical Actions Component - Shows only must-do items
 */
export function CriticalActions({ recommendations }: { recommendations: Recommendation[] }) {
  const criticalActions = recommendations
    .filter(r => r.priority === 'critical')
    .slice(0, 3);

  if (criticalActions.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h3 className="font-bold text-red-900 dark:text-red-400">
          Critical Actions Required
        </h3>
      </div>
      <IntelligentRecommendations
        recommendations={criticalActions}
        maxRecommendations={3}
      />
    </div>
  );
}
