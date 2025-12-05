import { Shield, Target, BarChart3, CheckCircle2, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export function FeatureGridSection() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">
              Why you're not getting interviews
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Most companies use Applicant Tracking Systems (ATS) to filter resumes. If you don't have the right keywords or formatting, a human never sees your application.
            </p>
            
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                Why not just use ChatGPT?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ChatGPT gives generic advice. <span className="font-bold text-foreground">ResumeATS.ai is purpose-built</span> to analyze 20+ specific ATS factors (margins, metadata, keyword density) that LLMs miss, giving you a precise quantitative score.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Shield, title: "Formatting Errors", desc: "Complex layouts, columns, and graphics confuse ATS parsers." },
                { icon: Target, title: "Missing Keywords", desc: "Not matching the exact skills listed in the job description." },
                { icon: Linkedin, title: "Unoptimized LinkedIn", desc: "Recruiters can't find you if your profile lacks the right SEO keywords." },
                { icon: BarChart3, title: "Low Content Density", desc: "Vague bullet points that don't show impact or metrics." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-background/50 transition-colors border border-transparent hover:border-border/50">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-xl">Analysis Report</h3>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1">Passed</Badge>
              </div>
              <div className="space-y-4">
                {[
                  { label: "File Format", status: "Compatible", icon: CheckCircle2, color: "text-green-500" },
                  { label: "Contact Info", status: "Found", icon: CheckCircle2, color: "text-green-500" },
                  { label: "Job Title Match", status: "Exact Match", icon: CheckCircle2, color: "text-green-500" },
                  { label: "Education", status: "Listed", icon: CheckCircle2, color: "text-green-500" },
                  { label: "Soft Skills", status: "3 Missing", icon: Shield, color: "text-yellow-500" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-transparent hover:border-border transition-colors">
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{item.status}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-8 font-bold h-12 text-base shadow-lg shadow-primary/10" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}>
                View Full Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}