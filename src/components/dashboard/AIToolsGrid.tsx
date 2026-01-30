import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  FileText,
  Linkedin,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface AIToolCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  beforeText?: string;
  afterText?: string;
  badge?: string;
  featured?: boolean;
  ctaText: string;
  onCTAClick: () => void;
  delay?: number;
}

function AIToolCard({
  icon: Icon,
  title,
  description,
  beforeText,
  afterText,
  badge,
  featured,
  ctaText,
  onCTAClick,
  delay = 0,
}: AIToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`relative bg-white border rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${
        featured
          ? "border-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
          : "border-[#E2E8F0] hover:border-blue-300"
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
          🔥 DESTACADO
        </Badge>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            featured
              ? "bg-gradient-to-br from-blue-500 to-purple-600"
              : "bg-slate-100"
          }`}
        >
          <Icon
            className={`h-7 w-7 ${featured ? "text-white" : "text-slate-600"}`}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#0F172A]">{title}</h3>
          {badge && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#64748B] leading-relaxed mb-4">
        {description}
      </p>

      {/* Before/After Example */}
      {beforeText && afterText && (
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <div className="text-xs text-[#64748B] mb-2">Example:</div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-red-600">Before:</span> {beforeText}
            </div>
            <div className="text-sm font-medium text-green-700">
              <span className="text-green-600">After:</span> {afterText}
            </div>
          </div>
        </div>
      )}

      {/* Stats for Featured Tools */}
      {featured && (
        <div className="flex items-center gap-4 text-xs text-[#64748B] mb-4">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span>Match rate boost: +35% average</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3 text-blue-600" />
            <span>Used 1,247 times this week</span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Button
        onClick={onCTAClick}
        className={`w-full font-semibold transition-all ${
          featured
            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            : "bg-slate-900 hover:bg-slate-800 text-white"
        }`}
      >
        {ctaText}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </motion.div>
  );
}

interface AIToolsGridProps {
  onToolSelect: (tool: string) => void;
}

export function AIToolsGrid({ onToolSelect }: AIToolsGridProps) {
  const { t } = useI18n();

  const tools = [
    {
      id: "bullet-rewriter",
      icon: Wrench,
      title: "Bullet Rewriter",
      description: "Transform weak bullets using Google XYZ AI algorithms",
      beforeText: "Worked on ML project",
      afterText: "Architected ML pipeline reducing costs by $50K...",
      badge: "ML Powered",
      ctaText: "Try Bullet Rewriter",
    },
    {
      id: "cover-letter",
      icon: FileText,
      title: "Cover Letter",
      description: "AI-powered cover letters tailored to each job application",
      badge: "GPT-4",
      ctaText: "Generate Cover Letter",
    },
    {
      id: "linkedin-optimizer",
      icon: Linkedin,
      title: "LinkedIn Optimizer",
      description: "Optimize your LinkedIn profile for recruiter visibility",
      badge: "ATS Friendly",
      ctaText: "Optimize Profile",
    },
    {
      id: "keyword-sniper",
      icon: Target,
      title: "Keyword Sniper",
      description: "AI rewrites + keyword injection for maximum ATS match",
      featured: true,
      badge: "Most Popular",
      ctaText: "Start Optimizing",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {tools.map((tool, index) => (
        <AIToolCard
          key={tool.id}
          icon={tool.icon}
          title={tool.title}
          description={tool.description}
          beforeText={tool.beforeText}
          afterText={tool.afterText}
          badge={tool.badge}
          featured={tool.featured}
          ctaText={tool.ctaText}
          onCTAClick={() => onToolSelect(tool.id)}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
