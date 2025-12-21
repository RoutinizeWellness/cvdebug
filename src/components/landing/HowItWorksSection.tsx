import { Upload, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Resume",
      description: "Drop your PDF and we'll scan it instantly — no signup required for preview."
    },
    {
      icon: Zap,
      title: "See What ATS Sees",
      description: "Watch your resume transform into the scrambled mess that robots actually read."
    },
    {
      icon: Target,
      title: "Fix & Optimize",
      description: "Get AI-powered fixes for keywords, formatting, and ATS compatibility."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three steps to stop getting auto-rejected
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              <motion.div 
                className="h-20 w-20 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:border-primary group-hover:shadow-xl transition-all duration-300 z-10 relative"
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <step.icon className="h-9 w-9 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
              
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}