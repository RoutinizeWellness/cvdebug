import { Progress } from "@/components/ui/progress";
import { Briefcase, CheckCircle2 } from "lucide-react";

interface RoleMatchCardProps {
  role: string;
  matchScore: number;
  confidence: number;
}

export function RoleMatchCard({ role, matchScore, confidence }: RoleMatchCardProps) {
  return (
    <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Target Role</h3>
            <p className="text-lg font-bold text-white">{role || "General Professional"}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-blue-400">{matchScore}%</span>
          <p className="text-xs text-slate-500">Match</p>
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