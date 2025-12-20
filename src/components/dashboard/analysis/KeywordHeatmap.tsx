import { CheckCircle2, Lock } from "lucide-react";

interface KeywordHeatmapProps {
  foundKeywords: string[];
  missingKeywords: any[];
  onUnlock?: () => void;
  isFree?: boolean;
}

export function KeywordHeatmap({ foundKeywords, missingKeywords, onUnlock, isFree = false }: KeywordHeatmapProps) {
  // For paid users, show all keywords without blur
  if (!isFree) {
    return (
      <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Keywords</h3>
          </div>
          <span className="text-xs font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-md">
            High Impact
          </span>
        </div>
        <div className="flex flex-wrap gap-2 content-start">
          {foundKeywords.map((kw, idx) => (
            <span 
              key={idx}
              className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" /> {kw}
            </span>
          ))}
          {missingKeywords.map((kw, idx) => (
            <span 
              key={idx}
              className="px-3 py-1.5 rounded-full border border-red-500 text-red-300 text-xs font-bold"
            >
              {typeof kw === 'string' ? kw : kw.keyword}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // For free users, show blurred preview with unlock button
  return (
    <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-white">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Keywords</h3>
        </div>
        <span className="text-xs font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-md">
          High Impact
        </span>
      </div>
      <div className="flex flex-wrap gap-2 content-start h-full">
        {foundKeywords.slice(0, 2).map((kw, idx) => (
          <span 
            key={idx}
            className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" /> {kw}
          </span>
        ))}
        {missingKeywords.slice(0, 2).map((kw, idx) => (
          <span 
            key={idx}
            className="px-3 py-1.5 rounded-full border border-red-500 text-red-300 text-xs font-bold"
          >
            {typeof kw === 'string' ? kw : kw.keyword}
          </span>
        ))}
        {[...Array(4)].map((_, idx) => (
          <span 
            key={idx}
            className="px-3 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 text-xs font-medium blur-[2px]"
          >
            Keyword
          </span>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#23220f] dark:via-[#23220f]/90 dark:to-transparent flex flex-col items-center justify-end pb-6">
        <button 
          onClick={onUnlock}
          className="flex items-center gap-2 bg-primary text-black text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          <Lock className="h-4 w-4 text-black" /> Unlock {missingKeywords.length} Missing Keywords
        </button>
      </div>
    </div>
  );
}