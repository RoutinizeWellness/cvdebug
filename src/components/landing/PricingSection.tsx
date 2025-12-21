import { useNavigate } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function PricingSection() {
  const navigate = useNavigate();

  const handlePlanSelect = (plan: string) => {
    navigate(`/auth?plan=${plan}`);
  };

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden" id="pricing">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-gray-900">Simple Pricing</h2>
          <p className="text-xl text-gray-600">Pay once. Fix forever. No subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free Tier */}
          <motion.div 
            className="p-8 rounded-2xl bg-white border-2 border-gray-200 flex flex-col gap-6 h-full hover:border-gray-300 hover:shadow-lg transition-all"
            whileHover={{ y: -5 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Free Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-gray-900">€0</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">See your ATS score</p>
            </div>
            <button 
              onClick={() => handlePlanSelect('free')}
              className="w-full h-12 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 font-bold transition-all text-gray-900"
            >
              Try Free
            </button>
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Basic Score (0-100)
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 line-through">
                <span className="text-xl">✕</span>
                Keyword Analysis
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 line-through">
                <span className="text-xl">✕</span>
                Format Fixes
              </div>
            </div>
          </motion.div>

          {/* Single Scan */}
          <motion.div 
            className="p-8 rounded-2xl bg-white border-2 border-gray-200 flex flex-col gap-6 h-full hover:border-gray-300 hover:shadow-lg transition-all"
            whileHover={{ y: -5 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Single Scan</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-gray-900">€4.99</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">One complete fix</p>
            </div>
            <button 
              onClick={() => handlePlanSelect('single_scan')}
              className="w-full h-12 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 font-bold transition-all text-gray-900"
            >
              Get Single Scan
            </button>
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Full ATS Analysis
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Keyword Report
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Format Check
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                PDF Sanitization
              </div>
            </div>
          </motion.div>

          {/* Interview Sprint - Featured */}
          <motion.div 
            className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary shadow-xl flex flex-col gap-6 relative h-full transform md:-translate-y-4"
            whileHover={{ y: -12, boxShadow: "0 25px 50px -12px rgba(163, 127, 188, 0.4)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🚀 BEST VALUE
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Interview Sprint</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-gray-900">€19.99</span>
                <span className="text-lg text-gray-500 line-through">€49.99</span>
              </div>
              <p className="text-xs text-primary font-bold mt-1">60% OFF - 7 days unlimited</p>
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
              <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Unlimited Scans (7 Days)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                AI Keyword Suggestions
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                Cover Letter Generator
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                LinkedIn Optimizer
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-900">
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