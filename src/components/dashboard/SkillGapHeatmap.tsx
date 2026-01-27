import { Check, X, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SkillGapHeatmapProps {
  foundKeywords: string[];
  missingKeywords: any[];
}

export function SkillGapHeatmap({ foundKeywords, missingKeywords }: SkillGapHeatmapProps) {
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  // Categorize keywords into hard skills and soft skills
  const hardSkillPatterns = /python|java|react|node|docker|kubernetes|aws|sql|typescript|javascript|c\+\+|golang|rust|terraform|jenkins|git/i;
  const softSkillPatterns = /leadership|communication|teamwork|problem.solving|analytical|creative|adaptable|collaborative/i;

  const categorizeKeyword = (kw: string) => {
    if (hardSkillPatterns.test(kw)) return "hard";
    if (softSkillPatterns.test(kw)) return "soft";
    return "hard"; // Default to hard skill
  };

  const foundHardSkills = foundKeywords.filter(kw => categorizeKeyword(kw) === "hard");
  const foundSoftSkills = foundKeywords.filter(kw => categorizeKeyword(kw) === "soft");

  const missingHardSkills = missingKeywords.filter(kw => {
    const keyword = typeof kw === 'string' ? kw : kw.keyword;
    return categorizeKeyword(keyword) === "hard";
  }).slice(0, 5);

  const missingSoftSkills = missingKeywords.filter(kw => {
    const keyword = typeof kw === 'string' ? kw : kw.keyword;
    return categorizeKeyword(keyword) === "soft";
  }).slice(0, 3);

  const handleGenerateBulletPoint = async (keyword: string) => {
    setGeneratingFor(keyword);
    // Simulate AI generation
    setTimeout(() => {
      toast.success(`Generated bullet point for "${keyword}"`, {
        description: `• Developed scalable ${keyword} solutions that improved system performance by 40%`,
        duration: 5000,
      });
      setGeneratingFor(null);
    }, 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="rounded-lg p-4 md:p-6 flex flex-col gap-4 md:gap-6 relative overflow-hidden group bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-1.5 md:p-2 rounded-full bg-[#22C55E]/10 text-[#22C55E]">
            <Check className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-[#0F172A]">Skill Heatmap Analysis</h3>
        </div>
        <span className="text-xs font-bold bg-[#22C55E]/20 text-[#22C55E] px-2 py-1 rounded-md border border-[#22C55E]/30">High Impact</span>
      </div>

      {/* Hard Skills Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-[#475569] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#64748B]"></span>
          Hard Skills
        </h4>
        <motion.div
          className="flex flex-wrap gap-2 content-start"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {foundHardSkills.map((kw: string, i: number) => (
            <motion.span
              key={i}
              variants={item}
              className="px-3 py-1.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E] text-xs font-bold flex items-center gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              {kw}
            </motion.span>
          ))}

          {missingHardSkills.map((kw: any, i: number) => {
            const keyword = typeof kw === 'string' ? kw : kw.keyword;
            return (
              <motion.div
                key={`missing-hard-${i}`}
                variants={item}
                className="group/skill relative"
              >
                <button
                  onClick={() => handleGenerateBulletPoint(keyword)}
                  disabled={generatingFor === keyword}
                  className="px-3 py-1.5 rounded-full border-2 border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#EF4444]/20 active:bg-[#EF4444]/30 transition-colors"
                >
                  {generatingFor === keyword ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                      </motion.div>
                      <span className="md:hidden">...</span>
                      <span className="hidden md:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3.5 w-3.5" />
                      {keyword}
                      <Lightbulb className="h-3.5 w-3.5 ml-1 opacity-60" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Soft Skills Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-[#475569] uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1E293B]"></span>
          Soft Skills
        </h4>
        <motion.div
          className="flex flex-wrap gap-2 content-start"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {foundSoftSkills.map((kw: string, i: number) => (
            <motion.span
              key={i}
              variants={item}
              className="px-3 py-1.5 rounded-full bg-[#22C55E]/20 border border-[#22C55E] text-[#22C55E] text-xs font-bold flex items-center gap-1"
            >
              <Check className="h-3.5 w-3.5" />
              {kw}
            </motion.span>
          ))}

          {missingSoftSkills.map((kw: any, i: number) => {
            const keyword = typeof kw === 'string' ? kw : kw.keyword;
            return (
              <motion.div
                key={`missing-soft-${i}`}
                variants={item}
                className="group/skill relative"
              >
                <button
                  onClick={() => handleGenerateBulletPoint(keyword)}
                  disabled={generatingFor === keyword}
                  className="px-3 py-1.5 rounded-full border-2 border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#EF4444]/20 active:bg-[#EF4444]/30 transition-colors"
                >
                  {generatingFor === keyword ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                      </motion.div>
                      <span className="md:hidden">...</span>
                      <span className="hidden md:inline">Generating...</span>
                    </>
                  ) : (
                    <>
                      <X className="h-3.5 w-3.5" />
                      {keyword}
                      <Lightbulb className="h-3.5 w-3.5 ml-1 opacity-60" />
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-3 border-t border-[#E2E8F0] text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]/20 border border-[#22C55E]"></div>
          <span>Present in CV</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]/10 border-2 border-[#EF4444]"></div>
          <span>Missing (hover to generate)</span>
        </div>
      </div>
    </div>
  );
}
