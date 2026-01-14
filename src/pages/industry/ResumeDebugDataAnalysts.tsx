import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Database, BarChart3, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function ResumeDebugDataAnalysts() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Resume Debug for Data Analysts | ATS Scanner | CVDebug";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Debug your data analyst resume for ATS errors. See what hiring bots see with Robot View. Optimize SQL, Python, and analytics keywords to pass ATS scans in 10 seconds."
      );
    }
  }, []);

  const dataAnalystFeatures = [
    {
      icon: Database,
      title: "Technical Skills Parser",
      description:
        "Detects and validates SQL, Python, R, Tableau, Power BI, and other analytics tools to ensure they're properly indexed by ATS systems.",
    },
    {
      icon: BarChart3,
      title: "Metrics Impact Analyzer",
      description:
        "Ensures your quantified achievements (revenue impact, efficiency gains, data volumes) are formatted correctly for automated parsing.",
    },
    {
      icon: TrendingUp,
      title: "Tech Stack Keyword Matcher",
      description:
        "Compares your resume against job descriptions to identify missing data science keywords that ATS systems prioritize.",
    },
  ];

  const testimonials = [
    {
      name: "Alex K.",
      role: "Data Analyst at Meta",
      text: "My SQL and Python skills were buried in a sidebar. CVDebug's Robot View showed me the ATS was reading them as gibberish. Fixed it and got 5 interviews in 2 weeks.",
    },
    {
      name: "Maria T.",
      role: "Senior Data Analyst",
      text: "I listed 'data visualization' but the ATS was looking for 'Tableau' and 'Power BI'. The keyword sniper caught exactly what I was missing.",
    },
  ];

  const techStack = [
    "Python",
    "SQL",
    "R",
    "Tableau",
    "Power BI",
    "Excel",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-[#3B82F6]/30 selection:text-[#0F172A] antialiased bg-[#F8FAFC]">
      <style>{`
        body {
          background: #F8FAFC;
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
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
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
              <div className="rounded-full bg-[#3B82F6]/10 px-3 py-1 text-sm font-medium leading-6 text-[#3B82F6] ring-1 ring-inset ring-[#3B82F6]/20">
                <Database className="inline h-4 w-4 mr-1" /> Trusted by 1,200+ Data Analysts
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black tracking-tight text-[#0F172A] sm:text-6xl lg:text-7xl"
            >
              Resume Debug Tool for{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                Data Analysts
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-[#475569] max-w-2xl mx-auto"
            >
              Your SQL and Python skills are invisible to 70% of ATS systems. Debug your resume
              like you debug code - see exactly what breaks in the parsing pipeline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="glow-button relative flex h-12 min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] px-8 text-base font-bold text-[#FFFFFF] transition-all hover:bg-[#3B82F6]"
              >
                Debug My Resume (Free)
              </Button>
            </motion.div>

            <p className="mt-4 text-xs text-[#64748B] font-mono">
              $ ./scan_resume.sh --format=json --verbose
            </p>
          </div>
        </section>

        {/* Tech Stack Cloud */}
        <section className="border-y border-[#E2E8F0] bg-[#FFFFFF] py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-[#64748B] mb-6">
              Optimized for ATS systems scanning these skills:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-sm font-mono text-[#475569] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
                >
                  {tech}
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
                <div className="text-4xl font-bold text-[#0F172A] font-mono">92%</div>
                <div className="mt-2 text-sm text-[#475569]">
                  Average ATS score after optimization
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0F172A] font-mono">4.1x</div>
                <div className="mt-2 text-sm text-[#475569]">More callbacks from recruiters</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0F172A] font-mono">&lt;10s</div>
                <div className="mt-2 text-sm text-[#475569]">To identify critical errors</div>
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
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
                Built for Technical Resumes
              </h2>
              <p className="mt-4 text-lg text-[#475569]">
                Our engine understands data science terminology, metrics formatting, and analytics
                ATS requirements.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {dataAnalystFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] group relative overflow-hidden rounded-2xl p-8 hover:bg-[#FFFFFF]/50 transition-colors duration-300"
                >
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 rounded-full bg-[#3B82F6]/10 blur-2xl transition-all group-hover:scale-110"></div>
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] ring-1 ring-inset ring-[#3B82F6]/20">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold leading-8 text-[#0F172A]">{feature.title}</h3>
                  <p className="mt-2 text-base leading-7 text-[#475569]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-12">
              Success Stories from Data Analysts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-6"
                >
                  <p className="text-[#475569] mb-4 font-mono text-sm">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                      <Database className="h-5 w-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0F172A]">{testimonial.name}</div>
                      <div className="text-sm text-[#475569]">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative isolate mt-16 px-6 py-24 sm:mt-24 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] mx-auto max-w-4xl rounded-3xl p-8 text-center sm:p-16 relative overflow-hidden"
          >
            <div className="absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 bg-[#3B82F6]/30 blur-[100px]"></div>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              Ready to Pass the ATS Filter?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#475569]">
              Join 1,200+ data analysts who debugged their resumes and landed interviews at top
              tech companies.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="glow-button w-full max-w-md rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] px-8 py-4 text-lg font-bold text-[#FFFFFF] shadow-2xl transition-all hover:scale-105 hover:from-[#3B82F6] hover:to-[#3B82F6] sm:w-auto"
              >
                Run ATS Debug (Free)
              </Button>
              <p className="text-xs text-[#64748B] font-mono">
                // No registration • Instant analysis • GDPR compliant
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
