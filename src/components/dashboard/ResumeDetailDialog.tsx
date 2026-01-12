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
}

export function ResumeDetailDialog({ resumeId, onClose, onDelete }: ResumeDetailDialogProps) {
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
                    onEditWithSniper={() => {
                      onClose();
                      // Navigate to keyword sniper - you can implement this with a callback prop
                      toast.info("Opening Keyword Sniper Tool...");
                    }}
                    onOpenWritingForge={() => {
                      onClose();
                      // Navigate to writing forge - you can implement this with a callback prop
                      toast.info("Opening Writing Forge...");
                    }}
                    onDownloadPDF={() => {
                      toast.success("Generating PDF report...");
                      // Implement PDF generation
                    }}
                  />
                </TabsContent>

                <TabsContent value="overview" className="flex-1 overflow-auto p-6">
                  {/* Prominent Robot View CTA for Free Users */}
                  {isFree && (
                    <div 
                      onClick={() => setActiveTab("robot")}
                      className="mb-6 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-2 border-green-500/30 rounded-xl p-6 cursor-pointer hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all group animate-pulse"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">👁️</span>
                          </div>
                          <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-green-400 mb-1 flex items-center gap-2">
                            See Your Invisible Resume (Robot View)
                            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">CRITICAL</span>
                          </h3>
                          <p className="text-sm text-green-300/80 leading-relaxed">
                            This is exactly what ATS robots see when they scan your resume. If your text is missing or scrambled here, you're being auto-rejected. <span className="font-bold text-green-400">Click to reveal why you're being ghosted.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isFree ? (
                    <FreeTierView
                      score={displayResume?.score || 0}
                      missingCount={displayResume?.missingKeywords?.length || 0}
                      formatCount={displayResume?.formatIssues?.length || 0}
                      criticalKeywords={criticalKeywords}
                      showBlurredPreview={showBlurredPreview}
                      setShowPricing={setShowPricing}
                      setShowBlurredPreview={setShowBlurredPreview}
                      ocrText={displayResume?.ocrText}
                      formatIssues={displayResume?.formatIssues}
                    />
                  ) : (
                    <div className="space-y-8">
                      {/* Hero Section with Gauge - Matching HTML exactly */}
                      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start glass-card rounded-lg p-8 relative overflow-hidden print:border print:border-gray-300 print:bg-white print:shadow-none">
                        {/* Background Glow */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        {/* Left: Gauge */}
                        <GaugeScore score={displayResume?.score || 0} />

                        {/* Right: Content */}
                        <div className="flex flex-col gap-6 flex-1 z-10 w-full text-center lg:text-left">
                          <div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                              (displayResume?.score || 0) >= 80 
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-200 border-green-200 dark:border-green-500/30'
                                : (displayResume?.score || 0) >= 50
                                ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-200 border-orange-200 dark:border-orange-500/30'
                                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-200 border-red-200 dark:border-red-500/30'
                            } text-xs font-bold uppercase tracking-wider mb-4 border`}>
                              <span className={`size-2 rounded-full animate-pulse ${
                                (displayResume?.score || 0) >= 80 ? 'bg-green-500' : (displayResume?.score || 0) >= 50 ? 'bg-orange-500' : 'bg-red-500'
                              }`}></span>
                              {(displayResume?.score || 0) >= 80 ? 'Excellent' : (displayResume?.score || 0) >= 50 ? 'Needs Optimization' : 'Critical Issues'}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-4">
                              Your resume is {(displayResume?.score || 0) >= 80 ? 'optimized' : 'invisible to'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                                {(displayResume?.score || 0) >= 80 ? '90%' : (displayResume?.score || 0) >= 50 ? '40%' : '60%'} of bots
                              </span>.
                            </h1>
                            <p className="text-zinc-300 text-lg max-w-2xl mx-auto lg:mx-0">
                              {(displayResume?.score || 0) >= 80 
                                ? 'Great job! Your resume is well-optimized for ATS systems.' 
                                : (displayResume?.score || 0) >= 50 
                                ? 'We found some issues that might be getting you rejected. Fix them to boost your chances.' 
                                : 'We found 3 critical errors that might be getting you rejected automatically. Fix them to boost your interview chances by 2x.'}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <Button 
                              onClick={handleDownloadReport}
                              className="flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary text-stone-900 font-bold text-base hover:bg-[#fcf82d] transition-colors shadow-[0_0_20px_rgba(249,245,6,0.2)]"
                            >
                              <Download className="h-5 w-5" />
                              Download Report
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={handleShareLink}
                              className="flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-medium hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
                            >
                              <Link2 className="h-5 w-5" />
                              Share Results
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Bento Grid - Matching HTML exactly */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 print:gap-4">
                        <FormattingAudit items={auditItems} />
                        
                        <KeywordHeatmap 
                          matchedKeywords={foundKeywords}
                          missingKeywords={displayResume?.missingKeywords?.map((k: any) => typeof k === 'string' ? k : k.keyword) || []}
                          isPremium={!isFree}
                          onUnlock={() => setShowPricing(true)}
                        />

                        <RoleMatchCard 
                          role={displayResume?.category || "General"}
                          matchScore={displayResume?.score || 0}
                          confidence={85}
                        />
                      </div>

                      {/* Lower Section: Fixes & Impact - Matching HTML exactly */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-4 print:grid-cols-1">
                        {/* Actionable Fixes (Left - 2 columns) */}
                        <div className="lg:col-span-2">
                          <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-6">
                            Actionable Fixes
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {(() => {
                                const fixes: any[] = [];
                                const metricCount = (displayResume?.ocrText?.match(/\d+%|\$[\d,]+|\d+\+?\s*(users|customers|clients)/gi) || []).length;
                                if (metricCount < 5) fixes.push(1);
                                
                                const weakPhrases = ["responsible for", "worked on", "helped with", "assisted in", "duties included"];
                                const weakCount = weakPhrases.reduce((count, phrase) => {
                                  return count + (displayResume?.ocrText?.toLowerCase().match(new RegExp(phrase, 'g')) || []).length;
                                }, 0);
                                if (weakCount > 0) fixes.push(1);
                                
                                if (displayResume?.formatIssues?.some((i: any) => 
                                  i.issue?.toLowerCase().includes('email') || i.issue?.toLowerCase().includes('phone')
                                )) fixes.push(1);
                                
                                return fixes.length;
                              })()} Critical
                            </span>
                          </h2>
                          <ActionableFixes 
                          fixes={(() => {
                            const fixes: Array<{title: string; description: string; impact: string; example: string}> = [];
                            
                            // Check for missing quantification
                            const metricCount = (displayResume?.ocrText?.match(/\d+%|\$[\d,]+|\d+\+?\s*(users|customers|clients)/gi) || []).length;
                            if (metricCount < 5) {
                              fixes.push({
                                title: "Missing Quantification",
                                description: `Your resume has only ${metricCount} quantifiable metrics. ATS systems and recruiters look for specific numbers that demonstrate impact.`,
                                impact: "Adding 8-10 metrics can increase your ATS score by 15-20 points and significantly improve recruiter engagement.",
                                example: "Instead of 'Improved system performance', write 'Optimized database queries, reducing load time by 45% and improving user experience for 50K+ daily users'"
                              });
                            }
                            
                            // Check for weak action verbs
                            const weakPhrases = ["responsible for", "worked on", "helped with", "assisted in", "duties included"];
                            const weakCount = weakPhrases.reduce((count, phrase) => {
                              return count + (displayResume?.ocrText?.toLowerCase().match(new RegExp(phrase, 'g')) || []).length;
                            }, 0);
                            
                            if (weakCount > 0) {
                              fixes.push({
                                title: "Weak Action Verbs",
                                description: `Found ${weakCount} instances of passive language like 'responsible for' or 'worked on'. Strong action verbs make your achievements more compelling.`,
                                impact: "Using powerful action verbs can improve readability and make your resume 30% more likely to pass initial screening.",
                                example: "Replace 'Responsible for managing team' with 'Led cross-functional team of 8 engineers to deliver 3 major features ahead of schedule'"
                              });
                            }
                            
                            // Check for format issues from analysis
                            const hasContactIssue = displayResume?.formatIssues?.some((i: any) => 
                              i.issue?.toLowerCase().includes('email') || i.issue?.toLowerCase().includes('phone')
                            );
                            
                            if (hasContactIssue) {
                              fixes.push({
                                title: "Missing Contact Information",
                                description: "Your resume is missing critical contact information. ATS systems cannot reach you without proper email and phone details.",
                                impact: "Missing contact info leads to automatic rejection. This is a critical fix that takes 2 minutes.",
                                example: "Add your email (firstname.lastname@email.com) and phone number (+1-555-123-4567) at the top of your resume in a clear, standard format."
                              });
                            }
                            
                            // Check for section header issues
                            const hasSectionIssue = displayResume?.formatIssues?.some((i: any) => 
                              i.issue?.toLowerCase().includes('section') || i.issue?.toLowerCase().includes('header')
                            );
                            
                            if (hasSectionIssue) {
                              fixes.push({
                                title: "Missing Standard Section Headers",
                                description: "ATS systems cannot identify key sections of your resume. Standard headers like 'Experience', 'Education', and 'Skills' are essential for parsing.",
                                impact: "Fixing section headers can improve parsing accuracy by 40% and prevent your experience from being missed.",
                                example: "Use clear, standard headers: 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS'. Avoid creative names like 'My Journey' or 'What I've Done'."
                              });
                            }
                            
                            // Add missing keyword fix if applicable
                            if (displayResume?.missingKeywords && displayResume.missingKeywords.length > 0) {
                              const topMissing = displayResume.missingKeywords.slice(0, 3).map((kw: any) => 
                                typeof kw === 'string' ? kw : kw.keyword
                              ).join(', ');
                              
                              fixes.push({
                                title: "Critical Keywords Missing",
                                description: `Your resume is missing ${displayResume.missingKeywords.length} important keywords that ATS systems scan for: ${topMissing}${displayResume.missingKeywords.length > 3 ? ', and more' : ''}.`,
                                impact: `Adding these keywords could increase your match score by ${Math.min(displayResume.missingKeywords.length * 3, 25)} points.`,
                                example: `Integrate "${topMissing}" naturally into your experience bullets. Example: "Developed scalable ${topMissing.split(',')[0]} solutions that improved system reliability by 35%"`
                              });
                            }
                            
                            // If no issues found, add a generic improvement suggestion
                            if (fixes.length === 0) {
                              fixes.push({
                                title: "Enhance Impact Statements",
                                description: "While your resume is well-structured, you can further strengthen it by adding more specific metrics and outcomes to your achievements.",
                                impact: "Even strong resumes benefit from additional quantification. This can push your score from good to excellent.",
                                example: "For each bullet point, ask: What was the measurable result? Add numbers like '30% faster', '50K users', or '$2M in savings'."
                              });
                            }
                            
                            return fixes;
                          })()}
                        />

                          </div>

                          {/* Right Column: Impact & Pro Tip */}
                          <div className="flex flex-col gap-6">
                            <ImpactScore 
                              score={displayResume?.score || 0} 
                              quantifiedBullets={displayResume?.quantifiedBullets || 0}
                              totalBullets={displayResume?.totalBullets || 0}
                            />
                            
                            <AIProTip 
                            tip={(() => {
                              const category = displayResume?.category || "General";
                              const score = displayResume?.score || 0;
                              
                              if (category === "Software Engineering" || category === "Engineering") {
                                if (score < 50) {
                                  return "Focus on adding technical metrics: system scale (requests/sec, data volume), performance improvements (latency reduction %), and team impact. Include your tech stack in every bullet point.";
                                } else if (score < 75) {
                                  return "Strengthen your impact by quantifying user reach and system reliability. Example: 'Built microservices handling 10M+ daily requests with 99.9% uptime, serving 2M active users.'";
                                } else {
                                  return "Your technical content is strong. Consider adding leadership metrics (mentored X engineers), architectural decisions, and business impact ($X saved, Y% revenue increase).";
                                }
                              } else if (category === "Marketing") {
                                if (score < 50) {
                                  return "Add campaign metrics: conversion rates, ROI, audience growth, and engagement rates. Include tools used (Google Analytics, HubSpot, Salesforce).";
                                } else if (score < 75) {
                                  return "Enhance your marketing impact with A/B test results, customer acquisition costs, and revenue attribution. Show data-driven decision making.";
                                } else {
                                  return "Excellent marketing metrics. Consider adding strategic initiatives, cross-functional leadership, and long-term brand impact to stand out further.";
                                }
                              } else if (category === "Data Science" || category === "Analytics") {
                                if (score < 50) {
                                  return "Quantify your data impact: model accuracy improvements, data volume processed, and business decisions influenced. List your tech stack (Python, SQL, TensorFlow).";
                                } else if (score < 75) {
                                  return "Add more context on model deployment, production impact, and stakeholder influence. Example: 'Deployed ML model predicting churn with 92% accuracy, reducing customer loss by 15%.'";
                                } else {
                                  return "Strong data science profile. Highlight end-to-end ownership, cross-functional collaboration, and measurable business outcomes to reach top-tier status.";
                                }
                              } else {
                                if (score < 50) {
                                  return "Start by adding numbers to every achievement: percentages, dollar amounts, time saved, or people impacted. Use strong action verbs like 'Led', 'Architected', 'Optimized'.";
                                } else if (score < 75) {
                                  return "Good foundation. Enhance by showing progression (promoted, increased responsibility), leadership (team size, mentoring), and strategic impact (company-wide initiatives).";
                                } else {
                                  return "Excellent resume structure. Fine-tune by ensuring every bullet follows the 'Action + Task + Result' formula with specific metrics and outcomes.";
                                }
                              }
                            })()}
                            />
                          </div>
                        </div>

                      {/* AI Recommendations Section */}
                      <div className="glass-card rounded-lg p-6 print:border print:border-gray-300 print:bg-white print:shadow-none print:break-inside-avoid">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                          AI Recommendations
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Critical</span>
                        </h2>
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                          {displayResume?.analysis && displayResume.analysis.trim().length > 0 ? (
                            renderAnalysis(displayResume.analysis)
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <div className="h-16 w-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                              </div>
                              <p className="text-zinc-300 text-lg font-semibold mb-2">Analysis in Progress</p>
                              <p className="text-zinc-400 text-sm max-w-md">
                                Your resume is being analyzed by our AI. This typically takes 10-30 seconds. Please refresh the page in a moment.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="fluff" className="flex-1 overflow-auto p-6">
                  {resumeId && <FluffDetector resumeId={resumeId} />}
                </TabsContent>

                <TabsContent value="keywords" className="flex-1 overflow-auto p-6">
                  <div className="space-y-8">
                    {/* Sniper Mode Teaser - Only show for FREE users if there are missing keywords */}
                    {isFree && criticalKeywords.length > 2 && (
                      <SniperModeTeaser
                        totalMissingKeywords={criticalKeywords.length}
                        visibleKeywords={criticalKeywords.slice(0, 2).map((kw: any) => typeof kw === 'string' ? kw : kw.keyword || kw)}
                        lockedKeywordsCount={Math.max(0, criticalKeywords.length - 2)}
                        onUnlock={() => {
                          setShowPricing(true);
                        }}
                        currentScore={displayResume?.score || 0}
                        potentialScore={Math.min(100, (displayResume?.score || 0) + (criticalKeywords.length * 3))}
                      />
                    )}

                    <div className="glass-card rounded-lg p-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Keyword Analysis</h2>

                      {/* PAID USERS: Show success message if they have full access */}
                      {!isFree && criticalKeywords.length > 0 && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                          <span className="material-symbols-outlined text-green-400 text-2xl flex-shrink-0">check_circle</span>
                          <div>
                            <p className="text-green-400 font-semibold mb-1">Full Access Unlocked</p>
                            <p className="text-sm text-slate-300">
                              Showing all {criticalKeywords.length} missing keywords with actionable recommendations.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-300 mb-4">
                            Found Keywords
                            <span className="text-xs text-green-400 ml-2">({foundKeywords.length} total)</span>
                          </h3>
                          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {foundKeywords.map((kw: string, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                                <span className="text-zinc-300 font-medium">{kw}</span>
                                <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                                  ✓
                                </span>
                              </div>
                            ))}
                            {foundKeywords.length === 0 && (
                              <p className="text-slate-400 text-sm">No keywords found yet. Add keywords from the missing list.</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-300 mb-4">
                            Missing Keywords
                            {isFree && criticalKeywords.length > 2 ? (
                              <span className="text-xs text-amber-400 ml-2">(Showing 2 of {criticalKeywords.length})</span>
                            ) : (
                              <span className="text-xs text-red-400 ml-2">({criticalKeywords.length} total)</span>
                            )}
                          </h3>
                          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {/* FREE USERS: Show only 2 keywords */}
                            {isFree && criticalKeywords.slice(0, 2).map((kw: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-red-950/30 rounded-lg border border-red-900/50">
                                <div className="flex-1">
                                  <span className="text-red-400 font-medium block">{typeof kw === 'string' ? kw : kw.keyword || kw}</span>
                                  {kw.priority && (
                                    <span className="text-xs text-red-300/60 capitalize">{kw.priority}</span>
                                  )}
                                </div>
                                <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                                  Impact: {kw.impact || 5}
                                </span>
                              </div>
                            ))}

                            {/* PAID USERS: Show ALL keywords with full details */}
                            {!isFree && criticalKeywords.map((kw: any, index: number) => (
                              <div key={index} className="p-4 bg-red-950/30 rounded-lg border border-red-900/50">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <span className="text-red-400 font-semibold block text-base">{typeof kw === 'string' ? kw : kw.keyword || kw}</span>
                                    {kw.priority && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                                        kw.priority === 'critical' ? 'bg-red-600/20 text-red-300' :
                                        kw.priority === 'important' ? 'bg-orange-600/20 text-orange-300' :
                                        'bg-yellow-600/20 text-yellow-300'
                                      }`}>
                                        {kw.priority.toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                    Impact: {kw.impact || 5}
                                  </span>
                                </div>
                                {kw.context && (
                                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                    💡 {kw.context}
                                  </p>
                                )}
                                {kw.synonyms && kw.synonyms.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    <span className="text-xs text-slate-500">Alternatives:</span>
                                    {kw.synonyms.slice(0, 3).map((syn: string, i: number) => (
                                      <span key={i} className="text-xs bg-slate-800/50 text-slate-400 px-2 py-0.5 rounded">
                                        {syn}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* FREE USERS: Show lock message */}
                            {isFree && criticalKeywords.length > 2 && (
                              <div className="p-4 bg-slate-800/50 rounded-lg border-2 border-amber-500/30 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800/70 transition-colors" onClick={() => setShowPricing(true)}>
                                <span className="material-symbols-outlined text-amber-400">lock</span>
                                <span className="text-amber-400 font-medium">
                                  + {criticalKeywords.length - 2} more keywords locked
                                </span>
                              </div>
                            )}

                            {criticalKeywords.length === 0 && (
                              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <p className="text-green-400 font-medium">✓ Great job!</p>
                                <p className="text-sm text-slate-300 mt-1">Your resume includes all critical keywords for this role.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <InterviewPrepMode
                    applicationId={displayResume._id}
                    resumeText={displayResume.ocrText || ""}
                    jobDescription={displayResume.jobDescription}
                    jobTitle={displayResume.jobTitle}
                    company={displayResume.company}
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