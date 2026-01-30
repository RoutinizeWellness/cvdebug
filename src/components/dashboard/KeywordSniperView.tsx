import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KeywordSniperTool } from "./KeywordSniperTool";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Lock, Diamond, Sparkles, Eye, TrendingUp, RefreshCw, Shield, AlertCircle, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeywordExamplesModal } from "./KeywordExamplesModal";
import { ApplyMetricModal } from "./ApplyMetricModal";
import { RewriteAllModal } from "./RewriteAllModal";
import { InterviewBattlePlanModal } from "./InterviewBattlePlanModal";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/contexts/I18nContext";

const apiAny = api;

interface KeywordSniperViewProps {
  onBack: () => void;
  onUpgrade?: () => void;
}

export function KeywordSniperView({ onBack, onUpgrade }: KeywordSniperViewProps) {
  const { t } = useI18n();
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

  // Search Tool State
  const [manualKeywords, setManualKeywords] = useState("");
  const [verificationResult, setVerificationResult] = useState<{ keyword: string, found: boolean }[]>([]);

  const featureAccess = useQuery(apiAny.planAccess.getFeatureAccess);
  const hasSniperAccess = featureAccess?.features?.keywordSniper || false;
  const hasCareerSprint = featureAccess?.tier === "interview_sprint"; // For upsell display if applicable

  // PRIORITY: Get application with job description (has missing keywords)
  const applicationWithJob = applications?.find((app: any) =>
    app.jobDescriptionText &&
    (app.missingKeywords?.length || app.matchedKeywords?.length)
  );

  // Fallback: Get the master resume if no application exists
  const masterResume = resumes?.find((r: any) =>
    r.status === "completed"
  ) || resumes?.[0];

  const handleVerifyKeywords = () => {
    if (!manualKeywords.trim()) return;

    // Split by comma or newline
    const kwList = manualKeywords.split(/[,\n]/).map(k => k.trim()).filter(k => k);

    if (kwList.length === 0) return;

    const results = kwList.map(kw => {
      // Create a regex to find the keyword as a whole word, case-insensitive
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      return {
        keyword: kw,
        found: regex.test(masterResume?.ocrText || "")
      };
    });

    setVerificationResult(results);

    // Achievement feedback
    const foundCount = results.filter(r => r.found).length;
    if (foundCount === results.length) {
      toast.success(`All ${results.length} keywords detected!`);
    } else if (foundCount > 0) {
      toast.info(`${foundCount} of ${results.length} keywords detected.`);
    } else {
      toast.error("No keywords detected. Please check formatting.");
    }
  };

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

  // Mutations
  const updateResumeContent = useMutation(apiAny.resumes.updateResumeContent);

  const handleApplySuggestion = async (newText: string) => {
    if (!masterResume) return;

    try {
      // Logic to replace the old bullet with the new one in the OCR text
      const oldOcrText = masterResume.ocrText || "";
      // Escape special characters for regex
      const escapedOldBullet = currentBullet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const newOcrText = oldOcrText.replace(new RegExp(escapedOldBullet, 'g'), newText);

      if (newOcrText === oldOcrText) {
        // If direct replace failed, maybe try a more flexible match or just append at start
        console.warn("Direct bullet replacement failed. Full OCR update might be needed.");
      }

      toast.promise(
        updateResumeContent({
          id: masterResume._id,
          newContent: newOcrText
        }),
        {
          loading: 'Applying AI optimization...',
          success: () => {
            // We don't need to do much here as the query will auto-refresh
            return t.keywordSniper.suggestionApplied;
          },
          error: 'Failed to update resume. Please try again.'
        }
      );
    } catch (err) {
      console.error("Error applying suggestion:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  if (!resumes || !applications) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="animate-spin h-10 w-10 border-4 border-[#0F172A] border-t-transparent rounded-full font-black"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing Sniper System...</p>
      </div>
    );
  }

  // Check if we have the necessary data for keyword sniper
  const hasJobDescription = applicationWithJob?.jobDescriptionText;
  const hasKeywords = missingKeywords.length > 0 || matchedKeywords.length > 0;

  if (!hasJobDescription || !hasKeywords) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <div className="h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
          <Target className="h-12 w-12 text-slate-200" />
        </div>
        <h3 className="text-2xl font-black text-[#0F172A] mb-3 uppercase tracking-tight">{t.keywordSniper.noJobDescription}</h3>
        <p className="text-[#64748B] max-w-sm mb-8 leading-relaxed">
          {t.keywordSniper.noJobDescriptionDesc}
        </p>
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 max-w-md mb-8 text-left shadow-xl shadow-slate-100/50">
          <p className="text-sm font-black text-[#0F172A] mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            {t.keywordSniper.howToUseTitle}
          </p>
          <ul className="space-y-3">
            {[t.keywordSniper.howToStep1, t.keywordSniper.howToStep2, t.keywordSniper.howToStep3, t.keywordSniper.howToStep4].map((step, i) => (
              <li key={i} className="text-xs text-[#475569] flex gap-3">
                <span className="h-5 w-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</span>
                <span className="leading-tight">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          onClick={onBack}
          className="h-12 px-8 bg-[#0F172A] text-white font-bold rounded-xl shadow-xl shadow-slate-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.keywordSniper.backToDashboard}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pb-24">
      {/* Interview Sprint Required Alert */}
      {!hasSniperAccess && (
        <Alert className="mb-8 bg-[#0F172A] border-0 shadow-2xl relative overflow-hidden p-8 rounded-[2rem]">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Diamond className="h-32 w-32 -mr-16 -mt-16 text-white" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                <Sparkles className="h-3 w-3" /> Professional Feature
              </div>
              <h3 className="text-white font-black text-2xl mb-2">{t.keywordSniper.interviewSprintRequired}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                {t.keywordSniper.injectKeywordsDesc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 shrink-0">
              {[
                t.keywordSniper.keywordInjection,
                t.keywordSniper.liveScoreTracking,
                t.keywordSniper.priorityTargeting,
                t.keywordSniper.contextAwareAI
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-wider">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={onUpgrade}
              className="h-14 px-8 bg-white text-[#0F172A] hover:bg-slate-100 font-black rounded-2xl shadow-xl border-0 flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.keywordSniper.upgradeToSprint}</span>
            </Button>
          </div>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Keyword System v4.2</span>
          </div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter flex items-center gap-3">
            {t.keywordSniper.title}
            {!hasCareerSprint && <Lock className="h-6 w-6 text-slate-300 mb-1" />}
          </h1>
          <p className="text-slate-500 text-lg mt-1 max-w-xl">
            {t.keywordSniper.subtitle}
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Target Profile
            </p>
            <p className="font-bold text-[#0F172A]">
              {applicationWithJob ? `${jobTitle} @ ${company}` : masterResume?.title || "Resume"}
            </p>
          </div>
          <div className="h-10 w-px bg-slate-100"></div>
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-[#0F172A]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Premium AI Tools - REDESIGNED */}
      {(hasCareerSprint || featureAccess?.tier === "single_debug_fix") && (
        <div className="w-full mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.keywordSniper.aiPremiumTools}</h2>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Neural Cluster Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Targeted Examples */}
            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (missingKeywords.length > 0) {
                  setSelectedKeyword(missingKeywords[0].keyword || missingKeywords[0]);
                  setShowExamplesModal(true);
                } else {
                  toast.info(t.keywordSniper.noMissingKeywords);
                }
              }}
              className="group relative h-56 bg-white border border-slate-100 rounded-[2rem] p-8 text-left transition-all hover:border-emerald-500/30 hover:shadow-[0_24px_48px_-12px_rgba(16,185,129,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-tight">Precision Examples</h3>
                    <p className="text-[11px] text-[#64748B] font-medium leading-relaxed mt-2">
                      {t.keywordSniper.viewExamplesDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest pt-4 border-t border-slate-50">
                  {t.keywordSniper.viewExamplesAction} <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                </div>
              </div>
            </motion.button>

            {/* Apply Metrics */}
            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedBullet(currentBullet);
                setShowMetricModal(true);
              }}
              className="group relative h-56 bg-white border border-slate-100 rounded-[2rem] p-8 text-left transition-all hover:border-blue-500/30 hover:shadow-[0_24px_48px_-12px_rgba(59,130,246,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-tight">Metric Injection</h3>
                    <p className="text-[11px] text-[#64748B] font-medium leading-relaxed mt-2">
                      {t.keywordSniper.applyMetricDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest pt-4 border-t border-slate-50">
                  {t.keywordSniper.applyMetric} <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                </div>
              </div>
            </motion.button>

            {/* AI Rewrite */}
            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRewriteModal(true)}
              className="group relative h-56 bg-[#0F172A] border border-white/5 rounded-[2rem] p-8 text-left transition-all hover:border-indigo-500/50 hover:shadow-[0_24px_48px_-12px_rgba(99,102,241,0.4)] overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 rounded-full blur-[60px] -mr-20 -mt-20 opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:bg-indigo-500 transition-all duration-300 shadow-lg">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-white text-sm uppercase tracking-tight">{t.keywordSniper.rewriteAll}</h3>
                      <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[8px] font-black uppercase tracking-widest px-1.5 py-0">PRO</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      {t.keywordSniper.rewriteAllDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-[10px] font-black text-indigo-400 uppercase tracking-widest pt-4 border-t border-white/5">
                  Launch Engine <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                </div>
              </div>
            </motion.button>

            {/* Battle Plan */}
            <motion.button
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!featureAccess?.features?.interviewBattlePlan) {
                  toast.error(t.keywordSniper.upgradeRequired, {
                    description: t.keywordSniper.battlePlanUpgradeDesc
                  });
                  onUpgrade?.();
                  return;
                }
                setShowBattlePlanModal(true);
              }}
              className={`group relative h-56 bg-white border border-slate-100 rounded-[2rem] p-8 text-left transition-all ${featureAccess?.features?.interviewBattlePlan ? 'hover:border-amber-500/30 hover:shadow-[0_24px_48px_-12px_rgba(245,158,11,0.15)]' : 'opacity-70'} overflow-hidden shadow-sm`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#0F172A] text-sm uppercase tracking-tight">{t.keywordSniper.battlePlan}</h3>
                    <p className="text-[11px] text-[#64748B] font-medium leading-relaxed mt-2">
                      {t.keywordSniper.battlePlanDesc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-[10px] font-black text-amber-600 uppercase tracking-widest pt-4 border-t border-slate-50">
                  {t.keywordSniper.battlePlanAction} <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      )}

      {/* Keyword Sniper Tool */}
      <div className="w-full relative">
        {!hasSniperAccess && (
          <div className="absolute inset-x-0 inset-y-[-1rem] z-10 bg-white/40 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-slate-200 m-[-0.5rem]">
            <div className="text-center p-8 max-w-sm bg-white rounded-[2rem] shadow-2xl border border-slate-100">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2 uppercase tracking-tight">{t.keywordSniper.lockedTitle}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {t.keywordSniper.lockedDesc}
              </p>
              <Button
                onClick={onUpgrade}
                className="w-full h-14 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl shadow-slate-200"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {t.keywordSniper.upgradeNow}
              </Button>
            </div>
          </div>
        )}
        <KeywordSniperTool
          missingKeywords={missingKeywords.map((kw: any) =>
            typeof kw === "string"
              ? { keyword: kw, priority: "medium", frequency: 5, impact: 8 }
              : kw
          )}
          currentBullet={currentBullet}
          jobTitle={jobTitle}
          company={company}
          currentScore={currentScore}
          onApplySuggestion={handleApplySuggestion}
        />
      </div>

      {/* Keyword Verification Tool */}
      <div className="mt-16 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 border-b border-slate-50 bg-[#F8FAFC]/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">{t.keywordSniper.verificationToolTitle}</h2>
              </div>
              <p className="text-slate-500 font-medium">
                {t.keywordSniper.verificationToolDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={manualKeywords}
                  onChange={(e) => setManualKeywords(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyKeywords()}
                  placeholder={t.keywordSniper.verificationPlaceholder}
                  className="w-full sm:w-64 h-14 pl-5 pr-12 rounded-2xl border-2 border-slate-100 focus:border-[#0F172A] focus:outline-none transition-all text-sm font-bold bg-white"
                />
                <button
                  onClick={handleVerifyKeywords}
                  className="absolute right-3 top-3 h-8 w-8 rounded-lg text-slate-400 hover:text-[#0F172A] transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
              <Button
                onClick={handleVerifyKeywords}
                className="h-14 px-8 bg-[#0F172A] text-white font-black rounded-2xl shadow-xl shadow-slate-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.keywordSniper.verifyButton}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {verificationResult.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {verificationResult.map((res: { keyword: string; found: boolean }, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${res.found ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100 shadow-[inset_0_2px_10px_rgba(244,63,94,0.05)]'
                      }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${res.found ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {res.found ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      </div>
                      <span className={`text-base font-black truncate ${res.found ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {res.keyword}
                      </span>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-widest ${res.found ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                      {res.found ? t.keywordSniper.keywordFound : t.keywordSniper.keywordNotFound}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 border-4 border-dashed border-slate-50 rounded-[2rem]">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-40">
                  <Target className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">{t.keywordSniper.verificationPlaceholder}</p>
              </div>
            )}
          </AnimatePresence>

          {/* Special "Image Trap" Warning within the verification tool if things aren't found */}
          {verificationResult.length > 0 && verificationResult.some((r: { found: boolean }) => !r.found) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-8 bg-[#0F172A] rounded-[2rem] text-white relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-8 opacity-10">
                <AlertCircle className="h-32 w-32 -mr-16 -mt-16" />
              </div>
              <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="shrink-0 h-16 w-16 bg-[#EF4444] rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-500/20">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                    Critical Extraction Alert
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                    Our AI cannot detect these keywords despite they being in your CV. This indicates an <strong>Image Trap</strong> or encoding failure. Your CV is currently invisible to ATS bots.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    toast.info("Opening Robot View to check formatting...");
                    onBack(); // Navigate back to see the Robot View
                  }}
                  className="h-12 px-8 bg-white text-[#0F172A] hover:bg-slate-100 font-black rounded-xl shrink-0"
                >
                  Analyze Robot View
                </Button>
              </div>
            </motion.div>
          )}
        </div>
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
        onComplete={async (rewrittenData: any[]) => {
          if (!masterResume?._id) return;

          let updatedText = masterResume.ocrText;
          rewrittenData.forEach((item: any) => {
            if (item.originalBullet && item.rewrittenBullet) {
              updatedText = updatedText.replace(item.originalBullet, item.rewrittenBullet);
            }
          });

          try {
            await updateResumeContent({
              id: masterResume._id,
              newContent: updatedText
            });
            toast.success(t.keywordSniper.rewriteSuccess);
          } catch (error) {
            console.error("Failed to update resume after rewrite:", error);
            toast.error("Failed to apply improvements to resume");
          }
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
