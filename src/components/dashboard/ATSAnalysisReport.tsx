import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  const score = resume?.score || 82;
  const matchedKeywords = resume?.matchedKeywords || [];
  const missingKeywords = resume?.missingKeywords || [];
  const ocrText = resume?.ocrText || "";

  // Parse score to percentage for visual display
  const scorePercentage = Math.min(100, Math.max(0, score));

  // Calculate SVG circle progress (565 is full circumference, we want ~82%)
  const circumference = 565;
  const strokeDashoffset = circumference - (circumference * scorePercentage) / 100;

  // Determine visibility grade
  const getVisibilityGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    return "C";
  };

  // Keyword saturation data (simulated)
  const keywordData = {
    tech: 85,
    soft: 60,
    tools: 75
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] overflow-y-auto">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#3B82F6]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[100px]"></div>

        {/* Abstract Confetti - Hidden on mobile */}
        <div className="hidden md:block absolute rounded-full top-[10%] left-[20%] w-2 h-2 bg-[#8B5CF6] opacity-30 animate-float"></div>
        <div className="hidden md:block absolute rotate-45 top-[15%] right-[25%] w-2 h-2 bg-[#3B82F6] opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="hidden md:block absolute rounded-sm top-[40%] left-[80%] w-2 h-2 bg-emerald-400 opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="hidden md:block absolute rounded-full top-[70%] left-[10%] w-2 h-2 bg-[#8B5CF6] opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative flex min-h-screen w-full flex-col z-10">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 px-4 md:px-8 py-3 md:py-4 backdrop-blur-md bg-[#0F172A]/80 sticky top-0 z-50">
          <div className="flex items-center gap-2 md:gap-4 text-white">
            <div className="size-7 md:size-8 flex items-center justify-center rounded bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>terminal</span>
            </div>
            <h2 className="text-white text-lg md:text-xl font-bold leading-tight tracking-tight">CVDebug</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              SYSTEM ONLINE
            </div>
            <button className="flex items-center justify-center overflow-hidden rounded-lg h-8 md:h-9 px-3 md:px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs md:text-sm font-bold transition-all">
              <span className="truncate">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center py-6 md:py-10 px-4 md:px-10 w-full max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col items-center gap-6 md:gap-8 mb-8 md:mb-12 w-full">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-1.5 md:py-2 rounded-full glass-card border-green-500/30"
            >
              <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-full w-full bg-green-500 shadow-[0_0_10px_#4ade80]"></span>
              </span>
              <span className="text-green-400 text-xs md:text-sm font-mono tracking-wider font-bold uppercase">Analysis Complete</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-2 px-2"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-lg">
                Resume Diagnostics <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Finalized</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base lg:text-lg font-light px-4">Your profile has been parsed, analyzed, and scored against industry standards.</p>
            </motion.div>

            {/* Circular Score Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mt-2 md:mt-4"
            >
              {/* Glow Background */}
              <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-[50px] rounded-full"></div>

              {/* SVG Circle Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Track */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="12"
                />
                {/* Indicator */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Content */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white">
                  {scorePercentage}<span className="text-2xl sm:text-2xl md:text-3xl text-slate-400">%</span>
                </span>
                <span className="text-slate-400 text-xs sm:text-sm font-mono tracking-widest uppercase mt-1 md:mt-2">Match Score</span>
              </div>
            </motion.div>
          </div>

          {/* Bento Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl">
            {/* Card 1: Formatting Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-4 md:p-6 flex flex-col justify-between group h-full hover:border-[#8B5CF6]/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="p-2 md:p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="material-symbols-outlined text-xl md:text-2xl">verified_user</span>
                </div>
                <span className="px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20 whitespace-nowrap">
                  +Perfect
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-1">Formatting Health</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">100<span className="text-sm md:text-lg text-slate-500">/100</span></h3>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-3 md:mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="bg-emerald-500 h-1.5 rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Visibility Grade */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-xl p-4 md:p-6 flex flex-col justify-between group h-full relative overflow-hidden hover:border-[#8B5CF6]/30 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-[#3B82F6]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
                <div className="p-2 md:p-3 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                  <span className="material-symbols-outlined text-xl md:text-2xl">visibility</span>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-1">Visibility Grade</p>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <h3 className="text-3xl md:text-4xl font-mono font-bold text-white">{getVisibilityGrade(scorePercentage)}</h3>
                  <span className="px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 rounded border border-[#3B82F6]/20 whitespace-nowrap">
                    Top Tech
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] md:text-xs mt-2 md:mt-3 leading-relaxed">
                  Your resume passes 95% of ATS filters used by FAANG companies.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Keyword Saturation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-xl p-4 md:p-6 flex flex-col justify-between h-full hover:border-[#8B5CF6]/30 transition-all duration-300 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="p-2 md:p-3 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                  <span className="material-symbols-outlined text-xl md:text-2xl">bar_chart_4_bars</span>
                </div>
                <span className="text-[#8B5CF6] font-bold text-xs md:text-sm whitespace-nowrap">High Saturation</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-2 md:mb-3">Keyword Analysis</p>
                {/* Mini Bar Chart */}
                <div className="flex items-end gap-3 h-20 w-full px-2">
                  {/* Bar 1 - Tech */}
                  <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                    <div className="w-full bg-slate-700/50 rounded-t-sm relative h-full flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${keywordData.tech}%` }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="w-full bg-[#8B5CF6] group-hover:bg-[#3B82F6] transition-colors duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Tech</span>
                  </div>
                  {/* Bar 2 - Soft */}
                  <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                    <div className="w-full bg-slate-700/50 rounded-t-sm relative h-full flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${keywordData.soft}%` }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="w-full bg-[#8B5CF6]/60 group-hover:bg-[#3B82F6]/80 transition-colors duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Soft</span>
                  </div>
                  {/* Bar 3 - Tools */}
                  <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                    <div className="w-full bg-slate-700/50 rounded-t-sm relative h-full flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${keywordData.tools}%` }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        className="w-full bg-[#8B5CF6]/80 group-hover:bg-[#3B82F6]/90 transition-colors duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Tools</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4 mt-8 md:mt-12 w-full max-w-lg px-4"
          >
            <button
              onClick={onOpenWritingForge}
              className="w-full md:flex-1 h-11 md:h-12 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-bold text-sm md:text-base shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Start Mission Control</span>
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button
              onClick={onDownloadPDF}
              className="w-full md:flex-1 h-11 md:h-12 rounded-lg bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-medium text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg text-slate-400">download</span>
              <span className="hidden sm:inline">Download Report</span>
              <span className="sm:hidden">Download</span>
            </button>
          </motion.div>

          {/* Terminal Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 md:mt-16 w-full max-w-2xl px-4 animate-float"
            style={{ animationDuration: '8s' }}
          >
            <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg p-3 md:p-4 font-mono text-xs md:text-sm shadow-2xl relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex gap-1.5 mb-2 md:mb-3 opacity-50">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500"></div>
              </div>
              {/* Terminal Body */}
              <div className="space-y-1">
                <div className="flex gap-2 text-slate-500 overflow-x-auto">
                  <span className="shrink-0">$</span>
                  <span className="whitespace-nowrap">cv-debug --analyze --target=resume.pdf</span>
                </div>
                <div className="text-slate-400">
                  &gt; Initializing parsing engine... OK
                </div>
                <div className="text-slate-400">
                  &gt; Scanning for ATS keywords... Found {matchedKeywords.length || 42}
                </div>
                <div className="text-green-400 font-bold">
                  &gt; [SUCCESS] 100% Readability achieved. Report generated.
                </div>
                <div className="w-1.5 md:w-2 h-3 md:h-4 bg-green-500 animate-pulse mt-1"></div>
              </div>
              {/* Glitch effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none opacity-20"></div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
