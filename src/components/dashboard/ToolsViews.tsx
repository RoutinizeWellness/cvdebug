import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Linkedin, Mail, Download, Sparkles, Lock, LayoutTemplate } from "lucide-react";

export function TemplatesView() {
  const templates = [
    { id: 1, name: "The Minimalist", type: "ATS-Friendly", color: "bg-slate-100" },
    { id: 2, name: "Corporate Pro", type: "Executive", color: "bg-blue-50" },
    { id: 3, name: "Tech Modern", type: "Engineering", color: "bg-zinc-100" },
    { id: 4, name: "Creative Clean", type: "Design", color: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black tracking-tight">Resume Templates</h2>
        <p className="text-muted-foreground">ATS-friendly templates designed to get you hired.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="group overflow-hidden border-muted hover:border-primary/50 transition-all">
            <div className={`h-48 ${template.color} flex items-center justify-center relative`}>
              <LayoutTemplate className="h-16 w-16 text-muted-foreground/20 group-hover:text-primary/20 transition-colors" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <Button className="absolute opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-xl">
                Use Template
              </Button>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{template.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">{template.type}</Badge>
              </div>
              <CardDescription>Clean layout, zero tables, optimized for parsing.</CardDescription>
            </CardHeader>
          </Card>
        ))}
        
        <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center bg-muted/20">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg">More Coming Soon</h3>
          <p className="text-sm text-muted-foreground">We are designing more ATS-proof templates.</p>
        </Card>
      </div>
    </div>
  );
}

export function LinkedInView() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Linkedin className="h-8 w-8 text-[#0077b5]" /> Profile Optimization
        </h2>
        <p className="text-muted-foreground">Analyze your LinkedIn profile against job descriptions to rank higher in recruiter searches.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Profile</CardTitle>
          <CardDescription>Paste your LinkedIn profile URL or export as PDF to analyze.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="linkedin-url">LinkedIn URL</Label>
            <div className="flex gap-2">
              <Input id="linkedin-url" placeholder="https://linkedin.com/in/yourname" />
              <Button>Analyze</Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or paste content</span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-text">Profile Text (About, Experience, Skills)</Label>
            <Textarea 
              id="profile-text" 
              placeholder="Paste your profile content here..." 
              className="min-h-[200px]"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <p className="text-xs text-muted-foreground">We do not store your LinkedIn data permanently.</p>
          <Button size="lg" className="font-bold"><Sparkles className="mr-2 h-4 w-4" /> Optimize Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export function CoverLetterView() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Mail className="h-8 w-8 text-primary" /> Cover Letter Generator
        </h2>
        <p className="text-muted-foreground">Generate tailored cover letters based on your resume and the job description.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">
          COMING SOON
        </div>
        <CardHeader>
          <CardTitle>AI Cover Letter Writer</CardTitle>
          <CardDescription>Stop writing generic cover letters. Let AI tell your story.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 opacity-50 pointer-events-none select-none filter blur-[1px]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Resume</Label>
              <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
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
            <Textarea placeholder="Paste the job description here..." className="h-32" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button size="lg" disabled className="font-bold">
            <Lock className="mr-2 h-4 w-4" /> Join Waitlist for Access
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
