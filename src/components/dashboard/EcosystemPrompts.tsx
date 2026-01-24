import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Chrome, Mail, Linkedin, ExternalLink, Copy, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EcosystemPrompt {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  actionUrl?: string;
  badge?: string;
  onAction?: () => void;
}

interface EcosystemPromptsProps {
  userId?: string;
  userScore?: number;
}

export function EcosystemPrompts({ userId, userScore }: EcosystemPromptsProps) {
  const [dismissedPrompts, setDismissedPrompts] = useState<string[]>([]);
  const [activePrompt, setActivePrompt] = useState<EcosystemPrompt | null>(null);
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);

  useEffect(() => {
    // Load dismissed prompts from localStorage
    const dismissed = JSON.parse(localStorage.getItem("dismissed_ecosystem_prompts") || "[]");
    setDismissedPrompts(dismissed);
  }, []);

  useEffect(() => {
    // Determine which prompt to show based on user context
    if (!userId) return;

    const prompts: EcosystemPrompt[] = [
      {
        id: "copy-paste-tip",
        title: "💡 Pro Tip: Copia desde LinkedIn",
        description: "Ve a un job posting en LinkedIn → Selecciona todo el texto → Ctrl+C → Pégalo en 'Add Job Description'. Automático, sin extensiones.",
        icon: <Chrome className="h-8 w-8 text-[#64748B]" />,
        actionLabel: "Entendido",
        badge: "GRATIS",
        onAction: () => toast.success("¡Perfecto! Usa Ctrl+C en cualquier job posting."),
      },
      {
        id: "linkedin-reminder",
        title: "🔗 Recordatorio: Actualiza LinkedIn",
        description: "Tu CV está en {score}%. 89% de reclutadores buscan en LinkedIn antes de llamar. Copia las mejoras de tu CV a tu perfil de LinkedIn.",
        icon: <Linkedin className="h-8 w-8 text-[#0A66C2]" />,
        actionLabel: "Ir a LinkedIn",
        badge: "GRATIS",
        onAction: () => window.open("https://www.linkedin.com/in/me/", "_blank"),
      },
      {
        id: "keyboard-shortcuts",
        title: "⌨️ Atajos de Teclado",
        description: "Ctrl+V para pegar job description rápido. Esc para cerrar modales. Trabaja más rápido sin salir del teclado.",
        icon: <Zap className="h-8 w-8 text-[#F59E0B]" />,
        actionLabel: "Ver Más Atajos",
        badge: "GRATIS",
        onAction: () => toast.info("Atajos: Ctrl+V (pegar JD), Esc (cerrar), Tab (navegar)"),
      },
    ];

    // Show prompt that hasn't been dismissed
    const availablePrompt = prompts.find(p => !dismissedPrompts.includes(p.id));
    if (availablePrompt) {
      // Random delay to not be annoying
      const delay = Math.random() * 3000 + 2000; // 2-5 seconds
      setTimeout(() => {
        setActivePrompt(availablePrompt);
      }, delay);
    }
  }, [userId, dismissedPrompts]);

  const dismissPrompt = (promptId: string) => {
    const newDismissed = [...dismissedPrompts, promptId];
    setDismissedPrompts(newDismissed);
    localStorage.setItem("dismissed_ecosystem_prompts", JSON.stringify(newDismissed));
    setActivePrompt(null);
  };

  const showBookmarkletInstructions = () => {
    toast.success("Copia el bookmarklet y arrástralo a tu barra de marcadores!", {
      duration: 5000,
    });
    // Show instructions modal
    const bookmarklet = `javascript:(function(){var t=document.body.innerText||document.body.textContent;window.open('https://yourapp.com/scan?text='+encodeURIComponent(t.substring(0,5000)),'_blank')})();`;

    // Copy to clipboard
    navigator.clipboard.writeText(bookmarklet);
    setCopiedBookmarklet(true);
    setTimeout(() => setCopiedBookmarklet(false), 2000);
  };

  const showEmailAnalyzer = () => {
    toast.info("Función próximamente: Analizador de emails de reclutadores");
  };

  const showLinkedInChecklist = () => {
    toast.info("Abriendo checklist de LinkedIn...");
  };

  if (!activePrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <div className="bg-white border-2 border-[#64748B] rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#64748B] to-[#475569] p-4 relative">
            <button
              onClick={() => dismissPrompt(activePrompt.id)}
              className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                {activePrompt.icon}
              </div>
              <div className="flex-1">
                {activePrompt.badge && (
                  <div className="text-xs font-bold text-yellow-300 mb-1 uppercase tracking-wider">
                    {activePrompt.badge}
                  </div>
                )}
                <h4 className="text-white font-bold text-sm">
                  {activePrompt.title}
                </h4>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 bg-white">
            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {activePrompt.description}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (activePrompt.onAction) {
                    activePrompt.onAction();
                  } else if (activePrompt.actionUrl) {
                    window.open(activePrompt.actionUrl, "_blank");
                  }
                  dismissPrompt(activePrompt.id);
                }}
                className="flex-1 bg-gradient-to-r from-[#64748B] to-[#475569] hover:opacity-90 text-white font-semibold text-sm"
              >
                {activePrompt.actionLabel}
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </div>

            {/* Subtle dismiss link */}
            <button
              onClick={() => dismissPrompt(activePrompt.id)}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-2"
            >
              No me interesa
            </button>
          </div>

          {/* Footer indicator */}
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span className="font-mono">ECOSYSTEM_HELPER</span>
              <span className="text-[#22C55E] font-bold">100% GRATIS</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Chrome Bookmarklet Instructions Modal
