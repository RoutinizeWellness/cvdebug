import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { Image as ImageIcon, Loader2, Plus, Search, Trash2, Upload, FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.screenshots.generateUploadUrl);
  const createScreenshot = useMutation(api.screenshots.createScreenshot);
  const updateScreenshotOcr = useMutation(api.screenshots.updateScreenshotOcr);
  const deleteScreenshot = useMutation(api.screenshots.deleteScreenshot);
  
  const screenshots = useQuery(api.screenshots.getScreenshots, { search: search || undefined });

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();

      // 2. Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      // 3. Create record
      const screenshotId = await createScreenshot({
        storageId,
        title: file.name,
        width: 0, // We could get this from an image object
        height: 0,
        size: file.size,
        mimeType: file.type,
      });

      toast.success("Screenshot uploaded");

      // 4. Process OCR
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
      
      // Simple categorization based on keywords (Mocking AI for now)
      let category = "Uncategorized";
      const lowerText = text.toLowerCase();
      if (lowerText.includes("error") || lowerText.includes("fail")) category = "Errors";
      else if (lowerText.includes("invoice") || lowerText.includes("receipt")) category = "Finance";
      else if (lowerText.includes("code") || lowerText.includes("function")) category = "Development";
      else if (lowerText.includes("meeting") || lowerText.includes("zoom")) category = "Meetings";

      await updateScreenshotOcr({
        id: screenshotId,
        ocrText: text,
        category,
      });
      
      toast.success("OCR Processing Complete");
    } catch (error) {
      console.error("OCR Error:", error);
      toast.error("OCR processing failed");
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await deleteScreenshot({ id });
      toast.success("Screenshot deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Screenshot Organizer</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center text-sm text-muted-foreground">
              {user?.email}
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        className="flex-1 container mx-auto px-4 py-8 relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm border-2 border-dashed border-primary rounded-xl flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileUp className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary">Drop screenshot here</h3>
            <p className="text-muted-foreground mt-2">Release to upload instantly</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search content..." 
              className="pl-9 bg-secondary/50 border-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload Screenshot
            </Button>
          </div>
        </div>

        {screenshots === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : screenshots.length === 0 ? (
          <div 
            className={`text-center py-20 border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}
          >
            <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No screenshots yet</h3>
            <p className="text-muted-foreground mb-4">Upload your first screenshot to get started</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Plus className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {screenshots.map((screenshot) => (
              <div key={screenshot._id} className="group relative bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="aspect-video bg-secondary relative overflow-hidden">
                  <img 
                    src={screenshot.url} 
                    alt={screenshot.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleDelete(screenshot._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium truncate text-sm" title={screenshot.title}>
                      {screenshot.title}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                      screenshot.status === 'processing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {screenshot.category || screenshot.status}
                    </span>
                  </div>
                  
                  {screenshot.ocrText && (
                    <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                      {screenshot.ocrText}
                    </p>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(screenshot._creationTime).toLocaleDateString()}</span>
                    {screenshot.status === 'processing' && (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}