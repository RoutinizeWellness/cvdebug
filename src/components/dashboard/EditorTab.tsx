import { motion } from "framer-motion";
import { InlineResumeEditor } from "./InlineResumeEditor";
import { FluffDetector } from "./FluffDetector";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

interface EditorTabProps {
  resume: any;
  user: any;
  isPaidUser: boolean;
  onUpgrade: () => void;
  onContentUpdate?: (newContent: string) => void;
}

export function EditorTab({ resume, user, isPaidUser, onUpgrade, onContentUpdate }: EditorTabProps) {
  const [showFluffSidebar, setShowFluffSidebar] = useState(false);

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

          {/* AI Rewrite Section (if available) */}
          {resume?.rewrittenText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 rounded-full p-2">
                  <Wand2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-green-900">AI-Optimized Version Available</h3>
                  <p className="text-sm text-green-700">View the AI rewrite in the comparison panel below</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200 max-h-96 overflow-y-auto">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                  {resume.rewrittenText}
                </pre>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => {
                    if (onContentUpdate) {
                      onContentUpdate(resume.rewrittenText);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Apply AI Rewrite
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Could open side-by-side comparison
                  }}
                >
                  Compare Side-by-Side
                </Button>
              </div>
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
