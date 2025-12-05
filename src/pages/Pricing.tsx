import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Rocket } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = (plan?: string) => {
    if (isAuthenticated) {
      navigate(plan ? `/dashboard?plan=${plan}` : "/dashboard");
    } else {
      navigate(plan ? `/auth?plan=${plan}` : "/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-muted-foreground">
                    No subscriptions. Just pay for what you need.
                    <span className="block mt-2 text-primary font-bold">Beta Launch Offer Active!</span>
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                {/* Free Tier */}
                <div className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-6 hover:border-primary/50 transition-colors">
                    <div className="space-y-2">
                        <h3 className="font-bold text-2xl text-muted-foreground">FREE Preview</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black">$0</span>
                        </div>
                        <p className="text-muted-foreground">Basic scan to see where you stand.</p>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm">Basic Score (0-100)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm">Unlimited uses</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm">No credit card</span>
                        </div>
                    </div>
                    
                    <Button variant="outline" className="w-full h-12 font-bold" onClick={() => handleGetStarted()}>
                        Try Free
                    </Button>
                </div>

                {/* Single Scan */}
                <div className="rounded-2xl border-2 border-primary bg-card p-8 flex flex-col gap-6 relative shadow-2xl shadow-primary/10 scale-105 z-10">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-lg uppercase tracking-wider shadow-sm">
                        BETA ★
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="font-bold text-2xl text-primary flex items-center gap-2">
                            Single Scan <Zap className="h-5 w-5 fill-primary" />
                        </h3>
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black">$4.99</span>
                                <span className="text-xl text-muted-foreground line-through decoration-red-500/50">$9.99</span>
                            </div>
                            <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
                                50% off!
                            </p>
                            <p className="text-xs font-bold text-orange-600 mt-1 flex items-center gap-1">
                                <Rocket className="h-3 w-3" /> Limited: 53/100 claimed
                            </p>
                        </div>
                        <p className="text-muted-foreground">Beat the ATS for one specific job.</p>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        {[
                            "Full ATS Analysis",
                            "Missing Keywords",
                            "Format Check",
                            "PDF Report"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Check className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                    
                    <Button 
                        className="w-full h-12 font-bold text-lg shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                        onClick={() => handleGetStarted("single_scan")}
                    >
                        Get Full Analysis
                    </Button>
                </div>

                {/* Bulk Pack */}
                <div className="rounded-2xl border border-border bg-card p-8 flex flex-col gap-6 hover:border-primary/50 transition-colors">
                    <div className="space-y-2">
                        <h3 className="font-bold text-2xl text-foreground flex items-center gap-2">
                            Bundle (5 Scans) <Building2 className="h-5 w-5" />
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black">$19.99</span>
                            <span className="text-xl text-muted-foreground line-through">$49.95</span>
                        </div>
                        <p className="text-sm font-bold text-green-600">Save $25!</p>
                        <p className="text-muted-foreground">Perfect for active job seekers.</p>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                        {[
                            "5 Full Scans",
                            "Test different versions",
                            "Apply to 5+ jobs",
                            "$4/scan (save $25!)"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Check className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                    
                    <Button variant="outline" className="w-full h-12 font-bold" onClick={() => handleGetStarted("bulk_pack")}>
                        Buy Bundle
                    </Button>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}