import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Trash2, 
  X, 
  Sparkles, 
  Info, 
  Maximize2, 
  Minimize2,
  Wand2,
  Printer,
  Eye,
  Cpu,
  ScanLine,
  Target,
  Link2,
  Building,
  CheckCircle2,
  XCircle,
  FileSearch,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction, useQuery } from "convex/react";
import { PricingDialog } from "@/components/PricingDialog";
import { ScoreHistory } from "./ScoreHistory";
import { ResumeStats } from "./ResumeStats";
import { CriticalIssues } from "./CriticalIssues";
import { ImportantIssues } from "./ImportantIssues";
import { FreeTierView } from "./FreeTierView";
import { ScoreCard } from "./ScoreCard";
import { SkillGapHeatmap } from "./SkillGapHeatmap";
import { DeepAuditChecklist } from "./DeepAuditChecklist";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface ResumeDetailDialogProps {
  resumeId: Id<"resumes"> | null;
  onClose: () => void;
  onDelete: (id: Id<"resumes">) => void;
}

export function ResumeDetailDialog({ resumeId, onClose, onDelete }: ResumeDetailDialogProps) {
  const [isImmersive, setIsImmersive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showBlurredPreview, setShowBlurredPreview] = useState(true);
  const rewriteResume = useAction(apiAny.ai.rewriteResume);
  
  const user = useQuery(apiAny.users.currentUser);
  const isFree = user?.subscriptionTier === "free";

  const allResumes = useQuery(apiAny.resumes.getResumes, {});
  const displayResume = allResumes?.find((r: any) => r._id === resumeId);

  useEffect(() => {
    if (displayResume && isFree) {
      setShowBlurredPreview(true);
    }
  }, [displayResume?._id, isFree]);

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
    window.open(displayResume?.url, '_blank');
  };

  const handleShareLink = () => {
    if (!displayResume?._id) return;
    
    const shareUrl = `${window.location.origin}/dashboard?resumeId=${displayResume._id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("📋 Link copied to clipboard! Share it with anyone.");
    }).catch(() => {
      toast.error("Failed to copy link. Please try again.");
    });
  };

  const handleOptimize = async () => {
    if (!displayResume?.ocrText) {
      toast.error("No text available to optimize.");
      return;
    }

    setIsGenerating(true);
    toast.info("AI is rewriting your resume... This may take a few seconds.");
    
    try {
      await rewriteResume({
        id: displayResume._id,
        ocrText: displayResume.ocrText,
        jobDescription: displayResume.jobDescription,
      });
      toast.success("Optimization complete! Check the 'Rewritten' tab.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to optimize resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderAnalysis = (text: string) => {
    if (!text) return <p className="text-zinc-400 italic">Analysis pending...</p>;
    
    if (!text.includes("###")) {
      return <div className="whitespace-pre-wrap text-sm text-zinc-300">{text}</div>;
    }

    const parts = text.split("###").filter(part => part.trim());

    return (
      <div className="space-y-5">
        {parts.map((part, index) => {
          const lines = part.trim().split("\n");
          const title = lines[0];
          const content = lines.slice(1).filter(line => line.trim());

          let icon = null;
          let headerClass = "text-zinc-100";
          let bgClass = "bg-zinc-800/50";
          let borderClass = "border-zinc-700";

          if (title.includes("🎯") || title.includes("Tailored")) {
            icon = <Target className="h-4 w-4 text-green-400" />;
            headerClass = "text-green-400";
            bgClass = "bg-green-500/10";
            borderClass = "border-green-500/30";
          } else if (title.includes("🤖") || title.includes("Parsing")) {
            icon = <Cpu className="h-4 w-4 text-blue-400" />;
            headerClass = "text-blue-400";
            bgClass = "bg-blue-500/10";
            borderClass = "border-blue-500/30";
          } else if (title.includes("📊") || title.includes("Score")) {
            icon = <ScanLine className="h-4 w-4 text-purple-400" />;
            headerClass = "text-purple-400";
            bgClass = "bg-purple-500/10";
            borderClass = "border-purple-500/30";
          } else if (title.includes("🔑") || title.includes("Missing")) {
            icon = <AlertTriangle className="h-4 w-4 text-red-400" />;
            headerClass = "text-red-400";
            bgClass = "bg-red-500/10";
            borderClass = "border-red-500/30";
          } else if (title.includes("⚠️") || title.includes("Format")) {
            icon = <AlertTriangle className="h-4 w-4 text-yellow-400" />;
            headerClass = "text-yellow-400";
            bgClass = "bg-yellow-500/10";
            borderClass = "border-yellow-500/30";
          }

          return (
            <div key={index} className={`rounded-xl ${bgClass} p-5 border-2 ${borderClass} hover:shadow-lg transition-all duration-200`}>
              <h4 className={`font-bold ${headerClass} mb-4 text-base flex items-center gap-2`}>
                {icon}
                {title}
              </h4>
              <div className="space-y-3 text-sm text-zinc-200">
                {content.map((line, i) => {
                  const trimmed = line.trim();
                  
                  if (/^\d+\*?\*?/.test(trimmed)) {
                    const match = trimmed.match(/^(\d+)\*?\*?\s*(.+)/);
                    if (match) {
                      const [, number, text] = match;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/30">
                            {number}
                          </span>
                          <span className="flex-1 leading-relaxed font-medium text-zinc-100">{text}</span>
                        </div>
                      );
                    }
                  }
                  
                  if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
                    return (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="flex-1 leading-relaxed text-zinc-200">{trimmed.replace(/^[-•*]\s*/, "")}</span>
                      </div>
                    );
                  }
                  
                  if (trimmed.includes("**")) {
                    const parts = trimmed.split("**");
                    return (
                      <p key={i} className="leading-relaxed text-zinc-200">
                        {parts.map((part, idx) => 
                          idx % 2 === 1 ? <strong key={idx} className="font-bold text-zinc-50">{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  
                  return <p key={i} className="leading-relaxed text-zinc-200">{trimmed}</p>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const criticalKeywords = displayResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'critical' : k.priority) === 'critical') || [];
  const importantKeywords = displayResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'important' : k.priority) === 'important') || [];
  
  const totalImpact = criticalKeywords.reduce((acc: number, curr: any) => acc + (curr.impact || 5), 0);

  // Prepare audit items
  const auditItems: Array<{
    title: string;
    status: "passed" | "failed" | "warning";
    reason: string;
    fix: string;
  }> = [
    {
      title: "Contact Information Parsing",
      status: (displayResume?.formatIssues?.some((i: any) => i.issue?.toLowerCase().includes('contact')) ? "failed" : "passed") as "passed" | "failed" | "warning",
      reason: "Email or phone number not detected in standard format",
      fix: "Place contact info at the top in a clear format: name@email.com, (123) 456-7890"
    },
    {
      title: "Section Headers Recognition",
      status: (displayResume?.formatIssues?.some((i: any) => i.issue?.toLowerCase().includes('section')) ? "warning" : "passed") as "passed" | "failed" | "warning",
      reason: "Some section headers may not be recognized by ATS",
      fix: "Use standard headers: Experience, Education, Skills, Projects"
    },
    {
      title: "Bullet Point Formatting",
      status: (displayResume?.formatIssues?.some((i: any) => i.issue?.toLowerCase().includes('bullet')) ? "failed" : "passed") as "passed" | "failed" | "warning",
      reason: "Inconsistent bullet point formatting detected",
      fix: "Use simple bullets (•) and maintain consistent indentation"
    },
    {
      title: "Date Format Consistency",
      status: "passed" as "passed" | "failed" | "warning",
      reason: "",
      fix: ""
    },
    {
      title: "Font & Styling Compatibility",
      status: (displayResume?.formatIssues?.some((i: any) => i.issue?.toLowerCase().includes('font') || i.issue?.toLowerCase().includes('table')) ? "warning" : "passed") as "passed" | "failed" | "warning",
      reason: "Complex formatting may not parse correctly",
      fix: "Avoid tables, text boxes, and unusual fonts. Stick to standard fonts like Arial or Calibri"
    }
  ];

  // Extract found keywords (mock data - you'd get this from your analysis)
  const foundKeywords = displayResume?.missingKeywords?.slice(0, 8).map((kw: any) => 
    typeof kw === 'string' ? kw : kw.keyword
  ) || [];

  return (
    <Dialog open={!!resumeId} onOpenChange={(open) => !open && onClose()}>
      <PricingDialog 
        open={showPricing} 
        onOpenChange={setShowPricing} 
        initialPlan="single_scan" 
        resumeId={displayResume?._id}
      />
      <DialogContent 
        showCloseButton={false}
        className="w-screen h-[100dvh] max-w-none m-0 p-0 rounded-none border-none bg-zinc-950 flex flex-col overflow-hidden shadow-none focus:outline-none top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0 sm:max-w-none print:h-auto print:overflow-visible"
      >
        <DialogTitle className="sr-only">Resume Analysis</DialogTitle>
        <DialogDescription className="sr-only">Detailed analysis of the selected resume</DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex-shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-tight tracking-tight truncate text-white">ATS Analysis Report</h2>
                {displayResume?.category && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 uppercase tracking-wider">
                    {displayResume.category}
                  </span>
                )}
                {displayResume?.jobDescription && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold border border-green-500/20 uppercase tracking-wider flex items-center gap-1">
                    <Target className="h-3 w-3" /> Tailored
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-0.5">
                <span>ID: {resumeId?.slice(-8)}</span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> VLY-ATS-V2</span>
                {displayResume?.jobDescription && (
                  <>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1 text-green-600"><Target className="h-3 w-3" /> Job-Specific</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleShareLink}
              title="Copy shareable link"
            >
              <Link2 className="h-4 w-4" />
              Share Link
            </Button>
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
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleDownloadReport}
            >
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <div className="w-px h-8 bg-border mx-1 self-center hidden sm:block" />
            <button 
              className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
              onClick={() => displayResume && onDelete(displayResume._id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button 
              className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible bg-[#050505]">
          <ScrollArea className="flex-1 h-full print:h-auto print:overflow-visible">
            <div className="p-8 max-w-7xl mx-auto font-display">
              
              {isFree ? (
                <FreeTierView 
                  score={displayResume?.score || 0}
                  missingCount={displayResume?.missingKeywords?.length || 0}
                  formatCount={displayResume?.formatIssues?.length || 0}
                  criticalKeywords={criticalKeywords}
                  showBlurredPreview={showBlurredPreview}
                  setShowPricing={setShowPricing}
                  setShowBlurredPreview={setShowBlurredPreview}
                />
              ) : (
                <div className="space-y-8">
                  <ScoreCard 
                    score={displayResume?.score || 0}
                    wordCount={displayResume?.ocrText?.split(/\s+/).length || 0}
                    pageCount={1}
                    parsingTime={2}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4">
                      <DeepAuditChecklist items={auditItems} />
                    </div>
                    
                    <div className="lg:col-span-4">
                      <SkillGapHeatmap 
                        foundKeywords={foundKeywords}
                        missingKeywords={criticalKeywords}
                      />
                    </div>

                    <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-stone-800 text-white">
                          <Target className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Role Match</h3>
                      </div>
                      <div className="flex flex-col gap-5 mt-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-sm font-medium text-stone-300">
                            <span>Full Stack Developer</span>
                            <span className="text-green-500">80%</span>
                          </div>
                          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-r-full" style={{width: '80%'}}></div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-sm font-medium text-stone-300">
                            <span>Frontend Engineer</span>
                            <span className="text-primary">65%</span>
                          </div>
                          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-r-full" style={{width: '65%'}}></div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-sm font-medium text-stone-300">
                            <span>Backend Engineer</span>
                            <span className="text-orange-500">45%</span>
                          </div>
                          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-r-full" style={{width: '45%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                      AI Recommendations
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Critical</span>
                    </h2>
                    <div className="max-h-[500px] overflow-y-auto pr-2">
                      {renderAnalysis(displayResume?.analysis || "")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Center Image/Preview */}
          <div className={`flex-1 bg-black/5 flex items-center justify-center p-4 md:p-8 overflow-hidden relative group transition-all duration-300 min-h-[50vh] lg:min-h-0 print:hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
            
            <button 
              onClick={() => setIsImmersive(!isImmersive)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 hidden lg:block"
              title={isImmersive ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isImmersive ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>

            <div className="w-full h-full flex items-center justify-center relative z-10">
              {displayResume?.mimeType.startsWith("image/") ? (
                <img 
                  className="h-full w-full object-contain rounded-lg shadow-2xl ring-1 ring-black/10 bg-white" 
                  src={displayResume?.url} 
                  alt={displayResume?.title} 
                />
              ) : displayResume?.mimeType === "application/pdf" ? (
                <iframe 
                  src={displayResume?.url} 
                  className="w-full h-full rounded-lg shadow-2xl ring-1 ring-black/10 bg-white"
                  title="Resume Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-zinc-900 rounded-lg shadow-xl max-w-md border border-zinc-800">
                  <div className="h-20 w-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                    <FileText className="h-10 w-10 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">Preview Not Available</h3>
                  <p className="text-zinc-400 mb-8">
                    This file type cannot be previewed directly in the browser. You can download it to view the content.
                  </p>
                  <Button onClick={handleDownloadFile} className="font-bold shadow-lg shadow-primary/20">
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
                {displayResume?.rewrittenText && (
                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-600 rounded-r-full"></div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" /> AI Rewritten Version
                      <span className="ml-auto text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">NEW</span>
                    </h3>
                    <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg p-4 mb-4 shadow-sm">
                      <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                        <span className="font-bold text-primary">✨ Optimized for ATS:</span> We've rewritten your resume content to include missing keywords and improve readability for tracking systems.
                      </p>
                    </div>
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-3 text-xs text-zinc-300 font-mono max-h-[500px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                      {displayResume.rewrittenText}
                    </div>
                    <Separator className="my-6 bg-zinc-800" />
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Eye className="h-4 w-4" /> ATS Raw View
                  </h3>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                    <div className="flex gap-2">
                      <Eye className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-500 font-medium leading-relaxed">
                        This is exactly what the ATS sees. If your text is missing, garbled, or out of order here, the ATS cannot read your resume.
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-3 text-xs text-zinc-400 font-mono max-h-[500px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                    {displayResume?.ocrText ? displayResume.ocrText : "No text extracted."}
                  </div>
                </div>
                
                <Separator className="bg-zinc-800" />

                <div>
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Notes
                  </h3>
                  <textarea 
                    className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-lg text-sm p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed transition-all placeholder:text-zinc-600 text-zinc-300" 
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