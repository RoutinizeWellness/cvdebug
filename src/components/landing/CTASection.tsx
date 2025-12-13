import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 container mx-auto px-6">
      <div className="bg-gradient-to-br from-primary via-primary to-purple-600 rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/30">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold mb-6 border border-white/30">
            <span className="text-lg">🎮</span>
            Pay once, use anytime
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">
            Ready to beat the ATS?
          </h2>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
            Get ML-enhanced analysis with TF-IDF keyword weighting, format detection, and actionable fixes. <span className="font-bold text-white">1 scan = 1 credit.</span> No subscriptions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-14 md:h-16 px-10 text-base md:text-lg rounded-full font-black text-primary shadow-2xl hover:scale-105 transition-all hover:shadow-white/20" 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            >
              Start Your First Scan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-6">
            ✨ First scan free • Credits never expire • Instant results
          </p>
        </div>
      </div>
    </section>
  );
}