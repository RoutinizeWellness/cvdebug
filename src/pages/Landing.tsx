import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileText, Upload, Zap, Star, Shield, BarChart3, Target, Award, ChevronRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const joinWaitlist = useMutation(api.waitlist.join);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await joinWaitlist({ email });
      toast.success("You've been added to the waitlist!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Resume ATS Optimizer</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground font-medium">
              Sign In
            </Button>
            <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="rounded-full px-6 shadow-lg shadow-primary/20 font-bold">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50"></div>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  New: AI-Powered Analysis
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
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <p>Trusted by 1,000+ job seekers</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 max-w-md mx-auto lg:ml-auto rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute -top-6 -right-6 bg-green-500 text-white p-4 rounded-2xl shadow-xl flex flex-col items-center animate-bounce duration-[3000ms]">
                    <span className="text-3xl font-black">92</span>
                    <span className="text-xs font-bold uppercase">Score</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 border-b border-border pb-4">
                      <div className="h-12 w-12 bg-muted rounded-full flex-shrink-0"></div>
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-2/3 bg-muted rounded"></div>
                        <div className="h-3 w-1/3 bg-muted/50 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Impact</span>
                        <span className="text-green-500 font-bold">High</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[90%] rounded-full"></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Brevity</span>
                        <span className="text-yellow-500 font-bold">Medium</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[60%] rounded-full"></div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-muted-foreground">Style</span>
                        <span className="text-green-500 font-bold">High</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[95%] rounded-full"></div>
                      </div>
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

        {/* Stats / Trust */}
        <section className="py-12 border-y border-border/50 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-black text-foreground">75%</p>
                <p className="text-sm text-muted-foreground mt-1">Resumes rejected by ATS</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-foreground">2x</p>
                <p className="text-sm text-muted-foreground mt-1">More interviews</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-foreground">10s</p>
                <p className="text-sm text-muted-foreground mt-1">Average analysis time</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-black text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground mt-1">AI Availability</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">How it works</h2>
              <p className="text-xl text-muted-foreground">
                Our AI analyzes your resume exactly like a recruiter's ATS would.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent border-t border-dashed border-muted-foreground/30"></div>
              
              <div className="relative flex flex-col items-center text-center group">
                <div className="h-24 w-24 bg-background border-2 border-border rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 z-10">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Upload Resume</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload your PDF, Word doc, or image. We extract the text instantly.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="h-24 w-24 bg-background border-2 border-border rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 z-10">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. AI Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We check for keywords, formatting errors, and section completeness.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="h-24 w-24 bg-background border-2 border-border rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300 z-10">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Get Hired</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Fix the issues, beat the ATS, and get invited to the interview.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
                  Why your resume is getting rejected
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Most companies use Applicant Tracking Systems (ATS) to filter resumes. If you don't have the right keywords or formatting, a human never sees your application.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Formatting Errors</h4>
                      <p className="text-muted-foreground">Complex layouts, columns, and graphics confuse ATS parsers.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <Target className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Missing Keywords</h4>
                      <p className="text-muted-foreground">Not matching the exact skills listed in the job description.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Low Content Density</h4>
                      <p className="text-muted-foreground">Vague bullet points that don't show impact or metrics.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-xl">Analysis Report</h3>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Passed</Badge>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "File Format", status: "Compatible", icon: CheckCircle2, color: "text-green-500" },
                      { label: "Contact Info", status: "Found", icon: CheckCircle2, color: "text-green-500" },
                      { label: "Job Title Match", status: "Exact Match", icon: CheckCircle2, color: "text-green-500" },
                      { label: "Education", status: "Listed", icon: CheckCircle2, color: "text-green-500" },
                      { label: "Soft Skills", status: "3 Missing", icon: Shield, color: "text-yellow-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3">
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.status}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-8 font-bold" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                    View Full Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 container mx-auto px-6">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to land your dream job?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join thousands of job seekers who have optimized their resumes and increased their interview rate.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" className="h-14 px-8 text-base rounded-full font-bold text-primary" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                  Optimize Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 bg-background">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Resume ATS Optimizer</span>
            </div>
            <div className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Resume ATS Optimizer. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}