/**
 * ML Monitoring Dashboard Component
 * Real-time monitoring of ML system performance, cache, and analytics
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Cpu,
  Users,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { mlAnalytics, type PerformanceSnapshot } from '@/lib/mlAnalytics';
import { resumeAnalysisCache, keywordCache, seoCache } from '@/lib/intelligentCache';

export function MLMonitoringDashboard() {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot | null>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(24);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadMetrics = () => {
    const newSnapshot = mlAnalytics.getSnapshot(selectedPeriod);
    setSnapshot(newSnapshot);

    const cache = {
      resumeAnalysis: resumeAnalysisCache.getStats(),
      keywords: keywordCache.getStats(),
      seo: seoCache.getStats()
    };
    setCacheStats(cache);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    loadMetrics();
    setIsRefreshing(false);
  };

  if (!snapshot || !cacheStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#1E293B]" />
          <p className="text-slate-600 dark:text-slate-400">Loading metrics...</p>
        </div>
      </div>
    );
  }

  const anomalies = mlAnalytics.detectAnomalies(100);
  const latencyStats = mlAnalytics.getLatencyPercentiles();
  const accuracyMetrics = mlAnalytics.getAccuracyMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            ML Monitoring Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time system performance and health metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value={1}>Last Hour</option>
            <option value={24}>Last 24 Hours</option>
            <option value={168}>Last 7 Days</option>
            <option value={720}>Last 30 Days</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#0F172A] text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Anomalies Alert */}
      {anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                {anomalies.length} Anomal{anomalies.length === 1 ? 'y' : 'ies'} Detected
              </h3>
              <div className="space-y-2">
                {anomalies.map((anomaly, idx) => (
                  <div key={idx} className="text-sm text-red-800 dark:text-red-300">
                    • <span className="font-medium">{anomaly.type}:</span> {anomaly.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Activity}
          title="Total Analyses"
          value={snapshot.totalAnalyses.toLocaleString()}
          subtitle={`in last ${selectedPeriod}h`}
          color="blue"
        />
        <MetricCard
          icon={TrendingUp}
          title="Average Score"
          value={`${snapshot.averageScore}/100`}
          subtitle={`${snapshot.successRate.toFixed(1)}% success rate`}
          color="green"
          trend={snapshot.averageScore >= 70 ? 'up' : 'down'}
        />
        <MetricCard
          icon={Clock}
          title="Avg Latency"
          value={`${snapshot.averageLatency}ms`}
          subtitle={`P95: ${latencyStats.p95}ms`}
          color="orange"
        />
        <MetricCard
          icon={Users}
          title="User Satisfaction"
          value={snapshot.userSatisfaction > 0 ? `${snapshot.userSatisfaction}/5` : 'N/A'}
          subtitle={`${accuracyMetrics.overall}% accurate`}
          color="purple"
        />
      </div>

      {/* Cache Performance */}
      <div className="card-professional p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-[#1E293B]" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Cache Performance
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CacheMetricCard
            name="Resume Analysis"
            stats={cacheStats.resumeAnalysis}
          />
          <CacheMetricCard
            name="Keywords"
            stats={cacheStats.keywords}
          />
          <CacheMetricCard
            name="SEO"
            stats={cacheStats.seo}
          />
        </div>
      </div>

      {/* Latency Distribution */}
      <div className="card-professional p-6">
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Latency Distribution
          </h3>
        </div>

        <div className="space-y-3">
          <LatencyBar label="P50 (Median)" value={latencyStats.p50} max={latencyStats.p99} />
          <LatencyBar label="P75" value={latencyStats.p75} max={latencyStats.p99} />
          <LatencyBar label="P90" value={latencyStats.p90} max={latencyStats.p99} />
          <LatencyBar label="P95" value={latencyStats.p95} max={latencyStats.p99} />
          <LatencyBar label="P99" value={latencyStats.p99} max={latencyStats.p99} />
        </div>
      </div>

      {/* Industry Breakdown */}
      {Object.keys(snapshot.industryBreakdown).length > 0 && (
        <div className="card-professional p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-[#1E293B]" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Industry Distribution
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(snapshot.industryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([industry, count]) => (
                <div key={industry} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {industry}
                  </span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E293B]"
                        style={{
                          width: `${(count / snapshot.totalAnalyses) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 w-16 text-right">
                      {count} ({((count / snapshot.totalAnalyses) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Accuracy by Industry */}
      {Object.keys(accuracyMetrics.byIndustry).length > 0 && (
        <div className="card-professional p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Model Accuracy by Industry
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(accuracyMetrics.byIndustry).map(([industry, accuracy]) => (
              <div key={industry} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400 capitalize mb-1">
                  {industry}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {accuracy.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend
}: {
  icon: any;
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
  trend?: 'up' | 'down';
}) {
  const colorClasses = {
    blue: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 text-[#1E293B]',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500',
    purple: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 text-[#1E293B]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-professional p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
        {title}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-500">
        {subtitle}
      </div>
    </motion.div>
  );
}

function CacheMetricCard({ name, stats }: { name: string; stats: any }) {
  const hitRateNum = parseFloat(stats.hitRate);
  const hitRateColor = hitRateNum >= 80 ? 'text-green-500' : hitRateNum >= 60 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
      <div className="text-sm font-medium text-slate-900 dark:text-white mb-3">
        {name}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Hit Rate</span>
          <span className={`font-semibold ${hitRateColor}`}>{stats.hitRate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Size</span>
          <span className="font-semibold text-slate-900 dark:text-white">{stats.size}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Entries</span>
          <span className="font-semibold text-slate-900 dark:text-white">{stats.entries}</span>
        </div>
      </div>
    </div>
  );
}

function LatencyBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = (value / max) * 100;
  const color = value < max * 0.5 ? 'bg-green-500' : value < max * 0.75 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-900 dark:text-white">{value}ms</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
