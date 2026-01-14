import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, Edit3, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ApplyMetricModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalBullet: string;
  onApply: (newBullet: string) => void;
}

interface MetricSuggestion {
  placeholder: string;
  defaultValue: string;
  hint: string;
}

export function ApplyMetricModal({ open, onOpenChange, originalBullet, onApply }: ApplyMetricModalProps) {
  const [quantifiedBullet, setQuantifiedBullet] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Intelligent metric injection based on bullet content
  const generateQuantifiedVersion = (bullet: string): string => {
    // Extract key action and context
    const lowerBullet = bullet.toLowerCase();

    // Pattern matching for common weak phrases
    if (lowerBullet.includes("responsible for") || lowerBullet.includes("worked on")) {
      // Management/Leadership scenario
      if (lowerBullet.includes("team") || lowerBullet.includes("manage")) {
        return `Led a cross-functional team of [8] engineers, delivering [12] major features and reducing sprint delay by [15]%`;
      }
      // Development scenario
      if (lowerBullet.includes("develop") || lowerBullet.includes("build")) {
        return `Developed and deployed [15] high-impact features, improving user engagement by [35]% and reducing load time by [2.5]s`;
      }
      // Process improvement
      if (lowerBullet.includes("improve") || lowerBullet.includes("optimize")) {
        return `Optimized critical workflows, reducing processing time by [40]% and saving [$80K] annually in operational costs`;
      }
    }

    // API/Backend work
    if (lowerBullet.includes("api") || lowerBullet.includes("backend")) {
      return `Architected and scaled RESTful APIs handling [10M+] daily requests, achieving [99.9]% uptime and [<200ms] response time`;
    }

    // Frontend work
    if (lowerBullet.includes("frontend") || lowerBullet.includes("ui") || lowerBullet.includes("interface")) {
      return `Redesigned user interface components, improving Core Web Vitals by [40]% and increasing conversion rate by [25]%`;
    }

    // Database work
    if (lowerBullet.includes("database") || lowerBullet.includes("sql")) {
      return `Optimized database queries and indexing strategies, reducing query execution time by [70]% for [5M+] daily transactions`;
    }

    // Testing/QA
    if (lowerBullet.includes("test") || lowerBullet.includes("quality")) {
      return `Established comprehensive test automation framework, increasing code coverage from [45]% to [92]% and reducing bugs by [60]%`;
    }

    // DevOps/Infrastructure
    if (lowerBullet.includes("deploy") || lowerBullet.includes("infrastructure") || lowerBullet.includes("devops")) {
      return `Automated CI/CD pipelines and infrastructure provisioning, reducing deployment time from [2hrs] to [15min] and eliminating [80]% of manual errors`;
    }

    // Collaboration/Documentation
    if (lowerBullet.includes("collaborate") || lowerBullet.includes("document")) {
      return `Collaborated with [5] cross-functional teams totaling [40+] members, creating comprehensive documentation that reduced onboarding time by [50]%`;
    }

    // Generic fallback with impact metrics
    return `Delivered high-impact solution increasing efficiency by [30]%, serving [100K+] users, and reducing costs by [$50K] annually`;
  };

  // Initialize quantified version when modal opens
  useState(() => {
    if (open && originalBullet) {
      setQuantifiedBullet(generateQuantifiedVersion(originalBullet));
    }
  });

  const extractPlaceholders = (bullet: string): MetricSuggestion[] => {
    const placeholders: MetricSuggestion[] = [];
    const regex = /\[([^\]]+)\]/g;
    let match;

    while ((match = regex.exec(bullet)) !== null) {
      placeholders.push({
        placeholder: match[0],
        defaultValue: match[1],
        hint: getHintForMetric(match[1])
      });
    }

    return placeholders;
  };

  const getHintForMetric = (value: string): string => {
    if (value.includes("K") || value.includes("$")) return "💰 Financial impact";
    if (value.includes("%")) return "📊 Percentage improvement";
    if (value.includes("M+") || value.includes("K+")) return "👥 Scale/Volume";
    if (value.includes("hr") || value.includes("min") || value.includes("s")) return "⏱️ Time savings";
    if (!isNaN(parseInt(value))) return "🔢 Count/Quantity";
    return "📈 Metric value";
  };

  const handleApply = () => {
    if (!quantifiedBullet.trim()) {
      toast.error("Please provide a quantified version");
      return;
    }

    // Check if user has edited placeholders
    const hasPlaceholders = /\[([^\]]+)\]/.test(quantifiedBullet);
    if (hasPlaceholders) {
      toast.warning("Don't forget to replace the [bracketed] values with your actual numbers!");
    }

    onApply(quantifiedBullet);
    toast.success("Bullet point updated with metrics!");
    onOpenChange(false);
  };

  const placeholders = extractPlaceholders(quantifiedBullet);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]">
        {/* Header */}
        <DialogHeader className="border-b border-[#E2E8F0] pb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-[#0F172A]">
                Apply Quantifiable Metrics
              </DialogTitle>
              <p className="text-sm text-[#64748B] mt-1">
                Transform vague statements into impact-driven achievements with numbers
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {/* Original (Before) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#EF4444] uppercase tracking-wider">❌ Weak (Before)</span>
            </div>
            <div className="bg-[#FEF2F2] border border-[#EF4444]/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-2"></div>
                <p className="text-[#0F172A] text-sm leading-relaxed opacity-60">
                  {originalBullet}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-xs font-medium border border-[#EF4444]/20">
                  No metrics
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-medium border border-[#F59E0B]/20">
                  Vague
                </span>
              </div>
            </div>
          </div>

          {/* Quantified (After) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider">✅ Strong (After)</span>
            </div>
            <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-[#22C55E]/30 rounded-lg p-4 relative">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-2"></div>
                {isEditing ? (
                  <textarea
                    value={quantifiedBullet}
                    onChange={(e) => setQuantifiedBullet(e.target.value)}
                    className="w-full text-[#0F172A] text-sm leading-relaxed bg-white border border-[#E2E8F0] rounded-lg p-3 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 font-mono"
                    rows={4}
                  />
                ) : (
                  <p className="text-[#0F172A] text-sm leading-relaxed flex-1 font-medium">
                    {quantifiedBullet}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#8B5CF6] hover:bg-[#F3E8FF] transition-all"
              >
                <Edit3 className="h-4 w-4 text-[#64748B] hover:text-[#8B5CF6]" />
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium border border-[#22C55E]/20">
                  Quantified
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-medium border border-[#3B82F6]/20">
                  Specific
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-medium border border-[#8B5CF6]/20">
                  Impact-driven
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder Guide */}
        {placeholders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-r from-[#EFF6FF] to-[#F3E8FF] border border-[#E2E8F0] rounded-xl p-5"
          >
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-1">Customize Your Metrics</h3>
                <p className="text-xs text-[#64748B]">
                  Replace the bracketed values below with your actual numbers
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {placeholders.map((placeholder, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-[#E2E8F0] p-3 flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center border border-[#E2E8F0]">
                    <span className="text-xs font-mono font-bold text-[#8B5CF6]">
                      {placeholder.defaultValue}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-xs font-mono text-[#0F172A] break-all">
                      {placeholder.placeholder}
                    </code>
                    <p className="text-xs text-[#64748B] mt-0.5">{placeholder.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
          <p className="text-xs text-[#64748B] flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#22C55E]" />
            This transformation follows FAANG resume best practices
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-[#475569] font-medium text-sm hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-[0_4px_12px_-2px_rgba(139,92,246,0.3)] flex items-center gap-2"
            >
              Apply to Resume
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
