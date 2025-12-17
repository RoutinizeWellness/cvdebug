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
    <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-bold text-zinc-100 mb-6">Keyword Analysis</h3>
      
      {/* Missing Keywords - Priority First */}
      {missingKeywords.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <X className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-zinc-400">Missing Skills ({missingKeywords.length})</span>
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
          <div className="flex items-center gap-2 mb-3">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-zinc-400">Found Skills ({foundKeywords.length})</span>
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
