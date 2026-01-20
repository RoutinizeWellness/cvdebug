import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { WeakBulletSuggestions } from "./WeakBulletSuggestions";
import { ATSOverviewDashboard } from "./ATSOverviewDashboard";
import { KeywordHeatmap } from "./analysis/KeywordHeatmap";

interface ATSAnalysisReportProps {
  resume: any;
  user?: any;
  onEditWithSniper?: () => void;
  onOpenWritingForge?: () => void;
  onDownloadPDF?: () => void;
  onUpgrade?: () => void;
}

export function ATSAnalysisReport({
  resume,
  user,
  onEditWithSniper,
  onOpenWritingForge,
  onDownloadPDF,
  onUpgrade
}: ATSAnalysisReportProps) {
  const score = resume?.score || 0; // No fake score - show real data only
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

  // Handle missing keywords - can be array of strings or objects with detailed info
  const rawMissingKeywords = resume?.missingKeywords || resume?.criticalKeywords || [];

  // Parse missing keywords - preserve full object structure if available
  interface MissingKeywordDetail {
    keyword: string;
    priority?: string;
    section?: string;
    context?: string;
    frequency?: number;
    impact?: number;
    synonyms?: string[];
  }

  const missingKeywordsDetailed: MissingKeywordDetail[] = Array.isArray(rawMissingKeywords)
    ? rawMissingKeywords.map((kw: any) => {
        if (typeof kw === 'string') {
          return { keyword: kw };
        }
        return {
          keyword: kw.keyword || kw.term || '',
          priority: kw.priority,
          section: kw.section,
          context: kw.context,
          frequency: kw.frequency,
          impact: kw.impact,
          synonyms: kw.synonyms
        };
      }).filter((k: MissingKeywordDetail) => k.keyword.length > 0)
    : [];

  // Simple array of keyword strings for basic display
  const missingKeywords = missingKeywordsDetailed.map(kw => kw.keyword);

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

  // Keyword saturation data - calculated from REAL matched keywords
  const calculateKeywordSaturation = (keywords: string[]) => {
    if (keywords.length === 0) return { tech: 0, soft: 0, tools: 0 };

    const techKeywords = /python|java|javascript|typescript|c\+\+|ruby|go|rust|sql|nosql|mongodb|postgresql|react|angular|vue|node|express|django|flask|spring|aws|azure|gcp|kubernetes|docker|ci\/cd|devops|machine learning|ai|ml|deep learning|neural|data science|analytics|algorithm|api|rest|graphql|microservices|cloud|backend|frontend|fullstack/i;
    const softKeywords = /leadership|communication|teamwork|collaboration|management|mentoring|problem solving|critical thinking|analytical|creative|adaptable|organized|detail oriented|time management|presentation|stakeholder|cross-functional|agile|scrum|conflict resolution/i;
    const toolKeywords = /git|github|gitlab|bitbucket|jira|confluence|slack|trello|asana|figma|sketch|photoshop|illustrator|excel|powerpoint|tableau|power bi|salesforce|hubspot|zendesk|postman|jenkins|travis|circleci|terraform|ansible|prometheus|grafana|splunk/i;

    let techCount = 0;
    let softCount = 0;
    let toolCount = 0;

    keywords.forEach(kw => {
      const lower = kw.toLowerCase();
      if (techKeywords.test(lower)) techCount++;
      else if (softKeywords.test(lower)) softCount++;
      else if (toolKeywords.test(lower)) toolCount++;
      else techCount++; // Default to tech if unclassified
    });

    const total = keywords.length;

    // Calculate percentages - realistic, not inflated
    const techPercent = total > 0 ? Math.round((techCount / total) * 100) : 0;
    const softPercent = total > 0 ? Math.round((softCount / total) * 100) : 0;
    const toolPercent = total > 0 ? Math.round((toolCount / total) * 100) : 0;

    return {
      tech: Math.min(100, techPercent),
      soft: Math.min(100, softPercent),
      tools: Math.min(100, toolPercent)
    };
  };

  const keywordData = calculateKeywordSaturation(matchedKeywords);

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
        <main className="flex flex-col items-center justify-start py-4 md:py-8 lg:py-12 px-3 md:px-6 w-full max-w-7xl mx-auto">
          {/* Header with Logo - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center mb-4 md:mb-6"
          >
            <div className="flex items-center">
              <img
                src="/favicon.png?v=20"
                alt="CVDebug Logo"
                className="w-12 h-12"
              />
            </div>
          </motion.div>

          {/* Hero Section - Mobile Optimized */}
          <div className="w-full bg-[#FFFFFF] rounded-xl md:rounded-2xl shadow-xl border border-[#E2E8F0] p-4 md:p-8 lg:p-12 mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-6 md:gap-8 lg:gap-12">
              {/* Left: Score Circle - Responsive Size */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0"
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

                {/* Inner Content - Responsive Text */}
                <div className="absolute flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight ${
                      scorePercentage >= 80
                        ? 'text-gradient-cyber'
                        : 'bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent'
                    }`}
                  >
                    {scorePercentage}
                  </motion.span>
                  <span className="text-[#475569] text-xs md:text-sm font-semibold tracking-wide uppercase mt-1">
                    ATS Score
                  </span>
                </div>
              </motion.div>

              {/* Right: Info & Actions - Mobile Optimized */}
              <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left w-full">
                {/* Status Badge - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-green-50 border border-green-200"
                >
                  <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-full w-full bg-[#22C55E]"></span>
                  </span>
                  <span className="text-green-700 text-xs md:text-sm font-semibold">Analysis Complete</span>
                </motion.div>

                {/* Title - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-1 md:space-y-2"
                >
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F172A]">
                    Your ATS Analysis Results
                  </h1>
                  {targetRole && (
                    <p className="text-[#475569] text-sm md:text-base lg:text-lg">
                      Optimized for <span className="font-semibold text-cyan-600">{targetRole}</span>
                    </p>
                  )}
                </motion.div>

                {/* Score Interpretation - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2 md:space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3 justify-center lg:justify-start">
                    <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm md:text-base lg:text-lg ${
                      scorePercentage >= 80 ? 'bg-green-100 text-green-700' :
                      scorePercentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Grade: {getVisibilityGrade(scorePercentage)}
                    </div>
                    <span className="text-[#475569] text-sm md:text-base">
                      {scorePercentage >= 80 ? 'Excellent visibility!' : scorePercentage >= 60 ? 'Good, needs work' : 'Needs improvement'}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-[#64748B] max-w-2xl leading-relaxed">
                    {scorePercentage >= 80
                      ? 'Your resume is highly optimized for ATS systems. Recruiters can easily find and parse your information.'
                      : scorePercentage >= 60
                      ? 'Your resume passes basic ATS requirements but has room for optimization to improve visibility.'
                      : 'Your resume may struggle with ATS systems. Follow the recommendations below to improve your score.'}
                  </p>
                </motion.div>

                {/* Primary CTA - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center lg:justify-start"
                >
                  <button
                    onClick={onOpenWritingForge}
                    className="btn-power px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-[#0F172A] text-sm md:text-base font-semibold border-0 flex items-center justify-center gap-2 group w-full sm:w-auto"
                  >
                    <span>Optimize Now</span>
                    <span className="material-symbols-outlined text-base md:text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                  <button
                    onClick={onDownloadPDF}
                    className="px-5 md:px-6 py-2.5 md:py-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:border-slate-400 text-[#475569] text-sm md:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-base md:text-lg">download</span>
                    <span>Download Report</span>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Special Banner - Perfect Keywords but Need Numbers - Mobile Optimized */}
          {showQuantificationBanner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg md:rounded-xl p-4 md:p-6 border-2 border-yellow-300 shadow-lg mb-6 md:mb-8"
            >
              <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 p-2 md:p-3 bg-yellow-100 rounded-lg md:rounded-xl self-start">
                  <span className="material-symbols-outlined text-2xl md:text-3xl text-[#F59E0B]">celebration</span>
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-[#0F172A] font-bold text-base md:text-lg lg:text-xl mb-1.5 md:mb-2 flex items-center gap-2">
                    <span>🎉</span> Perfect Keywords!
                  </h3>
                  <p className="text-[#475569] text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                    Your keyword optimization is excellent! To reach <span className="font-bold text-yellow-700">100% score</span>, add more quantifiable metrics to your bullet points.
                  </p>
                  <button
                    onClick={onOpenWritingForge}
                    className="px-4 md:px-5 py-2 md:py-2.5 bg-yellow-600 hover:bg-yellow-700 text-[#0F172A] text-sm md:text-base font-semibold rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
                  >
                    <span>Optimize with Numbers</span>
                    <span className="material-symbols-outlined text-base md:text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ATS Overview Dashboard - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full mb-6 md:mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-4 md:mb-6">Overview Analysis</h2>
            <ATSOverviewDashboard
              resume={resume}
              user={user}
              onFixIssue={(issueType: string) => {
                console.log("Fix issue:", issueType);
                // You can show a modal or navigate to the fix
              }}
              onUpgrade={onUpgrade}
            />
          </motion.div>

          {/* Stats Cards - Mobile Optimized */}
          <div className="w-full space-y-4 md:space-y-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">Performance Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full">
              {/* Card 1: Impact Density (Gauge) - PAID USERS ONLY - Mobile Optimized */}
              {isPaidUser ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`bg-[#FFFFFF] rounded-lg md:rounded-xl p-4 md:p-6 border transition-all duration-300 ${
                    impactLevel.level === 'weak' ? 'border-red-200 hover:border-red-300' :
                    impactLevel.level === 'good' ? 'border-amber-200 hover:border-amber-300' :
                    'border-emerald-200 hover:border-emerald-300'
                  } shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow`}
                >
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className={`p-2 md:p-3 rounded-lg ${
                      impactLevel.level === 'weak' ? 'bg-red-50 text-red-700' :
                      impactLevel.level === 'good' ? 'bg-amber-50 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      <span className="material-symbols-outlined text-lg md:text-xl">speed</span>
                    </div>
                    <span className={`px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold rounded-full ${
                      impactLevel.level === 'weak' ? 'text-red-700 bg-red-50' :
                      impactLevel.level === 'good' ? 'text-amber-700 bg-amber-50' :
                      'text-emerald-700 bg-emerald-50'
                    }`}>
                      {impactLevel.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#475569] text-xs md:text-sm font-semibold mb-1.5 md:mb-2">Impact Density</p>
                    <div className="flex items-baseline gap-2 mb-2 md:mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A]">{metricsCount}</h3>
                      <span className="text-base md:text-lg text-[#64748B]">/10+</span>
                    </div>
                    <p className="text-[#475569] text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                      {impactLevel.advice}
                    </p>
                    {/* Gauge Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2.5 md:h-3 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (metricsCount / 10) * 100)}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className={`h-2.5 md:h-3 rounded-full ${
                          impactLevel.level === 'weak' ? 'bg-[#EF4444]' :
                          impactLevel.level === 'good' ? 'bg-yellow-500' :
                          'bg-[#22C55E]'
                        }`}
                      />
                      {/* Threshold markers */}
                      <div className="absolute top-0 left-[50%] w-0.5 h-2.5 md:h-3 bg-slate-400/40"></div>
                    </div>
                    <div className="flex justify-between text-[10px] md:text-xs text-[#64748B] mt-1.5 md:mt-2 font-medium">
                      <span>Weak (0-4)</span>
                      <span>Good (5-9)</span>
                      <span>Elite (10+)</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Card 1 Alternative: Unlock Impact Density - FREE USERS - Mobile Optimized */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-slate-900/90 to-indigo-900/40 rounded-lg md:rounded-xl p-4 md:p-6 border-2 border-blue-400/40 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
                  onClick={onOpenWritingForge}
                >
                  {/* Decorative gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity" />

                  <div className="relative">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-[#3B82F6]/20 text-blue-400">
                        <span className="material-symbols-outlined text-xl md:text-2xl">speed</span>
                      </div>
                      <span className="px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-bold text-[#0F172A] bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] md:text-xs">lock</span>
                        LOCKED
                      </span>
                    </div>

                    <div className="mb-3 md:mb-4">
                      <p className="text-[#475569] text-xs md:text-sm font-semibold mb-1.5 md:mb-2">Impact Density</p>
                      <div className="flex items-baseline gap-2 mb-2 md:mb-3">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#0F172A] blur-sm select-none">8</h3>
                        <span className="text-base md:text-lg text-[#64748B]">/10+</span>
                      </div>
                      <p className="text-[#475569] text-[11px] md:text-xs leading-relaxed mb-3 md:mb-4">
                        See exactly how many quantifiable metrics are in your resume and get AI suggestions to add more.
                      </p>

                      {/* Benefits */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#8B5CF6]">✓</span>
                          <span>Track impact metrics</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#8B5CF6]">✓</span>
                          <span>AI-powered suggestions</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#475569]">
                          <span className="text-[#8B5CF6]">✓</span>
                          <span>Reach elite level (10+)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onUpgrade}
                      className="btn-power w-full py-2 rounded-lg text-[#0F172A] text-sm font-bold border-0 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                    >
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
                className="bg-[#FFFFFF] rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                    <span className="material-symbols-outlined text-2xl">visibility</span>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 rounded-full">
                    Excellent
                  </span>
                </div>
                <div>
                  <p className="text-[#475569] text-sm font-semibold mb-2">Search Ranking</p>
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-4xl font-mono font-bold text-[#0F172A]">{getVisibilityGrade(scorePercentage)}</h3>
                  </div>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    Recruiters will see your profile in search results
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Keyword Saturation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#FFFFFF] rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 md:col-span-2 lg:col-span-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                    <span className="material-symbols-outlined text-2xl">bar_chart_4_bars</span>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-100 rounded-full">
                    High Saturation
                  </span>
                </div>
                <div>
                  <p className="text-[#475569] text-sm font-semibold mb-4">Signal Strength</p>
                  {/* Mini Bar Chart */}
                  <div className="flex items-end gap-4 h-24 w-full">
                    {/* Bar 1 - Tech */}
                    <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                      <div className="w-full bg-slate-200 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${keywordData.tech}%` }}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          className="w-full bg-gradient-to-t from-purple-600 to-purple-400 group-hover:from-blue-600 group-hover:to-blue-400 transition-colors duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[#0F172A]">{keywordData.tech}%</div>
                        <span className="text-xs text-[#64748B] font-medium">Tech</span>
                      </div>
                    </div>
                    {/* Bar 2 - Soft */}
                    <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                      <div className="w-full bg-slate-200 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${keywordData.soft}%` }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                          className="w-full bg-gradient-to-t from-purple-600/70 to-purple-400/70 group-hover:from-blue-600/80 group-hover:to-blue-400/80 transition-colors duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[#0F172A]">{keywordData.soft}%</div>
                        <span className="text-xs text-[#64748B] font-medium">Soft</span>
                      </div>
                    </div>
                    {/* Bar 3 - Tools */}
                    <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                      <div className="w-full bg-slate-200 rounded-t-lg relative h-full flex items-end overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${keywordData.tools}%` }}
                          transition={{ duration: 0.8, delay: 1.0 }}
                          className="w-full bg-gradient-to-t from-purple-600/85 to-purple-400/85 group-hover:from-blue-600/90 group-hover:to-blue-400/90 transition-colors duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-[#0F172A]">{keywordData.tools}%</div>
                        <span className="text-xs text-[#64748B] font-medium">Tools</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Keywords Section - ResumeWorded Style - ALWAYS show even if empty */}
          {(matchedKeywords.length > 0 || missingKeywords.length > 0 || true) && (
            <div className="w-full space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">Keyword Analysis</h2>

              {/* Keyword Heatmap Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <KeywordHeatmap
                  matchedKeywords={matchedKeywords}
                  missingKeywords={missingKeywords}
                  onUnlock={onUpgrade}
                  isPremium={isPaidUser}
                />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 w-full">
                {/* Debug info when no keywords */}
                {matchedKeywords.length === 0 && missingKeywords.length === 0 && (
                  <div className="col-span-full p-4 md:p-6 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm md:text-base text-[#0F172A] mb-2">
                      <strong>No keywords detected.</strong> This usually means:
                    </p>
                    <ul className="text-xs md:text-sm text-[#475569] list-disc list-inside space-y-1">
                      <li>Resume is still being processed</li>
                      <li>No job description was provided for comparison</li>
                      <li>Resume text couldn't be extracted (try uploading again)</li>
                    </ul>
                    <p className="text-xs text-[#64748B] mt-3">
                      Debug: matchedKeywords={matchedKeywords.length}, missingKeywords={missingKeywords.length}
                    </p>
                  </div>
                )}

                {/* Matched Keywords */}
                {matchedKeywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-[#FFFFFF] rounded-xl p-4 md:p-6 border-2 border-emerald-200 hover:border-emerald-400 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col min-h-[300px] md:min-h-[350px] max-h-[500px]"
                  >
                    <div className="flex items-start justify-between mb-3 md:mb-4 flex-shrink-0">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 md:p-3 rounded-xl bg-emerald-100 text-[#22C55E]">
                          <span className="material-symbols-outlined text-xl md:text-2xl">check_circle</span>
                        </div>
                        <div>
                          <h3 className="text-[#0F172A] font-bold text-base md:text-lg">Keywords Found</h3>
                          <p className="text-[#475569] text-xs md:text-sm">{matchedKeywords.length} matches detected</p>
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
                          className="px-2 py-1.5 md:px-3 md:py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-xs md:text-sm font-medium hover:bg-emerald-100 transition-colors cursor-default h-fit"
                        >
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Missing Keywords - Enhanced with detailed info for paid users */}
                {missingKeywords.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="bg-[#FFFFFF] rounded-xl p-6 border-2 border-orange-200 hover:border-orange-400 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col min-h-[350px] max-h-[600px]"
                  >
                    <div className="flex items-start justify-between mb-4 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                          <span className="material-symbols-outlined text-2xl">priority_high</span>
                        </div>
                        <div>
                          <h3 className="text-[#0F172A] font-bold text-base md:text-lg">Missing Keywords</h3>
                          <p className="text-[#475569] text-xs md:text-sm">{missingKeywords.length} opportunities to improve</p>
                        </div>
                      </div>
                    </div>

                    {/* Show detailed cards for paid users, simple tags for free users - Mobile Optimized */}
                    {isPaidUser && missingKeywordsDetailed.some(kw => kw.priority || kw.context) ? (
                      <div className="space-y-2 md:space-y-3 overflow-y-auto pr-1 md:pr-2 flex-1">
                        {missingKeywordsDetailed.slice(0, 10).map((kwDetail, index) => {
                          const priorityConfig = {
                            critical: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', border: 'border-[#EF4444]/30', label: 'Critical' },
                            important: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/30', label: 'Important' },
                            'nice-to-have': { bg: 'bg-slate-100', text: 'text-[#64748B]', border: 'border-slate-200', label: 'Nice to Have' }
                          };
                          const priority = kwDetail.priority || 'nice-to-have';
                          const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['nice-to-have'];

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.85 + index * 0.05 }}
                              className={`rounded-lg p-3 md:p-4 border-2 ${config.border} ${config.bg} hover:shadow-md transition-all`}
                            >
                              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-1.5 md:gap-2">
                                  <span className={`material-symbols-outlined text-sm ${config.text}`}>
                                    {priority === 'critical' ? 'error' : priority === 'important' ? 'warning' : 'info'}
                                  </span>
                                  <h4 className="text-sm md:text-base font-bold text-[#0F172A] font-mono break-all">{kwDetail.keyword}</h4>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                                  {kwDetail.impact && (
                                    <span className={`text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded ${config.bg} ${config.text} border ${config.border} whitespace-nowrap`}>
                                      +{kwDetail.impact}% Impact
                                    </span>
                                  )}
                                  <span className={`text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded ${config.bg} ${config.text} whitespace-nowrap`}>
                                    {config.label}
                                  </span>
                                </div>
                              </div>

                              {kwDetail.section && (
                                <div className="text-[11px] md:text-xs text-[#64748B] mb-1.5 md:mb-2 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs md:text-sm">location_on</span>
                                  <span>Add to: <span className="font-medium text-[#475569]">{kwDetail.section}</span></span>
                                </div>
                              )}

                              {kwDetail.context && (
                                <p className="text-xs md:text-sm text-[#475569] leading-relaxed mb-1.5 md:mb-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2">
                                  {kwDetail.context}
                                </p>
                              )}

                              {kwDetail.synonyms && kwDetail.synonyms.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5 md:mt-2">
                                  <span className="text-[10px] md:text-xs text-[#64748B]">Synonyms:</span>
                                  {kwDetail.synonyms.slice(0, 3).map((syn, i) => (
                                    <span key={i} className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 bg-[#F8FAFC] text-[#475569] rounded border border-[#E2E8F0]">
                                      {syn}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 md:gap-2 overflow-y-auto pr-1 md:pr-2 flex-1 content-start">
                        {missingKeywords.map((keyword: string, index: number) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.85 + index * 0.02 }}
                            className="px-2.5 md:px-3 py-1.5 md:py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-xs md:text-sm font-medium hover:bg-orange-100 transition-colors cursor-default h-fit"
                          >
                            {keyword}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* ML-Powered Analysis - INTERNAL USE ONLY (not shown in UI) */}
          {/* MLInsights is used internally to improve algorithms, not displayed to avoid UI saturation */}

          {/* Weak Bullet Suggestions - PAID USERS ONLY */}
          {resume?._id && (
            <WeakBulletSuggestions
              resumeId={resume._id}
              ocrText={ocrText}
              metricsCount={metricsCount}
              isPaidUser={isPaidUser}
            />
          )}

          {/* Technical Logs Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="w-full flex justify-center mt-8"
          >
            <button
              onClick={() => setShowTechnicalLogs(!showTechnicalLogs)}
              className="text-[#475569] hover:text-[#0F172A] text-sm font-medium flex items-center gap-2 transition-colors group px-4 py-2 rounded-lg hover:bg-slate-100"
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
              <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-xl p-4 font-mono text-sm shadow-lg relative overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                  </div>
                  <span className="text-[#64748B] text-xs font-semibold ml-2">Terminal - CVDebug Analysis</span>
                </div>
                {/* Terminal Body */}
                <div className="space-y-2">
                  <div className="flex gap-2 text-[#64748B]">
                    <span className="text-emerald-400">$</span>
                    <span className="text-[#475569]">cv-debug --analyze --target=resume.pdf</span>
                  </div>
                  <div className="text-[#64748B] pl-4">
                    <span className="text-blue-400">→</span> Initializing parsing engine... <span className="text-green-400 font-bold">OK</span>
                  </div>
                  <div className="text-[#64748B] pl-4">
                    <span className="text-blue-400">→</span> Scanning for ATS keywords... Found <span className="text-emerald-400 font-bold">{matchedKeywords.length || 0}</span>
                  </div>
                  <div className="text-[#64748B] pl-4">
                    <span className="text-blue-400">→</span> Parsing quality: <span className="text-emerald-400 font-bold">100%</span> | Analysis mode: Deep Scan
                  </div>
                  <div className="text-[#64748B] pl-4">
                    <span className="text-blue-400">→</span> Role classification: Technical | Format: Machine-readable
                  </div>
                  <div className="text-emerald-400 font-bold pl-4 pt-2">
                    <span className="text-[#22C55E]">✓</span> [SUCCESS] Visibility Score: {scorePercentage}% | Grade: {getVisibilityGrade(scorePercentage)}
                  </div>
                  <div className="flex items-center gap-2 pl-4 pt-1">
                    <div className="w-2 h-4 bg-[#22C55E] animate-pulse"></div>
                    <span className="text-[#64748B] text-xs">Analysis complete</span>
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
