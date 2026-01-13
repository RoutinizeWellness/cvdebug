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
import { KeywordSniperView } from "@/components/dashboard/KeywordSniperView";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { SubscriptionView } from "@/components/dashboard/SubscriptionView";
import { NewYearPromoModal } from "@/components/NewYearPromoModal";
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
  const [writingForgeResumeId, setWritingForgeResumeId] = useState<Id<"resumes"> | null>(null);
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
  const [showNewYearPromo, setShowNewYearPromo] = useState(false);
  
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
          <div className="space-y-8 pb-24 md:pb-6">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Master CVs</h1>
                  <p className="text-slate-600 dark:text-slate-400 text-base">Your base resume templates - manage and optimize</p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Upload New CV
                </Button>
              </div>
            </div>

            {/* Resume Grid */}
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
          <div className="space-y-8 pb-24 md:pb-6">
            {/* 2026 New Year Banner */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-indigo-100 shadow-xl shadow-indigo-100/50 group bg-white">
              <div className="absolute inset-0 z-0">
                <img
                  alt="Fireworks background"
                  className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA0wAv1FuCaB34T2Iy0f_rr8s6w5qzc2v1vnEid0uZWPo9e6s-ifHM1O_9P85DafDswLiya2c1l2zLijjgsBK7Lr81AHFuC0xtjadz8ID_wqi0XeYz9baWd7ZqTncJQc7GltfGLl-iYihEAxjEnf9VYW12XgnfVQkLNXAhrkm9BCH5IuaUxYjJvFETX1D1PaI33uyjLrQpiHnXh_3PVbz5NGpRJW5GKwSMdyHeJhcWSTE5OaqUPhirp-WT6BDEygVny9u5Z5Sd-Q"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 opacity-90"></div>
              </div>

              <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex flex-col gap-4 max-w-2xl">
                  <div className="text-yellow-200 text-xs font-bold tracking-[0.2em] uppercase bg-white/10 w-fit px-3 py-1 rounded backdrop-blur-md border border-white/20">
                    New Year Resolution Hack
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-sm">
                    2026 is the year you get the job. <br className="hidden md:block" />
                    <span className="text-indigo-100">
                      Stop being invisible.
                    </span>
                  </h1>
                  <div className="flex flex-col gap-1">
                    <p className="text-indigo-50 font-medium text-lg">
                      New Year Pass: <span className="text-white font-bold">$4.99</span> for 1 Full Audit + Keyword Sniper (Single Use).
                    </p>
                    <p className="text-indigo-200 text-sm italic">
                      $4.99 is an impulse fix—your robots see it instantly and so will recruiters.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={() => setShowPricing(true)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold py-3 px-6 rounded-lg shadow-[0_4px_14px_rgba(250,204,21,0.4)] transition-all transform hover:scale-105 flex items-center gap-2 border border-yellow-300 ring-2 ring-transparent hover:ring-yellow-200"
                  >
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    Unlock New Year Pass
                  </button>
                </div>
              </div>
            </div>

            {/* AI Tools Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="bg-[#3B82F6] w-1.5 h-6 rounded-full inline-block"></span>
                AI Tools
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {/* AI Bullet Rewriter */}
                <button
                  onClick={() => setCurrentView('bullet-rewriter')}
                  className="group relative bg-white border border-slate-200 rounded-xl p-6 transition-all duration-300 hover:border-blue-400 hover:shadow-[0_8px_30px_rgba(59,130,246,0.1)] overflow-hidden shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">auto_fix_high</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        AI Bullet Rewriter
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Transform weak bullets into impact-driven achievements using Google XYZ formula
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      <span className="material-symbols-outlined text-blue-400">arrow_forward</span>
                    </div>
                  </div>
                </button>

                {/* Cover Letter Generator */}
                <button
                  onClick={() => setCurrentView('cover-letter')}
                  className="group relative bg-white border border-slate-200 rounded-xl p-6 transition-all duration-300 hover:border-purple-400 hover:shadow-[0_8px_30px_rgba(168,85,247,0.1)] overflow-hidden shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                        Cover Letter Generator
                      </h3>
                      <p className="text-slate-500 text-sm">
                        AI-powered cover letters with keyword optimization
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      <span className="material-symbols-outlined text-purple-400">arrow_forward</span>
                    </div>
                  </div>
                </button>

                {/* LinkedIn Optimizer */}
                <button
                  onClick={() => setCurrentView('linkedin')}
                  className="group relative bg-white border border-slate-200 rounded-xl p-6 transition-all duration-300 hover:border-indigo-400 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] overflow-hidden shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        LinkedIn Optimizer
                      </h3>
                      <p className="text-slate-500 text-sm">
                        Optimize your profile for recruiters
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      <span className="material-symbols-outlined text-indigo-400">arrow_forward</span>
                    </div>
                  </div>
                </button>

                {/* Keyword Sniper Tool - Featured */}
                <button
                  onClick={() => setCurrentView('keyword-sniper')}
                  className="group relative bg-white border border-orange-200 rounded-xl p-6 transition-all duration-300 hover:border-orange-400 hover:shadow-[0_8px_30px_rgba(249,115,22,0.1)] overflow-hidden shadow-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 shadow-sm text-orange-600 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined">track_changes</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                        Keyword Sniper Tool
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wide">
                          Featured
                        </span>
                      </h3>
                      <p className="text-slate-500 text-sm">
                        AI-powered bullet rewriting with keyword injection and live score tracking
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      <button className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-md border border-orange-200 hover:bg-orange-100 transition-colors uppercase">
                        Launch Tool
                      </button>
                    </div>
                  </div>
                </button>
              </div>
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
        return <WritingForge resumeId={writingForgeResumeId} />;
      case 'keyword-sniper':
        return <KeywordSniperView onBack={() => setCurrentView('tools')} />;
      case 'settings':
        return <SettingsView onOpenPricing={() => setShowPricing(true)} />;
      case 'profile':
        return <SubscriptionView />;
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
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#3B82F6] selection:text-white overflow-hidden">
      <Sidebar
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        setShowPricing={setShowPricing}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main
        className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50 pb-20 md:pb-0"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Gradient blur effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white shadow-sm relative z-10">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setShowPricing(true)}>
            <Sparkles className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
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

      <NewYearPromoModal
        open={showNewYearPromo}
        onOpenChange={setShowNewYearPromo}
        onUnlock={() => {
          setShowNewYearPromo(false);
          setInitialPlan("single_scan");
          setShowPricing(true);
        }}
      />
    </div>
  );
}