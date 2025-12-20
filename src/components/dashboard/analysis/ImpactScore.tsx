import { TrendingUp } from "lucide-react";

interface ImpactScoreProps {
  score: number;
  maxScore: number;
}

export function ImpactScore({ score, maxScore }: ImpactScoreProps) {
  return (
    <div className="glass-card rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2">
      <TrendingUp className="h-10 w-10 text-stone-400" />
      <h3 className="text-lg font-medium text-stone-500 dark:text-stone-400">Impact Score</h3>
      <div className="text-5xl font-black text-stone-900 dark:text-white">
        {score}
        <span className="text-2xl text-stone-400 font-normal">/{maxScore}</span>
      </div>
      <p className="text-xs text-stone-500 max-w-[200px]">
        {score >= 8
          ? "Excellent! Strong quantifiable achievements."
          : score >= 5
          ? "Good progress. Add more metrics."
          : "Your resume describes duties, not achievements."}
      </p>
    </div>
  );
}