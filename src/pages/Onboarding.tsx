import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { ProgressTimeline } from "@/components/onboarding/ProgressTimeline";
import { StepUploadCV } from "@/components/onboarding/StepUploadCV";
import { StepTargetJob } from "@/components/onboarding/StepTargetJob";
import { StepScanning } from "@/components/onboarding/StepScanning";
import { Id } from "@/convex/_generated/dataModel";

const apiAny = api as any;

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeId, setResumeId] = useState<Id<"resumes"> | null>(null);
  const [targetCompany, setTargetCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const createProject = useMutation(apiAny.projects.createProject);
  const resume = useQuery(apiAny.resumes.getResumeInternal, resumeId ? { id: resumeId } : "skip");

  const handleResumeComplete = (uploadedResumeId: string) => {
    setResumeId(uploadedResumeId as Id<"resumes">);
    toast.success("Resume uploaded successfully! Moving to next step...");
    setTimeout(() => setCurrentStep(2), 1000);
  };

  const handleInitializeScan = async () => {
    if (!targetCompany || !jobDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!resumeId) {
      toast.error("Please upload a resume first");
      return;
    }

    setCurrentStep(3);

    try {
      const projectId = await createProject({
        name: `${targetCompany} Application`,
        targetRole: targetCompany,
        description: jobDescription.substring(0, 200),
        masterCvId: resumeId,
      });

      toast.success("Project created! Waiting for AI analysis...");
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to initialize scan");
      return;
    }
  };

  // Monitor resume analysis completion
  useEffect(() => {
    if (currentStep === 3 && resume) {
      if (resume.status === "completed") {
        toast.success("Analysis complete! Redirecting to dashboard...");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else if (resume.status === "failed") {
        toast.error("Analysis failed. Please try again.");
        setCurrentStep(1);
        setResumeId(null);
      }
    }
  }, [resume, currentStep, navigate]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-secondary/30">
      <OnboardingHeader />

      <main className="flex-grow flex flex-col items-center justify-start py-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-5xl flex flex-col gap-12 relative z-10">
          <div className="text-center space-y-2 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              First Mission Onboarding
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Configure your profile to initiate your first AI-driven career debug session.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <ProgressTimeline currentStep={currentStep} />

            <div className="lg:col-span-2 flex flex-col gap-10">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <StepUploadCV 
                    onComplete={handleResumeComplete}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                  />
                )}

                {currentStep === 2 && (
                  <StepTargetJob
                    targetCompany={targetCompany}
                    setTargetCompany={setTargetCompany}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    onBack={() => setCurrentStep(1)}
                    onNext={handleInitializeScan}
                  />
                )}

                {currentStep === 3 && <StepScanning />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}