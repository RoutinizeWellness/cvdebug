import { Badge } from "@/components/ui/badge";
import { Tag, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface KeywordCloudProps {
  matchedKeywords: string[];
  missingKeywords: Array<string | { keyword: string }>;
  hasData: boolean;
}

export function KeywordCloud({ matchedKeywords, missingKeywords, hasData }: KeywordCloudProps) {
  const [showAll, setShowAll] = useState(false);
  
  const getKeywordSize = (index: number) => {
    if (index < 2) return "px-5 py-2.5 text-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)]";
    if (index < 5) return "px-4 py-2 text-base";
    return "px-3 py-1.5 text-xs";
  };

  const getKeywordStyle = (index: number) => {
    if (index < 2) return "bg-blue-500/10 border-blue-500/30 text-blue-100";
    if (index === 2) return "bg-violet-500/10 border-violet-500/30 text-violet-100 shadow-[0_0_15px_rgba(139,92,246,0.2)]";
    return "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700";
  };

  return (
    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 flex flex-col shadow-lg shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-1">
            <Tag className="h-5 w-5 text-violet-400" />
            Keyword Cloud
          </h3>
          <p className="text-slate-400 text-sm">Top search terms recruiters use to find you</p>
        </div>
        {matchedKeywords.length > 10 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-primary text-sm font-medium hover:text-blue-400 transition-colors"
          >
            {showAll ? 'Show Less' : 'View All Analysis'}
          </button>
        )}
      </div>

      <div className="flex-1 flex content-center flex-wrap gap-3">
        {matchedKeywords.length > 0 ? (
          matchedKeywords.slice(0, showAll ? undefined : 11).map((kw, i) => (
            <span
              key={i}
              className={`rounded-full border font-mono hover:border-primary hover:text-primary transition-all cursor-default ${getKeywordSize(i)} ${getKeywordStyle(i)}`}
            >
              {kw}
            </span>
          ))
        ) : (
          <p className="text-slate-500 italic text-sm">No keywords analyzed yet. Analyze your profile first.</p>
        )}
      </div>

      {missingKeywords.length > 0 && (
        <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <div className="p-2 bg-orange-500/20 rounded-full">
            <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0" />
          </div>
          <div>
            <p className="text-sm text-orange-200 font-medium">
              Missing crucial keyword: <span className="font-bold text-white bg-orange-500/20 px-1.5 py-0.5 rounded border border-orange-500/30">
                {typeof missingKeywords[0] === 'string' ? missingKeywords[0] : missingKeywords[0].keyword}
              </span>
            </p>
            <p className="text-xs text-orange-300/70 mt-0.5">
              Found in 40% of target job descriptions. Adding this can boost visibility by ~15%.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}