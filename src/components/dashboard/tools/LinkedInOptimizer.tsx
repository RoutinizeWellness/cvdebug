import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Linkedin, 
  Sparkles, 
  Lock, 
  Loader2
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
import { DMGenerator } from "./linkedin/DMGenerator";

const apiAny = api as any;

export function LinkedInOptimizer() {
  const optimizeLinkedIn = useAction(apiAny.ai.linkedinOptimizer.optimizeLinkedIn);
  const latestOptimization = useQuery(apiAny.linkedinProfile.getLatestOptimization);
  
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
      description: "Please copy and paste your profile content into the text box below.",
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

  const displayResult = result || latestOptimization;
  const score = displayResult?.score || 0;
  const matchedKeywords = displayResult?.experience?.matchedKeywords || [];
  const missingKeywords = displayResult?.experience?.missingKeywords || [];
  const lastScanned = displayResult?.generatedAt 
    ? new Date(displayResult.generatedAt).toLocaleString()
    : "Never";
  const hasData = displayResult && score > 0;

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Breadcrumbs */}
      <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-slate-500">Tools</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-500">Audit Suite</span>
          <span className="text-slate-600">/</span>
          <span className="text-primary font-medium">LinkedIn SEO Report</span>
        </div>
      </div>

      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <LinkedInHeader 
          lastScanned={lastScanned}
          linkedinUrl={linkedinUrl || displayResult?.linkedinUrl}
          isAnalyzing={isAnalyzing}
          onRefresh={handleOptimize}
        />

        {/* Input Section */}
        {!result && (
          <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md mb-6 shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Import Profile</CardTitle>
              <CardDescription className="text-slate-400">Paste your LinkedIn profile URL or content to analyze.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                <Label htmlFor="linkedin-url" className="font-bold text-slate-300">LinkedIn URL</Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                      id="linkedin-url" 
                      placeholder="https://linkedin.com/in/yourname" 
                      className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-primary/50" 
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={handleAnalyzeUrl}>
                    Analyze URL
                  </Button>
                </div>
              </div>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider font-bold">
                  <span className="bg-slate-900 px-4 text-slate-500">Or paste content</span>
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="profile-text" className="font-bold text-slate-300">Profile Text (About, Experience, Skills)</Label>
                <Textarea 
                  id="profile-text" 
                  placeholder="Paste your profile content here..." 
                  className="min-h-[200px] resize-none p-4 leading-relaxed bg-slate-950 border-slate-800 text-slate-300 placeholder:text-slate-600 focus:border-primary/50"
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="job-desc" className="font-bold text-slate-300">Target Job Description (Optional)</Label>
                <Textarea 
                  id="job-desc" 
                  placeholder="Paste the job description you are targeting..." 
                  className="min-h-[100px] resize-none p-4 leading-relaxed bg-slate-950 border-slate-800 text-slate-300 placeholder:text-slate-600 focus:border-primary/50"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between bg-slate-950/30 p-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <Lock className="h-3 w-3" /> We do not store your LinkedIn data permanently.
              </p>
              <Button 
                size="lg" 
                className="font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white"
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

        {/* Results Grid */}
        {displayResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <ScoreGauge 
              score={score}
              critique={displayResult.headline?.critique}
            />

            <KeywordCloud 
              matchedKeywords={matchedKeywords}
              missingKeywords={missingKeywords}
              hasData={hasData}
            />

            <HeadlineOptimizer 
              current={displayResult.headline?.current}
              suggested={displayResult.headline?.suggested}
              critique={displayResult.headline?.critique}
            />

            <DMGenerator />
          </div>
        )}
      </main>
    </div>
  );
}