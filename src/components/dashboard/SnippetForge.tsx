import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SnippetForgeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyword: string;
  suggestions: Array<{
    text: string;
    metrics?: string[];
    context?: string;
  }>;
}

export function SnippetForge({ open, onOpenChange, keyword, suggestions }: SnippetForgeProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInsert = (text: string) => {
    // This would integrate with a CV editor in the future
    toast.success("Ready to insert into CV", {
      description: "Copy this text and paste it into your resume editor",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border border-slate-200 text-slate-900 max-w-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            AI Rewrite: <span className="text-emerald-400">{keyword}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Processing glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-black/50 border border-slate-200 rounded-lg p-4 hover:border-emerald-500/30 transition-all duration-300">
                <p className="text-sm text-slate-700 leading-relaxed mb-3 font-mono">
                  {suggestion.text}
                </p>

                {suggestion.metrics && suggestion.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {suggestion.metrics.map((metric, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                )}

                {suggestion.context && (
                  <p className="text-xs text-slate-500 italic mb-3 border-l-2 border-slate-200 pl-2">
                    {suggestion.context}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(suggestion.text, index)}
                    className="flex-1 bg-white/50 hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInsert(suggestion.text)}
                    className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Insert into CV
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-white/50 border border-slate-200 rounded-lg">
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span className="font-bold text-emerald-400">Pro Tip:</span>
            These AI-generated phrases are optimized for ATS parsing and recruiter readability
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
