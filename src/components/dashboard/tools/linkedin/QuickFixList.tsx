import { CheckCircle2, Check, X } from "lucide-react";

interface QuickFix {
  tip: string;
  completed?: boolean;
}

interface QuickFixListProps {
  tips: Array<string | QuickFix>;
}

export function QuickFixList({ tips }: QuickFixListProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        Quick Fixes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.slice(0, 6).map((tip, i) => {
          const tipText = typeof tip === 'string' ? tip : tip.tip;
          const isDone = typeof tip === 'object' && tip.completed === true;
          
          return (
            <div 
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                isDone 
                  ? 'bg-green-500/5 border-green-500/10' 
                  : 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10 transition-colors cursor-pointer group'
              }`}
            >
              <div className={`rounded-full p-0.5 mt-0.5 ${
                isDone 
                  ? 'bg-green-500 text-white' 
                  : 'bg-zinc-900 border border-red-500 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors'
              }`}>
                {isDone ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${isDone ? 'text-white/70 line-through' : 'text-white font-bold'}`}>
                  {tipText}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
