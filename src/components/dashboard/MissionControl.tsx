import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Crosshair, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMemo, useEffect, useState } from "react";
import { GamificationPanel } from "./mission/GamificationPanel";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { SprintProgressBar } from "./SprintProgressBar";
import { TargetInsight } from "./TargetInsight";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  const projects = useQuery(apiAny.projects.getProjects);
  const checkGapAlert = useMutation(apiAny.gamification.checkGapAlert);
  
  // Get the most recent completed resume, or the most recent one if none are completed
  const masterResume = useMemo(() => {
    if (!resumes || resumes.length === 0) return null;
    
    // First try to find a completed resume with analysis data
    const completedResume = resumes.find((r: any) => 
      r.status === "completed" && 
      (r.matchedKeywords?.length || r.missingKeywords?.length)
    );
    
    if (completedResume) return completedResume;
    
    // Otherwise return the most recent one
    return resumes[0];
  }, [resumes]);
  const latestJob = jobHistory && jobHistory.length > 0 ? jobHistory[0] : null;
  
  const jobsAnalyzed = jobHistory?.length || 0;
  const avgScore = jobHistory && jobHistory.length > 0
    ? Math.round(jobHistory.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / jobHistory.length)
    : 0;
  
  const matchScore = latestJob?.score || 0;
  const hasImageTrap = masterResume?.hasImageTrap || masterResume?.textLayerIntegrity < 90;
  const integrityScore = masterResume?.textLayerIntegrity || (hasImageTrap ? 0 : 100);

  // Calculate active missions
  const activeMissions = useMemo(() => {
    if (!jobHistory) return 0;
    return jobHistory.filter((job: any) => 
      job.status === 'applied' || job.status === 'interviewing'
    ).length;
  }, [jobHistory]);

  // Extract real skills from latest resume analysis
  const skills = useMemo(() => {
    if (!masterResume) {
      return [];
    }
    
    // Check if resume is still processing
    if (masterResume.status === "processing") {
      return [];
    }
    
    const matched = (masterResume.matchedKeywords || []).slice(0, 5).map((kw: string) => ({
      name: kw,
      matched: true,
      relevance: 100,
      type: "high" as const
    }));
    
    const missingKws = masterResume.missingKeywords || [];
    const missing = missingKws.slice(0, 8).map((kw: any) => ({
      name: typeof kw === 'string' ? kw : kw.keyword,
      matched: false,
      relevance: 20,
      type: "critical" as const
    }));
    
    return [...matched, ...missing].slice(0, 8);
  }, [masterResume]);

  // Generate real action items from resume analysis
  const actionItems = useMemo(() => {
    const items = [];
    
    if (masterResume?.missingKeywords && masterResume.missingKeywords.length > 0) {
      items.push({
        id: 1,
        title: `Add "${masterResume.missingKeywords[0]}" to your resume`,
        description: `Critical keyword missing from ${jobsAnalyzed} job descriptions`,
        priority: "critical" as const,
        completed: false
      });
    }
    
    if (masterResume?.formatIssues && masterResume.formatIssues.length > 0) {
      const firstIssue = masterResume.formatIssues[0];
      items.push({
        id: 2,
        title: typeof firstIssue === 'string' ? firstIssue : firstIssue.issue || "Format issue detected",
        description: typeof firstIssue === 'string' ? "ATS parsing issue detected" : firstIssue.atsImpact || "ATS parsing issue detected",
        priority: "impact" as const,
        completed: false
      });
    }
    
    if (latestJob && latestJob.missingKeywords && latestJob.missingKeywords.length > 0) {
      items.push({
        id: 3,
        title: `Optimize for "${latestJob.jobTitle || 'target role'}"`,
        description: `${latestJob.missingKeywords.length} keywords missing for this position`,
        priority: "keyword" as const,
        completed: false
      });
    }
    
    // Add default items if no real data
    if (items.length === 0) {
      items.push({
        id: 1,
        title: 'Upload your resume to get started',
        description: 'Begin tracking your job applications',
        priority: "critical" as const,
        completed: false
      });
    }
    
    return items;
  }, [masterResume, latestJob, jobsAnalyzed]);

  // Generate real console log from system events
  const consoleLog = useMemo(() => {
    const logs = [];
    
    logs.push({ type: "command", text: "root@cvdebug:~$ scan --initialize" });
    
    if (masterResume) {
      logs.push({ 
        type: "info", 
        text: `[INFO] Resume loaded: ${masterResume.title || 'Untitled'} (${masterResume._creationTime ? new Date(masterResume._creationTime).toLocaleDateString() : 'Unknown date'})` 
      });
      
      if (masterResume.textLayerIntegrity !== undefined) {
        if (masterResume.textLayerIntegrity >= 90) {
          logs.push({ type: "success", text: `[SUCCESS] Text integrity: ${masterResume.textLayerIntegrity}% - OPTIMAL` });
        } else {
          logs.push({ type: "warn", text: `[WARN] Text integrity: ${masterResume.textLayerIntegrity}% - NEEDS ATTENTION` });
        }
      }
      
      if (masterResume.hasImageTrap) {
        logs.push({ type: "error", text: "[ERR] IMAGE TRAP DETECTED - ATS parsers will fail" });
      }
    }
    
    if (jobsAnalyzed > 0) {
      logs.push({ type: "info", text: `[INFO] Analyzed ${jobsAnalyzed} job applications` });
      logs.push({ type: "info", text: `[INFO] Average match score: ${avgScore}%` });
    }
    
    if (latestJob) {
      logs.push({ 
        type: "info", 
        text: `[INFO] Latest target: ${latestJob.company || 'Unknown'} - ${latestJob.jobTitle || 'Unknown role'}` 
      });
      
      if (latestJob.missingKeywords && latestJob.missingKeywords.length > 0) {
        logs.push({ 
          type: "warn", 
          text: `[WARN] Missing ${latestJob.missingKeywords.length} critical keywords` 
        });
      }
    }
    
    if (actionItems.length > 0) {
      logs.push({ type: "success", text: `[SUCCESS] ${actionItems.length} optimization tasks generated` });
    }
    
    logs.push({ type: "command", text: "root@cvdebug:~$ monitor --active" });
    
    return logs;
  }, [masterResume, jobsAnalyzed, avgScore, latestJob, actionItems]);

  // Check for gap alerts
  useEffect(() => {
    if (masterResume?.overallScore) {
      const missingCount = masterResume.missingKeywords?.length || 0;
      checkGapAlert({
        resumeScore: masterResume.overallScore,
        missingKeywordsCount: missingCount,
      }).then((alert) => {
        if (alert) {
          toast.warning(alert.message, {
            action: {
              label: alert.action,
              onClick: () => onNavigate("resumes"),
            },
            duration: 10000,
          });
        }
      });
    }
  }, [masterResume?.overallScore, checkGapAlert]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Active Missions Widget */}
      {activeMissions > 0 ? (
        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-2 border-primary rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20 border border-primary">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">
                  Active Missions: <span className="text-primary">{activeMissions}</span>
                </h2>
                <p className="text-zinc-300 text-sm mt-1">
                  {activeMissions === 1 ? '1 Application' : `${activeMissions} Applications`} in Progress
                </p>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('projects')}
              className="bg-primary hover:bg-primary/90 text-black font-bold"
            >
              View All Missions
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-xl p-8 text-center">
          <div className="inline-flex p-4 rounded-full bg-zinc-800 mb-4">
            <Target className="h-8 w-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Active Missions</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Start your job hunt by uploading your master CV and creating your first mission
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onUpload} className="bg-primary hover:bg-primary/90 text-black font-bold">
              Upload Master CV
            </Button>
            <Button onClick={() => onNavigate('projects')} variant="outline">
              Create Mission
            </Button>
          </div>
        </div>
      )}

      {/* NEW: Sprint Progress Bar for Interview Sprint users */}
      <SprintProgressBar />

      {/* Header Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Title & Application Status */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-black tracking-widest uppercase">
                {latestJob ? "Target Locked" : "Awaiting Target"}
              </span>
              {latestJob && (
                <TargetInsight
                  company={latestJob.company || "Unknown Company"}
                  atsSystem="Greenhouse"
                />
              )}
              <span className="text-zinc-400 text-xs font-mono">
                ID: #{latestJob?._id?.slice(-8) || "INIT-0000"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
              {latestJob?.company || "No Active"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                {latestJob?.jobTitle || "Target"}
              </span>
            </h1>
          </div>

          {/* Application Stepper */}
          <div className="w-full bg-zinc-950 border border-primary/20 rounded-lg p-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoNnY2SDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg2djZIMHoiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMCAwaDN2M0gweiIgZmlsbD0iIzExMSIvPjwvc3ZnPg==')]"></div>
            <div className="relative flex justify-between items-center px-2 py-3 md:px-6">
              {/* Line behind */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-700 -z-10 mx-10"></div>
              
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_#7c3bed] flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Drafting</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className={`w-4 h-4 rounded-full ${jobsAnalyzed > 0 ? 'bg-primary shadow-[0_0_10px_#7c3bed]' : 'bg-zinc-700 border border-zinc-500'} flex items-center justify-center`}>
                  {jobsAnalyzed > 0 && <div className="w-2 h-2 bg-black rounded-full"></div>}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${jobsAnalyzed > 0 ? 'text-primary' : 'text-zinc-400'}`}>Applied</span>
              </div>

              {/* Step 3 (Active if has jobs) */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className={`${jobsAnalyzed > 0 ? 'w-6 h-6' : 'w-4 h-4'} rounded-full ${jobsAnalyzed > 0 ? 'bg-zinc-950 border-2 border-primary' : 'bg-zinc-700 border border-zinc-500'} flex items-center justify-center relative`}>
                  {jobsAnalyzed > 0 && (
                    <>
                      <div className="w-2 h-2 bg-primary rounded-full animate-ping absolute"></div>
                      <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                    </>
                  )}
                </div>
                <span className={`${jobsAnalyzed > 0 ? 'text-sm' : 'text-xs'} font-bold uppercase tracking-wider ${jobsAnalyzed > 0 ? 'text-white' : 'text-zinc-400'}`}>Interviewing</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer opacity-50">
                <div className="w-4 h-4 rounded-full bg-zinc-700 border border-zinc-500"></div>
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Offer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Gauge */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="h-full bg-zinc-900 border border-primary/20 rounded-lg p-5 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(124,59,237,0.05)_0%,_transparent_70%)]"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              {/* SVG Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="#27272a" strokeWidth="8"></circle>
                <circle 
                  className="drop-shadow-[0_0_8px_rgba(124,59,237,0.6)]" 
                  cx="50" 
                  cy="50" 
                  fill="none" 
                  r="45" 
                  stroke="#7c3bed" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * matchScore) / 100}
                  strokeLinecap="round" 
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black text-white">
                  {matchScore}<span className="text-xl text-primary">%</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-primary/80 mt-1">Match Score</span>
              </div>
            </div>
            <div className="w-full mt-4 flex justify-between text-xs font-mono text-zinc-400 border-t border-white/5 pt-3">
              <span>Last Scan: {latestJob ? 'Recent' : 'N/A'}</span>
              <span className="text-primary">{matchScore >= 70 ? 'OPTIMIZED' : 'NEEDS WORK'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Gamification Panel */}
      <GamificationPanel resumeId={masterResume?._id} />

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Heatmap & Analysis */}
        <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Skill Heatmap */}
          <div className="bg-zinc-900 border border-primary/20 rounded-lg p-6 relative overflow-hidden">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Crosshair className="h-5 w-5 text-primary" />
                  SKILL HEATMAP ANALYSIS
                </h3>
                <p className="text-sm text-zinc-400 mt-1 font-mono">
                  {masterResume ? `Analyzing ${masterResume.title || 'Resume'}` : 'No resume uploaded'}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-950 rounded border border-white/5">
                  <div className="w-2 h-2 bg-primary rounded-sm"></div>
                  <span className="text-[10px] text-zinc-400 uppercase">Match</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-950 rounded border border-white/5">
                  <div className="w-2 h-2 bg-zinc-700 rounded-sm"></div>
                  <span className="text-[10px] text-zinc-400 uppercase">Gap</span>
                </div>
              </div>
            </div>

            {masterResume?.status === "processing" ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-primary">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-mono">Analyzing resume... This may take 30-60 seconds</span>
                </div>
              </div>
            ) : skills.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded flex flex-col gap-2 transition-colors cursor-help group ${
                      skill.matched
                        ? "bg-primary/10 border border-primary/40 hover:bg-primary/20"
                        : "bg-zinc-950 border border-zinc-700 hover:border-red-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`font-bold text-sm ${skill.matched ? "text-white" : "text-zinc-300"}`}>
                        {skill.name}
                      </span>
                      {skill.matched ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : skill.type === "critical" ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          skill.matched ? "bg-primary" : skill.type === "critical" ? "bg-red-500" : "bg-orange-500"
                        }`}
                        style={{ width: `${skill.relevance}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase ${
                        skill.matched
                          ? "text-primary/80"
                          : skill.type === "critical"
                          ? "text-red-400"
                          : "text-orange-400"
                      }`}
                    >
                      {skill.matched
                        ? skill.type === "high"
                          ? "High Relevance"
                          : "Med Relevance"
                        : skill.type === "critical"
                        ? "Critical Gap"
                        : "Med Gap"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p>Upload a resume to see skill analysis</p>
                <Button onClick={onUpload} className="mt-4" variant="outline">
                  Upload Resume
                </Button>
              </div>
            )}
          </div>

          {/* Actionable Intelligence */}
          <div className="bg-zinc-900 border border-primary/20 rounded-lg p-0 flex flex-col flex-1">
            <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-zinc-950/50 rounded-t-lg">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                ACTIONABLE INTELLIGENCE
              </h3>
              <button className="text-xs text-primary hover:text-white underline font-mono">
                View All
              </button>
            </div>

            <div className="flex flex-col">
              {actionItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-4 p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 border-2 border-zinc-500 rounded bg-transparent checked:bg-primary checked:border-primary transition-all"
                    />
                    <CheckCircle2 className="absolute h-4 w-4 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-200 font-medium group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">{item.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      item.priority === "critical"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : item.priority === "impact"
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}
                  >
                    {item.priority}
                  </span>
                </label>
              ))}
            </div>

            <div className="p-4 bg-zinc-950/30 rounded-b-lg">
              <Button
                onClick={() => latestJob && onGenerateCoverLetter(latestJob._id)}
                className="w-full bg-primary/10 hover:bg-primary hover:text-black border border-primary/50 text-primary font-bold uppercase"
                disabled={!latestJob}
              >
                <Activity className="mr-2 h-4 w-4" />
                {latestJob ? 'Auto-Generate Cover Letter' : 'No Active Target'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Integrity & Console */}
        <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* System Integrity */}
          <div className="bg-zinc-950 border border-primary/20 rounded-lg p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_#7c3bed] animate-pulse opacity-20 group-hover:opacity-40"></div>
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Integrity</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary text-xs font-mono">ONLINE</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-3 bg-zinc-900 border border-white/5 rounded">
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono">
                  <span>READABILITY</span>
                  <span className="text-white">{integrityScore}%</span>
                </div>
                <Progress value={integrityScore} className="h-1.5" />
              </div>

              <div className="p-3 bg-zinc-900 border border-white/5 rounded">
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono">
                  <span>ATS PARSE RATE</span>
                  <span className="text-white">{masterResume ? '98%' : 'N/A'}</span>
                </div>
                <Progress value={masterResume ? 98 : 0} className="h-1.5" />
              </div>

              <div className="p-3 bg-zinc-900 border border-white/5 rounded">
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono">
                  <span>KEYWORD DENSITY</span>
                  <span className="text-yellow-400">{matchScore >= 70 ? 'OPTIMAL' : 'LOW'}</span>
                </div>
                <Progress value={matchScore} className="h-1.5 [&>div]:bg-yellow-400" />
              </div>
            </div>
          </div>

          {/* Console Log */}
          <div className="flex-1 bg-black border border-white/10 rounded-lg p-4 font-mono text-xs overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
              <span className="text-zinc-400 uppercase">Console Output</span>
              <span className="text-[10px] bg-white/10 px-1 rounded text-white">LIVE</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] text-zinc-400">
              {consoleLog.map((log, idx) => (
                <p
                  key={idx}
                  className={
                    log.type === "command"
                      ? "text-primary"
                      : log.type === "warn"
                      ? "text-yellow-500"
                      : log.type === "error"
                      ? "text-red-400"
                      : log.type === "success"
                      ? "text-primary"
                      : "text-primary"
                  }
                >
                  {log.text}
                </p>
              ))}
              <p>
                <span className="text-primary animate-pulse">_</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}