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
    if (!text) return <p className="text-muted-foreground italic">Analysis pending...</p>;
    
    if (!text.includes("###")) {
      return <div className="whitespace-pre-wrap text-sm text-muted-foreground">{text}</div>;
    }

    const parts = text.split("###").filter(part => part.trim());

    return (
      <div className="space-y-5">
        {parts.map((part, index) => {
          const lines = part.trim().split("\n");
          const title = lines[0];
          const content = lines.slice(1).filter(line => line.trim());

          let icon = null;
          let headerClass = "text-foreground";
          let bgClass = "bg-muted/30";
          let borderClass = "border-border/50";

          if (title.includes("🎯") || title.includes("Tailored")) {
            icon = <Target className="h-4 w-4 text-green-600" />;
            headerClass = "text-green-700 dark:text-green-400";
            bgClass = "bg-green-500/5";
            borderClass = "border-green-500/20";
          } else if (title.includes("🤖") || title.includes("Parsing")) {
            icon = <Cpu className="h-4 w-4 text-blue-600" />;
            headerClass = "text-blue-700 dark:text-blue-400";
            bgClass = "bg-blue-500/5";
            borderClass = "border-blue-500/20";
          }

          return (
            <div key={index} className={`rounded-xl ${bgClass} p-5 border ${borderClass} hover:shadow-md transition-all duration-200`}>
              <h4 className={`font-bold ${headerClass} mb-4 text-base flex items-center gap-2`}>
                {icon}
                {title}
              </h4>
              <div className="space-y-3 text-sm text-foreground/90">
                {content.map((line, i) => {
                  const trimmed = line.trim();
                  
                  if (/^\d+\./.test(trimmed)) {
                    const [number, ...rest] = trimmed.split(/\.\s+/);
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/30">
                        <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {number}
                        </span>
                        <span className="flex-1 leading-relaxed font-medium">{rest.join('. ')}</span>
                      </div>
                    );
                  }
                  
                  if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
                    return (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="flex-1 leading-relaxed">{trimmed.replace(/^[-•*]\s*/, "")}</span>
                      </div>
                    );
                  }
                  
                  if (trimmed.includes("**")) {
                    const parts = trimmed.split("**");
                    return (
                      <p key={i} className="leading-relaxed">
                        {parts.map((part, idx) => 
                          idx % 2 === 1 ? <strong key={idx} className="font-bold text-foreground">{part}</strong> : part
                        )}
                      </p>
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

  const criticalKeywords = displayResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'critical' : k.priority) === 'critical') || [];
  const importantKeywords = displayResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'important' : k.priority) === 'important') || [];
  
  const totalImpact = criticalKeywords.reduce((acc: number, curr: any) => acc + (curr.impact || 5), 0);

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
        className="w-screen h-[100dvh] max-w-none m-0 p-0 rounded-none border-none bg-background flex flex-col overflow-hidden shadow-none focus:outline-none top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0 sm:max-w-none print:h-auto print:overflow-visible"
      >
        <DialogTitle className="sr-only">Resume Analysis</DialogTitle>
        <DialogDescription className="sr-only">Detailed analysis of the selected resume</DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-tight tracking-tight truncate">ATS Analysis Report</h2>
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

        <div className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Main Content - Full Width Bento Grid */}
          <ScrollArea className="flex-1 h-full print:h-auto print:overflow-visible">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              
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
                <div className="space-y-6">
                  {/* Hero Section - Score Gauge */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-green-500/5"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h2 className="text-3xl font-black text-white mb-2">
                              {displayResume?.score >= 80 ? "🎉 Top 10% Candidate" : 
                               displayResume?.score >= 51 ? "⚠️ Needs Optimization" : 
                               "🚨 ATS Invisible"}
                            </h2>
                            <p className="text-slate-400">Your resume's ATS compatibility score</p>
                          </div>
                        </div>
                        
                        {/* Radial Progress Gauge */}
                        <div className="flex items-center justify-center mb-8">
                          <div className="relative w-64 h-64">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                              <circle
                                cx="100"
                                cy="100"
                                r="85"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-slate-800"
                              />
                              <circle
                                cx="100"
                                cy="100"
                                r="85"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${(displayResume?.score || 0) * 5.34} 534`}
                                className={
                                  displayResume?.score >= 80 ? "text-green-500" :
                                  displayResume?.score >= 51 ? "text-yellow-500" :
                                  "text-red-500"
                                }
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-6xl font-black text-white">{displayResume?.score || 0}</span>
                              <span className="text-slate-400 text-sm font-medium">/ 100</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="text-2xl font-bold text-white">{displayResume?.scoreBreakdown?.format || 0}%</div>
                            <div className="text-xs text-slate-400 mt-1">Parse Rate</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="text-2xl font-bold text-white">{displayResume?.scoreBreakdown?.keywords || 0}%</div>
                            <div className="text-xs text-slate-400 mt-1">Keyword Match</div>
                          </div>
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="text-2xl font-bold text-white">{displayResume?.missingKeywords?.length || 0}</div>
                            <div className="text-xs text-slate-400 mt-1">Missing Skills</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score History Card */}
                    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                      <ScoreHistory />
                    </div>
                  </div>

                  {/* Analysis Grid - Bento Layout */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Keywords Card */}
                    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        Keywords Analysis
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-slate-400 mb-2">Found Keywords</div>
                          <div className="flex flex-wrap gap-2">
                            {displayResume?.missingKeywords?.slice(0, 5).map((kw: any, i: number) => (
                              <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                                <CheckCircle2 className="h-3 w-3" />
                                {typeof kw === 'string' ? kw : kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 mb-2">Missing Keywords</div>
                          <div className="flex flex-wrap gap-2">
                            {criticalKeywords.slice(0, 5).map((kw: any, i: number) => (
                              <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                                <XCircle className="h-3 w-3" />
                                {typeof kw === 'string' ? kw : kw.keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Format Issues Card */}
                    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FileSearch className="h-5 w-5 text-purple-400" />
                        Formatting Check
                      </h3>
                      <div className="space-y-2">
                        {displayResume?.formatIssues?.slice(0, 4).map((issue: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                            {issue.severity === 'high' ? (
                              <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-white">{issue.issue}</div>
                              <div className="text-xs text-slate-400 mt-1">{issue.location}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Critical Issues */}
                  {criticalKeywords.length > 0 && (
                    <div className="bg-gradient-to-br from-red-950/50 to-slate-900/90 backdrop-blur-xl border-2 border-red-500/30 rounded-3xl p-6">
                      <CriticalIssues 
                        criticalKeywords={criticalKeywords}
                        totalImpact={totalImpact}
                      />
                    </div>
                  )}

                  {/* AI Recommendations - Expandable */}
                  <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      AI Recommendations
                    </h3>
                    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {renderAnalysis(displayResume?.analysis || "")}
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="bg-gradient-to-br from-blue-950/30 to-slate-900/90 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6">
                    <h4 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                      <Building className="h-4 w-4" /> Users got interviews at
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 border border-blue-500/20 text-xs font-medium text-blue-300">
                        Fortune 500
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 border border-blue-500/20 text-xs font-medium text-blue-300">
                        FAANG
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 border border-blue-500/20 text-xs font-medium text-blue-300">
                        Leading Startups
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

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
                <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-xl max-w-md">
                  <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Preview Not Available</h3>
                  <p className="text-muted-foreground mb-8">
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
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        <span className="font-bold text-primary">✨ Optimized for ATS:</span> We've rewritten your resume content to include missing keywords and improve readability for tracking systems.
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border border-border p-3 text-xs text-foreground font-mono max-h-[500px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                      {displayResume.rewrittenText}
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
                      <Eye className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-700 font-medium leading-relaxed">
                        This is exactly what the ATS sees. If your text is missing, garbled, or out of order here, the ATS cannot read your resume.
                      </p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg border border-border p-3 text-xs text-muted-foreground font-mono max-h-[500px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                    {displayResume?.ocrText ? displayResume.ocrText : "No text extracted."}
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