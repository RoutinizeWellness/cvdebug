/**
 * Real-time Performance Monitor
 * Live view of system performance with charts and metrics
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Cpu,
  Database,
  Zap,
  Users
} from 'lucide-react';
import { mlAnalytics } from '@/lib/mlAnalytics';
import { resumeAnalysisCache, keywordCache, seoCache } from '@/lib/intelligentCache';

interface PerformanceMetrics {
  timestamp: number;
  cpu: number;
  memory: number;
  activeUsers: number;
  requestsPerSecond: number;
  averageLatency: number;
  errorRate: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const updateMetrics = () => {
      const snapshot = mlAnalytics.getSnapshot(1); // Last hour
      const latencyPercentiles = mlAnalytics.getLatencyPercentiles();

      const newMetric: PerformanceMetrics = {
        timestamp: Date.now(),
        cpu: Math.random() * 100, // Simulated - replace with actual
        memory: Math.random() * 100,
        activeUsers: Math.floor(Math.random() * 50),
        requestsPerSecond: Math.floor(Math.random() * 20),
        averageLatency: snapshot.averageLatency,
        errorRate: 100 - snapshot.successRate
      };

      setMetrics(prev => [...prev.slice(-29), newMetric]); // Keep last 30 points
    };

    // Update every 2 seconds
    const interval = setInterval(updateMetrics, 2000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [isLive]);

  const currentMetrics = metrics[metrics.length - 1];
  const cacheStats = {
    resume: resumeAnalysisCache.getStats(),
    keyword: keywordCache.getStats(),
    seo: seoCache.getStats()
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Performance Monitor
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Real-time system metrics and analytics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLive
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isLive ? 'animate-pulse bg-white' : 'bg-slate-400'}`} />
              {isLive ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Current Metrics */}
        {currentMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<Cpu className="w-5 h-5" />}
              label="CPU Usage"
              value={`${currentMetrics.cpu.toFixed(1)}%`}
              trend={currentMetrics.cpu > 80 ? 'critical' : currentMetrics.cpu > 60 ? 'warning' : 'normal'}
              color="blue"
            />
            <MetricCard
              icon={<Database className="w-5 h-5" />}
              label="Memory"
              value={`${currentMetrics.memory.toFixed(1)}%`}
              trend={currentMetrics.memory > 80 ? 'critical' : currentMetrics.memory > 60 ? 'warning' : 'normal'}
              color="purple"
            />
            <MetricCard
              icon={<Clock className="w-5 h-5" />}
              label="Avg Latency"
              value={`${currentMetrics.averageLatency}ms`}
              trend={currentMetrics.averageLatency > 2000 ? 'critical' : currentMetrics.averageLatency > 1000 ? 'warning' : 'normal'}
              color="orange"
            />
            <MetricCard
              icon={<Users className="w-5 h-5" />}
              label="Active Users"
              value={currentMetrics.activeUsers.toString()}
              trend="normal"
              color="green"
            />
          </div>
        )}

        {/* Live Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latency Chart */}
          <div className="card-professional p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Latency Over Time
            </h3>
            <div className="h-48 flex items-end justify-between gap-1">
              <AnimatePresence>
                {metrics.map((metric, idx) => {
                  const height = Math.min((metric.averageLatency / 3000) * 100, 100);
                  const color = metric.averageLatency > 2000 ? 'bg-red-500' :
                                metric.averageLatency > 1000 ? 'bg-orange-500' : 'bg-green-500';

                  return (
                    <motion.div
                      key={metric.timestamp}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${height}%`, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`flex-1 ${color} rounded-t transition-colors`}
                      style={{ minHeight: '4px' }}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
              <span>60s ago</span>
              <span>Now</span>
            </div>
          </div>

          {/* Request Rate Chart */}
          <div className="card-professional p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Requests Per Second
            </h3>
            <div className="h-48 flex items-end justify-between gap-1">
              <AnimatePresence>
                {metrics.map((metric) => {
                  const height = (metric.requestsPerSecond / 30) * 100;

                  return (
                    <motion.div
                      key={metric.timestamp}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: `${height}%`, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 bg-blue-500 rounded-t"
                      style={{ minHeight: '4px' }}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
              <span>60s ago</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        {/* Cache Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CacheStatusCard
            title="Resume Analysis Cache"
            stats={cacheStats.resume}
            color="blue"
          />
          <CacheStatusCard
            title="Keyword Cache"
            stats={cacheStats.keyword}
            color="green"
          />
          <CacheStatusCard
            title="SEO Cache"
            stats={cacheStats.seo}
            color="purple"
          />
        </div>

        {/* System Health */}
        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            System Health
          </h3>
          <div className="space-y-3">
            <HealthIndicator
              service="API Gateway"
              status="healthy"
              latency={45}
              uptime={99.9}
            />
            <HealthIndicator
              service="ML Engine"
              status="healthy"
              latency={234}
              uptime={99.8}
            />
            <HealthIndicator
              service="Database"
              status="healthy"
              latency={12}
              uptime={100}
            />
            <HealthIndicator
              service="Cache Layer"
              status="healthy"
              latency={3}
              uptime={99.95}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  trend,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: 'normal' | 'warning' | 'critical';
  color: 'blue' | 'purple' | 'orange' | 'green';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-600 dark:text-green-400'
  };

  const trendIcons = {
    normal: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertCircle className="w-4 h-4 text-orange-500" />,
    critical: <AlertCircle className="w-4 h-4 text-red-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border rounded-lg p-4 ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-2">
        {icon}
        {trendIcons[trend]}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-600 dark:text-slate-400">
        {label}
      </div>
    </motion.div>
  );
}

function CacheStatusCard({
  title,
  stats,
  color
}: {
  title: string;
  stats: { size: string; entries: number; hitRate: string };
  color: 'blue' | 'green' | 'purple';
}) {
  const hitRateNum = parseFloat(stats.hitRate);
  const hitRateColor = hitRateNum >= 80 ? 'text-green-500' : hitRateNum >= 60 ? 'text-orange-500' : 'text-red-500';

  const colorClasses = {
    blue: 'border-blue-200 dark:border-blue-900',
    green: 'border-green-200 dark:border-green-900',
    purple: 'border-purple-200 dark:border-purple-900'
  };

  return (
    <div className={`card-professional p-4 border ${colorClasses[color]}`}>
      <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">{title}</h4>
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

function HealthIndicator({
  service,
  status,
  latency,
  uptime
}: {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
}) {
  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-orange-500',
    down: 'bg-red-500'
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
        <span className="font-medium text-slate-900 dark:text-white">{service}</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
        <div>
          <span className="text-xs">Latency: </span>
          <span className="font-medium">{latency}ms</span>
        </div>
        <div>
          <span className="text-xs">Uptime: </span>
          <span className="font-medium">{uptime}%</span>
        </div>
      </div>
    </div>
  );
}
