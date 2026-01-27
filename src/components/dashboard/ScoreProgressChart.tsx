import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreHistory {
  version: number;
  score: number;
  timestamp: number;
  changes: string[];
}

interface ScoreProgressChartProps {
  history: ScoreHistory[];
  currentScore: number;
}

export function ScoreProgressChart({ history, currentScore }: ScoreProgressChartProps) {
  // If no history, create initial entry
  const scoreHistory = history.length > 0 ? history : [
    { version: 1, score: currentScore, timestamp: Date.now(), changes: ["Initial scan"] }
  ];

  const maxScore = Math.max(...scoreHistory.map(h => h.score), 100);
  const minScore = Math.min(...scoreHistory.map(h => h.score), 0);
  const scoreRange = maxScore - minScore;

  // Calculate position for each point (0-100% on the chart)
  const getYPosition = (score: number) => {
    if (scoreRange === 0) return 50; // Center if no range
    return 100 - ((score - minScore) / scoreRange) * 100;
  };

  // Calculate trend
  const firstScore = scoreHistory[0].score;
  const lastScore = scoreHistory[scoreHistory.length - 1].score;
  const improvement = lastScore - firstScore;
  const improvementPercent = firstScore > 0 ? Math.round((improvement / firstScore) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border-2 border-[#E2E8F0] dark:border-slate-700 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-1">Score Progress</h3>
          <p className="text-sm text-[#64748B] dark:text-slate-400">
            {scoreHistory.length} iteration{scoreHistory.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Trend Indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          improvement > 0
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
            : improvement < 0
            ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
            : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'
        }`}>
          {improvement > 0 ? (
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : improvement < 0 ? (
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          ) : (
            <Minus className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          )}
          <div>
            <div className={`text-2xl font-black ${
              improvement > 0
                ? 'text-green-600 dark:text-green-400'
                : improvement < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {improvement > 0 ? '+' : ''}{improvement}%
            </div>
            {improvementPercent !== 0 && (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {improvementPercent > 0 ? '+' : ''}{improvementPercent}% change
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-[#64748B] dark:text-slate-400 font-mono">
          <span>{maxScore}%</span>
          <span>{Math.round((maxScore + minScore) / 2)}%</span>
          <span>{minScore}%</span>
        </div>

        {/* Chart area */}
        <div className="ml-14 h-full relative bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-700 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map((percent) => (
              <div
                key={percent}
                className="absolute w-full border-t border-dashed border-slate-200 dark:border-slate-700"
                style={{ top: `${percent}%` }}
              />
            ))}
          </div>

          {/* SVG for line chart */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Area under the line (gradient fill) */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#64748B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {scoreHistory.length > 1 && (
              <>
                {/* Fill area */}
                <path
                  d={`M 0,100 ${scoreHistory.map((item, idx) => {
                    const x = (idx / (scoreHistory.length - 1)) * 100;
                    const y = getYPosition(item.score);
                    return `L ${x},${y}`;
                  }).join(' ')} L 100,100 Z`}
                  fill="url(#scoreGradient)"
                />

                {/* Line */}
                <path
                  d={scoreHistory.map((item, idx) => {
                    const x = (idx / (scoreHistory.length - 1)) * 100;
                    const y = getYPosition(item.score);
                    return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#64748B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>

          {/* Data points */}
          {scoreHistory.map((item, idx) => {
            const x = scoreHistory.length === 1
              ? 50
              : (idx / (scoreHistory.length - 1)) * 100;
            const y = getYPosition(item.score);
            const isLast = idx === scoreHistory.length - 1;

            return (
              <motion.div
                key={idx}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="absolute group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Point */}
                <div className={`w-4 h-4 rounded-full border-3 ${
                  isLast
                    ? 'bg-[#64748B] border-white dark:border-slate-900 ring-4 ring-[#64748B]/30'
                    : 'bg-white dark:bg-slate-800 border-[#64748B]'
                } cursor-pointer hover:scale-150 transition-transform shadow-lg`}></div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-[#0F172A] dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                    <div className="font-bold mb-1">Version {item.version}: {item.score}%</div>
                    {item.changes.map((change, i) => (
                      <div key={i} className="text-slate-300 dark:text-slate-400">• {change}</div>
                    ))}
                    <div className="text-slate-400 dark:text-slate-500 text-[10px] mt-1">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-[#0F172A] dark:bg-slate-700 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0F172A]/20 dark:to-[#0F172A]/20 rounded-lg p-4 border border-[#E2E8F0] dark:border-[#0F172A]">
          <div className="text-xs text-[#1E293B] dark:text-[#94A3B8] font-semibold mb-1">BEST SCORE</div>
          <div className="text-2xl font-black text-[#0F172A] dark:text-[#CBD5E1]">{maxScore}%</div>
        </div>

        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] dark:from-[#0F172A]/20 dark:to-[#0F172A]/20 rounded-lg p-4 border border-[#E2E8F0] dark:border-[#0F172A]">
          <div className="text-xs text-[#1E293B] dark:text-[#94A3B8] font-semibold mb-1">CURRENT</div>
          <div className="text-2xl font-black text-[#1E293B] dark:text-[#CBD5E1]">{lastScore}%</div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">ITERATIONS</div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{scoreHistory.length}</div>
        </div>
      </div>

      {/* Motivational message */}
      {improvement > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg"
        >
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            🎉 Great progress! You've improved by {improvement} points. Keep iterating to reach 90%+
          </p>
        </motion.div>
      )}
    </div>
  );
}
