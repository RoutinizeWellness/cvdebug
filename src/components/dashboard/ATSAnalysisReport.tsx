import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { WeakBulletSuggestions } from "./WeakBulletSuggestions";

interface ATSAnalysisReportProps {
  resume: any;
  user?: any;
  onEditWithSniper?: () => void;
  onOpenWritingForge?: () => void;
  onDownloadPDF?: () => void;
}

export function ATSAnalysisReport({
  resume,
  user,
  onEditWithSniper,
  onOpenWritingForge,
  onDownloadPDF
}: ATSAnalysisReportProps) {
  const score = resume?.score || 82;
  const [showTechnicalLogs, setShowTechnicalLogs] = useState(false);

  // Check if user has paid plan (single_scan or interview_sprint)
  const isPaidUser = user?.subscriptionTier === "single_scan" || user?.subscriptionTier === "interview_sprint";

  // Extract target role (from job title, project, or resume data)
  const targetRole = resume?.jobTitle || resume?.project?.targetRole || resume?.targetRole || null;

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

  // Impact Density: Detect quantifiable metrics in resume text
  const detectMetrics = (text: string) => {
    if (!text) return { count: 0, examples: [] };

    const metricPatterns = [
      /\d+[\d,]*\+?\s*(?:users?|customers?|clients?|people|employees?|team members?|records?|transactions?)/gi, // Volume
      /\d+[\d,]*%/g, // Percentages
      /\$\d+[\d,]*[KMB]?/gi, // Money
      /\d+[\d,]*x/gi, // Multipliers (2x, 10x)
      /\d+[\d,]*\s*(?:million|thousand|billion|M|K|B)/gi, // Large numbers
      /\d+[\d,]*\s*(?:hours?|days?|weeks?|months?|years?)/gi, // Time saved
    ];

    const metrics: string[] = [];
    metricPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        metrics.push(...matches);
      }
    });

    // Get unique metrics
    const uniqueMetrics = [...new Set(metrics)];

    return {
      count: uniqueMetrics.length,
      examples: uniqueMetrics.slice(0, 5) // First 5 examples
    };
  };

  const metricsData = detectMetrics(ocrText);
  const metricsCount = metricsData.count;

  // Determine impact level
  const getImpactLevel = (count: number): { level: 'weak' | 'good' | 'elite', color: string, label: string, advice: string } => {
    if (count === 0 || count <= 4) {
      return {
        level: 'weak',
        color: 'red',
        label: 'Weak Impact',
        advice: `Add ${5 - count} more numbers to your bullet points`
      };
    }
    if (count <= 9) {
      return {
        level: 'good',
        color: 'yellow',
        label: 'Good Impact',
        advice: 'Add more metrics to reach elite level'
      };
    }
    return {
      level: 'elite',
      color: 'green',
      label: 'Elite Impact',
      advice: 'Your resume has strong quantification'
    };
  };

  const impactLevel = getImpactLevel(metricsCount);

  // Show special banner if keywords are perfect but score < 90 (ONLY for paid users)
  const showQuantificationBanner = isPaidUser && missingKeywords.length === 0 && scorePercentage < 90 && metricsCount < 10;

  return (
    <div className="relative w-full bg-[#F8FAFC] min-h-screen overflow-y-auto">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-blue-200/20 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-purple-200/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative w-full z-10">
        {/* Main Content */}
        <main className="flex flex-col items-center justify-start py-8 md:py-12 px-4 md:px-6 w-full max-w-7xl mx-auto">
          {/* Hero Section - ResumeWorded Style */}
          <div className="w-full bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-8 md:p-12 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left: Score Circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative flex items-center justify-center w-48 h-48 lg:w-56 lg:h-56 shrink-0"
              >
                {/* Subtle Glow Background */}
                <div className="absolute inset-0 bg-slate-200/40 blur-[30px] rounded-full"></div>

                {/* SVG Circle Progress */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Gradient Definition for Cyber Effect */}
                  <defs>
                    <linearGradient id="cyber-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: "#2563EB", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.15)"
                    strokeWidth="14"
                  />
                  {/* Indicator with Cyber Gradient */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke={scorePercentage >= 80 ? "url(#cyber-gradient)" : scorePercentage >= 60 ? "#d97706" : "#dc2626"}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={534}
                    initial={{ strokeDashoffset: 534 }}
                    animate={{ strokeDashoffset: 534 - (534 * scorePercentage) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    filter={scorePercentage >= 80 ? "url(#glow)" : undefined}
                  />
                </svg>

                {/* Inner Content */}
                <div className="absolute flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className={`text-6xl lg:text-7xl font-black tracking-tight ${
                      scorePercentage >= 80
                        ? 'text-gradient-cyber'
                        : 'bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent'
                    }`}
                  >
                    {scorePercentage}
                  </motion.span>
                  <span className="text-slate-600 text-sm font-semibold tracking-wide uppercase mt-1">
                    ATS Score
                  </span>
                </div>
              </motion.div>

              {/* Right: Info & Actions */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                {/* Status Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
                  </span>
                  <span className="text-green-700 text-sm font-semibold">Analysis Complete</span>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                    Your ATS Analysis Results
                  </h1>
                  {targetRole && (
                    <p className="text-slate-600 text-base md:text-lg">
                      Optimized for <span className="font-semibold text-cyan-600">{targetRole}</span>
                    </p>
                  )}
                </motion.div>

                {/* Score Interpretation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3 justify-center lg:justify-start">
                    <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                      scorePercentage >= 80 ? 'bg-green-100 text-green-700' :
                      scorePercentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Grade: {getVisibilityGrade(scorePercentage)}
                    </div>
                    <span className="text-slate-600">
                      {scorePercentage >= 80 ? 'Excellent visibility!' : scorePercentage >= 60 ? 'Good, needs work' : 'Needs improvement'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 max-w-2xl">
                    {scorePercentage >= 80
                      ? 'Your resume is highly optimized for ATS systems. Recruiters can easily find and parse your information.'
                      : scorePercentage >= 60
                      ? 'Your resume passes basic ATS requirements but has room for optimization to improve visibility.'
                      : 'Your resume may struggle with ATS systems. Follow the recommendations below to improve your score.'}
                  </p>
                </motion.div>

                {/* Primary CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                >
                  <button
                    onClick={onOpenWritingForge}
                    className="btn-power px-6 py-3 rounded-lg text-white font-semibold border-0 flex items-center justify-center gap-2 group"
                  >
                    <span>Optimize Now</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <button
                    onClick={onDownloadPDF}
                    className="px-6 py-3 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span>Download Report</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Special Banner - Perfect Keywords but Need Numbers */}
          {showQuantificationBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300 shadow-lg mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-xl">
                  <span className="material-symbols-outlined text-3xl text-yellow-600">celebration</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-900 font-bold text-lg md:text-xl mb-2 flex items-center gap-2">
                    <span>🎉</span> Perfect Keywords!
                  </h3>
                  <p className="text-slate-700 text-base mb-4 leading-relaxed">
                    Your keyword optimization is excellent! To reach <span className="font-bold text-yellow-700">100% score</span>, add more quantifiable metrics to your bullet points.
                  </p>
                  <button
                    onClick={onOpenWritingForge}
                    className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Optimize with Numbers</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards - ResumeWorded Style */}
          <div className="w-full space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Performance Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {/* Card 1: Impact Density (Gauge) - PAID USERS ONLY */}
              {isPaidUser ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-white rounded-xl p-6 border transition-all duration-300 ${
                    impactLevel.level === 'weak' ? 'border-red-200 hover:border-red-300' :
                    impactLevel.level === 'good' ? 'border-amber-200 hover:border-amber-300' :
                    'border-emerald-200 hover:border-emerald-300'
                  } shadow-sm hover:shadow`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${
                      impactLevel.level === 'weak' ? 'bg-red-50 text-red-700' :
                      impactLevel.level === 'good' ? 'bg-amber-50 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      <span className="material-symbols-outlined text-xl">speed</span>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      impactLevel.level === 'weak' ? 'text-red-700 bg-red-50' :
                      impactLevel.level === 'good' ? 'text-amber-700 bg-amber-50' :
                      'text-emerald-700 bg-emerald-50'
                    }`}>
                      {impactLevel.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-semibold mb-2">Impact Density</p>
                    <div className="flex items-baseline gap-2 mb-3">
                      <h3 className="text-3xl font-bold text-slate-900">{metricsCount}</h3>
                      <span className="text-lg text-slate-500">/10+</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {impactLevel.advice}
                    </p>
                    {/* Gauge Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (metricsCount / 10) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className={`h-3 rounded-full ${
                          impactLevel.level === 'weak' ? 'bg-red-500' :
                          impactLevel.level === 'good' ? 'bg-yellow-500' :
                          'bg-emerald-500'
                        }`}
                      />
                      {/* Threshold markers */}
                      <div className="absolute top-0 left-[50%] w-0.5 h-3 bg-slate-400/40"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                      <span>Weak (0-4)</span>
                      <span>Good (5-9)</span>
                      <span>Elite (10+)</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Card 1 Alternative: Unlock Impact Density - FREE USERS */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-slate-900/90 to-indigo-900/40 rounded-xl p-6 border-2 border-blue-400/40 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
                  onClick={onOpenWritingForge}
                >
                  {/* Decorative gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity" />

                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                        <span className="material-symbols-outlined text-2xl">speed</span>
                      </div>
                      <span className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock</span>
                        LOCKED
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-slate-300 text-sm font-semibold mb-2">Impact Density</p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <h3 className="text-4xl font-bold text-white blur-sm select-none">8</h3>
                        <span className="text-lg text-slate-400">/10+</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed mb-4">
                        See exactly how many quantifiable metrics are in your resume and get AI suggestions to add more.
                      </p>

                      {/* Benefits */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-slate-200">
                          <span className="text-purple-400">✓</span>
                          <span>Track impact metrics</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200">
                          <span className="text-purple-400">✓</span>
                          <span>AI-powered suggestions</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200">
                          <span className="text-purple-400">✓</span>
                          <span>Reach elite level (10+)</span>
                        </div>
                      </div>
                    </div>

                    <button className="btn-power w-full py-2 rounded-lg text-white text-sm font-bold border-0 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform">
                      <span className="material-symbols-outlined text-base">diamond</span>
                      <span>Unlock with Interview Sprint</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Card 2: Visibility Grade */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 border-2 border-cyan-200 hover:border-cyan-400 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-cyan-100 text-cyan-600">
                    <span className="material-symbols-outlined text-2xl">visibility</span>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-bold text-cyan-700 bg-cyan-100 rounded-full">
                    Excellent
                  </span>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-2">Search Ranking</p>
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-4xl font-mono font-bold text-slate-900">{getVisibilityGrade(scorePercentage)}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Recruiters will see your profile in search results
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Keyword Saturation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl p-6 border-2 border-teal-200 hover:border-teal-400 shadow-sm hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-teal-100 text-teal-600">
                    <span className="material-symbols-outlined text-2xl">bar_chart_4_bars</span>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-100 rounded-full">
                    High Saturation
                  </span>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-4">Signal Strength</p>
                  {/* Mini Bar Chart */}
                  <div className="flex items-end gap-4 h-24 w-full">
                    {/* Bar 1 - Tech */}
                    <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                      <div className="w-full bg-slate-200 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${keywordData.tech}%` }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          className="w-full bg-gradient-to-t from-teal-600 to-teal-400 group-hover:from-cyan-600 group-hover:to-cyan-400 transition-colors duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-slate-900">{keywordData.tech}%</div>
                        <span className="text-xs text-slate-500 font-medium">Tech</span>
                      </div>
                    </div>
                    {/* Bar 2 - Soft */}
                    <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                      <div className="w-full bg-slate-200 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${keywordData.soft}%` }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                          className="w-full bg-gradient-to-t from-teal-600/70 to-teal-400/70 group-hover:from-cyan-600/80 group-hover:to-cyan-400/80 transition-colors duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-slate-900">{keywordData.soft}%</div>
                        <span className="text-xs text-slate-500 font-medium">Soft</span>
                      </div>
                    </div>
                    {/* Bar 3 - Tools */}
                    <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                      <div className="w-full bg-slate-200 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${keywordData.tools}%` }}
                          transition={{ duration: 0.8, delay: 1.0 }}
                          className="w-full bg-gradient-to-t from-teal-600/85 to-teal-400/85 group-hover:from-cyan-600/90 group-hover:to-cyan-400/90 transition-colors duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-slate-900">{keywordData.tools}%</div>
                        <span className="text-xs text-slate-500 font-medium">Tools</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Keywords Section - ResumeWorded Style */}
          {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
            <div className="w-full space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Keyword Analysis</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
                {/* Matched Keywords */}
                {matchedKeywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-xl p-6 border-2 border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[350px] max-h-[500px]"
                  >
                    <div className="flex items-start justify-between mb-4 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                          <span className="material-symbols-outlined text-2xl">check_circle</span>
                        </div>
                        <div>
                          <h3 className="text-slate-900 font-bold text-lg">Keywords Found</h3>
                          <p className="text-slate-600 text-sm">{matchedKeywords.length} matches detected</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 flex-1 content-start">
                      {matchedKeywords.map((keyword: string, index: number) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.02 }}
                          className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium hover:bg-emerald-100 transition-colors cursor-default h-fit"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Missing Keywords */}
                {missingKeywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="bg-white rounded-xl p-6 border-2 border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[350px] max-h-[500px]"
                  >
                    <div className="flex items-start justify-between mb-4 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                          <span className="material-symbols-outlined text-2xl">priority_high</span>
                        </div>
                        <div>
                          <h3 className="text-slate-900 font-bold text-lg">Missing Keywords</h3>
                          <p className="text-slate-600 text-sm">{missingKeywords.length} opportunities to improve</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 flex-1 content-start">
                      {missingKeywords.map((keyword: string, index: number) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.85 + index * 0.02 }}
                          className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-sm font-medium hover:bg-orange-100 transition-colors cursor-default h-fit"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Weak Bullet Suggestions - PAID USERS ONLY */}
          <WeakBulletSuggestions ocrText={ocrText} metricsCount={metricsCount} isPaidUser={isPaidUser} />

          {/* Technical Logs Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="w-full flex justify-center mt-8"
          >
            <button
              onClick={() => setShowTechnicalLogs(!showTechnicalLogs)}
              className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-2 transition-colors group px-4 py-2 rounded-lg hover:bg-slate-100"
            >
              <span>View Technical Logs</span>
              {showTechnicalLogs ? (
                <ChevronUp className="h-4 w-4 group-hover:translate-y-[-2px] transition-transform" />
              ) : (
                <ChevronDown className="h-4 w-4 group-hover:translate-y-[2px] transition-transform" />
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
              className="mt-6 w-full max-w-3xl"
            >
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 font-mono text-sm shadow-lg relative overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-slate-400 text-xs font-semibold ml-2">Terminal - CVDebug Analysis</span>
                </div>
                {/* Terminal Body */}
                <div className="space-y-2">
                  <div className="flex gap-2 text-slate-400">
                    <span className="text-emerald-400">$</span>
                    <span className="text-slate-300">cv-debug --analyze --target=resume.pdf</span>
                  </div>
                  <div className="text-slate-400 pl-4">
                    <span className="text-cyan-400">→</span> Initializing parsing engine... <span className="text-green-400 font-bold">OK</span>
                  </div>
                  <div className="text-slate-400 pl-4">
                    <span className="text-cyan-400">→</span> Scanning for ATS keywords... Found <span className="text-emerald-400 font-bold">{matchedKeywords.length || 42}</span>
                  </div>
                  <div className="text-slate-400 pl-4">
                    <span className="text-cyan-400">→</span> Parsing quality: <span className="text-emerald-400 font-bold">100%</span> | Analysis mode: Deep Scan
                  </div>
                  <div className="text-slate-400 pl-4">
                    <span className="text-cyan-400">→</span> Role classification: Technical | Format: Machine-readable
                  </div>
                  <div className="text-emerald-400 font-bold pl-4 pt-2">
                    <span className="text-green-500">✓</span> [SUCCESS] Visibility Score: {scorePercentage}% | Grade: {getVisibilityGrade(scorePercentage)}
                  </div>
                  <div className="flex items-center gap-2 pl-4 pt-1">
                    <div className="w-2 h-4 bg-green-500 animate-pulse"></div>
                    <span className="text-slate-500 text-xs">Analysis complete</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
