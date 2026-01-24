import { motion } from "framer-motion";

interface SpeedometerCardProps {
  score: number;
}

export function SpeedometerCard({ score }: SpeedometerCardProps) {
  return (
    <motion.div 
      className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/30 transition-all duration-300 neon-glow bg-[#FFFFFF]/70 backdrop-blur-xl border border-[#E2E8F0]/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-slate-100 font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">speed</span>
          Match Score
        </h3>
        <span className={`text-xs font-mono px-2 py-1 rounded border ${
          score >= 70 ? "text-primary bg-primary/10 border-primary/20" : 
          score >= 40 ? "text-[#F59E0B] bg-yellow-500/10 border-yellow-500/20" : 
          "text-[#EF4444] bg-[#EF4444]/10 border-red-500/20"
        }`}>
          {score >= 70 ? "HIGH PROBABILITY" : score >= 40 ? "NEEDS IMPROVEMENT" : "LOW PROBABILITY"}
        </span>
      </div>
      <div className="relative size-48 flex items-center justify-center mt-2">
        <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="transparent" r="40" stroke="#1e293b" strokeWidth="8" strokeLinecap="round"></circle>
          <circle 
            className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            cx="50" cy="50" fill="transparent" r="40" 
            stroke="url(#gradient)" 
            strokeDasharray="251.2" 
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            strokeLinecap="round" 
            strokeWidth="8"
          ></circle>
          <defs>
            <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#64748B"></stop>
              <stop offset="100%" stopColor="#8B5CF6"></stop>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-[#0F172A] tracking-tighter">{score}%</span>
          <span className="text-xs text-[#64748B] mt-1">Optimization</span>
        </div>
      </div>
      <p className="text-center text-sm text-[#64748B] mt-4 px-2">
        {score >= 80 ? "Your CV is in the top tier for this role." : 
         score >= 50 ? "Good foundation, but needs keyword optimization." : 
         "Significant improvements needed for ATS visibility."}
      </p>
    </motion.div>
  );
}
