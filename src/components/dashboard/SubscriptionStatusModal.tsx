import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SubscriptionStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export function SubscriptionStatusModal({ open, onOpenChange, onUpgrade }: SubscriptionStatusModalProps) {
  const user = useQuery(api.users.currentUser);

  if (!user) return null;

  const isFree = user.subscriptionTier === "free";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Welcome to CVDebug! <span className="text-2xl">👋</span>
          </DialogTitle>
          <DialogDescription className="text-base">
            You are currently on the <span className="font-bold text-primary capitalize">{user.subscriptionTier?.replace("_", " ") || "Free"}</span> plan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isFree ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Unlock Your Career Potential
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  Upgrade to a paid plan to access powerful features that help you land your dream job faster.
                </p>
                <ul className="space-y-2">
                  {[
                    "Full ATS Analysis & Scoring",
                    "Detailed Keyword Reports",
                    "Formatting Audit & Fixes",
                    "Unlimited Re-scans (24h window)",
                    "PDF Sanitization"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {benefit}
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 font-medium flex items-center gap-2">
                <Check className="h-5 w-5" />
                You have full access to premium features!
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isFree && (
            <Button onClick={onUpgrade} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold">
              View Upgrade Options
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Continue to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
