import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Linkedin, Mail, Download, Sparkles, Lock, LayoutTemplate, Check, ArrowRight, Eye, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export function TemplatesView() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight text-foreground">Resume Templates</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          ATS-friendly templates designed to get you hired. Clean code, no tables, and optimized for parsing.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden shadow-lg min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm z-10">
          COMING SOON
        </div>
        
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <LayoutTemplate className="h-10 w-10 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">Premium ATS Templates</h3>
        <p className="text-muted-foreground max-w-md mb-8">
          We are crafting a collection of high-performance, ATS-verified resume templates. 
          These will be optimized for specific industries like Tech, Finance, and Creative.
        </p>
        
        <Button size="lg" disabled className="font-bold h-12 px-8 shadow-xl">
          <Lock className="mr-2 h-4 w-4" /> Join Waitlist for Access
        </Button>
      </Card>
    </div>
  );
}

export function LinkedInView() {
  const optimizeLinkedIn = useAction(api.ai.optimizeLinkedIn);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyzeUrl = () => {
    if (!linkedinUrl) {
      toast.error("Please enter a LinkedIn URL");
      return;
    }
    toast.info("Direct LinkedIn scraping is restricted by privacy policies.", {
      description: "Please copy and paste your profile content (About, Experience, Skills) into the text box below for the best analysis.",
      duration: 5000,
    });
  };

  const handleOptimize = async () => {
    if (!profileText.trim()) {
      toast.error("Please paste your profile text to analyze.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const data = await optimizeLinkedIn({
        profileText,
        jobDescription,
        linkedinUrl,
      });
      setResult(data);
      toast.success("Profile analysis complete!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze profile. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

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

      <div className="grid gap-8 lg:grid-cols-1">
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
                  <Input 
                    id="linkedin-url" 
                    placeholder="https://linkedin.com/in/yourname" 
                    className="pl-10" 
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>
                <Button className="font-bold" variant="secondary" onClick={handleAnalyzeUrl}>
                  Analyze URL
                </Button>
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
                placeholder="Paste your profile content here (About section, Experience descriptions, Skills list)..." 
                className="min-h-[200px] resize-none p-4 leading-relaxed"
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="job-desc" className="font-bold">Target Job Description (Optional)</Label>
              <Textarea 
                id="job-desc" 
                placeholder="Paste the job description you are targeting..." 
                className="min-h-[100px] resize-none p-4 leading-relaxed"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between bg-muted/30 p-6 border-t border-border">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
              <Lock className="h-3 w-3" /> We do not store your LinkedIn data permanently.
            </p>
            <Button 
              size="lg" 
              className="font-bold shadow-lg shadow-primary/20"
              onClick={handleOptimize}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Optimize Profile</>
              )}
            </Button>
          </CardFooter>
        </Card>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Optimization Report</h3>
              <div className={`
                px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2
                ${result.score >= 80 ? 'bg-green-500/10 text-green-600' : result.score >= 50 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-red-500/10 text-red-600'}
              `}>
                <span className="text-lg">{result.score}/100</span> Score
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Suggested Headline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm font-medium italic border border-border">
                    "{result.headline}"
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" /> Missing Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords?.map((kw: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Section Critique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.about}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actionable Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.actionableTips?.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
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