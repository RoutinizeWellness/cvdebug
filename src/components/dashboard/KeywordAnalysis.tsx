import { motion } from "framer-motion";

interface KeywordAnalysisProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchRate?: number;
}

interface FoundKeyword {
  keyword: string;
  icon: string;
  location: string;
}

interface MissingKeyword {
  keyword: string;
  impact: string;
  impactPercent: number;
  description: string;
  isPriority: boolean;
}

export function KeywordAnalysis({
  matchedKeywords,
  missingKeywords,
  matchRate = 82
}: KeywordAnalysisProps) {

  // Map matched keywords to found signals with icons
  const foundSignals: FoundKeyword[] = matchedKeywords.slice(0, 15).map((keyword, index) => {
    const icons = ["code", "storage", "cloud", "psychology", "view_in_ar", "sync"];
    const locations = ["Skills, Experience", "Projects", "Skills", "Experience", "Skills", "Experience"];

    return {
      keyword,
      icon: icons[index % icons.length],
      location: locations[index % locations.length]
    };
  });

  // Map missing keywords to critical signals with impact
  const missingSignals: MissingKeyword[] = missingKeywords.slice(0, 3).map((keyword, index) => {
    const impacts = [
      { impact: "AI Impact +8%", percent: 8, isPriority: true },
      { impact: "Impact +4%", percent: 4, isPriority: false },
      { impact: "Impact +3%", percent: 3, isPriority: false }
    ];

    const descriptions = [
      `Highly correlated with Data Science roles. Often paired with TensorFlow. Consider adding to your "Technical Skills" section.`,
      `Critical for Big Data processing roles. ATS scanners look for this in "Tools" or "Projects".`,
      `Demonstrates product sense. Usually found in experience descriptions.`
    ];

    return {
      keyword,
      impact: impacts[index % impacts.length].impact,
      impactPercent: impacts[index % impacts.length].percent,
      description: descriptions[index % descriptions.length],
      isPriority: impacts[index % impacts.length].isPriority
    };
  });

  // Create industry keyword cloud
  const industryKeywords = [
    { text: "Python", size: "2xl", weight: "bold", color: "primary", highlight: true },
    { text: "SQL", size: "xl", weight: "bold", color: "slate-200", highlight: false },
    { text: "Machine Learning", size: "2xl", weight: "bold", color: "accent", highlight: true },
    { text: "Pandas", size: "lg", weight: "medium", color: "slate-400", highlight: false },
    { text: "NumPy", size: "base", weight: "medium", color: "slate-500", highlight: false },
    { text: "Data Visualization", size: "lg", weight: "medium", color: "slate-300", highlight: false },
    { text: "Deep Learning", size: "xl", weight: "bold", color: "white", highlight: true },
    { text: "Git", size: "base", weight: "medium", color: "slate-500", highlight: false },
    { text: "Tableau", size: "sm", weight: "normal", color: "slate-600", highlight: false },
    { text: "Hadoop", size: "sm", weight: "normal", color: "slate-600", highlight: false },
    { text: "NLP", size: "base", weight: "normal", color: "slate-400", highlight: false },
    { text: "Keras", size: "sm", weight: "normal", color: "slate-600", highlight: false },
    { text: "R", size: "sm", weight: "normal", color: "slate-600", highlight: false },
    { text: "Statistics", size: "lg", weight: "medium", color: "slate-300", highlight: false },
    { text: "Azure", size: "sm", weight: "normal", color: "slate-600", highlight: false },
    { text: "NoSQL", size: "sm", weight: "normal", color: "slate-600", highlight: false }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Keyword Analysis</h2>
          <p className="text-sm text-[#475569]">
            Semantic matching against standard Data Science JDs.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-[#3B82F6]">{matchRate}%</div>
          <div className="text-xs text-[#475569] uppercase tracking-wider">Match Rate</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Found Signals */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
              Found Signals
              <span className="bg-[#E2E8F0] text-[#475569] text-[10px] px-2 py-0.5 rounded-full font-mono">
                {foundSignals.length} Total
              </span>
            </h3>
            <div className="flex gap-2 text-xs">
              <button className="text-[#64748B] hover:text-[#3B82F6] transition-colors">Group by Type</button>
              <span className="text-[#475569]">|</span>
              <button className="text-[#3B82F6] font-medium">List View</button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 h-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {foundSignals.map((signal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3B82F6]/50 transition-all cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-[#E2E8F0] text-[#475569]">
                      <span className="material-symbols-outlined text-[16px]">{signal.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#0F172A] font-mono">
                        {signal.keyword}
                      </h4>
                      <p className="text-[10px] text-[#64748B]">in: {signal.location}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#22C55E] text-lg">check_circle</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Missing Critical Signals */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
              Missing Critical Signals
              <span className="bg-[#FEF2F2] text-[#EF4444] text-[10px] px-2 py-0.5 rounded-full font-mono border border-[#EF4444]/20">
                High Impact
              </span>
            </h3>
            <div className="text-xs text-[#64748B]">
              Fixing these increases score by ~15%
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 h-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#EF4444]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-3">
              {missingSignals.map((signal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`relative group rounded-lg p-4 border transition-all ${
                    signal.isPriority
                      ? 'bg-[#FFFFFF] border-[#EF4444]/20 hover:border-[#EF4444] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]'
                      : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#F59E0B]/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${signal.isPriority ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
                        {signal.isPriority ? 'warning_amber' : 'do_not_disturb_on'}
                      </span>
                      <h4 className={`text-base font-mono ${signal.isPriority ? 'font-bold text-[#0F172A]' : 'font-medium text-[#475569]'}`}>
                        {signal.keyword}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${
                        signal.isPriority
                          ? 'bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/20'
                          : 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20'
                      }`}>
                        {signal.isPriority && <span className="material-symbols-outlined text-[10px] text-white">trending_up</span>}
                        <span className="text-white">{signal.impact}</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#475569] mb-3 leading-relaxed">
                    {signal.description}
                  </p>
                  {signal.isPriority && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-xs text-[#0F172A] py-1.5 rounded border border-[#E2E8F0] transition-colors">
                        View Examples
                      </button>
                      <button className="px-3 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded text-xs transition-colors">
                        Auto-Add
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Full Width - Industry Keyword Frequency Cloud */}
        <div className="col-span-12 mt-4">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#3B82F6]">cloud</span>
            Industry Keyword Frequency
          </h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 relative overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {industryKeywords.map((kw, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  className={`
                    text-${kw.size} font-${kw.weight}
                    ${kw.highlight
                      ? kw.color === 'primary'
                        ? 'text-[#0F172A] bg-[#3B82F6]/20 border border-[#3B82F6]/40 px-3 py-1 rounded-lg backdrop-blur-sm'
                        : kw.color === 'accent'
                        ? 'text-[#8B5CF6] bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 px-3 py-1 rounded-lg backdrop-blur-sm'
                        : 'text-[#0F172A] bg-[#3B82F6]/10 border border-[#3B82F6]/30 px-2 py-1 rounded backdrop-blur-sm'
                      : `text-${kw.color} ${kw.size !== 'sm' ? 'border border-[#E2E8F0]/50 px-2 py-1 rounded' : 'px-2'}`
                    }
                    cursor-help transition-all hover:scale-110
                  `}
                  title={kw.highlight ? 'Very High Frequency' : 'Standard'}
                >
                  {kw.text}
                </motion.span>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-6 text-[10px] text-[#64748B] font-mono uppercase tracking-widest border-t border-[#E2E8F0] pt-4 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#3B82F6]/40"></div>
                High Demand
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#64748B]"></div>
                Standard
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-[#475569]"></div>
                Niche
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
