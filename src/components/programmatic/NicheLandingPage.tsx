import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { RelatedPages } from "@/components/seo/RelatedPages";
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
  Code,
  Server,
  Workflow
} from "lucide-react";
import { NicheTemplate } from "@/data/nicheTemplates";

interface NicheLandingPageProps {
  template: NicheTemplate;
}

// Icon mapping based on category
const getIconForFeature = (index: number, category: string) => {
  const iconSets = {
    nursing: [Stethoscope, Heart, Activity, Shield],
    tech: [Code, Server, Workflow, Target],
    default: [Target, Shield, CheckCircle2, Zap]
  };

  const icons = iconSets[category as keyof typeof iconSets] || iconSets.default;
  return icons[index % icons.length];
};

const getColorClasses = (color: string) => {
  const colors: Record<string, any> = {
    blue: {
      badge: "bg-blue-500/10 border-blue-500/20 text-blue-300",
      badgeIcon: "text-blue-400",
      gradient: "from-blue-400 to-indigo-400",
      button: "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25",
      keyword: "from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300",
      floatingBadge: "from-blue-600 to-indigo-600",
      bg: "bg-blue-500/10",
      bgSecondary: "bg-indigo-500/10",
      text: "text-blue-400",
      border: "border-blue-500/30",
      checkmark: "text-blue-400"
    },
    emerald: {
      badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
      badgeIcon: "text-emerald-400",
      gradient: "from-emerald-400 to-cyan-400",
      button: "from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-emerald-500/25",
      keyword: "from-emerald-500/20 to-cyan-500/20 border-emerald-500/30 text-emerald-300",
      floatingBadge: "from-emerald-600 to-cyan-600",
      bg: "bg-emerald-500/10",
      bgSecondary: "bg-cyan-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      checkmark: "text-emerald-400"
    },
    red: {
      badge: "bg-red-500/10 border-red-500/20 text-red-300",
      badgeIcon: "text-red-400",
      gradient: "from-red-400 to-orange-400",
      button: "from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-red-500/25",
      keyword: "from-red-500/20 to-orange-500/20 border-red-500/30 text-red-300",
      floatingBadge: "from-red-600 to-orange-600",
      bg: "bg-red-500/10",
      bgSecondary: "bg-orange-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      checkmark: "text-red-400"
    },
    purple: {
      badge: "bg-purple-500/10 border-purple-500/20 text-purple-300",
      badgeIcon: "text-purple-400",
      gradient: "from-purple-400 to-pink-400",
      button: "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25",
      keyword: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300",
      floatingBadge: "from-purple-600 to-pink-600",
      bg: "bg-purple-500/10",
      bgSecondary: "bg-pink-500/10",
      text: "text-purple-400",
      border: "border-purple-500/30",
      checkmark: "text-purple-400"
    },
    cyan: {
      badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
      badgeIcon: "text-cyan-400",
      gradient: "from-cyan-400 to-blue-400",
      button: "from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-cyan-500/25",
      keyword: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300",
      floatingBadge: "from-cyan-600 to-blue-600",
      bg: "bg-cyan-500/10",
      bgSecondary: "bg-blue-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      checkmark: "text-cyan-400"
    },
    violet: {
      badge: "bg-violet-500/10 border-violet-500/20 text-violet-300",
      badgeIcon: "text-violet-400",
      gradient: "from-violet-400 to-purple-400",
      button: "from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-violet-500/25",
      keyword: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-300",
      floatingBadge: "from-violet-600 to-purple-600",
      bg: "bg-violet-500/10",
      bgSecondary: "bg-purple-500/10",
      text: "text-violet-400",
      border: "border-violet-500/30",
      checkmark: "text-violet-400"
    }
  };

  return colors[color] || colors.blue;
};

