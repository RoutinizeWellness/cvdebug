import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileText, Search, Zap, Mail, Loader2, Star, Shield, Users, Upload, BarChart } from "lucide-react";
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
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">Resume ATS Optimizer</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="shadow-lg shadow-primary/20">
              Optimize My Resume
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full border-primary/20 bg-primary/5 text-primary mb-4">
                ✨ Beat the ATS Algorithms
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                Get hired faster with
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">AI Resume Optimization.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stop getting rejected by robots. Upload your resume, get an instant ATS score, and receive AI-powered feedback to land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                  Analyze My Resume Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  How it Works
                </Button>
              </div>
              
              {/* Hero Image / Visual */}
              <div className="mt-16 relative mx-auto max-w-5xl rounded-xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-sm p-2 md:p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                <div className="aspect-video rounded-lg bg-muted/50 overflow-hidden relative flex items-center justify-center border border-border/50">
                   <div className="absolute inset-0 grid grid-cols-2 gap-8 p-8 opacity-50">
                      <div className="bg-background rounded-lg shadow-sm border border-border/50 h-full w-full p-4 space-y-2">
                        <div className="h-4 w-1/3 bg-muted rounded"></div>
                        <div className="h-2 w-full bg-muted rounded"></div>
                        <div className="h-2 w-full bg-muted rounded"></div>
                        <div className="h-2 w-2/3 bg-muted rounded"></div>
                      </div>
                      <div className="bg-background rounded-lg shadow-sm border border-border/50 h-full w-full p-4 space-y-2">
                         <div className="h-4 w-1/3 bg-muted rounded"></div>
                         <div className="h-2 w-full bg-muted rounded"></div>
                      </div>
                   </div>
                   <div className="relative z-20 bg-background/90 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl max-w-sm text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-lg">92</span>
                        </div>
                        <div>
                          <p className="font-bold text-lg">ATS Score: Excellent</p>
                          <p className="text-xs text-muted-foreground">Ready for application</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                           <Check className="h-4 w-4 text-green-500" /> <span>Keywords Optimized</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                           <Check className="h-4 w-4 text-green-500" /> <span>Formatting Verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                           <Check className="h-4 w-4 text-green-500" /> <span>Action Verbs Strong</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Optimize every aspect of your application</h2>
              <p className="text-muted-foreground">Powerful AI tools to help you stand out from the crowd.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Feature 
                icon={<BarChart className="h-6 w-6" />}
                title="Instant ATS Scoring"
                description="Get a score from 0-100 on how well your resume parses against standard Applicant Tracking Systems."
              />
              <Feature 
                icon={<Zap className="h-6 w-6" />}
                title="AI Keyword Analysis"
                description="Identify missing keywords and skills that recruiters in your industry are looking for."
              />
              <Feature 
                icon={<FileText className="h-6 w-6" />}
                title="Smart Categorization"
                description="Automatically organize your resume versions by job role (Engineering, Product, Sales, etc)."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Invest in your career for less than the cost of a lunch.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="relative flex flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Free</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">Basic analysis to get started.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> 3 Resume Scans / month
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Basic ATS Score
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Standard Support
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative flex flex-col p-8 bg-card border-2 border-primary rounded-2xl shadow-xl scale-105 z-10">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  Pro <Star className="h-4 w-4 fill-primary" />
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">For serious job seekers.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" /> Unlimited Resume Scans
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" /> Detailed AI Feedback
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" /> Keyword Optimization
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" /> Priority Support
                </li>
              </ul>
              <Button className="w-full shadow-lg shadow-primary/20" onClick={() => navigate("/auth")}>
                Start Pro Trial
              </Button>
            </div>

            {/* Team Plan */}
            <div className="relative flex flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Agency <Users className="h-4 w-4" />
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">For career coaches & agencies.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Everything in Pro
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Multiple Client Profiles
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Bulk Upload
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> API Access
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                Contact Sales
              </Button>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section className="py-24 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-xl mx-auto space-y-8">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto rotate-3">
                <Mail className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Join the Waitlist</h2>
              <p className="text-lg text-muted-foreground">
                Be the first to know when we release the Chrome Extension and LinkedIn integration.
              </p>
              <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-background"
                />
                <Button type="submit" size="lg" className="h-12 px-8" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join Now"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                No spam, ever. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary/10 rounded flex items-center justify-center">
              <FileText className="h-3 w-3 text-primary" />
            </div>
            <span className="font-bold text-sm">Resume ATS Optimizer</span>
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
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300">
      <div className="h-12 w-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}