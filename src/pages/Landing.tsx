import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/landing/Navbar";
import { HeroVisualizerSection } from "@/components/landing/HeroVisualizerSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { FeaturesBentoSection } from "@/components/landing/FeaturesBentoSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

const apiAny: any = api;

export default function Landing() {
  const betaStatus = useQuery(apiAny.users.getBetaStatus);
  const claimed = betaStatus?.claimed ?? 47;
  const remaining = betaStatus?.remaining ?? 53;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
      <Navbar />
      <HeroVisualizerSection />
      <SocialProofSection />
      <HowItWorksSection />
      <FeaturesBentoSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}