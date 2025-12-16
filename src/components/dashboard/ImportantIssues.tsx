import { AlertTriangle, Check, ArrowRight } from "lucide-react";

interface ImportantIssuesProps {
  formatIssues?: any[];
  importantKeywords: any[];
}

export function ImportantIssues({ formatIssues = [], importantKeywords }: ImportantIssuesProps) {
  const totalIssues = formatIssues.length + importantKeywords.length;
  
  return (
    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl overflow-hidden">
      <div className="bg-yellow-500/10 px-4 py-3 border-b border-yellow-500/10 flex justify-between items-center">
        <h3 className="text-sm font-bold text-yellow-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> IMPORTANT (Optimize)
        </h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${totalIssues === 0 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
          {totalIssues} Issues
        </span>
      </div>
      
      <div className="p-4 space-y-4">
        {totalIssues === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-bold text-foreground">0 Issues Found!</p>
            <p className="text-xs text-muted-foreground">Your resume formatting and important keywords look good.</p>
          </div>
        ) : (
          <>
            {formatIssues.length > 0 && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Format Issues:</p>
                <div className="space-y-3">
                  {formatIssues.map((issue: any, i: number) => {
                    const issueText = typeof issue === 'string' ? issue : issue.issue;
                    const severity = typeof issue === 'object' ? issue.severity : 'medium';
                    const fix = typeof issue === 'object' ? issue.fix : null;
                    const location = typeof issue === 'object' ? issue.location : null;
                    
                    return (
                      <div key={i} className="flex flex-col gap-2 pb-3 border-b border-yellow-500/10 last:border-0 last:pb-0 bg-background/30 p-3 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground flex items-start gap-2">
                              • {issueText}
                            </span>
                            {location && (
                              <span className="text-[10px] text-muted-foreground mt-1 ml-3.5 block">
                                📍 Location: {location}
                              </span>
                            )}
                          </div>
                          {severity && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                              severity === 'high' ? 'bg-red-100 text-red-700' :
                              severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {severity.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {fix && (
                          <div className="pl-3.5 flex items-start gap-2 text-xs text-yellow-700/80 font-medium bg-yellow-50 dark:bg-yellow-950/20 p-2.5 rounded leading-relaxed">
                            <ArrowRight className="h-3 w-3 flex-shrink-0 mt-0.5" /> 
                            <div>
                              <strong className="block mb-1">How to Fix:</strong>
                              <span className="text-foreground/80">{fix}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {importantKeywords.length > 0 && (
              <div className={formatIssues.length > 0 ? "mt-4 pt-4 border-t border-yellow-500/10" : ""}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Important Skills to Add:</p>
                <div className="space-y-2">
                  {importantKeywords.map((item: any, i: number) => (
                    <div key={i} className="text-sm text-foreground flex items-center justify-between gap-2 bg-background/30 p-2 rounded">
                      <span>• {typeof item === 'string' ? item : item.keyword}</span>
                      {item.section && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          → {item.section}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
