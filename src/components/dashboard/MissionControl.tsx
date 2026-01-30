import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  AlertCircle,
  Send,
  Plus,
  ArrowRight,
  Terminal,
  Wrench,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  Eye,
  Activity,
  ChevronRight,
  CheckCircle2,
  Target,
  LayoutDashboard
} from "lucide-react";
import { SuccessInsightsWidget } from "./SuccessInsightsWidget";
import { ApplicationMicroTracker } from "./ApplicationMicroTracker";
import { EliteMatchTool } from "./EliteMatchTool";
import { useI18n } from "@/contexts/I18nContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const { t } = useI18n();
  const currentUser = useQuery(apiAny.users.currentUser);
  const resumes = useQuery(apiAny.resumes.getResumes);
  const applications = useQuery(apiAny.jobTracker.getJobHistory);

  const [sectionsOpen, setSectionsOpen] = useState({
    status: true,
    analysis: true,
    advanced: true
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
      if (missingKeywords.length > 0) {
        errors.push({
          severity: "CRIT",
          message: `${t.missionControl.missingKeyword} "${missingKeywords[0]}"`,
          detail: `${t.missionControl.matchScoreImpact} -15%`,
          color: "text-rose-500"
        });
      }

      if (masterResume.formatIssues && masterResume.formatIssues.length > 0) {
        errors.push({
          severity: "WARN",
          message: t.missionControl.dateFormatInconsistency,
          detail: t.missionControl.atExperienceBlock,
          color: "text-[#F59E0B]"
        });
      }

      if (missingKeywords.length > 1) {
        errors.push({
          severity: "WARN",
          message: `${t.missionControl.missingKeyword} '${missingKeywords[1]}'`,
          detail: `${t.missionControl.matchScoreImpact} -5%`,
          color: "text-[#F59E0B]"
        });
      }
    }

    return errors.slice(0, 3);
  }, [masterResume, missingKeywords, t]);

  const userName = currentUser?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-10 pb-24 md:pb-6 max-w-5xl mx-auto px-4">
      {/* 1. Dashboard Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Online</span>
          </div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">
            {t.missionControl.welcomeBack}, <span className="text-indigo-600">{userName}</span>.
          </h1>
          <p className="text-[#64748B] mt-2 text-lg">
            Your professional visibility is currently <span className="text-[#0F172A] font-bold">{visibilityScore < 50 ? 'Critical' : 'Good'}</span>.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onUpload}
            className="h-12 px-6 bg-white border-2 border-slate-100 text-[#0F172A] hover:bg-slate-50 font-bold rounded-2xl shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload New CV
          </Button>
          <Button
            onClick={() => onNavigate("match")}
            className="h-12 px-6 bg-[#0F172A] text-white hover:bg-slate-900 font-bold rounded-2xl shadow-xl shadow-slate-200"
          >
            <Zap className="h-4 w-4 mr-2" />
            Elite Match
          </Button>
        </div>
      </header>

      {/* 2. CORE DASHBOARD: SCORE & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Visibility Gauge Card */}
        <div className="lg:col-span-12 xl:col-span-8 bg-white rounded-[2rem] border-2 border-[#E2E8F0] p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="h-64 w-64 -mr-20 -mt-20" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            {/* Gauge SVG */}
            <div className="relative h-56 w-56 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="20"
                  fill="transparent"
                  className="text-slate-100"
                />
                <motion.circle
                  initial={{ strokeDashoffset: 628 }}
                  animate={{ strokeDashoffset: 628 - (628 * visibilityScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="20"
                  strokeDasharray="628"
                  strokeLinecap="round"
                  fill="transparent"
                  className={`${visibilityScore < 50 ? 'text-rose-500' : visibilityScore < 80 ? 'text-amber-500' : 'text-emerald-500'}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-6xl font-black ${visibilityScore < 50 ? 'text-rose-600' : visibilityScore < 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {visibilityScore}
                </span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-black text-[#0F172A] mb-2 uppercase tracking-tight">
                  Current Visibility Status
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {visibilityScore < 50
                    ? "Your profile is almost invisible to ATS robots. You likely won't survive the first robotic screening."
                    : visibilityScore < 80
                      ? "Your profile is readable, but you're missing key competitive signals."
                      : "Excellent. You are in the top 5% of candidate visibility."}
                </p>
              </div>

              {/* Sprint Progress */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-3 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span>🎯 Sprint Goal: Reach 95%</span>
                  <span className="text-slate-600">364 Days Left</span>
                </div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "35%" }} // Example progress
                    className="h-full bg-[#1E293B]"
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Critical Actions Checklist */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-4">
          <h3 className="px-2 text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between">
            🚨 Critical Actions
            <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px]">{criticalErrorsCount} Fixes</span>
          </h3>

          {topErrors.map((error, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-white border-2 border-[#E2E8F0] rounded-[1.5rem] shadow-sm cursor-pointer group hover:border-[#1E293B] transition-all"
              onClick={() => onNavigate("master-cvs")}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${error.severity === 'CRIT' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                  {error.severity === 'CRIT' ? <AlertCircle className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-[#0F172A] mb-1 line-clamp-1">{error.message}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${error.severity === 'CRIT' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                      Impact: {error.detail.includes('-') ? error.detail.split('-')[1] : error.detail.replace('Score:', '')}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0F172A] mt-1" />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-current" /> Auto-fix available
                </span>
                <span className="text-[10px] font-black uppercase text-indigo-600 group-hover:translate-x-1 transition-transform">
                  Fix Now →
                </span>
              </div>
            </motion.div>
          ))}

          <button
            onClick={() => onNavigate("master-cvs")}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-xs font-black text-slate-400 uppercase tracking-widest hover:border-slate-300 hover:text-slate-600 transition-all"
          >
            View Action Plan Checklist
          </button>
        </div>
      </div>

      {/* 3. ANALYTICS & ROBOT VIEW SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Performance Cards */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#0F172A]">{activeApplications}</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Apps</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#0F172A]">100%</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
            </div>
          </div>
          <div className="col-span-2 bg-[#0F172A] p-6 rounded-3xl shadow-xl flex items-center justify-between group overflow-hidden relative">
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
              <Zap className="h-24 w-24 -mr-6 -mb-6 text-white" />
            </div>
            <div className="relative z-10">
              <h4 className="text-white font-bold mb-1">Weekly Report Ready</h4>
              <p className="text-slate-400 text-[10px] line-clamp-1">See how you compare against top candidates.</p>
            </div>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 relative z-10">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Robot View Section */}
        <div className="lg:col-span-8 bg-[#0F172A] rounded-[2.5rem] border-8 border-slate-100 border-double overflow-hidden relative shadow-2xl min-h-[400px]">
          <div className="absolute top-0 left-0 right-0 p-6 border-b border-white/5 bg-white/5 backdrop-blur-md z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">CVDebug_Neural_Parser_v4.0.1</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20 uppercase tracking-widest hidden sm:inline">ROBOT_EYE_SCAN_ACTIVE</span>
              <Wrench className="h-4 w-4 text-white/40 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>

          <div className="p-10 pt-24 font-mono text-[11px] leading-relaxed text-slate-400 h-full overflow-y-auto custom-scrollbar">
            {masterResume?.ocrText ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4 py-2 border-b border-white/5 animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="text-emerald-500 shrink-0 font-black">[MATCH]</span>
                  <div className="flex-1">
                    <span className="text-white font-bold block mb-1">Personal Identifier Detected </span>
                    <span className="opacity-60 text-[10px]"> bhargab.saikia | bsaikia@cvdebug.ai</span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded border border-emerald-500/30">VALIDATED</span>
                      <span className="text-[8px] opacity-40 hover:opacity-100 cursor-pointer underline">Click to edit metadata</span>
                    </div>
                  </div>
                </div>

                {/* Image Trap Warning Inline */}
                {(masterResume.ocrText.length < 100 || masterResume.formatIssues?.some((f: any) => f.issue.toLowerCase().includes('parse') || f.issue.toLowerCase().includes('image'))) && (
                  <div className="p-4 bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl animate-pulse">
                    <p className="text-rose-400 font-black uppercase text-[10px] flex items-center gap-2 mb-2">
                      <AlertCircle className="h-3 w-3" /> Critical Security: Image Trap Detected
                    </p>
                    <p className="text-[10px] text-rose-300 leading-normal">
                      Robots cannot see the text in your CV. This is a 100% rejection risk. Fix formatting now.
                    </p>
                  </div>
                )}

                <div className="text-white/80 relative z-10 leading-[1.8] tracking-wide whitespace-pre-wrap select-all selection:bg-indigo-500/30">
                  <span className="text-indigo-400 font-bold mr-2 inline-block animate-pulse">&gt;</span>
                  {masterResume.ocrText.slice(0, 1500)}...
                  <div className="mt-4 inline-block px-1.5 py-0.5 bg-white text-black font-black animate-pulse">_</div>
                </div>

                <div className="h-32"></div> {/* Padding for scroll */}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 uppercase tracking-[0.2em] text-center">
                <Terminal className="h-12 w-12 mb-4 opacity-20" />
                <p className="max-w-[200px] leading-loose">Awaiting neural input stream...</p>
                <Button variant="ghost" size="sm" onClick={onUpload} className="mt-8 border border-white/10 text-white hover:bg-white/5">
                  Initialize Stream
                </Button>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent z-20 flex justify-center pb-8 pt-20">
            <Button
              onClick={() => onNavigate("master-cvs")}
              className="bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-widest px-8 rounded-full border border-white/10 backdrop-blur-md"
            >
              View In-Depth Technical Report
            </Button>
          </div>
        </div>
      </div>

      {/* 4. SUCCESS INSIGHTS AREA */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h3 className="text-xl font-black text-[#0F172A]">Project Success Tracker</h3>
            <p className="text-xs font-medium text-slate-400">Based on your latest 5 applications</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("projects")} className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
            Manage All Projects →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SuccessInsightsWidget />
          <ApplicationMicroTracker />
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-center items-center text-center group transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="h-8 w-8 text-slate-300" />
            </div>
            <h4 className="font-black text-[#0F172A] mb-2 uppercase tracking-tight text-sm">Application Board</h4>
            <p className="text-[11px] text-slate-400 px-4 leading-relaxed">
              Track your journey from first scan to final offer. Manage interviews and follow-ups.
            </p>
            <Button variant="outline" size="sm" className="mt-6 font-bold rounded-xl" onClick={() => onNavigate("projects")}>
              Open Board
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
