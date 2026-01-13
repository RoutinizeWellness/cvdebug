import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertTriangle,
  Loader2
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
import { GaugeScore } from "./analysis/GaugeScore";
import { FormattingAudit } from "./analysis/FormattingAudit";
import { KeywordHeatmap } from "./analysis/KeywordHeatmap";
import { RoleMatchCard } from "./analysis/RoleMatchCard";
import { ActionableFixes } from "./analysis/ActionableFixes";
import { ImpactScore } from "./analysis/ImpactScore";
import { AIProTip } from "./analysis/AIProTip";
import { ImageTrapAlert } from "./ImageTrapAlert";
import { LiveRecruiterSimulation } from "./LiveRecruiterSimulation";
import { InterviewPrepMode } from "./InterviewPrepMode";
import { InterviewBattlePlan } from "./InterviewBattlePlan";
import { KeywordAnalysis } from "./KeywordAnalysis";
import { ATSSimulation } from "./ATSSimulation";
import { SniperModeTeaser } from "./SniperModeTeaser";
import { ATSAnalysisReport } from "./ATSAnalysisReport";
import { FluffDetector } from "./FluffDetector";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface ResumeDetailDialogProps {
  resumeId: Id<"resumes"> | null;
  onClose: () => void;
  onDelete: (id: Id<"resumes">) => void;
  onOpenWritingForge?: () => void;
  onOpenKeywordSniper?: () => void;
}

