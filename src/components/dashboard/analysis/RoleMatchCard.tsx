import { Progress } from "@/components/ui/progress";
import { Briefcase, CheckCircle2 } from "lucide-react";

interface RoleMatchCardProps {
  role: string;
  matchScore: number;
  confidence: number;
}

export function RoleMatchCard({ role, matchScore, confidence }: RoleMatchCardProps) {
  return (
    <div className="glass-panel p-6 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF]/50 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-lg bg-[#3B82F6]/10 text-[#94A3B8] flex-shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-medium text-[#64748B] mb-1">Target Role</h3>
            <p className="text-base font-bold text-[#0F172A] break-words">{role || "General Professional"}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-3xl font-bold text-[#94A3B8] block leading-none">{matchScore}%</span>
          <p className="text-xs text-[#64748B] mt-1">Match</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#64748B]">Role Alignment</span>
            <span className="text-[#0F172A]">{matchScore}%</span>
          </div>
          <Progress value={matchScore} className="h-2 bg-[#F8FAFC]" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#64748B]">Confidence</span>
            <span className="text-[#0F172A]">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2 bg-[#F8FAFC]" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-2 text-xs text-[#64748B]">
        <CheckCircle2 className="h-3 w-3 text-[#22C55E]" />
        <span>Based on industry standards for {role}</span>
      </div>
    </div>
  );
}