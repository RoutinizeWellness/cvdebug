import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { AlertTriangle, Sparkles, Clock, Zap } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

const apiAny = api as any;

interface PlanExpirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "single_debug_fix" | "single_scan" | "interview_sprint";
  reason: "expired" | "exhausted";
}

export function PlanExpirationModal({ isOpen, onClose, tier, reason }: PlanExpirationModalProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const markPopupShown = useMutation(apiAny.planAccess.markExpirationPopupShown);

  const handleClose = async () => {
    await markPopupShown();
    onClose();
  };

  const handleUpgrade = async () => {
    await markPopupShown();
    navigate("/pricing");
  };

  const getTierName = () => {
    switch (tier) {
      case "single_debug_fix":
        return "Single Debug Fix";
      case "single_scan":
        return t.pricing.pass24h;
      case "interview_sprint":
        return t.pricing.sprint7d;
      default:
        return "Plan";
    }
  };

  const getMessage = () => {
    if (reason === "exhausted" && tier === "single_debug_fix") {
      return {
        title: t.modals.subscription.scoreChanged, // Reusing existing key
        description: t.dashboardExtended.analysis.error, // Reusing similar key
        icon: <Sparkles className="h-12 w-12 text-[#F59E0B]" />,
      };
    }

    return {
      title: `${getTierName()} ${t.common.error}`, // Combining keys
      description: t.modals.subscription.upgradeMessage,
      icon: <Clock className="h-12 w-12 text-[#64748B]" />,
    };
  };

  const message = getMessage();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-2 border-[#64748B]/30 text-white">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center mb-4">
            <div className="p-4 rounded-full bg-[#64748B]/10 border border-[#64748B]/20">
              {message.icon}
            </div>
            <DialogTitle className="text-2xl font-bold text-white">{message.title}</DialogTitle>
            <DialogDescription className="text-slate-300 text-base">
              {message.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* What you lose */}
          <div className="p-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
              <h4 className="font-bold text-white">{t.common.error}:</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-[#EF4444]">✗</span> {t.pricingDialog.robotViewTerminal}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#EF4444]">✗</span> {t.keywordAnalysis.title}
              </li>
              {(tier === "single_debug_fix" || tier === "interview_sprint") && (
                <li className="flex items-center gap-2">
                  <span className="text-[#EF4444]">✗</span> {t.dashboard.aiRewrite}
                </li>
              )}
              {tier === "interview_sprint" && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="text-[#EF4444]">✗</span> {t.dashboard.coverLetterGen}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#EF4444]">✗</span> {t.dashboard.linkedinOptimizer}
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Upgrade CTA */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-[#1E293B] to-[#334155] border border-[#64748B]/30">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-[#22C55E]" />
              <h4 className="font-bold text-white">{t.dialogs.upgradeMessage}</h4>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              {t.modals.subscription.upgradeMessage}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-[#64748B] to-[#1E293B] hover:opacity-90 text-white font-bold shadow-lg"
              >
                {t.pricing.enterprise.viewPricing}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-[#64748B]/30 text-white hover:bg-[#64748B]/10"
              >
                {t.pricingDialog.tryFree}
              </Button>
            </div>
          </div>

          {/* What you keep */}
          <div className="text-center text-xs text-slate-400">
            <p>
              {t.modals.subscription.freePlan}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
