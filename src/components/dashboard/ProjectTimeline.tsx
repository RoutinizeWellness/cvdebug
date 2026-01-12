import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Send, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineEvent {
  type: string;
  title: string;
  description?: string;
  timestamp: number;
}

interface ProjectTimelineProps {
  events: TimelineEvent[];
  applicationTitle: string;
  companyName: string;
}

export function ProjectTimeline({ events, applicationTitle, companyName }: ProjectTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "created":
        return <FileText className="h-4 w-4" />;
      case "status_change":
        return <CheckCircle2 className="h-4 w-4" />;
      case "dm_sent":
        return <Send className="h-4 w-4" />;
      case "interview_scheduled":
        return <Calendar className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "created":
        return "text-blue-400 bg-blue-500/10";
      case "status_change":
        return "text-green-400 bg-green-500/10";
      case "dm_sent":
        return "text-teal-400 bg-teal-500/10";
      case "interview_scheduled":
        return "text-yellow-400 bg-yellow-500/10";
      case "rejected":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-zinc-400 bg-zinc-500/10";
    }
  };

  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="bg-[#0A0A0A] border-zinc-800">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Application Timeline
        </CardTitle>
        <p className="text-sm text-zinc-400">
          {applicationTitle} @ {companyName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No events yet</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-zinc-800" />
              
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-10 pb-6 last:pb-0"
                >
                  {/* Event icon */}
                  <div className={`absolute left-0 w-8 h-8 rounded-full ${getEventColor(event.type)} flex items-center justify-center border-2 border-zinc-900`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Event content */}
                  <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/50">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-white">{event.title}</h4>
                      <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-800">
                        {new Date(event.timestamp).toLocaleDateString('es-ES')}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed">{event.description}</p>
                    )}
                    <p className="text-[10px] text-zinc-600 mt-2">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}