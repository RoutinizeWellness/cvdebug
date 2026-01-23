/**
 * Performance Optimization Dashboard
 * Displays recommendations and system optimization opportunities
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Target,
  Clock,
  Award,
  ArrowRight
} from 'lucide-react';
import { performanceOptimizer, type PerformanceMetrics, type OptimizationRecommendation } from '@/lib/performanceOptimizer';
import { mlAnalytics } from '@/lib/mlAnalytics';

export function PerformanceOptimizationDashboard() {
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'performance' | 'accuracy' | 'reliability' | 'cost'>('all');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [impact, setImpact] = useState<any>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = () => {
    // Gather current metrics
    const mlSnapshot = mlAnalytics.getSnapshot(24);
    const latencyPercentiles = mlAnalytics.getLatencyPercentiles();

    const metrics: PerformanceMetrics = {
      cacheHitRate: 92,
      averageLatency: mlSnapshot.averageLatency,
      p95Latency: latencyPercentiles.p95,
      p99Latency: latencyPercentiles.p99,
      errorRate: ((mlSnapshot.totalAnalyses - (mlSnapshot.successRate / 100 * mlSnapshot.totalAnalyses)) / mlSnapshot.totalAnalyses) * 100,
      analysisVolume: mlSnapshot.totalAnalyses,
      modelAccuracy: mlSnapshot.averageScore * 0.9,
      webhookSuccessRate: 96,
      memoryUsage: 45,
      cpuUsage: 35
    };

    const recs = performanceOptimizer.generateRecommendations(metrics);
    setRecommendations(recs);

    const roadmapData = performanceOptimizer.generateRoadmap(recs);
    setRoadmap(roadmapData);

    const impactData = performanceOptimizer.calculatePotentialImpact(recs);
    setImpact(impactData);
  };

  const filteredRecommendations = selectedCategory === 'all'
    ? recommendations
    : recommendations.filter(r => r.category === selectedCategory);

  const quickWins = performanceOptimizer.getQuickWins(recommendations);
  const highPriority = performanceOptimizer.getHighPriority(recommendations);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Performance Optimization
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Actionable recommendations to improve system performance
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      {impact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Performance Gain"
            value={impact.performanceGain}
            color="blue"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Cost Reduction"
            value={impact.costReduction}
            color="green"
          />
          <StatCard
            icon={<Award className="w-5 h-5" />}
            label="Reliability Boost"
            value={impact.reliabilityImprovement}
            color="purple"
          />
        </div>
      )}

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-professional p-6 border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Quick Wins ({quickWins.length})
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Easy improvements with high impact
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {quickWins.slice(0, 3).map((rec, idx) => (
              <QuickWinCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'performance', 'accuracy', 'reliability', 'cost'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#1E293B] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            {cat !== 'all' && (
              <span className="ml-2 text-xs opacity-75">
                ({recommendations.filter(r => r.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} />
        ))}
      </div>

      {/* Roadmap */}
      {roadmap && (
        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Optimization Roadmap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoadmapColumn
              title="Immediate (1-2 weeks)"
              recommendations={roadmap.immediate}
              color="green"
            />
            <RoadmapColumn
              title="Short-term (1-2 months)"
              recommendations={roadmap.shortTerm}
              color="blue"
            />
            <RoadmapColumn
              title="Long-term (3+ months)"
              recommendations={roadmap.longTerm}
              color="purple"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 border-[#E2E8F0] dark:border-[#0F172A] text-[#1E293B] dark:text-[#94A3B8]',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-600 dark:text-green-400',
    purple: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 border-[#E2E8F0] dark:border-[#0F172A] text-[#1E293B] dark:text-[#94A3B8]'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}

function QuickWinCard({ recommendation }: { recommendation: OptimizationRecommendation }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-green-200 dark:border-green-900">
      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
          {recommendation.title}
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {recommendation.estimatedImprovement}
        </p>
      </div>
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
        Easy
      </span>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: OptimizationRecommendation }) {
  const impactColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    low: 'bg-[#F1F5F9] dark:bg-[#0F172A]/30 text-[#0F172A] dark:text-[#94A3B8]'
  };

  const effortColors = {
    easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-[#F1F5F9] dark:bg-[#0F172A]/30 text-[#0F172A] dark:text-[#94A3B8]'
  };

  const categoryIcons = {
    performance: <Zap className="w-5 h-5" />,
    accuracy: <Target className="w-5 h-5" />,
    reliability: <CheckCircle className="w-5 h-5" />,
    cost: <TrendingUp className="w-5 h-5" />
  };

  return (
    <div className="card-professional p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {categoryIcons[recommendation.category]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {recommendation.title}
              </h3>
              <span className="text-xs text-slate-500">
                #{recommendation.priority}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {recommendation.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[recommendation.impact]}`}>
            {recommendation.impact} impact
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${effortColors[recommendation.effort]}`}>
            {recommendation.effort}
          </span>
        </div>
      </div>

      {/* Estimated Improvement */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-[#F8FAFC] dark:bg-[#0F172A]/20 rounded-lg">
        <TrendingUp className="w-4 h-4 text-[#1E293B]" />
        <span className="text-sm font-medium text-[#0F172A] dark:text-[#94A3B8]">
          {recommendation.estimatedImprovement}
        </span>
      </div>

      {/* Action Items */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Action Items:
        </h4>
        <ul className="space-y-2">
          {recommendation.actionItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
              <ArrowRight className="w-4 h-4 text-[#1E293B] mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* References */}
      {recommendation.references && recommendation.references.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            References: {recommendation.references.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

function RoadmapColumn({
  title,
  recommendations,
  color
}: {
  title: string;
  recommendations: OptimizationRecommendation[];
  color: 'green' | 'blue' | 'purple';
}) {
  const colorClasses = {
    green: 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20',
    blue: 'border-[#E2E8F0] dark:border-[#0F172A] bg-[#F8FAFC] dark:bg-[#0F172A]/20',
    purple: 'border-[#E2E8F0] dark:border-[#0F172A] bg-[#F8FAFC] dark:bg-[#0F172A]/20'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
        {title}
      </h4>
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {rec.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {rec.estimatedImprovement}
            </p>
          </div>
        ))}
        {recommendations.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            No recommendations
          </p>
        )}
      </div>
    </div>
  );
}
