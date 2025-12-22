import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

interface KeywordCloudProps {
  foundKeywords: string[];
  missingKeywords: string[];
}

export function KeywordCloud({ foundKeywords, missingKeywords }: KeywordCloudProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          ATS Keywords
        </h3>
      </div>
      
      <div className="flex-1">
        <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-semibold">
          Found in your profile
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {foundKeywords.map((keyword, i) => (
            <motion.span
              key={keyword}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium"
            >
              {keyword}
            </motion.span>
          ))}
        </div>

        <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-semibold flex items-center gap-2">
          Missing (Critical)
          <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
        </p>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword, i) => (
            <motion.span
              key={keyword}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 rounded-full bg-transparent border border-dashed border-red-500/40 text-red-400 text-xs font-medium group hover:bg-red-500/10 cursor-help transition-colors"
              title={`Found in 80% of job descriptions matching your target`}
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}