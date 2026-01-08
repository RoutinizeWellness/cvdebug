import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Logo } from "@/components/Logo";
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
  Briefcase
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
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
import { CoverLetterGenerator } from "@/components/dashboard/tools/CoverLetterGenerator";
import { LinkedInOptimizer } from "@/components/dashboard/tools/LinkedInOptimizer";
import { BulletRewriter } from "@/components/dashboard/BulletRewriter";
import { MissionControl } from "@/components/dashboard/MissionControl";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { SprintProgressBar } from "@/components/dashboard/SprintProgressBar";
import { SubscriptionStatusModal } from "@/components/dashboard/SubscriptionStatusModal";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";
import { ResumePreview } from "@/components/resume/ResumePreview";

const apiAny = api as any;

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPricing, setShowPricing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("mission");
  const [selectedProject, setSelectedProject] = useState<Id<"projects"> | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<Id<"resumes"> | null>(null);
  const [preSelectedApplicationId, setPreSelectedApplicationId] = useState<string | undefined>(undefined);
  const [initialApplicationId, setInitialApplicationId] = useState<string | null>(null);

  const currentUser = useQuery(apiAny.users.currentUser);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
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
          toast.error("Payment recorded but credit update failed. Please contact support.");
          processedPaymentRef.current = false;
        })
        .finally(() => {
          setIsProcessingPayment(false);
        });
    } else if (payment === "cancelled") {
      toast.info("Payment cancelled.");
      setSearchParams({});
      navigate("/dashboard", { replace: true });
    } else if (plan === "single_scan" || plan === "interview_sprint") {
      setInitialPlan(plan as "single_scan" | "interview_sprint");
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
          <div className="space-y-6 pb-24 md:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Master CVs</h1>
                <p className="text-slate-400 text-sm mt-1">Your base resume templates</p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 text-white font-bold"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New CV
              </Button>
            </div>
            <ResumeGrid
              resumes={resumes || []}
              setSelectedResume={(resume) => setSelectedResumeId(resume._id)}
              handleDelete={handleDelete}
              onUpload={() => fileInputRef.current?.click()}
              onCreateManual={handleCreateManualResume}
            />
          </div>
        );
      case 'tools':
        return (
          <div className="space-y-6 pb-24 md:pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">AI Tools</h1>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setCurrentView('bullet-rewriter')}
                className="p-6 rounded-2xl bg-gradient-to-br from-secondary/10 to-pink-500/10 border-2 border-secondary/30 text-left hover:border-secondary/60 transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-2">AI Bullet Rewriter</h3>
                <p className="text-sm text-slate-400">Transform weak bullets into impact-driven achievements using Google XYZ formula</p>
              </button>
              <button
                onClick={() => setCurrentView('cover-letter')}
                className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/30 text-left hover:border-primary/60 transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-2">Cover Letter Generator</h3>
                <p className="text-sm text-slate-400">AI-powered cover letters with keyword optimization</p>
              </button>
              <button
                onClick={() => setCurrentView('linkedin')}
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 text-left hover:border-blue-500/60 transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-2">LinkedIn Optimizer</h3>
                <p className="text-sm text-slate-400">Optimize your profile for recruiters</p>
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6 pb-24 md:pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Credits</h3>
                  <span className="text-2xl font-black text-primary">
                    {currentUser?.credits || 0}
                  </span>
                </div>
                <Button 
                  onClick={() => setShowPricing(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
                >
                  Buy More Credits
                </Button>
              </div>
              {currentUser?.sprintExpiresAt && (
                <SprintProgressBar />
              )}
            </div>
          </div>
        );
      case 'templates':
        return <TemplatesView />;
      case 'linkedin':
        return <LinkedInOptimizer onUpgrade={handleUpgrade} />;
      case 'cover-letter':
        return <CoverLetterGenerator initialApplicationId={preSelectedApplicationId} onUpgrade={handleUpgrade} />;
      case 'bullet-rewriter':
        return <BulletRewriter />;
      case 'writing-forge':
        return <WritingForge />;
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
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
    <div className="flex h-screen bg-slate-900 text-white font-sans selection:bg-primary/30">
      <Sidebar 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter}
        setShowPricing={setShowPricing}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <main 
        className="flex-1 flex flex-col overflow-hidden relative bg-slate-900 pb-20 md:pb-0"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setShowPricing(true)}>
            <Sparkles className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <div
          className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8"
        >
          <div className="max-w-[1600px] mx-auto h-full space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 p-6 md:p-8 shadow-[0_0_60px_rgba(251,191,36,0.15)]">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.4),transparent_50%)]" />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-amber-200">
                    New Year Resolution Hack
                  </p>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    2026 is the year you get the job. Stop being invisible.
                  </h2>
                  <p className="text-base md:text-lg text-amber-100/80">
                    New Year Pass: $4.99 for 1 Full Audit + Keyword Sniper (Single Use).
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setInitialPlan("single_scan");
                    setShowPricing(true);
                  }}
                  className="relative z-10 bg-amber-400 text-slate-900 font-black px-6 py-4 rounded-2xl shadow-lg shadow-amber-500/40 hover:bg-amber-300 transition-all"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Unlock New Year Pass
                </Button>
              </div>
              <p className="relative mt-4 text-sm text-amber-100/70">
                $4.99 is an impulse fix—your robots see it instantly and so will recruiters.
              </p>
            </div>
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
      />

      {showResumeBuilder && (
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
      )}

      {previewResumeId && resumes && (
        <ResumePreview
          resume={resumes.find((r: any) => r._id === previewResumeId)}
          onClose={() => setPreviewResumeId(null)}
          onEdit={() => {
            setPreviewResumeId(null);
            handleEditResume(previewResumeId);
          }}
        />
      )}
    </div>
  );
}