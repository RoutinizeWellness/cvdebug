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
    <div className="glass-card rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white">
            <Check className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">Keywords</h3>
        </div>
        <span className="text-xs font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-md">High Impact</span>
      </div>
      
      <motion.div 
        className="flex flex-wrap gap-2 content-start h-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {foundKeywords.map((kw: string, i: number) => (
          <motion.span
            key={i}
            variants={item}
            className="px-3 py-1.5 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold flex items-center gap-1"
          >
            <Check className="h-3.5 w-3.5" />
            {kw}
          </motion.span>
        ))}
        
        {missingKeywords.slice(0, 2).map((kw: any, i: number) => (
          <motion.span
            key={`missing-${i}`}
            variants={item}
            className="px-3 py-1.5 rounded-full border border-red-500 text-stone-900 dark:text-white text-xs font-bold"
          >
            {typeof kw === 'string' ? kw : kw.keyword}
          </motion.span>
        ))}
        
        {missingKeywords.length > 2 && (
          <>
            <span className="px-3 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 text-xs font-medium blur-[2px]">
              Docker
            </span>
            <span className="px-3 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 text-xs font-medium blur-[2px]">
              Kubernetes
            </span>
          </>
        )}
      </motion.div>
      
      {missingKeywords.length > 2 && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#23220f] dark:via-[#23220f]/90 dark:to-transparent flex flex-col items-center justify-end pb-6">
          <button className="flex items-center gap-2 bg-primary text-stone-900 text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform shadow-lg">
            <X className="h-4 w-4" /> Unlock {missingKeywords.length - 2} Missing Keywords
          </button>
        </div>
      )}
    </div>
  );
}
