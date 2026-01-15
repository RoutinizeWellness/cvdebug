import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Loader2, ArrowLeft, CreditCard, ShieldCheck, Rocket, Sparkles, Star, X, Lock } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

const apiAny = api;

export function PricingDialog({ open, onOpenChange, initialPlan, resumeId }: { open: boolean; onOpenChange: (open: boolean) => void; initialPlan?: "single_scan" | "interview_sprint" | null; resumeId?: string }) {
  const createCheckoutSession = useAction(apiAny.billingActions.createCheckoutSession);
  const user = useQuery(apiAny.users.currentUser);
  const betaStatus = useQuery(apiAny.users.getBetaStatus);
  const claimed = betaStatus?.claimed ?? 97;
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<"single_scan" | "interview_sprint" | null>(initialPlan || null);
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setCheckoutPlan(initialPlan);
    }
  }, [initialPlan]);

  const currentPlan = user?.subscriptionTier || "free";
  const isTrial = user?.trialEndsOn && user.trialEndsOn > Date.now();

  const handleUpgrade = async (plan: "single_scan" | "interview_sprint") => {
    if (!isAuthenticated) {
      toast.error("Please log in to purchase credits");
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
        toast.error("Failed to start checkout");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to initiate checkout");
    } finally {
      setIsLoading(null);
    }
  };

  const initiateCheckout = (plan: "single_scan" | "interview_sprint") => {
    setCheckoutPlan(plan);
    setShowUpsell(false);
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
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 border-2 border-[#8B5CF6] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] bg-white">
          <div className="bg-[#F8FAFC] p-6 sm:p-8 text-center relative border-b border-[#E2E8F0]">
            <div className="absolute top-0 left-0 right-0 bg-[#F59E0B] text-white text-xs font-bold py-2 text-center uppercase">
              ⚠️ WAIT! Before You Checkout...
            </div>
            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-black mb-4 text-[#0F172A] drop-shadow-lg">Are You Applying to Only ONE Job?</h2>
              <p className="text-base sm:text-lg text-[#475569] mb-6">
                For just <span className="text-[#8B5CF6] font-black text-xl sm:text-2xl drop-shadow-md">€15 more</span>, get the <span className="font-black text-[#0F172A]">Interview Sprint</span>.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="bg-[#F8FAFC] rounded-xl p-5 sm:p-6 border-2 border-[#F3E8FF] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <h3 className="font-bold text-lg sm:text-xl mb-4 text-[#8B5CF6] drop-shadow-md">7 Days of Unlimited Power:</h3>
              <ul className="space-y-3 text-xs sm:text-sm">
                {[
                  "✨ Unlimited AI Resume Scans",
                  "📝 Unlimited Cover Letters",
                  "🎯 LinkedIn Profile Optimizer",
                  "📊 Full Application Tracker (CRM)",
                  "⚡ Priority Support (<4h response)"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="h-3 w-3 font-bold" />
                    </div>
                    <span className="font-semibold text-[#0F172A]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#22C55E]/10 border-2 border-[#22C55E]/30 rounded-xl p-3 sm:p-4 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <p className="text-xs sm:text-sm font-bold text-[#22C55E]">
                📈 Most candidates land <span className="text-xl sm:text-2xl text-[#22C55E] drop-shadow-md">3x more interviews</span> with Interview Sprint
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-12 sm:h-14 font-black text-base sm:text-lg bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] hover:from-[#8B5CF6]/90 hover:to-[#F59E0B]/90 text-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
                onClick={() => handleUpgrade("interview_sprint")}
                disabled={!!isLoading}
              >
                {isLoading === "interview_sprint" ? <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : "YES! Upgrade to Interview Sprint 🚀"}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-[#64748B] hover:text-[#0F172A] text-sm sm:text-base"
                onClick={() => {
                  setShowUpsell(false);
                  handleUpgrade("single_scan");
                }}
                disabled={!!isLoading}
              >
                {isLoading === "single_scan" ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : "No thanks, just Single Scan (€9.99)"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (checkoutPlan) {
    const planDetails = {
      single_scan: {
        name: "Single Scan",
        price: "€9.99",
        originalPrice: "€9.99",
        period: "one-time",
        features: ["Full ATS Analysis Score", "Missing Keywords Report", "Formatting & Structure Check", "Detailed Analysis Report"],
        badge: "Quick Fix",
        icon: Zap,
        color: "text-orange-500"
      },
      interview_sprint: {
        name: "7-Day Interview Sprint",
        price: "€19.99",
        originalPrice: "€49.99",
        period: "7 days unlimited access",
        features: ["Unlimited Scans for 7 Days", "AI Keyword Recommendations", "Job Application Tracker", "Targeted Match History", "Priority Support"],
        badge: "Best Value 🚀",
        icon: Rocket,
        color: "text-[#8B5CF6]"
      }
    }[checkoutPlan];

    return (
      <Dialog open={open} onOpenChange={(val) => {
        if (!val) setCheckoutPlan(null);
        onOpenChange(val);
      }}>
        <DialogContent className="max-w-[95vw] sm:max-w-[450px] max-h-[90vh] overflow-y-auto p-0 border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] bg-white">
          <div className="bg-[#F8FAFC] p-5 sm:p-6">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-[#64748B] hover:text-[#0F172A] transition-colors" onClick={() => setCheckoutPlan(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Plans
            </Button>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">Secure Checkout</DialogTitle>
              <DialogDescription className="text-[#475569]">
                Complete your purchase for <span className="font-bold text-[#0F172A]">{planDetails.name}</span>.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-5 sm:p-6 pt-0 space-y-5 sm:space-y-6 bg-white">
            <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 sm:p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:border-[#8B5CF6]/50 transition-all">
              {planDetails.badge && (
                <div className="absolute top-0 right-0 bg-[#8B5CF6] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  {planDetails.badge}
                </div>
              )}
              <div className="flex justify-between items-start mb-5 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center ${planDetails.color}`}>
                    <planDetails.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${planDetails.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg leading-tight text-[#0F172A]">{planDetails.name}</h3>
                    <p className="text-[10px] sm:text-xs text-[#64748B] font-medium uppercase tracking-wider">One-time payment</p>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A]">{planDetails.price}</span>
                <span className="text-xs sm:text-sm text-[#64748B] line-through decoration-[#EF4444]/50">{planDetails.originalPrice}</span>
              </div>

              <Separator className="my-4 bg-[#E2E8F0]" />

              <div className="space-y-2.5">
                {planDetails.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className="h-5 w-5 rounded-full bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-[#22C55E]" />
                    </div>
                    <span className="font-medium text-[#475569]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[#475569]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-[#0F172A]">Payment Method</p>
                  <p className="text-[10px] sm:text-xs text-[#64748B]">Processed securely by Stripe</p>
                </div>
                <Badge variant="outline" className="bg-white border-[#E2E8F0] text-[#475569] text-[10px]">Encrypted</Badge>
              </div>

              <Button
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.4)] transition-all rounded-xl bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white"
                onClick={() => handleUpgrade(checkoutPlan)}
                disabled={!!isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <div className="flex flex-col items-center leading-none gap-1">
                    <span>Pay {planDetails.price}</span>
                    <span className="text-[9px] sm:text-[10px] font-normal opacity-80">One-time payment • Secure checkout</span>
                  </div>
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] text-[#64748B]">
                <ShieldCheck className="h-3 w-3" />
                <span>256-bit SSL Encrypted Payment</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 overflow-y-auto gap-0 border-none shadow-none bg-white m-0 rounded-none">
        <div className="p-8 sm:p-12 pb-6 sm:pb-8 text-center relative overflow-hidden bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0F172A]">Pricing Plans</DialogTitle>
            <DialogDescription className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto">
              No subscriptions. No hidden fees. <br/>Just pay for what you need.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 sm:p-12 bg-[#F8FAFC] max-w-7xl mx-auto w-full">
          {/* Free Tier */}
          <div className="rounded-2xl bg-white border-2 border-[#E2E8F0] p-8 flex flex-col gap-5 hover:border-[#8B5CF6]/50 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="space-y-3">
              <h3 className="font-bold text-2xl text-[#475569]">FREE Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tight text-[#0F172A]">€0</span>
              </div>
              <p className="text-sm text-[#64748B]">Basic scan to see where you stand.</p>
            </div>

            <Separator className="bg-[#E2E8F0]" />

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <span className="text-base font-medium text-[#475569]">ATS Score (0-100)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <span className="text-base font-medium text-[#475569]">Robot View (ATS Vision)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <span className="text-base font-medium text-[#475569]">Top 2 Errors Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-[#8B5CF6]" />
                </div>
                <span className="text-base font-medium text-[#475569]">Top 2 Keywords Preview</span>
              </div>
              <div className="flex items-center gap-3 opacity-40">
                <div className="h-6 w-6 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                  <X className="h-4 w-4 text-[#64748B]" />
                </div>
                <span className="text-base font-medium line-through text-[#64748B]">Full Keyword Report</span>
              </div>
              <div className="flex items-center gap-3 opacity-40">
                <div className="h-6 w-6 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                  <X className="h-4 w-4 text-[#64748B]" />
                </div>
                <span className="text-base font-medium line-through text-[#64748B]">Complete Format Fixes</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-14 font-bold text-lg rounded-xl border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]" onClick={() => onOpenChange(false)}>
              Try Free
            </Button>
          </div>

          {/* Single Scan - The Anchor */}
          <div className="group relative rounded-2xl bg-white border-2 border-[#E2E8F0] p-8 flex flex-col gap-5 hover:border-[#E2E8F0] transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="space-y-3">
              <div className="h-14 w-14 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-2">
                <Zap className="h-7 w-7 text-[#64748B]" />
              </div>
              <h3 className="font-bold text-2xl text-[#0F172A]">
                Single Scan
              </h3>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-[#0F172A]">€9.99</span>
                </div>
                <span className="text-sm text-[#64748B] mt-1">One-time payment</span>
              </div>
              <p className="text-sm text-[#64748B]">One-time fix for this file. No history. No AI advice.</p>
            </div>

            <Separator className="bg-[#E2E8F0]" />

            <div className="space-y-4 flex-1">
              {[
                "Full ATS Analysis",
                "Complete Keyword Report",
                "Formatting Audit + Fixes",
                "Unlimited Re-scans (24h)",
                "PDF Sanitization"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-[#64748B]" />
                  </div>
                  <span className="text-base font-medium text-[#475569]">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full h-14 font-bold text-lg rounded-xl border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
              onClick={() => handleUpgrade("single_scan")}
              disabled={!!isLoading}
            >
              {isLoading === "single_scan" ? <Loader2 className="h-6 w-6 animate-spin" /> : "Get Single Scan"}
            </Button>
          </div>

          {/* Interview Sprint - The Grand Slam Offer */}
          <div className="group relative rounded-2xl bg-white border-2 border-[#8B5CF6] p-8 flex flex-col gap-5 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] transition-all duration-300 lg:scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white text-sm font-black px-8 py-2 rounded-full uppercase">
              🚀 Best Value
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div className="h-14 w-14 rounded-xl bg-[#8B5CF6]/10 border border-[#F3E8FF] flex items-center justify-center mb-2">
                  <Rocket className="h-7 w-7 text-[#8B5CF6]" />
                </div>
                <div className="text-sm font-bold bg-[#EF4444]/10 text-[#EF4444] px-3 py-1.5 rounded border border-[#EF4444]/20">
                  Limited Time
                </div>
              </div>
              <h3 className="font-black text-2xl text-[#0F172A] flex items-center gap-2">
                Interview Sprint
              </h3>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-5xl font-black tracking-tighter text-[#8B5CF6]">€19.99</span>
                  <span className="text-2xl text-[#64748B] line-through decoration-[#EF4444]/50 decoration-2">€49.99</span>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge className="bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 border-[#22C55E]/20 font-bold text-xs">
                    SAVE 60%
                  </Badge>
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    7 Days Unlimited Access
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#475569] font-medium leading-relaxed">
                Everything you need to land the job. Unlimited AI scans, cover letters, and tracking for one week. <span className="text-[#8B5CF6] font-bold">The ultimate career accelerator.</span>
              </p>
            </div>

            <Separator className="bg-[#F3E8FF]" />

            <div className="space-y-4 flex-1">
              {[
                "Unlimited Scans (7 Days)",
                "AI Keyword Suggestions",
                "Cover Letter Generator",
                "LinkedIn Optimizer",
                "Priority Support"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check className="h-4 w-4 font-bold" />
                  </div>
                  <span className="text-base font-bold text-[#0F172A]">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0] shadow-inner">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-7 w-7 rounded-full bg-[#E2E8F0] border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm font-bold text-[#0F172A]">Joined by 1,200+ candidates</span>
              </div>
              <p className="text-xs text-[#64748B] leading-tight">
                "This tool helped me land interviews at <span className="text-[#0F172A] font-bold">Google</span> and <span className="text-[#0F172A] font-bold">Netflix</span> in just one week."
              </p>
            </div>

            <Button
              className="w-full h-14 font-bold text-lg shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white rounded-xl transition-colors"
              onClick={() => handleUpgrade("interview_sprint")}
              disabled={!!isLoading}
            >
              {isLoading === "interview_sprint" ? <Loader2 className="h-6 w-6 animate-spin" /> : "Start Interview Sprint 🚀"}
            </Button>
          </div>
        </div>

        <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
          <p className="text-sm text-[#64748B] flex items-center justify-center gap-2 flex-wrap">
            <ShieldCheck className="h-4 w-4" /> Secure payment processing via Stripe. 100% Money-back guarantee if not satisfied.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
