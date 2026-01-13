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

  // Mock data for weak phrases
  const weakPhrases: WeakPhrase[] = [
    {
      phrase: "responsible for",
      location: "Experience · Line 12",
      context: "...responsible for managing a team of engineers...",
      reason: "Passive. Doesn't convey ownership or impact.",
      fixes: ["Led", "Directed", "Managed", "Oversaw"]
    },
    {
      phrase: "helped with",
      location: "Experience · Line 18",
      context: "...helped with the migration to microservices...",
      reason: "Vague contribution level. Show direct impact.",
      fixes: ["Architected", "Spearheaded", "Executed", "Drove"]
    },
    {
      phrase: "various",
      location: "Skills · Line 3",
      context: "...worked with various cloud technologies...",
      reason: "Too generic. Be specific about technologies.",
      fixes: ["AWS, Azure, GCP", "Multi-cloud environments", "Specific tech names"]
    }
  ];

  // Mock data for unquantified achievements
  const unquantifiedAchievements: UnquantifiedAchievement[] = [
    {
      title: "Improved system performance",
      description: "Experience · Data Pipeline Project",
      suggestions: [
        "Reduced query latency by 40% (from 2s to 1.2s)",
        "Increased throughput by 3x (handling 150k requests/min)",
        "Optimized database calls, saving $12k/month in infrastructure costs"
      ]
    },
    {
      title: "Led a successful migration",
      description: "Experience · Cloud Migration Initiative",
      suggestions: [
        "Migrated 50+ microservices to Kubernetes with zero downtime",
        "Completed migration 2 weeks ahead of schedule, saving $25k",
        "Reduced deployment time from 45min to 8min (82% improvement)"
      ]
    }
  ];

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

  const activeVoicePercent = 78;
  const buzzwordDensity = 12;
  const quantificationPercent = 45;

  const circumferenceScore = 2 * Math.PI * 45;
  const offsetScore = circumferenceScore - (clarityScore / 100) * circumferenceScore;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          {/* Left: Title & Description */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Clarity & Impact Audit
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Detecting weak language, buzzwords, and unquantified claims.
            </p>
          </div>

          {/* Right: Clarity Score Circle */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <defs>
                  <linearGradient id="clarityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  stroke="url(#clarityGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumferenceScore}
                  strokeDashoffset={offsetScore}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{clarityScore}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Clarity</span>
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
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Active Voice</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeVoicePercent}%</p>
              </div>
              <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Buzzword Density</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{buzzwordDensity}%</p>
              </div>
              <span className="material-symbols-outlined text-blue-500 text-2xl">trending_down</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Quantification</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{quantificationPercent}%</p>
              </div>
              <span className="material-symbols-outlined text-amber-500 text-2xl">warning</span>
            </div>
          </motion.div>
        </div>

        {/* AI Rewrite All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl border-2 border-transparent bg-clip-padding p-6"
          style={{
            backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #3b82f6, #8b5cf6, #3b82f6)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
                AI-Powered Rewrite
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Let AI rewrite your entire resume with power verbs, metrics, and impact statements.
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/20 whitespace-nowrap">
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
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500">error</span>
                Weak Phrase Detector
                <span className="bg-red-500/20 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-mono ml-2">
                  {weakPhrases.length} Found
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                These phrases weaken your impact. Replace them with power verbs.
              </p>
            </div>

            <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
              {weakPhrases.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                          "{item.phrase}"
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {item.location}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-2">
                        {item.context}
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">Why it's weak:</span> {item.reason}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-green-500 text-sm">lightbulb</span>
                      Suggested Fixes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.fixes.map((fix, fixIndex) => (
                        <button
                          key={fixIndex}
                          className="px-3 py-1 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded border border-green-200 dark:border-green-800 transition-colors"
                        >
                          {fix}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Power Verb Injection Library */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">bolt</span>
                Power Verb Injection Library
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                    className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                  >
                    <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3">
                      {category.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.verbs.map((verb, vIndex) => (
                        <span
                          key={vIndex}
                          className="px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700"
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
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-6"
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">query_stats</span>
                Impact Quantification Audit
                <span className="bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs px-2 py-0.5 rounded-full font-mono ml-2">
                  {unquantifiedAchievements.length} Missing Metrics
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Achievements without numbers are 70% less impactful. Add metrics.
              </p>
            </div>

            <div className="p-5 space-y-5 max-h-[800px] overflow-y-auto">
              {unquantifiedAchievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800/50 p-4"
                >
                  <div className="mb-3">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="material-symbols-outlined text-purple-500 text-sm mt-0.5">flag</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-purple-500 text-sm">auto_awesome</span>
                      AI-Suggested Quantifications:
                    </p>
                    <div className="space-y-2">
                      {achievement.suggestions.map((suggestion, sIndex) => (
                        <label
                          key={sIndex}
                          className="flex items-start gap-3 p-2 rounded hover:bg-white dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                        >
                          <input
                            type="radio"
                            name={`metric-${index}`}
                            checked={selectedMetrics[index] === sIndex}
                            onChange={() => setSelectedMetrics({ ...selectedMetrics, [index]: sIndex })}
                            className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-xs text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex-1">
                            {suggestion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-3 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded transition-colors">
                    Apply Selected Metric
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center transition-all hover:scale-105 z-50">
        <span className="material-symbols-outlined text-2xl">chat</span>
      </button>
    </div>
  );
}
