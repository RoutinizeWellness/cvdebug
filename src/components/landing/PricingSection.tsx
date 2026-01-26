import { useNavigate } from "react-router";
import { CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getRegionalPrice, getCurrentRegion } from "@/lib/locale";
import { useI18n } from "@/contexts/I18nContext";

export function PricingSection() {
  const navigate = useNavigate();
  const { t, locale } = useI18n();
  const [prices, setPrices] = useState({
    singleDebugFix: "€5.99",
    single: "€14.99",
    premium: "€24.99",
    discount: undefined as number | undefined,
    region: "Europe",
  });

  useEffect(() => {
    console.log(`[PricingSection] Current locale: ${locale}`);
    console.log(`[PricingSection] Sample translation:`, t.pricingLanding.freeTitle);

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
  }, [locale, t]);

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
                {t.pricingLanding.singleDebugBadge}
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold mb-2 text-white">{t.pricingLanding.singleDebugTitle}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">{prices.singleDebugFix}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">{t.pricingLanding.singleDebugSubtitle}</p>
            </div>
            <button
              onClick={() => handlePlanSelect('single_debug_fix')}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#F59E0B]/50 font-bold transition-all text-white"
            >
              {t.pricingLanding.singleDebugButton}
            </button>
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.singleDebugFeature1}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.singleDebugFeature2}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                {t.pricingLanding.singleDebugFeature3}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                {t.pricingLanding.singleDebugFeature4}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.singleDebugFeature5}
              </div>
            </div>
            <div className="mt-2 px-3 py-2 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded text-center">
              <span className="text-xs font-mono font-bold text-[#22C55E]">
                {t.pricingLanding.singleDebugGuarantee}
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
                {t.pricingLanding.pass24hBadge}
              </span>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold mb-2 text-white">{t.pricingLanding.pass24hTitle}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">{prices.single}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">{t.pricingLanding.pass24hSubtitle}</p>
            </div>
            <button
              onClick={() => handlePlanSelect('single_scan')}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-red-500/50 font-bold transition-all text-white"
            >
              {t.pricingLanding.pass24hButton}
            </button>
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.pass24hFeature1}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.pass24hFeature2}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                {t.pricingLanding.pass24hFeature3}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.pass24hFeature4}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.pass24hFeature5}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.pass24hFeature7}
              </div>
            </div>
            <div className="mt-2 px-3 py-2 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded text-center">
              <span className="text-xs font-mono font-bold text-[#22C55E]">
                {t.pricingLanding.pass24hGuarantee}
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
              {t.pricingLanding.sprint7dBadge}
            </motion.div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold mb-2 text-white">{t.pricingLanding.sprint7dTitle}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{prices.premium}</span>
                <span className="text-lg text-slate-500 line-through">
                  {t.pricingLanding.sprint7dBeforePrice}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {t.pricingLanding.sprint7dSubtitle}
              </p>
            </div>
            <motion.button
              onClick={() => handlePlanSelect('sprint_7day')}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold shadow-lg shadow-primary/25 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.pricingLanding.sprint7dButton}
            </motion.button>
            <div className="space-y-3 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.sprint7dFeature1}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.sprint7dFeature2}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">[FIX]</span>
                {t.pricingLanding.sprint7dFeature3}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.sprint7dFeature4}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.sprint7dFeature5}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.sprint7dFeature6}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <span className="flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">[OK]</span>
                {t.pricingLanding.sprint7dFeature7}
              </div>
            </div>
            <div className="mt-2 px-3 py-2 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded text-center">
              <span className="text-xs font-mono font-bold text-[#22C55E]">
                {t.pricingLanding.sprint7dGuarantee}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}