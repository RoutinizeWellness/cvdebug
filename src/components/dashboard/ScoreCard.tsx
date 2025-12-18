import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, FileText, Layers } from "lucide-react";

interface ScoreCardProps {
  score: number;
  wordCount?: number;
  pageCount?: number;
  parsingTime?: number;
}

export function ScoreCard({ score, wordCount = 0, pageCount = 1, parsingTime = 0 }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: "stroke-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/40" };
    if (score >= 50) return { stroke: "stroke-amber-400", text: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/40" };
    return { stroke: "stroke-rose-400", text: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/40" };
  };

  const getVerdict = (score: number) => {
    if (score >= 80) return { title: "High Interview Chance", subtitle: "Strong keyword alignment with JD", icon: TrendingUp, color: "text-emerald-400" };
    if (score >= 50) return { title: "Moderate Interview Chance", subtitle: "Some critical skills missing", icon: TrendingDown, color: "text-amber-400" };
    return { title: "Low Interview Chance", subtitle: "Missing critical hard skills from JD", icon: TrendingDown, color: "text-rose-400" };
  };

  const colors = getScoreColor(score);
  const verdict = getVerdict(score);
  const VerdictIcon = verdict.icon;
  
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      {/* Col 1: Radial Progress */}
      <div className="bg-zinc-900/80 backdrop-blur border-2 border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center shadow-lg">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-zinc-700"
            />
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={colors.stroke}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className={`text-6xl font-bold ${colors.text}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {score}
            </motion.span>
            <span className="text-sm text-zinc-300 font-medium mt-1">Match Rate</span>
          </div>
        </div>
      </div>

      {/* Col 2: Verdict */}
      <div className={`bg-zinc-900/80 backdrop-blur border-2 ${colors.border} rounded-xl p-6 flex flex-col justify-center shadow-lg`}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`h-10 w-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0 border-2 ${colors.border}`}>
            <VerdictIcon className={`h-5 w-5 ${verdict.color}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${verdict.color} mb-1`}>{verdict.title}</h3>
            <p className="text-sm text-zinc-200 leading-relaxed">{verdict.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Col 3: Stats */}
      <div className="bg-zinc-900/80 backdrop-blur border-2 border-zinc-700 rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-300" />
              <span className="text-sm text-zinc-300">Word Count</span>
            </div>
            <span className="text-lg font-bold text-white">{wordCount}</span>
          </div>
          <div className="h-px bg-zinc-700"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-300" />
              <span className="text-sm text-zinc-300">Page Count</span>
            </div>
            <span className="text-lg font-bold text-white">{pageCount}</span>
          </div>
          <div className="h-px bg-zinc-700"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-300" />
              <span className="text-sm text-zinc-300">Parsing Time</span>
            </div>
            <span className="text-lg font-bold text-white">{parsingTime}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}