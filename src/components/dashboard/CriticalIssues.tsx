import { AlertCircle, Check, ArrowRight, TrendingUp } from "lucide-react";

interface CriticalIssuesProps {
  criticalKeywords: any[];
  totalImpact: number;
}

export function CriticalIssues({ criticalKeywords, totalImpact }: CriticalIssuesProps) {
  return (
    <div id="critical-issues" className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
      <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/10 flex justify-between items-center">
        <h3 className="text-sm font-bold text-red-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> CRITICAL (Fix First)
        </h3>
        <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
          {criticalKeywords.length} Issues
        </span>
      </div>
      
      <div className="p-4 space-y-4">
        {criticalKeywords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-bold text-foreground">No Critical Issues!</p>
            <p className="text-xs text-muted-foreground mt-1">All essential keywords are present.</p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Missing Required Skills:</p>
              <div className="space-y-3">
                {criticalKeywords.map((item: any, i: number) => (
                  <div key={i} className="flex flex-col gap-2 pb-3 border-b border-red-500/10 last:border-0 last:pb-0 bg-background/30 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-foreground flex items-center gap-2">
                        • {typeof item === 'string' ? item : item.keyword}
                        {item.frequency && <span className="text-[10px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">mentioned {item.frequency}x in JD</span>}
                      </span>
                      {item.impact && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          +{item.impact} pts
                        </span>
                      )}
                    </div>
                    <div className="pl-3.5 flex items-start gap-2 text-xs text-red-600/80 font-medium bg-red-50 dark:bg-red-950/20 p-2 rounded">
                      <ArrowRight className="h-3 w-3 flex-shrink-0 mt-0.5" /> 
                      <span>Add to <strong>{item.section || 'Skills'}</strong> section</span>
                    </div>
                    {item.context && (
                      <div className="pl-3.5 text-xs text-foreground/70 leading-relaxed bg-background/50 p-2 rounded border-l-2 border-red-500/30">
                        💡 {item.context}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-3 border border-red-500/10 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Potential Impact</p>
                <p className="text-xs text-muted-foreground">+{totalImpact > 0 ? totalImpact : 15}% match if all fixed</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
