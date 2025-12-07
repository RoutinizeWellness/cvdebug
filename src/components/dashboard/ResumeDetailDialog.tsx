import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  Code,
  Wand2,
  Printer,
  Eye,
  AlertTriangle,
  Cpu,
  ScanLine,
  Check,
  Clock
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Lock } from "lucide-react";
import { PricingDialog } from "@/components/PricingDialog";

interface ResumeDetailDialogProps {
  selectedResume: any;
  setSelectedResume: (resume: any) => void;
  handleDelete: (id: any) => void;
}

export function ResumeDetailDialog({ selectedResume, setSelectedResume, handleDelete }: ResumeDetailDialogProps) {
  const [isImmersive, setIsImmersive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const rewriteResume = useAction(api.ai.rewriteResume);
  
  // Fetch user to check subscription
  const user = useQuery(api.users.currentUser);
  const isFree = user?.subscriptionTier === "free";

  const handleDownloadReport = () => {
    if (isFree) {
      setShowPricing(true);
      return;
    }
    window.print();
  };

  const handleDownloadFile = () => {
    if (isFree) {
      setShowPricing(true);
      return;
    }
    window.open(selectedResume?.url, '_blank');
  };

  const handleOptimize = async () => {
    if (!selectedResume?.ocrText) {
      toast.error("No text available to optimize.");
      return;
    }

    setIsGenerating(true);
    toast.info("AI is rewriting your resume... This may take a few seconds.");
    
    try {
      await rewriteResume({
        id: selectedResume._id,
        ocrText: selectedResume.ocrText,
        jobDescription: selectedResume.jobDescription,
      });
      toast.success("Optimization complete! Check the 'Rewritten' tab.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to optimize resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to render markdown-like analysis
  const renderAnalysis = (text: string) => {
    if (!text) return <p className="text-muted-foreground italic">Analysis pending...</p>;
    
    // Free Tier Masking for Analysis
    if (isFree) {
      return (
        <div className="relative">
          <div className="space-y-4 filter blur-sm select-none pointer-events-none opacity-50">
             {/* Fake content for blur effect */}
             <div className="rounded-xl bg-muted/30 p-4 border border-border/50">
                <h4 className="font-bold text-foreground mb-3 text-sm">🤖 ATS Parsing Report</h4>
                <p className="text-sm text-muted-foreground">The parser successfully identified your contact information but failed to read the skills section correctly due to...</p>
             </div>
             <div className="rounded-xl bg-muted/30 p-4 border border-border/50">
                <h4 className="font-bold text-foreground mb-3 text-sm">📉 Score Drivers</h4>
                <p className="text-sm text-muted-foreground">-10 points for missing metrics in experience section...</p>
             </div>
             <div className="rounded-xl bg-muted/30 p-4 border border-border/50">
                <h4 className="font-bold text-foreground mb-3 text-sm">🛠️ Fixes to Reach Top 10%</h4>
                <p className="text-sm text-muted-foreground">Actionable steps to improve your resume...</p>
             </div>
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
            <div className="bg-background/95 backdrop-blur-md p-6 rounded-2xl border border-border shadow-2xl text-center max-w-sm w-full relative overflow-hidden">
              {/* Urgency Banner */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold py-1 flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" /> Beta Offer Ends Soon
              </div>

              <div className="mt-4 mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-black text-xl mb-1">Unlock Full Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  See exactly why your resume is scoring <span className="font-bold text-foreground">{selectedResume?.score || 0}/100</span>.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="bg-muted/30 rounded-lg p-3 mb-4 text-xs">
                <div className="flex justify-between items-center border-b border-border/50 pb-2 mb-2">
                  <span className="font-medium text-muted-foreground">Feature</span>
                  <div className="flex gap-4">
                    <span className="font-bold text-muted-foreground">Free</span>
                    <span className="font-bold text-primary">Pro</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ATS Score</span>
                    <div className="flex gap-6">
                      <Check className="h-3 w-3 text-green-500" />
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Missing Keywords</span>
                    <div className="flex gap-6">
                      <span className="text-muted-foreground">1</span>
                      <span className="font-bold text-green-500">All</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Detailed Fixes</span>
                    <div className="flex gap-6">
                      <X className="h-3 w-3 text-red-400" />
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-5 w-5 rounded-full border border-background bg-muted overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} alt="User" className="h-full w-full" />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground">
                  <span className="font-bold text-foreground">53 people</span> upgraded today
                </p>
              </div>

              <Button onClick={() => setShowPricing(true)} className="w-full font-bold shadow-lg shadow-primary/20 h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                Unlock Report - $4.99
              </Button>
              <p className="text-[10px] text-muted-foreground mt-2">
                One-time payment. No subscription.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // If it doesn't look like our markdown, return as is
    if (!text.includes("###")) {
      return <div className="whitespace-pre-wrap text-sm text-muted-foreground">{text}</div>;
    }

    const parts = text.split("###").filter(part => part.trim());

    return (
      <div className="space-y-4">
        {parts.map((part, index) => {
          const lines = part.trim().split("\n");
          const title = lines[0];
          const content = lines.slice(1).filter(line => line.trim());

          return (
            <div key={index} className="rounded-xl bg-muted/30 p-4 border border-border/50 hover:bg-muted/50 transition-colors">
              <h4 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
                {title}
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {content.map((line, i) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="flex-1 leading-relaxed">{trimmed.replace(/^[-•*]\s*/, "")}</span>
                      </div>
                    );
                  }
                  return <p key={i} className="leading-relaxed">{trimmed}</p>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
      <PricingDialog open={showPricing} onOpenChange={setShowPricing} initialPlan="single_scan" />
      <DialogContent 
        showCloseButton={false}
        className="w-screen h-[100dvh] max-w-none m-0 p-0 rounded-none border-none bg-background flex flex-col overflow-hidden shadow-none focus:outline-none top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0 sm:max-w-none print:h-auto print:overflow-visible"
      >
        <DialogTitle className="sr-only">Resume Analysis</DialogTitle>
        <DialogDescription className="sr-only">Detailed analysis of the selected resume</DialogDescription>
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-tight tracking-tight truncate">ATS Analysis Report</h2>
                {selectedResume?.category && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 uppercase tracking-wider">
                    {selectedResume.category}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-0.5">
                <span>ID: {selectedResume?._id?.slice(-8)}</span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> VLY-ATS-V2</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleOptimize}
              disabled={isGenerating}
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "Optimizing..." : "AI Rewrite"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleDownloadFile}
            >
              {isFree && <Lock className="h-3 w-3 text-orange-500 mr-1" />}
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleDownloadReport}
            >
              {isFree && <Lock className="h-3 w-3 text-orange-500 mr-1" />}
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
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

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden print:block print:overflow-visible">
          {/* Left Panel - Details */}
          <div className={`w-full lg:w-80 xl:w-96 border-r border-border bg-card/30 flex flex-col flex-shrink-0 lg:h-full ${isImmersive ? 'hidden' : ''} print:block print:w-full print:border-none`}>
            <ScrollArea className="flex-1 h-full print:h-auto print:overflow-visible">
              <div className="p-6 flex flex-col gap-8">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart className="h-4 w-4" /> ATS Score Analysis
                  </h3>
                  
                  <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6 shadow-sm print:border-none print:shadow-none">
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
                        <span className={`text-lg font-bold ${
                          (selectedResume?.scoreBreakdown?.keywords || 0) >= 70 ? 'text-green-500' : 
                          (selectedResume?.scoreBreakdown?.keywords || 0) >= 40 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {selectedResume?.scoreBreakdown?.keywords ?? "-"}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Keywords</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/30 rounded-lg text-center">
                        <span className={`text-lg font-bold ${
                          (selectedResume?.scoreBreakdown?.format || 0) >= 70 ? 'text-green-500' : 
                          (selectedResume?.scoreBreakdown?.format || 0) >= 40 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {selectedResume?.scoreBreakdown?.format ?? "-"}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Format</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/30 rounded-lg text-center">
                        <span className={`text-lg font-bold ${
                          (selectedResume?.scoreBreakdown?.completeness || 0) >= 70 ? 'text-green-500' : 
                          (selectedResume?.scoreBreakdown?.completeness || 0) >= 40 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {selectedResume?.scoreBreakdown?.completeness ?? "-"}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Completeness</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW: Missing Keywords Section (Free Tier Logic) */}
                {isFree && selectedResume?.missingKeywords && selectedResume.missingKeywords.length > 0 && (
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-orange-700 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Missing Keywords
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-background p-2 rounded border border-orange-500/10">
                        <span className="text-sm font-medium">{selectedResume.missingKeywords[0]}</span>
                        <span className="text-[10px] text-red-500 font-bold uppercase">Critical</span>
                      </div>
                      {selectedResume.missingKeywords.length > 1 && (
                        <div className="relative">
                          <div className="space-y-2 filter blur-[2px] opacity-50 select-none">
                             <div className="bg-background p-2 rounded border border-border h-9"></div>
                             <div className="bg-background p-2 rounded border border-border h-9"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 text-xs font-bold shadow-sm"
                              onClick={() => setShowPricing(true)}
                            >
                              <Lock className="h-3 w-3 mr-1.5" />
                              Unlock {selectedResume.missingKeywords.length - 1} more
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <Separator className="print:hidden" />

                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> AI Recommendations
                  </h3>
                  <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
                    {renderAnalysis(selectedResume?.analysis)}
                  </div>
                </div>

                <Separator className="print:hidden" />

                <div className="print:hidden">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Info className="h-4 w-4" /> Metadata
                  </h3>
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 text-sm">
                    <p className="text-muted-foreground font-medium">Filename</p>
                    <p className="text-foreground truncate font-medium" title={selectedResume?.title}>{selectedResume?.title}</p>
                    
                    <p className="text-muted-foreground font-medium">Date</p>
                    <p className="text-foreground">{selectedResume && new Date(selectedResume._creationTime).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    
                    <p className="text-muted-foreground font-medium">Category</p>
                    <p className="text-foreground">
                      {selectedResume?.category ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                          {selectedResume.category}
                        </span>
                      ) : "Uncategorized"}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Center Image/Preview */}
          <div className={`flex-1 bg-black/5 flex items-center justify-center p-4 md:p-8 overflow-hidden relative group transition-all duration-300 min-h-[50vh] lg:min-h-0 print:hidden`}>
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
              ) : selectedResume?.mimeType === "application/pdf" ? (
                <iframe 
                  src={selectedResume?.url} 
                  className="w-full h-full rounded-lg shadow-2xl ring-1 ring-black/10 bg-white"
                  title="Resume Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-xl max-w-md">
                  <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Preview Not Available</h3>
                  <p className="text-muted-foreground mb-8">
                    This file type cannot be previewed directly in the browser. You can download it to view the content.
                  </p>
                  <Button onClick={handleDownloadFile} className="font-bold shadow-lg shadow-primary/20">
                    {isFree && <Lock className="h-3 w-3 mr-2" />}
                    <Download className="h-4 w-4 mr-2" /> Download File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Actions */}
          <div className={`w-full lg:w-80 xl:w-96 border-l border-border bg-card/30 flex flex-col flex-shrink-0 lg:h-full ${isImmersive ? 'hidden' : ''} print:hidden`}>
            <ScrollArea className="flex-1 h-full">
              <div className="p-6 flex flex-col gap-8">
                {selectedResume?.rewrittenText && (
                  <div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> AI Rewritten Version
                    </h3>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
                      <p className="text-xs text-primary font-medium leading-relaxed">
                        Here is an optimized version of your resume content, ready for ATS.
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border border-border p-3 text-xs text-foreground font-mono max-h-[500px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                      {selectedResume.rewrittenText}
                    </div>
                    <Separator className="my-6" />
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" /> ATS Raw View
                  </h3>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                    <div className="flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-700 font-medium leading-relaxed">
                        This is exactly what the ATS sees. If your text is missing, garbled, or out of order here, the ATS cannot read your resume.
                      </p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg border border-border p-3 text-xs text-muted-foreground font-mono max-h-[500px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
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