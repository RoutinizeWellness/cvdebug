import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const apiAny = api as any;
import { Id } from "@/convex/_generated/dataModel";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { KeywordSniperPanel } from "./mission/KeywordSniperPanel";
import { CreateApplicationDialog } from "./CreateApplicationDialog";
import { RecruiterDMGenerator } from "./tools/RecruiterDMGenerator";
import { ProjectTimeline } from "./ProjectTimeline";
import { InterviewPrepMode } from "./InterviewPrepMode";
import { BoardEmptyState } from "./board/BoardEmptyState";
import { BoardColumn } from "./board/BoardColumn";

interface ProjectBoardProps {
  projectId: Id<"projects">;
  onBack?: () => void;
  onGenerateCoverLetter?: (applicationId: string) => void;
  initialApplicationId?: string | null;
  onUpgrade?: () => void;
}

const COLUMNS = [
  { id: "draft", title: "Draft", color: "bg-zinc-500" },
  { id: "applied", title: "Applied", color: "bg-[#3B82F6]" },
  { id: "interviewing", title: "Interviewing", color: "bg-yellow-500" },
  { id: "accepted", title: "Offer", color: "bg-[#22C55E]" },
  { id: "rejected", title: "Rejected", color: "bg-[#EF4444]" },
];

export function ProjectBoard({ projectId, onBack, onGenerateCoverLetter, initialApplicationId, onUpgrade }: ProjectBoardProps) {
  const applications = useQuery(api.applications.getApplicationsByProject, { projectId });
  const updateStatus = useMutation(api.applications.updateApplicationStatus);
  const analyzeApplicationKeywords = useMutation(apiAny.applications.analyzeApplicationKeywords);
  const resumes = useQuery(apiAny.resumes.getResumes, {});
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDMGenerator, setShowDMGenerator] = useState(false);
  const [selectedAppForDM, setSelectedAppForDM] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);

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

  const handleViewDetails = async (app: any) => {
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
    const updatedApp = applications?.find((a: any) => a._id === app._id);
    const targetApp = updatedApp || app;
    
    setSelectedApplication({
      _id: targetApp._id,
      jobTitle: targetApp.jobTitle,
      company: targetApp.companyName,
      score: targetApp.matchScore || 0,
      missingKeywords: targetApp.missingKeywords || [],
      matchedKeywords: targetApp.matchedKeywords || [],
      resumeText: masterResume?.ocrText || "",
      jobDescriptionText: targetApp.jobDescriptionText || "",
      status: targetApp.status,
    });
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
            className="text-zinc-400 hover:text-[#0F172A] pl-0 gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Button>
        </div>
      )}

      {!hasApplications && !selectedApplication ? (
        <BoardEmptyState onCreateClick={() => setShowCreateDialog(true)} />
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                applications={applications.filter((app: any) => app.status === column.id)}
                onAddClick={() => setShowCreateDialog(true)}
                onViewTimeline={(app) => {
                  setSelectedApplication(app);
                  setShowTimeline(true);
                }}
                onRecruiterDM={(appId) => {
                  setSelectedAppForDM(appId);
                  setShowDMGenerator(true);
                }}
                onInterviewPrep={(app) => {
                  setSelectedApplication(app);
                  setShowInterviewPrep(true);
                }}
                onViewDetails={handleViewDetails}
                onGenerateCoverLetter={onGenerateCoverLetter}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
      )}
    </div>

    <KeywordSniperPanel 
      open={!!selectedApplication && !showTimeline && !showInterviewPrep} 
      onOpenChange={(open) => !open && setSelectedApplication(null)} 
      job={selectedApplication} 
      onGenerateCoverLetter={onGenerateCoverLetter || (() => {})}
    />
    
    {/* Timeline Dialog */}
    {showTimeline && selectedApplication && (
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="sm:max-w-[600px] bg-[#0A0A0A] border-zinc-800 text-zinc-200">
          <ProjectTimeline 
            events={selectedApplication.events || []}
            applicationTitle={selectedApplication.jobTitle}
            companyName={selectedApplication.company || selectedApplication.companyName}
          />
        </DialogContent>
      </Dialog>
    )}

    {/* Interview Prep Dialog */}
    {showInterviewPrep && selectedApplication && (
      <Dialog open={showInterviewPrep} onOpenChange={setShowInterviewPrep}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-[#0A0A0A] border-zinc-800 text-zinc-200">
          <InterviewPrepMode 
            applicationId={selectedApplication._id}
            jobTitle={selectedApplication.jobTitle}
            company={selectedApplication.company || selectedApplication.companyName}
            jobDescription={selectedApplication.jobDescriptionText || ""}
            resumeText={selectedApplication.resumeText || ""}
            missingKeywords={selectedApplication.missingKeywords || []}
          />
        </DialogContent>
      </Dialog>
    )}
    
      <CreateApplicationDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
        projectId={projectId}
        onUpgrade={onUpgrade}
      />

    <RecruiterDMGenerator 
      open={showDMGenerator} 
      onOpenChange={setShowDMGenerator}
    />
    </>
  );
}