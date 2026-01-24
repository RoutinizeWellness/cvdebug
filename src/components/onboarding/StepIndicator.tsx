import { motion } from "framer-motion";
import { Check, CloudUpload } from "lucide-react";
import type { OnboardingStep } from "./OnboardingLayout";

interface StepIndicatorProps {
  currentStep: OnboardingStep;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Role", icon: "completed" },
    { number: 2, label: "Upload", icon: "upload" },
    { number: 3, label: "Scan", icon: "pending" },
  ];

  const progressWidth = currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%";

  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-300 rounded-full -z-10" />

        {/* Active Progress */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#22C55E] to-[#10B981] rounded-full -z-10"
          initial={{ width: "0%" }}
          animate={{ width: progressWidth }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isPending = currentStep < step.number;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-all ${
                  isCompleted
                    ? "bg-gradient-to-br from-[#22C55E] to-[#10B981] border-2 border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : isActive
                    ? "bg-white border-2 border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : "bg-white border-2 border-slate-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute w-full h-full rounded-full bg-[#22C55E]/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : isActive && step.number === 2 ? (
                  <CloudUpload className="h-5 w-5 text-[#22C55E]" />
                ) : (
                  <span
                    className={`text-sm font-bold ${
                      isActive ? "text-[#22C55E]" : isPending ? "text-slate-400" : "text-white"
                    }`}
                  >
                    {step.number}
                  </span>
                )}
              </motion.div>

              <span
                className={`text-xs font-medium transition-colors ${
                  isCompleted || isActive ? "text-[#0F172A]" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
