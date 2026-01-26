import { motion } from "framer-motion";
import { GaugeScore } from "./analysis/GaugeScore";
import { ScoreProgressChart } from "./ScoreProgressChart";
import { ActionPlan } from "./ActionPlan";
import { TrendingUp, Target, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface OverviewTabProps {
  resume: any;
  user: any;
  isPaidUser: boolean;
  onUpgrade: () => void;
}

export function OverviewTab({ resume, user, isPaidUser, onUpgrade }: OverviewTabProps) {
  const currentScore = resume?.score || 0;
  const bestScore = resume?.bestScore || currentScore;

  // Calculate benchmark/percentile (simulated data - in production would come from DB)
  const calculatePercentile = (score: number) => {
    if (score >= 90) return { percentile: 95, message: "Top 5% of all resumes" };
    if (score >= 80) return { percentile: 85, message: "Top 15% of all resumes" };
    if (score >= 70) return { percentile: 70, message: "Top 30% of all resumes" };
    if (score >= 60) return { percentile: 50, message: "Above average" };
    if (score >= 50) return { percentile: 35, message: "Average range" };
    return { percentile: 20, message: "Below average - needs work" };
  };

  const benchmarkData = calculatePercentile(currentScore);

  // Calculate quick wins from available data
  const quickWins = [];

  if (resume?.formatIssues && resume.formatIssues.length > 0) {
    quickWins.push({
      title: "Fix Format Issues",
      description: `${resume.formatIssues.length} formatting problems detected`,
      impact: "high",
      icon: AlertCircle
    });
  }

  if (resume?.missingKeywords && resume.missingKeywords.length > 0) {
    quickWins.push({
      title: "Add Missing Keywords",
      description: `${resume.missingKeywords.length} important keywords missing`,
      impact: "high",
      icon: Target
    });
  }

  if (resume?.fluffPhrases && resume.fluffPhrases.length > 0) {
    quickWins.push({
      title: "Remove Weak Language",
      description: `${resume.fluffPhrases.length} weak phrases detected`,
      impact: "medium",
      icon: Zap
    });
  }

  // Limit to top 3 quick wins
  const topQuickWins = quickWins.slice(0, 3);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-black text-[#0F172A] mb-2">Resume Overview</h2>
          <p className="text-slate-600">Your complete ATS analysis and improvement roadmap</p>
        </motion.div>

        {/* Score Section - Large Gauge with Benchmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-[#E2E8F0] p-8 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Large Gauge with Benchmark */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative transform scale-150 mb-8">
                <GaugeScore score={currentScore} />
              </div>
              <div className="mt-6 text-center">
                <h3 className={`text-6xl font-black ${getScoreColor(currentScore)} mb-3`}>
                  {currentScore}%
                </h3>
                <p className="text-xl font-bold text-slate-700 mb-4">
                  {getScoreStatus(currentScore)}
                </p>

                {/* Benchmark Badge */}
                <div className="mt-6 px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <p className="text-sm font-bold text-purple-900 uppercase tracking-wider">
                      Percentile Ranking
                    </p>
                  </div>
                  <p className="text-3xl font-black text-purple-700 mb-1">
                    {benchmarkData.percentile}th
                  </p>
                  <p className="text-xs font-semibold text-purple-600 mt-1">
                    {benchmarkData.message}
                  </p>
                </div>

                {resume?.jobDescription && (
                  <div className="mt-4 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800 flex items-center gap-2 justify-center">
                      <Target className="h-4 w-4" />
                      Tailored for specific job
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Stats and Progress */}
            <div className="space-y-6">
              {/* Best Score */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Best Score</h4>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-4xl font-black text-green-600 mb-1">{bestScore}%</p>
                <p className="text-xs text-green-700">Your highest achievement</p>
              </div>

              {/* Iterations */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Iterations</h4>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-4xl font-black text-blue-600 mb-1">{resume?.iterations || 1}</p>
                <p className="text-xs text-blue-700">Times you've optimized this resume</p>
              </div>

              {/* Estimated Time to 90% */}
              {currentScore < 90 && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">To Reach 90%</h4>
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="text-4xl font-black text-amber-600 mb-1">+{90 - currentScore}</p>
                  <p className="text-xs text-amber-700">Points needed</p>
                </div>
              )}

              {/* Progress Chart */}
              {resume && resume.iterations > 1 && resume.scoreHistory && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Score History</h4>
                  <ScoreProgressChart
                    history={resume.scoreHistory || []}
                    currentScore={currentScore}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Wins Section */}
        {topQuickWins.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 shadow-lg"
          >
            <h3 className="text-2xl font-black text-[#0F172A] mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Top 3 Quick Wins
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topQuickWins.map((win, index) => {
                const Icon = win.icon;
                const impactColors = {
                  high: "border-red-200 bg-red-50 text-red-700",
                  medium: "border-yellow-200 bg-yellow-50 text-yellow-700",
                  low: "border-blue-200 bg-blue-50 text-blue-700"
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
                    className={`border-2 rounded-xl p-6 ${impactColors[win.impact as keyof typeof impactColors]}`}
                  >
                    <Icon className="h-8 w-8 mb-3" />
                    <h4 className="font-bold text-lg mb-2">{win.title}</h4>
                    <p className="text-sm opacity-80">{win.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 shadow-lg"
        >
          <h3 className="text-2xl font-black text-[#0F172A] mb-6">Action Plan</h3>
          <ActionPlan
            steps={resume.actionPlan || []}
            onStepClick={(stepId) => console.log('Step clicked:', stepId)}
            onCompleteStep={(stepId) => console.log('Step completed:', stepId)}
          />
        </motion.div>

      </div>
    </div>
  );
}
