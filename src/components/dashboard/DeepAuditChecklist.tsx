import { useState } from "react";
import { ChevronDown, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuditItem {
  title: string;
  status: "passed" | "failed" | "warning";
  reason?: string;
  fix?: string;
}

interface DeepAuditChecklistProps {
  items: AuditItem[];
}

export function DeepAuditChecklist({ items }: DeepAuditChecklistProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-[#22C55E]" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-[#EF4444]" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-[#F59E0B]" />;
      default:
        return <AlertCircle className="h-5 w-5 text-zinc-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <span className="px-2 py-1 rounded-md bg-green-900/40 border border-green-500/30 text-green-400 text-xs font-medium">Passed</span>;
      case "failed":
        return <span className="px-2 py-1 rounded-md bg-red-900/40 border border-red-500/30 text-red-400 text-xs font-medium">Failed</span>;
      case "warning":
        return <span className="px-2 py-1 rounded-md bg-yellow-900/40 border border-yellow-500/30 text-yellow-400 text-xs font-medium">Warning</span>;
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-stone-800 text-[#0F172A]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-[#0F172A]">Formatting Audit</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-stone-800/50 border border-stone-700">
            {getStatusIcon(item.status)}
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0F172A]">{item.title}</p>
              {item.status === "passed" ? (
                <p className="text-xs text-stone-500">Correct format for ATS.</p>
              ) : (
                <p className="text-xs text-red-400">{item.reason}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}