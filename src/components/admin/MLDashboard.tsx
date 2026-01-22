/**
 * ML Admin Dashboard
 * Monitor ML performance, analytics, and system health
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { mlAnalytics, type PerformanceSnapshot } from '@/lib/mlAnalytics';
import { resumeAnalysisCache, keywordCache, seoCache } from '@/lib/intelligentCache';

export function MLDashboard() {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<24 | 168 | 720>(24); // 24h, 7d, 30d

  useEffect(() => {
    loadMetrics();
  }, [selectedPeriod]);

  const loadMetrics = () => {
    setIsLoading(true);
    try {
      const newSnapshot = mlAnalytics.getSnapshot(selectedPeriod);
      setSnapshot(newSnapshot);
    } catch (error) {
      console.error('[ML Dashboard] Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCacheStats = () => {
    return {
      resumeCache: resumeAnalysisCache.getStats(),
      keywordCache: keywordCache.getStats(),
      seoCache: seoCache.getStats()
    };
  };

  const cacheStats = getCacheStats();
  const latencyPercentiles = mlAnalytics.getLatencyPercentiles();
  const anomalies = mlAnalytics.detectAnomalies();

  if (isLoading && !snapshot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              ML Performance Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Real-time monitoring and analytics
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPeriod(24)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === 24
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setSelectedPeriod(168)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === 168
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setSelectedPeriod(720)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === 720
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              30d
            </button>
            <button
              onClick={loadMetrics}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
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
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                  {anomalies.length} Anomalies Detected
                </h3>
                <div className="space-y-2">
                  {anomalies.map((anomaly, idx) => (
                    <div key={idx} className="text-sm text-red-700 dark:text-red-300">
                      • {anomaly.message} ({anomaly.severity} severity)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Key Metrics */}
        {snapshot && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Analyses"
              value={snapshot.totalAnalyses.toLocaleString()}
              icon={<Activity className="w-5 h-5" />}
              trend={snapshot.totalAnalyses > 100 ? 'up' : undefined}
              color="blue"
            />
            <MetricCard
              title="Average Score"
              value={`${snapshot.averageScore}/100`}
              icon={<Target className="w-5 h-5" />}
              trend={snapshot.averageScore >= 70 ? 'up' : 'down'}
              color={snapshot.averageScore >= 70 ? 'green' : 'orange'}
            />
            <MetricCard
              title="Success Rate"
              value={`${snapshot.successRate.toFixed(1)}%`}
              icon={<CheckCircle2 className="w-5 h-5" />}
              trend={snapshot.successRate >= 75 ? 'up' : 'down'}
              color={snapshot.successRate >= 75 ? 'green' : 'red'}
            />
            <MetricCard
              title="Avg Latency"
              value={`${snapshot.averageLatency}ms`}
              icon={<Clock className="w-5 h-5" />}
              trend={snapshot.averageLatency < 1000 ? 'up' : 'down'}
              color={snapshot.averageLatency < 1000 ? 'green' : 'orange'}
            />
          </div>
        )}

        {/* Latency Percentiles */}
        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Latency Distribution
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <PercentileCard label="P50" value={`${latencyPercentiles.p50}ms`} />
            <PercentileCard label="P75" value={`${latencyPercentiles.p75}ms`} />
            <PercentileCard label="P90" value={`${latencyPercentiles.p90}ms`} />
            <PercentileCard label="P95" value={`${latencyPercentiles.p95}ms`} />
            <PercentileCard label="P99" value={`${latencyPercentiles.p99}ms`} />
          </div>
        </div>

        {/* Cache Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CacheCard
            title="Resume Analysis Cache"
            stats={cacheStats.resumeCache}
            icon={<Users className="w-5 h-5" />}
          />
          <CacheCard
            title="Keyword Cache"
            stats={cacheStats.keywordCache}
            icon={<Zap className="w-5 h-5" />}
          />
          <CacheCard
            title="SEO Cache"
            stats={cacheStats.seoCache}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Industry Breakdown */}
        {snapshot && Object.keys(snapshot.industryBreakdown).length > 0 && (
          <div className="card-professional p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Industry Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(snapshot.industryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([industry, count]) => (
                  <div key={industry} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {industry}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(count / snapshot.totalAnalyses) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  color
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  color: 'blue' | 'green' | 'orange' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-lg p-4 ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        {trend && (
          trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400">
        {title}
      </div>
    </motion.div>
  );
}

function PercentileCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">
        {label}
      </div>
      <div className="text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function CacheCard({
  title,
  stats,
  icon
}: {
  title: string;
  stats: { size: string; entries: number; hitRate: string };
  icon: React.ReactNode;
}) {
  const hitRateNum = parseFloat(stats.hitRate);
  const hitRateColor = hitRateNum >= 80 ? 'text-green-500' : hitRateNum >= 60 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="card-professional p-4">
      <div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-400">
        {icon}
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Size:</span>
          <span className="font-medium text-slate-900 dark:text-white">{stats.size}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Entries:</span>
          <span className="font-medium text-slate-900 dark:text-white">{stats.entries}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Hit Rate:</span>
          <span className={`font-bold ${hitRateColor}`}>{stats.hitRate}</span>
        </div>
      </div>
    </div>
  );
}
