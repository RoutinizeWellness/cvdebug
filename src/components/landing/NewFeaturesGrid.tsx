import { motion } from "framer-motion";
import { ShieldCheck, Target, Sparkles } from "lucide-react";

export function NewFeaturesGrid() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Technical Integrity Check",
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
      title: "AI Rewrite Formula",
      description:
        "Automatically restructure bullets using the Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).",
      color: "teal",
    },
  ];

  const glowColors = {
    blue: "from-blue-500/10 to-blue-500/20",
    purple: "from-purple-500/10 to-purple-500/20",
    teal: "from-teal-500/10 to-teal-500/20",
  };

  const iconColors = {
    blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
    teal: "bg-teal-500/10 text-teal-400 ring-teal-500/20",
  };

  return (
    <section className="py-24 relative" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Total Visibility Control
          </h2>
          <p className="mt-4 text-lg text-slate-400">
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
              className="glass-card group relative overflow-hidden rounded-2xl p-8 hover:bg-slate-800/50 transition-colors duration-300"
            >
              <div
                className={`absolute top-0 right-0 -mr-8 -mt-8 size-32 rounded-full bg-gradient-to-br ${
                  glowColors[feature.color as keyof typeof glowColors]
                } blur-2xl transition-all group-hover:scale-110`}
              ></div>
              <div
                className={`mb-6 inline-flex size-12 items-center justify-center rounded-lg ring-1 ring-inset ${
                  iconColors[feature.color as keyof typeof iconColors]
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold leading-8 text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-base leading-7 text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
