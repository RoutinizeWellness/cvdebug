import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, AlertTriangle, Target, Lightbulb, TrendingUp, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface InterviewBattlePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeText: string;
  jobDescription?: string;
  targetRole: string;
}

export function InterviewBattlePlanModal({
  open,
  onOpenChange,
  resumeText,
  jobDescription = "",
  targetRole
}: InterviewBattlePlanModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [battlePlan, setBattlePlan] = useState<any>(null);

  const generatePlan = useAction(api.battlePlanActions.generateBattlePlan as any);

  const handleGenerate = async () => {
    if (!jobDescription) {
      toast.error("Please paste the job description first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generatePlan({
        resumeText,
        jobDescription,
        targetRole
      });

      if (response.success) {
        setBattlePlan(response.battlePlan);
        toast.success("Battle plan generated!");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate battle plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return { bg: "#FEF2F2", border: "#EF4444", text: "#EF4444" };
      case "medium": return { bg: "#FFF7ED", border: "#F59E0B", text: "#F59E0B" };
      case "low": return { bg: "#F0FDF4", border: "#22C55E", text: "#22C55E" };
      default: return { bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B" };
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <DialogHeader className="border-b border-[#E2E8F0] pb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EF4444] via-[#F59E0B] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#0F172A]">
                Interview Battle Plan
              </DialogTitle>
              <p className="text-sm text-[#64748B] mt-1">
                Radar of threats, opportunities, and winning strategies for: <span className="text-[#0F172A] font-semibold">{targetRole}</span>
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-[#1E293B]/10 text-[#1E293B] text-xs font-bold border border-[#1E293B]/20">
                  🔒 Interview Sprint
                </span>
                <span className="text-xs text-[#64748B]">•</span>
                <span className="text-xs text-[#64748B]">Strategic Interview Coaching AI</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {!battlePlan ? (
          /* Input Stage */
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Target className="h-4 w-4" />
                Job Description
              </label>
              <textarea
                placeholder="Paste the full job description here..."
                className="w-full h-48 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#1E293B] focus:ring-2 focus:ring-[#1E293B]/20 text-sm font-mono resize-none"
                defaultValue={jobDescription}
              />
            </div>

            <div className="bg-gradient-to-r from-[#EFF6FF] to-[#F3E8FF] border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-[#1E293B] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2">What You'll Get:</h3>
                  <ul className="space-y-1 text-xs text-[#475569]">
                    <li>• The 3 hardest questions you'll face (and how to answer them)</li>
                    <li>• Your strategic strengths and how to position them</li>
                    <li>• The killer question to ask that impresses the interviewer</li>
                    <li>• Deflection tactics for addressing weaknesses</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F59E0B] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_6px_20px_-3px_rgba(239,68,68,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Resume vs Job Description...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Generate Battle Plan
                </>
              )}
            </button>
          </div>
        ) : (
          /* Battle Plan Display */
          <div className="mt-6 space-y-6">
            {/* Confidence Score */}
            <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] border border-[#22C55E]/30 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-[#0F172A]">Match Analysis</h3>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-[#22C55E]">
                    {battlePlan.confidence.matchScore}%
                  </span>
                  <span className="text-sm text-[#64748B]">Match</span>
                </div>
              </div>
              <p className="text-sm text-[#475569]">{battlePlan.confidence.recommendation}</p>
              <div className="flex gap-4 mt-3">
                <span className="text-xs text-[#64748B]">
                  <strong className="text-[#22C55E]">{battlePlan.confidence.strengths}</strong> Strengths
                </span>
                <span className="text-xs text-[#64748B]">
                  <strong className="text-[#EF4444]">{battlePlan.confidence.gaps}</strong> Gaps
                </span>
              </div>
            </div>

            {/* Hardest Questions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
                <h3 className="text-lg font-bold text-[#0F172A]">
                  The 3 Hardest Questions
                </h3>
              </div>
              <p className="text-xs text-[#64748B]">
                Based on gaps in your resume vs the job requirements
              </p>

              <div className="space-y-4">
                {battlePlan.hardestQuestions.map((q: any, index: number) => {
                  const colors = getSeverityColor(q.severity);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 rounded-xl p-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      style={{ borderColor: colors.border, backgroundColor: colors.bg }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                          style={{ backgroundColor: colors.border, color: "white" }}
                        >
                          Q{index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-[#0F172A] flex-1">
                          "{q.question}"
                        </h4>
                      </div>

                      <div className="space-y-3 ml-8">
                        <div>
                          <span className="text-xs font-bold text-[#64748B] uppercase">Why they'll ask:</span>
                          <p className="text-sm text-[#475569] mt-1">{q.why}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-[#E2E8F0]">
                          <span className="text-xs font-bold text-[#22C55E] uppercase">How to answer:</span>
                          <p className="text-sm text-[#0F172A] mt-2 leading-relaxed">{q.howToAnswer}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Points */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#1E293B]" />
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Your Strategic Advantages
                </h3>
              </div>
              <p className="text-xs text-[#64748B]">
                Lean into these strengths and use these deflection tactics
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {battlePlan.strategicPoints.map((point: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-5 border border-[#E2E8F0] hover:border-[#1E293B] hover:shadow-[0_4px_16px_rgba(139,92,246,0.1)] transition-all"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${point.color}15` }}
                    >
                      <span className="material-symbols-outlined text-[24px]" style={{ color: point.color }}>
                        {point.icon}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A] mb-2">{point.strength}</h4>
                    <p className="text-xs text-[#475569] mb-3">{point.positioning}</p>
                    <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#1E293B]">Deflection:</span>
                      <p className="text-xs text-[#475569] mt-1">{point.deflectionTactic}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Killer Question */}
            <div className="bg-gradient-to-br from-[#F3E8FF] to-[#EFF6FF] border-2 border-[#1E293B] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E293B]/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E293B] to-[#334155] flex items-center justify-center shadow-lg">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">
                      The Killer Question
                    </h3>
                    <p className="text-xs text-[#64748B]">Ask this to position yourself as a strategic problem-solver</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-[#E2E8F0] mb-4">
                  <p className="text-base text-[#0F172A] font-semibold leading-relaxed mb-3">
                    "{battlePlan.killerQuestion.question}"
                  </p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-bold text-[#1E293B]">Why it works:</span>
                      <p className="text-sm text-[#475569] mt-1">{battlePlan.killerQuestion.why}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#22C55E]">When to ask:</span>
                      <p className="text-sm text-[#475569] mt-1">{battlePlan.killerQuestion.timing}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#64748B]">Follow-up:</span>
                      <p className="text-sm text-[#475569] mt-1">{battlePlan.killerQuestion.followUp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#E2E8F0] flex gap-3">
              <button
                onClick={() => {
                  // TODO: Implement PDF export
                  toast.info("PDF export coming soon!");
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-[#E2E8F0] text-[#475569] font-medium text-sm hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export as PDF
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)]"
              >
                I'm Ready 🚀
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
