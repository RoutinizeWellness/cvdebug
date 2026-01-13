import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, AlertTriangle, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface HeatmapRegion {
  section: string;
  timeSpent: number; // seconds
  attention: "high" | "medium" | "low" | "skipped";
  issues?: string[];
}

interface LiveRecruiterSimulationProps {
  resumeText: string;
  score: number;
  missingKeywords?: string[];
  formatIssues?: Array<{ issue: string; severity?: string }>;
}

export function LiveRecruiterSimulation({
  resumeText,
  score,
  missingKeywords = [],
  formatIssues = []
}: LiveRecruiterSimulationProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Simulate recruiter reading pattern
  const heatmapData: HeatmapRegion[] = [
    {
      section: "Header/Contact",
      timeSpent: 3,
      attention: "high",
      issues: formatIssues.filter(f => f.issue.toLowerCase().includes("contact")).map(f => f.issue)
    },
    {
      section: "Summary",
      timeSpent: score > 70 ? 8 : 4,
      attention: score > 70 ? "high" : "medium",
      issues: missingKeywords.length > 5 ? ["Missing key qualifications"] : []
    },
    {
      section: "Experience",
      timeSpent: score > 60 ? 15 : 8,
      attention: score > 60 ? "high" : "medium",
      issues: formatIssues.filter(f => f.issue.toLowerCase().includes("bullet") || f.issue.toLowerCase().includes("metric")).map(f => f.issue)
    },
    {
      section: "Skills",
      timeSpent: missingKeywords.length > 3 ? 3 : 6,
      attention: missingKeywords.length > 3 ? "low" : "high",
      issues: missingKeywords.length > 0 ? [`Missing ${missingKeywords.length} key skills`] : []
    },
    {
      section: "Education",
      timeSpent: 4,
      attention: "medium",
      issues: []
    }
  ];

  const totalTime = heatmapData.reduce((sum, region) => sum + region.timeSpent, 0);
  const avgTimePerResume = 45; // seconds - industry standard

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setCurrentSection(0);

    heatmapData.forEach((_, index) => {
      setTimeout(() => {
        setCurrentSection(index + 1);
        if (index === heatmapData.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setSimulationComplete(true);
          }, 1000);
        }
      }, heatmapData.slice(0, index + 1).reduce((sum, r) => sum + r.timeSpent, 0) * 200);
    });
  };

  const getAttentionColor = (attention: string) => {
    switch (attention) {
      case "high": return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
      case "medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low": return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "skipped": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-slate-400 bg-slate-500/20 border-slate-500/30";
    }
  };

  const getDecision = () => {
    if (score >= 75) return { text: "SHORTLIST", icon: CheckCircle2, color: "text-emerald-400" };
    if (score >= 60) return { text: "MAYBE", icon: AlertTriangle, color: "text-yellow-400" };
    return { text: "REJECT", icon: XCircle, color: "text-red-400" };
  };

  const decision = getDecision();
  const DecisionIcon = decision.icon;

  return (
    <div className="relative">
      {/* Professional Office Monitor Mockup */}
      <div className="relative mx-auto max-w-6xl">
        {/* Monitor Frame - Corporate Design */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-t-2xl p-3 shadow-2xl">
          {/* Monitor Bezel */}
          <div className="absolute inset-0 rounded-t-2xl border-4 border-slate-950/50"></div>

          {/* Brand Logo on Bezel (top-center) */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-slate-950/30 rounded-full">
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Dell UltraSharp</span>
          </div>

          {/* Screen Content Area */}
          <div className="relative bg-slate-950 rounded-lg overflow-hidden shadow-inner">
            {/* Screen Glare Effect - Office Window Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>

            {/* Subtle Window Reflection on Screen */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-300/3 via-transparent to-transparent pointer-events-none rounded-lg"></div>

            {/* Screen Anti-Glare Coating Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none"></div>

            {/* ATS Software Interface Header (Ultra-Realistic Corporate Look) */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 border-b border-slate-700 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* ATS System Logo & Branding */}
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <div className="border-l border-slate-700 h-5"></div>
                    <div>
                      <span className="text-slate-200 text-xs font-semibold block leading-tight">Workday Recruiting</span>
                      <span className="text-slate-500 text-[9px] font-medium">Talent Acquisition Suite</span>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex items-center gap-1 ml-4">
                    <div className="px-3 py-1 bg-blue-600/20 border-b-2 border-blue-500 text-[10px] text-blue-300 font-medium">
                      Candidates
                    </div>
                    <div className="px-3 py-1 text-[10px] text-slate-400 hover:text-slate-300 font-medium">
                      Jobs
                    </div>
                    <div className="px-3 py-1 text-[10px] text-slate-400 hover:text-slate-300 font-medium">
                      Reports
                    </div>
                  </div>
                </div>

                {/* ATS Toolbar - Right Side */}
                <div className="flex items-center gap-2">
                  {/* Quick Actions */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-800 rounded text-[10px] text-slate-400 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[14px]">search</span>
                    <span className="font-medium">Search</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/50 hover:bg-slate-800 rounded text-[10px] text-slate-400 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[14px]">filter_alt</span>
                    <span className="font-medium">Filter</span>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-5 bg-slate-700"></div>

                  {/* Notifications */}
                  <div className="relative px-2 py-1.5 hover:bg-slate-800 rounded transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">notifications</span>
                    <div className="absolute top-1 right-1 size-1.5 rounded-full bg-red-500"></div>
                  </div>

                  {/* User Profile */}
                  <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-800 rounded transition-colors cursor-pointer">
                    <div className="size-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                      <span className="text-white text-[10px] font-bold">HR</span>
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] text-slate-300 font-medium leading-tight">Sarah Chen</div>
                      <div className="text-[8px] text-slate-500">Sr. Recruiter</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Toolbar - Candidate View Controls */}
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-medium">View:</span>
                  <div className="flex items-center gap-1">
                    <button className="px-2 py-0.5 bg-blue-600/20 text-blue-300 text-[9px] font-medium rounded">
                      Resume
                    </button>
                    <button className="px-2 py-0.5 text-slate-400 hover:text-slate-300 text-[9px] font-medium rounded">
                      Profile
                    </button>
                    <button className="px-2 py-0.5 text-slate-400 hover:text-slate-300 text-[9px] font-medium rounded">
                      Notes
                    </button>
                  </div>
                </div>

                <div className="border-l border-slate-700 h-4"></div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-medium">Status:</span>
                  <div className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-[9px] font-medium rounded flex items-center gap-1">
                    <div className="size-1 rounded-full bg-yellow-400"></div>
                    Under Review
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[9px] font-medium rounded transition-colors">
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-[9px] font-medium rounded transition-colors">
                    Shortlist
                  </button>
                </div>
              </div>
            </div>

            <Card className="p-0 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 border-0 rounded-none overflow-hidden">
              {/* SIMULATION MODE BANNER */}
              <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-3 border-b-2 border-cyan-400/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-full bg-white/20 backdrop-blur-sm">
                    <Eye className="h-4 w-4 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                      👁️ SIMULATION MODE
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-white/20 rounded-full">PREVIEW</span>
                    </h4>
                    <p className="text-white/90 text-xs font-medium">
                      This is exactly how a recruiter sees you in Workday/Greenhouse/Lever. Your CV has <strong className="underline">NOT</strong> been sent.
                    </p>
                  </div>
                </div>
              </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Live Recruiter Simulation</h3>
              <p className="text-xs text-slate-400">See how a recruiter reads your resume</p>
            </div>
          </div>
          <Button
            onClick={startSimulation}
            disabled={isSimulating}
            className="bg-gradient-to-r from-teal-500 to-pink-500 hover:from-teal-600 hover:to-pink-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isSimulating ? "Simulating..." : "Start Simulation"}
          </Button>
        </div>

        {/* Time Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">Your Resume</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalTime}s</p>
            <p className="text-xs text-slate-500 mt-1">
              {totalTime < avgTimePerResume ? "✓ Quick scan" : "⚠ Too long"}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-400">Industry Average</span>
            </div>
            <p className="text-2xl font-bold text-slate-400">{avgTimePerResume}s</p>
            <p className="text-xs text-slate-500 mt-1">Per resume</p>
          </div>
        </div>

        {/* Heatmap Visualization */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[18px]">visibility</span>
            Attention Heatmap
          </h4>
          {heatmapData.map((region, index) => {
            const isActive = isSimulating && currentSection === index + 1;
            const isPast = currentSection > index;
            
            return (
              <motion.div
                key={region.section}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all ${
                  isActive 
                    ? "bg-teal-500/20 border-teal-500 shadow-lg shadow-cyan-500/20" 
                    : isPast
                    ? "bg-slate-800/30 border-slate-700"
                    : "bg-slate-800/50 border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{region.section}</span>
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="size-2 rounded-full bg-teal-500"
                      />
                    )}
                  </div>
                  <Badge className={`${getAttentionColor(region.attention)} border`}>
                    {region.attention.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <Progress 
                    value={(region.timeSpent / avgTimePerResume) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-slate-400 font-mono">{region.timeSpent}s</span>
                </div>

                {region.issues && region.issues.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {region.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-red-400">
                        <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Final Decision */}
        <AnimatePresence>
          {simulationComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-lg bg-slate-800/50 border-2 border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Recruiter Decision</p>
                  <div className="flex items-center gap-2">
                    <DecisionIcon className={`h-6 w-6 ${decision.color}`} />
                    <p className={`text-2xl font-bold ${decision.color}`}>{decision.text}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">Total Time</p>
                  <p className="text-2xl font-bold text-white">{totalTime}s</p>
                </div>
              </div>
              
              {score < 75 && (
                <div className="mt-4 p-3 rounded bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-xs text-yellow-400">
                    💡 <strong>Tip:</strong> Address the flagged issues to increase your chances of making the shortlist.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
            </Card>
          </div>
        </div>

        {/* Monitor Stand - Realistic Design */}
        <div className="relative flex justify-center">
          {/* Stand Neck */}
          <div className="w-16 h-8 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-lg shadow-lg border-x-2 border-slate-950"></div>
        </div>

        {/* Stand Base */}
        <div className="flex justify-center">
          <div className="w-48 h-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-full shadow-2xl relative">
            {/* Base Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full blur-sm"></div>
          </div>
        </div>

        {/* Desk Surface Shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50"></div>
      </div>

      {/* Office Environment Ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Subtle office lighting effects */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
