import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const apiAny = api as any;

interface GamificationPanelProps {
  resumeId?: Id<"resumes">;
}

export function GamificationPanel({ resumeId }: GamificationPanelProps) {
  const badges = useQuery(apiAny.gamification.getUserBadges);
  const probabilityData = useQuery(apiAny.gamification.calculateProbabilityScore, 
    resumeId ? { resumeId } : "skip"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Probability Score */}
      <Card className="bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFC] border-[#E2E8F0] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Interview Probability</h3>
            <p className="text-xs text-[#64748B]">Your chances of getting called</p>
          </div>
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div className="text-5xl font-black text-[#0F172A]">
            {probabilityData?.score || 0}
            <span className="text-2xl text-primary">%</span>
          </div>
          <div className="flex items-center gap-1 text-[#22C55E] mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold">+12%</span>
          </div>
        </div>

        <Progress value={probabilityData?.score || 0} className="h-2 mb-4" />

        <div className="space-y-2">
          {probabilityData?.factors?.map((factor: any, idx: number) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-[#64748B]">{factor.name}</span>
              <span className="text-[#0F172A] font-mono">
                {factor.points}/{factor.max}
              </span>
            </div>
          ))}
        </div>

        {probabilityData?.nextMilestone && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-xs text-primary font-bold">
              🎯 Next Milestone: {probabilityData.nextMilestone}% - Keep optimizing!
            </p>
          </div>
        )}
      </Card>

      {/* Badges */}
      <Card className="bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFC] border-[#E2E8F0] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Trophy className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Achievements</h3>
            <p className="text-xs text-[#64748B]">Your progress badges</p>
          </div>
        </div>

        {badges && badges.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge: any) => (
              <div
                key={badge.id}
                className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg hover:border-primary/50 transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {badge.icon}
                </div>
                <p className="text-xs font-bold text-[#0F172A] mb-1">{badge.name}</p>
                <p className="text-[10px] text-[#64748B]">
                  {new Date(badge.earnedAt).toLocaleDateString('es-ES')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-[#E2E8F0] mx-auto mb-3" />
            <p className="text-sm text-[#64748B]">No badges yet</p>
            <p className="text-xs text-[#64748B] mt-1">Complete actions to earn achievements</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <p className="text-xs text-[#64748B] mb-2">Available Badges:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-[10px]">🎯 First Steps</Badge>
            <Badge variant="outline" className="text-[10px]">🚀 Ready for Google</Badge>
            <Badge variant="outline" className="text-[10px]">⭐ Top 5%</Badge>
            <Badge variant="outline" className="text-[10px]">💎 Perfect Match</Badge>
            <Badge variant="outline" className="text-[10px]">🏆 Sprint Master</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
