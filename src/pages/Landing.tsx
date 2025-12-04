import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Check, Image as ImageIcon, Search, Zap, Mail, Loader2, Star, Shield, Users } from "lucide-react";
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
              <img src="/logo.svg" alt="Logo" className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Screenshot Organizer</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
            <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="shadow-lg shadow-primary/20">
              Get Started
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
                ✨ Now with AI-Powered Analysis
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                Organize your chaos.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Instantly.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stop searching through thousands of "Screenshot 2024...". 
                We use AI to extract text, categorize, and make every screenshot searchable in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                  Start Organizing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent/50" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Learn More
                </Button>
              </div>
              
              {/* Hero Image / Visual */}
              <div className="mt-16 relative mx-auto max-w-5xl rounded-xl border border-border/50 bg-card/50 shadow-2xl backdrop-blur-sm p-2 md:p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                <div className="aspect-video rounded-lg bg-muted/50 overflow-hidden relative flex items-center justify-center border border-border/50">
                   <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8 opacity-50">
                      {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="bg-background rounded-lg shadow-sm border border-border/50 h-full w-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                      ))}
                   </div>
                   <div className="relative z-20 bg-background/80 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl max-w-sm text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Search className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Smart Search</p>
                          <p className="text-xs text-muted-foreground">Found in 0.2s</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-3/4 bg-muted rounded"></div>
                        <div className="h-2 w-1/2 bg-muted rounded"></div>
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
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to stay organized</h2>
              <p className="text-muted-foreground">Powerful features to help you manage your visual knowledge base.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Feature 
                icon={<Zap className="h-6 w-6" />}
                title="Instant OCR"
                description="Text is automatically extracted from every screenshot you upload, making it instantly searchable."
              />
              <Feature 
                icon={<Search className="h-6 w-6" />}
                title="Smart Search"
                description="Find that one receipt or code snippet from months ago just by typing what was in it."
              />
              <Feature 
                icon={<Check className="h-6 w-6" />}
                title="Auto Categorization"
                description="Screenshots are automatically tagged and organized into relevant categories using advanced AI."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Choose the plan that's right for you. No hidden fees.</p>
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
                <p className="mt-4 text-sm text-muted-foreground">Perfect for getting started.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> 100 Screenshots / month
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Basic OCR Extraction
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
                <p className="mt-4 text-sm text-muted-foreground">For power users who need more.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" /> Unlimited Screenshots
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" /> Advanced AI Analysis (Gemini)
                </li>
                <li className="flex items-center gap-3 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" /> Smart Categorization
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
                  Team <Users className="h-4 w-4" />
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">For teams and organizations.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Everything in Pro
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Shared Workspace
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary" /> Admin Controls
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
                Be the first to know when we release the desktop app and new AI features.
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
              <img src="/logo.svg" alt="Logo" className="h-3 w-3" />
            </div>
            <span className="font-bold text-sm">Screenshot Organizer</span>
          </div>
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Screenshot Organizer. All rights reserved.
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