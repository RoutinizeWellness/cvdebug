import { motion } from "framer-motion";
import { TrendingUp, Trophy, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SprintProgressWidgetProps {
  currentScore: number;
  previousScore?: number;
  targetScore?: number;
}

export function SprintProgressWidget({ 
  currentScore, 
  previousScore, 
  targetScore = 85 
}: SprintProgressWidgetProps) {
  // Calculate percentile based on score (simplified model)
  const calculatePercentile = (score: number) => {
    if (score >= 85) return 95;
    if (score >= 75) return 85;
    if (score >= 65) return 70;
    if (score >= 55) return 50;
    if (score >= 45) return 30;
    return 15;
  };

  const percentile = calculatePercentile(currentScore);
  const improvement = previousScore ? currentScore - previousScore : 0;
  const progressToTarget = Math.min(100, (currentScore / targetScore) * 100);

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/10 via-slate-900 to-slate-900 border-primary/20">
      <div className="space-y-4">
        {/* Percentile Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-slate-400">Your Ranking</p>
              <p className="text-2xl font-bold text-white">
                Top {100 - percentile}%
              </p>
            </div>
          </div>
          {improvement > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+{improvement}</span>
            </div>
          )}
        </motion.div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Progress to Elite ({targetScore}%)</span>
            <span className="text-primary font-bold">{Math.round(progressToTarget)}%</span>
          </div>
          <Progress value={progressToTarget} className="h-2" />
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-lg bg-slate-800/50 border border-slate-700"
        >
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-white">
                {currentScore >= 85 
                  ? "🎯 Elite Status! You're ahead of 95% of candidates."
                  : currentScore >= 75
                  ? "💪 Strong! Keep optimizing to reach Elite (85%)."
                  : currentScore >= 65
                  ? "📈 Good progress! Focus on missing keywords to boost your score."
                  : "🚀 Great start! Address critical issues to jump ahead."}
              </p>
              {currentScore < targetScore && (
                <p className="text-[10px] text-slate-400 mt-1">
                  {targetScore - currentScore} points to Elite tier
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Competitive Context */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded bg-slate-800/30">
            <p className="text-[10px] text-slate-500 uppercase">Avg</p>
            <p className="text-sm font-bold text-slate-400">62%</p>
          </div>
          <div className="p-2 rounded bg-slate-800/30">
            <p className="text-[10px] text-slate-500 uppercase">You</p>
            <p className="text-sm font-bold text-primary">{currentScore}%</p>
          </div>
          <div className="p-2 rounded bg-slate-800/30">
            <p className="text-[10px] text-slate-500 uppercase">Elite</p>
            <p className="text-sm font-bold text-emerald-400">{targetScore}%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
