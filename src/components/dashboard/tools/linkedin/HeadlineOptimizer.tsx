import { Edit, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface HeadlineOptimizerProps {
  current?: string;
  suggested?: string;
  critique?: string;
}

export function HeadlineOptimizer({ current, suggested, critique }: HeadlineOptimizerProps) {
  const [currentText, setCurrentText] = useState(current || "Software Engineer | React | Node | Looking for opportunities");
  const suggestedText = suggested || "Senior Full Stack Engineer | Building Scalable SaaS | React, Node.js, AWS Expert";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleApply = () => {
    setCurrentText(suggestedText);
    toast.success("Headline applied! Copy this to your LinkedIn profile.");
  };

  const currentWordCount = currentText.split(/\s+/).length;
  const suggestedWordCount = suggestedText.split(/\s+/).length;

  return (
    <div className="lg:col-span-2 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-1">
            <Edit className="h-5 w-5 text-primary" />
            Headline Sandbox
          </h3>
          <p className="text-zinc-400 text-sm">Compare your current headline against our AI-optimized version.</p>
        </div>
        <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          +15% Impact
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Current Version */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Current Version
          </label>
          <div className="relative group">
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="w-full h-32 bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 text-zinc-300 font-mono text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              spellCheck={false}
            />
            <div className="absolute bottom-3 right-3">
              <span className="text-xs text-zinc-500">{currentWordCount * 5}/220</span>
            </div>
          </div>
        </div>

        {/* Optimized Version */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Suggested Version
          </label>
          <div className="relative">
            <div className="w-full h-32 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-primary/30 rounded-lg p-4 font-mono text-sm overflow-y-auto relative">
              <span className="text-white">Senior Full Stack Engineer</span>
              <span className="text-zinc-500"> | </span>
              <span className="text-emerald-400 bg-emerald-500/10 px-1 rounded">Building Scalable SaaS</span>
              <span className="text-zinc-500"> | </span>
              <span className="text-white">React, Node.js, AWS Expert</span>
            </div>
            <button 
              onClick={handleApply}
              className="absolute bottom-3 right-3 text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 rounded border border-zinc-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}