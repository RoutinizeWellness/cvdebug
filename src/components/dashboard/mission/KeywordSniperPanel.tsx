import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Target, AlertTriangle, CheckCircle2, ArrowRight, Copy, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface KeywordSniperPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
  onGenerateCoverLetter: (applicationId: string) => void;
}

export function KeywordSniperPanel({ open, onOpenChange, job, onGenerateCoverLetter }: KeywordSniperPanelProps) {
  const [expandedKeyword, setExpandedKeyword] = useState<string | null>(null);
  const [keywordPhrases, setKeywordPhrases] = useState<Record<string, any>>({});
  const [loadingKeyword, setLoadingKeyword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'missing'>('overview');
  
  const generatePhrases = useAction(api.keywordSniper.generateKeywordPhrases);

  if (!job) return null;

  const missingKeywords = job.missingKeywords || [];
  const matchedKeywords = job.matchedKeywords || [];
  const score = job.score || 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleGeneratePhrases = async (keyword: string) => {
    setLoadingKeyword(keyword);
    try {
      const result = await generatePhrases({
        missingKeyword: keyword,
        resumeText: job.resumeText || "",
        jobDescription: job.jobDescriptionText || "",
        targetRole: job.jobTitle || "",
      });
      
      setKeywordPhrases(prev => ({
        ...prev,
        [keyword]: result
      }));
      setExpandedKeyword(keyword);
      toast.success(`Generated ${result.phrases.length} phrases for "${keyword}"`);
    } catch (error) {
      toast.error("Failed to generate phrases. Please try again.");
      console.error(error);
    } finally {
      setLoadingKeyword(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-[#0A0A0A] border-l border-zinc-800 text-zinc-200 p-0 flex flex-col">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/20">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border-zinc-700">
                Keyword Sniper
              </Badge>
              <div className={`flex items-center gap-2 font-mono font-bold ${
                score >= 80 ? "text-[#00FF41]" : score >= 50 ? "text-yellow-500" : "text-red-500"
              }`}>
                <Target className="h-4 w-4" />
                {score}% MATCH
              </div>
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-white">{job.jobTitle}</SheetTitle>
              <SheetDescription className="flex items-center gap-2 text-zinc-400 mt-1">
                <Briefcase className="h-3 w-3" /> {job.company}
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('overview')}
              className="flex-1"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'missing' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('missing')}
              className="flex-1"
            >
              Missing Keywords ({missingKeywords.length})
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* Matched Keywords */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Matched Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.slice(0, 10).map((keyword: string, i: number) => (
                    <Badge key={i} className="bg-green-500/20 text-green-400 border-green-500/30">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Critical Gaps Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Critical Keyword Gaps</h3>
                </div>
                
                {missingKeywords.length === 0 ? (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="text-sm font-medium">No critical gaps found! You're a strong match.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {missingKeywords.slice(0, 5).map((keyword: string, i: number) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-red-500/30 transition-colors cursor-pointer"
                        onClick={() => {
                          setActiveTab('missing');
                          setExpandedKeyword(keyword);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{keyword}</span>
                          <ArrowRight className="h-4 w-4 text-zinc-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="bg-zinc-800" />

              {/* Action Plan */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Fix Strategy</h3>
                <div className="space-y-2">
                  <div className="flex gap-3 p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50">
                    <div className="h-6 w-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-zinc-200">Update your Resume</p>
                      <p className="text-xs text-zinc-500">Use the AI-generated phrases to add missing keywords naturally.</p>
                    </div>
                  </div>
                  <div 
                    className="flex gap-3 p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 cursor-pointer hover:bg-zinc-900/50 transition-colors group"
                    onClick={() => {
                      onGenerateCoverLetter(job._id);
                      onOpenChange(false);
                    }}
                  >
                    <div className="h-6 w-6 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-200 group-hover:text-purple-400 transition-colors">Generate Cover Letter</p>
                        <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                      </div>
                      <p className="text-xs text-zinc-500">Use the AI Cover Letter tool to naturally weave these keywords in.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {missingKeywords.map((keyword: string, i: number) => {
                const isExpanded = expandedKeyword === keyword;
                const phrases = keywordPhrases[keyword];
                const isLoading = loadingKeyword === keyword;

                return (
                  <div key={i} className="group rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-red-500/30 transition-colors">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white">{keyword}</span>
                        <Badge variant="destructive" className="text-[10px] uppercase">Missing</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 mb-3">
                        Frequently appears in job descriptions for this role.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs bg-primary/10 border-primary/50 text-primary hover:bg-primary hover:text-black w-full justify-center font-bold"
                        onClick={() => handleGeneratePhrases(keyword)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 mr-2" />
                            Generate AI Phrases
                          </>
                        )}
                      </Button>
                    </div>

                    {/* AI-Generated Phrases */}
                    {isExpanded && phrases && (
                      <div className="border-t border-zinc-800 p-3 space-y-3 bg-zinc-950/50">
                        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase">
                          <Sparkles className="h-3 w-3" />
                          AI-Generated Phrases
                        </div>
                        {phrases.phrases.map((phrase: any, idx: number) => (
                          <div key={idx} className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs text-zinc-200 leading-relaxed flex-1">{phrase.text}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-primary/20"
                                onClick={() => copyToClipboard(phrase.text)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {phrase.metrics?.map((metric: string, mIdx: number) => (
                                <Badge key={mIdx} variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/30">
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-[10px] text-zinc-500 italic">{phrase.context}</p>
                          </div>
                        ))}
                        <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <span className="font-bold text-primary">Tip:</span> Add to {phrases.placementSuggestion} section
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/20">
          <Button className="w-full font-bold bg-white text-black hover:bg-zinc-200">
            Update Application Status
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}