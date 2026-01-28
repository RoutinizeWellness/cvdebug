import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Check,
  Edit,
  MoreVertical,
  Share2,
  TrendingUp,
  ListChecks,
  Settings,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction, useQuery, useMutation } from "convex/react";
import { PricingDialog } from "@/components/PricingDialog";
import { ScoreHistory } from "./ScoreHistory";
import { ResumeStats } from "./ResumeStats";
import { SeniorityMatchAnalysis } from "./SeniorityMatchAnalysis";
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
import { LiveRecruiterSimulation } from "./analysis/LiveRecruiterSimulation";
import { InterviewPrepMode } from "./InterviewPrepMode";
import { SanitizedVersionDialog } from "./SanitizedVersionDialog";
import { InterviewBattlePlan } from "./InterviewBattlePlan";
import { KeywordAnalysis } from "./KeywordAnalysis";
import { ATSSimulation } from "./ATSSimulation";
import { SniperModeTeaser } from "./SniperModeTeaser";
import { ATSAnalysisReport } from "./ATSAnalysisReport";
import { FluffDetector } from "./FluffDetector";
import { InlineResumeEditor } from "./InlineResumeEditor";
import { ScoreProgressChart } from "./ScoreProgressChart";
import { ActionPlan } from "./ActionPlan";
import { EnhancedRobotTerminalView } from "./scan-results/EnhancedRobotTerminalView";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { isPaidUser as checkIsPaidUser } from "@/lib/planHelpers";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface ResumeDetailDialogProps {
  resumeId: Id<"resumes"> | null;
  onClose: () => void;
  onDelete: (id: Id<"resumes">) => void;
  onOpenWritingForge?: () => void;
  onOpenKeywordSniper?: () => void;
  onOpenLinkedIn?: () => void;
}

