import { TrendingUp, Zap, Target } from "lucide-react";

interface ImpactScoreProps {
  score: number;
  quantifiedBullets: number;
  totalBullets: number;
}

export function ImpactScore({ score, quantifiedBullets, totalBullets }: ImpactScoreProps) {
  const quantificationRate = totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 0;

  return (
    <div className="glass-panel p-6 rounded-xl border border-slate-200 bg-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
          <TrendingUp className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Impact Score</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Quantification</p>
          <p className="text-xl font-bold text-slate-900">{quantificationRate}%</p>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Metrics Found</p>
          <p className="text-xl font-bold text-slate-900">{quantifiedBullets}/{totalBullets}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Zap className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
          <p>Recruiters prefer resumes with &gt;60% quantified bullet points.</p>
        </div>
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Target className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
          <p>Add numbers (%, $, #) to increase your impact score.</p>
        </div>
      </div>
    </div>
  );
}