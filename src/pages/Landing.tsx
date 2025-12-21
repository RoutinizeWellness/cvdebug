import { Navbar } from "@/components/landing/Navbar";
import { HeroVisualizerSection } from "@/components/landing/HeroVisualizerSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12 relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-hero-glow pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-24">
          <HeroVisualizerSection />
          <HowItWorksSection />
          <FeaturesSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}