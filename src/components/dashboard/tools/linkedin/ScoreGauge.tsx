import { AlertCircle, TrendingUp } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  critique?: string;
}

export function ScoreGauge({ score, critique }: ScoreGaugeProps) {
  const scoreColor = score >= 80 ? '#7c3bed' : score >= 60 ? '#eab308' : '#ef4444';
  const scoreLabel = score >= 80 ? 'Great' : score >= 60 ? 'Good' : 'Poor';
  
  return (
    <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="h-24 w-24" />
      </div>
      <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-6">
        Recruiter Visibility Score
      </h3>
      <div className="flex items-center gap-6">
        {/* Circular Gauge */}
        <div 
          className="relative size-32 rounded-full flex items-center justify-center"
          style={{ background: `conic-gradient(${scoreColor} ${score}%, #27272a 0)` }}
        >
          <div className="absolute inset-[10px] bg-zinc-900 rounded-full flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{score}</span>
            <span className="text-[10px] text-zinc-400 uppercase font-bold">
              {scoreLabel}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-white font-medium leading-snug">
            {critique || "Your profile visibility analysis"}
          </p>
          {score < 80 && (
            <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
              <AlertCircle className="h-4 w-4" />
              <span>Invisible to {100 - score}% of recruiters</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
