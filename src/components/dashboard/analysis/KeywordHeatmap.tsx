import { Badge } from "@/components/ui/badge";
import { Lock, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Keyword {
  name: string;
  present: boolean;
  impact?: string;
}

interface KeywordHeatmapProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  onUnlock?: () => void;
  isPremium?: boolean;
}

export function KeywordHeatmap({ matchedKeywords, missingKeywords, onUnlock, isPremium = false }: KeywordHeatmapProps) {
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const matchRate = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0;

  return (
    <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Keyword DNA</h3>
          <p className="text-sm text-slate-400">ATS Match Rate: <span className={matchRate > 70 ? "text-green-400" : "text-orange-400"}>{matchRate}%</span></p>
        </div>
        {matchRate < 50 && (
          <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Match
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Matched Skills</h4>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw, i) => (
                <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
                  <Check className="h-3 w-3 mr-1" />
                  {kw}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">No keywords matched yet.</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Missing Critical Skills</h4>
            {!isPremium && (
              <span className="text-xs text-purple-400 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Premium Insight
              </span>
            )}
          </div>
          
          <div className="relative">
            <div className={`flex flex-wrap gap-2 ${!isPremium ? "blur-sm select-none" : ""}`}>
              {missingKeywords.slice(0, isPremium ? undefined : 5).map((kw, i) => (
                <Badge key={i} variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">
                  {typeof kw === 'string' ? kw : (kw as any).keyword || 'Keyword'}
                </Badge>
              ))}
              {!isPremium && (
                <>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">Java......</Badge>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">System Des...</Badge>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">Microser...</Badge>
                </>
              )}
            </div>

            {!isPremium && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  onClick={onUnlock}
                  className="bg-slate-900/80 backdrop-blur-md border border-purple-500/50 text-white hover:bg-slate-800"
                >
                  <Lock className="h-4 w-4 mr-2 text-purple-400" />
                  Unlock Missing Keywords
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}