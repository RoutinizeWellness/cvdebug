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
        <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 border-2 border-primary shadow-2xl bg-zinc-900">
          <div className="bg-zinc-950 p-6 sm:p-8 text-center relative border-b border-zinc-800">
            <div className="absolute top-0 left-0 right-0 bg-orange-600 text-white text-xs font-bold py-2 text-center uppercase">
              ⚠️ WAIT! Before You Checkout...
            </div>
            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white drop-shadow-lg">Are You Applying to Only ONE Job?</h2>
              <p className="text-base sm:text-lg text-zinc-100 mb-6">
                For just <span className="text-primary font-black text-xl sm:text-2xl drop-shadow-md">€15 more</span>, get the <span className="font-black text-white">Interview Sprint</span>.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-zinc-900">
            <div className="bg-zinc-950 rounded-xl p-5 sm:p-6 border-2 border-primary/40 shadow-lg">
              <h3 className="font-bold text-lg sm:text-xl mb-4 text-primary drop-shadow-md">7 Days of Unlimited Power:</h3>
              <ul className="space-y-3 text-xs sm:text-sm">
                {[
                  "✨ Unlimited AI Resume Scans",
                  "📝 Unlimited Cover Letters",
                  "🎯 LinkedIn Profile Optimizer",
                  "📊 Full Application Tracker (CRM)",
                  "⚡ Priority Support (<4h response)"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary text-black flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Check className="h-3 w-3 font-bold" />
                    </div>
                    <span className="font-semibold text-white">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-500/20 border-2 border-green-500/50 rounded-xl p-3 sm:p-4 text-center shadow-lg">
              <p className="text-xs sm:text-sm font-bold text-green-300">
                📈 Most candidates land <span className="text-xl sm:text-2xl text-green-200 drop-shadow-md">3x more interviews</span> with Interview Sprint
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-12 sm:h-14 font-black text-base sm:text-lg bg-gradient-to-r from-primary to-yellow-400 hover:from-primary/90 hover:to-yellow-400/90 text-black rounded-xl shadow-lg"
                onClick={() => handleUpgrade("interview_sprint")}
                disabled={!!isLoading}
              >
                {isLoading === "interview_sprint" ? <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : "YES! Upgrade to Interview Sprint 🚀"}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-zinc-400 hover:text-white text-sm sm:text-base"
                onClick={() => {
                  setShowUpsell(false);
                  handleUpgrade("single_scan");
                }}
                disabled={!!isLoading}
              >
                {isLoading === "single_scan" ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : "No thanks, just Single Scan (€4.99)"}
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
        price: "€4.99", 
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
        color: "text-primary"
      }
    }[checkoutPlan];

    return (
      <Dialog open={open} onOpenChange={(val) => {
        if (!val) setCheckoutPlan(null);
        onOpenChange(val);
      }}>
        <DialogContent className="max-w-[95vw] sm:max-w-[450px] max-h-[90vh] overflow-y-auto p-0 border border-zinc-800 shadow-2xl bg-zinc-950">
          <div className="glass-card p-5 sm:p-6">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-zinc-400 hover:text-white transition-colors" onClick={() => setCheckoutPlan(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Plans
            </Button>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white">Secure Checkout</DialogTitle>
              <DialogDescription className="text-zinc-300">
                Complete your purchase for <span className="font-bold text-white">{planDetails.name}</span>.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-5 sm:p-6 pt-0 space-y-5 sm:space-y-6 bg-zinc-950">
            <div className="rounded-xl glass-card border border-zinc-800 p-4 sm:p-5 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
              {planDetails.badge && (
                <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  {planDetails.badge}
                </div>
              )}
              <div className="flex justify-between items-start mb-5 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-zinc-800 flex items-center justify-center ${planDetails.color}`}>
                    <planDetails.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${planDetails.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg leading-tight text-white">{planDetails.name}</h3>
                    <p className="text-[10px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider">One-time payment</p>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">{planDetails.price}</span>
                <span className="text-xs sm:text-sm text-zinc-400 line-through decoration-red-500/50">{planDetails.originalPrice}</span>
              </div>

              <Separator className="my-4 bg-zinc-800" />

              <div className="space-y-2.5">
                {planDetails.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="font-medium text-zinc-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl glass-card border border-zinc-800">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-sm">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold text-white">Payment Method</p>
                  <p className="text-[10px] sm:text-xs text-zinc-400">Processed securely by Stripe</p>
                </div>
                <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300 text-[10px]">Encrypted</Badge>
              </div>

              <Button
                className="w-full h-12 sm:h-14 text-sm sm:text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
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

              <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] text-zinc-400">
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
      <DialogContent className="max-w-[95vw] sm:max-w-[900px] max-h-[90vh] p-0 overflow-y-auto gap-0 border border-zinc-800 shadow-2xl bg-zinc-950">
        <div className="p-6 sm:p-8 pb-4 sm:pb-6 text-center relative overflow-hidden glass-card">
           {/* Trial Banner */}
           <div className="absolute top-0 left-0 right-0 bg-primary text-black text-xs font-bold py-1.5 text-center uppercase">
             Beta Launch Offer: 15-Day Free Trial Included
           </div>

          <DialogHeader className="mt-6 relative z-10">
            <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tight mb-2 text-white">Pay Per Use Pricing</DialogTitle>
            <DialogDescription className="text-base sm:text-lg text-zinc-300 max-w-lg mx-auto">
              No subscriptions. No hidden fees. <br/>Just pay for what you need.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 sm:p-6 pt-0 bg-zinc-950">
          {/* Free Tier */}
          <div className="rounded-xl glass-card border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4 hover:border-primary/50 transition-all duration-300">
            <div className="space-y-2">
              <h3 className="font-bold text-lg sm:text-xl text-zinc-300">FREE Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">€0</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">Basic scan to see where you stand.</p>
            </div>
            
            <Separator />

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-zinc-200">ATS Score (0-100)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-zinc-200">Robot View (ATS Vision)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-zinc-200">Top 2 Errors Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-zinc-200">Top 2 Keywords Preview</span>
              </div>
              <div className="flex items-center gap-3 opacity-40">
                <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="h-3 w-3 text-zinc-500" />
                </div>
                <span className="text-xs sm:text-sm font-medium line-through text-zinc-500">Full Keyword Report</span>
              </div>
              <div className="flex items-center gap-3 opacity-40">
                <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="h-3 w-3 text-zinc-500" />
                </div>
                <span className="text-xs sm:text-sm font-medium line-through text-zinc-500">Complete Format Fixes</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full h-12 font-bold text-base rounded-xl" onClick={() => onOpenChange(false)}>
              Try Free
            </Button>
          </div>

          {/* Single Scan - The Anchor */}
          <div className="group relative rounded-xl glass-card border border-zinc-800 p-5 sm:p-6 flex flex-col gap-4 hover:border-zinc-700 transition-all duration-300">
            <div className="space-y-2">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-white">
                Single Scan
              </h3>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">€4.99</span>
                </div>
                <span className="text-xs text-zinc-400 mt-1">One-time payment</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">One-time fix for this file. No history. No AI advice.</p>
            </div>
            
            <Separator />

            <div className="space-y-3 flex-1">
              {[
                "Full ATS Analysis",
                "Complete Keyword Report",
                "Formatting Audit + Fixes",
                "Unlimited Re-scans (24h)",
                "PDF Sanitization"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-zinc-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline"
              className="w-full h-12 font-bold text-base rounded-xl" 
              onClick={() => handleUpgrade("single_scan")}
              disabled={!!isLoading}
            >
              {isLoading === "single_scan" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Single Scan"}
            </Button>
          </div>

          {/* Interview Sprint - The Grand Slam Offer */}
          <div className="group relative rounded-xl glass-card border-2 border-primary p-5 sm:p-6 flex flex-col gap-4 shadow-lg transition-all duration-300 lg:scale-105 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-black px-6 py-2 rounded-full uppercase">
              🚀 Best Value
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-2">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="text-xs font-bold bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20">
                  Limited Time
                </div>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-white flex items-center gap-2">
                Interview Sprint
              </h3>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-black tracking-tighter text-primary">€19.99</span>
                  <span className="text-lg sm:text-xl text-zinc-400 line-through decoration-red-500/50 decoration-2">€49.99</span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 font-bold text-[10px]">
                    SAVE 60%
                  </Badge>
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                    7 Days Unlimited Access
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                Everything you need to land the job. Unlimited AI scans, cover letters, and tracking for one week. <span className="text-primary font-bold">The ultimate career accelerator.</span>
              </p>
            </div>
            
            <Separator className="bg-primary/20" />

            <div className="space-y-3 flex-1">
              {[
                "Unlimited Scans (7 Days)",
                "AI Keyword Suggestions",
                "Cover Letter Generator",
                "LinkedIn Optimizer",
                "Priority Support"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary text-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Check className="h-3 w-3 font-bold" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-3 sm:p-4 border border-zinc-700/50 shadow-inner">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-zinc-700 border-2 border-zinc-800"></div>
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-white">Joined by 1,200+ candidates</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 leading-tight">
                "This tool helped me land interviews at <span className="text-white font-bold">Google</span> and <span className="text-white font-bold">Netflix</span> in just one week."
              </p>
            </div>
            
            <Button
              className="w-full h-12 sm:h-14 font-bold text-base sm:text-lg shadow-lg bg-primary hover:bg-primary/90 text-black rounded-xl transition-colors"
              onClick={() => handleUpgrade("interview_sprint")}
              disabled={!!isLoading}
            >
              {isLoading === "interview_sprint" ? <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : "Start Interview Sprint 🚀"}
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-4 glass-card border-t border-zinc-800 text-center">
          <p className="text-[10px] sm:text-xs text-zinc-400 flex items-center justify-center gap-2 flex-wrap">
            <ShieldCheck className="h-3 w-3" /> Secure payment processing via Stripe. 100% Money-back guarantee if not satisfied.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}