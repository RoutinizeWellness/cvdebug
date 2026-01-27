import { AlertTriangle, AlertCircle, XCircle } from "lucide-react";

interface CriticalIssuesProps {
  issues: Array<{
    type: string;
    message: string;
  }>;
}

export function CriticalIssues({ issues }: CriticalIssuesProps) {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-950/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
        <h3 className="font-bold text-red-400">Critical Issues Detected</h3>
        <span className="ml-auto bg-[#EF4444]/20 text-red-400 text-xs font-bold px-2 py-1 rounded-full">
          {issues.length} Errors
        </span>
      </div>
      <div className="space-y-2">
        {issues.map((issue, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-red-200/80 bg-red-950/20 p-2 rounded border border-red-900/30">
            <XCircle className="h-4 w-4 text-[#EF4444] mt-0.5 shrink-0" />
            <span>{issue.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}