import { motion } from "framer-motion";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewFooter } from "@/components/landing/NewFooter";
import { Target, Users, Zap, Shield } from "lucide-react";
import { useEffect } from "react";
import { updatePageSEO } from "@/lib/seo";

export default function AboutUs() {
  useEffect(() => {
    updatePageSEO({
      title: 'About CVDebug - AI-Powered ATS Resume Optimization',
      description: 'Learn how CVDebug helps job seekers beat ATS systems and land more interviews with AI-powered resume analysis and optimization.',
      keywords: ['about cvdebug', 'ats resume scanner', 'resume optimization tool', 'career technology'],
      canonical: 'https://cvdebug.com/about',
    });
  }, []);

  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're on a mission to level the playing field in job searching by making professional resume optimization accessible to everyone."
    },
    {
      icon: Users,
      title: "Job Seeker First",
      description: "Every feature we build is designed with one goal: helping you get more interviews and land your dream job faster."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We use cutting-edge AI technology to analyze resumes the same way ATS systems do, giving you actionable insights in seconds."
    },
    {
      icon: Shield,
      title: "Privacy & Trust",
      description: "Your resume data is encrypted and secure. We never share your information with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <NewNavbar />

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6">
            About <span className="text-[#64748B]">CVDebug</span>
          </h1>
          <p className="text-xl text-[#475569] max-w-3xl mx-auto leading-relaxed">
            We're building the future of job searching with AI-powered tools that help you beat ATS systems and get hired faster.
          </p>
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 md:p-12 mb-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-3xl font-bold text-[#0F172A] mb-6">Our Story</h2>
          <div className="space-y-4 text-[#475569] text-lg leading-relaxed">
            <p>
              CVDebug was born from a simple observation: talented professionals were getting rejected not because they lacked skills, but because their resumes couldn't pass Applicant Tracking Systems (ATS).
            </p>
            <p>
              We watched friends spend hours crafting perfect resumes, only to receive automated rejections. The problem wasn't their experience—it was that ATS robots couldn't parse their resumes correctly.
            </p>
            <p>
              That's when we decided to build CVDebug. Our mission is to give every job seeker the power to see their resume exactly as ATS systems see it, and provide actionable insights to improve their chances of landing interviews.
            </p>
            <p>
              Today, we're proud to help thousands of professionals optimize their resumes, track their applications, and land their dream jobs—all powered by cutting-edge AI technology.
            </p>
          </div>
        </motion.section>

        {/* Values Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 3) }}
                className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
              >
                <div className="w-12 h-12 bg-[#64748B]/20 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#94A3B8]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{value.title}</h3>
                <p className="text-[#475569] leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 md:p-12 mb-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-3xl font-bold text-[#0F172A] mb-8 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#94A3B8] mb-2">10,000+</div>
              <div className="text-[#475569]">Resumes Scanned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#94A3B8] mb-2">3,500+</div>
              <div className="text-[#475569]">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#94A3B8] mb-2">92%</div>
              <div className="text-[#475569]">Success Rate</div>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-8 md:p-12 mb-16 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Built by Job Seekers, for Job Seekers</h2>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto leading-relaxed">
            Our team has been in your shoes. We've faced ATS rejections, keyword gaps, and formatting nightmares. That's why we're obsessed with building tools that actually work.
          </p>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-12 bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] rounded-2xl text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
        >
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
            Ready to Beat ATS?
          </h2>
          <p className="text-[#475569] text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who've optimized their resumes with CVDebug.
          </p>
          <a
            href="/"
            className="inline-block bg-[#64748B] hover:bg-[#0F172A] text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Get Started Free
          </a>
        </motion.section>
      </main>

      <NewFooter />
    </div>
  );
}
