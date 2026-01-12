import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [showTechnicalLogs, setShowTechnicalLogs] = useState(false);

  // Handle matched keywords - can be array of strings or objects
  const rawMatchedKeywords = resume?.matchedKeywords || [];
  const matchedKeywords = Array.isArray(rawMatchedKeywords)
    ? rawMatchedKeywords.map((kw: any) =>
        typeof kw === 'string' ? kw : kw.keyword || kw.term || ''
      ).filter((k: string) => k.length > 0)
    : [];

  // Handle missing keywords - can be array of strings or objects
  const rawMissingKeywords = resume?.missingKeywords || resume?.criticalKeywords || [];
  const missingKeywords = Array.isArray(rawMissingKeywords)
    ? rawMissingKeywords.map((kw: any) =>
        typeof kw === 'string' ? kw : kw.keyword || kw.term || ''
      ).filter((k: string) => k.length > 0)
    : [];

  // Debug logging
  console.log('[ATSAnalysisReport] Resume data:', {
    score,
    matchedCount: matchedKeywords.length,
    missingCount: missingKeywords.length,
    rawMatchedType: typeof rawMatchedKeywords[0],
    rawMissingType: typeof rawMissingKeywords[0],
    sampleMatched: rawMatchedKeywords[0],
    sampleMissing: rawMissingKeywords[0],
    resumeKeys: Object.keys(resume || {})
  });

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
    <div className="relative w-full bg-[#0F172A] min-h-screen overflow-y-auto">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-cyan-600/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-teal-600/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative w-full z-10">
        {/* Main Content */}
        <main className="flex flex-col items-center justify-start py-6 md:py-8 px-4 md:px-6 w-full max-w-6xl mx-auto">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-lg">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">Visibility Score</span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-light px-4">How well recruiters can find and read your resume</p>
            </motion.div>

            {/* Circular Score Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mt-2"
            >
              {/* Glow Background */}
              <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full"></div>

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
                  style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Content */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white">
                  {scorePercentage}<span className="text-2xl sm:text-3xl md:text-4xl text-slate-400">%</span>
                </span>
                <span className="text-slate-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mt-1">Visible</span>
              </div>
            </motion.div>
          </div>

          {/* Bento Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {/* Card 1: Formatting Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-4 md:p-6 flex flex-col justify-between group h-full hover:border-cyan-500/30 transition-all duration-300"
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
              className="glass-card rounded-xl p-4 md:p-6 flex flex-col justify-between group h-full relative overflow-hidden hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
                <div className="p-2 md:p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <span className="material-symbols-outlined text-xl md:text-2xl">visibility</span>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-1">Search Ranking</p>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  <h3 className="text-3xl md:text-4xl font-mono font-bold text-white">{getVisibilityGrade(scorePercentage)}</h3>
                  <span className="px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-bold text-cyan-400 bg-cyan-500/10 rounded border border-cyan-500/20 whitespace-nowrap">
                    Excellent
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] md:text-xs mt-2 md:mt-3 leading-relaxed">
                  Recruiters will see your profile in search results
                </p>
              </div>
            </motion.div>

            {/* Card 3: Keyword Saturation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-xl p-4 md:p-6 flex flex-col justify-between h-full hover:border-teal-500/30 transition-all duration-300 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="p-2 md:p-3 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <span className="material-symbols-outlined text-xl md:text-2xl">bar_chart_4_bars</span>
                </div>
                <span className="text-teal-400 font-bold text-xs md:text-sm whitespace-nowrap">High Saturation</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-2 md:mb-3">Signal Strength</p>
                {/* Mini Bar Chart */}
                <div className="flex items-end gap-3 h-20 w-full px-2">
                  {/* Bar 1 - Tech */}
                  <div className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                    <div className="w-full bg-slate-700/50 rounded-t-sm relative h-full flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${keywordData.tech}%` }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="w-full bg-teal-500 group-hover:bg-cyan-500 transition-colors duration-300"
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
                        className="w-full bg-teal-500/60 group-hover:bg-cyan-500/80 transition-colors duration-300"
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
                        className="w-full bg-teal-500/80 group-hover:bg-cyan-500/90 transition-colors duration-300"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Tools</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Keywords Section */}
          {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full mt-8 md:mt-12"
            >
              {/* Matched Keywords */}
              {matchedKeywords.length > 0 && (
                <div className="glass-card rounded-xl p-5 md:p-6 hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-[400px]">
                  <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                    <div className="p-2 md:p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base md:text-lg">Keywords Found</h3>
                      <p className="text-slate-400 text-xs md:text-sm">{matchedKeywords.length} matches detected</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 overflow-y-auto custom-scrollbar pr-2 flex-1 content-start">
                    {matchedKeywords.map((keyword: string, index: number) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.02 }}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-xs md:text-sm font-medium hover:bg-emerald-500/20 transition-colors cursor-default"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {missingKeywords.length > 0 && (
                <div className="glass-card rounded-xl p-5 md:p-6 hover:border-orange-500/30 transition-all duration-300 flex flex-col h-[400px]">
                  <div className="flex items-center gap-3 mb-4 flex-shrink-0">
                    <div className="p-2 md:p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <span className="material-symbols-outlined text-xl">priority_high</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base md:text-lg">Missing Keywords</h3>
                      <p className="text-slate-400 text-xs md:text-sm">{missingKeywords.length} opportunities to improve</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 overflow-y-auto custom-scrollbar pr-2 flex-1 content-start">
                    {missingKeywords.map((keyword: string, index: number) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.02 }}
                        className="px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20 text-xs md:text-sm font-medium hover:bg-orange-500/20 transition-colors cursor-default"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center gap-4 mt-8 w-full max-w-2xl"
          >
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4 w-full">
              <button
                onClick={onOpenWritingForge}
                className="w-full md:flex-1 h-11 md:h-12 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold text-sm md:text-base shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group"
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
            </div>

            {/* Technical Logs Toggle Button */}
            <button
              onClick={() => setShowTechnicalLogs(!showTechnicalLogs)}
              className="text-slate-500 hover:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors group"
            >
              <span>View Technical Logs</span>
              {showTechnicalLogs ? (
                <ChevronUp className="h-3.5 w-3.5 group-hover:translate-y-[-2px] transition-transform" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 group-hover:translate-y-[2px] transition-transform" />
              )}
            </button>
          </motion.div>

          {/* Terminal Log - Collapsible */}
          {showTechnicalLogs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 mb-6 w-full max-w-2xl"
            >
              <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg p-3 font-mono text-xs shadow-2xl relative overflow-hidden">
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
                  <div className="text-slate-400">
                    &gt; Parsing quality: 100% | Analysis mode: Deep Scan
                  </div>
                  <div className="text-slate-400">
                    &gt; Role classification: Technical | Format: Machine-readable
                  </div>
                  <div className="text-green-400 font-bold">
                    &gt; [SUCCESS] Visibility Score: {scorePercentage}% | Grade: {getVisibilityGrade(scorePercentage)}
                  </div>
                  <div className="w-1.5 md:w-2 h-3 md:h-4 bg-green-500 animate-pulse mt-1"></div>
                </div>
                {/* Glitch effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none opacity-20"></div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
