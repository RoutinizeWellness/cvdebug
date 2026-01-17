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
    <div className="glass-panel p-4 md:p-6 rounded-lg md:rounded-xl border border-[#E2E8F0] bg-[#FFFFFF]/50 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-bold text-[#0F172A]">Keyword DNA</h3>
          <p className="text-xs md:text-sm text-[#64748B]">ATS Match Rate: <span className={matchRate > 70 ? "text-green-400" : matchRate > 40 ? "text-orange-400" : "text-red-400"}>{matchRate}%</span></p>
        </div>
        {matchRate < 50 && totalKeywords > 0 && (
          <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10 text-xs self-start sm:self-auto">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Match
          </Badge>
        )}
      </div>

      <div className="space-y-4 md:space-y-6 flex-1">
        <div>
          <h4 className="text-[10px] md:text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2 md:mb-3">Matched Skills</h4>
          <div className="flex flex-wrap gap-1.5 md:gap-2 min-h-[60px]">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((kw, i) => (
                <Badge key={i} className="bg-[#22C55E]/10 text-green-400 border-green-500/20 hover:bg-[#22C55E]/20 h-fit text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">
                  <Check className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" />
                  {kw}
                </Badge>
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-3 md:py-4">
                <p className="text-xs md:text-sm text-[#64748B] italic text-center">No keywords matched yet. Upload a resume to see matches.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 md:mb-3">
            <h4 className="text-[10px] md:text-xs font-semibold text-[#64748B] uppercase tracking-wider">Missing Critical Skills</h4>
            {!isPremium && (
              <span className="text-[10px] md:text-xs text-teal-400 flex items-center gap-1">
                <Lock className="h-2.5 w-2.5 md:h-3 md:w-3" />
                Premium Insight
              </span>
            )}
          </div>

          <div className="relative">
            <div className={`flex flex-wrap gap-1.5 md:gap-2 ${!isPremium ? "blur-sm select-none" : ""}`}>
              {missingKeywords.slice(0, isPremium ? undefined : 5).map((kw, i) => (
                <Badge key={i} variant="outline" className="border-red-500/30 text-red-400 bg-[#EF4444]/5 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">
                  {typeof kw === 'string' ? kw : (kw as any).keyword || 'Keyword'}
                </Badge>
              ))}
              {!isPremium && (
                <>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 bg-[#EF4444]/5 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">Java......</Badge>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 bg-[#EF4444]/5 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">System Des...</Badge>
                  <Badge variant="outline" className="border-red-500/30 text-red-400 bg-[#EF4444]/5 text-[10px] md:text-xs px-2 md:px-2.5 py-0.5 md:py-1">Microser...</Badge>
                </>
              )}
            </div>

            {!isPremium && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={onUnlock}
                  className="bg-[#FFFFFF]/80 backdrop-blur-md border border-teal-500/50 text-[#0F172A] hover:bg-[#F8FAFC] text-xs md:text-sm h-9 md:h-10 px-3 md:px-4"
                >
                  <Lock className="h-3 w-3 md:h-4 md:w-4 mr-1.5 md:mr-2 text-teal-400" />
                  <span className="hidden sm:inline">Unlock Missing Keywords</span>
                  <span className="sm:hidden">Unlock</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}