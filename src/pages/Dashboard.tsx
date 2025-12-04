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
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { PricingDialog } from "@/components/PricingDialog";
import { Chatbot } from "@/components/Chatbot";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ResumeGrid } from "@/components/dashboard/ResumeGrid";
import { ResumeDetailDialog } from "@/components/dashboard/ResumeDetailDialog";
import { TemplatesView, LinkedInView, CoverLetterView } from "@/components/dashboard/ToolsViews";

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("resumes"); // resumes, templates, linkedin, cover-letter
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

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
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background text-foreground font-sans">
      <PricingDialog open={showPricing} onOpenChange={setShowPricing} />
      <Chatbot />
      <div className="flex h-full min-h-screen w-full">
        <Sidebar 
          categoryFilter={categoryFilter} 
          setCategoryFilter={setCategoryFilter} 
          setShowPricing={setShowPricing} 
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        {/* Main Content */}
        <main 
          className="flex-1 overflow-y-auto p-4 md:p-8 relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary rounded-xl flex flex-col items-center justify-center animate-in fade-in duration-200 m-4 md:m-8">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Drop resume here</h3>
              <p className="text-muted-foreground mt-2">Release to analyze instantly</p>
            </div>
          )}

          {currentView === 'resumes' && (
            <div className="flex flex-col gap-6">
              {/* PageHeading */}
              <div>
                <p className="text-foreground text-4xl font-black leading-tight tracking-[-0.033em]">
                  {categoryFilter ? `${categoryFilter} Resumes` : "Your Resumes"}
                </p>
              </div>

              {/* ToolBar */}
              <div className="flex flex-col gap-4">
                {/* Job Description Input */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Target Job Description</label>
                    <span className="text-xs text-muted-foreground">Paste JD to get tailored ATS scoring</span>
                  </div>
                  <textarea
                    className="w-full h-24 rounded-lg border border-border bg-card p-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Paste the Job Description here to get a tailored ATS score (Optional)..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary outline-none transition-all" 
                        placeholder="Search resumes..." 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Filter className="h-5 w-5" />
                      <span className="text-sm font-medium hidden sm:inline">Filter</span>
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button 
                      className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 min-w-0 bg-primary px-4 text-sm font-bold leading-normal text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:opacity-90 disabled:opacity-50"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                      <span>Upload & Analyze</span>
                    </button>
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

        </main>
      </div>

      <ResumeDetailDialog 
        selectedResume={selectedResume} 
        setSelectedResume={setSelectedResume} 
        handleDelete={handleDelete} 
      />
    </div>
  );
}