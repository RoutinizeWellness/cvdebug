import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface AuditItem {
  title: string;
  status: "passed" | "failed" | "warning";
  reason: string;
  fix: string;
  severity: "low" | "medium" | "high";
}

interface FormattingAuditProps {
  items: AuditItem[];
}

export function FormattingAudit({ items }: FormattingAuditProps) {
  const getStatusIcon = (status: string, severity: string) => {
    if (status === "passed") return <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />;
    if (status === "failed") return <XCircle className="h-5 w-5 text-[#EF4444]" />;
    return <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />;
  };

  const getStatusStyles = (status: string, severity: string) => {
    if (status === "passed") return "bg-green-50 border-green-100 text-green-700";
    if (status === "failed") return "bg-red-50 border-red-100 text-red-700";
    return "bg-orange-50 border-orange-100 text-orange-700";
  };

  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1E293B] text-white">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">ATS Structural Integrity</h3>
            <p className="text-xs text-[#64748B]">Deep scan for "ATS-Killer" formatting issues</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative overflow-hidden rounded-xl border-2 p-5 transition-all hover:shadow-md ${item.status === "passed"
                ? "bg-white border-[#E2E8F0]"
                : item.status === "failed"
                  ? "bg-white border-red-100 shadow-[0_0_20px_-5px_rgba(239,68,68,0.1)]"
                  : "bg-white border-orange-100"
              }`}
          >
            {/* Status Indicator Strip */}
            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${item.status === "passed" ? "bg-[#22C55E]" : item.status === "failed" ? "bg-[#EF4444]" : "bg-[#F59E0B]"
              }`} />

            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full shrink-0 ${item.status === "passed" ? "bg-green-100/50" : item.status === "failed" ? "bg-red-100/50" : "bg-orange-100/50"
                }`}>
                {getStatusIcon(item.status, item.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-[#0F172A] truncate">{item.title}</h4>
                  {item.status !== "passed" && (
                    <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${item.severity === "high" ? "bg-red-500 text-white" : "bg-orange-400 text-white"
                      }`}>
                      {item.severity} Risk
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#475569] leading-relaxed mb-3">
                  {item.reason}
                </p>

                {item.status !== "passed" && (
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-3 w-3 text-[#22C55E]" />
                      <span className="text-[10px] font-bold text-[#1E293B] uppercase tracking-wider">Expert Fix</span>
                    </div>
                    <p className="text-xs text-[#64748B] italic leading-relaxed">
                      "{item.fix}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#334155] text-white">
        <h5 className="text-sm font-bold mb-1 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
          ATS Compatibility Score
        </h5>
        <p className="text-xs text-slate-300">
          Your formatting is {Math.round((items.filter(i => i.status === "passed").length / items.length) * 100)}% optimized for modern enterprise parsers.
        </p>
      </div>
    </div>
  );
}
