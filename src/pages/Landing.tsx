import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeatureGridSection } from "@/components/landing/FeatureGridSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { DifferentiationSection } from "@/components/landing/DifferentiationSection";
import { Clock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Landing() {
  const betaStatus = useQuery(api.users.getBetaStatus);
  const claimed = betaStatus?.claimed ?? 47;
  const remaining = betaStatus?.remaining ?? 53;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      {/* Countdown Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 px-4 text-center text-xs md:text-sm font-bold tracking-wide shadow-md relative z-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
          <div className="flex items-center gap-2 animate-pulse">
            <Clock className="h-4 w-4" />
            <span>🔥 Hurry! {claimed}/100 spots claimed</span>
          </div>
          <div className="hidden md:block w-1 h-1 bg-white/50 rounded-full" />
          <div className="flex items-center gap-2">
            <span className="opacity-90">Only {remaining} spots left at <span className="text-white underline decoration-wavy decoration-white/50">$4.99</span></span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase">Price increasing soon</span>
          </div>
        </div>
      </div>

      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <DifferentiationSection />
        <HowItWorksSection />
        <FeatureGridSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
}