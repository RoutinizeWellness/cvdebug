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
          <p className="text-slate-500 italic">Analysis pending...</p>
        </div>
      );
    }

    // Check if the text contains an error message
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("failed")) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-red-700 font-bold mb-2">Analysis Error</h4>
              <p className="text-slate-700 text-sm mb-4">{text}</p>
              <p className="text-slate-600 text-xs">
                Please try re-uploading your resume or contact support at cvdebug@outlook.com if the issue persists.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (!text.includes("###")) {
      return <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">{text}</div>;
    }

    const parts = text.split("###").filter(part => part.trim());

    return (
      <div className="space-y-5">
        {parts.map((part, index) => {
          const lines = part.trim().split("\n");
          const title = lines[0];
          const content = lines.slice(1).filter(line => line.trim());

          let icon = null;
          let headerClass = "text-slate-900";
          let bgClass = "bg-white";
          let borderClass = "border-slate-200";

          if (title.includes("🎯") || title.includes("Tailored")) {
            icon = <Target className="h-4 w-4 text-green-600" />;
            headerClass = "text-green-700";
            bgClass = "bg-green-50";
            borderClass = "border-green-200";
          } else if (title.includes("🤖") || title.includes("Parsing")) {
            icon = <Cpu className="h-4 w-4 text-blue-600" />;
            headerClass = "text-blue-700";
            bgClass = "bg-blue-50";
            borderClass = "border-blue-200";
          } else if (title.includes("📊") || title.includes("Score")) {
            icon = <ScanLine className="h-4 w-4 text-teal-600" />;
            headerClass = "text-teal-700";
            bgClass = "bg-teal-50";
            borderClass = "border-teal-200";
          } else if (title.includes("🔑") || title.includes("Missing")) {
            icon = <AlertTriangle className="h-4 w-4 text-red-600" />;
            headerClass = "text-red-700";
            bgClass = "bg-red-50";
            borderClass = "border-red-200";
          } else if (title.includes("⚠️") || title.includes("Format")) {
            icon = <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            headerClass = "text-yellow-700";
            bgClass = "bg-yellow-50";
            borderClass = "border-yellow-200";
          }

          return (
            <div key={index} className={`rounded-xl ${bgClass} p-5 border ${borderClass} hover:shadow-lg transition-all duration-200`}>
              <h4 className={`font-bold ${headerClass} mb-4 text-base flex items-center gap-2`}>
                {icon}
                {title}
              </h4>
              <div className="space-y-3 text-sm text-slate-700">
                {content.map((line, i) => {
                  const trimmed = line.trim();
                  
                  if (/^\d+\*?\*?/.test(trimmed)) {
                    const match = trimmed.match(/^(\d+)\*?\*?\s*(.+)/);
                    if (match) {
                      const [, number, text] = match;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                            {number}
                          </span>
                          <span className="flex-1 leading-relaxed font-medium text-slate-900">{text}</span>
                        </div>
                      );
                    }
                  }

                  if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
                    return (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                        <span className="flex-1 leading-relaxed text-slate-700">{trimmed.replace(/^[-•*]\s*/, "")}</span>
                      </div>
                    );
                  }

                  if (trimmed.includes("**")) {
                    const parts = trimmed.split("**");
                    return (
                      <p key={i} className="leading-relaxed text-slate-700">
                        {parts.map((part, idx) =>
                          idx % 2 === 1 ? <strong key={idx} className="font-bold text-slate-900">{part}</strong> : part
                        )}
                      </p>
                    );
                  }

                  return <p key={i} className="leading-relaxed text-slate-700">{trimmed}</p>;
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
        className="w-screen h-[100dvh] max-w-none m-0 p-0 rounded-none border-none bg-white flex flex-col overflow-hidden shadow-none focus:outline-none top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0 sm:max-w-none print:h-auto print:overflow-visible print:bg-white"
      >
        <DialogTitle className="sr-only">Resume Analysis</DialogTitle>
        <DialogDescription className="sr-only">Detailed analysis of the selected resume</DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white backdrop-blur-sm flex-shrink-0 print:hidden shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200">
              <ScanLine className="h-5 w-5 text-blue-600" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-tight tracking-tight truncate text-slate-900">ATS Analysis Report</h2>
                {displayResume?.category && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-200 uppercase tracking-wider">
                    {displayResume.category}
                  </span>
                )}
                {displayResume?.jobDescription && (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold border border-green-200 uppercase tracking-wider flex items-center gap-1">
                    <Target className="h-3 w-3" /> Tailored
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                <span>ID: {resumeId?.slice(-8)}</span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> VLY-ATS-V2</span>
                {displayResume?.jobDescription && (
                  <>
                    <span className="text-slate-600">|</span>
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
            <div className="w-px h-8 bg-slate-200 mx-1 self-center hidden sm:block" />
            <button
              className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-200"
              onClick={() => displayResume && onDelete(displayResume._id)}
              title="Delete"
              disabled={!displayResume}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible bg-[#F8FAFC] print:bg-white">
          {/* Job Description Input Panel */}
          {showJobDescriptionInput && displayResume && (
            <div className="border-b border-slate-200 bg-white p-4 print:hidden shadow-sm">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-900">Tailor Analysis to Job Description</h3>
                      {displayResume.jobDescription && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          Currently Tailored
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Paste the job description to get a tailored ATS analysis with specific keyword matching and role-specific recommendations.
                    </p>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      className="w-full h-32 bg-white border border-slate-300 rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none leading-relaxed transition-all placeholder:text-slate-500 text-slate-900 shadow-sm"
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={handleReanalyzeWithJD}
                        disabled={isReanalyzing || !jobDescription.trim()}
                        className="bg-blue-600 text-slate-900 font-bold hover:bg-blue-700"
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
                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
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
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p>Loading analysis data...</p>
              {allResumes === undefined && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Network error: Unable to fetch data. Please check your connection.
                </p>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Main Content - Analysis Tabs + PDF Preview */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white flex-shrink-0 p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 border-b border-slate-200">
                  <TabsList className="inline-flex w-auto min-w-full gap-1 h-auto bg-transparent">
                    {/* DIAGNOSIS Group */}
                    <div className="flex gap-1 pr-3 border-r border-slate-200">
                      <TabsTrigger
                        value="robot"
                        className={`relative text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-green-600 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100 rounded-lg ${showRobotPulse ? 'animate-pulse ring-2 ring-green-500/50' : ''}`}
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
                      <TabsTrigger value="ats-report" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <FileSearch className="h-4 w-4" />
                          <span>Format</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="keywords" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Target className="h-4 w-4" />
                          <span>Keywords</span>
                        </span>
                      </TabsTrigger>
                    </div>

                    {/* FIX Group */}
                    <div className="flex gap-1 px-3 border-r border-slate-200">
                      <TabsTrigger value="fluff" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" />
                          <span>Fluff</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          <span>Overview</span>
                        </span>
                      </TabsTrigger>
                    </div>

                    {/* PREP Group */}
                    <div className="flex gap-1 pl-3">
                      <TabsTrigger value="interview" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-blue-600 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Building className="h-4 w-4" />
                          <span>Interview</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="simulation" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        Recruiter
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </div>

                <TabsContent value="robot" className="flex-1 overflow-auto p-0 m-0">
                  <div className="h-full bg-[#F8FAFC] relative">
                    {/* Terminal Header */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-3 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-green-700 font-mono text-sm font-bold">ATS_PARSER_v2.1.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                        </span>
                        <span className="text-green-700 font-mono text-xs">LIVE</span>
                      </div>
                    </div>

                    {/* Robot View Content */}
                    <div className="p-6 space-y-6">
                      {/* Info Banner */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">👁️</div>
                          <div>
                            <h3 className="text-green-700 font-bold text-lg mb-1">This is What ATS Robots Actually See</h3>
                            <p className="text-green-700 text-sm">
                              If your text is missing, scrambled, or out of order below, the ATS cannot read your resume and you'll be auto-rejected.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* OCR Text Display */}
                      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-slate-900 font-mono font-bold text-sm uppercase tracking-wider">Extracted Text Content</h4>
                          <span className="text-slate-600 font-mono text-xs">
                            {displayResume?.ocrText?.length || 0} characters
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded border border-slate-200 p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                          <pre className="text-slate-700 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                            {displayResume?.ocrText || "⚠️ NO TEXT EXTRACTED - ATS CANNOT READ THIS RESUME"}
                          </pre>
                        </div>
                      </div>

                      {/* Image Trap Warning */}
                      {displayResume?.hasImageTrap && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                            <div>
                              <h4 className="text-red-700 font-bold text-lg mb-1">🚨 IMAGE TRAP DETECTED</h4>
                              <p className="text-red-600 text-sm">
                                Critical content is embedded as an image. ATS systems cannot read this and will auto-reject your application.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                          <div className="text-green-600 text-xs font-mono uppercase mb-1">Readability</div>
                          <div className="text-2xl font-bold text-green-700">
                            {displayResume?.ocrText && displayResume.ocrText.length > 100 ? '✓ Good' : '✗ Poor'}
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                          <div className="text-green-600 text-xs font-mono uppercase mb-1">Image Traps</div>
                          <div className="text-2xl font-bold text-green-700">
                            {displayResume?.hasImageTrap ? '⚠️ Found' : '✓ None'}
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                          <div className="text-green-600 text-xs font-mono uppercase mb-1">ATS Score</div>
                          <div className="text-2xl font-bold text-green-700">
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

                <TabsContent value="overview" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <div className="space-y-8">
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Format Issues</h2>
                      <div className="space-y-4">
                        {auditItems.map((item: any, index: number) => (
                          <div key={index} className={`p-4 rounded-lg border shadow-sm ${item.status === "failed" ? "bg-red-50 border-red-200" : item.status === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`font-semibold ${item.status === "failed" ? "text-red-700" : item.status === "warning" ? "text-yellow-700" : "text-green-700"}`}>
                                {item.title}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                item.status === "failed" ? "bg-red-100 text-red-700 border border-red-200" :
                                item.status === "warning" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                                "bg-green-100 text-green-700 border border-green-200"
                              }`}>
                                {item.status === "failed" ? "❌" : item.status === "warning" ? "⚠️" : "✅"}
                              </span>
                            </div>
                            <p className="text-slate-700 text-sm mb-3">{item.reason}</p>
                            <p className="text-xs text-slate-600">{item.fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fluff" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <FluffDetector
                    resumeText={displayResume.ocrText || ""}
                    clarityScore={displayResume?.score || 73}
                  />
                </TabsContent>

                <TabsContent value="keywords" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <KeywordAnalysis
                    matchedKeywords={foundKeywords}
                    missingKeywords={criticalKeywords.map((kw: any) => typeof kw === 'string' ? kw : kw.keyword || kw.term || '')}
                    matchRate={displayResume?.score || 82}
                  />
                </TabsContent>

                <TabsContent value="format" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <div className="space-y-8">
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Format Issues</h2>
                      <div className="space-y-4">
                        {auditItems.map((item: any, index: number) => (
                          <div key={index} className={`p-4 rounded-lg border shadow-sm ${item.status === "failed" ? "bg-red-50 border-red-200" : item.status === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`font-semibold ${item.status === "failed" ? "text-red-700" : item.status === "warning" ? "text-yellow-700" : "text-green-700"}`}>
                                {item.title}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                item.status === "failed" ? "bg-red-100 text-red-700 border border-red-200" :
                                item.status === "warning" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                                "bg-green-100 text-green-700 border border-green-200"
                              }`}>
                                {item.status === "failed" ? "❌" : item.status === "warning" ? "⚠️" : "✅"}
                              </span>
                            </div>
                            <p className="text-slate-700 text-sm mb-3">{item.reason}</p>
                            <p className="text-xs text-slate-600">{item.fix}</p>
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

                <TabsContent value="interview" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <InterviewBattlePlan
                    targetRole={displayResume.jobTitle || "Data Science Role"}
                    companyName={displayResume.company || "TechCorp"}
                    resumeText={displayResume.ocrText || ""}
                  />
                </TabsContent>

                <TabsContent value="raw" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <div className="space-y-8">
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Raw Text View</h2>
                      <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                        {displayResume?.ocrText || "No text extracted."}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* PDF Preview - Now Full Width When Tabs Don't Need It */}
              <div className={`${isPdfCollapsed ? 'hidden lg:block lg:w-12' : 'flex-1'} bg-slate-50 flex items-center justify-center p-4 md:p-8 overflow-hidden relative group transition-all duration-300 min-h-[50vh] lg:min-h-0 print:hidden border-l border-slate-200`}>
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                {/* Collapse/Expand Button */}
                <button
                  onClick={() => setIsPdfCollapsed(!isPdfCollapsed)}
                  className="absolute top-4 left-4 z-20 p-2 bg-blue-600 hover:bg-blue-700 text-slate-900 rounded-lg backdrop-blur-sm transition-all shadow-lg"
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
                      <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-xl max-w-md border border-slate-200">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border border-slate-200">
                          <FileText className="h-10 w-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-900">Preview Not Available</h3>
                        <p className="text-slate-600 mb-8">
                          This file type cannot be previewed directly in the browser. You can download it to view the content.
                        </p>
                        <Button onClick={handleDownloadFile} className="font-bold shadow-lg bg-blue-600 hover:bg-blue-700 text-slate-900">
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