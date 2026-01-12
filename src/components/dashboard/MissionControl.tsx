import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertCircle,
  Send,
  Plus,
  ArrowRight,
  Terminal,
  Wrench
} from "lucide-react";
import { SuccessInsightsWidget } from "./SuccessInsightsWidget";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const currentUser = useQuery(apiAny.users.currentUser);
  const resumes = useQuery(apiAny.resumes.getResumes);
  const applications = useQuery(apiAny.jobTracker.getJobHistory);

  const masterResume = useMemo(() => {
    if (!resumes || resumes.length === 0) return null;
    const completedResume = resumes.find((r: any) =>
      r.status === "completed" &&
      (r.matchedKeywords?.length || r.missingKeywords?.length)
    );
    if (completedResume) return completedResume;
    return resumes[0];
  }, [resumes]);

  // Calculate metrics
  const visibilityScore = masterResume?.score || 0;
  const activeApplications = applications?.filter((app: any) =>
    app.status === "applied" || app.status === "interviewing"
  ).length || 0;

  const missingKeywords = useMemo(() => {
    if (!masterResume || !masterResume.missingKeywords) return [];
    return masterResume.missingKeywords.map((kw: any) =>
      typeof kw === 'string' ? kw : kw.keyword
    );
  }, [masterResume]);

  const criticalErrorsCount = missingKeywords.slice(0, 3).length;

  // Group applications by status for kanban
  const applicationsByStatus = useMemo(() => {
    if (!applications) return { applied: [], interviewing: [], accepted: [] };

    return {
      applied: applications.filter((app: any) => app.status === "applied").slice(0, 5),
      interviewing: applications.filter((app: any) => app.status === "interviewing").slice(0, 5),
      accepted: applications.filter((app: any) => app.status === "accepted").slice(0, 5)
    };
  }, [applications]);

  // Top errors from master resume
  const topErrors = useMemo(() => {
    const errors = [];

    if (masterResume) {
      // Add missing keywords as errors
      if (missingKeywords.length > 0) {
        errors.push({
          severity: "CRIT",
          message: `Missing keyword "${missingKeywords[0]}"`,
          detail: "match_score impact: -15%",
          color: "text-rose-500"
        });
      }

      // Add formatting issues
      if (masterResume.formatIssues && masterResume.formatIssues.length > 0) {
        errors.push({
          severity: "WARN",
          message: "Date format inconsistency found",
          detail: `at Experience.block (Line 42)`,
          color: "text-amber-500"
        });
      }

      // Add more warnings based on data
      if (missingKeywords.length > 1) {
        errors.push({
          severity: "WARN",
          message: `Missing keyword '${missingKeywords[1]}'`,
          detail: "match_score impact: -5%",
          color: "text-amber-500"
        });
      }
    }

    return errors.slice(0, 3);
  }, [masterResume, missingKeywords]);

  const userName = currentUser?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8 pb-24 md:pb-6">
      {/* Page Heading */}
      <header className="flex flex-wrap justify-between items-end gap-4 border-b border-slate-800 pb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-white text-3xl font-bold tracking-tight">Mission Control</h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-slate-400 text-sm font-mono">
              System Status: Operational // Welcome back, {userName}.
            </p>
          </div>
        </div>
        <Button
          onClick={() => onNavigate("projects")}
          className="flex items-center gap-2 rounded-lg h-10 pl-3 pr-4 bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          <span>New Application</span>
        </Button>
      </header>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 - Visibility Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="h-16 w-16 text-white" />
          </div>
          <div className="flex flex-col gap-1 relative z-10">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Visibility Score
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-white text-4xl font-mono font-bold">
                {visibilityScore}
                <span className="text-xl text-slate-500">/100</span>
              </p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-mono bg-emerald-400/10 w-fit px-2 py-1 rounded">
              <TrendingUp className="h-3.5 w-3.5" />
              +5% this week
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
            <div
              className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
              style={{ width: `${visibilityScore}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Metric 2 - Active Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Send className="h-16 w-16 text-white" />
          </div>
          <div className="flex flex-col gap-1 relative z-10">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Active Applications
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-white text-4xl font-mono font-bold">{activeApplications}</p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-blue-400 text-xs font-mono bg-blue-400/10 w-fit px-2 py-1 rounded">
              <span className="material-symbols-outlined text-sm">bolt</span>
              2 interviews scheduled
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
            <div className="h-full bg-blue-500 w-[40%] shadow-[0_0_10px_#3b82f6]"></div>
          </div>
        </motion.div>

        {/* Metric 3 - Missing Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-5 relative overflow-hidden group border-rose-500/20"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="h-16 w-16 text-rose-500" />
          </div>
          <div className="flex flex-col gap-1 relative z-10">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              Missing Signals
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-white text-4xl font-mono font-bold">{criticalErrorsCount}</p>
              <span className="text-rose-400 font-bold text-sm bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                CRITICAL
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-rose-400 text-xs font-mono">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              Impacting match score by -15%
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
            <div className="h-full bg-rose-500 w-[25%] shadow-[0_0_10px_#f43f5e]"></div>
          </div>
        </motion.div>
      </section>

      {/* Robot View Widget - Prominent */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950/50 via-slate-900 to-slate-950 border-2 border-green-500/30 p-6 shadow-[0_0_60px_rgba(34,197,94,0.15)]"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.4),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Robot View: What ATS Actually Reads</h3>
                <p className="text-green-400 text-xs font-mono">Is critical information missing from your resume?</p>
              </div>
            </div>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>

          <div className="bg-[#0a0e1a] rounded-xl border border-green-500/30 p-4 font-mono text-sm max-h-[200px] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-green-500 shrink-0">[ATS]</span>
                <span className="text-slate-300">
                  {masterResume?.ocrText ? masterResume.ocrText.slice(0, 300) + "..." : "Upload a resume to see raw text extraction"}
                </span>
              </div>
              {masterResume && (
                <>
                  <div className="flex gap-2">
                    <span className="text-amber-500 shrink-0">[WARN]</span>
                    <span className="text-slate-400">
                      {missingKeywords.length > 0
                        ? `Missing ${missingKeywords.length} high-impact keywords: ${missingKeywords.slice(0, 2).join(", ")}...`
                        : "All critical keywords detected"}
                    </span>
                  </div>
                  {visibilityScore < 85 && (
                    <div className="flex gap-2">
                      <span className="text-rose-500 shrink-0">[CRIT]</span>
                      <span className="text-slate-400">
                        Score {visibilityScore}/100 - Need {85 - visibilityScore} points to reach ELITE tier
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button
              onClick={() => onNavigate("master-cvs")}
              className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 hover:border-green-500/50"
            >
              <span className="material-symbols-outlined mr-2">visibility</span>
              View Full Report
            </Button>
            {!masterResume && (
              <Button
                onClick={onUpload}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Career Health Gamification */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl p-6 border-l-4 border-l-primary"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold">Career Health</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            visibilityScore >= 85 ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
            visibilityScore >= 70 ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
            visibilityScore >= 50 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
            "bg-slate-700/50 text-slate-400 border border-slate-600"
          }`}>
            {visibilityScore >= 85 ? "🏆 ELITE" :
             visibilityScore >= 70 ? "⭐ PRO" :
             visibilityScore >= 50 ? "📈 RISING" :
             "🎯 STARTER"}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progress to ELITE (85%+)</span>
            <span className="text-white font-bold font-mono">{visibilityScore}/85</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((visibilityScore / 85) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${
                visibilityScore >= 85 ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                visibilityScore >= 70 ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                "bg-gradient-to-r from-amber-500 to-orange-500"
              } shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
            ></motion.div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">CV Score</p>
            <p className="text-2xl font-bold text-white">{visibilityScore}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Applications</p>
            <p className="text-2xl font-bold text-white">{activeApplications}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Interviews</p>
            <p className="text-2xl font-bold text-white">{applicationsByStatus.interviewing.length}</p>
          </div>
        </div>
      </motion.section>

      {/* Success Insights Widget */}
      <SuccessInsightsWidget />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[400px]">
        {/* Kanban Board */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">view_kanban</span>
              Application Kanban
            </h3>
            <button
              onClick={() => onNavigate("projects")}
              className="text-xs text-primary hover:text-secondary font-mono transition-colors"
            >
              VIEW ALL <ArrowRight className="inline h-3 w-3" />
            </button>
          </div>

          <div className="glass-panel p-1 rounded-xl flex-1 overflow-x-auto">
            <div className="flex gap-3 h-full min-w-[600px] p-3">
              {/* Column 1: Applied */}
              <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Applied ({applicationsByStatus.applied.length})
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-500"></div>
                </div>

                {applicationsByStatus.applied.length === 0 ? (
                  <div className="glass-panel p-6 rounded text-center text-slate-500 text-sm">
                    No applications yet
                  </div>
                ) : (
                  applicationsByStatus.applied.map((app: any) => (
                    <div
                      key={app._id}
                      className="bg-[#2a374a] p-3 rounded border border-slate-700 hover:border-primary transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white font-semibold text-sm">{app.jobTitle || app.title || "Position"}</span>
                      </div>
                      <p className="text-slate-400 text-xs mb-3">{app.company || "Company"}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        {app._creationTime ? new Date(app._creationTime).toLocaleDateString('es-ES') : "Recent"}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Column 2: Interviewing */}
              <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">
                    Interviewing ({applicationsByStatus.interviewing.length})
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#3B82F6]"></div>
                </div>

                {applicationsByStatus.interviewing.length === 0 ? (
                  <div className="glass-panel p-6 rounded text-center text-slate-500 text-sm">
                    No interviews yet
                  </div>
                ) : (
                  applicationsByStatus.interviewing.map((app: any) => (
                    <div
                      key={app._id}
                      className="bg-[#2a374a] p-3 rounded border-l-2 border-l-primary border-y border-r border-y-slate-700 border-r-slate-700 hover:bg-[#2f3e54] transition-colors cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-white font-semibold text-sm">{app.jobTitle || app.title || "Position"}</span>
                      </div>
                      <p className="text-slate-400 text-xs mb-3 relative z-10">{app.company || "Company"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-primary font-mono font-bold bg-primary/10 px-2 py-0.5 rounded">
                          Tech Screen
                        </div>
                        <span className="text-[10px] text-slate-500">Tomorrow</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Column 3: Accepted */}
              <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Accepted ({applicationsByStatus.accepted.length})
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_#8B5CF6]"></div>
                </div>

                {applicationsByStatus.accepted.length === 0 ? (
                  <div className="glass-panel p-6 rounded text-center text-slate-500 text-sm">
                    No offers yet
                  </div>
                ) : (
                  applicationsByStatus.accepted.map((app: any) => (
                    <div
                      key={app._id}
                      className="bg-[#2a374a] p-3 rounded border-l-2 border-l-secondary border-y border-r border-y-slate-700 border-r-slate-700 hover:bg-[#2f3e54] transition-colors cursor-pointer relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-purple-500/5 pointer-events-none"></div>
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-white font-semibold text-sm">{app.jobTitle || app.title || "Position"}</span>
                      </div>
                      <p className="text-slate-400 text-xs mb-3 relative z-10">{app.company || "Company"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-secondary font-mono font-bold bg-secondary/10 px-2 py-0.5 rounded">
                          Accepted
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Top Errors Terminal */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">bug_report</span>
              Top Errors
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {masterResume?.title || "No CV loaded"}
            </span>
          </div>

          <div className="glass-panel rounded-xl flex flex-col h-full bg-[#0d1117] border-slate-800 overflow-hidden shadow-inner shadow-black/50">
            {/* Terminal Header */}
            <div className="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-slate-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>
              <span className="ml-2 text-[10px] text-slate-500 font-mono">console — bash</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-xs flex flex-col gap-3 overflow-y-auto flex-1">
              {topErrors.length === 0 ? (
                <div className="flex gap-3">
                  <span className="text-emerald-500 font-bold shrink-0">[OK]</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-300">No critical errors detected</span>
                    <span className="text-slate-600">All systems operational</span>
                  </div>
                </div>
              ) : (
                topErrors.map((error, index) => (
                  <div key={index} className="flex gap-3 group cursor-pointer">
                    <span className={`${error.color} font-bold shrink-0`}>[{error.severity}]</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        {error.message}
                      </span>
                      <span className="text-slate-600">{error.detail}</span>
                    </div>
                  </div>
                ))
              )}

              <div className="flex gap-2 items-center mt-2 animate-pulse">
                <span className="text-emerald-500">➜</span>
                <span className="w-2 h-4 bg-slate-500 block"></span>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-3 border-t border-slate-800 bg-[#161b22]">
              <button
                onClick={() => onNavigate("master-cvs")}
                className="w-full flex items-center justify-center gap-2 rounded-md h-8 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold border border-rose-500/20 hover:border-rose-500/40 transition-all"
              >
                <Wrench className="h-4 w-4" />
                DEBUG MASTER CV
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
