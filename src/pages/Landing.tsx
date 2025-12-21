import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/landing/Navbar";
import { HeroVisualizerSection } from "@/components/landing/HeroVisualizerSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

const apiAny: any = api;

export default function Landing() {
  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-primary/30 overflow-x-hidden">
      <Navbar />
      <HeroVisualizerSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}