import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/contexts/I18nContext";

export function FinalCTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  return (
    <section className="relative isolate mt-16 px-6 py-24 sm:mt-24 sm:px-16 lg:px-24 bg-[#FFFFFF]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,#F8FAFC_0%,#FFFFFF_100%)] opacity-80"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] mx-auto max-w-4xl rounded-3xl p-8 text-center sm:p-16 relative overflow-hidden"
      >
        {/* Decorative glow behind button */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 bg-[#3B82F6]/30 blur-[100px]"></div>

        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">
          {t.landing.finalCta.heading}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#475569]">
          {t.landing.finalCta.description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-y-6">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="w-full max-w-md rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] px-8 py-4 text-lg font-bold text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] transition-all hover:scale-105 hover:from-[#8B5CF6] hover:to-[#3B82F6] border-0 sm:w-auto"
          >
            {t.landing.finalCta.button}
          </Button>
          <p className="text-xs text-[#64748B]">
            {t.landing.finalCta.footer}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
