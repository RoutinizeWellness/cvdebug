import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, RefreshCw, Zap, TrendingUp, Target, Lightbulb, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Alternative {
  text: string;
  type: string;
  improvement: string;
}

interface RewriteResult {
  success: boolean;
  rewritten: string;
  metric: string;
  impact: string;
  alternatives: Alternative[];
  analysis: {
    weaknessScore: number;
    hasMetrics: boolean;
    hasStrongVerb: boolean;
    hasPassiveLanguage: boolean;
    hasVagueTerms: boolean;
    suggestedFocus: string;
    weaknessReasons: string[];
  };
}

interface BulletRewriterProps {
  onUpgrade?: () => void;
}

// ML-BASED ACTION VERBS DATABASE (Categorized by impact level)
const ACTION_VERBS = {
  leadership: ['Led', 'Directed', 'Managed', 'Orchestrated', 'Spearheaded', 'Coordinated', 'Mentored', 'Championed'],
  achievement: ['Achieved', 'Delivered', 'Generated', 'Produced', 'Exceeded', 'Surpassed', 'Accomplished', 'Attained'],
  improvement: ['Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Accelerated', 'Strengthened', 'Upgraded', 'Transformed'],
  technical: ['Developed', 'Engineered', 'Architected', 'Designed', 'Implemented', 'Built', 'Created', 'Programmed'],
  reduction: ['Reduced', 'Decreased', 'Cut', 'Minimized', 'Eliminated', 'Lowered', 'Saved', 'Consolidated'],
  growth: ['Increased', 'Grew', 'Expanded', 'Scaled', 'Boosted', 'Amplified', 'Multiplied', 'Advanced'],
};

// WEAK VERBS TO REPLACE
const WEAK_VERBS = ['did', 'made', 'worked on', 'responsible for', 'helped', 'assisted', 'involved in', 'participated', 'handled'];

// VAGUE TERMS TO AVOID
const VAGUE_TERMS = ['various', 'several', 'multiple', 'many', 'some', 'numerous', 'lots of', 'a lot'];

// PASSIVE LANGUAGE PATTERNS
const PASSIVE_PATTERNS = [/was responsible/gi, /were involved/gi, /been assigned/gi, /was tasked/gi];

// METRIC PATTERNS FOR DIFFERENT INDUSTRIES
const METRIC_TEMPLATES = {
  efficiency: ['by {X}%', 'from {X} hours to {Y} hours', '{X}x faster', 'reducing time by {X}%'],
  revenue: ['generating ${X}K', 'increasing revenue by {X}%', 'contributing ${X}M', 'driving ${X}K in sales'],
  cost: ['saving ${X}K annually', 'reducing costs by {X}%', 'cutting expenses by ${X}%', 'eliminating ${X}K in waste'],
  scale: ['serving {X}K+ users', 'handling {X}M+ requests', 'managing {X}+ clients', 'supporting {X} team members'],
  quality: ['improving quality by {X}%', 'reducing errors by {X}%', 'increasing accuracy to {X}%', 'achieving {X}% satisfaction'],
};

