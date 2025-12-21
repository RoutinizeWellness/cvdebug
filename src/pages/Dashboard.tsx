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
  LayoutTemplate
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { PricingDialog } from "@/components/PricingDialog";
import { Chatbot } from "@/components/Chatbot";
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
import { MissionControl } from "@/components/dashboard/MissionControl";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { SprintProgressBar } from "@/components/dashboard/SprintProgressBar";

const apiAny = api as any;

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPricing, setShowPricing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("projects"); // Default to Project Hub
  const [selectedProject, setSelectedProject] = useState<Id<"projects"> | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<Id<"resumes"> | null>(null);
  const [preSelectedApplicationId, setPreSelectedApplicationId] = useState<string | undefined>(undefined);

  const currentUser = useQuery(apiAny.users.currentUser);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [initialPlan, setInitialPlan] = useState<"single_scan" | "interview_sprint" | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingResumeId, setPendingResumeId] = useState<string | null>(null);
  const [targetedScanEnabled, setTargetedScanEnabled] = useState(false);
  const [showCreditsExhausted, setShowCreditsExhausted] = useState(false);
  const [lastScannedScore, setLastScannedScore] = useState<number | undefined>();
  const processedPaymentRef = useRef(false);
  
  const {
    isUploading,
    isDragging,
    processingResumeId,
    setProcessingResumeId,
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-zinc-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-zinc-500";
  };

  const handleGenerateCoverLetter = (applicationId: string) => {
    setPreSelectedApplicationId(applicationId);
    setCurrentView("cover-letter");
  };

  const renderContent = () => {
    switch (currentView) {
      case 'projects':
        // Level 3: Project Hub (All Projects)
        if (selectedProject) {
          // Level 4: Mission Control (Project-Specific)
          return (
            <ProjectBoard 
              projectId={selectedProject} 
              onBack={() => setSelectedProject(null)} 
              onGenerateCoverLetter={handleGenerateCoverLetter}
            />
          );
        }
        return (
          <ProjectsView 
            onSelectProject={(id: Id<"projects">) => setSelectedProject(id)} 
          />
        );
      case 'mission':
        // Redirect to projects if no project selected
        if (!selectedProject) {
          setCurrentView('projects');
          return null;
        }
        return (
          <MissionControl 
            onNavigate={setCurrentView} 
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onUpload={() => fileInputRef.current?.click()}
          />
        );
      case 'tools':
        // Mobile AI Tools Hub
        return (
          <div className="space-y-6 pb-24 md:pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">AI Tools</h1>
            <div className="grid grid-cols-1 gap-4">
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
        // Mobile Profile/Settings
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
      case 'projects':
        if (selectedProject) {
          return (
            <ProjectBoard 
              projectId={selectedProject} 
              onBack={() => setSelectedProject(null)} 
              onGenerateCoverLetter={handleGenerateCoverLetter}
            />
          );
        }
        return (
          <ProjectsView 
            onSelectProject={(id: Id<"projects">) => setSelectedProject(id)} 
          />
        );
      case 'templates':
        return <TemplatesView />;
      case 'linkedin':
        return <LinkedInView />;
      case 'cover-letter':
        return <CoverLetterGenerator initialApplicationId={preSelectedApplicationId} />;
      case 'resumes':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">All Resumes</h1>
                <p className="text-zinc-400 mt-1">View and manage your uploaded resumes</p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-black font-bold hover:bg-primary/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
            </div>
            <ResumeGrid 
              resumes={resumes}
              setSelectedResume={(resume) => setSelectedResumeId(resume._id)}
              handleDelete={handleDelete}
              categoryFilter={categoryFilter} 
              onUpload={() => fileInputRef.current?.click()} 
            />
          </div>
        );
      case 'writing-forge':
        return <WritingForge />;
      default:
        return (
          <MissionControl 
            onNavigate={setCurrentView} 
            onGenerateCoverLetter={handleGenerateCoverLetter}
            onUpload={() => fileInputRef.current?.click()}
          />
        );
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-screen bg-transparent text-foreground font-sans selection:bg-primary/30">
      <Sidebar 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter}
        setShowPricing={setShowPricing}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <main 
        className="flex-1 flex flex-col overflow-hidden relative bg-transparent pb-20 md:pb-0"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setShowPricing(true)}>
            <Sparkles className="h-5 w-5 text-primary" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto h-full">
            {renderContent()}
          </div>
        </div>

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">Drop your resume here</h3>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Tab Bar */}
      <MobileTabBar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onUpload={() => fileInputRef.current?.click()}
      />

      <PricingDialog 
        open={showPricing} 
        onOpenChange={setShowPricing} 
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.docx,.doc,.txt"
        onChange={handleFileUpload}
      />

      {/* Overlays and Modals */}
      {(isUploading || !!processingResumeId || isProcessingPayment) && (
        <ProcessingOverlay 
          isUploading={isUploading} 
          isProcessing={!!processingResumeId || isProcessingPayment} 
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
    </div>
  );
}