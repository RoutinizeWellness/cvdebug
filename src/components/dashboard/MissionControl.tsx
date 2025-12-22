import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { SpeedometerCard } from "./mission/SpeedometerCard";
import { IntegrityPanel } from "./mission/IntegrityPanel";
import { BulletPointSniper } from "./mission/BulletPointSniper";
import { ActionableIntelligence } from "./mission/ActionableIntelligence";
import { SystemConsole } from "./mission/SystemConsole";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [snipingKeyword, setSnipingKeyword] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<any[]>([]);

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

  const handleSnipeKeyword = (keyword: string) => {
    setSnipingKeyword(keyword);
    toast.success(`Generating bullet points for "${keyword}"...`);
    
    // Simulate AI generation (replace with actual API call)
    setTimeout(() => {
      setSnipingKeyword(null);
      toast.success("3 bullet points generated! Check Writing Forge.", {
        action: {
          label: "View",
          onClick: () => onNavigate("writing-forge")
        }
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
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
              <span className="text-2xl font-bold text-white">{masterResume ? "1" : "0"}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">CVs Active</span>
            </div>
            <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-center bg-slate-900/70 backdrop-blur-xl border border-slate-800/50">
              <span className="text-2xl font-bold text-white">
                {masterResume ? "0.8s" : "-"}
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
                <span className="material-symbols-outlined">auto_awesome</span>
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
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}