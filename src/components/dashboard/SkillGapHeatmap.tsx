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
    <div className="glass-card rounded-lg p-6 flex flex-col gap-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-stone-800 text-slate-900">
            <Check className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Skill Heatmap Analysis</h3>
        </div>
        <span className="text-xs font-bold bg-green-900 text-green-300 px-2 py-1 rounded-md">High Impact</span>
      </div>

      {/* Hard Skills Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
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
              className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500 text-green-300 text-xs font-bold flex items-center gap-1"
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
                <span className="px-3 py-1.5 rounded-full border-2 border-red-500 bg-red-500/10 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-red-500/20 transition-colors">
                  <X className="h-3.5 w-3.5" />
                  {keyword}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/skill:opacity-100 transition-opacity bg-zinc-900 border border-primary text-primary text-xs h-7 px-2 whitespace-nowrap"
                  onClick={() => handleGenerateBulletPoint(keyword)}
                  disabled={generatingFor === keyword}
                >
                  {generatingFor === keyword ? (
                    "Generating..."
                  ) : (
                    <>
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Suggest Rewrite
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Soft Skills Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
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
              className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500 text-green-300 text-xs font-bold flex items-center gap-1"
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
                <span className="px-3 py-1.5 rounded-full border-2 border-red-500 bg-red-500/10 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-red-500/20 transition-colors">
                  <X className="h-3.5 w-3.5" />
                  {keyword}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/skill:opacity-100 transition-opacity bg-zinc-900 border border-primary text-primary text-xs h-7 px-2 whitespace-nowrap"
                  onClick={() => handleGenerateBulletPoint(keyword)}
                  disabled={generatingFor === keyword}
                >
                  {generatingFor === keyword ? (
                    "Generating..."
                  ) : (
                    <>
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Suggest Rewrite
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-3 border-t border-zinc-800 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
          <span>Present in CV</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/10 border-2 border-red-500"></div>
          <span>Missing (hover to generate)</span>
        </div>
      </div>
    </div>
  );
}