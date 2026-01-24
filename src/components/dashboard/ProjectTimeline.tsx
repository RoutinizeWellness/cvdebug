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
        return "text-[#64748B] bg-[#64748B]/10";
      case "status_change":
        return "text-[#22C55E] bg-[#22C55E]/10";
      case "dm_sent":
        return "text-[#1E293B] bg-[#1E293B]/10";
      case "interview_scheduled":
        return "text-[#F59E0B] bg-[#F59E0B]/10";
      case "rejected":
        return "text-[#EF4444] bg-[#EF4444]/10";
      default:
        return "text-[#64748B] bg-[#64748B]/10";
    }
  };

  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="bg-[#FFFFFF] border-[#E2E8F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#1E293B]" />
          Application Timeline
        </CardTitle>
        <p className="text-sm text-[#64748B]">
          {applicationTitle} @ {companyName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-[#64748B]">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No events yet</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[#E2E8F0]" />

              {sortedEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-10 pb-6 last:pb-0"
                >
                  {/* Event icon */}
                  <div className={`absolute left-0 w-8 h-8 rounded-full ${getEventColor(event.type)} flex items-center justify-center border-2 border-[#FFFFFF]`}>
                    {getEventIcon(event.type)}
                  </div>

                  {/* Event content */}
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-[#0F172A]">{event.title}</h4>
                      <Badge variant="outline" className="text-[10px] text-[#64748B] border-[#E2E8F0]">
                        {new Date(event.timestamp).toLocaleDateString('es-ES')}
                      </Badge>
                    </div>
                    {event.description && (
                      <p className="text-xs text-[#64748B] leading-relaxed">{event.description}</p>
                    )}
                    <p className="text-[10px] text-[#64748B] mt-2">
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
