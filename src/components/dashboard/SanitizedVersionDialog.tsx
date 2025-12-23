import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Download, FileText, AlertTriangle } from "lucide-react";

const apiAny = api as any;

interface SanitizedVersionDialogProps {
  resumeId: Id<"resumes"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SanitizedVersionDialog({ resumeId, open, onOpenChange }: SanitizedVersionDialogProps) {
  const [sanitizedData, setSanitizedData] = useState<{ cleanedText: string; instructions: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateSanitized = useMutation(apiAny.resumes.generateSanitizedVersion);

  const handleGenerate = async () => {
    if (!resumeId) return;
    
    setIsGenerating(true);
    try {
      const result = await generateSanitized({ resumeId });
      setSanitizedData(result);
      toast.success("Sanitized version generated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate sanitized version");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (sanitizedData) {
      navigator.clipboard.writeText(sanitizedData.cleanedText);
      toast.success("Text copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (sanitizedData) {
      const blob = new Blob([sanitizedData.cleanedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sanitized-resume.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded sanitized text!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-primary" />
            Generate Sanitized Version
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Remove hidden layers and encoding issues that cause ATS parsing problems
          </DialogDescription>
        </DialogHeader>

        {!sanitizedData ? (
          <div className="space-y-4 py-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-500">Image Trap Detected</h4>
                <p className="text-sm text-slate-300">
                  Your resume contains hidden layers or encoding issues that may prevent ATS systems from reading it correctly.
                </p>
                <p className="text-sm text-slate-400">
                  This tool will extract the clean text content so you can paste it into a fresh template.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
            >
              {isGenerating ? "Generating..." : "Generate Clean Version"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-400 font-medium">
                ✓ {sanitizedData.instructions}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Clean Text Content</label>
              <Textarea 
                value={sanitizedData.cleanedText}
                readOnly
                className="min-h-[300px] bg-slate-950 border-slate-800 text-slate-200 font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCopy}
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button 
                onClick={handleDownload}
                variant="outline"
                className="flex-1 border-slate-700 hover:bg-slate-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Download as TXT
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h4 className="font-semibold text-blue-400 mb-2">Next Steps:</h4>
              <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                <li>Copy the text above</li>
                <li>Open a fresh Google Docs or Word document</li>
                <li>Paste the text and apply clean formatting</li>
                <li>Save as PDF using "Print to PDF" or "Save As PDF"</li>
                <li>Upload the new version to CVDebug for verification</li>
              </ol>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
