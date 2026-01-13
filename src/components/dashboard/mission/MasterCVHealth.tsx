import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertTriangle, CheckCircle2, Upload, RefreshCw, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useState } from "react";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

interface MasterCVHealthProps {
  onUpload: () => void;
}

export function MasterCVHealth({ onUpload }: MasterCVHealthProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const sanitizePdf = useMutation(apiAny.resumes.sanitizePdf);
  const [isSanitizing, setIsSanitizing] = useState(false);

  // Get the most recent resume as the "Master CV"
  const masterResume = resumes && resumes.length > 0 ? resumes[0] : null;

  if (!masterResume) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-[#0A0A0A] p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
            <FileText className="h-6 w-6 text-zinc-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">No Master CV Found</h3>
            <p className="text-sm text-zinc-400">Upload your resume to start monitoring its health.</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="border-zinc-700 hover:bg-zinc-800 text-[#0F172A]"
          onClick={onUpload}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload CV
        </Button>
      </div>
    );
  }

  const hasImageTrap = masterResume.hasImageTrap || masterResume.textLayerIntegrity < 90;
  const integrityScore = masterResume.textLayerIntegrity || (hasImageTrap ? 0 : 100);

  const handleSanitize = async () => {
    if (!masterResume._id) return;
    setIsSanitizing(true);
    try {
      await sanitizePdf({ id: masterResume._id });
      toast.success("CV Sanitized", { description: "Text layer integrity restored." });
    } catch (error) {
      toast.error("Failed to sanitize CV");
    } finally {
      setIsSanitizing(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#0A0A0A] p-6 relative overflow-hidden group">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full blur-3xl opacity-20 ${hasImageTrap ? 'bg-[#EF4444]' : 'bg-[#22C55E]'}`} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left: Status */}
        <div className="flex items-start gap-5">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-lg ${
            hasImageTrap 
              ? 'bg-[#EF4444]/10 border-red-500/30 text-[#EF4444] shadow-red-900/20' 
              : 'bg-[#22C55E]/10 border-green-500/30 text-[#22C55E] shadow-green-900/20'
          }`}>
            {hasImageTrap ? (
              <AlertTriangle className="h-7 w-7 animate-pulse" />
            ) : (
              <ShieldCheck className="h-7 w-7" />
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">Master CV Health</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                hasImageTrap 
                  ? 'bg-[#EF4444]/10 border-red-500/30 text-[#EF4444]' 
                  : 'bg-[#22C55E]/10 border-green-500/30 text-[#22C55E]'
              }`}>
                {hasImageTrap ? 'Critical Issues' : 'System Optimal'}
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-md">
              {hasImageTrap 
                ? "IMAGE TRAP DETECTED. ATS parsers cannot read your resume. Immediate fix required." 
                : "Your CV is readable by all major ATS systems (Workday, Greenhouse, Lever)."}
            </p>
          </div>
        </div>

        {/* Right: Actions & Metrics */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right space-y-1">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Readability Score</div>
            <div className={`text-2xl font-black ${hasImageTrap ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
              {integrityScore}%
            </div>
          </div>

          <div className="h-10 w-px bg-zinc-800 hidden md:block" />

          <div className="flex flex-col gap-2">
            {hasImageTrap ? (
              <Button 
                variant="destructive" 
                className="font-bold shadow-lg shadow-red-900/20"
                onClick={handleSanitize}
                disabled={isSanitizing}
              >
                {isSanitizing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Fix Integrity Now
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-[#0F172A] font-medium"
                onClick={onUpload}
              >
                <Upload className="mr-2 h-4 w-4" /> Hot-Swap CV
              </Button>
            )}
            <div className="text-[10px] text-zinc-500 text-center">
              Last scanned: {new Date(masterResume._creationTime).toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}