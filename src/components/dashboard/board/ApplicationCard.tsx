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
          className={`bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing group relative ${
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
                <h4 className="font-bold text-sm text-white leading-tight">{app.jobTitle}</h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Building2 className="h-3 w-3" />
                  {app.companyName}
                </div>
              </div>
              {app.matchScore > 0 && (
                <Badge className={`${
                  app.matchScore >= 80 ? "bg-green-500/10 text-green-500" :
                  app.matchScore >= 50 ? "bg-yellow-500/10 text-yellow-500" :
                  "bg-red-500/10 text-red-500"
                } border-0`}>
                  {app.matchScore}%
                </Badge>
              )}
            </div>
            
            {/* Timeline Preview */}
            {app.events && app.events.length > 0 && (
              <div className="text-[10px] text-zinc-500 flex items-center gap-1.5 bg-zinc-900/50 p-1.5 rounded border border-zinc-800/50">
                <History className="h-3 w-3" />
                <span className="truncate max-w-[200px]">
                  {app.events[app.events.length - 1].title}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
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
                        className="h-6 w-6 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10"
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
                        className={`h-6 w-6 ${isGhosted ? "text-red-400 hover:text-red-300 hover:bg-red-500/10" : "text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10"}`}
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
                          className="h-6 w-6 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10"
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
                        className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-zinc-800"
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
                          className="h-6 w-6 text-zinc-500 hover:text-primary hover:bg-primary/10"
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