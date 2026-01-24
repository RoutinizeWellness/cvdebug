import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, CheckCircle2, Upload, Cpu, Wand2, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string; // CSS selector for highlighting
  position: "center" | "top" | "bottom" | "left" | "right";
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to the Visibility Debugger",
    description: "We're not a resume builder. We're a diagnostic tool that shows you exactly why ATS robots reject your CV. Let's fix that in 3 steps.",
    icon: <Cpu className="h-12 w-12 text-[#22C55E]" />,
    position: "center",
  },
  {
    id: "upload",
    title: "Step 1: Upload Your CV",
    description: "Drop your current resume here. We'll scan it like a real ATS robot and show you the brutal truth in 10 seconds.",
    icon: <Upload className="h-10 w-10 text-[#64748B]" />,
    target: "[data-onboarding='upload-button']",
    position: "bottom",
  },
  {
    id: "robot-view",
    title: "Step 2: See the Robot View",
    description: "This is your secret weapon. The 'Robot View' shows exactly what ATS systems extract from your PDF. Most resumes lose 40% of content here.",
    icon: <Cpu className="h-10 w-10 text-[#22C55E]" />,
    position: "center",
  },
  {
    id: "fix",
    title: "Step 3: Fix Critical Errors",
    description: "Red alerts = auto-reject by ATS. We'll show you exactly what to add (metrics, keywords, sections). No guessing.",
    icon: <Wand2 className="h-10 w-10 text-[#F59E0B]" />,
    position: "center",
  },
  {
    id: "ready",
    title: "That's It. No Fluff.",
    description: "You'll get a score (0-100), see what's broken, and fix it. Most users go from 35% to 90% in one session. Ready?",
    icon: <CheckCircle2 className="h-12 w-12 text-[#22C55E]" />,
    position: "center",
  },
];

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    console.log('[OnboardingTour] Next clicked, current step:', currentStep, 'isLastStep:', isLastStep);
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    console.log('[OnboardingTour] Complete called, hiding tour');
    setIsVisible(false);
    setTimeout(() => {
      console.log('[OnboardingTour] Calling onComplete callback');
      onComplete();
    }, 300);
  };

  const handleSkipNow = () => {
    console.log('[OnboardingTour] Skip called, hiding tour');
    setIsVisible(false);
    setTimeout(() => {
      console.log('[OnboardingTour] Calling onSkip callback');
      onSkip();
    }, 300);
  };

  // Spotlight effect for target elements
  useEffect(() => {
    if (currentStepData.target) {
      const element = document.querySelector(currentStepData.target);
      if (element) {
        element.classList.add("onboarding-spotlight");
        return () => {
          element.classList.remove("onboarding-spotlight");
        };
      }
    }
  }, [currentStepData.target]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[100] backdrop-blur-sm"
            onClick={handleSkipNow}
          />

          {/* Tour Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0F172A] border-4 border-[#22C55E] rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#22C55E] to-[#10B981] p-6 relative">
                <button
                  onClick={handleSkipNow}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    {currentStepData.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white/80 text-xs font-mono uppercase tracking-wider mb-1">
                      Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </div>
                    <h3 className="text-white font-black text-xl">
                      {currentStepData.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-[#0F172A]">
                <p className="text-gray-300 text-base leading-relaxed mb-6">
                  {currentStepData.description}
                </p>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  {ONBOARDING_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentStep
                          ? "w-8 bg-[#22C55E]"
                          : idx < currentStep
                          ? "w-2 bg-[#22C55E]/50"
                          : "w-2 bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleSkipNow}
                    className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    Skip Tour
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-[#22C55E] to-[#10B981] hover:opacity-90 text-white font-bold shadow-lg"
                  >
                    {isLastStep ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Let's Go
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="bg-black/40 border-t border-[#22C55E]/20 px-6 py-3">
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                  <span className="text-[#22C55E]">▸</span>
                  <span>VISIBILITY_DEBUGGER_v2.0</span>
                  <span className="text-gray-600">|</span>
                  <span>NO_FLUFF_MODE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      // Small delay to let the page load first
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
    }
  }, []);

  const completeOnboarding = () => {
    console.log('[useOnboarding] completeOnboarding called, setting localStorage');
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    console.log('[useOnboarding] localStorage set:', localStorage.getItem("onboarding_completed"));
  };

  const skipOnboarding = () => {
    console.log('[useOnboarding] skipOnboarding called, setting localStorage');
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    console.log('[useOnboarding] localStorage set:', localStorage.getItem("onboarding_completed"));
  };

  const resetOnboarding = () => {
    localStorage.removeItem("onboarding_completed");
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
}
