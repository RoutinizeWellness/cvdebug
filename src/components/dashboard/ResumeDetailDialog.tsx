import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Share, 
  Download, 
  Trash2, 
  X, 
  BarChart, 
  Sparkles, 
  Info, 
  Maximize2, 
  Minimize2, 
  Code 
} from "lucide-react";
import { useState } from "react";

interface ResumeDetailDialogProps {
  selectedResume: any;
  setSelectedResume: (resume: any) => void;
  handleDelete: (id: any) => void;
}

export function ResumeDetailDialog({ selectedResume, setSelectedResume, handleDelete }: ResumeDetailDialogProps) {
  const [isImmersive, setIsImmersive] = useState(false);

  // Helper for Circular Progress
  const CircularScore = ({ score }: { score: number }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    let color = "text-red-500";
    if (score >= 80) color = "text-green-500";
    else if (score >= 50) color = "text-yellow-500";

    return (
      <div className="relative h-24 w-24 flex items-center justify-center flex-shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72">
          {/* Background Circle */}
          <circle
            className="text-muted/20"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="36"
            cy="36"
          />
          {/* Progress Circle */}
          <circle
            className={`${color} transition-all duration-1000 ease-out`}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="36"
            cy="36"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase">ATS Score</span>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!selectedResume} onOpenChange={(open) => !open && setSelectedResume(null)}>
      <DialogContent className="w-full h-full max-w-none p-0 bg-background border-none rounded-none overflow-hidden flex flex-col shadow-none top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold leading-tight tracking-tight truncate">Resume Analysis</h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-[200px]">{selectedResume?._id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground hidden sm:block" title="Share">
              <Share className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground hidden sm:block" title="Download">
              <Download className="h-4 w-4" />
            </button>
            <div className="w-px h-8 bg-border mx-1 self-center hidden sm:block" />
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

        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
          {/* Left Panel - Details */}
          <div className={`lg:col-span-3 border-r border-border bg-card/30 flex flex-col lg:h-full ${isImmersive ? 'hidden' : ''}`}>
            <ScrollArea className="flex-1 h-full">
              <div className="p-6 flex flex-col gap-8">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart className="h-4 w-4" /> ATS Score Analysis
                  </h3>
                  
                  <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <CircularScore score={selectedResume?.score || 0} />
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h4 className="text-lg font-bold text-foreground">
                          {(selectedResume?.score || 0) >= 80 ? 'Excellent Match' : 
                           (selectedResume?.score || 0) >= 50 ? 'Needs Improvement' : 
                           'Poor Match'}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {(selectedResume?.score || 0) >= 80 ? 'Your resume is well-optimized for ATS algorithms.' : 
                           (selectedResume?.score || 0) >= 50 ? 'You have some good content, but formatting or keywords need work.' : 
                           'Your resume may be rejected by ATS. Critical fixes needed.'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/30 rounded-lg text-center">
                        <span className="text-xs font-bold text-foreground">40%</span>
                        <span className="text-[10px] text-muted-foreground">Keywords</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/30 rounded-lg text-center">
                        <span className="text-xs font-bold text-foreground">30%</span>
                        <span className="text-[10px] text-muted-foreground">Format</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/30 rounded-lg text-center">
                        <span className="text-xs font-bold text-foreground">30%</span>
                        <span className="text-[10px] text-muted-foreground">Completeness</span>
                      </div>
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

          {/* Center Image/Preview */}
          <div className={`${isImmersive ? 'lg:col-span-12' : 'lg:col-span-6'} bg-black/5 flex items-center justify-center p-4 md:p-8 overflow-hidden relative group transition-all duration-300 min-h-[50vh] lg:min-h-0`}>
            <div className="absolute inset-0 bg-[radial-gradient(#00000011_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
            
            <button 
              onClick={() => setIsImmersive(!isImmersive)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 hidden lg:block"
              title={isImmersive ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isImmersive ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>

            <div className="w-full h-full flex items-center justify-center relative z-10">
              {selectedResume?.mimeType.startsWith("image/") ? (
                <img 
                  className="h-full w-full object-contain rounded-lg shadow-2xl ring-1 ring-black/10 bg-white" 
                  src={selectedResume?.url} 
                  alt={selectedResume?.title} 
                />
              ) : (
                <iframe 
                  src={selectedResume?.url} 
                  className="w-full h-full rounded-lg shadow-2xl ring-1 ring-black/10 bg-white"
                  title="Resume Preview"
                />
              )}
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className={`lg:col-span-3 border-l border-border bg-card/30 flex flex-col lg:h-full ${isImmersive ? 'hidden' : ''}`}>
            <ScrollArea className="flex-1 h-full">
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
  );
}
