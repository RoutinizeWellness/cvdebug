import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Linkedin, 
  Sparkles, 
  Lock, 
  Loader2, 
  Copy, 
  CheckCircle2,
  TrendingUp,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkedInHeader } from "./linkedin/LinkedInHeader";
import { ScoreGauge } from "./linkedin/ScoreGauge";
import { KeywordCloud } from "./linkedin/KeywordCloud";
import { HeadlineOptimizer } from "./linkedin/HeadlineOptimizer";
import { QuickFixList } from "./linkedin/QuickFixList";
import { Badge } from "@/components/ui/badge";

const apiAny = api as any;

export function LinkedInOptimizer() {
  const optimizeLinkedIn = useAction(apiAny.ai.linkedinOptimizer.optimizeLinkedIn);
  const generateRecruiterDMs = useAction(apiAny.ai.linkedinOptimizer.generateRecruiterDMs);
  const latestOptimization = useQuery(apiAny.linkedinProfile.getLatestOptimization);
  const recruiterDMs = useQuery(apiAny.linkedinProfile.getRecruiterDMs);
  
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

  // Use latest optimization if no new result
  const displayResult = result || latestOptimization;
  const score = displayResult?.score || 0;

  // Get matched and missing keywords from real data
  const matchedKeywords = displayResult?.experience?.matchedKeywords || [];
  const missingKeywords = displayResult?.experience?.missingKeywords || [];

  // Get last scanned time
  const lastScanned = displayResult?.generatedAt 
    ? new Date(displayResult.generatedAt).toLocaleString()
    : "Never";
  
  // Show empty state if no data
  const hasData = displayResult && score > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumbs */}
      <div className="px-6 py-4 border-b border-zinc-800/50">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-zinc-500">Dashboard</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500">Tools</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">LinkedIn Audit</span>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <LinkedInHeader 
            lastScanned={lastScanned}
            linkedinUrl={linkedinUrl || displayResult?.linkedinUrl}
            isAnalyzing={isAnalyzing}
            onRefresh={handleOptimize}
          />

          <TabsList className="grid w-full md:w-auto grid-cols-2 mb-8">
            <TabsTrigger value="optimize">Profile Optimizer</TabsTrigger>
            <TabsTrigger value="dm">Recruiter DM</TabsTrigger>
          </TabsList>

          <TabsContent value="optimize" className="space-y-8">
            {/* Input Section */}
            {!result && (
              <Card className="border-zinc-800 bg-zinc-900/80">
                <CardHeader>
                  <CardTitle className="text-xl">Import Profile</CardTitle>
                  <CardDescription>Paste your LinkedIn profile URL or content to analyze.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-3">
                    <Label htmlFor="linkedin-url" className="font-bold">LinkedIn URL</Label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input 
                          id="linkedin-url" 
                          placeholder="https://linkedin.com/in/yourname" 
                          className="pl-10 bg-black border-zinc-800" 
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" className="border-zinc-800" onClick={handleAnalyzeUrl}>
                        Analyze URL
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                      <span className="bg-zinc-900 px-4 text-zinc-500">Or paste content</span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="profile-text" className="font-bold">Profile Text (About, Experience, Skills)</Label>
                    <Textarea 
                      id="profile-text" 
                      placeholder="Paste your profile content here (About section, Experience descriptions, Skills list)..." 
                      className="min-h-[200px] resize-none p-4 leading-relaxed bg-black border-zinc-800"
                      value={profileText}
                      onChange={(e) => setProfileText(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="job-desc" className="font-bold">Target Job Description (Optional)</Label>
                    <Textarea 
                      id="job-desc" 
                      placeholder="Paste the job description you are targeting..." 
                      className="min-h-[100px] resize-none p-4 leading-relaxed bg-black border-zinc-800"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between bg-zinc-950/30 p-6 border-t border-zinc-800">
                  <p className="text-xs text-zinc-400 font-medium flex items-center gap-2">
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
                      <><Sparkles className="mr-2 h-4 w-4" /> Analyze Profile</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Results Section */}
            {displayResult && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <ScoreGauge 
                    score={score}
                    critique={displayResult.headline?.critique}
                  />

                  {/* Secondary Stats */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        {hasData && score >= 70 && (
                          <span className="text-xs font-medium px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                            Strong Profile
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm font-medium mb-1">Keyword Coverage</p>
                        <p className="text-2xl font-bold text-white">
                          {matchedKeywords.length}/{matchedKeywords.length + missingKeywords.length}
                        </p>
                        <p className="text-zinc-400 text-xs mt-1">
                          {matchedKeywords.length > 0 
                            ? `${Math.round((matchedKeywords.length / Math.max(matchedKeywords.length + missingKeywords.length, 1)) * 100)}% match rate`
                            : "No keywords analyzed yet"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Search className="h-5 w-5" />
                        </div>
                        {missingKeywords.length > 0 && (
                          <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded-full">
                            Action Needed
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm font-medium mb-1">Searchability Gap</p>
                        <p className="text-2xl font-bold text-white">
                          {missingKeywords.length} {missingKeywords.length === 1 ? 'Keyword' : 'Keywords'}
                        </p>
                        <p className="text-zinc-400 text-xs mt-1">
                          {missingKeywords.length > 0 
                            ? "Missing critical terms for target role"
                            : "All key terms present"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <HeadlineOptimizer 
                  current={displayResult.headline?.current}
                  suggested={displayResult.headline?.suggested}
                  critique={displayResult.headline?.critique}
                />

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <KeywordCloud 
                    matchedKeywords={matchedKeywords}
                    missingKeywords={missingKeywords}
                    hasData={hasData}
                  />

                  {/* Bio Audit */}
                  <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-bold text-lg">About Section Rewrite</h3>
                    </div>
                    <div className="bg-black rounded-lg p-5 font-mono text-sm leading-7 text-zinc-300 border border-zinc-800 whitespace-pre-wrap">
                      {displayResult.about?.rewritten || displayResult.about?.suggestions || "Your optimized About section will appear here..."}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-zinc-800"
                        onClick={() => setResult(null)}
                      >
                        Start Over
                      </Button>
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => {
                          navigator.clipboard.writeText(displayResult.about?.rewritten || displayResult.about?.suggestions || "");
                          toast.success("Copied to clipboard!");
                        }}
                      >
                        Copy Optimized Bio
                      </Button>
                    </div>
                  </div>
                </div>

                <QuickFixList tips={displayResult.actionableTips || []} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="dm" className="space-y-8">
            <Card className="border-zinc-800 bg-zinc-900/80">
              <CardHeader>
                <CardTitle className="text-xl">Generate Recruiter DMs</CardTitle>
                <CardDescription>Create personalized LinkedIn messages to send after applying.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="dm-profile" className="font-bold">Your Profile Summary</Label>
                  <Textarea 
                    id="dm-profile" 
                    placeholder="Paste your LinkedIn About section or a brief summary of your experience..." 
                    className="min-h-[120px] resize-none p-4 leading-relaxed bg-black border-zinc-800"
                    value={profileText}
                    onChange={(e) => setProfileText(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="dm-job" className="font-bold">Target Job Description</Label>
                  <Textarea 
                    id="dm-job" 
                    placeholder="Paste the job description you're applying for..." 
                    className="min-h-[120px] resize-none p-4 leading-relaxed bg-black border-zinc-800"
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
                      className="bg-black border-zinc-800"
                      value={dmRecruiterName}
                      onChange={(e) => setDmRecruiterName(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between bg-zinc-950/30 p-6 border-t border-zinc-800">
                <p className="text-xs text-zinc-400 font-medium">
                  We'll generate 3 variations (Casual, Professional, Technical).
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
                <div className="grid gap-4 md:grid-cols-3">
                  {dmResults.map((dm, index) => (
                    <Card key={index} className="border-primary/20 flex flex-col bg-zinc-900">
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
                        <CardTitle className="text-sm font-medium text-zinc-400">
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
      </main>
    </div>
  );
}