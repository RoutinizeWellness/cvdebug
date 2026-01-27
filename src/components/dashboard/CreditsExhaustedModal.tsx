import { X, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreditsExhaustedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentScore?: number;
  onUpgrade: () => void;
}

export function CreditsExhaustedModal({ open, onOpenChange, currentScore, onUpgrade }: CreditsExhaustedModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] bg-midnight/70 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg glass-panel bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex-1 flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 mb-3 animate-pulse">
                  <AlertTriangle className="h-8 w-8 text-[#0F172A]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                  Credits Exhausted
                </h3>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0F172A] transition-colors p-2 hover:bg-[#F8FAFC] rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6">
              <p className="text-lg font-bold text-[#0F172A] mb-2">
                You've used your free diagnostic scan.
              </p>
              {currentScore !== undefined && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm text-[#475569]">Your CV Score:</span>
                  <span className={`text-3xl font-black ${
                    currentScore >= 80 ? 'text-[#22C55E]' :
                    currentScore >= 50 ? 'text-[#F59E0B]' :
                    'text-[#EF4444]'
                  }`}>
                    {currentScore}%
                  </span>
                </div>
              )}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-[#475569] font-medium">
                  <span className="text-[#EF4444] font-bold">⚠️ Critical:</span> Your resume is missing 20+ keywords that ATS systems scan for.
                </p>
              </div>
              <p className="text-[#475569] text-sm">
                Without fixing these gaps, your application will be <span className="text-[#EF4444] font-bold">automatically rejected</span> before any human sees it.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-left">
                <Sparkles className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">Unlock Full Analysis</p>
                  <p className="text-xs text-[#475569]">See all 20+ missing keywords with exact placement suggestions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <TrendingUp className="h-5 w-5 text-[#22C55E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#0F172A]">ATS Optimization Guide</p>
                  <p className="text-xs text-[#475569]">Step-by-step fixes to boost your score to 85%+</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-pink-50 border border-teal-200 rounded-xl p-4">
              <p className="text-2xl font-black text-[#0F172A] mb-1">€9.99</p>
              <p className="text-xs text-[#475569]">One-time payment • No subscription • Instant access</p>
            </div>
            </div>

            {/* Footer with Actions */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex gap-3 flex-col sm:flex-row">
              <button
                onClick={onUpgrade}
                className="flex-1 font-bold text-base h-12 bg-gradient-to-r from-teal-600 to-pink-600 hover:from-[#1E293B] hover:to-pink-700 shadow-lg shadow-cyan-500/25 rounded-lg text-[#0F172A] flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="h-5 w-5" />
                Unlock Full Report - €9.99
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="sm:flex-none px-6 h-12 text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-lg transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
