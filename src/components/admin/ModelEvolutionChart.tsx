/**
 * Model Evolution Chart
 * Visualizes ML model improvement over time with training metrics
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Users,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { initializeModelWeights, analyzeFeatureImportance, type ModelWeights } from '@/convex/ml/learningEngine';

interface ModelSnapshot {
  version: number;
  timestamp: number;
  trainingExamples: number;
  weights: ModelWeights;
  accuracy?: number;
}

export function ModelEvolutionChart() {
  const [snapshots, setSnapshots] = useState<ModelSnapshot[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'accuracy' | 'examples' | 'weights'>('accuracy');

  useEffect(() => {
    // Simulate model evolution history (in production, fetch from database)
    const currentWeights = initializeModelWeights();

    const mockSnapshots: ModelSnapshot[] = [
      {
        version: 1,
        timestamp: Date.now() - 90 * 24 * 60 * 60 * 1000,
        trainingExamples: 100,
        weights: { ...currentWeights, trainingExamples: 100, version: 1 },
        accuracy: 72
      },
      {
        version: 2,
        timestamp: Date.now() - 60 * 24 * 60 * 60 * 1000,
        trainingExamples: 500,
        weights: { ...currentWeights, trainingExamples: 500, version: 2 },
        accuracy: 78
      },
      {
        version: 3,
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
        trainingExamples: 1200,
        weights: { ...currentWeights, trainingExamples: 1200, version: 3 },
        accuracy: 84
      },
      {
        version: 4,
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        trainingExamples: 2500,
        weights: { ...currentWeights, trainingExamples: 2500, version: 4 },
        accuracy: 87
      },
      {
        version: 5,
        timestamp: Date.now(),
        trainingExamples: currentWeights.trainingExamples,
        weights: currentWeights,
        accuracy: 91
      }
    ];

    setSnapshots(mockSnapshots);
  }, []);

  if (snapshots.length === 0) return null;

  const latestSnapshot = snapshots[snapshots.length - 1];
  const previousSnapshot = snapshots[snapshots.length - 2];
  const featureImportance = analyzeFeatureImportance(latestSnapshot.weights);

  const accuracyChange = latestSnapshot.accuracy && previousSnapshot?.accuracy
    ? latestSnapshot.accuracy - previousSnapshot.accuracy
    : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Current Accuracy"
          value={`${latestSnapshot.accuracy}%`}
          change={accuracyChange}
          color="blue"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Training Examples"
          value={latestSnapshot.trainingExamples.toLocaleString()}
          change={latestSnapshot.trainingExamples - (previousSnapshot?.trainingExamples || 0)}
          color="green"
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Model Version"
          value={`v${latestSnapshot.version}.0`}
          change={0}
          color="purple"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Improvement"
          value={`+${accuracyChange.toFixed(1)}%`}
          change={accuracyChange}
          color="orange"
        />
      </div>

      {/* Evolution Timeline */}
      <div className="card-professional p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Model Evolution Timeline
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMetric('accuracy')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === 'accuracy'
                  ? 'bg-[#1E293B] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Accuracy
            </button>
            <button
              onClick={() => setSelectedMetric('examples')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === 'examples'
                  ? 'bg-[#1E293B] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Examples
            </button>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="relative h-64 flex items-end justify-between gap-2">
          {snapshots.map((snapshot, idx) => {
            const value = selectedMetric === 'accuracy'
              ? snapshot.accuracy || 0
              : snapshot.trainingExamples;

            const maxValue = selectedMetric === 'accuracy'
              ? 100
              : Math.max(...snapshots.map(s => s.trainingExamples));

            const height = (value / maxValue) * 100;

            return (
              <div key={snapshot.version} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-[#1E293B] to-[#1E293B] rounded-t-lg relative group cursor-pointer"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs whitespace-nowrap">
                      <div className="font-semibold mb-1">Version {snapshot.version}</div>
                      <div>Accuracy: {snapshot.accuracy}%</div>
                      <div>Examples: {snapshot.trainingExamples.toLocaleString()}</div>
                      <div className="text-slate-400 dark:text-slate-600 mt-1">
                        {new Date(snapshot.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 text-center">
                  v{snapshot.version}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {selectedMetric === 'accuracy'
              ? `Accuracy improved from ${snapshots[0].accuracy}% to ${latestSnapshot.accuracy}% over ${snapshots.length} versions`
              : `Training data grew from ${snapshots[0].trainingExamples.toLocaleString()} to ${latestSnapshot.trainingExamples.toLocaleString()} examples`}
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="card-professional p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Feature Importance (Current Model)
        </h3>
        <div className="space-y-3">
          {featureImportance.slice(0, 8).map((feature, idx) => (
            <FeatureBar
              key={feature.feature}
              label={feature.feature}
              importance={feature.importance}
              averageImpact={feature.averageImpact}
              rank={idx + 1}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
          Feature importance indicates how much each factor contributes to the overall resume score prediction.
        </div>
      </div>

      {/* Weight Evolution Comparison */}
      <div className="card-professional p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Weight Evolution (v1 → v{latestSnapshot.version})
        </h3>
        <div className="space-y-3">
          {featureImportance.slice(0, 6).map((feature) => {
            const initialWeight = 0.5; // Simplified - in production, fetch from v1 snapshot
            const currentWeight = feature.importance;
            const change = ((currentWeight - initialWeight) / initialWeight) * 100;

            return (
              <WeightComparison
                key={feature.feature}
                label={feature.feature}
                initialWeight={initialWeight}
                currentWeight={currentWeight}
                change={change}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 border-[#E2E8F0] dark:border-[#0F172A] text-[#1E293B] dark:text-[#94A3B8]',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-600 dark:text-green-400',
    purple: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 border-[#E2E8F0] dark:border-[#0F172A] text-[#1E293B] dark:text-[#94A3B8]',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400'
  };

  const trendIcon = change > 0 ? <ArrowUp className="w-3 h-3" /> :
                     change < 0 ? <ArrowDown className="w-3 h-3" /> :
                     <Minus className="w-3 h-3" />;

  const trendColor = change > 0 ? 'text-green-500' :
                      change < 0 ? 'text-red-500' :
                      'text-slate-400';

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        {change !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            {trendIcon}
            {Math.abs(change).toFixed(0)}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}

function FeatureBar({
  label,
  importance,
  averageImpact,
  rank
}: {
  label: string;
  importance: number;
  averageImpact: number;
  rank: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-600 w-4">
            #{rank}
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-600 dark:text-slate-400">
            Importance: {(importance * 100).toFixed(1)}%
          </span>
          <span className="text-[#1E293B] dark:text-[#94A3B8] font-medium">
            +{averageImpact.toFixed(0)} pts
          </span>
        </div>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${importance * 100}%` }}
          transition={{ duration: 0.5, delay: rank * 0.05 }}
          className="h-full bg-gradient-to-r from-[#1E293B] to-[#1E293B]"
        />
      </div>
    </div>
  );
}

function WeightComparison({
  label,
  initialWeight,
  currentWeight,
  change
}: {
  label: string;
  initialWeight: number;
  currentWeight: number;
  change: number;
}) {
  const changeColor = change > 10 ? 'text-green-500' :
                       change < -10 ? 'text-red-500' :
                       'text-slate-500';

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <span className="text-sm font-medium text-slate-900 dark:text-white">
        {label}
      </span>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-slate-500 dark:text-slate-400">
          {(initialWeight * 100).toFixed(1)}%
        </span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
        <span className="font-medium text-slate-900 dark:text-white">
          {(currentWeight * 100).toFixed(1)}%
        </span>
        <span className={`font-medium ${changeColor}`}>
          ({change > 0 ? '+' : ''}{change.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
