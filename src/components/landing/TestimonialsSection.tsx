import { Star, Quote, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const realTestimonials = [
    {
      name: "Marcus J.",
      role: "Sales Director",
      company: "Tech SaaS",
      content: "I was hesitant to pay for another resume tool, but the 'Missing Signal' analysis blew me away. It pointed out I wasn't quantifying my quota attainment correctly. Fixed it, and got an interview at Salesforce 3 days later.",
      rating: 5,
      result: "Interview in 3 days",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus"
    },
    {
      name: "Sarah Chen",
      role: "Senior Engineer",
      company: "Fintech",
      content: "Jobscan kept telling me to add keywords I already had. RoutinizeWellness actually understood the context of my tech stack. The Score History chart helped me see exactly which version of my resume was performing.",
      rating: 5,
      result: "+45 Score Improvement",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      name: "David Miller",
      role: "Marketing Manager",
      company: "Agency",
      content: "The 24-hour pass is genius. I did a Sunday application sprint, optimized 15 different resumes for 15 specific jobs, and paid less than a lunch. This is how all career tools should be priced.",
      rating: 5,
      result: "15 Applications Optimized",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=david"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" id="testimonials">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 transform origin-top-right"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6">
              <Star className="w-4 h-4 fill-blue-700" />
              Trusted by 1,000+ Users
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-gray-900">
              Don't just take our word for it
            </h2>
            <p className="text-xl text-gray-600">
              See why job seekers are switching from Jobscan and Resume Worded to our AI-powered platform.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {realTestimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative flex flex-col h-full"
            >
              <div className="mb-6 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="text-gray-700 text-lg leading-relaxed flex-grow mb-8 relative z-10">
                "{testimonial.content}"
              </blockquote>

              <div className="mt-auto border-t border-gray-100 pt-6">
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full bg-gray-100" />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  {testimonial.result}
                </div>
              </div>

              <Quote className="absolute top-8 right-8 text-gray-100 w-20 h-20 -z-0" />
            </motion.div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 pt-12">
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">95%</div>
            <div className="text-gray-600 font-medium">Interview Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">10k+</div>
            <div className="text-gray-600 font-medium">Resumes Optimized</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">4.9/5</div>
            <div className="text-gray-600 font-medium">User Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-2">24h</div>
            <div className="text-gray-600 font-medium">Avg. Time to Interview</div>
          </div>
        </div>
      </div>
    </section>
  );
}