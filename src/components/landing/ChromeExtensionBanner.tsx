import { motion } from "framer-motion";
import { Chrome, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChromeExtensionBanner() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#64748B] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#22C55E] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left side - Icon and badge */}
            <div className="flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#64748B] to-[#475569] blur-2xl opacity-50 animate-pulse" />

                {/* Chrome icon container */}
                <div className="relative bg-gradient-to-br from-[#64748B] to-[#475569] p-6 rounded-3xl shadow-2xl">
                  <Chrome className="h-16 w-16 text-white" />

                  {/* "NEW" badge */}
                  <div className="absolute -top-2 -right-2 bg-[#22C55E] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                    NEW
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Center - Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-[#F59E0B]" />
                  <span className="text-[#F59E0B] font-bold text-sm uppercase tracking-wide">
                    Just Launched
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  LinkedIn Match Scanner Extension
                </h2>

                <p className="text-lg text-white/80 mb-6 max-w-2xl">
                  See your ATS match score <span className="text-[#22C55E] font-bold">instantly</span> while browsing LinkedIn jobs.
                  Know which jobs you can win <span className="text-[#22C55E] font-bold">before</span> you apply.
                </p>

                {/* Features list */}
                <div className="flex flex-wrap gap-4 mb-6 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <Zap className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-white text-sm font-semibold">Real-time Match Score</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 text-[#64748B]" />
                    <span className="text-white text-sm font-semibold">Missing Keywords</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <Chrome className="h-4 w-4 text-[#22C55E]" />
                    <span className="text-white text-sm font-semibold">100% Free</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side - CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex-shrink-0"
            >
              <a
                href="https://chrome.google.com/webstore/detail/cvdebug-linkedin-scanner"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-[#64748B] to-[#475569] hover:from-[#475569] hover:to-[#334155] text-white shadow-2xl hover:shadow-slate-600/50 transition-all duration-300 group"
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Add to Chrome - Free
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>

              <p className="text-white/60 text-xs text-center mt-3">
                ⭐️ 4.9/5 rating • 1,000+ users
              </p>

              {/* Installation instructions link */}
              <a
                href="/blog/chrome-extension-install"
                className="block text-center text-white/80 hover:text-white text-sm mt-3 underline transition-colors"
              >
                How to install →
              </a>
            </motion.div>
          </div>

          {/* Bottom preview text */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-white/10 text-center"
          >
            <p className="text-white/60 text-sm">
              🔒 Your resume stays private, stored locally on your device. Never sent to external servers.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
