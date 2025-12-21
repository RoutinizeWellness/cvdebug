import { AlertTriangle, ShieldCheck, FileWarning, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface ImageTrapAlertProps {
  textLayerIntegrity: number;
  hasImageTrap: boolean;
  resumeId?: string; // Optional for now to maintain compatibility
}

export function ImageTrapAlert({ textLayerIntegrity, hasImageTrap, resumeId }: ImageTrapAlertProps) {
  const [isSanitizing, setIsSanitizing] = useState(false);
  const sanitizePdf = useMutation(apiAny.resumes.sanitizePdf);

  // Only show if there's a problem
  if (textLayerIntegrity >= 95 && !hasImageTrap) return null;

  const handleSanitize = async () => {
    if (!resumeId) {
        toast.error("Cannot sanitize: Resume ID missing");
        return;
    }
    
    setIsSanitizing(true);
    try {
      await sanitizePdf({ id: resumeId as any });
      toast.success("PDF Sanitized successfully!", {
        description: "Text layer integrity has been restored."
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sanitize PDF");
    } finally {
      setIsSanitizing(false);
    }
  };

  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-red-500/20 rounded-full">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            ⚠️ RED ALERT: Your latest edit broke your PDF encoding.
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] uppercase tracking-wider">
              Critical
            </span>
          </h3>
          <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
            Engineers from the company will see a blank page. The text layer integrity is {textLayerIntegrity}%.
          </p>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <Button 
              size="sm" 
              variant="destructive" 
              className="font-bold shadow-lg shadow-red-900/20"
              onClick={handleSanitize}
              disabled={isSanitizing || !resumeId}
            >
              {isSanitizing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sanitizing...</>
              ) : (
                <><ShieldCheck className="mr-2 h-4 w-4" /> Click to Fix via PDF Sanitizer</>
              )}
            </Button>
            <Button size="sm" variant="outline" className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-950/30 hover:text-red-300">
              <FileWarning className="mr-2 h-4 w-4" />
              View Raw Text
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}