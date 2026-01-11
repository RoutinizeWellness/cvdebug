import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, RefreshCw, Zap, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

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
}

export function BulletRewriter() {
  const [bulletText, setBulletText] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"student" | "mid" | "senior">("mid");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const rewriteBullet = useAction(api.ai.bulletRewriter.rewriteBullet);

  const handleRewrite = async () => {
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
      toast.error(error.message || "Failed to rewrite bullet point");
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
      {/* Header */}
      <div className="glass-panel p-6 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Bullet Rewriter</h2>
            <p className="text-sm text-slate-400">Transform weak bullets into impact-driven achievements</p>
          </div>
        </div>

        {/* Google XYZ Formula Explanation */}
        <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-slate-300 font-mono">
            <span className="text-primary font-bold">Google XYZ Formula:</span>{" "}
            Accomplished <span className="text-secondary">[X]</span> as measured by{" "}
            <span className="text-green-400">[Y]</span>, by doing{" "}
            <span className="text-blue-400">[Z]</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Example: "Led a team of 10, increasing productivity by 25% through implementing agile workflows"
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-6 mb-4">
        <div className="space-y-4">
          {/* Original Bullet Input */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Original Bullet Point <span className="text-red-400">*</span>
            </label>
            <textarea
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g., Managed a team and worked on improving processes"
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary resize-none"
              rows={3}
            />
          </div>

          {/* Experience Level Dropdown */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Nivel de Experiencia
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as "student" | "mid" | "senior")}
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
            >
              <option value="student">Student - Emphasis on curiosity & projects</option>
              <option value="mid">Mid-Level - Balance of skills & results</option>
              <option value="senior">Senior - Aggressive ROI & leadership focus</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              {experienceLevel === "student" && "Highlights learning, projects, and potential"}
              {experienceLevel === "mid" && "Focuses on concrete achievements and skills"}
              {experienceLevel === "senior" && "Emphasizes business impact, ROI, and team leadership"}
            </p>
          </div>

          {/* Optional Context */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Role (Optional)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Company (Optional)
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google"
                className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Rewrite Button */}
          <Button
            onClick={handleRewrite}
            disabled={isLoading || !bulletText.trim()}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Rewriting with AI...
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
            {/* Main Result */}
            <div className="glass-panel p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Optimized Version</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-green-400 font-mono">Metric: {result.metric}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-blue-400 font-mono">Impact: {result.impact}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.rewritten, -1)}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedIndex === -1 ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-white leading-relaxed bg-[#0F172A]/50 p-4 rounded-lg border border-primary/20">
                {result.rewritten}
              </p>
            </div>

            {/* Alternative Versions */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-white mb-4">Alternative Versions</h3>
                <div className="space-y-3">
                  {result.alternatives.map((alt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[#1e293b] p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-primary">{getTypeIcon(alt.type)}</div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                              {alt.type}
                            </span>
                          </div>
                          <p className="text-white text-sm leading-relaxed">{alt.text}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(alt.text, index)}
                          className="text-slate-400 hover:text-white flex-shrink-0"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4 text-green-400" />
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
