import { useState } from "react";
import { ChevronDown, AlertCircle, TrendingUp, Zap, Lightbulb, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Fix {
  title: string;
  description: string;
  impact: string;
  example: string;
  missingKeyword?: string;
}

interface ActionableFixesProps {
  fixes: Fix[];
}

export function ActionableFixes({ fixes }: ActionableFixesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [generatedBullets, setGeneratedBullets] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleGenerateBulletPoint = async (keyword: string, fixIndex: number) => {
    const key = `${fixIndex}-${keyword}`;
    setGeneratingFor(key);
    
    // Simulate AI generation with realistic delay
    setTimeout(() => {
      const bulletPoints = [
        `• Developed and deployed ${keyword}-based solutions that improved system efficiency by 35% and reduced processing time`,
        `• Led cross-functional team utilizing ${keyword} to architect scalable microservices, serving 2M+ daily active users`,
        `• Implemented ${keyword} framework resulting in 40% faster deployment cycles and enhanced code maintainability`,
        `• Optimized ${keyword} infrastructure reducing operational costs by $50K annually while improving system reliability`,
      ];
      
      const randomBullet = bulletPoints[Math.floor(Math.random() * bulletPoints.length)];
      setGeneratedBullets(prev => ({ ...prev, [key]: randomBullet }));
      setGeneratingFor(null);
      toast.success(`Generated bullet point for "${keyword}"`);
    }, 1500);
  };

  const handleCopyBullet = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-stone-800">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-bold" style={{ color: '#ffffff' }}>Actionable Intelligence</h3>
        <span className="ml-auto text-xs font-bold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded-md">
          {fixes.length} Issues
        </span>
      </div>

      <div className="space-y-3">
        {fixes.map((fix, index) => {
          const key = `${index}-${fix.missingKeyword || 'general'}`;
          const hasBullet = generatedBullets[key];
          
          return (
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
                  {fix.missingKeyword && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                      Missing: {fix.missingKeyword}
                    </span>
                  )}
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

                      {fix.missingKeyword && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-primary flex items-center gap-1">
                              <Lightbulb className="h-3.5 w-3.5" />
                              AI-Generated Bullet Point
                            </p>
                            {hasBullet && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleCopyBullet(key, hasBullet)}
                              >
                                {copiedId === key ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>
                          
                          {hasBullet ? (
                            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                              {hasBullet}
                            </p>
                          ) : (
                            <Button
                              size="sm"
                              className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-8"
                              onClick={() => handleGenerateBulletPoint(fix.missingKeyword!, index)}
                              disabled={generatingFor === key}
                            >
                              {generatingFor === key ? (
                                "Generating..."
                              ) : (
                                <>
                                  <Lightbulb className="h-3 w-3 mr-1" />
                                  Generate Bullet Point with "{fix.missingKeyword}"
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}

                      {!fix.missingKeyword && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                          <p className="text-xs font-bold text-primary mb-1">
                            Example Fix
                          </p>
                          <p className="text-xs text-zinc-300 font-mono">
                            {fix.example}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}