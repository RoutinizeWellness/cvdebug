import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Keyword {
  name: string;
  category: string;
  impact: string;
}

interface BulletPointSniperProps {
  matchedKeywords: Keyword[];
  missingKeywords: Keyword[];
  onSnipe: (keyword: string) => void;
  snipingKeyword: string | null;
}

export function BulletPointSniper({ matchedKeywords, missingKeywords, onSnipe, snipingKeyword }: BulletPointSniperProps) {
  return (
    <motion.div 
      className="glass-panel rounded-xl flex flex-col h-full overflow-hidden neon-glow bg-slate-900/70 backdrop-blur-xl border border-slate-800/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">gps_fixed</span>
            Bullet Point Sniper
          </h3>
          <p className="text-xs text-slate-400 mt-1">Click [Snipe it] to generate AI bullet points</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono">
            {matchedKeywords.length} Found
          </span>
          <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20 font-mono">
            {missingKeywords.length} Missing
          </span>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="flex flex-col gap-2">
          {/* Matched Keywords */}
          {matchedKeywords.map((keyword, idx) => (
            <div key={`matched-${idx}`} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 border border-transparent hover:border-slate-600 transition-all cursor-default">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-slate-800 text-emerald-400">
                  <span className="material-symbols-outlined text-lg">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">{keyword.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{keyword.category}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500 group-hover:text-slate-300">{keyword.impact}</span>
            </div>
          ))}

          {/* Missing Keywords - WITH SNIPE BUTTON */}
          {missingKeywords.map((keyword, idx) => (
            <motion.div 
              key={`missing-${idx}`}
              className="group flex items-center justify-between p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500/10 transition-all"
              whileHover={{ x: 4 }}
              animate={idx === 0 ? { 
                borderColor: ["rgba(244, 63, 94, 0.2)", "rgba(244, 63, 94, 0.4)", "rgba(244, 63, 94, 0.2)"]
              } : undefined}
              transition={{ 
                borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-rose-900/50 text-rose-400 animate-pulse">
                  <span className="material-symbols-outlined text-lg">priority_high</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white group-hover:text-rose-200">{keyword.name}</span>
                  <span className="text-[10px] text-rose-300/70 font-mono">{keyword.category} • Missing</span>
                </div>
              </div>
              <button 
                onClick={() => onSnipe(keyword.name)}
                disabled={snipingKeyword === keyword.name}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {snipingKeyword === keyword.name ? (
                  <>
                    <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                    Sniping...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xs">auto_fix_high</span>
                    Snipe it
                  </>
                )}
              </button>
            </motion.div>
          ))}
          
          {matchedKeywords.length === 0 && missingKeywords.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <p>No keywords analyzed yet.</p>
              <p className="text-xs mt-1">Upload a resume to see keyword analysis.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">download</span>
          Export Keyword Report
        </Button>
      </div>
    </motion.div>
  );
}
