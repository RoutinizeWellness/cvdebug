import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { Check, Terminal, RocketIcon, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useCurrency } from "@/hooks/use-currency";
import { motion } from "framer-motion";
import { usePresetSEO } from "@/hooks/useIntelligentSEO";

export default function PricingPage() {
  // Intelligent SEO for pricing page
  usePresetSEO('pricing');

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { formatPrice, currencyInfo } = useCurrency();

  const handleGetStarted = (plan?: string) => {
    if (isAuthenticated) {
      navigate(plan ? `/dashboard?plan=${plan}` : "/dashboard");
    } else {
      navigate(plan ? `/auth?plan=${plan}` : "/auth");
    }
  };

  const pricingTiers = [
    {
      name: "FREE Debug",
      tag: "EL GANCHO",
      tagColor: "bg-[#64748B]/10 text-[#64748B]",
      description: "Descubre qué keywords NO ve el robot. Detección de invisibilidad.",
      price: `${currencyInfo.symbol}0`,
      period: "forever",
      features: [
        { text: "Detección de Invisibilidad (2 keywords)", icon: "[ERR]", guaranteed: false },
        { text: "Global ATS Score", icon: "[OK]", guaranteed: false },
        { text: "Vista Robot (bloqueada)", icon: "[ERR]", guaranteed: false },
        { text: "Preview Seniority Match", icon: "[FIX]", guaranteed: false },
      ],
      buttonText: "Escanear Gratis",
      buttonVariant: "outline" as const,
      borderColor: "border-slate-800",
      hoverBorder: "hover:border-slate-600",
      plan: "free",
    },
    {
      name: "Pase 24h",
      tag: "HOT FIX / URGENTE",
      tagColor: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
      description: "Debug Inmediato. Solución para entrevista mañana. Sin suscripciones.",
      price: formatPrice("single_scan"),
      period: "24 horas",
      features: [
        { text: "Scans Ilimitados (24h)", icon: "[OK]", guaranteed: true },
        { text: "Vista X-Ray Robot Completa", icon: "[OK]", guaranteed: true },
        { text: "Etiquetas [ERROR] + [WARN] + Fixes", icon: "[FIX]", guaranteed: true },
        { text: "Análisis Seniority Match", icon: "[OK]", guaranteed: true },
        { text: "Detector Gap de Keywords", icon: "[FIX]", guaranteed: true },
        { text: "Generador Battle Plan", icon: "[OK]", guaranteed: true },
        { text: "Plantilla 100% Legible por ATS", icon: "[OK]", guaranteed: true },
      ],
      buttonText: "Acceso 24h →",
      buttonVariant: "default" as const,
      borderColor: "border-[#0F172A]/50",
      hoverBorder: "hover:border-[#EF4444]/50",
      plan: "single_scan",
      highlighted: false,
      showGuarantee: true,
    },
    {
      name: "Sprint 7 Días",
      tag: "INTENSIVO / RECOMENDADO",
      tagColor: "bg-gradient-to-r from-[#1E293B] to-[#334155] text-white",
      description: "Modo Bestia. Ataque total de 7 días para conseguir trabajo ya.",
      price: formatPrice("sprint_7day"),
      period: "7 días",
      features: [
        { text: "Scans Ilimitados (7 días)", icon: "[OK]", guaranteed: true },
        { text: "Robot View Terminal (consola dirty)", icon: "[OK]", guaranteed: true },
        { text: "Detector Missing Signals", icon: "[FIX]", guaranteed: true },
        { text: "Auditoría Seniority Match", icon: "[OK]", guaranteed: true },
        { text: "Selector Industria (FAANG/Finanzas)", icon: "[OK]", guaranteed: true },
        { text: "Elevador Tono Viñetas (AI Rewrite)", icon: "[FIX]", guaranteed: true },
        { text: "Battle Plan Entrevistas", icon: "[OK]", guaranteed: true },
        { text: "Export CV Sanitizado (ATS-safe)", icon: "[OK]", guaranteed: true },
        { text: "Plantilla 100% Legible Garantizada", icon: "[OK]", guaranteed: true },
        { text: "BONUS: Cover Letter + LinkedIn", icon: "[OK]", guaranteed: true },
      ],
      buttonText: "Empezar Sprint 7 Días →",
      buttonVariant: "premium" as const,
      borderColor: "border-[#64748B]/30",
      hoverBorder: "hover:border-[#64748B]/50",
      plan: "sprint_7day",
      highlighted: true,
      badge: "MEJOR VALOR",
      showGuarantee: true,
    },
  ];

  const faqs = [
    {
      question: "How does CVDebug's CV Debugger work?",
      answer:
        "CVDebug uses ML algorithms to debug your resume just like ATS robots parse it. We find invisible bugs, add technical [ERROR] and [WARN] labels, show Robot X-Ray view, detect Seniority Match issues, and provide a 0-100 compatibility score with specific bug fixes.",
    },
    {
      question: "What's the difference between 24-Hour Pass and 7-Day Sprint?",
      answer:
        `Both give unlimited scans and full access. The 24-Hour Pass (${formatPrice("single_scan")}) is perfect if you have one interview coming up this week and need quick fixes. The 7-Day Sprint (${formatPrice("sprint_7day")}) is RECOMMENDED for job seekers applying to multiple roles - you get priority support, advanced optimization, and a full week to iterate on your CV.`,
    },
    {
      question: "Do I need a subscription?",
      answer:
        'No! Both paid plans are one-time purchases with no recurring charges. Pay once, debug your CV, land interviews. No credit card stored. You can manage everything from your Mission Control dashboard.',
    },
    {
      question: "What file formats do you support?",
      answer:
        'We support PDF, DOCX (Word), and TXT formats. We recommend PDF for best ATS compatibility, as it preserves formatting across all systems.',
    },
    {
      question: "How accurate is the ATS score?",
      answer:
        "CVDebug's ML algorithms are trained on thousands of real resumes and ATS parsing patterns. Our scoring is EXTREMELY strict and realistic (inspired by Jobscan) - most resumes score 45-75 to show room for improvement. We use penalties for missing elements and low caps for free users (78 max) to give you honest feedback, not inflated scores.",
    },
    {
      question: "Is my resume data kept private?",
      answer:
        "Absolutely. We take privacy seriously. Your resume is encrypted, never shared with third parties, and you can delete it anytime from your dashboard. We're GDPR and CCPA compliant.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-[#1E293B]/20 selection:text-[#334155]">
      <style>{`
        body {
          background-color: #F8FAFC;
        }
      `}</style>

      <NewNavbar />

      <main className="flex-grow flex flex-col items-center pt-16">
        {/* Hero Section */}
        <section className="relative w-full max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col items-center text-center">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#1E293B]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-20 left-1/3 w-[300px] h-[300px] bg-[#334155]/5 rounded-full blur-[80px] pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] backdrop-blur-sm mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span className="text-xs font-mono text-[#475569]">SYSTEM_STATUS: ONLINE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative text-4xl md:text-6xl font-black tracking-tight text-[#0F172A] mb-6 leading-tight max-w-4xl"
          >
            Debug Your CV. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E293B] to-[#334155]">
              Stop Getting Ghosted.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative text-[#475569] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Find invisible resume bugs that cost you interviews. Get [ERROR] labels, Robot X-Ray view,
            and Seniority Match analysis. Debug your CV in 10 seconds.
          </motion.p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="w-full max-w-7xl mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative flex flex-col rounded-xl bg-[#FFFFFF] p-6 md:p-8 transition-all duration-300 ${
                  tier.highlighted
                    ? "-mt-4 lg:-mt-8 border-2 border-[#1E293B] shadow-[0_20px_60px_-10px_rgba(139,92,246,0.15)]"
                    : "border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)]"
                }`}
              >
                {/* Tag (para todos los tiers) */}
                {tier.tag && (
                  <div className="absolute top-5 right-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded text-[10px] font-bold font-mono ${tier.tagColor} shadow-sm`}>
                      {tier.tag}
                    </span>
                  </div>
                )}

                {tier.highlighted && (
                  <>
                    {/* Glow Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B]/5 to-[#334155]/5 rounded-2xl blur-xl -z-10"></div>
                    {/* Top Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] rounded-t-xl"></div>
                  </>
                )}

                <div className={`mb-6 ${tier.highlighted || tier.tag ? "mt-8" : "mt-2"}`}>
                  <h3
                    className={`${
                      tier.highlighted ? "text-[#0F172A] text-xl" : "text-[#0F172A] text-lg"
                    } font-bold mb-2 flex items-center gap-2`}
                  >
                    {tier.name}
                    {tier.highlighted && <RocketIcon className="h-5 w-5 text-[#1E293B]" />}
                  </h3>
                  <p
                    className={`text-sm ${
                      tier.highlighted ? "text-[#475569]" : "text-[#64748B]"
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                <div className="mb-8 font-mono">
                  <span
                    className={`${
                      tier.highlighted
                        ? "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1E293B] to-[#334155]"
                        : "text-4xl font-bold text-[#0F172A]"
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span className="text-[#64748B] text-sm">/ {tier.period}</span>
                </div>

                <ul className="flex-col gap-3 mb-8 flex flex-1">
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 text-sm ${
                        tier.highlighted ? "text-[#475569] font-medium" : "text-[#475569]"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          feature.icon === "[OK]"
                            ? "bg-[#22C55E]/10 text-[#22C55E]"
                            : feature.icon === "[ERR]"
                            ? "bg-[#EF4444]/10 text-[#EF4444]"
                            : "bg-[#F59E0B]/10 text-[#F59E0B]"
                        }`}
                      >
                        {feature.icon}
                      </span>
                      <span className="flex-1">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                {/* Guarantee Badge */}
                {tier.showGuarantee && (
                  <div className="mb-4 px-3 py-2 bg-[#22C55E]/5 border border-[#22C55E]/20 rounded text-center">
                    <span className="text-xs font-mono font-bold text-[#22C55E]">
                      ✓ PLANTILLA 100% LEGIBLE GARANTIZADA
                    </span>
                  </div>
                )}

                {tier.buttonVariant === "premium" ? (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#1E293B] to-[#334155] text-white font-bold border-0 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_50px_-10px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-all duration-200"
                  >
                    {tier.buttonText}
                  </Button>
                ) : tier.buttonVariant === "default" ? (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    className="w-full py-3 px-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] hover:border-[#1E293B] transition-all"
                  >
                    {tier.buttonText}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    variant="outline"
                    className="w-full py-3 px-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] hover:border-[#1E293B] transition-all"
                  >
                    {tier.buttonText}
                  </Button>
                )}

              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-3xl mx-auto px-4 pb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-[#0F172A] mb-8 text-center"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] open:bg-[#F8FAFC] open:border-[#1E293B]/30 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-[#0F172A] hover:text-[#1E293B] font-medium select-none">
                  <span>{faq.question}</span>
                  <svg
                    className="h-5 w-5 text-[#64748B] transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-4 pt-0 text-[#475569] text-sm leading-relaxed border-t border-transparent group-open:border-[#E2E8F0] group-open:pt-4">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
