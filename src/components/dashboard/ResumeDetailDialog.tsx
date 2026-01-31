import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FileSearch,
  AlertTriangle,
  Loader2,
  Check,
  Edit,
  MoreVertical,
  TrendingUp,
  ListChecks,
  Settings,
  Lock,
  Activity,
  Monitor
} from "lucide-react";
import { ATSOverviewDashboard } from "./ATSOverviewDashboard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction, useQuery, useMutation } from "convex/react";
import { PricingDialog } from "@/components/PricingDialog";
import { SeniorityMatchAnalysis } from "./SeniorityMatchAnalysis";
import { SanitizedVersionDialog } from "./SanitizedVersionDialog";
import { InterviewBattlePlan } from "./InterviewBattlePlan";
import { KeywordAnalysis } from "./KeywordAnalysis";
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
  onOpenLinkedIn
}: ResumeDetailDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
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
  const [showRewrittenPreview, setShowRewrittenPreview] = useState(false);
  const [showSanitizerDialog, setShowSanitizerDialog] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("general");

  const rewriteResume = useAction(apiAny.ai.rewriteResume);
  const analyzeResume = useMutation(apiAny.resumes.analyzeResume);
  const applyRewriteToResume = useMutation(apiAny.resumes.applyRewriteToResume);
  const updateResumeContent = useMutation(apiAny.resumes.updateResumeContent);

  const user = useQuery(apiAny.users.currentUser);
  const isPremium = checkIsPaidUser(user?.subscriptionTier);
  const isFree = !isPremium;

  const allResumes = useQuery(apiAny.resumes.getResumes, {});
  const displayResume = allResumes?.find((r: any) => r._id === resumeId);

  // Pulse effect for ATS Check if not clicked within 5 seconds
  useEffect(() => {
    if (activeTab !== "ats-check" && displayResume) {
      const timer = setTimeout(() => {
        setShowRobotPulse(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowRobotPulse(false);
    }
  }, [activeTab, displayResume]);

  useEffect(() => {
    if (activeTab !== "ats-check") {
      const timer = setTimeout(() => {
        setShowRobotPulse(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowRobotPulse(false);
    }
  }, [activeTab]);

  const handleRewriteAll = async () => {
    if (!resumeId || !displayResume?.ocrText) return;
    setIsGenerating(true);
    try {
      const newText = await rewriteResume({
        id: resumeId,
        ocrText: displayResume.ocrText
      });

      if (newText) {
        await updateResumeContent({
          id: resumeId,
          ocrText: newText
        });
        toast.success("Resume rewritten and applied!");
      }
    } catch (error) {
      console.error("Rewrite error:", error);
      toast.error("Rewrite failed");
    } finally {
      setIsGenerating(false);
    }
  };

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

    // If we're viewing the AI rewrite, download it as a TXT file
    if (showRewrittenPreview && displayResume?.rewrittenText) {
      const blob = new Blob([displayResume.rewrittenText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `optimized-${displayResume.title || 'resume'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("AI-Optimized version downloaded as text. Ready for Word/Google Docs!");
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

      // Switch to ATS Check to show updated text
      setActiveTab("ats-check");

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

  const criticalKeywords = displayResume?.missingKeywords?.filter((k: any) => (typeof k === 'string' ? 'critical' : k.priority) === 'critical') || [];

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2E8F0] bg-[#FFFFFF] flex-shrink-0 print:hidden gap-3 sm:gap-4">
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
                  <div className="bg-[#FFFFFF] flex-shrink-0 p-3 overflow-x-auto border-b border-[#E2E8F0]">
                    <TabsList className="inline-flex w-auto min-w-full gap-1 h-auto bg-transparent">
                      <TabsTrigger
                        value="overview"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          Overview
                        </span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="improvements"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          Full Audit
                        </span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="skills"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Target className="h-4 w-4" />
                          Keywords
                        </span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="simulation"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Activity className="h-4 w-4" />
                          Simulation
                        </span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="ats-check"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Monitor className="h-4 w-4" />
                          Robot View
                        </span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="edit"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Edit className="h-4 w-4" />
                          Source Edit
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* 1. OVERVIEW */}
                  <TabsContent value="overview" className="flex-1 overflow-auto p-6 bg-[#F8FAFC] m-0">
                    <div className="space-y-8 max-w-5xl mx-auto">
                      <ATSOverviewDashboard
                        resume={displayResume}
                        user={user}
                        onFixIssue={(issue) => setActiveTab("improvements")}
                        onUpgrade={() => setShowPricing(true)}
                      />

                      <ScoreProgressChart
                        history={displayResume.scoreHistory?.length > 0 ? displayResume.scoreHistory.map((h: any, i: number) => ({
                          version: i + 1,
                          score: h.score,
                          timestamp: h.timestamp || Date.now(),
                          changes: h.changes || ["Optimization"]
                        })) : [{
                          version: 1,
                          score: displayResume.score || 0,
                          timestamp: displayResume._creationTime || Date.now(),
                          changes: ["Initial Scan"]
                        }]}
                        currentScore={displayResume.score || 0}
                      />
                    </div>
                  </TabsContent>

                  {/* 2. IMPROVEMENTS */}
                  <TabsContent value="improvements" className="flex-1 overflow-auto p-6 bg-[#F8FAFC] m-0">
                    <div className="space-y-8 max-w-5xl mx-auto">
                      <ATSAnalysisReport
                        resume={displayResume}
                        user={user}
                        onUpgrade={() => setShowPricing(true)}
                        onOpenWritingForge={() => setActiveTab("edit")}
                        onUpdateResume={async (newText) => {
                          if (!resumeId) return;
                          try {
                            await updateResumeContent({
                              id: resumeId,
                              ocrText: newText
                            });
                            toast.success("Resume updated! Re-analyzing...");
                          } catch (error) {
                            console.error("Update failed:", error);
                            toast.error("Failed to update resume");
                          }
                        }}
                        compactMode={true}
                      />
                      <ActionPlan steps={actionSteps} />
                      <FluffDetector
                        resumeText={displayResume.ocrText}
                        clarityScore={displayResume.score}
                        isPaidUser={isPremium}
                        onUpgrade={() => setShowPricing(true)}
                        onRewriteAll={handleRewriteAll}
                      />
                    </div>
                  </TabsContent>

                  {/* 3. SKILLS */}
                  <TabsContent value="skills" className="flex-1 overflow-auto p-6 bg-[#F8FAFC] m-0">
                    <div className="space-y-8 max-w-5xl mx-auto">
                      <KeywordAnalysis
                        matchedKeywords={displayResume.matchedKeywords || []}
                        missingKeywords={displayResume.missingKeywords?.map((k: any) => k.keyword || k) || []}
                        matchRate={displayResume.score}
                        onUpgrade={() => setShowPricing(true)}
                        resumeText={displayResume.ocrText}
                        isPaidUser={isPremium}
                      />
                    </div>
                  </TabsContent>

                  {/* 4. SIMULATION */}
                  <TabsContent value="simulation" className="flex-1 overflow-auto p-6 bg-[#F8FAFC] m-0">
                    <div className="space-y-8 max-w-5xl mx-auto">
                      <SeniorityMatchAnalysis resume={displayResume} user={user} />
                      <InterviewBattlePlan
                        targetRole={displayResume.jobTitle || "Role"}
                        companyName={displayResume.company || "Company"}
                        resumeText={displayResume.ocrText || ""}
                        isPaidUser={isPremium}
                        onUpgrade={() => setShowPricing(true)}
                      />
                    </div>
                  </TabsContent>

                  {/* 5. ROBOT VIEW */}
                  <TabsContent value="ats-check" className="flex-1 overflow-auto bg-[#020617] p-0 m-0">
                    <EnhancedRobotTerminalView
                      resumeId={displayResume?._id}
                      autoAnimate={false}
                    />
                  </TabsContent>

                  {/* 6. SOURCE EDIT */}
                  <TabsContent value="edit" className="flex-1 overflow-auto p-6 bg-[#F8FAFC] m-0">
                    <InlineResumeEditor
                      id={displayResume._id}
                      initialContent={displayResume.ocrText || ""}
                    />
                  </TabsContent>
                </Tabs>

                {/* PDF PREVIEW COLUMN */}
                <div className={`${isPdfCollapsed ? 'lg:w-14' : 'lg:w-[450px] xl:w-[550px]'} hidden lg:flex flex-col border-l border-[#E2E8F0] bg-[#F8FAFC] transition-all duration-300 relative`}>
                  <button
                    onClick={() => setIsPdfCollapsed(!isPdfCollapsed)}
                    className="absolute -left-3 top-4 z-20 h-6 w-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center hover:bg-slate-50 shadow-sm"
                  >
                    {isPdfCollapsed ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </button>

                  {!isPdfCollapsed && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
                        <span className="font-bold text-sm text-[#0F172A]">Document Preview</span>
                        <div className="flex gap-2">
                          {displayResume?.rewrittenText && (
                            <Button
                              size="xs"
                              variant={showRewrittenPreview ? "default" : "outline"}
                              className="h-7 text-[10px]"
                              onClick={() => setShowRewrittenPreview(!showRewrittenPreview)}
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI Version
                            </Button>
                          )}
                          <Button size="xs" variant="outline" className="h-7 text-[10px]" onClick={handleDownloadFile}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-auto p-4">
                        {showRewrittenPreview && displayResume?.rewrittenText ? (
                          <div className="bg-white rounded border border-[#E2E8F0] p-8 shadow-sm font-serif text-[13px] leading-relaxed whitespace-pre-wrap">
                            {displayResume.rewrittenText}
                          </div>
                        ) : (
                          <iframe src={displayResume?.url} title="PDF Preview" className="w-full h-full border-none" />
                        )}
                      </div>
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
    </Dialog >
  );
}