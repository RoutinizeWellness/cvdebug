import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New: AI-Powered Analysis 2.0
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-6">
              Is your resume <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">good enough?</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Stop guessing. Get an instant ATS score and detailed feedback to fix your resume and land more interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                Check My Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-2 hover:bg-accent/50 font-bold" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
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
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 max-w-md mx-auto lg:ml-auto rotate-3 hover:rotate-0 transition-transform duration-500 group">
              <div className="absolute -top-6 -right-6 bg-green-500 text-white p-4 rounded-2xl shadow-xl flex flex-col items-center animate-bounce duration-[3000ms] z-20">
                <span className="text-3xl font-black">92</span>
                <span className="text-xs font-bold uppercase">Score</span>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 border-b border-border pb-4">
                  <div className="h-12 w-12 bg-muted rounded-full flex-shrink-0 overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="h-full w-full" />
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                    <div className="h-3 w-1/3 bg-muted/50 rounded"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Impact", score: "High", color: "bg-green-500", width: "90%" },
                    { label: "Brevity", score: "Medium", color: "bg-yellow-500", width: "60%" },
                    { label: "Style", score: "High", color: "bg-green-500", width: "95%" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">{item.label}</span>
                        <span className={`font-bold ${item.color.replace('bg-', 'text-')}`}>{item.score}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
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

                <div className="pt-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">!</div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-red-700">Critical Fix Needed</p>
                      <p className="text-xs text-red-600/80">Missing keywords: "Project Management", "Agile".</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
