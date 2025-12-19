import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ImpactScoreProps {
  score: number;
  maxScore: number;
}

export function ImpactScore({ score, maxScore }: ImpactScoreProps) {
  const percentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white">
          <TrendingUp className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-stone-900 dark:text-white">Impact Score</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-stone-900 dark:text-white"
          >
            {score}
          </motion.span>
          <span className="text-2xl font-medium text-stone-500 dark:text-stone-400 mb-1">
            / {maxScore}
          </span>
        </div>

        <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
          />
        </div>

        <p className="text-sm text-stone-600 dark:text-stone-400">
          {percentage >= 80
            ? "Excellent! Your resume has strong impact statements."
            : percentage >= 60
            ? "Good progress. Add more quantifiable achievements."
            : "Focus on adding metrics and measurable results to your bullets."}
        </p>
      </div>
    </div>
  );
}
