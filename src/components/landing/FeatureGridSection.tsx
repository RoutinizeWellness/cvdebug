import { Shield, Target, BarChart3, CheckCircle2, Linkedin, FileSearch, XCircle, AlertTriangle } from "lucide-react";
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
            <div className="relative bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-primary/20 transition-shadow duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <FileSearch className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Analysis Report</h3>
                        <p className="text-xs text-muted-foreground">Generated just now</p>
                    </div>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1">Passed</Badge>
              </div>
              
              <div className="space-y-3">
                {[
                  { label: "File Format", status: "Compatible", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
                  { label: "Contact Info", status: "Found", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
                  { label: "Job Title Match", status: "Exact Match", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
                  { label: "Education", status: "Listed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
                  { label: "Soft Skills", status: "3 Missing", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
                  { label: "Hard Skills", status: "Critical Missing", icon: XCircle, color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${item.border} ${item.bg} transition-colors`}>
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="font-medium text-sm md:text-base">{item.label}</span>
                    </div>
                    <span className={`text-xs md:text-sm font-bold ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-muted-foreground">Overall Score</span>
                      <span className="text-2xl font-black text-foreground">85<span className="text-sm text-muted-foreground font-normal">/100</span></span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-600 w-[85%] rounded-full" />
                  </div>
                  <Button className="w-full font-bold h-12 text-base shadow-lg shadow-primary/10" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                    View Full Report
                  </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}