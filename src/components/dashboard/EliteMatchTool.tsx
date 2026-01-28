import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Loader2,
  Brain,
  BarChart3,
  Wand2,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCurrency } from "@/hooks/use-currency";
import { isPaidUser as checkIsPaidUser } from "@/lib/planHelpers";
import { useI18n } from "@/contexts/I18nContext";

interface MissingSignal {
  text: string;
  category: string;
  importance: 'critical' | 'important' | 'nice_to_have';
  context?: string;
  suggestion: string;
}

interface MatchResult {
  score: number;
  missingCritical: MissingSignal[];
  missingImportant: MissingSignal[];
  matched: string[];
  robotView: {
    redZones: string[];
    greenZones: string[];
  };
  recommendations: string[];
}

interface EliteMatchToolProps {
  user?: any;
  onUpgrade?: () => void;
}

export function EliteMatchTool({ user, onUpgrade }: EliteMatchToolProps = {}) {
  const { t } = useI18n();
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');

  // Fetch current user to check subscription status
  const currentUser = useQuery(api.users.currentUser);
  const resumes = useQuery(api.resumes.getResumes);

  // Check if user has paid plan
  const isPaidUser = checkIsPaidUser(currentUser?.subscriptionTier);

  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // Get localized pricing
  const { formatPrice } = useCurrency();
  const analyzeJobMatch = useAction(api.ai.eliteMatch.analyzeJobMatch);

  const handleAnalyze = async () => {
    if (!isPaidUser) {
      toast.error(t.eliteMatch.premiumFeature);
      if (onUpgrade) onUpgrade();
      return;
    }

    if (!jobDescriptionUrl && !jobDescriptionText) {
      toast.error(t.eliteMatch.errorNoDescription);
      return;
    }

    setStep('analyzing');
    setProgress(0);

    try {
      // Check if user has resumes
      if (!resumes || resumes.length === 0) {
        toast.error(t.eliteMatch.noResumeFound);
        setStep('input');
        return;
      }

      const latestResume = resumes[0];
      if (!latestResume.ocrText) {
        toast.error(t.eliteMatch.noTextFound);
        setStep('input');
        return;
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 400);

      setProgressMessage(t.eliteMatch.extractingIntent);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgressMessage(t.eliteMatch.analyzingHardSkills);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgressMessage(t.eliteMatch.detectingSoftSkills);

      // Call real analysis API
      const result = await analyzeJobMatch({
        resumeText: latestResume.ocrText,
        jobDescription: jobDescriptionText || jobDescriptionUrl,
        jobUrl: jobDescriptionUrl || undefined
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage(t.eliteMatch.generatingReport);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Analysis failed');
      }

      // Transform API response to match component's MatchResult interface
      const matchResult: MatchResult = {
        score: result.data.score,
        missingCritical: result.data.missingCritical,
        missingImportant: result.data.missingImportant,
        matched: result.data.matched,
        robotView: result.data.robotView,
        recommendations: result.data.recommendations
      };

      setMatchResult(matchResult);
      setStep('results');
    } catch (error: any) {
      console.error('Elite Match error:', error);
      toast.error(t.eliteMatch.analyzingMessage + ': ' + (error.message || 'Error'));
      setStep('input');
      setProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            {/* Header */}
            <header className="mb-8 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E293B] to-[#334155] flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                  {t.eliteMatch.title}
                </h1>
              </div>
              <p className="text-lg text-[#64748B] dark:text-slate-400 max-w-xl">
                {t.eliteMatch.description}
              </p>
            </header>

            {/* Input Section */}
            <section className="bg-white dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-800 rounded-xl shadow-sm p-8 mb-8">
              <div className="space-y-6">
                {/* LinkedIn URL Input */}
                <div>
                  <label
                    htmlFor="linkedin-url"
                    className="block text-sm font-semibold text-[#334155] dark:text-slate-300 mb-2"
                  >
                    {t.eliteMatch.linkedinUrlLabel}
                  </label>
                  <Input
                    id="linkedin-url"
                    type="text"
                    placeholder={t.eliteMatch.linkedinUrlPlaceholder}
                    value={jobDescriptionUrl}
                    onChange={(e) => setJobDescriptionUrl(e.target.value)}
                    disabled={!isPaidUser}
                    className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] transition-all"
                  />
                  <p className="mt-2 text-xs text-[#94A3B8] dark:text-slate-500">
                    {t.eliteMatch.linkedinUrlTip}
                  </p>
                </div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E2E8F0] dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm font-mono uppercase tracking-widest">
                    <span className="px-4 bg-white dark:bg-slate-900 text-[#94A3B8] dark:text-slate-600">
                      {t.eliteMatch.or}
                    </span>
                  </div>
                </div>

                {/* Job Description Textarea */}
                <div>
                  <label
                    htmlFor="job-description"
                    className="block text-sm font-semibold text-[#334155] dark:text-slate-300 mb-2"
                  >
                    {t.eliteMatch.jobDescriptionLabel}
                  </label>
                  <Textarea
                    id="job-description"
                    placeholder={t.eliteMatch.jobDescriptionPlaceholder}
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    disabled={!isPaidUser}
                    rows={6}
                    className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-xl text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] focus:ring-2 focus:ring-[#1E293B]/20 focus:border-[#1E293B] transition-all resize-none font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-[#94A3B8] dark:text-slate-500">
                    {t.eliteMatch.jobDescriptionTip}
                  </p>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={!isPaidUser}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#1E293B] to-[#334155] hover:opacity-90 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#1E293B]/30 group"
                >
                  <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  {t.eliteMatch.analyzeMatchScore}
                </Button>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-[#0F172A]/30 rounded-xl p-6 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-[#F8FAFC] dark:bg-[#0F172A]/20 flex items-center justify-center mb-4">
                  <Brain className="h-5 w-5 text-[#1E293B] dark:text-[#94A3B8]" />
                </div>
                <h3 className="font-semibold text-[#0F172A] dark:text-white mb-2">{t.eliteMatch.entityExtraction}</h3>
                <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                  {t.eliteMatch.entityExtractionDesc}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900/30 rounded-xl p-6 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                  <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-[#0F172A] dark:text-white mb-2">{t.eliteMatch.gapAnalysis}</h3>
                <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                  {t.eliteMatch.gapAnalysisDesc}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-6 transition-all hover:shadow-md">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                  <Wand2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-[#0F172A] dark:text-white mb-2">{t.eliteMatch.aiAutoFix}</h3>
                <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                  {t.eliteMatch.aiAutoFixDesc}
                </p>
              </div>
            </section>

            {/* Paywall Overlay */}
            {!isPaidUser && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/95 to-[#F8FAFC]/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-sm rounded-xl z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center p-12 max-w-xl"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-[#0F172A] dark:text-white mb-3">
                    {t.eliteMatch.premiumTitle}
                  </h2>
                  <p className="text-[#64748B] dark:text-slate-400 mb-2 text-lg">
                    {t.eliteMatch.premiumDescription}
                  </p>
                  <div className="text-[#64748B] dark:text-slate-400 mb-8 text-sm">
                    {t.eliteMatch.premiumList.map((itemValue: string, iIndex: number) => (
                      <p key={iIndex}>• {itemValue}</p>
                    ))}
                  </div>
                  <Button
                    onClick={onUpgrade}
                    size="lg"
                    className="bg-gradient-to-r from-[#1E293B] to-[#334155] hover:opacity-90 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#1E293B]/30"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {t.eliteMatch.upgradeNow} - {formatPrice('single_scan')}
                  </Button>
                  <p className="text-xs text-[#94A3B8] dark:text-slate-500 mt-4">
                    {t.eliteMatch.accessDuration}
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3">
              {progressMessage}
            </h3>
            <div className="w-full max-w-md h-2 bg-[#E2E8F0] dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#1E293B] to-[#334155]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[#64748B] dark:text-slate-400 mt-4 text-sm">
              {progress}% {t.eliteMatch.progressComplete}
            </p>
          </motion.div>
        )}

        {step === 'results' && matchResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold opacity-90">{t.eliteMatch.matchScore}</h3>
                  <p className="text-5xl font-black mt-2">{matchResult.score}%</p>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12" />
                </div>
              </div>
              <p className="text-white/80 text-sm">
                {matchResult.score >= 80 ? t.eliteMatch.excellentMatch :
                  matchResult.score >= 60 ? t.eliteMatch.goodMatch :
                    t.eliteMatch.improveMatch}
              </p>
            </div>

            {/* Missing Critical */}
            {matchResult.missingCritical.length > 0 && (
              <div className="bg-white dark:bg-slate-900/50 border border-red-200 dark:border-red-900/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-bold text-[#0F172A] dark:text-white">{t.eliteMatch.missingCriticalSignals}</h3>
                </div>
                <div className="space-y-3">
                  {matchResult.missingCritical.map((signal, idx) => (
                    <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/30">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-red-600">{signal.text}</span>
                        <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                          {signal.category}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] dark:text-slate-400 mt-2">{signal.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched Skills */}
            {matchResult.matched.length > 0 && (
              <div className="bg-white dark:bg-slate-900/50 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-bold text-[#0F172A] dark:text-white">{t.eliteMatch.matchedSkills}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matched.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Robot View */}
            <div className="bg-white dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6">
              <h3 className="font-bold text-[#0F172A] dark:text-white mb-4">{t.eliteMatch.robotView}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2">{t.eliteMatch.redZones}</h4>
                  <ul className="space-y-1">
                    {matchResult.robotView.redZones.map((zone, idx) => (
                      <li key={idx} className="text-sm text-[#64748B] dark:text-slate-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        {zone}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-600 mb-2">{t.eliteMatch.greenZones}</h4>
                  <ul className="space-y-1">
                    {matchResult.robotView.greenZones.map((zone, idx) => (
                      <li key={idx} className="text-sm text-[#64748B] dark:text-slate-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        {zone}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[#1E293B]" />
                <h3 className="font-bold text-[#0F172A] dark:text-white">{t.eliteMatch.autoFixRecommendations}</h3>
              </div>
              <ul className="space-y-2">
                {matchResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#64748B] dark:text-slate-400">
                    <span className="w-6 h-6 rounded-full bg-[#1E293B]/10 text-[#1E293B] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      {idx + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={() => setStep('input')}
                variant="outline"
                className="flex-1 border-[#E2E8F0] dark:border-slate-700"
              >
                {t.eliteMatch.analyzeAnotherJob}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white"
                onClick={() => {
                  toast.success(t.eliteMatch.autoFixCopied);
                  // In a real implementation, this would populate the editor with fixes
                  // For now, we show a helpful message
                }}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {t.eliteMatch.applyAutoFix}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
