import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";

export function NewSocialProofSection() {
  const { t } = useI18n();
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
      color: "from-slate-600 to-green-500",
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
      color: "from-orange-400 to-yellow-500",
    },
    {
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
      color: "from-slate-700 to-slate-600",
    },
    {
      name: "Slack",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
      color: "from-slate-600 to-slate-500",
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      color: "from-slate-600 to-slate-700",
    },
  ];

  const redditCommunities = [
    { name: "r/resumes", members: "385K+", topic: "Resume Reviews" },
    { name: "r/jobs", members: "1.2M+", topic: "Job Search" },
    { name: "r/careerguidance", members: "800K+", topic: "Career Advice" },
    { name: "r/cscareerquestions", members: "1.5M+", topic: "Tech Careers" },
  ];

  return (
    <section className="relative bg-[#F8FAFC] py-16 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Reddit Community Endorsement - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white border-2 border-[#FF4500]/20 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-6">
              <svg className="w-10 h-10" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="128" cy="128" r="128" fill="#FF4500" />
                <path d="M213 128c0-7.7-6.3-14-14-14-3.8 0-7.2 1.5-9.7 4-9.6-6.9-22.8-11.3-37.4-11.9l6.4-30.1 20.8 4.4c0.3 5.2 4.6 9.3 9.9 9.3 5.5 0 10-4.5 10-10s-4.5-10-10-10c-4 0-7.4 2.3-9 5.7l-23.1-4.9c-0.8-0.2-1.7 0-2.3 0.5-0.6 0.5-1 1.2-1.1 2l-7.1 33.3c-15.1 0.4-28.7 5-38.5 12-2.5-2.4-5.9-3.9-9.7-3.9-7.7 0-14 6.3-14 14 0 5.5 3.2 10.2 7.8 12.5-0.3 1.5-0.4 3-0.4 4.5 0 22.9 26.7 41.5 59.6 41.5s59.6-18.6 59.6-41.5c0-1.6-0.1-3.1-0.4-4.6 4.6-2.3 7.8-7 7.8-12.4zm-97 10c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm56.1 26.4c-6.8 6.8-19.9 7.3-28.1 7.3s-21.3-0.5-28.1-7.3c-1-1-1-2.7 0-3.7s2.7-1 3.7 0c4.3 4.3 13.5 6 24.4 6s20.1-1.7 24.4-6c1-1 2.7-1 3.7 0s1 2.7 0 3.7zm-2.1-16.4c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" fill="white" />
              </svg>
              <div>
                <h3 className="text-2xl font-black text-[#0F172A]">
                  {t.socialProof.redditTitle}
                </h3>
                <p className="text-sm text-[#475569] font-medium">
                  {t.socialProof.redditSubtitle}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {redditCommunities.map((community, index) => (
                <motion.div
                  key={community.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#FF4500]/10 to-[#FF4500]/5 border border-[#FF4500]/20 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#FF4500] font-bold text-lg">{community.name}</span>
                  </div>
                  <p className="text-xs text-[#475569] font-medium mb-1">{community.members} {t.socialProof.members}</p>
                  <p className="text-xs text-[#64748B]">{community.topic}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-[#475569] italic">
                {t.socialProof.redditQuote}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-[#475569] uppercase tracking-wider">
            {t.socialProof.companiesTitle}
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
