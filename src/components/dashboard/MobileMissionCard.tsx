import { motion } from "framer-motion";
import { Building2, Target, AlertCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MobileMissionCardProps {
  job: any;
  onClick: () => void;
}

export function MobileMissionCard({ job, onClick }: MobileMissionCardProps) {
  const score = job.score || 0;
  const hasIntegrityIssue = job.pdfIntegrity && job.pdfIntegrity < 95;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-500/20 to-emerald-600/20";
    if (score >= 50) return "from-amber-500/20 to-amber-600/20";
    return "from-red-500/20 to-red-600/20";
  };

  return (
    <motion.div
      onClick={onClick}
      className="w-full bg-slate-800 rounded-2xl p-4 border border-slate-700 hover:border-primary/50 transition-all cursor-pointer"
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4">
        {/* Company Logo/Icon */}
        <div className="h-12 w-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
          <Building2 className="h-6 w-6 text-slate-400" />
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-sm truncate">{job.jobTitle}</h3>
            {/* Health Badge */}
            {hasIntegrityIssue ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
              />
            ) : (
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-400 truncate">{job.company}</p>
        </div>

        {/* Score Circle */}
        <div className={`relative h-16 w-16 flex-shrink-0`}>
          <svg className="transform -rotate-90 w-16 h-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-slate-700"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
              className={getScoreColor(score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-black ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
