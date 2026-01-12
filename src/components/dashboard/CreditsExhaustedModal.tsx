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
            className="w-full max-w-lg glass-panel bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex-1 flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 mb-3 animate-pulse">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Credits Exhausted
                </h3>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <p className="text-lg font-bold text-white mb-2">
                You've used your free diagnostic scan.
              </p>
              {currentScore !== undefined && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-sm text-zinc-400">Your CV Score:</span>
                  <span className={`text-3xl font-black ${
                    currentScore >= 80 ? 'text-green-500' : 
                    currentScore >= 50 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    {currentScore}%
                  </span>
                </div>
              )}
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-zinc-300 font-medium">
                  <span className="text-red-400 font-bold">⚠️ Critical:</span> Your resume is missing 20+ keywords that ATS systems scan for.
                </p>
              </div>
              <p className="text-zinc-400 text-sm">
                Without fixing these gaps, your application will be <span className="text-red-400 font-bold">automatically rejected</span> before any human sees it.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 text-left">
                <Sparkles className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Unlock Full Analysis</p>
                  <p className="text-xs text-zinc-400">See all 20+ missing keywords with exact placement suggestions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <TrendingUp className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">ATS Optimization Guide</p>
                  <p className="text-xs text-zinc-400">Step-by-step fixes to boost your score to 85%+</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-teal-500/30 rounded-xl p-4">
              <p className="text-2xl font-black text-white mb-1">€4.99</p>
              <p className="text-xs text-zinc-400">One-time payment • No subscription • Instant access</p>
            </div>
            </div>

            {/* Footer with Actions */}
            <div className="px-6 py-4 border-t border-slate-800 flex gap-3 flex-col sm:flex-row">
              <button
                onClick={onUpgrade}
                className="flex-1 font-bold text-base h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-cyan-500/25 rounded-lg text-white flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="h-5 w-5" />
                Unlock Full Report - €4.99
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="sm:flex-none px-6 h-12 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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
