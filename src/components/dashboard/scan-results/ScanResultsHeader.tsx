import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ScanResultsHeaderProps {
  scanId: string;
  jobTitle: string;
  scanDate: string;
  processingTime?: string;
  hasIssues: boolean;
  onShare?: () => void;
  onExportPDF?: () => void;
}

export function ScanResultsHeader({
  scanId,
  jobTitle,
  scanDate,
  processingTime = "1.4s",
  hasIssues,
  onShare,
  onExportPDF,
}: ScanResultsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">
            SCAN #{scanId}
          </span>
          {hasIssues && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF4444]/10 text-red-400 border border-red-500/20 animate-pulse">
              CRITICAL ISSUES FOUND
            </span>
          )}
        </div>
        <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">
          Scan Results: {jobTitle}
        </h2>
        <p className="text-[#64748B] text-sm mt-1">
          Analyzed on {scanDate} • {processingTime} processing time
        </p>
      </div>
      <div className="flex gap-3">
        {onShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
        {onExportPDF && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportPDF}
            className="text-[#475569] hover:text-[#0F172A] transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        )}
      </div>
    </motion.div>
  );
}
