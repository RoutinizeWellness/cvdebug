import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScoreCardProps {
  score: number;
  wordCount?: number;
  pageCount?: number;
  parsingTime?: number;
}

export function ScoreCard({ score, wordCount = 0, pageCount = 1, parsingTime = 0 }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { 
      stroke: "stroke-green-500", 
      text: "text-green-500", 
      bg: "bg-green-100 dark:bg-green-500/20", 
      border: "border-green-200 dark:border-green-500/30", 
      status: "Excellent",
      message: "optimized",
      percentage: "90%"
    };
    if (score >= 50) return { 
      stroke: "stroke-orange-500", 
      text: "text-orange-500", 
      bg: "bg-orange-100 dark:bg-orange-500/20", 
      border: "border-orange-200 dark:border-orange-500/30", 
      status: "Needs Optimization",
      message: "partially visible",
      percentage: "60%"
    };
    return { 
      stroke: "stroke-red-500", 
      text: "text-red-500", 
      bg: "bg-red-100 dark:bg-red-500/20", 
      border: "border-red-200 dark:border-red-500/30", 
      status: "Critical Issues",
      message: "invisible",
      percentage: "40%"
    };
  };

  const colors = getScoreColor(score);
  
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card rounded-lg p-8 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start relative z-10">
        {/* Left: Gauge */}
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
              className={`${colors.stroke} stroke-current`}
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

        {/* Right: Content */}
        <div className="flex flex-col gap-6 flex-1 w-full text-center lg:text-left">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-bold uppercase tracking-wider mb-4 border ${colors.border}`}>
              <span className={`size-2 rounded-full ${colors.text.replace('text-', 'bg-')} animate-pulse`}></span>
              {colors.status}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-stone-900 dark:text-white mb-4">
              Your resume is {colors.message} to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">{colors.percentage} of bots</span>.
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-lg max-w-2xl mx-auto lg:mx-0">
              {score >= 80 
                ? 'Great job! Your resume is well-optimized for ATS systems.' 
                : score >= 50 
                ? 'We found some issues that might be getting you rejected. Fix them to boost your chances.' 
                : 'We found critical errors that might be getting you rejected automatically. Fix them to boost your interview chances by 2x.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button className="flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary text-stone-900 font-bold text-base hover:bg-[#fcf82d] transition-colors shadow-[0_0_20px_rgba(249,245,6,0.2)]">
              <Download className="h-5 w-5" />
              Download Report
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-white font-medium hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors">
              <Share2 className="h-5 w-5" />
              Share Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}