import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Terminal,
  Target,
  Briefcase,
  Shield,
  TrendingUp,
  Sparkles,
  Edit
} from "lucide-react";

interface ATSAnalysisReportProps {
  resume: any;
  onEditWithSniper?: () => void;
  onOpenWritingForge?: () => void;
  onDownloadPDF?: () => void;
}

export function ATSAnalysisReport({
  resume,
  onEditWithSniper,
  onOpenWritingForge,
  onDownloadPDF
}: ATSAnalysisReportProps) {
  const score = resume?.score || 0;
  const matchedKeywords = resume?.matchedKeywords || [];
  const missingKeywords = resume?.missingKeywords || [];
  const ocrText = resume?.ocrText || "";

  // Parse score to percentage for visual display
  const scorePercentage = Math.min(100, Math.max(0, score));
  const strokeDasharray = `${scorePercentage}, 100`;

  // Determine score label
  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent Match";
    if (score >= 70) return "Strong Match";
    if (score >= 50) return "Good Match";
    return "Needs Improvement";
  };

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Simulate integrity checks
  const integrityChecks = [
    { label: "Standard Fonts", status: "passed", icon: CheckCircle2, color: "text-green-400" },
    { label: "No Tables Detected", status: "passed", icon: CheckCircle2, color: "text-green-400" },
    { label: "Hidden Text Detected", status: "critical", icon: XCircle, color: "text-red-400" },
    { label: "Complex Columns", status: "risk", icon: AlertTriangle, color: "text-orange-400" },
  ];

  // Role compatibility scores (simulated)
  const roleCompatibility = [
    { role: "Senior SWE", score: Math.min(100, scorePercentage + 5), color: "bg-primary" },
    { role: "Lead Architect", score: Math.max(0, scorePercentage - 22), color: "bg-purple-500" },
    { role: "DevOps Engineer", score: Math.max(0, scorePercentage - 42), color: "bg-slate-500" },
  ];

  // Generate terminal output from OCR text
  const generateTerminalOutput = () => {
    const lines = ocrText.split('\n').slice(0, 11);
    return lines.map((line: string, i: number) => ({
      lineNum: String(i + 1).padStart(2, '0'),
      content: line.slice(0, 100) || "..."
    }));
  };

  const terminalLines = generateTerminalOutput();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-8"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              {resume?.fileName || "Resume Analysis"}
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30">
              LATEST
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>Last Analyzed: {resume?._creationTime ? formatDate(resume._creationTime) : "Just now"}</span>
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center gap-8 w-full lg:w-auto bg-slate-900/50 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative size-16">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <motion.path
                  className="text-primary drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={strokeDasharray}
                  strokeWidth="3"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-mono font-bold text-white">{scorePercentage}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Match Score</p>
              <p className="text-white font-display font-medium">{getScoreLabel(scorePercentage)}</p>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-700 mx-2 hidden md:block"></div>

          <Button
            onClick={onDownloadPDF}
            className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-medium shadow-lg shadow-primary/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </motion.section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-6">
        {/* Card A: Integrity Audit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 glass-panel rounded-xl p-6 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              Integrity Audit
            </h3>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700">
              {integrityChecks.length} Checks
            </span>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {integrityChecks.map((check, i) => {
              const Icon = check.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    check.status === "passed"
                      ? "bg-slate-800/50 border border-slate-700/50"
                      : check.status === "critical"
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-orange-500/10 border border-orange-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${check.color}`} />
                    <span className="text-sm font-medium">{check.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    check.status === "passed"
                      ? "text-slate-500"
                      : check.status === "critical"
                      ? "text-red-400"
                      : "text-orange-400"
                  }`}>
                    {check.status === "passed" ? "Passed" : check.status === "critical" ? "Critical" : "Risk"}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Card B: Keyword Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 glass-panel rounded-xl p-6 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Keyword Gap
            </h3>
            <div className="flex gap-2">
              <span className="size-2 rounded-full bg-green-400/80"></span>
              <span className="size-2 rounded-full bg-slate-600 border border-slate-400"></span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Found Keywords */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Found Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.slice(0, 6).map((kw: any, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium"
                  >
                    {typeof kw === "string" ? kw : kw.keyword || kw}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Missing Critical Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.slice(0, 4).map((kw: any, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="px-2.5 py-1 rounded-md border border-dashed border-slate-500 text-slate-400 text-xs font-medium opacity-70"
                  >
                    {typeof kw === "string" ? kw : kw.keyword || kw}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card C: Role Context */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 glass-panel rounded-xl p-6 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-400" />
              Role Context
            </h3>
          </div>

          <div className="flex flex-col justify-center h-full gap-5">
            {roleCompatibility.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="flex justify-between items-end mb-1">
                  <span className={`text-sm font-medium ${i === 0 ? "text-white" : "text-slate-300"}`}>
                    {role.role}
                  </span>
                  <span className={`text-xs font-mono font-bold ${
                    i === 0 ? "text-primary" : i === 1 ? "text-purple-400" : "text-slate-400"
                  }`}>
                    {role.score}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${role.color} rounded-full ${
                      i === 0 ? "shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${role.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}

            <div className="mt-2 text-xs text-slate-500 bg-slate-900/40 p-3 rounded border border-white/10">
              <p>
                Your resume is strongly optimized for Senior Software Engineering roles but lacks
                architectural leadership keywords.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Robot Vision Terminal */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl"
      >
        <div className="bg-slate-950 px-4 py-2 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Robot Vision Output
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500/50"></div>
            <div className="size-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="size-2.5 rounded-full bg-green-500/50"></div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 h-64 overflow-y-auto terminal-scroll font-mono text-sm leading-relaxed relative">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-950/20 z-10"></div>

          <div className="flex gap-4 text-slate-300">
            <div className="flex flex-col text-slate-600 select-none text-right pr-2 border-r border-slate-800">
              {terminalLines.map((line: { lineNum: string; content: string }) => (
                <span key={line.lineNum}>{line.lineNum}</span>
              ))}
            </div>
            <div className="w-full space-y-1">
              <p><span className="text-slate-500"># ATS PARSING INITIATED...</span></p>
              <p><span className="text-primary">HEADER_EXTRACT:</span> {resume?.fileName || "Document"}</p>
              <p className="mt-2"><span className="text-slate-500"># SECTION: CONTENT</span></p>
              {terminalLines.slice(0, 6).map((line: { lineNum: string; content: string }, i: number) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-slate-300"
                >
                  {line.content}
                </motion.p>
              ))}
              {missingKeywords.length > 0 && (
                <p className="text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  !!! WARNING: Missing {missingKeywords.length} critical keywords
                </p>
              )}
              <p className="mt-2"><span className="text-slate-500"># END OF STREAM</span></p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl flex items-center justify-between gap-2"
        >
          <Button
            onClick={onEditWithSniper}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700"
          >
            <Target className="h-4 w-4" />
            Edit with Sniper
          </Button>

          <div className="w-px h-6 bg-slate-700"></div>

          <Button
            onClick={onOpenWritingForge}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary hover:bg-blue-600 text-white text-sm font-medium shadow-lg shadow-primary/25"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            Writing Forge
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
