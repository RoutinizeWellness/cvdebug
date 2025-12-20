import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Linkedin, Mail, Download, Sparkles, Lock, LayoutTemplate, Check, ArrowRight, Eye, Loader2, AlertCircle, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

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
  const optimizeLinkedIn = useAction(apiAny.ai.optimizeLinkedIn);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("optimize");
  const [dmRecruiterName, setDmRecruiterName] = useState("");
  const [dmTone, setDmTone] = useState<"casual" | "professional" | "technical">("professional");
  const [isGeneratingDM, setIsGeneratingDM] = useState(false);
  const [dmResults, setDmResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const handleGenerateDM = async () => {
    if (!profileText.trim()) {
      toast.error("Please paste your profile text first.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description to target.");
      return;
    }

    setIsGeneratingDM(true);
    try {
      // Generate 3 variations using the AI
      const variations = await Promise.all([
        optimizeLinkedIn({
          profileText: `Generate a ${dmTone} LinkedIn DM to recruiter ${dmRecruiterName || "the hiring manager"} for this role. Keep it under 150 words. Profile: ${profileText.substring(0, 1000)}`,
          jobDescription: jobDescription.substring(0, 1000),
        }),
        optimizeLinkedIn({
          profileText: `Generate a ${dmTone} LinkedIn DM (variation 2) to recruiter ${dmRecruiterName || "the hiring manager"} for this role. Keep it under 150 words. Profile: ${profileText.substring(0, 1000)}`,
          jobDescription: jobDescription.substring(0, 1000),
        }),
        optimizeLinkedIn({
          profileText: `Generate a ${dmTone} LinkedIn DM (variation 3) to recruiter ${dmRecruiterName || "the hiring manager"} for this role. Keep it under 150 words. Profile: ${profileText.substring(0, 1000)}`,
          jobDescription: jobDescription.substring(0, 1000),
        }),
      ]);

      const messages = variations.map((v: any) => v.about || v.headline || "Generated message");
      setDmResults(messages);
      toast.success("3 DM variations generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate DMs. Please try again.");
    } finally {
      setIsGeneratingDM(false);
    }
  };

  const handleCopyDM = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
          <Linkedin className="h-8 w-8 text-[#0077b5]" /> LinkedIn Brand Optimizer
        </h2>
        <p className="text-lg text-muted-foreground">
          Optimize your LinkedIn profile and generate recruiter DMs to rank higher in searches.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="optimize">Profile Optimizer</TabsTrigger>
          <TabsTrigger value="dm">Recruiter DM Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="optimize" className="space-y-8">
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
        </TabsContent>

        <TabsContent value="dm" className="space-y-8">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Generate Recruiter DMs</CardTitle>
              <CardDescription>Create personalized LinkedIn messages to send after applying.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="dm-profile" className="font-bold">Your Profile Summary</Label>
                <Textarea 
                  id="dm-profile" 
                  placeholder="Paste your LinkedIn About section or a brief summary of your experience..." 
                  className="min-h-[120px] resize-none p-4 leading-relaxed"
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="dm-job" className="font-bold">Target Job Description</Label>
                <Textarea 
                  id="dm-job" 
                  placeholder="Paste the job description you're applying for..." 
                  className="min-h-[120px] resize-none p-4 leading-relaxed"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="recruiter-name" className="font-bold">Recruiter Name (Optional)</Label>
                  <Input 
                    id="recruiter-name" 
                    placeholder="e.g., Sarah Johnson" 
                    value={dmRecruiterName}
                    onChange={(e) => setDmRecruiterName(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="dm-tone" className="font-bold">Message Tone</Label>
                  <Select value={dmTone} onValueChange={(val: any) => setDmTone(val)}>
                    <SelectTrigger id="dm-tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="technical">Technical & Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between bg-muted/30 p-6 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium">
                We'll generate 3 variations for you to choose from.
              </p>
              <Button 
                size="lg" 
                className="font-bold shadow-lg shadow-primary/20"
                onClick={handleGenerateDM}
                disabled={isGeneratingDM}
              >
                {isGeneratingDM ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate 3 DMs</>
                )}
              </Button>
            </CardFooter>
          </Card>

          {dmResults.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-bold">Your DM Variations</h3>
              {dmResults.map((dm, index) => (
                <Card key={index} className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Variation {index + 1}</CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyDM(dm, index)}
                        className="gap-2"
                      >
                        {copiedIndex === index ? (
                          <><CheckCircle2 className="h-4 w-4 text-green-500" /> Copied!</>
                        ) : (
                          <><Copy className="h-4 w-4" /> Copy</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {dm}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function CoverLetterView() {
  const projects = useQuery(apiAny.projects.getProjects);
  const applications = useQuery(apiAny.applications.getApplicationsByProject, 
    projects && projects.length > 0 ? { projectId: projects[0]._id } : "skip"
  );
  const generateCoverLetter = useMutation(apiAny.coverLetters.generateCoverLetter);
  const coverLetters = useQuery(apiAny.coverLetters.getCoverLettersByApplication,
    applications && applications.length > 0 ? { applicationId: applications[0]._id } : "skip"
  );

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedApplication, setSelectedApplication] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedApplication) {
      toast.error("Please select an application first.");
      return;
    }

    setIsGenerating(true);
    try {
      await generateCoverLetter({ applicationId: selectedApplication as any });
      toast.success("Cover letter generation started! Check back in a moment.");
    } catch (error: any) {
      console.error(error);
      if (error.message === "CREDITS_EXHAUSTED") {
        toast.error("No credits remaining. Please upgrade to continue.");
      } else {
        toast.error("Failed to generate cover letter. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedLetter(id);
    toast.success("Cover letter copied to clipboard!");
    setTimeout(() => setCopiedLetter(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
          <Mail className="h-8 w-8 text-primary" /> AI Cover Letter Generator
        </h2>
        <p className="text-lg text-muted-foreground">
          Generate tailored cover letters that bridge your keyword gaps for each application.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Generate Cover Letter</CardTitle>
          <CardDescription>Select a project and application to generate a personalized cover letter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project: any) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  {(!projects || projects.length === 0) && (
                    <SelectItem value="none" disabled>No projects yet</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Application</Label>
              <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an application..." />
                </SelectTrigger>
                <SelectContent>
                  {applications?.map((app: any) => (
                    <SelectItem key={app._id} value={app._id}>
                      {app.jobTitle} at {app.companyName}
                    </SelectItem>
                  ))}
                  {(!applications || applications.length === 0) && (
                    <SelectItem value="none" disabled>No applications yet</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!projects || projects.length === 0 ? (
            <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Create a project and add applications first to generate cover letters.
              </p>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="justify-between bg-muted/30 p-6 border-t border-border">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Uses AI to bridge your keyword gaps
          </p>
          <Button 
            size="lg" 
            className="font-bold shadow-lg shadow-primary/20"
            onClick={handleGenerate}
            disabled={isGenerating || !selectedApplication}
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> Generate Letter</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {coverLetters && coverLetters.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold">Generated Cover Letters</h3>
          {coverLetters.map((letter: any) => (
            <Card key={letter._id} className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Version {letter.version}</CardTitle>
                    <CardDescription className="text-xs">
                      Generated {new Date(letter.generatedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(letter.content, letter._id)}
                      className="gap-2"
                    >
                      {copiedLetter === letter._id ? (
                        <><CheckCircle2 className="h-4 w-4 text-green-500" /> Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4" /> Copy</>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {letter.content}
                  </p>
                </div>
                {letter.keywordsBridged && letter.keywordsBridged.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Keywords Bridged:</p>
                    <div className="flex flex-wrap gap-2">
                      {letter.keywordsBridged.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}