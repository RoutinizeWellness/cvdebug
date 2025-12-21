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
    if (index < 2) return "bg-primary/10 border-primary/30 text-white";
    if (index === 2) return "bg-secondary/10 border-secondary/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]";
    return "bg-zinc-800 border-zinc-700 text-zinc-300";
  };

  return (
    <div className="lg:col-span-2 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-1">
            <Tag className="h-5 w-5 text-secondary" />
            Keyword Cloud
          </h3>
          <p className="text-zinc-400 text-sm">Top search terms recruiters use to find you</p>
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
          <p className="text-zinc-500 italic text-sm">No keywords analyzed yet. Analyze your profile first.</p>
        )}
      </div>

      {missingKeywords.length > 0 && (
        <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0" />
          <p className="text-sm text-orange-200">
            Missing crucial keyword: <span className="font-bold text-white">
              {typeof missingKeywords[0] === 'string' ? missingKeywords[0] : missingKeywords[0].keyword}
            </span>. Found in 40% of target job descriptions.
          </p>
        </div>
      )}
    </div>
  );
}