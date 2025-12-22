import { TrendingUp } from "lucide-react";

interface ScoreGaugeProps {
  score: number;
  critique?: string;
}

export function ScoreGauge({ score, critique }: ScoreGaugeProps) {
  const normalizedScore = Math.min(score / 10, 10);
  const percentage = (normalizedScore / 10) * 100;
  const scoreColor = score >= 80 ? '#3B82F6' : score >= 60 ? '#eab308' : '#ef4444';
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 relative overflow-hidden group shadow-lg shadow-black/20">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="h-24 w-24 text-primary" />
      </div>
      
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-primary" />
          Recruiter Visibility
        </h3>
        <p className="text-slate-400 text-sm">Profile discoverability score</p>
      </div>

      <div className="flex items-center justify-center py-4">
        <div 
          className="relative size-40 rounded-full flex items-center justify-center"
          style={{ 
            background: `conic-gradient(${scoreColor} 0% ${percentage}%, #1e293b ${percentage}% 100%)`,
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)'
          }}
        >
          <div className="absolute inset-[10%] bg-slate-900 rounded-full flex flex-col items-center justify-center z-10 w-[80%] h-[80%] border border-slate-800">
            <span className="text-4xl font-black text-white tracking-tighter font-display">
              {(normalizedScore).toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
              out of 10
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
        <div>
          <p className="text-xs text-slate-400 mb-1">Industry Rank</p>
          <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Top {Math.max(5, Math.round((100 - score) / 5))}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 mb-1">Profile Views</p>
          <p className="text-sm font-bold text-white">+124 this week</p>
        </div>
      </div>
    </div>
  );
}