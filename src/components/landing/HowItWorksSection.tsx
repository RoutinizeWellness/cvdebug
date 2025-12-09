import { Upload, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "1. Upload or Import",
      description: "Upload your resume PDF/Word or paste your LinkedIn profile text."
    },
    {
      icon: Zap,
      title: "2. AI Analysis",
      description: "We check for keywords, formatting errors, and profile completeness."
    },
    {
      icon: Target,
      title: "3. Get Hired",
      description: "Fix the issues, beat the ATS, and get invited to the interview."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">How it works</h2>
            <p className="text-xl text-muted-foreground">
              Our AI analyzes your resume and LinkedIn profile exactly like a recruiter would.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
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
              <div className="h-24 w-24 bg-background border-2 border-border rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 z-10 relative">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform -z-10"></div>
                <step.icon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}