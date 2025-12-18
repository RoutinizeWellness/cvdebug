import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/landing/Navbar";
import { HeroVisualizerSection } from "@/components/landing/HeroVisualizerSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { FeaturesBentoSection } from "@/components/landing/FeaturesBentoSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";

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
      <FeaturesBentoSection />
      <PricingSection />
      <FAQSection />
      
      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-6 rounded bg-[#7c3bed]/20 text-[#7c3bed] border border-[#7c3bed]/30">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">CVDebug</span>
          </div>
          <div className="flex items-center gap-8">
            <a className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-gray-500 hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1" href="#">
              Twitter <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
            </a>
          </div>
          <div className="text-xs text-gray-600">
            © 2024 CVDebug. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}