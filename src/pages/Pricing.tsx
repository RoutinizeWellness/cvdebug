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
      description: "See what's broken. Get the diagnosis.",
      price: `${currencyInfo.symbol}0`,
      period: "forever",
      features: [
        "Robot View Preview (blurred)",
        "Global ATS Score",
        "Basic [ERROR] Labels",
        "Seniority Match Preview",
      ],
      buttonText: "Run Free Scan",
      buttonVariant: "outline" as const,
      borderColor: "border-slate-800",
      hoverBorder: "hover:border-slate-600",
      plan: "free",
    },
    {
      name: "24-Hour Pass",
      description: "Everything you need to land an interview this week. No subscriptions. No BS.",
      price: formatPrice("single_scan"),
      period: "24 hours",
      features: [
        "Unlimited CV Scans (24h)",
        "Full Robot X-Ray View",
        "ERROR/WARN Labels + Fixes",
        "Seniority Match Analysis",
        "Keyword Gap Detection",
        "Battle Plan Generator",
        "Bullet Point Rewriter",
      ],
      buttonText: "Get 24h Access",
      buttonVariant: "default" as const,
      borderColor: "border-[#0F172A]/50",
      hoverBorder: "hover:border-[#3B82F6]/50",
      plan: "single_scan",
      highlighted: false,
    },
    {
      name: "7-Day Sprint",
      description: "Debug your CV, land interviews, win offers. One week to ship your career.",
      price: formatPrice("sprint_7day"),
      period: "7 days",
      features: [
        "Unlimited CV Scans (7 days)",
        "Robot View Terminal (dirty console)",
        "Missing Signals Detector",
        "Seniority Match Audit",
        "Industry Selector (FAANG/Deloitte/Finance)",
        "Bullet Tone Elevator",
        "Interview Battle Plan",
        "Export Sanitized CV (ATS-safe)",
        "BONUS: Cover Letter Gen + LinkedIn Optimizer",
      ],
      buttonText: "Start 7-Day Sprint",
      buttonVariant: "premium" as const,
      borderColor: "border-indigo-500/30",
      hoverBorder: "hover:border-indigo-500/50",
      plan: "sprint_7day",
      highlighted: true,
      badge: "RECOMMENDED",
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
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-[#8B5CF6]/20 selection:text-[#6366F1]">
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-20 left-1/3 w-[300px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[80px] pointer-events-none"></div>

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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]">
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
                    ? "-mt-4 lg:-mt-8 border-2 border-[#8B5CF6] shadow-[0_20px_60px_-10px_rgba(139,92,246,0.15)]"
                    : "border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)]"
                }`}
              >
                {tier.highlighted && (
                  <>
                    {/* Glow Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/5 to-[#6366F1]/5 rounded-2xl blur-xl -z-10"></div>
                    {/* Top Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#8B5CF6] rounded-t-xl"></div>
                    {/* Badge */}
                    <div className="absolute top-5 right-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white border-0 shadow-[0_4px_14px_rgba(139,92,246,0.4)]">
                        {tier.badge}
                      </span>
                    </div>
                  </>
                )}

                <div className={`mb-6 ${tier.highlighted ? "mt-2" : ""}`}>
                  <h3
                    className={`${
                      tier.highlighted ? "text-[#0F172A] text-xl" : "text-[#0F172A] text-lg"
                    } font-bold mb-2 flex items-center gap-2`}
                  >
                    {tier.name}
                    {tier.highlighted && <RocketIcon className="h-5 w-5 text-[#8B5CF6]" />}
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
                        ? "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]"
                        : "text-4xl font-bold text-[#0F172A]"
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span className="text-[#64748B] text-sm">/ {tier.period}</span>
                </div>

                <ul className="flex-col gap-4 mb-8 flex flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-sm ${
                        tier.highlighted ? "text-[#475569] font-medium" : "text-[#475569]"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-5 w-5 flex-shrink-0 ${
                          tier.highlighted
                            ? "text-[#8B5CF6]"
                            : tier.plan === "single_scan"
                            ? "text-[#6366F1]"
                            : "text-[#22C55E]"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.buttonVariant === "premium" ? (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold border-0 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_50px_-10px_rgba(139,92,246,0.4)] hover:scale-[1.02] transition-all duration-200"
                  >
                    {tier.buttonText}
                  </Button>
                ) : tier.buttonVariant === "default" ? (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    className="w-full py-3 px-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] hover:border-[#8B5CF6] transition-all"
                  >
                    {tier.buttonText}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    variant="outline"
                    className="w-full py-3 px-4 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] hover:border-[#8B5CF6] transition-all"
                  >
                    {tier.buttonText}
                  </Button>
                )}

                {tier.highlighted && (
                  <p className="mt-4 text-center text-xs text-[#64748B] font-mono">
                    14-day money-back guarantee
                  </p>
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
                className="group rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] open:bg-[#F8FAFC] open:border-[#8B5CF6]/30 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-[#0F172A] hover:text-[#8B5CF6] font-medium select-none">
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
