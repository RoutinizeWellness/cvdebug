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
  Clock,
  LayoutTemplate,
  Target,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Star
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Lock, Briefcase, Building } from "lucide-react";
import { PricingDialog } from "@/components/PricingDialog";
import { ScoreHistory } from "./ScoreHistory";
import { Progress } from "@/components/ui/progress";

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

  const criticalKeywords = selectedResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'critical' : k.priority) === 'critical') || [];
  const importantKeywords = selectedResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'important' : k.priority) === 'important') || [];
  const niceToHaveKeywords = selectedResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'nice-to-have' : k.priority) === 'nice-to-have') || [];
  
  const totalImpact = criticalKeywords.reduce((acc: number, curr: any) => acc + (curr.impact || 5), 0);

  const FreeTierView = () => {
    const score = selectedResume?.score || 0;
    const target = 75;
    const gap = Math.max(0, target - score);
    const missingCount = selectedResume?.missingKeywords?.length || 0;
    const formatCount = selectedResume?.formatIssues?.length || 0;

    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Match Rate</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-black text-foreground">{score}%</span>
                  <span className="text-sm text-muted-foreground font-medium">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                  <Target className="h-3.5 w-3.5" />
                  Target: {target}%+
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={score} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>Current: {score}%</span>
                <span>Target: {target}%</span>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground font-medium mb-1">Gap to target</p>
                <p className="text-lg font-bold text-red-500">{gap > 0 ? `${gap}%` : "Target Met!"}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="text-xs text-muted-foreground font-medium mb-1">Est. fix time</p>
                <p className="text-lg font-bold text-foreground">~10 mins</p>
              </div>
            </div>

            {/* Locked Insights */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Missing {missingCount} keywords</p>
                    <p className="text-xs text-muted-foreground">Critical for ATS visibility</p>
                  </div>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{formatCount} format issues</p>
                    <p className="text-xs text-muted-foreground">Parsing errors detected</p>
                  </div>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button 
                onClick={() => setShowPricing(true)} 
                className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                Unlock Full Analysis - $4.99
              </Button>
              <p className="text-center text-[10px] text-muted-foreground mt-3">
                One-time payment • No subscription
              </p>
            </div>
          </div>

          {/* What you get */}
          <div className="bg-muted/30 p-6 border-t border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
              What you get for $4.99:
            </p>
            <div className="space-y-2.5">
              {[
                "List of all missing keywords",
                "Exact sections to add them",
                "Format issues with specific fixes",
                "Downloadable PDF report",
                "Priority email support"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="h-4 w-4 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-2.5 w-2.5 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> Recent Success Stories
          </h3>
          <div className="grid gap-3">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="text-xs text-foreground leading-relaxed mb-2">
                "I was stuck at 65% match. Unlocked the report, added the missing keywords, and got an interview request the next morning."
              </p>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Sarah J. • Hired at TechCorp</span>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="text-xs text-foreground leading-relaxed mb-2">
                "The format checker found a table that was breaking my resume. Fixed it in 5 mins."
              </p>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" alt="Mike" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Mike T. • Product Manager</span>
              </div>
            </div>
          </div>
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
                {selectedResume?.jobDescription && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold border border-green-500/20 uppercase tracking-wider flex items-center gap-1">
                    <Target className="h-3 w-3" /> Tailored
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-0.5">
                <span>ID: {selectedResume?._id?.slice(-8)}</span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> VLY-ATS-V2</span>
                {selectedResume?.jobDescription && (
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
              <div className="p-6 flex flex-col gap-6">
                
                {isFree ? (
                  <FreeTierView />
                ) : (
                  <>
                    {/* 1. Match Rate Card */}
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Your Match Rate</h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className={`text-4xl font-black ${(selectedResume?.score || 0) >= 75 ? 'text-green-500' : 'text-foreground'}`}>
                              {selectedResume?.score || 0}%
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Target: 75%+
                            </span>
                          </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Target className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Progress value={selectedResume?.score || 0} className="h-2.5" />
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                          <span>Low</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                        <p className="text-xs font-medium leading-relaxed">
                          {(selectedResume?.score || 0) >= 75 
                            ? "🎉 You're matched! Your resume is well-optimized for this role."
                            : `You're ${selectedResume?.score || 0}% matched! Add ${Math.max(0, 10 - (selectedResume?.scoreBreakdown?.keywords ? Math.floor(selectedResume.scoreBreakdown.keywords / 10) : 0))} more keywords to hit 75%.`
                          }
                        </p>
                        {(selectedResume?.score || 0) < 75 && (
                          <Button variant="link" className="h-auto p-0 text-xs font-bold text-primary mt-2" onClick={() => document.getElementById('critical-issues')?.scrollIntoView({ behavior: 'smooth' })}>
                            See What to Fix <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* 2. Critical Issues (Red) */}
                    <div id="critical-issues" className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
                      <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/10 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-red-600 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" /> CRITICAL (Fix First)
                        </h3>
                        <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                          {criticalKeywords.length} Issues
                        </span>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Missing Required Skills:</p>
                          <div className="space-y-3">
                            {criticalKeywords.map((item: any, i: number) => (
                              <div key={i} className="flex flex-col gap-1 pb-3 border-b border-red-500/10 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                  <span className="text-sm font-bold text-foreground flex items-center gap-2">
                                    • {typeof item === 'string' ? item : item.keyword}
                                    {item.frequency && <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 rounded">(mentioned {item.frequency}x)</span>}
                                  </span>
                                </div>
                                <div className="pl-3.5 flex items-center gap-1 text-xs text-red-600/80 font-medium">
                                  <ArrowRight className="h-3 w-3" /> Add to Skills section
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-background rounded-lg p-3 border border-red-500/10 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">Impact</p>
                            <p className="text-xs text-muted-foreground">+{totalImpact > 0 ? totalImpact : 15}% match if fixed</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Important Issues (Yellow) */}
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl overflow-hidden">
                      <div className="bg-yellow-500/10 px-4 py-3 border-b border-yellow-500/10 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-yellow-700 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> IMPORTANT (Optimize)
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${((selectedResume?.formatIssues?.length || 0) + importantKeywords.length) === 0 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
                          {(selectedResume?.formatIssues?.length || 0) + importantKeywords.length} Issues
                        </span>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        {((selectedResume?.formatIssues?.length || 0) + importantKeywords.length) === 0 ? (
                          <div className="flex flex-col items-center justify-center py-4 text-center">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                            <p className="text-sm font-bold text-foreground">No Important Issues Found!</p>
                            <p className="text-xs text-muted-foreground">Your resume formatting and important keywords look good.</p>
                          </div>
                        ) : (
                          <>
                            {selectedResume?.formatIssues && selectedResume.formatIssues.length > 0 && (
                              <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Format Issues:</p>
                                <div className="space-y-3">
                                  {selectedResume.formatIssues.map((issue: string, i: number) => (
                                    <div key={i} className="flex flex-col gap-1 pb-3 border-b border-yellow-500/10 last:border-0 last:pb-0">
                                      <span className="text-sm font-medium text-foreground flex items-start gap-2">
                                        • {issue}
                                      </span>
                                      <div className="pl-3.5 flex items-center gap-1 text-xs text-yellow-700/80 font-medium">
                                        <ArrowRight className="h-3 w-3" /> Fix formatting
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {importantKeywords.length > 0 && (
                              <div className="mt-4">
                                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Important Skills:</p>
                                 <div className="space-y-2">
                                    {importantKeywords.map((item: any, i: number) => (
                                      <div key={i} className="text-sm text-foreground flex items-center gap-2">
                                        • {typeof item === 'string' ? item : item.keyword}
                                      </div>
                                    ))}
                                 </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <ScoreHistory />

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <Building className="h-3 w-3" /> Users got interviews at
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-background border border-blue-200 text-[10px] font-medium text-blue-800 shadow-sm">
                      Fortune 500
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-background border border-blue-200 text-[10px] font-medium text-blue-800 shadow-sm">
                      FAANG
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-background border border-blue-200 text-[10px] font-medium text-blue-800 shadow-sm">
                      Leading Startups
                    </span>
                  </div>
                </div>

                <Separator className="print:hidden" />

                {!isFree && (
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" /> AI Recommendations
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
                      {renderAnalysis(selectedResume?.analysis)}
                    </div>
                  </div>
                )}

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