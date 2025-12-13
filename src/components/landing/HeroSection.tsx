import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle, FileText, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-purple-500/10 to-background animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary text-xs md:text-sm font-bold mb-6 border-2 border-primary/30 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              New: ML-Enhanced ATS Analysis
              <Zap className="h-3 w-3" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-6">
              Is ATS blocking <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">your resume?</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              <span className="font-bold text-foreground">ResumeATS is a diagnostic tool, not a magic solution.</span> We analyze 20+ technical factors to help you pass automated filters. One-time payment, no subscriptions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="h-12 md:h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                Check My Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 md:h-14 px-8 text-base rounded-full border-2 hover:bg-accent/50 font-bold" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" className="h-full w-full" />
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="font-bold text-foreground">1,000+</span> job seekers</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-8 lg:mt-0 w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-2xl p-6 md:p-8 rotate-0 lg:rotate-3 hover:rotate-0 transition-transform duration-500 group">
              {/* Floating Score Badge */}
              <div className="absolute -top-6 -right-6 bg-background border border-border p-1.5 rounded-2xl shadow-xl z-20 animate-bounce duration-[3000ms]">
                 <div className="bg-green-500 text-white p-4 rounded-xl flex flex-col items-center min-w-[80px]">
                    <span className="text-3xl font-black">92</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">ATS Score</span>
                 </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-border/50 pb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
                     <FileText className="h-6 w-6" />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-green-500/20 rounded text-[10px] font-bold text-green-700 flex items-center justify-center">PASSED</div>
                    </div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="space-y-5">
                  {[
                    { label: "Keyword Match", score: "95%", color: "bg-green-500", width: "95%" },
                    { label: "Formatting", score: "100%", color: "bg-green-500", width: "100%" },
                    { label: "Content Density", score: "72%", color: "bg-yellow-500", width: "72%" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground flex items-center gap-2">
                            {item.score === "100%" ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />}
                            {item.label}
                        </span>
                        <span className="font-bold text-foreground">{item.score}</span>
                      </div>
                      <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: item.width }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                          className={`h-full ${item.color} rounded-full`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alert Box */}
                <div className="pt-2">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-red-700">Critical Fix Needed</p>
                      <p className="text-xs text-red-600/80 leading-relaxed">Your resume is missing 3 critical keywords found in the job description: "Agile", "React", "TypeScript".</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements behind */}
            <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-primary/5 rounded-3xl rotate-[-6deg] scale-95 border border-primary/10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}