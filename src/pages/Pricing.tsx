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
      hoverBorder: "hover:border-blue-500/50",
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
    <div className="dark min-h-screen flex flex-col overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      <style>{`
        body {
          background-color: #0F172A;
        }
      `}</style>

      <NewNavbar />

      <main className="flex-grow flex flex-col items-center pt-16">
        {/* Hero Section */}
        <section className="relative w-full max-w-7xl mx-auto px-4 pt-20 pb-12 flex flex-col items-center text-center">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute top-20 left-1/3 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-300">SYSTEM_STATUS: ONLINE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight max-w-4xl"
          >
            Debug Your Resume. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              Compile Your Career.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
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
                className={`group relative flex flex-col rounded-xl border ${tier.borderColor} bg-slate-800 p-6 md:p-8 ${tier.hoverBorder} transition-all duration-300 ${
                  tier.highlighted
                    ? "-mt-4 lg:-mt-8 shadow-2xl shadow-indigo-500/10 ring-1 ring-white/10"
                    : ""
                }`}
              >
                {tier.highlighted && (
                  <>
                    {/* Glow Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-blue-500/5 rounded-2xl blur-xl -z-10"></div>
                    {/* Top Gradient Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 rounded-t-xl"></div>
                    {/* Badge */}
                    <div className="absolute top-5 right-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                        {tier.badge}
                      </span>
                    </div>
                  </>
                )}

                <div className={`mb-6 ${tier.highlighted ? "mt-2" : ""}`}>
                  <h3
                    className={`${
                      tier.highlighted ? "text-white text-xl" : "text-white text-lg"
                    } font-bold mb-2 flex items-center gap-2`}
                  >
                    {tier.name}
                    {tier.highlighted && <RocketIcon className="h-5 w-5 text-indigo-400" />}
                  </h3>
                  <p
                    className={`text-sm ${
                      tier.highlighted ? "text-indigo-200/70" : "text-slate-400"
                    }`}
                  >
                    {tier.description}
                  </p>
                </div>

                <div className="mb-8 font-mono">
                  <span
                    className={`${
                      tier.highlighted
                        ? "text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300"
                        : "text-4xl font-bold text-white"
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span className="text-slate-500 text-sm">/ {tier.period}</span>
                </div>

                <ul className="flex-col gap-4 mb-8 flex flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-sm ${
                        tier.highlighted ? "text-white font-medium" : "text-slate-300"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-5 w-5 flex-shrink-0 ${
                          tier.highlighted
                            ? "text-indigo-400"
                            : tier.plan === "single_scan"
                            ? "text-blue-500"
                            : "text-slate-500"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.buttonVariant === "premium" ? (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200"
                  >
                    {tier.buttonText}
                  </Button>
                ) : tier.buttonVariant === "default" ? (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    className="w-full py-3 px-4 rounded-lg bg-transparent border border-blue-600/50 text-blue-100 font-medium hover:bg-blue-600/10 hover:border-blue-500 transition-all"
                  >
                    {tier.buttonText}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleGetStarted(tier.plan)}
                    variant="outline"
                    className="w-full py-3 px-4 rounded-lg bg-transparent border border-slate-600 text-white font-medium hover:bg-slate-700 hover:border-slate-500 transition-all"
                  >
                    {tier.buttonText}
                  </Button>
                )}

                {tier.highlighted && (
                  <p className="mt-4 text-center text-xs text-slate-500 font-mono">
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
            className="text-2xl font-bold text-white mb-8 text-center"
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
                className="group rounded-lg border border-slate-800 bg-slate-800/50 open:bg-slate-800 open:border-slate-700 transition-all duration-200"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-slate-200 hover:text-white font-medium select-none">
                  <span>{faq.question}</span>
                  <svg
                    className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180"
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
                <div className="px-6 pb-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-transparent group-open:border-slate-700/50 group-open:pt-4">
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
