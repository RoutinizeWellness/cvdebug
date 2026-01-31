import { motion } from "framer-motion";

interface GaugeScoreProps {
  score: number;
}

export function GaugeScore({ score }: GaugeScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"; // Success green
    if (score >= 60) return "#3b82f6"; // Primary blue
    if (score >= 40) return "#f59e0b"; // Warning amber
    return "#ef4444"; // Error red
  };

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex-shrink-0 relative flex items-center justify-center w-full max-w-[300px] mx-auto group">
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={{
          backgroundColor: color,
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 drop-shadow-[0_0_20px_rgba(30,41,59,0.5)]" viewBox="0 0 100 100">
        {/* Background Track with glassmorphism feel */}
        <circle
          className="stroke-[#1e293b]/20 fill-none"
          cx="50"
          cy="50"
          r="42"
          strokeWidth="8"
        />

        {/* Gauge Segments / Indicators */}
        {[...Array(20)].map((_, i) => {
          const angle = (i * 18 * Math.PI) / 180;
          const x1 = 50 + 38 * Math.cos(angle);
          const y1 = 50 + 38 * Math.sin(angle);
          const x2 = 50 + 45 * Math.cos(angle);
          const y2 = 50 + 45 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i * 5 < score ? color : "#1e293b40"}
              strokeWidth="1"
              className="transition-colors duration-1000"
            />
          );
        })}

        {/* Main Progress Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="transparent"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "circOut" }}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 8px ${color})`
          }}
        />

        {/* Center Hub */}
        <circle cx="50" cy="50" r="32" fill="#ffffff" className="shadow-inner" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="relative">
          <motion.div
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter"
            style={{ color: '#0F172A' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.div>

          {/* Animated percent sign or label */}
          <motion.div
            className="absolute -top-1 -right-4 text-xs font-bold text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            SCORE
          </motion.div>
        </div>

        <motion.div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mt-1 shadow-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            {score >= 80 ? "Optimized" : score >= 60 ? "Solid Match" : score >= 40 ? "Needs Fix" : "Critical"}
          </span>
        </motion.div>
      </div>

      {/* Decorative Outer Rings */}
      <div className="absolute inset-0 rounded-full border border-slate-100 opacity-50 scale-[1.15] pointer-events-none" />
      <div className="absolute inset-0 rounded-full border border-dashed border-slate-200 opacity-30 scale-[1.25] animate-[spin_60s_linear_infinite] pointer-events-none" />
    </div>
  );
}