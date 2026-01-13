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
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Clarity & Impact Audit
            </h2>
            <p className="text-slate-500 text-sm">
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
                    <stop offset="100%" stopColor="#a78bfa" />
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
                <span className="text-3xl font-bold text-slate-900 font-mono">{clarityScore}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Clarity</span>
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
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-1">Active Voice</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">{activeVoicePercent}%</p>
              </div>
              <span className="material-symbols-outlined text-[#22C55E] text-[20px]">check_circle</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-1">Buzzword Density</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">{buzzwordDensity}%</p>
              </div>
              <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">trending_down</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-1">Quantification</p>
                <p className="text-2xl font-bold text-slate-900 font-mono">{quantificationPercent}%</p>
              </div>
              <span className="material-symbols-outlined text-amber-500 text-[20px]">warning</span>
            </div>
          </motion.div>
        </div>

        {/* AI Rewrite All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-card hover:border-indigo-200 transition-all"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#A78BFA]">auto_awesome</span>
                AI-Powered Rewrite
              </h3>
              <p className="text-sm text-slate-500">
                Let AI rewrite your entire resume with power verbs, metrics, and impact statements.
              </p>
            </div>
            <button className="px-6 py-3 bg-[#3B82F6] hover:bg-blue-600 text-slate-900 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20 whitespace-nowrap text-sm">
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
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-card"
          >
            <div className="p-5 border-b border-[#E2E8F0]">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
                Weak Phrase Detector
                <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ml-2 border border-red-100">
                  {weakPhrases.length} Found
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                These phrases weaken your impact. Replace them with power verbs.
              </p>
            </div>

            <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto terminal-scroll">
              {weakPhrases.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-slate-50 rounded-lg border border-[#E2E8F0] p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                          "{item.phrase}"
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.location}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 italic mb-2">
                        {item.context}
                      </p>
                      <p className="text-xs text-slate-900">
                        <span className="font-semibold">Why it's weak:</span> {item.reason}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1">
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
              ))}
            </div>
          </motion.div>

          {/* Power Verb Injection Library */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-card"
          >
            <div className="p-5 border-b border-[#E2E8F0]">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">bolt</span>
                Power Verb Injection Library
              </h3>
              <p className="text-xs text-slate-500 mt-1">
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
                    className="bg-slate-50 rounded-lg border border-[#E2E8F0] p-4"
                  >
                    <h4 className="text-sm font-bold text-[#3B82F6] mb-3">
                      {category.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {category.verbs.map((verb, vIndex) => (
                        <span
                          key={vIndex}
                          className="px-2 py-1 bg-white text-slate-700 text-xs rounded border border-[#E2E8F0]"
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
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-card sticky top-6"
          >
            <div className="p-5 border-b border-[#E2E8F0]">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#A78BFA] text-[20px]">query_stats</span>
                Impact Quantification Audit
                <span className="bg-purple-50 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ml-2 border border-purple-100">
                  {unquantifiedAchievements.length} Missing
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Achievements without numbers are 70% less impactful. Add metrics.
              </p>
            </div>

            <div className="p-5 space-y-5 max-h-[800px] overflow-y-auto terminal-scroll">
              {unquantifiedAchievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-purple-50 rounded-lg border border-purple-200 p-4"
                >
                  <div className="mb-3">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="material-symbols-outlined text-[#A78BFA] text-[16px] mt-0.5">flag</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {achievement.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#A78BFA] text-sm">auto_awesome</span>
                      AI-Suggested Quantifications:
                    </p>
                    <div className="space-y-2">
                      {achievement.suggestions.map((suggestion, sIndex) => (
                        <label
                          key={sIndex}
                          className="flex items-start gap-3 p-2 rounded hover:bg-white cursor-pointer transition-colors group border border-transparent hover:border-purple-200"
                        >
                          <input
                            type="radio"
                            name={`metric-${index}`}
                            checked={selectedMetrics[index] === sIndex}
                            onChange={() => setSelectedMetrics({ ...selectedMetrics, [index]: sIndex })}
                            className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-xs text-slate-700 group-hover:text-slate-900 flex-1">
                            {suggestion}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-3 px-3 py-2 bg-[#A78BFA] hover:bg-[#7C3AED] text-slate-900 text-xs font-semibold rounded transition-colors">
                    Apply Selected Metric
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:from-blue-600 hover:to-purple-600 text-slate-900 rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center transition-all hover:scale-105 z-50">
        <span className="material-symbols-outlined text-2xl">chat</span>
      </button>
    </div>
  );
}
