import { motion } from "framer-motion";
import { TrendingUp, Shield, Zap, Lock } from "lucide-react";

export function StatsSection() {
  const stats = [
    { value: "75%", label: "Resumes rejected by ATS", icon: TrendingUp, color: "text-red-500" },
    { value: "No BS", label: "Transparent Pricing", icon: Shield, color: "text-green-500" },
    { value: "10s", label: "Average analysis time", icon: Zap, color: "text-yellow-500" },
    { value: "Secure", label: "Data deleted in 30 days", icon: Lock, color: "text-slate-600" },
  ];

  return (
    <section className="py-12 md:py-16 border-y border-border/50 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="px-2 md:px-4 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color.replace('text-', 'from-')}/10 ${stat.color.replace('text-', 'to-')}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-black text-foreground tracking-tight group-hover:scale-105 transition-transform">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}