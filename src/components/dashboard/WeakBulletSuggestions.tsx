import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Lightbulb, TrendingUp } from "lucide-react";

interface WeakBullet {
  original: string;
  suggestions: Array<{
    type: 'volume' | 'efficiency' | 'money';
    improved: string;
    explanation: string;
  }>;
}

interface WeakBulletSuggestionsProps {
  ocrText: string;
  metricsCount: number;
}

export function WeakBulletSuggestions({ ocrText, metricsCount }: WeakBulletSuggestionsProps) {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  // Detect weak bullets (sentences without numbers)
  const detectWeakBullets = (text: string): WeakBullet[] => {
    if (!text) return [];

    // Split into sentences/bullet points
    const sentences = text
      .split(/[.\n•]/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200); // Reasonable bullet point length

    // Find sentences without any metrics
    const weakBullets = sentences
      .filter(sentence => {
        // Check if sentence has NO numbers, percentages, or monetary values
        const hasMetrics = /\d/.test(sentence);
        return !hasMetrics && sentence.split(' ').length > 5; // At least 5 words
      })
      .slice(0, 3); // Show top 3

    // Generate AI suggestions for each weak bullet
    return weakBullets.map(bullet => ({
      original: bullet,
      suggestions: generateSuggestions(bullet)
    }));
  };

  // Generate 3 types of metric suggestions
  const generateSuggestions = (bullet: string): WeakBullet['suggestions'] => {
    const lowerBullet = bullet.toLowerCase();

    // Detect context to provide relevant suggestions
    const isDatabase = /database|sql|data|records|storage/i.test(bullet);
    const isWeb = /website|app|application|frontend|backend|api/i.test(bullet);
    const isSupport = /support|help|assist|maintain|manage|coordinate/i.test(bullet);
    const isOptimize = /optimi[zs]e|improve|enhance|increase|reduce|decrease/i.test(bullet);

    const suggestions: WeakBullet['suggestions'] = [];

    // Volume suggestion (#)
    if (isDatabase) {
      suggestions.push({
        type: 'volume',
        improved: bullet.replace(/\.$/, '') + ' of 5M+ records across 12 production servers',
        explanation: 'Added scale: 5M+ records shows data volume you handled'
      });
    } else if (isSupport) {
      suggestions.push({
        type: 'volume',
        improved: bullet.replace(/\.$/, '') + ' for 50+ daily active users across 3 time zones',
        explanation: 'Added volume: 50+ users shows your support capacity'
      });
    } else if (isWeb) {
      suggestions.push({
        type: 'volume',
        improved: bullet.replace(/\.$/, '') + ' serving 100K+ monthly active users',
        explanation: 'Added traffic: 100K+ MAU demonstrates scale'
      });
    } else {
      suggestions.push({
        type: 'volume',
        improved: bullet.replace(/\.$/, '') + ' for a team of 15+ engineers',
        explanation: 'Added team size: Shows collaboration scope'
      });
    }

    // Efficiency suggestion (%)
    if (isOptimize) {
      suggestions.push({
        type: 'efficiency',
        improved: bullet.replace(/\.$/, '') + ', reducing response time by 40% and improving user satisfaction',
        explanation: 'Added efficiency: 40% improvement is concrete and impressive'
      });
    } else if (isDatabase) {
      suggestions.push({
        type: 'efficiency',
        improved: bullet.replace(/\.$/, '') + ' with 99.9% uptime, reducing query latency by 25%',
        explanation: 'Added reliability metrics: Uptime and latency are key database KPIs'
      });
    } else if (isWeb) {
      suggestions.push({
        type: 'efficiency',
        improved: bullet.replace(/\.$/, '') + ', improving page load speed by 35% and SEO ranking',
        explanation: 'Added performance: Load speed directly impacts user experience'
      });
    } else {
      suggestions.push({
        type: 'efficiency',
        improved: bullet.replace(/\.$/, '') + ', saving 10+ hours per week in manual work',
        explanation: 'Added time savings: Quantifies your efficiency impact'
      });
    }

    // Money suggestion ($)
    if (isWeb || lowerBullet.includes('revenue') || lowerBullet.includes('sales')) {
      suggestions.push({
        type: 'money',
        improved: bullet.replace(/\.$/, '') + ', contributing to $500K+ in annual recurring revenue',
        explanation: 'Added business impact: Revenue shows ROI of your work'
      });
    } else if (lowerBullet.includes('budget') || lowerBullet.includes('cost')) {
      suggestions.push({
        type: 'money',
        improved: bullet.replace(/\.$/, '') + ' while reducing operational costs by $50K annually',
        explanation: 'Added cost savings: Financial impact is highly valued'
      });
    } else {
      suggestions.push({
        type: 'money',
        improved: bullet.replace(/\.$/, '') + ' with a project budget of $75K',
        explanation: 'Added budget responsibility: Shows you handle resources'
      });
    }

    return suggestions;
  };

  const weakBullets = detectWeakBullets(ocrText);

  // Don't show if no weak bullets or if metrics are already good
  if (weakBullets.length === 0 || metricsCount >= 8) {
    return null;
  }

  const currentBullet = weakBullets[0]; // Show first weak bullet

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-3xl mt-8"
      >
        <div className="glass-card rounded-xl p-5 md:p-6 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 p-2 bg-amber-500/20 rounded-lg">
              <Lightbulb className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-base md:text-lg flex items-center gap-2">
                ⚠️ Weak Bullet Detected
                <span className="text-xs font-normal text-slate-400">({weakBullets.length} found)</span>
              </h3>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                This bullet point lacks quantifiable impact. Add numbers to make it stronger.
              </p>
            </div>
          </div>

          {/* Original Bullet */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 md:p-4 mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Original</p>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {currentBullet.original}
            </p>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <p className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">
                💡 AI Suggestions (Click to Apply)
              </p>
            </div>

            {currentBullet.suggestions.map((suggestion, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                onClick={() => setSelectedSuggestionIndex(idx)}
                className={`w-full text-left p-3 md:p-4 rounded-lg border-2 transition-all duration-300 group ${
                  selectedSuggestionIndex === idx
                    ? 'bg-cyan-500/10 border-cyan-500/50'
                    : 'bg-slate-800/30 border-slate-700 hover:border-cyan-500/30 hover:bg-slate-800/50'
                }`}
              >
                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    suggestion.type === 'volume' ? 'bg-blue-500/20 text-blue-400' :
                    suggestion.type === 'efficiency' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {suggestion.type === 'volume' ? '# Volume' :
                     suggestion.type === 'efficiency' ? '% Efficiency' :
                     '$ Money'}
                  </span>
                  {selectedSuggestionIndex === idx && (
                    <span className="text-[10px] text-cyan-400 font-semibold">✓ Selected</span>
                  )}
                </div>

                {/* Improved Text */}
                <p className="text-slate-200 text-sm md:text-base leading-relaxed mb-2 group-hover:text-white transition-colors">
                  {suggestion.improved}
                </p>

                {/* Explanation */}
                <p className="text-slate-500 text-xs leading-relaxed">
                  {suggestion.explanation}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Action Button */}
          <div className="mt-5 flex items-center gap-3">
            <button
              className="flex-1 h-10 md:h-11 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              Apply Selected & Continue
            </button>
            <button
              className="h-10 md:h-11 px-4 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
