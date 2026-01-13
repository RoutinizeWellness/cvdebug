import { motion } from "framer-motion";

interface IntegrityPanelProps {
  integrityScore: number;
  hasImageTrap: boolean;
  pageCount?: number;
}

export function IntegrityPanel({ integrityScore, hasImageTrap, pageCount = 1 }: IntegrityPanelProps) {
  return (
    <motion.div 
      className="glass-panel rounded-xl p-6 flex flex-col gap-5 neon-glow bg-white/70 backdrop-blur-xl border border-slate-200/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8B5CF6] text-sm">health_and_safety</span>
          Integrity Health
        </h3>
        <button className="text-slate-500 hover:text-slate-900 transition-colors">
          <span className="material-symbols-outlined text-lg">more_horiz</span>
        </button>
      </div>
      
      {/* Readability */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-sm text-slate-500">Readability</span>
          <span className="text-sm text-slate-900 font-mono">
            {integrityScore > 80 ? "Grade 8 (Good)" : "Complex"}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${integrityScore > 80 ? "bg-emerald-500" : "bg-yellow-500"}`} 
            style={{ width: `${integrityScore}%` }}
          ></div>
        </div>
        <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
          <span className="material-symbols-outlined text-[12px]">trending_up</span>
          System Optimal
        </p>
      </div>

      {/* ATS Parse Rate */}
      <div className="space-y-2 pt-2 border-t border-slate-200/50">
        <div className="flex justify-between items-end">
          <span className="text-sm text-slate-500">ATS Parse Rate</span>
          <span className="text-sm text-slate-900 font-mono">{integrityScore}% Success</span>
        </div>
        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] ${
              hasImageTrap ? "bg-red-500" : "bg-primary"
            }`} 
            style={{ width: `${integrityScore}%` }}
          ></div>
        </div>
        <p className={`text-[11px] flex items-center gap-1 mt-1 ${
          hasImageTrap ? "text-red-400" : "text-emerald-400"
        }`}>
          <span className="material-symbols-outlined text-[12px]">
            {hasImageTrap ? "warning" : "check_circle"}
          </span>
          {hasImageTrap ? "Image Trap Detected" : "No critical errors found"}
        </p>
      </div>
    </motion.div>
  );
}
