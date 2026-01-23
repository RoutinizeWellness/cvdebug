import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityReminderBannerProps {
  show: boolean;
  daysSinceActive: number;
  lastScore?: number;
  onDismiss: () => void;
  onAction: () => void;
}

export function ActivityReminderBanner({
  show,
  daysSinceActive,
  lastScore,
  onDismiss,
  onAction,
}: ActivityReminderBannerProps) {
  const getMessage = (): { title: string; description: string; urgency: "high" | "medium" | "low" } => {
    if (daysSinceActive >= 7) {
      return {
        title: "¡Te Echábamos de Menos! 🎯",
        description: `Han pasado ${daysSinceActive} días desde tu última optimización. El mercado laboral sigue activo - tu CV no debería estar parado.`,
        urgency: "high" as const,
      };
    } else if (daysSinceActive >= 5) {
      return {
        title: "Recordatorio: CV sin Actualizar ⚠️",
        description: `${daysSinceActive} días sin revisar tu CV. Los reclutadores publican nuevas ofertas cada día.`,
        urgency: "medium" as const,
      };
    } else {
      return {
        title: "Continúa tu Progreso 💼",
        description: `${daysSinceActive} días desde tu última sesión. Mantén el momentum.`,
        urgency: "low" as const,
      };
    }
  };

  const message = getMessage();

  const urgencyColors = {
    high: {
      bg: "from-red-500 to-orange-500",
      border: "border-red-400",
      icon: "text-red-100",
    },
    medium: {
      bg: "from-amber-500 to-yellow-500",
      border: "border-amber-400",
      icon: "text-amber-100",
    },
    low: {
      bg: "from-[#334155] to-indigo-500",
      border: "border-blue-400",
      icon: "text-blue-100",
    },
  };

  const colors = urgencyColors[message.urgency];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <div
          className={`bg-gradient-to-r ${colors.bg} border-2 ${colors.border} rounded-xl p-6 shadow-lg relative overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <Calendar className={`h-8 w-8 ${colors.icon}`} />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-white font-black text-xl mb-2">{message.title}</h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {message.description}
              </p>

              {lastScore !== undefined && lastScore < 70 && (
                <div className="flex items-center gap-2 text-white/80 text-xs mb-4">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    Tu último score: <span className="font-bold">{lastScore}%</span> - Aún hay
                    margen de mejora
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onAction}
                  className="bg-white text-slate-900 hover:bg-white/90 font-bold shadow-lg"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Optimizar Ahora
                </Button>
                <Button
                  onClick={onDismiss}
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10"
                >
                  Más Tarde
                </Button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 min-w-[140px]">
                <div className="text-center">
                  <div className="text-3xl font-black text-white mb-1">
                    {daysSinceActive}
                  </div>
                  <div className="text-xs text-white/70 uppercase tracking-wider">
                    Días Inactivo
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-[10px] text-white/60 text-center">
                    Objetivo: Sesión diaria
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
