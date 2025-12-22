import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label?: string;
}

export function ScoreGauge({ score, label = "Good" }: ScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#197fe6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const color = getScoreColor(score);

  return (
    <div className="relative size-32 rounded-full flex items-center justify-center" 
         style={{ background: `conic-gradient(${color} ${score}%, #243647 0)` }}>
      <div className="absolute inset-[10px] bg-surface-dark rounded-full flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl font-black text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-slate-400 uppercase font-bold">{label}</span>
      </div>
    </div>
  );
}