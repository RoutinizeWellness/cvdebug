import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Linkedin, 
  Sparkles, 
  Lock, 
  Check, 
  Loader2, 
  AlertCircle, 
  Copy, 
  CheckCircle2,
  TrendingUp,
  Search,
  Calendar,
  RefreshCw,
  Cloud,
  FileText,
  X,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const apiAny = api as any;

export function LinkedInOptimizer() {
  const optimizeLinkedIn = useAction(apiAny.ai.linkedinOptimizer.optimizeLinkedIn);
  const generateRecruiterDMs = useAction(apiAny.ai.linkedinOptimizer.generateRecruiterDMs);
  const latestOptimization = useQuery(apiAny.linkedinProfile.getLatestOptimization);
  const allOptimizations = useQuery(apiAny.linkedinProfile.getAllOptimizations);
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
  const [showAllKeywords, setShowAllKeywords] = useState(false);

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

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Use latest optimization if no new result
  const displayResult = result || latestOptimization;
  const score = displayResult?.score || 0;
  const scoreColor = score >= 80 ? "text-primary" : score >= 60 ? "text-yellow-500" : "text-red-500";
  const scoreBg = score >= 80 ? "bg-primary" : score >= 60 ? "bg-yellow-500" : "bg-red-500";

  // Get matched and missing keywords from real data
  const matchedKeywords = displayResult?.experience?.matchedKeywords || [];
  const missingKeywords = displayResult?.experience?.missingKeywords || [];
  const allKeywords = [...matchedKeywords, ...missingKeywords];

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                LinkedIn Profile Audit
              </h1>
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Last scanned: {lastScanned}</span>
                {(linkedinUrl || displayResult?.linkedinUrl) && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="truncate max-w-[200px]">{linkedinUrl || displayResult?.linkedinUrl}</span>
                  </>
                )}
              </div>
            </div>
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="optimize">Profile Optimizer</TabsTrigger>
              <TabsTrigger value="dm">Recruiter DM</TabsTrigger>
            </TabsList>
          </div>

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
                  {/* Score Card */}
                  <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <TrendingUp className="h-24 w-24" />
                    </div>
                    <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-6">
                      Recruiter Visibility Score
                    </h3>
                    <div className="flex items-center gap-6">
                      {/* Circular Gauge */}
                      <div 
                        className="relative size-32 rounded-full flex items-center justify-center"
                        style={{ background: `conic-gradient(${score >= 80 ? '#7c3bed' : score >= 60 ? '#eab308' : '#ef4444'} ${score}%, #27272a 0)` }}
                      >
                        <div className="absolute inset-[10px] bg-zinc-900 rounded-full flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-white">{score}</span>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold">
                            {score >= 80 ? "Great" : score >= 60 ? "Good" : "Poor"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <p className="text-white font-medium leading-snug">
                          {displayResult.headline?.critique || "Your profile visibility analysis"}
                        </p>
                        {score < 80 && (
                          <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
                            <AlertCircle className="h-4 w-4" />
                            <span>Invisible to {100 - score}% of recruiters</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

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
                          {matchedKeywords.length}/{allKeywords.length}
                        </p>
                        <p className="text-zinc-400 text-xs mt-1">
                          {matchedKeywords.length > 0 
                            ? `${Math.round((matchedKeywords.length / Math.max(allKeywords.length, 1)) * 100)}% match rate`
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

                {/* Headline Optimizer */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Headline Optimizer
                    </h3>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={handleOptimize}
                      disabled={isAnalyzing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      Re-scan
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    {/* Current */}
                    <div className="p-6 border-b lg:border-b-0 lg:border-r border-zinc-800 bg-zinc-900/50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                          <X className="h-4 w-4" /> Current Headline
                        </span>
                      </div>
                      <div className="p-4 rounded-lg border border-red-900/30 bg-red-900/10 text-zinc-300 font-mono text-sm leading-relaxed">
                        {displayResult.headline?.current || "Software Engineer looking for new opportunities in tech."}
                      </div>
                      <p className="mt-3 text-xs text-red-400/80">
                        {displayResult.headline?.critique || "Analysis: Too generic. Misses specific stack and value proposition."}
                      </p>
                    </div>

                    {/* Optimized */}
                    <div className="p-6 bg-black/50 relative">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full"></div>
                      <div className="flex justify-between items-center mb-4 relative z-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          <Sparkles className="h-4 w-4" /> AI Recommendation
                        </span>
                        <button 
                          onClick={() => handleCopyText(displayResult.headline?.suggested || "")}
                          className="text-xs flex items-center gap-1 text-white hover:text-primary transition-colors"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                      </div>
                      <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 text-white font-mono text-sm leading-relaxed shadow-[0_0_15px_rgba(124,59,237,0.1)]">
                        {displayResult.headline?.suggested || "Senior Frontend Engineer | React, TypeScript, Next.js | Building Scalable SaaS Architectures"}
                      </div>
                      <p className="mt-3 text-xs text-primary/80">
                        Improvement: Includes high-value keywords and role seniority.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Keyword Cloud */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-primary" />
                        ATS Keywords
                      </h3>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-400 mb-4 uppercase tracking-wider font-semibold">
                        Found in your profile
                      </p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {matchedKeywords.length > 0 ? (
                          matchedKeywords.slice(0, 4).map((kw: string, i: number) => (
                            <Badge key={i} className="bg-green-500/10 border-green-500/30 text-green-400">
                              {kw}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-zinc-500 italic">No matched keywords yet. Analyze your profile first.</p>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mb-4 uppercase tracking-wider font-semibold flex items-center gap-2">
                        Missing (Critical)
                        <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {missingKeywords.length > 0 ? (
                          missingKeywords.slice(0, showAllKeywords ? undefined : 5).map((kw: any, i: number) => (
                            <Badge 
                              key={i} 
                              variant="outline"
                              className="border-dashed border-red-500/40 text-red-400 hover:bg-red-500/10 cursor-help"
                              title="Critical keyword missing from your profile"
                            >
                              {typeof kw === 'string' ? kw : kw.keyword}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-xs text-zinc-500 italic">
                            {hasData ? "Great! No critical keywords missing." : "Analyze your profile to see missing keywords."}
                          </p>
                        )}
                      </div>
                    </div>
                    {allKeywords.length > 5 && (
                      <div className="mt-6 pt-6 border-t border-zinc-800">
                        <button 
                          onClick={() => setShowAllKeywords(!showAllKeywords)}
                          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                        >
                          {showAllKeywords ? "Show less" : `View all ${allKeywords.length} keywords`} 
                          <ArrowRight className={`h-4 w-4 transition-transform ${showAllKeywords ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bio Audit */}
                  <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        About Section Rewrite
                      </h3>
                      <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400">
                          <span className="size-2 rounded-full bg-red-400"></span> Issues
                        </span>
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-primary">
                          <span className="size-2 rounded-full bg-primary"></span> Fixed
                        </span>
                      </div>
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
                        onClick={() => handleCopyText(displayResult.about?.rewritten || displayResult.about?.suggestions || "")}
                      >
                        Copy Optimized Bio
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Fix List */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Quick Fixes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayResult.actionableTips?.slice(0, 6).map((tip: any, i: number) => {
                      const tipText = typeof tip === 'string' ? tip : tip.tip;
                      const isDone = typeof tip === 'object' && tip.completed === true;
                      
                      return (
                        <div 
                          key={i}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${
                            isDone 
                              ? 'bg-green-500/5 border-green-500/10' 
                              : 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10 transition-colors cursor-pointer group'
                          }`}
                        >
                          <div className={`rounded-full p-0.5 mt-0.5 ${
                            isDone 
                              ? 'bg-green-500 text-white' 
                              : 'bg-zinc-900 border border-red-500 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors'
                          }`}>
                            {isDone ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isDone ? 'text-white/70 line-through' : 'text-white font-bold'}`}>
                              {tipText}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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