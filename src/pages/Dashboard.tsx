import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { 
  Image as ImageIcon, 
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
  FileText
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router";
import { PricingDialog } from "@/components/PricingDialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const generateUploadUrl = useMutation(api.screenshots.generateUploadUrl);
  const createScreenshot = useMutation(api.screenshots.createScreenshot);
  const updateScreenshotOcr = useMutation(api.screenshots.updateScreenshotOcr);
  const deleteScreenshot = useMutation(api.screenshots.deleteScreenshot);
  
  const screenshots = useQuery(api.screenshots.getScreenshots, { search: search || undefined });

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

      const screenshotId = await createScreenshot({
        storageId,
        title: file.name,
        width: 0,
        height: 0,
        size: file.size,
        mimeType: file.type,
      });

      toast.success("Screenshot uploaded");
      processOcr(file, screenshotId);

    } catch (error) {
      console.error(error);
      toast.error("Failed to upload screenshot");
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
      toast.error("Please upload an image file");
    }
  };

  const processOcr = async (file: File, screenshotId: any) => {
    try {
      const worker = await createWorker("eng");
      const ret = await worker.recognize(file);
      await worker.terminate();
      const text = ret.data.text;
      await updateScreenshotOcr({
        id: screenshotId,
        ocrText: text,
      });
      toast.success("OCR Complete. Analyzing content...");
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("OCR processing failed");
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteScreenshot({ id });
      toast.success("Screenshot deleted");
      if (selectedScreenshot?._id === id) setSelectedScreenshot(null);
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background text-foreground font-sans">
      <PricingDialog open={showPricing} onOpenChange={setShowPricing} />
      <div className="flex h-full min-h-screen w-full">
        {/* SideNavBar */}
        <aside className="w-64 flex-shrink-0 p-4 hidden md:block">
          <div className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col gap-4 rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <ImageIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-foreground text-base font-bold leading-normal tracking-tight">Screenshot Org</h1>
                <p className="text-muted-foreground text-xs font-medium leading-normal">Personal Workspace</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-6">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                <Grid className="h-4 w-4" />
                <p className="text-sm leading-normal">All Screenshots</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                <Folder className="h-4 w-4" />
                <p className="text-sm font-medium leading-normal">Collections</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                <Star className="h-4 w-4" />
                <p className="text-sm font-medium leading-normal">Favorites</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                <Trash2 className="h-4 w-4" />
                <p className="text-sm font-medium leading-normal">Trash</p>
              </div>
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
                <p className="text-xs text-muted-foreground mb-3">Get unlimited storage and advanced AI features.</p>
                <button className="w-full py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm">
                  Upgrade Now
                </button>
              </div>
            </div>
            
            <div className="mt-auto flex flex-col gap-1">
              <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg cursor-pointer transition-colors" onClick={() => signOut()}>
                <Settings className="h-4 w-4" />
                <p className="text-sm font-medium leading-normal">Sign Out</p>
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
              <h3 className="text-2xl font-bold text-primary">Drop screenshot here</h3>
              <p className="text-muted-foreground mt-2">Release to upload instantly</p>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* PageHeading */}
            <div>
              <p className="text-foreground text-4xl font-black leading-tight tracking-[-0.033em]">Your Screenshots</p>
            </div>

            {/* ToolBar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary outline-none transition-all" 
                    placeholder="Search screenshots..." 
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
                  {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                  <span>Add Screenshot</span>
                </button>
              </div>
            </div>

            {/* ImageGrid */}
            {screenshots === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : screenshots.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/50">
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No screenshots yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first screenshot to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {screenshots.map((screenshot) => (
                  <div 
                    key={screenshot._id} 
                    className="group relative flex flex-col gap-3 rounded-xl border border-transparent bg-card p-3 transition-all hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
                    onClick={() => setSelectedScreenshot(screenshot)}
                  >
                    <div className="relative w-full overflow-hidden rounded-lg aspect-video bg-secondary">
                      <img 
                        src={screenshot.url} 
                        alt={screenshot.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                        <button className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors">
                          <Star className="h-5 w-5" />
                        </button>
                        <button 
                          className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(screenshot._id);
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-foreground text-base font-medium leading-normal truncate" title={screenshot.title}>
                        {screenshot.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          screenshot.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'
                        }`}>
                          {screenshot.category || (screenshot.status === 'processing' ? 'Processing...' : 'Uncategorized')}
                        </span>
                        <p className="text-muted-foreground text-sm font-normal leading-normal ml-auto">
                          {new Date(screenshot._creationTime).toLocaleDateString()}
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
      <Dialog open={!!selectedScreenshot} onOpenChange={(open) => !open && setSelectedScreenshot(null)}>
        <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 bg-background border-border overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight tracking-tight">Screenshot Details</h2>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{selectedScreenshot?._id}</p>
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
                onClick={() => selectedScreenshot && handleDelete(selectedScreenshot._id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button 
                className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedScreenshot(null)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            {/* Left Panel - Details */}
            <div className="lg:col-span-3 border-r border-border bg-card/30 flex flex-col h-full overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="p-6 flex flex-col gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4" /> Metadata
                    </h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 text-sm">
                      <p className="text-muted-foreground font-medium">Filename</p>
                      <p className="text-foreground truncate font-medium" title={selectedScreenshot?.title}>{selectedScreenshot?.title}</p>
                      
                      <p className="text-muted-foreground font-medium">Date</p>
                      <p className="text-foreground">{selectedScreenshot && new Date(selectedScreenshot._creationTime).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                      
                      <p className="text-muted-foreground font-medium">Size</p>
                      <p className="text-foreground font-mono">{selectedScreenshot && (selectedScreenshot.size / 1024 / 1024).toFixed(2)} MB</p>
                      
                      <p className="text-muted-foreground font-medium">Dimensions</p>
                      <p className="text-foreground font-mono">{selectedScreenshot?.width || '?'} x {selectedScreenshot?.height || '?'}</p>
                      
                      <p className="text-muted-foreground font-medium">Type</p>
                      <p className="text-foreground font-mono text-xs">{selectedScreenshot?.mimeType}</p>
                    </div>
                  </div>
                  
                  <Separator />

                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> AI Analysis
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">Category</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedScreenshot?.category ? (
                            <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1 rounded-full">
                              {selectedScreenshot.category}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm italic">Uncategorized</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-2">
                        <span className="text-xs font-medium text-muted-foreground">Extracted Text</span>
                        <div className="bg-background rounded-lg border border-border p-3 text-xs text-muted-foreground font-mono max-h-40 overflow-y-auto leading-relaxed">
                          {selectedScreenshot?.ocrText ? selectedScreenshot.ocrText : "No text extracted."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Center Image */}
            <div className="lg:col-span-6 bg-black/5 flex items-center justify-center p-8 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[radial-gradient(#00000011_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <img 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl ring-1 ring-black/10" 
                  src={selectedScreenshot?.url} 
                  alt={selectedScreenshot?.title} 
                />
              </div>
            </div>

            {/* Right Panel - Actions */}
            <div className="lg:col-span-3 border-l border-border bg-card/30 flex flex-col h-full overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="p-6 flex flex-col gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Tags
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 bg-secondary text-secondary-foreground border border-secondary-foreground/10 text-xs font-medium px-2.5 py-1 rounded-md group cursor-pointer hover:bg-secondary/80 transition-colors">
                          Project X
                          <X className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                        </span>
                        <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary/50 text-xs font-medium px-2.5 py-1 rounded-md transition-all">
                          <Plus className="h-3 w-3" /> Add Tag
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />

                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Notes
                    </h3>
                    <textarea 
                      className="w-full h-64 bg-background border border-border rounded-lg text-sm p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed transition-all placeholder:text-muted-foreground/50" 
                      placeholder="Add a note about this screenshot..."
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