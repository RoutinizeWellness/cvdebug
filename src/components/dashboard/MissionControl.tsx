import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Crosshair, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const apiAny = api as any;

interface MissionControlProps {
  onNavigate: (view: string) => void;
  onGenerateCoverLetter: (applicationId: string) => void;
  onUpload: () => void;
}

export function MissionControl({ onNavigate, onGenerateCoverLetter, onUpload }: MissionControlProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const jobHistory = useQuery(apiAny.jobTracker.getJobHistory);
  
  const masterResume = resumes && resumes.length > 0 ? resumes[0] : null;
  const latestJob = jobHistory && jobHistory.length > 0 ? jobHistory[0] : null;
  
  const jobsAnalyzed = jobHistory?.length || 0;
  const avgScore = jobHistory && jobHistory.length > 0
    ? Math.round(jobHistory.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0) / jobHistory.length)
    : 0;
  
  const matchScore = latestJob?.score || 87;
  const hasImageTrap = masterResume?.hasImageTrap || masterResume?.textLayerIntegrity < 90;
  const integrityScore = masterResume?.textLayerIntegrity || (hasImageTrap ? 0 : 100);

  // Mock skill data - in production, this would come from analysis
  const skills = [
    { name: "Python", matched: true, relevance: 100, type: "high" },
    { name: "System Design", matched: true, relevance: 90, type: "high" },
    { name: "Kubernetes", matched: false, relevance: 20, type: "critical" },
    { name: "React", matched: true, relevance: 85, type: "medium" },
    { name: "SQL", matched: true, relevance: 100, type: "high" },
    { name: "gRPC", matched: false, relevance: 10, type: "medium" },
    { name: "Cloud", matched: true, relevance: 75, type: "medium" },
    { name: "Testing", matched: false, relevance: 0, type: "critical" },
  ];

  const actionItems = [
    { 
      id: 1, 
      title: 'Inject "Kubernetes" into Experience Section', 
      description: "Recommendation based on 12 job description hits.",
      priority: "critical",
      completed: false
    },
    { 
      id: 2, 
      title: 'Quantify impact in "E-commerce API" Project', 
      description: 'Add metrics (e.g., "Reduced latency by 20%")',
      priority: "impact",
      completed: false
    },
    { 
      id: 3, 
      title: 'Add "gRPC" keyword to Skills', 
      description: "Found in 'Preferred Qualifications'",
      priority: "keyword",
      completed: false
    },
  ];

  const consoleLog = [
    { type: "command", text: "root@cvdebug:~$ scan --target=google" },
    { type: "warn", text: '[WARN] Missing keyword "Kubernetes" in Job History.' },
    { type: "info", text: '[INFO] "Python" match confirmed (Weight: 0.95).' },
    { type: "info", text: "[INFO] Readability score analysis complete." },
    { type: "error", text: '[ERR] Gap found: "Testing" module missing.' },
    { type: "info", text: "[INFO] Generating optimization tasks..." },
    { type: "success", text: "[SUCCESS] 3 actionable items created." },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Title & Application Status */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-black tracking-widest uppercase">
                Target Locked
              </span>
              <span className="text-zinc-400 text-xs font-mono">
                ID: #{latestJob?._id?.slice(-8) || "GGL-8829-X"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
              {latestJob?.company || "Google"}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                {latestJob?.jobTitle ? "Inc." : "Inc."}
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
                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_#7c3bed] flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">Applied</span>
              </div>

              {/* Step 3 (Active) */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-zinc-950 border-2 border-primary flex items-center justify-center relative">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping absolute"></div>
                  <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                </div>
                <span className="text-white text-sm font-bold uppercase tracking-wider">Interviewing</span>
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
              <span>Last Scan: 2m ago</span>
              <span className="text-primary">OPTIMIZED</span>
            </div>
          </div>
        </div>
      </div>

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
                  Comparing Resume v2.4 against Job Description
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
                  {skill.matched && (
                    <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
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
              >
                <Activity className="mr-2 h-4 w-4" />
                Auto-Generate Cover Letter
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
                  <span className="text-white">98%</span>
                </div>
                <Progress value={98} className="h-1.5" />
              </div>

              <div className="p-3 bg-zinc-900 border border-white/5 rounded">
                <div className="flex justify-between text-xs text-zinc-400 mb-1 font-mono">
                  <span>KEYWORD DENSITY</span>
                  <span className="text-yellow-400">OPTIMAL</span>
                </div>
                <Progress value={85} className="h-1.5 [&>div]:bg-yellow-400" />
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