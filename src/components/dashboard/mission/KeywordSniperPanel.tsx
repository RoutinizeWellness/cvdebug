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
import { Target, AlertTriangle, CheckCircle2, ArrowRight, Copy, Briefcase, Sparkles, Loader2, FileText, ArrowRightLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SnippetForge } from "../SnippetForge";

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
  const [activeTab, setActiveTab] = useState<'overview' | 'missing' | 'diff'>('overview');
  const [showSnippetForge, setShowSnippetForge] = useState(false);
  const [selectedKeywordForForge, setSelectedKeywordForForge] = useState<string | null>(null);
  
  const generatePhrases = useAction(api.keywordSniper.generateKeywordPhrases);

  if (!job) return null;

  const missingKeywords = job.missingKeywords || [];
  const matchedKeywords = job.matchedKeywords || [];
  const score = job.score || 0;
  
  // Check if this is a redacted view (from getResumes)
  // Note: job object here comes from ProjectBoard which might be constructed from application or resume
  // We'll assume if we have a large number of missing keywords but only see 2, it might be redacted
  // But better to rely on the passed data. For now, we'll implement the upsell banner logic based on counts.
  const totalMissing = job.totalMissingKeywords || missingKeywords.length;
  const isRedacted = job.isRedacted || (totalMissing > missingKeywords.length);

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
      setSelectedKeywordForForge(keyword);
      setShowSnippetForge(true);
      toast.success(`Generated ${result.phrases.length} phrases for "${keyword}"`);
    } catch (error) {
      toast.error("Failed to generate phrases. Please try again.");
      console.error(error);
    } finally {
      setLoadingKeyword(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md bg-[#FFFFFF] border-l border-[#E2E8F0] text-[#0F172A] p-0 flex flex-col">
          <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <SheetHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-[#FFFFFF] text-[#64748B] border-[#E2E8F0]">
                  Keyword Sniper
                </Badge>
                <div className={`flex items-center gap-2 font-mono font-bold ${
                  score >= 80 ? "text-[#22C55E]" : score >= 50 ? "text-[#F59E0B]" : "text-[#EF4444]"
                }`}>
                  <Target className="h-4 w-4" />
                  {score}% MATCH
                </div>
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-[#0F172A]">{job.jobTitle}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 text-[#64748B] mt-1">
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
                Missing ({totalMissing})
              </Button>
              <Button
                variant={activeTab === 'diff' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('diff')}
                className="flex-1"
              >
                Diff View
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            {isRedacted && (
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#F3E8FF] to-[#DBEAFE] border border-[#1E293B]/30 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-4 w-4 text-[#1E293B]" />
                    <h3 className="font-bold text-[#0F172A] text-sm">Unlock Full Analysis</h3>
                  </div>
                  <p className="text-xs text-[#475569] mb-3">
                    Detected <span className="font-bold text-[#0F172A]">{totalMissing} missing keywords</span>.
                    Here are 2: <span className="font-mono text-[#1E293B]">[{missingKeywords.slice(0, 2).map((k: any) => typeof k === 'string' ? k : k.keyword).join(', ')}]</span>.
                  </p>
                  <Button size="sm" className="w-full bg-[#0F172A] text-white hover:bg-[#1E293B] font-bold h-8 text-xs">
                    Pay €9.99 to Unlock All {totalMissing - 2} & Fix Score
                  </Button>
                </div>
                {/* Background effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E293B]/10 blur-3xl rounded-full -mr-10 -mt-10" />
              </div>
            )}

            {activeTab === 'overview' ? (
              <div className="space-y-8">
                {/* Matched Keywords */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#22C55E]">
                    <CheckCircle2 className="h-4 w-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Matched Keywords</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedKeywords.slice(0, 10).map((keyword: string, i: number) => (
                      <Badge key={i} className="bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/30">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-[#E2E8F0]" />

                {/* Critical Gaps Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#EF4444]">
                    <AlertTriangle className="h-4 w-4" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">Critical Keyword Gaps</h3>
                  </div>
                  
                  {missingKeywords.length === 0 ? (
                    <motion.div
                      className="p-4 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center gap-3 text-[#22C55E]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="text-sm font-medium">No critical gaps found! You're a strong match.</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {missingKeywords.slice(0, 5).map((keyword: string, i: number) => (
                        <motion.div
                          key={i}
                          className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#EF4444]/30 transition-colors cursor-pointer relative shadow-sm"
                          onClick={() => {
                            setActiveTab('missing');
                            setExpandedKeyword(keyword);
                          }}
                          whileHover={{ x: 4 }}
                          animate={{
                            borderColor: i === 0 ? ["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.4)", "rgba(239, 68, 68, 0.2)"] : undefined
                          }}
                          transition={{
                            borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          {i === 0 && (
                            <motion.div
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#EF4444] rounded-full"
                              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#0F172A]">{keyword}</span>
                            <ArrowRight className="h-4 w-4 text-[#64748B]" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="bg-[#E2E8F0]" />

                {/* Action Plan */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#64748B] uppercase tracking-wider">Fix Strategy</h3>
                  <div className="space-y-2">
                    <div className="flex gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="h-6 w-6 rounded-full bg-[#64748B]/10 text-[#64748B] flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-[#0F172A]">Update your Resume</p>
                        <p className="text-xs text-[#64748B]">Use the AI-generated phrases to add missing keywords naturally.</p>
                      </div>
                    </div>
                    <div
                      className="flex gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer hover:bg-[#FFFFFF] hover:border-[#1E293B] transition-colors group"
                      onClick={() => {
                        onGenerateCoverLetter(job._id);
                        onOpenChange(false);
                      }}
                    >
                      <div className="h-6 w-6 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#0F172A] group-hover:text-[#1E293B] transition-colors">Generate Cover Letter</p>
                          <ArrowRight className="h-3 w-3 text-[#64748B] group-hover:text-[#1E293B] transition-colors" />
                        </div>
                        <p className="text-xs text-[#64748B]">Use the AI Cover Letter tool to naturally weave these keywords in.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'diff' ? (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <h3 className="text-sm font-bold text-[#0F172A] mb-2 flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4 text-[#64748B]" />
                    Augmentation Visualizer
                  </h3>
                  <p className="text-xs text-[#64748B] mb-4">
                    See how your Master CV compares to the target job description.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Master CV Base</div>
                      <div className="h-32 rounded bg-[#FFFFFF] border border-[#E2E8F0] p-2 overflow-hidden relative">
                        <div className="text-[8px] text-[#64748B] leading-relaxed font-mono opacity-50">
                          {job.resumeText ? job.resumeText.substring(0, 300) + "..." : "Resume content..."}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FFFFFF]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Target Instance</div>
                      <div className="h-32 rounded bg-[#64748B]/5 border border-[#64748B]/20 p-2 overflow-hidden relative">
                        <div className="space-y-1">
                          {missingKeywords.slice(0, 3).map((kw: any, i: number) => (
                            <div key={i} className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-[#64748B]" />
                              <div className="h-1.5 bg-[#64748B]/20 rounded w-16" />
                              <span className="text-[8px] text-[#64748B] font-bold">+{typeof kw === 'string' ? kw : kw.keyword}</span>
                            </div>
                          ))}
                          <div className="h-1.5 bg-[#E2E8F0] rounded w-full" />
                          <div className="h-1.5 bg-[#E2E8F0] rounded w-2/3" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#64748B]/5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#64748B] uppercase">Suggested Augmentations</h4>
                  {missingKeywords.map((keyword: any, i: number) => {
                    const kw = typeof keyword === 'string' ? keyword : keyword.keyword;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="w-6 h-6 rounded-full bg-[#64748B]/10 flex items-center justify-center text-[#64748B] text-xs font-bold">
                          +
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">Inject "{kw}"</p>
                          <p className="text-xs text-[#64748B]">Recommended for Skills or Experience section</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {missingKeywords.map((keyword: string, i: number) => {
                  const isExpanded = expandedKeyword === keyword;
                  const phrases = keywordPhrases[keyword];
                  const isLoading = loadingKeyword === keyword;

                  return (
                    <div key={i} className="group rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#EF4444]/30 transition-colors shadow-sm">
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[#0F172A]">{keyword}</span>
                          <Badge variant="destructive" className="text-[10px] uppercase">Missing</Badge>
                        </div>
                        <p className="text-xs text-[#64748B] mb-3">
                          Frequently appears in job descriptions for this role.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs bg-primary/10 border-primary/50 text-primary hover:bg-primary hover:text-white w-full justify-center font-bold"
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
                        <div className="border-t border-[#E2E8F0] p-3 space-y-3 bg-[#F8FAFC]">
                          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase">
                            <Sparkles className="h-3 w-3" />
                            AI-Generated Phrases
                          </div>
                          {phrases.phrases.map((phrase: any, idx: number) => (
                            <div key={idx} className="p-3 rounded bg-[#FFFFFF] border border-[#E2E8F0] space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-[#0F172A] leading-relaxed flex-1">{phrase.text}</p>
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
                              <p className="text-[10px] text-[#64748B] italic">{phrase.context}</p>
                            </div>
                          ))}
                          <div className="text-[10px] text-[#64748B] flex items-center gap-1">
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

          <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <Button className="w-full font-bold bg-[#0F172A] text-white hover:bg-[#1E293B]">
              Update Application Status
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {selectedKeywordForForge && keywordPhrases[selectedKeywordForForge] && (
        <SnippetForge
          open={showSnippetForge}
          onOpenChange={setShowSnippetForge}
          keyword={selectedKeywordForForge}
          suggestions={keywordPhrases[selectedKeywordForForge].phrases}
        />
      )}
    </>
  );
}