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
        <Badge className="bg-[#3B82F6]/10 border-[#3B82F6]/30 text-[#94A3B8] hover:bg-[#3B82F6]/20 cursor-help transition-all duration-300 px-3 py-1.5 rounded-full">
          <Info className="h-3 w-3 mr-1.5" />
          Targeting {company} via {atsSystem} ATS
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-[#0A0A0A] border-[#3B82F6]/30 text-[#475569] p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
              <Info className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">ATS Optimization Tips</h4>
              <p className="text-xs text-[#64748B]">{atsSystem} System</p>
            </div>
          </div>
          <ul className="space-y-2">
            {displayTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-[#475569]">
                <span className="text-[#94A3B8] mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 border-t border-[#E2E8F0]">
            <p className="text-[10px] text-[#64748B] italic">
              These tips are specific to {atsSystem} and will maximize your parsing success rate.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
