import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckCircle2, FileText, Mail, Sparkles, Target } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectTimelineProps {
  projectId: Id<"projects">;
}

const apiAny = api as any;

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const timeline = useQuery(apiAny.projects.getProjectTimeline, { projectId });

  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p className="text-sm">No activity yet. Start by uploading a resume!</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "resume_uploaded": return FileText;
      case "resume_analyzed": return Sparkles;
      case "cover_letter_generated": return Mail;
      case "application_created": return Target;
      default: return CheckCircle2;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "resume_uploaded": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "resume_analyzed": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "cover_letter_generated": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "application_created": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">timeline</span>
        Activity Timeline
      </h3>
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800"></div>
        <div className="space-y-6">
          {timeline.map((event: any, idx: number) => {
            const Icon = getIcon(event.type);
            const colorClass = getColor(event.type);
            
            return (
              <motion.div
                key={event._id}
                className="relative flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`relative z-10 p-2 rounded-lg border ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-white">{event.title}</h4>
                    <span className="text-xs text-slate-500 font-mono">
                      Day {event.dayNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{event.description}</p>
                  <span className="text-[10px] text-slate-600 mt-1 block">
                    {new Date(event.timestamp).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
