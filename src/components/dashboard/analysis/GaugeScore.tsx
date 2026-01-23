import { motion } from "framer-motion";

interface GaugeScoreProps {
  score: number;
}

export function GaugeScore({ score }: GaugeScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "stroke-green-500";
    if (score >= 50) return "stroke-primary";
    return "stroke-red-500";
  };

  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex-shrink-0 relative flex items-center justify-center w-full max-w-[280px] mx-auto">
      <svg className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72" viewBox="0 0 100 100">
        <circle 
          className="text-stone-800 stroke-current" 
          cx="50" 
          cy="50" 
          fill="transparent" 
          r="42" 
          strokeWidth="8"
        />
        <motion.circle 
          className={`${getScoreColor(score)} stroke-current`}
          cx="50" 
          cy="50" 
          fill="transparent" 
          r="42" 
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          className="text-4xl sm:text-5xl md:text-6xl font-bold !text-[#0F172A]"
          style={{ color: '#ffffff' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-xs sm:text-sm font-medium !text-zinc-400 mt-0.5 sm:mt-1" style={{ color: '#a1a1aa' }}>out of 100</span>
      </div>
    </div>
  );
}