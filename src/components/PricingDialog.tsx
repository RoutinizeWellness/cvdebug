import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Loader2, ArrowLeft, ShieldCheck, Rocket } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useI18n } from "@/contexts/I18nContext";

const apiAny = api;

export function PricingDialog({ open, onOpenChange, initialPlan, resumeId }: { open: boolean; onOpenChange: (open: boolean) => void; initialPlan?: "single_debug_fix" | "single_scan" | "interview_sprint" | "iteration_pass" | null; resumeId?: string }) {
  const { t } = useI18n();
  const createCheckoutSession = useAction(apiAny.billingActions.createCheckoutSession);
  const user = useQuery(apiAny.users.currentUser);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<"single_debug_fix" | "single_scan" | "interview_sprint" | "iteration_pass" | null>(initialPlan || null);
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setCheckoutPlan(initialPlan);
    }
  }, [initialPlan]);

  // Auto-trigger upgrade if initialPlan is provided and user is already authenticated
  useEffect(() => {
    if (open && initialPlan && isAuthenticated && !isLoading && !showUpsell) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        handleUpgrade(initialPlan);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open, initialPlan, isAuthenticated]);

  const handleUpgrade = async (plan: "single_debug_fix" | "single_scan" | "interview_sprint" | "iteration_pass") => {
    if (!isAuthenticated) {
      toast.error(t.pricingDialog.loginToPurchase);
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    // Show upsell if user is buying Single Scan
    if (plan === "single_scan" && !showUpsell) {
      setShowUpsell(true);
      return;
    }

    setIsLoading(plan);
    try {
      const url = await createCheckoutSession({
        plan,
        origin: window.location.origin,
        resumeId: resumeId || undefined
      });

      if (url) {
        window.location.href = url;
      } else {
        toast.error(t.pricingDialog.checkoutFailed);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t.pricingDialog.checkoutError);
    } finally {
      setIsLoading(null);
    }
  };

  // Upsell Modal
  if (showUpsell) {
    return (
      <Dialog open={open} onOpenChange={(val) => {
        if (!val) {
          setShowUpsell(false);
          setCheckoutPlan(null);
        }
        onOpenChange(val);
      }}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] landscape:max-h-[85vh] overflow-y-auto p-0 border-2 border-[#1E293B] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] bg-white">
          <div className="bg-[#F8FAFC] p-6 sm:p-8 text-center relative border-b border-[#E2E8F0]">
            <div className="absolute top-0 left-0 right-0 bg-[#F59E0B] text-white text-xs font-bold py-2 text-center uppercase">
              {t.pricingDialog.waitBeforeCheckout}
            </div>
            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-black mb-4 text-[#0F172A] drop-shadow-lg">{t.pricingDialog.applyingToOneJob}</h2>
              <p className="text-base sm:text-lg text-[#475569] mb-6">
                {t.pricingDialog.justMoreGetSprint}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="bg-[#F8FAFC] rounded-xl p-5 sm:p-6 border-2 border-[#F3E8FF] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wide">{t.pricingDialog.whyUpgrade}</span>
                <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 text-xs font-bold">{t.pricingDialog.save60}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#1E293B] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#475569] font-medium">{t.pricingDialog.unlimitedScansNotOne}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#1E293B] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#475569] font-medium">{t.pricingDialog.aiCoverLetters}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#1E293B] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#475569] font-medium">{t.pricingDialog.linkedinOptimization}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1E293B]/5 to-[#334155]/5 rounded-xl p-5 sm:p-6 border border-[#1E293B]/20">
              <p className="text-center text-sm text-[#475569] mb-4">
                {t.pricingDialog.candidatesChoseSprint}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span className="text-xs font-bold text-[#475569]">Google</span>
                <span className="text-xs text-[#CBD5E1]">•</span>
                <span className="text-xs font-bold text-[#475569]">Netflix</span>
                <span className="text-xs text-[#CBD5E1]">•</span>
                <span className="text-xs font-bold text-[#475569]">Meta</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-14 bg-gradient-to-r from-[#1E293B] to-[#334155] hover:from-[#1E293B]/90 hover:to-[#334155]/90 text-white font-black text-base shadow-[0_10px_40px_-10px_rgba(100,116,139,0.5)]"
                onClick={() => handleUpgrade("interview_sprint")}
                disabled={!!isLoading}
              >
                {isLoading === "interview_sprint" ? <Loader2 className="h-6 w-6 animate-spin" /> : t.pricingDialog.upgradeToSprint}
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 text-[#64748B] font-semibold text-sm hover:bg-[#F8FAFC]"
                onClick={() => handleUpgrade("single_scan")}
                disabled={!!isLoading}
              >
                {isLoading === "single_scan" ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : t.pricingDialog.noThanksJust24h}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!fixed !inset-0 !top-0 !left-0 !translate-x-0 !translate-y-0 w-screen h-screen !max-w-none !max-h-none p-0 overflow-y-auto gap-0 !border-none !shadow-none bg-[#F8FAFC] m-0 !rounded-none" showCloseButton={false}>
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-12 lg:p-16 pb-12 text-center">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold text-center">{t.pricingDialog.title}</DialogTitle>
            <DialogDescription className="text-center text-sm text-slate-600 mt-2">
              {t.pricingDialog.subtitle}
            </DialogDescription>

            {/* Competitive Value Banner */}
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-blue-900">Why We're Different</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white rounded-md p-2 border border-blue-100">
                  <div className="font-semibold text-gray-900">Competitors</div>
                  <div className="text-gray-600 mt-1">$39-89/month</div>
                  <div className="text-gray-500 text-[10px] mt-1">Recurring charges</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-md p-2 text-white">
                  <div className="font-semibold">Us ⭐</div>
                  <div className="mt-1">$4.99-24.99</div>
                  <div className="text-blue-100 text-[10px] mt-1">Pay only when needed</div>
                </div>
              </div>
              <div className="mt-3 text-center text-[11px] text-blue-800 font-medium">
                💰 Save up to 90% • 🚀 More features • ⚡ Faster AI
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 px-6 pb-16 max-w-7xl mx-auto w-full items-stretch">
          {/* Free Tier */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col h-full hover:border-slate-300 transition-colors">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Starter</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">FREE Debug</h2>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter">€0</span>
              </div>
            </div>
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                {t.pricingDialog.scorePreview}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                {t.pricingDialog.errorLabels}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span>
                {t.pricingDialog.topKeywords}
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full h-11 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              {t.pricingDialog.tryFree}
            </button>
          </div>

          {/* Single Debug Fix - NEW */}
          <div className="bg-white border-2 border-[#F59E0B]/40 rounded-xl p-6 flex flex-col h-full relative shadow-[0_0_40px_0_rgba(245,158,11,0.1)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <span className="material-symbols-outlined text-xs">build</span>
              {t.pricingDialog.fixOnceBanner}
            </div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F59E0B] font-mono">{t.pricingDialog.oneTimeFixLabel}</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{t.pricingDialog.quickFixTitle}</h2>
              <div className="mt-3 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-slate-900">€5.99</span>
                </div>
                <span className="text-slate-400 text-[10px] font-medium mt-1">{t.pricingDialog.coffeePriceLabel}</span>
              </div>
            </div>
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B]">
                <span className="material-symbols-outlined text-base">verified</span>
                {t.pricingDialog.oneDeepScan}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#F59E0B] text-base">check_circle</span>
                {t.pricingDialog.robotTerminalView}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#F59E0B] text-base">check_circle</span>
                {t.pricingDialog.fullMissingKeywords}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#F59E0B] text-base">check_circle</span>
                {t.pricingDialog.oneAiRewrite}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#F59E0B] text-base">check_circle</span>
                {t.pricingDialog.keywordAutoInjection}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#F59E0B] text-base">check_circle</span>
                {t.pricingDialog.exportAtsSafe}
              </div>
            </div>
            <button
              onClick={() => handleUpgrade("single_debug_fix")}
              disabled={!!isLoading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-bold text-sm shadow-lg shadow-[#F59E0B]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading === "single_debug_fix" ? <Loader2 className="h-4 w-4 animate-spin" /> : t.pricingDialog.fixMyCvBtn}
            </button>
          </div>

          {/* 24-Hour Pass - RECOMMENDED (Moved to 3rd position) */}
          <div className="bg-white border-2 border-[#64748B]/40 rounded-xl p-6 flex flex-col h-full relative shadow-[0_0_40px_0_rgba(100,116,139,0.1)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#64748B] to-[#475569] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <span className="material-symbols-outlined text-xs">bolt</span>
              {t.pricingDialog.recommended}
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] font-mono">{t.pricingDialog.quickFix}</span>
                <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-black px-2 py-1 rounded">{t.pricingDialog.fastStart}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{t.pricingDialog.pass24h}</h2>
              <div className="mt-3 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-slate-900">{t.pricingDialog.price24h}</span>
                </div>
                <span className="text-slate-400 text-[10px] font-medium mt-1">{t.pricingDialog.access24h}</span>
              </div>
            </div>
            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
                <span className="material-symbols-outlined text-base">verified</span>
                {t.pricingDialog.unlimitedScans24h}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#64748B] text-base">check_circle</span>
                {t.pricingDialog.fullErrorReport}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#64748B] text-base">check_circle</span>
                {t.pricingDialog.robotXRayView}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#64748B] text-base">check_circle</span>
                {t.pricingDialog.keywordOptimizer}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#64748B] text-base">check_circle</span>
                {t.pricingDialog.battlePlanGenerator}
              </div>
            </div>
            <button
              onClick={() => handleUpgrade("single_scan")}
              disabled={!!isLoading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-[#64748B] to-[#475569] text-white font-bold text-sm shadow-lg shadow-[#64748B]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading === "single_scan" ? <Loader2 className="h-4 w-4 animate-spin" /> : t.pricingDialog.get24hPass}
            </button>
          </div>

          {/* 7-Day Sprint - BEST VALUE (Moved to 4th position) */}
          <div className="bg-white border border-[#1E293B]/30 rounded-xl p-6 flex flex-col h-full relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1E293B] to-[#334155] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <span className="material-symbols-outlined text-xs">workspace_premium</span>
              {t.pricingDialog.bestValue}
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E293B] font-mono">{t.pricingDialog.sevenDaySprint}</span>
                <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-black px-2 py-1 rounded">{t.pricingDialog.bestValue}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">{t.pricingDialog.sevenDaySprint}</h2>
              <div className="mt-3 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tighter text-slate-900">€24.99</span>
                  <span className="text-slate-400 line-through text-xs font-medium">€59.99</span>
                </div>
                <span className="text-slate-400 text-[10px] font-medium mt-1">{t.pricingDialog.sevenDaysAccess}</span>
              </div>
            </div>
            <div className="space-y-3 mb-6 flex-grow">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E293B]">
                <span className="material-symbols-outlined text-base">verified</span>
                {t.pricingDialog.unlimitedCVScans}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#1E293B] text-base">check_circle</span>
                {t.pricingDialog.robotViewTerminal}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#1E293B] text-base">check_circle</span>
                {t.pricingDialog.missingSignalsDetector}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#1E293B] text-base">check_circle</span>
                {t.pricingDialog.seniorityMatchAudit}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#1E293B] text-base">check_circle</span>
                {t.pricingDialog.industrySelectorFAANG}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#1E293B] text-base">check_circle</span>
                {t.pricingDialog.bulletToneElevator}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#1E293B] text-base">check_circle</span>
                {t.pricingDialog.battlePlanGenerator}
              </div>
              <div className="pt-2 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t.pricingDialog.bonusExtras}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="material-symbols-outlined text-slate-300 text-base">check_circle</span>
                  {t.pricingDialog.coverLetterGen}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="material-symbols-outlined text-slate-300 text-base">check_circle</span>
                  {t.pricingDialog.linkedinOptimizer}
                </div>
              </div>
            </div>
            <div className="mb-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex -space-x-1.5">
                  <div className="size-5 rounded-full border-2 border-white bg-slate-100"></div>
                  <div className="size-5 rounded-full border-2 border-white bg-slate-100"></div>
                  <div className="size-5 rounded-full border-2 border-white bg-slate-100"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{t.pricingDialog.devsJoined}</span>
              </div>
              <p className="text-[10px] italic text-slate-400 leading-relaxed font-medium">
                {t.pricingDialog.sprintTestimonial}
              </p>
            </div>
            <button
              onClick={() => handleUpgrade("interview_sprint")}
              disabled={!!isLoading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-[#1E293B] to-[#2e62f6] text-white font-bold text-sm shadow-lg shadow-[#1E293B]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading === "interview_sprint" ? <Loader2 className="h-4 w-4 animate-spin" /> : t.pricingDialog.start7DaySprint}
            </button>
          </div>
        </div>

        <div className="mt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 font-mono text-[11px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">lock</span>
            {t.pricingDialog.secureCheckout}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
