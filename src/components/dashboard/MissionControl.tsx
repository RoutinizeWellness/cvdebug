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
  LayoutDashboard,
  RefreshCw,
  Cpu,
  ShieldAlert
} from "lucide-react";
import { SuccessInsightsWidget } from "./SuccessInsightsWidget";
import { ApplicationMicroTracker } from "./ApplicationMicroTracker";
import { useI18n } from "@/contexts/I18nContext";

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

  // Top errors from master resume
  const topErrors = useMemo(() => {
    const errors = [];

    if (masterResume) {
      if (missingKeywords.length > 0) {
        errors.push({
          severity: "CRIT",
          message: `MISSING_CORE_KEYWORD: "${missingKeywords[0]}"`,
          detail: "-15% DETECTABILITY",
          color: "text-rose-500"
        });
      }

      if (masterResume.formatIssues && masterResume.formatIssues.length > 0) {
        errors.push({
          severity: "WARN",
          message: "FORMAT_ANOMALY_DETECTED",
          detail: "PARSING_INTEGRITY_COMPROMISED",
          color: "text-[#F59E0B]"
        });
      }

      if (missingKeywords.length > 1) {
        errors.push({
          severity: "WARN",
          message: `KEYWORD_GAP: "${missingKeywords[1]}"`,
          detail: "-5% RELEVANCE",
          color: "text-[#F59E0B]"
        });
      }
    }

    return errors.slice(0, 3);
  }, [masterResume, missingKeywords]);

  const userName = currentUser?.name?.split(" ")[0] || "User";

  return (
    <div className="space-y-8 pb-24 md:pb-6 max-w-6xl mx-auto px-4 font-mono">
      {/* 1. TERMINAL HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 border-b-2 border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse box-shadow-glow"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">
              SYSTEM_ONLINE :: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tighter uppercase relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">
              Mission Control
            </span>
            <span className="absolute -top-2 -right-4 text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono">V.4.0</span>
          </h1>
          <p className="text-[#64748B] mt-2 font-mono text-xs uppercase tracking-widest">
            Logged in as: <span className="text-indigo-600 font-bold">{userName}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onUpload}
            variant="outline"
            className="h-10 px-6 border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-bold rounded-none uppercase tracking-widest text-xs transition-all"
          >
            <Plus className="h-3 w-3 mr-2" />
            Init_Upload
          </Button>
          <Button
            onClick={() => onNavigate("match")}
            className="h-10 px-6 bg-[#0F172A] text-white hover:bg-emerald-600 font-bold rounded-none uppercase tracking-widest text-xs shadow-none border-2 border-[#0F172A] hover:border-emerald-600 transition-all"
          >
            <Zap className="h-3 w-3 mr-2" />
            Run_Elite_Match
          </Button>
        </div>
      </header>

      {/* 2. DASHBOARD DATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* STATUS GAUGE (ASCII STYLE) */}
        <div className="lg:col-span-8 bg-[#F8FAFC] rounded-sm border-2 border-slate-200 p-8 relative overflow-hidden group hover:border-slate-400 transition-colors">
          <div className="absolute top-2 right-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            VISIBILITY_MONITOR
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Retro Gauge */}
            <div className="relative h-48 w-48 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-2 border-2 border-slate-100 rounded-full"></div>

              <div className="text-center z-10">
                <div className={`text-5xl font-black font-mono tracking-tighter ${visibilityScore < 50 ? 'text-rose-500' : visibilityScore < 80 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                  {visibilityScore}
                </div>
                <div className="w-full h-px bg-slate-300 my-2"></div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  ATS_SCORE
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h3 className="text-xl font-black text-[#0F172A] mb-2 uppercase tracking-tight font-mono flex items-center gap-2 justify-center md:justify-start">
                  {visibilityScore < 50 && <ShieldAlert className="h-5 w-5 text-rose-500" />}
                  STATUS: <span className={`${visibilityScore < 50 ? 'text-rose-600 bg-rose-50' :
                      visibilityScore < 80 ? 'text-amber-600 bg-amber-50' :
                        'text-emerald-600 bg-emerald-50'
                    } px-2 py-0.5`}>
                    {visibilityScore < 50 ? 'CRITICAL_FAILURE' : visibilityScore < 80 ? 'WARNING_LEVEL' : 'OPTIMAL'}
                  </span>
                </h3>
                <p className="text-slate-500 text-sm font-mono leading-relaxed mt-2">
                  {visibilityScore < 50
                    ? ">> ALERT: CV content is invisible to standard parsers. Immediate reconstruction required."
                    : visibilityScore < 80
                      ? ">> NOTICE: Content legible but lacks competitive density. Optimization recommended."
                      : ">> SYSTEM: Visibility optimized. Ready for deployment."}
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
                <div className="p-3 bg-white border border-slate-200">
                  <div className="text-slate-400 uppercase tracking-wider mb-1">Keywords</div>
                  <div className="font-bold text-slate-800">{masterResume?.matchedKeywords?.length || 0} MATCHED</div>
                </div>
                <div className="p-3 bg-white border border-slate-200">
                  <div className="text-slate-400 uppercase tracking-wider mb-1">Errors</div>
                  <div className="font-bold text-rose-500">{criticalErrorsCount} CRITICAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SYSTEM ALERTS LIST */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-mono">
              SYSTEM_ALERTS
            </h3>
            <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 font-mono">
              {topErrors.length} ACTIVE
            </span>
          </div>

          <div className="space-y-2">
            {topErrors.map((error, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate("master-cvs")}
                className="group p-4 bg-white border-l-4 border-l-rose-500 border-y border-r border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-all"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-black uppercase font-mono ${error.color}`}>
                    [{error.severity}]
                  </span>
                  <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-slate-800" />
                </div>
                <h4 className="font-bold text-slate-800 text-xs font-mono mb-1">{error.message}</h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase">{error.detail}</p>
              </div>
            ))}

            {topErrors.length === 0 && (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 text-slate-400 font-mono text-xs">
                NO_ACTIVE_ALERTS
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            className="w-full text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-slate-800"
            onClick={() => onNavigate("master-cvs")}
          >
            // View_Full_Diagnostics
          </Button>
        </div>
      </div>

      {/* 3. NEURAL PARSER OUTPUT (The Robot View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-12">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-mono mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            NEURAL_PARSER_OUTPUT_STREAM
          </h3>

          <div className="bg-[#0c0c0c] rounded-lg border border-slate-800 p-6 font-mono text-xs relative overflow-hidden shadow-2xl min-h-[300px]">
            {/* Terminal UI Elements */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-[#1a1a1a] border-b border-slate-800 flex items-center px-4 gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-500"></div>
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <div className="ml-4 text-[10px] text-slate-500">root@cvdebug-parser:~</div>
            </div>

            <div className="mt-8 text-slate-300 space-y-1 h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {masterResume?.ocrText ? (
                <>
                  <div className="text-emerald-500 mb-4">$ cat parsed_resume_data.txt</div>
                  <div className="whitespace-pre-wrap leading-relaxed opacity-80">
                    {masterResume.ocrText}
                  </div>
                  <div className="mt-4 text-emerald-500 animate-pulse">_</div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <Terminal className="h-12 w-12 mb-4 opacity-20" />
                  <p>WAITING_FOR_INPUT_STREAM...</p>
                </div>
              )}
            </div>

            {/* Overlay Data */}
            <div className="absolute top-12 right-6 flex flex-col items-end gap-1 pointer-events-none">
              <div className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                PARSE_CONFIDENCE: 98.2%
              </div>
              <div className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                ENTITIES: {masterResume?.matchedKeywords?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SUCCESS INSIGHTS (Footer) */}
      <div className="border-t-2 border-slate-100 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-[#0F172A] font-mono uppercase">Mission Logistics</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("projects")} className="text-[10px] font-black uppercase tracking-widest text-indigo-600 font-mono">
            View_All_Projects →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SuccessInsightsWidget />
          <ApplicationMicroTracker />
        </div>
      </div>
    </div>
  );
}