export function BookmarkletInstructions() {
  const [copied, setCopied] = useState(false);

  const bookmarklet = `javascript:(function(){var t=document.body.innerText||document.body.textContent;var w=window.open('','_blank','width=800,height=600');w.document.write('<html><head><title>Job Description Scanner</title></head><body style="font-family:monospace;padding:20px;background:#0F172A;color:#22C55E"><h1>📊 Extracted Text</h1><pre style="white-space:pre-wrap;background:#1E293B;padding:20px;border-radius:8px">'+t.substring(0,5000)+'</pre><p style="color:#64748B">Copy this text and paste into your CV scanner</p></body></html>');w.document.close()})();`;

  const copyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarklet);
    setCopied(true);
    toast.success("¡Bookmarklet copiado! Ahora arrástralo a tu barra de marcadores.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-[#64748B] p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Chrome className="h-8 w-8 text-[#64748B]" />
        <h3 className="text-xl font-black text-[#0F172A]">
          Instalación del Scanner (1 minuto)
        </h3>
      </div>

      <div className="space-y-4">
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
          <h4 className="font-bold text-[#0F172A] mb-2 flex items-center gap-2">
            <span className="bg-[#334155] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
            Copia el bookmarklet
          </h4>
          <div className="bg-white border border-[#CBD5E1] rounded p-3 font-mono text-xs break-all mb-2 max-h-32 overflow-y-auto">
            {bookmarklet}
          </div>
          <Button
            onClick={copyBookmarklet}
            className="w-full bg-[#64748B] text-white"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Bookmarklet
              </>
            )}
          </Button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
            <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
            Crea un marcador
          </h4>
          <ul className="text-sm text-green-800 space-y-1 ml-8">
            <li>• Haz clic derecho en la barra de marcadores</li>
            <li>• Selecciona "Agregar página"</li>
            <li>• Nombre: "Job Scanner"</li>
            <li>• URL: Pega el código copiado</li>
          </ul>
        </div>

        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
          <h4 className="font-bold text-[#0F172A] mb-2 flex items-center gap-2">
            <span className="bg-[#1E293B] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
            Úsalo en cualquier sitio
          </h4>
          <p className="text-sm text-[#0F172A]">
            Ve a LinkedIn, Indeed, o cualquier job posting → Haz clic en el marcador "Job Scanner" → Se extraerá el texto → Pégalo en tu analizador de CV
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800 flex items-center gap-2">
            <span className="text-lg">💡</span>
            <span><strong>Pro tip:</strong> Funciona en CUALQUIER página web. LinkedIn, Indeed, Glassdoor, empresa X...</span>
          </p>
        </div>
      </div>
    </div>
  );
}
