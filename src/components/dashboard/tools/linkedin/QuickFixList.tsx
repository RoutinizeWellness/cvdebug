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
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6">
      <h3 className="text-[#0F172A] font-bold text-lg mb-6 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
        Quick Fixes
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixes.map((fix) => (
          <div
            key={fix.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
              fix.completed
                ? "bg-[#22C55E]/5 border border-green-500/10"
                : "bg-[#EF4444]/5 border border-red-500/10 hover:bg-[#EF4444]/10 cursor-pointer group"
            }`}
          >
            <div
              className={`rounded-full p-0.5 mt-0.5 ${
                fix.completed
                  ? "bg-[#22C55E] text-[#0F172A]"
                  : "bg-[#FFFFFF] border border-red-500 text-[#EF4444] group-hover:bg-[#EF4444] group-hover:text-[#0F172A] transition-colors"
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
                    ? "text-[#0F172A] line-through decoration-white/30 text-opacity-70"
                    : "text-[#0F172A] font-bold"
                }`}
              >
                {fix.title}
              </p>
              {fix.description && !fix.completed && (
                <p className="text-xs text-[#64748B] mt-1">{fix.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}