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
    <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 border-teal-500/20">
      <div className="space-y-6">
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
  );
}
