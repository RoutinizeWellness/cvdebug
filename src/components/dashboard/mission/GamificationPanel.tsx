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
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-primary/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interview Probability</h3>
            <p className="text-xs text-zinc-400">Your chances of getting called</p>
          </div>
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div className="text-5xl font-black text-white">
            {probabilityData?.score || 0}
            <span className="text-2xl text-primary">%</span>
          </div>
          <div className="flex items-center gap-1 text-green-500 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-bold">+12%</span>
          </div>
        </div>

        <Progress value={probabilityData?.score || 0} className="h-2 mb-4" />

        <div className="space-y-2">
          {probabilityData?.factors?.map((factor: any, idx: number) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-zinc-400">{factor.name}</span>
              <span className="text-white font-mono">
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
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-primary/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Achievements</h3>
            <p className="text-xs text-zinc-400">Your progress badges</p>
          </div>
        </div>

        {badges && badges.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge: any) => (
              <div
                key={badge.id}
                className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg hover:border-primary/50 transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  {badge.icon}
                </div>
                <p className="text-xs font-bold text-white mb-1">{badge.name}</p>
                <p className="text-[10px] text-zinc-500">
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">No badges yet</p>
            <p className="text-xs text-zinc-500 mt-1">Complete actions to earn achievements</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
          <p className="text-xs text-zinc-400 mb-2">Available Badges:</p>
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
