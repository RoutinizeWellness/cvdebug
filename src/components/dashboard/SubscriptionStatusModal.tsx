import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface SubscriptionStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export function SubscriptionStatusModal({ open, onOpenChange, onUpgrade }: SubscriptionStatusModalProps) {
  const user = useQuery(api.users.currentUser);

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onOpenChange]);

  if (!user) return null;

  const isFree = user.subscriptionTier === "free";
  const isPremium = user.subscriptionTier === "interview_sprint" || user.subscriptionTier === "single_scan";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 border-0 bg-transparent overflow-visible">
        {/* Confetti Decorations */}
        <div className="absolute -top-12 left-12 w-3 h-3 bg-primary rotate-45 opacity-40 animate-pulse" />
        <div className="absolute -top-8 right-16 w-2 h-2 rounded-full bg-secondary opacity-50" />
        <div className="absolute -bottom-8 left-20 w-4 h-1 bg-primary -rotate-12 opacity-30" />
        <div className="absolute -bottom-12 right-20 w-3 h-3 border border-secondary rotate-12 opacity-40" />
        <div className="absolute top-1/2 -left-12 w-2 h-2 bg-secondary rotate-45 opacity-30" />
        <div className="absolute bottom-8 -right-12 w-4 h-4 rounded-full border border-primary opacity-20" />

        {/* Crystalline Border Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-xl p-8 border border-primary/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] relative overflow-hidden"
        >
          {/* Internal glow effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-[60px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6 w-full text-center">
            {/* Header Icon & Badge */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl"
              >
                👋
              </motion.div>
              {isPremium && (
                <div className="inline-flex items-center px-3 py-1 rounded-full border border-secondary/50 bg-secondary/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                  <span className="text-xs font-bold tracking-wider text-secondary uppercase">Premium</span>
                </div>
              )}
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <h1 className="text-[#0F172A] text-3xl font-bold tracking-tight leading-tight">
                Welcome to CVDebug!
              </h1>
              <p className="text-[#64748B] text-base font-normal leading-relaxed">
                You are currently on the <span className="text-primary font-medium">{
                  user.subscriptionTier === "interview_sprint"
                    ? "interview sprint plan"
                    : user.subscriptionTier === "single_scan"
                    ? "single scan plan"
                    : "free plan"
                }</span>.
              </p>
            </div>

            {/* Feature check */}
            {isPremium ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFFFFF]/50 border border-[#E2E8F0]/50">
                <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
                <p className="text-[#475569] text-sm font-medium">You have full access to premium features!</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F59E0B]/10 border border-amber-500/20">
                <span className="material-symbols-outlined text-amber-400 text-xl">info</span>
                <p className="text-[#475569] text-sm font-medium">Upgrade to unlock all features</p>
              </div>
            )}

            {/* Spacer */}
            <div className="h-2" />

            {/* Action Button */}
            {isFree ? (
              <button
                onClick={onUpgrade}
                className="group/btn relative w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A] transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Gradient Border Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100" />

                {/* Button Content */}
                <div className="relative flex items-center justify-center gap-2 rounded-xl bg-[#FFFFFF]/40 backdrop-blur-sm px-6 py-3.5 h-full w-full transition-all group-hover/btn:bg-opacity-0">
                  <span className="text-[#0F172A] text-base font-bold tracking-wide">View Upgrade Options</span>
                  <span className="material-symbols-outlined text-[#0F172A] text-lg transition-transform group-hover/btn:translate-x-1">upgrade</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onOpenChange(false)}
                className="group/btn relative w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0F172A] transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Gradient Border Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-100" />

                {/* Button Content */}
                <div className="relative flex items-center justify-center gap-2 rounded-xl bg-[#FFFFFF]/40 backdrop-blur-sm px-6 py-3.5 h-full w-full transition-all group-hover/btn:bg-opacity-0">
                  <span className="text-[#0F172A] text-base font-bold tracking-wide">Continue to Dashboard</span>
                  <span className="material-symbols-outlined text-[#0F172A] text-lg transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                </div>
              </button>
            )}

            {/* Decorative footer text */}
            <p className="text-xs text-[#64748B] mt-2">
              Press <span className="bg-[#F8FAFC] px-1.5 py-0.5 rounded text-[#64748B] border border-[#E2E8F0]">ESC</span> to close
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
