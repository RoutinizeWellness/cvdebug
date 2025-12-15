import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { 
  Loader2, 
  Search, 
  Upload, 
  FileUp,
  Filter,
  Plus,
  Sparkles,
  CheckCircle2,
  X,
  Check,
  AlertCircle,
  Star
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";
import { PricingDialog } from "@/components/PricingDialog";
import { Chatbot } from "@/components/Chatbot";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ResumeGrid } from "@/components/dashboard/ResumeGrid";
import { ResumeDetailDialog } from "@/components/dashboard/ResumeDetailDialog";
import { TemplatesView, LinkedInView, CoverLetterView } from "@/components/dashboard/ToolsViews";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("resumes");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [initialPlan, setInitialPlan] = useState<"single_scan" | "bulk_pack" | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingResumeId, setPendingResumeId] = useState<string | null>(null);
  const [showNewFeatureBanner, setShowNewFeatureBanner] = useState(true);
  const [processingResumeId, setProcessingResumeId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedPaymentRef = useRef(false);
  
  const storeUser = useMutation(api.users.storeUser);
  const purchaseCredits = useMutation(api.users.purchaseCredits);
  const currentUser = useQuery(api.users.currentUser);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Preserve query params (like payment=success) when redirecting to auth
      const currentSearch = window.location.search;
      navigate(`/auth${currentSearch}`);
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      // Ensure user is stored in the database when they visit the dashboard
      storeUser();
    }
  }, [isAuthenticated, storeUser]);

  useEffect(() => {
    // Wait for auth to be ready
    if (isLoading) return;

    const plan = searchParams.get("plan");
    const payment = searchParams.get("payment");
    const resumeId = searchParams.get("resumeId");

    if (payment === "success" && (plan === "single_scan" || plan === "bulk_pack")) {
      // Prevent double processing
      if (processedPaymentRef.current) return;
      
      // If not authenticated yet, wait (or let the auth redirect handle it)
      if (!isAuthenticated) return;

      processedPaymentRef.current = true;
      setIsProcessingPayment(true);

      // 1. Ensure user exists in DB first
      storeUser()
        .then(() => {
          // 2. Then purchase credits
          return purchaseCredits({ plan: plan as "single_scan" | "bulk_pack" });
        })
        .then(() => {
          // 3. Check if there's a pending resume to auto-unlock
          if (resumeId) {
            setPendingResumeId(resumeId);
            toast.success("Payment successful! Unlocking your resume report...");
          } else {
            setShowPaymentSuccess(true);
          }
          // Remove query params to prevent replay
          setSearchParams({});
          navigate("/dashboard", { replace: true });
        })
        .catch((error) => {
          console.error("Credit update failed:", error);
          toast.error("Payment recorded but credit update failed. Please contact support.");
          processedPaymentRef.current = false; // Allow retry if it failed
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

  const generateUploadUrl = useMutation(api.resumes.generateUploadUrl);
  const createResume = useMutation(api.resumes.createResume);
  const updateResumeOcr = useMutation(api.resumes.updateResumeOcr);
  const deleteResume = useMutation(api.resumes.deleteResume);
  
  const resumes = useQuery(api.resumes.getResumes, { 
    search: search || undefined,
    category: categoryFilter || undefined
  });

  // Track processing resumes
  const processingResume = resumes?.find((r: any) => r._id === processingResumeId && r.status === "processing");

  // Auto-unlock resume after payment
  useEffect(() => {
    if (pendingResumeId && resumes && currentUser) {
      const resume = resumes.find((r: any) => r._id === pendingResumeId);
      if (resume) {
        setSelectedResume(resume);
        setPendingResumeId(null);
        toast.success("🎉 Resume report unlocked! Your credits have been applied.");
      }
    }
  }, [pendingResumeId, resumes, currentUser]);

  const handleFile = async (file: File) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg", 
      "image/png", 
      "image/webp", 
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image (JPG/PNG), PDF, or Word (.docx) file.");
      return;
    }

    if (jobDescription.trim()) {
      toast.info("🎯 Analyzing resume with your job description for tailored scoring...");
    } else {
      toast.info("📄 Analyzing resume with general industry standards...");
    }

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      const resumeId = await createResume({
        storageId,
        title: file.name,
        mimeType: file.type,
        jobDescription: jobDescription.trim() || undefined,
      });

      // Set processing state to show upsell overlay
      setProcessingResumeId(resumeId);

      toast.success(jobDescription.trim() 
        ? "Resume uploaded! AI is analyzing against your job description..." 
        : "Resume uploaded! AI is analyzing..."
      );
      processFile(file, resumeId);
      setJobDescription("");

    } catch (error) {
      console.error(error);
      toast.error("Failed to upload resume");
      setProcessingResumeId(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const processFile = async (file: File, resumeId: any) => {
    try {
      let text = "";

      if (file.type === "application/pdf") {
        // PDF Processing with fallback version
        const pdfVersion = pdfjsLib.version || "4.0.379"; 
        // Use unpkg for better version availability matching npm
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfVersion}/build/pdf.worker.min.mjs`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(" ");
          text += pageText + "\n";
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Word (.docx) Processing
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        // Image OCR Processing
        const worker = await createWorker("eng");
        const imageUrl = URL.createObjectURL(file);
        const ret = await worker.recognize(imageUrl);
        URL.revokeObjectURL(imageUrl);
        await worker.terminate();
        text = ret.data.text;
      }

      if (!text.trim()) {
        toast.warning("No text could be extracted from the file. Please ensure your file contains readable text.");
      }

      await updateResumeOcr({
        id: resumeId,
        ocrText: text,
      });
      toast.success("✅ Parsing Complete. AI is now analyzing your resume...");
    } catch (error) {
      console.error("Processing Error:", error);
      toast.error("Resume parsing failed. Please try a different file format or ensure the file is not corrupted.");
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteResume({ id });
      toast.success("Resume deleted");
      if (selectedResume?._id === id) setSelectedResume(null);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="relative flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
      <PricingDialog 
        open={showPricing} 
        onOpenChange={setShowPricing} 
        initialPlan={initialPlan}
        resumeId={selectedResume?._id}
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
              
              <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-5 mb-4">
                <p className="text-sm text-amber-900 dark:text-amber-100 font-bold text-center mb-2">
                  💳 Think of credits like arcade tokens
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                  Each scan costs <span className="font-black text-amber-900 dark:text-amber-100">1 token</span>. Upload → Spend 1 credit → Get full report.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-5 space-y-4 text-left">
                <h4 className="text-base font-black text-green-900 dark:text-green-100 flex items-center gap-2">
                  💡 How to use your credits:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="text-sm font-bold text-green-900 dark:text-green-100">To unlock your CURRENT report:</p>
                      <p className="text-xs text-green-800 dark:text-green-200 mt-1">Click <span className="font-bold">"Upload Resume"</span> or view any blurred report <span className="bg-green-200 dark:bg-green-900 px-1.5 py-0.5 rounded font-bold">(Costs 1 credit)</span></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="text-sm font-bold text-green-900 dark:text-green-100">To check a NEW resume version later:</p>
                      <p className="text-xs text-green-800 dark:text-green-200 mt-1">Just upload it anytime <span className="bg-green-200 dark:bg-green-900 px-1.5 py-0.5 rounded font-bold">(Costs 1 credit)</span></p>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-green-200 dark:border-green-800">
                  <p className="text-xs font-bold text-green-700 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Your credits never expire.
                  </p>
                </div>
              </div>
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
        className="flex-1 h-full overflow-y-auto relative scroll-smooth"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Processing Upsell Overlay */}
        {processingResumeId && processingResume && (
          <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200 p-6">
            <div className="max-w-2xl w-full space-y-8">
              {/* Progress Header */}
              <div className="text-center space-y-4">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <h3 className="text-3xl font-black text-foreground">Analyzing Your Resume...</h3>
                <p className="text-muted-foreground text-lg">Our AI is scanning for ATS compatibility issues</p>
              </div>

              {/* Fear-Based Stats Carousel */}
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 rounded-2xl p-8 space-y-4 animate-in slide-in-from-bottom duration-500">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Did You Know?</h4>
                    <p className="text-base text-foreground/80 leading-relaxed">
                      <strong className="text-red-600">75% of resumes</strong> are rejected by ATS systems before a human ever sees them. A single formatting error can cost you the interview.
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom duration-700 delay-200">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-sm text-foreground leading-relaxed italic">
                  "I was applying for months with no responses. After fixing the ATS issues this tool found, I got 3 interview requests in one week. The $4.99 was the best investment I made in my job search."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer" alt="Jennifer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Jennifer M.</p>
                    <p className="text-xs text-muted-foreground">Software Engineer at Google</p>
                  </div>
                </div>
              </div>

              {/* Processing Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-primary">98%</p>
                  <p className="text-xs text-muted-foreground mt-1">Accuracy Rate</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-primary">30s</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg Analysis</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-primary">10K+</p>
                  <p className="text-xs text-muted-foreground mt-1">Resumes Fixed</p>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Almost done... Preparing your detailed report
              </p>
            </div>
          </div>
        )}

        {/* Clear processing state when resume is completed */}
        {processingResumeId && !processingResume && (() => {
          setProcessingResumeId(null);
          return null;
        })()}

        {/* Payment Processing Overlay */}
        {isProcessingPayment && (
          <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Processing Payment...</h3>
            <p className="text-muted-foreground mt-2">Adding credits to your account</p>
          </div>
        )}

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-primary animate-pulse">
              <FileUp className="h-16 w-16 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-foreground">Drop resume here</h3>
            <p className="text-muted-foreground mt-2 text-lg">Release to analyze instantly</p>
          </div>
        )}

        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* New Feature Announcement Banner */}
          {showNewFeatureBanner && currentView === 'resumes' && (
            <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-primary/10 to-pink-500/10 border-2 border-primary/30 shadow-lg animate-in slide-in-from-top duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
              <div className="relative p-6 flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-purple-600 text-white shadow-sm">
                      ✨ NEW FEATURE
                    </span>
                    <h3 className="text-xl font-black text-foreground">Smart Metric Suggestions</h3>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                    Get AI-powered, quantifiable metrics for every technology in your stack! Now included in all paid reports ($4.99).
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-border/50">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="font-medium">Realistic metrics for Redis, Docker, AWS, etc.</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-border/50">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="font-medium">Copy-paste ready bullet points</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-lg border border-border/50">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      <span className="font-medium">Tailored to your role</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNewFeatureBanner(false)}
                  className="flex-shrink-0 p-2 hover:bg-background/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  title="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {currentView === 'resumes' && (
            <div className="flex flex-col gap-8">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">
                    {categoryFilter ? `${categoryFilter} Resumes` : "Your Resumes"}
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Manage and optimize your resumes for ATS compatibility.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button 
                    size="lg"
                    className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5" />}
                    Upload New Resume
                  </Button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    className="w-full bg-background rounded-xl border border-border py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Search by name, content, or keywords..." 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                
                <div className="w-px h-8 bg-border hidden lg:block" />
                
                <div className="w-full lg:w-auto flex-1">
                  <div className="relative">
                    <textarea
                      className="w-full h-[42px] min-h-[42px] max-h-[100px] bg-background rounded-xl border border-border py-2.5 px-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y"
                      placeholder="Paste Job Description for tailored scoring..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                    {jobDescription && (
                      <div className="absolute right-2 top-2 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Tailored Mode
                        </span>
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      </div>
                    )}
                    {jobDescription && (
                      <div className="absolute -bottom-6 left-0 text-[10px] text-muted-foreground">
                        💡 Your next upload will be scored against this job description
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <ResumeGrid 
                resumes={resumes} 
                setSelectedResume={setSelectedResume} 
                handleDelete={handleDelete} 
              />
            </div>
          )}

          {currentView === 'templates' && <TemplatesView />}
          {currentView === 'linkedin' && <LinkedInView />}
          {currentView === 'cover-letter' && <CoverLetterView />}
        </div>
      </main>

      <ResumeDetailDialog 
        selectedResume={selectedResume} 
        setSelectedResume={setSelectedResume} 
        handleDelete={handleDelete} 
      />
    </div>
  );
}