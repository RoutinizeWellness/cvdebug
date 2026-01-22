import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewHeroSection } from "@/components/landing/NewHeroSection";
import { NewSocialProofSection } from "@/components/landing/NewSocialProofSection";
import { ComparisonVisualSection } from "@/components/landing/ComparisonVisualSection";
import { ProductShowcaseGallery } from "@/components/landing/ProductShowcaseGallery";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { SEOFAQSection } from "@/components/landing/SEOFAQSection";
import { EnterpriseSection } from "@/components/landing/EnterpriseSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { NewFooter } from "@/components/landing/NewFooter";
import { useEffect } from "react";
import { usePresetSEO } from "@/hooks/useIntelligentSEO";

export default function Landing() {
  // Intelligent SEO with automatic optimization
  usePresetSEO('landing', {
    canonicalUrl: 'https://cvdebug.com/',
    image: 'https://cvdebug.com/og-image.jpg',
    socialProof: 'Trusted by 50,000+ job seekers worldwide'
  });

  useEffect(() => {
    // Set body background safely to avoid hydration mismatches
    const originalBackground = document.body.style.background;
    document.body.style.background = '#FFFFFF';

    return () => {
      document.body.style.background = originalBackground;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-blue-100 antialiased mesh-gradient">
      <NewNavbar />

      <main className="flex-grow pt-20 relative z-10">
        <NewHeroSection />
        <NewSocialProofSection />
        <ProductShowcaseGallery />
        <ComparisonVisualSection />
        <TestimonialsSection />
        <SEOFAQSection />
        <EnterpriseSection />
        <FinalCTASection />
      </main>

      <NewFooter />
    </div>
  );
}