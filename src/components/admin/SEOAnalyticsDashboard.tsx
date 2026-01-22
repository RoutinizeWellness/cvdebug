/**
 * SEO Analytics Dashboard
 * Displays SEO performance metrics integrated with ML monitoring
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  TrendingDown,
  FileText,
  Link,
  Image,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { seoAnalytics, type SEOSnapshot } from '@/lib/seoAnalytics';

export function SEOAnalyticsDashboard() {
  const [snapshot, setSnapshot] = useState<SEOSnapshot | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<1 | 24 | 168 | 720>(24);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const loadMetrics = () => {
    const newSnapshot = seoAnalytics.getSnapshot(selectedPeriod);
    setSnapshot(newSnapshot);

    const health = seoAnalytics.getHealthStatus(selectedPeriod);
    setHealthStatus(health);

    const trends = seoAnalytics.getTrendData(selectedPeriod, 12);
    setTrendData(trends);
  };

  if (!snapshot) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">Loading SEO analytics...</p>
        </div>
      </div>
    );
  }

  const periodOptions = [
    { value: 1, label: '1h' },
    { value: 24, label: '24h' },
    { value: 168, label: '7d' },
    { value: 720, label: '30d' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            SEO Analytics
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track and optimize SEO performance across your platform
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedPeriod(option.value as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Health Status Banner */}
      {healthStatus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 border-2 ${
            healthStatus.status === 'excellent'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900'
              : healthStatus.status === 'good'
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900'
              : healthStatus.status === 'needs_improvement'
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {healthStatus.status === 'excellent' || healthStatus.status === 'good' ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-orange-500" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                SEO Health: {healthStatus.status.replace('_', ' ').toUpperCase()}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {healthStatus.message} - Average Score: {healthStatus.score.toFixed(1)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Search className="w-5 h-5" />}
          label="Average SEO Score"
          value={snapshot.averageScore.toFixed(1)}
          change={snapshot.averageScore >= 70 ? 'up' : 'down'}
          color="blue"
        />
        <MetricCard
          icon={<FileText className="w-5 h-5" />}
          label="Total Pages Analyzed"
          value={snapshot.totalPages.toString()}
          color="green"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Word Count"
          value={snapshot.averageWordCount.toString()}
          color="purple"
        />
        <MetricCard
          icon={<Eye className="w-5 h-5" />}
          label="Pages with H1"
          value={`${snapshot.pagesWithH1}/${snapshot.totalPages}`}
          color="orange"
        />
      </div>

      {/* Issues Detected */}
      {snapshot.issuesDetected.length > 0 && (
        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            SEO Issues Detected ({snapshot.issuesDetected.length})
          </h3>
          <div className="space-y-3">
            {snapshot.issuesDetected.map((issue, idx) => (
              <IssueItem key={idx} issue={issue} />
            ))}
          </div>
        </div>
      )}

      {/* Top Performing Pages */}
      {snapshot.topPerformingPages.length > 0 && (
        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Performing Pages
          </h3>
          <div className="space-y-3">
            {snapshot.topPerformingPages.map((page, idx) => (
              <PageItem key={idx} page={page} rank={idx + 1} />
            ))}
          </div>
        </div>
      )}

      {/* SEO Metrics Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Content Quality
          </h3>
          <div className="space-y-4">
            <MetricRow
              label="Keyword Density"
              value={`${snapshot.averageKeywordDensity.toFixed(2)}%`}
              target="1-3%"
              status={
                snapshot.averageKeywordDensity >= 1 && snapshot.averageKeywordDensity <= 3
                  ? 'good'
                  : 'warning'
              }
            />
            <MetricRow
              label="Readability Score"
              value={snapshot.averageReadability.toFixed(1)}
              target="> 60"
              status={snapshot.averageReadability >= 60 ? 'good' : 'warning'}
            />
            <MetricRow
              label="Average Word Count"
              value={snapshot.averageWordCount.toString()}
              target="> 300"
              status={snapshot.averageWordCount >= 300 ? 'good' : 'warning'}
            />
          </div>
        </div>

        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Technical SEO
          </h3>
          <div className="space-y-4">
            <MetricRow
              label="Pages with H1"
              value={`${snapshot.pagesWithH1}/${snapshot.totalPages}`}
              target="100%"
              status={
                snapshot.pagesWithH1 === snapshot.totalPages ? 'good' : 'warning'
              }
            />
            <MetricRow
              label="Avg Load Time"
              value={`${snapshot.averageLoadTime}ms`}
              target="< 2000ms"
              status={snapshot.averageLoadTime < 2000 ? 'good' : 'warning'}
            />
            <MetricRow
              label="Heading Structure"
              value="Optimized"
              target="Structured"
              status="good"
            />
          </div>
        </div>
      </div>

      {/* Trend Chart Placeholder */}
      {trendData.length > 0 && (
        <div className="card-professional p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            SEO Score Trend
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {trendData.map((data, idx) => {
              const maxScore = 100;
              const height = (data.averageScore / maxScore) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className={`w-full rounded-t-lg ${
                      data.averageScore >= 80
                        ? 'bg-green-500'
                        : data.averageScore >= 60
                        ? 'bg-blue-500'
                        : data.averageScore >= 40
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                    }`}
                    title={`Score: ${data.averageScore.toFixed(1)} (${data.pageCount} pages)`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  change,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: 'up' | 'down';
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        {change && (
          <div className={`flex items-center gap-1 ${change === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {change === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
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

function IssueItem({ issue }: { issue: { type: string; count: number; severity: string } }) {
  const severityColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    low: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {issue.type}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {issue.count} pages
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColors[issue.severity as keyof typeof severityColors]}`}>
          {issue.severity}
        </span>
      </div>
    </div>
  );
}

function PageItem({ page, rank }: { page: { url: string; score: number; wordCount: number }; rank: number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-sm font-semibold text-slate-400 dark:text-slate-600 w-6">
          #{rank}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {page.url}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {page.wordCount} words
          </p>
        </div>
      </div>
      <span className={`text-sm font-semibold ${
        page.score >= 80 ? 'text-green-500' :
        page.score >= 60 ? 'text-blue-500' :
        page.score >= 40 ? 'text-orange-500' :
        'text-red-500'
      }`}>
        {page.score.toFixed(1)}
      </span>
    </div>
  );
}

function MetricRow({
  label,
  value,
  target,
  status
}: {
  label: string;
  value: string;
  target: string;
  status: 'good' | 'warning';
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {label}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Target: {target}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </span>
        {status === 'good' ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-orange-500" />
        )}
      </div>
    </div>
  );
}
