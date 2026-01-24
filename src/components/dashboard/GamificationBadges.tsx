import { motion } from "framer-motion";
import { Trophy, Target, Zap, Star, Award, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: string;
  unlocked: boolean;
  progress?: number; // 0-100
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface GamificationBadgesProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
}

const rarityColors = {
  common: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-700",
    glow: "shadow-gray-400/20",
  },
  rare: {
    bg: "bg-[#F1F5F9]",
    border: "border-[#475569]",
    text: "text-[#0F172A]",
    glow: "shadow-blue-400/30",
  },
  epic: {
    bg: "bg-[#F1F5F9]",
    border: "border-[#475569]",
    text: "text-[#1E293B]",
    glow: "shadow-slate-400/40",
  },
  legendary: {
    bg: "bg-gradient-to-br from-yellow-100 to-orange-100",
    border: "border-yellow-500",
    text: "text-yellow-800",
    glow: "shadow-yellow-400/50",
  },
};

export function GamificationBadges({ badges, onBadgeClick }: GamificationBadgesProps) {
  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-xl border-2 border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
            <Trophy className="h-6 w-6 text-[#F59E0B]" />
            Achievements
          </h3>
          <p className="text-sm text-[#64748B] mt-1">
            Unlock badges by improving your CV
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-[#64748B]">
            {unlockedCount}/{totalCount}
          </div>
          <div className="text-xs text-[#64748B] uppercase tracking-wider">
            {completionRate}% Complete
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completionRate}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-[#64748B] to-[#1E293B] rounded-full"
        />
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const colors = rarityColors[badge.rarity];

          return (
            <motion.button
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onBadgeClick?.(badge)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all group",
                badge.unlocked
                  ? `${colors.bg} ${colors.border} hover:scale-105 hover:${colors.glow}`
                  : "bg-gray-50 border-gray-200 opacity-60 hover:opacity-80",
                "hover:shadow-lg"
              )}
            >
              {/* Badge Icon */}
              <div className="relative mb-3">
                <div className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                  badge.unlocked ? colors.bg : "bg-gray-200"
                )}>
                  {badge.unlocked ? (
                    badge.icon
                  ) : (
                    <Lock className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                {badge.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-[#22C55E] rounded-full flex items-center justify-center border-2 border-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Badge Info */}
              <div className="text-center">
                <h4 className={cn(
                  "font-bold text-sm mb-1",
                  badge.unlocked ? colors.text : "text-gray-500"
                )}>
                  {badge.title}
                </h4>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {badge.description}
                </p>

                {/* Progress Bar for Locked Badges */}
                {!badge.unlocked && badge.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#64748B] rounded-full"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-gray-400 mt-1">
                      {badge.progress}%
                    </div>
                  </div>
                )}
              </div>

              {/* Rarity Badge */}
              <div className={cn(
                "absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wide",
                badge.unlocked ? colors.bg : "bg-gray-200",
                badge.unlocked ? colors.text : "text-gray-400"
              )}>
                {badge.rarity}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Hook to calculate badges based on resume data
export function useBadges(resume: any): Badge[] {
  if (!resume) return [];

  const score = resume.score || 0;
  const stats = resume.stats || {};
  const hasMetrics = stats.hasQuantifiableAchievements || false;
  const keywordCount = resume.matchingKeywords?.length || 0;
  const missingElements = resume.missingElements?.length || 0;

  const badges: Badge[] = [
    // COMMON Badges - Easy to unlock
    {
      id: "first-upload",
      title: "First Steps",
      description: "Upload your first CV",
      icon: <Target className="h-8 w-8 text-gray-600" />,
      requirement: "Upload any CV",
      unlocked: true, // Always unlocked if user has a resume
      rarity: "common",
    },
    {
      id: "50-score",
      title: "Half Way There",
      description: "Reach 50% ATS score",
      icon: <Zap className="h-8 w-8 text-[#1E293B]" />,
      requirement: "Score >= 50%",
      unlocked: score >= 50,
      progress: Math.min(100, (score / 50) * 100),
      rarity: "common",
    },

    // RARE Badges - Moderate effort
    {
      id: "metrics-master",
      title: "Metrics Master",
      description: "Add quantifiable achievements",
      icon: <Star className="h-8 w-8 text-[#1E293B]" />,
      requirement: "Include numbers, %, $",
      unlocked: hasMetrics,
      progress: hasMetrics ? 100 : 0,
      rarity: "rare",
    },
    {
      id: "70-score",
      title: "ATS Approved",
      description: "Reach 70% ATS score",
      icon: <CheckCircle2 className="h-8 w-8 text-[#1E293B]" />,
      requirement: "Score >= 70%",
      unlocked: score >= 70,
      progress: Math.min(100, (score / 70) * 100),
      rarity: "rare",
    },
    {
      id: "keyword-hunter",
      title: "Keyword Hunter",
      description: "Match 10+ job keywords",
      icon: <Target className="h-8 w-8 text-[#1E293B]" />,
      requirement: "10+ matching keywords",
      unlocked: keywordCount >= 10,
      progress: Math.min(100, (keywordCount / 10) * 100),
      rarity: "rare",
    },

    // EPIC Badges - Significant achievement
    {
      id: "90-score",
      title: "Elite Candidate",
      description: "Reach 90% ATS score",
      icon: <Award className="h-8 w-8 text-[#1E293B]" />,
      requirement: "Score >= 90%",
      unlocked: score >= 90,
      progress: Math.min(100, (score / 90) * 100),
      rarity: "epic",
    },
    {
      id: "perfect-structure",
      title: "Perfect Structure",
      description: "No missing sections",
      icon: <CheckCircle2 className="h-8 w-8 text-[#1E293B]" />,
      requirement: "All sections present",
      unlocked: missingElements === 0,
      progress: missingElements === 0 ? 100 : 50,
      rarity: "epic",
    },

    // LEGENDARY Badge - Ultimate achievement
    {
      id: "perfect-score",
      title: "The Unicorn",
      description: "Achieve 95%+ ATS score",
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      requirement: "Score >= 95%",
      unlocked: score >= 95,
      progress: Math.min(100, (score / 95) * 100),
      rarity: "legendary",
    },
  ];

  return badges;
}