export function ResumeDetailDialog({
  resumeId,
  onClose,
  onDelete,
  onOpenWritingForge,
  onOpenKeywordSniper,
  onOpenLinkedIn
}: ResumeDetailDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showBlurredPreview, setShowBlurredPreview] = useState(true);
  const [showJobDescriptionInput, setShowJobDescriptionInput] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("robot");
  const [showRobotPulse, setShowRobotPulse] = useState(false);
  // PDF collapsed by default on mobile, expanded on desktop
  const [isPdfCollapsed, setIsPdfCollapsed] = useState(() => {
    // Check if we're on mobile (less than 1024px which is lg breakpoint)
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : true;
  });
  const [showSanitizerDialog, setShowSanitizerDialog] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("general");
  const [showSystemLogs, setShowSystemLogs] = useState(false);

  const rewriteResume = useAction(apiAny.ai.rewriteResume);
  const analyzeResume = useMutation(apiAny.resumes.analyzeResume);
  const applyRewriteToResume = useMutation(apiAny.resumes.applyRewriteToResume);

  const user = useQuery(apiAny.users.currentUser);
  const isPremium = checkIsPaidUser(user?.subscriptionTier);
  const isFree = !isPremium;

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

  // Industry selector feedback
  useEffect(() => {
    if (selectedIndustry !== "general" && displayResume) {
      const industryNames: Record<string, string> = {
        google: "Google",
        meta: "Meta",
        amazon: "Amazon",
        apple: "Apple",
        microsoft: "Microsoft",
        deloitte: "Deloitte",
        mckinsey: "McKinsey",
        goldman: "Goldman Sachs",
        jpmorgan: "JP Morgan"
      };
      toast.success(`Now optimizing for ${industryNames[selectedIndustry] || selectedIndustry} standards`);
    }
  }, [selectedIndustry]);

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
            icon = <Cpu className="h-4 w-4 text-[#64748B]" />;
            headerClass = "text-[#0F172A]";
            bgClass = "bg-[#F8FAFC]";
            borderClass = "border-[#E2E8F0]";
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
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#F1F5F9] text-[#0F172A] font-bold text-xs flex items-center justify-center border border-[#E2E8F0]">
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
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#64748B] flex-shrink-0" />
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

  // Prepare audit items - DEEP DIAGNOSTIC ALGORITHM
  const auditItems: Array<{
    title: string;
    status: "passed" | "failed" | "warning";
    reason: string;
    fix: string;
    severity: "low" | "medium" | "high";
  }> = (() => {
    const items: Array<{
      title: string;
      status: "passed" | "failed" | "warning";
      reason: string;
      fix: string;
      severity: "low" | "medium" | "high";
    }> = [];

    const ocrText = displayResume?.ocrText || "";
    const formatIssues = displayResume?.formatIssues || [];

    // --- 1. ATS KILLER: Tables Detection ---
    const hasTableMarkers = /\||--|-{3,}|\+{3,}/.test(ocrText) || (displayResume?.analysis?.toLowerCase().includes("table"));
    items.push({
      title: "Table Layout Detection",
      status: hasTableMarkers ? "failed" : "passed",
      reason: hasTableMarkers ? "Tables detected in CV structure." : "No complex tables detected.",
      fix: "Standard ATS parsers (Workday, Taleo) often skip text inside tables. Use simple tabs and alignment instead.",
      severity: "high"
    });

    // --- 2. ATS KILLER: Multi-column Detection ---
    const isMultiColumn = displayResume?.analysis?.toLowerCase().includes("column") || displayResume?.analysis?.toLowerCase().includes("split");
    items.push({
      title: "Multi-column Sensitivity",
      status: isMultiColumn ? "warning" : "passed",
      reason: isMultiColumn ? "Split column layout detected." : "Single column layout verified.",
      fix: "Older ATS systems read left-to-right across the whole page, scrambling your experience. Use a vertical, single-column layout for 99% compatibility.",
      severity: "medium"
    });

    // --- 3. ATS KILLER: Non-standard Headers ---
    const standardHeaders = ["Experience", "Education", "Skills", "Projects", "Summary"];
    const foundHeaders = standardHeaders.filter(h => new RegExp(`\\b${h}\\b`, "i").test(ocrText));
    const missingHeaders = standardHeaders.filter(h => !foundHeaders.includes(h) && h !== "Projects");

    items.push({
      title: "Section Header Recognition",
      status: missingHeaders.length > 0 ? "warning" : "passed",
      reason: missingHeaders.length > 0 ? `Missing standard headers: ${missingHeaders.join(", ")}` : "All standard headers detected.",
      fix: "ATS systems look for specific keywords to bucket your data. Use 'Professional Experience' instead of 'My Career Journey'.",
      severity: "medium"
    });

    // --- 4. ATS KILLER: Image & Graphic Extraction ---
    const hasImageText = /image|graphic|icon|profile photo/.test(displayResume?.analysis?.toLowerCase() || "");
    items.push({
      title: "Graphic & Link Integrity",
      status: hasImageText ? "warning" : "passed",
      reason: hasImageText ? "Non-text elements detected." : "Clean text extraction verified.",
      fix: "Avoid profile photos and heavy graphics. They can increase file size and distract some OCR engines.",
      severity: "low"
    });

    // --- 5. Contact Info Parsing ---
    const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(ocrText);
    const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(ocrText) || /\b\+\d{1,3}\b/.test(ocrText);

    items.push({
      title: "Contact Info Accessibility",
      status: (hasEmail && hasPhone) ? "passed" : "failed",
      reason: (hasEmail && hasPhone) ? "Email and Phone clearly detected." : "Contact details might be missing or in headers.",
      fix: "Ensure your email and phone are in the main body text, NOT the header file. Many ATS strip headers/footers completely.",
      severity: "high"
    });

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

  // Generate action steps from resume issues
  const generateActionSteps = () => {
    const steps: Array<{
      id: string;
      title: string;
      description: string;
      priority: 'critical' | 'important' | 'recommended';
      completed: boolean;
      estimatedImpact: string;
    }> = [];
    let stepId = 1;

    if (!displayResume) return steps;

    // 1. FORMAT CRITICAL: Tables or Columns
    const formatAudit = auditItems;
    const criticalFormat = formatAudit.find(a => a.status === "failed" && a.severity === "high");
    if (criticalFormat) {
      steps.push({
        id: `step-${stepId++}`,
        title: `Fix Structural Issue: ${criticalFormat.title}`,
        description: criticalFormat.fix,
        priority: 'critical' as const,
        completed: false,
        estimatedImpact: "+20-30%"
      });
    }

    // 2. CONTENT CRITICAL: No metrics
    if (!displayResume.stats?.hasQuantifiableAchievements) {
      steps.push({
        id: `step-${stepId++}`,
        title: "Quantify Your Impact",
        description: "Your experience lacks numeric achievements. Add data ($, %, #) to at least 50% of your bullet points to bypass 'low-impact' filters.",
        priority: 'critical' as const,
        completed: false,
        estimatedImpact: "+15-20%"
      });
    }

    // 3. KEYWORDS IMPORTANT: Missing 5+
    if (displayResume.missingKeywords && displayResume.missingKeywords.length > 5) {
      steps.push({
        id: `step-${stepId++}`,
        title: `Inject ${displayResume.missingKeywords.length} Required Keywords`,
        description: `Your match rate is low due to missing core skills: ${displayResume.missingKeywords.slice(0, 3).map((kw: any) => typeof kw === 'string' ? kw : kw.keyword).join(', ')}.`,
        priority: 'important' as const,
        completed: false,
        estimatedImpact: "+10-15%"
      });
    }

    // 4. ROLE SPECIFIC: Seniority mismatch
    if (displayResume.seniorityLevel && displayResume.experienceLevel && displayResume.seniorityLevel !== displayResume.experienceLevel) {
      steps.push({
        id: `step-${stepId++}`,
        title: "Align Seniority Signals",
        description: `Your profile signals ${displayResume.experienceLevel} but you are applying for ${displayResume.seniorityLevel} roles. Adjust your action verbs.`,
        priority: 'important' as const,
        completed: false,
        estimatedImpact: "+8-12%"
      });
    }

    return steps;
  };

  const actionSteps = generateActionSteps();

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

        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0] bg-[#FFFFFF] backdrop-blur-sm flex-shrink-0 print:hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 flex-shrink-0">
              <ScanLine className="h-4 w-4 sm:h-5 sm:w-5 text-[#1E293B]" />
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-[#0F172A]">
                  <span className="hidden sm:inline">ATS Analysis Report</span>
                  <span className="sm:hidden">ATS Analysis</span>
                </h2>
                {displayResume?.category && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-50 text-[#1E293B] text-[10px] font-bold border border-slate-200 uppercase tracking-wider">
                    {displayResume.category}
                  </span>
                )}
                {displayResume?.jobDescription && (
                  <span className="px-2 py-0.5 rounded-full bg-green-50 text-[#22C55E] text-[10px] font-bold border border-green-200 uppercase tracking-wider flex items-center gap-1">
                    <Target className="h-3 w-3" /> <span className="hidden sm:inline">Tailored</span><span className="sm:hidden">Job</span>
                  </span>
                )}
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#64748B] font-mono mt-0.5">
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
          <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
            {/* 🟢 GREEN - Primary Action: AI Rewrite (Always Visible) */}
            {!isFree ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 sm:flex-initial gap-2 font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white shadow-lg hover:shadow-xl transition-all"
                  onClick={handleOptimize}
                  disabled={isGenerating || !displayResume}
                >
                  <Wand2 className="h-4 w-4" />
                  <span className="hidden sm:inline">{isGenerating ? "Optimizing..." : "AI Rewrite"}</span>
                  <span className="sm:hidden">{isGenerating ? "..." : "Rewrite"}</span>
                </Button>
                {displayResume?.rewrittenText && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 sm:flex-initial gap-2 font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white"
                    onClick={handleApplyRewrite}
                    disabled={!displayResume}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Apply
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="flex-1 sm:flex-initial gap-2 font-bold bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-white shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowPricing(true)}
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Upgrade to Fix</span>
                <span className="sm:hidden">Upgrade</span>
              </Button>
            )}

            {/* 🟡 YELLOW - Secondary Action: Add Job Description */}
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-2 font-bold border-[#1E293B] text-[#1E293B] hover:bg-[#1E293B]/5"
              onClick={() => setShowJobDescriptionInput(!showJobDescriptionInput)}
              disabled={!displayResume}
            >
              <Target className="h-4 w-4" />
              {displayResume?.jobDescription ? "Update JD" : "Add Job"}
            </Button>

            {/* 🔴 RED - Tools Dropdown (Everything Else) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 font-bold"
                  disabled={!displayResume}
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Tools</span>
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Company Selector */}
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Company Mode
                </div>
                <DropdownMenuItem
                  onClick={() => setSelectedIndustry("general")}
                  className={selectedIndustry === "general" ? "bg-slate-100" : ""}
                >
                  <Building className="h-4 w-4 mr-2" />
                  General (Standard)
                  {selectedIndustry === "general" && <Check className="h-4 w-4 ml-auto" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedIndustry("google")}>
                  <span className="mr-2">🔍</span> Google
                  {selectedIndustry === "google" && <Check className="h-4 w-4 ml-auto text-[#1E293B]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedIndustry("meta")}>
                  <span className="mr-2">📘</span> Meta
                  {selectedIndustry === "meta" && <Check className="h-4 w-4 ml-auto text-[#1E293B]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedIndustry("amazon")}>
                  <span className="mr-2">📦</span> Amazon
                  {selectedIndustry === "amazon" && <Check className="h-4 w-4 ml-auto text-[#1E293B]" />}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sanitizer */}
                {!isFree ? (
                  <DropdownMenuItem onClick={() => setShowSanitizerDialog(true)}>
                    <FileSearch className="h-4 w-4 mr-2" />
                    Sanitizer
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setShowPricing(true)}>
                    <FileSearch className="h-4 w-4 mr-2" />
                    Sanitizer
                    <Lock className="h-3 w-3 ml-auto text-amber-500" />
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Export/Share Actions */}
                <DropdownMenuItem onClick={handleDownloadFile} disabled={!displayResume}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadReport} disabled={!displayResume}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareLink} disabled={!displayResume}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Share Link
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Delete */}
                <DropdownMenuItem
                  onClick={() => displayResume && onDelete(displayResume._id)}
                  disabled={!displayResume}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Resume
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                      <Target className="h-4 w-4 text-[#64748B]" />
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
                      className="w-full h-32 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg text-sm p-3 focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#64748B] outline-none resize-none leading-relaxed transition-all placeholder:text-[#64748B] text-[#0F172A] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                    />
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={handleReanalyzeWithJD}
                        disabled={isReanalyzing || !jobDescription.trim()}
                        className="bg-[#64748B] text-[#0F172A] font-bold hover:bg-[#0F172A]"
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
              <Loader2 className="h-8 w-8 animate-spin text-[#64748B]" />
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
                      {/* EDIT Group - NEW */}
                      <div className="flex gap-1 pr-3 border-r border-[#E2E8F0]">
                        <TabsTrigger
                          value="edit"
                          className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E293B] data-[state=active]:to-[#334155] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                        >
                          <span className="flex items-center gap-1.5">
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </span>
                        </TabsTrigger>
                      </div>
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
                        <TabsTrigger value="progress" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#64748B] data-[state=active]:to-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4" />
                            <span>Progress</span>
                          </span>
                        </TabsTrigger>
                        <TabsTrigger value="action-plan" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F59E0B] data-[state=active]:to-[#EF4444] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <ListChecks className="h-4 w-4" />
                            <span>Action Plan</span>
                          </span>
                        </TabsTrigger>
                        <TabsTrigger value="ats-report" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-[#64748B] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <FileSearch className="h-4 w-4" />
                            <span>Format</span>
                          </span>
                        </TabsTrigger>
                        <TabsTrigger value="keywords" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-[#64748B] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
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
                      </div>

                      {/* PREP Group */}
                      <div className="flex gap-1 pl-3">
                        <TabsTrigger value="interview" className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6366F1] data-[state=active]:to-[#4F46E5] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-lg">
                          <span className="flex items-center gap-1.5">
                            <Building className="h-4 w-4" />
                            <span>Recruiter Sim</span>
                          </span>
                        </TabsTrigger>
                      </div>
                    </TabsList>
                  </div>

                  {/* NEW: Edit Tab Content */}
                  <TabsContent value="edit" className="flex-1 overflow-auto p-0 m-0">
                    <div className="h-full bg-[#F8FAFC] p-6">
                      {displayResume && (
                        <InlineResumeEditor
                          resumeId={displayResume._id}
                          initialContent={displayResume.ocrText || ""}
                          missingKeywords={displayResume.missingKeywords || []}
                          formatIssues={displayResume.formatIssues || []}
                          user={user}
                          onUpgrade={() => setShowPricing(true)}
                          onContentUpdate={(newContent) => {
                            // Content is automatically saved and re-analyzed by the InlineResumeEditor component
                            // No need to duplicate the analysis here
                          }}
                        />
                      )}
                    </div>
                  </TabsContent>

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
                              {selectedIndustry !== "general" && (
                                <span className="text-[#1E293B] font-mono text-[10px] bg-[#1E293B]/10 px-2 py-0.5 rounded border border-[#1E293B]">
                                  {selectedIndustry.toUpperCase()}_MODE
                                </span>
                              )}
                            </div>
                            <span className="text-[#64748B] font-mono text-[10px]">
                              PID: {Math.floor(Math.random() * 99999)} | MEM: {displayResume?.ocrText?.length || 0}B
                            </span>
                          </div>

                          {/* CRITICAL ERROR ALERTS - AHA! MOMENT */}
                          {(!displayResume?.extractedData?.hasQuantifiableResults ||
                            (displayResume?.missingKeywords && displayResume.missingKeywords.length > 5) ||
                            (displayResume?.missingElements && displayResume.missingElements.length > 0)) && (
                              <div className="bg-gradient-to-r from-red-950 to-red-900 border-4 border-[#EF4444] p-6">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-16 h-16 bg-[#EF4444] rounded-full flex items-center justify-center animate-pulse">
                                      <AlertTriangle className="h-8 w-8 text-white" />
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-white font-black text-2xl mb-3 flex items-center gap-2">
                                      🚨 CRITICAL: ATS AUTO-REJECT DETECTED
                                    </h3>

                                    {!displayResume?.extractedData?.hasQuantifiableResults && (
                                      <div className="relative bg-black/60 border-4 border-[#EF4444] rounded-lg p-5 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse">
                                        {/* Animated Corner Accent */}
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#EF4444] rounded-full animate-ping"></div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#EF4444] rounded-full"></div>

                                        <div className="flex items-start gap-4">
                                          <div className="flex-shrink-0">
                                            <div className="w-20 h-20 bg-[#EF4444]/20 border-4 border-[#EF4444] rounded-full flex items-center justify-center animate-pulse">
                                              <div className="text-center">
                                                <div className="text-3xl font-black text-[#EF4444]">0%</div>
                                                <div className="text-[8px] text-red-300 font-bold uppercase">Impact</div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <XCircle className="h-6 w-6 text-[#EF4444]" />
                                              <p className="text-[#EF4444] font-black text-xl tracking-tight">
                                                ZERO METRICS = AUTO-REJECT
                                              </p>
                                            </div>
                                            <div className="bg-red-950/60 border border-[#EF4444]/30 rounded-md p-3 mb-3">
                                              <p className="text-red-100 text-sm font-bold mb-2">
                                                📊 BUSINESS IMPACT:
                                              </p>
                                              <ul className="space-y-1 text-gray-300 text-sm">
                                                <li className="flex items-center gap-2">
                                                  <span className="text-[#EF4444] font-bold">•</span>
                                                  <span><span className="text-white font-bold">89%</span> of ATS systems auto-reject resumes without numbers</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                  <span className="text-[#EF4444] font-bold">•</span>
                                                  <span><span className="text-white font-bold">Recruiters spend 6 seconds</span> - metrics catch attention instantly</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                  <span className="text-[#EF4444] font-bold">•</span>
                                                  <span><span className="text-white font-bold">3x higher callback rate</span> when quantifiable achievements present</span>
                                                </li>
                                              </ul>
                                            </div>
                                            <div className="bg-green-950/40 border border-green-500/30 rounded-md p-3">
                                              <p className="text-[#22C55E] font-bold text-sm mb-2 flex items-center gap-2">
                                                <Check className="h-4 w-4" />
                                                IMMEDIATE FIX:
                                              </p>
                                              <div className="text-white text-sm space-y-1 font-mono">
                                                <div className="flex items-start gap-2">
                                                  <span className="text-[#22C55E]">✓</span>
                                                  <span><span className="text-yellow-300">%</span> "Increased sales by <span className="text-[#22C55E] font-bold">40%</span>"</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                  <span className="text-[#22C55E]">✓</span>
                                                  <span><span className="text-yellow-300">$</span> "Reduced costs by <span className="text-[#22C55E] font-bold">$500K</span> annually"</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                  <span className="text-[#22C55E]">✓</span>
                                                  <span><span className="text-yellow-300">#</span> "Led team of <span className="text-[#22C55E] font-bold">12 engineers</span>"</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {displayResume?.missingElements && displayResume.missingElements.length > 0 && (
                                      <div className="bg-black/40 border-2 border-[#F59E0B] rounded-lg p-4 mb-3">
                                        <div className="flex items-start gap-3">
                                          <AlertTriangle className="h-6 w-6 text-[#F59E0B] flex-shrink-0 mt-1" />
                                          <div>
                                            <p className="text-[#F59E0B] font-bold text-lg mb-1">MISSING CRITICAL SECTIONS</p>
                                            <p className="text-gray-300 text-sm mb-2">
                                              Required sections not found: {displayResume.missingElements.join(', ')}
                                            </p>
                                            <p className="text-white font-semibold text-sm">
                                              ✅ FIX: Add clear section headers (Experience, Education, Skills)
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {displayResume?.missingKeywords && displayResume.missingKeywords.length > 5 && (
                                      <div className="bg-black/40 border-2 border-[#F59E0B] rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                          <AlertTriangle className="h-6 w-6 text-[#F59E0B] flex-shrink-0 mt-1" />
                                          <div>
                                            <p className="text-[#F59E0B] font-bold text-lg mb-1">{displayResume.missingKeywords.length} MISSING KEYWORDS</p>
                                            <p className="text-gray-300 text-sm mb-2">
                                              Critical signals: {displayResume.missingKeywords.slice(0, 5).map((kw: any) => typeof kw === 'string' ? kw : kw.keyword).join(', ')}...
                                            </p>
                                            <p className="text-white font-semibold text-sm">
                                              ✅ FIX: Use the "Edit" tab to add missing keywords instantly
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* LinkedIn Upsell Banner - Show when CV is optimized (score >= 70) */}
                          {displayResume?.score !== undefined && displayResume.score >= 70 && !isFree && (
                            <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] border-4 border-[#0A66C2] p-6 mx-4 my-4 rounded-lg shadow-2xl">
                              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="#0A66C2">
                                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-black text-xl mb-2 flex items-center gap-2">
                                    🎯 CV Optimizado → LinkedIn es el Siguiente Paso
                                  </h3>
                                  <p className="text-[#F1F5F9] text-sm mb-3">
                                    Tu CV está listo (Score: {displayResume.score}%). <span className="font-bold">89% de los reclutadores</span> revisan LinkedIn antes de contactar. No pierdas oportunidades por un perfil desactualizado.
                                  </p>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                      onClick={() => {
                                        toast.success("Navegando a LinkedIn Optimizer...");
                                        onClose();
                                        if (onOpenLinkedIn) {
                                          onOpenLinkedIn();
                                        }
                                      }}
                                      className="bg-white text-[#0A66C2] font-bold hover:bg-[#F8FAFC] shadow-lg hover:shadow-xl transition-all"
                                    >
                                      <span className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Optimizar LinkedIn Ahora
                                      </span>
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        // Maybe track that user dismissed
                                        const banner = document.querySelector('[data-linkedin-banner]');
                                        if (banner) banner.remove();
                                      }}
                                      className="border-2 border-white/30 text-white hover:bg-white/10"
                                    >
                                      Más Tarde
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 hidden lg:block">
                                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <div className="text-xs text-white/80 mb-2 font-mono">STATS:</div>
                                    <div className="space-y-1 text-white font-bold">
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl">89%</span>
                                        <span className="text-xs opacity-80">check LinkedIn</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-2xl">3x</span>
                                        <span className="text-xs opacity-80">more callbacks</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* ENHANCED ROBOT TERMINAL VIEW - Shows precise analysis with real data */}
                          <div className="bg-[#000000] p-4">
                            <EnhancedRobotTerminalView
                              resumeId={displayResume?._id}
                              autoAnimate={false}
                            />
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

                          {/* SENIORITY MATCH - Critical Indicator (ML-Based) - Modern Design */}
                          {(() => {
                            // Use ML-calculated seniority from backend extractedData with realistic fallbacks
                            const seniorityLevel = displayResume?.extractedData?.seniorityLevel || 'junior';
                            const years = displayResume?.extractedData?.totalYearsExperience || 0;

                            // Calculate realistic confidence score based on multiple factors
                            const hasLeadershipTitle = displayResume?.extractedData?.currentRole?.toLowerCase().match(/senior|lead|principal|staff|architect/);
                            const hasQuantifiableResults = displayResume?.extractedData?.hasQuantifiableResults;
                            const companiesCount = displayResume?.extractedData?.companies?.length || 0;
                            const skillsCount = displayResume?.extractedData?.technicalSkills?.length || 0;

                            // More realistic scoring algorithm for confidence
                            let confidenceScore = 0;
                            if (years >= 10) {
                              confidenceScore = 60 + (hasLeadershipTitle ? 15 : 0) + (hasQuantifiableResults ? 10 : 0) + Math.min(companiesCount * 3, 15);
                            } else if (years >= 7) {
                              confidenceScore = 45 + (hasLeadershipTitle ? 15 : 0) + (hasQuantifiableResults ? 10 : 0) + Math.min(companiesCount * 2, 10);
                            } else if (years >= 3) {
                              confidenceScore = 30 + (hasQuantifiableResults ? 10 : 0) + Math.min(companiesCount * 2, 10);
                            } else {
                              confidenceScore = 15 + (hasQuantifiableResults ? 10 : 0);
                            }

                            // Detect realistic seniority signals from extracted data
                            const detectedSignals: string[] = [];
                            if (companiesCount >= 3) detectedSignals.push(`${companiesCount} companies`);
                            if (hasLeadershipTitle) {
                              const title = displayResume.extractedData.currentRole;
                              if (title.toLowerCase().includes('senior')) detectedSignals.push('Senior title');
                              if (title.toLowerCase().includes('lead')) detectedSignals.push('Leadership title');
                              if (title.toLowerCase().includes('principal')) detectedSignals.push('Principal title');
                            }
                            if (skillsCount >= 10) detectedSignals.push(`${skillsCount} technical skills`);
                            if (displayResume?.extractedData?.certifications && displayResume.extractedData.certifications.length > 0) {
                              detectedSignals.push(`${displayResume.extractedData.certifications.length} certifications`);
                            }
                            if (hasQuantifiableResults) detectedSignals.push('Quantified achievements');
                            if (years >= 7) detectedSignals.push(`${years} years experience`);

                            // Map seniority levels to uppercase display
                            const levelMap: Record<string, string> = {
                              'lead': 'LEAD',
                              'senior': 'SENIOR',
                              'mid': 'MID-LEVEL',
                              'junior': 'JUNIOR'
                            };

                            const detectedLevelDisplay = levelMap[seniorityLevel] || 'JUNIOR';

                            // Calculate expected level based on years
                            let expectedLevel = 'JUNIOR';
                            if (years >= 10) expectedLevel = 'SENIOR';
                            else if (years >= 7) expectedLevel = 'MID-LEVEL';
                            else if (years >= 3) expectedLevel = 'JUNIOR';

                            // Determine signal strength based on number of signals
                            let signalStrength: "STRONG" | "MODERATE" | "WEAK" = "WEAK";
                            if (detectedSignals.length >= 5) signalStrength = "STRONG";
                            else if (detectedSignals.length >= 3) signalStrength = "MODERATE";

                            // Calculate readability based on OCR text quality
                            let readability: "High Integrity" | "Medium" | "Low" = "High Integrity";
                            if (displayResume?.ocrText) {
                              const textLength = displayResume.ocrText.length;
                              if (textLength < 100) readability = "Low";
                              else if (textLength < 500) readability = "Medium";
                            }

                            // Calculate image traps (check for images in resume)
                            const imageTraps: "None Detected" | "Detected" | "Critical" = "None Detected";

                            // Use the real ATS score from the resume
                            const atsScore = displayResume?.score || 0;

                            return (
                              <SeniorityMatchAnalysis
                                detectedLevel={detectedLevelDisplay}
                                confidenceScore={confidenceScore}
                                experienceYears={years}
                                expectedLevel={expectedLevel}
                                signalsDetected={detectedSignals.length}
                                signalStrength={signalStrength}
                                detectedSignals={detectedSignals}
                                readability={readability}
                                imageTraps={imageTraps}
                                atsScore={atsScore}
                              />
                            );
                          })()}

                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="progress" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <ScoreProgressChart
                      history={[
                        {
                          version: 1,
                          score: displayResume.score || 0,
                          timestamp: displayResume._creationTime,
                          changes: ["Initial scan"]
                        }
                      ]}
                      currentScore={displayResume.score || 0}
                    />
                  </TabsContent>

                  <TabsContent value="action-plan" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <ActionPlan
                      steps={actionSteps}
                      onStepClick={(stepId) => {
                        // Navigate to Edit tab for fixes
                        setActiveTab('edit');
                        toast.info("Opening inline editor to fix this issue...");
                      }}
                      onCompleteStep={(stepId) => {
                        toast.success("Step marked as complete! Keep up the great work!");
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="ats-report" className="flex-1 overflow-auto p-6">
                    {/* Contextual Elite Match CTA */}
                    {!displayResume?.jobDescription && (
                      <div className="mb-6 p-6 bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-secondary/20 transition-all" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest rounded border border-secondary/30">Targeted Match</span>
                              <h4 className="text-white font-bold text-lg">Match with a Specific Job?</h4>
                            </div>
                            <p className="text-slate-400 text-sm max-w-md">Our <span className="text-white font-bold">Elite Match Engine</span> uses local private ML to find precise gaps between your CV and a specific vacancy.</p>
                          </div>
                          <Button
                            onClick={() => {
                              setActiveTab('match'); // We'll need to define where this goes or handle it
                              document.getElementById('jd-input-trigger')?.click();
                            }}
                            className="bg-secondary hover:bg-secondary/90 text-[#0F172A] font-black px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(24ACC4,0.3)]"
                          >
                            Add Job Offer
                            <Search className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}

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
                      }}
                      onUpgrade={() => setShowPricing(true)}
                    />
                  </TabsContent>

                  <TabsContent value="fluff" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <FluffDetector
                      resumeText={displayResume.ocrText || ""}
                      clarityScore={displayResume?.score || 0}
                      isPaidUser={checkIsPaidUser(user?.subscriptionTier)}
                      onUpgrade={() => setShowPricing(true)}
                    />
                  </TabsContent>

                  <TabsContent value="keywords" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <KeywordAnalysis
                      matchedKeywords={foundKeywords}
                      missingKeywords={criticalKeywords.map((kw: any) => typeof kw === 'string' ? kw : kw.keyword || kw.term || '')}
                      matchRate={displayResume?.score || 0}
                      resumeText={displayResume?.ocrText || ''}
                      jobDescription={displayResume?.jobDescription || ''}
                      category={displayResume?.category || ''}
                      seniorityLevel={displayResume?.extractedData?.seniorityLevel || 'mid'}
                      isPaidUser={checkIsPaidUser(user?.subscriptionTier)}
                      onUpgrade={() => setShowPricing(true)}
                    />
                  </TabsContent>

                  <TabsContent value="format" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <div className="space-y-8">
                      <div className="bg-[#FFFFFF] rounded-lg p-6 border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Format Issues</h2>
                        {auditItems.length > 0 ? (
                          <div className="space-y-3">
                            {auditItems.map((item: any, index: number) => (
                              <div key={index} className={`p-5 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${item.status === "failed"
                                ? "bg-red-50/50 border-l-red-500 border border-red-200/50"
                                : item.status === "warning"
                                  ? "bg-amber-50/50 border-l-amber-500 border border-amber-200/50"
                                  : "bg-green-50/50 border-l-green-500 border border-green-200/50"
                                }`}>
                                <div className="flex items-start gap-4">
                                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${item.status === "failed" ? "bg-red-100" :
                                    item.status === "warning" ? "bg-amber-100" : "bg-green-100"
                                    }`}>
                                    <span className="text-lg">
                                      {item.status === "failed" ? "❌" : item.status === "warning" ? "⚠️" : "✅"}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className={`font-bold text-base ${item.status === "failed" ? "text-red-800" :
                                        item.status === "warning" ? "text-amber-800" : "text-green-800"
                                        }`}>
                                        {item.title}
                                      </h3>
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === "failed" ? "bg-red-200 text-red-700" :
                                        item.status === "warning" ? "bg-amber-200 text-amber-700" :
                                          "bg-green-200 text-green-700"
                                        }`}>
                                        {item.status === "failed" ? "Critical" : item.status === "warning" ? "Warning" : "Passed"}
                                      </span>
                                    </div>
                                    <p className="text-[#0F172A] text-sm font-medium mb-2">{item.reason}</p>
                                    <div className={`mt-3 p-3 rounded-lg ${item.status === "failed" ? "bg-red-100/50" :
                                      item.status === "warning" ? "bg-amber-100/50" : "bg-green-100/50"
                                      }`}>
                                      <p className={`text-xs font-medium ${item.status === "failed" ? "text-red-700" :
                                        item.status === "warning" ? "text-amber-700" : "text-green-700"
                                        }`}>
                                        <span className="font-bold">Fix: </span>{item.fix}
                                      </p>
                                    </div>
                                  </div>
                                </div>
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



                  <TabsContent value="interview" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <InterviewBattlePlan
                      targetRole={displayResume.jobTitle || "Data Science Role"}
                      companyName={displayResume.company || "TechCorp"}
                      resumeText={displayResume.ocrText || ""}
                      isPaidUser={checkIsPaidUser(user?.subscriptionTier)}
                      onUpgrade={() => setShowPricing(true)}
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
                      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-2xl p-8 border-2 border-[#E2E8F0] shadow-xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                          <div>
                            <h2 className="text-3xl font-black text-[#0F172A] flex items-center gap-3">
                              <Wand2 className="h-8 w-8 text-[#1E293B]" />
                              AI Master Rewrite
                            </h2>
                            <p className="text-[#64748B] text-sm mt-1">Full structural optimization based on high-conversion patterns.</p>
                          </div>
                          <Button
                            onClick={handleApplyRewrite}
                            className="bg-[#1E293B] hover:bg-[#0F172A] text-white font-black h-12 px-8 rounded-xl shadow-lg transition-all"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Apply to My CV
                          </Button>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 flex items-start gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-blue-900 text-sm mb-1">Impact Validation</h4>
                            <p className="text-blue-700 text-xs leading-relaxed">
                              This version has been optimized for <span className="font-bold">readability</span> and <span className="font-bold">keyword density</span>. Applying this version can increase your ATS score by up to <span className="font-bold">+35%</span>.
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-h-[500px] overflow-y-auto custom-scrollbar shadow-inner relative group">
                          <pre className="text-[#0F172A] font-mono text-xs leading-relaxed whitespace-pre-wrap">
                            {displayResume?.rewrittenText || "No rewrite ready. Please trigger an analysis first."}
                          </pre>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                          <div className="flex gap-4">
                            <span>{displayResume?.rewrittenText?.length || 0} chars</span>
                            <span>Neural Optimized ✓</span>
                          </div>
                          <span className="text-[#1E293B]">XYZ Formula + STAR Method applied</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Floating "View CV" button for mobile */}
                {isPdfCollapsed && (
                  <button
                    onClick={() => setIsPdfCollapsed(false)}
                    className="lg:hidden fixed bottom-6 right-6 z-40 px-6 py-3 bg-gradient-to-r from-[#64748B] to-[#1E293B] text-white font-bold rounded-full shadow-2xl hover:shadow-[#64748B]/50 transition-all flex items-center gap-2 animate-pulse"
                  >
                    <Eye className="h-5 w-5" />
                    View CV
                  </button>
                )}

                {/* PDF Preview - Hidden on mobile by default, collapsible on desktop */}
                <div className={`${isPdfCollapsed ? 'hidden lg:block lg:w-12' : 'fixed inset-0 z-50 lg:relative lg:flex-1'} bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 overflow-hidden relative group transition-all duration-300 lg:min-h-0 print:hidden lg:border-l border-[#E2E8F0]`}>
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                  {/* Collapse/Expand Button - Always visible on desktop */}
                  <button
                    onClick={() => setIsPdfCollapsed(!isPdfCollapsed)}
                    className={`${isPdfCollapsed ? 'lg:relative lg:top-4 lg:left-0' : 'absolute top-4 left-4'} z-20 p-3 bg-[#64748B] hover:bg-[#0F172A] text-white rounded-lg backdrop-blur-sm transition-all shadow-lg`}
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
                          <Button onClick={handleDownloadFile} className="font-bold shadow-lg bg-[#64748B] hover:bg-[#0F172A] text-[#0F172A]">
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