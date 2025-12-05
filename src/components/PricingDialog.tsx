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
        
        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x border-t">
          {/* Free Preview */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 bg-background">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-muted-foreground">Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <p className="text-sm text-muted-foreground">Basic scan to see where you stand.</p>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> Basic Score
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> 1 Resume Upload
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-primary">
                <Check className="h-3 w-3" /> Free for 15 Days
              </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              Continue Free
            </Button>
          </div>

          {/* Single Scan - BETA PRICING */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 bg-background relative border-primary/20 shadow-lg z-10 scale-105 md:scale-110 rounded-xl md:rounded-none md:border-y-0 md:border-x">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
              Beta Launch 🚀
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                Single Scan <Zap className="h-4 w-4 fill-primary" />
              </h3>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-lg text-muted-foreground line-through decoration-red-500/50">$9.99</span>
                </div>
                <p className="text-xs font-bold text-orange-600 mt-1 flex items-center gap-1">
                  <Rocket className="h-3 w-3" /> Limited to first 100 users
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Beat the ATS for one specific job.</p>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> Deep ATS Analysis
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> Keyword Optimization
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> Format Compatibility Check
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> Section Completeness Check
              </div>
            </div>
            
            <Button 
              className="w-full shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
              onClick={() => initiateCheckout("single_scan")}
            >
              Get Beta Access
            </Button>
          </div>

          {/* Bulk Pack */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 bg-background">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                Bulk Pack <Building2 className="h-4 w-4" />
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$19.99</span>
                <span className="text-muted-foreground line-through text-sm">$39.99</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for active job seekers.</p>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> 5 Full ATS Scans
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> Save 50% (Beta)
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-3 w-3 text-primary" /> Priority Processing
              </div>
            </div>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => initiateCheckout("bulk_pack")}
            >
              Buy Pack
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}