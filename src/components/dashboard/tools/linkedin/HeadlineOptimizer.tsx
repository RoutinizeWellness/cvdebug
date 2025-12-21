import { FileText, X, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";

interface HeadlineOptimizerProps {
  current?: string;
  suggested?: string;
  critique?: string;
}

export function HeadlineOptimizer({ current, suggested, critique }: HeadlineOptimizerProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Headline Optimizer
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Current */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-900/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
              <X className="h-4 w-4" /> Current Headline
            </span>
          </div>
          <div className="p-4 rounded-lg border border-red-900/30 bg-red-900/10 text-zinc-300 font-mono text-sm leading-relaxed">
            {current || "Software Engineer looking for new opportunities in tech."}
          </div>
          <p className="mt-3 text-xs text-red-400/80">
            {critique || "Analysis: Too generic. Misses specific stack and value proposition."}
          </p>
        </div>

        {/* Optimized */}
        <div className="p-6 bg-black/50 relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Sparkles className="h-4 w-4" /> AI Recommendation
            </span>
            <button 
              onClick={() => handleCopy(suggested || "")}
              className="text-xs flex items-center gap-1 text-white hover:text-primary transition-colors"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-white font-mono text-sm leading-relaxed shadow-[0_0_15px_rgba(124,59,237,0.1)]">
            {suggested || "Senior Frontend Engineer | React, TypeScript, Next.js | Building Scalable SaaS Architectures"}
          </div>
          <p className="mt-3 text-xs text-primary/80">
            Improvement: Includes high-value keywords and role seniority.
          </p>
        </div>
      </div>
    </div>
  );
}
