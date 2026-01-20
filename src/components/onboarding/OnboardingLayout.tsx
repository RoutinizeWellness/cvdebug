import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import StepIndicator from "./StepIndicator";
import RoleSelection from "./RoleSelection";
import CVUpload from "./CVUpload";
import ScanPreview from "./ScanPreview";
import { Logo } from "@/components/Logo";

export type OnboardingStep = 1 | 2 | 3;

interface OnboardingLayoutProps {
  initialStep?: OnboardingStep;
  onComplete?: () => void;
}

export default function OnboardingLayout({
  initialStep = 1,
  onComplete,
}: OnboardingLayoutProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [selectedRole, setSelectedRole] = useState<string | null>("software");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep);
    }
  };

  const handleEditStep = (step: OnboardingStep) => {
    setCurrentStep(step);
  };

  // Simulate scan progress when reaching step 3
  useEffect(() => {
    if (currentStep === 3 && uploadedFile) {
      setScanProgress(5); // Start at 5%

      // Simulate progress: 5% -> 25% -> 50% -> 75% -> 100%
      const intervals = [
        { delay: 500, progress: 25 },
        { delay: 1500, progress: 50 },
        { delay: 2500, progress: 75 },
        { delay: 3500, progress: 100 },
      ];

      const timeouts: NodeJS.Timeout[] = [];

      intervals.forEach(({ delay, progress }) => {
        const timeout = setTimeout(() => {
          setScanProgress(progress);
        }, delay);
        timeouts.push(timeout);
      });

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [currentStep, uploadedFile]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start py-10 px-4 sm:px-6 lg:px-8">
      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-10">
        <Logo showText={true} />
        <button
          onClick={() => window.open('mailto:support@cvdebug.com?subject=Help%20Request', '_blank')}
          className="text-sm text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC]"
        >
          <HelpCircle className="h-4 w-4" />
          Help Center
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col gap-8">
        {/* Progress Stepper */}
        <StepIndicator currentStep={currentStep} />

        {/* Content Area */}
        <div className="w-full flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Role Selection */}
            {currentStep >= 1 && (
              <RoleSelection
                isCompleted={currentStep > 1}
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
                onEdit={() => handleEditStep(1)}
                onNext={handleNext}
              />
            )}

            {/* Step 2: CV Upload */}
            {currentStep >= 2 && (
              <CVUpload
                isActive={currentStep === 2}
                uploadedFile={uploadedFile}
                onFileUpload={handleFileUpload}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}

            {/* Step 3: Scan Preview */}
            {currentStep >= 3 && (
              <ScanPreview
                isActive={currentStep === 3}
                progress={uploadedFile ? scanProgress : 0}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
