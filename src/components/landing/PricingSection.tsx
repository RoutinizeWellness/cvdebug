import { useNavigate } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function PricingSection() {
  const navigate = useNavigate();

  const handlePlanSelect = (plan: string) => {
    navigate(`/auth?plan=${plan}`);
  };

  return (
    <section className="w-full py-24 bg-background relative overflow-hidden" id="pricing">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-xl">Pay once. Fix forever. No subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free Tier */}
          <div className="p-8 rounded-2xl bg-card border-2 border-border flex flex-col gap-6 h-full hover:border-primary/30 transition-all">
            <div>
              <h3 className="text-2xl font-bold mb-2">Free Preview</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">€0</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">See your ATS score</p>
            </div>
            <button 
              onClick={() => handlePlanSelect('free')}
              className="w-full h-12 rounded-xl bg-muted hover:bg-accent border-2 border-border hover:border-primary/30 font-bold transition-all hover:scale-[1.02]"
            >
              Try Free
            </button>
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Basic Score (0-100)
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground line-through">
                <span className="text-xl">✕</span>
                Keyword Analysis
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground line-through">
                <span className="text-xl">✕</span>
                Format Fixes
              </div>
            </div>
          </div>

          {/* Single Scan */}
          <div className="p-8 rounded-2xl bg-card border-2 border-border flex flex-col gap-6 h-full hover:border-primary/30 transition-all">
            <div>
              <h3 className="text-2xl font-bold mb-2">Single Scan</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">€4.99</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">One complete fix</p>
            </div>
            <button 
              onClick={() => handlePlanSelect('single_scan')}
              className="w-full h-12 rounded-xl bg-muted hover:bg-accent border-2 border-border hover:border-primary/30 font-bold transition-all hover:scale-[1.02]"
            >
              Get Single Scan
            </button>
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Full ATS Analysis
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Keyword Report
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Format Check
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                PDF Sanitization
              </div>
            </div>
          </div>

          {/* Interview Sprint */}
          <motion.div 
            className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary shadow-[0_0_40px_-10px] shadow-primary/30 flex flex-col gap-6 relative h-full transform md:-translate-y-4"
            whileHover={{ y: -8, boxShadow: "0 0 60px -10px rgba(163, 127, 188, 0.5)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div 
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🚀 BEST VALUE
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Interview Sprint</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">€19.99</span>
                <span className="text-lg text-muted-foreground line-through">€49.99</span>
              </div>
              <p className="text-xs text-primary font-bold mt-1">60% OFF - 7 days unlimited</p>
            </div>
            <motion.button 
              onClick={() => handlePlanSelect('interview_sprint')}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 relative overflow-hidden"
              style={{ backgroundSize: "200% 100%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              whileHover={{ 
                y: -4, 
                boxShadow: "0 0 30px rgba(163, 127, 188, 0.6)",
                scale: 1.02
              }}
              whileTap={{ scale: 0.98 }}
            >
              Start Sprint
            </motion.button>
            <div className="space-y-3 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Unlimited Scans (7 Days)
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                AI Keyword Suggestions
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Cover Letter Generator
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                LinkedIn Optimizer
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Priority Support
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}