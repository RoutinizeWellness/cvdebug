import { Draggable, DraggableProvided } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FileText, 
  Ghost,
  MessageSquare,
  BrainCircuit,
  History,
  Search,
  Clock
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApplicationCardProps {
  app: any;
  index: number;
  isGhosted: boolean;
  onViewTimeline: (app: any) => void;
  onRecruiterDM: (appId: string) => void;
  onInterviewPrep: (app: any) => void;
  onViewDetails: (app: any) => void;
  onGenerateCoverLetter?: (applicationId: string) => void;
}

export function ApplicationCard({
  app,
  index,
  isGhosted,
  onViewTimeline,
  onRecruiterDM,
  onInterviewPrep,
  onViewDetails,
  onGenerateCoverLetter
}: ApplicationCardProps) {
  return (
    <Draggable draggableId={app._id} index={index}>
      {(provided: DraggableProvided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#F3E8FF] transition-all cursor-grab active:cursor-grabbing group relative shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] ${
            isGhosted ? "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : ""
          }`}
        >
          {isGhosted && (
            <div className="absolute -top-2 -right-2 z-10 animate-pulse">
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 h-5 flex items-center gap-1">
                <Ghost className="h-3 w-3" />
                Ghosted?
              </Badge>
            </div>
          )}
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#0F172A] leading-tight">{app.jobTitle}</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Building2 className="h-3 w-3" />
                  {app.companyName}
                </div>
              </div>
              {app.matchScore > 0 && (
                <Badge className={`${
                  app.matchScore >= 80 ? "bg-[#22C55E]/10 text-[#22C55E]" :
                  app.matchScore >= 50 ? "bg-yellow-500/10 text-[#F59E0B]" :
                  "bg-[#EF4444]/10 text-[#EF4444]"
                } border-0`}>
                  {app.matchScore}%
                </Badge>
              )}
            </div>
            
            {/* Timeline Preview */}
            {app.events && app.events.length > 0 && (
              <div className="text-[10px] text-[#64748B] flex items-center gap-1.5 bg-[#F8FAFC] p-1.5 rounded border border-[#E2E8F0]">
                <History className="h-3 w-3" />
                <span className="truncate max-w-[200px]">
                  {app.events[app.events.length - 1].title}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                <Clock className="h-3 w-3" />
                {new Date(app.lastStatusUpdate || app._creationTime).toLocaleDateString('es-ES')}
              </div>
              <div className="flex gap-1">
                {/* Timeline Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#64748B] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewTimeline(app);
                        }}
                      >
                        <History className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Timeline</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Recruiter DM Button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${isGhosted ? "text-red-400 hover:text-red-300 hover:bg-[#EF4444]/10" : "text-[#64748B] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecruiterDM(app._id);
                        }}
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isGhosted ? "Send Follow-up DM" : "Generate Recruiter DM"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Interview Prep Trigger */}
                {app.status === "interviewing" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-[#64748B] hover:text-teal-400 hover:bg-teal-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInterviewPrep(app);
                          }}
                        >
                          <BrainCircuit className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Interview Prep</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(app);
                        }}
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Details & Keywords</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {onGenerateCoverLetter && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-[#64748B] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onGenerateCoverLetter(app._id);
                          }}
                        >
                          <Search className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate Cover Letter</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}