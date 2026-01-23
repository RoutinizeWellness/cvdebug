import { motion } from "framer-motion";
import { TrendingUp, Shield, CheckCircle, Target } from "lucide-react";

interface SeniorityMatchProps {
  detectedLevel: string;
  confidenceScore: number;
  experienceYears: number;
  expectedLevel: string;
  signalsDetected: number;
  signalStrength: "STRONG" | "WEAK" | "MODERATE";
  detectedSignals: string[];
  readability: "High Integrity" | "Medium" | "Low";
  imageTraps: "None Detected" | "Detected" | "Critical";
  atsScore: number;
}

const levelColors = {
  JUNIOR: "text-amber-600 dark:text-amber-400",
  "MID-LEVEL": "text-[#1E293B] dark:text-blue-400",
  SENIOR: "text-emerald-600 dark:text-emerald-400",
  LEAD: "text-[#1E293B] dark:text-purple-400",
  PRINCIPAL: "text-indigo-600 dark:text-indigo-400",
};

const levelBadges = {
  JUNIOR: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
  "MID-LEVEL": "bg-blue-50 dark:bg-blue-900/30 text-[#1E293B] dark:text-blue-400 border-blue-100 dark:border-blue-800",
  SENIOR: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
  LEAD: "bg-[#F8FAFC] dark:bg-purple-900/30 text-[#1E293B] dark:text-purple-400 border-purple-100 dark:border-purple-800",
  PRINCIPAL: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
};

export function SeniorityMatchAnalysis({
  detectedLevel,
  confidenceScore,
  experienceYears,
  expectedLevel,
  signalsDetected,
  signalStrength,
  detectedSignals,
  readability,
  imageTraps,
  atsScore,
}: SeniorityMatchProps) {
  const levelColor = levelColors[detectedLevel as keyof typeof levelColors] || levelColors.JUNIOR;
  const levelBadge = levelBadges[detectedLevel as keyof typeof levelBadges] || levelBadges.JUNIOR;

  const needsReview = confidenceScore < 60;
  const hasMatch = detectedLevel === expectedLevel;

  return (
    <div className="space-y-6">
      {/* Main Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-professional p-8"
      >
        <div className="flex items-center gap-2 mb-8">
          <Target className="text-primary text-xl" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Seniority Match Analysis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Detected Level */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Detected Level
            </p>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold tracking-tight ${levelColor}`}>
                {detectedLevel}
              </span>
              {needsReview && (
                <span className={`px-2 py-0.5 rounded ${levelBadge} text-[10px] font-bold uppercase border`}>
                  Review Required
                </span>
              )}
              {hasMatch && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase border border-emerald-100 dark:border-emerald-800">
                  Perfect Match
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <TrendingUp className="text-sm" />
              <span>
                Confidence Score:{" "}
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {confidenceScore}/100
                </span>
              </span>
            </div>
          </div>

          {/* Experience Audit */}
          <div className="space-y-4 border-l border-slate-100 dark:border-slate-800 md:pl-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Experience Audit
            </p>
            <div className="space-y-1">
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {experienceYears} years
              </p>
              <p className="text-xs text-slate-500">
                Expected requirement:{" "}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {expectedLevel}
                </span>
              </p>
            </div>
          </div>

          {/* Signal Density */}
          <div className="space-y-4 border-l border-slate-100 dark:border-slate-800 md:pl-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Signal Density
            </p>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold tracking-tight text-[#1E293B] dark:text-blue-400">
                  {signalsDetected}
                </p>
                <span className="text-xs font-medium text-slate-400">signals detected</span>
              </div>
              <p className="text-xs text-slate-500">
                Signal strength:{" "}
                <span
                  className={`font-bold ${
                    signalStrength === "STRONG"
                      ? "text-emerald-500"
                      : signalStrength === "WEAK"
                      ? "text-rose-500"
                      : "text-amber-500"
                  }`}
                >
                  {signalStrength}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Detected Signals */}
        {detectedSignals.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
              Detected Signals
            </p>
            <div className="flex flex-wrap gap-2">
              {detectedSignals.map((signal, idx) => (
                <span
                  key={idx}
                  className="badge-professional-blue px-3 py-1.5 rounded-full"
                >
                  ✓ {signal}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-professional p-6 flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Readability
            </p>
            <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <CheckCircle className="text-emerald-500 text-lg" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{readability}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Structure follows industry standard patterns
            </p>
          </div>
        </motion.div>

        {/* Image Traps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-professional p-6 flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Image Traps
            </p>
            <span className="px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
              Safe
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{imageTraps}</h3>
            <p className="text-xs text-slate-500 mt-1">
              No invisible elements or keyword stuffing
            </p>
          </div>
        </motion.div>

        {/* ATS Global Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-professional p-6 flex flex-col justify-between h-40 relative overflow-hidden"
        >
          <div className="flex justify-between items-start z-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              ATS Global Score
            </p>
          </div>
          <div className="flex items-end justify-between z-10">
            <div>
              <h3 className="text-3xl font-mono font-bold text-slate-900 dark:text-white">
                {atsScore}
                <span className="text-slate-300 dark:text-slate-600 text-xl">/100</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Score based on parsing efficiency</p>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="28"
                  stroke="url(#scoreGradient)"
                  strokeDasharray="175.92"
                  strokeDashoffset={175.92 - (175.92 * atsScore) / 100}
                  strokeLinecap="round"
                  strokeWidth="4"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-[10px] font-mono text-slate-400">{atsScore}%</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Ref: CV-{Math.floor(Math.random() * 9000 + 1000)}-X</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Analysis
          </span>
        </div>
        <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          View Full Technical Report
          <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
}
