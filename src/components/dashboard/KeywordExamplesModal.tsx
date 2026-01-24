import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Copy, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface KeywordExample {
  category: string;
  bullet: string;
  icon: string;
  color: string;
}

interface KeywordExamplesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyword: string;
  role?: string;
}

export function KeywordExamplesModal({ open, onOpenChange, keyword, role = "Senior Engineer" }: KeywordExamplesModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate contextual examples based on keyword and role
  const generateExamples = (keyword: string): KeywordExample[] => {
    // This would ideally use AI, but for now we'll have smart templates
    const templates = {
      technical: {
        icon: "code",
        color: "#64748B",
        template: `Architected and deployed ${keyword}-based solutions, reducing system latency by 45% and improving reliability to 99.9% uptime`
      },
      scalability: {
        icon: "trending_up",
        color: "#8B5CF6",
        template: `Leveraged ${keyword} to scale infrastructure supporting 10M+ daily users, cutting operational costs by $120K annually`
      },
      process: {
        icon: "settings",
        color: "#22C55E",
        template: `Standardized ${keyword} workflows across 5 teams, eliminating deployment bottlenecks and reducing time-to-production by 60%`
      }
    };

    return [
      {
        category: "Technical Excellence",
        bullet: templates.technical.template,
        icon: templates.technical.icon,
        color: templates.technical.color
      },
      {
        category: "Scalability & Impact",
        bullet: templates.scalability.template,
        icon: templates.scalability.icon,
        color: templates.scalability.color
      },
      {
        category: "Process & Leadership",
        bullet: templates.process.template,
        icon: templates.process.icon,
        color: templates.process.color
      }
    ];
  };

  const examples = generateExamples(keyword);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <DialogHeader className="border-b border-[#E2E8F0] pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-[#0F172A]">
                How to Use: <span className="text-[#8B5CF6]">{keyword}</span>
              </DialogTitle>
              <p className="text-sm text-[#64748B]">
                Senior-level examples that integrate this keyword naturally (no keyword stuffing)
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-[#F3E8FF] to-[#EFF6FF] border border-[#E2E8F0] rounded-lg p-4 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[#475569]">
            <strong className="text-[#0F172A]">Pro Tip:</strong> Each example follows the STAR format and includes quantifiable metrics.
            Click to copy, then customize the numbers to match your actual experience.
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4 mt-6">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 hover:border-[#8B5CF6] hover:shadow-[0_4px_20px_-4px_rgba(139,92,246,0.15)] transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${example.color}15` }}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ color: example.color }}
                  >
                    {example.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{example.category}</h3>
                  <p className="text-xs text-[#64748B]">Impact-focused approach</p>
                </div>
              </div>

              {/* Bullet Example */}
              <div className="relative bg-white rounded-lg border border-[#E2E8F0] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0F172A] mt-2"></div>
                  <p className="text-[#0F172A] text-sm leading-relaxed flex-1">
                    {example.bullet}
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopy(example.bullet, index)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#8B5CF6] hover:bg-[#F3E8FF] transition-all group/btn"
                >
                  <AnimatePresence mode="wait">
                    {copiedIndex === index ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-4 w-4 text-[#64748B] group-hover/btn:text-[#8B5CF6]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Highlight Keywords */}
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-[#64748B]">Key elements:</span>
                <span className="px-2 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] font-medium border border-[#8B5CF6]/20">
                  {keyword}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] font-medium border border-[#22C55E]/20">
                  Quantified
                </span>
                <span className="px-2 py-0.5 rounded bg-[#64748B]/10 text-[#64748B] font-medium border border-[#64748B]/20">
                  Action Verb
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <p className="text-xs text-[#64748B]">
            💡 Remember: Customize numbers based on your real achievements
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)]"
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
