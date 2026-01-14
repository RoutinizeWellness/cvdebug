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
    <section className="relative bg-[#F8FAFC] py-16 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-[#475569] uppercase tracking-wider">
            Engineers from these companies use CVDebug
          </p>
        </motion.div>

        {/* Company logos */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 items-center justify-items-center">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
            >
              <motion.img
                src={company.logo}
                alt={`${company.name} - Trusted by job seekers`}
                className="relative h-10 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
