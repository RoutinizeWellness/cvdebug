import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { AlertTriangle, Sparkles, Clock, Zap } from "lucide-react";

const apiAny = api as any;

interface PlanExpirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "single_debug_fix" | "single_scan" | "interview_sprint";
  reason: "expired" | "exhausted";
}

export function PlanExpirationModal({ isOpen, onClose, tier, reason }: PlanExpirationModalProps) {
  const navigate = useNavigate();
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
        return "Pase 24h";
      case "interview_sprint":
        return "Sprint 7 Días";
      default:
        return "Plan";
    }
  };

  const getMessage = () => {
    if (reason === "exhausted" && tier === "single_debug_fix") {
      return {
        title: "¡Has usado tu Single Debug Fix!",
        description: "Tu escaneo y optimización AI han sido completados. Tu CV ahora está optimizado para ATS.",
        icon: <Sparkles className="h-12 w-12 text-[#F59E0B]" />,
      };
    }

    return {
      title: `Tu ${getTierName()} ha expirado`,
      description: "Tu plan ha llegado a su fin. Ahora estás en el plan gratuito con funciones limitadas.",
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
              <h4 className="font-bold text-white">Funciones ahora bloqueadas:</h4>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-[#EF4444]">✗</span> Vista Robot Terminal completa
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#EF4444]">✗</span> Análisis completo de keywords
              </li>
              {(tier === "single_debug_fix" || tier === "interview_sprint") && (
                <li className="flex items-center gap-2">
                  <span className="text-[#EF4444]">✗</span> Optimizaciones AI (Rewrite)
                </li>
              )}
              {tier === "interview_sprint" && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="text-[#EF4444]">✗</span> Cover Letter Generator
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#EF4444]">✗</span> LinkedIn Optimizer
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Upgrade CTA */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-[#1E293B] to-[#334155] border border-[#64748B]/30">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-5 w-5 text-[#22C55E]" />
              <h4 className="font-bold text-white">¿Quieres seguir optimizando?</h4>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Reactiva tu acceso completo y sigue mejorando tu CV para conseguir más entrevistas.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-[#64748B] to-[#1E293B] hover:opacity-90 text-white font-bold shadow-lg"
              >
                Ver Planes
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-[#64748B]/30 text-white hover:bg-[#64748B]/10"
              >
                Continuar Gratis
              </Button>
            </div>
          </div>

          {/* What you keep */}
          <div className="text-center text-xs text-slate-400">
            <p>
              Plan gratuito incluye: 1 escaneo básico, ATS Score global, preview de 2 keywords.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
