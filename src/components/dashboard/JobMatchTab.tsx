import { motion } from "framer-motion";
import { SkillGapHeatmap } from "./SkillGapHeatmap";
import { SeniorityMatchAnalysis } from "./SeniorityMatchAnalysis";
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface JobMatchTabProps {
  resume: any;
  user: any;
  isPaidUser: boolean;
  onUpgrade: () => void;
}

export function JobMatchTab({ resume, user, isPaidUser, onUpgrade }: JobMatchTabProps) {
  const hasJobDescription = !!resume?.jobDescription;

  if (!hasJobDescription) {
    return (
      <div className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center"
          >
            <Target className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-slate-700 mb-3">
              No Job Description Added Yet
            </h3>
            <p className="text-slate-600 mb-6">
              Add a job description to see how well your resume matches the position and get tailored recommendations.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-left">
              <h4 className="font-bold text-blue-900 mb-2">💡 How to add a job description:</h4>
              <ol className="text-sm text-blue-800 space-y-2 ml-4">
                <li>1. Go to the job posting on LinkedIn, Indeed, or the company website</li>
                <li>2. Copy the entire job description (Ctrl+C / Cmd+C)</li>
                <li>3. Click "Add Job" button in the header and paste it</li>
                <li>4. Come back to this tab to see your match score!</li>
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Calculate match metrics
  const foundKeywords = resume?.foundKeywords || [];
  const missingKeywords = resume?.missingKeywords || [];
  const totalKeywords = foundKeywords.length + missingKeywords.length;
  const matchPercentage = totalKeywords > 0
    ? Math.round((foundKeywords.length / totalKeywords) * 100)
    : 0;

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchStatus = (percentage: number) => {
    if (percentage >= 80) return { label: "Excellent Match", color: "green" };
    if (percentage >= 60) return { label: "Good Match", color: "yellow" };
    return { label: "Needs Improvement", color: "red" };
  };

  const matchStatus = getMatchStatus(matchPercentage);

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-black text-[#0F172A] mb-2">Job Match Analysis</h2>
          <p className="text-slate-600">See how well your resume aligns with the target position</p>
        </motion.div>

        {/* Match Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`bg-gradient-to-br from-${matchStatus.color}-50 to-${matchStatus.color}-100 border-2 border-${matchStatus.color}-300 rounded-2xl p-8 shadow-lg`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Match */}
            <div className="text-center">
              <Target className={`h-12 w-12 ${getMatchColor(matchPercentage)} mx-auto mb-3`} />
              <h3 className={`text-5xl font-black ${getMatchColor(matchPercentage)} mb-2`}>
                {matchPercentage}%
              </h3>
              <p className="text-sm font-semibold text-slate-700">Overall Match</p>
              <p className={`text-xs font-bold mt-1 ${getMatchColor(matchPercentage)}`}>
                {matchStatus.label}
              </p>
            </div>

            {/* Keywords Found */}
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-5xl font-black text-green-600 mb-2">
                {foundKeywords.length}
              </h3>
              <p className="text-sm font-semibold text-slate-700">Keywords Matched</p>
            </div>

            {/* Keywords Missing */}
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-5xl font-black text-red-600 mb-2">
                {missingKeywords.length}
              </h3>
              <p className="text-sm font-semibold text-slate-700">Keywords Missing</p>
            </div>
          </div>
        </motion.div>

        {/* Skill Gap Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 shadow-lg"
        >
          <h3 className="text-2xl font-black text-[#0F172A] mb-6">Keyword Heatmap</h3>
          <SkillGapHeatmap
            foundKeywords={resume.foundKeywords || []}
            missingKeywords={resume.missingKeywords || []}
          />
        </motion.div>

        {/* Seniority Match */}
        {resume?.seniorityMatch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-2xl border-2 border-[#E2E8F0] p-8 shadow-lg"
          >
            <h3 className="text-2xl font-black text-[#0F172A] mb-6">Seniority Analysis</h3>
            <SeniorityMatchAnalysis
              detectedLevel={resume.seniorityMatch?.detectedLevel || 'mid'}
              confidenceScore={resume.seniorityMatch?.confidenceScore || 0}
              experienceYears={resume.seniorityMatch?.experienceYears || 0}
              expectedLevel={resume.seniorityMatch?.expectedLevel || 'mid'}
              signalsDetected={resume.seniorityMatch?.signalsDetected || 0}
              signalStrength={resume.seniorityMatch?.signalStrength || 'MODERATE'}
              detectedSignals={resume.seniorityMatch?.detectedSignals || []}
              readability={resume.seniorityMatch?.readability || 'High Integrity'}
              imageTraps={resume.seniorityMatch?.imageTraps || 'None Detected'}
              atsScore={resume.vlyScore || resume.atsScore || 0}
            />
          </motion.div>
        )}

        {/* Action Items */}
        {missingKeywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6"
          >
            <h4 className="text-lg font-black text-red-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Missing Keywords to Add
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {missingKeywords.slice(0, 8).map((keyword: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.5 + index * 0.05 }}
                  className="bg-white border-2 border-red-200 rounded-lg px-4 py-2 text-center"
                >
                  <p className="text-sm font-bold text-red-700">{keyword}</p>
                </motion.div>
              ))}
            </div>
            {missingKeywords.length > 8 && (
              <p className="text-xs text-red-700 mt-3 text-center">
                +{missingKeywords.length - 8} more keywords to add
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
