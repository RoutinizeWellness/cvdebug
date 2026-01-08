import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewHeroSection } from "@/components/landing/NewHeroSection";
import { NewSocialProofSection } from "@/components/landing/NewSocialProofSection";
import { ComparisonVisualSection } from "@/components/landing/ComparisonVisualSection";
import { NewFeaturesGrid } from "@/components/landing/NewFeaturesGrid";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { NewFooter } from "@/components/landing/NewFooter";

export default function Landing() {
  return (
    <div className="dark min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/30 selection:text-white antialiased">
      <style>{`
        body {
          background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
        }
      `}</style>

      <NewNavbar />

      <main className="flex-grow pt-16">
        <NewHeroSection />
        <NewSocialProofSection />
        <ComparisonVisualSection />
        <NewFeaturesGrid />
        <FinalCTASection />
      </main>

      <NewFooter />
    </div>
  );
}
