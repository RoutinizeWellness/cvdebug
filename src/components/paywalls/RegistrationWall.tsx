/**
 * Registration Wall Component
 *
 * Strategic paywall that shows at key conversion points:
 * 1. After showing preview score - before detailed error list
 * 2. Before saving analysis history
 * 3. Before accessing AI Sprint tools (paid feature)
 */

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, TrendingUp, Save, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export type WallType = "error-details" | "save-history" | "ai-sprint";

interface RegistrationWallProps {
  type: WallType;
  errorCount?: number;
  onSignUp?: () => void;
  className?: string;
}

export function RegistrationWall({ type, errorCount = 0, onSignUp, className = "" }: RegistrationWallProps) {
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      navigate("/auth?from=paywall");
    }
  };

  // Different content for each wall type
  const content = {
    "error-details": {
      icon: TrendingUp,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      title: `Te hemos encontrado ${errorCount} ${errorCount === 1 ? 'fallo' : 'fallos'}`,
      subtitle: "Regístrate gratis para ver cuáles son y cómo arreglarlos",
      benefits: [
        "Lista completa de errores de formato",
        "Sugerencias específicas de keywords faltantes",
        "Análisis de contacto y parsing",
        "Puntuación detallada por sección"
      ],
      ctaText: "Ver Todos los Errores - Gratis",
      ctaIcon: ArrowRight,
      urgency: "✨ Sin tarjeta de crédito • Resultados instantáneos"
    },
    "save-history": {
      icon: Save,
      iconColor: "text-[#1E293B]",
      iconBg: "bg-[#1E293B]/10",
      title: "No pierdas este análisis",
      subtitle: "Crea una cuenta para comparar este CV con otros puestos",
      benefits: [
        "Guarda todos tus análisis",
        "Compara diferentes versiones de tu CV",
        "Rastrea tu progreso de optimización",
        "Accede a tu historial desde cualquier lugar"
      ],
      ctaText: "Crear Cuenta Gratis",
      ctaIcon: Save,
      urgency: "🔒 Tu análisis se borrará al cerrar esta página"
    },
    "ai-sprint": {
      icon: Sparkles,
      iconColor: "text-[#1E293B]",
      iconBg: "bg-[#1E293B]/10",
      title: "Desbloquea el Poder de la IA",
      subtitle: "Sprint requiere una cuenta para acceder a herramientas premium",
      benefits: [
        "Reescritura inteligente con IA",
        "Optimización de keywords en tiempo real",
        "Generación de bullets con métricas",
        "Análisis competitivo del mercado"
      ],
      ctaText: "Activar Sprint ⚡",
      ctaIcon: Zap,
      urgency: "💎 Funciones avanzadas de IA con tu cuenta"
    }
  };

  const config = content[type];
  const Icon = config.icon;
  const CtaIcon = config.ctaIcon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border-2 border-slate-700/50 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl ${className}`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 p-8 md:p-12 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${config.iconBg} flex items-center justify-center`}
        >
          <Icon className={`h-10 w-10 ${config.iconColor}`} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-black text-white mb-3"
        >
          {config.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-300 mb-8 max-w-md mx-auto"
        >
          {config.subtitle}
        </motion.p>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 space-y-3 max-w-md mx-auto text-left"
        >
          {config.benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300">{benefit}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleSignUp}
            size="lg"
            className="gradient-button relative h-14 px-8 text-lg font-bold text-white border-0 group shadow-2xl shadow-primary/30"
          >
            <span className="relative z-10 flex items-center gap-2">
              {config.ctaText}
              <CtaIcon className="h-5 w-5" />
            </span>
          </Button>
        </motion.div>

        {/* Urgency text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-4 text-sm text-slate-400"
        >
          {config.urgency}
        </motion.p>

        {/* For AI Sprint - show pricing hint */}
        {type === "ai-sprint" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 pt-6 border-t border-slate-700/50"
          >
            <p className="text-xs text-slate-400">
              Sprint es una función premium. Primeros 3 análisis gratis al registrarte.
            </p>
          </motion.div>
        )}
      </div>

      {/* Lock indicator for bottom corner */}
      <div className="absolute bottom-4 right-4 opacity-10">
        <Lock className="h-16 w-16 text-white" />
      </div>
    </motion.div>
  );
}

/**
 * Compact version for inline use
 */
export function InlineRegistrationPrompt({ type, onSignUp }: { type: WallType, onSignUp?: () => void }) {
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    } else {
      navigate("/auth?from=inline");
    }
  };

  const messages = {
    "error-details": "🔒 Regístrate gratis para ver la lista completa de errores",
    "save-history": "💾 Crea una cuenta para guardar este análisis",
    "ai-sprint": "✨ Activa Sprint con tu cuenta para optimizar con IA"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 px-6 py-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
    >
      <Lock className="h-5 w-5 text-primary flex-shrink-0" />
      <p className="text-sm text-slate-300 flex-grow">{messages[type]}</p>
      <Button
        onClick={handleSignUp}
        size="sm"
        variant="outline"
        className="border-primary/30 hover:bg-primary/10 whitespace-nowrap"
      >
        Registrarse
      </Button>
    </motion.div>
  );
}
