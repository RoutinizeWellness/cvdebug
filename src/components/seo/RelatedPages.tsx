import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { getRelatedPages } from "@/data/seoStrategy";

interface RelatedPagesProps {
  currentUrl: string;
  category?: string;
}

export function RelatedPages({ currentUrl, category = "general" }: RelatedPagesProps) {
  const relatedPages = getRelatedPages(currentUrl);

  if (relatedPages.length === 0) return null;

  const getCategoryColor = (cat: string) => {
    const colors = {
      nursing: "from-emerald-500 to-cyan-500",
      tech: "from-[#1E293B] to-slate-500",
      finance: "from-[#1E293B] to-pink-500",
      general: "from-primary to-secondary"
    };
    return colors[cat as keyof typeof colors] || colors.general;
  };

  return (
    <section className="py-16 md:py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">More ATS Scanners</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            Explore Other Industry-Specific Scanners
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each scanner is optimized for specific roles with industry keywords and ATS requirements
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPages.map((page, idx) => (
            <motion.div
              key={page.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={page.url}>
                <div className="glass-panel rounded-xl p-6 border border-slate-800 hover:border-primary/50 transition-all group cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(page.category)} bg-opacity-10 flex items-center justify-center`}>
                      <span className="text-xl">
                        {page.category === 'nursing' ? '🏥' : page.category === 'tech' ? '💻' : '📊'}
                      </span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {page.title.replace(' | CVDebug', '')}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {page.keywords.slice(0, 2).map((keyword, kidx) => (
                      <span
                        key={kidx}
                        className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400"
                      >
                        {keyword.split(' ').slice(0, 2).join(' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View All Industry Scanners
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
