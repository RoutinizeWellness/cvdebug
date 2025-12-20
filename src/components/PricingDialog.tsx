import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Loader2, ArrowLeft, CreditCard, ShieldCheck, Rocket, Sparkles, Star, X, Lock } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { useState } from "react";
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
  
  const currentPlan = user?.subscriptionTier || "free";
  const isTrial = user?.trialEndsOn && user.trialEndsOn > Date.now();

  const handleUpgrade = async (plan: "single_scan" | "interview_sprint") => {
    if (!isAuthenticated) {
      toast.error("Please log in to purchase credits");
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    setIsLoading(plan);
    try {
      // Pass window.location.origin to ensure redirects work in all environments (dev/prod)
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
  };

  if (checkoutPlan) {
    const planDetails = {
      single_scan: { 
        name: "Single Scan", 
        price: "$4.99", 
        originalPrice: "$9.99",
        period: "one-time", 
        features: ["Full ATS Analysis Score", "Missing Keywords Report", "Formatting & Structure Check", "Detailed Analysis Report"],
        badge: "Quick Fix",
        icon: Zap,
        color: "text-orange-500"
      },
      interview_sprint: { 
        name: "7-Day Interview Sprint", 
        price: "$14.99", 
        originalPrice: "$49.99",
        period: "7 days unlimited access", 
        features: ["Unlimited Scans for 7 Days", "AI Keyword Recommendations", "Job Application Tracker", "Targeted Match History", "Priority Support"],
        badge: "Most Popular 🚀",
        icon: Rocket,
        color: "text-primary"
      }
    }[checkoutPlan];

    return (
      <Dialog open={open} onOpenChange={(val) => {
        if (!val) setCheckoutPlan(null);
        onOpenChange(val);
      }}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-b from-muted/50 to-background p-6">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setCheckoutPlan(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Plans
            </Button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">Secure Checkout</DialogTitle>
              <DialogDescription>
                Complete your purchase for <span className="font-bold text-foreground">{planDetails.name}</span>.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 pt-0 space-y-6">
            <div className="rounded-2xl border bg-card p-5 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
              {planDetails.badge && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  {planDetails.badge}
                </div>
              )}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${planDetails.color} bg-opacity-10`}>
                    <planDetails.icon className={`h-6 w-6 ${planDetails.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{planDetails.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">One-time payment</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black tracking-tight">{planDetails.price}</span>
                <span className="text-sm text-muted-foreground line-through decoration-red-500/50">{planDetails.originalPrice}</span>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2.5">
                {planDetails.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="font-medium text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center shadow-sm">
                  <CreditCard className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Payment Method</p>
                  <p className="text-xs text-muted-foreground">Processed securely by Stripe</p>
                </div>
                <Badge variant="outline" className="bg-background">Encrypted</Badge>
              </div>

              <Button 
                className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl" 
                onClick={() => handleUpgrade(checkoutPlan)}
                disabled={!!isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <div className="flex flex-col items-center leading-none gap-1">
                    <span>Pay {planDetails.price}</span>
                    <span className="text-[10px] font-normal opacity-80">One-time payment • Secure checkout</span>
                  </div>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
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
      <DialogContent className="sm:max-w-[1100px] p-0 overflow-hidden gap-0 border-none shadow-2xl bg-muted/10">
        <div className="p-8 pb-6 text-center relative overflow-hidden bg-background">
           {/* Trial Banner */}
           <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-[10px] font-bold py-1.5 text-center tracking-widest uppercase shadow-sm">
             Beta Launch Offer: 15-Day Free Trial Included
           </div>

          <DialogHeader className="mt-6 relative z-10">
            <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight mb-3">Pay Per Use Pricing</DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground max-w-lg mx-auto">
              No subscriptions. No hidden fees. <br/>Just pay for what you need.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 p-4 md:p-8 pt-0 bg-background">
          {/* Free Tier */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-muted-foreground">FREE Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight">$0</span>
              </div>
              <p className="text-sm text-muted-foreground">Basic scan to see where you stand.</p>
            </div>
            
            <Separator />

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground/80">Score 0-100</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground/80">Top 3 keywords missing (of 10)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground/80">Top 2 format issues (of 5)</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground/80">
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium">Detailed recommendations locked</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full h-12 font-bold text-base rounded-xl" onClick={() => onOpenChange(false)}>
              Try Free
            </Button>
          </div>

          {/* Single Scan - The Anchor */}
          <div className="group relative rounded-2xl border border-zinc-800 bg-card p-6 flex flex-col gap-5 hover:border-zinc-700 transition-all duration-300">
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="font-bold text-xl text-foreground">
                Single Scan
              </h3>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">$4.99</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1">One-time payment</span>
              </div>
              <p className="text-sm text-muted-foreground">One-time fix for this file. No history. No AI advice.</p>
            </div>
            
            <Separator />

            <div className="space-y-3 flex-1">
              {[
                "1 Full ATS Analysis",
                "Basic Keyword Report",
                "Format Check",
                "PDF Sanitization"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-zinc-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{feature}</span>
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

          {/* Interview Sprint - The Focus */}
          <div className="group relative rounded-2xl border-2 border-primary bg-card p-6 flex flex-col gap-5 shadow-[0_0_50px_-12px_rgba(249,245,6,0.3)] hover:shadow-[0_0_60px_-12px_rgba(249,245,6,0.4)] transition-all duration-300 transform scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg animate-pulse">
              🚀 Most Popular
            </div>

            <div className="space-y-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                7-Day Interview Sprint
              </h3>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">$14.99</span>
                  <span className="text-lg text-muted-foreground line-through decoration-red-500/50">$49.99</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                    70% OFF
                  </Badge>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Unlimited scans for 7 days
                  </span>
                </div>
              </div>
              <p className="text-sm text-foreground/80 font-medium">Unlimited scans for 7 days. AI Bullet Point Rewriter. Dashboard to track your applications. <span className="text-primary">Most successful for job seekers.</span></p>
            </div>
            
            <Separator className="bg-primary/20" />

            <div className="space-y-3 flex-1">
              {[
                "✨ Unlimited Scans (7 Days)",
                "🎯 AI Keyword Recommendations",
                "📊 Job Application Tracker",
                "🔄 Targeted Match History",
                "⚡ Priority Support"
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-bold text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-lg p-3 border border-primary/20">
              <p className="text-xs text-center font-medium text-muted-foreground">
                ⭐ Used by candidates at <span className="font-bold text-foreground">Google, Meta & NVIDIA</span>
              </p>
            </div>
            
            <Button 
              className="w-full h-14 font-bold text-base shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 text-black rounded-xl transition-all hover:scale-[1.02]" 
              onClick={() => handleUpgrade("interview_sprint")}
              disabled={!!isLoading}
            >
              {isLoading === "interview_sprint" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Start Interview Sprint →"}
            </Button>
          </div>
        </div>
        
        <div className="p-4 bg-muted/30 text-center border-t border-border/50">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <ShieldCheck className="h-3 w-3" /> Secure payment processing via Stripe. 100% Money-back guarantee if not satisfied.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}