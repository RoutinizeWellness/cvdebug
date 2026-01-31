import { useState } from "react";
import { ChevronDown, AlertCircle, TrendingUp, Zap, Lightbulb, Copy, CheckCircle2, ShieldAlert, Target, Play, BrainCircuit } from "lucide-react";
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
        `• Spearheaded ${keyword} integration across legacy systems, achieving 100% data consistency and reducing error rates by 25%`,
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
    <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <BrainCircuit className="w-32 h-32" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">MISSION CRITICAL FIXES</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deep Scan Diagnostics</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1 font-mono">Status: Awaiting Action</span>
          <div className="px-3 py-1 bg-red-50 rounded-full border border-red-100">
            <span className="text-xs font-black text-red-600 uppercase tracking-wider">{fixes.length} UNRESOLVED</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {fixes.map((fix, index) => {
          const key = `${index}-${fix.missingKeyword || 'general'}`;
          const hasBullet = generatedBullets[key];
          const isExpanded = expandedIndex === index;

          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                borderColor: isExpanded ? "rgba(30, 41, 59, 1)" : "rgba(226, 232, 240, 1)",
                backgroundColor: isExpanded ? "rgba(248, 250, 252, 1)" : "rgba(255, 255, 255, 1)"
              }}
              className="border-2 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left group"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                    {fix.missingKeyword ? <Target className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                  </div>
                  <div>
                    <span className={`block font-black tracking-tight transition-colors ${isExpanded ? 'text-slate-900' : 'text-slate-600'}`}>
                      {fix.title.toUpperCase()}
                    </span>
                    {fix.missingKeyword && (
                      <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200 uppercase tracking-wider">
                        <AlertCircle className="h-3 w-3" /> Missing Skill: {fix.missingKeyword}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {!isExpanded && (
                    <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded bg-slate-50">
                      View Fix
                    </span>
                  )}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                  >
                    <ChevronDown className={`h-5 w-5 transition-colors ${isExpanded ? 'text-slate-900' : 'text-slate-300'}`} />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 space-y-5 border-t border-slate-200/50">
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BrainCircuit className="h-4 w-4 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AI DIAGNOSTIC</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          {fix.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-1 pt-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">IMPACT SCORE</p>
                              <p className="text-xs text-slate-700 font-bold leading-tight">
                                {fix.impact}
                              </p>
                            </div>
                          </div>
                        </div>

                        {fix.missingKeyword && (
                          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                              <Zap className="w-12 h-12 text-white" />
                            </div>
                            <div className="flex items-center justify-between mb-3 relative z-10">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                                Smart Bullet Point
                              </p>
                              {hasBullet && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                                  onClick={() => handleCopyBullet(key, hasBullet)}
                                >
                                  {copiedId === key ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>

                            {hasBullet ? (
                              <p className="text-xs text-slate-300 font-mono leading-relaxed relative z-10">
                                {hasBullet}
                              </p>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full bg-white hover:bg-slate-100 text-slate-900 border-none font-black text-[10px] h-9 tracking-widest relative z-10"
                                onClick={() => handleGenerateBulletPoint(fix.missingKeyword!, index)}
                                disabled={generatingFor === key}
                              >
                                {generatingFor === key ? (
                                  <span className="flex items-center gap-2">
                                    <span className="h-3 w-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                    ANALYZING...
                                  </span>
                                ) : (
                                  <>
                                    <Play className="h-3 w-3 mr-2 fill-current" />
                                    GENERATE IMPACT BULLET
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        )}

                        {!fix.missingKeyword && (
                          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">RECOMMENDED FIX</p>
                                <p className="text-xs text-slate-700 font-mono leading-relaxed italic">
                                  "{fix.example}"
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
