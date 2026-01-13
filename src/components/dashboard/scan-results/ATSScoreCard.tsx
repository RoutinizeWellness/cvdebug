import { motion } from "framer-motion";

interface ATSScoreCardProps {
  score: number;
  showDetails?: boolean;
}

export function ATSScoreCard({ score, showDetails = true }: ATSScoreCardProps) {
  // Calculate stroke dasharray for the circular progress
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${score}, 100`;

  // Determine status and color based on score
  const getScoreStatus = () => {
    if (score >= 80) return { label: "High Match", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" };
    if (score >= 50) return { label: "Medium Match", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
    return { label: "Low Match", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
  };

  const getStrokeColor = () => {
    if (score >= 80) return "#22c55e"; // green
    if (score >= 50) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const status = getScoreStatus();

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
      {/* Background gradient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/20 blur-[80px] pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center relative z-10">
        <h3 className="text-sm uppercase tracking-widest text-slate-500 font-semibold mb-6">
          ATS Compatibility Score
        </h3>

        {/* Circular Gauge (SVG) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative size-48 mb-6"
        >
          <svg
            className="size-full -rotate-90"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Circle */}
            <path
              className="text-slate-700"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="100, 100"
              strokeWidth="2.5"
            />
            {/* Progress Circle */}
            <motion.path
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: strokeDasharray }}
              transition={{ duration: 1, ease: "easeOut" }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={getStrokeColor()}
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              strokeWidth="2.5"
              style={{
                filter: `drop-shadow(0 0 10px ${getStrokeColor()}80)`,
              }}
            />
          </svg>

          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-5xl font-black text-slate-900 tracking-tighter drop-shadow-lg"
            >
              {score}%
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`text-xs font-bold ${status.color} uppercase tracking-wide mt-1 px-2 py-0.5 ${status.bg} rounded border ${status.border}`}
            >
              {status.label}
            </motion.span>
          </div>
        </motion.div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full text-center"
          >
            <p className="text-slate-600 text-sm mb-2">
              {score >= 80
                ? "Great! Your resume passes most ATS systems."
                : score >= 50
                ? "Your resume needs optimization for better ATS compatibility."
                : "Your resume is at high risk of automatic rejection."}
            </p>
            <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full opacity-30"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono uppercase">
              <span>Reject</span>
              <span>Review</span>
              <span>Interview</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
