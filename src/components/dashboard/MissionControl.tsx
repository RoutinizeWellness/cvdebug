import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RefreshCw,
  Cpu,
  ShieldAlert,
  Target
} from "lucide-react";
import { SuccessInsightsWidget } from "./SuccessInsightsWidget";
import { ApplicationMicroTracker } from "./ApplicationMicroTracker";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onUpload }: MissionControlProps) {
  const currentUser = useQuery(apiAny.users.currentUser);
  const resumes = useQuery(apiAny.resumes.getResumes);

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

  const [isRescanning, setIsRescanning] = useState(false);
  const analyzeResume = useMutation(apiAny.resumes.analyzeResume);

  const handleRescan = async () => {
    if (!masterResume || isRescanning) return;

    setIsRescanning(true);
    try {
      await analyzeResume({
        id: masterResume._id,
        ocrText: masterResume.ocrText,
        jobDescription: masterResume.jobDescription,
      });
      // The query will auto-refresh, so we just wait a bit for effect
      setTimeout(() => setIsRescanning(false), 2000);
    } catch (err) {
      console.error("Rescan failed:", err);
      setIsRescanning(false);
    }
  };

  const missingKeywords = useMemo(() => {
    if (!masterResume || !masterResume.missingKeywords) return [];
    return masterResume.missingKeywords.map((kw: any) =>
      typeof kw === 'string' ? kw : kw.keyword
    );
  }, [masterResume]);

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
    <div className="space-y-10 pb-24 md:pb-10 max-w-6xl mx-auto px-4 font-sans">
      {/* 1. HERO MISSION SECTION - Reverted to clean white/light theme */}
      <header className="relative py-10 px-8 bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -ml-48 -mb-48 opacity-60"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 mb-6 font-mono">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              SYSTEM_READY :: {new Date().toLocaleTimeString()}
            </span>
          </div>

          <h2 className="text-slate-500 text-lg md:text-xl font-medium mb-4">
            Welcome back, <span className="text-slate-900 font-black">{userName}</span>. Your current visibility:
          </h2>

          {/* MASTER GAUGE */}
          <div className="relative mb-10 group transition-transform duration-500 hover:scale-105">
            <div className={`text-[120px] md:text-[160px] font-black leading-none tracking-tighter flex flex-col items-center ${visibilityScore < 50 ? 'text-rose-600' :
              visibilityScore < 80 ? 'text-amber-600' :
                'text-emerald-600'
              }`}>
              {visibilityScore}%
            </div>
            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transform transition-all duration-300 shadow-sm ${visibilityScore < 50 ? 'bg-rose-50 text-rose-700 border border-rose-100' :
              visibilityScore < 80 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
              {visibilityScore < 50 ? 'CRITICAL_FAILURE' : visibilityScore < 80 ? 'HIGH_RISK' : 'OPTIMAL_REACH'}
            </div>
          </div>

          {/* SPRINT GOAL */}
          <div className="w-full max-w-md bg-slate-50 border border-slate-100 p-6 rounded-2xl mb-8">
            <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-emerald-600" />
                Sprint Goal: 95% Visibility
              </span>
              <span className="text-emerald-600 font-bold">{currentUser?.sprintExpiresAt ? `${Math.ceil((currentUser.sprintExpiresAt - Date.now()) / (1000 * 60 * 60 * 24))} Days Left` : 'Active'}</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-900 transition-all duration-1000"
                style={{ width: `${Math.min(100, (visibilityScore / 95) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={handleRescan}
              disabled={isRescanning || !masterResume}
              className="h-14 px-10 bg-white text-slate-900 hover:bg-emerald-50 font-black rounded-2xl uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)]"
            >
              <RefreshCw className={`h-4 w-4 ${isRescanning ? 'animate-spin' : ''}`} />
              {isRescanning ? 'Analyzing...' : 'Force Re-Scan'}
            </Button>
            <Button
              onClick={onUpload}
              variant="outline"
              className="h-14 px-10 border-2 border-slate-200 text-slate-900 hover:bg-slate-100 font-black rounded-2xl uppercase tracking-widest text-xs transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </div>
        </div>
      </header>

      {/* 2. CRITICAL ACTIONS & TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CRITICAL ACTIONS PANEL */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-50 rounded-xl">
                <ShieldAlert className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  Critical Actions
                </h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Immediate fixes for +35% Boost</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">
              {topErrors.length} Alerts
            </div>
          </div>

          <div className="space-y-4">
            {topErrors.map((error, idx) => (
              <div
                key={idx}
                className="group p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => onNavigate("master-cvs")}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`mt-1 h-3 w-3 rounded-full ${error.severity === 'CRIT' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 mb-1 font-mono uppercase truncate max-w-[200px] md:max-w-none">
                        {error.message}
                      </h4>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{error.detail}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    Fix Now →
                  </Button>
                </div>
              </div>
            ))}

            {topErrors.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                <RefreshCw className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm font-black uppercase tracking-widest">System Clear - No Critical Faults</p>
              </div>
            )}
          </div>
        </div>

        {/* APPLICATION TRACKER MINI WIDGET */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <ApplicationMicroTracker />
          <SuccessInsightsWidget />
        </div>
      </div>

      {/* 3. NEURAL PARSER OUTPUT (The Robot View) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-mono flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            NEURAL_PARSER :: ATS_OPTICAL_READ
          </h3>
          <div className="text-[10px] text-slate-400 font-mono">ENCODING: UTF-8 // LAYER: 1</div>
        </div>

        <div className="bg-[#0c0c0c] rounded-[2rem] border-4 border-slate-800 p-8 font-mono text-xs relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] min-h-[400px]">
          {/* Terminal Window Chrome */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-[#1a1a1a] border-b border-slate-800 flex items-center px-6 justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-[0_0_8px_rgba(255,95,86,0.5)]"></div>
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-[0_0_8px_rgba(255,189,46,0.5)]"></div>
                <div className="h-3 w-3 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.5)]"></div>
              </div>
              <div className="ml-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-50">CVDEBUG CLI :: RO-BOT-VIEW-ENV</div>
            </div>
            <div className="text-[10px] font-black text-emerald-500 animate-pulse tracking-[0.3em]">
              LIVE_STREAMING
            </div>
          </div>

          <div className="mt-10 text-slate-300 space-y-4 h-[400px] overflow-y-auto custom-scrollbar pr-4 pt-4">
            {masterResume?.ocrText ? (
              <div className="relative">
                <div className="flex items-center gap-2 text-emerald-400 mb-6 font-black bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                  <span className="opacity-50">$</span>
                  <span>neural-parser --input current_resume.pdf --mode raw_extract</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed opacity-90 text-[13px] text-slate-400 p-4 rounded-xl border border-white/5 bg-white/5 relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0c0c] pointer-events-none opacity-40"></div>
                  {masterResume.ocrText}
                </div>

                <div className="mt-8 flex items-center gap-2 text-indigo-400 animate-pulse font-black">
                  <span>[SYSTEM] END_OF_STREAM - Awaiting next scan</span>
                  <span className="h-4 w-2 bg-indigo-500"></span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-600">
                <Cpu className="h-16 w-16 mb-4 opacity-10 animate-spin-slow" />
                <p className="font-black uppercase tracking-[0.3em] opacity-30">Waiting for data stream...</p>
                <Button
                  variant="ghost"
                  onClick={onUpload}
                  className="mt-6 text-emerald-500 hover:text-emerald-400 font-black uppercase text-[10px] tracking-widest border border-emerald-500/20"
                >
                  Init_Sequence →
                </Button>
              </div>
            )}
          </div>

          {/* Floating HUD Elements */}
          <div className="absolute top-16 right-8 flex flex-col items-end gap-3 pointer-events-none">
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <div className="flex gap-1">
                  <div className="h-1.5 w-4 bg-emerald-500 rounded-sm"></div>
                  <div className="h-1.5 w-4 bg-emerald-500 rounded-sm"></div>
                  <div className="h-1.5 w-4 bg-emerald-500 rounded-sm"></div>
                  <div className="h-1.5 w-4 bg-slate-700 rounded-sm"></div>
                </div>
                <span className="text-[11px] font-black text-emerald-500">98.2%</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detected Entities</span>
              <div className="text-[11px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                {masterResume?.matchedKeywords?.length || 0} OBJECTS_FOUND
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono tracking-widest uppercase">
          <div className="flex gap-4">
            <span className="text-emerald-500 font-black">SCAN_SUCCESS</span>
            <span>ID: {masterResume?._id.slice(0, 8)}</span>
          </div>
          <button
            onClick={() => onNavigate("master-cvs")}
            className="hover:text-white transition-colors"
          >
            // OPEN_FULL_TERMINAL
          </button>
        </div>
      </div>
    </div>
  );
}
