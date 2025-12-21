import { Upload, Zap, Target, CreditCard, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "1. Create Your Project",
      description: "Upload your master CV and create a job search project (e.g., 'Senior Dev Hunt 2025')."
    },
    {
      icon: Zap,
      title: "2. Paste Job Description",
      description: "Don't just guess. Paste the exact Job Description (JD) to see your match score and missing keywords."
    },
    {
      icon: Target,
      title: "3. AI-Powered Tools",
      description: "Generate tailored cover letters, optimize LinkedIn, and get real-time CV health alerts."
    }
  ];

  const sprintFeatures = [
    {
      icon: "🛡️",
      title: "El Escudo Técnico",
      features: [
        "Scans Ilimitados (7 días) - Edita 100 veces sin costo extra",
        "Image Trap Detector siempre activo",
        "Priority Parsing - Vía rápida del servidor"
      ]
    },
    {
      icon: "⚡",
      title: "Generador de Impacto",
      features: [
        "Keyword Sniper - 3 frases reales por keyword faltante",
        "Cover Letter AI Forge - Cartas instantáneas",
        "Recruiter DM Generator - Mensajes LinkedIn optimizados"
      ]
    },
    {
      icon: "🎮",
      title: "Gamificación",
      features: [
        "Badges de Progreso (Ready for Google, Top 5%)",
        "Probability Score en tiempo real",
        "Alertas de Gap - Nudges cuando te estancas"
      ]
    }
  ];

  const postPaymentSteps = [
    {
      icon: CreditCard,
      title: "Complete Payment",
      description: "Choose your plan (€4.99 for 1 scan or €19.99 for 7-day unlimited access) and checkout securely via Stripe."
    },
    {
      icon: CheckCircle,
      title: "Credits Unlocked",
      description: "Your credits are instantly added to your account. You'll see your new balance in the dashboard."
    },
    {
      icon: Upload,
      title: "Upload & Analyze",
      description: "Go to Dashboard → Upload Resume → Paste Job Description (optional) → Click 'Analyze'. Your full ATS report unlocks immediately."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">How it works</h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Your complete job search command center. <span className="text-primary font-bold">Match your resume to any Job Description</span> and get AI-powered fixes.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative mb-20">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent border-t border-dashed border-muted-foreground/30"></div>
          
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className={`h-20 w-20 md:h-24 md:w-24 bg-background border-2 ${i === 1 ? 'border-primary shadow-[0_0_30px_-5px_rgba(249,245,6,0.3)] scale-110' : 'border-border'} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:border-primary group-hover:scale-110 transition-all duration-300 z-10 relative`}>
                <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform -z-10"></div>
                <step.icon className={`h-8 w-8 md:h-10 md:w-10 ${i === 1 ? 'text-primary' : 'text-primary'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${i === 1 ? 'text-primary' : ''}`}>{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs text-sm md:text-base">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary text-sm font-bold uppercase tracking-wider mb-6 border-2 border-primary/30 shadow-lg">
                <CheckCircle className="h-5 w-5" />
                After You Purchase
              </div>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Choose Your Plan
              </h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-zinc-700 rounded-2xl p-6 text-left">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-white font-black text-lg mb-1">Single Scan</p>
                  <p className="text-zinc-400 text-sm mb-3">€4.99 - One complete analysis</p>
                  <p className="text-zinc-500 text-xs">Perfect for testing one application</p>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary rounded-2xl p-6 text-left relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-primary text-black text-[10px] font-black px-2 py-1 rounded-full">BEST VALUE</div>
                  <div className="text-2xl mb-2">🚀</div>
                  <p className="text-white font-black text-lg mb-1">Interview Sprint</p>
                  <p className="text-primary font-black text-sm mb-3">€19.99 - 7 days unlimited</p>
                  <p className="text-zinc-300 text-xs">Track multiple jobs, AI tools, continuous monitoring</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {sprintFeatures.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-zinc-950 border border-primary/20 rounded-xl p-6"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="text-lg font-bold text-white mb-3">{feature.title}</h4>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative mb-10">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            
            {postPaymentSteps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="h-20 w-20 md:h-24 md:w-24 bg-zinc-950 border-2 border-primary/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:border-primary group-hover:scale-110 transition-all duration-300 z-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl"></div>
                  <step.icon className="h-9 w-9 md:h-11 md:w-11 text-primary relative z-10" />
                </div>
                <div className="mb-3 inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border-2 border-green-500/30 rounded-full px-5 py-2.5 text-sm font-bold text-green-700 dark:text-green-400 shadow-md">
                <CheckCircle className="h-5 w-5" />
                No subscription
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border-2 border-blue-500/30 rounded-full px-5 py-2.5 text-sm font-bold text-blue-700 dark:text-blue-400 shadow-md">
                <CheckCircle className="h-5 w-5" />
                Credits never expire
              </div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border-2 border-purple-500/30 rounded-full px-5 py-2.5 text-sm font-bold text-purple-700 dark:text-purple-400 shadow-md">
                <CheckCircle className="h-5 w-5" />
                Instant access
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto">
              💡 <strong>Pro Tip:</strong> If you're viewing a blurred report when you purchase, we'll automatically unlock it for you—no extra clicks needed!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}