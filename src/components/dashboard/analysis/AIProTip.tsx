import { Sparkles } from "lucide-react";

interface AIProTipProps {
  tip: string;
  category?: string;
}

export function AIProTip({ tip, category = "General" }: AIProTipProps) {
  return (
    <div className="bg-primary rounded-lg p-6 relative overflow-hidden">
      <div className="absolute -right-4 -top-4 text-black/10">
        <Sparkles className="h-24 w-24" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-black text-primary p-1 rounded-md">
            <Sparkles className="h-4 w-4 block" />
          </span>
          <h3 className="font-bold text-black uppercase text-xs tracking-wider">AI Pro Tip</h3>
        </div>

        <p className="text-black font-bold leading-snug">
          {tip}
        </p>
      </div>
    </div>
  );
}