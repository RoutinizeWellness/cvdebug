import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Activity, Zap, TrendingUp, Database, Clock } from "lucide-react";
import { SimpleTrendChart } from "./SimpleTrendChart";

export function MLPerformanceDashboard() {
  const metrics = useQuery(api.ml.mlMetrics.getMetricsSummary, { timeWindowHours: 24 });
  const cachePerformance = useQuery(api.ml.mlMetrics.getCachePerformance, {});

  if (!metrics || !cachePerformance) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading ML performance metrics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Cache Hit Rate",
      value: `${metrics.cacheHitRate}%`,
      subtitle: `${metrics.cacheHits}/${metrics.totalCacheRequests} hits`,
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Prediction Latency",
      value: `${metrics.avgPredictionLatency}ms`,
      subtitle: `P95: ${metrics.p95Latency}ms`,
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Feature Extraction",
      value: `${metrics.avgFeatureLatency}ms`,
      subtitle: "Average time",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Analyses",
      value: metrics.totalAnalyses.toString(),
      subtitle: "Last 24 hours",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          ML Performance Metrics
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Real-time monitoring of ML engine performance and cache efficiency
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Cache Performance Trend */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            Cache Hit Rate Trend
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Hourly cache performance over the last 24 hours
          </p>
        </div>

        <SimpleTrendChart data={cachePerformance.trendData} height={300} />
      </Card>

      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Performance Insights
        </h3>
        <div className="space-y-3">
          {metrics.cacheHitRate >= 80 ? (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Excellent Cache Performance</p>
                <p className="text-sm text-green-700">
                  Your cache hit rate of {metrics.cacheHitRate}% is excellent. This significantly reduces computation time and costs.
                </p>
              </div>
            </div>
          ) : metrics.cacheHitRate >= 60 ? (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Activity className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">Good Cache Performance</p>
                <p className="text-sm text-yellow-700">
                  Cache hit rate of {metrics.cacheHitRate}% is good, but there's room for improvement.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Activity className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Low Cache Performance</p>
                <p className="text-sm text-red-700">
                  Cache hit rate of {metrics.cacheHitRate}% is low. Consider increasing cache TTL or optimizing feature extraction.
                </p>
              </div>
            </div>
          )}

          {metrics.avgPredictionLatency < 100 && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Fast Predictions</p>
                <p className="text-sm text-blue-700">
                  Average prediction latency of {metrics.avgPredictionLatency}ms is very fast. Users are getting near-instant results.
                </p>
              </div>
            </div>
          )}

          {metrics.totalAnalyses > 100 && (
            <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">High Volume</p>
                <p className="text-sm text-purple-700">
                  {metrics.totalAnalyses} analyses in the last 24 hours shows strong engagement with ML features.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
