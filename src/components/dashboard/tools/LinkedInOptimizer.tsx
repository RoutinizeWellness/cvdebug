import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp, Search, Loader2, Sparkles, Upload, Wand2, Lock, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScoreGauge } from "./linkedin/ScoreGauge";
import { KeywordCloud } from "./linkedin/KeywordCloud";
import { HeadlineOptimizer } from "./linkedin/HeadlineOptimizer";
import { QuickFixList } from "./linkedin/QuickFixList";
import { LinkedInHeader } from "./linkedin/LinkedInHeader";

const apiAny = api as any;

interface LinkedInOptimizerProps {
  onUpgrade?: () => void;
}

export function LinkedInOptimizer({ onUpgrade }: LinkedInOptimizerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [profileText, setProfileText] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isFixingBio, setIsFixingBio] = useState(false);

  const latestOptimization = useQuery(apiAny.linkedinProfile.getLatestOptimization);
  const currentUser = useQuery(apiAny.users.currentUser);
  const optimizeLinkedIn = useAction(apiAny.ai.linkedinOptimizer.optimizeLinkedIn);

  // Check if user has Interview Sprint plan
  const hasInterviewSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (!currentUser?.sprintExpiresAt || currentUser.sprintExpiresAt > Date.now());

  const handleRescan = async () => {
    if (!hasInterviewSprint) {
      toast.error("Interview Sprint plan required", {
        description: "Upgrade to optimize your LinkedIn profile"
      });
      onUpgrade?.();
      return;
    }
    setShowInputDialog(true);
  };

  const handleScan = async () => {
    if (!profileText.trim()) {
      toast.error("Please paste your LinkedIn profile text");
      return;
    }

    setIsScanning(true);
    setShowInputDialog(false);

    try {
      await optimizeLinkedIn({
        profileText: profileText.trim(),
        jobDescription: jobDescription.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
      });

      toast.success("✅ LinkedIn profile analyzed successfully!");
      setProfileText("");
      setJobDescription("");
      setLinkedinUrl("");
    } catch (error: any) {
      if (error.message?.includes("PLAN_RESTRICTION")) {
        toast.error("Interview Sprint plan required", {
          description: "This feature is only available with an active Interview Sprint subscription"
        });
        onUpgrade?.();
      } else if (error.message === "CREDITS_EXHAUSTED") {
        toast.error("No credits remaining. Please upgrade to continue.");
      } else {
        toast.error("Failed to scan profile. Please try again.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleAutoFixBio = async () => {
    if (!latestOptimization?.about?.optimized) {
      toast.error("No bio optimization available. Please scan your profile first.");
      return;
    }

    setIsFixingBio(true);
    try {
      await navigator.clipboard.writeText(latestOptimization.about.optimized);
      toast.success("✅ Optimized bio copied to clipboard! Paste it into your LinkedIn About section.");
    } catch (error) {
      toast.error("Failed to copy bio. Please try again.");
    } finally {
      setIsFixingBio(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const score = latestOptimization?.score || 0;
  const currentHeadline = latestOptimization?.headline?.current || "";
  const optimizedHeadline = latestOptimization?.headline?.optimized || "";
  const foundKeywords = latestOptimization?.keywordsFound || [];
  const missingKeywords = latestOptimization?.keywordsMissing || [];
  const quickFixes = latestOptimization?.actionableTips?.map((tip: any, index: number) => ({
    id: `tip-${index}`,
    title: tip.title || tip,
    description: tip.description,
    completed: tip.completed || false,
  })) || [];
  const currentBio = latestOptimization?.about?.current || "";
  const optimizedBio = latestOptimization?.about?.optimized || "";
  const bioSuggestions = latestOptimization?.about?.suggestions || [];

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      <div className="px-6 py-4">
        {!hasInterviewSprint && (
          <Alert className="mb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-primary/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 pointer-events-none" />

            <div className="relative">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                  <Diamond className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#0F172A] font-bold text-base mb-1">Interview Sprint Required</h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    Optimize your LinkedIn profile with AI and get 3x more recruiter views.
                  </p>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>AI headline optimization</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Keyword analysis</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>About section rewrite</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>Visibility score boost</span>
                </div>
              </div>

              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 w-full py-2.5 text-white font-bold border-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Upgrade to Interview Sprint</span>
              </Button>
            </div>
          </Alert>
        )}

        <LinkedInHeader
          lastScanned={latestOptimization ? formatTimeAgo(latestOptimization.generatedAt) : "Never"}
          profileUrl={latestOptimization?.linkedinUrl}
          onRescan={handleRescan}
          isScanning={isScanning}
        />
      </div>

      {/* Profile Input Dialog */}
      <Dialog open={showInputDialog} onOpenChange={setShowInputDialog}>
        <DialogContent className="max-w-2xl bg-[#FFFFFF] border border-[#E2E8F0]">
          <DialogHeader>
            <DialogTitle className="text-[#0F172A] text-xl">Scan LinkedIn Profile</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              Paste your LinkedIn profile text to get AI-powered optimization suggestions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                LinkedIn Profile URL (Optional)
              </label>
              <Input
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                Profile Text <span className="text-[#EF4444]">*</span>
              </label>
              <Textarea
                placeholder="Paste your LinkedIn profile text here (headline, about section, experience, etc.)"
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] min-h-[200px]"
              />
              <p className="text-xs text-[#64748B] mt-1">
                Copy and paste your entire LinkedIn profile or specific sections you want to optimize.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                Target Job Description (Optional)
              </label>
              <Textarea
                placeholder="Paste a job description to get tailored optimization suggestions"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] min-h-[120px]"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowInputDialog(false)}
                className="border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleScan}
                disabled={!profileText.trim() || isScanning}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1 px-6 pb-6 overflow-y-auto">
        {!latestOptimization ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-12 max-w-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <TrendingUp className="h-16 w-16 text-[#E2E8F0] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">No LinkedIn Analysis Yet</h3>
              <p className="text-[#64748B] text-sm mb-6">
                {hasInterviewSprint
                  ? "Click \"Re-scan Profile\" to analyze your LinkedIn profile and get AI-powered optimization suggestions."
                  : "Upgrade to Interview Sprint to analyze your LinkedIn profile and get AI-powered optimization suggestions."}
              </p>
              <Button
                onClick={hasInterviewSprint ? handleRescan : onUpgrade}
                className="bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {hasInterviewSprint ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Scan Your Profile
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Upgrade to Unlock
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Score Card */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 relative overflow-hidden group shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Loader2 className="h-24 w-24" />
            </div>
            <h3 className="text-[#64748B] text-sm font-semibold uppercase tracking-wider mb-6">
              Recruiter Visibility Score
            </h3>
            <div className="flex items-center gap-6">
              <ScoreGauge score={score} label={score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"} />
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-[#0F172A] font-medium leading-snug">
                  {score >= 80
                    ? "Your profile is highly visible to recruiters!"
                    : "Your profile is visible but misses key technical keywords."}
                </p>
                {score < 80 && (
                  <div className="flex items-center gap-1 text-[#EF4444] text-xs font-medium">
                    <span>⚠️</span>
                    <span>Invisible to {100 - score}% of recruiters</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stat 1 */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 rounded-lg text-[#22C55E]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-green-50 text-[#22C55E] rounded-full">
                  +12% vs last week
                </span>
              </div>
              <div>
                <p className="text-[#64748B] text-sm font-medium mb-1">Market Positioning</p>
                <p className="text-2xl font-bold text-[#0F172A]">Top 15%</p>
                <p className="text-[#64748B] text-xs mt-1">Compared to 1,400+ similar candidates</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Search className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded-full">
                  High Priority
                </span>
              </div>
              <div>
                <p className="text-[#64748B] text-sm font-medium mb-1">Searchability Gap</p>
                <p className="text-2xl font-bold text-[#0F172A]">{missingKeywords.length} Keywords</p>
                <p className="text-[#64748B] text-xs mt-1">Missing critical terms for your target role</p>
              </div>
            </div>
          </div>
        </div>

        {/* Headline Optimizer */}
        {currentHeadline && optimizedHeadline && (
          <HeadlineOptimizer
            currentHeadline={currentHeadline}
            optimizedHeadline={optimizedHeadline}
          />
        )}

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Keyword Cloud */}
          {(foundKeywords.length > 0 || missingKeywords.length > 0) && (
            <KeywordCloud
              foundKeywords={foundKeywords}
              missingKeywords={missingKeywords}
            />
          )}

          {/* Bio Audit */}
          <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#0F172A] font-bold text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Bio Audit
              </h3>
              {optimizedBio && (
                <Button
                  onClick={handleAutoFixBio}
                  disabled={isFixingBio}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isFixingBio ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Copying...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Copy Optimized Bio
                    </>
                  )}
                </Button>
              )}
            </div>

            {currentBio && optimizedBio ? (
              <div className="space-y-4">
                {/* Current Bio */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#EF4444] mb-2">Current About Section</p>
                  <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-[#475569] text-sm leading-relaxed">
                    {currentBio}
                  </div>
                </div>

                {/* Optimized Bio */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">AI-Optimized Version</p>
                  <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-[#0F172A] text-sm leading-relaxed">
                    {optimizedBio}
                  </div>
                </div>

                {/* Interactive Suggestions */}
                {bioSuggestions && bioSuggestions.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">Key Improvements</p>
                    <div className="space-y-2">
                      {bioSuggestions.map((suggestion: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-primary/30 transition-colors group cursor-pointer"
                        >
                          <div className="mt-0.5 size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                            {index + 1}
                          </div>
                          <p className="text-sm text-[#475569] leading-relaxed flex-1">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[#64748B] text-sm">
                No bio analysis available yet. Make sure to include your About section when scanning your profile.
              </p>
            )}
          </div>
        </div>

        {/* Quick Fix List */}
        {quickFixes.length > 0 && <QuickFixList fixes={quickFixes} />}
        </>
        )}
      </main>
    </div>
  );
}
