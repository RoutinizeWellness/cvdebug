import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/contexts/I18nContext";
import { usePresetSEO } from "@/hooks/useIntelligentSEO";
import {
  Loader2,
  Upload,
  FileUp,
  Plus,
  Sparkles,
  CheckCircle2,
  X,
  Eye,
  Trash2,
  FileText,
  File,
  Target,
  Settings,
  CreditCard,
  FolderOpen,
  LayoutTemplate,
  Briefcase,
  Lock
} from "lucide-react";
import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { PricingDialog } from "@/components/PricingDialog";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { JobTrackerView } from "@/components/dashboard/JobTrackerView";
import { ProjectsView } from "@/components/dashboard/ProjectsView";
import { ProcessingOverlay } from "@/components/dashboard/ProcessingOverlay";
import { ResumeDetailDialog } from "@/components/dashboard/ResumeDetailDialog";
import { ResumeGrid } from "@/components/dashboard/ResumeGrid";
import { ProjectBoard } from "@/components/dashboard/ProjectBoard";
import { TemplatesView, LinkedInView, CoverLetterView, WritingForge } from "@/components/dashboard/ToolsViews";
import { KeywordSniperView } from "@/components/dashboard/KeywordSniperView";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { SubscriptionView } from "@/components/dashboard/SubscriptionView";
import { NewYearPromoModal } from "@/components/NewYearPromoModal";
import { PaymentSuccessModal } from "@/components/PaymentSuccessModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { useResumeUpload } from "@/hooks/use-resume-upload";
import { CreditsExhaustedModal } from "@/components/dashboard/CreditsExhaustedModal";
import { MissionControl } from "@/components/dashboard/MissionControl";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { SprintProgressBar } from "@/components/dashboard/SprintProgressBar";
import { SubscriptionStatusModal } from "@/components/dashboard/SubscriptionStatusModal";
import { OnboardingTour, useOnboarding } from "@/components/dashboard/OnboardingTour";
import { EcosystemPrompts } from "@/components/dashboard/EcosystemPrompts";
import { ActivityReminderBanner } from "@/components/dashboard/ActivityReminderBanner";
import { useActivityReminder } from "@/hooks/use-activity-reminder";
import { PlanExpirationModal } from "@/components/dashboard/PlanExpirationModal";
import { usePlanExpiration } from "@/hooks/use-plan-expiration";
import { ExperienceLevelOnboarding } from "@/components/onboarding/ExperienceLevelOnboarding";
import { CVVersionAnalytics } from "@/components/dashboard/CVVersionAnalytics"; // IMPORTED

// Lazy load heavy components for better performance
const ResumeBuilder = lazy(() => import("@/components/resume/ResumeBuilder").then(m => ({ default: m.ResumeBuilder })));
const ResumePreview = lazy(() => import("@/components/resume/ResumePreview").then(m => ({ default: m.ResumePreview })));
const BulletRewriter = lazy(() => import("@/components/dashboard/BulletRewriter").then(m => ({ default: m.BulletRewriter }))); // Reimplemented with ML
const CoverLetterGenerator = lazy(() => import("@/components/dashboard/tools/CoverLetterGenerator").then(m => ({ default: m.CoverLetterGenerator })));
const LinkedInOptimizer = lazy(() => import("@/components/dashboard/tools/LinkedInOptimizer").then(m => ({ default: m.LinkedInOptimizer })));
const EliteMatchToolLazy = lazy(() => import("@/components/dashboard/EliteMatchTool").then(m => ({ default: m.EliteMatchTool })));

const apiAny = api as any;

