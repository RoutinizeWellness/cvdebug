import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

export function NewHeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [savedCount, setSavedCount] = useState(141);
  const [unlockedToday, setUnlockedToday] = useState(7);

  useEffect(() => {
    // Simulate live counter updates
    const savedInterval = setInterval(() => {
      setSavedCount(prev => {
        const change = Math.random() > 0.7 ? 1 : 0;
        return prev + change;
      });
    }, 15000);

    const todayInterval = setInterval(() => {
      setUnlockedToday(prev => {
        const change = Math.random() > 0.6 ? 1 : 0;
        return Math.min(prev + change, 15);
      });
    }, 20000);

    return () => {
      clearInterval(savedInterval);
      clearInterval(todayInterval);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl py-12 sm:py-20 lg:py-24">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 flex justify-center px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate bg-white shadow-soft">
            <div className="relative flex h-2 w-2">
              <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">
              SYSTEM ONLINE v2.4.0
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-center px-4 max-w-5xl mx-auto"
        >
          <span className="text-charcoal">
            Stop being invisible to{" "}
          </span>
          <br className="hidden sm:block" />
          <span
            className="inline-block"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            hiring bots.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl leading-8 text-body max-w-3xl mx-auto px-4 text-center"
        >
          The standard PDF you're sending is unreadable to 70% of ATS systems.
          See what the bot sees in 10 seconds and fix your parse rate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 px-4 max-w-2xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={() => navigate("/preview")}
              className="gradient-button relative flex h-14 w-full sm:min-w-[240px] items-center justify-center gap-2 overflow-hidden rounded-lg px-8 text-lg font-bold text-white border-0 group shadow-soft"
            >
              <span className="relative z-10">See Robot View - Free</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="group flex h-14 w-full sm:min-w-[240px] items-center justify-center gap-2 rounded-lg border-2 border-slate bg-white px-8 text-base font-semibold text-charcoal hover:bg-gray-50 transition-all shadow-soft"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Sign Up for Full Access</span>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-sm text-body px-4 text-center"
        >
          No credit card • No sign up required • Instant results in 10 seconds
        </motion.p>
      </div>
    </section>
  );
}
