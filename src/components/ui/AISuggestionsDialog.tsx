import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, CheckCircle2, Lightbulb, History, Copy, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  text: string;
  matchScore: number;
  context: string;
  icon: "verified" | "lightbulb" | "history";
}

interface AISuggestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  suggestions?: Suggestion[];
  onInsert?: (suggestion: Suggestion) => void;
  onRegenerate?: () => void;
}

export function AISuggestionsDialog({
  isOpen,
  onClose,
  keyword,
  suggestions: customSuggestions,
  onInsert,
  onRegenerate,
}: AISuggestionsDialogProps) {
  const defaultSuggestions: Suggestion[] = [
    {
      id: "1",
      text: "Demonstrated agile project leadership",
      matchScore: 98,
      context: "Leadership",
      icon: "verified",
    },
    {
      id: "2",
      text: "Managed cross-functional team workflows",
      matchScore: 85,
      context: "Collaboration",
      icon: "lightbulb",
    },
    {
      id: "3",
      text: "Oversaw end-to-end project lifecycles",
      matchScore: 82,
      context: "Execution",
      icon: "lightbulb",
    },
    {
      id: "4",
      text: "Previous role coordination duties",
      matchScore: 65,
      context: "",
      icon: "history",
    },
  ];

  const suggestions = customSuggestions || defaultSuggestions;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleInsert = (suggestion: Suggestion) => {
    if (onInsert) {
      onInsert(suggestion);
    }
    toast.success("Suggestion inserted");
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "emerald";
    if (score >= 75) return "blue";
    return "slate";
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "verified":
        return CheckCircle2;
      case "lightbulb":
        return Lightbulb;
      case "history":
        return History;
      default:
        return Lightbulb;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[720px] flex flex-col glass-panel rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4 border-b border-white/5 bg-gradient-to-r from-slate-800/50 to-transparent">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-violet-500/20 shrink-0 text-white">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
                      AI Keyword Suggestions
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400 text-sm">
                        Optimizing for missing keyword:
                      </span>
                      <span className="font-mono text-sm font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                        {keyword}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="group p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content Area: Suggestions List */}
              <div className="flex flex-col p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {suggestions.map((suggestion, index) => {
                  const matchColor = getMatchColor(suggestion.matchScore);
                  const Icon = getIcon(suggestion.icon);
                  const isLowMatch = suggestion.matchScore < 75;

                  return (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`group flex items-center gap-4 p-4 mx-2 my-1 rounded-xl hover:bg-slate-700/30 transition-all border border-transparent hover:border-white/5 ${
                        isLowMatch ? "opacity-75 hover:opacity-100" : ""
                      }`}
                    >
                      {/* Icon/Match Indicator */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div
                          className={`h-10 w-10 flex items-center justify-center rounded-lg ring-1 ${
                            matchColor === "emerald"
                              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                              : matchColor === "blue"
                              ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                              : "bg-slate-700/50 text-slate-400 ring-slate-600/30"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <p
                          className={`text-[15px] font-medium leading-normal truncate group-hover:text-primary transition-colors ${
                            isLowMatch ? "text-slate-300" : "text-white"
                          }`}
                        >
                          {suggestion.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${
                              matchColor === "emerald"
                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                : matchColor === "blue"
                                ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                                : "text-slate-400 bg-slate-700/50 border-slate-600/30"
                            }`}
                          >
                            {suggestion.matchScore}% Match
                          </span>
                          {suggestion.context && (
                            <span className="text-slate-500 text-xs">
                              • Context: {suggestion.context}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(suggestion.text)}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleInsert(suggestion)}
                          className={`flex items-center gap-2 h-9 px-4 rounded-lg text-white text-sm font-medium shadow-lg transition-all active:scale-95 ${
                            isLowMatch
                              ? "bg-slate-700 hover:bg-slate-600 border border-slate-600"
                              : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-blue-500/20"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                          <span>Insert</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer / Action Area */}
              <div className="p-6 pt-4 border-t border-white/5 bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse"></div>
                  <span className="text-xs text-slate-400">AI Model v4.2 • Turbo Mode</span>
                </div>
                <div className="flex w-full sm:w-auto items-center gap-3">
                  <button
                    onClick={onRegenerate}
                    className="flex-1 sm:flex-none h-10 px-4 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 text-slate-300 hover:text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none h-10 px-6 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
