import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
        <button className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
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
                progress={uploadedFile ? 5 : 0}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
