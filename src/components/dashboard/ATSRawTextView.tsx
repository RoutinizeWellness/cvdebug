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
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-slate-950 border-slate-800">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-white">
                ATS Recruiter View (Raw Text)
              </DialogTitle>
              <DialogDescription className="text-slate-400 mt-1">
                This is what automated systems actually see. No formatting, no columns, no design.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-amber-400">⚠️ Reality Check</span>
            </div>
            <span className="text-xs text-amber-300">
              If this looks broken, the ATS will reject you automatically
            </span>
          </div>

          <div className="flex-1 bg-black/50 rounded-lg border border-slate-800 p-6 overflow-y-auto custom-scrollbar font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {ocrText || "No text extracted. This resume might be unreadable by ATS systems."}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 border-slate-700 hover:bg-slate-800"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Raw Text"}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1 border-slate-700 hover:bg-slate-800"
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
