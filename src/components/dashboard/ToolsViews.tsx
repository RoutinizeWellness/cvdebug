import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Linkedin, Mail, Download, Sparkles, Lock, LayoutTemplate, Check, ArrowRight, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TemplatesView() {
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const templates = [
    { 
      id: 1, 
      name: "The Minimalist", 
      type: "ATS-Friendly", 
      color: "bg-slate-50", 
      accent: "border-slate-200",
      description: "Clean, single-column layout optimized for high readability and ATS parsing.",
      features: ["Single Column", "Sans-serif Fonts", "Minimal Styling"]
    },
    { 
      id: 2, 
      name: "Corporate Pro", 
      type: "Executive", 
      color: "bg-blue-50", 
      accent: "border-blue-200",
      description: "Traditional structure with a modern touch, perfect for finance and law.",
      features: ["Header Accent", "Serif Headings", "Dense Layout"]
    },
    { 
      id: 3, 
      name: "Tech Modern", 
      type: "Engineering", 
      color: "bg-zinc-50", 
      accent: "border-zinc-200",
      description: "Highlights skills and projects. Designed for software engineers.",
      features: ["Skills Sidebar", "Project Section", "Git Links"]
    },
    { 
      id: 4, 
      name: "Creative Clean", 
      type: "Design", 
      color: "bg-purple-50", 
      accent: "border-purple-200",
      description: "Subtle creative elements that don't break ATS parsers.",
      features: ["Color Accents", "Modern Header", "Portfolio Links"]
    },
  ];

  const handleUseTemplate = (template: any) => {
    toast.success(`Template "${template.name}" selected!`, {
      description: "We are preparing your editor environment...",
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-foreground">Resume Templates</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          ATS-friendly templates designed to get you hired. Clean code, no tables, and optimized for parsing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div key={template.id} className="group relative flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Preview Area */}
            <div className={`h-64 ${template.color} relative overflow-hidden border-b ${template.accent}`}>
              <div className="absolute inset-4 bg-white shadow-sm rounded-sm opacity-80 scale-95 group-hover:scale-100 transition-transform duration-500 origin-top">
                {/* Mock Resume Lines */}
                <div className="p-4 space-y-2">
                  <div className="h-4 w-1/2 bg-foreground/80 rounded mb-4" />
                  <div className="h-2 w-full bg-muted-foreground/20 rounded" />
                  <div className="h-2 w-full bg-muted-foreground/20 rounded" />
                  <div className="h-2 w-2/3 bg-muted-foreground/20 rounded" />
                  
                  <div className="pt-4 space-y-2">
                    <div className="h-3 w-1/3 bg-foreground/60 rounded mb-2" />
                    <div className="h-2 w-full bg-muted-foreground/20 rounded" />
                    <div className="h-2 w-full bg-muted-foreground/20 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[1px]">
                <Button variant="secondary" size="sm" className="font-bold" onClick={() => setPreviewTemplate(template)}>
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </Button>
                <Button size="sm" className="font-bold" onClick={() => handleUseTemplate(template)}>
                  Use Template
                </Button>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl">{template.name}</h3>
                <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-wider">{template.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {template.description}
              </p>
              <div className="mt-auto space-y-2">
                {template.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Check className="h-3 w-3 text-primary" /> {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-muted/5 hover:bg-muted/10 transition-colors gap-4 min-h-[400px]">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-2">More Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              We are designing more ATS-proof templates for specific industries.
            </p>
          </div>
          <Button variant="outline" disabled>Join Waitlist</Button>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name} - Preview</DialogTitle>
          </DialogHeader>
          <div className={`flex-1 rounded-xl border border-border ${previewTemplate?.color} p-8 overflow-y-auto`}>
            <div className="bg-white shadow-lg min-h-[800px] w-full max-w-2xl mx-auto p-12 space-y-8">
              {/* Mock Full Resume */}
              <div className="border-b pb-8">
                <div className="h-8 w-2/3 bg-foreground/80 rounded mb-4" />
                <div className="flex gap-4">
                  <div className="h-3 w-24 bg-muted-foreground/30 rounded" />
                  <div className="h-3 w-24 bg-muted-foreground/30 rounded" />
                  <div className="h-3 w-24 bg-muted-foreground/30 rounded" />
                </div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-5 w-1/4 bg-foreground/60 rounded" />
                    <div className="h-3 w-full bg-muted-foreground/20 rounded" />
                    <div className="h-3 w-full bg-muted-foreground/20 rounded" />
                    <div className="h-3 w-3/4 bg-muted-foreground/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Close</Button>
            <Button onClick={() => {
              handleUseTemplate(previewTemplate);
              setPreviewTemplate(null);
            }}>Use This Template</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function LinkedInView() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
          <Linkedin className="h-8 w-8 text-[#0077b5]" /> Profile Optimization
        </h2>
        <p className="text-lg text-muted-foreground">
          Analyze your LinkedIn profile against job descriptions to rank higher in recruiter searches.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Import Profile</CardTitle>
          <CardDescription>Paste your LinkedIn profile URL or export as PDF to analyze.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3">
            <Label htmlFor="linkedin-url" className="font-bold">LinkedIn URL</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="linkedin-url" placeholder="https://linkedin.com/in/yourname" className="pl-10" />
              </div>
              <Button className="font-bold">Analyze URL</Button>
            </div>
          </div>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
              <span className="bg-card px-4 text-muted-foreground">Or paste content</span>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="profile-text" className="font-bold">Profile Text (About, Experience, Skills)</Label>
            <Textarea 
              id="profile-text" 
              placeholder="Paste your profile content here..." 
              className="min-h-[200px] resize-none p-4 leading-relaxed"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between bg-muted/30 p-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="h-3 w-3" /> We do not store your LinkedIn data permanently.
          </p>
          <Button size="lg" className="font-bold shadow-lg shadow-primary/20">
            <Sparkles className="mr-2 h-4 w-4" /> Optimize Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function CoverLetterView() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
          <Mail className="h-8 w-8 text-primary" /> Cover Letter Generator
        </h2>
        <p className="text-lg text-muted-foreground">
          Generate tailored cover letters based on your resume and the job description.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm z-10">
          COMING SOON
        </div>
        <CardHeader>
          <CardTitle className="text-xl">AI Cover Letter Writer</CardTitle>
          <CardDescription>Stop writing generic cover letters. Let AI tell your story.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 opacity-50 pointer-events-none select-none filter blur-[1px]">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Resume</Label>
              <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background flex items-center text-muted-foreground">
                Software Engineer - 2024.pdf
              </div>
            </div>
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input placeholder="e.g. Senior Frontend Developer" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea placeholder="Paste the job description here..." className="h-32 resize-none" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-10 pt-4">
          <Button size="lg" disabled className="font-bold h-12 px-8 shadow-xl">
            <Lock className="mr-2 h-4 w-4" /> Join Waitlist for Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}