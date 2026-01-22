/**
 * Comprehensive Admin Dashboard
 * Central hub for monitoring, analytics, and system management
 * OPTIMIZED: Lazy loading for better performance
 */

import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Activity,
  Settings,
  Users,
  FileText,
  Bell,
  TrendingUp,
  Search,
  Download,
  Loader2
} from 'lucide-react';

// Lazy load heavy dashboard components for better performance
const MLDashboard = lazy(() => import('@/components/admin/MLDashboard').then(m => ({ default: m.MLDashboard })));
const PerformanceMonitor = lazy(() => import('@/components/admin/PerformanceMonitor').then(m => ({ default: m.PerformanceMonitor })));
const MLMonitoringDashboard = lazy(() => import('@/components/admin/MLMonitoringDashboard').then(m => ({ default: m.MLMonitoringDashboard })));
const SEOAnalyticsDashboard = lazy(() => import('@/components/admin/SEOAnalyticsDashboard').then(m => ({ default: m.SEOAnalyticsDashboard })));
const DataExporter = lazy(() => import('@/components/admin/DataExporter').then(m => ({ default: m.DataExporter })));
const MLPerformanceDashboard = lazy(() => import('@/components/admin/MLPerformanceDashboard').then(m => ({ default: m.MLPerformanceDashboard })));

type TabType = 'overview' | 'ml-analytics' | 'ml-monitoring' | 'ml-performance' | 'seo-analytics' | 'performance' | 'data-export' | 'users' | 'alerts' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'ml-analytics' as TabType, label: 'ML Analytics', icon: TrendingUp },
    { id: 'ml-monitoring' as TabType, label: 'ML Monitoring', icon: Activity },
    { id: 'ml-performance' as TabType, label: 'ML Performance', icon: TrendingUp },
    { id: 'seo-analytics' as TabType, label: 'SEO Analytics', icon: Search },
    { id: 'performance' as TabType, label: 'Performance', icon: Activity },
    { id: 'data-export' as TabType, label: 'Data Export', icon: Download },
    { id: 'users' as TabType, label: 'Users', icon: Users },
    { id: 'alerts' as TabType, label: 'Alerts', icon: Bell },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Suspense fallback={<LoadingFallback />}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'ml-analytics' && <MLDashboard />}
            {activeTab === 'ml-monitoring' && <MLMonitoringDashboard />}
            {activeTab === 'ml-performance' && <MLPerformanceDashboard />}
            {activeTab === 'seo-analytics' && <SEOAnalyticsDashboard />}
            {activeTab === 'performance' && <PerformanceMonitor />}
            {activeTab === 'data-export' && <DataExporter />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'alerts' && <AlertsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Overview</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          label="Total Users"
          value="2,847"
          change="+12.5%"
          trend="up"
          icon={<Users className="w-5 h-5" />}
        />
        <QuickStatCard
          label="Active Sessions"
          value="142"
          change="+5.2%"
          trend="up"
          icon={<Activity className="w-5 h-5" />}
        />
        <QuickStatCard
          label="Resumes Analyzed"
          value="8,392"
          change="+18.3%"
          trend="up"
          icon={<FileText className="w-5 h-5" />}
        />
        <QuickStatCard
          label="System Health"
          value="99.9%"
          change="+0.1%"
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Recent Activity */}
      <div className="card-professional p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <ActivityItem
            timestamp="2 min ago"
            event="Resume analyzed"
            user="user@example.com"
            status="success"
          />
          <ActivityItem
            timestamp="5 min ago"
            event="User registered"
            user="newuser@example.com"
            status="success"
          />
          <ActivityItem
            timestamp="8 min ago"
            event="ML model updated"
            user="System"
            status="success"
          />
          <ActivityItem
            timestamp="12 min ago"
            event="Cache cleared"
            user="admin@example.com"
            status="info"
          />
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>
      <div className="card-professional p-6">
        <p className="text-slate-600 dark:text-slate-400">
          User management features coming soon...
        </p>
      </div>
    </div>
  );
}

function AlertsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Alerts</h2>
      <div className="card-professional p-6">
        <p className="text-slate-600 dark:text-slate-400">
          No active alerts. System is running smoothly.
        </p>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
      <div className="card-professional p-6">
        <p className="text-slate-600 dark:text-slate-400">
          System settings and configuration options coming soon...
        </p>
      </div>
    </div>
  );
}

function QuickStatCard({
  label,
  value,
  change,
  trend,
  icon
}: {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}) {
  return (
    <div className="card-professional p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-600 dark:text-slate-400">{icon}</div>
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {change}
        </span>
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

function ActivityItem({
  timestamp,
  event,
  user,
  status
}: {
  timestamp: string;
  event: string;
  user: string;
  status: 'success' | 'error' | 'info';
}) {
  const statusColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900 dark:text-white">
          {event}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {user} • {timestamp}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component for lazy loaded dashboards
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
      </div>
    </div>
  );
}
