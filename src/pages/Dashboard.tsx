import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { 
  FileText, 
  Loader2, 
  Plus, 
  Search, 
  Trash2, 
  Upload, 
  FileUp,
  Grid,
  Folder,
  Star,
  Settings,
  Filter,
  Share,
  Download,
  X,
  CreditCard,
  Info,
  Sparkles,
  Tag,
  Maximize2,
  Minimize2,
  Code,
  DollarSign,
  Video,
  AlertCircle,
  MessageCircle,
  ShoppingCart,
  Palette,
  File,
  Briefcase,
  BarChart,
  Users
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router";
import { PricingDialog } from "@/components/PricingDialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chatbot } from "@/components/Chatbot";
import { useAction } from "convex/react";
import { UserButton } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [isImmersive, setIsImmersive] = useState(false);
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
      processOcr(file, resumeId);
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
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else if (file) {
      toast.error("Please upload an image of your resume (PDF support coming soon)");
    }
  };

  const processOcr = async (file: File, resumeId: any) => {
    try {
      const worker = await createWorker("eng");
      const ret = await worker.recognize(file);
      await worker.terminate();
      const text = ret.data.text;
      await updateResumeOcr({
        id: resumeId,
        ocrText: text,
      });
      toast.success("Parsing Complete. Analyzing with AI...");
    } catch (error) {
      console.error("OCR Error:", error);
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

  const categories = [
    { id: "Engineering", label: "Engineering", icon: Code },
    { id: "Marketing", label: "Marketing", icon: Share },
    { id: "Sales", label: "Sales", icon: DollarSign },
    { id: "Design", label: "Design", icon: Palette },
    { id: "Product", label: "Product", icon: Box },
    { id: "Finance", label: "Finance", icon: BarChart },
    { id: "HR", label: "HR", icon: Users },
    { id: "Operations", label: "Operations", icon: Settings },
    { id: "Other", label: "Other", icon: File },
  ];

  // Helper for icon
  function Box(props: any) { return <Briefcase {...props} /> }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background text-foreground font-sans">
      <PricingDialog open={showPricing} onOpenChange={setShowPricing} />
      <Chatbot />
      <div className="flex h-full min-h-screen w-full">
        {/* SideNavBar */}
        <aside className="w-64 flex-shrink-0 p-4 hidden md:block">
          <div className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col gap-4 rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-foreground text-base font-bold leading-normal tracking-tight">Resume ATS</h1>
                <p className="text-muted-foreground text-xs font-medium leading-normal">Optimizer</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-6">
              <div 
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium cursor-pointer transition-colors ${!categoryFilter ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                onClick={() => setCategoryFilter(null)}
              >
                <Grid className="h-4 w-4" />
                <p className="text-sm leading-normal">All Resumes</p>
              </div>
              
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Categories</p>
              </div>
              
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${categoryFilter === cat.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                  onClick={() => setCategoryFilter(cat.id)}
                >
                  <cat.icon className="h-4 w-4" />
                  <p className="text-sm font-medium leading-normal">{cat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div 
                className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors group"
                onClick={() => setShowPricing(true)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-bold text-sm">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Get unlimited scans and detailed AI feedback.</p>
                <button className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm">
                  Upgrade Now
                </button>
              </div>
            </div>
            
            <div className="mt-auto flex flex-col gap-1">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                <UserButton 
                  showName={true}
                  appearance={{
                    elements: {
                      userButtonBox: "flex flex-row-reverse",
                      userButtonOuterIdentifier: "text-sm font-medium text-foreground",
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

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
              <h3 className="text-2xl font-bold text-primary">Drop resume image here</h3>
              <p className="text-muted-foreground mt-2">Release to analyze instantly</p>
            </div>
          )}

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
                    accept="image/*"
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

            {/* ImageGrid */}
            {resumes === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/50">
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No resumes yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first resume image to get an ATS score</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resumes.map((resume) => (
                  <div 
                    key={resume._id} 
                    className="group relative flex flex-col gap-3 rounded-xl border border-transparent bg-card p-3 transition-all hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedResume(resume)}
                  >
                    <div className="relative w-full overflow-hidden rounded-lg aspect-[3/4] bg-secondary">
                      <img 
                        src={resume.url} 
                        alt={resume.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                        {resume.score ? `Score: ${resume.score}` : 'Analyzing...'}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <button className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors">
                          <Star className="h-5 w-5" />
                        </button>
                        <button 
                          className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume._id);
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-foreground text-base font-medium leading-normal truncate" title={resume.title}>
                        {resume.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          resume.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'
                        }`}>
                          {resume.category || (resume.status === 'processing' ? 'Processing...' : 'Uncategorized')}
                        </span>
                        <p className="text-muted-foreground text-sm font-normal leading-normal ml-auto">
                          {new Date(resume._creationTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detailed View Dialog */}
      <Dialog open={!!selectedResume} onOpenChange={(open) => !open && setSelectedResume(null)}>
        <DialogContent className="w-screen h-screen p-0 bg-background border-none rounded-none overflow-hidden flex flex-col shadow-none top-0 left-0 translate-x-0 translate-y-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight tracking-tight">Resume Analysis</h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedResume?._id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Share">
                <Share className="h-4 w-4" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Download">
                <Download className="h-4 w-4" />
              </button>
              <div className="w-px h-8 bg-border mx-1 self-center" />
              <button 
                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                onClick={() => selectedResume && handleDelete(selectedResume._id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button 
                className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedResume(null)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            {/* Left Panel - Details */}
            <div className={`lg:col-span-3 border-r border-border bg-card/30 flex flex-col h-full overflow-hidden ${isImmersive ? 'hidden' : ''}`}>
              <ScrollArea className="flex-1">
                <div className="p-6 flex flex-col gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BarChart className="h-4 w-4" /> ATS Score
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                        (selectedResume?.score || 0) >= 80 ? 'border-green-500 text-green-500' : 
                        (selectedResume?.score || 0) >= 50 ? 'border-yellow-500 text-yellow-500' : 
                        'border-red-500 text-red-500'
                      }`}>
                        {selectedResume?.score || 0}
                      </div>
                      <div>
                        <p className="font-medium">
                          {(selectedResume?.score || 0) >= 80 ? 'Excellent' : 
                           (selectedResume?.score || 0) >= 50 ? 'Needs Improvement' : 
                           'Poor'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          40% Keywords • 30% Format • 30% Completeness
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />

                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> AI Recommendations
                    </h3>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedResume?.analysis || "Analysis pending..."}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4" /> Metadata
                    </h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 text-sm">
                      <p className="text-muted-foreground font-medium">Filename</p>
                      <p className="text-foreground truncate font-medium" title={selectedResume?.title}>{selectedResume?.title}</p>
                      
                      <p className="text-muted-foreground font-medium">Date</p>
                      <p className="text-foreground">{selectedResume && new Date(selectedResume._creationTime).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                      
                      <p className="text-muted-foreground font-medium">Category</p>
                      <p className="text-foreground">{selectedResume?.category || "Uncategorized"}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Center Image */}
            <div className={`${isImmersive ? 'lg:col-span-12' : 'lg:col-span-6'} bg-black/5 flex items-center justify-center p-8 overflow-hidden relative group transition-all duration-300`}>
              <div className="absolute inset-0 bg-[radial-gradient(#00000011_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
              
              <button 
                onClick={() => setIsImmersive(!isImmersive)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                title={isImmersive ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isImmersive ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>

              <div className="w-full h-full flex items-center justify-center relative z-10">
                <img 
                  className="h-full object-contain rounded-lg shadow-2xl ring-1 ring-black/10 bg-white" 
                  src={selectedResume?.url} 
                  alt={selectedResume?.title} 
                />
              </div>
            </div>

            {/* Right Panel - Actions */}
            <div className={`lg:col-span-3 border-l border-border bg-card/30 flex flex-col h-full overflow-hidden ${isImmersive ? 'hidden' : ''}`}>
              <ScrollArea className="flex-1">
                <div className="p-6 flex flex-col gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Code className="h-4 w-4" /> Parsed Text
                    </h3>
                    <div className="bg-background rounded-lg border border-border p-3 text-xs text-muted-foreground font-mono max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                      {selectedResume?.ocrText ? selectedResume.ocrText : "No text extracted."}
                    </div>
                  </div>
                  
                  <Separator />

                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Notes
                    </h3>
                    <textarea 
                      className="w-full h-40 bg-background border border-border rounded-lg text-sm p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed transition-all placeholder:text-muted-foreground/50" 
                      placeholder="Add a note about this resume..."
                    ></textarea>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}