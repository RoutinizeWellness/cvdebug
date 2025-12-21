import { Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface TargetInsightProps {
  company: string;
  atsSystem: string;
  tips?: string[];
}

export function TargetInsight({ company, atsSystem, tips }: TargetInsightProps) {
  const defaultTips = [
    `${atsSystem} parses single-column layouts better.`,
    "Ensure date formats are MM/YYYY.",
    "Avoid images in the header area.",
  ];

  const displayTips = tips || defaultTips;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Badge className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 cursor-help transition-all duration-300 px-3 py-1.5 rounded-full">
          <Info className="h-3 w-3 mr-1.5" />
          Targeting {company} via {atsSystem} ATS
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-[#0A0A0A] border-blue-500/30 text-slate-200 p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Info className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ATS Optimization Tips</h4>
              <p className="text-xs text-slate-400">{atsSystem} System</p>
            </div>
          </div>
          <ul className="space-y-2">
            {displayTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 border-t border-slate-800">
            <p className="text-[10px] text-slate-500 italic">
              These tips are specific to {atsSystem} and will maximize your parsing success rate.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
