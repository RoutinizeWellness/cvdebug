import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface SkillGapHeatmapProps {
  foundKeywords: string[];
  missingKeywords: any[];
}

export function SkillGapHeatmap({ foundKeywords, missingKeywords }: SkillGapHeatmapProps) {
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
    <div className="bg-zinc-800/40 backdrop-blur border-2 border-zinc-700 rounded-xl p-6 shadow-lg">
      
      {/* Missing Keywords - Priority First */}
      {missingKeywords.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center">
              <X className="h-4 w-4 text-red-400" />
            </div>
            <span className="text-base font-bold text-zinc-100">Missing Skills ({missingKeywords.length})</span>
          </div>
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {missingKeywords.map((kw: any, i: number) => (
              <motion.span
                key={i}
                variants={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-red-500/50 bg-transparent text-red-400 text-sm font-medium hover:bg-red-500/5 transition-colors"
              >
                <X className="h-3 w-3" />
                {typeof kw === 'string' ? kw : kw.keyword}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}

      {/* Found Keywords */}
      {foundKeywords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center">
              <Check className="h-4 w-4 text-green-400" />
            </div>
            <span className="text-base font-bold text-zinc-100">Found Skills ({foundKeywords.length})</span>
          </div>
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {foundKeywords.map((kw: string, i: number) => (
              <motion.span
                key={i}
                variants={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-900/60 transition-colors"
              >
                <Check className="h-3 w-3" />
                {kw}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
