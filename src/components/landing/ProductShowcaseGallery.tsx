import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Zap, Shield } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useI18n } from "@/contexts/I18nContext";

/**
 * Premium Product Showcase Gallery
 * High-quality mockups for Product Hunt launch
 */
export function ProductShowcaseGallery() {
  const { t } = useI18n();

  const showcaseItems = [
    {
      title: t.showcase.robotTech,
      description: t.showcase.robotDesc,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      icon: Sparkles,
      color: "#8B5CF6",
      stats: "95% accuracy rate"
    },
    {
      title: t.showcase.instantScore,
      description: t.showcase.instantDesc,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      icon: Zap,
      color: "#8B5CF6",
      stats: "10s scan time"
    },
    {
      title: t.showcase.smartKeyword,
      description: t.showcase.smartDesc,
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      icon: TrendingUp,
      color: "#3B82F6",
      stats: "1000+ keywords"
    },
    {
      title: t.showcase.enterpriseSec,
      description: t.showcase.enterpriseDesc,
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      icon: Shield,
      color: "#10B981",
      stats: "SOC 2 compliant"
    }
  ];

  return (
    <section id="features" className="py-24 px-4 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-[#3B82F6]/5 via-transparent to-transparent opacity-40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 mb-6">
            <Sparkles className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-sm font-semibold text-[#3B82F6]">{t.showcase.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E293B] mb-4 sm:mb-6 px-4">
            {t.showcase.heading}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] mt-2">
              {t.showcase.subheading}
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-[#475569] max-w-2xl mx-auto px-4">
            {t.showcase.description}
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
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
                <div className="relative h-full bg-[#FFFFFF] backdrop-blur-xl border border-[#E2E8F0] rounded-2xl overflow-hidden hover:border-[#3B82F6]/50 transition-all duration-500">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-[#FFFFFF]/60 to-transparent"></div>

                    {/* Stats badge */}
                    <div className="absolute top-4 right-4 bg-[#FFFFFF]/80 backdrop-blur-sm border border-[#E2E8F0] rounded-full px-4 py-2">
                      <span className="text-xs font-bold text-[#3B82F6]">{item.stats}</span>
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
                      <h3 className="text-xl font-bold text-[#1E293B]">{item.title}</h3>
                    </div>

                    <p className="text-[#475569] leading-relaxed">
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
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#8B5CF6]/20 to-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-2xl p-6 sm:p-8">
            <div className="text-left">
              <p className="text-[#1E293B] font-bold text-lg mb-1">{t.showcase.ctaBanner}</p>
              <p className="text-[#475569] text-sm">{t.showcase.ctaSubtext}</p>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:opacity-90 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              {t.showcase.ctaButton}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
