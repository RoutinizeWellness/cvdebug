import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rocket, ArrowRight, Verified } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NewYearPromoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: () => void;
}

export function NewYearPromoModal({ open, onOpenChange, onUnlock }: NewYearPromoModalProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 0,
  });

  // Countdown timer
  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 border-0 bg-transparent overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[#F8FAFC]"></div>
          {/* Abstract Fireworks SVG Decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute top-[10%] left-[10%] w-64 h-64 rounded-full bg-[#3B82F6] blur-[100px] opacity-30"></div>
            <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-[#8B5CF6] blur-[100px] opacity-30"></div>
          </div>
        </div>

        {/* Main Glass Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative bg-[#FFFFFF] border border-[#E2E8F0]"
        >
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col items-center justify-center p-8 md:p-12">
            {/* Headline Section */}
            <div className="text-center w-full mb-2">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[#0F172A] tracking-tight text-4xl md:text-[40px] font-extrabold leading-[1.1] mb-2"
              >
                2026 is the year you get the job.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#3B82F6] text-lg md:text-xl font-medium tracking-wide uppercase"
              >
                Stop being invisible.
              </motion.p>
            </div>

            {/* Timer Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="py-8 w-full"
            >
              <div className="flex justify-center gap-3 md:gap-6 text-center">
                <TimerUnit value={timeLeft.days} label="Days" />
                <TimerUnit value={timeLeft.hours} label="Hours" />
                <TimerUnit value={timeLeft.minutes} label="Mins" />
                <TimerUnit value={timeLeft.seconds} label="Secs" />
              </div>
            </motion.div>

            {/* Offer Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full mb-8"
            >
              <div className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-[#F8FAFC] to-[#FFFFFF] p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B5CF6]/5 to-transparent skew-x-12 opacity-50"></div>
                <div
                  className="relative bg-cover bg-center flex flex-col items-center md:flex-row md:items-stretch rounded-lg overflow-hidden h-auto min-h-[160px]"
                  style={{
                    backgroundImage:
                      'linear-gradient(0deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBJyDg2fMlQkk7rMIap5JFRvVr2JY6arzmW76xe0DPrpordl7Vooi9AvDLYso2GjtEm3GY7ws8Mr5g9dt8DU9LaagHyFxqOHE7Pe3jQiPiF8U6BLgQncRwDOppO5QD_rHfH3S56kJ4yZizKAjhfURtRvjbepVn226UF7MZdzv4WXNSSUG96-AjENl9yjhQEEY4LwWVayipoxKq5gRD0G92abKox1G0aukDlBjxrxk1QKxx-GeBrj1zLrkn2HahhXt6ZZWHw5KXnpA")',
                  }}
                >
                  <div className="flex flex-col justify-center p-6 w-full text-center md:text-left">
                    <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-2">
                      <Rocket className="h-5 w-5 text-[#8B5CF6]" />
                      <span className="text-[#8B5CF6] font-bold tracking-wider text-sm uppercase">
                        New Year Pass
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-[#0F172A] text-3xl font-bold mb-1">$4.99</h3>
                        <p className="text-[#475569] text-sm font-medium leading-relaxed">
                          Includes 1 Full Resume Audit + Keyword Sniper tool access (Single Use).
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <Verified className="h-16 w-16 text-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUnlock}
              className="w-full group relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] p-[2px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            >
              <div className="relative flex h-14 w-full items-center justify-center rounded-[10px] bg-transparent px-8 transition-all group-hover:bg-white/10">
                <span className="text-[#FFFFFF] text-lg font-bold tracking-wide mr-2">
                  Unlock New Year Pass
                </span>
                <ArrowRight className="h-5 w-5 text-[#FFFFFF] transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>

            {/* Footer Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center px-4"
            >
              <p className="text-[#64748B] text-sm font-light leading-relaxed">
                $4.99 is an impulse fix—your robots see it instantly and so will recruiters.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Timer Unit Component
function TimerUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      >
        <p className="text-[#0F172A] text-2xl md:text-3xl font-bold font-mono">
          {String(value).padStart(2, "0")}
        </p>
      </motion.div>
      <p className="text-[#64748B] text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}
