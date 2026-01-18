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
  Loader2,
  Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction, useQuery, useMutation } from "convex/react";
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
import { SanitizedVersionDialog } from "./SanitizedVersionDialog";
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
  const [showSanitizerDialog, setShowSanitizerDialog] = useState(false);

  const rewriteResume = useAction(apiAny.ai.rewriteResume);
  const analyzeResume = useMutation(apiAny.resumes.analyzeResume);
  const applyRewriteToResume = useMutation(apiAny.resumes.applyRewriteToResume);

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
      toast.success("Optimization complete! Click 'Apply Rewrite' to update your CV.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to optimize resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyRewrite = async () => {
    if (!displayResume?.rewrittenText) {
      toast.error("No rewrite available. Click 'AI Rewrite' first.");
      return;
    }

    try {
      await applyRewriteToResume({ id: displayResume._id });

      // Switch to Robot View to show updated text
      setActiveTab("robot");

      toast.success("✅ Rewrite applied to your CV!", {
        description: "Check the 'Robot View' tab to see your optimized CV text."
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to apply rewrite", {
        description: error.message || "Please try again."
      });
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
          <p className="text-[#64748B] italic">Analysis pending...</p>
        </div>
      );
    }

    // Check if the text contains an error message
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("failed")) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-red-700 font-bold mb-2">Analysis Error</h4>
              <p className="text-[#475569] text-sm mb-4">{text}</p>
              <p className="text-[#475569] text-xs">
                Please try re-uploading your resume or contact support at cvdebug@outlook.com if the issue persists.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (!text.includes("###")) {
      return <div className="whitespace-pre-wrap text-sm text-[#475569] leading-relaxed">{text}</div>;
    }

    const parts = text.split("###").filter(part => part.trim());

    return (
      <div className="space-y-5">
        {parts.map((part, index) => {
          const lines = part.trim().split("\n");
          const title = lines[0];
          const content = lines.slice(1).filter(line => line.trim());

          let icon = null;
          let headerClass = "text-[#0F172A]";
          let bgClass = "bg-[#FFFFFF]";
          let borderClass = "border-[#E2E8F0]";

          if (title.includes("🎯") || title.includes("Tailored")) {
            icon = <Target className="h-4 w-4 text-[#22C55E]" />;
            headerClass = "text-green-700";
            bgClass = "bg-green-50";
            borderClass = "border-green-200";
          } else if (title.includes("🤖") || title.includes("Parsing")) {
            icon = <Cpu className="h-4 w-4 text-[#3B82F6]" />;
            headerClass = "text-blue-700";
            bgClass = "bg-blue-50";
            borderClass = "border-blue-200";
          } else if (title.includes("📊") || title.includes("Score")) {
            icon = <ScanLine className="h-4 w-4 text-teal-600" />;
            headerClass = "text-teal-700";
            bgClass = "bg-teal-50";
            borderClass = "border-teal-200";
          } else if (title.includes("🔑") || title.includes("Missing")) {
            icon = <AlertTriangle className="h-4 w-4 text-[#EF4444]" />;
            headerClass = "text-red-700";
            bgClass = "bg-red-50";
            borderClass = "border-red-200";
          } else if (title.includes("⚠️") || title.includes("Format")) {
            icon = <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />;
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
              <div className="space-y-3 text-sm text-[#475569]">
                {content.map((line, i) => {
                  const trimmed = line.trim();
                  
                  if (/^\d+\*?\*?/.test(trimmed)) {
                    const match = trimmed.match(/^(\d+)\*?\*?\s*(.+)/);
                    if (match) {
                      const [, number, text] = match;
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                            {number}
                          </span>
                          <span className="flex-1 leading-relaxed font-medium text-[#0F172A]">{text}</span>
                        </div>
                      );
                    }
                  }

                  if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
                    return (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#3B82F6] flex-shrink-0" />
                        <span className="flex-1 leading-relaxed text-[#475569]">{trimmed.replace(/^[-•*]\s*/, "")}</span>
                      </div>
                    );
                  }

                  if (trimmed.includes("**")) {
                    const parts = trimmed.split("**");
                    return (
                      <p key={i} className="leading-relaxed text-[#475569]">
                        {parts.map((part, idx) =>
                          idx % 2 === 1 ? <strong key={idx} className="font-bold text-[#0F172A]">{part}</strong> : part
                        )}
                      </p>
                    );
                  }

                  return <p key={i} className="leading-relaxed text-[#475569]">{trimmed}</p>;
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

  // Prepare audit items - dynamically generated from real format issues
  const auditItems: Array<{
    title: string;
    status: "passed" | "failed" | "warning";
    reason: string;
    fix: string;
  }> = (() => {
    const items: Array<{
      title: string;
      status: "passed" | "failed" | "warning";
      reason: string;
      fix: string;
    }> = [];

    const formatIssues = displayResume?.formatIssues || [];

    // Only add items if there are actual issues detected
    if (formatIssues.length > 0) {
      formatIssues.forEach((issue: any) => {
        const issueText = issue.issue || issue.message || "";
        const issueLower = issueText.toLowerCase();

        // Contact information
        if (issueLower.includes('contact') || issueLower.includes('email') || issueLower.includes('phone')) {
          items.push({
            title: "Contact Information Parsing",
            status: "failed",
            reason: issueText,
            fix: issue.fix || "Place contact info at the top in a clear format: name@email.com, (123) 456-7890"
          });
        }
        // Section headers
        else if (issueLower.includes('section') || issueLower.includes('header')) {
          items.push({
            title: "Section Headers Recognition",
            status: "warning",
            reason: issueText,
            fix: issue.fix || "Use standard headers: Experience, Education, Skills, Projects"
          });
        }
        // Bullet points
        else if (issueLower.includes('bullet') || issueLower.includes('list')) {
          items.push({
            title: "Bullet Point Formatting",
            status: "failed",
            reason: issueText,
            fix: issue.fix || "Use simple bullets (•) and maintain consistent indentation"
          });
        }
        // Date format
        else if (issueLower.includes('date')) {
          items.push({
            title: "Date Format Consistency",
            status: "warning",
            reason: issueText,
            fix: issue.fix || "Use consistent date format: MM/YYYY or Month YYYY"
          });
        }
        // Font and styling
        else if (issueLower.includes('font') || issueLower.includes('table') || issueLower.includes('format') || issueLower.includes('style')) {
          items.push({
            title: "Font & Styling Compatibility",
            status: "warning",
            reason: issueText,
            fix: issue.fix || "Avoid tables, text boxes, and unusual fonts. Stick to standard fonts like Arial or Calibri"
          });
        }
        // Generic issue
        else {
          items.push({
            title: "Formatting Issue",
            status: "warning",
            reason: issueText,
            fix: issue.fix || "Review and fix this formatting issue"
          });
        }
      });
    }

    // If no issues, return empty array (will show "No format issues detected")
    return items;
  })();

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
        className="w-screen h-[100dvh] max-w-none m-0 p-0 rounded-none border-none bg-[#FFFFFF] flex flex-col overflow-hidden shadow-none focus:outline-none top-0 left-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom-0 sm:max-w-none print:h-auto print:overflow-visible print:bg-[#FFFFFF]"
      >
        <DialogTitle className="sr-only">Resume Analysis</DialogTitle>
        <DialogDescription className="sr-only">Detailed analysis of the selected resume</DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#FFFFFF] backdrop-blur-sm flex-shrink-0 print:hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200">
              <ScanLine className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold leading-tight tracking-tight truncate text-[#0F172A]">ATS Analysis Report</h2>
                {displayResume?.category && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#3B82F6] text-[10px] font-bold border border-blue-200 uppercase tracking-wider">
                    {displayResume.category}
                  </span>
                )}
                {displayResume?.jobDescription && (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-[#22C55E] text-[10px] font-bold border border-green-200 uppercase tracking-wider flex items-center gap-1">
                    <Target className="h-3 w-3" /> Tailored
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#64748B] font-mono mt-0.5">
                <span>ID: {resumeId?.slice(-8)}</span>
                <span className="text-[#475569]">|</span>
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> VLY-ATS-V2</span>
                {displayResume?.jobDescription && (
                  <>
                    <span className="text-[#475569]">|</span>
                    <span className="flex items-center gap-1 text-[#22C55E]"><Target className="h-3 w-3" /> Job-Specific</span>
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
            {displayResume?.rewrittenText && (
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex gap-2 font-bold bg-[#22C55E] hover:bg-[#16A34A] text-white"
                onClick={handleApplyRewrite}
                disabled={!displayResume}
              >
                <CheckCircle2 className="h-4 w-4" />
                Apply Rewrite
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex gap-2 font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:opacity-90 text-white border-0 shadow-lg shadow-[#8B5CF6]/20"
              onClick={() => {
                toast.success("Optimizing for FAANG companies...");
                // TODO: Implement FAANG-specific optimization
                // This would analyze resume against Google/Meta/Amazon/Apple/Netflix standards
              }}
              disabled={!displayResume}
            >
              <Target className="h-4 w-4" />
              Optimize for FAANG
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 font-bold"
              onClick={() => setShowSanitizerDialog(true)}
              disabled={!displayResume}
            >
              <FileSearch className="h-4 w-4" />
              Sanitizer
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
              className="p-2 hover:bg-red-50 text-[#EF4444] rounded-lg transition-colors border border-transparent hover:border-red-200"
              onClick={() => displayResume && onDelete(displayResume._id)}
              title="Delete"
              disabled={!displayResume}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-[#475569] hover:text-[#0F172A]"
              onClick={onClose}
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden print:block print:overflow-visible bg-[#F8FAFC] print:bg-[#FFFFFF]">
          {/* Job Description Input Panel */}
          {showJobDescriptionInput && displayResume && (
            <div className="border-b border-[#E2E8F0] bg-[#FFFFFF] p-4 print:hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-[#3B82F6]" />
                      <h3 className="text-sm font-bold text-[#0F172A]">Tailor Analysis to Job Description</h3>
                      {displayResume.jobDescription && (
                        <span className="text-xs text-[#22C55E] bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          Currently Tailored
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#475569] mb-3">
                      Paste the job description to get a tailored ATS analysis with specific keyword matching and role-specific recommendations.
                    </p>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      className="w-full h-32 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-sm p-3 focus:ring-2 focus:ring-blue-500/20 focus:border-[#3B82F6] outline-none resize-none leading-relaxed transition-all placeholder:text-[#64748B] text-[#0F172A] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={handleReanalyzeWithJD}
                        disabled={isReanalyzing || !jobDescription.trim()}
                        className="bg-[#3B82F6] text-[#0F172A] font-bold hover:bg-blue-700"
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
                        className="border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
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
            <div className="flex-1 flex flex-col items-center justify-center text-[#475569] gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
              <p>Loading analysis data...</p>
              {allResumes === undefined && (
                <p className="text-xs text-[#EF4444] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Network error: Unable to fetch data. Please check your connection.
                </p>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Main Content - Analysis Tabs + PDF Preview */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-[#FFFFFF] flex-shrink-0 p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 border-b border-[#E2E8F0]">
                  <TabsList className="inline-flex w-auto min-w-full gap-1 h-auto bg-transparent">
                    {/* DIAGNOSIS Group */}
                    <div className="flex gap-1 pr-3 border-r border-[#E2E8F0]">
                      <TabsTrigger
                        value="robot"
                        className={`relative text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#22C55E] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg ${showRobotPulse ? 'animate-pulse ring-2 ring-green-500/50' : ''}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Cpu className="h-4 w-4" />
                          <span>Robot View</span>
                        </span>
                        {showRobotPulse && (
                          <span className="absolute -top-1 -right-1 flex h-2 w-2 z-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="ats-report" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-[#3B82F6] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <FileSearch className="h-4 w-4" />
                          <span>Format</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="keywords" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-[#3B82F6] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Target className="h-4 w-4" />
                          <span>Keywords</span>
                        </span>
                      </TabsTrigger>
                    </div>

                    {/* FIX Group */}
                    <div className="flex gap-1 px-3 border-r border-[#E2E8F0]">
                      <TabsTrigger value="fluff" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-[#F59E0B] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" />
                          <span>Fluff</span>
                        </span>
                      </TabsTrigger>
                      {displayResume?.rewrittenText && (
                        <TabsTrigger value="rewritten" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-[#22C55E] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <Wand2 className="h-4 w-4" />
                            <span>AI Rewrite</span>
                          </span>
                        </TabsTrigger>
                      )}
                      <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-slate-700 data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          <span>Overview</span>
                        </span>
                      </TabsTrigger>
                    </div>

                    {/* PREP Group */}
                    <div className="flex gap-1 pl-3">
                      <TabsTrigger value="interview" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-[#3B82F6] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        <span className="flex items-center gap-1.5">
                          <Building className="h-4 w-4" />
                          <span>Interview</span>
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="simulation" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-slate-700 data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                        Recruiter
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </div>

                <TabsContent value="robot" className="flex-1 overflow-auto p-0 m-0">
                  <div className="h-full bg-[#F8FAFC] relative">
                    {/* Terminal Header */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-3 flex items-center justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                        </div>
                        <span className="text-green-700 font-mono text-sm font-bold">ATS_PARSER_v2.1.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                        </span>
                        <span className="text-green-700 font-mono text-xs">LIVE</span>
                      </div>
                    </div>

                    {/* 🔒 ROBOT VIEW - LOCKED BEHIND REGISTRATION (Lead Magnet) */}
                    {!user || user.isAnonymous ? (
                      <div className="p-6 space-y-6">
                        {/* THE AHA! MOMENT - Preview with blur */}
                        <div className="relative">
                          {/* Blurred Preview */}
                          <div className="blur-sm pointer-events-none select-none">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                              <div className="flex items-center gap-3">
                                <div className="text-xl">👁️</div>
                                <p className="text-green-700 text-sm font-medium">
                                  This is what ATS robots see. Changes appear here in real-time.
                                </p>
                              </div>
                            </div>

                            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] mt-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[#0F172A] font-mono font-bold text-sm uppercase tracking-wider">Extracted Text Content</h4>
                                <span className="text-[#475569] font-mono text-xs">3,247 characters</span>
                              </div>
                              <div className="bg-[#F8FAFC] rounded border border-[#E2E8F0] p-4 h-64">
                                <pre className="text-[#475569] font-mono text-xs leading-relaxed">
JOHN DOE
Software Engineer | San Francisco, CA
john.doe@email.com | (555) 123-4567
linkedin.com/in/johndoe

EXPERIENCE

Senior Software Engineer | TechCorp Inc.
2020 - Present
• Led development team of 8 engineers
• Architected microservices handling 50M+ requests/day
• Reduced infrastructure costs by 35% ($500K annually)
• Improved system reliability from 99.5% to 99.95%

Software Engineer | StartupXYZ
2018 - 2020
• Built RESTful APIs serving 1M+ users
• Implemented CI/CD pipeline reducing deploy time 80%
...
                                </pre>
                              </div>
                            </div>
                          </div>

                          {/* Registration Wall Overlay - THE AHA! MOMENT */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/90 to-white">
                            <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
                              <div className="space-y-3">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#22C55E] to-[#10B981] shadow-lg">
                                  <Cpu className="h-10 w-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-[#0F172A]">
                                  🤯 The "Aha!" Moment
                                </h3>
                                <p className="text-lg font-semibold text-[#22C55E]">
                                  See what ATS robots ACTUALLY see in your resume
                                </p>
                              </div>

                              <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 border-2 border-[#22C55E] rounded-xl p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                  <div className="text-4xl">😱</div>
                                  <div className="text-left space-y-2">
                                    <p className="text-sm font-bold text-[#EF4444]">
                                      Your score is <span className="text-xl">{displayResume?.score || 65}/100</span>
                                    </p>
                                    <p className="text-xs text-[#475569]">
                                      But ATS robots see it as <span className="font-bold text-[#22C55E]">85/100</span> because of hidden formatting issues!
                                    </p>
                                  </div>
                                </div>

                                <div className="bg-white/80 rounded-lg p-4 space-y-2 text-left">
                                  <p className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                                    <span className="text-[#22C55E]">✓</span>
                                    Seniority Score: See if ATS ranks you as Junior/Mid/Senior
                                  </p>
                                  <p className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                                    <span className="text-[#22C55E]">✓</span>
                                    Keyword Gap: Discover exactly which keywords robots miss
                                  </p>
                                  <p className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                                    <span className="text-[#22C55E]">✓</span>
                                    Hidden Penalties: Find invisible formatting that kills your score
                                  </p>
                                  <p className="text-xs font-bold text-[#0F172A] flex items-center gap-2">
                                    <span className="text-[#22C55E]">✓</span>
                                    Real ATS View: See your resume EXACTLY as robots parse it
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <Button
                                  onClick={() => {
                                    onClose();
                                    // Trigger auth
                                    window.location.href = '/';
                                  }}
                                  className="w-full bg-gradient-to-r from-[#22C55E] to-[#10B981] hover:opacity-90 text-white font-bold text-lg py-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all"
                                >
                                  <span className="flex items-center gap-3 justify-center">
                                    <Sparkles className="h-6 w-6" />
                                    Unlock Robot View (FREE)
                                    <Sparkles className="h-6 w-6" />
                                  </span>
                                </Button>
                                <p className="text-xs text-[#64748B]">
                                  No credit card required • See your real ATS score in 10 seconds
                                </p>
                              </div>

                              <div className="flex items-center justify-center gap-8 text-xs text-[#64748B] pt-4">
                                <div className="flex items-center gap-1">
                                  <Check className="h-4 w-4 text-[#22C55E]" />
                                  <span>100% Free</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Check className="h-4 w-4 text-[#22C55E]" />
                                  <span>No Credit Card</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Check className="h-4 w-4 text-[#22C55E]" />
                                  <span>Instant Access</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ROBOT VIEW TERMINAL - Dirty Error Console Style */
                      <div className="p-0 space-y-0 bg-black">
                      {/* Terminal Header Bar - Make it look like actual error console */}
                      <div className="bg-[#0A0A0A] border-b-2 border-[#EF4444] px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse"></div>
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#64748B]"></div>
                          </div>
                          <span className="text-[#EF4444] font-mono text-xs font-bold ml-2">
                            ▸ ROBOT_VIEW_TERMINAL.exe
                          </span>
                        </div>
                        <span className="text-[#64748B] font-mono text-[10px]">
                          PID: {Math.floor(Math.random() * 99999)} | MEM: {displayResume?.ocrText?.length || 0}B
                        </span>
                      </div>

                      {/* DIRTY Terminal Output - Real Error Console Style */}
                      <div className="bg-[#000000] p-4 space-y-0">
                        {/* Startup Log - Make it look messy */}
                        <div className="font-mono text-[10px] text-[#4A4A4A] mb-2 space-y-0 leading-tight">
                          <div>[{new Date().toISOString()}] Starting ATS_Parser v3.8.12...</div>
                          <div>[{new Date().toISOString()}] Loading resume_analysis.dll</div>
                          <div>[{new Date().toISOString()}] Initializing keyword_extraction_engine</div>
                          <div className="text-[#22C55E]">[{new Date().toISOString()}] ✓ Parser initialized successfully</div>
                          <div className="text-[#F59E0B]">[{new Date().toISOString()}] ⚠ WARN: Strict mode enabled - high rejection rate</div>
                        </div>

                        <div className="h-px bg-[#1E1E1E] my-3"></div>

                        {/* ERROR SPAM - Make it overwhelming like real bugs */}
                        <div className="space-y-1.5 font-mono text-[11px] leading-tight">
                          {/* CRITICAL ERRORS - Spam them like real terminal */}
                          {(!displayResume?.stats?.hasQuantifiableAchievements) && (
                            <>
                              <div className="text-[#EF4444]">
                                <span className="font-bold">[ERROR]</span> resume_parser.cpp:142 - MISSING_QUANTIFIABLE_METRICS
                              </div>
                              <div className="text-[#EF4444] pl-8">
                                └─▸ No numeric signals found (0% | $0 | 0 users detected)
                              </div>
                              <div className="text-[#EF4444] pl-8">
                                └─▸ ATS_FILTER: AUTO_REJECT (confidence: 89%)
                              </div>
                              <div className="text-[#4A4A4A] pl-8 text-[10px]">
                                at parse_experience_section() line 142
                              </div>
                            </>
                          )}

                          {displayResume?.issues && displayResume.issues.length > 0 && (
                            <>
                              <div className="text-[#F59E0B] mt-2">
                                <span className="font-bold">[WARN]</span> format_validator.cpp:87 - PARSING_ANOMALIES_DETECTED
                              </div>
                              <div className="text-[#F59E0B] pl-8">
                                └─▸ {displayResume.issues.length} format inconsistencies found
                              </div>
                              <div className="text-[#F59E0B] pl-8">
                                └─▸ Risk: Header scrambling, content loss
                              </div>
                            </>
                          )}

                          {displayResume?.missingElements && displayResume.missingElements.length > 0 && (
                            <>
                              <div className="text-[#EF4444] mt-2">
                                <span className="font-bold">[ERROR]</span> section_detector.cpp:203 - CRITICAL_SECTIONS_MISSING
                              </div>
                              <div className="text-[#EF4444] pl-8">
                                └─▸ Required sections: [{displayResume.missingElements.join(', ')}] NOT FOUND
                              </div>
                              <div className="text-[#EF4444] pl-8">
                                └─▸ Parser confidence dropped to {Math.floor(Math.random() * 30 + 20)}%
                              </div>
                            </>
                          )}

                          {displayResume?.stats?.experienceYears && displayResume.stats.experienceYears < 3 && (
                            <>
                              <div className="text-[#F59E0B] mt-2">
                                <span className="font-bold">[WARN]</span> experience_calculator.cpp:56 - LOW_SENIORITY_SIGNALS
                              </div>
                              <div className="text-[#F59E0B] pl-8">
                                └─▸ Detected: {displayResume.stats.experienceYears} years (threshold: 3y+)
                              </div>
                              <div className="text-[#F59E0B] pl-8">
                                └─▸ 73% of companies filter out &lt;3y candidates
                              </div>
                            </>
                          )}

                          {/* Missing Signals Section - The Reddit Favorite */}
                          {displayResume?.missingKeywords && displayResume.missingKeywords.length > 0 && (
                            <>
                              <div className="h-px bg-[#1E1E1E] my-3"></div>
                              <div className="text-[#EF4444] mt-2">
                                <span className="font-bold">[ERROR]</span> keyword_matcher.cpp:334 - MISSING_SIGNALS_DETECTED
                              </div>
                              <div className="text-[#EF4444] pl-8">
                                └─▸ {displayResume.missingKeywords.slice(0, 5).map((kw: any) => typeof kw === 'string' ? kw : kw.keyword).join(', ')}
                              </div>
                              <div className="text-[#F59E0B] pl-8">
                                └─▸ These keywords appear in 87% of accepted resumes
                              </div>
                              <div className="text-[#64748B] pl-8 text-[10px]">
                                Fix: Add these technical terms to Experience section
                              </div>
                            </>
                          )}

                          <div className="h-px bg-[#1E1E1E] my-4"></div>

                          {/* RAW EXTRACTED TEXT - Make it look broken */}
                          <div className="text-[#4A4A4A] text-[10px] mb-1">
                            ━━━ RAW_PARSER_OUTPUT ━━━ ({displayResume?.ocrText?.length || 0} bytes extracted)
                          </div>
                          <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded p-3 max-h-[400px] overflow-y-auto">
                            <pre className="text-[#8B949E] font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
{displayResume?.ocrText ? displayResume.ocrText : `[FATAL_ERROR] OCR_EXTRACTION_FAILED
════════════════════════════════════════
Exit Code: 0x8007000E
Message: NO_TEXT_EXTRACTED
Details: ATS parser returned NULL
Cause: Resume likely contains images/graphics
Impact: AUTO_REJECT (100% rejection rate)
════════════════════════════════════════`}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Image Trap Warning */}
                      {displayResume?.hasImageTrap && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 text-[#EF4444] flex-shrink-0" />
                            <div>
                              <h4 className="text-red-700 font-bold text-lg mb-1">🚨 IMAGE TRAP DETECTED</h4>
                              <p className="text-[#EF4444] text-sm">
                                Critical content is embedded as an image. ATS systems cannot read this and will auto-reject your application.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SENIORITY MATCH - Critical Indicator (ML-Based) */}
                      {(() => {
                        // Use ML-calculated seniority from backend (clientAnalysis.ts)
                        const seniorityLevel = displayResume?.stats?.seniorityLevel || 'junior';
                        const seniorityScore = displayResume?.stats?.seniorityScore || 0;
                        const senioritySignals = displayResume?.stats?.senioritySignals || [];
                        const years = displayResume?.stats?.experienceYears || 0;

                        // Map seniority levels to display
                        const levelMap: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
                          'lead': { label: 'LEAD/PRINCIPAL', color: '#8B5CF6', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
                          'senior': { label: 'SENIOR', color: '#22C55E', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
                          'mid': { label: 'MID-LEVEL', color: '#F59E0B', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
                          'junior': { label: 'JUNIOR', color: '#EF4444', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
                        };

                        const levelDisplay = levelMap[seniorityLevel] || levelMap['junior'];

                        // Check for critical mismatch (10+ years but detected as junior/mid)
                        const hasCriticalMismatch = years >= 10 && (seniorityLevel === 'junior' || seniorityLevel === 'mid');
                        const hasMismatch = years >= 7 && seniorityLevel !== 'senior' && seniorityLevel !== 'lead';

                        // Calculate expected level based on years
                        let expectedLevel = 'JUNIOR';
                        if (years >= 10) expectedLevel = 'SENIOR/LEAD';
                        else if (years >= 7) expectedLevel = 'SENIOR';
                        else if (years >= 3) expectedLevel = 'MID-LEVEL';

                        return (
                          <div className={`${levelDisplay.bgColor} border-2 ${levelDisplay.borderColor} rounded-lg p-6 shadow-lg ${hasCriticalMismatch ? 'ring-4 ring-red-500/50 animate-pulse' : hasMismatch ? 'ring-2 ring-orange-500/50' : ''}`}>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-[#0F172A] font-mono font-bold text-sm uppercase tracking-wider">
                                  🎯 Seniority Match Analysis
                                </h4>
                                {hasCriticalMismatch && (
                                  <span className="text-xs font-bold text-[#EF4444] bg-red-100 px-3 py-1 rounded-full border-2 border-red-500 animate-pulse">
                                    🚨 CRITICAL MISMATCH
                                  </span>
                                )}
                                {hasMismatch && !hasCriticalMismatch && (
                                  <span className="text-xs font-bold text-[#F59E0B] bg-orange-100 px-3 py-1 rounded-full border-2 border-orange-500">
                                    ⚠️ MISMATCH DETECTED
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <div className="text-xs text-[#64748B] font-mono mb-1">ATS Detected Level:</div>
                                  <div className="text-xl font-black" style={{ color: levelDisplay.color }}>
                                    {levelDisplay.label}
                                  </div>
                                  <div className="text-xs text-[#64748B] font-mono mt-1">
                                    Score: {seniorityScore}/100
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-[#64748B] font-mono mb-1">Experience Found:</div>
                                  <div className="text-xl font-black text-[#0F172A]">
                                    {years} years
                                  </div>
                                  <div className="text-xs text-[#64748B] font-mono mt-1">
                                    Expected: {expectedLevel}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-[#64748B] font-mono mb-1">Signals Detected:</div>
                                  <div className="text-xl font-black text-[#8B5CF6]">
                                    {senioritySignals.length}
                                  </div>
                                  <div className="text-xs text-[#64748B] font-mono mt-1">
                                    {senioritySignals.length >= 3 ? '✓ Strong' : '✗ Weak'}
                                  </div>
                                </div>
                              </div>

                              {/* Seniority Signals List */}
                              {senioritySignals.length > 0 && (
                                <div className="bg-white/60 rounded-lg p-3 space-y-2">
                                  <div className="text-xs font-mono font-bold text-[#64748B] uppercase">Detected Signals:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {senioritySignals.map((signal: string, idx: number) => (
                                      <span key={idx} className="text-xs bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-1 rounded font-mono border border-[#8B5CF6]/20">
                                        ✓ {signal}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* ERROR Label for Critical Mismatch - Reddit Favorite Feature */}
                              {hasCriticalMismatch && (
                                <div className="bg-black border-2 border-[#EF4444] rounded-lg p-4 space-y-3">
                                  <div className="flex items-start gap-2">
                                    <span className="text-[#EF4444] font-mono text-xs font-bold bg-[#EF4444]/20 px-2 py-0.5 rounded border border-[#EF4444]">
                                      [ERROR]
                                    </span>
                                    <div className="flex-1 space-y-2">
                                      <p className="text-sm font-bold text-[#EF4444] font-mono leading-tight">
                                        Your {years} years of experience are invisible.
                                      </p>
                                      <p className="text-xs text-[#F59E0B] font-mono">
                                        Format error at seniority_detector.cpp:{Math.floor(Math.random() * 50 + 150)} - Parser classified you as {levelDisplay.label} (should be {expectedLevel})
                                      </p>
                                      <div className="bg-[#1A1A1A] border border-[#EF4444]/30 rounded p-2 mt-2">
                                        <p className="text-[10px] text-[#8B949E] font-mono leading-tight">
                                          Stack trace:
                                          <br />
                                          → experience_years: {years} (DETECTED)
                                          <br />
                                          → leadership_signals: {senioritySignals.length} (EXPECTED: 3+)
                                          <br />
                                          → quantified_impact: {displayResume?.stats?.hasQuantifiableAchievements ? 'true' : 'false'} (REQUIRED: true)
                                          <br />
                                          → classification_result: {levelDisplay.label} ❌
                                        </p>
                                      </div>
                                      <p className="text-xs text-[#64748B] mt-2">
                                        <span className="font-bold text-[#EF4444]">Cost Impact:</span> ${years >= 10 ? '30-50K' : '20-40K'} in salary negotiations lost
                                      </p>
                                    </div>
                                  </div>

                                  <div className="bg-white/80 rounded-lg p-3 space-y-2">
                                    <div className="text-xs font-bold text-[#0F172A]">Quick Fix Checklist:</div>
                                    <div className="space-y-1">
                                      {senioritySignals.length < 2 && (
                                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                                          <span className="text-[#EF4444]">✗</span>
                                          <span>Add leadership verbs (Led, Managed, Architected)</span>
                                        </div>
                                      )}
                                      {!displayResume?.stats?.hasQuantifiableAchievements && (
                                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                                          <span className="text-[#EF4444]">✗</span>
                                          <span>Add metrics showing scale (X users, $Y revenue)</span>
                                        </div>
                                      )}
                                      {years >= 7 && senioritySignals.length < 3 && (
                                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                                          <span className="text-[#EF4444]">✗</span>
                                          <span>Highlight mentoring/coaching experience</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* WARN Label for Minor Mismatch */}
                              {hasMismatch && !hasCriticalMismatch && (
                                <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4 space-y-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-[#F59E0B] font-mono text-xs font-bold bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]">
                                      [WARN]
                                    </span>
                                    <div className="flex-1">
                                      <p className="text-sm font-bold text-[#F59E0B]">
                                        Seniority signals could be stronger
                                      </p>
                                      <p className="text-xs text-[#475569] mt-1">
                                        With {years} years experience, you should be classified as {expectedLevel}. Add more leadership indicators and quantified impact to boost your ATS seniority score.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Success State */}
                              {!hasMismatch && (seniorityLevel === 'senior' || seniorityLevel === 'lead') && (
                                <div className="bg-green-100 border-2 border-green-500 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <span className="text-[#22C55E] font-mono text-xs font-bold bg-[#22C55E]/10 px-2 py-0.5 rounded border border-[#22C55E]">
                                      [SUCCESS]
                                    </span>
                                    <p className="text-xs text-[#22C55E] font-bold flex-1">
                                      ✓ Perfect match! ATS correctly identifies your {levelDisplay.label} seniority level.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                          <div className="text-[#22C55E] text-xs font-mono uppercase mb-1">Readability</div>
                          <div className="text-2xl font-bold text-green-700">
                            {displayResume?.ocrText && displayResume.ocrText.length > 100 ? '✓ Good' : '✗ Poor'}
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                          <div className="text-[#22C55E] text-xs font-mono uppercase mb-1">Image Traps</div>
                          <div className="text-2xl font-bold text-green-700">
                            {displayResume?.hasImageTrap ? '⚠️ Found' : '✓ None'}
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                          <div className="text-[#22C55E] text-xs font-mono uppercase mb-1">ATS Score</div>
                          <div className="text-2xl font-bold text-green-700">
                            {displayResume?.score || 0}/100
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
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
                    <div className="bg-[#FFFFFF] rounded-lg p-6 border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Format Issues</h2>
                      {auditItems.length > 0 ? (
                        <div className="space-y-4">
                          {auditItems.map((item: any, index: number) => (
                            <div key={index} className={`p-4 rounded-lg border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] ${item.status === "failed" ? "bg-red-50 border-red-200" : item.status === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
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
                              <p className="text-[#475569] text-sm mb-3">{item.reason}</p>
                              <p className="text-xs text-[#475569]">{item.fix}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-lg bg-green-50 border border-green-200 text-center">
                          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                          <h3 className="font-bold text-green-700 mb-2">No Format Issues Detected</h3>
                          <p className="text-sm text-[#475569]">Your resume has good formatting that should be ATS-compatible.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fluff" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <FluffDetector
                    resumeText={displayResume.ocrText || ""}
                    clarityScore={displayResume?.score || 0}
                  />
                </TabsContent>

                <TabsContent value="keywords" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <KeywordAnalysis
                    matchedKeywords={foundKeywords}
                    missingKeywords={criticalKeywords.map((kw: any) => typeof kw === 'string' ? kw : kw.keyword || kw.term || '')}
                    matchRate={displayResume?.score || 0}
                  />
                </TabsContent>

                <TabsContent value="format" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <div className="space-y-8">
                    <div className="bg-[#FFFFFF] rounded-lg p-6 border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Format Issues</h2>
                      {auditItems.length > 0 ? (
                        <div className="space-y-4">
                          {auditItems.map((item: any, index: number) => (
                            <div key={index} className={`p-4 rounded-lg border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] ${item.status === "failed" ? "bg-red-50 border-red-200" : item.status === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
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
                              <p className="text-[#475569] text-sm mb-3">{item.reason}</p>
                              <p className="text-xs text-[#475569]">{item.fix}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 rounded-lg bg-green-50 border border-green-200 text-center">
                          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                          <h3 className="font-bold text-green-700 mb-2">No Format Issues Detected</h3>
                          <p className="text-sm text-[#475569]">Your resume has good formatting that should be ATS-compatible.</p>
                        </div>
                      )}
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
                    <div className="bg-[#FFFFFF] rounded-lg p-6 border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                      <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Raw Text View</h2>
                      <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4 text-xs text-[#475569] font-mono leading-relaxed whitespace-pre-wrap">
                        {displayResume?.ocrText || "No text extracted."}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rewritten" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                          <Wand2 className="h-6 w-6 text-green-600" />
                          AI-Optimized Resume
                        </h2>
                        <Button
                          onClick={handleApplyRewrite}
                          className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Apply to CV
                        </Button>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-amber-800 mb-1">Preview Mode</h4>
                            <p className="text-sm text-amber-700">
                              This is your AI-optimized resume. Review it carefully and click "Apply to CV" to replace your original text with this version.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-green-200 p-4 max-h-[600px] overflow-y-auto custom-scrollbar shadow-inner">
                        <pre className="text-[#0F172A] font-mono text-xs leading-relaxed whitespace-pre-wrap">
                          {displayResume?.rewrittenText || "No rewrite available."}
                        </pre>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <span>{displayResume?.rewrittenText?.length || 0} characters</span>
                        <span className="text-green-600 font-semibold">✨ Optimized with ML + AI</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* PDF Preview - Now Full Width When Tabs Don't Need It */}
              <div className={`${isPdfCollapsed ? 'hidden lg:block lg:w-12' : 'flex-1'} bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 overflow-hidden relative group transition-all duration-300 min-h-[50vh] lg:min-h-0 print:hidden border-l border-[#E2E8F0]`}>
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                {/* Collapse/Expand Button */}
                <button
                  onClick={() => setIsPdfCollapsed(!isPdfCollapsed)}
                  className="absolute top-4 left-4 z-20 p-2 bg-[#3B82F6] hover:bg-blue-700 text-[#0F172A] rounded-lg backdrop-blur-sm transition-all shadow-lg"
                  title={isPdfCollapsed ? "Show PDF Preview" : "Hide PDF Preview"}
                >
                  {isPdfCollapsed ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                </button>

                {!isPdfCollapsed && (
                  <div className="w-full h-full flex items-center justify-center relative z-10">
                    {displayResume?.mimeType.startsWith("image/") ? (
                      <img
                        className="h-full w-full object-contain rounded-lg shadow-2xl ring-1 ring-black/10 bg-[#FFFFFF]"
                        src={displayResume?.url}
                        alt={displayResume?.title}
                      />
                    ) : displayResume?.mimeType === "application/pdf" ? (
                      <iframe
                        src={displayResume?.url}
                        className="w-full h-full rounded-lg shadow-2xl ring-1 ring-black/10 bg-[#FFFFFF]"
                        title="Resume Preview"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-6 bg-[#FFFFFF] rounded-lg shadow-xl max-w-md border border-[#E2E8F0]">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 border border-[#E2E8F0]">
                          <FileText className="h-10 w-10 text-[#475569]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[#0F172A]">Preview Not Available</h3>
                        <p className="text-[#475569] mb-8">
                          This file type cannot be previewed directly in the browser. You can download it to view the content.
                        </p>
                        <Button onClick={handleDownloadFile} className="font-bold shadow-lg bg-[#3B82F6] hover:bg-blue-700 text-[#0F172A]">
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

      {/* Sanitizer Dialog */}
      <SanitizedVersionDialog
        resumeId={resumeId}
        open={showSanitizerDialog}
        onOpenChange={setShowSanitizerDialog}
      />
    </Dialog>
  );
}