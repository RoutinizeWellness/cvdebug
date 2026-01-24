import { motion } from "framer-motion";
import { Building2, Shield, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useI18n } from "@/contexts/I18nContext";

export function EnterpriseSection() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const features = [
    {
      icon: Users,
      title: t.pricing.enterprise.feature1,
      description: t.pricing.enterprise.feature1Desc,
    },
    {
      icon: Shield,
      title: t.pricing.enterprise.feature2,
      description: t.pricing.enterprise.feature2Desc,
    },
    {
      icon: Zap,
      title: t.pricing.enterprise.feature3,
      description: t.pricing.enterprise.feature3Desc,
    },
  ];

  return (
    <section className="py-24 relative bg-[#FFFFFF]" id="enterprise">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#64748B]/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="rounded-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
          {/* Gradient border effect */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#1E293B] to-transparent"></div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64748B]/10 border border-[#64748B]/20 mb-6"
              >
                <Building2 className="h-4 w-4 text-[#64748B]" />
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {t.pricing.enterprise.badge}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight text-[#1E293B] mb-4"
              >
                {t.pricing.enterprise.title}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E293B] to-[#64748B]">
                  {t.pricing.enterprise.subtitle}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#475569] text-lg mb-8 leading-relaxed"
              >
                {t.pricing.enterprise.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  onClick={() => window.open("mailto:enterprise@cvdebug.com", "_blank")}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-[#1E293B] to-[#64748B] px-6 py-3 text-white font-semibold shadow-[0_10px_40px_-10px_rgba(100,116,139,0.25)] hover:shadow-[0_10px_40px_-10px_rgba(100,116,139,0.4)] hover:scale-[1.02] transition-all border-0"
                >
                  <span className="mr-2">{t.pricing.enterprise.contactSales}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  onClick={() => navigate("/pricing")}
                  variant="outline"
                  className="px-6 py-3 rounded-lg border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] hover:border-[#64748B] transition-all"
                >
                  {t.pricing.enterprise.viewPricing}
                </Button>
              </motion.div>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#64748B]/10 border border-[#64748B]/20 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-[#64748B]" />
                  </div>
                  <div>
                    <h3 className="text-[#1E293B] font-semibold mb-1">{feature.title}</h3>
                    <p className="text-[#475569] text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
