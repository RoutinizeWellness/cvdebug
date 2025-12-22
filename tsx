// src/components/dashboard/mission/MissionStats.tsx
import { AlertTriangle, ShieldCheck, CheckCircle2, Copy, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function MissionStats({
  avgScore,
  interviewProb,
  detectedATS,
  jobsAnalyzed,
  keywordsMatched,
}: {
  avgScore: number;
  interviewProb: number;
  detectedATS: string;
  jobsAnalyzed: number;
  keywordsMatched: number;
}) {
  return (
    <div className="space-y-4">
      {/* SpeedMatch Score & Optimization */}
      <div className="bg-gradient-to-r from-green-500/10 to-primary/10 border border-green-500/30 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/20">
              <span className="material-symbols-outlined text-green-500">target</span>
            </div>
            <h3 className="text-lg font-bold text-white">SpeedMatch Score</h3>
          </div>
          <div className={`text-2xl font-black ${
            avgScore >= 80 ? 'text-[#00FF41]' : avgScore >= 50 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {avgScore}%
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-zinc-300">
            <p className="font-bold uppercase tracking-wider">{getProbLabel(interviewProb)} Probability</p>
            <span className="text-xs text-zinc-500">({interviewProb}%)</span>
          </div>
          <span className="material-symbols-outlined text-green-500 text-lg">trending_up</span>
        </div>

        <div className="text-xs text-zinc-400 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
          <span className="font-bold text-white">Optimization:</span> Your CV ranks in the top {avgScore >= 80 ? '15%' : avgScore >= 50 ? '30%' : '50%'} for this role.
        </div>
      </div>

      {/* ATS Detection Badge (kept from original for now, placement might be adjusted in MissionControl) */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Target ATS Detected</p>
            <p className="text-xs text-zinc-400">Optimizing parsing for this system</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 font-bold">
            {detectedATS}
          </Badge>
        </div>
      </div>
    </div>
  );
}