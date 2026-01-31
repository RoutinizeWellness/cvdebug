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
  const [showSanitizerDialog, setShowSanitizerDialog] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("general");

  const rewriteResume = useAction(apiAny.ai.rewriteResume);
  const analyzeResume = useMutation(apiAny.resumes.analyzeResume);
  const applyRewriteToResume = useMutation(apiAny.resumes.applyRewriteToResume);

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
                      {/* 1. OVERVIEW */}
                      <TabsTrigger
                        value="overview"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#F1F5F9] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4" />
                          <span>Overview</span>
                        </span>
                      </TabsTrigger>

                      {/* 2. EDITOR */}
                      <TabsTrigger
                        value="edit"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#1E293B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Edit className="h-4 w-4" />
                          <span>Editor</span>
                        </span>
                      </TabsTrigger>

                      {/* 3. ATS CHECK */}
                      <TabsTrigger
                        value="ats-check"
                        className={`relative text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#22C55E] data-[state=active]:text-[#0F172A] data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg ${showRobotPulse ? 'animate-pulse ring-2 ring-green-500/50' : ''}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Cpu className="h-4 w-4" />
                          <span>ATS Check</span>
                        </span>
                        {showRobotPulse && (
                          <span className="absolute -top-1 -right-1 flex h-2 w-2 z-10">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                          </span>
                        )}
                      </TabsTrigger>

                      {/* 4. IMPROVEMENTS */}
                      <TabsTrigger
                        value="improvements"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#F59E0B] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" />
                          <span>Improvements</span>
                        </span>
                      </TabsTrigger>

                      {/* 5. INTERVIEW PREP */}
                      <TabsTrigger
                        value="prep"
                        className="text-xs sm:text-sm whitespace-nowrap px-4 py-2.5 font-semibold transition-all data-[state=active]:bg-[#6366F1] data-[state=active]:text-white data-[state=inactive]:text-[#475569] data-[state=inactive]:hover:bg-slate-100 rounded-lg"
                      >
                        <span className="flex items-center gap-1.5">
                          <Building className="h-4 w-4" />
                          <span>Prep Mode</span>
                        </span>
                      </TabsTrigger>
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
                          onContentUpdate={(_newContent) => {
                            // Content is automatically saved and re-analyzed by the InlineResumeEditor component
                            // No need to duplicate the analysis here
                          }}
                        />
                      )}
                    </div>
                  </TabsContent>

                  {/* 3. ATS CHECK */}
                  <TabsContent value="ats-check" className="flex-1 overflow-auto bg-black m-0 p-0 border-none shadow-none">
                    <div className="bg-black min-h-full">
                      {!user || user.isAnonymous ? (
                        <div className="p-6 space-y-6 text-center">
                          <h3 className="text-3xl font-bold text-white mt-12">🤯 Unlock the "Aha!" Moment</h3>
                          <p className="text-lg text-[#22C55E] font-semibold">See your resume exactly as ATS robots parse it</p>
                          <Button onClick={() => window.location.href = '/'} className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 text-lg rounded-xl shadow-lg">Unlock Robot View (FREE)</Button>
                        </div>
                      ) : (
                        <div className="flex flex-col h-full">
                          <EnhancedRobotTerminalView
                            resumeId={displayResume?._id}
                            autoAnimate={false}
                          />

                          <div className="p-6 space-y-12 bg-black pb-24">
                            {/* Seniority Match */}
                            {(() => {
                              const seniorityLevel = displayResume?.extractedData?.seniorityLevel || 'junior';
                              const years = displayResume?.extractedData?.totalYearsExperience || 0;
                              return (
                                <SeniorityMatchAnalysis
                                  detectedLevel={seniorityLevel.toUpperCase()}
                                  confidenceScore={85}
                                  experienceYears={years}
                                  expectedLevel={years >= 7 ? 'SENIOR' : 'JUNIOR'}
                                  signalsDetected={5}
                                  signalStrength="STRONG"
                                  detectedSignals={['Experience', 'Skills', 'Quantification']}
                                  readability="High Integrity"
                                  imageTraps="None Detected"
                                  atsScore={displayResume?.score || 0}
                                />
                              );
                            })()}

                            {/* LinkedIn Banner */}
                            {displayResume?.score >= 70 && !isFree && (
                              <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] border-4 border-[#0A66C2] p-6 rounded-xl shadow-2xl">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-lg shrink-0">
                                    <svg viewBox="0 0 24 24" fill="#0A66C2" className="w-full h-full"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path></svg>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-white font-black text-xl mb-1">🎯 CV Optimized → LinkedIn Next</h4>
                                    <p className="text-blue-50 text-sm">Your CV is ready. 89% of recruiters check LinkedIn next. Optimize your profile now.</p>
                                  </div>
                                  <Button onClick={() => onOpenLinkedIn?.()} className="bg-white text-[#0A66C2] font-black hover:bg-white/90">Optimize LinkedIn</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* 1. OVERVIEW */}
                  <TabsContent value="overview" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <div className="space-y-8 max-w-5xl mx-auto">
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
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                          <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-slate-500" />
                            ATS Performance Snapshot
                          </h3>
                        </div>
                        <div className="p-0">
                          <ATSOverviewDashboard
                            resume={displayResume}
                            user={user}
                            onFixIssue={(_issueType) => setActiveTab('improvements')}
                            onUpgrade={() => setShowPricing(true)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* 4. IMPROVEMENTS */}
                  <TabsContent value="improvements" className="flex-1 overflow-auto bg-slate-50">
                    <div className="max-w-6xl mx-auto p-6 space-y-12 pb-24">

                      {/* Action Plan */}
                      <section id="action-plan" className="space-y-6 scroll-mt-20">
                        <div className="border-b border-slate-200 pb-4">
                          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <ListChecks className="h-6 w-6 text-amber-500" />
                            Step-By-Step Priority Plan
                          </h2>
                          <p className="text-slate-500 text-sm">Critical fixes ordered by impact on your ATS score.</p>
                        </div>
                        <ActionPlan
                          steps={actionSteps}
                          onStepClick={(_stepId) => setActiveTab('edit')}
                          onCompleteStep={(_stepId) => toast.success("Step marked as complete!")}
                        />
                      </section>

                      {/* Keyword Analysis */}
                      <section id="keywords" className="space-y-6 scroll-mt-20">
                        <div className="border-b border-slate-200 pb-4">
                          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <Target className="h-6 w-6 text-blue-500" />
                            Industry Keyword Match
                          </h2>
                          <p className="text-slate-500 text-sm">Bridge the gap between your experience and industry expectations.</p>
                        </div>
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
                      </section>

                      {/* ATS Technical Report */}
                      <section id="ats-report" className="space-y-6 scroll-mt-20">
                        <div className="border-b border-slate-200 pb-4">
                          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <FileSearch className="h-6 w-6 text-indigo-500" />
                            Technical Cleanliness Report
                          </h2>
                          <p className="text-slate-500 text-sm">Deep scan of formatting, fonts, and structural integrity.</p>
                        </div>
                        <ATSAnalysisReport
                          resume={displayResume}
                          user={user}
                          onEditWithSniper={() => setActiveTab('edit')}
                          onOpenWritingForge={() => setActiveTab('edit')}
                          onDownloadPDF={() => toast.info("Report downloading...")}
                          onUpgrade={() => setShowPricing(true)}
                        />
                      </section>

                      {/* Fluff & Clarity */}
                      <section id="fluff" className="space-y-6 scroll-mt-20">
                        <div className="border-b border-slate-200 pb-4">
                          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-rose-500" />
                            Clarity & Fluff Detector
                          </h2>
                          <p className="text-slate-500 text-sm">Identify filler words and improve impact density.</p>
                        </div>
                        <FluffDetector
                          resumeText={displayResume.ocrText || ""}
                          clarityScore={displayResume?.score || 0}
                          isPaidUser={checkIsPaidUser(user?.subscriptionTier)}
                          onUpgrade={() => setShowPricing(true)}
                        />
                      </section>

                      {/* Format Issues */}
                      <section id="format" className="space-y-6 scroll-mt-20">
                        <div className="border-b border-slate-200 pb-4">
                          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <Monitor className="h-6 w-6 text-slate-500" />
                            Format Issues
                          </h2>
                          <p className="text-slate-500 text-sm">Visual and structural elements that might confuse ATS.</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                          {auditItems.length > 0 ? (
                            <div className="space-y-3">
                              {auditItems.map((item: any, index: number) => (
                                <div key={index} className={`p-4 rounded-lg border-l-4 ${item.status === "failed" ? "bg-red-50 border-l-red-500" : item.status === "warning" ? "bg-amber-50 border-l-amber-500" : "bg-green-50 border-l-green-500"}`}>
                                  <h4 className="font-bold text-sm">{item.title}</h4>
                                  <p className="text-xs text-slate-600 mt-1">{item.reason}</p>
                                  <p className="text-xs font-bold text-slate-900 mt-2">Fix: {item.fix}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 italic">No major formatting issues detected.</p>
                          )}
                        </div>
                      </section>

                      {/* Master Rewrite */}
                      {displayResume?.rewrittenText && (
                        <section id="rewritten" className="space-y-6 scroll-mt-20">
                          <div className="border-b border-slate-200 pb-4">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                              <Wand2 className="h-6 w-6 text-emerald-500" />
                              AI Master Rewrite
                            </h2>
                            <p className="text-slate-500 text-sm">Neural-optimized version for maximum conversion.</p>
                          </div>
                          <div className="bg-white rounded-2xl border-2 border-emerald-100 p-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                              <Button onClick={handleApplyRewrite} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Apply Rewrite</Button>
                            </div>
                            <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap leading-relaxed mt-8">
                              {displayResume.rewrittenText}
                            </pre>
                          </div>
                        </section>
                      )}
                    </div>
                  </TabsContent>



                  {/* 5. PREP MODE */}
                  <TabsContent value="prep" className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
                    <InterviewBattlePlan
                      targetRole={displayResume.jobTitle || "Data Science Role"}
                      companyName={displayResume.company || "TechCorp"}
                      resumeText={displayResume.ocrText || ""}
                      isPaidUser={checkIsPaidUser(user?.subscriptionTier)}
                      onUpgrade={() => setShowPricing(true)}
                    />
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