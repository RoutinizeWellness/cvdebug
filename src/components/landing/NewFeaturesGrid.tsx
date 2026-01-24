import { motion } from "framer-motion";
import { ShieldCheck, Target, Sparkles } from "lucide-react";

export function NewFeaturesGrid() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Integrity Audit",
      description:
        "We scan for invisible characters, corrupted fonts, and layer issues that cause immediate rejection.",
      color: "blue",
    },
    {
      icon: Target,
      title: "Keyword Sniper",
      description:
        "Identify missing keywords from the job description and inject them naturally where bots look first.",
      color: "purple",
    },
    {
      icon: Sparkles,
      title: "AI Writing Forge",
      description:
        "Automatically restructure bullets using the Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).",
      color: "blue",
    },
  ];

  const iconColors = {
    blue: "bg-[#DBEAFE] text-[#64748B]",
    purple: "bg-[#F3E8FF] text-[#1E293B]",
  };

  return (
    <section className="py-24 relative bg-[#FFFFFF]" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">
            Total Visibility Control
          </h2>
          <p className="mt-4 text-lg text-[#475569]">
            Our engine reverse-engineers the top ATS algorithms (Greenhouse,
            Lever, Workday) to ensure your data survives the parse.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl p-8 bg-[#FFFFFF] border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <motion.div
                className={`mb-6 inline-flex size-12 items-center justify-center rounded-lg ${
                  iconColors[feature.color as keyof typeof iconColors]
                }`}
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>

              <motion.h3
                className="text-lg font-semibold leading-8 text-[#1E293B]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {feature.title}
              </motion.h3>

              <motion.p
                className="mt-2 text-base leading-7 text-[#475569]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
