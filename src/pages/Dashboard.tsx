import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
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
import { ResumeDetailDialog } from "@/components/dashboard/ResumeDetailDialog";
import { TemplatesView, LinkedInView, CoverLetterView } from "@/components/dashboard/ToolsViews";
import { ProcessingOverlay } from "@/components/dashboard/ProcessingOverlay";
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

const apiAny = api as any;

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("resumes");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [initialPlan, setInitialPlan] = useState<"single_scan" | "bulk_pack" | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingResumeId, setPendingResumeId] = useState<string | null>(null);
  const [targetedScanEnabled, setTargetedScanEnabled] = useState(false);
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
  const currentUser = useQuery(apiAny.users.currentUser);
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

    if (payment === "success" && (plan === "single_scan" || plan === "bulk_pack")) {
      if (processedPaymentRef.current) return;
      if (!isAuthenticated) return;

      processedPaymentRef.current = true;
      setIsProcessingPayment(true);

      storeUser()
        .then(() => {
          return purchaseCredits({ plan: plan as "single_scan" | "bulk_pack" });
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
    } else if (plan === "single_scan" || plan === "bulk_pack") {
      setInitialPlan(plan as "single_scan" | "bulk_pack");
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
        setSelectedResumeId(pendingResumeId);
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

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,image/*"
        onChange={handleFileUpload}
      />
      <PricingDialog 
        open={showPricing} 
        onOpenChange={setShowPricing} 
        initialPlan={initialPlan}
        resumeId={selectedResumeId || undefined}
      />
      
      <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-4 animate-in zoom-in duration-300">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl font-black">🎉 Purchase Successful!</DialogTitle>
            <DialogDescription className="text-center space-y-6 pt-2">
              {currentUser ? (
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 p-6 rounded-2xl border-2 border-primary/20 flex flex-col items-center justify-center gap-2 shadow-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">You now have</span>
                  <span className="text-5xl font-black text-primary flex items-center gap-3 animate-in slide-in-from-bottom duration-500">
                    <Sparkles className="h-7 w-7 text-yellow-400 fill-yellow-400 animate-pulse" />
                    {currentUser.credits}
                    <span className="text-2xl font-bold text-muted-foreground">Credits</span>
                  </span>
                  <span className="text-xs text-muted-foreground">in your account</span>
                </div>
              ) : (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 flex-col sm:flex-row">
            <Button 
              onClick={() => {
                setShowPaymentSuccess(false);
                fileInputRef.current?.click();
              }} 
              className="w-full sm:w-auto font-bold text-base h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Resume Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowPaymentSuccess(false)} 
              className="w-full sm:w-auto font-bold"
            >
              I'll Do It Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Chatbot />
      
      <Sidebar 
        categoryFilter={categoryFilter} 
        setCategoryFilter={setCategoryFilter} 
        setShowPricing={setShowPricing} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main 
        className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505] relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {processingResumeId && processingResume && (
          <ProcessingOverlay />
        )}

        {isProcessingPayment && (
          <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Processing Payment...</h3>
            <p className="text-muted-foreground mt-2">Adding credits to your account</p>
          </div>
        )}

        {isDragging && (
          <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-primary animate-pulse">
              <FileUp className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-foreground">Drop resume here</h3>
            <p className="text-muted-foreground mt-2 text-lg">Release to analyze instantly</p>
          </div>
        )}

        {/* Header */}
        <header className="h-20 shrink-0 px-8 flex items-center justify-between border-b border-zinc-800/50 bg-[#050505]/80 backdrop-blur-sm z-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white tracking-tight">Welcome back, {user?.firstName || 'there'}</h2>
            <p className="text-sm text-zinc-500">Ready to optimize your career profile?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl p-1.5 pr-4 pl-4 shadow-sm">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Credits</span>
                <span className="text-sm font-semibold text-white">{currentUser?.credits || 0} Scans Left</span>
              </div>
              <div className="h-8 w-px bg-zinc-800 mx-1"></div>
              <button 
                onClick={() => setShowPricing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-purple-600 hover:from-[#6D28D9] hover:to-purple-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-purple-500/25"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-10">
            {currentView === 'resumes' && (
              <>
                {/* Upload Hero Section */}
                <div 
                  className="relative group rounded-2xl border-2 border-dashed border-zinc-700 bg-[#0A0A0A]/50 hover:bg-[#0A0A0A] hover:border-[#7C3AED]/50 transition-all duration-300 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#7C3AED]/50 group-hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] transition-all duration-300">
                      <Upload className="h-8 w-8 text-zinc-400 group-hover:text-[#7C3AED] transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Drop your Resume here</h3>
                    <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                      Supports PDF, DOCX formats up to 5MB. We'll analyze it instantly.
                    </p>
                    <button className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-white/5">
                      <FileUp className="h-5 w-5" />
                      Select File
                    </button>
                  </div>
                </div>

                {/* Targeted Scan Toggle */}
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-[#7C3AED]">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Targeted Scan</h4>
                      <p className="text-sm text-zinc-500 mt-0.5">Compare your resume against a specific job description for a match score.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      className="sr-only peer" 
                      type="checkbox" 
                      checked={targetedScanEnabled}
                      onChange={(e) => setTargetedScanEnabled(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                    <span className="ml-3 text-sm font-medium text-zinc-400 peer-checked:text-white">Enable</span>
                  </label>
                </div>

                {/* Recent Activity Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Recent Scans</h3>
                    <button className="text-sm text-[#7C3AED] hover:text-[#6D28D9] font-medium">View All</button>
                  </div>

                  {/* Table Container */}
                  <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-800 bg-zinc-900/50">
                            <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">File Name</th>
                            <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                            <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Target Role</th>
                            <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Score</th>
                            <th className="py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {resumes === undefined ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                                <p className="text-zinc-500">Loading resumes...</p>
                              </td>
                            </tr>
                          ) : resumes.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center">
                                <FileText className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                                <p className="text-zinc-500">No resumes yet. Upload one to get started!</p>
                              </td>
                            </tr>
                          ) : (
                            resumes.map((resume: any) => (
                              <tr key={resume._id} className="group hover:bg-zinc-900/30 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                                      resume.mimeType === 'application/pdf' 
                                        ? 'bg-red-500/10 text-red-500' 
                                        : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                      {resume.mimeType === 'application/pdf' ? (
                                        <FileText className="h-5 w-5" />
                                      ) : (
                                        <File className="h-5 w-5" />
                                      )}
                                    </div>
                                    <span className="text-sm font-medium text-white group-hover:text-[#7C3AED] transition-colors truncate max-w-xs">
                                      {resume.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-sm text-zinc-400">
                                    {new Date(resume._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-sm text-zinc-300">
                                    {resume.category || <span className="italic text-zinc-500">General Scan</span>}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${getScoreBgColor(resume.score || 0)}`}
                                        style={{ width: `${resume.score || 0}%` }}
                                      ></div>
                                    </div>
                                    <span className={`text-xs font-bold ${getScoreColor(resume.score || 0)}`}>
                                      {resume.score || 0}%
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                      title="View Report"
                                      onClick={() => setSelectedResumeId(resume._id)}
                                    >
                                      <Eye className="h-[18px] w-[18px]" />
                                    </button>
                                    <button 
                                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                      title="Delete"
                                      onClick={() => handleDelete(resume._id)}
                                    >
                                      <Trash2 className="h-[18px] w-[18px]" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentView === 'templates' && <TemplatesView />}
            {currentView === 'linkedin' && <LinkedInView />}
            {currentView === 'cover-letter' && <CoverLetterView />}
          </div>
        </div>
      </main>

      <ResumeDetailDialog 
        resumeId={selectedResumeId as any}
        onClose={() => setSelectedResumeId(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}