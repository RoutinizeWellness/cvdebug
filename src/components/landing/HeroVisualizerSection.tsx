import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

export function HeroVisualizerSection() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center text-center gap-8 pt-10">
      {/* Badge */}
      <motion.div 
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        New: AI-Powered Parsing 2.0
      </motion.div>

      {/* Main Headline */}
      <motion.h1 
        className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Your Job Search HQ with <br /> AI-Powered Safety Checks
      </motion.h1>

      <motion.p 
        className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Stop guessing if the ATS can read your resume. See what the robots see and fix parsing errors before you apply.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button 
          onClick={() => navigate("/auth")}
          className="h-12 px-8 rounded-lg bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2"
        >
          Start Your First Project (Free)
          <ArrowRight className="h-5 w-5" />
        </button>
        <button className="h-12 px-8 rounded-lg bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-medium transition-colors flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          View Demo
        </button>
      </motion.div>
    </section>
  );
}