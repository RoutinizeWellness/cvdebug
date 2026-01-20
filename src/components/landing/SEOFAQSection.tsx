import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";

/**
 * SEO-Optimized FAQ Section
 * Visible content that matches JSON-LD FAQPage schema
 * Helps Google index and show in "People Also Ask"
 */
export function SEOFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useI18n();

  const faqs = [
    {
      question: t.landing.faq.question1,
      answer: t.landing.faq.answer1
    },
    {
      question: t.landing.faq.question2,
      answer: t.landing.faq.answer2
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#FFFFFF] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
            {t.landing.faq.heading}
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            {t.landing.hero.subtitle}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden hover:border-[#3B82F6]/50 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenIndex(openIndex === index ? null : index);
                  }
                }}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-bold text-[#1E293B] pr-8" id={`faq-question-${index}`}>
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="h-5 w-5 text-[#3B82F6]" />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="px-6 pb-5 text-[#475569] leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-[#475569] mb-4">
            {t.landing.cta.secondary}
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all duration-300 hover:scale-105">
            {t.landing.cta.button}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
