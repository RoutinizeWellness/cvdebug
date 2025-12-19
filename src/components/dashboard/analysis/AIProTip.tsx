import { Sparkles } from "lucide-react";

interface AIProTipProps {
  tip: string;
  category?: string;
}

export function AIProTip({ tip, category = "General" }: AIProTipProps) {
  return (
    <div className="glass-card rounded-lg p-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-primary/20 text-primary border border-primary/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">AI Pro Tip</h3>
          <span className="ml-auto text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded-md border border-primary/30">
            {category}
          </span>
        </div>

        <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          {tip}
        </p>
      </div>
    </div>
  );
}
