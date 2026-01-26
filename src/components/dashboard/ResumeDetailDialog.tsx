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
import { LiveRecruiterSimulation } from "./LiveRecruiterSimulation";
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
import { OverviewTab } from "./OverviewTab";
import { ATSAnalysisTab } from "./ATSAnalysisTab";
import { EditorTab } from "./EditorTab";
import { JobMatchTab } from "./JobMatchTab";
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
  const [activeTab, setActiveTab] = useState("overview");
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
        // Defensive check: skip if issue is undefined or null
        if (!issue) return;

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

    // CRITICAL: No metrics (0% quantifiable achievements)
    if (!displayResume.stats?.hasQuantifiableAchievements) {
      steps.push({
        id: `step-${stepId++}`,
        title: "Add Quantifiable Metrics (0% Detected)",
        description: "89% of ATS systems auto-reject resumes without numbers. Add metrics like percentages, dollar amounts, or counts to every achievement.",
        priority: 'critical' as const,
        completed: false,
        estimatedImpact: "+15-25%"
      });
    }

    // CRITICAL: Missing sections
    if (displayResume.missingElements && displayResume.missingElements.length > 0) {
      steps.push({
        id: `step-${stepId++}`,
        title: `Add Missing Sections: ${displayResume.missingElements.slice(0, 2).join(', ')}`,
        description: `Required sections not found: ${displayResume.missingElements.join(', ')}. ATS parsers expect standard headers.`,
        priority: 'critical' as const,
        completed: false,
        estimatedImpact: "+10-15%"
      });
    }

    // IMPORTANT: Missing keywords (5+)
    if (displayResume.missingKeywords && displayResume.missingKeywords.length > 5) {
      steps.push({
        id: `step-${stepId++}`,
        title: `Add ${displayResume.missingKeywords.length} Missing Keywords`,
        description: `Critical keywords not found: ${displayResume.missingKeywords.slice(0, 5).map((kw: any) => typeof kw === 'string' ? kw : kw.keyword).join(', ')}...`,
        priority: 'important' as const,
        completed: false,
        estimatedImpact: "+8-12%"
      });
    }

    // IMPORTANT: Low keyword density
    if (displayResume.stats?.keywordDensity && displayResume.stats.keywordDensity < 2) {
      steps.push({
        id: `step-${stepId++}`,
        title: "Increase Keyword Density",
        description: `Current density: ${displayResume.stats.keywordDensity.toFixed(1)}%. Aim for 2-4% by naturally incorporating industry terms throughout your CV.`,
        priority: 'important' as const,
        completed: false,
        estimatedImpact: "+5-8%"
      });
    }

    // RECOMMENDED: Improve score to 90%+
    if (displayResume.score && displayResume.score < 90) {
      const neededPoints = 90 - displayResume.score;
      steps.push({
        id: `step-${stepId++}`,
        title: `Reach 90% Score (Currently ${displayResume.score}%)`,
        description: `You need ${neededPoints} more points to reach the 90% threshold. Focus on the critical issues above first.`,
        priority: 'recommended' as const,
        completed: false,
        estimatedImpact: `+${neededPoints}%`
      });
    }

    // RECOMMENDED: Fluff detection
    if (displayResume.stats?.hasVagueLanguage) {
      steps.push({
        id: `step-${stepId++}`,
        title: "Remove Vague Language & Fluff",
        description: "Replace weak phrases like 'responsible for' and 'helped with' with strong action verbs and concrete achievements.",
        priority: 'recommended' as const,
        completed: false,
        estimatedImpact: "+3-5%"
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
              {displayResume?.jobDescription && (
                <div className="hidden sm:flex items-center gap-2 text-[10px] mt-0.5">
                  <span className="flex items-center gap-1 text-[#22C55E] font-semibold">
                    <Target className="h-3 w-3" /> Job-Specific Analysis
                  </span>
                </div>
              )}
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
                  <TabsList className="inline-flex w-auto min-w-full gap-3 h-auto bg-transparent px-4">
                    {/* 📝 OVERVIEW - Dashboard with score + quick wins */}
                    <TabsTrigger
                      value="overview"
                      className="text-sm whitespace-nowrap px-6 py-3 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#22C55E] data-[state=active]:to-[#16A34A] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-xl shadow-sm data-[state=active]:shadow-lg transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Overview</span>
                      </span>
                    </TabsTrigger>

                    {/* 🤖 ATS ANALYSIS - Robot View + Keywords + Format combined */}
                    <TabsTrigger
                      value="ats-analysis"
                      className={`relative text-sm whitespace-nowrap px-6 py-3 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#64748B] data-[state=active]:to-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-xl shadow-sm data-[state=active]:shadow-lg transition-all ${showRobotPulse ? 'animate-pulse ring-2 ring-green-500/50' : ''}`}
                    >
                      <span className="flex items-center gap-2">
                        <Cpu className="h-5 w-5" />
                        <span>ATS Analysis</span>
                      </span>
                      {showRobotPulse && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2 z-10">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                        </span>
                      )}
                    </TabsTrigger>

                    {/* ✏️ EDITOR - Current editor + AI suggestions integrated */}
                    <TabsTrigger
                      value="editor"
                      className="text-sm whitespace-nowrap px-6 py-3 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F59E0B] data-[state=active]:to-[#EF4444] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-xl shadow-sm data-[state=active]:shadow-lg transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        <span>Editor</span>
                      </span>
                    </TabsTrigger>

                    {/* 🎯 JOB MATCH - Job description comparison */}
                    {displayResume?.jobDescription && (
                      <TabsTrigger
                        value="job-match"
                        className="text-sm whitespace-nowrap px-6 py-3 font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#6366F1] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:text-[#0F172A] data-[state=inactive]:hover:bg-slate-100 rounded-xl shadow-sm data-[state=active]:shadow-lg transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          <span>Job Match</span>
                        </span>
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>


                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="flex-1 overflow-auto p-0 m-0">
                  <OverviewTab
                    resume={displayResume}
                    user={user}
                    isPaidUser={isPremium}
                    onUpgrade={() => setShowPricing(true)}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />
                </TabsContent>

                {/* ATS ANALYSIS TAB */}
                <TabsContent value="ats-analysis" className="flex-1 overflow-auto p-0 m-0">
                  <ATSAnalysisTab
                    resume={displayResume}
                    user={user}
                    isPaidUser={isPremium}
                    onUpgrade={() => setShowPricing(true)}
                  />
                </TabsContent>

                {/* EDITOR TAB */}
                <TabsContent value="editor" className="flex-1 overflow-auto p-0 m-0">
                  <EditorTab
                    resume={displayResume}
                    user={user}
                    isPaidUser={isPremium}
                    onUpgrade={() => setShowPricing(true)}
                    onContentUpdate={(newContent) => {
                      // Content is automatically saved and re-analyzed by the EditorTab component
                    }}
                  />
                </TabsContent>

                {/* JOB MATCH TAB */}
                {displayResume?.jobDescription && (
                  <TabsContent value="job-match" className="flex-1 overflow-auto p-0 m-0">
                    <JobMatchTab
                      resume={displayResume}
                      user={user}
                      isPaidUser={isPremium}
                      onUpgrade={() => setShowPricing(true)}
                    />
                  </TabsContent>
                )}
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