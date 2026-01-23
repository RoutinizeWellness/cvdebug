import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { useMLAnalysis } from "@/hooks/use-ml-analysis";

interface MLInsightsProps {
  resumeText: string;
  jobDescription?: string;
}

export function MLInsights({ resumeText, jobDescription = "" }: MLInsightsProps) {
  const analysis = useMLAnalysis(resumeText, jobDescription);

  if (!resumeText || resumeText.length < 100) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* ML Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            ML-Powered Analysis
            <span className="text-xs font-normal text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
              Real-Time
            </span>
          </h2>
          <p className="text-sm text-[#64748B]">Machine learning insights from your resume</p>
        </div>
      </div>

      {/* ML Scores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ScoreCard
          label="Overall"
          score={analysis.overallScore}
          color="from-[#3B82F6] to-[#06B6D4]"
        />
        <ScoreCard
          label="Keyword Match"
          score={analysis.keywordMatchScore}
          color="from-[#8B5CF6] to-[#EC4899]"
        />
        <ScoreCard
          label="Action Verbs"
          score={analysis.actionVerbScore}
          color="from-[#10B981] to-[#059669]"
        />
        <ScoreCard
          label="Impact"
          score={analysis.sentimentScore}
          color="from-[#F59E0B] to-[#D97706]"
        />
        <ScoreCard
          label="Structure"
          score={analysis.structureScore}
          color="from-[#EF4444] to-[#DC2626]"
        />
      </div>

      {/* ML Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-[#8B5CF6]" />
          <h3 className="font-bold text-[#0F172A]">ML Recommendations</h3>
          <span className="text-xs text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded-full border border-[#E2E8F0]">
            Top {analysis.recommendations.length}
          </span>
        </div>

        <div className="space-y-3">
          {analysis.recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                rec.type === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : rec.type === 'important'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-[#F8FAFC] border-[#E2E8F0]'
              }`}
            >
              {rec.type === 'critical' ? (
                <AlertCircle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              ) : rec.type === 'important' ? (
                <TrendingUp className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm text-[#0F172A]">{rec.title}</h4>
                  <span className="text-xs font-bold text-[#64748B]">+{rec.impact}%</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">{rec.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Verbs Analysis */}
      {analysis.actionVerbs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
        >
          <h3 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3B82F6]">speed</span>
            Action Verb Strength Analysis
          </h3>

          <div className="flex flex-wrap gap-2">
            {analysis.actionVerbs.map((verb, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                  verb.strength >= 0.8
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : verb.strength >= 0.5
                    ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {verb.verb}
                <span className="ml-1.5 text-xs opacity-70">
                  {Math.round(verb.strength * 100)}%
                </span>
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Detected Entities */}
      {(analysis.entities.skills.length > 0 || analysis.entities.technologies.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]"
        >
          <h3 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8B5CF6]">psychology</span>
            ML-Detected Skills & Technologies
          </h3>

          <div className="space-y-3">
            {analysis.entities.skills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                  Core Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.entities.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-medium border border-[#8B5CF6]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.entities.technologies.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.entities.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-medium border border-[#3B82F6]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ScoreCard({
  label,
  score,
  color
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />

      <div className="relative">
        <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-2">
          {label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-[#0F172A]">{score}</span>
          <span className="text-sm text-[#64748B]">/ 100</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${color}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
