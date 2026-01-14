import { useState } from "react";
import { motion } from "framer-motion";

interface WeakPhrase {
  phrase: string;
  location: string;
  context: string;
  reason: string;
  fixes: string[];
}

interface UnquantifiedAchievement {
  title: string;
  description: string;
  suggestions: string[];
}

interface FluffDetectorProps {
  resumeText?: string;
  clarityScore?: number;
}

export function FluffDetector({
  resumeText = "",
  clarityScore = 73
}: FluffDetectorProps) {

  const [selectedMetrics, setSelectedMetrics] = useState<Record<number, number>>({});

  // Detect weak phrases from actual resume text
  const detectWeakPhrases = (text: string): WeakPhrase[] => {
    const weakPhrasePatterns = [
      {
        pattern: /responsible for/gi,
        phrase: "responsible for",
        reason: "Passive. Doesn't convey ownership or impact.",
        fixes: ["Led", "Directed", "Managed", "Oversaw"]
      },
      {
        pattern: /helped with/gi,
        phrase: "helped with",
        reason: "Vague contribution level. Show direct impact.",
        fixes: ["Architected", "Spearheaded", "Executed", "Drove"]
      },
      {
        pattern: /various/gi,
        phrase: "various",
        reason: "Too generic. Be specific about technologies.",
        fixes: ["Specific names", "List exact tools", "Name technologies"]
      },
      {
        pattern: /worked on/gi,
        phrase: "worked on",
        reason: "Vague and passive. Show your specific role.",
        fixes: ["Developed", "Built", "Designed", "Created"]
      },
      {
        pattern: /involved in/gi,
        phrase: "involved in",
        reason: "Unclear contribution level.",
        fixes: ["Led", "Executed", "Delivered", "Drove"]
      },
      {
        pattern: /participated in/gi,
        phrase: "participated in",
        reason: "Sounds passive and minimal.",
        fixes: ["Contributed to", "Delivered", "Executed", "Drove"]
      }
    ];

    const detected: WeakPhrase[] = [];
    const lines = text.split('\n');

    weakPhrasePatterns.forEach(({ pattern, phrase, reason, fixes }) => {
      let match;
      const globalPattern = new RegExp(pattern.source, 'gi');
      while ((match = globalPattern.exec(text)) !== null) {
        // Find the line number
        const beforeMatch = text.substring(0, match.index);
        const lineNum = beforeMatch.split('\n').length;

        // Get context (30 chars before and after)
        const start = Math.max(0, match.index - 30);
        const end = Math.min(text.length, match.index + phrase.length + 30);
        const context = '...' + text.substring(start, end).trim() + '...';

        detected.push({
          phrase,
          location: `Line ${lineNum}`,
          context,
          reason,
          fixes
        });

        // Limit to 5 instances per phrase type
        if (detected.filter(d => d.phrase === phrase).length >= 2) break;
      }
    });

    return detected.slice(0, 6); // Max 6 weak phrases
  };

  // Detect unquantified achievements from actual resume text
  const detectUnquantifiedAchievements = (text: string): UnquantifiedAchievement[] => {
    const achievementPatterns = [
      /improved/gi,
      /enhanced/gi,
      /optimized/gi,
      /increased/gi,
      /reduced/gi,
      /led/gi,
      /managed/gi,
      /developed/gi
    ];

    const detected: UnquantifiedAchievement[] = [];
    const lines = text.split('\n').filter(line => line.trim().length > 20);

    lines.forEach((line, idx) => {
      // Check if line has achievement word but no numbers
      const hasAchievementWord = achievementPatterns.some(p => p.test(line));
      const hasNumber = /\d+/.test(line);
      const hasPercent = /%/.test(line);
      const hasCurrency = /\$/.test(line);

      if (hasAchievementWord && !hasNumber && !hasPercent && !hasCurrency) {
        // Extract the achievement phrase
        const achievement = line.trim().substring(0, 60);

        detected.push({
          title: achievement,
          description: `Line ${idx + 1}`,
          suggestions: [
            "Add percentage improvement (e.g., by 40%)",
            "Include time saved or cost reduction",
            "Specify scale or volume (e.g., 1000+ users)"
          ]
        });
      }
    });

    return detected.slice(0, 4); // Max 4 achievements
  };

  const weakPhrases = detectWeakPhrases(resumeText);
  const unquantifiedAchievements = detectUnquantifiedAchievements(resumeText);

  // Power verbs library
  const powerVerbCategories = [
    {
      category: "Leadership",
      verbs: ["Led", "Directed", "Orchestrated", "Spearheaded", "Championed"]
    },
    {
      category: "Achievement",
      verbs: ["Achieved", "Delivered", "Executed", "Accomplished", "Attained"]
    },
    {
      category: "Improvement",
      verbs: ["Optimized", "Enhanced", "Streamlined", "Transformed", "Elevated"]
    },
    {
      category: "Innovation",
      verbs: ["Pioneered", "Architected", "Designed", "Engineered", "Developed"]
    }
  ];

  // Calculate real metrics from resume text
  const calculateMetrics = (text: string) => {
    if (!text || text.trim().length === 0) {
      return {
        activeVoicePercent: 0,
        buzzwordDensity: 0,
        quantificationPercent: 0
      };
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

    // Active voice detection (simple heuristic: sentences starting with power verbs)
    const powerVerbs = ['led', 'developed', 'managed', 'created', 'built', 'designed', 'implemented', 'achieved', 'delivered', 'improved'];
    const activeVoiceSentences = sentences.filter(s => {
      const firstWord = s.trim().split(/\s+/)[0]?.toLowerCase();
      return powerVerbs.includes(firstWord);
    });
    const activeVoicePercent = sentences.length > 0 ? Math.round((activeVoiceSentences.length / sentences.length) * 100) : 0;

    // Buzzword density (common buzzwords)
    const buzzwords = ['synergy', 'leverage', 'paradigm', 'revolutionary', 'innovative', 'cutting-edge', 'world-class', 'best-in-class', 'guru', 'ninja', 'rockstar'];
    const buzzwordCount = buzzwords.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    const buzzwordDensity = text.length > 0 ? Math.round((buzzwordCount / (text.split(/\s+/).length / 100))) : 0;

    // Quantification percentage (sentences with numbers, %, or $)
    const quantifiedSentences = sentences.filter(s => /\d+|%|\$/.test(s));
    const quantificationPercent = sentences.length > 0 ? Math.round((quantifiedSentences.length / sentences.length) * 100) : 0;

    return {
      activeVoicePercent: Math.min(100, Math.max(0, activeVoicePercent)),
      buzzwordDensity: Math.min(100, Math.max(0, buzzwordDensity)),
      quantificationPercent: Math.min(100, Math.max(0, quantificationPercent))
    };
  };

  const { activeVoicePercent, buzzwordDensity, quantificationPercent } = calculateMetrics(resumeText);

  const circumferenceScore = 2 * Math.PI * 45;
  const offsetScore = circumferenceScore - (clarityScore / 100) * circumferenceScore;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          {/* Left: Title & Description */}
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
              Clarity & Impact Audit
            </h2>
            <p className="text-[#475569] text-sm">
              Detecting weak language, buzzwords, and unquantified claims.
            </p>
          </div>

          {/* Right: Clarity Score Circle */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <defs>
                  <linearGradient id="clarityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-[#E2E8F0]"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="url(#clarityGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumferenceScore}
                  strokeDashoffset={offsetScore}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#0F172A] font-mono">{clarityScore}</span>
                <span className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold">Clarity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-widest font-bold mb-1">Active Voice</p>
                <p className="text-2xl font-bold text-[#0F172A] font-mono">{activeVoicePercent}%</p>
              </div>
              <span className="material-symbols-outlined text-[#22C55E] text-[20px]">check_circle</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-widest font-bold mb-1">Buzzword Density</p>
                <p className="text-2xl font-bold text-[#0F172A] font-mono">{buzzwordDensity}%</p>
              </div>
              <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">trending_down</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase tracking-widest font-bold mb-1">Quantification</p>
                <p className="text-2xl font-bold text-[#0F172A] font-mono">{quantificationPercent}%</p>
              </div>
              <span className="material-symbols-outlined text-[#F59E0B] text-[20px]">warning</span>
            </div>
          </motion.div>
        </div>

        {/* AI Rewrite All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:border-[#8B5CF6] transition-all"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8B5CF6]">auto_awesome</span>
                AI-Powered Rewrite
              </h3>
              <p className="text-sm text-[#64748B]">
                Let AI rewrite your entire resume with power verbs, metrics, and impact statements.
              </p>
            </div>
            <button className="px-6 py-3 bg-[#3B82F6] hover:bg-[#3B82F6] text-[#0F172A] rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap text-sm">
              Rewrite All
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Weak Phrase Detector */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Weak Phrases */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-card"
          >
            <div className="p-5 border-b border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#EF4444] text-[20px]">error</span>
                Weak Phrase Detector
                <span className="bg-red-50 text-[#EF4444] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ml-2 border border-red-100">
                  {weakPhrases.length} Found
                </span>
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                These phrases weaken your impact. Replace them with power verbs.
              </p>
            </div>

            <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto terminal-scroll">
              {weakPhrases.length > 0 ? (
                weakPhrases.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-sm font-bold text-[#EF4444] bg-red-50 px-2 py-1 rounded border border-red-100">
                            "{item.phrase}"
                          </span>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            {item.location}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] italic mb-2">
                          {item.context}
                        </p>
                        <p className="text-xs text-[#0F172A]">
                          <span className="font-semibold">Why it's weak:</span> {item.reason}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#0F172A] mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#22C55E] text-sm">lightbulb</span>
                        Suggested Fixes:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.fixes.map((fix, fixIndex) => (
                          <button
                            key={fixIndex}
                            className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded border border-green-200 transition-colors"
                          >
                            {fix}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <span className="material-symbols-outlined text-green-600 text-4xl mb-2 block">check_circle</span>
                  <p className="text-sm font-semibold text-[#0F172A] mb-1">No Weak Phrases Detected</p>
                  <p className="text-xs text-[#64748B]">Your resume uses strong, active language.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Power Verb Injection Library */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-card"
          >
            <div className="p-5 border-b border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">bolt</span>
                Power Verb Injection Library
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Start your bullets with these instead of weak phrases.
              </p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {powerVerbCategories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-4"
                  >
                    <h4 className="text-sm font-bold text-[#3B82F6] mb-3">
                      {category.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.verbs.map((verb, vIndex) => (
                        <span
                          key={vIndex}
                          className="px-2 py-1 bg-[#FFFFFF] text-[#475569] text-xs rounded border border-[#E2E8F0]"
                        >
                          {verb}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Impact Quantification Audit */}
        <div className="col-span-12 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-card sticky top-6"
          >
            <div className="p-5 border-b border-[#E2E8F0]">
              <h3 className="font-semibold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8B5CF6] text-[20px]">query_stats</span>
                Impact Quantification Audit
                <span className="bg-purple-50 text-[#8B5CF6] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ml-2 border border-purple-100">
                  {unquantifiedAchievements.length} Missing
                </span>
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Achievements without numbers are 70% less impactful. Add metrics.
              </p>
            </div>

            <div className="p-5 space-y-5 max-h-[800px] overflow-y-auto terminal-scroll">
              {unquantifiedAchievements.length > 0 ? (
                unquantifiedAchievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-purple-50 rounded-lg border border-purple-200 p-4"
                  >
                    <div className="mb-3">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="material-symbols-outlined text-[#8B5CF6] text-[16px] mt-0.5">flag</span>
                        <div>
                          <h4 className="text-sm font-bold text-[#0F172A]">
                            {achievement.title}
                          </h4>
                          <p className="text-[10px] text-[#64748B] font-mono">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#0F172A] mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#8B5CF6] text-sm">auto_awesome</span>
                        AI-Suggested Quantifications:
                      </p>
                      <div className="space-y-2">
                        {achievement.suggestions.map((suggestion, sIndex) => (
                          <label
                            key={sIndex}
                            className="flex items-start gap-3 p-2 rounded hover:bg-[#FFFFFF] cursor-pointer transition-colors group border border-transparent hover:border-purple-200"
                          >
                            <input
                              type="radio"
                              name={`metric-${index}`}
                              checked={selectedMetrics[index] === sIndex}
                              onChange={() => setSelectedMetrics({ ...selectedMetrics, [index]: sIndex })}
                              className="mt-0.5 w-4 h-4 text-[#8B5CF6] focus:ring-purple-500 focus:ring-2"
                            />
                            <span className="text-xs text-[#475569] group-hover:text-[#0F172A] flex-1">
                              {suggestion}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button className="w-full mt-3 px-3 py-2 bg-[#8B5CF6] hover:bg-[#8B5CF6] text-[#0F172A] text-xs font-semibold rounded transition-colors">
                      Apply Selected Metric
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <span className="material-symbols-outlined text-purple-600 text-4xl mb-2 block">query_stats</span>
                  <p className="text-sm font-semibold text-[#0F172A] mb-1">All Achievements Quantified</p>
                  <p className="text-xs text-[#64748B]">Your resume includes metrics and specific results.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-blue-600 hover:to-purple-600 text-[#0F172A] rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center transition-all hover:scale-105 z-50">
        <span className="material-symbols-outlined text-2xl">chat</span>
      </button>
    </div>
  );
}
