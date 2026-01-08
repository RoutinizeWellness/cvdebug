import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export function FinalCTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative isolate mt-16 px-6 py-24 sm:mt-24 sm:px-16 lg:px-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.900),#020617)] opacity-80"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card mx-auto max-w-4xl rounded-3xl p-8 text-center sm:p-16 relative overflow-hidden"
      >
        {/* Decorative glow behind button */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 bg-primary/30 blur-[100px]"></div>

        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to debug your career?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
          Join 10,000+ developers who fixed their parsing errors and doubled
          their interview rate.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="glow-button w-full max-w-md rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:from-primary hover:to-indigo-500 sm:w-auto"
          >
            Check My Visibility (Free Scan)
          </Button>
          <p className="text-xs text-slate-500">
            No credit card required • GDPR Compliant • Instant Result
          </p>
        </div>
      </motion.div>
    </section>
  );
}
