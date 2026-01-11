import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewHeroSection } from "@/components/landing/NewHeroSection";
import { NewSocialProofSection } from "@/components/landing/NewSocialProofSection";
import { ComparisonVisualSection } from "@/components/landing/ComparisonVisualSection";
import { NewFeaturesGrid } from "@/components/landing/NewFeaturesGrid";
import { EnterpriseSection } from "@/components/landing/EnterpriseSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { NewFooter } from "@/components/landing/NewFooter";
import { useEffect } from "react";
import { updatePageSEO } from "@/lib/seo";

export default function Landing() {
  useEffect(() => {
    // Dynamic SEO for homepage - uses the main keywords from index.html
    updatePageSEO({
      title: 'Free ATS Resume Scanner & Checker | Beat ATS in 10 Seconds | CVDebug',
      description: 'Free ATS resume scanner trusted by 1000+ job seekers. See exactly what ATS robots see with Robot View technology. Get your ATS score, keyword analysis, and formatting fixes in 10 seconds. Beat applicant tracking systems.',
      keywords: [
        'ATS resume scanner',
        'free ATS checker',
        'applicant tracking system test',
        'resume parser online',
        'ATS optimization',
        'resume keyword analyzer',
        'ATS score',
        'resume robot view',
        'beat ATS',
        'ATS friendly resume',
        'resume formatting checker',
        'ATS compatibility',
        'job application tracker',
        'resume screening tool',
        'CV debugger',
        'ATS pass rate',
        'resume match score',
        'keyword optimization',
        'hiring software scanner',
        'recruitment system checker',
        'resume ATS scan',
        'career tools',
        'job search optimizer'
      ],
      canonical: 'https://cvdebug.com/',
      ogImage: 'https://cvdebug.com/og-image.jpg',
    });
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
