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
        <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Formatting Audit</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className={`flex items-start gap-3 p-3 rounded-xl border ${
              item.status === "passed" 
                ? "bg-stone-50 dark:bg-stone-800/50 border-stone-100 dark:border-stone-700"
                : "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30"
            }`}
          >
            {item.status === "passed" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            )}
            <div>
              <p className="text-sm font-bold text-stone-900 dark:text-white">{item.title}</p>
              <p className={`text-xs ${
                item.status === "passed" ? "text-stone-500" : "text-red-600 dark:text-red-400"
              }`}>
                {item.status === "passed" ? item.reason : item.fix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
