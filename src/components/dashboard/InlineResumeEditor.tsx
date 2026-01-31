import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  Sparkles,
  Wand2,
  AlertCircle,
  Save,
  RefreshCw,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrency } from "@/hooks/use-currency";
import { isPaidUser as checkIsPaidUser } from "@/lib/planHelpers";

interface InlineResumeEditorProps {
  resumeId: string;
  initialContent: string;
  missingKeywords: Array<{ keyword: string; context?: string }>;
  formatIssues: Array<{ issue: string; fix: string; location?: string }>;
  onContentUpdate: (newContent: string) => void;
  user?: any;
  onUpgrade?: () => void;
}

export function InlineResumeEditor({
  resumeId,
  initialContent,
  missingKeywords = [],
  formatIssues = [],
  onContentUpdate,
  user,
  onUpgrade
}: InlineResumeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const triggerUpdateAndAnalyze = useMutation(api.resumes.updateResumeContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  // Subscribe to resume updates in real-time
  const resumeData = useQuery(api.resumes.getResume, resumeId ? { id: resumeId as Id<"resumes"> } : "skip");

  // Check if user has paid plan
  const isPaidUser = checkIsPaidUser(user?.subscriptionTier);

  // Get localized pricing
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (content !== initialContent) {
      setHasChanges(true);
    }
  }, [content, initialContent]);

  // Watch for re-analysis completion
  useEffect(() => {
    if (resumeData && isReanalyzing) {
      // Check if status changed from "processing" to "analyzed"
      if (resumeData.status === "completed") {
        setIsReanalyzing(false);

        // Show success notification with score change
        const newScore = resumeData.score || 0;
        if (previousScore !== null) {
          const scoreDiff = newScore - previousScore;
          if (scoreDiff > 0) {
            toast.success(`✓ Re-analysis complete! Score improved by +${scoreDiff}% (${newScore}%)`);
          } else if (scoreDiff < 0) {
            toast.success(`✓ Re-analysis complete! New score: ${newScore}% (${scoreDiff}%)`);
          } else {
            toast.success(`✓ Re-analysis complete! Score: ${newScore}%`);
          }
        } else {
          toast.success(`✓ Re-analysis complete! Score: ${newScore}%`);
        }

        // Reset previous score
        setPreviousScore(null);

        // Notify parent component
        onContentUpdate(resumeData.ocrText || content);
      }
    }
  }, [resumeData?.status, resumeData?.score, isReanalyzing, previousScore, content, onContentUpdate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("✓ Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-edited.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("✓ Downloaded!");
  };

  const handleSave = async () => {
    if (!isPaidUser) {
      onUpgrade?.();
      return;
    }

    setIsSaving(true);
    try {
      // Save current score before updating
      if (resumeData?.score) {
        setPreviousScore(resumeData.score);
      }

      // This mutation updates the text and triggers the AI re-analysis
      await triggerUpdateAndAnalyze({ id: resumeId as Id<"resumes">, newContent: content });

      setHasChanges(false);
      setLastSaved(new Date());

      // Mark as reanalyzing so the UI updates
      setIsReanalyzing(true);

      toast.success("✓ Changes saved! AI is recalculating your score...");

      // Call parent callback
      onContentUpdate(content);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error("Failed to save. Try again?");
      setIsReanalyzing(false);
      setPreviousScore(null);
    } finally {
      setIsSaving(false);
    }
  };

  const applySuggestion = (keyword: string, type: 'keyword' | 'fix') => {
    if (type === 'keyword') {
      // Find a good place to insert the keyword (after a bullet point or skill section)
      const lines = content.split('\n');
      let inserted = false;

      for (let i = 0; i < lines.length; i++) {
        // Look for skills section or bullets
        if (lines[i].toLowerCase().includes('skills') ||
          lines[i].toLowerCase().includes('technologies') ||
          lines[i].trim().startsWith('•') ||
          lines[i].trim().startsWith('-')) {
          // Insert after this line
          lines.splice(i + 1, 0, `• ${keyword}`);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        // Fallback: add at the end
        lines.push(`\n**Skills to add:**\n• ${keyword}`);
      }

      const newContent = lines.join('\n');
      setContent(newContent);
      toast.success(`✓ Added "${keyword}" to your resume`);
    }
  };

  const quickFixAll = () => {
    let newContent = content;

    // 1. Standardize date formats (2020-2022 -> 2020 - 2022)
    newContent = newContent.replace(/(\d{4})\s*-\s*(\d{4})/g, '$1 - $2');
    newContent = newContent.replace(/(\w{3})\.\s*(\d{4})/g, '$1 $2');

    // 2. Standardize bullet points (use standard bullet •)
    newContent = newContent.replace(/^[*-]\s/gm, '• ');

    // 3. Fix contact info formatting (ensure spaces around separators)
    newContent = newContent.replace(/\|/g, ' | ');
    newContent = newContent.replace(/\s+/g, ' '); // Clean up extra spaces from step 3

    // 4. Ensure section headers are uppercase and distinct (heuristic)
    const headers = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'SUMMARY', 'CERTIFICATIONS'];
    headers.forEach(header => {
      const regex = new RegExp(`^\\s*${header}\\s*$`, 'gmi');
      newContent = newContent.replace(regex, `\n${header}\n`);
    });

    // 5. Trim extra newlines
    newContent = newContent.replace(/\n{3,}/g, '\n\n').trim();

    if (newContent !== content) {
      setContent(newContent);
      setHasChanges(true);
      toast.success("✓ Applied intelligent format fixes!");
    } else {
      toast.info("No common format issues detected.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-[#1E293B]/10 to-[#334155]/10 border border-[#1E293B]/20 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-lg flex items-center justify-center">
            <Wand2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#0F172A] text-sm sm:text-base">Inline Editor</h3>
            <p className="text-xs text-[#64748B]">
              {isReanalyzing ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Re-analyzing resume...
                </span>
              ) : hasChanges ? (
                "You have unsaved changes"
              ) : lastSaved ? (
                `Last saved ${lastSaved.toLocaleTimeString()}`
              ) : (
                "Edit directly, no re-upload needed"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          {hasChanges && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold text-xs"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  Save & Re-analyze
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* AI Suggestions Panel */}
      {(missingKeywords.length > 0 || formatIssues.length > 0) && (
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#1E293B]" />
              <h4 className="font-bold text-[#0F172A] text-sm">AI Suggestions</h4>
            </div>
            {formatIssues.length > 0 && (
              <Button
                onClick={quickFixAll}
                variant="ghost"
                size="sm"
                className="text-xs text-[#1E293B] hover:text-[#334155]"
              >
                <Zap className="h-3 w-3 mr-1" />
                Quick Fix All
              </Button>
            )}
          </div>

          {/* Missing Keywords */}
          {missingKeywords.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Missing Keywords ({missingKeywords.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {missingKeywords.slice(0, 5).map((kw, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => applySuggestion(kw.keyword, 'keyword')}
                    className="group flex items-center gap-1 px-2 py-1 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#1E293B] rounded-md text-xs font-medium text-[#0F172A] hover:text-[#1E293B] transition-all"
                    title={kw.context || "Click to add"}
                  >
                    <span>+ {kw.keyword}</span>
                    <Zap className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Format Issues */}
          {formatIssues.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">
                Format Issues ({formatIssues.length})
              </p>
              <div className="space-y-1">
                {formatIssues.slice(0, 3).map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded text-xs"
                  >
                    <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0F172A] font-medium">{issue.issue}</p>
                      <p className="text-[#64748B] text-[10px] mt-0.5">{issue.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text Editor */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => isPaidUser && setContent(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          disabled={!isPaidUser}
          className={`w-full min-h-[400px] p-4 bg-[#FFFFFF] border-2 rounded-lg font-mono text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-all ${!isPaidUser ? 'blur-[2px] pointer-events-none' : ''
            } ${isEditing
              ? 'border-[#1E293B] shadow-[0_0_20px_rgba(100,116,139,0.2)]'
              : 'border-[#E2E8F0]'
            }`}
          placeholder="Paste your resume content here and edit directly..."
          spellCheck={false}
        />

        {/* Paywall Overlay */}
        {!isPaidUser && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FFFFFF]/80 backdrop-blur-[1px] rounded-lg">
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Inline Editor is a Premium Feature
              </h3>
              <p className="text-[#64748B] mb-6 text-sm">
                Upgrade to edit your resume directly, add missing keywords instantly, and re-analyze without re-uploading.
              </p>
              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade Now - {formatPrice('single_scan')}
              </Button>
              <p className="text-xs text-[#94A3B8] mt-3">
                24-hour access • Unlimited edits • Re-analyze instantly
              </p>
            </div>
          </div>
        )}

        {/* Character count */}
        {isPaidUser && (
          <div className="absolute bottom-2 right-2 text-[10px] text-[#94A3B8] bg-[#FFFFFF] px-2 py-1 rounded border border-[#E2E8F0]">
            {content.length.toLocaleString()} characters
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 text-xs text-[#475569]">
        <p className="font-semibold text-[#0F172A] mb-1">💡 Pro Tips:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>Click the "+ keyword" buttons to add missing skills instantly</li>
          <li>Edit the text directly - changes are applied in real-time</li>
          <li>Click "Save & Re-analyze" to update your ATS score</li>
          <li>No need to download and re-upload - this updates everything automatically</li>
        </ul>
      </div>
    </div>
  );
}
