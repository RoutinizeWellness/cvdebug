import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, TrendingUp, Briefcase, DollarSign } from "lucide-react";
import { useEffect } from "react";

export default function FinanceInternshipATSOptimizer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title =
      "Finance Internship ATS Optimizer | Investment Banking Resume Scanner | CVDebug";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Optimize your finance internship resume for Goldman Sachs, JP Morgan, and other IB firms. See what ATS bots see and fix critical errors in your finance resume in 10 seconds."
      );
    }
  }, []);

  const financeFeatures = [
    {
      icon: TrendingUp,
      title: "IB Keywords Validator",
      description:
        "Scans for investment banking terms like DCF, LBO, M&A, financial modeling, and valuation that top-tier ATS systems prioritize.",
    },
    {
      icon: Briefcase,
      title: "Internship Format Checker",
      description:
        "Ensures your experience, coursework, and deal exposure are formatted to pass through Workday and SuccessFactors used by major banks.",
    },
    {
      icon: DollarSign,
      title: "Finance Metrics Optimizer",
      description:
        "Validates that your quantified achievements (deal sizes, portfolio returns, cost savings) parse correctly in ATS systems.",
    },
  ];

  const testimonials = [
    {
      name: "David C.",
      role: "Goldman Sachs Intern",
      text: "My GPA and finance coursework were in a formatted table the ATS couldn't read. CVDebug caught it instantly. Got interviews at 4 bulge brackets after fixing.",
    },
    {
      name: "Priya S.",
      role: "JP Morgan Analyst",
      text: "I mentioned 'financial analysis' but ATS wanted 'DCF modeling' and 'M&A valuation'. The keyword sniper showed exactly what I needed to add.",
    },
  ];

  const targetFirms = [
    "Goldman Sachs",
    "JP Morgan",
    "Morgan Stanley",
    "Citi",
    "Bank of America",
    "Credit Suisse",
  ];

  return (
    <div className="dark min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30 selection:text-white antialiased">
      <style>{`
        body {
          background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
        }
      `}</style>

      <NewNavbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1 }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ffd700] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></motion.div>
          </div>

          <div className="mx-auto max-w-4xl py-12 sm:py-20 lg:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex justify-center"
            >
              <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium leading-6 text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-sm">
                <Briefcase className="inline h-4 w-4 mr-1" /> Used by 800+ Finance Students
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              ATS Optimizer for{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-primary bg-clip-text text-transparent">
                Finance Internships
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto"
            >
              Goldman Sachs, JP Morgan, and Morgan Stanley reject 85% of applications before human
              review. See what their ATS bots see and fix critical parsing errors in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="glow-button relative flex h-12 min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-yellow-500 to-primary px-8 text-base font-bold text-white transition-all hover:bg-blue-600"
              >
                Optimize My Resume (Free)
              </Button>
            </motion.div>

            <p className="mt-4 text-xs text-slate-500">
              No signup • See results in 10 seconds • Used at Wharton, Harvard, MIT
            </p>
          </div>
        </section>

        {/* Target Firms */}
        <section className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-slate-500 mb-6">
              Optimized for ATS systems at:
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {targetFirms.map((firm, index) => (
                <motion.span
                  key={firm}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-300 hover:border-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  {firm}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold text-white">91%</div>
                <div className="mt-2 text-sm text-slate-400">
                  Average ATS score after optimization
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">3.8x</div>
                <div className="mt-2 text-sm text-slate-400">
                  More superday invitations
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">85%</div>
                <div className="mt-2 text-sm text-slate-400">
                  Of IB apps rejected by ATS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative" id="features">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built for Investment Banking Applications
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Our scanner understands finance terminology, deal exposure formatting, and
                investment banking ATS requirements.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {financeFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card group relative overflow-hidden rounded-2xl p-8 hover:bg-slate-800/50 transition-colors duration-300"
                >
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 rounded-full bg-yellow-500/10 blur-2xl transition-all group-hover:scale-110"></div>
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold leading-8 text-white">{feature.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              Success Stories from Finance Students
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card rounded-xl p-6"
                >
                  <p className="text-slate-300 mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative isolate mt-16 px-6 py-24 sm:mt-24 sm:px-16 lg:px-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.900),#020617)] opacity-80"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card mx-auto max-w-4xl rounded-3xl p-8 text-center sm:p-16 relative overflow-hidden"
          >
            <div className="absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 bg-yellow-500/20 blur-[100px]"></div>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Land Your Dream Internship?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join 800+ finance students who optimized their resumes and secured offers at Goldman,
              JP Morgan, and other elite firms.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="glow-button w-full max-w-md rounded-xl bg-gradient-to-r from-yellow-500 to-primary px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:from-yellow-600 hover:to-indigo-500 sm:w-auto"
              >
                Optimize My Resume (Free)
              </Button>
              <p className="text-xs text-slate-500">
                No credit card • Instant results • Confidential
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
