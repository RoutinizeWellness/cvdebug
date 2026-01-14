import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { Check, Terminal, RocketIcon, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = (plan?: string) => {
    if (isAuthenticated) {
      navigate(plan ? `/dashboard?plan=${plan}` : "/dashboard");
    } else {
      navigate(plan ? `/auth?plan=${plan}` : "/auth");
    }
  };

  const pricingTiers = [
    {
      name: "The Reality Check",
      description: "Basic syntax check for your document.",
      price: "$0",
      period: "forever",
      features: [
        "Robot View Preview",
        "Global ATS Score",
        "Basic Error Logs",
      ],
      buttonText: "Run Scan",
      buttonVariant: "outline" as const,
      borderColor: "border-slate-800",
      hoverBorder: "hover:border-slate-600",
      plan: "free",
    },
    {
      name: "The Instant Fix",
      description: "One-time optimization for a specific job.",
      price: "$4.99",
      period: "scan",
      features: [
        "Everything in Free",
        "Full Keyword Report",
        "1-Click Auto-Fixes",
        "Optimized PDF Export",
      ],
      buttonText: "Buy One Scan",
      buttonVariant: "default" as const,
      borderColor: "border-blue-900/50",
      hoverBorder: "hover:border-[#3B82F6]/50",
      plan: "single_scan",
      highlighted: false,
    },
    {
      name: "The Command Center",
      description: "Full suite access for serious job hunters.",
      price: "$19.99",
      period: "month",
      features: [
        "Unlimited ATS Scans",
        "Job Tracker Pro Dashboard",
        "AI Cover Letter Generator",
        "Priority Cloud Processing",
        "LinkedIn Profile Audit",
      ],
      buttonText: "Start Sprint",
      buttonVariant: "premium" as const,
      borderColor: "border-indigo-500/30",
      hoverBorder: "hover:border-indigo-500/50",
      plan: "interview_sprint",
      highlighted: true,
      badge: "BEST VALUE",
    },
  ];

  const faqs = [
    {
      question: "How does the ATS scoring algorithm work?",
      answer:
        "We reverse-engineered the top 5 ATS platforms used by Fortune 500 companies. Our parser checks for parseability, keyword density, and formatting errors that typically cause silent rejections.",
    },
    {
      question: "Can I cancel the Sprint plan anytime?",
      answer:
        'Yes. The Interview Sprint is billed monthly. You can cancel directly from your "Command Center" dashboard with one click. No questions asked.',
    },
    {
      question: "What file formats do you support?",
      answer:
        'We currently support PDF and DOCX files. For the best results with our "Instant Fix" tool, we recommend uploading a DOCX file so we can directly inject the optimized keywords.',
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use bank-level AES-256 encryption. Your resume data is never sold to third parties and is only used to generate your report. You can delete your data permanently at any time.",
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
            Debug Your Resume. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#6366F1]">
              Compile Your Career.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative text-[#475569] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Stop getting rejected by silent algorithms. Optimize your CV syntax, keywords, and
            formatting to pass every ATS check.
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
