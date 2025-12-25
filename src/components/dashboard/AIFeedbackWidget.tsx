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

interface AIFeedbackWidgetProps {
  featureType: "chatbot" | "resume_analysis" | "interview_prep" | "cover_letter" | "keyword_sniper" | "linkedin_optimizer" | "recruiter_dm";
  wasAIGenerated: boolean;
  relatedId?: string;
  compact?: boolean;
}

export function AIFeedbackWidget({ featureType, wasAIGenerated, relatedId, compact = false }: AIFeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<"helpful" | "somewhat_helpful" | "not_helpful" | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = useMutation(api.aiMonitoring.submitAIFeedback);

  const handleSubmit = async () => {
    if (!selectedRating) {
      toast.error("Please select a rating");
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

      toast.success("Thank you for your feedback!");
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setSelectedRating(null);
        setComment("");
      }, 1500);
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error(error);
    }
  };

  if (compact) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            Rate this response
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How helpful was this?</DialogTitle>
            <DialogDescription>
              Your feedback helps us improve our AI features
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
                  Helpful
                </Button>
                <Button
                  variant={selectedRating === "somewhat_helpful" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedRating("somewhat_helpful")}
                  className="flex-1"
                >
                  <Meh className="w-5 h-5 mr-2" />
                  Okay
                </Button>
                <Button
                  variant={selectedRating === "not_helpful" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedRating("not_helpful")}
                  className="flex-1"
                >
                  <ThumbsDown className="w-5 h-5 mr-2" />
                  Not Helpful
                </Button>
              </div>

              <Textarea
                placeholder="Any additional comments? (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />

              <Button onClick={handleSubmit} className="w-full" disabled={!selectedRating}>
                Submit Feedback
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg font-medium text-green-600">Thank you! 🎉</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <p className="text-sm font-medium mb-3">Was this helpful?</p>
      <div className="flex gap-2">
        <Button
          variant={selectedRating === "helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRating("helpful")}
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Yes
        </Button>
        <Button
          variant={selectedRating === "somewhat_helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRating("somewhat_helpful")}
        >
          <Meh className="w-4 h-4 mr-1" />
          Somewhat
        </Button>
        <Button
          variant={selectedRating === "not_helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedRating("not_helpful")}
        >
          <ThumbsDown className="w-4 h-4 mr-1" />
          No
        </Button>
      </div>
      
      {selectedRating && !submitted && (
        <div className="mt-3 space-y-2">
          <Textarea
            placeholder="Tell us more (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="text-sm"
          />
          <Button onClick={handleSubmit} size="sm" className="w-full">
            Submit
          </Button>
        </div>
      )}
      
      {submitted && (
        <p className="text-sm text-green-600 mt-2">✓ Thank you for your feedback!</p>
      )}
    </div>
  );
}
