import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Crosshair, Check, AlertCircle, Wand2, Loader2, Download, FileText, Copy, Lock, ArrowUpCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Keyword {
  name: string;
  category: string;
  impact: string;
}

interface BulletPointSniperProps {
  matchedKeywords: Keyword[];
  missingKeywords: Keyword[];
  onSnipe: (keyword: string, userContext?: string) => Promise<any>;
  snipingKeyword: string | null;
  isProcessing?: boolean;
  isPremium?: boolean;
  onUnlock?: () => void;
  onUpdateResume?: () => void;
  resumeText?: string;
}

export function BulletPointSniper({ 
  matchedKeywords, 
  missingKeywords, 
  onSnipe, 
  snipingKeyword, 
  isProcessing = false,
  isPremium = false,
  onUnlock,
  onUpdateResume,
  resumeText = ""
}: BulletPointSniperProps) {
  const [activeTab, setActiveTab] = useState<"missing" | "found">("missing");
  const [generatedBullets, setGeneratedBullets] = useState<Record<string, any>>({});
  const [fixedKeywords, setFixedKeywords] = useState<Set<string>>(new Set());
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [userContexts, setUserContexts] = useState<Record<string, string>>({});
  const [showContextInput, setShowContextInput] = useState<string | null>(null);

  const handleSnipeClick = async (keyword: string) => {
    if (!isPremium) {
      onUnlock?.();
      return;
    }

    // Get user's context for this keyword (if they provided it)
    const userContext = userContexts[keyword];
    
    // If no context provided, try to extract from resume text
    const contextToUse = userContext || extractKeywordContext(keyword, resumeText);

    const result = await onSnipe(keyword, contextToUse);
    if (result) {
      // Normalize result to ensure we have the 3 types
      let formattedResult = result;
      if (Array.isArray(result)) {
        formattedResult = {
          performance: result[0] || "Optimized workflow...",
          business: result[1] || "Increased efficiency...",
          leadership: result[2] || "Led team implementation..."
        };
      }
      
      setGeneratedBullets(prev => ({
        ...prev,
        [keyword]: formattedResult
      }));
      setShowContextInput(null); // Hide context input after generation
    }
  };

  // Helper to extract context from resume text
  const extractKeywordContext = (keyword: string, text: string): string => {
    if (!text) return "";
    
    // Find sentences containing the keyword
    const sentences = text.split(/[.!?]+/);
    const relevantSentences = sentences.filter(s => 
      s.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return relevantSentences.slice(0, 2).join(". ").trim();
  };

  const handleCopy = (text: string, id: string, keyword: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(id);
    setFixedKeywords(prev => new Set(prev).add(keyword));
    toast.success("Power Statement copied!");
    setTimeout(() => setCopiedState(null), 2000);
  };

  const isEmpty = matchedKeywords.length === 0 && missingKeywords.length === 0;

  return (
    <motion.div
      className="glass-panel rounded-xl flex flex-col h-[600px] overflow-hidden bg-[#FFFFFF] backdrop-blur-xl border border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[#0F172A] font-bold text-lg flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-primary" />
              Bullet Point Sniper
            </h3>
            <p className="text-xs text-[#64748B] mt-1">Generate AI Power Statements that augment YOUR experience</p>
          </div>
          {/* Match Score Counter (Mini) */}
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Match Potential</span>
             <span className="text-xl font-bold text-[#22C55E]">
               {Math.min(100, Math.round((matchedKeywords.length + fixedKeywords.size) / (matchedKeywords.length + missingKeywords.length || 1) * 100))}%
             </span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#F8FAFC]">
            <TabsTrigger value="missing" className="data-[state=active]:bg-[#EF4444]/20 data-[state=active]:text-[#EF4444] text-xs">
              Missing ({missingKeywords.length})
            </TabsTrigger>
            <TabsTrigger value="found" className="data-[state=active]:bg-[#22C55E]/20 data-[state=active]:text-[#22C55E] text-xs">
              Found ({matchedKeywords.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-[#F8FAFC]">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full text-[#64748B] gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Analyzing resume keywords...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-4">
            <div className="p-4 rounded-full bg-[#F8FAFC]/50 border border-[#E2E8F0]">
              <FileText className="h-8 w-8 text-[#64748B]" />
            </div>
            <div>
              <h4 className="text-[#0F172A] font-medium mb-1">Ready to Snipe</h4>
              <p className="text-sm text-[#64748B] max-w-[250px] mx-auto">
                Upload a resume and paste a Job Description to start sniping gaps.
              </p>
            </div>
            <Button variant="outline" onClick={onUpdateResume} className="gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              Upload Resume
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            {activeTab === "missing" && (
              <>
                {missingKeywords.map((keyword, idx) => {
                  const isFixed = fixedKeywords.has(keyword.name);
                  const bullets = generatedBullets[keyword.name];
                  const isSniping = snipingKeyword === keyword.name;
                  const showingContext = showContextInput === keyword.name;

                  return (
                    <motion.div
                      key={`missing-${idx}`}
                      layout
                      className={`rounded-lg border transition-all overflow-hidden shadow-sm ${
                        isFixed
                          ? "bg-[#F59E0B]/5 border-[#F59E0B]/20"
                          : "bg-[#EF4444]/5 border-[#EF4444]/20 hover:bg-[#EF4444]/10"
                      }`}
                    >
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded ${isFixed ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-[#EF4444]/20 text-[#EF4444]"}`}>
                            {isFixed ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-medium ${isFixed ? "text-[#F59E0B]" : "text-[#0F172A]"}`}>
                              {keyword.name}
                            </span>
                            <span className="text-[10px] text-[#64748B] font-mono flex items-center gap-2">
                              {keyword.category}
                              <Badge variant="outline" className="text-[9px] h-4 px-1 border-[#E2E8F0] text-[#64748B]">
                                {keyword.impact} Impact
                              </Badge>
                            </span>
                          </div>
                        </div>
                        
                        {!bullets && !isFixed && (
                          <div className="flex gap-2">
                            {!showingContext && (
                              <Button 
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowContextInput(keyword.name)}
                                className="h-8 text-xs text-[#64748B] hover:text-[#0F172A]"
                              >
                                Add Context
                              </Button>
                            )}
                            <Button 
                              size="sm"
                              onClick={() => handleSnipeClick(keyword.name)}
                              disabled={isSniping}
                              className={`h-8 text-xs font-semibold gap-2 ${
                                !isPremium
                                  ? "bg-[#F8FAFC] text-[#64748B] hover:bg-[#E2E8F0]"
                                  : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444] hover:text-white shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                              }`}
                            >
                              {isSniping ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Sniping...
                                </>
                              ) : !isPremium ? (
                                <>
                                  <Lock className="h-3 w-3" />
                                  Unlock
                                </>
                              ) : (
                                <>
                                  <Wand2 className="h-3 w-3" />
                                  Snipe it
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Context Input Panel */}
                      {showingContext && !bullets && (
                        <div className="border-t border-[#E2E8F0] p-3 bg-[#F8FAFC] space-y-2">
                          <label className="text-xs text-[#64748B] font-medium">
                            How did you use {keyword.name}? (Optional - helps AI augment YOUR experience)
                          </label>
                          <Textarea
                            placeholder={`e.g., "Used ${keyword.name} to build a dashboard" or "Implemented ${keyword.name} for data processing"`}
                            value={userContexts[keyword.name] || ""}
                            onChange={(e) => setUserContexts(prev => ({ ...prev, [keyword.name]: e.target.value }))}
                            className="min-h-[60px] bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] text-xs"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowContextInput(null)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSnipeClick(keyword.name)}
                              disabled={isSniping}
                              className="text-xs bg-primary hover:bg-primary/90"
                            >
                              Generate with Context
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Generated Bullets Panel */}
                      <AnimatePresence>
                        {bullets && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-[#E2E8F0] bg-[#FFFFFF]/50"
                          >
                            <div className="p-3 space-y-3">
                              <p className="text-xs text-[#64748B] font-medium px-1">Select a Power Statement to copy:</p>
                              
                              {/* Performance Version */}
                              {bullets.performance && (
                                <div className="group relative p-3 rounded bg-[#FFFFFF] border border-[#E2E8F0] hover:border-primary/50 transition-colors">
                                  <div className="flex justify-between gap-3">
                                    <div>
                                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 block">Performance</span>
                                      <p className="text-xs text-[#475569] leading-relaxed">{bullets.performance}</p>
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 shrink-0 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                                      onClick={() => handleCopy(bullets.performance, `${keyword.name}-perf`, keyword.name)}
                                    >
                                      {copiedState === `${keyword.name}-perf` ? <Check className="h-3 w-3 text-[#22C55E]" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Business Version */}
                              {bullets.business && (
                                <div className="group relative p-3 rounded bg-[#FFFFFF] border border-[#E2E8F0] hover:border-primary/50 transition-colors">
                                  <div className="flex justify-between gap-3">
                                    <div>
                                      <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider mb-1 block">Business Value</span>
                                      <p className="text-xs text-[#475569] leading-relaxed">{bullets.business}</p>
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 shrink-0 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                                      onClick={() => handleCopy(bullets.business, `${keyword.name}-biz`, keyword.name)}
                                    >
                                      {copiedState === `${keyword.name}-biz` ? <Check className="h-3 w-3 text-[#22C55E]" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Leadership Version */}
                              {bullets.leadership && (
                                <div className="group relative p-3 rounded bg-[#FFFFFF] border border-[#E2E8F0] hover:border-primary/50 transition-colors">
                                  <div className="flex justify-between gap-3">
                                    <div>
                                      <span className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider mb-1 block">Leadership</span>
                                      <p className="text-xs text-[#475569] leading-relaxed">{bullets.leadership}</p>
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 shrink-0 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                                      onClick={() => handleCopy(bullets.leadership, `${keyword.name}-lead`, keyword.name)}
                                    >
                                      {copiedState === `${keyword.name}-lead` ? <Check className="h-3 w-3 text-[#22C55E]" /> : <Copy className="h-3 w-3" />}
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
                {missingKeywords.length === 0 && (
                  <div className="p-8 text-center text-[#64748B]">
                    <Check className="h-8 w-8 mx-auto mb-2 text-[#22C55E]/50" />
                    <p>No missing keywords found!</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "found" && (
              <>
                {matchedKeywords.map((keyword, idx) => (
                  <div key={`matched-${idx}`} className="flex items-center justify-between p-3 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-[#22C55E]/10 text-[#22C55E]">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0F172A]">{keyword.name}</span>
                        <span className="text-[10px] text-[#64748B] font-mono">{keyword.category}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#64748B]">{keyword.impact}</span>
                  </div>
                ))}
                {matchedKeywords.length === 0 && (
                  <div className="p-8 text-center text-[#64748B]">
                    <p>No keywords matched yet.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] backdrop-blur">
        <Button
          onClick={onUpdateResume}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
        >
          <ArrowUpCircle className="h-4 w-4" />
          Update Resume with Fixes
        </Button>
      </div>
    </motion.div>
  );
}