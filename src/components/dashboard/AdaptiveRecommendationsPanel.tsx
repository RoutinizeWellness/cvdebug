/**
 * Adaptive Recommendations Panel
 * Displays ML-powered, personalized recommendations with confidence scores
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';
import {
  generateAdaptiveRecommendations,
  getQuickWins,
  getCriticalIssues,
  estimateTotalImprovement,
  type ResumeContext,
  type AdaptiveRecommendation
} from '@/lib/adaptiveRecommendations';
import { initializeModelWeights } from '@/convex/ml/learningEngine';

interface AdaptiveRecommendationsPanelProps {
  context: ResumeContext;
  onApplyRecommendation?: (recommendationId: string) => void;
}

export function AdaptiveRecommendationsPanel({
  context,
  onApplyRecommendation
}: AdaptiveRecommendationsPanelProps) {
  const [selectedView, setSelectedView] = useState<'all' | 'quick' | 'critical'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const modelWeights = initializeModelWeights();
  const allRecommendations = generateAdaptiveRecommendations(context, modelWeights, 15);
  const quickWins = getQuickWins(context, modelWeights);
  const criticalIssues = getCriticalIssues(context, modelWeights);
  const improvement = estimateTotalImprovement(context, modelWeights);

  const displayedRecommendations =
    selectedView === 'quick' ? quickWins :
    selectedView === 'critical' ? criticalIssues :
    allRecommendations;

  return (
    <div className="space-y-6">
      {/* Header with Improvement Estimate */}
      <div className="card-professional p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI-Powered Recommendations
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Personalized insights based on {modelWeights.trainingExamples.toLocaleString()} successful resumes
            </p>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {context.currentScore} → {improvement.projectedScore}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Current → Projected Score
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    +{improvement.improvement} pts
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Potential Gain
                  </div>
                </div>
              </div>

              <div>
                <div className="text-lg font-medium text-slate-900 dark:text-white">
                  {(improvement.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Confidence
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Model Version
            </div>
            <div className="text-sm font-mono font-medium text-slate-900 dark:text-white">
              v{modelWeights.version}.0
            </div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedView('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedView === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          All ({allRecommendations.length})
        </button>
        <button
          onClick={() => setSelectedView('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            selectedView === 'quick'
              ? 'bg-green-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Zap className="w-4 h-4" />
          Quick Wins ({quickWins.length})
        </button>
        <button
          onClick={() => setSelectedView('critical')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            selectedView === 'critical'
              ? 'bg-red-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Critical ({criticalIssues.length})
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedRecommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              index={index}
              isExpanded={expandedId === rec.id}
              onToggle={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
              onApply={onApplyRecommendation}
            />
          ))}
        </AnimatePresence>

        {displayedRecommendations.length === 0 && (
          <div className="card-professional p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              All Set!
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No {selectedView} recommendations at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
  index,
  isExpanded,
  onToggle,
  onApply
}: {
  recommendation: AdaptiveRecommendation;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onApply?: (id: string) => void;
}) {
  const priorityColors = {
    critical: 'border-red-500 dark:border-red-900 bg-red-50 dark:bg-red-900/10',
    high: 'border-orange-500 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/10',
    medium: 'border-blue-500 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10',
    low: 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
  };

  const priorityIcons = {
    critical: <AlertTriangle className="w-5 h-5 text-red-500" />,
    high: <TrendingUp className="w-5 h-5 text-orange-500" />,
    medium: <Target className="w-5 h-5 text-blue-500" />,
    low: <Info className="w-5 h-5 text-slate-500" />
  };

  const difficultyColors = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-orange-600 dark:text-orange-400',
    hard: 'text-red-600 dark:text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={`border-l-4 ${priorityColors[recommendation.priority]} rounded-lg overflow-hidden transition-all`}
    >
      <div
        className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-3 flex-1">
            {priorityIcons[recommendation.priority]}
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                {recommendation.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {recommendation.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                +{recommendation.impact}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                points
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recommendation.estimatedTime}
          </div>
          <div className={difficultyColors[recommendation.difficulty]}>
            {recommendation.difficulty.charAt(0).toUpperCase() + recommendation.difficulty.slice(1)}
          </div>
          <div>
            {(recommendation.confidence * 100).toFixed(0)}% confidence
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">
            {recommendation.category}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 dark:border-slate-700"
          >
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
              {/* Personalized Reason */}
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      Why this matters for you
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {recommendation.personalizedReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Steps */}
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Action Steps
                </h5>
                <ol className="space-y-2">
                  {recommendation.actionSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Apply Button */}
              {onApply && (
                <button
                  onClick={() => onApply(recommendation.id)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Apply This Fix
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
