import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MobileKeywordChecklistProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  onGeneratePhrases?: (keyword: string) => Promise<any>;
}

export function MobileKeywordChecklist({
  matchedKeywords,
  missingKeywords,
  onGeneratePhrases
}: MobileKeywordChecklistProps) {
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeywordClick = async (keyword: string) => {
    setSelectedKeyword(keyword);
    if (onGeneratePhrases) {
      setIsLoading(true);
      try {
        const result = await onGeneratePhrases(keyword);
        setSuggestions(result.phrases || []);
      } catch (error) {
        toast.error("Failed to generate suggestions");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      {/* Matched Keywords */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#22C55E] uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="h-3 w-3" />
          Matched ({matchedKeywords.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {matchedKeywords.slice(0, 8).map((keyword, i) => (
            <Badge key={i} className="bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E] text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>

      {/* Missing Keywords - Vertical Checklist */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#EF4444] uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="h-3 w-3" />
          Missing ({missingKeywords.length})
        </h4>
        <div className="space-y-2">
          {missingKeywords.map((keyword, i) => (
            <motion.button
              key={i}
              onClick={() => handleKeywordClick(keyword)}
              className="w-full p-3 rounded-lg bg-[#FFFFFF] border-2 border-[#F3E8FF] hover:border-[#8B5CF6]/60 transition-all text-left shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
              whileTap={{ scale: 0.98 }}
              animate={{
                borderColor: i === 0 ? ["rgba(139,92,246,0.3)", "rgba(139,92,246,0.6)", "rgba(139,92,246,0.3)"] : undefined
              }}
              transition={{
                borderColor: { duration: 2, repeat: Infinity }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F172A] text-sm">{keyword}</span>
                <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom Sheet for Suggestions */}
      <Sheet open={!!selectedKeyword} onOpenChange={() => setSelectedKeyword(null)}>
        <SheetContent side="bottom" className="bg-[#FFFFFF] border-t border-[#E2E8F0] rounded-t-3xl max-h-[80vh]">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-[#0F172A] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#8B5CF6]" />
              AI Suggestions for "{selectedKeyword}"
            </SheetTitle>
          </SheetHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-[#8B5CF6]" />
              </motion.div>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[60vh] pb-6">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-[#475569] leading-relaxed flex-1">
                      {suggestion.text}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(suggestion.text)}
                      className="h-8 w-8 p-0 hover:bg-[#8B5CF6]/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {suggestion.context && (
                    <p className="text-xs text-[#64748B] italic">{suggestion.context}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
