import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ActivityData {
  lastActiveDate: string;
  lastScore?: number;
  reminderShown: boolean;
}

export function useActivityReminder(currentUserId?: string, currentScore?: number) {
  const [showReminderBanner, setShowReminderBanner] = useState(false);
  const [daysSinceActive, setDaysSinceActive] = useState(0);

  useEffect(() => {
    if (!currentUserId) return;

    const storageKey = `activity_${currentUserId}`;
    const now = new Date();
    const todayStr = now.toDateString();

    // Get stored activity data
    const storedData = localStorage.getItem(storageKey);
    const activityData: ActivityData = storedData
      ? JSON.parse(storedData)
      : { lastActiveDate: todayStr, reminderShown: false };

    // Calculate days since last activity
    const lastDate = new Date(activityData.lastActiveDate);
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    setDaysSinceActive(diffDays);

    // Update last active date to today
    const updatedData: ActivityData = {
      lastActiveDate: todayStr,
      lastScore: currentScore,
      reminderShown: false,
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedData));

    // Show reminder if user hasn't been active for 3+ days
    if (diffDays >= 3 && !activityData.reminderShown) {
      setShowReminderBanner(true);

      // Show toast notification
      const reminderMessage = getReminderMessage(diffDays, activityData.lastScore);
      toast.info(reminderMessage, {
        duration: 10000,
        action: {
          label: "Ver CV",
          onClick: () => {
            setShowReminderBanner(false);
            // Scroll to resume section
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
        },
      });

      // Mark reminder as shown
      updatedData.reminderShown = true;
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
    }
  }, [currentUserId, currentScore]);

  const dismissReminder = () => {
    setShowReminderBanner(false);
  };

  return {
    showReminderBanner,
    daysSinceActive,
    dismissReminder,
  };
}

function getReminderMessage(days: number, lastScore?: number): string {
  if (days >= 7) {
    return `🔥 Han pasado ${days} días! Tu CV está esperando. ${
      lastScore && lastScore < 70
        ? `Tu último score era ${lastScore}% - ¿listo para mejorarlo?`
        : "¿Listo para seguir optimizando?"
    }`;
  } else if (days >= 5) {
    return `⚠️ ${days} días sin optimizar tu CV. Los reclutadores siguen buscando - no pierdas oportunidades.`;
  } else {
    return `💼 ${days} días desde tu última sesión. Un CV optimizado = más entrevistas.`;
  }
}
