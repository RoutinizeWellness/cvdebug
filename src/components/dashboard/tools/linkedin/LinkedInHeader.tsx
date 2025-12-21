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
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          LinkedIn SEO Audit
        </h1>
        <p className="text-zinc-400 max-w-xl">
          Recruiter Visibility Analysis. Last scan completed {lastScanned}.
        </p>
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline"
          className="border-zinc-700 bg-transparent hover:bg-zinc-800 text-white"
        >
          <History className="h-4 w-4 mr-2" />
          History
        </Button>
        <Button 
          onClick={onRefresh}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          Re-scan Profile
        </Button>
      </div>
    </div>
  );
}