export default function Dashboard() {
  // Intelligent SEO for dashboard
  usePresetSEO('dashboard');

  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPricing, setShowPricing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("mission");
  const [selectedProject, setSelectedProject] = useState<Id<"projects"> | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<Id<"resumes"> | null>(null);
  const [writingForgeResumeId, setWritingForgeResumeId] = useState<Id<"resumes"> | null>(null);
  const [preSelectedApplicationId, setPreSelectedApplicationId] = useState<string | undefined>(undefined);
  const [initialApplicationId, setInitialApplicationId] = useState<string | null>(null);

  const currentUser = useQuery(apiAny.users.currentUser);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSuccessPlan, setPaymentSuccessPlan] = useState<"single_scan" | "interview_sprint">("single_scan");
  const [initialPlan, setInitialPlan] = useState<"single_scan" | "interview_sprint" | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingResumeId, setPendingResumeId] = useState<string | null>(null);
  const [targetedScanEnabled, setTargetedScanEnabled] = useState(false);
  const [showCreditsExhausted, setShowCreditsExhausted] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [lastScannedScore, setLastScannedScore] = useState<number | undefined>();
  const processedPaymentRef = useRef(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState<Id<"resumes"> | null>(null);
  const [previewResumeId, setPreviewResumeId] = useState<Id<"resumes"> | null>(null);
  const [showNewYearPromo, setShowNewYearPromo] = useState(false);

  // Onboarding Tour
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  // Plan Expiration Check
  const { shouldShowPopup: shouldShowExpirationPopup, tier: expiredTier, reason: expirationReason } = usePlanExpiration();
  const [showExpirationModal, setShowExpirationModal] = useState(false);

  useEffect(() => {
    if (shouldShowExpirationPopup && expiredTier) {
      setShowExpirationModal(true);
    }
  }, [shouldShowExpirationPopup, expiredTier]);

  // Experience Level Onboarding
  const [showExperienceOnboarding, setShowExperienceOnboarding] = useState(false);

  useEffect(() => {
    // Show experience level onboarding ONLY AFTER main tour is complete
    // AND user doesn't have experience level set
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    const experienceOnboardingCompleted = localStorage.getItem("experience_onboarding_completed");

    // Only show if: tour is done, experience level not set, experience onboarding not completed, and tour is not currently showing
    if (currentUser && !currentUser.experienceLevel && onboardingCompleted === "true" && !showOnboarding && !experienceOnboardingCompleted) {
      const timer = setTimeout(() => {
        setShowExperienceOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, showOnboarding]);

  const {
    isUploading,
    isDragging,
    processingResumeId,
    setProcessingResumeId,
    processingStatus,
    fileInputRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useResumeUpload(jobDescription, setJobDescription);

  const storeUser = useMutation(apiAny.users.storeUser);
  const purchaseCredits = useMutation(apiAny.users.purchaseCredits);
  const deleteResume = useMutation(apiAny.resumes.deleteResume);

  const resumes = useQuery(apiAny.resumes.getResumes, {
    category: categoryFilter || undefined
  });

  // Activity Reminder - must be after resumes query
  const { showReminderBanner, daysSinceActive, dismissReminder } = useActivityReminder(
    user?.id,
    resumes && resumes.length > 0 ? resumes[0].score : undefined
  );

  useEffect(() => {
    if (currentUser && !isLoading) {
      const hasSeenModal = localStorage.getItem("hasSeenSubscriptionModal");
      if (!hasSeenModal) {
        setShowSubscriptionModal(true);
        localStorage.setItem("hasSeenSubscriptionModal", "true");
      }
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentSearch = window.location.search;
      navigate(`/auth${currentSearch}`);
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      storeUser();
    }
  }, [isAuthenticated, storeUser]);

  useEffect(() => {
    if (isLoading) return;

    const plan = searchParams.get("plan");
    const payment = searchParams.get("payment");
    const resumeId = searchParams.get("resumeId");
    const projectId = searchParams.get("projectId");
    const applicationId = searchParams.get("applicationId");
    const fromPreview = searchParams.get("from") === "preview";

    // Handle preview conversion: auto-upload CV from preview
    if (fromPreview && isAuthenticated) {
      const previewData = sessionStorage.getItem("previewData");
      if (previewData) {
        try {
          const { text, fileName, timestamp } = JSON.parse(previewData);
          // Check if data is recent (within 10 minutes)
          if (Date.now() - timestamp < 600000) {
            toast.success("Welcome! Uploading your resume from preview...");
            // Create a fake file object to trigger upload
            const blob = new Blob([text], { type: "text/plain" });
            const file = new (File as any)([blob], fileName || "preview-resume.txt", { type: "text/plain" });

            // Trigger upload automatically
            setTimeout(() => {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
                fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
              }
            }, 1000);
          }
          sessionStorage.removeItem("previewData");
        } catch (error) {
          console.error("Failed to restore preview data:", error);
        }
      }
      // Remove from param to avoid re-triggering
      setSearchParams(params => {
        params.delete("from");
        return params;
      });
    }

    if (projectId && !selectedProject) {
      setSelectedProject(projectId as Id<"projects">);
      setCurrentView("projects");
    }

    if (applicationId) {
      setInitialApplicationId(applicationId);
    }

    if (payment === "success" && (plan === "single_scan" || plan === "interview_sprint")) {
      if (processedPaymentRef.current) return;
      if (!isAuthenticated) return;

      processedPaymentRef.current = true;
      setIsProcessingPayment(true);

      storeUser()
        .then(() => {
          return purchaseCredits({ plan: plan as "single_scan" | "interview_sprint" });
        })
        .then(() => {
          setPaymentSuccessPlan(plan as "single_scan" | "interview_sprint");
          if (resumeId) {
            setPendingResumeId(resumeId);
            toast.success("Payment successful! Unlocking your resume report...");
          } else {
            setShowPaymentSuccess(true);
          }
          setSearchParams({});
          navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
          console.error("Credit update failed:", error);
          toast.error("Payment recorded but credit update failed. Please contact support at cvdebug@outlook.com");
          processedPaymentRef.current = false;
        })
        .finally(() => {
          setIsProcessingPayment(false);
        });
    } else if (payment === "cancelled") {
      toast.info("Payment cancelled.");
      setSearchParams({});
      navigate("/dashboard", { replace: true });
    } else if (plan === "single_scan" || plan === "interview_sprint" || plan === "single_debug_fix" || plan === "sprint_7day") {
      const normalizedPlan = plan === "sprint_7day" ? "interview_sprint" : plan;
      setInitialPlan(normalizedPlan as any);
      setShowPricing(true);
    }
  }, [searchParams, purchaseCredits, navigate, setSearchParams, isLoading, isAuthenticated, storeUser]);

  const processingResume = resumes?.find((r: any) =>
    r._id === processingResumeId &&
    (r.status === "processing" || (!r.status && (!r.score || r.score === 0)))
  );

  useEffect(() => {
    if (processingResumeId && resumes) {
      const resume = resumes.find((r: any) => r._id === processingResumeId);

      if (!resume) {
        setProcessingResumeId(null);
        return;
      }

      if (resume.status === "failed") {
        toast.error("Resume analysis failed. Please try again.");
        setProcessingResumeId(null);
      } else if (resume.status === "completed") {
        setProcessingResumeId(null);
      } else if (!resume.status && resume.score > 0) {
        setProcessingResumeId(null);
      }
    }
  }, [resumes, processingResumeId, setProcessingResumeId]);

  useEffect(() => {
    if (pendingResumeId && resumes && currentUser) {
      const resume = resumes.find((r: any) => r._id === pendingResumeId);
      if (resume) {
        setSelectedResumeId(resume._id);
        setPendingResumeId(null);
        toast.success("🎉 Resume report unlocked! Your credits have been applied.");
      }
    }
  }, [pendingResumeId, resumes, currentUser]);

  const handleDelete = async (id: any) => {
    try {
      await deleteResume({ id });
      toast.success("Resume deleted");
      if (selectedResumeId === id) setSelectedResumeId(null);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleGenerateCoverLetter = (applicationId: string) => {
    setPreSelectedApplicationId(applicationId);
    setCurrentView("cover-letter");
  };

  const handleNavigate = (view: string) => {
    if (view === "pricing") {
      setShowPricing(true);
    } else {
      setCurrentView(view);
    }
  };

  const handleUpgrade = () => {
    setShowPricing(true);
  };

  const handleCreateManualResume = () => {
    setEditingResumeId(null);
    setShowResumeBuilder(true);
  };

  const handleEditResume = (resumeId: Id<"resumes">) => {
    setEditingResumeId(resumeId);
    setShowResumeBuilder(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'mission':
        return (
          <MissionControl
            onNavigate={handleNavigate}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onUpload={() => fileInputRef.current?.click()}
          />
        );
      case 'master-cvs':
        return (
          <div className="space-y-8 pb-24 md:pb-6">
            <ResumeGrid
              resumes={resumes || []}
              setSelectedResume={(resume) => setSelectedResumeId(resume._id)}
              handleDelete={handleDelete}
              onUpload={() => fileInputRef.current?.click()}
              onCreateManual={handleCreateManualResume}
            />
          </div>
        );
      case 'match':
        return (
          <div className="space-y-8 pb-24 md:pb-6">
            <Suspense fallback={<div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
              <EliteMatchToolLazy onUpgrade={handleUpgrade} />
            </Suspense>
          </div>
        );
      case 'tools':
        // Check if user has Career Sprint for lock icons
        const hasCareerSprint =
          currentUser?.subscriptionTier === "interview_sprint" &&
          (currentUser?.sprintExpiresAt ? currentUser.sprintExpiresAt > Date.now() : true);

        return (
          <div className="space-y-8 pb-24 md:pb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <span className="bg-[#1E293B] w-1.5 h-6 rounded-full inline-block"></span>
                {t.dashboard.tools}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Bullet Rewriter */}
                <button
                  onClick={() => setCurrentView('bullet-rewriter')}
                  className="group relative bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 transition-all duration-300 hover:border-slate-700 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-[#1E293B] group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">auto_fix_high</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1 group-hover:text-[#1E293B] transition-colors flex items-center gap-2">
                        {t.dashboard.bulletRewriter}
                        {!hasCareerSprint && <Lock className="h-4 w-4 text-slate-400" />}
                      </h3>
                      <p className="text-[#64748B] text-sm">{t.dashboard.bulletRewriterDesc}</p>
                    </div>
                  </div>
                </button>

                {/* Keyword Sniper Tool - Featured */}
                <button
                  onClick={() => setCurrentView('keyword-sniper')}
                  className="group relative bg-[#FFFFFF] border border-orange-200 rounded-xl p-6 transition-all duration-300 hover:border-orange-400 hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] text-orange-600 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">track_changes</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1 flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                        {t.dashboard.keywordSniper}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wide">
                          {t.dashboard.featured}
                        </span>
                        {!hasCareerSprint && <Lock className="h-4 w-4 text-slate-400" />}
                      </h3>
                      <p className="text-[#64748B] text-sm">{t.dashboard.keywordSniperDesc}</p>
                    </div>
                  </div>
                </button>

                {/* Cover Letter Generator */}
                <button
                  onClick={() => setCurrentView('cover-letter')}
                  className="group relative bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-[0_8px_30px_rgba(168,85,247,0.1)] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center flex-shrink-0 text-[#334155] group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1 group-hover:text-[#334155] transition-colors flex items-center gap-2">
                        {t.dashboard.coverLetterGen}
                        {!hasCareerSprint && <Lock className="h-4 w-4 text-slate-400" />}
                      </h3>
                      <p className="text-[#64748B] text-sm">{t.dashboard.coverLetterGenDesc}</p>
                    </div>
                  </div>
                </button>

                {/* LinkedIn Optimizer */}
                <button
                  onClick={() => setCurrentView('linkedin')}
                  className="group relative bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 transition-all duration-300 hover:border-[#64748B] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 text-[#475569] group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-[#0F172A] mb-1 group-hover:text-[#475569] transition-colors flex items-center gap-2">
                        {t.dashboard.linkedinOptimizer}
                        {!hasCareerSprint && <Lock className="h-4 w-4 text-slate-400" />}
                      </h3>
                      <p className="text-[#64748B] text-sm">{t.dashboard.linkedinOptimizerDesc}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-8 pb-24 md:pb-6">
            {user?.id && <CVVersionAnalytics userId={user.id} />}
          </div>
        );
      case 'applications':
        return (
          <div className="space-y-8 pb-24 md:pb-6">
            <JobTrackerView />
          </div>
        );
      case 'settings':
        return <SettingsView onOpenPricing={() => setShowPricing(true)} />;
      case 'linkedin':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <LinkedInOptimizer onUpgrade={handleUpgrade} />
          </Suspense>
        );
      case 'cover-letter':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <CoverLetterGenerator initialApplicationId={preSelectedApplicationId} onUpgrade={handleUpgrade} />
          </Suspense>
        );
      case 'bullet-rewriter':
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <BulletRewriter onUpgrade={handleUpgrade} />
          </Suspense>
        );
      case 'writing-forge':
        return <WritingForge resumeId={writingForgeResumeId} onUpgrade={handleUpgrade} />;
      case 'keyword-sniper':
        return <KeywordSniperView onBack={() => setCurrentView('tools')} onUpgrade={handleUpgrade} setCurrentView={setCurrentView} />;
      case 'projects':
        if (selectedProject) {
          return (
            <ProjectBoard
              projectId={selectedProject}
              onBack={() => {
                setSelectedProject(null);
                setSearchParams(params => {
                  params.delete("projectId");
                  params.delete("applicationId");
                  return params;
                });
              }}
              onGenerateCoverLetter={handleGenerateCoverLetter}
              initialApplicationId={initialApplicationId}
              onUpgrade={handleUpgrade}
            />
          );
        }
        return (
          <ProjectsView
            onSelectProject={(id: Id<"projects">) => {
              setSelectedProject(id);
              setSearchParams(params => {
                params.set("projectId", id);
                return params;
              });
            }}
          />
        );
      default:
        return (
          <MissionControl
            onNavigate={handleNavigate}
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onUpload={() => fileInputRef.current?.click()}
          />
        );
    }
  };

  if (isLoading || currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-8 w-8 text-[#1E293B] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (currentUser === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 flex-col gap-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-slate-400">Setting up your workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#1E293B] selection:text-white overflow-hidden">
      <Sidebar
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        setShowPricing={setShowPricing}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main
        className="flex-1 flex flex-col relative overflow-hidden bg-[#F8FAFC]/50 pb-20 md:pb-0"
        style={{ paddingBottom: 'max(5rem, env(safe-area-inset-bottom))' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Gradient blur effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E2E8F0]/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#CBD5E1]/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative z-10">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setShowPricing(true)}>
            <Sparkles className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            {renderContent()}
          </div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">Drop your resume here</h3>
            </div>
          </div>
        )}
      </main>

      <MobileTabBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onUpload={() => fileInputRef.current?.click()}
      />

      <PricingDialog
        open={showPricing}
        onOpenChange={setShowPricing}
        initialPlan={initialPlan}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.docx,.doc,image/jpeg,image/png,image/webp"
        onChange={handleFileUpload}
      />

      {(isUploading || !!processingResumeId || isProcessingPayment) && (
        <ProcessingOverlay
          isUploading={isUploading}
          isProcessing={!!processingResumeId || isProcessingPayment}
          statusMessage={processingStatus}
        />
      )}

      <ResumeDetailDialog
        resumeId={selectedResumeId}
        onClose={() => setSelectedResumeId(null)}
        onDelete={handleDelete}
        onOpenWritingForge={() => {
          setWritingForgeResumeId(selectedResumeId);
          setSelectedResumeId(null);
          setCurrentView('writing-forge');
        }}
        onOpenKeywordSniper={() => {
          setSelectedResumeId(null);
          setCurrentView('keyword-sniper');
        }}
        onOpenLinkedIn={() => {
          setSelectedResumeId(null);
          setCurrentView('linkedin');
        }}
      />

      <CreditsExhaustedModal
        open={showCreditsExhausted}
        onOpenChange={setShowCreditsExhausted}
        onUpgrade={() => {
          setShowCreditsExhausted(false);
          setShowPricing(true);
        }}
      />

      <SubscriptionStatusModal
        open={showSubscriptionModal}
        onOpenChange={setShowSubscriptionModal}
        onUpgrade={() => {
          setShowSubscriptionModal(false);
          setShowPricing(true);
        }}
        currentScore={resumes?.[0]?.score}
      />

      {showResumeBuilder && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        }>
          <ResumeBuilder
            resumeId={editingResumeId}
            onClose={() => {
              setShowResumeBuilder(false);
              setEditingResumeId(null);
            }}
            onSave={() => {
              // Refetch resumes is automatic with Convex
            }}
          />
        </Suspense>
      )}

      {previewResumeId && resumes && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        }>
          <ResumePreview
            resumeId={previewResumeId}
            onClose={() => setPreviewResumeId(null)}
            onEdit={() => {
              setPreviewResumeId(null);
              setEditingResumeId(previewResumeId);
              setShowResumeBuilder(true);
            }}
          />
        </Suspense>
      )}

      <NewYearPromoModal
        open={showNewYearPromo}
        onOpenChange={setShowNewYearPromo}
        onUpgrade={() => {
          setShowNewYearPromo(false);
          setShowPricing(true);
        }}
      />

      <PlanExpirationModal
        open={showExpirationModal}
        onOpenChange={setShowExpirationModal}
        onUpgrade={() => {
          setShowExpirationModal(false);
          setShowPricing(true);
        }}
        tier={expiredTier}
        reason={expirationReason}
      />

      {showExperienceOnboarding && (
        <ExperienceLevelOnboarding
          open={showExperienceOnboarding}
          onOpenChange={setShowExperienceOnboarding}
          onComplete={() => {
            setShowExperienceOnboarding(false);
            localStorage.setItem("experience_onboarding_completed", "true");
          }}
        />
      )}

      {/* Onboarding Tour */}
      <OnboardingTour
        open={showOnboarding}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
      />

      {/* Ecosystem Prompts */}
      <EcosystemPrompts
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {showPaymentSuccess && (
        <PaymentSuccessModal
          open={showPaymentSuccess}
          onOpenChange={setShowPaymentSuccess}
          plan={paymentSuccessPlan}
        />
      )}
    </div>
  );
}