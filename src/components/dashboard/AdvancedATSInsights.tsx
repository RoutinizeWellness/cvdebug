/**
 * Advanced ATS Insights Component
 * Displays superior ML-powered analysis using the advanced ATS engine
 * Surpasses Jobscan with better keyword detection, impact metrics, and actionable suggestions
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AdvancedATSInsightsProps {
  resumeText: string;
  jobDescription?: string;
  isPaidUser: boolean;
  onUpgrade: () => void;
}

export function AdvancedATSInsights({
  resumeText,
  jobDescription = '',
  isPaidUser,
  onUpgrade,
}: AdvancedATSInsightsProps) {
  const [expanded, setExpanded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = useAction(api.ai.advancedATSActions.runComprehensiveAnalysis);

  const handleRunAnalysis = async () => {
    if (!isPaidUser) {
      onUpgrade();
      return;
    }

    setLoading(true);
    try {
      const result = await runAnalysis({
        resumeText,
        jobDescription: jobDescription || undefined,
        targetIndustry: 'software',
      });

      if (result.success && result.data) {
        setAnalysisResult(result.data);
      }
    } catch (error) {
      console.error('Advanced analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPaidUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-[#0F172A]/90 to-[#0F172A]/40 rounded-xl p-6 border-2 border-[#475569]/40 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
        onClick={onUpgrade}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B]/10 via-transparent to-[#475569]/10 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity" />

        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-xl bg-[#0F172A]/20 text-[#94A3B8]">
              <span className="material-symbols-outlined text-3xl">neurology</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">Advanced ML Analysis</h3>
                <span className="px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-[#0F172A] to-[#334155] rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">lock</span>
                  PRO
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Unlock industry-leading ATS analysis powered by advanced ML algorithms that surpass Jobscan
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Context-aware keyword detection (100+ keywords)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Advanced impact metrics with sentiment analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Priority-ranked missing keyword suggestions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Comprehensive ATS compatibility scoring</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Industry-specific recommendations</span>
            </div>
          </div>

          <button
            onClick={onUpgrade}
            className="btn-power w-full py-3 rounded-lg text-[#0F172A] font-bold border-0 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined">diamond</span>
            <span>Unlock Advanced Analysis</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 border-2 border-[#E2E8F0] shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#F1F5F9] text-[#1E293B]">
            <span className="material-symbols-outlined text-2xl">neurology</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
              Advanced ML Analysis
              <span className="px-2 py-1 text-xs font-bold text-[#1E293B] bg-[#F1F5F9] rounded-full">
                PREMIUM
              </span>
            </h3>
            <p className="text-sm text-[#64748B]">Industry-leading ATS insights</p>
          </div>
        </div>

        {!analysisResult && (
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#0F172A] text-white font-semibold rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">play_arrow</span>
                <span>Run Analysis</span>
              </>
            )}
          </button>
        )}
      </div>

      {analysisResult && (
        <div className="space-y-6">
          {/* Keyword Analysis Section */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-lg font-bold text-[#0F172A] mb-3">Keyword Intelligence</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-lg p-4">
                <div className="text-3xl font-bold text-[#1E293B]">
                  {analysisResult.keywordAnalysis.overallScore}
                </div>
                <div className="text-xs text-[#1E293B] font-medium">Overall Score</div>
              </div>
              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-lg p-4">
                <div className="text-3xl font-bold text-[#0F172A]">
                  {analysisResult.keywordAnalysis.categoryBreakdown.technical.score}
                </div>
                <div className="text-xs text-[#1E293B] font-medium">Technical</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-700">
                  {analysisResult.keywordAnalysis.categoryBreakdown.soft.score}
                </div>
                <div className="text-xs text-green-600 font-medium">Soft Skills</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-700">
                  {analysisResult.keywordAnalysis.categoryBreakdown.tools.score}
                </div>
                <div className="text-xs text-orange-600 font-medium">Tools</div>
              </div>
            </div>

            {/* Strength & Improvement Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {analysisResult.keywordAnalysis.strengthAreas.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Strength Areas
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordAnalysis.strengthAreas.map((area: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.keywordAnalysis.improvementAreas.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">priority_high</span>
                    Needs Improvement
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordAnalysis.improvementAreas.map((area: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Impact Metrics Section */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-lg font-bold text-[#0F172A] mb-3">Impact Metrics Analysis</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
                <div className="text-3xl font-bold text-[#334155]">
                  {analysisResult.impactAnalysis.totalMetrics}
                </div>
                <div className="text-xs text-[#475569] font-medium">Total Metrics</div>
              </div>
              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-lg p-4">
                <div className="text-3xl font-bold text-[#1E293B]">
                  {analysisResult.impactAnalysis.impactScore}
                </div>
                <div className="text-xs text-[#1E293B] font-medium">Impact Score</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-pink-700 uppercase">
                  {analysisResult.impactAnalysis.impactLevel}
                </div>
                <div className="text-xs text-pink-600 font-medium">Impact Level</div>
              </div>
            </div>

            {/* Top Impact Metrics */}
            {analysisResult.impactAnalysis.metrics.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-bold text-slate-800 mb-3">Top Impact Metrics Found</h5>
                <div className="space-y-2">
                  {analysisResult.impactAnalysis.metrics.slice(0, 5).map((metric: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="material-symbols-outlined text-green-600 text-base mt-0.5">
                        verified
                      </span>
                      <div className="flex-1">
                        <div className="font-mono font-semibold text-slate-800">{metric.value}</div>
                        <div className="text-xs text-slate-600 line-clamp-1">{metric.context}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs px-2 py-0.5 bg-[#F1F5F9] text-[#1E293B] rounded font-medium">
                          {metric.impactScore}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            {analysisResult.impactAnalysis.improvementSuggestions.length > 0 && (
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <h5 className="text-sm font-bold text-[#0F172A] mb-2">💡 Improvement Tips</h5>
                <ul className="space-y-1">
                  {analysisResult.impactAnalysis.improvementSuggestions.map((suggestion: string, idx: number) => (
                    <li key={idx} className="text-sm text-[#0F172A] flex items-start gap-2">
                      <span className="text-[#334155]">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Missing Keyword Suggestions */}
          {analysisResult.missingKeywordSuggestions.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-lg font-bold text-[#0F172A] mb-3">Priority Keyword Suggestions</h4>
              <div className="space-y-3">
                {analysisResult.missingKeywordSuggestions.slice(0, 8).map((suggestion: any, idx: number) => {
                  const priorityColors = {
                    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100' },
                    important: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100' },
                    'nice-to-have': { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', badge: 'bg-slate-100' },
                  };
                  const colors = priorityColors[suggestion.priority as keyof typeof priorityColors];

                  return (
                    <div key={idx} className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">label</span>
                          <h5 className={`font-mono font-bold ${colors.text}`}>{suggestion.keyword}</h5>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 ${colors.badge} ${colors.text} rounded font-bold`}>
                            +{suggestion.impact} Impact
                          </span>
                          <span className={`text-xs px-2 py-1 ${colors.badge} ${colors.text} rounded font-semibold uppercase`}>
                            {suggestion.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">{suggestion.reasoning}</div>
                      <div className="text-xs text-slate-500 mb-2">
                        <strong>Add to:</strong> {suggestion.section}
                      </div>
                      <div className="bg-white border border-slate-200 rounded p-2 text-xs text-slate-700 font-mono">
                        {suggestion.context}
                      </div>
                      {suggestion.synonyms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-xs text-slate-500">Synonyms:</span>
                          {suggestion.synonyms.map((syn: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-white text-slate-600 rounded border border-slate-200">
                              {syn}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ATS Compatibility */}
          {analysisResult.atsCompatibility && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-lg font-bold text-[#0F172A] mb-3">ATS Compatibility Score</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-[#0F172A]">
                    {analysisResult.atsCompatibility.overallScore}
                  </div>
                  <div className="text-xs text-[#1E293B] font-medium">Overall</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {analysisResult.atsCompatibility.formatScore}
                  </div>
                  <div className="text-xs text-green-600 font-medium">Format</div>
                </div>
                <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-[#1E293B]">
                    {analysisResult.atsCompatibility.contentScore}
                  </div>
                  <div className="text-xs text-[#1E293B] font-medium">Content</div>
                </div>
              </div>

              {/* Issues */}
              {analysisResult.atsCompatibility.issues.length > 0 && (
                <div className="space-y-2">
                  {analysisResult.atsCompatibility.issues.slice(0, 5).map((issue: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                        issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-base">
                          {issue.severity === 'critical' ? 'error' : issue.severity === 'warning' ? 'warning' : 'info'}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{issue.message}</div>
                          <div className="text-xs text-slate-600 mt-1">{issue.fix}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
