import { CheckCircle2, XCircle } from "lucide-react";

interface AuditItem {
  title: string;
  status: "passed" | "failed" | "warning";
  reason: string;
  fix: string;
}

interface FormattingAuditProps {
  items: AuditItem[];
}

export function FormattingAudit({ items }: FormattingAuditProps) {
  return (
    <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-stone-100 text-slate-900">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Formatting Audit</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              item.status === "passed" 
                ? "bg-zinc-950 border-zinc-800"
                : "bg-red-950/40 border-red-900/50"
            }`}
          >
            {item.status === "passed" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-100 mb-1">{item.title}</p>
              <p className={`text-xs leading-relaxed ${
                item.status === "passed" ? "text-zinc-400" : "text-red-200"
              }`}>
                {item.status === "passed" ? (item.reason || "Passed") : item.fix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}