import { Shield, Target, BarChart3, CheckCircle2, Linkedin, FileSearch, XCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export function FeatureGridSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      <motion.div 
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-purple-500/5 opacity-50"
      ></motion.div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
              Don't let technical errors hold you back
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              ATS rejection is just one factor of many, but it's one you can control. Ensure your resume isn't being filtered out due to formatting or keyword issues before a human even sees it.
            </p>
            
            <div className="bg-background border border-border rounded-xl p-6 mb-8 shadow-sm">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Diagnostic Tool vs. General Advice
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ChatGPT gives generic advice. <span className="font-bold text-foreground">CVDebug is a technical diagnostic tool</span> that checks 20+ specific ATS factors (margins, metadata, keyword density) to give you a precise quantitative score.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Shield, title: "Formatting Errors", desc: "Complex layouts, columns, and graphics can confuse ATS parsers." },
                { icon: Target, title: "Missing Keywords", desc: "Identify gaps between your resume and the job description." },
                { icon: Linkedin, title: "Unoptimized LinkedIn", desc: "Ensure your profile is discoverable by recruiters." },
                { icon: BarChart3, title: "Low Content Density", desc: "Vague bullet points that don't show impact or metrics." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border/50 hover:shadow-sm">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg mb-1">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-1 lg:order-2"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl"
            ></motion.div>
            <div className="relative bg-gradient-to-br from-card via-card to-card/80 border-2 border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-primary/20 transition-all duration-500 backdrop-blur-sm">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-border/50">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FileSearch className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Analysis Report</h3>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          Generated just now
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-600 border-green-500/30 px-4 py-1.5 font-bold shadow-sm">
                  ✓ Passed
                </Badge>
              </div>
              
              {/* Enhanced Metrics */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "File Format", status: "Compatible", icon: CheckCircle2, color: "text-green-600", bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10", border: "border-green-500/30" },
                  { label: "Contact Info", status: "Found", icon: CheckCircle2, color: "text-green-600", bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10", border: "border-green-500/30" },
                  { label: "Job Title Match", status: "Exact Match", icon: CheckCircle2, color: "text-green-600", bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10", border: "border-green-500/30" },
                  { label: "Education", status: "Listed", icon: CheckCircle2, color: "text-green-600", bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/10", border: "border-green-500/30" },
                  { label: "Soft Skills", status: "3 Missing", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-gradient-to-r from-yellow-500/10 to-amber-500/10", border: "border-yellow-500/30" },
                  { label: "Hard Skills", status: "Critical Missing", icon: XCircle, color: "text-red-600", bg: "bg-gradient-to-r from-red-500/10 to-rose-500/10", border: "border-red-500/30" },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 ${item.border} ${item.bg} transition-all hover:scale-[1.02] hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="font-semibold text-sm md:text-base">{item.label}</span>
                    </div>
                    <span className={`text-xs md:text-sm font-bold ${item.color} px-2 py-1 rounded-md bg-background/50`}>{item.status}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* Enhanced Score Section */}
              <div className="mt-8 pt-6 border-t-2 border-border/50">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Overall Score</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">85</span>
                        <span className="text-lg text-muted-foreground font-semibold">/100</span>
                      </div>
                  </div>
                  <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden mb-6 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-purple-600 rounded-full shadow-lg" 
                      />
                  </div>
                  <Button className="w-full font-bold h-12 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                    View Full Report →
                  </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}