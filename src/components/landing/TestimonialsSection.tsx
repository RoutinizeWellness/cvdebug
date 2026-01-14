import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const redditTestimonials = [
    {
      username: "u/SarahM_SWE",
      subreddit: "r/resumes",
      content: "The 'Robot View' feature is a game-changer. I could finally see what ATS systems were actually reading from my resume. Turns out my fancy formatting was completely invisible to them.",
      upvotes: 247,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      highlight: "🤖 Robot View"
    },
    {
      username: "u/MikeChen_PM",
      subreddit: "r/jobs",
      content: "I went from 93 to 95 in just one scan. The keyword suggestions were spot-on and the formatting fixes were things I never would have caught myself.",
      upvotes: 189,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
      highlight: "93 → 95"
    },
    {
      username: "u/PriyaK_DataAnalyst",
      subreddit: "r/careerguidance",
      content: "This tool gave me confidence that my resume would actually get past the initial screening. Within 2 weeks I had 3 interviews. Best $20 I've ever spent on my career.",
      upvotes: 356,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
      highlight: "3 interviews"
    },
    {
      username: "u/AlexR_Marketing",
      subreddit: "r/jobsearch",
      content: "Simple, fast, and incredibly precise. I've tried 5 other ATS scanners and this is the only one that showed me the actual parsed output. Saved me hours of guesswork.",
      upvotes: 134,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      highlight: "⚡ 10 seconds"
    },
    {
      username: "u/junior_engineer",
      subreddit: "r/cscareerquestions",
      content: "Fixed my resume based on the missing keywords report and got an interview at a FAANG company within 2 weeks!",
      upvotes: 423,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev3",
      highlight: "FAANG"
    },
    {
      username: "u/career_switcher_IN",
      subreddit: "r/developersIndia",
      content: "I was applying for months with no response. This tool showed me I was missing 8 critical keywords. Now I'm getting callbacks.",
      upvotes: 298,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev5",
      highlight: "8 keywords"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FFFFFF] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F59E0B]/20">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              Reddit Wall of Love
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-[#1E293B]">
              Trusted by Redditors Worldwide
            </h2>
            <p className="text-lg text-[#475569]">
              Real feedback from r/resumes, r/developersIndia, r/cscareerquestions, and more.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {redditTestimonials.map((testimonial, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all hover:-translate-y-1 duration-300 relative group"
            >
              {/* Reddit-style header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#F59E0B]/10 overflow-hidden ring-2 ring-[#F59E0B]/20">
                  <img src={testimonial.avatar} alt={testimonial.username} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#1E293B] truncate">{testimonial.username}</p>
                  <p className="text-xs text-[#64748B] font-medium">{testimonial.subreddit}</p>
                </div>
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-xs font-bold">{testimonial.upvotes}</span>
                </div>
              </div>

              {/* Highlight badge */}
              {testimonial.highlight && (
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-[#3B82F6]/20 text-[#3B82F6] text-xs font-bold rounded">
                    {testimonial.highlight}
                  </span>
                </div>
              )}

              {/* Content */}
              <p className="text-[#475569] leading-relaxed text-sm font-medium">
                "{testimonial.content}"
              </p>

              {/* Reddit accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-[#F59E0B] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-[#475569] mb-4">
            Join thousands of job seekers optimizing their resumes
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold text-[#64748B]">
            <span className="px-3 py-1 bg-[#F8FAFC] rounded-full">r/resumes</span>
            <span className="px-3 py-1 bg-[#F8FAFC] rounded-full">r/developersIndia</span>
            <span className="px-3 py-1 bg-[#F8FAFC] rounded-full">r/cscareerquestions</span>
            <span className="px-3 py-1 bg-[#F8FAFC] rounded-full">r/ProductManagement</span>
            <span className="px-3 py-1 bg-[#F8FAFC] rounded-full">r/datascience</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}