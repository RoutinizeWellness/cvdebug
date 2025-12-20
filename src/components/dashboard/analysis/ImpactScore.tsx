import { TrendingUp } from "lucide-react";

interface ImpactScoreProps {
  score: number;
  maxScore: number;
}

export function ImpactScore({ score, maxScore }: ImpactScoreProps) {
  const getScoreColor = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 50) return "text-primary";
    return "text-orange-400";
  };

  const getIconColor = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 50) return "text-primary";
    return "text-orange-400";
  };

  const getMessage = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "Excellent! Strong quantifiable achievements.";
    if (percentage >= 50) return "Good progress. Add more metrics to improve.";
    return "Add quantifiable metrics to strengthen impact.";
  };

  return (
    <div className="glass-card rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4">
      <div className={`p-3 rounded-full ${getIconColor()}`} style={{ backgroundColor: 'rgba(39, 39, 42, 1)' }}>
        <TrendingUp className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>Impact Score</h3>
      <div className="text-6xl font-black">
        <span className={getScoreColor()}>{score}</span>
        <span className="text-3xl font-normal" style={{ color: '#ffffff' }}>/{maxScore}</span>
      </div>
      <p className="text-sm max-w-[220px] leading-relaxed" style={{ color: '#ffffff' }}>
        {getMessage()}
      </p>
    </div>
  );
}