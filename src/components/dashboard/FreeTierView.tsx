import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Check, AlertTriangle, Lock, Star } from "lucide-react";

interface FreeTierViewProps {
  score: number;
  missingCount: number;
  formatCount: number;
  criticalKeywords: any[];
  showBlurredPreview: boolean;
  setShowPricing: (show: boolean) => void;
  setShowBlurredPreview: (show: boolean) => void;
}

export function FreeTierView({ 
  score, 
  missingCount, 
  formatCount, 
  criticalKeywords,
  showBlurredPreview,
  setShowPricing,
  setShowBlurredPreview
}: FreeTierViewProps) {
  const target = 75;
  const gap = Math.max(0, target - score);
  const firstCriticalKeyword = criticalKeywords[0];
  const remainingCriticalCount = Math.max(0, criticalKeywords.length - 1);

  if (showBlurredPreview) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <div className="filter blur-md pointer-events-none select-none">
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Match Rate</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-5xl font-black text-foreground">{score}%</span>
                      <span className="text-sm text-muted-foreground font-medium">/ 100</span>
                    </div>
                  </div>
                </div>
                <Progress value={score} className="h-3" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Missing Keywords</p>
                    <p className="text-lg font-bold text-red-500">{missingCount}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Format Issues</p>
                    <p className="text-lg font-bold text-yellow-500">{formatCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
            <div className="text-center space-y-6 p-8 max-w-md">
              <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-foreground mb-2">
                  {missingCount} Critical Issues Found!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your resume is missing keywords that could be blocking your applications.
                </p>
              </div>

              {firstCriticalKeyword && (
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 text-left animate-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
                        🎁 FREE SAMPLE - Error #1 Revealed
                      </p>
                      <p className="text-sm font-bold text-foreground mb-2">
                        ❌ Missing Critical Keyword: "{typeof firstCriticalKeyword === 'string' ? firstCriticalKeyword : firstCriticalKeyword.keyword}"
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {firstCriticalKeyword.context || `This keyword appears ${firstCriticalKeyword.frequency || 'multiple'} times in the job description. Add it to your ${firstCriticalKeyword.section || 'Skills'} section.`}
                      </p>
                    </div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-2 text-xs text-muted-foreground border-l-2 border-green-500/30">
                    💡 <strong>Quick Fix:</strong> Add to {firstCriticalKeyword.section || 'Skills'} section
                    {firstCriticalKeyword.impact && ` • Potential +${firstCriticalKeyword.impact} points`}
                  </div>
                </div>
              )}

              {remainingCriticalCount > 0 && (
                <div className="bg-muted/30 border border-border rounded-xl p-4 text-left space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    🔒 {remainingCriticalCount} More Critical Errors (Locked)
                  </p>
                  {criticalKeywords.slice(1, 4).map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 bg-background/50 rounded-lg p-2 border border-border/50">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          ❌ Missing Keyword: <span className="blur-sm select-none">████████</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Solution: <span className="blur-sm select-none">████████████████</span>
                        </p>
                      </div>
                      <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                  {remainingCriticalCount > 3 && (
                    <p className="text-xs text-center text-muted-foreground pt-2">
                      + {remainingCriticalCount - 3} more critical errors...
                    </p>
                  )}
                </div>
              )}

              {formatCount > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-xs font-bold text-yellow-700">
                      🔒 {formatCount} Format Issues Detected
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ATS parsing errors: <span className="blur-sm select-none">████████████</span>
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setShowPricing(true);
                    setShowBlurredPreview(false);
                  }} 
                  size="lg"
                  className="w-full h-14 font-bold text-lg shadow-xl shadow-primary/30 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 animate-in zoom-in duration-300"
                >
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Unlock All {missingCount + formatCount} Errors - $4.99
                </Button>
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>One-time payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Instant access</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>No subscription</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <p className="font-medium">⚡ <strong className="text-foreground">2,847 users</strong> unlocked their reports this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Match Rate</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-black text-foreground">{score}%</span>
                <span className="text-sm text-muted-foreground font-medium">/ 100</span>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
                <AlertCircle className="h-3.5 w-3.5" />
                Target: {target}%+
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={score} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Current: {score}%</span>
              <span>Target: {target}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium mb-1">Gap to target</p>
              <p className="text-lg font-bold text-red-500">{gap > 0 ? `${gap}%` : "Target Met!"}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium mb-1">Est. fix time</p>
              <p className="text-lg font-bold text-foreground">~10 mins</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Missing {missingCount} keywords</p>
                  <p className="text-xs text-muted-foreground">Critical for ATS visibility</p>
                </div>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{formatCount} format issues</p>
                  <p className="text-xs text-muted-foreground">Parsing errors detected</p>
                </div>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={() => setShowPricing(true)} 
              className="w-full h-12 font-bold text-base shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Unlock Full Analysis - $4.99
            </Button>
            <p className="text-center text-[10px] text-muted-foreground mt-3">
              One-time payment • No subscription
            </p>
          </div>
        </div>

        <div className="bg-muted/30 p-6 border-t border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            What you get for $4.99:
          </p>
          <div className="space-y-2.5">
            {[
              "List of all missing keywords",
              "Exact sections to add them",
              "Format issues with specific fixes",
              "💎 AI Metric Suggestions for your tech stack",
              "Downloadable PDF report",
              "Priority email support"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="h-4 w-4 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-2.5 w-2.5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> Recent Success Stories
        </h3>
        <div className="grid gap-3">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />)}
            </div>
            <p className="text-xs text-foreground leading-relaxed mb-2">
              "I was stuck at 65% match. Unlocked the report, added the missing keywords, and got an interview request the next morning."
            </p>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">Sarah J. • Hired at TechCorp</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />)}
            </div>
            <p className="text-xs text-foreground leading-relaxed mb-2">
              "The format checker found a table that was breaking my resume. Fixed it in 5 mins."
            </p>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-muted overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" alt="Mike" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">Mike T. • Product Manager</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
