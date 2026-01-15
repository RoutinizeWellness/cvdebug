import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KeywordSniperTool } from "./KeywordSniperTool";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Lock, Diamond, Sparkles, Eye, TrendingUp, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeywordExamplesModal } from "./KeywordExamplesModal";
import { ApplyMetricModal } from "./ApplyMetricModal";
import { RewriteAllModal } from "./RewriteAllModal";
import { InterviewBattlePlanModal } from "./InterviewBattlePlanModal";
import { motion } from "framer-motion";

const apiAny = api;

interface KeywordSniperViewProps {
  onBack: () => void;
  onUpgrade?: () => void;
}

export function KeywordSniperView({ onBack, onUpgrade }: KeywordSniperViewProps) {
  const resumes = useQuery(apiAny.resumes.getResumes);
  const applications = useQuery(apiAny.applications.getApplications);
  const currentUser = useQuery(apiAny.users.currentUser);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // Modal states
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [showRewriteModal, setShowRewriteModal] = useState(false);
  const [showBattlePlanModal, setShowBattlePlanModal] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [selectedBullet, setSelectedBullet] = useState<string>("");

  // Check if user has Interview Sprint plan
  const hasInterviewSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (!currentUser?.sprintExpiresAt || currentUser.sprintExpiresAt > Date.now());

  // PRIORITY: Get application with job description (has missing keywords)
  const applicationWithJob = applications?.find((app: any) =>
    app.jobDescriptionText &&
    (app.missingKeywords?.length || app.matchedKeywords?.length)
  );

  // Fallback: Get the master resume if no application exists
  const masterResume = resumes?.find((r: any) =>
    r.status === "completed"
  ) || resumes?.[0];

  // Use application data if available, otherwise resume data
  const missingKeywords = applicationWithJob?.missingKeywords || masterResume?.missingKeywords || [];
  const matchedKeywords = applicationWithJob?.matchedKeywords || masterResume?.matchedKeywords || [];
  const currentScore = applicationWithJob?.matchScore || masterResume?.score || 0;
  const jobTitle = applicationWithJob?.jobTitle || masterResume?.jobTitle || "Professional";
  const company = applicationWithJob?.companyName || masterResume?.company || "Company";

  // Extract bullet points from resume OCR text
  const extractBulletPoints = (ocrText: string): string[] => {
    if (!ocrText) return [];
    const lines = ocrText.split('\n');
    const bullets = lines
      .filter(line =>
        line.trim().match(/^[-•*]/) || // Lines starting with bullets
        (line.length > 20 && line.length < 200 && !line.match(/^[A-Z\s]+$/)) // Sentence-like lines
      )
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
    return bullets;
  };

  const bullets = extractBulletPoints(masterResume?.ocrText || "");
  const currentBullet = bullets[0] || "Led cross-functional teams to deliver projects on time and within budget, resulting in increased efficiency.";

  const handleApplySuggestion = (newText: string) => {
    toast.success("Suggestion applied! Your resume has been updated.");
    // In real implementation, this would update the resume in Convex
    console.log("New bullet point:", newText);
  };

  if (!resumes || !applications) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Check if we have the necessary data for keyword sniper
  const hasJobDescription = applicationWithJob?.jobDescriptionText;
  const hasKeywords = missingKeywords.length > 0 || matchedKeywords.length > 0;

  if (!hasJobDescription || !hasKeywords) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <Target className="h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Job Description Analyzed Yet</h3>
        <p className="text-[#64748B] max-w-md mb-4">
          The Keyword Sniper needs a job description to analyze and extract missing keywords.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mb-6">
          <p className="text-sm text-blue-700 mb-2">
            <span className="font-semibold">How to use Keyword Sniper:</span>
          </p>
          <ol className="text-xs text-[#475569] space-y-1 text-left list-decimal list-inside">
            <li>Create a project with your target role</li>
            <li>Add a job application with the job description</li>
            <li>Analyze the job description to extract keywords</li>
            <li>Return here to get AI-powered keyword suggestions</li>
          </ol>
        </div>
        <Button onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pb-8">
      {/* Interview Sprint Required Alert */}
      {!hasInterviewSprint && (
        <Alert className="mb-6 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-primary/40 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 pointer-events-none" />

          <div className="relative">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                <Diamond className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[#0F172A] font-bold text-base mb-1">Interview Sprint Required</h3>
                <p className="text-[#475569] text-sm leading-relaxed">
                  Inject missing keywords into your resume bullets with AI-powered suggestions.
                </p>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4 ml-14">
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Keyword injection</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Live score tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Priority targeting</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#475569]">
                <span className="text-[#22C55E] font-bold">✓</span>
                <span>Context-aware AI</span>
              </div>
            </div>

            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 w-full py-2.5 text-white font-bold border-0 flex items-center justify-center gap-2 ml-14"
            >
              <Sparkles className="h-4 w-4" />
              <span>Upgrade to Interview Sprint</span>
            </Button>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-[#64748B] hover:text-[#0F172A]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">radar</span>
                Keyword Sniper Tool
              </h1>
              <p className="text-[#64748B] text-sm">
                Optimize your bullet points with AI-powered keyword injection
              </p>
            </div>
            {!hasInterviewSprint && (
              <Lock className="h-5 w-5 text-slate-400" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-400">
              {applicationWithJob ? "Targeting" : "Current Resume"}
            </p>
            <p className="text-sm font-medium text-[#0F172A]">
              {applicationWithJob ? `${jobTitle} at ${company}` : masterResume?.title || "Resume"}
            </p>
          </div>
        </div>
      </div>

      {/* Premium AI Tools */}
      {hasInterviewSprint && (
        <div className="w-full mb-6">
          <h2 className="text-lg font-bold text-[#0F172A] mb-4">AI Premium Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* View Examples */}
            <button
              onClick={() => {
                if (missingKeywords.length > 0) {
                  setSelectedKeyword(missingKeywords[0].keyword || missingKeywords[0]);
                  setShowExamplesModal(true);
                } else {
                  toast.info("No missing keywords to show examples for");
                }
              }}
              className="bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#3B82F6] rounded-xl p-4 text-left transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-[#3B82F6]" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">View Examples</h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                See senior-level examples of how to integrate keywords naturally
              </p>
            </button>

            {/* Apply Metric */}
            <button
              onClick={() => {
                setSelectedBullet(currentBullet);
                setShowMetricModal(true);
              }}
              className="bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#22C55E] rounded-xl p-4 text-left transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(34,197,94,0.15)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#22C55E]" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">Apply Metric</h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Transform weak bullets into quantified impact statements
              </p>
            </button>

            {/* Rewrite All */}
            <button
              onClick={() => setShowRewriteModal(true)}
              className="bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#8B5CF6] rounded-xl p-4 text-left transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(139,92,246,0.15)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">Rewrite All</h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                AI engine to rewrite your entire CV at senior+ level
              </p>
            </button>

            {/* Battle Plan */}
            <button
              onClick={() => setShowBattlePlanModal(true)}
              className="bg-[#FFFFFF] border-2 border-[#E2E8F0] hover:border-[#EF4444] rounded-xl p-4 text-left transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#EF4444]" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">Battle Plan</h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Generate hardest questions + strategic answers for interviews
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Keyword Sniper Tool */}
      <div className="w-full relative">
        {!hasInterviewSprint && (
          <div className="absolute inset-0 z-10 bg-slate-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <Lock className="h-16 w-16 text-[#8B5CF6] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Interview Sprint Required</h3>
              <p className="text-slate-300 text-sm mb-6">
                Unlock the Keyword Sniper Tool to inject missing keywords and boost your ATS score.
              </p>
              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 text-white font-bold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
        <KeywordSniperTool
          missingKeywords={missingKeywords.map((kw: any) =>
            typeof kw === "string"
              ? { keyword: kw, priority: "medium", frequency: 5 }
              : kw
          )}
          currentBullet={currentBullet}
          jobTitle={jobTitle}
          company={company}
          currentScore={currentScore}
          onApplySuggestion={handleApplySuggestion}
        />
      </div>

      {/* Premium Modals */}
      <KeywordExamplesModal
        open={showExamplesModal}
        onOpenChange={setShowExamplesModal}
        keyword={selectedKeyword}
        role={jobTitle}
      />

      <ApplyMetricModal
        open={showMetricModal}
        onOpenChange={setShowMetricModal}
        originalBullet={selectedBullet}
        onApply={(newBullet: string) => {
          handleApplySuggestion(newBullet);
          setShowMetricModal(false);
        }}
      />

      <RewriteAllModal
        open={showRewriteModal}
        onOpenChange={setShowRewriteModal}
        resumeData={{
          bullets: bullets,
          targetRole: jobTitle
        }}
        keywords={missingKeywords.map((kw: any) => typeof kw === "string" ? kw : kw.keyword)}
        onComplete={(rewrittenData: any) => {
          toast.success("Resume rewritten successfully!");
          setShowRewriteModal(false);
        }}
      />

      <InterviewBattlePlanModal
        open={showBattlePlanModal}
        onOpenChange={setShowBattlePlanModal}
        resumeText={masterResume?.ocrText || ""}
        jobDescription={applicationWithJob?.jobDescriptionText || ""}
        targetRole={jobTitle}
      />
    </div>
  );
}
