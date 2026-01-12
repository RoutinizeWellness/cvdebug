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
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      id: "exec-classic",
      name: "Executive Classic",
      category: "Management",
      description: "Traditional serif typography with a focus on leadership metrics and career progression.",
      tags: ["Formal", "Leadership", "Detailed"],
      color: "bg-amber-500/10 text-amber-500"
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
        <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
          <LayoutTemplate className="h-8 w-8 text-primary" /> Resume Templates
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          ATS-friendly templates designed to get you hired. Clean code, no tables, and optimized for parsing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col border-zinc-800 bg-zinc-900/50 overflow-hidden group hover:border-primary/50 transition-all duration-300">
            <div className="aspect-[1/1.4] bg-zinc-950 relative p-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
              
              {/* Mock Resume Preview */}
              <div className="w-full h-full bg-white/5 rounded border border-white/10 p-4 transform group-hover:scale-105 transition-transform duration-500">
                <div className="h-4 w-1/3 bg-white/20 rounded mb-4" />
                <div className="h-2 w-full bg-white/10 rounded mb-2" />
                <div className="h-2 w-2/3 bg-white/10 rounded mb-6" />
                
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-5/6 bg-white/10 rounded" />
                </div>
                
                <div className="mt-6 h-3 w-1/4 bg-white/20 rounded mb-2" />
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-full bg-white/10 rounded" />
                </div>
              </div>

              <div className="absolute top-3 right-3 z-20">
                <Badge variant="secondary" className="bg-black/50 backdrop-blur border-white/10 text-white">
                  <Lock className="h-3 w-3 mr-1" /> Premium
                </Badge>
              </div>
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">{template.category}</CardDescription>
                </div>
                <div className={`p-2 rounded-lg ${template.color}`}>
                  <Star className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-zinc-700 text-zinc-400">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="border-t border-zinc-800 p-4 bg-zinc-900">
              <Button className="w-full font-bold" disabled>
                <Lock className="mr-2 h-4 w-4" /> Unlock Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden shadow-lg p-8 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-2">More Templates Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            We are working with recruiters to build the ultimate library of ATS-verified templates for every industry.
          </p>
          <Button variant="outline" className="gap-2">
            <Check className="h-4 w-4" /> Join Waitlist
          </Button>
        </div>
      </Card>
    </div>
  );
}