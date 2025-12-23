import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const apiAny = api as any;
import { Id } from "@/convex/_generated/dataModel";
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, Building2, ArrowLeft, Search, FileText, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { KeywordSniperPanel } from "./mission/KeywordSniperPanel";

interface ProjectBoardProps {
  projectId: Id<"projects">;
  onBack?: () => void;
  onGenerateCoverLetter?: (applicationId: string) => void;
  initialApplicationId?: string | null;
}

const COLUMNS = [
  { id: "draft", title: "Draft", color: "bg-zinc-500" },
  { id: "applied", title: "Applied", color: "bg-blue-500" },
  { id: "interviewing", title: "Interviewing", color: "bg-yellow-500" },
  { id: "accepted", title: "Offer", color: "bg-green-500" },
  { id: "rejected", title: "Rejected", color: "bg-red-500" },
];

export function ProjectBoard({ projectId, onBack, onGenerateCoverLetter, initialApplicationId }: ProjectBoardProps) {
  const applications = useQuery(api.applications.getApplicationsByProject, { projectId });
  const updateStatus = useMutation(api.applications.updateApplicationStatus);
  const analyzeApplicationKeywords = useMutation(apiAny.applications.analyzeApplicationKeywords);
  const resumes = useQuery(apiAny.resumes.getResumes, {});
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  // Handle initial application selection (Deep Linking)
  useState(() => {
    if (initialApplicationId && applications && resumes && !selectedApplication) {
      const app = applications.find((a: any) => a._id === initialApplicationId);
      if (app) {
        const projectResumes = resumes?.filter((r: any) => r.projectId === projectId);
        const masterResume = projectResumes?.[0];
        
        setSelectedApplication({
          _id: app._id,
          jobTitle: app.jobTitle,
          company: app.companyName,
          score: app.matchScore || 0,
          missingKeywords: app.missingKeywords || [],
          matchedKeywords: app.matchedKeywords || [],
          resumeText: masterResume?.ocrText || "",
          jobDescriptionText: app.jobDescriptionText || "",
          status: app.status,
        });
      }
    }
  });

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    try {
      await updateStatus({
        applicationId: draggableId as Id<"applications">,
        status: newStatus as any,
      });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!applications) return null;

  const hasApplications = applications.length > 0;

  return (
    <>
      <div className="h-full flex flex-col">
      {onBack && (
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-zinc-400 hover:text-white pl-0 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Button>
        </div>
      )}

      {!hasApplications && !selectedApplication ? (
        // Empty State
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border border-primary/30">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Start Tracking Applications</h3>
              <p className="text-slate-400 text-sm">
                Add your first job application to this project and track it through the interview process.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-black font-semibold gap-2"
              >
                <Plus className="h-5 w-5" />
                Add First Application
              </Button>
              <p className="text-xs text-slate-500">
                Track company, role, status, and match score all in one place
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Existing Kanban Board
        <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map((column) => (
              <div key={column.id} className="w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <h3 className="font-bold text-sm text-zinc-300">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-400">
                      {applications.filter((app: any) => app.status === column.id).length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex-1 bg-zinc-900/30 rounded-xl p-2 flex flex-col gap-3 min-h-[150px]"
                    >
                      {applications
                        .filter((app: any) => app.status === column.id)
                        .map((app: any, index: number) => (
                          <Draggable key={app._id} draggableId={app._id} index={index}>
                            {(provided: DraggableProvided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700 transition-colors cursor-grab active:cursor-grabbing group"
                              >
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
                                  
                                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(app._creationTime).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-zinc-800"
                                              onClick={async (e) => {
                                                e.stopPropagation();
                                                
                                                // Get the project's master resume
                                                const projectResumes = resumes?.filter((r: any) => r.projectId === projectId);
                                                const masterResume = projectResumes?.[0];
                                                
                                                // If we have a resume, analyze the application first
                                                if (masterResume) {
                                                  try {
                                                    await analyzeApplicationKeywords({
                                                      applicationId: app._id,
                                                      resumeId: masterResume._id,
                                                    });
                                                    
                                                    // Wait a moment for the mutation to complete and data to refresh
                                                    await new Promise(resolve => setTimeout(resolve, 500));
                                                  } catch (error) {
                                                    console.error("Failed to analyze application:", error);
                                                    toast.error("Failed to analyze application");
                                                  }
                                                }
                                                
                                                // Get the updated application data from the applications array
                                                // The useQuery hook will have refreshed with the new data
                                                const updatedApp = applications.find((a: any) => a._id === app._id);
                                                
                                                setSelectedApplication({
                                                  _id: app._id,
                                                  jobTitle: app.jobTitle,
                                                  company: app.companyName,
                                                  score: updatedApp?.matchScore || app.matchScore || 0,
                                                  missingKeywords: updatedApp?.missingKeywords || app.missingKeywords || [],
                                                  matchedKeywords: updatedApp?.matchedKeywords || app.matchedKeywords || [],
                                                  resumeText: masterResume?.ocrText || "",
                                                  jobDescriptionText: app.jobDescriptionText || "",
                                                  status: app.status,
                                                });
                                              }}
                                            >
                                              <FileText className="h-3 w-3" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>View Details</p>
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
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
      )}
    </div>

    <KeywordSniperPanel 
      open={!!selectedApplication} 
      onOpenChange={(open) => !open && setSelectedApplication(null)} 
      job={selectedApplication} 
      onGenerateCoverLetter={onGenerateCoverLetter || (() => {})}
    />
    </>
  );
}