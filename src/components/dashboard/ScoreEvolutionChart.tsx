import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Trophy, Target, Zap } from "lucide-react";
import { api } from "@/convex/_generated/api";

const apiAny = api as any;

export function ScoreEvolutionChart() {
  const resumes = useQuery(apiAny.resumes.getResumes, {});

  if (!resumes || resumes.length === 0) {
    return (
      <div className="glass-panel p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">No Score History Yet</h3>
          <p className="text-sm text-[#64748B] max-w-md">
            Upload and scan your resume to start tracking your progress. Watch your score improve over time!
          </p>
        </div>
      </div>
    );
  }

  // Get all resumes with scores and sort by creation time
  const scoredResumes = resumes
    .filter((r: any) => r.score !== undefined && r.score > 0)
    .sort((a: any, b: any) => a._creationTime - b._creationTime);

  if (scoredResumes.length === 0) {
    return null;
  }

  // Calculate statistics
  const scores = scoredResumes.map((r: any) => r.score || 0);
  const latestScore = scores[scores.length - 1];
  const firstScore = scores[0];
  const improvement = latestScore - firstScore;
  const maxScore = Math.max(...scores);
  const avgScore = Math.round(scores.reduce((a: any, b: any) => a + b, 0) / scores.length);

  // Calculate trend (positive if improving)
  const recentScores = scores.slice(-3);
  const isImproving = recentScores.length >= 2 &&
    recentScores[recentScores.length - 1] > recentScores[0];

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Score Evolution
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Track your progress over {scoredResumes.length} versions
          </p>
        </div>

        {/* Current Score Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`relative px-6 py-3 rounded-xl ${
            latestScore >= 90
              ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30"
              : latestScore >= 70
              ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-[#3B82F6]/30"
              : "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/30"
          }`}
        >
          <p className="text-xs font-semibold text-[#475569] text-center">Current Score</p>
          <p className={`text-3xl font-black text-center ${
            latestScore >= 90 ? "text-green-400"
            : latestScore >= 70 ? "text-blue-400"
            : "text-orange-400"
          }`}>
            {latestScore}
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-2">
            {improvement >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Improvement
            </p>
          </div>
          <p className={`text-2xl font-bold ${improvement >= 0 ? "text-green-400" : "text-red-400"}`}>
            {improvement >= 0 ? "+" : ""}{improvement}
          </p>
          <p className="text-xs text-[#64748B] mt-1">points</p>
        </div>

        <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Peak Score
            </p>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{maxScore}</p>
          <p className="text-xs text-[#64748B] mt-1">highest</p>
        </div>

        <div className="bg-[#1e293b]/50 rounded-lg p-4 border border-[#E2E8F0]">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-blue-400" />
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Average
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{avgScore}</p>
          <p className="text-xs text-[#64748B] mt-1">mean score</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-2">
          {[100, 75, 50, 25, 0].map((value) => (
            <div key={value} className="flex items-center">
              <span className="text-xs text-[#475569] w-8">{value}</span>
              <div className="flex-1 h-px bg-[#F8FAFC]/50" />
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="relative h-64 flex items-end gap-2 pl-10 pr-2 pt-2">
          {scoredResumes.map((resume: any, i: number) => {
            const score = resume.score || 0;
            const isLatest = i === scoredResumes.length - 1;
            const height = `${score}%`;

            return (
              <motion.div
                key={resume._id}
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="flex-1 group relative flex flex-col"
              >
                {/* Bar */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 relative overflow-hidden ${
                    isLatest
                      ? "bg-gradient-to-t from-primary to-secondary shadow-lg shadow-primary/50"
                      : "bg-gradient-to-t from-slate-700 to-slate-600 group-hover:from-primary/60 group-hover:to-secondary/60"
                  }`}
                  style={{ height: "100%" }}
                >
                  {/* Shine effect on latest */}
                  {isLatest && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#F8FAFC] border border-primary/30 rounded-lg px-3 py-2 whitespace-nowrap z-10 pointer-events-none">
                  <p className="text-xs font-semibold text-[#0F172A]">Version {i + 1}</p>
                  <p className="text-lg font-bold text-primary">{score}</p>
                  <p className="text-xs text-[#64748B]">
                    {new Date(resume._creationTime).toLocaleDateString('es-ES')}
                  </p>
                  {/* Arrow */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/30" />
                  </div>
                </div>

                {/* Label */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="text-xs font-semibold text-[#64748B]">
                    {isLatest ? "Latest" : `v${i + 1}`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom padding for labels */}
        <div className="h-8" />
      </div>

      {/* Trend Message */}
      <div className={`mt-6 p-4 rounded-lg border-2 ${
        isImproving
          ? "bg-[#22C55E]/10 border-green-500/30"
          : "bg-[#3B82F6]/10 border-[#3B82F6]/30"
      }`}>
        <div className="flex items-center gap-3">
          {isImproving ? (
            <TrendingUp className="h-5 w-5 text-green-400" />
          ) : (
            <Target className="h-5 w-5 text-blue-400" />
          )}
          <div>
            <p className={`font-semibold ${isImproving ? "text-green-400" : "text-blue-400"}`}>
              {isImproving
                ? "🎉 You're on a roll! Keep optimizing!"
                : "Keep pushing! Your next scan could be your best yet."}
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              {scoredResumes.length} scans completed • {improvement >= 0 ? `+${improvement}` : improvement} points total improvement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
