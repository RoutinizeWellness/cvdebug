import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function NewSocialProofSection() {
  const [count, setCount] = useState(0);
  const targetCount = 150;

  // Animated counter
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = targetCount / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const companies = [
    {
      name: "Google",
      logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
      color: "from-blue-500 to-green-500",
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      color: "from-orange-400 to-yellow-500",
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      color: "from-blue-600 to-cyan-500",
    },
    {
      name: "Slack",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      color: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <section className="relative border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-16 overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Headline with animated counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-base font-medium text-slate-400">
            Trusted by{" "}
            <motion.span
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-xl"
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {count}+
            </motion.span>{" "}
            job seekers who landed offers at
          </p>
        </motion.div>

        {/* Company logos with enhanced animations */}
        <div className="relative">
          {/* Pulsing border effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-primary/20"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0)",
                "0 0 20px 5px rgba(59, 130, 246, 0.1)",
                "0 0 0 0 rgba(59, 130, 246, 0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="grid grid-cols-2 gap-8 md:grid-cols-5 items-center justify-items-center p-8 bg-slate-950/30 rounded-2xl backdrop-blur-sm">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                className="relative group"
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.4,
                }}
                whileHover={{
                  scale: 1.15,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
              >
                {/* Glow effect on hover with company-specific colors */}
                <motion.div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r ${company.color} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Logo with enhanced hover effects */}
                <motion.img
                  src={company.logo}
                  alt={`${company.name} - Trusted by job seekers`}
                  className="relative h-12 w-auto object-contain brightness-75 group-hover:brightness-125 transition-all duration-300 cursor-pointer filter drop-shadow-lg"
                  loading="lazy"
                  whileHover={{
                    filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.6)) brightness(1.3)",
                  }}
                />

                {/* Tooltip */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none"
                  initial={{ y: -5 }}
                  whileHover={{ y: 0 }}
                >
                  {company.name}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-slate-500"
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05, color: "#3B82F6" }}
          >
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Real success stories</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05, color: "#3B82F6" }}
          >
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>98% satisfaction rate</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05, color: "#3B82F6" }}
          >
            <span className="material-symbols-outlined text-sm">speed</span>
            <span>Average 30% faster response</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
