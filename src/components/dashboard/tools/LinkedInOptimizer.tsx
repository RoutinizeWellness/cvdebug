import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Linkedin, Sparkles, Lock, Check, Loader2, AlertCircle, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Cast to any to avoid deep type instantiation errors
const apiAny = api as any;

export function LinkedInOptimizer() {
  const optimizeLinkedIn = useAction(apiAny.ai.linkedinOptimizer.optimizeLinkedIn);
  const generateRecruiterDMs = useAction(apiAny.ai.linkedinOptimizer.generateRecruiterDMs);
  
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("optimize");
  const [dmRecruiterName, setDmRecruiterName] = useState("");
  const [isGeneratingDM, setIsGeneratingDM] = useState(false);
  const [dmResults, setDmResults] = useState<any[]>([]);
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
      const data = await generateRecruiterDMs({
        profileText,
        jobDescription,
        recruiterName: dmRecruiterName,
      });

      if (data && data.variations) {
        setDmResults(data.variations);
        toast.success("3 DM variations generated!");
      } else {
        toast.error("Failed to generate DMs. Invalid response.");
      }
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
                className="font-bold shadow-lg shadow-primary/20 relative overflow-hidden group"
                onClick={handleOptimize}
                disabled={isAnalyzing}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
                      "{result.headline.suggested}"
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{result.headline.critique}</p>
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
                      {result.experience?.missingKeywords?.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About Section Rewrite</CardTitle>
                  <CardDescription>Recruiter-Search Friendly version</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg text-sm leading-relaxed border border-border whitespace-pre-wrap">
                    {result.about.rewritten || result.about.suggestions}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actionable Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.actionableTips?.map((tip: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{typeof tip === 'string' ? tip : tip.tip}</span>
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
              </div>
            </CardContent>
            <CardFooter className="justify-between bg-muted/30 p-6 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium">
                We'll generate 3 variations (Casual, Professional, Technical).
              </p>
              <Button 
                size="lg" 
                className="font-bold shadow-lg shadow-primary/20 relative overflow-hidden group"
                onClick={handleGenerateDM}
                disabled={isGeneratingDM}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
              <div className="grid gap-4 md:grid-cols-3">
                {dmResults.map((dm, index) => (
                  <Card key={index} className="border-primary/20 flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{dm.tone}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyDM(dm.content, index)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Subject: {dm.subject}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {dm.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
