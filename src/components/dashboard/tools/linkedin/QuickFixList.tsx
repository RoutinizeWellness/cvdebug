import { CheckCircle2, X } from "lucide-react";

interface QuickFix {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface QuickFixListProps {
  fixes: QuickFix[];
}

export function QuickFixList({ fixes }: QuickFixListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-slate-900 font-bold text-lg mb-6 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        Quick Fixes
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixes.map((fix) => (
          <div
            key={fix.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              fix.completed
                ? "bg-green-500/5 border border-green-500/10"
                : "bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 cursor-pointer group"
            }`}
          >
            <div
              className={`rounded-full p-0.5 mt-0.5 ${
                fix.completed
                  ? "bg-green-500 text-slate-900"
                  : "bg-white border border-red-500 text-red-500 group-hover:bg-red-500 group-hover:text-slate-900 transition-colors"
              }`}
            >
              {fix.completed ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  fix.completed
                    ? "text-slate-900 line-through decoration-white/30 text-opacity-70"
                    : "text-slate-900 font-bold"
                }`}
              >
                {fix.title}
              </p>
              {fix.description && !fix.completed && (
                <p className="text-xs text-slate-500 mt-1">{fix.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}