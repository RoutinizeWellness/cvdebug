import { useState } from "react";
import { ChevronDown, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Fix {
  title: string;
  description: string;
  impact: string;
  example: string;
}

interface ActionableFixesProps {
  fixes: Fix[];
}

export function ActionableFixes({ fixes }: ActionableFixesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-white">
          <Zap className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Actionable Fixes</h3>
        <span className="ml-auto text-xs font-bold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded-md">
          {fixes.length} Issues
        </span>
      </div>

      <div className="space-y-3">
        {fixes.map((fix, index) => (
          <div
            key={index}
            className="border border-stone-700 rounded-lg overflow-hidden bg-zinc-950"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <span className="font-bold text-zinc-100">{fix.title}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-zinc-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-3 border-t border-stone-700">
                    <div>
                      <p className="text-sm text-zinc-300 mb-2">
                        {fix.description}
                      </p>
                    </div>

                    <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
                      <div className="flex items-start gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-white mb-1">
                            Impact
                          </p>
                          <p className="text-xs text-white">
                            {fix.impact}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs font-bold text-primary mb-1">
                        Example Fix
                      </p>
                      <p className="text-xs text-zinc-300 font-mono">
                        {fix.example}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}