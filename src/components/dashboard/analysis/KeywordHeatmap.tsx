import { CheckCircle2, Lock, Target, AlertTriangle } from "lucide-react";

interface KeywordHeatmapProps {
  foundKeywords: string[];
  missingKeywords: any[];
  onUnlock?: () => void;
  isFree?: boolean;
}

export function KeywordHeatmap({ foundKeywords, missingKeywords, onUnlock, isFree = false }: KeywordHeatmapProps) {
  // Separate keywords by priority
  const criticalKeywords = missingKeywords.filter((kw: any) => 
    (typeof kw === 'string' ? false : kw.priority === 'critical')
  );
  const importantKeywords = missingKeywords.filter((kw: any) => 
    (typeof kw === 'string' ? false : kw.priority === 'important')
  );
  const otherKeywords = missingKeywords.filter((kw: any) => 
    typeof kw === 'string' || (!kw.priority || (kw.priority !== 'critical' && kw.priority !== 'important'))
  );
  // For paid users, show all keywords with priority indicators
  if (!isFree) {
    return (
      <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary to-orange-500">
              <Target className="h-5 w-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Keyword Sniper
                <span className="text-xs font-normal text-zinc-400">
                  ({foundKeywords.length} found, {missingKeywords.length} missing)
                </span>
              </h3>
            </div>
          </div>
          {missingKeywords.length > 0 && (
            <span className="text-xs font-bold bg-red-900 text-red-300 px-2 py-1 rounded-md border border-red-700 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {criticalKeywords.length} Critical
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 content-start min-h-[120px]">
          {/* Found Keywords */}
          {foundKeywords && foundKeywords.length > 0 && (
            foundKeywords.map((kw, idx) => (
              <span 
                key={`found-${idx}`}
                className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold flex items-center gap-1"
              >
                <CheckCircle2 className="h-3 w-3" /> {kw}
              </span>
            ))
          )}
          
          {/* Critical Missing Keywords */}
          {criticalKeywords.map((kw: any, idx: number) => (
            <span 
              key={`critical-${idx}`}
              className="px-3 py-1.5 rounded-full border-2 border-red-500 bg-red-500/20 text-red-200 text-xs font-bold flex items-center gap-1 animate-pulse"
              title={`Impact: ${kw.impact || 'High'} | ${kw.context || 'Add to resume'}`}
            >
              <AlertTriangle className="h-3 w-3" />
              {kw.keyword}
            </span>
          ))}
          
          {/* Important Missing Keywords */}
          {importantKeywords.map((kw: any, idx: number) => (
            <span 
              key={`important-${idx}`}
              className="px-3 py-1.5 rounded-full border border-orange-500 bg-orange-500/10 text-orange-300 text-xs font-bold"
              title={`Impact: ${kw.impact || 'Medium'} | ${kw.context || 'Recommended'}`}
            >
              {kw.keyword}
            </span>
          ))}
          
          {/* Other Missing Keywords */}
          {otherKeywords.map((kw: any, idx: number) => (
            <span 
              key={`other-${idx}`}
              className="px-3 py-1.5 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-300 text-xs font-medium"
            >
              {typeof kw === 'string' ? kw : kw.keyword}
            </span>
          ))}
          
          {(!foundKeywords || foundKeywords.length === 0) && (!missingKeywords || missingKeywords.length === 0) && (
            <div className="flex items-center justify-center w-full h-full min-h-[120px]">
              <p className="text-zinc-400 text-sm" data-testid="no-keywords-message">
                No keywords detected. Add a job description for targeted analysis.
              </p>
            </div>
          )}
        </div>
        
        {/* Keyword Legend */}
        {missingKeywords.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-3 border-t border-zinc-800 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-zinc-400">Critical (High ATS Impact)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span className="text-zinc-400">Important (Medium Impact)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <span className="text-zinc-400">Nice to Have</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For free users, show blurred preview with unlock button
  return (
    <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800">
            <CheckCircle2 className="h-5 w-5 text-white" />
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