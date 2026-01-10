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
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaoKTnNDmSIsQj8yPbOBpzM6hhAJLYOlsTbVLbY7_qjk31k5svTONvGZvYQ6eNBMiYodJC0aM9-4Syb9dRYyWkTxvcTvQ46p_7bmn1_7HEQPFH8V-wRD3x4KtD6-dvNy0ecpfkZ69lYtxT0ynA61ImfFdYVKsL4KmddgWapZg9Ld9C666NOSkp7jNOhAmpJeoxh8hBSMevl8opyLVvo40_KnUSK-61Q03OMhgL8FlguroRiOgw8sYxgsQu4YUvIJX6NVEy9sfEIw",
    },
    {
      name: "Amazon",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdH0nj4jFe9vc_RyUSNxlgdRkVMGRn9KWxsT8SJ2kfySUOWID-Rvr9LOX1PWAwtoFfPasvIaPgdtF5wS_NOZwP540ZlZ-EOIsjVjiSwLGbDtUxdyDZ_zBel-IGR0Y9OavmpS--KWVrartOCuVur0LDKwGBmYSuQ8VNXSmLiSL3usBfwIZb3akSFt-jN5i9eXyRdPb194khI8X8C3aH18a5snx6gQu3MGpv4MWOzRj6IqPw-LkbsTrUaQ9kNq6qXxiqV8rlxi4ePQ",
    },
    {
      name: "Meta",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0dTWCfWsEunVMr7sKzJXqR9wTpM8f42ps0H_oPNNmLxb_SX6NsnX7iX5JfK4Xsm6ZdGeRNwDZuCsYUoTM39i5Vn03_HDbXfeGc9zcs_KK8NhlykMDjP2fgB3SCrMh-k-pOHLxRLajLK9u-_l89Py6k3p02iw_yC4tTXL2kB3OM33ZnVbdUTLbHI72EzkHheNN23Fmptfmj5zptYBqPHpdBHgkAIqPuWHcz-qZ9_nFOiJoN2SIcehTWjFMbfZL9tqYziCnNh8WeA",
    },
    {
      name: "Slack",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbScCGCgB6OMkKyLk4m4sZGqqbGm3wEIJ3ClDWd4P8GmO97sW6jRx6N5p059tKq0LUFiSLjjddWQbkN_egu87xA-YHxkeouZU2AA1sl-znyKZWHTdKz2xdw9KKts48bpdlugRA-WzjAQy5xEmbl-dZo2-eFkpZknV6PxQqbJnM3fQyInYfa0UNbAPCBrOwPUmasq8jVmHeJ-NiiJBL8ijZ511R8jOxxUvqTH2WKbVyxa0S_GaMljl7_yNR3DkuV9IAZF3QwFM-Rg",
    },
    {
      name: "Microsoft",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPNpWchoPej87t0uRNISaQ41OvTdSMRrSLi55x5wGm-L-pCOgrCNUNhDYlFuo7k9iZGiJrQrn_6eSBWGQmzuh-_D8c4G-5x2ACtez_MUifguitfG6LhJkJiUU43z7rRqvylzr8ryM1kStyNWDhMk9GUrTIkTaS3dXWxGeCpaygzcmzGpyZW3oRLvn9i6_3NFUSlsoiYNJ0g2tJ6eYjTFLKM04K6Zst9LuXjicmoUeThWeaXosmU_s5OoRRxkgUSgbC39LyP5kG_Q",
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
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Logo */}
                <motion.img
                  src={company.logo}
                  alt={company.name}
                  className="relative h-10 w-auto object-contain grayscale group-hover:grayscale-0 transition-all cursor-pointer filter drop-shadow-lg"
                  whileHover={{
                    filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
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
