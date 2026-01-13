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
    <section className="relative isolate overflow-hidden px-6 pt-14 lg:px-8 bg-deep-mesh-subtle">
      {/* Background effects with Power Gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 0.2,
            scale: 1,
            rotate: [20, 23, 20]
          }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 1.2 },
            rotate: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 gradient-power sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] opacity-30"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></motion.div>
      </div>

      {/* Additional brand element - subtle circuit pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(174, 72%, 48%) 1px, transparent 1px),
            linear-gradient(0deg, hsl(174, 72%, 48%) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-4xl py-12 sm:py-20 lg:py-24 text-center">
        {/* Live Stats Counters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center px-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-panel border border-emerald-500/30 cursor-default text-xs sm:text-sm w-full sm:w-auto justify-center"
          >
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400 shrink-0" />
            </motion.div>
            <span className="font-mono text-slate-300 truncate">
              <motion.span
                key={savedCount}
                initial={{ scale: 1.3, color: "#4ade80" }}
                animate={{ scale: 1, color: "#4ade80" }}
                className="text-emerald-400 font-bold"
              >
                {savedCount}
              </motion.span>{" "}
              <span className="hidden xs:inline">people saved from ghosting this week</span>
              <span className="xs:hidden">saved this week</span>
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-panel border border-primary/30 cursor-default text-xs sm:text-sm w-full sm:w-auto justify-center"
          >
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
            <span className="font-mono text-slate-300 truncate">
              <motion.span
                key={unlockedToday}
                initial={{ scale: 1.3, color: "#590df2" }}
                animate={{ scale: 1, color: "#590df2" }}
                className="text-primary font-bold"
              >
                {unlockedToday}
              </motion.span>{" "}
              <span className="hidden xs:inline">interviews unlocked today</span>
              <span className="xs:hidden">interviews today</span>
            </span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white px-4"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Stop being invisible to{" "}
          </motion.span>
          <br className="hidden sm:block" />
          <motion.span
            className="text-gradient-power inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            hiring bots.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-400 max-w-2xl mx-auto px-4"
        >
          The standard PDF you're sending is unreadable to 70% of ATS systems.
          See what the bot sees in 10 seconds and fix your parse rate.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 max-w-xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={() => navigate("/preview")}
              className="btn-power relative flex h-12 sm:h-14 w-full sm:min-w-[240px] items-center justify-center gap-2 overflow-hidden rounded-lg px-6 sm:px-8 text-base sm:text-lg font-bold text-white border-0 group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{
                  x: ['-200%', '200%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10">See Robot View - Free</span>
              <motion.div
                className="relative z-10"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="group flex h-12 sm:h-14 w-full sm:min-w-[240px] items-center justify-center gap-2 rounded-lg border-2 border-primary/30 bg-primary/10 px-6 sm:px-8 text-sm sm:text-base font-semibold text-white hover:bg-primary/20 hover:border-primary/50 transition-all relative overflow-hidden"
            whileHover={{ scale: 1.05, borderColor: "rgba(89, 13, 242, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-primary/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 2, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            <span className="relative z-10">Sign Up for Full Access</span>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-xs sm:text-sm text-slate-500 px-4"
        >
          No credit card • No sign up required • Instant results in 10 seconds
        </motion.p>
      </div>
    </section>
  );
}
