import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GaugeScore } from "./analysis/GaugeScore";

interface ScoreCardProps {
  score: number;
  wordCount?: number;
  pageCount?: number;
  parsingTime?: number;
}

export function ScoreCard({ score, wordCount = 0, pageCount = 1, parsingTime = 0 }: ScoreCardProps) {
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { 
      status: "Excellent",
      message: "optimized",
      percentage: "90%",
      color: "green"
    };
    if (score >= 50) return { 
      status: "Needs Optimization",
      message: "partially visible",
      percentage: "60%",
      color: "orange"
    };
    return { 
      status: "Critical Issues",
      message: "invisible",
      percentage: "40%",
      color: "red"
    };
  };

  const statusInfo = getScoreStatus(score);

  return (
    <div className="glass-card rounded-lg p-8 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start relative z-10">
        <GaugeScore score={score} />

        <div className="flex flex-col gap-6 flex-1 w-full text-center lg:text-left">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${statusInfo.color}-100 dark:bg-${statusInfo.color}-500/20 text-${statusInfo.color}-700 dark:text-${statusInfo.color}-200 text-xs font-bold uppercase tracking-wider mb-4 border border-${statusInfo.color}-200 dark:border-${statusInfo.color}-500/30`}>
              <span className={`size-2 rounded-full bg-${statusInfo.color}-500 animate-pulse`}></span>
              {statusInfo.status}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-stone-900 dark:text-white mb-4">
              Your resume is {statusInfo.message} to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">{statusInfo.percentage} of bots</span>.
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
            <Button className="flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(124,59,237,0.3)]">
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