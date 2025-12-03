import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function PricingDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const upgradePlan = useMutation(api.users.upgradePlan);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: "pro" | "team") => {
    setIsLoading(plan);
    try {
      await upgradePlan({ plan });
      toast.success(`Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`);
      onOpenChange(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upgrade plan");
    } finally {
      setIsLoading(null);
    }
  };

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
                <span>100 Screenshots / month</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Basic OCR Extraction</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Standard Support</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
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
              <p className="text-sm text-muted-foreground">For power users who need more.</p>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Unlimited Screenshots</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Advanced AI Analysis (Gemini)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Smart Categorization</span>
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
              onClick={() => handleUpgrade("pro")}
              disabled={isLoading === "pro"}
            >
              {isLoading === "pro" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Pro"}
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
              variant="outline" 
              className="w-full"
              onClick={() => handleUpgrade("team")}
              disabled={isLoading === "team"}
            >
              {isLoading === "team" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Team"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}