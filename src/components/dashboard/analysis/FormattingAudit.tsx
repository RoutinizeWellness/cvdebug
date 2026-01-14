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
    <div className="lg:col-span-4 rounded-lg p-6 flex flex-col gap-4 bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-[#22C55E]/10">
          <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A]">Formatting Audit</h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              item.status === "passed"
                ? "bg-[#F8FAFC] border-[#E2E8F0]"
                : "bg-[#EF4444]/5 border-[#EF4444]/20"
            }`}
          >
            {item.status === "passed" ? (
              <CheckCircle2 className="h-5 w-5 text-[#22C55E] shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-[#EF4444] shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0F172A] mb-1">{item.title}</p>
              <p className={`text-xs leading-relaxed ${
                item.status === "passed" ? "text-[#64748B]" : "text-[#EF4444]"
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
