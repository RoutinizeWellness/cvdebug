import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

export function CTASection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-24 container mx-auto px-6">
      <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Ready to check your ATS score?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
            Get a clear diagnostic of your resume's technical performance. No subscriptions, just results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-base rounded-full font-bold text-primary shadow-xl hover:scale-105 transition-transform" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
              Optimize Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}