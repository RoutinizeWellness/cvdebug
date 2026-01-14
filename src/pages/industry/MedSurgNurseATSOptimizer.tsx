import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  CheckCircle2,
  Shield,
  Target,
  Zap,
  FileText,
  TrendingUp,
  AlertCircle,
  Heart,
  Stethoscope,
  Activity,
  UserCheck,
  ClipboardCheck,
  Clock
} from "lucide-react";

export default function MedSurgNurseATSOptimizer() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Free ATS Resume Scanner for Med-Surg Nurses | CVDebug";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Optimize your Medical-Surgical nursing resume for ATS systems. Specialized scanner for Med-Surg RNs with patient ratio tracking, BCMA, and telemetry experience. Get hired faster at top hospitals."
      );
    }
  }, []);

  const medSurgKeywords = [
    "Post-Operative Care",
    "Wound Management",
    "Pain Assessment",
    "Medication Reconciliation",
    "BCMA (Barcode Med Admin)",
    "Telemetry Monitoring",
    "Patient Ratios (1:4-1:6)",
    "Pre-Op Patient Education",
    "Discharge Planning",
    "Fall Risk Assessment",
    "Infection Control Protocol",
    "EMR Documentation (EPIC/Cerner)"
  ];

  const commonMistakes = [
    {
      icon: AlertCircle,
      title: "Generic 'Patient Care' Language",
      description: "Med-Surg resumes need specific terminology like 'post-operative surgical patient management' and 'acute care assessment' - not just 'provided patient care'. ATS systems scan for specialty-specific language."
    },
    {
      icon: FileText,
      title: "Patient Ratios Not Quantified",
      description: "Hospitals want to see '1:5 patient ratio on 36-bed surgical unit' not 'managed multiple patients'. ATS algorithms prioritize concrete numbers for Med-Surg positions."
    },
    {
      icon: Shield,
      title: "Surgical Experience Buried",
      description: "Your experience with orthopedic, cardiovascular, or general surgery patients needs to be in the first 3 bullet points. ATS systems weight top-listed experiences higher for Med-Surg roles."
    }
  ];

  const features = [
    {
      icon: Stethoscope,
      title: "Med-Surg Specific Keyword Optimizer",
      description: "Analyzes for 150+ medical-surgical nursing terms that hospital ATS systems prioritize: surgical wound care, hemodynamic monitoring, patient acuity scoring, and more."
    },
    {
      icon: ClipboardCheck,
      title: "Patient Ratio & Acuity Validator",
      description: "Ensures your patient load, unit size, and acuity levels are formatted correctly for parsing. Hospitals filter candidates by these exact metrics."
    },
    {
      icon: Activity,
      title: "Surgical Specialty Matcher",
      description: "Tests compatibility for orthopedic, cardiovascular, neuro, general surgery, and trauma surgical nursing positions with specialty-specific keyword analysis."
    },
    {
      icon: Clock,
      title: "Shift & Experience Formatter",
      description: "Optimizes how you present night shift experience, weekend/holiday availability, and years in acute care - critical filters in Med-Surg ATS systems."
    }
  ];

  const stats = [
    { value: "68%", label: "of Med-Surg resumes missing key surgical terms" },
    { value: "1:5", label: "ideal patient ratio to highlight" },
    { value: "87%", label: "of large hospitals use ATS for Med-Surg roles" },
  ];

  const beforeAfter = {
    before: {
      title: "BEFORE CVDebug Optimization",
      score: "42%",
      issues: [
        "Missing: 'post-operative assessment', 'surgical drain management'",
        "Patient ratios not quantified (ATS rejected)",
        "Telemetry experience buried in 7th bullet point",
        "Generic 'medication administration' (no BCMA mention)"
      ]
    },
    after: {
      title: "AFTER CVDebug Optimization",
      score: "91%",
      fixes: [
        "Added: 15 Med-Surg keywords in top 3 bullets",
        "Quantified: '1:5 patient ratio on 28-bed surgical telemetry unit'",
        "Moved telemetry to #2 experience bullet",
        "Specified: 'BCMA medication administration with 99.7% accuracy'"
      ]
    }
  };

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
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 mb-6">
                  <Heart className="h-4 w-4 text-[#22C55E]" />
                  <span className="text-sm text-[#22C55E] font-medium">For Medical-Surgical RNs</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] mb-6 leading-tight">
                  Get Your Med-Surg Resume
                  <span className="block bg-gradient-to-r from-[#22C55E] to-[#3B82F6] bg-clip-text text-transparent">
                    Past Hospital ATS Systems
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-[#475569] mb-8 leading-relaxed">
                  68% of Medical-Surgical nursing resumes are missing critical keywords like <span className="text-[#0F172A] font-semibold">"post-operative assessment"</span> and <span className="text-[#0F172A] font-semibold">"surgical wound management"</span>. See exactly what <span className="text-[#22C55E] font-semibold">Johns Hopkins, Cleveland Clinic, and NYU Langone's ATS</span> systems see.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#22C55E] to-[#3B82F6] hover:from-[#22C55E] hover:to-cyan-700 text-[#FFFFFF] shadow-lg shadow-emerald-500/25 group"
                    onClick={() => navigate("/auth")}
                  >
                    Scan My Med-Surg Resume Free
                    <Zap className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#E2E8F0] hover:border-slate-600 text-[#0F172A]"
                    onClick={() => navigate("/auth")}
                  >
                    See Example Report
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E2E8F0]">
                  {stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-1">{stat.value}</div>
                      <div className="text-xs md:text-sm text-[#475569]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-2xl p-8 border border-[#E2E8F0] shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-[#475569] font-mono">Analyzing Med-Surg Resume...</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] mb-4">Critical Med-Surg Keywords Found:</h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {medSurgKeywords.map((keyword, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#22C55E]/20 to-[#3B82F6]/20 border border-[#22C55E]/30 text-sm text-[#22C55E] font-medium"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:border-[#3B82F6]/50">
                      <span className="text-[#475569] text-sm">Surgical Keywords:</span>
                      <span className="text-[#22C55E] font-bold">12/15 Found</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:border-[#3B82F6]/50">
                      <span className="text-[#475569] text-sm">Patient Ratios Quantified:</span>
                      <span className="text-[#22C55E] font-bold">✓ Yes</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:border-[#3B82F6]/50">
                      <span className="text-[#475569] text-sm">ATS Compatibility:</span>
                      <span className="text-2xl font-bold text-[#22C55E]">89%</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-[#22C55E] to-[#3B82F6] rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#0F172A]" />
                    <span className="text-[#0F172A] font-semibold text-sm">Med-Surg Optimized</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
                Why Med-Surg Nurses Get <span className="text-[#EF4444]">Auto-Rejected</span>
              </h2>
              <p className="text-lg text-[#475569] max-w-3xl mx-auto">
                Medical-Surgical positions have the highest ATS rejection rate in nursing. Here's what's killing your applications:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {commonMistakes.map((mistake, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-6 border border-red-500/20"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#EF4444]/10 border border-red-500/20 flex items-center justify-center mb-4">
                    <mistake.icon className="h-6 w-6 text-[#EF4444]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">{mistake.title}</h3>
                  <p className="text-[#475569]">{mistake.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
                Real Med-Surg Resume Transformation
              </h2>
              <p className="text-lg text-[#475569] max-w-3xl mx-auto">
                See how CVDebug optimizes a Medical-Surgical RN resume for ATS systems
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-8 border border-red-500/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#EF4444]/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-[#EF4444]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">{beforeAfter.before.title}</h3>
                    <p className="text-3xl font-black text-[#EF4444]">{beforeAfter.before.score} ATS Score</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {beforeAfter.before.issues.map((issue, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg hover:border-[#3B82F6]/50">
                      <div className="text-[#EF4444] mt-0.5">✗</div>
                      <p className="text-[#475569] text-sm">{issue}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-8 border border-[#22C55E]/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-[#22C55E]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">{beforeAfter.after.title}</h3>
                    <p className="text-3xl font-black text-[#22C55E]">{beforeAfter.after.score} ATS Score</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {beforeAfter.after.fixes.map((fix, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-lg hover:border-[#3B82F6]/50">
                      <div className="text-[#22C55E] mt-0.5">✓</div>
                      <p className="text-[#475569] text-sm">{fix}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
                Built Specifically for <span className="text-[#22C55E]">Medical-Surgical Nurses</span>
              </h2>
              <p className="text-lg text-[#475569] max-w-3xl mx-auto">
                Our scanner understands Med-Surg terminology, patient acuity levels, and surgical specialty requirements
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-8 border border-[#E2E8F0] hover:border-[#22C55E]/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#3B82F6]/20 border border-[#22C55E]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-[#22C55E]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                  <p className="text-[#475569] text-lg leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
                Success Stories from Med-Surg RNs
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I was applying to surgical telemetry units for 2 months - nothing. CVDebug showed me I wasn't quantifying my patient ratios or using 'post-op' enough. Fixed it in 20 minutes, got 3 callbacks that week.",
                  name: "Amanda K.",
                  role: "Med-Surg RN",
                  location: "Cleveland Clinic",
                  years: "5 years experience"
                },
                {
                  quote: "The Robot View revealed my 'wound care' experience was being parsed as 'wound' + random characters. Changed the formatting, my ATS score went from 38% to 92%. Landed my dream orthopedic surgical position.",
                  name: "David P.",
                  role: "Ortho-Surgical RN",
                  location: "Johns Hopkins",
                  years: "3 years experience"
                },
                {
                  quote: "As a new grad trying to break into Med-Surg, I had clinical rotations but didn't know how to present them for ATS. This tool showed me exactly which surgical keywords to emphasize. Got hired within 3 weeks.",
                  name: "Maria S.",
                  role: "New Grad Med-Surg RN",
                  location: "NYU Langone",
                  years: "New Graduate"
                }
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-xl p-6 border border-[#E2E8F0]"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#F59E0B] fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#475569] mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-bold text-[#0F172A]">{testimonial.name}</div>
                    <div className="text-sm text-[#22C55E]">{testimonial.role}</div>
                    <div className="text-sm text-[#64748B]">{testimonial.location}</div>
                    <div className="text-xs text-[#475569] mt-1">{testimonial.years}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden bg-[#F8FAFC]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/20 to-[#3B82F6]/20 blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] mb-6">
                Stop Losing Med-Surg Opportunities to ATS Filters
              </h2>
              <p className="text-xl text-[#475569] mb-8">
                Get your free Medical-Surgical nursing resume scan in 10 seconds. See your ATS score, missing surgical keywords, and patient ratio formatting issues.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#22C55E] to-[#3B82F6] hover:from-[#22C55E] hover:to-cyan-700 text-[#FFFFFF] text-lg px-8 py-6 shadow-2xl shadow-emerald-500/25"
                onClick={() => navigate("/auth")}
              >
                Scan My Med-Surg Resume Now - Free
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-[#475569] mt-4">
                ✓ No credit card  ✓ Results in 10 sec  ✓ HIPAA compliant  ✓ Used by RNs at Cleveland Clinic, Johns Hopkins, Mayo
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <NewFooter />
    </div>
  );
}
