import { Lightbulb, Sparkles } from "lucide-react";

interface AIProTipProps {
  tip: string;
}

export function AIProTip({ tip }: AIProTipProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-teal-500/30 bg-gradient-to-br from-purple-900/20 to-slate-900 p-6">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-teal-500/20 blur-2xl" />
      
      <div className="relative flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
            AI Pro Tip
            <span className="text-[10px] bg-teal-500 text-[#0F172A] px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
          </h3>
          <p className="mt-2 text-sm text-[#475569] leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </div>
  );
}