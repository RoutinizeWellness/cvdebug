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

      {/* 2. Section 1: Dashboard Status (Collapsible) */}
      <Collapsible
        open={sectionsOpen.status}
        onOpenChange={() => toggleSection('status')}
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-transparent data-[state=open]:border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#1E293B]" />
            <h3 className="font-bold text-[#0F172A]">{t.missionControl.sectionSystemStatus}</h3>
          </div>
          {sectionsOpen.status ? <ChevronUp className="h-5 w-5 text-[#64748B]" /> : <ChevronDown className="h-5 w-5 text-[#64748B]" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visibility Score */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[#64748B] text-xs font-bold uppercase tracking-wider">
                <span>{t.missionControl.visibilityScore}</span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#0F172A]">{visibilityScore}</span>
                <span className="text-xl text-[#64748B] font-semibold">/100</span>
              </div>
              <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${visibilityScore}%` }}
                  className={`h-full rounded-full ${visibilityScore >= 80 ? 'bg-green-500' :
                      visibilityScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                />
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {t.missionControl.eliminateBugs}
              </p>
            </div>

            {/* Applications Stats */}
            <div className="space-y-3 border-l md:border-l-[#E2E8F0] md:pl-6">
              <div className="flex justify-between items-center text-[#64748B] text-xs font-bold uppercase tracking-wider">
                <span>{t.missionControl.activeApplications}</span>
                <Send className="h-4 w-4" />
              </div>
              <div className="text-4xl font-bold text-[#0F172A]">{activeApplications}</div>
              <p className="text-xs text-[#64748B] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                {applicationsByStatus.interviewing.length} {t.missionControl.interviewsScheduled}
              </p>
            </div>

            {/* Missing Signals */}
            <div className="space-y-3 border-l md:border-l-[#E2E8F0] md:pl-6">
              <div className="flex justify-between items-center text-[#64748B] text-xs font-bold uppercase tracking-wider">
                <span>{t.missionControl.missingSignals}</span>
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-[#0F172A]">{criticalErrorsCount}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-600 rounded border border-rose-100 uppercase">
                  {t.missionControl.critical}
                </span>
              </div>
              <p className="text-xs text-rose-600 font-medium">
                -{criticalErrorsCount * 5}% {t.missionControl.impactingMatchScore}
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 3. Section 2: Core Analysis - Robot & Errors (Collapsible) */}
      <Collapsible
        open={sectionsOpen.analysis}
        onOpenChange={() => toggleSection('analysis')}
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-transparent data-[state=open]:border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#1E293B]" />
            <h3 className="font-bold text-[#0F172A]">{t.missionControl.sectionCoreAnalysis}</h3>
          </div>
          {sectionsOpen.analysis ? <ChevronUp className="h-5 w-5 text-[#64748B]" /> : <ChevronDown className="h-5 w-5 text-[#64748B]" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6 bg-[#F8FAFC]/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Robot View Text */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A]">{t.missionControl.robotViewTitle}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-mono font-bold text-green-600 uppercase">Live Extraction</span>
                </div>
              </div>
              <div className="bg-[#0F172A] rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 h-48 overflow-y-auto border border-white/10 shadow-inner">
                <div className="flex gap-2 mb-2">
                  <span className="text-green-400 shrink-0">[ATS-CLIENT]</span>
                  <span>Initialize neural extraction v3.4...</span>
                </div>
                {masterResume?.ocrText ? (
                  <div className="text-slate-200">
                    <span className="text-blue-400 font-bold mr-2">&gt;</span>
                    {masterResume.ocrText.slice(0, 1000)}...
                  </div>
                ) : (
                  <div className="text-slate-500 italic uppercase tracking-widest text-center mt-12 py-4">
                    {t.missionControl.uploadToSeeExtraction}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <span className="text-amber-400">_</span>
                </div>
              </div>
            </div>

            {/* Error Console */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A]">{t.missionControl.topErrors}</h4>
                <span className="text-xs text-[#64748B] font-medium">{masterResume?.title || t.missionControl.noCVLoaded}</span>
              </div>
              <div className="space-y-3">
                {topErrors.length === 0 ? (
                  <div className="bg-[#F1F5F9]/50 border border-dashed border-[#E2E8F0] rounded-xl p-12 text-center text-[#64748B]">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">{t.missionControl.noCriticalErrors}</p>
                  </div>
                ) : (
                  topErrors.map((error, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-sm hover:border-[#1E293B] group transition-all">
                      <div className={`shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${error.severity === 'CRIT' ? 'bg-rose-50' : 'bg-amber-50'}`}>
                        {error.severity === 'CRIT' ? (
                          <AlertCircle className="h-5 w-5 text-rose-500" />
                        ) : (
                          <Wrench className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-[#0F172A] truncate pr-2">{error.message}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${error.severity === 'CRIT' ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'}`}>
                            {error.severity}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1">{error.detail}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#E2E8F0] group-hover:text-[#1E293B] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))
                )}
                <Button
                  onClick={() => onNavigate("master-cvs")}
                  className="w-full h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold rounded-xl"
                >
                  {t.missionControl.debugMasterCV}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 4. Section 3: Advanced Tools (Collapsible) */}
      <Collapsible
        open={sectionsOpen.advanced}
        onOpenChange={() => toggleSection('advanced')}
        className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden"
      >
        <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors border-b border-transparent data-[state=open]:border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#1E293B]" />
            <h3 className="font-bold text-[#0F172A]">{t.missionControl.sectionAdvancedTools}</h3>
          </div>
          {sectionsOpen.advanced ? <ChevronUp className="h-5 w-5 text-[#64748B]" /> : <ChevronDown className="h-5 w-5 text-[#64748B]" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-6 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EliteMatchTool />

            <div className="space-y-6">
              {/* Career Health Mini */}
              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1">{t.missionControl.careerHealth}</h4>
                  <p className="text-xs text-[#64748B]">Professional tier progress</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm ${visibilityScore >= 85 ? "bg-black text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                  {visibilityScore >= 85 ? t.missionControl.elite : t.missionControl.starter}
                </div>
              </div>

              {/* Success Insights Widget */}
              <SuccessInsightsWidget />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0F172A] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">view_kanban</span>
                {t.missionControl.applicationKanban}
              </h3>
              <button
                onClick={() => onNavigate("projects")}
                className="text-xs font-bold text-[#1E293B] uppercase tracking-wider flex items-center gap-1 hover:underline"
              >
                {t.missionControl.viewAll} <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
              {[
                { label: t.missionControl.applied, count: applicationsByStatus.applied.length, color: 'bg-slate-400', items: applicationsByStatus.applied },
                { label: t.missionControl.interviewing, count: applicationsByStatus.interviewing.length, color: 'bg-blue-500', items: applicationsByStatus.interviewing },
                { label: t.missionControl.accepted, count: applicationsByStatus.accepted.length, color: 'bg-green-500', items: applicationsByStatus.accepted }
              ].map((col) => (
                <div key={col.label} className="min-w-[280px] flex-1 space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{col.label} ({col.count})</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${col.color}`}></div>
                  </div>
                  <div className="space-y-2">
                    {col.items.length === 0 ? (
                      <div className="h-20 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                        Empty
                      </div>
                    ) : (
                      col.items.map((app: any) => (
                        <div key={app._id} className="p-3 bg-white border border-[#E2E8F0] rounded-lg shadow-sm hover:border-[#1E293B] transition-all cursor-pointer">
                          <p className="text-xs font-bold text-[#0F172A] truncate">{app.jobTitle || app.title}</p>
                          <p className="text-[10px] text-[#64748B] truncate mt-1">{app.company}</p>
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
