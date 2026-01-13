import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Shield } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";

/**
 * Premium Product Showcase Gallery
 * High-quality mockups for Product Hunt launch
 */
export function ProductShowcaseGallery() {
  const showcaseItems = [
    {
      title: "Robot View Technology",
      description: "See exactly what ATS robots see - no guessing",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      icon: Sparkles,
      color: "#14B8A6",
      stats: "95% accuracy rate"
    },
    {
      title: "Instant ATS Score",
      description: "Get your compatibility score in 10 seconds",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      icon: Zap,
      color: "#8B5CF6",
      stats: "10s scan time"
    },
    {
      title: "Smart Keyword Analysis",
      description: "AI-powered matching with job descriptions",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      icon: TrendingUp,
      color: "#3B82F6",
      stats: "1000+ keywords"
    },
    {
      title: "Enterprise Security",
      description: "Your data stays private and secure",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      icon: Shield,
      color: "#10B981",
      stats: "SOC 2 compliant"
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Product Hunt Special</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-4">
            Beat ATS Systems
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-400 to-cyan-400 mt-2">
              In 10 Seconds
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            See your resume the way robots see it. Get instant feedback and land more interviews.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {showcaseItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-card/40 backdrop-blur-xl border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500">
                  {/* Image with overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <OptimizedImage
                      src={item.image}
                      alt={item.title}
                      className="transition-transform duration-700 group-hover:scale-110"
                      width={800}
                      height={600}
                      priority={index < 2} // Load first 2 images immediately
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

                    {/* Stats badge */}
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-full px-4 py-2">
                      <span className="text-xs font-bold text-primary">{item.stats}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          backgroundColor: `${item.color}15`,
                          border: `1px solid ${item.color}30`
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: item.color }} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {/* Hover glow effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${item.color}10, transparent 70%)`
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-primary/20 via-teal-500/20 to-cyan-500/20 border border-primary/30 rounded-2xl p-6 sm:p-8">
            <div className="text-left">
              <p className="text-white font-bold text-lg mb-1">Product Hunt Launch Special</p>
              <p className="text-muted-foreground text-sm">Use code <span className="text-primary font-mono font-bold">PH50</span> for 50% off (48 hours only)</p>
            </div>
            <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
              Try Free Scan →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
