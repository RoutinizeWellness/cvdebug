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

  // Check if user has Career Sprint plan
  const hasCareerSprint = currentUser?.subscriptionTier === "interview_sprint" &&
    (!currentUser?.sprintExpiresAt || currentUser.sprintExpiresAt > Date.now());

  const { t } = useI18n();

  const handleRescan = async () => {
    if (!hasCareerSprint) {
      toast.error(t('tools.linkedIn.upgradeDescription'));
      onUpgrade?.();
      return;
    }
    setShowInputDialog(true);
  };

  const handleScan = async () => {
    if (!profileText.trim()) {
      toast.error(t('tools.linkedIn.noProfileText'));
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

      toast.success(t('tools.linkedIn.analyzed'));
      setProfileText("");
      setJobDescription("");
      setLinkedinUrl("");
    } catch (error: any) {
      if (error.message?.includes("PLAN_RESTRICTION")) {
        toast.error(t('createApplication.planRequired'), {
          description: t('createApplication.featureRestricted')
        });
        onUpgrade?.();
      } else if (error.message === "CREDITS_EXHAUSTED") {
        toast.error(t('toasts.errors.noCredits'));
      } else {
        toast.error(t('tools.linkedIn.scanError'));
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleAutoFixBio = async () => {
    if (!latestOptimization?.about?.optimized) {
      toast.error(t('tools.linkedIn.noBioOptimization'));
      return;
    }

    setIsFixingBio(true);
    try {
      await navigator.clipboard.writeText(latestOptimization.about.optimized);
      toast.success(t('tools.linkedIn.bioOptimized'));
    } catch (error) {
      toast.error(t('common.error'));
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
        {!hasCareerSprint && (
          <Alert className="mb-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-primary/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-cyan-500/5 pointer-events-none" />

            <div className="relative">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                  <Diamond className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#0F172A] font-bold text-base mb-1">{t('dashboard.careerSprintRequired')}</h3>
                  <p className="text-[#475569] text-sm leading-relaxed">
                    {t('tools.linkedIn.description')}
                  </p>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>{t('tools.linkedIn.benefits.headline')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>{t('tools.linkedIn.benefits.keywords')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>{t('tools.linkedIn.benefits.bio')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <span className="text-[#22C55E] font-bold">✓</span>
                  <span>{t('tools.linkedIn.benefits.visibility')}</span>
                </div>
              </div>

              <Button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-[#1E293B] to-[#334155] hover:from-[#1E293B]/90 hover:to-[#334155]/90 w-full py-2.5 text-white font-bold border-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t('keywordSniper.upgradeToSprint')}</span>
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
            <DialogTitle className="text-[#0F172A] text-xl">{t('tools.linkedIn.scanLinkedInProfile')}</DialogTitle>
            <DialogDescription className="text-[#64748B]">
              {t('tools.linkedIn.pasteProfileDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                {t('tools.linkedIn.profileUrlLabel')}
              </label>
              <Input
                placeholder={t('tools.linkedIn.profileUrlPlaceholder')}
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                {t('tools.linkedIn.profileTextLabel')} <span className="text-[#EF4444]">*</span>
              </label>
              <Textarea
                placeholder={t('tools.linkedIn.profileTextPlaceholder')}
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] min-h-[200px]"
              />
              <p className="text-xs text-[#64748B] mt-1">
                {t('tools.linkedIn.profileTextDescription')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-[#475569] mb-2 block">
                {t('tools.linkedIn.targetJobLabel')}
              </label>
              <Textarea
                placeholder={t('tools.linkedIn.targetJobPlaceholder')}
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
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleScan}
                disabled={!profileText.trim() || isScanning}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('tools.linkedIn.copying').replace('...', 'ing...')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('tools.linkedIn.analyzeProfile')}
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
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">{t('tools.linkedIn.noAnalysisYet')}</h3>
              <p className="text-[#64748B] text-sm mb-6">
                {hasCareerSprint
                  ? t('tools.linkedIn.noAnalysisDescriptionPaid')
                  : t('tools.linkedIn.noAnalysisDescriptionFree')}
              </p>
              <Button
                onClick={hasCareerSprint ? handleRescan : onUpgrade}
                className="bg-primary hover:bg-primary/90 text-white font-bold"
              >
                {hasCareerSprint ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    {t('tools.linkedIn.analyzeProfile')}
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    {t('tools.linkedIn.unlockToOptimize')}
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
                  {t('tools.linkedIn.visibilityScore')}
                </h3>
                <div className="flex items-center gap-6">
                  <ScoreGauge score={score} label={score >= 80 ? t('tools.linkedIn.excellent') : score >= 60 ? t('tools.linkedIn.good') : t('tools.linkedIn.needsWork')} />
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-[#0F172A] font-medium leading-snug">
                      {score >= 80
                        ? t('tools.linkedIn.excellent')
                        : t('tools.linkedIn.missesKeywords')}
                    </p>
                    {score < 80 && (
                      <div className="flex items-center gap-1 text-[#EF4444] text-xs font-medium">
                        <span>⚠️</span>
                        <span>{t('tools.linkedIn.invisibleTo').replace('{percentage}', (100 - score).toString())}</span>
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
                    <p className="text-[#64748B] text-sm font-medium mb-1">{t('tools.linkedIn.marketPositioning')}</p>
                    <p className="text-2xl font-bold text-[#0F172A]">{t('tools.linkedIn.top15Percent')}</p>
                    <p className="text-[#64748B] text-xs mt-1">{t('tools.linkedIn.comparedToCandidates')}</p>
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
                    <p className="text-[#64748B] text-sm font-medium mb-1">{t('tools.linkedIn.searchabilityGap')}</p>
                    <p className="text-2xl font-bold text-[#0F172A]">{missingKeywords.length} Keywords</p>
                    <p className="text-[#64748B] text-xs mt-1">{t('tools.linkedIn.missingCriticalTerms')}</p>
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
                    {t('tools.linkedIn.bioAudit')}
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
                          {t('tools.linkedIn.copying')}
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          {t('tools.linkedIn.copyOptimizedBio')}
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {currentBio && optimizedBio ? (
                  <div className="space-y-4">
                    {/* Current Bio */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#EF4444] mb-2">{t('tools.linkedIn.currentAboutSection')}</p>
                      <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-[#475569] text-sm leading-relaxed">
                        {currentBio}
                      </div>
                    </div>

                    {/* Optimized Bio */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{t('tools.linkedIn.aiOptimizedVersion')}</p>
                      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-[#0F172A] text-sm leading-relaxed">
                        {optimizedBio}
                      </div>
                    </div>

                    {/* Interactive Suggestions */}
                    {bioSuggestions && bioSuggestions.length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">{t('tools.linkedIn.keyImprovements')}</p>
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
                    {t('tools.linkedIn.noBioAnalysis')}
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
