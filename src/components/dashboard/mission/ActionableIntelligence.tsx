import { motion } from "framer-motion";

interface Issue {
  title: string;
  description: string;
  severity?: string;
}

interface ActionableIntelligenceProps {
  issues: Issue[];
}

export function ActionableIntelligence({ issues }: ActionableIntelligenceProps) {
  return (
    <motion.div 
      className="glass-panel rounded-xl flex flex-col neon-glow bg-slate-900/70 backdrop-blur-xl border border-slate-800/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="p-5 border-b border-slate-700/50">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">lightbulb</span>
          Actionable Intelligence
        </h3>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {issues.length > 0 ? (
          issues.map((issue, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
              <div className="mt-0.5">
                <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-primary focus:ring-primary focus:ring-offset-slate-900" />
              </div>
              <div>
                <p className="text-sm text-slate-200 font-medium">{issue.title}</p>
                <p className="text-xs text-slate-400 mt-1">{issue.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-slate-500 text-sm">
            No critical issues detected. Great job!
          </div>
        )}
      </div>
    </motion.div>
  );
}
