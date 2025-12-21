import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";

interface LinkedInHeaderProps {
  lastScanned: string;
  linkedinUrl?: string;
  isAnalyzing: boolean;
  onRefresh: () => void;
}

export function LinkedInHeader({ lastScanned, linkedinUrl, isAnalyzing, onRefresh }: LinkedInHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
          LinkedIn Profile Audit
        </h1>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <Calendar className="h-4 w-4" />
          <span>Last scanned: {lastScanned}</span>
          {linkedinUrl && (
            <>
              <span className="mx-1">•</span>
              <span className="truncate max-w-[200px]">{linkedinUrl}</span>
            </>
          )}
        </div>
      </div>
      <Button 
        onClick={onRefresh}
        disabled={isAnalyzing}
        className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-6 rounded-lg shadow-lg shadow-primary/20"
      >
        <RefreshCw className={`h-5 w-5 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
        Re-scan Profile
      </Button>
    </div>
  );
}