export function ResumeDetailDialog({
  resumeId,
  onClose,
  onDelete,
  onOpenWritingForge,
  onOpenKeywordSniper
}: ResumeDetailDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showBlurredPreview, setShowBlurredPreview] = useState(true);
  const [showJobDescriptionInput, setShowJobDescriptionInput] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showRobotPulse, setShowRobotPulse] = useState(false);
  const [isPdfCollapsed, setIsPdfCollapsed] = useState(false);
  
  const rewriteResume = useAction(apiAny.ai.rewriteResume);
  const analyzeResume = useAction(apiAny.ai.analyzeResume);
  
  const user = useQuery(apiAny.users.currentUser);
  const isFree = user?.subscriptionTier === "free";

  const allResumes = useQuery(apiAny.resumes.getResumes, {});
  const displayResume = allResumes?.find((r: any) => r._id === resumeId);
  
  // Pulse effect for Robot View if not clicked within 5 seconds
  useEffect(() => {
    if (activeTab !== "robot" && displayResume) {
      const timer = setTimeout(() => {
        setShowRobotPulse(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowRobotPulse(false);
    }
  }, [activeTab, displayResume]);

  useEffect(() => {
    if (activeTab !== "robot") {
      const timer = setTimeout(() => {
        setShowRobotPulse(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowRobotPulse(false);
    }
  }, [activeTab]);

  useEffect(() => {

  }, [displayResume?._id, isFree, displayResume?.jobDescription]);

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

  const handleReanalyzeWithJD = async () => {
    if (!displayResume?.ocrText) {
      toast.error("No text available to analyze.");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    setIsReanalyzing(true);
    toast.info("🎯 Re-analyzing resume with your job description...");
    
    try {
      await analyzeResume({
        id: displayResume._id,
        ocrText: displayResume.ocrText,
        jobDescription: jobDescription.trim(),
      });
      toast.success("✅ Analysis complete! Your resume has been tailored to the job description.");
      setShowJobDescriptionInput(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to re-analyze resume. Please try again.");
    } finally {
      setIsReanalyzing(false);
    }
  };

  const renderAnalysis = (text: string) => {
    if (!text || text.trim().length === 0) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-zinc-400 italic">Analysis pending...</p>
        </div>
      );
    }
    
    // Check if the text contains an error message
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("failed")) {
      return (
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-red-400 font-bold mb-2">Analysis Error</h4>
              <p className="text-zinc-300 text-sm mb-4">{text}</p>
              <p className="text-zinc-400 text-xs">
                Please try re-uploading your resume or contact support at cvdebug@outlook.com if the issue persists.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    if (!text.includes("###")) {
      return <div className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed">{text}</div>;
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
          let bgClass = "bg-zinc-900";
          let borderClass = "border-zinc-800";

          if (title.includes("🎯") || title.includes("Tailored")) {
            icon = <Target className="h-4 w-4 text-green-400" />;
            headerClass = "text-green-400";
            bgClass = "bg-green-950/30";
            borderClass = "border-green-900/50";
          } else if (title.includes("🤖") || title.includes("Parsing")) {
            icon = <Cpu className="h-4 w-4 text-blue-400" />;
            headerClass = "text-blue-400";
            bgClass = "bg-blue-950/30";
            borderClass = "border-blue-900/50";
          } else if (title.includes("📊") || title.includes("Score")) {
            icon = <ScanLine className="h-4 w-4 text-teal-400" />;
            headerClass = "text-teal-400";
            bgClass = "bg-teal-950/30";
            borderClass = "border-teal-900/50";
          } else if (title.includes("🔑") || title.includes("Missing")) {
            icon = <AlertTriangle className="h-4 w-4 text-red-400" />;
            headerClass = "text-red-400";
            bgClass = "bg-red-950/30";
            borderClass = "border-red-900/50";
          } else if (title.includes("⚠️") || title.includes("Format")) {
            icon = <AlertTriangle className="h-4 w-4 text-yellow-400" />;
            headerClass = "text-yellow-400";
            bgClass = "bg-yellow-950/30";
            borderClass = "border-yellow-900/50";
          }

          return (
            <div key={index} className={`rounded-xl ${bgClass} p-5 border ${borderClass} hover:shadow-lg transition-all duration-200`}>
              <h4 className={`font-bold ${headerClass} mb-4 text-base flex items-center gap-2`}>
                {icon}
                {title}
              </h4>
              <div className="space-y-3 text-sm text-zinc-300">
                {content.map((line, i) => {
                  const trimmed = line.trim();
                  
                  if (/^\d+\*?\*?/.test(trimmed)) {
                    const match = trimmed.match(/^(\d+)\*?\*?\s*(.+)/);
                    if (match) {
                      const [, number, text] = match;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 bg-black/40 rounded-lg border border-zinc-800/50">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/30">
                            {number}
                          </span>
                          <span className="flex-1 leading-relaxed font-medium text-zinc-200">{text}</span>
                        </div>
                      );
                    }
                  }
                  
                  if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
                    return (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="flex-1 leading-relaxed text-zinc-300">{trimmed.replace(/^[-•*]\s*/, "")}</span>
                      </div>
                    );
                  }
                  
                  if (trimmed.includes("**")) {
                    const parts = trimmed.split("**");
                    return (
                      <p key={i} className="leading-relaxed text-zinc-300">
                        {parts.map((part, idx) => 
                          idx % 2 === 1 ? <strong key={idx} className="font-bold text-white">{part}</strong> : part
                        )}
                      </p>
                    );
                  }
                  
                  return <p key={i} className="leading-relaxed text-zinc-300">{trimmed}</p>;
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

  // Extract found keywords from the analysis text and OCR
  const extractFoundKeywords = (analysisText: string, ocrText: string): string[] => {
    const keywords: string[] = [];
    
    // Method 1: Try to extract from analysis report's keyword section
    if (analysisText) {
      const keywordSection = analysisText.match(/Found (\d+) relevant keywords[\s\S]*?(?=\n\n|Missing|Format)/);
      if (keywordSection) {
        const keywordLines = keywordSection[0].split('\n').filter(line => line.includes('•'));
        const extracted = keywordLines.map(line => {
          const match = line.match(/• (.+?) \(freq:/);
          return match ? match[1].trim() : null;
        }).filter(Boolean) as string[];
        
        if (extracted.length > 0) {
          keywords.push(...extracted);
        }
      }
    }
    
    // Method 2: Scan OCR text for common technical keywords
    if (ocrText && keywords.length < 5) {
      const commonKeywords = [
        // Programming Languages
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Ruby', 'Go', 'Rust', 'PHP', 'Swift', 'Kotlin',
        // Frontend
        'React', 'Angular', 'Vue', 'Next\\.js', 'HTML', 'CSS', 'Tailwind', 'Bootstrap', 'jQuery',
        // Backend
        'Node\\.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'FastAPI',
        // Databases
        'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DynamoDB', 'Cassandra', 'Oracle',
        // Cloud & DevOps
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible',
        // Tools & Methodologies
        'Git', 'GitHub', 'GitLab', 'Jira', 'Agile', 'Scrum', 'REST', 'GraphQL', 'API', 'Microservices',
        // Data & ML
        'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Spark', 'Hadoop', 'Machine Learning', 'Data Science'
      ];
      
      const ocrLower = ocrText.toLowerCase();
      const found = commonKeywords.filter(keyword => {
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
        return regex.test(ocrLower);
      });
      
      // Add unique keywords not already in the list
      found.forEach(kw => {
        if (!keywords.some(k => k.toLowerCase() === kw.toLowerCase())) {
          keywords.push(kw);
        }
      });
    }
    
    return keywords.slice(0, 15); // Return up to 15 keywords
  };
  
  const foundKeywords = extractFoundKeywords(
    displayResume?.analysis || '', 
    displayResume?.ocrText || ''
  );

  return (
    <Dialog open={!!resumeId} onOpenChange={(open) => !open && onClose()}>
      <PricingDialog 
        open={showPricing} 
        onOpenChange={setShowPricing} 
        initialPlan="single_scan" 
        resumeId={displayResume?._id as any}
      />
      <DialogContent 
        showCloseButton={false}
        className="w-screen h-[100dvh] max-w-none m-0 p-0 rounded-none border-none bg-zinc-950 flex flex-col overflow-hidden shadow-none focus:outline-none top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0 sm:max-w-none print:h-auto print:overflow-visible print:bg-white"
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
              onClick={() => setShowJobDescriptionInput(!showJobDescriptionInput)}
              disabled={!displayResume}
            >
              <Target className="h-4 w-4" />
              {displayResume?.jobDescription ? "Update JD" : "Add Job Description"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleShareLink}
              title="Copy shareable link"
              disabled={!displayResume}
            >
              <Link2 className="h-4 w-4" />
              Share Link
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleOptimize}
              disabled={isGenerating || !displayResume}
            >
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "Optimizing..." : "AI Rewrite"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleDownloadFile}
              disabled={!displayResume}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:flex gap-2 font-bold"
              onClick={handleDownloadReport}
              disabled={!displayResume}
            >
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <div className="w-px h-8 bg-border mx-1 self-center hidden sm:block" />
            <button 
              className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
              onClick={() => displayResume && onDelete(displayResume._id)}
              title="Delete"
              disabled={!displayResume}
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

        <div className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible bg-[#050505] print:bg-white">
          {/* Job Description Input Panel */}
          {showJobDescriptionInput && displayResume && (
            <div className="border-b border-zinc-800 bg-zinc-900/50 p-4 print:hidden">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold text-white">Tailor Analysis to Job Description</h3>
                      {displayResume.jobDescription && (
                        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                          Currently Tailored
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mb-3">
                      Paste the job description to get a tailored ATS analysis with specific keyword matching and role-specific recommendations.
                    </p>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-lg text-sm p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none leading-relaxed transition-all placeholder:text-zinc-600 text-zinc-300"
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={handleReanalyzeWithJD}
                        disabled={isReanalyzing || !jobDescription.trim()}
                        className="bg-primary text-black font-bold hover:bg-primary/90"
                      >
                        {isReanalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Re-analyzing...
                          </>
                        ) : (
                          <>
                            <Target className="h-4 w-4 mr-2" />
                            Re-analyze with Job Description
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowJobDescriptionInput(false);
                          setJobDescription(displayResume.jobDescription || "");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!displayResume ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Loading analysis data...</p>
              {allResumes === undefined && (
                <p className="text-xs text-red-400 bg-red-950/30 px-3 py-1 rounded-full border border-red-900/50">
                  Network error: Unable to fetch data. Please check your connection.
                </p>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Main Content - Analysis Tabs + PDF Preview */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-slate-800/30 flex-shrink-0 p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 border-b border-slate-700/50">
                  <TabsList className="inline-flex w-auto min-w-full gap-1 h-auto bg-transparent">
                    {/* DIAGNOSIS Group */}
                    <div className="flex gap-1 pr-3 border-r border-slate-700/50">
                      <TabsTrigger
                        value="robot"
                        className={`relative text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200 data-[state=inactive]:hover:bg-slate-700/50 ${showRobotPulse ? 'animate-pulse ring-2 ring-green-500/50' : ''}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Cpu className="h-4 w-4" />
                          <span>Robot View</span>
                        </span>
                        {showRobotPulse && (
                          <span className="absolute -top-1 -right-1 flex h-2 w-2 z-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="ats-report" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-primary data-[state=active]:text-black data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200 data-[state=inactive]:hover:bg-slate-700/50">
                        <span className="flex items-center gap-1.5">
                          <FileSearch className="h-4 w-4" />
                          <span>Format</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="keywords" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-primary data-[state=active]:text-black data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200 data-[state=inactive]:hover:bg-slate-700/50">
                        <span className="flex items-center gap-1.5">
                          <Target className="h-4 w-4" />
                          <span>Keywords</span>
                        </span>
                      </TabsTrigger>
                    </div>

                    {/* FIX Group */}
                    <div className="flex gap-1 px-3 border-r border-slate-700/50">
                      <TabsTrigger value="fluff" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-amber-500 data-[state=active]:text-black data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200 data-[state=inactive]:hover:bg-slate-700/50">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" />
                          <span>Fluff</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-slate-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200 data-[state=inactive]:hover:bg-slate-700/50">
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          <span>Overview</span>
                        </span>
                      </TabsTrigger>
                    </div>

                    {/* PREP Group */}
                    <div className="flex gap-1 pl-3">
                      <TabsTrigger value="interview" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200 data-[state=inactive]:hover:bg-slate-700/50">
                        <span className="flex items-center gap-1.5">
                          <Building className="h-4 w-4" />
                          <span>Interview</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="simulation" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-200 data-[state=inactive]:hover:bg-slate-700/50">
                        Recruiter
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </div>

                <TabsContent value="robot" className="flex-1 overflow-auto p-0 m-0">
                  <div className="h-full bg-[#0a0e1a] relative">
                    {/* Terminal Header */}
                    <div className="bg-gradient-to-r from-green-950 to-emerald-950 border-b-2 border-green-500/30 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-green-400 font-mono text-sm font-bold">ATS_PARSER_v2.1.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-green-400 font-mono text-xs">LIVE</span>
                      </div>
                    </div>
                    
                    {/* Robot View Content */}
                    <div className="p-6 space-y-6">
                      {/* Info Banner */}
                      <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">👁️</div>
                          <div>
                            <h3 className="text-green-400 font-bold text-lg mb-1">This is What ATS Robots Actually See</h3>
                            <p className="text-green-300/80 text-sm">
                              If your text is missing, scrambled, or out of order below, the ATS cannot read your resume and you'll be auto-rejected.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* OCR Text Display */}
                      <div className="bg-black/40 border-2 border-green-500/20 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-green-400 font-mono font-bold text-sm uppercase tracking-wider">Extracted Text Content</h4>
                          <span className="text-green-500/60 font-mono text-xs">
                            {displayResume?.ocrText?.length || 0} characters
                          </span>
                        </div>
                        <div className="bg-black/60 rounded border border-green-500/10 p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                          <pre className="text-green-300/90 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                            {displayResume?.ocrText || "⚠️ NO TEXT EXTRACTED - ATS CANNOT READ THIS RESUME"}
                          </pre>
                        </div>
                      </div>

                      {/* Image Trap Warning */}
                      {displayResume?.hasImageTrap && (
                        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-4 animate-pulse">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                            <div>
                              <h4 className="text-red-400 font-bold text-lg mb-1">🚨 IMAGE TRAP DETECTED</h4>
                              <p className="text-red-300/80 text-sm">
                                Critical content is embedded as an image. ATS systems cannot read this and will auto-reject your application.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-950/30 border border-green-500/20 rounded-lg p-4">
                          <div className="text-green-500/60 text-xs font-mono uppercase mb-1">Readability</div>
                          <div className="text-2xl font-bold text-green-400">
                            {displayResume?.ocrText && displayResume.ocrText.length > 100 ? '✓ Good' : '✗ Poor'}
                          </div>
                        </div>
                        <div className="bg-green-950/30 border border-green-500/20 rounded-lg p-4">
                          <div className="text-green-500/60 text-xs font-mono uppercase mb-1">Image Traps</div>
                          <div className="text-2xl font-bold text-green-400">
                            {displayResume?.hasImageTrap ? '⚠️ Found' : '✓ None'}
                          </div>
                        </div>
                        <div className="bg-green-950/30 border border-green-500/20 rounded-lg p-4">
                          <div className="text-green-500/60 text-xs font-mono uppercase mb-1">ATS Score</div>
                          <div className="text-2xl font-bold text-green-400">
                            {displayResume?.score || 0}/100
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ats-report" className="flex-1 overflow-auto p-6">
                  <ATSAnalysisReport
                    resume={displayResume}
                    user={user}
                    onEditWithSniper={() => {
                      if (onOpenKeywordSniper) {
                        onOpenKeywordSniper();
                        toast.success("Opening Keyword Sniper Tool...");
                      } else {
                        onClose();
                        toast.info("Opening Keyword Sniper Tool...");
                      }
                    }}
                    onOpenWritingForge={() => {
                      if (onOpenWritingForge) {
                        onOpenWritingForge();
                        toast.success("Opening Writing Forge...");
                      } else {
                        onClose();
                        toast.info("Opening Writing Forge...");
                      }
                    }}
                    onDownloadPDF={() => {
                      toast.success("Generating PDF report...");
                      // Implement PDF generation
                    }}
                  />
                </TabsContent>

                <TabsContent value="overview" className="flex-1 overflow-auto p-6">
                  <div className="space-y-8">
                    <div className="glass-card rounded-lg p-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Format Issues</h2>
                      <div className="space-y-4">
                        {auditItems.map((item: any, index: number) => (
                          <div key={index} className={`p-4 rounded-lg border ${item.status === "failed" ? "bg-red-950/30 border-red-900/50" : item.status === "warning" ? "bg-yellow-950/30 border-yellow-900/50" : "bg-green-950/30 border-green-900/50"}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`font-semibold ${item.status === "failed" ? "text-red-400" : item.status === "warning" ? "text-yellow-400" : "text-green-400"}`}>
                                {item.title}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                item.status === "failed" ? "bg-red-900/50 text-red-400" :
                                item.status === "warning" ? "bg-yellow-900/50 text-yellow-400" :
                                "bg-green-900/50 text-green-400"
                              }`}>
                                {item.status === "failed" ? "❌" : item.status === "warning" ? "⚠️" : "✅"}
                              </span>
                            </div>
                            <p className="text-zinc-300 text-sm mb-3">{item.reason}</p>
                            <p className="text-xs text-zinc-400">{item.fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fluff" className="flex-1 overflow-auto p-6">
                  {resumeId && <FluffDetector resumeId={resumeId} />}
                </TabsContent>

                <TabsContent value="keywords" className="flex-1 overflow-auto p-6">
                  <KeywordAnalysis
                    matchedKeywords={foundKeywords}
                    missingKeywords={criticalKeywords.map((kw: any) => typeof kw === 'string' ? kw : kw.keyword || kw.term || '')}
                    matchRate={displayResume?.score || 82}
                  />
                </TabsContent>

                <TabsContent value="format" className="flex-1 overflow-auto p-6">
                  <div className="space-y-8">
                    <div className="glass-card rounded-lg p-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Format Issues</h2>
                      <div className="space-y-4">
                        {auditItems.map((item: any, index: number) => (
                          <div key={index} className={`p-4 rounded-lg border ${item.status === "failed" ? "bg-red-950/30 border-red-900/50" : item.status === "warning" ? "bg-yellow-950/30 border-yellow-900/50" : "bg-green-950/30 border-green-900/50"}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`font-semibold ${item.status === "failed" ? "text-red-400" : item.status === "warning" ? "text-yellow-400" : "text-green-400"}`}>
                                {item.title}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                item.status === "failed" ? "bg-red-900/50 text-red-400" : 
                                item.status === "warning" ? "bg-yellow-900/50 text-yellow-400" : 
                                "bg-green-900/50 text-green-400"
                              }`}>
                                {item.status === "failed" ? "❌" : item.status === "warning" ? "⚠️" : "✅"}
                              </span>
                            </div>
                            <p className="text-zinc-300 text-sm mb-3">{item.reason}</p>
                            <p className="text-xs text-zinc-400">{item.fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="simulation" className="flex-1 overflow-hidden p-0">
                  <ATSSimulation
                    resumeId={displayResume._id}
                    onBack={() => setActiveTab("overview")}
                  />
                </TabsContent>

                <TabsContent value="interview" className="flex-1 overflow-auto p-6">
                  <InterviewBattlePlan
                    targetRole={displayResume.jobTitle || "Data Science Role"}
                    companyName={displayResume.company || "TechCorp"}
                    resumeText={displayResume.ocrText || ""}
                  />
                </TabsContent>

                <TabsContent value="raw" className="flex-1 overflow-auto p-6">
                  <div className="space-y-8">
                    <div className="glass-card rounded-lg p-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Raw Text View</h2>
                      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                        {displayResume?.ocrText || "No text extracted."}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* PDF Preview - Now Full Width When Tabs Don't Need It */}
              <div className={`${isPdfCollapsed ? 'hidden lg:block lg:w-12' : 'flex-1'} bg-black/5 flex items-center justify-center p-4 md:p-8 overflow-hidden relative group transition-all duration-300 min-h-[50vh] lg:min-h-0 print:hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>

                {/* Collapse/Expand Button */}
                <button
                  onClick={() => setIsPdfCollapsed(!isPdfCollapsed)}
                  className="absolute top-4 left-4 z-20 p-2 bg-primary/90 hover:bg-primary text-white rounded-lg backdrop-blur-sm transition-all shadow-lg"
                  title={isPdfCollapsed ? "Show PDF Preview" : "Hide PDF Preview"}
                >
                  {isPdfCollapsed ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                </button>

                {!isPdfCollapsed && (
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
                )}
              </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}