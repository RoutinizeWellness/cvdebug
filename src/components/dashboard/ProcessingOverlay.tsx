import { Loader2, AlertCircle, Star } from "lucide-react";
import { useState, useEffect } from "react";

export function ProcessingOverlay() {
  const [currentStat, setCurrentStat] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [fadeStat, setFadeStat] = useState(true);
  const [fadeTestimonial, setFadeTestimonial] = useState(true);

  const stats = [
    {
      title: "Did You Know?",
      text: "75% of resumes are rejected by ATS systems before a human ever sees them. A single formatting error can cost you the interview.",
      highlight: "75% of resumes"
    },
    {
      title: "Industry Fact",
      text: "Recruiters spend an average of only 7 seconds scanning a resume. Your key information must be instantly visible.",
      highlight: "7 seconds"
    },
    {
      title: "ATS Reality",
      text: "Up to 88% of qualified candidates are ignored simply because their resume formatting confuses the parsing software.",
      highlight: "88% of qualified candidates"
    },
    {
      title: "Keyword Impact",
      text: "Including the right keywords from the job description can increase your chances of an interview by 50%.",
      highlight: "increase your chances"
    }
  ];

  const testimonials = [
    {
      text: "I was applying for months with no responses. After fixing the ATS issues this tool found, I got 3 interview requests in one week. The $4.99 was the best investment I made in my job search.",
      author: "Jennifer M.",
      role: "Software Engineer at Google",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer"
    },
    {
      text: "The detailed breakdown showed me exactly why I wasn't getting calls. Fixed the formatting issues and landed my dream job within a month.",
      author: "Michael T.",
      role: "Product Manager at Amazon",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    },
    {
      text: "I didn't realize my creative resume was unreadable by ATS. This tool saved my job search by showing me exactly what the robots see.",
      author: "Sarah L.",
      role: "Marketing Director",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      text: "The keyword gap analysis is a game changer. It told me exactly what skills I was missing from my resume compared to the job description.",
      author: "David K.",
      role: "Data Scientist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    }
  ];

  useEffect(() => {
    const statInterval = setInterval(() => {
      setFadeStat(false);
      setTimeout(() => {
        setCurrentStat((prev) => (prev + 1) % stats.length);
        setFadeStat(true);
      }, 300);
    }, 5000);

    const testimonialInterval = setInterval(() => {
      setFadeTestimonial(false);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setFadeTestimonial(true);
      }, 300);
    }, 7000);

    return () => {
      clearInterval(statInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200 p-6 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Header */}
        <div className="text-center space-y-4">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
          <h3 className="text-3xl font-black text-foreground">Analyzing Your Resume...</h3>
          <p className="text-muted-foreground text-lg">Our AI is scanning for ATS compatibility issues</p>
        </div>

        {/* Rotating Stats */}
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/20 rounded-2xl p-8 space-y-4 animate-in slide-in-from-bottom duration-500 min-h-[160px] flex items-center transition-all">
          <div className={`flex items-start gap-4 w-full transition-opacity duration-300 ${fadeStat ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-foreground mb-2">{stats[currentStat].title}</h4>
              <p className="text-base text-foreground/80 leading-relaxed">
                {stats[currentStat].text.split(stats[currentStat].highlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <strong className="text-red-600">{stats[currentStat].highlight}</strong>}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Rotating Testimonials */}
        <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom duration-700 delay-200 min-h-[180px] flex flex-col justify-center transition-all">
          <div className={`transition-opacity duration-300 ${fadeTestimonial ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />)}
            </div>
            <p className="text-sm text-foreground leading-relaxed italic mb-4">
              "{testimonials[currentTestimonial].text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                <img src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].author} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{testimonials[currentTestimonial].author}</p>
                <p className="text-xs text-muted-foreground">{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-primary">98%</p>
            <p className="text-xs text-muted-foreground mt-1">Accuracy Rate</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-primary">30s</p>
            <p className="text-xs text-muted-foreground mt-1">Avg Analysis</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-primary">10K+</p>
            <p className="text-xs text-muted-foreground mt-1">Resumes Fixed</p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Almost done... Preparing your detailed report
        </p>
      </div>
    </div>
  );
}
