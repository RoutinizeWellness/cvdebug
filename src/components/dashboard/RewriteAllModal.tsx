import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Zap, TrendingUp, CheckCircle, AlertCircle, Loader2, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface RewriteAllModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeData: any;
  keywords: string[];
  onComplete: (rewrittenData: any) => void;
}

interface RewriteResult {
  section: string;
  originalBullet: string;
  rewrittenBullet: string;
  metricsAdded: string[];
  keywordsIntegrated: string[];
}

export function RewriteAllModal({ open, onOpenChange, resumeData, keywords, onComplete }: RewriteAllModalProps) {
  const navigate = useNavigate();
  const [seniorityLevel, setSeniorityLevel] = useState<"Mid-Level" | "Senior" | "Staff/Principal">("Senior");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<RewriteResult[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const rewriteResume = useAction(api.aiRewriteActions.rewriteResumeWithAI as any);
  const featureAccess = useQuery((api as any).planAccess.getFeatureAccess);
  const incrementRewrite = useMutation((api as any).planAccess.incrementAIRewriteUsage);

  const hasAccess = featureAccess?.features.aiRewritesRemaining > 0;
  const rewritesRemaining = featureAccess?.features.aiRewritesRemaining || 0;
  const tier = featureAccess?.tier || "free";

  const handleRewrite = async () => {
    // Check if user has access
    if (!hasAccess) {
      toast.error("AI rewrite limit reached. Upgrade to continue.");
      return;
    }

    setIsProcessing(true);
    setShowPreview(false);

    try {
      // Increment AI rewrite usage
      await incrementRewrite();

      const response = await rewriteResume({
        resumeData,
        keywords,
        seniorityLevel,
      });

      if (response.success) {
        setResults(response.rewrittenBullets);
        setShowPreview(true);
        toast.success(`✨ Rewritten ${response.totalBulletsRewritten} bullets with ${response.keywordsIntegrated} keywords!`);
      } else {
        toast.error("Failed to rewrite resume");
      }
    } catch (error: any) {
      console.error("Rewrite error:", error);
      if (error.message?.includes("limit reached")) {
        toast.error("AI rewrite limit reached. Upgrade to continue.");
      } else {
        toast.error("An error occurred while rewriting");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (!results) return;
    onComplete(results);
    toast.success("Resume updated with AI improvements!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <DialogHeader className="border-b border-[#E2E8F0] pb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#64748B] flex items-center justify-center shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#0F172A]">
                AI Resume Rewrite Engine
              </DialogTitle>
              <p className="text-sm text-[#64748B] mt-1">
                Transform your entire resume with FAANG-level bullet points in seconds
              </p>
              <div className="flex items-center gap-2 mt-3">
                {rewritesRemaining === 999 ? (
                  <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold border border-[#22C55E]/20">
                    ✅ Unlimited Rewrites
                  </span>
                ) : rewritesRemaining > 0 ? (
                  <span className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold border border-[#F59E0B]/20">
                    ⚡ {rewritesRemaining} Rewrite{rewritesRemaining !== 1 ? 's' : ''} Left
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold border border-[#EF4444]/20">
                    🔒 No Rewrites Available
                  </span>
                )}
                <span className="text-xs text-[#64748B]">•</span>
                <span className="text-xs text-[#64748B]">Powered by GPT-4 Turbo</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {!showPreview ? (
          <>
            {/* Configuration */}
            <div className="mt-6 space-y-6">
              {/* Seniority Level Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#0F172A]">
                  Target Seniority Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Mid-Level", "Senior", "Staff/Principal"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeniorityLevel(level)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        seniorityLevel === level
                          ? "border-[#1E293B] bg-[#F3E8FF] shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)]"
                          : "border-[#E2E8F0] hover:border-[#1E293B]/50 hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {seniorityLevel === level && (
                          <CheckCircle className="h-5 w-5 text-[#1E293B]" />
                        )}
                        <span className={`text-sm font-bold ${seniorityLevel === level ? "text-[#1E293B]" : "text-[#0F172A]"}`}>
                          {level}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        {level === "Mid-Level" && "3-5 years experience tone"}
                        {level === "Senior" && "5-8 years leadership focus"}
                        {level === "Staff/Principal" && "8+ years strategic impact"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords Preview */}
              <div className="bg-gradient-to-br from-[#EFF6FF] to-[#F3E8FF] rounded-xl p-5 border border-[#E2E8F0]">
                <div className="flex items-start gap-3 mb-3">
                  <Zap className="h-5 w-5 text-[#1E293B] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      Keywords to Integrate ({keywords.length})
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      These will be naturally woven into your bullets
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.slice(0, 10).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#0F172A]"
                    >
                      {keyword}
                    </span>
                  ))}
                  {keywords.length > 10 && (
                    <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#64748B]">
                      +{keywords.length - 10} more
                    </span>
                  )}
                </div>
              </div>

              {/* What Will Happen */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: TrendingUp,
                    color: "#22C55E",
                    title: "Quantify",
                    desc: "Add metrics to every bullet"
                  },
                  {
                    icon: Sparkles,
                    color: "#1E293B",
                    title: "Optimize",
                    desc: "Inject keywords naturally"
                  },
                  {
                    icon: CheckCircle,
                    color: "#64748B",
                    title: "Polish",
                    desc: "FAANG-level language"
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border border-[#E2E8F0] p-4 text-center"
                  >
                    <div
                      className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A] mb-1">{item.title}</h4>
                    <p className="text-xs text-[#64748B]">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 bg-[#FFF7ED] border border-[#F59E0B]/30 rounded-lg p-4">
                <AlertCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#0F172A] font-medium mb-1">
                    Review before applying
                  </p>
                  <p className="text-xs text-[#64748B]">
                    AI-generated content should be reviewed for accuracy. You'll see a preview before changes are applied.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
              {!hasAccess ? (
                // Upgrade CTA when no access
                <div className="bg-gradient-to-br from-[#EF4444]/10 to-[#F59E0B]/10 rounded-xl p-6 border border-[#EF4444]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-6 w-6 text-[#EF4444]" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">AI Rewrite Limit Reached</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {tier === "single_debug_fix" ? "You've used your 1 AI rewrite" : "Upgrade to access AI rewrite"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/pricing")}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#64748B] to-[#1E293B] text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    Upgrade for More Rewrites
                  </button>
                </div>
              ) : (
                // Normal rewrite button
                <div className="flex justify-between items-center">
                  <p className="text-xs text-[#64748B]">
                    ⚡ This usually takes 10-15 seconds
                  </p>
                  <button
                    onClick={handleRewrite}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_6px_20px_-3px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Rewriting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Rewrite My Resume ({rewritesRemaining} left)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Preview Results */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <h3 className="text-lg font-bold text-[#0F172A]">Preview Changes</h3>
                <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold border border-[#22C55E]/20">
                  {results?.length} bullets improved
                </span>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {results?.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]"
                  >
                    {/* Before */}
                    <div className="mb-3 pb-3 border-b border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider mb-2 block">
                        Before
                      </span>
                      <p className="text-sm text-[#64748B] italic">
                        {result.originalBullet}
                      </p>
                    </div>

                    {/* After */}
                    <div className="mb-3">
                      <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-2 block">
                        After
                      </span>
                      <p className="text-sm text-[#0F172A] font-medium leading-relaxed">
                        {result.rewrittenBullet}
                      </p>
                    </div>

                    {/* Improvements */}
                    <div className="flex flex-wrap gap-2">
                      {result.metricsAdded.map((metric, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium border border-[#22C55E]/20"
                        >
                          📊 {metric}
                        </span>
                      ))}
                      {result.keywordsIntegrated.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#1E293B]/10 text-[#1E293B] text-xs font-medium border border-[#1E293B]/20"
                        >
                          🔑 {keyword}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Apply Actions */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-between items-center">
              <button
                onClick={() => {
                  setShowPreview(false);
                  setResults(null);
                }}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#475569] font-medium text-sm hover:bg-[#F8FAFC] transition-colors"
              >
                ← Back to Settings
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_6px_20px_-3px_rgba(34,197,94,0.4)] flex items-center gap-2"
              >
                Apply All Changes
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
