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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Keyword Analysis</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Semantic matching against standard Data Science JDs.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-blue-500">{matchRate}%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Match Rate</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Found Signals */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Found Signals
              <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                {foundSignals.length} Total
              </span>
            </h3>
            <div className="flex gap-2 text-xs">
              <button className="text-slate-400 hover:text-blue-500 transition-colors">Group by Type</button>
              <span className="text-slate-600">|</span>
              <button className="text-blue-500 font-medium">List View</button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 h-full shadow-sm relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {foundSignals.map((signal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">{signal.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 font-mono">
                        {signal.keyword}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Found in: {signal.location}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Missing Critical Signals */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              Missing Critical Signals
              <span className="bg-purple-900/30 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-mono border border-purple-500/20">
                High Impact
              </span>
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Fixing these increases score by ~15%
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 h-full shadow-sm relative overflow-hidden"
          >
            {/* Decorative blob */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-3">
              {missingSignals.map((signal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`relative group rounded-lg p-4 border transition-all ${
                    signal.isPriority
                      ? 'bg-white dark:bg-slate-900/40 border-purple-200 dark:border-purple-500/30 hover:border-purple-500 shadow-[0_0_15px_rgba(0,0,0,0.05)]'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${signal.isPriority ? 'text-purple-400' : 'text-slate-400'}`}>
                        {signal.isPriority ? 'warning_amber' : 'do_not_disturb_on'}
                      </span>
                      <h4 className={`text-base font-mono ${signal.isPriority ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-200'}`}>
                        {signal.keyword}
                      </h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${
                        signal.isPriority
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600'
                      }`}>
                        {signal.isPriority && <span className="material-symbols-outlined text-[10px]">trending_up</span>}
                        {signal.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                    {signal.description}
                  </p>
                  {signal.isPriority && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 py-1.5 rounded border border-slate-200 dark:border-slate-700 transition-colors">
                        View Examples
                      </button>
                      <button className="px-3 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs transition-colors">
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
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-blue-500">cloud</span>
            Industry Keyword Frequency
          </h3>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 relative overflow-hidden"
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
                        ? 'text-white bg-blue-500/20 border border-blue-500/40 px-3 py-1 rounded-lg backdrop-blur-sm'
                        : kw.color === 'accent'
                        ? 'text-purple-500 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-lg backdrop-blur-sm'
                        : 'text-white bg-blue-500/10 border border-blue-500/30 px-2 py-1 rounded backdrop-blur-sm'
                      : `text-${kw.color} ${kw.size !== 'sm' ? 'border border-slate-700/50 px-2 py-1 rounded' : 'px-2'}`
                    }
                    cursor-help transition-all hover:scale-110
                  `}
                  title={kw.highlight ? 'Very High Frequency' : 'Standard'}
                >
                  {kw.text}
                </motion.span>
              ))}
            </div>

            <div className="mt-6 flex justify-center gap-6 text-[10px] text-slate-500 font-mono uppercase tracking-widest border-t border-slate-200 dark:border-slate-800 pt-4 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-blue-500/40"></div>
                High Demand
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-slate-400"></div>
                Standard
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded bg-slate-700"></div>
                Niche
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
