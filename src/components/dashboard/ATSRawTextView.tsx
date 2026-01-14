import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ATSRawTextViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ocrText: string;
  resumeTitle: string;
}

export function ATSRawTextView({ open, onOpenChange, ocrText, resumeTitle }: ATSRawTextViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ocrText);
    setCopied(true);
    toast.success("Raw text copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([ocrText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeTitle}_ATS_RAW.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Raw text downloaded");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-[#FFFFFF] border-[#E2E8F0]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30">
              <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-[#0F172A]">
                ATS Recruiter View (Raw Text)
              </DialogTitle>
              <DialogDescription className="text-[#64748B] mt-1">
                This is what automated systems actually see. No formatting, no columns, no design.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#F59E0B]">⚠️ Reality Check</span>
            </div>
            <span className="text-xs text-[#F59E0B]">
              If this looks broken, the ATS will reject you automatically
            </span>
          </div>

          <div className="flex-1 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-6 overflow-y-auto font-mono text-xs text-[#475569] leading-relaxed whitespace-pre-wrap">
            {ocrText || "No text extracted. This resume might be unreadable by ATS systems."}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Raw Text"}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as .txt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
