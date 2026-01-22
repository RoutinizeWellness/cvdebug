/**
 * Real-time Notifications Hook
 * Displays system events, webhooks, and anomalies in real-time
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  metadata?: {
    eventType?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    actionUrl?: string;
    actionLabel?: string;
  };
}

interface UseRealtimeNotificationsOptions {
  enabled?: boolean;
  maxNotifications?: number;
  autoRemoveDelay?: number; // ms
  showToast?: boolean;
}

/**
 * Hook for real-time notifications
 * Connects to system events and displays notifications
 */
export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const {
    enabled = true,
    maxNotifications = 50,
    autoRemoveDelay = 5000,
    showToast = true
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /**
   * Add a new notification
   */
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    setUnreadCount(prev => prev + 1);

    // Show toast notification
    if (showToast) {
      const toastFn = notification.type === 'error' ? toast.error :
                      notification.type === 'warning' ? toast.warning :
                      notification.type === 'success' ? toast.success :
                      toast.info;

      toastFn(notification.title, {
        description: notification.message,
        duration: autoRemoveDelay,
        action: notification.metadata?.actionUrl ? {
          label: notification.metadata.actionLabel || 'View',
          onClick: () => {
            if (notification.metadata?.actionUrl) {
              window.location.href = notification.metadata.actionUrl;
            }
          }
        } : undefined
      });
    }

    // Auto-remove after delay
    if (autoRemoveDelay > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, autoRemoveDelay);
    }

    return newNotification.id;
  }, [maxNotifications, showToast, autoRemoveDelay]);

  /**
   * Remove a notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  /**
   * Mark all as read
   */
  const markAllAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  /**
   * Simulate system events (in production, connect to Convex subscriptions)
   */
  useEffect(() => {
    if (!enabled) return;

    // Simulated event listeners
    // In production, replace with Convex query subscriptions

    // Example: Listen for analysis completions
    const handleAnalysisComplete = (event: any) => {
      addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: `Resume analysis finished with score ${event.score}`,
        metadata: {
          eventType: 'analysis.completed',
          severity: event.score < 50 ? 'high' : 'low',
          actionUrl: `/analysis/${event.analysisId}`,
          actionLabel: 'View Results'
        }
      });
    };

    // Example: Listen for anomalies
    const handleAnomalyDetected = (event: any) => {
      addNotification({
        type: 'warning',
        title: 'Anomaly Detected',
        message: event.message,
        metadata: {
          eventType: 'anomaly.detected',
          severity: event.severity,
          actionUrl: '/admin-dashboard',
          actionLabel: 'View Dashboard'
        }
      });
    };

    // Example: Listen for model updates
    const handleModelUpdate = (event: any) => {
      addNotification({
        type: 'info',
        title: 'Model Updated',
        message: `ML model upgraded to v${event.version} with ${event.accuracy}% accuracy`,
        metadata: {
          eventType: 'model.updated',
          severity: 'low',
          actionUrl: '/admin-dashboard',
          actionLabel: 'View Details'
        }
      });
    };

    // In production, replace with actual event subscriptions
    // window.addEventListener('analysis:complete', handleAnalysisComplete);
    // window.addEventListener('anomaly:detected', handleAnomalyDetected);
    // window.addEventListener('model:updated', handleModelUpdate);

    return () => {
      // Cleanup event listeners
      // window.removeEventListener('analysis:complete', handleAnalysisComplete);
      // window.removeEventListener('anomaly:detected', handleAnomalyDetected);
      // window.removeEventListener('model:updated', handleModelUpdate);
    };
  }, [enabled, addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    clearAll,
    markAllAsRead
  };
}

/**
 * Helper functions for creating notifications
 */
export const notificationHelpers = {
  analysisComplete: (score: number, analysisId: string): Omit<Notification, 'id' | 'timestamp'> => ({
    type: score >= 70 ? 'success' : score >= 50 ? 'info' : 'warning',
    title: 'Analysis Complete',
    message: `Resume scored ${score}/100${score < 50 ? ' - Needs improvement' : ''}`,
    metadata: {
      eventType: 'analysis.completed',
      severity: score < 40 ? 'critical' : score < 55 ? 'high' : score < 70 ? 'medium' : 'low',
      actionUrl: `/analysis/${analysisId}`,
      actionLabel: 'View Results'
    }
  }),

  analysisFailed: (error: string): Omit<Notification, 'id' | 'timestamp'> => ({
    type: 'error',
    title: 'Analysis Failed',
    message: `Error: ${error}`,
    metadata: {
      eventType: 'analysis.failed',
      severity: 'high'
    }
  }),

  anomalyDetected: (type: string, message: string, severity: 'low' | 'medium' | 'high' | 'critical'): Omit<Notification, 'id' | 'timestamp'> => ({
    type: severity === 'critical' || severity === 'high' ? 'error' : 'warning',
    title: 'System Anomaly',
    message: `${type}: ${message}`,
    metadata: {
      eventType: 'anomaly.detected',
      severity,
      actionUrl: '/admin-dashboard',
      actionLabel: 'View Dashboard'
    }
  }),

  modelUpdated: (version: number, accuracy: number): Omit<Notification, 'id' | 'timestamp'> => ({
    type: 'success',
    title: 'Model Updated',
    message: `ML model v${version} deployed with ${accuracy.toFixed(1)}% accuracy`,
    metadata: {
      eventType: 'model.updated',
      severity: 'low',
      actionUrl: '/admin-dashboard',
      actionLabel: 'View Details'
    }
  }),

  webhookDelivered: (url: string, eventType: string): Omit<Notification, 'id' | 'timestamp'> => ({
    type: 'success',
    title: 'Webhook Delivered',
    message: `${eventType} sent to ${url.substring(0, 30)}...`,
    metadata: {
      eventType: 'webhook.delivered',
      severity: 'low'
    }
  }),

  webhookFailed: (url: string, eventType: string, error: string): Omit<Notification, 'id' | 'timestamp'> => ({
    type: 'error',
    title: 'Webhook Failed',
    message: `Failed to send ${eventType} to ${url.substring(0, 30)}...: ${error}`,
    metadata: {
      eventType: 'webhook.failed',
      severity: 'medium'
    }
  })
};
