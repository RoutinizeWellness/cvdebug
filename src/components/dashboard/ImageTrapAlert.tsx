import { AlertTriangle, ShieldCheck, FileWarning, RefreshCw, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface ImageTrapAlertProps {
  textLayerIntegrity: number;
  hasImageTrap: boolean;
  resumeId?: string;
  hasActiveSprint?: boolean;
}

export function ImageTrapAlert({ textLayerIntegrity, hasImageTrap, resumeId, hasActiveSprint }: ImageTrapAlertProps) {
  const [isSanitizing, setIsSanitizing] = useState(false);
  const sanitizePdf = useMutation(apiAny.resumes.sanitizePdf);

  // Only show if there's a problem
  if (textLayerIntegrity >= 95 && !hasImageTrap) return null;

  const isIntegrityIssue = textLayerIntegrity < 95;
  
  const title = isIntegrityIssue 
    ? "⚠️ RED ALERT: Your latest edit broke your PDF encoding."
    : "⚠️ ATS WARNING: Hidden text or formatting anomalies detected.";
    
  const description = isIntegrityIssue
    ? `Engineers from the company will see a blank page. The text layer integrity is ${textLayerIntegrity}%.`
    : `Your text layer is intact (${textLayerIntegrity}%), but we detected potential 'keyword stuffing' or hidden text layers that will flag your resume as spam.`;

  const badgeText = isIntegrityIssue ? "Critical" : "Suspicious";
  const badgeColor = isIntegrityIssue ? "bg-[#EF4444]" : "bg-[#F59E0B]";
  const borderColor = isIntegrityIssue ? "border-red-500/30" : "border-amber-500/30";
  const bgColor = isIntegrityIssue ? "bg-[#EF4444]/10" : "bg-[#F59E0B]/10";
  const iconBg = isIntegrityIssue ? "bg-[#EF4444]/20" : "bg-[#F59E0B]/20";
  const iconColor = isIntegrityIssue ? "text-[#EF4444]" : "text-[#F59E0B]";

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
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-4 animate-in fade-in slide-in-from-top-2`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 ${iconBg} rounded-full`}>
          <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            {title}
            <span className={`px-2 py-0.5 rounded-full ${badgeColor} text-[#0F172A] text-[10px] uppercase tracking-wider`}>
              {badgeText}
            </span>
          </h3>
          <p className="text-sm text-zinc-300 mt-1 leading-relaxed">
            {description}
          </p>
          
          {hasActiveSprint && (
            <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <p className="text-xs text-primary font-medium">
                <strong>Interview Sprint Active:</strong> Continuous PDF sanitization will auto-fix this within 5 minutes.
              </p>
            </div>
          )}
          
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              size="sm"
              variant="destructive"
              className="font-bold shadow-lg shadow-red-900/20 relative"
              onClick={handleSanitize}
              disabled={isSanitizing || !resumeId}
            >
              {isSanitizing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rebuilding PDF...</>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  One-Click Fix (3 sec)
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    FAST
                  </span>
                </>
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