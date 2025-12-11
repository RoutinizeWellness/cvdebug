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
  CheckCircle2
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
  const [currentView, setCurrentView] = useState("resumes"); // resumes, templates, linkedin, cover-letter
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [initialPlan, setInitialPlan] = useState<"single_scan" | "bulk_pack" | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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
          // toast.success("Payment successful! Credits added to your account.");
          setShowPaymentSuccess(true);
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

  const handleFile = async (file: File) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg", 
      "image/png", 
      "image/webp", 
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image (JPG/PNG), PDF, or Word (.docx) file.");
      return;
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
        width: 0,
        height: 0,
        size: file.size,
        mimeType: file.type,
        jobDescription: jobDescription.trim() || undefined,
      });

      toast.success("Resume uploaded");
      processFile(file, resumeId);
      setJobDescription("");

    } catch (error) {
      console.error(error);
      toast.error("Failed to upload resume");
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
        // PDF Processing
        // Use https protocol explicitly and ensure version is present
        const pdfVersion = pdfjsLib.version || "5.4.449"; 
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
        toast.warning("No text could be extracted from the file.");
      }

      await updateResumeOcr({
        id: resumeId,
        ocrText: text,
      });
      toast.success("Parsing Complete. Analyzing with AI...");
    } catch (error) {
      console.error("Processing Error:", error);
      toast.error("Resume parsing failed");
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
      <PricingDialog open={showPricing} onOpenChange={setShowPricing} initialPlan={initialPlan} />
      
      <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p>Thank you for your purchase. Your credits have been added to your account and you can now access premium features.</p>
              {currentUser ? (
                <div className="bg-muted/50 p-4 rounded-xl border border-border flex flex-col items-center justify-center gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">New Balance</span>
                  <span className="text-3xl font-black text-primary flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    {currentUser.credits} Credits
                  </span>
                </div>
              ) : (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowPaymentSuccess(false)} className="w-full sm:w-auto font-bold">
              Start Optimizing
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

      {/* Main Content */}
      <main 
        className="flex-1 h-full overflow-y-auto relative scroll-smooth"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
                      <div className="absolute right-2 top-2">
                        <span className="flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
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