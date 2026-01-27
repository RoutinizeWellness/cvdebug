import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Meh } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/contexts/I18nContext";

interface AIFeedbackWidgetProps {
  featureType: "chatbot" | "resume_analysis" | "interview_prep" | "cover_letter" | "keyword_sniper" | "linkedin_optimizer" | "recruiter_dm";
  wasAIGenerated: boolean;
  relatedId?: string;
  compact?: boolean;
}

export function AIFeedbackWidget({ featureType, wasAIGenerated, relatedId, compact = false }: AIFeedbackWidgetProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<"helpful" | "somewhat_helpful" | "not_helpful" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = useMutation(api.aiMonitoring.submitAIFeedback);

  const handleSubmit = async () => {
    if (!selectedRating) {
      toast.error(t.aiFeedback.selectRating);
      return;
    }

    try {
      await submitFeedback({
        featureType,
        rating: selectedRating,
        wasAIGenerated,
        comment: comment.trim() || undefined,
        relatedId,
      });

      toast.success(t.aiFeedback.feedbackSubmitted);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setSelectedRating(null);
        setComment("");
      }, 1500);
    } catch (error) {
      toast.error(t.aiFeedback.submitError);
      console.error(error);
    }
  };

  if (compact) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            {t.aiFeedback.rateResponse}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.aiFeedback.howHelpful}</DialogTitle>
            <DialogDescription>
              {t.aiFeedback.feedbackHelps}
            </DialogDescription>
          </DialogHeader>
          
          {!submitted ? (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center">
                <Button
                  variant={selectedRating === "helpful" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedRating("helpful")}
                  className="flex-1"
                >
                  <ThumbsUp className="w-5 h-5 mr-2" />
                  {t.aiFeedback.helpful}
                </Button>
                <Button
                  variant={selectedRating === "somewhat_helpful" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedRating("somewhat_helpful")}
                  className="flex-1"
                >
                  <Meh className="w-5 h-5 mr-2" />
                  {t.aiFeedback.okay}
                </Button>
                <Button
                  variant={selectedRating === "not_helpful" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedRating("not_helpful")}
                  className="flex-1"
                >
                  <ThumbsDown className="w-5 h-5 mr-2" />
                  {t.aiFeedback.notHelpful}
                </Button>
              </div>

              <Textarea
                placeholder={t.aiFeedback.additionalComments}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />

              <Button onClick={handleSubmit} className="w-full" disabled={!selectedRating}>
                {t.aiFeedback.submitFeedback}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg font-medium text-[#22C55E]">{t.aiFeedback.thankYou}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <p className="text-sm font-medium mb-3">{t.aiFeedback.wasHelpful}</p>
      <div className="flex gap-2">
        <Button
          variant={selectedRating === "helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRating("helpful")}
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          {t.aiFeedback.yes}
        </Button>
        <Button
          variant={selectedRating === "somewhat_helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRating("somewhat_helpful")}
        >
          <Meh className="w-4 h-4 mr-1" />
          {t.aiFeedback.somewhat}
        </Button>
        <Button
          variant={selectedRating === "not_helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRating("not_helpful")}
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          {t.aiFeedback.no}
        </Button>
      </div>

      {selectedRating && !submitted && (
        <div className="mt-3 space-y-2">
          <Textarea
            placeholder={t.aiFeedback.tellMore}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="text-sm"
          />
          <Button onClick={handleSubmit} size="sm" className="w-full">
            {t.aiFeedback.submit}
          </Button>
        </div>
      )}

      {submitted && (
        <p className="text-sm text-[#22C55E] mt-2">{t.aiFeedback.feedbackSubmitted}</p>
      )}
    </div>
  );
}
