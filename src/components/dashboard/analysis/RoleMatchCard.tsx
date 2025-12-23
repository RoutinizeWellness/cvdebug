import { Progress } from "@/components/ui/progress";
import { Briefcase, CheckCircle2 } from "lucide-react";

interface RoleMatchCardProps {
  role: string;
  matchScore: number;
  confidence: number;
}

export function RoleMatchCard({ role, matchScore, confidence }: RoleMatchCardProps) {
  return (
    <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-slate-900/50 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 flex-shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-medium text-slate-400 mb-1">Target Role</h3>
            <p className="text-base font-bold text-white break-words">{role || "General Professional"}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-3xl font-bold text-blue-400 block leading-none">{matchScore}%</span>
          <p className="text-xs text-slate-500 mt-1">Match</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Role Alignment</span>
            <span className="text-white">{matchScore}%</span>
          </div>
          <Progress value={matchScore} className="h-2 bg-slate-800" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Confidence</span>
            <span className="text-white">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2 bg-slate-800" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <CheckCircle2 className="h-3 w-3 text-green-500" />
        <span>Based on industry standards for {role}</span>
      </div>
    </div>
  );
}