import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export type NotificationType = "success" | "warning" | "info" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  fileName?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }>;
  autoDismiss?: boolean;
  dismissAfter?: number; // milliseconds
}

interface NotificationPopupProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function NotificationPopup({
  notifications,
  onDismiss,
  position = "top-right",
}: NotificationPopupProps) {
  const [dismissProgress, setDismissProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const intervals: Record<string, NodeJS.Timeout> = {};

    notifications.forEach((notification) => {
      if (notification.autoDismiss !== false) {
        const duration = notification.dismissAfter || 5000;
        const interval = 50;
        const steps = duration / interval;
        let currentStep = 0;

        intervals[notification.id] = setInterval(() => {
          currentStep++;
          const progress = (currentStep / steps) * 100;
          setDismissProgress((prev) => ({ ...prev, [notification.id]: progress }));

          if (currentStep >= steps) {
            onDismiss(notification.id);
            clearInterval(intervals[notification.id]);
          }
        }, interval);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [notifications, onDismiss]);

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-6 left-6 md:top-8 md:left-8";
      case "bottom-right":
        return "bottom-6 right-6 md:bottom-8 md:right-8";
      case "bottom-left":
        return "bottom-6 left-6 md:bottom-8 md:left-8";
      default:
        return "top-6 right-6 md:top-8 md:right-8";
    }
  };

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return {
          accentGradient: "from-primary to-slate-700",
          iconBg: "bg-slate-600/10 border-slate-600/20 text-primary shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]",
          icon: CheckCircle,
          progressBar: "bg-primary shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]",
          border: "border-primary/20",
        };
      case "warning":
        return {
          accentGradient: "from-orange-500 to-red-500",
          iconBg: "bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)]",
          icon: AlertTriangle,
          progressBar: "bg-orange-500 shadow-[0_0_10px_2px_rgba(249,115,22,0.5)]",
          border: "border-orange-500/20",
        };
      case "info":
        return {
          accentGradient: "from-secondary to-slate-700",
          iconBg: "bg-secondary/10 border-secondary/20 text-secondary shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]",
          icon: Sparkles,
          progressBar: "bg-secondary shadow-[0_0_10px_2px_rgba(139,92,246,0.5)]",
          border: "border-secondary/20",
        };
      default:
        return {
          accentGradient: "from-red-500 to-red-600",
          iconBg: "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]",
          icon: AlertTriangle,
          progressBar: "bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.5)]",
          border: "border-red-500/20",
        };
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col gap-4 w-full max-w-[400px] pointer-events-none ${getPositionClasses()}`}>
      <AnimatePresence>
        {notifications.map((notification, index) => {
          const styles = getNotificationStyles(notification.type);
          const Icon = styles.icon;
          const progress = dismissProgress[notification.id] || 0;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`glass-notification rounded-xl p-0 relative overflow-hidden hover:scale-[1.02] cursor-pointer group pointer-events-auto ${styles.border}`}
              onClick={() => onDismiss(notification.id)}
            >
              {/* Accent Glow */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${styles.accentGradient}`}></div>

              <div className="p-4 flex items-start gap-4">
                {/* Icon */}
                <div className={`shrink-0 size-10 rounded-full border flex items-center justify-center ${styles.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-white font-semibold text-sm leading-tight mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {notification.message}
                    {notification.fileName && (
                      <>
                        {" "}
                        <span className="text-slate-300 font-mono">
                          {notification.fileName}
                        </span>
                      </>
                    )}
                    .
                  </p>

                  {/* Actions */}
                  {notification.actions && notification.actions.length > 0 && (
                    <div className="mt-2 flex gap-3">
                      {notification.actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          className={`text-xs font-semibold transition-colors ${
                            action.variant === "primary"
                              ? notification.type === "warning"
                                ? "text-orange-400 hover:text-orange-300"
                                : "text-primary hover:text-primary/80"
                              : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification.id);
                  }}
                  className="shrink-0 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Bar (Dismissal Timer) */}
              {notification.autoDismiss !== false && (
                <div className="h-0.5 w-full bg-slate-800 mt-0 relative overflow-hidden">
                  <motion.div
                    className={`absolute left-0 top-0 h-full ${styles.progressBar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    notification: Omit<Notification, "id">
  ) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications((prev) => [...prev, { ...notification, id }]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}
