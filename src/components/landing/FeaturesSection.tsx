import { Kanban, Target, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: Kanban,
      title: "Project Tracking",
      description: "Treat your job search like a product launch. Organize every application by stage with a built-in Kanban board specifically designed for high-volume applying.",
      visual: (
        <div className="mt-auto pt-4 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <div className="h-16 w-1/3 rounded bg-slate-800 border border-slate-700"></div>
          <div className="h-16 w-1/3 rounded bg-slate-800 border border-slate-700 translate-y-2"></div>
          <div className="h-16 w-1/3 rounded bg-slate-800 border border-slate-700"></div>
        </div>
      ),
      iconColor: "text-secondary"
    },
    {
      icon: Target,
      title: "Keyword Sniper",
      description: "Instantly compare your resume against job descriptions. We highlight missing keywords that the automated screeners are programmed to look for.",
      visual: (
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-yellow-500 w-[65%]"></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>MATCH SCORE</span>
            <span>65%</span>
          </div>
        </div>
      ),
      iconColor: "text-primary"
    },
    {
      icon: AlertTriangle,
      title: "Image Trap Monitor",
      description: "Detect unreadable graphics, hidden text boxes, and complex layouts that confuse parsing bots and get your resume auto-rejected.",
      visual: (
        <div className="mt-auto pt-4 relative h-12 border border-dashed border-red-500/30 bg-red-500/5 rounded flex items-center justify-center">
          <span className="text-xs text-red-400 font-mono flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> HIDDEN LAYER DETECTED
          </span>
        </div>
      ),
      iconColor: "text-red-400"
    }
  ];

  return (
    <section className="flex flex-col gap-10 pb-20" id="features-grid">
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Smarter Application Tracking</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Everything you need to beat the ATS and land the interview, wrapped in a developer-friendly dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="glass-card p-6 rounded-xl flex flex-col gap-4 group hover:border-slate-600 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="size-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-2 group-hover:bg-slate-700 transition-colors">
              <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {feature.description}
            </p>
            {feature.visual}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
