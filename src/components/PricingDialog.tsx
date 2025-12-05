import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Loader2, ArrowLeft, CreditCard, ShieldCheck, Rocket } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function PricingDialog({ open, onOpenChange, initialPlan }: { open: boolean; onOpenChange: (open: boolean) => void; initialPlan?: "single_scan" | "bulk_pack" | null }) {
  const createCheckoutSession = useAction(api.billing.createCheckoutSession);
  const user = useQuery(api.users.currentUser);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<"single_scan" | "bulk_pack" | null>(initialPlan || null);
  
  const currentPlan = user?.subscriptionTier || "free";
  const isTrial = user?.trialEndsOn && user.trialEndsOn > Date.now();

  const handleUpgrade = async (plan: "single_scan" | "bulk_pack") => {
    setIsLoading(plan);
    try {
      const url = await createCheckoutSession({ plan });
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

  const initiateCheckout = (plan: "single_scan" | "bulk_pack") => {
    setCheckoutPlan(plan);
  };

  if (checkoutPlan) {
    const planDetails = {
      single_scan: { 
        name: "Single Resume Scan", 
        price: "$4.99", 
        originalPrice: "$9.99",
        period: "/resume", 
        features: ["Deep ATS Analysis", "Keyword Optimization", "Format Check"],
        badge: "Beta Launch 🚀"
      },
      bulk_pack: { 
        name: "Bulk Pack (5)", 
        price: "$19.99", 
        originalPrice: "$39.99",
        period: "/pack", 
        features: ["5 Resume Scans", "Priority Processing", "Save 50%"],
        badge: "Beta Pricing"
      }
    }[checkoutPlan];

    return (
      <Dialog open={open} onOpenChange={(val) => {
        if (!val) setCheckoutPlan(null);
        onOpenChange(val);
      }}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="p-6 bg-muted/30 border-b">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground" onClick={() => setCheckoutPlan(null)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Plans
            </Button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
              <DialogDescription>
                Complete your subscription to {planDetails.name}.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="rounded-xl border bg-card p-4 shadow-sm relative overflow-hidden">
              {planDetails.badge && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  {planDetails.badge}
                </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{planDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground line-through">{planDetails.originalPrice}</span>
                    <div className="font-bold text-xl text-primary">{planDetails.price}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{planDetails.period}</div>
                </div>
              </div>
              <div className="space-y-2">
                {planDetails.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" /> {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-xs text-muted-foreground">Secure Billing</p>
                </div>
                <Button variant="outline" size="sm" disabled>Change</Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="h-3 w-3" /> Secure checkout
              </div>

              <Button 
                className="w-full h-12 text-base" 
                onClick={() => handleUpgrade(checkoutPlan)}
                disabled={!!isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  `Pay ${planDetails.price} & Subscribe`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden gap-0">
        <div className="p-6 sm:p-10 bg-muted/30 text-center relative overflow-hidden">
           {/* Trial Banner */}
           <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary/80 to-purple-600/80 text-white text-xs font-bold py-1 text-center">
             BETA LAUNCH OFFER: 15-DAY FREE TRIAL INCLUDED
           </div>

          <DialogHeader className="mt-4">
            <DialogTitle className="text-3xl font-bold text-center mb-2">Pay Per Use Pricing</DialogTitle>
            <DialogDescription className="text-center text-lg max-w-md mx-auto">
              No subscriptions. Just pay for what you need.
              {isTrial && <span className="block mt-2 text-primary font-bold">Beta Trial Active!</span>}
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Single Scan */}
          <div className="rounded-xl border-2 border-primary bg-card p-6 flex flex-col gap-4 relative shadow-xl shadow-primary/10">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
              BETA ★
            </div>
            
            <div>
              <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                Single Scan <Zap className="h-4 w-4 fill-primary" />
              </h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black">$4.99</span>
                <span className="text-lg text-muted-foreground line-through decoration-red-500/50">$9.99</span>
              </div>
              <p className="text-[10px] font-bold text-orange-600 mt-1 flex items-center gap-1">
                <Rocket className="h-3 w-3" /> Limited: 53/100 claimed
              </p>
            </div>
            
            <div className="space-y-3 flex-1">
              {[
                "Full ATS Analysis",
                "Missing Keywords",
                "Format Check",
                "PDF Report"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full font-bold shadow-lg shadow-primary/20" 
              onClick={() => handleUpgrade("single_scan")}
              disabled={!!isLoading}
            >
              {isLoading === "single_scan" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Full Analysis"}
            </Button>
          </div>

          {/* Bulk Pack */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors">
            <div>
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                Bundle (5 Scans) <Building2 className="h-4 w-4" />
              </h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black">$19.99</span>
                <span className="text-lg text-muted-foreground line-through">$49.95</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Save $25!</p>
            </div>
            
            <div className="space-y-3 flex-1">
              {[
                "5 Full Scans",
                "Test different versions",
                "Apply to 5+ jobs",
                "$4/scan (save $25!)"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full font-bold" 
              onClick={() => handleUpgrade("bulk_pack")}
              disabled={!!isLoading}
            >
              {isLoading === "bulk_pack" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buy Bundle"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}