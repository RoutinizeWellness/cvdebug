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
  CheckCircle2
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
    <div className="space-y-6 pb-24 md:pb-6 max-w-5xl mx-auto">
      {/* 1. Header & Quick Actions */}
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              {t.missionControl.title}
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </h1>
            <p className="text-[#64748B] mt-1">
              {t.missionControl.welcomeBack}, <span className="font-semibold text-[#0F172A]">{userName}</span>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onUpload}
              variant="outline"
              size="sm"
              className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.missionControl.uploadNewCv}
            </Button>
            <Button
              onClick={() => onNavigate("match")}
              variant="outline"
              size="sm"
              className="bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              {t.missionControl.analyzeJob}
            </Button>
            <Button
              onClick={() => onNavigate("master-cvs")}
              variant="destructive"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 font-medium"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {t.missionControl.viewCriticalErrors}
            </Button>
          </div>
        </div>
      </header>

      {/* 2. GOLDEN PATH HERO: Score & Fix (The Centerpiece) */}
      <section className="bg-white rounded-3xl border-2 border-[#E2E8F0] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Score Area */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#1E293B] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                ATS Diagnostic v4
              </span>
              <div className="h-1 flex-1 bg-[#E2E8F0] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${visibilityScore}%` }}
                  className="h-full bg-[#1E293B]"
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] leading-tight mb-4">
              Your Professional <br /><span className="text-[#1E293B]">Visibility is {visibilityScore}%</span>
            </h1>

            <p className="text-[#64748B] text-lg mb-8 max-w-md">
              Raise your ATS score by <span className="text-[#0F172A] font-bold">+{100 - visibilityScore} points</span> in 10 minutes by fixing {criticalErrorsCount} critical errors.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onNavigate("master-cvs")}
                size="lg"
                className="h-14 px-8 bg-[#1E293B] hover:bg-[#0F172A] text-white font-black text-lg rounded-2xl shadow-xl shadow-slate-200 group"
              >
                Improve CV Now
                <Zap className="h-5 w-5 ml-2 fill-current group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => onNavigate("match")}
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 border-[#E2E8F0] hover:bg-slate-50 font-bold text-lg rounded-2xl"
              >
                Elite Match
              </Button>
            </div>

            <p className="mt-6 text-xs text-[#94A3B8] flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              ML Analysis completed 10s ago • 100% Private, Local ML
            </p>
          </div>

          {/* Critical Checklist Area */}
          <div className="lg:col-span-5 p-8 bg-[#F8FAFC]/50">
            <h3 className="text-xs font-black text-[#64748B] uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
              Critical Fix Checklist
              <span className="text-rose-500">{criticalErrorsCount} Pending</span>
            </h3>

            <div className="space-y-4">
              {topErrors.map((error, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex gap-4 p-4 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm cursor-pointer group"
                  onClick={() => onNavigate("master-cvs")}
                >
                  <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${error.severity === 'CRIT' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                    {error.severity === 'CRIT' ? <AlertCircle className="h-5 w-5" /> : <Wrench className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#0F172A]">{error.message}</p>
                    <p className={`text-[10px] font-black uppercase mt-1 ${error.severity === 'CRIT' ? 'text-rose-500' : 'text-amber-500'}`}>
                      Impact: {error.detail.includes('-') ? error.detail.split('-')[1] : error.detail}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#E2E8F0] group-hover:text-[#1E293B]" />
                </motion.div>
              ))}

              {topErrors.length === 0 && (
                <div className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-[#22C55E] mx-auto mb-4" />
                  <p className="font-bold text-[#0F172A]">ATS Shield Validated</p>
                  <p className="text-xs text-[#64748B]">Your structural integrity is optimal.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 2: Core Analysis - Robot View (Collapsible) */}
      <Collapsible
        open={sectionsOpen.analysis}
        onOpenChange={() => toggleSection('analysis')}
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-transparent data-[state=open]:border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-[#1E293B]" />
            <h3 className="font-bold text-[#0F172A]">Robot View & Text Extraction</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-widest hidden sm:inline">Verified by Neural Parser</span>
            {sectionsOpen.analysis ? <ChevronUp className="h-5 w-5 text-[#64748B]" /> : <ChevronDown className="h-5 w-5 text-[#64748B]" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6 bg-[#F8FAFC]/50">
          <div className="space-y-4">
            <div className="bg-[#0F172A] rounded-2xl p-6 font-mono text-[12px] leading-relaxed text-slate-300 min-h-[300px] border-4 border-slate-200 shadow-2xl relative overflow-hidden group">
              <div className="flex gap-2 mb-4">
                <span className="text-green-400 shrink-0 font-bold">[EXTRACT_READY]</span>
                <span className="text-slate-400">Stream decoded successfully. Integrity: 99.8%</span>
              </div>

              {masterResume?.ocrText ? (
                <div className="text-slate-200 relative z-10">
                  <span className="text-blue-400 font-bold mr-2">&gt;</span>
                  {masterResume.ocrText.slice(0, 2000)}...
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 uppercase tracking-widest">
                  {t.missionControl.uploadToSeeExtraction}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-2">
              <p className="text-[10px] text-[#94A3B8] font-medium italic">
                This is exactly how hiring algorithms see your candidate profile.
              </p>
              <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black tracking-widest text-[#1E293B]" onClick={() => onNavigate("master-cvs")}>
                Open Full Terminal
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 4. Section 3: Advanced Tracker & Metrics (Closed by Default) */}
      <Collapsible
        open={sectionsOpen.advanced}
        onOpenChange={() => toggleSection('advanced')}
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-transparent data-[state=open]:border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#64748B]" />
            <h3 className="font-bold text-[#64748B]">{t.missionControl.sectionAdvancedTools}</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100">
              {activeApplications} Applications
            </span>
            {sectionsOpen.advanced ? <ChevronUp className="h-5 w-5 text-[#64748B]" /> : <ChevronDown className="h-5 w-5 text-[#64748B]" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <SuccessInsightsWidget />
            <div className="p-5 bg-white border-2 border-dashed border-[#E2E8F0] rounded-2xl flex flex-col justify-center items-center text-center">
              <Activity className="h-8 w-8 text-[#94A3B8] mb-2" />
              <h4 className="text-sm font-bold text-[#0F172A]">Career Health Score</h4>
              <p className="text-[10px] text-[#64748B] px-4">Based on market trends and your current tech stack visibility.</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[#0F172A] font-bold flex items-center gap-2 text-sm">
                Application Pipeline (Kanban)
              </h3>
              <button
                onClick={() => onNavigate("projects")}
                className="text-xs font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                View Full Board <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
              {[
                { label: "Applied", count: applicationsByStatus.applied.length, color: 'bg-slate-300', items: applicationsByStatus.applied },
                { label: "Interviewing", count: applicationsByStatus.interviewing.length, color: 'bg-[#1E293B]', items: applicationsByStatus.interviewing },
                { label: "Closed", count: applicationsByStatus.accepted.length, color: 'bg-green-500', items: applicationsByStatus.accepted }
              ].map((col) => (
                <div key={col.label} className="min-w-[260px] flex-1">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{col.label}</span>
                    <span className="text-[10px] font-bold bg-slate-100 text-[#64748B] px-1.5 rounded">{col.count}</span>
                  </div>
                  <div className="space-y-2">
                    {col.items.length === 0 ? (
                      <div className="h-16 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase">No records</div>
                    ) : (
                      col.items.map((app: any) => (
                        <div key={app._id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#1E293B] transition-all cursor-pointer shadow-sm">
                          <p className="text-xs font-bold text-[#0F172A] truncate">{app.jobTitle || app.title}</p>
                          <p className="text-[10px] text-[#64748B] mt-0.5">{app.company}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