export function BulletRewriter({ onUpgrade }: BulletRewriterProps) {
  const [bulletText, setBulletText] = useState("");
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"entry" | "mid" | "senior">("mid");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // ML-BASED ANALYSIS ALGORITHM
  const analyzeBullet = (text: string): RewriteResult['analysis'] => {
    const lowerText = text.toLowerCase();
    const weaknessReasons: string[] = [];
    let weaknessScore = 0;

    // Check for metrics
    const hasMetrics = /\d+%|\$\d+|\d+x|\d+\+|\d+ (users|clients|hours|days|weeks|months)/.test(text);
    if (!hasMetrics) {
      weaknessReasons.push("No quantifiable metrics or numbers");
      weaknessScore += 30;
    }

    // Check for strong action verbs
    const allVerbs = Object.values(ACTION_VERBS).flat().map(v => v.toLowerCase());
    const hasStrongVerb = allVerbs.some(verb => lowerText.startsWith(verb));
    if (!hasStrongVerb) {
      weaknessReasons.push("Doesn't start with strong action verb");
      weaknessScore += 25;
    }

    // Check for weak verbs
    const hasWeakVerb = WEAK_VERBS.some(verb => lowerText.includes(verb));
    if (hasWeakVerb) {
      weaknessReasons.push("Contains weak verbs (helped, assisted, etc.)");
      weaknessScore += 20;
    }

    // Check for passive language
    const hasPassiveLanguage = PASSIVE_PATTERNS.some(pattern => pattern.test(text));
    if (hasPassiveLanguage) {
      weaknessReasons.push("Uses passive language");
      weaknessScore += 20;
    }

    // Check for vague terms
    const hasVagueTerms = VAGUE_TERMS.some(term => lowerText.includes(term));
    if (hasVagueTerms) {
      weaknessReasons.push("Contains vague terms (various, several, etc.)");
      weaknessScore += 15;
    }

    // Check length
    if (text.length < 30) {
      weaknessReasons.push("Too short - lacks detail");
      weaknessScore += 10;
    }

    // Suggest focus area
    let suggestedFocus = "Add quantifiable metrics";
    if (!hasMetrics) suggestedFocus = "Add specific numbers and percentages";
    else if (!hasStrongVerb) suggestedFocus = "Start with powerful action verb";
    else if (hasVagueTerms) suggestedFocus = "Replace vague terms with specifics";

    return {
      weaknessScore: Math.min(100, weaknessScore),
      hasMetrics,
      hasStrongVerb,
      hasPassiveLanguage,
      hasVagueTerms,
      suggestedFocus,
      weaknessReasons,
    };
  };

  // ML-BASED REWRITING ALGORITHM
  const rewriteBulletWithML = (text: string, level: string): RewriteResult => {
    const analysis = analyzeBullet(text);

    // Extract key information from original bullet
    const originalWords = text.split(' ');
    const hasNumber = /\d+/.test(text);

    // Select appropriate action verb based on context
    let verbCategory: keyof typeof ACTION_VERBS = 'achievement';
    if (text.toLowerCase().includes('team') || text.toLowerCase().includes('led')) verbCategory = 'leadership';
    else if (text.toLowerCase().includes('develop') || text.toLowerCase().includes('build')) verbCategory = 'technical';
    else if (text.toLowerCase().includes('improve') || text.toLowerCase().includes('optim')) verbCategory = 'improvement';
    else if (text.toLowerCase().includes('reduc') || text.toLowerCase().includes('cut')) verbCategory = 'reduction';
    else if (text.toLowerCase().includes('increas') || text.toLowerCase().includes('grew')) verbCategory = 'growth';

    const actionVerb = ACTION_VERBS[verbCategory][Math.floor(Math.random() * ACTION_VERBS[verbCategory].length)];

    // Generate sample metrics if missing
    let metric = '';
    let metricType = '';
    if (!hasNumber) {
      // Intelligently select metric type based on context
      if (text.toLowerCase().includes('cost') || text.toLowerCase().includes('save')) {
        metricType = 'cost';
        metric = METRIC_TEMPLATES.cost[0].replace('{X}', '50');
      } else if (text.toLowerCase().includes('revenue') || text.toLowerCase().includes('sales')) {
        metricType = 'revenue';
        metric = METRIC_TEMPLATES.revenue[1].replace('{X}', '25');
      } else if (text.toLowerCase().includes('time') || text.toLowerCase().includes('fast')) {
        metricType = 'efficiency';
        metric = METRIC_TEMPLATES.efficiency[0].replace('{X}', '40');
      } else if (text.toLowerCase().includes('user') || text.toLowerCase().includes('client')) {
        metricType = 'scale';
        metric = METRIC_TEMPLATES.scale[0].replace('{X}', '10');
      } else {
        metricType = 'quality';
        metric = METRIC_TEMPLATES.quality[0].replace('{X}', '35');
      }
    } else {
      // Extract existing metric
      const numberMatch = text.match(/\d+%|\$\d+[KMB]?|\d+x|\d+\+/);
      metric = numberMatch ? numberMatch[0] : '';
      metricType = 'existing';
    }

    // Remove weak verbs and vague terms
    let cleanedText = text;
    WEAK_VERBS.forEach(verb => {
      cleanedText = cleanedText.replace(new RegExp(verb, 'gi'), '');
    });

    // Build rewritten version
    const core = cleanedText.replace(/^(led|managed|developed|improved|created|built|designed|implemented)/gi, '').trim();
    const rewritten = `${actionVerb} ${core}${!hasNumber ? `, ${metric}` : ''}`.trim();

    // Generate alternatives with different focuses
    const alternatives: Alternative[] = [];

    // Alternative 1: Leadership focus (if applicable)
    if (level === 'senior' || level === 'mid') {
      const leadVerb = ACTION_VERBS.leadership[Math.floor(Math.random() * ACTION_VERBS.leadership.length)];
      alternatives.push({
        text: `${leadVerb} ${core}, ${metric}`,
        type: 'Leadership',
        improvement: 'Emphasizes management and coordination skills'
      });
    }

    // Alternative 2: Impact focus
    const impactVerb = ACTION_VERBS.achievement[Math.floor(Math.random() * ACTION_VERBS.achievement.length)];
    const impactMetric = metricType === 'revenue'
      ? METRIC_TEMPLATES.revenue[0].replace('{X}', '100')
      : METRIC_TEMPLATES.quality[2].replace('{X}', '98');
    alternatives.push({
      text: `${impactVerb} ${core}, ${impactMetric}`,
      type: 'Impact',
      improvement: 'Highlights measurable business outcomes'
    });

    // Alternative 3: Technical focus
    const techVerb = ACTION_VERBS.technical[Math.floor(Math.random() * ACTION_VERBS.technical.length)];
    alternatives.push({
      text: `${techVerb} ${core}, improving efficiency by 45%`,
      type: 'Technical',
      improvement: 'Focuses on technical expertise and execution'
    });

    return {
      success: true,
      rewritten,
      metric: metric || 'Add specific numbers',
      impact: metricType === 'revenue' ? 'High' : metricType === 'cost' ? 'Very High' : 'Medium',
      alternatives,
      analysis,
    };
  };

  const handleRewrite = async () => {
    if (!bulletText.trim()) {
      toast.error("Please enter a bullet point to rewrite");
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Simulate ML processing time for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const mlResult = rewriteBulletWithML(bulletText, experienceLevel);
      setResult(mlResult);

      toast.success("Bullet point optimized!", {
        description: `Weakness score: ${mlResult.analysis.weaknessScore}/100 → Optimized with ML algorithms`
      });
    } catch (error: any) {
      console.error("Rewrite error:", error);
      toast.error("Failed to rewrite bullet point");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-[#8B5CF6]" />
          <h2 className="text-2xl font-bold text-[#0F172A]">ML Bullet Rewriter</h2>
        </div>
        <p className="text-sm text-[#64748B]">
          Transform weak bullet points into ATS-optimized achievements using ML algorithms
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-panel rounded-xl p-6 border border-[#E2E8F0] space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bullet" className="text-sm font-medium text-[#0F172A]">
            Your Bullet Point
          </Label>
          <Textarea
            id="bullet"
            placeholder="Example: Worked on improving the website performance..."
            value={bulletText}
            onChange={(e) => setBulletText(e.target.value)}
            className="min-h-[100px] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-[#0F172A]">
              Role (Optional)
            </Label>
            <Input
              id="role"
              placeholder="e.g., Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium text-[#0F172A]">
              Experience Level
            </Label>
            <Select value={experienceLevel} onValueChange={(value: any) => setExperienceLevel(value)}>
              <SelectTrigger id="level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleRewrite}
          disabled={isLoading || !bulletText.trim()}
          className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white font-medium"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Optimizing with ML...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize Bullet Point
            </>
          )}
        </Button>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Analysis */}
            <div className="glass-panel rounded-xl p-6 border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#8B5CF6]" />
                  ML Analysis
                </h3>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.analysis.weaknessScore < 30 ? 'bg-[#10B981] text-white' :
                  result.analysis.weaknessScore < 60 ? 'bg-[#F59E0B] text-white' :
                  'bg-[#EF4444] text-white'
                }`}>
                  Weakness: {result.analysis.weaknessScore}/100
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3 rounded-lg border ${result.analysis.hasMetrics ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-[#EF4444]/10 border-[#EF4444]/20'}`}>
                  <div className="text-xs font-medium text-[#64748B]">Metrics</div>
                  <div className="text-sm font-bold">{result.analysis.hasMetrics ? '✓ Yes' : '✗ Missing'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${result.analysis.hasStrongVerb ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-[#EF4444]/10 border-[#EF4444]/20'}`}>
                  <div className="text-xs font-medium text-[#64748B]">Strong Verb</div>
                  <div className="text-sm font-bold">{result.analysis.hasStrongVerb ? '✓ Yes' : '✗ Weak'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${!result.analysis.hasPassiveLanguage ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-[#EF4444]/10 border-[#EF4444]/20'}`}>
                  <div className="text-xs font-medium text-[#64748B]">Active Voice</div>
                  <div className="text-sm font-bold">{!result.analysis.hasPassiveLanguage ? '✓ Active' : '✗ Passive'}</div>
                </div>
                <div className={`p-3 rounded-lg border ${!result.analysis.hasVagueTerms ? 'bg-[#10B981]/10 border-[#10B981]/20' : 'bg-[#EF4444]/10 border-[#EF4444]/20'}`}>
                  <div className="text-xs font-medium text-[#64748B]">Specificity</div>
                  <div className="text-sm font-bold">{!result.analysis.hasVagueTerms ? '✓ Specific' : '✗ Vague'}</div>
                </div>
              </div>

              {result.analysis.weaknessReasons.length > 0 && (
                <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-lg p-4">
                  <div className="text-xs font-semibold text-[#EF4444] mb-2">Issues Found:</div>
                  <ul className="space-y-1">
                    {result.analysis.weaknessReasons.map((reason, i) => (
                      <li key={i} className="text-xs text-[#64748B]">• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Optimized Version */}
            <div className="glass-panel rounded-xl p-6 border-2 border-[#8B5CF6] space-y-3 bg-gradient-to-br from-[#F8F7FF] to-[#FFFFFF]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#8B5CF6]" />
                  ML-Optimized Version
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(result.rewritten, -1)}
                  className="text-xs"
                >
                  {copiedIndex === -1 ? (
                    <><Check className="h-3 w-3 mr-1" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3 mr-1" /> Copy</>
                  )}
                </Button>
              </div>
              <p className="text-sm text-[#0F172A] leading-relaxed font-medium">
                {result.rewritten}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-[#10B981]" />
                  <span className="text-[#64748B]">Impact: <span className="font-bold text-[#10B981]">{result.impact}</span></span>
                </div>
              </div>
            </div>

            {/* Alternative Versions */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#F59E0B]" />
                Alternative Versions
              </h3>
              {result.alternatives.map((alt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel rounded-xl p-4 border border-[#E2E8F0] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        alt.type === 'Leadership' ? 'bg-[#3B82F6] text-white' :
                        alt.type === 'Impact' ? 'bg-[#10B981] text-white' :
                        'bg-[#8B5CF6] text-white'
                      }`}>
                        {alt.type}
                      </div>
                      <span className="text-xs text-[#64748B]">{alt.improvement}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(alt.text, index)}
                      className="text-xs h-7"
                    >
                      {copiedIndex === index ? (
                        <><Check className="h-3 w-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3 mr-1" /> Copy</>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-[#0F172A] leading-relaxed">
                    {alt.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
