import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

/**
 * SEO-Optimized FAQ Section
 * Visible content that matches JSON-LD FAQPage schema
 * Helps Google index and show in "People Also Ask"
 */
export function SEOFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is an ATS resume scanner?",
      answer: "An ATS (Applicant Tracking System) resume scanner is a tool that shows you how ATS software reads and parses your resume. CVDebug's Robot View feature lets you see exactly what hiring bots see, helping you optimize your resume for a higher ATS score and better interview callbacks. Most companies use ATS systems like Workday, Taleo, Greenhouse, Lever, and iCIMS to automatically screen resumes before human recruiters see them."
    },
    {
      question: "How does Robot View work?",
      answer: "Robot View uses advanced parsing technology to show you the exact text and structure that ATS systems extract from your resume. This unique feature helps you identify formatting issues, missing keywords, and sections that ATS robots can't read properly. Unlike other resume scanners, Robot View shows you a side-by-side comparison of what you see vs. what the ATS bot sees, making it easy to spot and fix problems instantly."
    },
    {
      question: "Is CVDebug free to use?",
      answer: "Yes! CVDebug offers a free ATS scan that shows your ATS score and basic optimization tips. No credit card or signup required. Simply upload your resume and get instant results in 10 seconds. Premium plans start at €9.99 for detailed analysis with keyword gap identification, formatting fixes, and unlimited scans. Over 10,000 job seekers have used CVDebug to optimize their resumes and land more interviews."
    },
    {
      question: "What is a good ATS score?",
      answer: "An ATS score above 80% is considered good and means your resume is highly compatible with most ATS systems. Scores of 90%+ are excellent and significantly increase your chances of getting past the initial screening. If your score is below 70%, you should fix formatting issues and add missing keywords immediately. CVDebug helps you improve your score by identifying exactly what's holding you back, whether it's formatting problems, missing keywords, or sections the ATS can't parse."
    },
    {
      question: "Which companies use ATS?",
      answer: "98% of Fortune 500 companies use ATS software including Google, Meta (Facebook), Amazon, Microsoft, Apple, Netflix, Tesla, and thousands more. Popular ATS platforms include Workday, Taleo (Oracle), Greenhouse, Lever, iCIMS, SAP SuccessFactors, BambooHR, and Jobvite. Even small and medium-sized companies use ATS systems. In India, companies like TCS, Infosys, Wipro, HCL, and Tech Mahindra all use ATS. In the Philippines, BPO companies like Accenture, Concentrix, and Teleperformance rely heavily on ATS screening."
    },
    {
      question: "Why is my resume getting rejected by ATS?",
      answer: "Common reasons for ATS rejection include: 1) Complex formatting like tables, columns, or text boxes that ATS can't parse, 2) Missing keywords from the job description, 3) Headers and footers with important information that gets ignored, 4) Graphics, images, or fancy fonts that are invisible to ATS, 5) Incorrect section headings that ATS doesn't recognize. CVDebug's Robot View shows you exactly which parts of your resume are unreadable to ATS systems so you can fix them and increase your pass rate."
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
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Everything you need to know about ATS resume scanners and how CVDebug helps you beat them
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
            Still have questions? Try our free ATS scanner now
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B82F6]/50 transition-all duration-300 hover:scale-105">
            Scan Your Resume Free →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
