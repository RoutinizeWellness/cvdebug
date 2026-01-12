import { motion } from "framer-motion";
import { Building2, Shield, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function EnterpriseSection() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Team Management",
      description: "Centralized dashboard for HR teams to track all candidate applications",
    },
    {
      icon: Shield,
      title: "SOC 2 Compliant",
      description: "Enterprise-grade security with SSO and role-based access control",
    },
    {
      icon: Zap,
      title: "API Access",
      description: "Integrate ATS scanning directly into your recruitment workflow",
    },
  ];

  return (
    <section className="py-24 relative" id="enterprise">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden border-teal-500/20">
          {/* Gradient border effect */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6"
              >
                <Building2 className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  Enterprise
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
              >
                Scale Your Hiring<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Without Compromise
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-400 text-lg mb-8 leading-relaxed"
              >
                Built for recruiting teams that process thousands of applications.
                Get volume discounts, dedicated support, and custom integrations.
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
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
                >
                  <span className="mr-2">Contact Sales</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  onClick={() => navigate("/pricing")}
                  variant="outline"
                  className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
                >
                  View Pricing
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
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
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
