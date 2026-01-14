import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Heart, Activity, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { updatePageSEO, nursingPageSEO, generateHowToSchema, generateServiceSchema } from "@/lib/seo";

export default function ATSScannerNurses() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Dynamic SEO optimization for this nursing page
    updatePageSEO({
      title: nursingPageSEO.ats_scanner_nurses.title,
      description: nursingPageSEO.ats_scanner_nurses.description,
      keywords: nursingPageSEO.ats_scanner_nurses.keywords,
      canonical: 'https://cvdebug.com/ats-scanner-for-nurses',
      ogImage: 'https://cvdebug.com/og-nursing.jpg',
      structuredData: {
        type: 'HowTo',
        data: generateHowToSchema('Nursing', 'Healthcare'),
      },
    });

    // Add Service Schema for nursing-specific optimization
    const serviceScript = document.createElement('script');
    serviceScript.type = 'application/ld+json';
    serviceScript.id = 'service-schema-nursing';
    serviceScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      ...generateServiceSchema(
        'Nursing Resume ATS Optimization',
        'Free ATS resume scanner built specifically for nurses and healthcare professionals. Optimize nursing resumes for hospital ATS systems.',
        'Registered Nurses, Licensed Practical Nurses, Healthcare Professionals'
      ),
    });
    document.head.appendChild(serviceScript);

    return () => {
      const existingScript = document.getElementById('service-schema-nursing');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const nursingFeatures = [
    {
      icon: Heart,
      title: "Clinical Keywords Optimizer",
      description:
        "Automatically identifies missing certifications like BLS, ACLS, PALS, and medical terminology that ATS systems scan for in nursing applications.",
    },
    {
      icon: Activity,
      title: "Healthcare ATS Compatibility",
      description:
        "Tested against major healthcare ATS platforms used by hospitals: Workday, Oracle Taleo, and HealthcareSource to ensure your resume parses correctly.",
    },
    {
      icon: ShieldCheck,
      title: "License & Credential Validator",
      description:
        "Verifies your RN/LPN licenses, certifications, and specializations are formatted correctly for automated parsing systems.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "ICU Nurse",
      text: "Got 3 interviews after fixing my ATS score from 42% to 89%. The Robot View showed me my certifications weren't being read!",
    },
    {
      name: "James L.",
      role: "ER Nurse",
      text: "I had ACLS and BLS but they were in a text box the ATS couldn't parse. CVDebug caught it immediately.",
    },
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
                <Heart className="inline h-4 w-4 mr-1" /> Trusted by 500+ Nurses
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-black tracking-tight text-[#0F172A] sm:text-6xl lg:text-7xl"
            >
              ATS Resume Scanner Built for{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                Nurses
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-[#475569] max-w-2xl mx-auto"
            >
              70% of nursing applications are rejected before a human sees them. See what the
              hospital's ATS bot sees and fix critical errors in your RN/LPN resume in seconds.
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
                Scan My Nursing Resume Free
              </Button>
            </motion.div>

            <p className="mt-4 text-xs text-[#64748B]">
              No signup required • See results in 10 seconds
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-[#E2E8F0] bg-[#FFFFFF] py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold text-[#0F172A]">89%</div>
                <div className="mt-2 text-sm text-[#64748B]">
                  Average ATS score for nurses after fixes
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0F172A]">3.2x</div>
                <div className="mt-2 text-sm text-[#64748B]">More interviews on average</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0F172A]">10 sec</div>
                <div className="mt-2 text-sm text-[#64748B]">To see what ATS bots see</div>
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
                Built Specifically for Healthcare Resumes
              </h2>
              <p className="mt-4 text-lg text-[#475569]">
                Our scanner understands nursing terminology, certifications, and healthcare ATS
                requirements.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {nursingFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl p-8 bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3B82F6]/50 transition-colors duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
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
        <section className="py-16 bg-[#FFFFFF]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-12">
              Success Stories from Nurses Like You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl p-6 bg-[#F8FAFC] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
                >
                  <p className="text-[#475569] mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#0F172A]">{testimonial.name}</div>
                      <div className="text-sm text-[#64748B]">{testimonial.role}</div>
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
            className="mx-auto max-w-4xl rounded-3xl p-8 text-center sm:p-16 relative overflow-hidden bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
          >
            <div className="absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 bg-[#3B82F6]/30 blur-[100px]"></div>

            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              Ready to Get More Interview Callbacks?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#475569]">
              Join 500+ nurses who fixed their ATS parsing errors and landed their dream positions.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="glow-button w-full max-w-md rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#3B82F6] px-8 py-4 text-lg font-bold text-[#FFFFFF] shadow-2xl transition-all hover:scale-105 hover:from-[#3B82F6] hover:to-[#3B82F6] sm:w-auto"
              >
                Scan My Resume Now (Free)
              </Button>
              <p className="text-xs text-[#64748B]">
                No credit card • HIPAA Compliant • Instant Results
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
