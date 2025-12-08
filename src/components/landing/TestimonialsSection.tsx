import { Star } from "lucide-react";

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
    <section className="py-20 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="h-3 w-3 fill-primary" /> Beta Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Trusted by Early Adopters
          </h2>
          <p className="text-lg text-muted-foreground">
            See how job seekers are optimizing their resumes and landing interviews during our beta launch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-background border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 font-medium">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden ring-2 ring-background shadow-sm">
                  <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
