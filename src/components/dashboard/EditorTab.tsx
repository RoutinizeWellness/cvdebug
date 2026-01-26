import { motion } from "framer-motion";
import { InlineResumeEditor } from "./InlineResumeEditor";
import { FluffDetector } from "./FluffDetector";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface EditorTabProps {
  resume: any;
  user: any;
  isPaidUser: boolean;
  onUpgrade: () => void;
  onContentUpdate?: (newContent: string) => void;
}

export function EditorTab({ resume, user, isPaidUser, onUpgrade, onContentUpdate }: EditorTabProps) {
  const [showFluffSidebar, setShowFluffSidebar] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const generateRewrite = useMutation(api.resumes.generateComprehensiveRewrite);

  const handleRewriteAll = async () => {
    if (!isPaidUser) {
      toast.error("AI Rewrite All is a premium feature. Please upgrade to continue.");
      onUpgrade();
      return;
    }

    if (!resume?.ocrText || resume.ocrText.trim().length < 100) {
      toast.error("Resume content is too short to rewrite. Please add more content.");
      return;
    }

    setIsRewriting(true);
    try {
      await generateRewrite({ id: resume._id });
      toast.success("🚀 ML Rewrite Started! Analyzing and optimizing your resume with 5 AI algorithms. Results in 10-15 seconds...");
    } catch (error: any) {
      console.error("Rewrite error:", error);
      toast.error(error.message || "Failed to start AI rewrite. Please try again.");
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex bg-[#F8FAFC]">
      {/* Main Editor Area */}
      <div className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0F172A]">Resume Editor</h2>
              <p className="text-slate-600 text-sm">Edit your resume with real-time AI suggestions</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRewriteAll}
                disabled={isRewriting}
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-semibold"
              >
                <Wand2 className="h-4 w-4" />
                {isRewriting ? "Rewriting..." : "AI Rewrite All"}
              </Button>
              <Button
                onClick={() => setShowFluffSidebar(!showFluffSidebar)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {showFluffSidebar ? "Hide" : "Show"} Weak Phrases
              </Button>
            </div>
          </div>

          {/* Inline Editor */}
          {resume && (
            <InlineResumeEditor
              resumeId={resume._id}
              initialContent={resume.ocrText || ""}
              missingKeywords={resume.missingKeywords || []}
              formatIssues={resume.formatIssues || []}
              user={user as any}
              onUpgrade={onUpgrade}
              onContentUpdate={onContentUpdate || (() => {})}
            />
          )}

          {/* AI Rewrite Section (if available or processing) */}
          {resume?.rewrittenText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`mt-6 rounded-xl p-6 ${
                resume.rewrittenText === "PROCESSING"
                  ? "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
              }`}
            >
              {resume.rewrittenText === "PROCESSING" ? (
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-2 animate-pulse shadow-lg">
                    <Wand2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-blue-900">⚡ AI Rewrite in Progress...</h3>
                    <p className="text-sm text-blue-700 mb-2">
                      Running 5 ML algorithms to transform your resume:
                    </p>
                    <ul className="text-xs text-blue-600 space-y-1 ml-4">
                      <li>✓ Intelligent section parsing & restructuring</li>
                      <li>✓ Action verb optimization (30-point scoring)</li>
                      <li>✓ Quantified metric injection (40-point impact)</li>
                      <li>✓ Achievement-focused bullet rewriting</li>
                      <li>✓ Professional summary generation with keyword extraction</li>
                    </ul>
                    <p className="text-xs text-blue-500 mt-2 italic">⏱️ Usually completes in 10-15 seconds</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-2 shadow-lg">
                      <Wand2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-green-900">🎯 ML-Optimized Resume Ready</h3>
                      <p className="text-sm text-green-700">
                        AI-powered rewrite with <span className="font-semibold">quantified achievements</span>,
                        <span className="font-semibold"> impact-driven language</span>, and
                        <span className="font-semibold"> ATS-optimized keywords</span>
                      </p>
                    </div>
                  </div>

                  {/* ML Improvements Summary */}
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-700 font-bold text-sm">📊 ML Enhancements Applied:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        <span className="text-green-800">Strong action verbs added</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        <span className="text-green-800">Metrics quantified</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        <span className="text-green-800">Impact statements enhanced</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        <span className="text-green-800">ATS keywords optimized</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200 max-h-96 overflow-y-auto shadow-sm">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {resume.rewrittenText}
                    </pre>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => {
                        if (onContentUpdate) {
                          onContentUpdate(resume.rewrittenText);
                          toast.success("✅ ML-optimized resume applied successfully! Your resume now has stronger impact and better ATS compatibility.");
                        }
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white gap-2 shadow-md"
                    >
                      <Sparkles className="h-4 w-4" />
                      Apply ML Rewrite
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(resume.rewrittenText);
                        toast.success("📋 ML-optimized resume copied to clipboard! Now you can compare it side-by-side.");
                      }}
                      className="gap-2"
                    >
                      Copy to Compare
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Fluff Detector Sidebar (collapsible) */}
      {showFluffSidebar && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3 }}
          className="w-96 border-l border-[#E2E8F0] bg-white overflow-auto p-6"
        >
          <h3 className="text-lg font-black text-[#0F172A] mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Weak Phrases
          </h3>
          <FluffDetector
            resumeText={resume.ocrText || ''}
            clarityScore={resume.clarityScore}
            isPaidUser={isPaidUser}
            onUpgrade={onUpgrade}
          />
        </motion.div>
      )}
    </div>
  );
}
