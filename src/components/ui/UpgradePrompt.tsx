import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Rocket, Lock, ArrowRight } from "lucide-react";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradePrompt({ isOpen, onClose, onUpgrade }: UpgradePromptProps) {
  const features = [
    "Unlimited CV Parses",
    "AI Keyword Optimization",
    "Export to PDF & JSON",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-[#FFFFFF] text-left align-middle shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-[#E2E8F0] ring-1 ring-[#F3E8FF]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] z-10"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Decorative Gradient Blobs */}
              <div className="absolute -top-24 -left-20 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -top-24 -right-20 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative px-8 pt-10 pb-8 flex flex-col items-center">
                {/* Hero Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-6 relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] border border-[#E2E8F0] shadow-xl flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-transparent bg-clip-text bg-gradient-to-br from-[#0F172A] to-[#64748B]" style={{
                      filter: "drop-shadow(0 0 8px rgba(59,130,246,0.3))"
                    }} />
                  </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center space-y-3 mb-8"
                >
                  <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                    Unlock Interview Sprint
                  </h2>
                  <p className="text-[#64748B] text-sm leading-relaxed px-2">
                    You've hit the limit of the free plan. Upgrade now to debug{" "}
                    <span className="text-[#0F172A] font-medium">unlimited CVs</span> and
                    access AI-driven insights.
                  </p>
                </motion.div>

                {/* Feature List */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-full bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] mb-8 backdrop-blur-sm"
                >
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                          <Check className="h-3.5 w-3.5 font-bold" />
                        </div>
                        <span className="text-sm text-[#0F172A] font-medium">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="w-full flex flex-col gap-3"
                >
                  <button
                    onClick={onUpgrade}
                    className="relative w-full h-12 flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#2b3bee] shadow-lg shadow-[#3B82F6]/20 hover:shadow-[#3B82F6]/40 transition-all duration-300 group"
                  >
                    {/* Animated gradient border effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>

                    {/* Inner button */}
                    <div className="relative h-full w-full bg-gradient-to-r from-[#3B82F6] to-[#2b3bee] hover:brightness-110 flex items-center justify-center rounded-lg transition-all">
                      <span className="text-white font-semibold text-sm tracking-wide">
                        Upgrade to Interview Sprint
                      </span>
                      <ArrowRight className="text-white ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full h-10 flex items-center justify-center rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors text-sm font-medium"
                  >
                    No thanks, I'll stick to free
                  </button>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mt-6 flex items-center justify-center gap-2"
                >
                  <Lock className="h-3 w-3 text-[#8B5CF6]" />
                  <span className="text-xs text-[#64748B] font-mono">Secured by Stripe</span>
                </motion.div>
              </div>

              {/* Bottom decorative glow line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent"></div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
