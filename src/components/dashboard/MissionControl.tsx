import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Settings, Bell, TrendingUp, CheckCircle, AlertTriangle, Download, Lightbulb, Terminal, MoreHorizontal, Target, Shield, Gauge, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const [showAISuggestion, setShowAISuggestion] = useState(true);

  const masterResume = useMemo(() => {
    if (!resumes || resumes.length === 0) return null;
    const completedResume = resumes.find((r: any) => 
      r.status === "completed" && 
      (r.matchedKeywords?.length || r.missingKeywords?.length)
    );
    if (completedResume) return completedResume;
    return resumes[0];
  }, [resumes]);

  const latestJob = jobHistory && jobHistory.length > 0 ? jobHistory[0] : null;
  const matchScore = latestJob?.score || 87;
  const integrityScore = masterResume?.textLayerIntegrity || 98;

  // Extract keywords
  const matchedKeywords = useMemo(() => {
    if (!masterResume) return [];
    return (masterResume.matchedKeywords || []).slice(0, 10).map((kw: string) => ({
      name: kw,
      category: "Framework",
      impact: "High Impact"
    }));
  }, [masterResume]);

  const missingKeywords = useMemo(() => {
    if (!masterResume) return [];
    return (masterResume.missingKeywords || []).slice(0, 3).map((kw: any) => ({
      name: typeof kw === 'string' ? kw : kw.keyword,
      category: "Missing",
      impact: "Critical"
    }));
  }, [masterResume]);

  // Console logs
  const consoleLogs = [
    { time: "10:42:05", type: "INFO", message: "Initializing scan protocols..." },
    { time: "10:42:06", type: "INFO", message: "PDF structure parsed successfully." },
    { time: "10:42:07", type: "WARN", message: "Section 'Hobbies' detected but irrelevant for Job ID #SWE-2024." },
    { time: "10:42:08", type: "INFO", message: `Keyword extraction: ${matchedKeywords.length} found, ${missingKeywords.length} missing.` },
    { time: "10:42:09", type: "AI", message: "Analyzing context gaps... Complete." },
    { time: "10:42:10", type: "SUCCESS", message: "Dashboard updated. Waiting for user input..." }
  ];

  const getLogColor = (type: string) => {
    switch (type) {
      case "INFO": return "text-blue-400";
      case "WARN": return "text-yellow-500";
      case "AI": return "text-purple-400";
      case "SUCCESS": return "text-emerald-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Terminal className="h-5 w-5" />
          </div>
          <h1 className="text-white text-lg font-bold tracking-tight">
            CVDebug <span className="text-slate-500 font-normal mx-2">/</span> 
            <span className="text-primary font-mono text-sm">Mission Control</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-slate-400">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Metrics (Left) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Speedometer Card */}
          <motion.div 
            className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-all duration-300 neon-glow bg-slate-900/70 backdrop-blur-xl border border-slate-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
            <div className="flex items-center justify-between w-full mb-4">
              <h3 className="text-slate-100 font-semibold flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                Match Score
              </h3>
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                HIGH PROBABILITY
              </span>
            </div>
            <div className="relative size-48 flex items-center justify-center mt-2">
              <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"></circle>
                <circle 
                  className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  cx="50" cy="50" fill="transparent" r="40" 
                  stroke="url(#gradient)" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * matchScore) / 100}
                  strokeLinecap="round" 
                  strokeWidth="8"
                ></circle>
                <defs>
                  <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6"></stop>
                    <stop offset="100%" stopColor="#8B5CF6"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white tracking-tighter">{matchScore}%</span>
                <span className="text-xs text-slate-400 mt-1">Optimization</span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-400 mt-4 px-2">
              Your CV ranks in the top <span className="text-white font-medium">15%</span> for this role.
            </p>
          </motion.div>

          {/* Integrity Health Panel */}
          <motion.div 
            className="glass-panel rounded-xl p-6 flex flex-col gap-5 neon-glow bg-slate-900/70 backdrop-blur-xl border border-slate-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-slate-100 font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" />
                Integrity Health
              </h3>
              <button className="text-slate-500 hover:text-white transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            
            {/* Readability */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-400">Readability</span>
                <span className="text-sm text-white font-mono">Grade 8 (Good)</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "80%" }}></div>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +2% from last scan
              </p>
            </div>

            {/* ATS Parse Rate */}
            <div className="space-y-2 pt-2 border-t border-slate-700/50">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-400">ATS Parse Rate</span>
                <span className="text-sm text-white font-mono">{integrityScore}% Success</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${integrityScore}%` }}></div>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3" />
                No critical errors found
              </p>
            </div>
          </motion.div>

          {/* Quick Stats Mini-grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-center bg-slate-900/70 backdrop-blur-xl border border-slate-800/50">
              <span className="text-2xl font-bold text-white">12</span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Pages Analyzed</span>
            </div>
            <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center gap-1 text-center bg-slate-900/70 backdrop-blur-xl border border-slate-800/50">
              <span className="text-2xl font-bold text-white">1.4s</span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Load Time</span>
            </div>
          </div>
        </div>

        {/* Column 2: Keyword Sniper (Center) */}
        <div className="lg:col-span-5 flex flex-col min-h-[500px]">
          <motion.div 
            className="glass-panel rounded-xl flex flex-col h-full overflow-hidden neon-glow bg-slate-900/70 backdrop-blur-xl border border-slate-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Keyword Sniper
                </h3>
                <p className="text-xs text-slate-400 mt-1">Targeting Job ID: #SWE-2024-L5</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono">
                  {matchedKeywords.length} Found
                </span>
                <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20 font-mono">
                  {missingKeywords.length} Missing
                </span>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              <div className="flex flex-col gap-2">
                {/* Matched Keywords */}
                {matchedKeywords.map((keyword: any, idx: number) => (
                  <div key={idx} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 border border-transparent hover:border-slate-600 transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-slate-800 text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{keyword.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{keyword.category}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-slate-300">{keyword.impact}</span>
                  </div>
                ))}

                {/* Missing Keywords */}
                {missingKeywords.map((keyword: any, idx: number) => (
                  <motion.div 
                    key={`missing-${idx}`}
                    className="group flex items-center justify-between p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-all cursor-pointer"
                    whileHover={{ x: 4 }}
                    animate={idx === 0 ? { 
                      borderColor: ["rgba(244, 63, 94, 0.2)", "rgba(244, 63, 94, 0.4)", "rgba(244, 63, 94, 0.2)"]
                    } : undefined}
                    transition={{ 
                      borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-rose-900/50 text-rose-400 animate-pulse">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white group-hover:text-rose-200">{keyword.name}</span>
                        <span className="text-[10px] text-rose-300/70 font-mono">{keyword.category} • Missing</span>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                      <Sparkles className="h-3 w-3" />
                      Fix with AI
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                <Download className="h-4 w-4" />
                Export Keyword Report
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Column 3: Actions & Console (Right) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Actionable Intelligence */}
          <motion.div 
            className="glass-panel rounded-xl flex flex-col neon-glow bg-slate-900/70 backdrop-blur-xl border border-slate-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-5 border-b border-slate-700/50">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-400" />
                Actionable Intelligence
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3 p-3 rounded bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="mt-0.5">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-medium">Quantify "Senior Dev" Achievements</p>
                  <p className="text-xs text-slate-400 mt-1">Add metrics like "% efficiency increase" to boost impact.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="mt-0.5">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-medium">Remove Passive Voice</p>
                  <p className="text-xs text-slate-400 mt-1">3 instances detected in "Project History".</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="mt-0.5">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900" />
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-medium">Fix Broken LinkedIn Link</p>
                  <p className="text-xs text-slate-400 mt-1">Header link returns 404 error.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Console */}
          <motion.div 
            className="flex-1 min-h-[250px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col shadow-inner shadow-black/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-[#0b1120] px-4 py-2 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="h-3 w-3 text-slate-500" />
                <span className="text-xs font-mono font-bold text-slate-400">SYSTEM CONSOLE</span>
              </div>
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-slate-700"></div>
                <div className="size-2.5 rounded-full bg-slate-700"></div>
                <div className="size-2.5 rounded-full bg-slate-700"></div>
              </div>
            </div>
            <div className="p-4 font-mono text-xs overflow-y-auto custom-scrollbar flex-1 bg-slate-950/80">
              <div className="flex flex-col gap-1.5">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2 text-slate-500">
                    <span>{log.time}</span>
                    <span className={getLogColor(log.type)}>[{log.type}]</span>
                    <span className={log.type === "WARN" ? "text-slate-300" : log.type === "SUCCESS" ? "text-emerald-200" : log.type === "AI" ? "text-white" : ""}>{log.message}</span>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <span className="text-primary animate-pulse">➜</span>
                  <span className="text-slate-400">_</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Suggestion Toast */}
      <AnimatePresence>
        {showAISuggestion && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <div className="glass-panel border-l-4 border-l-purple-500 p-4 rounded-lg shadow-2xl flex items-start gap-4 max-w-sm bg-slate-900/90 backdrop-blur-xl">
              <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">AI Suggestions Ready</h4>
                <p className="text-slate-400 text-xs mt-1">I've generated 3 phrasing alternatives for your "Kubernetes" experience.</p>
                <button className="mt-2 text-xs font-medium text-purple-400 hover:text-white transition-colors">
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
    </div>
  );
}