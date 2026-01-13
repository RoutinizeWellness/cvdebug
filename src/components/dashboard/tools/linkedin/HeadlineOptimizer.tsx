import { Copy, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface HeadlineOptimizerProps {
  currentHeadline: string;
  optimizedHeadline: string;
}

export function HeadlineOptimizer({ currentHeadline, optimizedHeadline }: HeadlineOptimizerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedHeadline);
    setCopied(true);
    toast.success("Headline copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0F172A] text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Headline Optimizer
        </h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Current */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-[#E2E8F0] bg-[#FFFFFF]/80">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
              <X className="h-4 w-4" />
              Current Headline
            </span>
          </div>
          <div className="p-4 rounded-lg border border-red-900/30 bg-red-900/10 text-gray-300 font-mono text-sm leading-relaxed">
            {currentHeadline}
          </div>
          <p className="mt-3 text-xs text-red-400/80">
            Analysis: Too generic. Misses specific stack and value proposition.
          </p>
        </div>

        {/* Optimized */}
        <div className="p-6 bg-slate-950/50 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              AI Recommendation
            </span>
            <button 
              onClick={handleCopy}
              className="text-xs flex items-center gap-1 text-[#0F172A] hover:text-primary transition-colors"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-[#0F172A] font-mono text-sm leading-relaxed shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            {optimizedHeadline}
          </div>
          <p className="mt-3 text-xs text-primary/80">
            Improvement: Includes high-value keywords and role seniority.
          </p>
        </div>
      </div>
    </div>
  );
}