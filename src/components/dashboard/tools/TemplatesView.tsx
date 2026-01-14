import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate, Lock, Star, Download, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TemplatesView() {
  const templates = [
    {
      id: "tech-minimal",
      name: "Tech Minimalist",
      category: "Technology",
      description: "Clean, single-column layout optimized for engineering roles. Highlights skills and GitHub projects.",
      tags: ["ATS-Verified", "Compact", "Modern"],
      color: "bg-[#3B82F6]/10 text-[#3B82F6]"
    },
    {
      id: "exec-classic",
      name: "Executive Classic",
      category: "Management",
      description: "Traditional serif typography with a focus on leadership metrics and career progression.",
      tags: ["Formal", "Leadership", "Detailed"],
      color: "bg-[#F59E0B]/10 text-[#F59E0B]"
    },
    {
      id: "creative-portfolio",
      name: "Creative Portfolio",
      category: "Design",
      description: "Balanced layout that showcases portfolio links without confusing ATS parsers.",
      tags: ["Visual", "Portfolio", "Hybrid"],
      color: "bg-teal-500/10 text-teal-500"
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-[#0F172A] flex items-center gap-3">
          <LayoutTemplate className="h-8 w-8 text-primary" /> Resume Templates
        </h2>
        <p className="text-lg text-[#64748B] max-w-2xl">
          ATS-friendly templates designed to get you hired. Clean code, no tables, and optimized for parsing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col border-[#E2E8F0] bg-[#FFFFFF] overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
            <div className="aspect-[1/1.4] bg-[#F8FAFC] relative p-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent z-10" />

              {/* Mock Resume Preview */}
              <div className="w-full h-full bg-[#FFFFFF] rounded border border-[#E2E8F0] p-4 transform group-hover:scale-105 transition-transform duration-500 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="h-4 w-1/3 bg-[#0F172A]/20 rounded mb-4" />
                <div className="h-2 w-full bg-[#0F172A]/10 rounded mb-2" />
                <div className="h-2 w-2/3 bg-[#0F172A]/10 rounded mb-6" />

                <div className="space-y-2">
                  <div className="h-2 w-full bg-[#0F172A]/10 rounded" />
                  <div className="h-2 w-full bg-[#0F172A]/10 rounded" />
                  <div className="h-2 w-5/6 bg-[#0F172A]/10 rounded" />
                </div>

                <div className="mt-6 h-3 w-1/4 bg-[#0F172A]/20 rounded mb-2" />
                <div className="space-y-2">
                  <div className="h-2 w-full bg-[#0F172A]/10 rounded" />
                  <div className="h-2 w-full bg-[#0F172A]/10 rounded" />
                </div>
              </div>

              <div className="absolute top-3 right-3 z-20">
                <Badge variant="secondary" className="bg-white/90 backdrop-blur border-[#E2E8F0] text-[#475569]">
                  <Lock className="h-3 w-3 mr-1" /> Premium
                </Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-[#0F172A]">{template.name}</CardTitle>
                  <CardDescription className="mt-1 text-[#64748B]">{template.category}</CardDescription>
                </div>
                <div className={`p-2 rounded-lg ${template.color}`}>
                  <Star className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-sm text-[#64748B] mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-[#E2E8F0] text-[#64748B]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="border-t border-[#E2E8F0] p-4 bg-[#F8FAFC]">
              <Button className="w-full font-bold" disabled>
                <Lock className="mr-2 h-4 w-4" /> Unlock Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-8 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-[#0F172A] mb-2">More Templates Coming Soon</h3>
          <p className="text-[#64748B] max-w-md mb-6">
            We are working with recruiters to build the ultimate library of ATS-verified templates for every industry.
          </p>
          <Button variant="outline" className="gap-2 border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]">
            <Check className="h-4 w-4" /> Join Waitlist
          </Button>
        </div>
      </Card>
    </div>
  );
}
