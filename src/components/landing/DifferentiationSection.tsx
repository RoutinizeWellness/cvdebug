import { Shield, DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function DifferentiationSection() {
  const features = [
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "One-time payment of €4.99. No hidden fees, no recurring subscriptions, no surprises.",
      points: ["No hidden fees", "No forced subscriptions", "Pay once, use forever"]
    },
    {
      icon: AlertTriangle,
      title: "Honest Limitations",
      description: "We are a diagnostic tool, not a magic wand. We fix technical errors, but content is king.",
      points: ["\"Won't work for everyone\"", "\"ATS is one factor, not magic\"", "Realistic expectations"]
    },
    {
      icon: Shield,
      title: "Privacy-First",
      description: "Your resume is personal. We treat it that way. We don't sell data or train AI on it.",
      points: ["Data deleted after 30 days", "Not used for AI training", "No data mining"]
    },
    {
      icon: CheckCircle2,
      title: "No BS Claims",
      description: "We don't promise interviews. We promise to fix the technical blockers stopping you.",
      points: ["We show exactly what we check", "No \"guaranteed interviews\"", "Technical validation only"]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Why We're Different
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The resume industry is full of subscription traps and empty promises. We built the opposite.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="bg-background border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm font-medium text-foreground/80">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}