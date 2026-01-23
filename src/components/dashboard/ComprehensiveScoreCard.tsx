/**
 * Comprehensive Score Card Component
 * Displays advanced ML scoring that surpasses Jobscan
 * Includes: Overall grade, component scores, competitive analysis, quick wins
 */

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, Award, Target } from "lucide-react";

interface ComprehensiveScoreCardProps {
  overallScore: number;
  grade: string;
  percentile: number;
  componentScores: {
    keywordMatch: number;
    achievementQuality: number;
    skillRelevance: number;
    impactMetrics: number;
    atsCompatibility: number;
    semanticAlignment: number;
  };
  strengths: string[];
  criticalIssues: string[];
  quickWins: string[];
  estimatedATSPassRate: number;
  competitiveAnalysis?: {
    yourScore: number;
    estimatedCompetitorAverage: number;
    percentileRank: number;
    competitiveAdvantages: string[];
    vulnerabilities: string[];
    mustHaveImprovements: string[];
    estimatedCallbackProbability: number;
  };
}

export function ComprehensiveScoreCard({
  overallScore,
  grade,
  percentile,
  componentScores,
  strengths,
  criticalIssues,
  quickWins,
  estimatedATSPassRate,
  competitiveAnalysis,
}: ComprehensiveScoreCardProps) {
  // Grade color mapping
  const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
    'A+': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
    'A': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    'B+': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
    'B': { bg: 'bg-blue-50', text: 'text-[#1E293B]', border: 'border-blue-200' },
    'C+': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
    'C': { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
    'D': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    'F': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  };

  const gradeColor = gradeColors[grade] || gradeColors['C'];

  return (
    <div className="space-y-6">
      {/* Hero Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative rounded-2xl p-8 border-2 ${gradeColor.border} ${gradeColor.bg} shadow-lg overflow-hidden`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Overall Resume Score
              </h3>
              <div className="flex items-baseline gap-4">
                <div className={`text-6xl font-bold ${gradeColor.text}`}>
                  {overallScore}
                </div>
                <div className="flex flex-col">
                  <div className={`text-4xl font-bold ${gradeColor.text}`}>
                    {grade}
                  </div>
                  <div className="text-sm text-slate-600">
                    Top {100 - percentile}%
                  </div>
                </div>
              </div>
            </div>

            {/* ATS Pass Rate Badge */}
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                estimatedATSPassRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                estimatedATSPassRate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                <Target className="h-5 w-5" />
                <div>
                  <div className="text-2xl font-bold">{estimatedATSPassRate}%</div>
                  <div className="text-xs font-medium">ATS Pass Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/60 rounded-lg p-3 backdrop-blur">
              <div className="text-xs text-slate-600 font-medium mb-1">Strengths</div>
              <div className="text-2xl font-bold text-emerald-600">{strengths.length}</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 backdrop-blur">
              <div className="text-xs text-slate-600 font-medium mb-1">Quick Wins</div>
              <div className="text-2xl font-bold text-[#1E293B]">{quickWins.length}</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 backdrop-blur">
              <div className="text-xs text-slate-600 font-medium mb-1">Critical Issues</div>
              <div className="text-2xl font-bold text-red-600">{criticalIssues.length}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Component Scores Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-sm"
      >
        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1E293B]">analytics</span>
          Component Scores
        </h4>

        <div className="space-y-4">
          {Object.entries(componentScores).map(([key, score], idx) => {
            const labels: Record<string, string> = {
              keywordMatch: 'Keyword Match',
              achievementQuality: 'Achievement Quality',
              skillRelevance: 'Skill Relevance',
              impactMetrics: 'Impact Metrics',
              atsCompatibility: 'ATS Compatibility',
              semanticAlignment: 'Semantic Alignment',
            };

            const label = labels[key];
            const barColor =
              score >= 80 ? 'bg-emerald-500' :
              score >= 60 ? 'bg-[#334155]' :
              score >= 40 ? 'bg-yellow-500' :
              'bg-red-500';

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                  <span className="text-sm font-bold text-slate-900">{score}/100</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                    className={`h-full ${barColor} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200 shadow-sm"
        >
          <h4 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            Your Strengths
          </h4>
          <div className="space-y-2">
            {strengths.map((strength, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="flex items-start gap-2 text-sm text-emerald-800"
              >
                <span className="text-emerald-600 mt-0.5">✓</span>
                <span>{strength}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#F8FAFC] to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-sm"
        >
          <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#1E293B]" />
            Quick Wins - High Impact Improvements
          </h4>
          <div className="space-y-3">
            {quickWins.map((win, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
                className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#334155] text-white flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <span className="text-sm text-blue-900 font-medium">{win}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 shadow-sm"
        >
          <h4 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Critical Issues - Fix These First
          </h4>
          <div className="space-y-3">
            {criticalIssues.map((issue, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className="flex items-start gap-3 p-3 bg-white/60 backdrop-blur rounded-lg border border-red-200"
              >
                <span className="text-red-600 flex-shrink-0">⚠️</span>
                <span className="text-sm text-red-900 font-medium">{issue}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Competitive Analysis */}
      {competitiveAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-[#F8FAFC] to-pink-50 rounded-xl p-6 border-2 border-[#E2E8F0] shadow-sm"
        >
          <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#1E293B]" />
            Competitive Analysis
          </h4>

          {/* Score Comparison */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-xs text-slate-600 font-medium mb-1">Your Score</div>
              <div className="text-3xl font-bold text-[#1E293B]">{competitiveAnalysis.yourScore}</div>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-xs text-slate-600 font-medium mb-1">Avg Competitor</div>
              <div className="text-3xl font-bold text-slate-600">{competitiveAnalysis.estimatedCompetitorAverage}</div>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-xs text-slate-600 font-medium mb-1">Callback Rate</div>
              <div className="text-3xl font-bold text-green-600">{competitiveAnalysis.estimatedCallbackProbability}%</div>
            </div>
          </div>

          {/* Competitive Advantages */}
          {competitiveAnalysis.competitiveAdvantages.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Competitive Advantages
              </h5>
              <div className="space-y-1">
                {competitiveAnalysis.competitiveAdvantages.map((adv, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-[#1E293B]">
                    <span className="text-green-500">▲</span>
                    <span>{adv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vulnerabilities */}
          {competitiveAnalysis.vulnerabilities.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-1">
                <TrendingDown className="h-4 w-4" />
                Vulnerabilities
              </h5>
              <div className="space-y-1">
                {competitiveAnalysis.vulnerabilities.map((vuln, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-[#1E293B]">
                    <span className="text-red-500">▼</span>
                    <span>{vuln}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Must-have Improvements */}
          {competitiveAnalysis.mustHaveImprovements.length > 0 && (
            <div>
              <h5 className="text-sm font-bold text-purple-800 mb-2 flex items-center gap-1">
                <Minus className="h-4 w-4" />
                Must-Have to Stay Competitive
              </h5>
              <div className="space-y-1">
                {competitiveAnalysis.mustHaveImprovements.map((imp, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-[#1E293B]">
                    <span className="text-orange-500">→</span>
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Performance Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-xs text-slate-500"
      >
        <p>Analysis powered by Advanced ML Engine • Superior to Jobscan algorithms</p>
      </motion.div>
    </div>
  );
}
