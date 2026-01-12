import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Zap, TrendingUp } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface FluffDetectorProps {
  resumeId: Id<"resumes">;
}

export function FluffDetector({ resumeId }: FluffDetectorProps) {
  const analysis = useQuery(api.fluffDetector.analyzeFluff, { resumeId });

  if (!analysis) {
    return (
      <div className="glass-panel rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      </div>
    );
  }

  const getSeverityColor = () => {
    switch (analysis.severity) {
      case "good":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "warning":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/30";
    }
  };

  const getSeverityIcon = () => {
    switch (analysis.severity) {
      case "good":
        return <CheckCircle className="w-8 h-8 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case "critical":
        return <XCircle className="w-8 h-8 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-panel rounded-xl p-6 border-l-4 ${getSeverityColor()}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getSeverityIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">
                💨 Fluff Detector
              </h3>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {analysis.fluffScore}
                  <span className="text-sm text-slate-400">/100</span>
                </div>
                <div className="text-xs text-slate-400">Clarity Score</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              {analysis.message}
            </p>
            {analysis.fluffPercentage > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Your resume is</span>
                <span className={`font-bold ${
                  analysis.severity === "critical" ? "text-red-400" :
                  analysis.severity === "warning" ? "text-yellow-400" :
                  "text-emerald-400"
                }`}>
                  {analysis.fluffPercentage}% fluff
                </span>
                <span className="text-slate-400">({analysis.weakPhrases.reduce((sum: number, p: any) => sum + p.count, 0)} weak phrases)</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Weak Phrases Detected */}
      {analysis.weakPhrases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Weak Phrases Found (Kill These Immediately)
          </h4>
          <div className="space-y-3">
            {analysis.weakPhrases.map((item: any, index: number) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg p-4 border border-yellow-500/20"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-mono rounded">
                        "{item.phrase}"
                      </span>
                      <span className="text-xs text-slate-400">
                        Found {item.count}x
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      ✅ <span className="font-semibold">Fix:</span> {item.replacement}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            How to Fix This
          </h4>
          <div className="space-y-3">
            {analysis.suggestions.map((suggestion: any, index: number) => (
              <div
                key={index}
                className="bg-slate-800/30 rounded-lg p-4 border border-blue-500/10"
              >
                <h5 className="text-white font-semibold mb-1">{suggestion.title}</h5>
                <p className="text-slate-300 text-sm mb-2">{suggestion.description}</p>
                <div className="text-xs text-blue-400 font-semibold">
                  → {suggestion.action}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Power Verbs Reference */}
      {analysis.powerVerbCategories && analysis.powerVerbCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-xl p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4">
            🎯 Power Verbs to Use Instead
          </h4>
          <p className="text-slate-300 text-sm mb-4">
            Replace weak phrases with these strong action verbs:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.powerVerbCategories.map((category: any, index: number) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-600/10 to-teal-600/10 rounded-lg p-4 border border-blue-500/20"
              >
                <h5 className="text-blue-400 font-semibold mb-2 text-sm">
                  {category.category}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {category.verbs.map((verb: any, vIndex: number) => (
                    <span
                      key={vIndex}
                      className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Perfect Score Message */}
      {analysis.fluffPercentage === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-6 bg-gradient-to-r from-emerald-600/10 to-green-600/10 border-emerald-500/20"
        >
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-xl font-bold text-white mb-2">
              Perfect! No Fluff Detected 🎉
            </h4>
            <p className="text-slate-300 text-sm">
              Your resume uses strong action verbs and specific language. Recruiters will love this.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
