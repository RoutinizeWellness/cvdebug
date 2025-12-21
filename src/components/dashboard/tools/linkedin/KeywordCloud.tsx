import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cloud, ArrowRight } from "lucide-react";
import { useState } from "react";

interface KeywordCloudProps {
  matchedKeywords: string[];
  missingKeywords: Array<string | { keyword: string }>;
  hasData: boolean;
}

export function KeywordCloud({ matchedKeywords, missingKeywords, hasData }: KeywordCloudProps) {
  const [showAll, setShowAll] = useState(false);
  const allKeywords = [...matchedKeywords, ...missingKeywords];
  
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          ATS Keywords
        </h3>
      </div>
      <div className="flex-1">
        <p className="text-xs text-zinc-400 mb-4 uppercase tracking-wider font-semibold">
          Found in your profile
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {matchedKeywords.length > 0 ? (
            matchedKeywords.slice(0, 4).map((kw, i) => (
              <Badge key={i} className="bg-green-500/10 border-green-500/30 text-green-400">
                {kw}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-zinc-500 italic">No matched keywords yet. Analyze your profile first.</p>
          )}
        </div>
        <p className="text-xs text-zinc-400 mb-4 uppercase tracking-wider font-semibold flex items-center gap-2">
          Missing (Critical)
          <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
        </p>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length > 0 ? (
            missingKeywords.slice(0, showAll ? undefined : 5).map((kw, i) => (
              <Badge 
                key={i} 
                variant="outline"
                className="border-dashed border-red-500/40 text-red-400 hover:bg-red-500/10 cursor-help"
                title="Critical keyword missing from your profile"
              >
                {typeof kw === 'string' ? kw : kw.keyword}
              </Badge>
            ))
          ) : (
            <p className="text-xs text-zinc-500 italic">
              {hasData ? "Great! No critical keywords missing." : "Analyze your profile to see missing keywords."}
            </p>
          )}
        </div>
      </div>
      {allKeywords.length > 5 && (
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
          >
            {showAll ? "Show less" : `View all ${allKeywords.length} keywords`} 
            <ArrowRight className={`h-4 w-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}
