import { Button } from "@/components/ui/button";
import { History, RefreshCw } from "lucide-react";

interface LinkedInHeaderProps {
  lastScanned: string;
  linkedinUrl?: string;
  isAnalyzing: boolean;
  onRefresh: () => void;
}

export function LinkedInHeader({ lastScanned, linkedinUrl, isAnalyzing, onRefresh }: LinkedInHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2 font-display">
          LinkedIn SEO Audit
        </h1>
        <p className="text-slate-400 max-w-xl">
          Recruiter Visibility Analysis. Last scan completed <span className="text-slate-300 font-mono">{lastScanned}</span>.
        </p>
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline"
          className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white"
        >
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
        <Button 
          onClick={onRefresh}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all border border-blue-500/20"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          Re-scan Profile
        </Button>
      </div>
    </div>
  );
}