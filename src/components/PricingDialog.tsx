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

const apiAny = api;

export function PricingDialog({ open, onOpenChange, initialPlan, resumeId }: { open: boolean; onOpenChange: (open: boolean) => void; initialPlan?: "single_scan" | "interview_sprint" | null; resumeId?: string }) {
  const createCheckoutSession = useAction(apiAny.billingActions.createCheckoutSession);
  const user = useQuery(apiAny.users.currentUser);
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
                For just <span className="text-[#8B5CF6] font-black text-xl sm:text-2xl drop-shadow-md">€10 more</span>, get the <span className="font-black text-[#0F172A]">Interview Sprint</span>.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-white">
            <div className="bg-[#F8FAFC] rounded-xl p-5 sm:p-6 border-2 border-[#F3E8FF] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#8B5CF6] uppercase tracking-wide">Why Upgrade?</span>
                <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 text-xs font-bold">Save 60%</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#475569] font-medium">Unlimited scans for 7 days (not just one)</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#475569] font-medium">AI-powered cover letters for every application</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#475569] font-medium">LinkedIn profile optimization included</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-[#6366F1]/5 rounded-xl p-5 sm:p-6 border border-[#8B5CF6]/20">
              <p className="text-center text-sm text-[#475569] mb-4">
                <span className="font-black text-[#0F172A]">1,200+ candidates</span> chose Interview Sprint and landed roles at:
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
                className="w-full h-14 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#8B5CF6]/90 hover:to-[#6366F1]/90 text-white font-black text-base shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)]"
                onClick={() => handleUpgrade("interview_sprint")}
                disabled={!!isLoading}
              >
                {isLoading === "interview_sprint" ? <Loader2 className="h-6 w-6 animate-spin" /> : "Yes, Upgrade to Sprint (€19.99) 🚀"}
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 text-[#64748B] font-semibold text-sm hover:bg-[#F8FAFC]"
                onClick={() => handleUpgrade("single_scan")}
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
          <DialogHeader>
            <DialogTitle className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-slate-900">Simple, Transparent Pricing</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
              One-time payments for professional results. No recurring subscriptions or hidden fees.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-6 pb-16 max-w-6xl mx-auto w-full items-stretch">
          {/* Free Tier */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 flex flex-col h-full hover:border-slate-300 transition-colors">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Starter</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">FREE Preview</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter">€0</span>
              </div>
            </div>
            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                ATS Score Preview
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                Robot View Analysis
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                Top 2 Errors/Keywords
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full h-12 rounded-lg border border-[#E2E8F0] bg-white text-slate-900 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Try Free
            </button>
          </div>

          {/* Single Scan */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 flex flex-col h-full hover:border-slate-300 transition-colors">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">Essential</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Single Scan</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter">€9.99</span>
                <span className="text-slate-400 text-sm font-medium">/ scan</span>
              </div>
            </div>
            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                Full ATS Analysis
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                Complete Keyword Report
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                Formatting Audit + Fixes
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                Unlimited Re-scans (24h)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-slate-400 text-lg">check_circle</span>
                PDF Sanitization
              </div>
            </div>
            <button
              onClick={() => handleUpgrade("single_scan")}
              disabled={!!isLoading}
              className="w-full h-12 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isLoading === "single_scan" ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Get Single Scan"}
            </button>
          </div>

          {/* Interview Sprint */}
          <div className="bg-white border-2 border-[#8B5CF6]/40 rounded-xl p-8 flex flex-col h-full relative shadow-[0_0_40px_0_rgba(134,85,246,0.1)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md">
              <span className="material-symbols-outlined text-xs">rocket_launch</span>
              Best Value
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6] font-mono">7-Day Intensive</span>
                <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-black px-2 py-1 rounded">SAVE 60%</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Interview Sprint</h2>
              <div className="mt-4 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter text-slate-900">€19.99</span>
                  <span className="text-slate-400 line-through text-sm font-medium">€49.99</span>
                </div>
                <span className="text-slate-400 text-xs font-medium mt-1">Full 7-day intensive access</span>
              </div>
            </div>
            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-center gap-3 text-sm font-bold text-[#8B5CF6]">
                <span className="material-symbols-outlined text-lg">verified</span>
                Unlimited Scans (7 Days)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#8B5CF6] text-lg">check_circle</span>
                AI Keyword Suggestions
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#8B5CF6] text-lg">check_circle</span>
                Cover Letter Generator
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="material-symbols-outlined text-[#8B5CF6] text-lg">check_circle</span>
                LinkedIn Optimizer
              </div>
            </div>
            <div className="mb-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex -space-x-2">
                  <div className="size-7 rounded-full border-2 border-white bg-slate-100"></div>
                  <div className="size-7 rounded-full border-2 border-white bg-slate-100"></div>
                  <div className="size-7 rounded-full border-2 border-white bg-slate-100"></div>
                </div>
                <span className="text-[11px] font-bold text-slate-500">Joined by 1,200+ candidates</span>
              </div>
              <p className="text-[11px] italic text-slate-400 leading-relaxed font-medium">
                "The Sprint was a game changer. The AI suggestions are spot on!"
              </p>
            </div>
            <button
              onClick={() => handleUpgrade("interview_sprint")}
              disabled={!!isLoading}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#2e62f6] text-white font-bold text-sm shadow-lg shadow-[#8B5CF6]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading === "interview_sprint" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Start Interview Sprint 🚀"}
            </button>
          </div>
        </div>

        <div className="mt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 font-mono text-[11px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">lock</span>
            Secure 256-bit Encrypted Checkout
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
