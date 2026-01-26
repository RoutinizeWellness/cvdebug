import { useNavigate } from "react-router";
import { CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getRegionalPrice, getCurrentRegion } from "@/lib/locale";
import { useI18n } from "@/contexts/I18nContext";

export function PricingSection() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [prices, setPrices] = useState({
    singleDebugFix: "€5.99",
    single: "€14.99",
    premium: "€24.99",
    discount: undefined as number | undefined,
    region: "Europe",
  });

  useEffect(() => {
    const region = getCurrentRegion();
    const singleDebugFixPrice = getRegionalPrice(5.99);
    const singlePrice = getRegionalPrice(14.99);
    const premiumPrice = getRegionalPrice(24.99);

    setPrices({
      singleDebugFix: singleDebugFixPrice.formatted,
      single: singlePrice.formatted,
      premium: premiumPrice.formatted,
      discount: premiumPrice.discount,
      region: region.countryName,
    });
  }, []);

  const handlePlanSelect = (plan: string) => {
    navigate(`/auth?plan=${plan}`);
  };

  return (
    <section className="w-full relative overflow-hidden" id="pricing">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">{t.pricingLanding.title}</h2>
          <p className="text-xl text-slate-400">{t.pricingLanding.subtitle}</p>
          {prices.discount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {prices.discount}% off for {prices.region}
              </span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Free Tier - EL GANCHO */}
          <motion.div
            className="p-8 rounded-2xl bg-slate-950/50 backdrop-blur-sm border border-slate-800 flex flex-col gap-6 h-full hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all relative"
            whileHover={{ y: -5 }}
          >
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded text-[10px] font-bold font-mono bg-slate-800 text-slate-400 shadow-sm">
                EL GANCHO
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold mb-2 text-white">{t.pricingLanding.freeTitle}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">€0</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">{t.pricingLanding.freeSubtitle}</p>
            </div>
            <button
              onClick={() => handlePlanSelect('free')}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 font-bold transition-all text-white"
            >
              {t.pricingLanding.freeScanButton}
            </button>
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">[ERR]</span>
                {t.pricingLanding.freeFeature1}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.freeFeature2}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">[ERR]</span>
                {t.pricingLanding.freeFeature3}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                {t.pricingLanding.freeFeature4}
              </div>
            </div>
          </motion.div>

          {/* Single Debug Fix - ARREGLA DE UNA VEZ */}
          <motion.div
            className="p-8 rounded-2xl bg-slate-950/50 backdrop-blur-sm border border-slate-800 flex flex-col gap-6 h-full hover:border-[#F59E0B]/30 hover:shadow-lg hover:shadow-[#F59E0B]/10 transition-all relative"
            whileHover={{ y: -5 }}
          >
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded text-[10px] font-bold font-mono bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 shadow-sm">
                ARREGLA DE UNA VEZ
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold mb-2 text-white">Arreglo Rápido</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">{prices.singleDebugFix}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">Arregla tu CV por el precio de un café</p>
            </div>
            <button
              onClick={() => handlePlanSelect('single_debug_fix')}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#F59E0B]/50 font-bold transition-all text-white"
            >
              Arreglar Mi CV →
            </button>
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                1 Escaneo Profundo Completo
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Vista Robot Desbloqueada
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                1 Optimización AI (Rewrite)
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                Auto-Inyección Keywords
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Exportar CV Optimizado
              </div>
            </div>
            <div className="mt-2 px-3 py-2 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded text-center">
              <span className="text-xs font-mono font-bold text-[#22C55E]">
                ✓ PLANTILLA LEGIBLE GARANTIZADA
              </span>
            </div>
          </motion.div>

          {/* Pase 24h - HOT FIX */}
          <motion.div
            className="p-8 rounded-2xl bg-slate-950/50 backdrop-blur-sm border border-slate-800 flex flex-col gap-6 h-full hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/10 transition-all relative"
            whileHover={{ y: -5 }}
          >
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded text-[10px] font-bold font-mono bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 shadow-sm">
                HOT FIX / URGENTE
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold mb-2 text-white">Pase 24h</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">{prices.single}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">Debug Inmediato para entrevista mañana</p>
            </div>
            <button
              onClick={() => handlePlanSelect('single_scan')}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500/50 font-bold transition-all text-white"
            >
              Acceso 24h →
            </button>
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Scans Ilimitados (24h)
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Vista X-Ray Robot Completa
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                Etiquetas [ERROR] + [WARN] + Fixes
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Detector Gap de Keywords
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Plantilla 100% Legible por ATS
              </div>
            </div>
            <div className="mt-2 px-3 py-2 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded text-center">
              <span className="text-xs font-mono font-bold text-[#22C55E]">
                ✓ GARANTIZADA
              </span>
            </div>
          </motion.div>

          {/* Sprint 7 Días - INTENSIVO */}
          <motion.div
            className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-slate-600/10 border border-primary/50 shadow-xl shadow-primary/10 flex flex-col gap-6 relative h-full transform md:-translate-y-4"
            whileHover={{ y: -12, boxShadow: "0 25px 50px -12px rgba(163, 127, 188, 0.2)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white text-xs font-bold px-4 py-1.5 rounded tracking-wide shadow-lg shadow-primary/25 font-mono"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              INTENSIVO / RECOMENDADO
            </motion.div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold mb-2 text-white">Sprint 7 Días</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{prices.premium}</span>
                {prices.discount && (
                  <span className="text-lg text-slate-500 line-through">
                    {getRegionalPrice(24.99 / (1 - prices.discount / 100)).formatted}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Modo Bestia. Ataque total de 7 días
              </p>
            </div>
            <motion.button
              onClick={() => handlePlanSelect('sprint_7day')}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold shadow-lg shadow-primary/25 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Empezar Sprint 7 Días →
            </motion.button>
            <div className="space-y-3 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Scans Ilimitados (7 días)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Selector Industria (FAANG/Finanzas)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                Elevador Tono Viñetas (AI Rewrite)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Battle Plan Entrevistas
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                Cover Letter + LinkedIn Optimizer
              </div>
            </div>
            <div className="mt-2 px-3 py-2 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded text-center">
              <span className="text-xs font-mono font-bold text-[#22C55E]">
                ✓ PLANTILLA 100% LEGIBLE GARANTIZADA
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}