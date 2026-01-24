import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ open, onOpenChange, onConfirm }: LogoutConfirmDialogProps) {
  const { t } = useI18n();

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-0 border-0 bg-transparent overflow-visible">
        {/* Crystalline Border Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-xl p-8 border border-primary/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Internal glow effects */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6 w-full text-center">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/30 border border-slate-700/50 shadow-[0_0_25px_rgba(100,116,139,0.15)]">
              <span className="material-symbols-outlined text-primary text-3xl">power_settings_new</span>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <h1 className="text-white text-2xl font-bold tracking-tight">
                {t.modals.logout.title}
              </h1>
              <p className="text-slate-400 text-sm font-normal leading-relaxed">
                {t.modals.logout.question}
              </p>
            </div>

            {/* Spacer */}
            <div className="h-1" />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Cancel Button */}
              <button
                onClick={() => onOpenChange(false)}
                className="group relative overflow-hidden rounded-xl border border-primary/30 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className="relative px-4 py-3">
                  <span className="text-slate-300 text-sm font-semibold tracking-wide group-hover:text-white transition-colors">
                    {t.modals.logout.stayButton}
                  </span>
                </div>
              </button>

              {/* Confirm Logout Button */}
              <button
                onClick={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
                className="group relative overflow-hidden rounded-xl shadow-lg shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                <div className="relative px-4 py-3 flex items-center justify-center gap-2">
                  <span className="text-white text-sm font-bold tracking-wide">{t.modals.logout.logoutButton}</span>
                  <span className="material-symbols-outlined text-white text-sm">logout</span>
                </div>
              </button>
            </div>

            {/* Footer hint */}
            <p className="text-xs text-slate-500 mt-2">
              Press{" "}
              <span className="bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700/50 font-mono text-[10px]">
                ESC
              </span>{" "}
              to close
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
