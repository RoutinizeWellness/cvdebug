import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2, Sparkles, TrendingUp, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AutoTuneButtonProps {
  resumeText: string;
  missingKeywords: string[];
  onOptimized?: (optimizedText: string) => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

export function AutoTuneButton({
  resumeText,
  missingKeywords,
  onOptimized,
  isPremium = false,
  onUpgrade
}: AutoTuneButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const autoTuneResume = useMutation(api.autoTune.autoTuneResume);

  const handleAutoTune = async () => {
    if (!isPremium) {
      onUpgrade?.();
      return;
    }

    if (!resumeText || resumeText.length < 100) {
      toast.error("Not enough content to auto-tune");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await autoTuneResume({
        resumeText,
        missingKeywords: missingKeywords.slice(0, 10) // Top 10 keywords
      });

      setResults(result);
      setShowResults(true);

      toast.success(`🎉 Auto-tuned ${result.bulletsOptimized} bullets!`, {
        description: `Score improved by +${result.score.improvement} points`
      });

    } catch (error) {
      console.error("Auto-tune error:", error);
      toast.error("Auto-tune failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (results?.optimizedText) {
      onOptimized?.(results.optimizedText);
      setShowResults(false);
      toast.success("Optimizations applied to your resume!");
    }
  };

  return (
    <>
      <Button
        onClick={handleAutoTune}
        disabled={isProcessing || !resumeText}
        className="bg-gradient-to-r from-[#0F172A] to-[#334155] hover:from-[#1E293B] hover:to-[#0F172A] text-white font-bold shadow-lg"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Auto-Tuning...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5 mr-2" />
            Auto-Tune All Bullets
          </>
        )}
      </Button>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-[#1E293B]" />
              Auto-Tune Results
            </DialogTitle>
            <DialogDescription>
              Your resume has been optimized using ML-powered algorithms
            </DialogDescription>
          </DialogHeader>

          {results && (
            <div className="space-y-6 mt-4">
              {/* Score Improvement */}
              <div className="bg-gradient-to-r from-emerald-50 to-[#F1F5F9] rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#64748B] font-medium">Resume Score</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-3xl font-black text-[#0F172A]">
                        {results.score.before}
                      </span>
                      <TrendingUp className="w-6 h-6 text-emerald-500" />
                      <span className="text-3xl font-black text-emerald-600">
                        {results.score.after}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#64748B] font-medium">Improvement</p>
                    <p className="text-3xl font-black text-emerald-600">
                      +{results.score.improvement}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-3 border border-emerald-200">
                    <p className="text-xs text-[#64748B]">Bullets Optimized</p>
                    <p className="text-xl font-bold text-[#0F172A]">{results.bulletsOptimized}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-[#E2E8F0]">
                    <p className="text-xs text-[#64748B]">Keywords Injected</p>
                    <p className="text-xl font-bold text-[#0F172A]">{results.keywordsInjected}</p>
                  </div>
                </div>
              </div>

              {/* Improvements List */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Optimizations Applied
                </h3>

                {results.improvements.map((improvement: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg p-4 border border-[#E2E8F0] space-y-3"
                  >
                    {/* Before */}
                    <div>
                      <p className="text-xs font-bold text-[#94A3B8] uppercase mb-1">Before:</p>
                      <p className="text-sm text-[#64748B] line-through">{improvement.original}</p>
                    </div>

                    {/* After */}
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase mb-1">After:</p>
                      <p className="text-sm text-[#0F172A] font-medium">{improvement.improved}</p>
                    </div>

                    {/* Keywords Added */}
                    {improvement.keywordsAdded.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-[#1E293B]">Keywords added:</p>
                        {improvement.keywordsAdded.map((kw: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-[#F1F5F9] text-[#0F172A] text-xs font-medium rounded"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleApply}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  size="lg"
                >
                  Apply Optimizations
                </Button>
                <Button
                  onClick={() => setShowResults(false)}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
