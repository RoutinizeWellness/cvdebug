import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveResumeOptimizerProps {
  initialText?: string;
  targetKeywords: string[];
  onScoreChange?: (score: number) => void;
}

export function LiveResumeOptimizer({ initialText = "", targetKeywords, onScoreChange }: LiveResumeOptimizerProps) {
  const [resumeText, setResumeText] = useState(initialText);
  const [matchScore, setMatchScore] = useState(0);
  const [matchedKeywords, setMatchedKeywords] = useState<Set<string>>(new Set());
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Calculate match score in real-time
    const text = resumeText.toLowerCase();
    const matched = new Set<string>();
    
    targetKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        matched.add(keyword);
      }
    });

    const newScore = targetKeywords.length > 0 
      ? Math.round((matched.size / targetKeywords.length) * 100)
      : 0;

    if (newScore !== matchScore) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);
    }

    setMatchedKeywords(matched);
    setMatchScore(newScore);
    onScoreChange?.(newScore);
  }, [resumeText, targetKeywords, matchScore, onScoreChange]);

  const getScoreColor = () => {
    if (matchScore >= 80) return "text-[#00FF41]";
    if (matchScore >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreGlow = () => {
    if (matchScore >= 80) return "shadow-[0_0_20px_rgba(0,255,65,0.5)]";
    if (matchScore >= 50) return "shadow-[0_0_20px_rgba(250,204,21,0.3)]";
    return "";
  };

  return (
    <div className="flex h-[calc(100vh-200px)] gap-1 bg-[#050505] rounded-lg border border-[#E2E8F0] overflow-hidden">
      {/* Left Side - Editor */}
      <div className="flex-1 flex flex-col border-r border-[#E2E8F0]">
        <div className="px-4 py-2 bg-[#0A0A0A] border-b border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">Resume Editor</span>
          <span className="text-xs text-[#64748B] font-mono">{resumeText.length} characters</span>
        </div>
        <Textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume content here and watch the score update in real-time..."
          className="flex-1 bg-[#050505] border-0 text-[#475569] font-mono text-sm leading-relaxed resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-6"
          style={{ fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace" }}
        />
      </div>

      {/* Right Side - Live Score */}
      <div className="w-80 flex flex-col bg-[#0A0A0A]">
        <div className="px-4 py-2 bg-[#0F0F0F] border-b border-[#E2E8F0]">
          <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider">Live Analysis</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Score Gauge */}
          <div className="flex flex-col items-center py-6">
            <motion.div
              animate={isPulsing ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="relative w-32 h-32 flex items-center justify-center"
            >
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="45" stroke="#1e293b" strokeWidth="6"></circle>
                <motion.circle
                  className={matchScore >= 80 ? getScoreGlow() : ""}
                  cx="50"
                  cy="50"
                  fill="none"
                  r="45"
                  stroke={matchScore >= 80 ? "#00FF41" : matchScore >= 50 ? "#facc15" : "#ef4444"}
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * matchScore) / 100}
                  strokeLinecap="round"
                  strokeWidth="6"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * matchScore) / 100 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                ></motion.circle>
              </svg>
              <div className="absolute flex flex-col items-center">
                <motion.span
                  key={matchScore}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-4xl font-black ${getScoreColor()}`}
                >
                  {matchScore}
                </motion.span>
                <span className="text-xs text-[#64748B] uppercase tracking-wider mt-1">Match Score</span>
              </div>
            </motion.div>

            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${getScoreColor()}`} />
              <span className={`text-sm font-bold ${getScoreColor()}`}>
                {matchScore >= 80 ? "Excellent Match!" : matchScore >= 50 ? "Good Progress" : "Keep Optimizing"}
              </span>
            </div>
          </div>

          {/* Keyword Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Keyword Checklist</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {targetKeywords.map((keyword, index) => {
                  const isMatched = matchedKeywords.has(keyword);
                  return (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-2 rounded border transition-all duration-300 ${
                        isMatched
                          ? "bg-[#22C55E]/10 border-emerald-500/30"
                          : "bg-[#FFFFFF]/30 border-[#E2E8F0]"
                      }`}
                    >
                      <motion.div
                        animate={isMatched ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {isMatched ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-[#475569]" />
                        )}
                      </motion.div>
                      <span className={`text-sm font-mono ${isMatched ? "text-emerald-400 font-bold" : "text-[#64748B]"}`}>
                        {keyword}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-4 border-t border-[#E2E8F0]">
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>Keyword Coverage</span>
              <span className="font-mono">{matchedKeywords.size}/{targetKeywords.length}</span>
            </div>
            <Progress value={(matchedKeywords.size / targetKeywords.length) * 100} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
