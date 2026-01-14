import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Code2, Cpu, Zap } from "lucide-react";
import { useEffect } from "react";
import { updatePageSEO, techPageSEO, generateHowToSchema, generateServiceSchema } from "@/lib/seo";

export default function SoftwareEngineerKeywordSniper() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Dynamic SEO optimization for software engineer page
    updatePageSEO({
      title: techPageSEO.software_engineer.title,
      description: techPageSEO.software_engineer.description,
      keywords: techPageSEO.software_engineer.keywords,
      canonical: 'https://cvdebug.com/software-engineer-keyword-sniper',
      ogImage: 'https://cvdebug.com/og-tech.jpg',
      structuredData: {
        type: 'HowTo',
        data: generateHowToSchema('Software Engineer', 'Technology'),
      },
    });

    // Add Service Schema for software engineering optimization
    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.id = 'service-schema-swe';
    serviceScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      ...generateServiceSchema(
        'Software Engineer Resume ATS Optimization',
        'Free ATS resume scanner built specifically for software engineers. Optimize SWE resumes for FAANG and tech company ATS systems.',
        'Software Engineers, Developers, Tech Professionals'
      ),
    });
    document.head.appendChild(serviceScript);

    return () => {
      const existingScript = document.getElementById('service-schema-swe');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const engineerFeatures = [
    {
      icon: Code2,
      title: "Tech Stack Keyword Sniper",
      description:
        "Identifies missing programming languages, frameworks, and tools that ATS systems prioritize: React, Node.js, Python, AWS, Kubernetes, etc.",
    },
    {
      icon: Cpu,
      title: "FAANG ATS Compatibility",
      description:
        "Tested against ATS platforms used by Google, Meta, Amazon, Apple, and Netflix to ensure your resume parses correctly through their filters.",
    },
    {
      icon: Zap,
      title: "System Design Validator",
      description:
        "Ensures your architecture experience (microservices, distributed systems, scalability) is formatted for automated parsing.",
    },
  ];

  const testimonials = [
    {
      name: "Kevin H.",
      role: "Software Engineer at Google",
      text: "My GitHub and side projects were in a custom section the ATS couldn't parse. CVDebug's Robot View exposed the issue. Fixed it and landed interviews at 3 FAANG companies.",
    },
    {
      name: "Lisa W.",
      role: "Senior SWE at Meta",
      text: "I listed 'frontend development' but ATS wanted 'React', 'TypeScript', 'Next.js'. The keyword sniper showed exactly what keywords I was missing for senior roles.",
    },
  ];

  const techKeywords = [
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Kubernetes",
    "Docker",
    "TypeScript",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "CI/CD",
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
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#00ff88] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
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
              <div className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-sm font-medium leading-6 text-[#22C55E] ring-1 ring-inset ring-green-500/20">
                <Code2 className="inline h-4 w-4 mr-1" /> Trusted by 2,500+ Software Engineers
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black tracking-tight text-[#0F172A] sm:text-6xl lg:text-7xl"
            >
              Keyword Sniper for{" "}
              <span className="bg-gradient-to-r from-[#22C55E] to-[#8B5CF6] bg-clip-text text-transparent">
                Software Engineers
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-[#475569] max-w-2xl mx-auto"
            >
              Your React and AWS experience is invisible to 70% of tech company ATS systems.
              Snipe missing keywords and see exactly what breaks in the parsing pipeline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="glow-button relative flex h-12 min-w-[200px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#22C55E] to-[#8B5CF6] px-8 text-base font-bold text-[#FFFFFF] transition-all hover:bg-[#3B82F6]"
              >
                Scan My Resume (Free)
              </Button>
            </motion.div>

            <p className="mt-4 text-xs text-[#64748B] font-mono">
              $ curl -X POST https://cvdebug.io/scan --data @resume.pdf
            </p>
          </div>
        </section>

        {/* Tech Keywords Cloud */}
        <section className="border-y border-[#E2E8F0] bg-[#FFFFFF] py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-[#64748B] mb-6">
              Optimized keyword detection for:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {techKeywords.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-sm font-mono text-[#475569] hover:border-[#22C55E] hover:text-[#22C55E] transition-colors"
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
                <div className="text-4xl font-bold text-[#0F172A] font-mono">94%</div>
                <div className="mt-2 text-sm text-[#475569]">
                  Average ATS score after keyword optimization
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0F172A] font-mono">5.3x</div>
                <div className="mt-2 text-sm text-[#475569]">More recruiter responses</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0F172A] font-mono">&lt;10s</div>
                <div className="mt-2 text-sm text-[#475569]">To identify missing keywords</div>
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
                Built for Software Engineering Resumes
              </h2>
              <p className="mt-4 text-lg text-[#475569]">
                Our keyword sniper understands tech stacks, frameworks, and engineering ATS
                requirements used by FAANG and top tech companies.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {engineerFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] group relative overflow-hidden rounded-2xl p-8 hover:hover:border-[#3B82F6]/50 transition-colors duration-300"
                >
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 size-32 rounded-full bg-[#22C55E]/10 blur-2xl transition-all group-hover:scale-110"></div>
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg bg-[#22C55E]/10 text-[#22C55E] ring-1 ring-inset ring-green-500/20">
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
              Success Stories from Software Engineers
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
                    <div className="h-10 w-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
                      <Code2 className="h-5 w-5 text-[#22C55E]" />
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
            <div className="absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 bg-[#22C55E]/20 blur-[100px]"></div>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              Ready to Pass FAANG ATS Filters?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#475569]">
              Join 2,500+ software engineers who optimized their keywords and landed interviews at
              Google, Meta, Amazon, and top tech companies.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="glow-button w-full max-w-md rounded-xl bg-gradient-to-r from-[#22C55E] to-[#8B5CF6] px-8 py-4 text-lg font-bold text-[#FFFFFF] shadow-2xl transition-all hover:scale-105 hover:from-[#22C55E] hover:to-[#8B5CF6] sm:w-auto"
              >
                Run Keyword Sniper (Free)
              </Button>
              <p className="text-xs text-[#64748B] font-mono">
                // No auth required • Instant scan • Open source friendly
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
