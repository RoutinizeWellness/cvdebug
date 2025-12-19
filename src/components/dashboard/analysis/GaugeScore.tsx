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
    <div className="flex-shrink-0 relative flex items-center justify-center">
      <svg className="size-64 md:size-72" viewBox="0 0 100 100">
        <circle 
          className="text-stone-200 dark:text-stone-800 stroke-current" 
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
          className="text-5xl font-bold text-stone-900 dark:text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-sm font-medium text-stone-500 dark:text-stone-400 mt-1">out of 100</span>
      </div>
    </div>
  );
}