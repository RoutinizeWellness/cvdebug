import { useNavigate } from "react-router";
import { CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getRegionalPrice, getCurrentRegion } from "@/lib/locale";

export function PricingSection() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({
    single: "€9.99",
    premium: "€19.99",
    discount: undefined as number | undefined,
    region: "Europe",
  });

  useEffect(() => {
    const region = getCurrentRegion();
    const singlePrice = getRegionalPrice(9.99);
    const premiumPrice = getRegionalPrice(19.99);

    setPrices({
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
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-white">Simple Pricing</h2>
          <p className="text-xl text-slate-400">Pay once. Fix forever. No subscriptions.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free Tier */}
          <motion.div
            className="p-8 rounded-2xl bg-slate-950/50 backdrop-blur-sm border border-slate-800 flex flex-col gap-6 h-full hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all"
            whileHover={{ y: -5 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Free Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">Free</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">See your ATS score</p>
            </div>
            <button 
              onClick={() => handlePlanSelect('free')}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 font-bold transition-all text-white"
            >
              Try Free
            </button>
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ATS Score (0-100)
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Robot View (ATS Vision)
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Top 2 Errors Preview
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Top 2 Keywords Preview
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 line-through">
                <span className="text-xl">✕</span>
                Full Keyword Report
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 line-through">
                <span className="text-xl">✕</span>
                Complete Format Fixes
              </div>
            </div>
          </motion.div>

          {/* Single Scan */}
          <motion.div
            className="p-8 rounded-2xl bg-slate-950/50 backdrop-blur-sm border border-slate-800 flex flex-col gap-6 h-full hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all"
            whileHover={{ y: -5 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Single Scan</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">{prices.single}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">One complete fix</p>
            </div>
            <button 
              onClick={() => handlePlanSelect('single_scan')}
              className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 font-bold transition-all text-white"
            >
              Get Single Scan
            </button>
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Full ATS Analysis
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Complete Keyword Report
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Formatting Audit + Fixes
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Unlimited Re-scans (24h)
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                PDF Sanitization
              </div>
            </div>
          </motion.div>

          {/* Interview Sprint - Featured */}
          <motion.div 
            className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/50 shadow-xl shadow-primary/10 flex flex-col gap-6 relative h-full transform md:-translate-y-4"
            whileHover={{ y: -12, boxShadow: "0 25px 50px -12px rgba(163, 127, 188, 0.2)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-lg shadow-primary/25"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🚀 BEST VALUE
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Interview Sprint</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white">{prices.premium}</span>
                {prices.discount && (
                  <span className="text-lg text-slate-500 line-through">
                    {getRegionalPrice(19.99 / (1 - prices.discount / 100)).formatted}
                  </span>
                )}
              </div>
              <p className="text-xs text-primary font-bold mt-1">
                {prices.discount ? `${prices.discount}% OFF - ` : ''}7 days unlimited
              </p>
            </div>
            <motion.button 
              onClick={() => handlePlanSelect('interview_sprint')}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Sprint
            </motion.button>
            <div className="space-y-3 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Unlimited Scans (7 Days)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                AI Keyword Suggestions
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Cover Letter Generator
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                LinkedIn Optimizer
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Priority Support
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}