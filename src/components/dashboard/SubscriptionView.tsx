import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/use-currency";

const apiAny = api as any;

export function SubscriptionView() {
  const user = useQuery(apiAny.users.currentUser);
  const [timeRemaining, setTimeRemaining] = useState({ days: 4, hours: 12, minutes: 30 });
  const { formatPrice } = useCurrency();

  // Calculate sprint countdown
  useEffect(() => {
    const updateCountdown = () => {
      if (user?.sprintExpiresAt) {
        const now = Date.now();
        const diff = user.sprintExpiresAt - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeRemaining({ days, hours, minutes });
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [user?.sprintExpiresAt]);

  const currentPlan = user?.subscriptionTier || "free";
  const isFreeTier = currentPlan === "free";
  const isSingleDebugFix = currentPlan === "single_debug_fix";
  const isSingleScan = currentPlan === "single_scan";
  const isInterviewSprint = currentPlan === "interview_sprint";
  const isIterationPass = currentPlan === "iteration_pass";

  // Calculate remaining credits
  const currentCredits = user?.credits || 0;

  const sprintExpiresAt = user?.sprintExpiresAt || 0;
  const daysUntilReset = sprintExpiresAt > Date.now()
    ? Math.ceil((sprintExpiresAt - Date.now()) / (1000 * 60 * 60 * 24))
    : 15;

  return (
    <div className="flex-1 overflow-y-auto bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-fixed relative">
      <div className="absolute inset-0 bg-[#F8FAFC]/95 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Breadcrumbs & Actions */}
        <header className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => window.history.back()}
              className="text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Ajustes
            </button>
            <span className="material-symbols-outlined text-[#475569] text-[16px]">chevron_right</span>
            <span className="text-[#0F172A] font-medium">Suscripción</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        <div className="px-8 pb-12 flex flex-col gap-10 max-w-7xl mx-auto w-full">
          {/* Page Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Gestión de Suscripción</h2>
            <p className="text-[#64748B] max-w-2xl text-lg">
              Administra tu plan actual, detalles de facturación, y desbloquea sprints premium de preparación para entrevistas.
            </p>
          </motion.div>

          {/* Current Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFFFFF] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group border-2 border-[#E2E8F0] hover:border-[#1E293B]/30 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E293B]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#64748B]/5 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none"></div>

            <div className="flex flex-col gap-5 relative z-10 max-w-xl flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] px-3 py-1.5 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  <span className="text-xs font-bold uppercase tracking-wide">Plan Actual</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                  </span>
                  <span className="text-[#22C55E] text-xs font-bold uppercase tracking-wide">Activo</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-2 flex items-center gap-2 flex-wrap">
                  {isFreeTier && (
                    <>
                      <span>Vista Previa Gratis</span>
                      <span className="material-symbols-outlined text-[#64748B] text-[28px]">preview</span>
                    </>
                  )}
                  {isSingleDebugFix && (
                    <>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#D97706]">Single Debug Fix</span>
                      <span className="material-symbols-outlined text-[#F59E0B] text-[28px]">build</span>
                    </>
                  )}
                  {isSingleScan && (
                    <>
                      <span>Escaneo Único</span>
                      <span className="material-symbols-outlined text-[#1E293B] text-[28px]">bolt</span>
                    </>
                  )}
                  {isInterviewSprint && (
                    <>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E293B] to-[#64748B]">Sprint de Entrevistas</span>
                      <span className="material-symbols-outlined text-[#1E293B] text-[28px]">rocket_launch</span>
                    </>
                  )}
                  {isIterationPass && (
                    <>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E293B] to-[#64748B]">Sprint de 7 Días</span>
                      <span className="material-symbols-outlined text-[#1E293B] text-[28px]">all_inclusive</span>
                    </>
                  )}
                </h3>
                <p className="text-[#475569] text-base leading-relaxed">
                  {isFreeTier && "Escaneo básico gratuito para ver dónde estás. Mejora para desbloquear análisis completo y funciones premium."}
                  {isSingleDebugFix && (
                    <>
                      Tienes <span className="text-[#F59E0B] font-bold">1 escaneo profundo completo</span> con 1 reescritura IA incluida. Perfecto para una corrección rápida del CV.
                    </>
                  )}
                  {isSingleScan && (
                    <>
                      Tienes <span className="text-[#1E293B] font-bold">{currentCredits} crédito de escaneo</span> restante. Incluye re-escaneos ilimitados por 24 horas.
                    </>
                  )}
                  {isInterviewSprint && (
                    <>
                      Tienes <span className="text-[#1E293B] font-bold">escaneos ilimitados</span> por{" "}
                      <span className="text-[#0F172A] font-bold bg-[#1E293B]/10 px-2 py-0.5 rounded">{daysUntilReset} días</span>. Expira el{" "}
                      <span className="text-[#0F172A] font-bold">{new Date(sprintExpiresAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
                    </>
                  )}
                  {isIterationPass && (
                    <>
                      Tienes <span className="text-[#1E293B] font-bold">escaneos ilimitados</span> por{" "}
                      <span className="text-[#0F172A] font-bold bg-[#1E293B]/10 px-2 py-0.5 rounded">{daysUntilReset} días</span>. Expira el{" "}
                      <span className="text-[#0F172A] font-bold">{new Date(sprintExpiresAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => toast.info("Función de historial de facturación próximamente")}
                className="text-[#475569] hover:text-[#0F172A] text-sm font-semibold px-4 py-2.5 transition-colors hover:bg-[#F8FAFC] rounded-lg border border-transparent hover:border-[#E2E8F0] text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Historial de Facturación
                </span>
              </button>
              {!isFreeTier && (
                <button className="bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#EF4444]/50 text-[#475569] hover:text-[#EF4444] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    Cancelar Plan
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Pricing Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#0F172A]">Opciones de Mejora</h3>
              <span className="text-xs text-[#64748B] font-medium">Paga una vez, úsalo por siempre</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Single Debug Fix */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#FFFFFF] rounded-2xl p-6 md:p-7 flex flex-col h-full border-2 border-[#F59E0B]/40 hover:border-[#F59E0B] hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)] transition-all duration-300 group relative overflow-hidden"
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 group-hover:border-[#F59E0B] transition-colors">
                      <span className="material-symbols-outlined text-[#F59E0B] text-[24px]">build</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[#0F172A]">Single Debug Fix</h4>
                      <p className="text-[#F59E0B] text-xs mt-0.5 font-medium uppercase tracking-wide">One-time fix</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-[#0F172A]">€5.99</span>
                    <span className="text-[#64748B] text-base">/once</span>
                  </div>

                  <div className="space-y-3.5 mb-8 flex-1">
                    {[
                      { icon: "verified", text: "1 Escaneo Profundo" },
                      { icon: "terminal", text: "Vista Robot Terminal" },
                      { icon: "key", text: "Keywords Faltantes Completo" },
                      { icon: "auto_awesome", text: "1 Reescritura IA Completa" },
                      { icon: "integration_instructions", text: "Auto-Inyección Keywords" },
                      { icon: "download", text: "Exportar CV ATS-seguro" }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-1 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                          <span className="material-symbols-outlined text-[#F59E0B] text-[16px]">{feature.icon}</span>
                        </div>
                        <p className="text-sm text-[#475569] font-medium leading-relaxed">{feature.text}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={isSingleDebugFix}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#FFFFFF] font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg text-base"
                  >
                    {isSingleDebugFix ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Plan Actual
                      </span>
                    ) : (
                      "Arreglar Mi CV"
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Single Scan */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-[#FFFFFF] rounded-2xl p-6 md:p-7 flex flex-col h-full border border-[#E2E8F0] hover:border-[#1E293B]/50 hover:shadow-[0_10px_40px_-10px_rgba(100,116,139,0.3)] transition-all duration-300 group relative overflow-hidden"
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E293B]/5 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] group-hover:border-[#1E293B]/30 transition-colors">
                      <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#1E293B] text-[24px] transition-colors">bolt</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-[#0F172A]">Escaneo Único</h4>
                      <p className="text-[#64748B] text-xs mt-0.5 font-medium uppercase tracking-wide">Pago único</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-[#0F172A]">€9.99</span>
                    <span className="text-[#64748B] text-base">/once</span>
                  </div>

                  <div className="space-y-3.5 mb-8 flex-1">
                    {[
                      { icon: "verified", text: "Análisis ATS Completo" },
                      { icon: "key", text: "Reporte Completo de Keywords" },
                      { icon: "auto_fix_high", text: "Auditoría de Formato + Correcciones" },
                      { icon: "autorenew", text: "Re-escaneos Ilimitados (24h)" },
                      { icon: "shield_with_heart", text: "Sanitización de PDF" }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-1 rounded-lg bg-[#1E293B]/10 border border-[#1E293B]/20">
                          <span className="material-symbols-outlined text-[#1E293B] text-[16px]">{feature.icon}</span>
                        </div>
                        <p className="text-sm text-[#475569] font-medium leading-relaxed">{feature.text}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={isSingleScan}
                    className="w-full py-3.5 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] font-bold hover:bg-[#FFFFFF] hover:border-[#1E293B]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg text-base"
                  >
                    {isSingleScan ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Plan Actual
                      </span>
                    ) : (
                      "Obtener Escaneo Único"
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Interview Sprint / 7-Day Sprint (Highlighted) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative rounded-2xl p-6 md:p-7 flex flex-col h-full border-2 border-[#F3E8FF] bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F3E8FF]/30 shadow-[0_10px_40px_-10px_rgba(100,116,139,0.3)] transform hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(100,116,139,0.5)] transition-all duration-300 group overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B]/5 via-transparent to-[#64748B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Best Value Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] text-[#FFFFFF] text-xs font-black px-5 py-1.5 rounded-full shadow-xl shadow-[#1E293B]/40 border-2 border-[#1E293B]/30 animate-pulse">
                    <span className="flex items-center gap-1.5">
                      MEJOR VALOR - AHORRA 60%
                    </span>
                  </div>
                </div>

                <div className="relative z-10 pt-2">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-[#1E293B]/20 border border-[#1E293B]/40 group-hover:shadow-lg group-hover:shadow-[#1E293B]/20 transition-all">
                      <span className="material-symbols-outlined text-[#1E293B] text-[24px]">rocket_launch</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                        Sprint de Entrevistas
                      </h4>
                      <p className="text-[#1E293B] text-xs mt-0.5 font-bold uppercase tracking-wide">7 Días Ilimitados</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1E293B] to-[#64748B]">{formatPrice('sprint_7day')}</span>
                    <span className="text-[#64748B] line-through text-xl font-bold">{formatPrice('interview_sprint')}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="px-2.5 py-1 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/30">
                      <p className="text-[#22C55E] text-xs font-bold">60% OFF</p>
                    </div>
                    <p className="text-[#64748B] text-xs italic">Usado por más de 1,200 candidatos</p>
                  </div>

                  <div className="space-y-3.5 mb-8 flex-1">
                    {[
                      { icon: "all_inclusive", text: "Escaneos Ilimitados (7 Días)" },
                      { icon: "psychology", text: "Sugerencias de Keywords IA" },
                      { icon: "description", text: "Generador de Cartas de Presentación" },
                      { icon: "work", text: "Optimizador de LinkedIn" },
                      { icon: "support_agent", text: "Soporte Prioritario" }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-1 rounded-lg bg-[#1E293B]/20 border border-[#1E293B]/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                          <span className="material-symbols-outlined text-[#1E293B] text-[16px]">{feature.icon}</span>
                        </div>
                        <p className="text-sm text-[#0F172A] font-semibold leading-relaxed">{feature.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Social Proof */}
                  <div className="mb-6 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-6 w-6 rounded-full bg-gradient-to-br from-[#1E293B] to-[#64748B] border-2 border-[#FFFFFF]"></div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#1E293B]">1,200+ Casos de Éxito</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] leading-tight">
                      "Conseguí entrevistas en <span className="text-[#0F172A] font-bold">Google</span> y <span className="text-[#0F172A] font-bold">Netflix</span> en una semana"
                    </p>
                  </div>

                  <button
                    disabled={isInterviewSprint || isIterationPass}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#1E293B] to-[#334155] hover:from-[#1E293B]/90 hover:to-[#334155]/90 text-[#FFFFFF] font-black shadow-[0_10px_40px_-10px_rgba(100,116,139,0.5)] hover:shadow-[0_10px_40px_-10px_rgba(100,116,139,0.7)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {(isInterviewSprint || isIterationPass) ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Plan Actual
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Iniciar Sprint de 7 Días
                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* FAQ or Trust Section Footer */}
          <div className="mt-8 border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row justify-between items-center text-[#64748B] text-sm">
            <p>© 2026 CVDebug Inc. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a className="hover:text-[#475569] transition-colors" href="/privacy">
                Política de Privacidad
              </a>
              <a className="hover:text-[#475569] transition-colors" href="/terms">
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid #E2E8F0;
        }
      `}</style>
    </div>
  );
}
