import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeStatsProps {
  score: number;
  scoreBreakdown?: {
    keywords?: number;
  };
}

export function ResumeStats({ score, scoreBreakdown }: ResumeStatsProps) {
  const target = 75;
  
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Your Match Rate</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-4xl font-black ${score >= 75 ? 'text-[#22C55E]' : 'text-foreground'}`}>
              {score}%
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Target: 75%+
            </span>
          </div>
        </div>
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <Target className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <Progress value={score} className="h-2.5" />
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
          <span>Low</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
        <p className="text-xs font-medium leading-relaxed">
          {score >= 75 
            ? "🎉 You're matched! Your resume is well-optimized for this role."
            : `You're ${score}% matched! Add ${Math.max(0, 10 - (scoreBreakdown?.keywords ? Math.floor(scoreBreakdown.keywords / 10) : 0))} more keywords to hit 75%.`
          }
        </p>
        {score < 75 && (
          <Button variant="link" className="h-auto p-0 text-xs font-bold text-primary mt-2" onClick={() => document.getElementById('critical-issues')?.scrollIntoView({ behavior: 'smooth' })}>
            See What to Fix <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
