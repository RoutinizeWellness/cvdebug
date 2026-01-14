import { TrendingUp, Zap, Target } from "lucide-react";

interface ImpactScoreProps {
  score: number;
  quantifiedBullets: number;
  totalBullets: number;
}

export function ImpactScore({ score, quantifiedBullets, totalBullets }: ImpactScoreProps) {
  const quantificationRate = totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 0;

  return (
    <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-teal-500/10">
          <TrendingUp className="h-5 w-5 text-teal-600" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A]">Impact Score</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <p className="text-xs text-[#64748B] mb-1">Quantification</p>
          <p className="text-xl font-bold text-[#0F172A]">{quantificationRate}%</p>
        </div>
        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          <p className="text-xs text-[#64748B] mb-1">Metrics Found</p>
          <p className="text-xl font-bold text-[#0F172A]">{quantifiedBullets}/{totalBullets}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-[#475569]">
          <Zap className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
          <p>Recruiters prefer resumes with &gt;60% quantified bullet points.</p>
        </div>
        <div className="flex items-start gap-2 text-sm text-[#475569]">
          <Target className="h-4 w-4 text-[#3B82F6] mt-0.5 shrink-0" />
          <p>Add numbers (%, $, #) to increase your impact score.</p>
        </div>
      </div>
    </div>
  );
}
