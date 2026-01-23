import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Award, Target, Briefcase, Code, Heart } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface PersonalizedRecommendationsProps {
  userId: string;
  resumeId?: Id<"resumes">;
}

export function PersonalizedRecommendations({ userId, resumeId }: PersonalizedRecommendationsProps) {
  const recommendations = useQuery(api.ai.userProfileLearning.getPersonalizedKeywords, {
    userId: userId as Id<"users">,
    currentResumeId: resumeId,
  });

  if (!recommendations || recommendations.recommendations.length === 0) {
    return null;
  }

  const { profile, recommendations: keywordRecs, reasoning } = recommendations;

  // Priority colors
  const getPriorityStyle = (priority: 'critical' | 'high' | 'medium') => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-700',
          icon: 'text-red-500',
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          badge: 'bg-orange-100 text-orange-700',
          icon: 'text-orange-500',
        };
      case 'medium':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-700',
          icon: 'text-blue-500',
        };
    }
  };

  // Category icons
  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('leadership')) return Award;
    if (categoryLower.includes('technical')) return Code;
    if (categoryLower.includes('methodology')) return Target;
    if (categoryLower.includes('competency')) return Heart;
    if (categoryLower.includes('growth')) return TrendingUp;
    return Briefcase;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl p-6 border-2 border-purple-200/50 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Personalized Keywords for You</h3>
            <p className="text-xs text-[#64748B]">{reasoning}</p>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="mb-5 p-4 bg-white/80 backdrop-blur rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
              {profile.industry}
            </div>
            <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
              {profile.seniority}
            </div>
            <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
              {profile.role}
            </div>
            {profile.trend === 'improving' && (
              <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Improving ({profile.avgScore} avg)
              </div>
            )}
          </div>

          {profile.topSkills && profile.topSkills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-[#64748B] font-medium mb-2">Your Top Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.topSkills.slice(0, 6).map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-[#F1F5F9] text-[#475569] rounded text-[10px] font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keywordRecs.map((rec: any, index: number) => {
            const style = getPriorityStyle(rec.priority);
            const Icon = getCategoryIcon(rec.category);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`${style.bg} ${style.border} border-2 rounded-xl p-4 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className={`h-4 w-4 ${style.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-bold ${style.text}`}>{rec.keyword}</h4>
                      <span className={`${style.badge} px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] mb-2 leading-relaxed">{rec.reason}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-[#64748B] font-medium bg-white/80 px-2 py-0.5 rounded">
                        {rec.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-5 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-200/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#0F172A] mb-0.5">
                Why these keywords?
              </p>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                These recommendations are tailored to your <strong>{profile.industry}</strong> background
                at the <strong>{profile.seniority}</strong> level. They're designed to help you stand out
                in your target roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
