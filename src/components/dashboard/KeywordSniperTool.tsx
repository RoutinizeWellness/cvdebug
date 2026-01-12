import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KeywordSniperToolProps {
  missingKeywords: Array<{
    keyword: string;
    priority: string;
    frequency?: number;
    impact?: number;
  }>;
  currentBullet: string;
  jobTitle?: string;
  company?: string;
  currentScore: number;
  onApplySuggestion: (newText: string) => void;
}

interface Suggestion {
  id: number;
  text: string;
  scoreIncrease: number;
  keywords: string[];
  hasMetrics: boolean;
}

export function KeywordSniperTool({
  missingKeywords,
  currentBullet,
  jobTitle = "Senior DevOps Engineer",
  company = "TechCorp",
  currentScore,
  onApplySuggestion
}: KeywordSniperToolProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(1);

  // Initialize optimization log with scan completion only
  const [optimizationLog, setOptimizationLog] = useState<Array<{
    timestamp: string;
    action: string;
    points: number;
    status: "active" | "completed";
  }>>([
    {
      timestamp: "Initial scan",
      action: "Resume analysis completed",
      points: 0,
      status: "completed"
    },
  ]);

  // Categorize keywords by priority
  const highImpactKeywords = useMemo(() =>
    missingKeywords.filter(kw => kw.priority === "high" || kw.priority === "critical").slice(0, 4),
    [missingKeywords]
  );

  const mediumImpactKeywords = useMemo(() =>
    missingKeywords.filter(kw => kw.priority === "medium" || kw.priority === "important").slice(0, 4),
    [missingKeywords]
  );

  // Generate AI suggestions dynamically based on real keywords
  const suggestions: Suggestion[] = useMemo(() => {
    const topKeywords = highImpactKeywords.slice(0, 2).map(kw => kw.keyword);

    // Fallback keywords if none available
    if (topKeywords.length === 0) {
      topKeywords.push("relevant technologies", "best practices");
    } else if (topKeywords.length === 1) {
      topKeywords.push("modern practices");
    }

    // Action verbs for variety
    const actionVerbs = ["Orchestrated", "Implemented", "Engineered", "Spearheaded", "Architected"];
    const verb1 = actionVerbs[0];
    const verb2 = actionVerbs[1];
    const verb3 = actionVerbs[2];

    // Calculate score increases based on keyword impact
    const baseImpact = highImpactKeywords.slice(0, 2).reduce((sum, kw) => sum + (kw.impact || 7), 0);
    const suggestion1Score = Math.min(Math.round(baseImpact * 1.2), 20);
    const suggestion2Score = Math.min(Math.round(baseImpact * 0.8), 15);
    const suggestion3Score = Math.min(Math.round(baseImpact * 1.0), 18);

    return [
      {
        id: 1,
        text: `${verb1} ${currentBullet.toLowerCase().includes('deploy') ? 'deployments' : 'solutions'} utilizing ${topKeywords[0]} and ${topKeywords[1]} to achieve 99.9% uptime and improve system reliability by 40%.`,
        scoreIncrease: suggestion1Score,
        keywords: topKeywords,
        hasMetrics: true
      },
      {
        id: 2,
        text: `${verb2} scalable architecture leveraging ${topKeywords[0]} and ${topKeywords[1]} for enhanced performance and maintainability.`,
        scoreIncrease: suggestion2Score,
        keywords: topKeywords,
        hasMetrics: false
      },
      {
        id: 3,
        text: `${verb3} production-grade systems using ${topKeywords[0]} and ${topKeywords[1]}, reducing deployment time by 60% and increasing team efficiency.`,
        scoreIncrease: suggestion3Score,
        keywords: topKeywords,
        hasMetrics: true
      }
    ];
  }, [highImpactKeywords, currentBullet]);

  const newScore = currentScore + (suggestions.find(s => s.id === selectedSuggestion)?.scoreIncrease || 0);
  const scorePercentage = Math.min(newScore, 100);

  // Helper to format relative time
  const getRelativeTime = () => {
    return "Just now";
  };

  const handleInjectKeyword = (keyword: string) => {
    // Calculate points based on keyword priority
    const keywordData = missingKeywords.find(kw => kw.keyword === keyword);
    const points = keywordData?.impact || (keywordData?.priority === "high" || keywordData?.priority === "critical" ? 8 : 5);

    setOptimizationLog(prev => [{
      timestamp: getRelativeTime(),
      action: `Injected "${keyword}" keyword`,
      points,
      status: "active"
    }, ...prev.map(log => ({ ...log, status: "completed" as const }))]);
  };

  const handleApplySuggestion = () => {
    const suggestion = suggestions.find(s => s.id === selectedSuggestion);
    if (suggestion) {
      // Add log entry for applying suggestion
      setOptimizationLog(prev => [{
        timestamp: getRelativeTime(),
        action: `Applied AI suggestion with ${suggestion.keywords.length} keywords`,
        points: suggestion.scoreIncrease,
        status: "active"
      }, ...prev.map(log => ({ ...log, status: "completed" as const }))]);

      onApplySuggestion(suggestion.text);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 w-full min-h-[400px] lg:min-h-[600px]">
      {/* Left Panel: Target Keywords */}
      <section className="lg:col-span-3 flex flex-col gap-4">
        <div className="glass-panel rounded-xl p-5 flex flex-col max-h-[800px]">
          <div className="mb-6">
            <h3 className="font-display font-bold text-lg text-white mb-1">Target Keywords</h3>
            <p className="text-xs text-slate-400">Missing signals detected in job description</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {/* High Impact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">bolt</span>
                High Impact
              </h4>
              <div className="space-y-3">
                {highImpactKeywords.map((kw, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-slate-800/40 border border-white/5 rounded-lg p-3 hover:border-primary/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm font-medium text-white group-hover:text-primary transition-colors">
                        {kw.keyword}
                      </span>
                      <Badge className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded border border-red-500/20 font-mono">
                        CRITICAL
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">Frequency: {kw.frequency || 12}x</span>
                      <button
                        onClick={() => handleInjectKeyword(kw.keyword)}
                        className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded border border-primary/20 flex items-center gap-1 transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">add_circle</span>
                        Inject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Medium Impact */}
            {mediumImpactKeywords.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  Medium Impact
                </h4>
                <div className="space-y-3">
                  {mediumImpactKeywords.map((kw, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (highImpactKeywords.length + i) * 0.1 }}
                      className="bg-slate-800/40 border border-white/5 rounded-lg p-3 hover:border-teal-400/50 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-sm font-medium text-white group-hover:text-teal-400 transition-colors">
                          {kw.keyword}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">Frequency: {kw.frequency || 5}x</span>
                        <button
                          onClick={() => handleInjectKeyword(kw.keyword)}
                          className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-1.5 rounded border border-white/5 flex items-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-[14px]">add_circle</span>
                          Inject
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Center Panel: The Lab */}
      <section className="lg:col-span-6 flex flex-col max-h-[800px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-white tracking-tight leading-none">The Lab</h1>
            <p className="text-slate-400 mt-2 font-light">Optimize your experience description</p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 bg-slate-800/50 rounded border border-white/5">
              Undo
            </button>
            <button className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 bg-slate-800/50 rounded border border-white/5">
              Redo
            </button>
          </div>
        </div>

        {/* Original Context */}
        <div className="glass-panel rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Current Bullet Point</span>
            <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded">
              {jobTitle} @ {company}
            </span>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed font-light border-l-2 border-slate-600 pl-4 py-1">
            {currentBullet}
          </p>
        </div>

        {/* AI Suggestions */}
        <div className="flex-1 glass-panel rounded-xl p-1 relative overflow-hidden flex flex-col">
          {/* Glowing border effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

          <div className="p-5 pb-0 flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-teal-400 animate-pulse">auto_awesome</span>
            <h3 className="font-display font-bold text-white">AI Optimization Suggestions</h3>
            <span className="ml-auto text-xs text-teal-400 border border-teal-400/30 bg-teal-400/10 px-2 py-1 rounded-full font-mono">
              Target: {highImpactKeywords.slice(0, 2).map(kw => kw.keyword).join(" + ")}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSuggestion(suggestion.id)}
                  className={`rounded-lg p-5 transition-all relative group cursor-pointer ${
                    selectedSuggestion === suggestion.id
                      ? "bg-slate-800/80 border-2 border-teal-500 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                      : "border border-white/5 bg-slate-800/30 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                      selectedSuggestion === suggestion.id
                        ? "border-teal-500 bg-teal-500"
                        : "border-slate-600 group-hover:border-slate-400"
                    }`}>
                      {selectedSuggestion === suggestion.id && (
                        <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
                      )}
                    </div>
                  </div>

                  <p className={`text-base leading-relaxed pr-8 transition-colors ${
                    selectedSuggestion === suggestion.id ? "text-white" : "text-slate-300 group-hover:text-white"
                  }`}>
                    {suggestion.text.split(new RegExp(`(${suggestion.keywords.join("|")})`)).map((part, i) =>
                      suggestion.keywords.includes(part) ? (
                        <span key={i} className="text-primary font-semibold bg-primary/10 px-1 rounded border border-primary/20">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>

                  <div className="mt-4 flex items-center gap-4 pt-4 border-t border-white/5">
                    <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      +{suggestion.scoreIncrease} Score
                    </span>
                    {suggestion.hasMetrics && (
                      <span className="text-xs font-mono text-slate-500">Measurable outcome added</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-5 border-t border-white/10 flex gap-4 bg-slate-900/40">
            <Button
              onClick={handleApplySuggestion}
              className="flex-1 bg-primary hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all"
            >
              <span className="material-symbols-outlined mr-2">check_circle</span>
              Apply Selected
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-colors"
            >
              Edit Manually
            </Button>
          </div>
        </div>
      </section>

      {/* Right Panel: Live Score Tracker */}
      <section className="lg:col-span-3">
        <div className="glass-panel rounded-xl p-6 max-h-[800px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-lg text-white">Live Score</h3>
            <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              {suggestions.find(s => s.id === selectedSuggestion)?.scoreIncrease || 0}%
            </div>
          </div>

          {/* Score Visualization */}
          <div className="flex flex-col items-center justify-center mb-10 relative">
            <div className="relative size-48">
              <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  className="text-slate-800"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                {/* Progress Circle */}
                <motion.circle
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (251.2 * scorePercentage) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-primary"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeLinecap="round"
                  strokeWidth="8"
                  style={{ filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))" }}
                ></motion.circle>
              </svg>
              <div className="absolute top-0 left-0 size-full flex flex-col items-center justify-center">
                <motion.span
                  key={scorePercentage}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-display font-bold text-white"
                  style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                >
                  {scorePercentage}
                </motion.span>
                <span className="text-sm text-slate-400 uppercase tracking-widest text-[10px] mt-1">Match Score</span>
              </div>
            </div>

            <div className="w-full mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Junior</span>
                <span>Senior</span>
                <span>Expert</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-900 via-primary to-blue-400"
                ></motion.div>
              </div>
            </div>
          </div>

          {/* Optimization Log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Optimization Log</h4>
            <div className="relative flex-1">
              {/* Connecting line for timeline */}
              <div className="absolute left-[7px] top-2 bottom-0 w-px bg-slate-700"></div>

              <div className="space-y-6 pl-6 overflow-y-auto h-full pr-2 pb-4 custom-scrollbar">
                {optimizationLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className={`absolute -left-[21px] top-1 size-4 rounded-full bg-slate-900 border-2 z-10 ${
                      log.status === "active" ? "border-primary" : "border-slate-600"
                    }`}></div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-mono ${log.status === "active" ? "text-slate-400" : "text-slate-500"}`}>
                        {log.timestamp}
                      </span>
                      <p className={`text-sm ${log.status === "active" ? "text-slate-200" : "text-slate-400"}`}>
                        {log.action}
                      </p>
                      {log.points > 0 && (
                        <span className={`text-xs font-mono ${log.status === "active" ? "text-green-400" : "text-green-400/70"}`}>
                          +{log.points} pts
                        </span>
                      )}
                      {log.points === 0 && (
                        <span className="text-xs text-slate-600 font-mono">Baseline set</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
