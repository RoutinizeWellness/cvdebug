import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah J.",
      role: "Hired at TechCorp",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      content: "I was stuck at 65% match. Unlocked the report, added the missing keywords, and got an interview request the next morning.",
      rating: 5
    },
    {
      name: "Mike T.",
      role: "Product Manager",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      content: "The format checker found a table that was breaking my resume. Fixed it in 5 mins. Worth every penny.",
      rating: 5
    },
    {
      name: "Alex R.",
      role: "Software Engineer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      content: "Simple and effective. The AI rewrite saved me hours of guessing what the ATS wanted.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
              <Star className="h-3 w-3 fill-primary" /> Beta Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
              Trusted by Early Adopters
            </h2>
            <p className="text-lg text-muted-foreground">
              See how job seekers are optimizing their resumes and landing interviews during our beta launch.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-muted/50 group-hover:text-primary/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              
              <p className="text-foreground leading-relaxed mb-8 font-medium relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto border-t border-border pt-6">
                <div className="h-12 w-12 rounded-full bg-muted overflow-hidden ring-2 ring-background shadow-sm group-hover:ring-primary/20 transition-all">
                  <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}