export function NicheLandingPage({ template }: NicheLandingPageProps) {
  const navigate = useNavigate();
  const colors = getColorClasses(template.colors.primary);
  const category = template.slug.includes('nurse') ? 'nursing' : 'tech';

  useEffect(() => {
    document.title = template.metaTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", template.metaDescription);
    }
  }, [template]);

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
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 -left-48 w-96 h-96 ${colors.bg} rounded-full blur-3xl`} />
            <div className={`absolute bottom-1/4 -right-48 w-96 h-96 ${colors.bgSecondary} rounded-full blur-3xl`} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.badge} border mb-6`}>
                  <Heart className={`h-4 w-4 ${colors.badgeIcon}`} />
                  <span className="text-sm font-medium">{template.badge}</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  {template.heroTitle}
                  <span className={`block bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                    {template.heroHighlight}
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                  {template.heroDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    size="lg"
                    className={`bg-gradient-to-r ${colors.button} text-white shadow-lg group`}
                    onClick={() => navigate("/auth")}
                  >
                    {template.primaryCTA}
                    <Zap className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-700 hover:border-slate-600 text-white"
                    onClick={() => navigate("/auth")}
                  >
                    See Robot View Demo
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                  {template.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs md:text-sm text-slate-400">{stat.label}</div>
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
                <div className="glass-panel rounded-2xl p-8 border border-slate-800 shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <div className={`w-2 h-2 rounded-full ${colors.text} animate-pulse`} />
                    <span className="text-sm text-slate-400 font-mono">ATS Scanning...</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-4">Critical Keywords Detected:</h3>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.keywords.slice(0, 12).map((keyword, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.05 }}
                        className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${colors.keyword} border text-sm font-medium`}
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-slate-400 text-sm">ATS Match Score:</span>
                    <span className={`text-2xl font-bold ${colors.text}`}>89%</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className={`absolute -bottom-4 -right-4 bg-gradient-to-r ${colors.floatingBadge} rounded-xl p-4 shadow-xl`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold text-sm">ATS Optimized</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 md:py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Why Resumes Get <span className="text-red-400">Auto-Rejected</span> by ATS
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Here's what kills your application before it reaches a human recruiter:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {template.commonIssues.map((issue, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel rounded-xl p-6 border border-red-500/20"
                >
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{issue.title}</h3>
                  <p className="text-slate-300">{issue.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Section (if available) */}
        {template.beforeAfter && (
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Real Resume Transformation
                </h2>
                <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                  See how CVDebug optimizes resumes for ATS systems
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="glass-panel rounded-xl p-8 border border-red-500/30"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">BEFORE Optimization</h3>
                      <p className="text-3xl font-black text-red-400">{template.beforeAfter.beforeScore} ATS Score</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {template.beforeAfter.beforeIssues.map((issue, idx) => (
                      <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-800/50">
                        <div className="text-red-400 mt-0.5">✗</div>
                        <p className="text-slate-300 text-sm">{issue}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`glass-panel rounded-xl p-8 border ${colors.border}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <CheckCircle2 className={`h-6 w-6 ${colors.checkmark}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">AFTER Optimization</h3>
                      <p className={`text-3xl font-black ${colors.text}`}>{template.beforeAfter.afterScore} ATS Score</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {template.beforeAfter.afterFixes.map((fix, idx) => (
                      <div key={idx} className="flex gap-3 p-3 rounded-lg bg-slate-800/50">
                        <div className={colors.checkmark + " mt-0.5"}>✓</div>
                        <p className="text-slate-300 text-sm">{fix}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Built Specifically for <span className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>Your Industry</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Our scanner understands your field's terminology, requirements, and ATS configurations
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {template.features.map((feature, idx) => {
                const Icon = getIconForFeature(idx, category);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`glass-panel rounded-xl p-8 border border-slate-800 hover:${colors.border} transition-all group`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.keyword} border ${colors.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
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
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Success Stories from Professionals Like You
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {template.testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel rounded-xl p-6 border border-slate-800"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className={`text-sm ${colors.text}`}>{testimonial.role}</div>
                    <div className="text-sm text-slate-500">{testimonial.location}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden bg-slate-900/50">
          <div className={`absolute inset-0 bg-gradient-to-r ${colors.button.split(' ')[0]} ${colors.button.split(' ')[1]} blur-3xl opacity-20`} />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Stop Getting Auto-Rejected by ATS Systems
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Get your free resume scan in 10 seconds. See your ATS score, missing keywords, and exact formatting issues.
              </p>
              <Button
                size="lg"
                className={`bg-gradient-to-r ${colors.button} text-white text-lg px-8 py-6 shadow-2xl`}
                onClick={() => navigate("/auth")}
              >
                {template.primaryCTA}
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-slate-400 mt-4">
                ✓ No credit card required  ✓ Results in 10 seconds  ✓ 100% confidential
              </p>
            </motion.div>
          </div>
        </section>

        {/* Related Pages - Internal Linking */}
        <RelatedPages currentUrl={template.slug.startsWith('/') ? template.slug : `/${template.slug}`} category={category} />
      </main>

      <NewFooter />
    </div>
  );
}
