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
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
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
    <div className="bg-white/[0.03] backdrop-blur border border-white/[0.08] rounded-2xl p-6 shadow-lg">
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="border border-zinc-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <span className="text-sm font-medium text-zinc-100">{item.title}</span>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(item.status)}
                <ChevronDown 
                  className={`h-4 w-4 text-zinc-400 transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                />
              </div>
            </button>
            
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 border-t border-zinc-800 space-y-3">
                    {item.reason && (
                      <div className="bg-zinc-800/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-zinc-400 mb-1">Why it failed:</p>
                        <p className="text-sm text-zinc-300 leading-relaxed">{item.reason}</p>
                      </div>
                    )}
                    {item.fix && (
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-xs font-medium text-blue-400 mb-1">How to fix:</p>
                        <p className="text-sm text-zinc-300 leading-relaxed">{item.fix}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
