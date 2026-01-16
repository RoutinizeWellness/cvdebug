import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, RefreshCw, Zap, TrendingUp, Target, Lock, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Alternative {
  text: string;
  type: string;
}

interface RewriteResult {
  success: boolean;
  rewritten: string;
  metric: string;
  impact: string;
  alternatives: Alternative[];
  analysis?: {
    weaknessScore: number;
    hasMetrics: boolean;
    hasStrongVerb: boolean;
    hasPassiveLanguage: boolean;
    hasVagueTerms: boolean;
    suggestedFocus: string;
    weaknessReasons: string[];
  };
  contextAnalysis?: {
    detectedRole: string;
    detectedIndustry: string;
    recommendedMetricTypes: string[];
  };
}

interface BulletRewriterProps {
  onUpgrade?: () => void;
}

export function BulletRewriter({ onUpgrade }: BulletRewriterProps) {
  const [bulletText, setBulletText] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"student" | "mid" | "senior">("mid");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const rewriteBullet = useAction(api.ai.rewriteBullet);
  const currentUser = useQuery((api as any).users.currentUser);

  // Check if user has Interview Sprint plan
  const hasInterviewSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (!currentUser?.sprintExpiresAt || currentUser.sprintExpiresAt > Date.now());

  const handleRewrite = async () => {
    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to rewrite bullet points with AI"
      });
      onUpgrade?.();
      return;
    }

    if (!bulletText.trim()) {
      toast.error("Please enter a bullet point to rewrite");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const context = {
        role: role.trim() || undefined,
        company: company.trim() || undefined,
        experienceLevel,
      };

      const response = await rewriteBullet({
        bulletPoint: bulletText,
        context: Object.keys(context).length > 0 ? context : undefined,
      });

      setResult(response as RewriteResult);
      toast.success("Bullet point rewritten successfully!");
    } catch (error: any) {
      console.error("Rewrite error:", error);
      if (error.message?.includes("PLAN_RESTRICTION")) {
        toast.error("Interview Sprint plan required", {
          description: "This feature is only available with an active Interview Sprint subscription"
        });
        onUpgrade?.();
      } else {
        toast.error(error.message || "Failed to rewrite bullet point");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "metric-focused":
        return <TrendingUp className="h-4 w-4" />;
      case "action-focused":
        return <Zap className="h-4 w-4" />;
      case "balanced":
        return <Target className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Interview Sprint Required Alert */}
      {!hasInterviewSprint && (
        <Alert className="mb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-primary/40 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 pointer-events-none" />

          <div className="relative">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                <Diamond className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[#0F172A] font-bold text-base mb-1">Interview Sprint Required</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  Transform weak bullets into impact-driven achievements with AI-powered rewriting.
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 ml-14">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Unlimited rewrites</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Google XYZ formula</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Multiple alternatives</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Context analysis</span>
              </div>
            </div>

            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 w-full py-2.5 text-white font-bold border-0 flex items-center justify-center gap-2 ml-14"
            >
              <Sparkles className="h-4 w-4" />
              <span>Upgrade to Interview Sprint</span>
            </Button>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 mb-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#0F172A]">AI Bullet Rewriter</h2>
            <p className="text-sm text-[#64748B]">Transform weak bullets into impact-driven achievements</p>
          </div>
          {!hasInterviewSprint && (
            <Lock className="h-5 w-5 text-slate-400" />
          )}
        </div>

        {/* Google XYZ Formula Explanation */}
        <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-[#475569] font-mono">
            <span className="text-primary font-bold">Google XYZ Formula:</span>{" "}
            Accomplished <span className="text-secondary">[X]</span> as measured by{" "}
            <span className="text-[#22C55E]">[Y]</span>, by doing{" "}
            <span className="text-[#3B82F6]">[Z]</span>
          </p>
          <p className="text-xs text-[#64748B] mt-2">
            Example: "Led a team of 10, increasing productivity by 25% through implementing agile workflows"
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 mb-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="space-y-4">
          {/* Original Bullet Input */}
          <div>
            <label className="text-sm font-medium text-[#475569] mb-2 block">
              Original Bullet Point <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g., Managed a team and worked on improving processes"
              className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-3 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-primary resize-none"
              rows={3}
              disabled={!hasInterviewSprint}
            />
          </div>

          {/* Experience Level Dropdown */}
          <div>
            <label className="text-sm font-medium text-[#475569] mb-2 block">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as "student" | "mid" | "senior")}
              className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-3 text-[#0F172A] focus:outline-none focus:border-primary"
              disabled={!hasInterviewSprint}
            >
              <option value="student">Student - Emphasis on curiosity & projects</option>
              <option value="mid">Mid-Level - Balance of skills & results</option>
              <option value="senior">Senior - Aggressive ROI & leadership focus</option>
            </select>
            <p className="text-xs text-[#64748B] mt-1">
              {experienceLevel === "student" && "Highlights learning, projects, and potential"}
              {experienceLevel === "mid" && "Focuses on concrete achievements and skills"}
              {experienceLevel === "senior" && "Emphasizes business impact, ROI, and team leadership"}
            </p>
          </div>

          {/* Optional Context */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                Role (Optional)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-3 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-primary"
                disabled={!hasInterviewSprint}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                Company (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google"
                className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-3 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-primary"
                disabled={!hasInterviewSprint}
              />
            </div>
          </div>

          {/* Rewrite Button */}
          <Button
            onClick={handleRewrite}
            disabled={isLoading || !bulletText.trim() || !hasInterviewSprint}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Rewriting with AI...
              </>
            ) : !hasInterviewSprint ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Upgrade to Rewrite
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Rewrite Bullet
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Analysis Insights Panel */}
            {result.analysis && (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 border-l-4 border-[#3B82F6] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#3B82F6]" />
                  AI Analysis of Original Bullet
                </h3>

                {/* Weakness Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#475569]">Weakness Score</span>
                    <span className={`text-sm font-bold ${
                      result.analysis.weaknessScore > 50 ? "text-[#EF4444]" :
                      result.analysis.weaknessScore > 30 ? "text-[#F59E0B]" :
                      "text-[#22C55E]"
                    }`}>
                      {result.analysis.weaknessScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        result.analysis.weaknessScore > 50 ? "bg-[#EF4444]" :
                        result.analysis.weaknessScore > 30 ? "bg-yellow-500" :
                        "bg-[#22C55E]"
                      }`}
                      style={{ width: `${result.analysis.weaknessScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detected Issues */}
                {result.analysis.weaknessReasons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-[#64748B] mb-2 font-semibold">Detected Issues:</p>
                    <div className="space-y-1">
                      {result.analysis.weaknessReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-red-700">
                          <span className="text-[#EF4444] mt-0.5">✗</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Context Detection */}
                {result.contextAnalysis && (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                      <span className="text-[#64748B]">Detected Role:</span>
                      <span className="text-[#0F172A] ml-2 font-semibold">{result.contextAnalysis.detectedRole}</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                      <span className="text-[#64748B]">Industry:</span>
                      <span className="text-[#0F172A] ml-2 font-semibold">{result.contextAnalysis.detectedIndustry}</span>
                    </div>
                  </div>
                )}

                {/* Recommended Focus */}
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">AI Recommendation:</span> Focus on {result.analysis.suggestedFocus.replace("-", " ")} to maximize impact
                  </p>
                </div>
              </div>
            )}

            {/* Main Result */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">Optimized Version</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#22C55E] font-mono">Metric: {result.metric}</span>
                    <span className="text-[#64748B]">•</span>
                    <span className="text-[#3B82F6] font-mono">Impact: {result.impact}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.rewritten, -1)}
                  className="text-[#64748B] hover:text-[#0F172A]"
                >
                  {copiedIndex === -1 ? (
                    <Check className="h-4 w-4 text-[#22C55E]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[#0F172A] leading-relaxed bg-[#F8FAFC] p-4 rounded-lg border border-primary/20">
                {result.rewritten}
              </p>
            </div>

            {/* Alternative Versions */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-[#0F172A] mb-4">Alternative Versions</h3>
                <div className="space-y-3">
                  {result.alternatives.map((alt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] hover:border-[#E2E8F0] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-primary">{getTypeIcon(alt.type)}</div>
                            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                              {alt.type}
                            </span>
                          </div>
                          <p className="text-[#0F172A] text-sm leading-relaxed">{alt.text}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(alt.text, index)}
                          className="text-[#64748B] hover:text-[#0F172A] flex-shrink-0"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-[#22C55E]" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
