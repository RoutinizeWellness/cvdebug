import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewHeroSection } from "@/components/landing/NewHeroSection";
import { NewSocialProofSection } from "@/components/landing/NewSocialProofSection";
import { ComparisonVisualSection } from "@/components/landing/ComparisonVisualSection";
import { NewFeaturesGrid } from "@/components/landing/NewFeaturesGrid";
import { EnterpriseSection } from "@/components/landing/EnterpriseSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { NewFooter } from "@/components/landing/NewFooter";
import { useEffect } from "react";

export default function Landing() {
  useEffect(() => {
    document.title = "Free ATS Resume Scanner & Robot View | CVDebug";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Stop getting ghosted. See what hiring bots see with our unique Robot View. Scan your resume for ATS parsing errors and get a keyword sniper report in 10 seconds."
      );
    }
  }, []);

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
        <EnterpriseSection />
        <FinalCTASection />
      </main>

      <NewFooter />
    </div>
  );
}
