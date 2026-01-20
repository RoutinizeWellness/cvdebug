import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface PaymentSuccessModalProps {
  open: boolean;
  onClose: () => void;
  plan: "single_scan" | "interview_sprint";
}

export function PaymentSuccessModal({ open, onClose, plan }: PaymentSuccessModalProps) {
  const [autoCloseTimer, setAutoCloseTimer] = useState(5);

  const planName = plan === "single_scan" ? "24-Hour Pass" : "7-Day Sprint";
  const planDuration = plan === "single_scan" ? "24 hours" : "7 days";

  useEffect(() => {
    if (!open) {
      setAutoCloseTimer(5);
      return;
    }

    const interval = setInterval(() => {
      setAutoCloseTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>

              {/* Success Animation Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-white"></div>

              {/* Animated Sparkles */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                />
              </div>

              {/* Content */}
              <div className="relative p-8 md:p-12 text-center space-y-6">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                    <div className="relative bg-emerald-500 rounded-full p-6">
                      <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </motion.div>

                {/* Main Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-tight">
                    Payment Successful!
                  </h2>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white font-bold text-lg">
                    <Sparkles className="w-5 h-5" />
                    Your {planName} is Active
                  </div>
                </motion.div>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4 pt-4"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-200">
                    <p className="text-lg text-[#0F172A] font-semibold mb-2">
                      ✨ Unlimited scans for the next {planDuration}
                    </p>
                    <p className="text-[#64748B] text-sm">
                      No stress, no double-charges, just results. Start optimizing your resume now!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                      onClick={onClose}
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8"
                    >
                      Start Scanning 🚀
                    </Button>
                    <p className="text-xs text-[#94A3B8]">
                      Auto-closing in {autoCloseTimer}s...
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
