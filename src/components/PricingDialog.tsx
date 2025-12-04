import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Loader2, ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function PricingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const upgradePlan = useAction(api.clerk.upgradePlan);
  const user = useQuery(api.users.currentUser);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<"pro" | "team" | null>(null);
  
  const currentPlan = user?.subscriptionTier || "free";

  const handleUpgrade = async (plan: "free" | "pro" | "team") => {
    setIsLoading(plan);
    try {
      await upgradePlan({ plan });
      toast.success(`Successfully updated to ${plan} plan`);
      setCheckoutPlan(null);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update plan");
    } finally {
      setIsLoading(null);
    }
  };

  const initiateCheckout = (plan: "pro" | "team") => {
    setCheckoutPlan(plan);
  };

  if (checkoutPlan) {
    const planDetails = {
      pro: { name: "Pro Plan", price: "$9", period: "/month", features: ["Unlimited Screenshots", "Advanced AI Analysis", "Priority Support"] },
      team: { name: "Team Plan", price: "$29", period: "/month", features: ["Everything in Pro", "Shared Workspace", "Admin Controls"] }
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
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{planDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">Monthly subscription</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">{planDetails.price}</div>
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
                  <p className="text-xs text-muted-foreground">Clerk Secure Billing</p>
                </div>
                <Button variant="outline" size="sm" disabled>Change</Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="h-3 w-3" /> Secure checkout powered by Clerk
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
        <div className="p-6 sm:p-10 bg-muted/30 text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center mb-2">Choose Your Plan</DialogTitle>
            <DialogDescription className="text-center text-lg max-w-md mx-auto">
              Unlock advanced AI features, unlimited storage, and organize your screenshots like a pro.
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x border-t">
          {/* Free Plan */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 bg-background">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-muted-foreground">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for getting started.</p>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>3 Resumes / month</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Basic Resume Parsing</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Standard Support</span>
              </div>
            </div>
            
            <Button 
              variant={currentPlan === "free" ? "outline" : "secondary"} 
              className="w-full" 
              disabled={currentPlan === "free" || !!isLoading}
              onClick={() => handleUpgrade("free")}
            >
              {isLoading === "free" ? <Loader2 className="h-4 w-4 animate-spin" /> : (currentPlan === "free" ? "Current Plan" : "Downgrade to Free")}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 bg-background relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Most Popular
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                Pro <Zap className="h-4 w-4 fill-primary" />
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">For serious job seekers.</p>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Unlimited Resumes</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Advanced AI Analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Smart Job Categorization</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Priority Support</span>
              </div>
            </div>
            
            <Button 
              className="w-full shadow-lg shadow-primary/20" 
              variant={currentPlan === "pro" ? "outline" : "default"}
              onClick={() => initiateCheckout("pro")}
              disabled={currentPlan === "pro" || !!isLoading}
            >
              {isLoading === "pro" ? <Loader2 className="h-4 w-4 animate-spin" /> : (currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro")}
            </Button>
          </div>

          {/* Team Plan */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 bg-background">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                Team <Building2 className="h-4 w-4" />
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">For teams and organizations.</p>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Everything in Pro</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Shared Workspace</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Admin Controls</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>API Access</span>
              </div>
            </div>
            
            <Button 
              variant={currentPlan === "team" ? "outline" : "default"} 
              className="w-full"
              onClick={() => initiateCheckout("team")}
              disabled={currentPlan === "team" || !!isLoading}
            >
              {isLoading === "team" ? <Loader2 className="h-4 w-4 animate-spin" /> : (currentPlan === "team" ? "Current Plan" : "Upgrade to Team")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}