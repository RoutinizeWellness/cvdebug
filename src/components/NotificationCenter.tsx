/**
 * Notification Center Component
 * Displays real-time system notifications with filtering and actions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Filter,
  Trash2
} from 'lucide-react';
import { useRealtimeNotifications, type Notification } from '@/hooks/useRealtimeNotifications';

interface NotificationCenterProps {
  enabled?: boolean;
  showToast?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function NotificationCenter({
  enabled = true,
  showToast = false, // Disabled by default to avoid duplicate toasts
  position = 'top-right'
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'warning' | 'info'>('all');

  const {
    notifications,
    unreadCount,
    removeNotification,
    clearAll,
    markAllAsRead
  } = useRealtimeNotifications({ enabled, showToast });

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <>
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAllAsRead();
        }}
        className="relative p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${positionClasses[position]} w-96 max-h-[600px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h3>
                {notifications.length > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({notifications.length})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={clearAll}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4 text-slate-500" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
              {['all', 'success', 'error', 'warning', 'info'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    filter === f
                      ? 'bg-[#1E293B] text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No notifications
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRemove={removeNotification}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NotificationItem({
  notification,
  onRemove
}: {
  notification: Notification;
  onRemove: (id: string) => void;
}) {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-500" />,
    info: <Info className="w-5 h-5 text-[#1E293B]" />
  };

  const bgColorMap = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900',
    warning: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900',
    info: 'bg-[#F8FAFC] dark:bg-[#0F172A]/20 border-[#E2E8F0] dark:border-[#0F172A]'
  };

  const severityBadge = notification.metadata?.severity ? (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
        notification.metadata.severity === 'critical'
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          : notification.metadata.severity === 'high'
          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
          : notification.metadata.severity === 'medium'
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          : 'bg-[#F1F5F9] dark:bg-[#0F172A]/30 text-[#0F172A] dark:text-[#94A3B8]'
      }`}
    >
      {notification.metadata.severity}
    </span>
  ) : null;

  const timeAgo = formatTimeAgo(notification.timestamp);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className={`border-b border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{iconMap[notification.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {notification.title}
            </h4>
            <button
              onClick={() => onRemove(notification.id)}
              className="flex-shrink-0 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {severityBadge}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {timeAgo}
              </span>
            </div>
            {notification.metadata?.actionUrl && (
              <a
                href={notification.metadata.actionUrl}
                className="text-xs text-[#1E293B] dark:text-[#94A3B8] hover:underline font-medium"
              >
                {notification.metadata.actionLabel || 'View'}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
