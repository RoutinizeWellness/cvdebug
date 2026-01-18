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
          color: "text-[#F59E0B]"
        });
      }

      // Add more warnings based on data
      if (missingKeywords.length > 1) {
        errors.push({
          severity: "WARN",
          message: `Missing keyword '${missingKeywords[1]}'`,
          detail: "match_score impact: -5%",
          color: "text-[#F59E0B]"
        });
      }
    }

    return errors.slice(0, 3);
  }, [masterResume, missingKeywords]);

  const userName = currentUser?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8 pb-24 md:pb-6">
      {/* Page Heading - ResumeWorded Style */}
      <header className="bg-[#FFFFFF] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-[#E2E8F0] p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[#0F172A] text-4xl font-bold tracking-tight">Mission Control</h2>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]"></span>
              </span>
            </div>
            <p className="text-[#64748B] text-base">
              Welcome back, <span className="font-semibold text-[#0F172A]">{userName}</span>. Eliminate bugs until you reach 95% visibility.
            </p>
          </div>
          <Button
            onClick={() => onNavigate("projects")}
            className="btn-power px-6 py-3 text-[#0F172A] font-semibold rounded-lg flex items-center gap-2 group border-0"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>New Application</span>
          </Button>
        </div>
      </header>

      {/* Metrics Grid - ResumeWorded Style */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1 - Visibility Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E2E8F0] hover:border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow transition-all duration-200 relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigate("master-cvs")}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="h-20 w-20 text-[#64748B]" />
          </div>
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-[#64748B] text-sm font-semibold uppercase tracking-wider">
                Visibility Score
              </p>
              <div className="p-2 rounded-lg bg-slate-100">
                <TrendingUp className="h-5 w-5 text-[#475569]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-[#0F172A] text-5xl font-bold">
                {visibilityScore}
              </p>
              <span className="text-2xl text-[#64748B] font-semibold">/100</span>
            </div>
            <p className="text-[#64748B] text-sm mt-2">
              How recruiters find your resume
            </p>
            {/* Progress Bar with Cyber Gradient */}
            <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${visibilityScore}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-2 rounded-full ${
                  visibilityScore >= 80 ? 'progress-cyber' :
                  visibilityScore >= 60 ? 'bg-[#F59E0B]' :
                  'bg-[#EF4444]'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Metric 2 - Active Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#FFFFFF] rounded-xl p-5 relative overflow-hidden group border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Send className="h-16 w-16 text-[#64748B]" />
          </div>
          <div className="flex flex-col gap-1 relative z-10">
            <p className="text-[#64748B] text-sm font-medium uppercase tracking-wider">
              Active Applications
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-[#0F172A] text-4xl font-mono font-bold">{activeApplications}</p>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[#3B82F6] text-xs font-mono bg-blue-50 w-fit px-2 py-1 rounded border border-blue-200">
              <span className="material-symbols-outlined text-sm">bolt</span>
              2 interviews scheduled
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200">
            <div className="h-full bg-[#3B82F6] w-[40%]"></div>
          </div>
        </motion.div>

        {/* Metric 3 - Missing Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#FFFFFF] rounded-xl p-5 relative overflow-hidden group border border-rose-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle className="h-16 w-16 text-rose-400" />
          </div>
          <div className="flex flex-col gap-1 relative z-10">
            <p className="text-[#64748B] text-sm font-medium uppercase tracking-wider">
              Missing Signals
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-[#0F172A] text-4xl font-mono font-bold">{criticalErrorsCount}</p>
              <span className="text-rose-600 font-bold text-sm bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                CRITICAL
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-rose-600 text-xs font-mono">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              Impacting match score by -{criticalErrorsCount * 5}%
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200">
            <div className="h-full bg-rose-500 w-[25%]"></div>
          </div>
        </motion.div>
      </section>

      {/* Robot View Widget - Prominent */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center border border-green-200">
                <span className="text-2xl">👁️</span>
              </div>
              <div>
                <h3 className="text-[#0F172A] text-lg font-bold">Robot View: What ATS Actually Reads</h3>
                <p className="text-[#22C55E] text-xs font-mono">Is critical information missing from your resume?</p>
              </div>
            </div>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22C55E]"></span>
            </span>
          </div>

          <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 font-mono text-sm max-h-[200px] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="text-[#22C55E] shrink-0">[ATS]</span>
                <span className="text-[#475569]">
                  {masterResume?.ocrText ? masterResume.ocrText.slice(0, 300) + "..." : "Upload a resume to see raw text extraction"}
                </span>
              </div>
              {masterResume && (
                <>
                  <div className="flex gap-2">
                    <span className="text-[#F59E0B] shrink-0">[WARN]</span>
                    <span className="text-[#64748B]">
                      {missingKeywords.length > 0
                        ? `Missing ${missingKeywords.length} high-impact keywords: ${missingKeywords.slice(0, 2).join(", ")}...`
                        : "All critical keywords detected"}
                    </span>
                  </div>
                  {visibilityScore < 85 && (
                    <div className="flex gap-2">
                      <span className="text-rose-600 shrink-0">[CRIT]</span>
                      <span className="text-[#64748B]">
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
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 hover:border-green-300"
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
        className="bg-[#FFFFFF] rounded-xl p-6 border-l-4 border-l-primary border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#0F172A] text-lg font-bold">Career Health</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            visibilityScore >= 85 ? "bg-teal-50 text-teal-600 border border-teal-200" :
            visibilityScore >= 70 ? "bg-blue-50 text-[#3B82F6] border border-blue-200" :
            visibilityScore >= 50 ? "bg-amber-50 text-[#F59E0B] border border-amber-200" :
            "bg-slate-100 text-[#64748B] border border-[#E2E8F0]"
          }`}>
            {visibilityScore >= 85 ? "🏆 ELITE" :
             visibilityScore >= 70 ? "⭐ PRO" :
             visibilityScore >= 50 ? "📈 RISING" :
             "🎯 STARTER"}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-[#64748B]">Progress to ELITE (85%+)</span>
            <span className="text-[#0F172A] font-bold font-mono">{visibilityScore}/85</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((visibilityScore / 85) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${
                visibilityScore >= 85 ? "bg-gradient-to-r from-teal-500 to-pink-500" :
                visibilityScore >= 70 ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                "bg-gradient-to-r from-amber-500 to-orange-500"
              }`}
            ></motion.div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] mb-1">CV Score</p>
            <p className="text-2xl font-bold text-[#0F172A]">{visibilityScore}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] mb-1">Applications</p>
            <p className="text-2xl font-bold text-[#0F172A]">{activeApplications}</p>
          </div>
          <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
            <p className="text-xs text-[#64748B] mb-1">Interviews</p>
            <p className="text-2xl font-bold text-[#0F172A]">{applicationsByStatus.interviewing.length}</p>
          </div>
        </div>
      </motion.section>

      {/* Success Insights Widget */}
      <SuccessInsightsWidget />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[400px]">
        {/* Kanban Board */}
        <section className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#0F172A] text-lg font-bold flex items-center gap-2">
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

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] p-1 rounded-xl flex-1 overflow-x-auto">
            <div className="flex gap-3 h-full min-w-[600px] p-3">
              {/* Column 1: Applied */}
              <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Applied ({applicationsByStatus.applied.length})
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>
                </div>

                {applicationsByStatus.applied.length === 0 ? (
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded text-center text-[#64748B] text-sm">
                    No applications yet
                  </div>
                ) : (
                  applicationsByStatus.applied.map((app: any) => (
                    <div
                      key={app._id}
                      className="bg-[#FFFFFF] p-3 rounded border border-[#E2E8F0] hover:border-primary transition-colors cursor-pointer group shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#0F172A] font-semibold text-sm">{app.jobTitle || app.title || "Position"}</span>
                      </div>
                      <p className="text-[#64748B] text-xs mb-3">{app.company || "Company"}</p>
                      <div className="flex items-center gap-2 text-[10px] text-[#64748B] font-mono">
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
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                </div>

                {applicationsByStatus.interviewing.length === 0 ? (
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded text-center text-[#64748B] text-sm">
                    No interviews yet
                  </div>
                ) : (
                  applicationsByStatus.interviewing.map((app: any) => (
                    <div
                      key={app._id}
                      className="bg-[#FFFFFF] p-3 rounded border-l-2 border-l-primary border-y border-r border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer relative overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-[#0F172A] font-semibold text-sm">{app.jobTitle || app.title || "Position"}</span>
                      </div>
                      <p className="text-[#64748B] text-xs mb-3 relative z-10">{app.company || "Company"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-primary font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {app.stage || "In Progress"}
                        </div>
                        <span className="text-[10px] text-[#64748B]">
                          {app._creationTime ? new Date(app._creationTime).toLocaleDateString('es-ES') : "Recent"}
                        </span>
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
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary"></div>
                </div>

                {applicationsByStatus.accepted.length === 0 ? (
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 rounded text-center text-[#64748B] text-sm">
                    No offers yet
                  </div>
                ) : (
                  applicationsByStatus.accepted.map((app: any) => (
                    <div
                      key={app._id}
                      className="bg-[#FFFFFF] p-3 rounded border-l-2 border-l-secondary border-y border-r border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer relative overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-[#0F172A] font-semibold text-sm">{app.jobTitle || app.title || "Position"}</span>
                      </div>
                      <p className="text-[#64748B] text-xs mb-3 relative z-10">{app.company || "Company"}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-secondary font-mono font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
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
            <h3 className="text-[#0F172A] text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">bug_report</span>
              Top Errors
            </h3>
            <span className="text-xs text-[#64748B] font-mono">
              {masterResume?.title || "No CV loaded"}
            </span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] rounded-xl flex flex-col h-full overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-[#F8FAFC] px-4 py-2 flex items-center gap-2 border-b border-[#E2E8F0]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></div>
              </div>
              <span className="ml-2 text-[10px] text-[#64748B] font-mono">console — bash</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-xs flex flex-col gap-3 overflow-y-auto flex-1 bg-[#F8FAFC]">
              {topErrors.length === 0 ? (
                <div className="flex gap-3">
                  <span className="text-[#22C55E] font-bold shrink-0">[OK]</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#475569]">No critical errors detected</span>
                    <span className="text-[#64748B]">All systems operational</span>
                  </div>
                </div>
              ) : (
                topErrors.map((error, index) => (
                  <div key={index} className="flex gap-3 group cursor-pointer">
                    <span className={`${error.color} font-bold shrink-0`}>[{error.severity}]</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#475569] group-hover:text-[#0F172A] transition-colors">
                        {error.message}
                      </span>
                      <span className="text-[#64748B]">{error.detail}</span>
                    </div>
                  </div>
                ))
              )}

              <div className="flex gap-2 items-center mt-2 animate-pulse">
                <span className="text-[#22C55E]">➜</span>
                <span className="w-2 h-4 bg-slate-400 block"></span>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button
                onClick={() => onNavigate("master-cvs")}
                className="w-full flex items-center justify-center gap-2 rounded-md h-8 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 text-xs font-bold border border-rose-200 hover:border-rose-300 transition-all"
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
