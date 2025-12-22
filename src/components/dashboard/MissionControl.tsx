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
import { Sparkles, X, Bot, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ATSRawTextView } from "./ATSRawTextView";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const generateBulletPoints = useAction(apiAny.ai.resumeRewrite.generateBulletPoints);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [snipingKeyword, setSnipingKeyword] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<any[]>([]);
  const [showRobotView, setShowRobotView] = useState(false);

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
    return masterResume.matchedKeywords.slice(0, 15).map((kw: string) => ({
      name: kw,
      category: "Skill",
      impact: "High"
    }));
  }, [masterResume]);

  const missingKeywords = useMemo(() => {
    if (!masterResume || !masterResume.missingKeywords) return [];
    return masterResume.missingKeywords.slice(0, 5).map((kw: any) => ({
      name: typeof kw === 'string' ? kw : kw.keyword,
      category: "Missing",
      impact: "Critical"
    }));
  }, [masterResume]);

  // Extract actionable issues dynamically
  const actionableIssues = useMemo(() => {
    if (!masterResume) return [];
    const issues = [];
    
    if (masterResume.formatIssues) {
      issues.push(...masterResume.formatIssues.map((issue: any) => ({
        title: typeof issue === 'string' ? issue : issue.issue,
        description: typeof issue === 'string' ? "Formatting issue detected" : issue.fix || "Fix required",
        severity: "Medium"
      })));
    }

    if (masterResume.missingKeywords && masterResume.missingKeywords.length > 0) {
      issues.push({
        title: "Missing Critical Keywords",
        description: `Found ${masterResume.missingKeywords.length} missing keywords that could improve your score.`,
        severity: "High"
      });
    }

    return issues.slice(0, 5);
  }, [masterResume]);

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
    toast.info(`Generating bullet points for "${keyword}"...`);
    
    try {
      const bullets = await generateBulletPoints({ 
        keyword,
        context: masterResume?.ocrText?.substring(0, 500), // Pass some context if available
        jobDescription: masterResume?.jobDescription // Pass JD for targeted generation
      });
      
      setSnipingKeyword(null);
      
      // Store these in local storage or pass to Writing Forge via navigation state
      // For now, we'll show them in a toast and navigate
      localStorage.setItem("sniped_bullets", JSON.stringify({ keyword, bullets }));
      
      toast.success("3 bullet points generated!", {
        description: "Check Writing Forge to use them.",
        action: {
          label: "View",
          onClick: () => onNavigate("writing-forge")
        }
      });
    } catch (error) {
      console.error(error);
      setSnipingKeyword(null);
      toast.error("Failed to generate bullet points. Please try again.");
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header Actions */}
      <div className="flex justify-end items-center gap-4 mb-2">
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

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Metrics (Left) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <SpeedometerCard score={matchScore} />
          
          <IntegrityPanel 
            integrityScore={integrityScore} 
            hasImageTrap={hasImageTrap} 
          />

          {/* Quick Stats Mini-grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-center bg-slate-900/70 backdrop-blur-xl border border-slate-800/50">
              <span className="text-2xl font-bold text-white">{resumes ? resumes.length : "0"}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">CVs Active</span>
            </div>
            <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-center bg-slate-900/70 backdrop-blur-xl border border-slate-800/50">
              <span className="text-2xl font-bold text-white">
                {masterResume?.processingDuration 
                  ? `${(masterResume.processingDuration / 1000).toFixed(1)}s` 
                  : masterResume ? "1.2s" : "-"}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Load Time</span>
            </div>
          </div>
        </div>

        {/* Column 2: Keyword Sniper (Center) */}
        <div className="lg:col-span-5 flex flex-col min-h-[500px]">
          <BulletPointSniper 
            matchedKeywords={matchedKeywords}
            missingKeywords={missingKeywords}
            onSnipe={handleSnipeKeyword}
            snipingKeyword={snipingKeyword}
            isProcessing={isProcessing}
          />
        </div>

        {/* Column 3: Actions & Console (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ActionableIntelligence issues={actionableIssues} />
          <SystemConsole logs={consoleLogs} />
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