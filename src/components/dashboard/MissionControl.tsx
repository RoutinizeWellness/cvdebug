import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SpeedometerCard } from "./mission/SpeedometerCard";
import { IntegrityPanel } from "./mission/IntegrityPanel";
import { BulletPointSniper } from "./mission/BulletPointSniper";
import { ActionableIntelligence } from "./mission/ActionableIntelligence";
import { SystemConsole } from "./mission/SystemConsole";
import { Sparkles, X, Bot, Eye, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ATSRawTextView } from "./ATSRawTextView";
import { RoleMatchCard } from "./analysis/RoleMatchCard";
import { KeywordHeatmap } from "./analysis/KeywordHeatmap";
import { ImpactScore } from "./analysis/ImpactScore";
import { AIProTip } from "./analysis/AIProTip";
import { CriticalIssues } from "./CriticalIssues";
import { FormattingAudit } from "./analysis/FormattingAudit";
import { ActionableFixes } from "./analysis/ActionableFixes";
import { Button } from "@/components/ui/button";
import { SprintProgressWidget } from "./SprintProgressWidget";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const generateBulletPoints = useAction(apiAny.keywordSniper.generateKeywordPhrases);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [snipingKeyword, setSnipingKeyword] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<any[]>([]);
  const [showRobotView, setShowRobotView] = useState(false);
  const currentUser = useQuery(apiAny.users.currentUser);

  const masterResume = useMemo(() => {
    if (!resumes || resumes.length === 0) return null;
    // Prefer completed resumes with analysis
    const completedResume = resumes.find((r: any) => 
      r.status === "completed" && 
      (r.matchedKeywords?.length || r.missingKeywords?.length)
    );
    if (completedResume) return completedResume;
    return resumes[0];
  }, [resumes]);

  const latestJob = jobHistory && jobHistory.length > 0 ? jobHistory[0] : null;
  
  // Dynamic Scores
  const matchScore = masterResume?.score || 0;
  const integrityScore = masterResume?.textLayerIntegrity || 0;
  const hasImageTrap = masterResume?.hasImageTrap || false;
  const isProcessing = masterResume?.status === "processing";

  // Extract keywords dynamically
  const matchedKeywords = useMemo(() => {
    if (!masterResume || !masterResume.matchedKeywords) return [];
    console.log('[MissionControl] Matched keywords:', masterResume.matchedKeywords);
    return masterResume.matchedKeywords;
  }, [masterResume]);

  const missingKeywords = useMemo(() => {
    if (!masterResume || !masterResume.missingKeywords) return [];
    const keywords = masterResume.missingKeywords.map((kw: any) => 
      typeof kw === 'string' ? kw : kw.keyword
    );
    console.log('[MissionControl] Missing keywords:', keywords);
    return keywords;
  }, [masterResume]);

  // Extract actionable issues dynamically
  const actionableIssues = useMemo(() => {
    if (!masterResume) return [];
    const issues = [];
    
    if (masterResume.formatIssues) {
      issues.push(...masterResume.formatIssues.map((issue: any) => ({
        title: typeof issue === 'string' ? issue : issue.issue,
        description: typeof issue === 'string' ? "Formatting issue detected" : issue.fix || "Fix required",
        severity: "Medium",
        impact: "Medium Impact",
        example: "Remove complex formatting"
      })));
    }

    if (masterResume.missingKeywords && masterResume.missingKeywords.length > 0) {
      masterResume.missingKeywords.slice(0, 3).forEach((kw: any) => {
        const keyword = typeof kw === 'string' ? kw : kw.keyword;
        issues.push({
          title: `Missing Keyword: ${keyword}`,
          description: `Your resume is missing "${keyword}", which is critical for this role.`,
          severity: "High",
          impact: "High Impact",
          example: `Integrated ${keyword} into workflow...`,
          missingKeyword: keyword
        });
      });
    }

    return issues;
  }, [masterResume]);

  // Formatting Audit Items
  const formattingAuditItems = useMemo(() => {
    if (!masterResume) return [];
    const items = [];
    
    // Mock checks based on data availability
    items.push({
      title: "Text Layer Integrity",
      status: (masterResume.textLayerIntegrity > 90 ? "passed" : "failed") as "passed" | "failed" | "warning",
      reason: "Text is selectable and readable by ATS.",
      fix: "Re-save PDF using 'Save as PDF' not 'Print to PDF'."
    });

    items.push({
      title: "File Format",
      status: (masterResume.mimeType === "application/pdf" || masterResume.mimeType?.includes("word") ? "passed" : "warning") as "passed" | "failed" | "warning",
      reason: "Standard file format detected.",
      fix: "Use PDF or DOCX format."
    });

    if (masterResume.formatIssues) {
      masterResume.formatIssues.forEach((issue: any) => {
        items.push({
          title: "Formatting Issue",
          status: "failed" as "passed" | "failed" | "warning",
          reason: "",
          fix: typeof issue === 'string' ? issue : issue.fix
        });
      });
    }

    return items;
  }, [masterResume]);

  // Critical Issues
  const criticalIssues = useMemo(() => {
    const issues = [];
    if (hasImageTrap) {
      issues.push({ type: "error", message: "Image Trap Detected: Invisible text layer found." });
    }
    if (matchScore < 40 && !isProcessing) {
      issues.push({ type: "error", message: "Low Match Score: Resume may be auto-rejected." });
    }
    return issues;
  }, [hasImageTrap, matchScore, isProcessing]);

  // Generate dynamic logs based on resume state
  useEffect(() => {
    if (!masterResume) {
      setConsoleLogs([{ time: new Date().toLocaleTimeString(), type: "INFO", message: "Waiting for resume upload..." }]);
      return;
    }

    const logs = [
      { time: new Date(masterResume._creationTime).toLocaleTimeString(), type: "INFO", message: `Resume loaded: ${masterResume.title}` },
    ];

    if (masterResume.status === "processing") {
      logs.push({ time: new Date().toLocaleTimeString(), type: "WARN", message: "Analysis in progress..." });
    } else if (masterResume.status === "completed") {
      logs.push({ time: new Date(masterResume._creationTime + 1000).toLocaleTimeString(), type: "INFO", message: "PDF structure parsed successfully." });
      
      if (masterResume.matchedKeywords) {
        logs.push({ 
          time: new Date(masterResume._creationTime + 2000).toLocaleTimeString(), 
          type: "INFO", 
          message: `Keyword extraction: ${masterResume.matchedKeywords.length} found, ${masterResume.missingKeywords?.length || 0} missing.` 
        });
      }

      if (masterResume.score) {
        logs.push({ 
          time: new Date(masterResume._creationTime + 3000).toLocaleTimeString(), 
          type: "AI", 
          message: `Scoring complete. Match Score: ${masterResume.score}%` 
        });
      }

      logs.push({ 
        time: new Date().toLocaleTimeString(), 
        type: "SUCCESS", 
        message: "Dashboard updated. Ready." 
      });
    } else if (masterResume.status === "failed") {
      logs.push({ time: new Date().toLocaleTimeString(), type: "ERROR", message: "Analysis failed. Please retry." });
    }

    setConsoleLogs(logs);
  }, [masterResume]);

  // Show AI suggestion toast if we have missing keywords
  useEffect(() => {
    if (missingKeywords.length > 0 && !showAISuggestion) {
      const timer = setTimeout(() => setShowAISuggestion(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [missingKeywords]);

  const handleSnipeKeyword = async (keyword: string) => {
    setSnipingKeyword(keyword);
    toast.info(`Generating power statements for "${keyword}"...`);
    
    try {
      const result = await generateBulletPoints({ 
        missingKeyword: keyword,
        resumeText: masterResume?.ocrText || "",
        jobDescription: masterResume?.jobDescription || "",
        targetRole: masterResume?.category || "Professional"
      });
      
      setSnipingKeyword(null);
      
      // Transform the result to match BulletPointSniper's expected format
      if (result && result.phrases && result.phrases.length >= 3) {
        return {
          performance: result.phrases[0]?.text || "",
          business: result.phrases[1]?.text || "",
          leadership: result.phrases[2]?.text || ""
        };
      }
      
      return null;
    } catch (error) {
      console.error(error);
      setSnipingKeyword(null);
      toast.error("Failed to generate power statements. Please try again.");
      return null;
    }
  };

  const hasActiveSprint = currentUser?.sprintExpiresAt && currentUser.sprintExpiresAt > Date.now();
  const hasPurchasedScan = currentUser?.subscriptionTier === "single_scan" || currentUser?.subscriptionTier === "interview_sprint";
  const isPremium = hasActiveSprint || hasPurchasedScan;
  const isFree = !isPremium && (currentUser?.credits ?? 0) <= 0;

  // Free users with no credits should only see a score preview, not the full analysis
  if (isFree && masterResume && !masterResume.detailsUnlocked) {
    return (
      <div className="space-y-6 pb-24 md:pb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Mission Control</h1>
            <p className="text-slate-400 text-sm">ATS Analysis & Optimization Center</p>
          </div>
        </div>

        {/* Free Tier: Only show score */}
        <div className="max-w-2xl mx-auto">
          <SpeedometerCard score={matchScore} />
          
          <div className="mt-8 glass-panel p-8 rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-slate-900 text-center">
            <Lock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Unlock Full ATS Analysis</h3>
            <p className="text-slate-300 mb-2">
              Your resume scored <span className="font-bold text-primary">{matchScore}%</span>
            </p>
            <p className="text-sm text-slate-400 mb-6">
              Upgrade to see detailed keyword analysis, formatting issues, actionable fixes, and AI-powered recommendations.
            </p>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lock className="h-3 w-3" /> Locked Features
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                  <span>Missing Keywords Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                  <span>Formatting & Structure Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                  <span>AI-Powered Bullet Point Generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                  <span>Role Match Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400"></div>
                  <span>Impact Score & Pro Tips</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate("pricing")}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-black font-bold"
            >
              Unlock Full Report - $4.99
            </Button>
            <p className="text-xs text-slate-400 mt-4">
              ✓ One-time payment • ✓ Instant access • ✓ No subscription
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sprint Progress Widget - Show for Sprint users */}
      {currentUser?.subscriptionTier === "interview_sprint" && masterResume?.score && (
        <SprintProgressWidget
          currentScore={masterResume.score}
          previousScore={masterResume.previousScore}
          targetScore={85}
        />
      )}

      {/* Master CV Health Monitor */}
      <MasterCVHealth resume={masterResume} />

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Mission Control</h1>
          <p className="text-slate-400 text-sm">ATS Analysis & Optimization Center</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
          <Switch 
            id="robot-view" 
            checked={showRobotView}
            onCheckedChange={setShowRobotView}
          />
          <Label htmlFor="robot-view" className="text-xs font-medium text-slate-400 flex items-center gap-1 cursor-pointer">
            <Bot className="h-3 w-3" />
            Robot View
          </Label>
        </div>
      </div>

      {/* Critical Issues Banner */}
      <CriticalIssues issues={criticalIssues} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Score & Core Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SpeedometerCard score={matchScore} />
          
          <RoleMatchCard 
            role={masterResume?.category || "General"} 
            matchScore={matchScore} 
            confidence={85} 
          />

          <ImpactScore 
            score={matchScore} 
            quantifiedBullets={masterResume?.quantifiedBullets || 0} 
            totalBullets={masterResume?.totalBullets || 20} 
          />

          <AIProTip 
            tip={masterResume?.aiTip || "Quantify your achievements. Resumes with numbers get 40% more interviews."} 
          />
        </div>

        {/* Center Column: Keywords & Fixes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <KeywordHeatmap 
            matchedKeywords={matchedKeywords} 
            missingKeywords={missingKeywords} 
            isPremium={isPremium}
            onUnlock={() => onNavigate("pricing")}
          />

          <ActionableFixes fixes={actionableIssues} />
          
          <BulletPointSniper 
            matchedKeywords={matchedKeywords.map((k: string) => ({ 
              name: k, 
              category: "Skill", 
              impact: "High" 
            }))}
            missingKeywords={missingKeywords.map((k: string) => ({ 
              name: k, 
              category: "Missing", 
              impact: "Critical" 
            }))}
            onSnipe={handleSnipeKeyword}
            snipingKeyword={snipingKeyword}
            isProcessing={isProcessing}
            isPremium={isPremium}
            onUnlock={() => onNavigate("pricing")}
            onUpdateResume={onUpload}
          />
        </div>

        {/* Right Column: Audit & Console */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <FormattingAudit items={formattingAuditItems} />
          
          <IntegrityPanel 
            integrityScore={integrityScore} 
            hasImageTrap={hasImageTrap} 
          />

          <SystemConsole logs={consoleLogs} />

          {!isPremium && (
            <div className="glass-panel p-6 rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-slate-900 text-center">
              <Lock className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-white mb-2">Unlock Full Report</h3>
              <p className="text-xs text-slate-400 mb-4">Get unlimited scans, cover letters, and LinkedIn optimization.</p>
              <Button 
                onClick={() => onNavigate("pricing")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestion Toast */}
      <AnimatePresence>
        {showAISuggestion && missingKeywords.length > 0 && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="glass-panel border-l-4 border-l-[#8B5CF6] p-4 rounded-lg shadow-2xl flex items-start gap-4 max-w-sm bg-slate-900/90 backdrop-blur-xl">
              <div className="p-2 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">AI Suggestions Ready</h4>
                <p className="text-slate-400 text-xs mt-1">
                  I've found {missingKeywords.length} missing keywords for your resume.
                </p>
                <button 
                  className="mt-2 text-xs font-medium text-[#8B5CF6] hover:text-white transition-colors"
                  onClick={() => {
                    // Scroll to sniper or highlight it
                    const sniper = document.querySelector('.lg\\:col-span-5');
                    sniper?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Review Suggestions →
                </button>
              </div>
              <button 
                className="text-slate-500 hover:text-white"
                onClick={() => setShowAISuggestion(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot View Dialog */}
      <ATSRawTextView 
        open={showRobotView} 
        onOpenChange={setShowRobotView}
        ocrText={masterResume?.ocrText || ""}
        resumeTitle={masterResume?.title || "Resume"}
      />
    </div>
  );
}